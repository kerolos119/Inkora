package com.programmershub.medad.services;

import com.mongodb.client.result.UpdateResult;
import com.programmershub.medad.document.Book;
import com.programmershub.medad.document.Cart;
import com.programmershub.medad.document.Order;
import com.programmershub.medad.document.Users;
import com.programmershub.medad.dto.OrderDto;
import com.programmershub.medad.exception.CustomException;
import com.programmershub.medad.exception.ExceptionMessage;
import com.programmershub.medad.mapper.OrderMapper;
import com.programmershub.medad.model.CartItem;
import com.programmershub.medad.model.EmailMessages;
import com.programmershub.medad.model.OrderItem;
import com.programmershub.medad.model.OrderStatus;
import com.programmershub.medad.repository.BookRepository;
import com.programmershub.medad.repository.CartRepository;
import com.programmershub.medad.repository.OrderRepository;
import com.programmershub.medad.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CheckoutService {

    private final CartRepository cartRepo;
    private final OrderRepository orderRepo;
    private final OrderMapper orderMapper;
    private final CartService cartService;
    private final EmailServices emailServices;
    private final EmailMessages emailMessages;
    private final UserRepository userRepo;
    private final BookRepository bookRepo;
    private final MongoTemplate template;

    public OrderDto checkout() {
        String userId = getUserId();

        // Refresh prices and stock quantities before processing
        cartService.getCart();
        Cart cart = cartRepo.findByUserId(userId)
                .orElseThrow(() -> new CustomException(ExceptionMessage.CART_NOT_FOUND));

        if (cart.getCartItems().isEmpty()) {
            throw new CustomException(ExceptionMessage.CART_EMPTY);
        }

        // Reject checkout if any item is out of stock (quantity was zeroed during refresh)
        boolean hasOutOfStockItem = cart.getCartItems().stream()
                .anyMatch(i -> i.getQuantity() == 0);
        if (hasOutOfStockItem) {
            throw new CustomException(ExceptionMessage.STOCK_EXCEEDED, HttpStatus.CONFLICT);
        }

        // Pre-validate stock for every item before touching orders or stock counters.
        // This is an optimistic read — the atomic decrement below is the true guard.
        for (CartItem item : cart.getCartItems()) {
            Book book = bookRepo.findById(item.getBookId())
                    .orElseThrow(() -> new CustomException(ExceptionMessage.BOOK_NOT_FOUND));
            if (book.getStock() < item.getQuantity()) {
                throw new CustomException(ExceptionMessage.STOCK_EXCEEDED, HttpStatus.CONFLICT);
            }
        }

        // Persist the order first so we have an ID before touching stock.
        // If the stock decrement subsequently fails we delete the order and
        // re-increment any already-decremented books (compensating transaction).
        Order order = buildOrder(userId, cart);
        Order savedOrder = orderRepo.save(order);

        // Atomically decrement stock for every item.
        // The Criteria checks stock >= quantity so the update only applies when
        // there is enough stock — preventing overselling even under concurrent requests.
        List<CartItem> decremented = new ArrayList<>();
        try {
            for (CartItem item : cart.getCartItems()) {
                Query query = new Query(
                        Criteria.where("_id").is(new ObjectId(item.getBookId()))
                                .and("stock").gte(item.getQuantity())
                );
                Update update = new Update().inc("stock", -item.getQuantity());
                UpdateResult result = template.updateFirst(query, update, Book.class);

                if (result.getMatchedCount() == 0) {
                    // Stock was insufficient — compensate and abort
                    rollbackStock(decremented);
                    orderRepo.delete(savedOrder);
                    throw new CustomException(ExceptionMessage.STOCK_EXCEEDED, HttpStatus.CONFLICT);
                }
                decremented.add(item);
            }
        } catch (CustomException e) {
            throw e;
        } catch (Exception e) {
            // Unexpected error — still compensate to keep stock consistent
            rollbackStock(decremented);
            orderRepo.delete(savedOrder);
            throw e;
        }

        cart.getCartItems().clear();
        try {
            cartRepo.save(cart);
        } catch (OptimisticLockingFailureException e) {
            Cart freshCart = cartRepo.findByUserId(userId).orElse(null);
            if (freshCart != null) {
                freshCart.getCartItems().clear();
                cartRepo.save(freshCart);
            }
        }

        Users user = userRepo.findById(userId).orElse(null);
        if (user != null) {
            emailServices.sendHtmlMail(user.getEmail(),
                    emailMessages.orderConfirmation(
                            user.getUsername(),
                            savedOrder.getId(),
                            savedOrder.getOrderItems(),
                            savedOrder.getTotalAmount()
                    )
            );
        }

        return orderMapper.toDto(savedOrder);
    }

    private Order buildOrder(String userId, Cart cart) {
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderItems(cart.getCartItems().stream()
                .map(i -> OrderItem.builder()
                        .bookId(i.getBookId())
                        .bookTitle(i.getBookTitle())
                        .quantity(i.getQuantity())
                        .price(i.getPrice())
                        .build())
                .toList());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderedAt(Instant.now());
        order.setTotalAmount(cart.calculateTotalPrice());
        return order;
    }

    /**
     * Re-increment stock for every item that was already decremented before a failure,
     * restoring the inventory to its pre-checkout state.
     */
    private void rollbackStock(List<CartItem> decremented) {
        for (CartItem item : decremented) {
            template.updateFirst(
                    Query.query(Criteria.where("_id").is(new ObjectId(item.getBookId()))),
                    new Update().inc("stock", item.getQuantity()),
                    Book.class
            );
        }
    }

    private String getUserId() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal()
                .toString();
    }
}

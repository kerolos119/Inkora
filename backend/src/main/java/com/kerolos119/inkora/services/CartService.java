package com.kerolos119.inkora.services;


import com.kerolos119.inkora.document.Book;
import com.kerolos119.inkora.document.Cart;
import com.kerolos119.inkora.dto.CartDto;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.mapper.CartMapper;
import com.kerolos119.inkora.model.CartItem;
import com.kerolos119.inkora.repository.BookRepository;
import com.kerolos119.inkora.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository repo;
    private final CartMapper mapper;
    private final BookRepository bookRepo;

    public CartDto update(CartDto cartDto) {
        String userId = getUserId();

        // Validate stock for every incoming item before touching the cart
        if (cartDto.getCartItems() != null) {
            for (CartItem item : cartDto.getCartItems()) {
                Book book = bookRepo.findById(item.getBookId())
                        .orElseThrow(() -> new CustomException(ExceptionMessage.BOOK_NOT_FOUND));
                if (item.getQuantity() > book.getStock()) {
                    throw new CustomException(ExceptionMessage.STOCK_EXCEEDED, HttpStatus.CONFLICT);
                }
            }
        }

        Cart cart = repo.findByUserId(userId).orElse(initializeNewCart(userId));
        cart.setCartItems(cartDto.getCartItems());
        refresh(cart);

        try {
            return mapper.toDto(repo.save(cart));
        } catch (OptimisticLockingFailureException e) {
            Cart fresh = repo.findByUserId(userId).orElse(initializeNewCart(userId));
            fresh.setCartItems(cartDto.getCartItems());
            refresh(fresh);
            return mapper.toDto(repo.save(fresh));
        }
    }

    public CartDto getCart() {
        String userId = getUserId();

        Optional<Cart> cart = repo.findByUserId(userId);

        if (cart.isPresent()){
            refresh(cart.get());
            try {
                return mapper.toDto(repo.save(cart.get()));
            } catch (OptimisticLockingFailureException e) {
                Cart fresh = repo.findByUserId(userId).orElseGet(() -> initializeNewCart(userId));
                refresh(fresh);
                return mapper.toDto(repo.save(fresh));
            }
        }

        return mapper.toDto(repo.save(initializeNewCart(userId)));
    }

    public CartDto removeItem(String bookId){

        String userId = getUserId();

        Cart cart = repo.findByUserId(userId).orElseGet(() -> initializeNewCart(userId));
        cart.getCartItems().removeIf(i -> i.getBookId().equals(bookId));

        try {
            return mapper.toDto(repo.save(cart));
        } catch (OptimisticLockingFailureException e) {
            Cart fresh = repo.findByUserId(userId).orElseGet(() -> initializeNewCart(userId));
            fresh.getCartItems().removeIf(i -> i.getBookId().equals(bookId));
            return mapper.toDto(repo.save(fresh));
        }
    }

    public void clearCart(){
        String userId = getUserId();

        Cart cart = repo.findByUserId(userId).orElseGet(() -> initializeNewCart(userId));
        cart.getCartItems().clear();

        try {
            repo.save(cart);
        } catch (OptimisticLockingFailureException e) {
            Cart fresh = repo.findByUserId(userId).orElseGet(() -> initializeNewCart(userId));
            fresh.getCartItems().clear();
            repo.save(fresh);
        }
    }

    private String getUserId(){
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal()
                .toString();
    }

    private Cart initializeNewCart(String userId) {
        Cart cart = new Cart();
        cart.setUserId(userId);
        return cart;
    }

    private void refresh(Cart cart){
        Iterator<CartItem> itemIterator = cart.getCartItems().iterator();

        while (itemIterator.hasNext()){

            CartItem item = itemIterator.next();
            Book book = bookRepo.findById(item.getBookId()).orElse(null);

            // Book was deleted entirely — remove it from the cart
            if (book == null){
                itemIterator.remove();
                continue;
            }

            // Book is out of stock — keep the item so the frontend can warn the user,
            // but zero out the quantity so checkout is blocked
            if (book.getStock() == 0){
                item.setQuantity(0);
                item.setPrice(book.getPrice());
                continue;
            }

            // Cap quantity at current available stock (e.g. stock dropped since last visit)
            if (item.getQuantity() > book.getStock()){
                item.setQuantity(book.getStock());
            }

            item.setPrice(book.getPrice());
            item.setBookId(book.getId());
        }
    }

}

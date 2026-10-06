package com.kerolos119.inkora.services;

import com.kerolos119.inkora.document.Order;
import com.kerolos119.inkora.dto.OrderDto;
import com.kerolos119.inkora.exception.CustomException;
import com.kerolos119.inkora.exception.ExceptionMessage;
import com.kerolos119.inkora.mapper.OrderMapper;
import com.kerolos119.inkora.model.OrderStatus;
import com.kerolos119.inkora.repository.OrderRepository;
import com.kerolos119.inkora.dto.Filter;
import com.kerolos119.inkora.dto.PageResult;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderServices {

    private final OrderRepository repo;
    private final OrderMapper mapper;

    public OrderDto updateOrder(String id, @Valid OrderDto dto) {
        String userId = getUserId();

        Order order = repo.findById(id)
                .orElseThrow(() -> new CustomException(ExceptionMessage.ORDER_NOT_FOUND));

        if (!order.getUserId().equals(userId)) {
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new CustomException(ExceptionMessage.ORDER_NOT_EDITABLE, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        order.setOrderItems(dto.getItems());
        try {
            return mapper.toDto(repo.save(order));
        } catch (OptimisticLockingFailureException e) {
            Order fresh = repo.findById(id)
                    .orElseThrow(() -> new CustomException(ExceptionMessage.ORDER_NOT_FOUND));
            if (fresh.getStatus() != OrderStatus.PENDING) {
                throw new CustomException(ExceptionMessage.ORDER_NOT_EDITABLE, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            fresh.setOrderItems(dto.getItems());
            return mapper.toDto(repo.save(fresh));
        }
    }

    public OrderDto cancelOrder(String id) {
        String userId = getUserId();

        Order order = repo.findById(id)
                .orElseThrow(() -> new CustomException(ExceptionMessage.ORDER_NOT_FOUND));

        if (!order.getUserId().equals(userId)) {
            throw new CustomException(ExceptionMessage.FORBIDDEN, HttpStatus.FORBIDDEN);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new CustomException(ExceptionMessage.ORDER_NOT_EDITABLE, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        order.setStatus(OrderStatus.CANCELLED);
        return mapper.toDto(repo.save(order));
    }

    public PageResult<OrderDto> getMyOrders(Filter filter) {
        String userId = getUserId();
        Page<Order> page = repo.findByUserId(userId, filter.pageable());
        return new PageResult<>(
                page.getContent().stream().map(mapper::toDto).toList(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    public PageResult<OrderDto> getAllOrders(Filter filter) {
        Page<Order> page = repo.findAll(filter.pageable());
        return new PageResult<>(
                page.getContent().stream().map(mapper::toDto).toList(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }

    public OrderDto updatedStatus(String id, OrderStatus status) {
        Order order = repo.findById(id)
                .orElseThrow(() -> new CustomException(ExceptionMessage.ORDER_NOT_FOUND));

        order.setStatus(status);
        return mapper.toDto(repo.save(order));
    }

    private String getUserId() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal()
                .toString();
    }
}

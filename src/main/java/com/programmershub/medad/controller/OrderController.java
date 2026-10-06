package com.programmershub.medad.controller;

import com.programmershub.medad.dto.Filter;
import com.programmershub.medad.dto.OrderDto;
import com.programmershub.medad.dto.PageResult;
import com.programmershub.medad.model.OrderStatus;
import com.programmershub.medad.services.OrderServices;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderServices services;

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER')")
    public OrderDto updatedOrder(@PathVariable String id, @Valid @RequestBody OrderDto dto){
        return services.updateOrder(id, dto);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public OrderDto updatedStatus(@PathVariable String id, @RequestParam OrderStatus status){
        return services.updatedStatus(id, status);
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public PageResult<OrderDto> getMyOrders(@ModelAttribute Filter filter) {
        return services.getMyOrders(filter);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PageResult<OrderDto> getAllOrders(@ModelAttribute Filter filter) {
        return services.getAllOrders(filter);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER')")
    public OrderDto cancelOrder(@PathVariable String id) {
        return services.cancelOrder(id);
    }

}

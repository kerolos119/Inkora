package com.programmershub.medad.controller;

import com.programmershub.medad.dto.OrderDto;
import com.programmershub.medad.services.CheckoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public OrderDto checkout() {
        return checkoutService.checkout();
    }

}

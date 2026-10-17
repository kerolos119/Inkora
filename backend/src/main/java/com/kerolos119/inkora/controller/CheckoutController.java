package com.kerolos119.inkora.controller;

import com.kerolos119.inkora.dto.OrderDto;
import com.kerolos119.inkora.services.CheckoutService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/checkout")
@RequiredArgsConstructor
@Slf4j
public class CheckoutController {

    private final CheckoutService checkoutService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public OrderDto checkout() {
        log.info("Checkout controller reached");
        return checkoutService.checkout();
    }

}

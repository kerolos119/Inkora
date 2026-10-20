package com.kerolos119.inkora.dto;

import com.kerolos119.inkora.model.Role;

import java.math.BigDecimal;
import java.time.Instant;

public record CustomerDto(
        String id,
        String username,
        String email,
        String phoneNumber,
        String address,
        Role role,
        long ordersCount,
        BigDecimal totalSpent,
        Instant lastOrderDate,
        String status
) {
}

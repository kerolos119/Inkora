package com.kerolos119.inkora.dto;

import org.springframework.http.HttpStatus;

import java.time.Instant;

public record ErrorResponse(
        String message,
        HttpStatus status,
        Instant timestamp
) {
}

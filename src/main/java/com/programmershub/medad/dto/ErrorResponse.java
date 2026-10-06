package com.programmershub.medad.dto;

import org.springframework.http.HttpStatus;

import java.time.Instant;

public record ErrorResponse(
        String message,
        HttpStatus status,
        Instant timestamp
) {
}

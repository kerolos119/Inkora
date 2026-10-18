package com.kerolos119.inkora.dto;

public record ReviewSummaryDto(
    String bookId,
    double average,
    long count
) {}

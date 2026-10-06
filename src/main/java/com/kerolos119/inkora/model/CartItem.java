package com.kerolos119.inkora.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItem {

    private String bookId;

    private String bookTitle;

    @Min(value = 1, message = "quantity must be at least 1")
    @Max(value = 999, message = "quantity must be exceed 999")
    private Integer quantity;

    private BigDecimal price;

}

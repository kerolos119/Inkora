package com.kerolos119.inkora.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShippingSettingDto {

    @NotNull(message = "shipping fee is required")
    @DecimalMin(value = "0.00", message = "shipping fee cannot be negative")
    private BigDecimal fee;

    @DecimalMin(value = "0.00", message = "free shipping threshold cannot be negative")
    private BigDecimal freeShippingThreshold;
}

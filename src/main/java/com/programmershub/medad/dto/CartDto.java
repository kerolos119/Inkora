package com.programmershub.medad.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.programmershub.medad.model.CartItem;
import com.programmershub.medad.model.CartStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String userId;

    private List<CartItem> cartItems;

    @NotNull(message = "status is required")
    private CartStatus cartStatus;

}

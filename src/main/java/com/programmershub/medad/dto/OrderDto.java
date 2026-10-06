package com.programmershub.medad.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.programmershub.medad.model.OrderItem;
import com.programmershub.medad.model.OrderStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String id;

    @NotBlank(message = "shipping address is required")
    private String shippingAddress;

    @NotBlank(message = "shipping phone is required")
    private String shippingPhone;

    @Size(max = 5000, message = "note must not exceed 5000 character")
    private String note;

    @NotBlank(message = "payment method is required")
    private String paymentMethod;

    private String paymentReference;

    @NotEmpty(message = "order items are required")
    private List<OrderItem> items;

    @JsonProperty(access =  JsonProperty.Access.READ_ONLY)
    private String usersId;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private OrderStatus orderStatus;

}

package com.programmershub.medad.document;

import com.programmershub.medad.model.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Document
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
public class Order extends Auditable {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private OrderStatus status;

    private BigDecimal totalAmount;

    private ShippingDetails shippingDetails;

    private String note;

    @Indexed(unique = true, sparse = true)
    private String paymentReference;

    private PaymentMethod paymentMethod;

    @Indexed
    private Instant orderedAt;

    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();
}

package com.kerolos119.inkora.document;

import com.kerolos119.inkora.model.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

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

    @Indexed(unique = true, sparse = true)
    private String orderNumber;

    @Indexed
    private String userId;

    @Indexed
    private OrderStatus status;

    @Field(targetType = FieldType.DECIMAL128)
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

    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal subtotal;

    @Field(targetType = FieldType.DECIMAL128)
    private BigDecimal shippingFee;
}

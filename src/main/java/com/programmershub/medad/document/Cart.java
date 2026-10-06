package com.programmershub.medad.document;

import com.programmershub.medad.model.Auditable;
import com.programmershub.medad.model.CartItem;
import com.programmershub.medad.model.CartStatus;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Document
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
public class Cart extends Auditable {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    @Builder.Default
    private CartStatus status = CartStatus.ACTIVE;

    @Builder.Default
    private List<CartItem> cartItems = new ArrayList<>();

    public BigDecimal calculateTotalPrice(){
        return cartItems.stream()
                .map((i-> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()))))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

}

package com.kerolos119.inkora.document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;

@Document
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShippingSetting {

    public static final String SINGLETON_ID = "default";

    @Id
    private String id = SINGLETON_ID;

    private BigDecimal fee;

    private BigDecimal freeShippingThreshold;
}

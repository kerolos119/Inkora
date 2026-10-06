package com.kerolos119.inkora.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ShippingDetails {

    private String address;

    private String city;

    private String phoneNumber;

    private String name;

}

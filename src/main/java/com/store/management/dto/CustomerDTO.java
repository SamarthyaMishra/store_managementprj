package com.store.management.dto;

import java.math.BigInteger;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {
    private BigInteger customerId;
    private String customerCode;
    private String customerName;
    private String mobileNumber;
    private String address;
}
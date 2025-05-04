package com.store.management.dto;

import lombok.Data;

@Data
public class CustomerDTO {
    private Integer customerId;
    private String customerCode;
    private String customerName;
    private String mobileNumber;
    private String address;

    // Getters and Setters
}

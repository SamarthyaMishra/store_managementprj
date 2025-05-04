package com.store.management.dto;



import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SaleDTO {
    private Integer saleId;
    private Integer customerId;
    private LocalDateTime saleDate;
    private String paymentMode;  // Cash, Online
    private String saleType;     // Retail, Wholesale
    private BigDecimal grossTotal;

    // Getters and Setters
}


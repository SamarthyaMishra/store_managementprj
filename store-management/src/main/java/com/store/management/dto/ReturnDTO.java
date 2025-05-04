package com.store.management.dto;



import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReturnDTO {
    private Integer returnId;
    private Integer saleId;
    private LocalDateTime returnDate;
    private Integer customerId;
    private String returnType;
    private BigDecimal totalReturnAmount;

    // Getters and Setters
}


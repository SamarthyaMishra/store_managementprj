package com.store.management.dto;



import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProductStockLogDTO {
    private Integer logId;
    private Integer productId;
    private String transactionType; // ADD, SALE, RETURN
    private Integer referenceId;
    private BigDecimal quantityChange;
    private LocalDateTime logDate;

    // Getters and Setters
}


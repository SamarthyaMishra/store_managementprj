package com.store.management.dto;

import lombok.*;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductStockLogDTO {
    private BigInteger logId;
    private ProductDTO product;
    private String transactionType; // ADD / SALE / RETURN
    private BigInteger referenceId;
    private double quantityChange;
    private LocalDateTime logDate;
}

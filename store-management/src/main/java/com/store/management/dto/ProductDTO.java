package com.store.management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ProductDTO {
    private Integer productId;
    private String productCode;
    private String productName;
    private Integer unitId;
    private BigDecimal quantity;
    private BigDecimal buyingPrice;
    private BigDecimal sellingPriceRetail;
    private BigDecimal sellingPriceWholesale;
    private LocalDateTime createdAt;

    // Getters and Setters
}

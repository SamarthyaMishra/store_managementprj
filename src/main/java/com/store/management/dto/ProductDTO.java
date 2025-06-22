package com.store.management.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Integer productId;
    private String productCode;
    private String productName;
    private UnitsDTO unit;
    private BigDecimal quantity;
    private BigDecimal buyingPrice;
    private BigDecimal sellingPriceRetail;
    private BigDecimal sellingPriceWholesale;
    private LocalDateTime createdAt;
    // private BigDecimal availableStock;
}
package com.store.management.dto;


import java.math.BigDecimal;

import lombok.Data;

@Data
public class SaleItemDTO {
    private Integer itemId;
    private Integer saleId;
    private Integer productId;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;

    // Getters and Setters
}

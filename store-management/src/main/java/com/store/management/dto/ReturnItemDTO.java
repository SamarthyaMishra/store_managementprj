package com.store.management.dto;



import java.math.BigDecimal;

import lombok.Data;

@Data
public class ReturnItemDTO {
    private Integer returnItemId;
    private Integer returnId;
    private Integer productId;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;

    // Getters and Setters
}


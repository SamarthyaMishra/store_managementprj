package com.store.management.dto;

import java.math.BigDecimal;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItemDTO {
    private Integer saleItemId;
    private ProductDTO product;
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
}
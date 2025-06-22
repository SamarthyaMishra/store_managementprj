package com.store.management.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
@Builder
public class ReturnItemDTO {
    private Integer returnItemId;
    private ReturnsDTO returns;      // contains returnId
    private ProductDTO product;      // contains productId
    private BigDecimal quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
}


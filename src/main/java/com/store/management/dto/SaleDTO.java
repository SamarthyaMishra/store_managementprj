package com.store.management.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.store.management.model.Sale.PaymentMode;
import com.store.management.model.Sale.SaleType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleDTO {
    private Integer saleId;
    private CustomerDTO customer;
    private LocalDateTime saleDate;
    private PaymentMode paymentMode;
    private SaleType saleType;
    private BigDecimal grossTotal;
    private List<SaleItemDTO> items;
}

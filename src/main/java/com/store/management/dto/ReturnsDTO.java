package com.store.management.dto;

import lombok.*;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.type.SerializableType;

import com.store.management.model.Returns.ReturnsType;
import com.store.management.model.Sale.PaymentMode;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnsDTO implements Serializable { 
    private Integer returnId;
    private SaleDTO sale;
    private CustomerDTO customer;
    private LocalDateTime returnDate;
    private ReturnsType returnType; // Retail / Wholesale
    private PaymentMode paymentMode;
    private BigDecimal totalReturnAmount;
    private List<ReturnItemDTO> returnItems;
    private List<ProductDTO> products;
    
}


package com.store.management.model;
import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReturnItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer returnItemId;

    @ManyToOne
    @JoinColumn(name = "return_id")
    private Returns returns;  // updated to match DTO field name

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private BigDecimal quantity;

    private BigDecimal price;

    private BigDecimal totalPrice;
}
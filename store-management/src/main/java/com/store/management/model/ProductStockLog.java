package com.store.management.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductStockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
    name = "product_id",
    nullable = false)

    private Product product;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private Long referenceId;

    private BigDecimal quantityChange;

    private LocalDateTime logDate = LocalDateTime.now();

    public enum TransactionType {
        ADD, SALE, RETURN
    }
}

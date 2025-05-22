package com.store.management.model;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.CrossOrigin;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@Builder
public class ProductStockLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private BigInteger logId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    private BigInteger referenceId;

    private double quantityChange;

    private LocalDateTime logDate;

    public enum TransactionType {
        ADD, SALE, RETURN
    }
}


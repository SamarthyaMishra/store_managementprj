package com.store.management.model;
import jakarta.persistence.*; 
import lombok.*; 
import java.math.BigDecimal; 
import java.time.LocalDateTime; 
@Entity 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 

public class Product { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "product_id", columnDefinition = "INT")
    private Long productId; 
    @Column(unique = true, nullable = false) 
    private String productCode; 
    @Column(nullable = false) 
    private String productName; 
    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "unit_id", nullable = false) 
    private Unit unit; 
    private BigDecimal quantity; 
    private BigDecimal buyingPrice; 
    private BigDecimal sellingPriceRetail; 
    private BigDecimal sellingPriceWholesale; 
    private LocalDateTime createdAt = LocalDateTime.now();
}
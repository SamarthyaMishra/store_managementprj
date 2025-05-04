package com.store.management.model;
import jakarta.persistence.*; 
import lombok.*; 
import java.math.BigDecimal; 
import java.time.LocalDateTime; 
@Entity 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 

public class Sale { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "sale_id", columnDefinition = "INT")
    private Long saleId; 
    @ManyToOne 
    @JoinColumn(name = "customer_id", nullable = false) 
    private Customer customer; 
    private LocalDateTime saleDate = LocalDateTime.now(); 
    @Enumerated(EnumType.STRING) 
    @Column(nullable = false) 
    private PaymentMode paymentMode; 
    @Enumerated(EnumType.STRING) 
    @Column(nullable = false) 
    private SellingType saleType; 
    @Column(nullable = false) 
    private BigDecimal grossTotal; 
    public enum PaymentMode { Cash, Online }
    public enum SellingType { Retail, Wholesale}
}

package com.store.management.model;
import jakarta.persistence.*; 
import lombok.*; 
import java.math.BigDecimal; 
import java.time.LocalDateTime; 
@Entity 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
@Table(name = "Returns") 
public class Return { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "return_id", nullable = false , columnDefinition = "INT")
    private Long returnId; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id", nullable = false) 
    private Sale sale; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false ) 
    private Customer customer; 

    @Column (name = "return_date", nullable = false)
    private LocalDateTime returnDate = LocalDateTime.now(); 

    @Enumerated(EnumType.STRING) 
    @Column(name = "return_type", nullable = false)
    private Sale.SellingType returnType; 


    @Column(name = "total_return_amount", nullable = false)
    private BigDecimal totalReturnAmount;
}

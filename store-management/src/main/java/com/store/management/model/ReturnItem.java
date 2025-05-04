package com.store.management.model;
import jakarta.persistence.*; 
import lombok.*; 
import java.math.BigDecimal; 
@Entity 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 

public class ReturnItem { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    @Column(name = "return_item_id", nullable = false , columnDefinition = "INT")
    private Long returnItemId; 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "return_id", nullable = false)
    private Return returnTransaction; 

    @ManyToOne(fetch = FetchType.LAZY) 
    @JoinColumn(name = "product_id", nullable = false) 
    private Product product; 

    @Column(name = "quantity",nullable = false)
    private BigDecimal quantity; 
    
    @Column(name = "price",nullable = false)
    private BigDecimal price;
    
    @Column(name = "total_price",nullable = false) 
    private BigDecimal totalPrice;
}

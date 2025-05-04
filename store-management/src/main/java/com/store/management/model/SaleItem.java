package com.store.management.model;
import jakarta.persistence.*; 
import lombok.*; 
import java.math.BigDecimal; 
@Entity 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 

public class SaleItem { 
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long itemId; 
    @ManyToOne 
    @JoinColumn(name = "sale_id") 
    private Sale sale; 
    @ManyToOne 
    @JoinColumn(name = "product_id") 
    private Product product; 
    private BigDecimal quantity; 
    private BigDecimal price; 
    private BigDecimal totalPrice;
}
package com.store.management.model;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer productId;

    @Column(unique = true)
    private String productCode;

    private String productName;

    @ManyToOne
    @JoinColumn(name = "unit_id")
    private Units unit;
    

    private BigDecimal quantity;

    private BigDecimal buyingPrice;

    private BigDecimal sellingPriceRetail;

    private BigDecimal sellingPriceWholesale;

    private LocalDateTime createdAt;

    public Integer getProductId() {
        return productId;
    }
    
    public void setProductId(Integer productId) {
        this.productId = productId;
    }
    
    public String getProductCode() {
        return productCode;
    }
    
    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }
    
    public String getProductName() {
        return productName;
    }
    
    public void setProductName(String productName) {
        this.productName = productName;
    }
    
    public Units getUnit() {
        return unit;
    }
    
    public void setUnit(Units unit) {
        this.unit = unit;
    }
    
    public BigDecimal getQuantity() {
        return quantity;
    }
    
    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getBuyingPrice() {
        return buyingPrice;
    }
    
    public void setBuyingPrice(BigDecimal buyingPrice) {
        this.buyingPrice = buyingPrice;
    }
    
    public BigDecimal getSellingPriceRetail() {
        return sellingPriceRetail;
    }
    
    public void setSellingPriceRetail(BigDecimal sellingPriceRetail) {
        this.sellingPriceRetail = sellingPriceRetail;
    }
    
    public BigDecimal getSellingPriceWholesale() {
        return sellingPriceWholesale;
    }
    
    public void setSellingPriceWholesale(BigDecimal sellingPriceWholesale) {
        this.sellingPriceWholesale = sellingPriceWholesale;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
}

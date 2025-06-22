package com.store.management.repository;

import com.store.management.model.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface SaleItemRepository extends JpaRepository<SaleItem, Integer> {
    
    List<SaleItem> findByProduct_ProductId(Integer productId);
    List<SaleItem> findByProduct_ProductCode(String productCode);

    List<SaleItem> findBySaleSaleId(Integer saleId);
    List<SaleItem> findByProductProductId(Integer productId);
    void deleteByProductProductId(Integer productId);

//     @Query("SELECT SUM(si.quantity) FROM SaleItem si WHERE si.product.productId = :productId")
// BigDecimal getTotalSoldQuantityByProductId(@Param("productId") Integer productId);

}

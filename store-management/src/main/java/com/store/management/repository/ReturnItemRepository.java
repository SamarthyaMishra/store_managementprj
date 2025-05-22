package com.store.management.repository;

import com.store.management.model.ReturnItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ReturnItemRepository extends JpaRepository<ReturnItem, Integer> {
    // Note: Use 'ret' (not 'return') because your field is named 'ret'
    List<ReturnItem> findByReturnsReturnId(Integer returnId);
    List<ReturnItem> findByProductProductId(Integer productId);
    void deleteByProductProductId(Integer productId);
//     @Query("SELECT SUM(ri.quantity) FROM ReturnItem ri WHERE ri.product.productId = :productId")
// BigDecimal getTotalReturnedQuantityByProductId(@Param("productId") Integer productId);

}

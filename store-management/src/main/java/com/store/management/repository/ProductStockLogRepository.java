package com.store.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.store.management.model.ProductStockLog;

import java.util.List;

public interface ProductStockLogRepository extends JpaRepository<ProductStockLog, Integer> {
    List<ProductStockLog> findByProductId_ProductId(Long productId);
}

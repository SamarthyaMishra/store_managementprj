package com.store.management.repository;

import com.store.management.model.ProductStockLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;
import java.util.List;

public interface ProductStockLogRepository extends JpaRepository<ProductStockLog, BigInteger> {
    List<ProductStockLog> findByProductProductId(Integer productId);
    List<ProductStockLog> findByTransactionType(ProductStockLog.TransactionType transactionType);
    void deleteByProductProductId(Integer productId);
}

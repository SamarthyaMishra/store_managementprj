package com.store.management.service;

import com.store.management.model.ProductStockLog;
import com.store.management.repository.ProductStockLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

@Service
public class ProductStockLogService {

    @Autowired
    private ProductStockLogRepository productStockLogRepository;

    public List<ProductStockLog> getAllLogs() {
        return productStockLogRepository.findAll();
    }

    public Optional<ProductStockLog> getLogById(BigInteger logId) {
        return productStockLogRepository.findById(logId);
    }

    public List<ProductStockLog> getLogsByProductId(Integer productId) {
        return productStockLogRepository.findByProductProductId(productId);
    }

    public List<ProductStockLog> getLogsByTransactionType(ProductStockLog.TransactionType transactionType) {
        return productStockLogRepository.findByTransactionType(transactionType);
    }

    public ProductStockLog saveLog(ProductStockLog log) {
        return productStockLogRepository.save(log);
    }

    public void deleteLog(BigInteger logId) {
        productStockLogRepository.deleteById(logId);
    }
}

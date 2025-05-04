package com.store.management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.management.dto.ProductStockLogDTO;
import com.store.management.model.Product;
import com.store.management.model.ProductStockLog;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.ProductStockLogRepository;

@Service
public class ProductStockLogService {

    @Autowired
    private ProductStockLogRepository productStockLogRepository;

    @Autowired
    private ProductRepository productRepository;

    public ProductStockLogDTO createLog(ProductStockLogDTO dto) {
        Product product = productRepository.findById(dto.getProductId()).orElseThrow();

        ProductStockLog log = new ProductStockLog();
        log.setProduct(product);
        // log.setTransactionType(dto.getTransactionType());
        // log.setReferenceId(dto.getReferenceId());
        log.setQuantityChange(dto.getQuantityChange());
        log.setLogDate(dto.getLogDate());

        ProductStockLog saved = productStockLogRepository.save(log);
        // dto.setLogId(saved.getId());
        return dto;
    }
}

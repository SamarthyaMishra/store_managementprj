package com.store.management.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.store.management.dto.ProductStockLogDTO;
import com.store.management.service.ProductStockLogService;

// import java.util.List;

@RestController
@RequestMapping("/api/product-stock-logs")
public class ProductStockLogController {

    @Autowired
    private ProductStockLogService productStockLogService;

    @GetMapping
    public List<ProductStockLogDTO> getAllLogs() {
        return  null ; 
        // productStockLogService.getAllLogs();
    }

    @PostMapping
    public ProductStockLogDTO createLog(@RequestBody ProductStockLogDTO dto) {
        return productStockLogService.createLog(dto);
    }
}
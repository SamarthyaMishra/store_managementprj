package com.store.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.store.management.dto.SaleItemDTO;
import com.store.management.service.SaleItemService;

@RestController
@RequestMapping("/api/sales-items")
public class SaleItemController {

    @Autowired
    private SaleItemService saleItemService;

    @PostMapping
    public SaleItemDTO createSalesItem(@RequestBody SaleItemDTO dto) {
        return saleItemService.createSalesItem(dto);
    }
}

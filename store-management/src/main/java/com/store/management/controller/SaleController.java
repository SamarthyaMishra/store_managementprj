package com.store.management.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.store.management.dto.SaleDTO;
import com.store.management.service.SaleService;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @PostMapping
    public SaleDTO createSale(@RequestBody SaleDTO dto) {
        return saleService.createSale(dto);
    }

    // @GetMapping("/{id}")
    // public SaleDTO getSaleById(@PathVariable Integer id) {
    //     return saleService.getSaleById(id);
    }

package com.store.management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.management.dto.SaleItemDTO;
import com.store.management.model.Product;
import com.store.management.model.Sale;
import com.store.management.model.SaleItem;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.SaleItemRepository;
import com.store.management.repository.SaleRepository;

@Service
public class SaleItemService {

    @Autowired
    private SaleItemRepository salesItemRepository;

    @Autowired
    private SaleRepository salesRepository;

    @Autowired
    private ProductRepository productRepository;

    public SaleItemDTO createSalesItem(SaleItemDTO dto) {
        Sale sale = salesRepository.findById(dto.getSaleId()).orElseThrow();
        Product product = productRepository.findById(dto.getProductId()).orElseThrow();

        SaleItem item = new SaleItem();
        item.setSale(sale);
        item.setProduct(product);
        item.setQuantity(dto.getQuantity());
        item.setPrice(dto.getPrice());
        item.setTotalPrice(dto.getTotalPrice());

        SaleItem saved = salesItemRepository.save(item);
        // dto.setItemId(saved.getId());
        return dto;
    }
}

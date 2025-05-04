package com.store.management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.management.dto.ReturnItemDTO;
import com.store.management.model.Product;
import com.store.management.model.Return;
import com.store.management.model.ReturnItem;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.ReturnItemRepository;
import com.store.management.repository.ReturnRepository;

@Service
public class ReturnItemService {

    @Autowired
    private ReturnItemRepository returnItemRepository;

    @Autowired
    private ReturnRepository returnRepository;

    @Autowired
    private ProductRepository productRepository;

    public ReturnItemDTO createReturnItem(ReturnItemDTO dto) {
        Return r = returnRepository.findById(dto.getReturnId()).orElseThrow();
        Product product = productRepository.findById(dto.getProductId()).orElseThrow();

        ReturnItem item = new ReturnItem();
        // item.setReturnEntity(r);
        item.setProduct(product);
        item.setQuantity(dto.getQuantity());
        item.setPrice(dto.getPrice());
        item.setTotalPrice(dto.getTotalPrice());

        ReturnItem saved = returnItemRepository.save(item);
        // dto.setReturnItemId(saved.getId());
        return dto;
    }
}

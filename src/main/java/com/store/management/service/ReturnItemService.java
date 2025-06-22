package com.store.management.service;

import com.store.management.dto.ReturnItemDTO;
import com.store.management.dto.ProductDTO;
import com.store.management.model.ReturnItem;
import com.store.management.model.Returns;
import com.store.management.model.Product;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.ReturnItemRepository;
import com.store.management.repository.ReturnsRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReturnItemService {

    @Autowired
    private ReturnItemRepository returnItemRepository;

    @Autowired
    private ReturnsRepository returnsRepository;

    @Autowired
    private ProductRepository productRepository;

    public ReturnItemDTO saveReturnItem(ReturnItemDTO dto) {
        Returns returns = returnsRepository.findById(dto.getReturns().getReturnId())
                .orElseThrow(() -> new RuntimeException("Returns not found"));
        Product product = productRepository.findById(dto.getProduct().getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ReturnItem item = new ReturnItem();
        item.setReturns(returns);
        item.setProduct(product);
        item.setQuantity(dto.getQuantity());
        item.setPrice(dto.getPrice());
        item.setTotalPrice(dto.getTotalPrice());

        ReturnItem saved = returnItemRepository.save(item);
        return toDTO(saved);
    }

    public List<ReturnItemDTO> getAllReturnItems() {
        return returnItemRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<ReturnItemDTO> getReturnItemById(Integer id) {
        return returnItemRepository.findById(id).map(this::toDTO);
    }

    public List<ReturnItemDTO> getReturnItemsByReturnId(Integer returnId) {
        return returnItemRepository.findByReturnsReturnId(returnId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ReturnItemDTO> getReturnItemsByProductId(Integer productId) {
        return returnItemRepository.findByProductProductId(productId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void deleteReturnItem(Integer id) {
        returnItemRepository.deleteById(id);
    }

    private ReturnItemDTO toDTO(ReturnItem item) {
        if (item == null) return null;
    
        ProductDTO productDTO = null;
        if (item.getProduct() != null) {
            productDTO = ProductDTO.builder()
                    .productId(item.getProduct().getProductId())
                    .productCode(item.getProduct().getProductCode())
                    .productName(item.getProduct().getProductName())
                    .build();
        }
    
        return ReturnItemDTO.builder()
                .returnItemId(item.getReturnItemId())
                .product(productDTO)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    
    }
}


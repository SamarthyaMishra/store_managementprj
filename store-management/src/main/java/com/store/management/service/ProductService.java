package com.store.management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.management.dto.ProductDTO;
import com.store.management.model.Product;
import com.store.management.model.Unit;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.UnitRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UnitRepository unitRepository;

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream().map(product -> {
            ProductDTO dto = new ProductDTO();
            // dto.setProductId(product.getId());
            dto.setProductCode(product.getProductCode());
            dto.setProductName(product.getProductName());
            // dto.setUnitId(product.getUnit().getId());
            dto.setQuantity(product.getQuantity());
            dto.setBuyingPrice(product.getBuyingPrice());
            dto.setSellingPriceRetail(product.getSellingPriceRetail());
            dto.setSellingPriceWholesale(product.getSellingPriceWholesale());
            dto.setCreatedAt(product.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());
    }

    public ProductDTO createProduct(ProductDTO dto) {
        Product product = new Product();
        product.setProductCode(dto.getProductCode());
        product.setProductName(dto.getProductName());
        Unit unit = unitRepository.findById(dto.getUnitId()).orElseThrow();
        product.setUnit(unit);
        product.setQuantity(dto.getQuantity());
        product.setBuyingPrice(dto.getBuyingPrice());
        product.setSellingPriceRetail(dto.getSellingPriceRetail());
        product.setSellingPriceWholesale(dto.getSellingPriceWholesale());
        Product saved = productRepository.save(product);
        // dto.setProductId(saved.getId());
        dto.setCreatedAt(saved.getCreatedAt());
        return dto;
    }
}

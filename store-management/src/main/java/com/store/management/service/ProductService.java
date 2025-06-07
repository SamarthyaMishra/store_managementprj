package com.store.management.service;

import java.util.stream.Collectors;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;
import com.store.management.dto.ProductDTO;
import com.store.management.model.Product;
import com.store.management.model.Units;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.ProductStockLogRepository;
import com.store.management.repository.ReturnItemRepository;
import com.store.management.repository.SaleItemRepository;
import com.store.management.repository.UnitsRepository;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductStockLogRepository productStockLogRepository;

    @Autowired
    private SaleItemRepository saleItemRepository;

    @Autowired
    private ReturnItemRepository returnItemRepository;

    @Autowired
    private UnitsRepository unitsRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    public Optional<Product> getProductByCode(String productCode) {
        return productRepository.findByProductCode(productCode);
    }

    public Optional<Product> getProductByName(String productName) {
        return productRepository.findByProductName(productName);
    }

    public Product saveProduct(Product product) {
        if (product.getProductCode() == null || product.getProductCode().isEmpty()) {
            String lastCode = productRepository.findLastProductCode(); // e.g., PRO12
            int nextNumber = 1;
    
            if (lastCode != null && lastCode.startsWith("PRO")) {
                try {
                    nextNumber = Integer.parseInt(lastCode.substring(3)) + 1;
                } catch (NumberFormatException ignored) {}
            }
    
            String newProductCode = "PRO" + nextNumber; // PRO1, PRO2, ...
            product.setProductCode(newProductCode);
        }
    
        return productRepository.save(product);
    }
    
    public Product updateProduct(Integer id, ProductDTO productDTO) {
        // Fetch the existing product
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    
        // Update product details
        product.setProductName(productDTO.getProductName());
        product.setBuyingPrice(productDTO.getBuyingPrice());
        product.setSellingPriceRetail(productDTO.getSellingPriceRetail());
        product.setSellingPriceWholesale(productDTO.getSellingPriceWholesale());
        product.setQuantity(productDTO.getQuantity());
    
        // Fetch and set the unit
        Units unit = unitsRepository.findByUnitName(productDTO.getUnit().getUnitName())
    .orElseThrow(() -> new RuntimeException("Unit not found with name: " + productDTO.getUnit().getUnitName()));
product.setUnit(unit);

    
        return productRepository.save(product);
    }
    @Transactional
    public void deleteProduct(Integer id) {
        saleItemRepository.deleteByProductProductId(id);
        returnItemRepository.deleteByProductProductId(id);
        productStockLogRepository.deleteByProductProductId(id);
        productRepository.deleteById(id);
    }
}

package com.store.management.service;

import com.store.management.dto.SaleItemDTO;
import com.store.management.dto.ProductDTO;
import com.store.management.model.SaleItem;
import com.store.management.model.Product;
import com.store.management.model.Sale;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.SaleItemRepository;
import com.store.management.repository.SaleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SaleItemService {

   @Autowired
private SaleRepository saleRepository;

@Autowired
private ProductRepository productRepository;

@Autowired
private SaleItemRepository saleItemRepository;

    // Manual mapping from entity to DTO
    private SaleItemDTO toDTO(SaleItem entity) {
        if (entity == null) return null;
        return SaleItemDTO.builder()
                .saleItemId(entity.getItemId())
                .product(toProductDTO(entity.getProduct()))
                .quantity(entity.getQuantity())
                .price(entity.getPrice())
                .totalPrice(entity.getTotalPrice())
                .build();
    }

    // Manual mapping from DTO to entity
    private SaleItem toEntity(SaleItemDTO dto) {
        if (dto == null) return null;
        SaleItem entity = new SaleItem();
        entity.setItemId(dto.getSaleItemId());
        // You should implement logic to fetch Product entity by ID if needed
        // entity.setProduct(fetchProductById(dto.getProduct().getProductId()));
        entity.setQuantity(dto.getQuantity());
        entity.setPrice(dto.getPrice());
        entity.setTotalPrice(dto.getTotalPrice());
        return entity;
    }

    // Dummy mapping method for ProductDTO (implement as needed)
    private ProductDTO toProductDTO(Product product) {
        if (product == null) return null;
        return ProductDTO.builder()
                .productId(product.getProductId())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                // add other fields as needed
                .build();
    }

    public List<SaleItemDTO> getAllSaleItems() {
        return saleItemRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<SaleItemDTO> getSaleItemById(Integer itemId) {
        return saleItemRepository.findById(itemId).map(this::toDTO);
    }

    public List<SaleItemDTO> getSaleItemsBySaleId(Integer saleId) {
        return saleItemRepository.findBySaleSaleId(saleId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<SaleItemDTO> getSaleItemsByProductId(Integer productId) {
        return saleItemRepository.findByProductProductId(productId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public SaleItemDTO saveSaleItem(SaleItemDTO dto, Integer saleId) {
    Sale sale = saleRepository.findById(saleId)
        .orElseThrow(() -> new RuntimeException("Sale not found"));

    Product product = productRepository.findById(dto.getProduct().getProductId())
        .orElseThrow(() -> new RuntimeException("Product not found"));

    SaleItem entity = new SaleItem();
    entity.setSale(sale);
    entity.setProduct(product);
    entity.setQuantity(dto.getQuantity());
    entity.setPrice(dto.getPrice());
    entity.setTotalPrice(dto.getTotalPrice());

    SaleItem saved = saleItemRepository.save(entity);
    return toDTO(saved);
}

public Optional<SaleItem> getByIdentifier(String identifier) {
    try {
        // Try as saleItemId
        Integer id = Integer.parseInt(identifier);
        Optional<SaleItem> byId = saleItemRepository.findById(id);
        if (byId.isPresent()) return byId;

        // Try as productId
        List<SaleItem> byProductId = saleItemRepository.findByProduct_ProductId(id);
        return byProductId.stream().findFirst();  // Return first match
    } catch (NumberFormatException ignored) {}

    // Try as productCode
    List<SaleItem> byCode = saleItemRepository.findByProduct_ProductCode(identifier);
    return byCode.stream().findFirst();  // Return first match
}

    public boolean deleteByIdentifier(String identifier) {
    // Try as saleItemId
    try {
        Integer id = Integer.parseInt(identifier);
        Optional<SaleItem> saleItem = saleItemRepository.findById(id);
        if (saleItem.isPresent()) {
            saleItemRepository.deleteById(id);
            return true;
        }
    } catch (NumberFormatException ignored) {}

    // Try as productId
    try {
        Integer productId = Integer.parseInt(identifier);
        List<SaleItem> items = saleItemRepository.findByProduct_ProductId(productId);
        if (!items.isEmpty()) {
            saleItemRepository.deleteAll(items);
            return true;
        }
    } catch (NumberFormatException ignored) {}

    // Try as productCode (assuming it's stored in Product entity)
    List<SaleItem> itemsByCode = saleItemRepository.findByProduct_ProductCode(identifier);
    if (!itemsByCode.isEmpty()) {
        saleItemRepository.deleteAll(itemsByCode);
        return true;
    }

    return false;
}

    public void deleteSaleItem(Integer itemId) {
        saleItemRepository.deleteById(itemId);
    }
}

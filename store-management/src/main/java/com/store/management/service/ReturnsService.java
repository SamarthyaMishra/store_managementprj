package com.store.management.service;

import com.store.management.dto.ReturnsDTO;
import com.store.management.dto.SaleDTO;
import com.store.management.dto.CustomerDTO;
import com.store.management.dto.ReturnItemDTO;
import com.store.management.model.Returns;
import com.store.management.model.Sale;
import com.store.management.model.Customer;
import com.store.management.model.Product;
import com.store.management.dto.ProductDTO;
import com.store.management.model.Returns.ReturnsType;
import com.store.management.model.Sale.PaymentMode;
import com.store.management.model.ReturnItem;
import com.store.management.repository.CustomerRepository;
import com.store.management.repository.ProductRepository;
import com.store.management.repository.ReturnsRepository;
import com.store.management.repository.SaleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.math.BigInteger;
import java.time.LocalDateTime;

@Service
public class ReturnsService {

    @Autowired
    private ReturnsRepository returnRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // Save a return with its items
    public ReturnsDTO saveReturn(ReturnsDTO dto) {
        Returns entity = toEntity(dto);
        Returns saved = returnRepository.save(entity);
        return toDTO(saved);
    }

    public List<ReturnsDTO> getAllReturns() {
        return returnRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public Optional<ReturnsDTO> getReturnById(Integer returnId) {
        return returnRepository.findById(returnId).map(this::toDTO);
    }

    public List<ReturnsDTO> getReturnsByCustomerId(BigInteger customerId) {
        return returnRepository.findByCustomerCustomerId(customerId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ReturnsDTO> getReturnsBySaleId(Integer saleId) {
        return returnRepository.findBySaleSaleId(saleId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void deleteReturn(Integer returnId) {
        returnRepository.deleteById(returnId);
    }

    // === Mapping Methods ===

    private Returns toEntity(ReturnsDTO dto) {
        if (dto == null) return null;

        Returns returns = new Returns();
        returns.setReturnId(dto.getReturnId());

        Sale sale = saleRepository.findById(dto.getSale().getSaleId())
                .orElseThrow(() -> new RuntimeException("Sale not found"));
        returns.setSale(sale);

        Customer customer = customerRepository.findById(dto.getCustomer().getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        returns.setCustomer(customer);

        returns.setReturnDate(dto.getReturnDate());
        returns.setReturnType(dto.getReturnType());
        returns.setPaymentMode(mapSalePaymentModeToReturns(dto.getPaymentMode()));
        returns.setTotalReturnAmount(dto.getTotalReturnAmount());

        if (dto.getReturnItems() != null) {
            List<ReturnItem> items = dto.getReturnItems().stream()
                    .map(itemDTO -> {
                        ReturnItem item = new ReturnItem();
                        item.setReturns(returns);
                        Product product = productRepository.findById(itemDTO.getProduct().getProductId())
                                .orElseThrow(() -> new RuntimeException("Product not found"));
                        item.setProduct(product);
                        item.setQuantity(itemDTO.getQuantity());
                        item.setPrice(itemDTO.getPrice());
                        item.setTotalPrice(itemDTO.getTotalPrice());
                        return item;
                    })
                    .collect(Collectors.toList());
            returns.setReturnItems(items);
        }

        return returns;
    }

    public Returns.PaymentMode mapSalePaymentModeToReturns(Sale.PaymentMode salePaymentMode) {
        return Returns.PaymentMode.valueOf(salePaymentMode.name());
    }

    private ReturnsDTO toDTO(Returns entity) {
        if (entity == null) return null;

        return ReturnsDTO.builder()
        .returnId(entity.getReturnId())
        .customer(toCustomerDTO(entity.getCustomer()))
        .returnDate(entity.getReturnDate())
        .returnType(entity.getReturnType())
        .paymentMode(mapReturnsPaymentModeToSale(entity.getPaymentMode()))
        .totalReturnAmount(entity.getTotalReturnAmount())
        .returnItems(entity.getReturnItems() != null
                ? entity.getReturnItems().stream().map(this::toReturnItemDTO).collect(Collectors.toList())
                : null)
        .sale(toSaleDTO(entity.getSale()))
        .products(entity.getReturnItems() != null
    ? entity.getReturnItems().stream()
        .map(ReturnItem::getProduct)
        .filter(Objects::nonNull) // <-- Add this line
        .map(this::toProductDTO)
        .collect(Collectors.toList())
    : null)
        .build();
    }

    private ProductDTO toProductDTO(Product product) {
        if (product == null) return null;
        return ProductDTO.builder()
                .productId(product.getProductId())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .build();
    }

    private Sale.PaymentMode mapReturnsPaymentModeToSale(Returns.PaymentMode returnsPaymentMode) {
        return Sale.PaymentMode.valueOf(returnsPaymentMode.name());
    }

    private SaleDTO toSaleDTO(Sale sale) {
        if (sale == null) return null;
        return SaleDTO.builder()
                .saleId(sale.getSaleId())
                .customer(toCustomerDTO(sale.getCustomer()))
                .saleDate(sale.getSaleDate())
                .paymentMode(sale.getPaymentMode())
                .saleType(sale.getSaleType())
                .grossTotal(sale.getGrossTotal())
                .build();
    }

    private CustomerDTO toCustomerDTO(Customer customer) {
        if (customer == null) return null;
        return CustomerDTO.builder()
                .customerId(customer.getCustomerId())
                .customerCode(customer.getCustomerCode())
                .customerName(customer.getCustomerName())
                .mobileNumber(customer.getMobileNumber())
                .address(customer.getAddress())
                .build();
    }

    private ReturnItemDTO toReturnItemDTO(ReturnItem item) {
        if (item == null) return null;
    
        Product product = item.getProduct(); // handle null safely
        ProductDTO productDTO = (product != null)
            ? ProductDTO.builder()
                .productId(product.getProductId())
                .productCode(product.getProductCode())
                .productName(product.getProductName())
                .build()
            : null;
    
        return ReturnItemDTO.builder()
                .returnItemId(item.getReturnItemId())
                .product(productDTO)
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
    
}


    
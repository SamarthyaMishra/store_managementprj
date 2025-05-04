package com.store.management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.management.dto.SaleDTO;
import com.store.management.model.Customer;
import com.store.management.model.Sale;
import com.store.management.repository.CustomerRepository;
import com.store.management.repository.SaleRepository;

@Service
public class SaleService {

    @Autowired
    private SaleRepository salesRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public SaleDTO createSale(SaleDTO dto) {
        Sale sale = new Sale();
        Customer customer = customerRepository.findById(dto.getCustomerId()).orElseThrow();
        sale.setCustomer(customer);
        // sale.setBillType(dto.getBillType());
        // sale.setTotalAmount(dto.getTotalAmount());
        // sale.setCreatedAt(dto.getCreatedAt());
        Sale saved = salesRepository.save(sale);
        // dto.setSalesId(saved.getId());
        return dto;
    }
}

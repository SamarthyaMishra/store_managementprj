package com.store.management.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.management.dto.ReturnDTO;
import com.store.management.model.Customer;
import com.store.management.model.Return;
import com.store.management.model.Sale;
import com.store.management.repository.CustomerRepository;
import com.store.management.repository.ReturnRepository;
import com.store.management.repository.SaleRepository;

@Service
public class ReturnService {

    @Autowired
    private ReturnRepository returnRepository;

    @Autowired
    private SaleRepository salesRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public ReturnDTO createReturn(ReturnDTO dto) {
        Sale sale = salesRepository.findById(dto.getSaleId()).orElseThrow();
        Customer customer = customerRepository.findById(dto.getCustomerId()).orElseThrow();

        Return r = new Return();
        r.setSale(sale);
        r.setCustomer(customer);
        // r.setReturnType(dto.getReturnType());
        r.setTotalReturnAmount(dto.getTotalReturnAmount());
        r.setReturnDate(dto.getReturnDate());

        Return saved = returnRepository.save(r);
        // dto.setReturnId(saved.getId());
        return dto;
    }
}

package com.store.management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.management.dto.CustomerDTO;
import com.store.management.model.Customer;
import com.store.management.repository.CustomerRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream().map(customer -> {
            CustomerDTO dto = new CustomerDTO();
            // dto.setCustomerId(customer.getId());
            dto.setCustomerCode(customer.getCustomerCode());
            dto.setCustomerName(customer.getCustomerName());
            dto.setMobileNumber(customer.getMobileNumber());
            dto.setAddress(customer.getAddress());
            return dto;
        }).collect(Collectors.toList());
    }

    public CustomerDTO createCustomer(CustomerDTO dto) {
        Customer customer = new Customer();
        customer.setCustomerCode(dto.getCustomerCode());
        customer.setCustomerName(dto.getCustomerName());
        customer.setMobileNumber(dto.getMobileNumber());
        customer.setAddress(dto.getAddress());
        Customer saved = customerRepository.save(customer);
        // dto.setCustomerId(saved.getId());
        return dto;
    }
}

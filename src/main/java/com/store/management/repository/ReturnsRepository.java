package com.store.management.repository;

import com.store.management.model.Returns;
import com.store.management.model.Sale;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.math.BigInteger;

public interface ReturnsRepository extends JpaRepository<Returns, Integer> {
    List<Returns> findByReturnType(Returns.ReturnsType returnType);
    List<Returns> findBySale_PaymentMode(Sale.PaymentMode paymentMode);
    List<Returns> findByCustomer_CustomerCode(String customerCode);
    List<Returns> findByCustomer_CustomerName(String customerName);
    List<Returns> findByCustomerCustomerId(BigInteger customerId);
    List<Returns> findBySaleSaleId(Integer saleId);
}

package com.store.management.repository;

import com.store.management.model.Sale;
import com.store.management.model.Sale.PaymentMode;
import com.store.management.model.Sale.SaleType;

import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
    
    List<Sale> findByCustomer_CustomerNameContainingIgnoreCase(String customerName);
    List<Sale> findByCustomer_mobileNumber(String mobileNumber);
    List<Sale> findByPaymentMode(PaymentMode paymentMode);
    List<Sale> findBySaleType(SaleType saleType);


    
}

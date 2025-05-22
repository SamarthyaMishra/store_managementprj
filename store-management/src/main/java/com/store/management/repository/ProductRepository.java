package com.store.management.repository;


import com.store.management.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query(value = "SELECT product_code FROM products ORDER BY product_id DESC LIMIT 1", nativeQuery = true)
String findLastProductCode();

    Optional<Product> findByProductCode(String productCode);
    Optional<Product> findByProductName(String productName);
}

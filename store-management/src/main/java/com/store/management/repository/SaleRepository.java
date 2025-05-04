package com.store.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.store.management.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
}

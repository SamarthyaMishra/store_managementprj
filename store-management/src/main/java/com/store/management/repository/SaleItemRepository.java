package com.store.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.store.management.model.SaleItem;

public interface SaleItemRepository extends JpaRepository<SaleItem, Integer> {
    List<SaleItem> findBySaleId(Integer saleId);
}

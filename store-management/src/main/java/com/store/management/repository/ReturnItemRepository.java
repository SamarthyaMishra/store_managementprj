package com.store.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.store.management.model.ReturnItem;

import java.util.List;

public interface ReturnItemRepository extends JpaRepository<ReturnItem, Integer> {
    List<ReturnItem> findByReturnId(Integer returnId);
}


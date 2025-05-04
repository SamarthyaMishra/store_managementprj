package com.store.management.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.store.management.model.Unit;

public interface UnitRepository extends JpaRepository<Unit, Integer> {
}


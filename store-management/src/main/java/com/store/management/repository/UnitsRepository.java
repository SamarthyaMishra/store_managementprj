package com.store.management.repository;

import com.store.management.model.Units;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UnitsRepository extends JpaRepository<Units, Integer> {
    Optional<Units> findByUnitName(String unitName);
    Optional<Units> findByUnitId(Integer unitId);
}

package com.store.management.service;

import com.store.management.model.Units;
import com.store.management.repository.UnitsRepository;
import org.hibernate.StaleObjectStateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;
import java.util.Optional;

@Service
public class UnitsService {

    private final UnitsRepository unitsRepository;

    @Autowired
    public UnitsService(UnitsRepository unitsRepository) {
        this.unitsRepository = unitsRepository;
    }

    // Save or update a unit
    public Units saveUnit(Units unit) {
        try {
            return unitsRepository.save(unit);
        } catch (StaleObjectStateException e) {
            // Handle optimistic locking failure (conflict)
            throw new RuntimeException("Unit was updated or deleted by another transaction", e);
        }
    }

    public List<Units> getAllUnits() {
        return unitsRepository.findAll();
    }
    
    public Optional<Units> getUnitById(Integer unitId) {
        return unitsRepository.findById(unitId);
    }

    public Optional<Units> getUnitByName(String unitName) {
        return unitsRepository.findByUnitName(unitName);
    }

    // Delete a unit by unitId
    public void deleteUnit(Integer unitId) {
        unitsRepository.deleteById(unitId);
    }
}

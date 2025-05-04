package com.store.management.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.store.management.dto.UnitDTO;
import com.store.management.model.Unit;
import com.store.management.repository.UnitRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UnitService {

    @Autowired
    private UnitRepository unitRepository;

    public List<UnitDTO> getAllUnits() {
        return unitRepository.findAll().stream().map(unit -> {
            UnitDTO dto = new UnitDTO();
            // dto.setUnitId(unit.getId());
            dto.setUnitName(unit.getUnitName());
            return dto;
        }).collect(Collectors.toList());
    }

    public UnitDTO getUnitById(Integer id) {
        Unit unit = unitRepository.findById(id).orElseThrow();
        UnitDTO dto = new UnitDTO();
        // dto.setUnitId(unit.getId());
        dto.setUnitName(unit.getUnitName());
        return dto;
    }

    public UnitDTO createUnit(UnitDTO unitDTO) {
        Unit unit = new Unit();
        unit.setUnitName(unitDTO.getUnitName());
        Unit saved = unitRepository.save(unit);
        // unitDTO.setUnitId(saved.getId());
        return unitDTO;
    }
}
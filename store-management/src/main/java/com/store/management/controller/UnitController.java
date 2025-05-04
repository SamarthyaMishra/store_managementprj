package com.store.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.store.management.dto.UnitDTO;
import com.store.management.service.UnitService;

import java.util.List;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    @Autowired
    private UnitService unitService;

    @GetMapping
    public List<UnitDTO> getAllUnits() {
        return unitService.getAllUnits();
    }

    @GetMapping("/{id}")
    public UnitDTO getUnitById(@PathVariable Integer id) {
        return unitService.getUnitById(id);
    }

    @PostMapping
    public UnitDTO createUnit(@RequestBody UnitDTO dto) {
        return unitService.createUnit(dto);
    }
}

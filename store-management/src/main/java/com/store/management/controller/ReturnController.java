package com.store.management.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.store.management.dto.ReturnDTO;
import com.store.management.service.ReturnService;

@RestController
@RequestMapping("/api/returns")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

    @PostMapping
    public ReturnDTO createReturn(@RequestBody ReturnDTO dto) {
        return returnService.createReturn(dto);
    }
}
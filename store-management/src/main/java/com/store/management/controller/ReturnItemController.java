package com.store.management.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.store.management.dto.ReturnItemDTO;
import com.store.management.service.ReturnItemService;

@RestController
@RequestMapping("/api/return-items")
public class ReturnItemController {

    @Autowired
    private ReturnItemService returnItemService;

    @PostMapping
    public ReturnItemDTO createReturnItem(@RequestBody ReturnItemDTO dto) {
        return returnItemService.createReturnItem(dto);
    }
}

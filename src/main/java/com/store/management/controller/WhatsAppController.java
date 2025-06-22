package com.store.management.controller;
import com.store.management.dto.WhatsAppRequest;  // Adjust the package name accordingly

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.store.management.service.WhatsAppService;
import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/whatsapp")
public class WhatsAppController {

    @Autowired
    private WhatsAppService whatsAppService;

    @PostMapping("/send-bill")
    public ResponseEntity<String> sendBill(@RequestBody WhatsAppRequest request) {
        whatsAppService.sendBillMessage(request.getPhone(), request.getMessage());
        return ResponseEntity.ok("Bill sent via WhatsApp");
    }
}


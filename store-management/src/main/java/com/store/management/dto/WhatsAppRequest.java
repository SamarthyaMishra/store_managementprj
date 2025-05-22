package com.store.management.dto;

public class WhatsAppRequest {

    private String phone;
    private String message;

    // Default constructor (required for JSON deserialization)
    public WhatsAppRequest() {}

    // Getters and setters
    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}


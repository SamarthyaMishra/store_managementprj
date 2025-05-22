package com.store.management.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.stereotype.Service;

@Service
public class WhatsAppService {

    private final String ACCOUNT_SID = "YOUR_TWILIO_SID";
    private final String AUTH_TOKEN = "YOUR_TWILIO_AUTH_TOKEN";
    private final String FROM_NUMBER = "whatsapp:+14155238886"; // Twilio sandbox number

    public void sendBillMessage(String to, String messageBody) {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        Message message = Message.creator(
                new PhoneNumber("whatsapp:" + to),
                new PhoneNumber(FROM_NUMBER),
                messageBody
        ).create();

        System.out.println("WhatsApp Message SID: " + message.getSid());
    }
}

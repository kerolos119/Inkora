package com.kerolos119.inkora.model;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class EmailMessages {

    private static final String STORE_NAME = EmailTemplate.STORE_NAME;

    private final String frontendUrl;

    public EmailMessages(@Value("${app.frontend-url:http://localhost:3000}") String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    public EmailTemplate welcome(String username) {
        return new EmailTemplate(
                "welcome-email",
                "Welcome to " + STORE_NAME,
                username,
                "Thank you for registering at " + STORE_NAME + "! We're excited to have you join our reading community.",
                null,
                frontendUrl,
                "Browse Books"
        );
    }

    public EmailTemplate otp(String username, String otpCode) {
        return new EmailTemplate(
                "email-message",
                "Password Reset - " + STORE_NAME,
                username,
                "You have requested to reset your password. Use the following code to verify your identity:",
                "Verification Code: " + otpCode + " (valid for 10 minutes)",
                null,
                null
        );
    }

    public EmailTemplate orderConfirmation(String username, String orderId,
                                           List<OrderItem> items, BigDecimal total) {
        return new EmailTemplate(
                "email-message",
                "Order Confirmation - " + STORE_NAME,
                username,
                "Your order has been confirmed successfully. Your books will be shipped as soon as possible.",
                "Order Number: #" + orderId,
                frontendUrl + "/orders/" + orderId,
                "Track Your Order",
                items,
                total
        );
    }
}

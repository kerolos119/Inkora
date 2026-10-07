package com.kerolos119.inkora.model;

import java.math.BigDecimal;
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public record EmailTemplate(
        String templateName,
        String subject,
        String userName,
        String message,
        String highlightText,
        String actionUrl,
        String actionText,
        List<OrderItem> orderItems,
        BigDecimal total
) {

    public static final String STORE_NAME    = "Inkora";
    public static final String STORE_TAGLINE = "Press & Bookstore · دار نشر ومكتبة";

    /** Convenience constructor for emails without an order table. */
    public EmailTemplate(String templateName, String subject, String userName,
                         String message, String highlightText,
                         String actionUrl, String actionText) {
        this(templateName, subject, userName, message, highlightText,
                actionUrl, actionText, null, null);
    }

    public Map<String, Object> toVariables() {
        Map<String, Object> vars = new HashMap<>();
        vars.put("storeName",       STORE_NAME);
        vars.put("storeTagline",    STORE_TAGLINE);
        vars.put("subject",         subject);
        vars.put("userName",        userName);
        vars.put("message",         message);
        vars.put("highlightText",   highlightText);
        vars.put("actionUrl",       actionUrl);
        vars.put("actionText",      actionText);
        vars.put("orderItems",      orderItems);
        vars.put("totalPrice",      total);
        vars.put("currency",        "$"); // same symbol the storefront shows (prefix, 2 decimals)
        vars.put("footerCopyright", "© " + Year.now().getValue() + " " + STORE_NAME + " · All rights reserved · جميع الحقوق محفوظة");
        return vars;
    }
}
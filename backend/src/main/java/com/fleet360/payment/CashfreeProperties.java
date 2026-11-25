package com.fleet360.payment;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Cashfree Payment Gateway settings (application.yml -> cashfree.*).
 * Keys come from environment variables - never commit real keys to Git.
 */
@ConfigurationProperties(prefix = "cashfree")
public record CashfreeProperties(
        String clientId,
        String clientSecret,
        String environment,   // sandbox | production
        String apiVersion,    // e.g. 2025-01-01
        String returnUrl,
        String notifyUrl) {

    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank() && clientSecret != null && !clientSecret.isBlank();
    }

    public String baseUrl() {
        return "production".equalsIgnoreCase(environment)
                ? "https://api.cashfree.com/pg"
                : "https://sandbox.cashfree.com/pg";
    }

    public String mode() {
        return "production".equalsIgnoreCase(environment) ? "production" : "sandbox";
    }
}

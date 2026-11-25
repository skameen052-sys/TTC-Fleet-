package com.fleet360.payment;

import jakarta.validation.constraints.*;

/** Body sent by the Customer Portal to start a Cashfree payment. */
public record CreatePaymentRequest(
        @NotBlank String invoiceId,
        @NotNull @DecimalMin("1.00") Double amount,
        @NotBlank String customerId,
        @NotBlank String customerName,
        @NotBlank @Email String customerEmail,
        @NotBlank @Pattern(regexp = "\\d{10}", message = "customerPhone must be 10 digits") String customerPhone) {
}

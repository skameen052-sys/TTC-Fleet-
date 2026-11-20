package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.Invoice;
import com.ttc.fleet360.entities.PaymentTransaction;
import com.ttc.fleet360.services.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    // --- Invoices ---
    @GetMapping("/invoices")
    public ResponseEntity<ApiResponse<List<Invoice>>> getAllInvoices(
            @RequestParam(required = false) String status) {
        List<Invoice> list = billingService.getAllInvoices(status);
        return ResponseEntity.ok(ApiResponse.success("Invoices retrieved successfully", list));
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<ApiResponse<Invoice>> getInvoiceById(@PathVariable Long id) {
        Invoice invoice = billingService.getInvoiceById(id);
        return ResponseEntity.ok(ApiResponse.success(invoice));
    }

    @PostMapping("/invoices")
    public ResponseEntity<ApiResponse<Invoice>> createInvoice(@RequestBody Invoice invoice) {
        Invoice saved = billingService.createInvoice(invoice);
        return ResponseEntity.ok(ApiResponse.success("Invoice generated successfully", saved));
    }

    @PatchMapping("/invoices/{id}/status")
    public ResponseEntity<ApiResponse<Invoice>> updateInvoiceStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Invoice updated = billingService.updateInvoiceStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Invoice status updated to " + status, updated));
    }

    @DeleteMapping("/invoices/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable Long id) {
        billingService.deleteInvoice(id);
        return ResponseEntity.ok(ApiResponse.success("Invoice deleted successfully", null));
    }

    // --- Payments ---
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<PaymentTransaction>>> getAllPayments(
            @RequestParam(required = false) String status) {
        List<PaymentTransaction> list = billingService.getAllPayments(status);
        return ResponseEntity.ok(ApiResponse.success("Payment transactions retrieved", list));
    }

    @PostMapping("/payments")
    public ResponseEntity<ApiResponse<PaymentTransaction>> recordPayment(@RequestBody PaymentTransaction payment) {
        PaymentTransaction saved = billingService.createPayment(payment);
        return ResponseEntity.ok(ApiResponse.success("Payment processed successfully", saved));
    }

    @PostMapping("/payments/{id}/refund")
    public ResponseEntity<ApiResponse<PaymentTransaction>> refundPayment(
            @PathVariable Long id,
            @RequestParam(defaultValue = "Customer cancellation") String reason) {
        PaymentTransaction refunded = billingService.refundPayment(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Payment refunded successfully", refunded));
    }
}

package com.fleet360.payment;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientResponseException;

import java.util.*;

/**
 * Customer Portal payments through Cashfree.
 *
 *  POST /api/payments/cashfree/orders            create order -> { orderId, paymentSessionId, mode }
 *  GET  /api/payments/cashfree/orders/{orderId}  verify       -> { orderId, orderStatus, payments[] }
 *  POST /api/payments/cashfree/webhook           Cashfree server-to-server notification (signature checked)
 *  GET  /api/payments/cashfree/status            is the gateway configured?
 *
 * The frontend only ever receives the payment_session_id - the client secret stays on the server.
 */
@RestController
@RequestMapping("/api/payments/cashfree")
public class CashfreePaymentController {

    private static final Logger log = LoggerFactory.getLogger(CashfreePaymentController.class);
    private final CashfreeService cashfree;

    public CashfreePaymentController(CashfreeService cashfree) {
        this.cashfree = cashfree;
    }

    @GetMapping("/status")
    public Map<String, Object> status() {
        return Map.of("gateway", "cashfree", "configured", cashfree.isConfigured(), "mode", cashfree.mode());
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreatePaymentRequest req) {
        if (!cashfree.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("configured", false, "message", "Set CASHFREE_CLIENT_ID and CASHFREE_CLIENT_SECRET"));
        }
        try {
            Map<String, Object> order = cashfree.createOrder(req);
            return ResponseEntity.ok(Map.of(
                    "orderId", order.get("order_id"),
                    "paymentSessionId", order.get("payment_session_id"),
                    "orderStatus", order.get("order_status"),
                    "mode", cashfree.mode()));
        } catch (RestClientResponseException e) {
            log.warn("Cashfree create order failed: {}", e.getResponseBodyAsString());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", "Cashfree rejected the order", "details", e.getResponseBodyAsString()));
        }
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> verify(@PathVariable String orderId) {
        if (!cashfree.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("configured", false));
        }
        try {
            Map<String, Object> order = cashfree.getOrder(orderId);
            List<Map<String, Object>> payments = new ArrayList<>();
            for (Map<String, Object> p : cashfree.getPayments(orderId)) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("cfPaymentId", String.valueOf(p.get("cf_payment_id")));
                m.put("paymentStatus", p.get("payment_status"));
                m.put("paymentGroup", p.get("payment_group"));
                m.put("bankReference", p.get("bank_reference"));
                m.put("paymentAmount", p.get("payment_amount"));
                m.put("paymentTime", p.get("payment_time"));
                payments.add(m);
            }
            // TODO: when order_status == PAID, mark the BillingInvoice as Paid and save a PaymentTransaction.
            return ResponseEntity.ok(Map.of("orderId", orderId, "orderStatus", order.get("order_status"), "payments", payments));
        } catch (RestClientResponseException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("message", "Could not verify order", "details", e.getResponseBodyAsString()));
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> webhook(@RequestHeader(value = "x-webhook-timestamp", required = false) String timestamp,
                                     @RequestHeader(value = "x-webhook-signature", required = false) String signature,
                                     @RequestBody String rawBody) {
        if (!cashfree.verifyWebhook(timestamp, rawBody, signature)) {
            log.warn("Rejected Cashfree webhook with invalid signature");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "invalid signature"));
        }
        log.info("Cashfree webhook received: {}", rawBody);
        // TODO: parse data.order.order_id + data.payment.payment_status and update the invoice (idempotently).
        return ResponseEntity.ok(Map.of("received", true));
    }
}

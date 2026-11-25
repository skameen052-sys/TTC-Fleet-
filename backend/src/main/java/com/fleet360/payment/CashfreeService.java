package com.fleet360.payment;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.*;

/**
 * Talks to the Cashfree PG REST API.
 *  - createOrder  : POST {base}/orders          -> payment_session_id for the JS checkout
 *  - getOrder     : GET  {base}/orders/{id}     -> order_status (PAID / ACTIVE / EXPIRED ...)
 *  - getPayments  : GET  {base}/orders/{id}/payments
 *  - verifyWebhook: HMAC-SHA256(timestamp + rawBody) with the client secret, Base64
 */
@Service
public class CashfreeService {

    private final CashfreeProperties props;
    private final RestClient http;

    public CashfreeService(CashfreeProperties props) {
        this.props = props;
        this.http = RestClient.builder()
                .baseUrl(props.baseUrl())
                .defaultHeader("x-client-id", Objects.toString(props.clientId(), ""))
                .defaultHeader("x-client-secret", Objects.toString(props.clientSecret(), ""))
                .defaultHeader("x-api-version", props.apiVersion())
                .build();
    }

    public boolean isConfigured() {
        return props.isConfigured();
    }

    public String mode() {
        return props.mode();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> createOrder(CreatePaymentRequest req) {
        String orderId = ("TTC_" + req.invoiceId() + "_" + System.currentTimeMillis())
                .replaceAll("[^A-Za-z0-9_-]", "_");

        Map<String, Object> customer = new LinkedHashMap<>();
        customer.put("customer_id", req.customerId().replaceAll("[^A-Za-z0-9_-]", "_"));
        customer.put("customer_name", req.customerName());
        customer.put("customer_email", req.customerEmail());
        customer.put("customer_phone", req.customerPhone());

        Map<String, Object> meta = new LinkedHashMap<>();
        if (props.returnUrl() != null && !props.returnUrl().isBlank())
            meta.put("return_url", props.returnUrl() + "?order_id=" + orderId);
        if (props.notifyUrl() != null && !props.notifyUrl().isBlank())
            meta.put("notify_url", props.notifyUrl());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("order_id", orderId);
        body.put("order_amount", req.amount());
        body.put("order_currency", "INR");
        body.put("customer_details", customer);
        body.put("order_note", "TTC Fleet360 invoice " + req.invoiceId());
        body.put("order_tags", Map.of("invoice_id", req.invoiceId()));
        if (!meta.isEmpty()) body.put("order_meta", meta);

        return http.post().uri("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getOrder(String orderId) {
        return http.get().uri("/orders/{id}", orderId).retrieve().body(Map.class);
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getPayments(String orderId) {
        List<Map<String, Object>> list = http.get().uri("/orders/{id}/payments", orderId).retrieve().body(List.class);
        return list == null ? List.of() : list;
    }

    /** Cashfree webhook check: Base64(HMAC_SHA256(timestamp + rawBody, clientSecret)). */
    public boolean verifyWebhook(String timestamp, String rawBody, String signature) {
        if (!isConfigured() || timestamp == null || signature == null) return false;
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(props.clientSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            String expected = Base64.getEncoder()
                    .encodeToString(mac.doFinal((timestamp + rawBody).getBytes(StandardCharsets.UTF_8)));
            return MessageDigest.isEqual(expected.getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            return false;
        }
    }
}

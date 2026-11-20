package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.dto.PaymentRecordDto;
import com.ttc.fleet360.dto.SubscriptionDto;
import com.ttc.fleet360.dto.SubscriptionPlanDto;
import com.ttc.fleet360.services.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@Tag(name = "Subscription Management", description = "Tiers, renewals, billing plans, and payment records")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @GetMapping("/plans")
    @Operation(summary = "Get all subscription tiers (Basic, Premium, Enterprise)")
    public ResponseEntity<ApiResponse<List<SubscriptionPlanDto>>> getAllPlans() {
        return ResponseEntity.ok(ApiResponse.ok(subscriptionService.getAllPlans()));
    }

    @GetMapping
    @Operation(summary = "Search active subscriptions with pagination and status filter")
    public ResponseEntity<ApiResponse<Page<SubscriptionDto>>> getSubscriptions(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "endDate"));
        return ResponseEntity.ok(ApiResponse.ok(subscriptionService.searchSubscriptions(search, status, pageRequest)));
    }

    @GetMapping("/renewals")
    @Operation(summary = "Get subscriptions expiring soon")
    public ResponseEntity<ApiResponse<List<SubscriptionDto>>> getUpcomingRenewals(
            @RequestParam(defaultValue = "30") int days
    ) {
        return ResponseEntity.ok(ApiResponse.ok(subscriptionService.getUpcomingRenewals(days)));
    }

    @PostMapping("/{id}/renew")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN')")
    @Operation(summary = "Renew or upgrade an existing subscription")
    public ResponseEntity<ApiResponse<SubscriptionDto>> renewSubscription(
            @PathVariable Long id,
            @RequestParam(defaultValue = "MONTHLY") String billingCycle
    ) {
        SubscriptionDto renewed = subscriptionService.renewSubscription(id, billingCycle);
        return ResponseEntity.ok(ApiResponse.ok("Subscription renewed successfully", renewed));
    }

    @GetMapping("/payments")
    @Operation(summary = "View payment and invoice history")
    public ResponseEntity<ApiResponse<Page<PaymentRecordDto>>> getPaymentHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.ok(subscriptionService.getPaymentHistory(pageRequest)));
    }
}

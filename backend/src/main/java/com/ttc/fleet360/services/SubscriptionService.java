package com.ttc.fleet360.services;

import com.ttc.fleet360.dto.PaymentRecordDto;
import com.ttc.fleet360.dto.SubscriptionDto;
import com.ttc.fleet360.dto.SubscriptionPlanDto;
import com.ttc.fleet360.entities.PaymentRecord;
import com.ttc.fleet360.entities.Subscription;
import com.ttc.fleet360.entities.SubscriptionPlan;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.PaymentRecordRepository;
import com.ttc.fleet360.repositories.SubscriptionPlanRepository;
import com.ttc.fleet360.repositories.SubscriptionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SubscriptionService {

    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final AuditLogService auditLogService;

    public SubscriptionService(SubscriptionPlanRepository subscriptionPlanRepository,
                               SubscriptionRepository subscriptionRepository,
                               PaymentRecordRepository paymentRecordRepository,
                               AuditLogService auditLogService) {
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.paymentRecordRepository = paymentRecordRepository;
        this.auditLogService = auditLogService;
    }

    public List<SubscriptionPlanDto> getAllPlans() {
        return subscriptionPlanRepository.findAllByOrderByDisplayOrderAsc()
                .stream().map(this::mapToPlanDto).collect(Collectors.toList());
    }

    public Page<SubscriptionDto> searchSubscriptions(String search, String status, Pageable pageable) {
        return subscriptionRepository.searchSubscriptions(search, status, pageable)
                .map(this::mapToSubscriptionDto);
    }

    public List<SubscriptionDto> getUpcomingRenewals(int daysAhead) {
        LocalDate today = LocalDate.now();
        LocalDate future = today.plusDays(daysAhead);
        return subscriptionRepository.findByEndDateBetweenOrderByEndDateAsc(today, future)
                .stream().map(this::mapToSubscriptionDto).collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionDto renewSubscription(Long subscriptionId, String billingCycle) {
        Subscription sub = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found with id " + subscriptionId));

        LocalDate currentEnd = sub.getEndDate();
        LocalDate baseDate = currentEnd.isAfter(LocalDate.now()) ? currentEnd : LocalDate.now();

        if ("ANNUAL".equalsIgnoreCase(billingCycle)) {
            sub.setEndDate(baseDate.plusYears(1));
            sub.setBillingCycle("ANNUAL");
            sub.setCurrentAmount(sub.getPlan().getAnnualPrice());
        } else {
            sub.setEndDate(baseDate.plusMonths(1));
            sub.setBillingCycle("MONTHLY");
            sub.setCurrentAmount(sub.getPlan().getMonthlyPrice());
        }
        sub.setStatus("ACTIVE");

        Subscription saved = subscriptionRepository.save(sub);

        // Record payment
        PaymentRecord payment = new PaymentRecord();
        payment.setInvoiceNumber("INV-" + System.currentTimeMillis());
        payment.setSubscription(saved);
        payment.setAmount(saved.getCurrentAmount());
        payment.setPaymentMethod("CREDIT_CARD");
        payment.setPaymentStatus("SUCCESS");
        payment.setTransactionReference("TXN_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payment.setPayerCompany(saved.getCompanyName());
        paymentRecordRepository.save(payment);

        auditLogService.logActivity("admin", "RENEWAL", "SUBSCRIPTIONS", saved.getId().toString(),
                "Subscription renewed - " + saved.getPlan().getPlanName() + " Plan for " + saved.getCompanyName(),
                "127.0.0.1", "SUCCESS");

        return mapToSubscriptionDto(saved);
    }

    public Page<PaymentRecordDto> getPaymentHistory(Pageable pageable) {
        return paymentRecordRepository.findAllByOrderByPaymentDateDesc(pageable)
                .map(this::mapToPaymentDto);
    }

    public SubscriptionPlanDto mapToPlanDto(SubscriptionPlan p) {
        SubscriptionPlanDto dto = new SubscriptionPlanDto();
        dto.setId(p.getId());
        dto.setPlanCode(p.getPlanCode());
        dto.setPlanName(p.getPlanName());
        dto.setMonthlyPrice(p.getMonthlyPrice());
        dto.setAnnualPrice(p.getAnnualPrice());
        dto.setCurrency(p.getCurrency());
        dto.setMaxFleetSize(p.getMaxFleetSize());
        dto.setMaxBranches(p.getMaxBranches());
        dto.setMaxUsers(p.getMaxUsers());
        dto.setFeaturesJson(p.getFeaturesJson());
        dto.setIsActive(p.getIsActive());
        dto.setIsPopular(p.getIsPopular());
        dto.setDisplayOrder(p.getDisplayOrder());
        return dto;
    }

    public SubscriptionDto mapToSubscriptionDto(Subscription s) {
        SubscriptionDto dto = new SubscriptionDto();
        dto.setId(s.getId());
        dto.setSubscriptionCode(s.getSubscriptionCode());
        dto.setCompanyId(s.getCompanyId());
        dto.setCompanyName(s.getCompanyName());
        if (s.getPlan() != null) {
            dto.setPlanId(s.getPlan().getId());
            dto.setPlanName(s.getPlan().getPlanName());
        }
        dto.setBillingCycle(s.getBillingCycle());
        dto.setStartDate(s.getStartDate());
        dto.setEndDate(s.getEndDate());
        dto.setStatus(s.getStatus());
        dto.setAutoRenew(s.getAutoRenew());
        dto.setCurrentAmount(s.getCurrentAmount());

        long daysLeft = ChronoUnit.DAYS.between(LocalDate.now(), s.getEndDate());
        dto.setDaysUntilExpiry(Math.max(0, daysLeft));

        return dto;
    }

    public PaymentRecordDto mapToPaymentDto(PaymentRecord r) {
        PaymentRecordDto dto = new PaymentRecordDto();
        dto.setId(r.getId());
        dto.setInvoiceNumber(r.getInvoiceNumber());
        if (r.getSubscription() != null) {
            dto.setSubscriptionId(r.getSubscription().getId());
        }
        dto.setAmount(r.getAmount());
        dto.setCurrency(r.getCurrency());
        dto.setPaymentMethod(r.getPaymentMethod());
        dto.setPaymentStatus(r.getPaymentStatus());
        dto.setTransactionReference(r.getTransactionReference());
        dto.setPaymentDate(r.getPaymentDate());
        dto.setPayerEmail(r.getPayerEmail());
        dto.setPayerCompany(r.getPayerCompany());
        dto.setInvoicePdfUrl(r.getInvoicePdfUrl());
        return dto;
    }
}

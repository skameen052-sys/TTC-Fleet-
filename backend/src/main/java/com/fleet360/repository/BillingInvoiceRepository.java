package com.fleet360.repository;

import com.fleet360.model.BillingInvoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillingInvoiceRepository extends JpaRepository<BillingInvoice, Long> {
    Optional<BillingInvoice> findByInvoiceId(String invoiceId);
    Optional<BillingInvoice> findByOrderId(String orderId);
    List<BillingInvoice> findByCustomerId(String customerId);
    List<BillingInvoice> findByStatus(String status);
}

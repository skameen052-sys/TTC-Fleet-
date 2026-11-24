package com.fleet360.repository;

import com.fleet360.model.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByPaymentId(String paymentId);
    Optional<PaymentTransaction> findByInvoiceId(String invoiceId);
    List<PaymentTransaction> findByCustomerId(String customerId);
}

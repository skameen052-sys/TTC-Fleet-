package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    Optional<PaymentTransaction> findByTransactionReference(String transactionReference);
    List<PaymentTransaction> findByInvoiceNumber(String invoiceNumber);
    List<PaymentTransaction> findByStatus(String status);
}

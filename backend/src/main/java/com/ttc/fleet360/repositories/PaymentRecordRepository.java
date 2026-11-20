package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.PaymentRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRecordRepository extends JpaRepository<PaymentRecord, Long> {
    Optional<PaymentRecord> findByInvoiceNumber(String invoiceNumber);
    List<PaymentRecord> findBySubscriptionId(Long subscriptionId);
    Page<PaymentRecord> findAllByOrderByPaymentDateDesc(Pageable pageable);
}

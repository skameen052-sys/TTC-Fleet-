package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.Invoice;
import com.ttc.fleet360.entities.PaymentTransaction;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.InvoiceRepository;
import com.ttc.fleet360.repositories.PaymentTransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class BillingService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;

    public BillingService(InvoiceRepository invoiceRepository,
                          PaymentTransactionRepository paymentTransactionRepository) {
        this.invoiceRepository = invoiceRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    // --- Invoices ---
    public List<Invoice> getAllInvoices(String status) {
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return invoiceRepository.findByStatus(status.toUpperCase());
        }
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with ID: " + id));
    }

    @Transactional
    public Invoice createInvoice(Invoice invoice) {
        if (invoice.getInvoiceNumber() == null || invoice.getInvoiceNumber().isBlank()) {
            invoice.setInvoiceNumber("INV-" + System.currentTimeMillis() % 1000000);
        }
        if (invoice.getTotalAmount() == null || invoice.getTotalAmount().compareTo(BigDecimal.ZERO) == 0) {
            BigDecimal sub = invoice.getSubtotal() != null ? invoice.getSubtotal() : BigDecimal.ZERO;
            BigDecimal tax = invoice.getTaxAmount() != null ? invoice.getTaxAmount() : BigDecimal.ZERO;
            invoice.setTotalAmount(sub.add(tax));
        }
        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Invoice updateInvoiceStatus(Long id, String status) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(status.toUpperCase());
        return invoiceRepository.save(invoice);
    }

    @Transactional
    public void deleteInvoice(Long id) {
        Invoice invoice = getInvoiceById(id);
        invoiceRepository.delete(invoice);
    }

    // --- Payments ---
    public List<PaymentTransaction> getAllPayments(String status) {
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return paymentTransactionRepository.findByStatus(status.toUpperCase());
        }
        return paymentTransactionRepository.findAll();
    }

    @Transactional
    public PaymentTransaction createPayment(PaymentTransaction payment) {
        if (payment.getTransactionReference() == null || payment.getTransactionReference().isBlank()) {
            payment.setTransactionReference("TXN-" + System.currentTimeMillis() % 1000000);
        }
        return paymentTransactionRepository.save(payment);
    }

    @Transactional
    public PaymentTransaction refundPayment(Long id, String reason) {
        PaymentTransaction payment = paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment transaction not found: " + id));
        payment.setStatus("REFUNDED");
        payment.setNotes((payment.getNotes() != null ? payment.getNotes() + " | " : "") + "Refunded: " + reason);
        return paymentTransactionRepository.save(payment);
    }
}

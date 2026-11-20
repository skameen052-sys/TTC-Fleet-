package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.Customer;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers(String status, String search) {
        if (search != null && !search.isBlank()) {
            return customerRepository.searchCustomers(search.trim());
        }
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return customerRepository.findByStatus(status.toUpperCase());
        }
        return customerRepository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
    }

    @Transactional
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer updateCustomer(Long id, Customer updated) {
        Customer existing = getCustomerById(id);
        existing.setCompanyName(updated.getCompanyName());
        existing.setContactPerson(updated.getContactPerson());
        existing.setEmail(updated.getEmail());
        existing.setPhone(updated.getPhone());
        existing.setAddressLine(updated.getAddressLine());
        existing.setCity(updated.getCity());
        existing.setState(updated.getState());
        existing.setPostalCode(updated.getPostalCode());
        existing.setTaxId(updated.getTaxId());
        existing.setCreditLimit(updated.getCreditLimit());
        existing.setStatus(updated.getStatus());
        existing.setNotes(updated.getNotes());
        return customerRepository.save(existing);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
}

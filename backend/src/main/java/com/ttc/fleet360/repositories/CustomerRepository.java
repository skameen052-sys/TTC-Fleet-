package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByCustomerCode(String customerCode);
    List<Customer> findByStatus(String status);

    @Query("SELECT c FROM Customer c WHERE LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.contactPerson) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Customer> searchCustomers(String query);
}

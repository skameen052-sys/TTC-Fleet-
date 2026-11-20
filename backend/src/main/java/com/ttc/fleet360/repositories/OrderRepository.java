package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByStatus(String status);
    long countByStatus(String status);

    @Query("SELECT o FROM Order o WHERE LOWER(o.orderNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.customerName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Order> searchOrders(String query);
}

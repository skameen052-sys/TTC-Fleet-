package com.fleet360.repository;

import com.fleet360.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {
    Optional<CustomerOrder> findByOrderId(String orderId);
    List<CustomerOrder> findByCustomerId(String customerId);
    List<CustomerOrder> findByOrderStatus(String orderStatus);
}

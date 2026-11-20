package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.Order;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders(String status, String search) {
        if (search != null && !search.isBlank()) {
            return orderRepository.searchOrders(search.trim());
        }
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return orderRepository.findByStatus(status.toUpperCase());
        }
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
    }

    @Transactional
    public Order createOrder(Order order) {
        if (order.getOrderNumber() == null || order.getOrderNumber().isBlank()) {
            order.setOrderNumber("ORD-" + System.currentTimeMillis() % 1000000);
        }
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Long id, Order updated) {
        Order existing = getOrderById(id);
        existing.setCustomerName(updated.getCustomerName());
        existing.setRequiredDeliveryDate(updated.getRequiredDeliveryDate());
        existing.setStatus(updated.getStatus());
        existing.setPriority(updated.getPriority());
        existing.setPickupAddress(updated.getPickupAddress());
        existing.setDeliveryAddress(updated.getDeliveryAddress());
        existing.setTotalWeightKg(updated.getTotalWeightKg());
        existing.setTotalAmount(updated.getTotalAmount());
        existing.setNotes(updated.getNotes());
        return orderRepository.save(existing);
    }

    @Transactional
    public Order updateStatus(Long id, String status) {
        Order existing = getOrderById(id);
        existing.setStatus(status.toUpperCase());
        return orderRepository.save(existing);
    }

    @Transactional
    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }
}

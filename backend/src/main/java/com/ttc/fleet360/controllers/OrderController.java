package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.Order;
import com.ttc.fleet360.services.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<Order> list = orderService.getAllOrders(status, search);
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody Order order) {
        Order saved = orderService.createOrder(order);
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> updateOrder(
            @PathVariable Long id,
            @RequestBody Order order) {
        Order updated = orderService.updateOrder(id, order);
        return ResponseEntity.ok(ApiResponse.success("Order updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        Order updated = orderService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated to " + status, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order deleted successfully", null));
    }
}

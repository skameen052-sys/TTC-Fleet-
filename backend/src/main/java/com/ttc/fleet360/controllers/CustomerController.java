package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.Customer;
import com.ttc.fleet360.services.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<Customer> list = customerService.getAllCustomers(status, search);
        return ResponseEntity.ok(ApiResponse.success("Customers retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success(customer));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@RequestBody Customer customer) {
        Customer saved = customerService.createCustomer(customer);
        return ResponseEntity.ok(ApiResponse.success("Customer registered successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(
            @PathVariable Long id,
            @RequestBody Customer customer) {
        Customer updated = customerService.updateCustomer(id, customer);
        return ResponseEntity.ok(ApiResponse.success("Customer updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer removed successfully", null));
    }
}

package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.Shipment;
import com.ttc.fleet360.services.ShipmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {

    private final ShipmentService shipmentService;

    public ShipmentController(ShipmentService shipmentService) {
        this.shipmentService = shipmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Shipment>>> getAllShipments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        List<Shipment> list = shipmentService.getAllShipments(status, search);
        return ResponseEntity.ok(ApiResponse.success("Shipments retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Shipment>> getShipmentById(@PathVariable Long id) {
        Shipment shipment = shipmentService.getShipmentById(id);
        return ResponseEntity.ok(ApiResponse.success(shipment));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Shipment>> createShipment(@RequestBody Shipment shipment) {
        Shipment saved = shipmentService.createShipment(shipment);
        return ResponseEntity.ok(ApiResponse.success("Shipment dispatched successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Shipment>> updateShipment(
            @PathVariable Long id,
            @RequestBody Shipment shipment) {
        Shipment updated = shipmentService.updateShipment(id, shipment);
        return ResponseEntity.ok(ApiResponse.success("Shipment updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteShipment(@PathVariable Long id) {
        shipmentService.deleteShipment(id);
        return ResponseEntity.ok(ApiResponse.success("Shipment deleted successfully", null));
    }
}

package com.ttc.fleet360.controllers;

import com.ttc.fleet360.dto.ApiResponse;
import com.ttc.fleet360.entities.InventoryItem;
import com.ttc.fleet360.entities.StockMovement;
import com.ttc.fleet360.entities.Warehouse;
import com.ttc.fleet360.services.WarehouseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    // --- Warehouses ---
    @GetMapping
    public ResponseEntity<ApiResponse<List<Warehouse>>> getAllWarehouses() {
        List<Warehouse> list = warehouseService.getAllWarehouses();
        return ResponseEntity.ok(ApiResponse.success("Warehouses retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Warehouse>> getWarehouseById(@PathVariable Long id) {
        Warehouse warehouse = warehouseService.getWarehouseById(id);
        return ResponseEntity.ok(ApiResponse.success(warehouse));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Warehouse>> createWarehouse(@RequestBody Warehouse warehouse) {
        Warehouse saved = warehouseService.createWarehouse(warehouse);
        return ResponseEntity.ok(ApiResponse.success("Warehouse added successfully", saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Warehouse>> updateWarehouse(
            @PathVariable Long id,
            @RequestBody Warehouse warehouse) {
        Warehouse updated = warehouseService.updateWarehouse(id, warehouse);
        return ResponseEntity.ok(ApiResponse.success("Warehouse updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWarehouse(@PathVariable Long id) {
        warehouseService.deleteWarehouse(id);
        return ResponseEntity.ok(ApiResponse.success("Warehouse deleted successfully", null));
    }

    // --- Inventory Items ---
    @GetMapping("/inventory")
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getInventory(
            @RequestParam(required = false) String warehouseCode) {
        List<InventoryItem> items = warehouseService.getAllInventory(warehouseCode);
        return ResponseEntity.ok(ApiResponse.success("Inventory items retrieved", items));
    }

    @PostMapping("/inventory")
    public ResponseEntity<ApiResponse<InventoryItem>> createInventoryItem(@RequestBody InventoryItem item) {
        InventoryItem saved = warehouseService.createInventoryItem(item);
        return ResponseEntity.ok(ApiResponse.success("Inventory item added", saved));
    }

    @PutMapping("/inventory/{id}")
    public ResponseEntity<ApiResponse<InventoryItem>> updateInventoryItem(
            @PathVariable Long id,
            @RequestBody InventoryItem item) {
        InventoryItem updated = warehouseService.updateInventoryItem(id, item);
        return ResponseEntity.ok(ApiResponse.success("Inventory item updated", updated));
    }

    // --- Stock Movements ---
    @GetMapping("/movements")
    public ResponseEntity<ApiResponse<List<StockMovement>>> getMovements(
            @RequestParam(required = false) String warehouseCode) {
        List<StockMovement> list = warehouseService.getAllStockMovements(warehouseCode);
        return ResponseEntity.ok(ApiResponse.success("Stock movements retrieved", list));
    }

    @PostMapping("/movements")
    public ResponseEntity<ApiResponse<StockMovement>> recordMovement(@RequestBody StockMovement movement) {
        StockMovement saved = warehouseService.recordMovement(movement);
        return ResponseEntity.ok(ApiResponse.success("Stock movement logged", saved));
    }
}

package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.InventoryItem;
import com.ttc.fleet360.entities.StockMovement;
import com.ttc.fleet360.entities.Warehouse;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.InventoryItemRepository;
import com.ttc.fleet360.repositories.StockMovementRepository;
import com.ttc.fleet360.repositories.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final StockMovementRepository stockMovementRepository;

    public WarehouseService(WarehouseRepository warehouseRepository,
                            InventoryItemRepository inventoryItemRepository,
                            StockMovementRepository stockMovementRepository) {
        this.warehouseRepository = warehouseRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.stockMovementRepository = stockMovementRepository;
    }

    // --- Warehouses ---
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Warehouse getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Warehouse not found with ID: " + id));
    }

    @Transactional
    public Warehouse createWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    @Transactional
    public Warehouse updateWarehouse(Long id, Warehouse updated) {
        Warehouse existing = getWarehouseById(id);
        existing.setWarehouseName(updated.getWarehouseName());
        existing.setAddressLine(updated.getAddressLine());
        existing.setCity(updated.getCity());
        existing.setState(updated.getState());
        existing.setTotalCapacitySqFt(updated.getTotalCapacitySqFt());
        existing.setOccupiedCapacitySqFt(updated.getOccupiedCapacitySqFt());
        existing.setManagerName(updated.getManagerName());
        existing.setContactPhone(updated.getContactPhone());
        existing.setStatus(updated.getStatus());
        return warehouseRepository.save(existing);
    }

    @Transactional
    public void deleteWarehouse(Long id) {
        Warehouse warehouse = getWarehouseById(id);
        warehouseRepository.delete(warehouse);
    }

    // --- Inventory ---
    public List<InventoryItem> getAllInventory(String warehouseCode) {
        if (warehouseCode != null && !warehouseCode.isBlank() && !warehouseCode.equalsIgnoreCase("ALL")) {
            return inventoryItemRepository.findByWarehouseCode(warehouseCode);
        }
        return inventoryItemRepository.findAll();
    }

    @Transactional
    public InventoryItem createInventoryItem(InventoryItem item) {
        return inventoryItemRepository.save(item);
    }

    @Transactional
    public InventoryItem updateInventoryItem(Long id, InventoryItem updated) {
        InventoryItem existing = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found: " + id));
        existing.setItemName(updated.getItemName());
        existing.setCategory(updated.getCategory());
        existing.setQuantity(updated.getQuantity());
        existing.setUnit(updated.getUnit());
        existing.setMinThreshold(updated.getMinThreshold());
        existing.setUnitPrice(updated.getUnitPrice());
        existing.setLocationAisle(updated.getLocationAisle());
        existing.setWarehouseCode(updated.getWarehouseCode());
        return inventoryItemRepository.save(existing);
    }

    // --- Stock Movements ---
    public List<StockMovement> getAllStockMovements(String warehouseCode) {
        if (warehouseCode != null && !warehouseCode.isBlank() && !warehouseCode.equalsIgnoreCase("ALL")) {
            return stockMovementRepository.findByWarehouseCode(warehouseCode);
        }
        return stockMovementRepository.findAll();
    }

    @Transactional
    public StockMovement recordMovement(StockMovement movement) {
        return stockMovementRepository.save(movement);
    }
}

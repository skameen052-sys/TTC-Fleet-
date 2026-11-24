package com.fleet360.repository;

import com.fleet360.model.InventoryStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryStockRepository extends JpaRepository<InventoryStock, Long> {
    Optional<InventoryStock> findBySku(String sku);
    List<InventoryStock> findByWarehouseId(String warehouseId);
}

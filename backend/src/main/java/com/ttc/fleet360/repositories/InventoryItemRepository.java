package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Long> {
    Optional<InventoryItem> findByItemCode(String itemCode);
    List<InventoryItem> findByWarehouseCode(String warehouseCode);
}

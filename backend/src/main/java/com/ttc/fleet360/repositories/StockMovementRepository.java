package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByWarehouseCode(String warehouseCode);
    List<StockMovement> findByItemCode(String itemCode);
}

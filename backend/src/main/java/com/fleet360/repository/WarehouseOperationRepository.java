package com.fleet360.repository;

import com.fleet360.model.WarehouseOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WarehouseOperationRepository extends JpaRepository<WarehouseOperation, Long> {
    Optional<WarehouseOperation> findByOperationId(String operationId);
    List<WarehouseOperation> findByWarehouseId(String warehouseId);
    List<WarehouseOperation> findByShipmentId(String shipmentId);
    List<WarehouseOperation> findByStatus(String status);
}

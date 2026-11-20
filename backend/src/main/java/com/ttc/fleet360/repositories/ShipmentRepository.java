package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    Optional<Shipment> findByShipmentNumber(String shipmentNumber);
    Optional<Shipment> findByTrackingCode(String trackingCode);
    List<Shipment> findByStatus(String status);
    long countByStatus(String status);

    @Query("SELECT s FROM Shipment s WHERE LOWER(s.shipmentNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.trackingCode) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.vehiclePlate) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.originCity) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.destinationCity) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Shipment> searchShipments(String query);
}

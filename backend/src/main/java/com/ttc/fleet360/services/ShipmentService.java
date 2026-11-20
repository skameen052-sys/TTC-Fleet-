package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.Shipment;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.ShipmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;

    public ShipmentService(ShipmentRepository shipmentRepository) {
        this.shipmentRepository = shipmentRepository;
    }

    public List<Shipment> getAllShipments(String status, String search) {
        if (search != null && !search.isBlank()) {
            return shipmentRepository.searchShipments(search.trim());
        }
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return shipmentRepository.findByStatus(status.toUpperCase());
        }
        return shipmentRepository.findAll();
    }

    public Shipment getShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found with ID: " + id));
    }

    @Transactional
    public Shipment createShipment(Shipment shipment) {
        if (shipment.getShipmentNumber() == null || shipment.getShipmentNumber().isBlank()) {
            shipment.setShipmentNumber("SHP-" + (System.currentTimeMillis() % 100000));
        }
        if (shipment.getTrackingCode() == null || shipment.getTrackingCode().isBlank()) {
            shipment.setTrackingCode("TRK-" + (System.currentTimeMillis() % 100000));
        }
        return shipmentRepository.save(shipment);
    }

    @Transactional
    public Shipment updateShipment(Long id, Shipment updated) {
        Shipment existing = getShipmentById(id);
        existing.setVehiclePlate(updated.getVehiclePlate());
        existing.setDriverName(updated.getDriverName());
        existing.setStatus(updated.getStatus());
        existing.setOriginCity(updated.getOriginCity());
        existing.setDestinationCity(updated.getDestinationCity());
        existing.setEstimatedDeparture(updated.getEstimatedDeparture());
        existing.setActualDeparture(updated.getActualDeparture());
        existing.setEstimatedArrival(updated.getEstimatedArrival());
        existing.setActualArrival(updated.getActualArrival());
        existing.setCargoDescription(updated.getCargoDescription());
        existing.setWeightKg(updated.getWeightKg());
        existing.setCurrentLocation(updated.getCurrentLocation());
        existing.setDelayReason(updated.getDelayReason());
        return shipmentRepository.save(existing);
    }

    @Transactional
    public void deleteShipment(Long id) {
        Shipment shipment = getShipmentById(id);
        shipmentRepository.delete(shipment);
    }
}

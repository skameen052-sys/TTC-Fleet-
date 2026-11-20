package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.FuelRecord;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.FuelRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class FuelService {

    private final FuelRecordRepository fuelRecordRepository;

    public FuelService(FuelRecordRepository fuelRecordRepository) {
        this.fuelRecordRepository = fuelRecordRepository;
    }

    public List<FuelRecord> getAllFuelRecords(String vehiclePlate) {
        if (vehiclePlate != null && !vehiclePlate.isBlank() && !vehiclePlate.equalsIgnoreCase("ALL")) {
            return fuelRecordRepository.findByVehiclePlate(vehiclePlate.trim());
        }
        return fuelRecordRepository.findAll();
    }

    public FuelRecord getFuelRecordById(Long id) {
        return fuelRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fuel record not found with ID: " + id));
    }

    @Transactional
    public FuelRecord createFuelRecord(FuelRecord record) {
        if (record.getTotalCost() == null && record.getLiters() != null && record.getCostPerLiter() != null) {
            record.setTotalCost(record.getCostPerLiter().multiply(BigDecimal.valueOf(record.getLiters())));
        }
        return fuelRecordRepository.save(record);
    }

    @Transactional
    public FuelRecord updateFuelRecord(Long id, FuelRecord updated) {
        FuelRecord existing = getFuelRecordById(id);
        existing.setVehiclePlate(updated.getVehiclePlate());
        existing.setDriverName(updated.getDriverName());
        existing.setRecordDate(updated.getRecordDate());
        existing.setLiters(updated.getLiters());
        existing.setCostPerLiter(updated.getCostPerLiter());
        existing.setTotalCost(updated.getTotalCost());
        existing.setOdometerReading(updated.getOdometerReading());
        existing.setFuelStation(updated.getFuelStation());
        existing.setPaymentMethod(updated.getPaymentMethod());
        existing.setReceiptNumber(updated.getReceiptNumber());
        existing.setNotes(updated.getNotes());
        return fuelRecordRepository.save(existing);
    }

    @Transactional
    public void deleteFuelRecord(Long id) {
        FuelRecord record = getFuelRecordById(id);
        fuelRecordRepository.delete(record);
    }
}

package com.fleet360.service;

import com.fleet360.model.FuelRecord;
import com.fleet360.repository.FuelRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FuelService {
    private final FuelRepository fuelRepository;

    public FuelService(FuelRepository fuelRepository) {
        this.fuelRepository = fuelRepository;
    }

    public List<FuelRecord> getAllFuelRecords() {
        return fuelRepository.findAllByOrderByRecordDateDesc();
    }

    public List<FuelRecord> getVehicleFuelRecords(String vehicleReg) {
        return fuelRepository.findByVehicleRegOrderByRecordDateDesc(vehicleReg);
    }

    public FuelRecord addFuelRecord(@NonNull FuelRecord record) {
        return fuelRepository.save(record);
    }
}

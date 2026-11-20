package com.fleet360.service;

import com.fleet360.model.VehicleInspection;
import com.fleet360.repository.InspectionRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InspectionService {
    private final InspectionRepository inspectionRepository;

    public InspectionService(InspectionRepository inspectionRepository) {
        this.inspectionRepository = inspectionRepository;
    }

    public List<VehicleInspection> getAllInspections() {
        return inspectionRepository.findAll();
    }

    public VehicleInspection recordInspection(@NonNull VehicleInspection inspection) {
        return inspectionRepository.save(inspection);
    }
}

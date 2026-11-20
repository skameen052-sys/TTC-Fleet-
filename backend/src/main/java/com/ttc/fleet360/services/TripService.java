package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.Trip;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.TripRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    public List<Trip> getAllTrips(String status, String search) {
        if (search != null && !search.isBlank()) {
            return tripRepository.searchTrips(search.trim());
        }
        if (status != null && !status.equalsIgnoreCase("ALL")) {
            return tripRepository.findByStatus(status.toUpperCase());
        }
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with ID: " + id));
    }

    @Transactional
    public Trip createTrip(Trip trip) {
        if (trip.getTripNumber() == null || trip.getTripNumber().isBlank()) {
            trip.setTripNumber("TRIP-" + (System.currentTimeMillis() % 100000));
        }
        return tripRepository.save(trip);
    }

    @Transactional
    public Trip updateTrip(Long id, Trip updated) {
        Trip existing = getTripById(id);
        existing.setVehiclePlate(updated.getVehiclePlate());
        existing.setDriverName(updated.getDriverName());
        existing.setOrigin(updated.getOrigin());
        existing.setDestination(updated.getDestination());
        existing.setPlannedStartTime(updated.getPlannedStartTime());
        existing.setActualStartTime(updated.getActualStartTime());
        existing.setPlannedEndTime(updated.getPlannedEndTime());
        existing.setActualEndTime(updated.getActualEndTime());
        existing.setDistanceKm(updated.getDistanceKm());
        existing.setFuelUsedLiters(updated.getFuelUsedLiters());
        existing.setStatus(updated.getStatus());
        existing.setRouteCode(updated.getRouteCode());
        existing.setRemarks(updated.getRemarks());
        return tripRepository.save(existing);
    }

    @Transactional
    public void deleteTrip(Long id) {
        Trip trip = getTripById(id);
        tripRepository.delete(trip);
    }
}

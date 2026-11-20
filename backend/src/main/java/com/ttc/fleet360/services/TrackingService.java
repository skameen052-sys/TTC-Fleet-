package com.ttc.fleet360.services;

import com.ttc.fleet360.entities.GpsLocation;
import com.ttc.fleet360.entities.Route;
import com.ttc.fleet360.exceptions.ResourceNotFoundException;
import com.ttc.fleet360.repositories.GpsLocationRepository;
import com.ttc.fleet360.repositories.RouteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class TrackingService {

    private final GpsLocationRepository gpsLocationRepository;
    private final RouteRepository routeRepository;

    public TrackingService(GpsLocationRepository gpsLocationRepository, RouteRepository routeRepository) {
        this.gpsLocationRepository = gpsLocationRepository;
        this.routeRepository = routeRepository;
    }

    // --- GPS Tracking ---
    public List<GpsLocation> getAllLocations() {
        return gpsLocationRepository.findAll();
    }

    public GpsLocation getLocationByVehicle(String vehiclePlate) {
        return gpsLocationRepository.findByVehiclePlate(vehiclePlate)
                .orElseThrow(() -> new ResourceNotFoundException("No GPS telemetry for vehicle: " + vehiclePlate));
    }

    @Transactional
    public GpsLocation updateVehicleLocation(String vehiclePlate, Double lat, Double lng, Double speed, String address) {
        GpsLocation loc = gpsLocationRepository.findByVehiclePlate(vehiclePlate)
                .orElse(new GpsLocation());
        loc.setVehiclePlate(vehiclePlate);
        loc.setLatitude(lat);
        loc.setLongitude(lng);
        loc.setSpeedKmph(speed);
        loc.setCurrentAddress(address);
        loc.setLastPingAt(Instant.now());
        return gpsLocationRepository.save(loc);
    }

    // --- Route Management ---
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    public Route getRouteById(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with ID: " + id));
    }

    @Transactional
    public Route createRoute(Route route) {
        return routeRepository.save(route);
    }

    @Transactional
    public Route updateRoute(Long id, Route updated) {
        Route existing = getRouteById(id);
        existing.setRouteName(updated.getRouteName());
        existing.setOriginCity(updated.getOriginCity());
        existing.setDestinationCity(updated.getDestinationCity());
        existing.setDistanceKm(updated.getDistanceKm());
        existing.setEstimatedDurationHours(updated.getEstimatedDurationHours());
        existing.setWaypointsSummary(updated.getWaypointsSummary());
        existing.setTollExpenses(updated.getTollExpenses());
        existing.setStatus(updated.getStatus());
        return routeRepository.save(existing);
    }

    @Transactional
    public void deleteRoute(Long id) {
        Route route = getRouteById(id);
        routeRepository.delete(route);
    }
}

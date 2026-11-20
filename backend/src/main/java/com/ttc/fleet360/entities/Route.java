package com.ttc.fleet360.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "route_code", nullable = false, unique = true, length = 40)
    private String routeCode;

    @Column(name = "route_name", nullable = false, length = 150)
    private String routeName;

    @Column(name = "origin_city", nullable = false, length = 100)
    private String originCity;

    @Column(name = "destination_city", nullable = false, length = 100)
    private String destinationCity;

    @Column(name = "distance_km", nullable = false)
    private Double distanceKm;

    @Column(name = "estimated_duration_hours")
    private Double estimatedDurationHours;

    @Column(name = "waypoints_summary", columnDefinition = "TEXT")
    private String waypointsSummary;

    @Column(name = "toll_expenses")
    private BigDecimal tollExpenses = BigDecimal.valueOf(1200.0);

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, DIVERTED

    @Column(name = "created_at", updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    private Instant updatedAt = Instant.now();

    public Route() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRouteCode() { return routeCode; }
    public void setRouteCode(String routeCode) { this.routeCode = routeCode; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public String getOriginCity() { return originCity; }
    public void setOriginCity(String originCity) { this.originCity = originCity; }
    public String getDestinationCity() { return destinationCity; }
    public void setDestinationCity(String destinationCity) { this.destinationCity = destinationCity; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public Double getEstimatedDurationHours() { return estimatedDurationHours; }
    public void setEstimatedDurationHours(Double estimatedDurationHours) { this.estimatedDurationHours = estimatedDurationHours; }
    public String getWaypointsSummary() { return waypointsSummary; }
    public void setWaypointsSummary(String waypointsSummary) { this.waypointsSummary = waypointsSummary; }
    public BigDecimal getTollExpenses() { return tollExpenses; }
    public void setTollExpenses(BigDecimal tollExpenses) { this.tollExpenses = tollExpenses; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

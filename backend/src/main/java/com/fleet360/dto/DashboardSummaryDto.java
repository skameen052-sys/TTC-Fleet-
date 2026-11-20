package com.fleet360.dto;

import java.io.Serializable;

public class DashboardSummaryDto implements Serializable {
    private static final long serialVersionUID = 1L;

    private long totalVehicles;
    private long activeVehicles;
    private long availableVehicles;
    private long vehiclesOnTrip;
    private long vehiclesUnderMaintenance;
    private long inactiveVehicles;
    private long totalDrivers;
    private long availableDrivers;

    public DashboardSummaryDto() {}

    public DashboardSummaryDto(long totalVehicles, long activeVehicles, long availableVehicles,
                               long vehiclesOnTrip, long vehiclesUnderMaintenance, long inactiveVehicles,
                               long totalDrivers, long availableDrivers) {
        this.totalVehicles = totalVehicles;
        this.activeVehicles = activeVehicles;
        this.availableVehicles = availableVehicles;
        this.vehiclesOnTrip = vehiclesOnTrip;
        this.vehiclesUnderMaintenance = vehiclesUnderMaintenance;
        this.inactiveVehicles = inactiveVehicles;
        this.totalDrivers = totalDrivers;
        this.availableDrivers = availableDrivers;
    }

    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }
    public long getActiveVehicles() { return activeVehicles; }
    public void setActiveVehicles(long activeVehicles) { this.activeVehicles = activeVehicles; }
    public long getAvailableVehicles() { return availableVehicles; }
    public void setAvailableVehicles(long availableVehicles) { this.availableVehicles = availableVehicles; }
    public long getVehiclesOnTrip() { return vehiclesOnTrip; }
    public void setVehiclesOnTrip(long vehiclesOnTrip) { this.vehiclesOnTrip = vehiclesOnTrip; }
    public long getVehiclesUnderMaintenance() { return vehiclesUnderMaintenance; }
    public void setVehiclesUnderMaintenance(long vehiclesUnderMaintenance) { this.vehiclesUnderMaintenance = vehiclesUnderMaintenance; }
    public long getInactiveVehicles() { return inactiveVehicles; }
    public void setInactiveVehicles(long inactiveVehicles) { this.inactiveVehicles = inactiveVehicles; }
    public long getTotalDrivers() { return totalDrivers; }
    public void setTotalDrivers(long totalDrivers) { this.totalDrivers = totalDrivers; }
    public long getAvailableDrivers() { return availableDrivers; }
    public void setAvailableDrivers(long availableDrivers) { this.availableDrivers = availableDrivers; }
}

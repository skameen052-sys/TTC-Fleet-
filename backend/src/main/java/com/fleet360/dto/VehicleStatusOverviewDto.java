package com.fleet360.dto;

import java.io.Serializable;

public class VehicleStatusOverviewDto implements Serializable {
    private static final long serialVersionUID = 1L;

    public static class StatusCount implements Serializable {
        private long count;
        private int percent;

        public StatusCount() {}
        public StatusCount(long count, int percent) {
            this.count = count;
            this.percent = percent;
        }
        public long getCount() { return count; }
        public void setCount(long count) { this.count = count; }
        public int getPercent() { return percent; }
        public void setPercent(int percent) { this.percent = percent; }
    }

    private StatusCount available;
    private StatusCount onTrip;
    private StatusCount waiting;
    private StatusCount maintenance;
    private StatusCount outOfService;
    private long total;

    public VehicleStatusOverviewDto() {}

    public StatusCount getAvailable() { return available; }
    public void setAvailable(StatusCount available) { this.available = available; }
    public StatusCount getOnTrip() { return onTrip; }
    public void setOnTrip(StatusCount onTrip) { this.onTrip = onTrip; }
    public StatusCount getWaiting() { return waiting; }
    public void setWaiting(StatusCount waiting) { this.waiting = waiting; }
    public StatusCount getMaintenance() { return maintenance; }
    public void setMaintenance(StatusCount maintenance) { this.maintenance = maintenance; }
    public StatusCount getOutOfService() { return outOfService; }
    public void setOutOfService(StatusCount outOfService) { this.outOfService = outOfService; }
    public long getTotal() { return total; }
    public void setTotal(long total) { this.total = total; }
}

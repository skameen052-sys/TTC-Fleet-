package com.ttc.fleet360.services;

import com.ttc.fleet360.repositories.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class ReportService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final ShipmentRepository shipmentRepository;
    private final TripRepository tripRepository;
    private final FuelRecordRepository fuelRecordRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final InvoiceRepository invoiceRepository;

    public ReportService(VehicleRepository vehicleRepository,
                         DriverRepository driverRepository,
                         ShipmentRepository shipmentRepository,
                         TripRepository tripRepository,
                         FuelRecordRepository fuelRecordRepository,
                         MaintenanceRecordRepository maintenanceRecordRepository,
                         InvoiceRepository invoiceRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.shipmentRepository = shipmentRepository;
        this.tripRepository = tripRepository;
        this.fuelRecordRepository = fuelRecordRepository;
        this.maintenanceRecordRepository = maintenanceRecordRepository;
        this.invoiceRepository = invoiceRepository;
    }

    public Map<String, Object> getComprehensiveReport() {
        Map<String, Object> report = new HashMap<>();

        // Fleet metrics
        long totalVehicles = vehicleRepository.count();
        long activeVehicles = vehicleRepository.countByStatus("ACTIVE");
        long availableVehicles = vehicleRepository.countByAvailability("AVAILABLE");

        // Driver metrics
        long totalDrivers = driverRepository.count();
        long availableDrivers = driverRepository.countByAvailability("AVAILABLE");

        // Shipments & Trips
        long totalShipments = shipmentRepository.count();
        long activeShipments = shipmentRepository.countByStatus("IN_TRANSIT");
        long deliveredShipments = shipmentRepository.countByStatus("DELIVERED");
        long totalTrips = tripRepository.count();
        long activeTrips = tripRepository.countByStatus("ACTIVE");

        // Financials
        BigDecimal paidRevenue = invoiceRepository.sumPaidRevenue();
        BigDecimal pendingRevenue = invoiceRepository.sumPendingRevenue();
        BigDecimal fuelExpenses = fuelRecordRepository.sumTotalFuelCost();
        BigDecimal maintenanceExpenses = maintenanceRecordRepository.sumTotalMaintenanceCost();

        report.put("totalVehicles", totalVehicles);
        report.put("activeVehicles", activeVehicles);
        report.put("availableVehicles", availableVehicles);
        report.put("totalDrivers", totalDrivers);
        report.put("availableDrivers", availableDrivers);
        report.put("totalShipments", totalShipments);
        report.put("activeShipments", activeShipments);
        report.put("deliveredShipments", deliveredShipments);
        report.put("totalTrips", totalTrips);
        report.put("activeTrips", activeTrips);
        report.put("paidRevenue", paidRevenue);
        report.put("pendingRevenue", pendingRevenue);
        report.put("fuelExpenses", fuelExpenses);
        report.put("maintenanceExpenses", maintenanceExpenses);

        // Performance series
        report.put("monthlyLabels", List.of("Jun", "Jul", "Aug", "Sep", "Oct", "Nov"));
        report.put("revenueMonthly", List.of(340000, 480000, 520000, 610000, 590000, 720000));
        report.put("expenseMonthly", List.of(120000, 160000, 150000, 190000, 175000, 210000));

        return report;
    }
}

package com.fleet360.config;

import com.fleet360.model.*;
import com.fleet360.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final GpsTrackingRepository gpsRepository;
    private final FuelRepository fuelRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final AssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           VehicleRepository vehicleRepository,
                           DriverRepository driverRepository,
                           GpsTrackingRepository gpsRepository,
                           FuelRepository fuelRepository,
                           MaintenanceRepository maintenanceRepository,
                           AssignmentRepository assignmentRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.gpsRepository = gpsRepository;
        this.fuelRepository = fuelRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.assignmentRepository = assignmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Fleet Manager user
            User manager = new User(
                    "fleetmanager",
                    "alex.mercer@fleet360.ttc.com",
                    passwordEncoder.encode("password123"),
                    "Alexandre Mercer",
                    Role.ROLE_FLEET_MANAGER
            );
            userRepository.save(manager);

            // Seed Driver user
            User driver = new User(
                    "driver01",
                    "m.vance@fleet360.ttc.com",
                    passwordEncoder.encode("password123"),
                    "Marcus Vance",
                    Role.ROLE_DRIVER
            );
            userRepository.save(driver);
        }

        if (vehicleRepository.count() == 0) {
            // Seed Vehicles
            Vehicle v1 = new Vehicle("TTC-8492-HD", "1FUJG6AV9NL109283", "Freightliner", "Cascadia Evolution", 2023,
                    "Heavy Duty Truck", "On Trip", "Diesel", 74210, 24000, 98,
                    "I-90 East Mile 142, Toledo OH", "D-01", "Marcus Vance", "7.4 mpg");

            Vehicle v2 = new Vehicle("TTC-8493-HD", "4V4NC9EH7KN209482", "Volvo", "VNL 860 Globetrotter", 2024,
                    "Heavy Duty Truck", "On Trip", "Diesel", 41800, 25000, 100,
                    "I-80 West, South Bend IN", "D-02", "Elena Rostova", "7.8 mpg");

            Vehicle v3 = new Vehicle("TTC-3105-EV", "7G2EV34A8PP001294", "Tesla", "Semi 500-Mile", 2024,
                    "Electric Cargo", "Available", "Electric", 28400, 22000, 99,
                    "Central Depot Bay 4, Chicago IL", null, null, "1.7 kWh/mi");

            Vehicle v4 = new Vehicle("TTC-3106-EV", "1BDZ600EVPR889201", "BrightDrop", "Zevo 600 AWD", 2023,
                    "Electric Cargo", "On Trip", "Electric", 36250, 4500, 96,
                    "Downtown Loop Corridor, Chicago IL", "D-03", "Jamal Jenkins", "0.85 kWh/mi");

            Vehicle v5 = new Vehicle("TTC-5520-RF", "3HAP98RF0MM445129", "Isuzu", "NQR ThermoKing Reefer", 2022,
                    "Refrigerated Truck", "On Trip", "Diesel", 92300, 12000, 94,
                    "Hwy 41 North, Milwaukee WI", "D-04", "Sarah Chen", "9.2 mpg");

            Vehicle v6 = new Vehicle("TTC-5521-RF", "2HNY195RFNN339182", "Hino", "195 XL ColdChain", 2023,
                    "Refrigerated Truck", "Waiting for Assignment", "Diesel", 51200, 11500, 97,
                    "Logistics Hub East, Gary IN", null, null, "9.6 mpg");

            Vehicle v7 = new Vehicle("TTC-7201-DV", "WD3PE7CC2NP391024", "Mercedes-Benz", "Sprinter 2500 High Roof", 2023,
                    "Delivery Cargo Van", "On Trip", "Diesel", 63100, 3800, 95,
                    "Oak Brook Distribution Center, IL", "D-05", "Mateo Rodriguez", "18.4 mpg");

            Vehicle v8 = new Vehicle("TTC-7202-DV", "3C6TRVDG5NE192840", "Ram", "ProMaster 3500 Cargo", 2023,
                    "Delivery Cargo Van", "Available", "Gasoline", 48900, 4000, 98,
                    "Central Depot Bay 12, Chicago IL", null, null, "16.2 mpg");

            Vehicle v9 = new Vehicle("TTC-1088-UT", "1FTNE3FL4PK891023", "Ford", "Transit Connect Service", 2021,
                    "Utility Van", "Under Maintenance", "Gasoline", 114500, 1800, 89,
                    "TTC Certified Service Shop, Gary IN", null, null, "24.1 mpg");

            Vehicle v10 = new Vehicle("TTC-1089-UT", "1GBHG31L5D1198273", "Chevrolet", "Express 3500 Utility", 2020,
                    "Utility Van", "Out of Service", "Gasoline", 168900, 2100, 78,
                    "Central Yard - Staging Area B, Chicago IL", null, null, "14.2 mpg");

            vehicleRepository.save(v1);
            vehicleRepository.save(v2);
            vehicleRepository.save(v3);
            vehicleRepository.save(v4);
            vehicleRepository.save(v5);
            vehicleRepository.save(v6);
            vehicleRepository.save(v7);
            vehicleRepository.save(v8);
            vehicleRepository.save(v9);
            vehicleRepository.save(v10);
        }

        if (driverRepository.count() == 0) {
            // Seed Drivers
            driverRepository.save(new Driver("D-01", "Marcus Vance", "CDL-IL-9840192", "+1 (312) 555-0143",
                    "m.vance@fleet360.ttc.com", "On Duty", 4.95, 12, 98, "TTC-8492-HD", 482));
            driverRepository.save(new Driver("D-02", "Elena Rostova", "CDL-IN-3920194", "+1 (219) 555-0182",
                    "e.rostova@fleet360.ttc.com", "On Duty", 4.98, 9, 99, "TTC-8493-HD", 340));
            driverRepository.save(new Driver("D-03", "Jamal Jenkins", "CDL-IL-8849201", "+1 (773) 555-0199",
                    "j.jenkins@fleet360.ttc.com", "On Duty", 4.88, 6, 95, "TTC-3106-EV", 215));
            driverRepository.save(new Driver("D-04", "Sarah Chen", "CDL-WI-1928490", "+1 (414) 555-0128",
                    "s.chen@fleet360.ttc.com", "On Duty", 4.92, 8, 97, "TTC-5520-RF", 310));
            driverRepository.save(new Driver("D-05", "Mateo Rodriguez", "CDL-IL-7740192", "+1 (847) 555-0164",
                    "m.rodriguez@fleet360.ttc.com", "On Duty", 4.89, 5, 96, "TTC-7201-DV", 198));
            driverRepository.save(new Driver("D-08", "Travis Miller", "CDL-OH-8820193", "+1 (614) 555-0155",
                    "t.miller@fleet360.ttc.com", "Available", 4.84, 4, 93, null, 145));
            driverRepository.save(new Driver("D-09", "Chloe Dubois", "CDL-MI-7729103", "+1 (313) 555-0144",
                    "c.dubois@fleet360.ttc.com", "Available", 4.96, 10, 99, null, 410));
        }

        if (gpsRepository.count() == 0) {
            // Seed GPS telemetry
            gpsRepository.save(new LiveGpsLocation("TTC-8492-HD", "Heavy Duty Truck", "Marcus Vance", "+1 (312) 555-0143",
                    41.6528, -83.5379, 68, 95, "On Trip", "Cleveland Freight Terminal, OH", "Chicago Central Depot", "1h 45m", "74% Diesel", "74,210 km"));
            gpsRepository.save(new LiveGpsLocation("TTC-8493-HD", "Heavy Duty Truck", "Elena Rostova", "+1 (219) 555-0182",
                    41.6764, -86.2520, 72, 260, "On Trip", "Chicago Central Depot, IL", "Detroit Logistics Hub", "1h 20m", "81% Diesel", "41,800 km"));
            gpsRepository.save(new LiveGpsLocation("TTC-3106-EV", "Electric Cargo", "Jamal Jenkins", "+1 (773) 555-0199",
                    41.8781, -87.6298, 38, 180, "On Trip", "South Loop Commerce Hub, IL", "Fulton Market Micro-Hub", "25m", "68% (Electric)", "36,250 km"));
            gpsRepository.save(new LiveGpsLocation("TTC-3105-EV", "Electric Cargo", "Unassigned", "N/A",
                    41.8600, -87.6500, 0, 0, "Available", "Stationary - Standby", "Central Depot Bay 4", "Ready", "100%", "28,400 km"));
        }

        if (fuelRepository.count() == 0) {
            fuelRepository.save(new FuelRecord("TTC-8492-HD", LocalDate.now().minusDays(1), 380.0, 475.0, 74120, "Pilot Travel Center #412", true));
            fuelRepository.save(new FuelRecord("TTC-8493-HD", LocalDate.now().minusDays(1), 410.0, 512.5, 41650, "Love's Travel Stop #718", true));
            fuelRepository.save(new FuelRecord("TTC-7201-DV", LocalDate.now().minusDays(2), 85.0, 106.25, 63020, "Shell Fleet Depot", true));
        }

        if (maintenanceRepository.count() == 0) {
            maintenanceRepository.save(new MaintenanceRecord("TTC-1088-UT", "Transmission Fluid Flush",
                    "Overhaul & torque converter diagnostic", "Under Repair", LocalDate.now().minusDays(2), null, 1480.0, "TTC Certified Shop, Gary IN", "High"));
            maintenanceRepository.save(new MaintenanceRecord("TTC-7203-DV", "Brake Caliper Replacement",
                    "Front axle pad wear limit reached", "Under Repair", LocalDate.now().minusDays(1), null, 890.0, "Northside Fleet Hub", "High"));
            maintenanceRepository.save(new MaintenanceRecord("TTC-8495-HD", "A-Service PM Inspection",
                    "Routine 60,000 km lube and steering linkage check", "Upcoming", LocalDate.now().plusDays(4), null, 650.0, "Central Depot Main Service Bay", "Routine"));
        }

        if (assignmentRepository.count() == 0) {
            assignmentRepository.save(new VehicleAssignment("TTC-8492-HD", "D-01", "Marcus Vance",
                    "Midwest Express (Chicago -> Toledo -> Cleveland)", "2026-11-19 06:30", "Active", "2026-11-20 20:00"));
            assignmentRepository.save(new VehicleAssignment("TTC-8493-HD", "D-02", "Elena Rostova",
                    "Automotive Corridor (Detroit -> South Bend -> Chicago)", "2026-11-19 07:15", "Active", "2026-11-20 18:30"));
        }
    }
}

package com.ttc.fleet360.config;

import com.ttc.fleet360.entities.*;
import com.ttc.fleet360.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final UserRepository userRepository;
    private final BranchRepository branchRepository;
    private final BranchUserRepository branchUserRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PaymentRecordRepository paymentRecordRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final AuditLogRepository auditLogRepository;
    private final LoginHistoryRepository loginHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    // Logistics Repositories
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final ShipmentRepository shipmentRepository;
    private final TripRepository tripRepository;
    private final GpsLocationRepository gpsLocationRepository;
    private final RouteRepository routeRepository;
    private final FuelRecordRepository fuelRecordRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final StockMovementRepository stockMovementRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final NotificationRepository notificationRepository;

    public DataInitializer(RoleRepository roleRepository,
                           PermissionRepository permissionRepository,
                           UserRepository userRepository,
                           BranchRepository branchRepository,
                           BranchUserRepository branchUserRepository,
                           CompanyProfileRepository companyProfileRepository,
                           SubscriptionPlanRepository subscriptionPlanRepository,
                           SubscriptionRepository subscriptionRepository,
                           PaymentRecordRepository paymentRecordRepository,
                           SystemSettingRepository systemSettingRepository,
                           AuditLogRepository auditLogRepository,
                           LoginHistoryRepository loginHistoryRepository,
                           PasswordEncoder passwordEncoder,
                           VehicleRepository vehicleRepository,
                           DriverRepository driverRepository,
                           CustomerRepository customerRepository,
                           OrderRepository orderRepository,
                           ShipmentRepository shipmentRepository,
                           TripRepository tripRepository,
                           GpsLocationRepository gpsLocationRepository,
                           RouteRepository routeRepository,
                           FuelRecordRepository fuelRecordRepository,
                           MaintenanceRecordRepository maintenanceRecordRepository,
                           WarehouseRepository warehouseRepository,
                           InventoryItemRepository inventoryItemRepository,
                           StockMovementRepository stockMovementRepository,
                           InvoiceRepository invoiceRepository,
                           PaymentTransactionRepository paymentTransactionRepository,
                           NotificationRepository notificationRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
        this.userRepository = userRepository;
        this.branchRepository = branchRepository;
        this.branchUserRepository = branchUserRepository;
        this.companyProfileRepository = companyProfileRepository;
        this.subscriptionPlanRepository = subscriptionPlanRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.paymentRecordRepository = paymentRecordRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.auditLogRepository = auditLogRepository;
        this.loginHistoryRepository = loginHistoryRepository;
        this.passwordEncoder = passwordEncoder;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.customerRepository = customerRepository;
        this.orderRepository = orderRepository;
        this.shipmentRepository = shipmentRepository;
        this.tripRepository = tripRepository;
        this.gpsLocationRepository = gpsLocationRepository;
        this.routeRepository = routeRepository;
        this.fuelRecordRepository = fuelRecordRepository;
        this.maintenanceRecordRepository = maintenanceRecordRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.stockMovementRepository = stockMovementRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() == 0) {
            log.info("Seeding initial TTC Fleet360 data...");
            seedPermissionsAndRoles();
            seedUsers();
            seedBranches();
            seedCompanyProfile();
            seedSubscriptionPlansAndSubscriptions();
            seedSystemSettings();
            seedAuditLogs();
        }

        if (vehicleRepository.count() == 0) {
            log.info("Seeding comprehensive TTC Fleet360 Logistics modules...");
            seedLogisticsModules();
            log.info("TTC Fleet360 logistics data successfully seeded!");
        }
    }

    private void seedPermissionsAndRoles() {
        List<Permission> perms = List.of(
            new Permission("AUTH_LOGIN", "AUTH", "Login and authenticate with JWT"),
            new Permission("AUTH_LOGOUT", "AUTH", "Logout and invalidate session"),
            new Permission("USER_CREATE", "USERS", "Create new system users"),
            new Permission("USER_READ", "USERS", "View user lists and profiles"),
            new Permission("USER_UPDATE", "USERS", "Update existing user profiles"),
            new Permission("USER_DELETE", "USERS", "Delete or deactivate users"),
            new Permission("ROLE_MANAGE", "ROLES", "Manage roles and permissions"),
            new Permission("BRANCH_CREATE", "BRANCHES", "Create regional branches and hubs"),
            new Permission("BRANCH_READ", "BRANCHES", "View branch information and allocation"),
            new Permission("BRANCH_UPDATE", "BRANCHES", "Update branch details"),
            new Permission("BRANCH_DELETE", "BRANCHES", "Remove or close branches"),
            new Permission("COMPANY_READ", "COMPANY", "View enterprise company profile"),
            new Permission("COMPANY_UPDATE", "COMPANY", "Edit enterprise profile and brand assets"),
            new Permission("SUBSCRIPTION_READ", "SUBSCRIPTIONS", "View active plans and renewals"),
            new Permission("SUBSCRIPTION_MANAGE", "SUBSCRIPTIONS", "Create and modify subscription tiers"),
            new Permission("CONFIG_READ", "SETTINGS", "View system parameters"),
            new Permission("CONFIG_UPDATE", "SETTINGS", "Update system settings"),
            new Permission("AUDIT_READ", "AUDIT", "View audit trails and user activities")
        );
        permissionRepository.saveAll(perms);

        Set<Permission> allPerms = new HashSet<>(permissionRepository.findAll());
        Set<Permission> adminPerms = new HashSet<>(permissionRepository.findAll().stream()
                .filter(p -> !p.getName().equals("ROLE_MANAGE"))
                .toList());

        Role superAdmin = new Role("ROLE_SUPER_ADMIN", "Super Administrator with complete system access");
        superAdmin.setPermissions(allPerms);

        Role admin = new Role("ROLE_ADMIN", "Administrator with operational management access");
        admin.setPermissions(adminPerms);

        Role fleetManager = new Role("ROLE_FLEET_MANAGER", "Fleet manager controlling vehicle routes and dispatches");
        Role dispatcher = new Role("ROLE_DISPATCHER", "Logistics dispatcher handling shipments and tracking");
        Role driver = new Role("ROLE_DRIVER", "Commercial vehicle driver");
        Role technician = new Role("ROLE_TECHNICIAN", "Maintenance technician");

        roleRepository.saveAll(List.of(superAdmin, admin, fleetManager, dispatcher, driver, technician));
    }

    private void seedUsers() {
        Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN").orElseThrow();
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();

        User u1 = new User("admin@ttcfleet360.com", passwordEncoder.encode("Admin@123"), "System", "Admin");
        u1.setPhoneNumber("+91 98765 43210");
        u1.setDepartment("Executive Leadership");
        u1.setDesignation("Chief Technology Officer");
        u1.setRoles(Set.of(superAdminRole, adminRole));

        User u2 = new User("superadmin@ttcfleet360.com", passwordEncoder.encode("Admin@123"), "Executive", "SuperAdmin");
        u2.setPhoneNumber("+91 98765 00000");
        u2.setDepartment("Board of Operations");
        u2.setDesignation("Managing Director");
        u2.setRoles(Set.of(superAdminRole));

        User u3 = new User("rahul.kumar@ttcfleet360.com", passwordEncoder.encode("Admin@123"), "Rahul", "Kumar");
        u3.setPhoneNumber("+91 91234 56789");
        u3.setDepartment("Fleet Operations");
        u3.setDesignation("Operations Lead");
        u3.setRoles(Set.of(adminRole));

        userRepository.saveAll(List.of(u1, u2, u3));
    }

    private void seedBranches() {
        Branch b1 = new Branch("HYD-01", "Hyderabad Central Hub", "Hyderabad", "Telangana", "India");
        b1.setAddressLine("Plot 45, HITEC City Logistics Park, Madhapur");
        b1.setContactEmail("hyderabad@ttcfleet360.com");
        b1.setContactPhone("+91 40 4567 8901");
        b1.setTotalVehicles(35);

        Branch b2 = new Branch("BLR-01", "Bengaluru Tech Cargo Hub", "Bengaluru", "Karnataka", "India");
        b2.setAddressLine("Electronic City Phase 2, Hosur Road");
        b2.setContactEmail("bengaluru@ttcfleet360.com");
        b2.setContactPhone("+91 80 8901 2345");
        b2.setTotalVehicles(30);

        Branch b3 = new Branch("CHN-01", "Chennai Port Logistics Hub", "Chennai", "Tamil Nadu", "India");
        b3.setAddressLine("Ennore High Road, Port Access Zone");
        b3.setContactEmail("chennai@ttcfleet360.com");
        b3.setContactPhone("+91 44 2345 6789");
        b3.setTotalVehicles(20);

        Branch b4 = new Branch("MUM-01", "Mumbai Western Gateway", "Mumbai", "Maharashtra", "India");
        b4.setAddressLine("Bhiwandi Freight Corridor Zone 4");
        b4.setContactEmail("mumbai@ttcfleet360.com");
        b4.setContactPhone("+91 22 6789 0123");
        b4.setTotalVehicles(15);

        branchRepository.saveAll(List.of(b1, b2, b3, b4));
    }

    private void seedCompanyProfile() {
        CompanyProfile cp = new CompanyProfile();
        cp.setCompanyName("TTC Fleet360 Logistics Solutions Pvt Ltd");
        cp.setTradingName("TTC Fleet360 Enterprise");
        cp.setRegistrationNumber("U63030TG2020PTC145678");
        cp.setGstNumber("36AABCT7890Q1Z8");
        cp.setPrimaryEmail("contact@ttcfleet360.com");
        cp.setPrimaryPhone("+91 40 8899 0011");
        cp.setWebsiteUrl("https://www.ttcfleet360.com");
        cp.setAddressLine("Tower B, 9th Floor, Financial District, Gachibowli");
        cp.setCity("Hyderabad");
        cp.setState("Telangana");
        cp.setCountry("India");
        cp.setPostalCode("500032");
        cp.setDescription("TTC Fleet360 is India's leading enterprise multi-modal logistics platform providing clarity, control, and confidence.");
        companyProfileRepository.save(cp);
    }

    private void seedSubscriptionPlansAndSubscriptions() {
        SubscriptionPlan basic = new SubscriptionPlan("BASIC", "Basic Plan", "Essential fleet tools for small operators",
                BigDecimal.valueOf(999.00), "MONTHLY", 10, 25, 2, 1);
        basic.setFeaturesJson("[\"Up to 10 Vehicles\", \"Real-time GPS Tracking\", \"Email Notifications\", \"Basic Reports\"]");

        SubscriptionPlan premium = new SubscriptionPlan("PREMIUM", "Premium Plan", "Complete automated logistics suite",
                BigDecimal.valueOf(2499.00), "MONTHLY", 50, 150, 10, 2);
        premium.setFeaturesJson("[\"Up to 50 Vehicles\", \"Predictive Fuel Analytics\", \"Route Optimization\", \"Live Telemetry & Alerts\", \"Dedicated Support\"]");
        premium.setIsActive(true);

        SubscriptionPlan enterprise = new SubscriptionPlan("ENTERPRISE", "Enterprise Plan", "Unlimited scale for enterprise carriers",
                BigDecimal.valueOf(4999.00), "MONTHLY", 500, 2000, 50, 3);
        enterprise.setFeaturesJson("[\"Unlimited Vehicles\", \"Automated Dispatching\", \"SAP/ERP Integration\", \"Dedicated SLA\", \"Multi-Branch Control\"]");

        subscriptionPlanRepository.saveAll(List.of(basic, premium, enterprise));

        Subscription s1 = new Subscription(1L, premium, "ACTIVE", LocalDate.now().minusDays(20), LocalDate.now().plusDays(10));
        subscriptionRepository.save(s1);
    }

    private void seedSystemSettings() {
        List<SystemSetting> settings = List.of(
            new SystemSetting("APP_NAME", "TTC Fleet360", "GENERAL", "Application display name", "STRING", false),
            new SystemSetting("COMPANY_CURRENCY", "INR", "FINANCE", "Default operational currency", "STRING", false),
            new SystemSetting("GPS_UPDATE_INTERVAL_SEC", "15", "TELEMETRY", "Frequency of vehicle GPS ping", "NUMBER", false),
            new SystemSetting("NOTIFICATION_EMAIL_ENABLED", "true", "NOTIFICATIONS", "Send operational alerts via email", "BOOLEAN", false),
            new SystemSetting("AUTH_MFA_ENFORCED", "false", "SECURITY", "Enforce Multi-Factor Authentication", "BOOLEAN", false),
            new SystemSetting("AUDIT_RETENTION_DAYS", "90", "PREFERENCES", "Retention period for user audit logs", "NUMBER", false)
        );
        systemSettingRepository.saveAll(settings);
    }

    private void seedAuditLogs() {
        AuditLog l1 = new AuditLog("admin@ttcfleet360.com", "UPDATE", "SETTINGS", "APP_NAME", "Updated system settings", "192.168.1.100", "SUCCESS");
        l1.setCreatedAt(Instant.now().minus(18, ChronoUnit.MINUTES));

        AuditLog l2 = new AuditLog("billing@acmecorp.com", "RENEWAL", "SUBSCRIPTIONS", "SUB-ACM-001", "Subscription renewed - Premium Plan", "103.22.45.12", "SUCCESS");
        l2.setCreatedAt(Instant.now().minus(15, ChronoUnit.MINUTES));

        AuditLog l3 = new AuditLog("admin@ttcfleet360.com", "UPDATE", "BRANCHES", "BLR-01", "Updated branch details - Bengaluru Branch", "192.168.1.100", "SUCCESS");
        l3.setCreatedAt(Instant.now().minus(5, ChronoUnit.MINUTES));

        AuditLog l4 = new AuditLog("rahul.kumar@ttcfleet360.com", "REGISTER", "USERS", "USR-003", "User user registered: Rahul Kumar", "103.54.12.89", "SUCCESS");
        l4.setCreatedAt(Instant.now().minus(2, ChronoUnit.MINUTES));

        auditLogRepository.saveAll(List.of(l1, l2, l3, l4));

        LoginHistory lh1 = new LoginHistory("admin@ttcfleet360.com", "SUCCESS", "192.168.1.100", "Mozilla/5.0", "Mumbai, India", null);
        lh1.setTimestamp(Instant.now().minus(3, ChronoUnit.HOURS));

        LoginHistory lh2 = new LoginHistory("rahul.kumar@ttcfleet360.com", "SUCCESS", "103.54.12.89", "Mozilla/5.0", "Hyderabad, India", null);
        lh2.setTimestamp(Instant.now().minus(2, ChronoUnit.MINUTES));

        loginHistoryRepository.saveAll(List.of(lh1, lh2));
    }

    private void seedLogisticsModules() {
        // 1. Vehicles
        Vehicle v1 = new Vehicle();
        v1.setPlateNumber("TS-09-UB-8821");
        v1.setVin("1TATA8821PRIMA5530");
        v1.setMake("Tata Motors");
        v1.setModel("Prima 5530.S Heavy Hauler");
        v1.setManufacturingYear(2023);
        v1.setCategory("HEAVY_TRUCK");
        v1.setStatus("ACTIVE");
        v1.setAvailability("ON_TRIP");
        v1.setPayloadCapacityKg(35000.0);
        v1.setFuelType("DIESEL");
        v1.setOdometerKm(142500.0);
        v1.setCurrentCity("Hyderabad");
        v1.setAssignedDriverName("Rahul Kumar");

        Vehicle v2 = new Vehicle();
        v2.setPlateNumber("KA-01-MJ-4392");
        v2.setVin("2BZ1617RBLR4392M");
        v2.setMake("BharatBenz");
        v2.setModel("1617R Medium Hauler");
        v2.setManufacturingYear(2022);
        v2.setCategory("MEDIUM_HAULER");
        v2.setStatus("ACTIVE");
        v2.setAvailability("AVAILABLE");
        v2.setPayloadCapacityKg(16000.0);
        v2.setFuelType("DIESEL");
        v2.setOdometerKm(98400.0);
        v2.setCurrentCity("Bengaluru");
        v2.setAssignedDriverName("Suresh Patil");

        Vehicle v3 = new Vehicle();
        v3.setPlateNumber("TN-04-AB-9011");
        v3.setVin("3VOLVOFH16CHN9011");
        v3.setMake("Volvo");
        v3.setModel("FH16 750 InterCity");
        v3.setManufacturingYear(2024);
        v3.setCategory("CONTAINER_CARRIER");
        v3.setStatus("ACTIVE");
        v3.setAvailability("ON_TRIP");
        v3.setPayloadCapacityKg(42000.0);
        v3.setFuelType("DIESEL");
        v3.setOdometerKm(65200.0);
        v3.setCurrentCity("Chennai");
        v3.setAssignedDriverName("Vikram Singh");

        Vehicle v4 = new Vehicle();
        v4.setPlateNumber("MH-12-PQ-6543");
        v4.setVin("4AL4220MUM6543");
        v4.setMake("Ashok Leyland");
        v4.setModel("4220 Multi-Axle Hauler");
        v4.setManufacturingYear(2022);
        v4.setCategory("HEAVY_TRUCK");
        v4.setStatus("ACTIVE");
        v4.setAvailability("AVAILABLE");
        v4.setPayloadCapacityKg(30000.0);
        v4.setFuelType("DIESEL");
        v4.setOdometerKm(188900.0);
        v4.setCurrentCity("Mumbai");
        v4.setAssignedDriverName("Mohammed Rizwan");

        Vehicle v5 = new Vehicle();
        v5.setPlateNumber("DL-01-AB-1234");
        v5.setVin("5EICHER6028DEL1234");
        v5.setMake("Eicher Motors");
        v5.setModel("Pro 6028 Tanker");
        v5.setManufacturingYear(2023);
        v5.setCategory("TANKER");
        v5.setStatus("ACTIVE");
        v5.setAvailability("AVAILABLE");
        v5.setPayloadCapacityKg(28000.0);
        v5.setFuelType("LNG");
        v5.setOdometerKm(87300.0);
        v5.setCurrentCity("Delhi");
        v5.setAssignedDriverName("Amit Sharma");

        Vehicle v6 = new Vehicle();
        v6.setPlateNumber("AP-28-TG-7733");
        v6.setVin("6SCANIAP410AP7733");
        v6.setMake("Scania");
        v6.setModel("P410 Heavy Cargo");
        v6.setManufacturingYear(2021);
        v6.setCategory("TRAILER");
        v6.setStatus("ACTIVE");
        v6.setAvailability("IN_MAINTENANCE");
        v6.setPayloadCapacityKg(38000.0);
        v6.setFuelType("DIESEL");
        v6.setOdometerKm(234100.0);
        v6.setCurrentCity("Vijayawada");
        v6.setAssignedDriverName("Deepak Reddy");

        vehicleRepository.saveAll(List.of(v1, v2, v3, v4, v5, v6));

        // 2. Drivers
        Driver d1 = new Driver();
        d1.setDriverCode("DRV-1001");
        d1.setFullName("Rahul Kumar");
        d1.setEmail("rahul.kumar@ttcfleet360.com");
        d1.setPhone("+91 98765 11001");
        d1.setLicenseNumber("TS-0920150012345");
        d1.setLicenseCategory("HEAVY_TRANSPORT");
        d1.setLicenseExpiryDate(LocalDate.now().plusMonths(24));
        d1.setMedicalCertExpiry(LocalDate.now().plusMonths(12));
        d1.setStatus("ACTIVE");
        d1.setAvailability("ON_DUTY");
        d1.setExperienceYears(9);
        d1.setRating(4.9);
        d1.setEmergencyContact("+91 94400 99881");
        d1.setAssignedVehiclePlate("TS-09-UB-8821");

        Driver d2 = new Driver();
        d2.setDriverCode("DRV-1002");
        d2.setFullName("Suresh Patil");
        d2.setEmail("suresh.patil@ttcfleet360.com");
        d2.setPhone("+91 98765 22002");
        d2.setLicenseNumber("KA-0120180054321");
        d2.setLicenseCategory("HEAVY_TRANSPORT");
        d2.setLicenseExpiryDate(LocalDate.now().plusMonths(18));
        d2.setMedicalCertExpiry(LocalDate.now().plusMonths(8));
        d2.setStatus("ACTIVE");
        d2.setAvailability("AVAILABLE");
        d2.setExperienceYears(7);
        d2.setRating(4.8);
        d2.setEmergencyContact("+91 98800 11223");
        d2.setAssignedVehiclePlate("KA-01-MJ-4392");

        Driver d3 = new Driver();
        d3.setDriverCode("DRV-1003");
        d3.setFullName("Vikram Singh");
        d3.setEmail("vikram.singh@ttcfleet360.com");
        d3.setPhone("+91 98765 33003");
        d3.setLicenseNumber("TN-0420170098765");
        d3.setLicenseCategory("HEAVY_TRANSPORT");
        d3.setLicenseExpiryDate(LocalDate.now().plusDays(25)); // Expiring soon!
        d3.setMedicalCertExpiry(LocalDate.now().plusMonths(6));
        d3.setStatus("ACTIVE");
        d3.setAvailability("ON_DUTY");
        d3.setExperienceYears(11);
        d3.setRating(4.95);
        d3.setEmergencyContact("+91 94440 33445");
        d3.setAssignedVehiclePlate("TN-04-AB-9011");

        Driver d4 = new Driver();
        d4.setDriverCode("DRV-1004");
        d4.setFullName("Mohammed Rizwan");
        d4.setEmail("rizwan.m@ttcfleet360.com");
        d4.setPhone("+91 98765 44004");
        d4.setLicenseNumber("MH-1220190087654");
        d4.setLicenseCategory("HEAVY_TRANSPORT");
        d4.setLicenseExpiryDate(LocalDate.now().plusMonths(30));
        d4.setMedicalCertExpiry(LocalDate.now().plusMonths(14));
        d4.setStatus("ACTIVE");
        d4.setAvailability("AVAILABLE");
        d4.setExperienceYears(6);
        d4.setRating(4.7);
        d4.setEmergencyContact("+91 98220 55667");
        d4.setAssignedVehiclePlate("MH-12-PQ-6543");

        driverRepository.saveAll(List.of(d1, d2, d3, d4));

        // 3. Customers
        Customer c1 = new Customer();
        c1.setCustomerCode("CUST-5001");
        c1.setCompanyName("Acme Logistics Global");
        c1.setContactPerson("Suresh Verma");
        c1.setEmail("suresh.verma@acmecorp.com");
        c1.setPhone("+91 98234 56789");
        c1.setAddressLine("Plot 12, Export Cargo Complex, Shamshabad");
        c1.setCity("Hyderabad");
        c1.setState("Telangana");
        c1.setTaxId("36AAACA1234A1Z5");
        c1.setCreditLimit(BigDecimal.valueOf(1000000.0));
        c1.setOutstandingBalance(BigDecimal.valueOf(145000.0));
        c1.setStatus("ACTIVE");

        Customer c2 = new Customer();
        c2.setCustomerCode("CUST-5002");
        c2.setCompanyName("Tech Solutions Freightways");
        c2.setContactPerson("Meera Nair");
        c2.setEmail("meera.nair@techsolutions.com");
        c2.setPhone("+91 99012 34567");
        c2.setAddressLine("IT Park Phase 3, Outer Ring Road");
        c2.setCity("Bengaluru");
        c2.setState("Karnataka");
        c2.setTaxId("29AAACT9876B1Z2");
        c2.setCreditLimit(BigDecimal.valueOf(750000.0));
        c2.setOutstandingBalance(BigDecimal.valueOf(82000.0));
        c2.setStatus("ACTIVE");

        Customer c3 = new Customer();
        c3.setCustomerCode("CUST-5003");
        c3.setCompanyName("Tata Supply Solutions Ltd");
        c3.setContactPerson("Rajesh Kulkarni");
        c3.setEmail("rajesh.k@tatasupply.com");
        c3.setPhone("+91 98199 88776");
        c3.setAddressLine("Nariman Point Express Chambers");
        c3.setCity("Mumbai");
        c3.setState("Maharashtra");
        c3.setTaxId("27AAACT5566C1Z9");
        c3.setCreditLimit(BigDecimal.valueOf(2500000.0));
        c3.setOutstandingBalance(BigDecimal.valueOf(310000.0));
        c3.setStatus("ACTIVE");

        customerRepository.saveAll(List.of(c1, c2, c3));

        // 4. Orders
        Order o1 = new Order();
        o1.setOrderNumber("ORD-2024-8801");
        o1.setCustomerId(1L);
        o1.setCustomerName("Acme Logistics Global");
        o1.setOrderDate(LocalDate.now().minusDays(3));
        o1.setRequiredDeliveryDate(LocalDate.now().plusDays(2));
        o1.setStatus("APPROVED");
        o1.setPriority("HIGH");
        o1.setPickupAddress("Warehouse Depot A, Hyderabad");
        o1.setDeliveryAddress("Distribution Hub, Bengaluru");
        o1.setTotalWeightKg(18500.0);
        o1.setTotalAmount(BigDecimal.valueOf(125000.0));

        Order o2 = new Order();
        o2.setOrderNumber("ORD-2024-8802");
        o2.setCustomerId(2L);
        o2.setCustomerName("Tech Solutions Freightways");
        o2.setOrderDate(LocalDate.now().minusDays(1));
        o2.setRequiredDeliveryDate(LocalDate.now().plusDays(4));
        o2.setStatus("PENDING");
        o2.setPriority("MEDIUM");
        o2.setPickupAddress("Whitefield Depot, Bengaluru");
        o2.setDeliveryAddress("Ennore Access Hub, Chennai");
        o2.setTotalWeightKg(12000.0);
        o2.setTotalAmount(BigDecimal.valueOf(95000.0));

        Order o3 = new Order();
        o3.setOrderNumber("ORD-2024-8803");
        o3.setCustomerId(3L);
        o3.setCustomerName("Tata Supply Solutions Ltd");
        o3.setOrderDate(LocalDate.now().minusDays(5));
        o3.setRequiredDeliveryDate(LocalDate.now().minusDays(1));
        o3.setStatus("COMPLETED");
        o3.setPriority("URGENT");
        o3.setPickupAddress("Bhiwandi Freight Center, Mumbai");
        o3.setDeliveryAddress("HITEC Logistics Center, Hyderabad");
        o3.setTotalWeightKg(28000.0);
        o3.setTotalAmount(BigDecimal.valueOf(240000.0));

        orderRepository.saveAll(List.of(o1, o2, o3));

        // 5. Shipments
        Shipment s1 = new Shipment();
        s1.setShipmentNumber("SHP-7721");
        s1.setTrackingCode("TRK-HYD-BLR-8821");
        s1.setOrderId(1L);
        s1.setOrderNumber("ORD-2024-8801");
        s1.setVehiclePlate("TS-09-UB-8821");
        s1.setDriverName("Rahul Kumar");
        s1.setStatus("IN_TRANSIT");
        s1.setOriginCity("Hyderabad");
        s1.setDestinationCity("Bengaluru");
        s1.setEstimatedDeparture(Instant.now().minus(5, ChronoUnit.HOURS));
        s1.setEstimatedArrival(Instant.now().plus(4, ChronoUnit.HOURS));
        s1.setCargoDescription("Telecom Networking Gear & Microcontrollers");
        s1.setWeightKg(18500.0);
        s1.setCurrentLocation("NH-44 Kurnool Highway Bypass");

        Shipment s2 = new Shipment();
        s2.setShipmentNumber("SHP-7722");
        s2.setTrackingCode("TRK-CHN-BLR-9011");
        s2.setOrderId(2L);
        s2.setOrderNumber("ORD-2024-8802");
        s2.setVehiclePlate("TN-04-AB-9011");
        s2.setDriverName("Vikram Singh");
        s2.setStatus("IN_TRANSIT");
        s2.setOriginCity("Chennai");
        s2.setDestinationCity("Bengaluru");
        s2.setEstimatedDeparture(Instant.now().minus(2, ChronoUnit.HOURS));
        s2.setEstimatedArrival(Instant.now().plus(5, ChronoUnit.HOURS));
        s2.setCargoDescription("Automotive Assembly Components");
        s2.setWeightKg(22000.0);
        s2.setCurrentLocation("Sriperumbudur Expressway Junction");

        Shipment s3 = new Shipment();
        s3.setShipmentNumber("SHP-7720");
        s3.setTrackingCode("TRK-MUM-HYD-4220");
        s3.setOrderId(3L);
        s3.setOrderNumber("ORD-2024-8803");
        s3.setVehiclePlate("MH-12-PQ-6543");
        s3.setDriverName("Mohammed Rizwan");
        s3.setStatus("DELIVERED");
        s3.setOriginCity("Mumbai");
        s3.setDestinationCity("Hyderabad");
        s3.setEstimatedDeparture(Instant.now().minus(24, ChronoUnit.HOURS));
        s3.setActualArrival(Instant.now().minus(3, ChronoUnit.HOURS));
        s3.setCargoDescription("Heavy Industrial Electrical Panels");
        s3.setWeightKg(28000.0);
        s3.setCurrentLocation("Hyderabad Central Hub Depot A");

        shipmentRepository.saveAll(List.of(s1, s2, s3));

        // 6. Trips
        Trip t1 = new Trip();
        t1.setTripNumber("TRIP-3001");
        t1.setShipmentNumber("SHP-7721");
        t1.setVehiclePlate("TS-09-UB-8821");
        t1.setDriverName("Rahul Kumar");
        t1.setOrigin("Hyderabad");
        t1.setDestination("Bengaluru");
        t1.setPlannedStartTime(Instant.now().minus(5, ChronoUnit.HOURS));
        t1.setDistanceKm(569.4);
        t1.setFuelUsedLiters(142.5);
        t1.setStatus("ACTIVE");
        t1.setRouteCode("RT-HYD-BLR");

        Trip t2 = new Trip();
        t2.setTripNumber("TRIP-3002");
        t2.setShipmentNumber("SHP-7722");
        t2.setVehiclePlate("TN-04-AB-9011");
        t2.setDriverName("Vikram Singh");
        t2.setOrigin("Chennai");
        t2.setDestination("Bengaluru");
        t2.setPlannedStartTime(Instant.now().minus(2, ChronoUnit.HOURS));
        t2.setDistanceKm(346.0);
        t2.setFuelUsedLiters(86.0);
        t2.setStatus("ACTIVE");
        t2.setRouteCode("RT-CHN-BLR");

        tripRepository.saveAll(List.of(t1, t2));

        // 7. GPS Locations (Live coordinates on Indian highways)
        GpsLocation loc1 = new GpsLocation();
        loc1.setVehiclePlate("TS-09-UB-8821");
        loc1.setDriverName("Rahul Kumar");
        loc1.setLatitude(15.8281);
        loc1.setLongitude(78.0373); // Kurnool, NH-44
        loc1.setSpeedKmph(68.5);
        loc1.setHeadingDegrees(185.0);
        loc1.setCurrentAddress("NH-44 Highway, near Kurnool Toll Plaza, Andhra Pradesh");
        loc1.setEngineStatus("RUNNING");
        loc1.setIgnition(true);
        loc1.setFuelLevelPercent(74.0);

        GpsLocation loc2 = new GpsLocation();
        loc2.setVehiclePlate("TN-04-AB-9011");
        loc2.setDriverName("Vikram Singh");
        loc2.setLatitude(12.9625);
        loc2.setLongitude(79.9405); // Sriperumbudur, Tamil Nadu
        loc2.setSpeedKmph(62.0);
        loc2.setHeadingDegrees(260.0);
        loc2.setCurrentAddress("Chennai-Bengaluru Highway, Sriperumbudur");
        loc2.setEngineStatus("RUNNING");
        loc2.setIgnition(true);
        loc2.setFuelLevelPercent(82.5);

        GpsLocation loc3 = new GpsLocation();
        loc3.setVehiclePlate("KA-01-MJ-4392");
        loc3.setDriverName("Suresh Patil");
        loc3.setLatitude(12.8452);
        loc3.setLongitude(77.6602); // Electronic City, Bengaluru
        loc3.setSpeedKmph(0.0);
        loc3.setHeadingDegrees(0.0);
        loc3.setCurrentAddress("TTC Fleet Depot, Electronic City Phase 2, Bengaluru");
        loc3.setEngineStatus("IDLE");
        loc3.setIgnition(false);
        loc3.setFuelLevelPercent(91.0);

        gpsLocationRepository.saveAll(List.of(loc1, loc2, loc3));

        // 8. Routes
        Route r1 = new Route();
        r1.setRouteCode("RT-HYD-BLR");
        r1.setRouteName("Hyderabad - Bengaluru NH-44 Freight Express");
        r1.setOriginCity("Hyderabad");
        r1.setDestinationCity("Bengaluru");
        r1.setDistanceKm(569.4);
        r1.setEstimatedDurationHours(8.5);
        r1.setWaypointsSummary("Jadcherla -> Kurnool -> Gooty -> Anantapur -> Devanahalli");
        r1.setTollExpenses(BigDecimal.valueOf(1450.0));
        r1.setStatus("ACTIVE");

        Route r2 = new Route();
        r2.setRouteCode("RT-CHN-BLR");
        r2.setRouteName("Chennai - Bengaluru Golden Quadrilateral");
        r2.setOriginCity("Chennai");
        r2.setDestinationCity("Bengaluru");
        r2.setDistanceKm(346.0);
        r2.setEstimatedDurationHours(5.5);
        r2.setWaypointsSummary("Sriperumbudur -> Kanchipuram -> Vellore -> Hosur");
        r2.setTollExpenses(BigDecimal.valueOf(980.0));
        r2.setStatus("ACTIVE");

        Route r3 = new Route();
        r3.setRouteCode("RT-MUM-PUN");
        r3.setRouteName("Mumbai - Pune Yashwantrao Chavan Expressway");
        r3.setOriginCity("Mumbai");
        r3.setDestinationCity("Pune");
        r3.setDistanceKm(148.5);
        r3.setEstimatedDurationHours(2.5);
        r3.setWaypointsSummary("Navi Mumbai -> Panvel -> Khandala -> Talegaon");
        r3.setTollExpenses(BigDecimal.valueOf(420.0));
        r3.setStatus("ACTIVE");

        routeRepository.saveAll(List.of(r1, r2, r3));

        // 9. Fuel Records
        FuelRecord fr1 = new FuelRecord();
        fr1.setVehiclePlate("TS-09-UB-8821");
        fr1.setDriverName("Rahul Kumar");
        fr1.setRecordDate(LocalDate.now().minusDays(1));
        fr1.setLiters(140.0);
        fr1.setCostPerLiter(BigDecimal.valueOf(94.50));
        fr1.setTotalCost(BigDecimal.valueOf(13230.0));
        fr1.setOdometerReading(142100.0);
        fr1.setFuelStation("Indian Oil Highway Hub, Shadnagar");
        fr1.setPaymentMethod("FLEET_CARD");
        fr1.setReceiptNumber("IOCL-77491");

        FuelRecord fr2 = new FuelRecord();
        fr2.setVehiclePlate("TN-04-AB-9011");
        fr2.setDriverName("Vikram Singh");
        fr2.setRecordDate(LocalDate.now().minusDays(2));
        fr2.setLiters(95.0);
        fr2.setCostPerLiter(BigDecimal.valueOf(94.20));
        fr2.setTotalCost(BigDecimal.valueOf(8949.0));
        fr2.setOdometerReading(65100.0);
        fr2.setFuelStation("Bharat Petroleum COCO, Vellore Bypass");
        fr2.setPaymentMethod("FLEET_CARD");
        fr2.setReceiptNumber("BPCL-33291");

        fuelRecordRepository.saveAll(List.of(fr1, fr2));

        // 10. Maintenance Records
        MaintenanceRecord mr1 = new MaintenanceRecord();
        mr1.setVehiclePlate("TS-09-UB-8821");
        mr1.setServiceType("SCHEDULED_INSPECTION");
        mr1.setServiceDate(LocalDate.now().minusDays(14));
        mr1.setCost(BigDecimal.valueOf(14500.0));
        mr1.setOdometerReading(140000.0);
        mr1.setServiceCenter("Tata Commercial Service Center, Hyderabad");
        mr1.setStatus("COMPLETED");
        mr1.setNextServiceDueDate(LocalDate.now().plusMonths(3));
        mr1.setNextServiceOdometer(160000.0);
        mr1.setTechnicianName("Anil Sharma");
        mr1.setTechnicianNotes("Complete oil filter replacement, brake pads inspected, tire pressures aligned.");

        MaintenanceRecord mr2 = new MaintenanceRecord();
        mr2.setVehiclePlate("AP-28-TG-7733");
        mr2.setServiceType("BRAKE_SERVICE");
        mr2.setServiceDate(LocalDate.now());
        mr2.setCost(BigDecimal.valueOf(28000.0));
        mr2.setOdometerReading(234100.0);
        mr2.setServiceCenter("Scania Authorised Heavy Hub, Vijayawada");
        mr2.setStatus("IN_PROGRESS");
        mr2.setNextServiceDueDate(LocalDate.now().plusMonths(4));
        mr2.setNextServiceOdometer(250000.0);
        mr2.setTechnicianName("K. Venkatesh");
        mr2.setTechnicianNotes("Air brake valve cylinder replacement in progress.");

        maintenanceRecordRepository.saveAll(List.of(mr1, mr2));

        // 11. Warehouses
        Warehouse w1 = new Warehouse();
        w1.setWarehouseCode("WH-HYD-01");
        w1.setWarehouseName("Telangana Central Logistics Depot");
        w1.setAddressLine("Plot 45, HITEC Cargo Zone, Madhapur");
        w1.setCity("Hyderabad");
        w1.setState("Telangana");
        w1.setTotalCapacitySqFt(50000.0);
        w1.setOccupiedCapacitySqFt(34500.0);
        w1.setManagerName("Venkatesh Rao");
        w1.setContactPhone("+91 94401 23456");
        w1.setStatus("OPERATIONAL");

        Warehouse w2 = new Warehouse();
        w2.setWarehouseCode("WH-BLR-02");
        w2.setWarehouseName("Bengaluru High-Tech Logistics Hub");
        w2.setAddressLine("Electronic City Phase 2, Hosur Road");
        w2.setCity("Bengaluru");
        w2.setState("Karnataka");
        w2.setTotalCapacitySqFt(40000.0);
        w2.setOccupiedCapacitySqFt(28000.0);
        w2.setManagerName("Ravi Shankar");
        w2.setContactPhone("+91 98801 34567");
        w2.setStatus("OPERATIONAL");

        warehouseRepository.saveAll(List.of(w1, w2));

        // 12. Inventory Items
        InventoryItem itm1 = new InventoryItem();
        itm1.setWarehouseCode("WH-HYD-01");
        itm1.setItemCode("ITM-PAL-101");
        itm1.setItemName("Heavy-Duty Euro Logistics Pallets");
        itm1.setCategory("PACKAGING");
        itm1.setQuantity(420);
        itm1.setUnit("PALLETS");
        itm1.setMinThreshold(100);
        itm1.setUnitPrice(BigDecimal.valueOf(1400.0));
        itm1.setLocationAisle("Bay-A-12");

        InventoryItem itm2 = new InventoryItem();
        itm2.setWarehouseCode("WH-HYD-01");
        itm2.setItemCode("ITM-STR-202");
        itm2.setItemName("Industrial Cargo Ratchet Straps (5000kg)");
        itm2.setCategory("GENERAL_CARGO");
        itm2.setQuantity(180);
        itm2.setUnit("UNITS");
        itm2.setMinThreshold(50);
        itm2.setUnitPrice(BigDecimal.valueOf(850.0));
        itm2.setLocationAisle("Bay-B-04");

        inventoryItemRepository.saveAll(List.of(itm1, itm2));

        // 13. Stock Movements
        StockMovement sm1 = new StockMovement();
        sm1.setWarehouseCode("WH-HYD-01");
        sm1.setItemCode("ITM-PAL-101");
        sm1.setItemName("Heavy-Duty Euro Logistics Pallets");
        sm1.setMovementType("INWARD");
        sm1.setQuantity(100);
        sm1.setReferenceNumber("GRN-99881");
        sm1.setNotes("Received from Tata Logistics Supply vendor");
        stockMovementRepository.save(sm1);

        // 14. Invoices
        Invoice inv1 = new Invoice();
        inv1.setInvoiceNumber("INV-2024-0012");
        inv1.setCustomerCode("CUST-5001");
        inv1.setCustomerName("Acme Logistics Global");
        inv1.setOrderNumber("ORD-2024-8801");
        inv1.setIssueDate(LocalDate.now().minusDays(5));
        inv1.setDueDate(LocalDate.now().plusDays(25));
        inv1.setSubtotal(BigDecimal.valueOf(125000.0));
        inv1.setTaxAmount(BigDecimal.valueOf(22500.0));
        inv1.setTotalAmount(BigDecimal.valueOf(147500.0));
        inv1.setStatus("PAID");

        Invoice inv2 = new Invoice();
        inv2.setInvoiceNumber("INV-2024-0013");
        inv2.setCustomerCode("CUST-5002");
        inv2.setCustomerName("Tech Solutions Freightways");
        inv2.setOrderNumber("ORD-2024-8802");
        inv2.setIssueDate(LocalDate.now().minusDays(2));
        inv2.setDueDate(LocalDate.now().plusDays(28));
        inv2.setSubtotal(BigDecimal.valueOf(95000.0));
        inv2.setTaxAmount(BigDecimal.valueOf(17100.0));
        inv2.setTotalAmount(BigDecimal.valueOf(112100.0));
        inv2.setStatus("PENDING");

        invoiceRepository.saveAll(List.of(inv1, inv2));

        // 15. Payment Transactions
        PaymentTransaction pt1 = new PaymentTransaction();
        pt1.setTransactionReference("TXN-998811");
        pt1.setInvoiceNumber("INV-2024-0012");
        pt1.setCustomerName("Acme Logistics Global");
        pt1.setAmount(BigDecimal.valueOf(147500.0));
        pt1.setPaymentMethod("BANK_TRANSFER");
        pt1.setStatus("SUCCESS");
        pt1.setNotes("NEFT settlement verified by Treasury");
        paymentTransactionRepository.save(pt1);

        // 16. Notifications
        Notification n1 = new Notification("Subscription Renewal Alert",
                "Acme Corp subscription renews in 7 days", "SYSTEM", "HIGH", "/subscriptions");
        Notification n2 = new Notification("Vehicle Telemetry",
                "Vehicle TS-09-UB-8821 reached Kurnool Toll Plaza", "VEHICLE_ALERT", "MEDIUM", "/gps-tracking");
        Notification n3 = new Notification("Driver License Expiry",
                "Driver Vikram Singh license expires in 25 days", "DRIVER_EXPIRY", "CRITICAL", "/drivers");
        Notification n4 = new Notification("Maintenance Scheduled",
                "Periodic brake inspection due on Scania AP-28-TG-7733", "MAINTENANCE_REMINDER", "HIGH", "/maintenance");
        Notification n5 = new Notification("Shipment Delivered",
                "Shipment SHP-7720 successfully delivered at Hyderabad Central Hub", "SHIPMENT_UPDATE", "LOW", "/shipments");

        notificationRepository.saveAll(List.of(n1, n2, n3, n4, n5));
    }
}

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
                           PasswordEncoder passwordEncoder) {
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
            log.info("TTC Fleet360 initial data successfully seeded!");
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

        Role admin = new Role("ROLE_ADMIN", "Operations Administrator managing users, branches and operations");
        admin.setPermissions(adminPerms);

        Role fleetManager = new Role("ROLE_FLEET_MANAGER", "Fleet Manager with vehicle oversight and diagnostics");
        Role dispatcher = new Role("ROLE_DISPATCHER", "Dispatcher overseeing active trips and driver schedules");
        Role driver = new Role("ROLE_DRIVER", "Commercial Driver handling freight transport and logs");
        Role technician = new Role("ROLE_TECHNICIAN", "Maintenance Technician managing vehicle upkeep");

        roleRepository.saveAll(List.of(superAdmin, admin, fleetManager, dispatcher, driver, technician));
    }

    private void seedUsers() {
        Role superAdminRole = roleRepository.findByName("ROLE_SUPER_ADMIN").orElseThrow();
        Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
        Role fleetManagerRole = roleRepository.findByName("ROLE_FLEET_MANAGER").orElseThrow();
        Role dispatcherRole = roleRepository.findByName("ROLE_DISPATCHER").orElseThrow();
        Role driverRole = roleRepository.findByName("ROLE_DRIVER").orElseThrow();
        Role technicianRole = roleRepository.findByName("ROLE_TECHNICIAN").orElseThrow();

        String defaultPass = passwordEncoder.encode("Admin@123");

        User superAdmin = new User();
        superAdmin.setFirstName("Super");
        superAdmin.setLastName("Admin");
        superAdmin.setEmail("superadmin@ttcfleet360.com");
        superAdmin.setPasswordHash(defaultPass);
        superAdmin.setPhoneNumber("+91 98765 43210");
        superAdmin.setDepartment("Executive");
        superAdmin.setDesignation("Super Administrator");
        superAdmin.setIsActive(true);
        superAdmin.setRoles(Set.of(superAdminRole));
        userRepository.save(superAdmin);

        User admin = new User();
        admin.setFirstName("Admin");
        admin.setLastName("Operations");
        admin.setEmail("admin@ttcfleet360.com");
        admin.setPasswordHash(defaultPass);
        admin.setPhoneNumber("+91 98765 12345");
        admin.setDepartment("Operations");
        admin.setDesignation("Senior Operations Admin");
        admin.setIsActive(true);
        admin.setRoles(Set.of(adminRole));
        userRepository.save(admin);

        User rahul = new User();
        rahul.setFirstName("Rahul");
        rahul.setLastName("Kumar");
        rahul.setEmail("rahul.kumar@ttcfleet360.com");
        rahul.setPasswordHash(defaultPass);
        rahul.setPhoneNumber("+91 98234 56789");
        rahul.setDepartment("Fleet Ops");
        rahul.setDesignation("Fleet Operations Lead");
        rahul.setIsActive(true);
        rahul.setRoles(Set.of(fleetManagerRole));
        userRepository.save(rahul);

        User suresh = new User();
        suresh.setFirstName("Suresh");
        suresh.setLastName("Reddy");
        suresh.setEmail("suresh.reddy@ttcfleet360.com");
        suresh.setPasswordHash(defaultPass);
        suresh.setPhoneNumber("+91 99123 45678");
        suresh.setDepartment("Dispatch");
        suresh.setDesignation("Chief Dispatcher");
        suresh.setIsActive(true);
        suresh.setRoles(Set.of(dispatcherRole));
        userRepository.save(suresh);

        User vikram = new User();
        vikram.setFirstName("Vikram");
        vikram.setLastName("Singh");
        vikram.setEmail("vikram.singh@ttcfleet360.com");
        vikram.setPasswordHash(defaultPass);
        vikram.setPhoneNumber("+91 98345 67890");
        vikram.setDepartment("Logistics");
        vikram.setDesignation("Heavy Duty Long-Haul Driver");
        vikram.setIsActive(true);
        vikram.setRoles(Set.of(driverRole));
        userRepository.save(vikram);

        User amit = new User();
        amit.setFirstName("Amit");
        amit.setLastName("Sharma");
        amit.setEmail("amit.sharma@ttcfleet360.com");
        amit.setPasswordHash(defaultPass);
        amit.setPhoneNumber("+91 98456 78901");
        amit.setDepartment("Engineering");
        amit.setDesignation("Senior Fleet Technician");
        amit.setIsActive(true);
        amit.setRoles(Set.of(technicianRole));
        userRepository.save(amit);
    }

    private void seedBranches() {
        List<Branch> branches = new ArrayList<>();

        Branch hyd = new Branch();
        hyd.setBranchCode("HYD-01");
        hyd.setBranchName("Hyderabad Central Hub");
        hyd.setCity("Hyderabad");
        hyd.setState("Telangana");
        hyd.setPostalCode("500081");
        hyd.setAddressLine("HITEC City Logistics Corridor, Madhapur");
        hyd.setContactEmail("hyd.hub@ttcfleet360.com");
        hyd.setContactPhone("+91 40 2345 6789");
        hyd.setStatus("ACTIVE");
        hyd.setTotalVehicles(32);
        branches.add(hyd);

        Branch blr = new Branch();
        blr.setBranchCode("BLR-01");
        blr.setBranchName("Bengaluru South Terminal");
        blr.setCity("Bengaluru");
        blr.setState("Karnataka");
        blr.setPostalCode("560100");
        blr.setAddressLine("Electronic City Phase 1, Hosur Road");
        blr.setContactEmail("blr.hub@ttcfleet360.com");
        blr.setContactPhone("+91 80 4123 4567");
        blr.setStatus("ACTIVE");
        blr.setTotalVehicles(28);
        branches.add(blr);

        Branch maa = new Branch();
        maa.setBranchCode("MAA-01");
        maa.setBranchName("Chennai Port Hub");
        maa.setCity("Chennai");
        maa.setState("Tamil Nadu");
        maa.setPostalCode("600001");
        maa.setAddressLine("Rajaji Salai, Chennai Port Industrial Zone");
        maa.setContactEmail("maa.hub@ttcfleet360.com");
        maa.setContactPhone("+91 44 2567 8901");
        maa.setStatus("ACTIVE");
        maa.setTotalVehicles(18);
        branches.add(maa);

        Branch bom = new Branch();
        bom.setBranchCode("BOM-01");
        bom.setBranchName("Mumbai West Distribution Hub");
        bom.setCity("Mumbai");
        bom.setState("Maharashtra");
        bom.setPostalCode("400072");
        bom.setAddressLine("Saki Naka, Andheri East Logistics Park");
        bom.setContactEmail("bom.hub@ttcfleet360.com");
        bom.setContactPhone("+91 22 2847 1234");
        bom.setStatus("ACTIVE");
        bom.setTotalVehicles(14);
        branches.add(bom);

        String[][] otherBranches = {
            {"PNQ-01", "Pune Express Depot", "Pune", "Maharashtra", "10"},
            {"DEL-01", "Delhi NCR Gateway", "New Delhi", "Delhi", "12"},
            {"CCU-01", "Kolkata East Logistics Terminal", "Kolkata", "West Bengal", "8"},
            {"AMD-01", "Ahmedabad Mega Depot", "Ahmedabad", "Gujarat", "9"},
            {"COK-01", "Kochi Coastal Hub", "Kochi", "Kerala", "6"},
            {"JAI-01", "Jaipur North Terminal", "Jaipur", "Rajasthan", "7"},
            {"LKO-01", "Lucknow Distribution Centre", "Lucknow", "Uttar Pradesh", "5"},
            {"IND-01", "Indore Central Hub", "Indore", "Madhya Pradesh", "6"}
        };

        for (String[] b : otherBranches) {
            Branch br = new Branch();
            br.setBranchCode(b[0]);
            br.setBranchName(b[1]);
            br.setCity(b[2]);
            br.setState(b[3]);
            br.setAddressLine(b[1] + ", Industrial Area");
            br.setContactEmail(b[0].toLowerCase() + "@ttcfleet360.com");
            br.setStatus("ACTIVE");
            br.setTotalVehicles(Integer.parseInt(b[4]));
            branches.add(br);
        }

        branchRepository.saveAll(branches);
    }

    private void seedCompanyProfile() {
        CompanyProfile profile = new CompanyProfile();
        profile.setCompanyName("TTC Fleet360 Logistics Solutions Pvt Ltd");
        profile.setBrandTagline("Drive your fleet with clarity, control, and confidence.");
        profile.setRegistrationNumber("CIN-U63090MH2021PTC368945");
        profile.setTaxIdentifier("GSTIN27AABCT3600F1Z8");
        profile.setContactEmail("corporate@ttcfleet360.com");
        profile.setContactPhone("+91 22 6100 3600");
        profile.setWebsiteUrl("https://fleet360.ttclogistics.com");
        profile.setAddressStreet("Tower B, 14th Floor, Global Logistics Park, HITEC City");
        profile.setCity("Hyderabad");
        profile.setState("Telangana");
        profile.setCountry("India");
        profile.setPostalCode("500081");
        profile.setOperatingCurrency("INR");
        profile.setPrimaryTimezone("Asia/Kolkata");
        companyProfileRepository.save(profile);
    }

    private void seedSubscriptionPlansAndSubscriptions() {
        SubscriptionPlan basic = new SubscriptionPlan();
        basic.setPlanCode("PLAN_BASIC");
        basic.setPlanName("Basic");
        basic.setMonthlyPrice(new BigDecimal("999.00"));
        basic.setAnnualPrice(new BigDecimal("9990.00"));
        basic.setMaxFleetSize(20);
        basic.setMaxBranches(3);
        basic.setMaxUsers(10);
        basic.setFeaturesJson("[\"GPS Live Tracking\", \"Basic Route Optimization\", \"Standard Trip Logs\", \"Email Support\", \"Daily Driver Check-ins\"]");
        basic.setIsActive(true);
        basic.setIsPopular(false);
        basic.setDisplayOrder(1);

        SubscriptionPlan premium = new SubscriptionPlan();
        premium.setPlanCode("PLAN_PREMIUM");
        premium.setPlanName("Premium");
        premium.setMonthlyPrice(new BigDecimal("2499.00"));
        premium.setAnnualPrice(new BigDecimal("24990.00"));
        premium.setMaxFleetSize(100);
        premium.setMaxBranches(15);
        premium.setMaxUsers(50);
        premium.setFeaturesJson("[\"Advanced Telematics\", \"AI Route Optimization\", \"Multi-Branch Management\", \"Fuel Analytics & Alerts\", \"24/7 Dedicated Support\", \"Automated Maintenance Triggers\"]");
        premium.setIsActive(true);
        premium.setIsPopular(true);
        premium.setDisplayOrder(2);

        SubscriptionPlan enterprise = new SubscriptionPlan();
        enterprise.setPlanCode("PLAN_ENTERPRISE");
        enterprise.setPlanName("Enterprise");
        enterprise.setMonthlyPrice(new BigDecimal("4999.00"));
        enterprise.setAnnualPrice(new BigDecimal("49990.00"));
        enterprise.setMaxFleetSize(500);
        enterprise.setMaxBranches(50);
        enterprise.setMaxUsers(200);
        enterprise.setFeaturesJson("[\"Unlimited Vehicle Fleets\", \"Full Custom Integrations\", \"Predictive Driver Safety Score\", \"Custom SLA & Account Manager\", \"White-label Portal & API Access\", \"Complete Automated Audit Logs\"]");
        enterprise.setIsActive(true);
        enterprise.setIsPopular(false);
        enterprise.setDisplayOrder(3);

        subscriptionPlanRepository.saveAll(List.of(basic, premium, enterprise));

        // Subscriptions matching the screenshot
        Subscription sub1 = new Subscription();
        sub1.setSubscriptionCode("SUB-ACM-001");
        sub1.setCompanyName("Acme Corp");
        sub1.setPlan(premium);
        sub1.setBillingCycle("MONTHLY");
        sub1.setStartDate(LocalDate.now().minusDays(23));
        sub1.setEndDate(LocalDate.now().plusDays(7));
        sub1.setStatus("ACTIVE");
        sub1.setAutoRenew(true);
        sub1.setCurrentAmount(new BigDecimal("2499.00"));

        Subscription sub2 = new Subscription();
        sub2.setSubscriptionCode("SUB-TEC-002");
        sub2.setCompanyName("Tech Solutions");
        sub2.setPlan(premium);
        sub2.setBillingCycle("MONTHLY");
        sub2.setStartDate(LocalDate.now().minusDays(23));
        sub2.setEndDate(LocalDate.now().plusDays(7));
        sub2.setStatus("ACTIVE");
        sub2.setAutoRenew(true);
        sub2.setCurrentAmount(new BigDecimal("2499.00"));

        Subscription sub3 = new Subscription();
        sub3.setSubscriptionCode("SUB-LOG-003");
        sub3.setCompanyName("Logistics Ltd");
        sub3.setPlan(basic);
        sub3.setBillingCycle("MONTHLY");
        sub3.setStartDate(LocalDate.now().minusDays(20));
        sub3.setEndDate(LocalDate.now().plusDays(10));
        sub3.setStatus("ACTIVE");
        sub3.setAutoRenew(false);
        sub3.setCurrentAmount(new BigDecimal("999.00"));

        subscriptionRepository.saveAll(List.of(sub1, sub2, sub3));

        PaymentRecord pay1 = new PaymentRecord();
        pay1.setInvoiceNumber("INV-2024-001");
        pay1.setSubscription(sub1);
        pay1.setAmount(new BigDecimal("2499.00"));
        pay1.setPaymentMethod("CREDIT_CARD");
        pay1.setPaymentStatus("SUCCESS");
        pay1.setPayerCompany("Acme Corp");
        pay1.setPayerEmail("billing@acmecorp.com");
        paymentRecordRepository.save(pay1);
    }

    private void seedSystemSettings() {
        List<SystemSetting> settings = List.of(
            new SystemSetting("APP_NAME", "TTC Fleet360", "GENERAL", "System application branding name", "STRING", true),
            new SystemSetting("SUPPORT_EMAIL", "support@ttcfleet360.com", "GENERAL", "Official customer support contact", "STRING", true),
            new SystemSetting("PRIMARY_CURRENCY", "INR", "GENERAL", "Default system accounting currency", "STRING", true),
            new SystemSetting("DATE_FORMAT", "DD/MM/YYYY", "GENERAL", "Application wide date display format", "STRING", true),
            new SystemSetting("NOTIF_EMAIL_ALERTS", "true", "NOTIFICATIONS", "Enable automated email notifications", "BOOLEAN", false),
            new SystemSetting("NOTIF_SMS_CRITICAL", "true", "NOTIFICATIONS", "Send SMS alerts for vehicle critical events", "BOOLEAN", false),
            new SystemSetting("NOTIF_RENEWAL_REMINDER_DAYS", "7", "NOTIFICATIONS", "Days in advance to alert upcoming subscription renewal", "NUMBER", false),
            new SystemSetting("FLEET_PING_INTERVAL_SEC", "15", "OPERATIONS", "GPS telematics ping frequency in seconds", "NUMBER", false),
            new SystemSetting("MAX_VEHICLES_PER_BRANCH", "100", "OPERATIONS", "Maximum active vehicles per regional depot", "NUMBER", false),
            new SystemSetting("OVERSPEED_THRESHOLD_KMPH", "80", "OPERATIONS", "Commercial speed limit alert trigger", "NUMBER", false),
            new SystemSetting("AUTH_JWT_EXPIRY_HOURS", "24", "SECURITY", "JSON Web Token validity lifespan", "NUMBER", false),
            new SystemSetting("AUTH_MAX_FAILED_ATTEMPTS", "5", "SECURITY", "Consecutive failed logins before lock", "NUMBER", false),
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
}

# TTC FLEET360 - Enterprise Logistics & Fleet Management System

![Fleet360 Architecture](https://img.shields.io/badge/Architecture-Enterprise_SaaS-blue)
![Backend](https://img.shields.io/badge/Backend-Java_17_%7C_Spring_Boot_3-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-React.js_%7C_Vite-61dafb)
![Database](https://img.shields.io/badge/Database-PostgreSQL_16-336791)
![Cache](https://img.shields.io/badge/Caching-Redis_7-dc382d)
![Auth](https://img.shields.io/badge/Auth-JWT_%7C_RBAC-orange)
![Cloud Storage](https://img.shields.io/badge/Cloud_Storage-AWS_S3-FF9900)
![DevOps](https://img.shields.io/badge/DevOps-Docker_%7C_GitHub_Actions_CI%2FCD-2496ED)

---

## 1. System Overview

**TTC FLEET360** is an enterprise-grade fleet management SaaS platform tailored for commercial freight logistics, cold-chain distribution, last-mile parcel networks, and electric fleet operations. 

### Selected Technology Stack (Strict Project Allocation)
- **Frontend:** React.js, JavaScript, HTML5, CSS3, Responsive UI, Lucide Icons, Leaflet GPS Radar.
- **Backend:** Java 17, Spring Boot 3, Spring Security, Spring Data JPA, REST APIs.
- **Database:** PostgreSQL 16 (with schema migrations).
- **Caching:** Redis 7 (Distributed query cache with 10m TTL).
- **Authentication:** JWT (Stateless Bearer Tokens) with Role-Based Access Control (`ROLE_FLEET_MANAGER`, `ROLE_ADMIN`, `ROLE_DISPATCHER`, `ROLE_DRIVER`).
- **Cloud Storage:** AWS S3 SDK for vehicle document compliance and safety certifications.
- **DevOps:** Multi-stage Dockerfiles, Docker Compose, and GitHub Actions CI/CD workflows.

---

## 2. Fleet Manager Dashboard Layout & Features

### 1. Top Navigation Bar
- **Page Title:** Fleet Manager Dashboard
- **Live Real-Time Clock:** Formatted weekday, date, and second-by-second clock.
- **Global Search:** Instant query filter matching vehicle plate numbers, drivers, and route corridors with keyboard shortcut `/`.
- **Notifications Hub:** Unread badge indicator with interactive dropdown flyout, criticality tags, and mark-all-read action.
- **User Profile Pill:** Lead Fleet Manager identity, RBAC authorization badge, and account settings.

### 2. Summary Cards (8 Top KPIs)
1. **Total Vehicles:** All registered fleet assets.
2. **Active Vehicles:** Operational assets currently in rotation.
3. **Available Vehicles:** Standby units ready for immediate dispatch.
4. **Vehicles On Trip:** En route long-haul and regional transports.
5. **Vehicles Under Maintenance:** Scheduled PMs and corrective bay overhauls.
6. **Inactive Vehicles:** Decommissioned or compliance hold units.
7. **Total Drivers:** Registered commercial CDL certified operators.
8. **Available Drivers:** Standby CDL drivers ready for assignment.

### 3. Vehicle Status Overview
- Donut chart with live percentage breakdown.
- Visual status progress tracks with distinct indicators: Available (`#10B981`), On Trip (`#2563EB`), Waiting for Assignment (`#F59E0B`), Under Maintenance (`#8B5CF6`), Out of Service (`#EF4444`).

### 4. Fleet Utilization Analytics
- Interactive area chart with **Daily**, **Weekly**, and **Monthly** filters.
- Fleet metrics: Total utilization rate (78.5%), Idle rate (12.5%), Maintenance overhead (9.0%).
- Vehicle category-wise utilization bars for Heavy Duty Trucks, Electric Cargo, Refrigerated Trucks, Delivery Vans, and Utility units.

### 5. Live Fleet Tracking & Telemetry
- Interactive Leaflet map container with GPS coordinates, custom pulsing marker pins, speed indicators, and destination labels.
- Live telemetry panel displaying vehicle registration, speed gauge, ETA, driver phone link, and power/battery levels.
- Real-time simulation controller with Pause/Resume radar and instant telemetry tick triggers.

### 6. Fuel & Energy Management Overview
- 4 Key Metrics: Total fuel consumed (L), Monthly spend ($), Fleet average consumption (L/100km), Cost per km driven.
- Interactive expense trend area chart and category spend bar chart.
- Category fuel efficiency benchmarks (Diesel vs Electric kWh/mi).

### 7. Maintenance & Compliance Health
- Work order metrics: Due for service, Upcoming maintenance, Under repair, Completed (MTD), and Monthly spend.
- Active work orders table with priority badges (`High`, `Routine`, `Critical`).
- Expiring documents & insurance reminder alerts (DOT safety inspections, Cargo liability, Clean Air permits).

### 8. Vehicle & Driver Assignment Hub
- Active assignment ledger with dispatched routes, expected return timestamps, and driver IDs.
- Standby available vehicles list with one-click dispatch trigger.
- Modal workflow for pairing available vehicles with CDL operators.

### 9. Charts & Reports Section
- Interactive multi-metric analytics with date range filters (**7 Days**, **30 Days**, **90 Days**, **This Year**).
- Vehicle utilization chart, fuel consumption chart, maintenance cost chart, vehicle category distribution donut, and monthly fleet expenses.
- Executive CSV/PDF export simulation.

### 10. Quick Actions (6 Interactive Actions)
1. **Add Vehicle:** Full asset registration modal (VIN, make, model, year, category, powertrain).
2. **Assign Vehicle:** Operator dispatch modal with designated route and return schedule.
3. **Add Fuel Record:** Transaction logging modal (volume, cost, odometer, fuel station).
4. **Schedule Maintenance:** Service booking modal with priority tags and scope of work.
5. **Record Vehicle Inspection:** DOT pre/post-trip safety checklist certification.
6. **View Live Tracking:** Full-screen GPS telemetry radar.

### 11. Complete 14-Item Sidebar Navigation
1. Dashboard
2. Vehicle Management
3. Vehicle Categories
4. Vehicle Allocation
5. Vehicle Availability
6. Vehicle Documents
7. GPS Tracking
8. Fuel Management
9. Maintenance Management
10. Driver Assignment
11. Vehicle Inspection
12. Fleet Reports
13. Notifications
14. My Profile

---

## 3. Getting Started

### Option A: Local Frontend Standalone
```bash
cd frontend
npm install
npm run build
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option B: Full Docker Compose (PostgreSQL + Redis + Spring Boot + React)
```bash
docker compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend REST API: [http://localhost:8080](http://localhost:8080)
- Swagger OpenAPI Docs: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

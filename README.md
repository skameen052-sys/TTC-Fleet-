# TTC Fleet360 - Enterprise Logistics and Fleet Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.2-red.svg)](https://redis.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20RBAC-orange.svg)](https://jwt.io/)

TTC Fleet360 is an enterprise-grade fleet logistics management application faithfully built to match the reference UI designs for both the **Login Page** and **Executive Admin Dashboard**.

---

## 🌟 Key Features

### Exact UI Match
- **Login Screen**: Full-screen light peach gradient, rounded white container, TTC modern orange logo, "Welcome Back", input forms, Google & Apple authentication options, and professional logistics truck hero panel with quote *"Drive your fleet with clarity, control, and confidence."*
- **Executive Admin Dashboard**: Dark navy sidebar, glowing active navigation item, top navigation with search, 9 unread notifications, Admin profile, date picker ("Nov 19, 2024"), 4 KPI cards (120 Users, 12 Branches, 8 Active Fleet, 95 Subscriptions), 3D truck visual with 360° ring and globe, 6-month Fleet Performance interactive line chart, 3D Branch Distribution map of India (Hyderabad 35%, Bengaluru 30%, Chennai 20%, Others 15%), live Recent Activities feed, Subscription Overview cards (Basic, Premium Most Popular, Enterprise), Upcoming Renewals list, and Fleet360 promotional banner.

### All 8 Complete Functional Modules
1. **Admin Login & Authentication**: Secure JWT generation, BCrypt password hashing, session management, remember-me support, role-based route guard, forgot password recovery flow.
2. **User Creation & Management**: User CRUD, search, role filters, activation/deactivation toggle, pagination, last-login audit.
3. **Role-Based Access Control (RBAC)**: 6 roles (`ROLE_SUPER_ADMIN`, `ROLE_ADMIN`, `ROLE_FLEET_MANAGER`, `ROLE_DISPATCHER`, `ROLE_DRIVER`, `ROLE_TECHNICIAN`) and granular permission matrix.
4. **Branch & Location Management**: 12 regional hub depots, vehicle capacity tracking, location updates, and staff allocation.
5. **Company Profile Management**: Corporate identity, CIN registration, GSTIN tax identifiers, address, and AWS S3 brand logo uploader.
6. **Subscription Management**: Basic (₹999/mo), Premium (₹2,499/mo), Enterprise (₹4,999/mo), renewal countdowns, extension actions, and payment invoice ledger.
7. **Configuration & System Settings**: Tabbed parameters across General, Notifications, Operations (GPS telematics interval), and Security.
8. **Audit Logs & Activity Monitoring**: Immutable event audit trail, date filtering, CSV export, and complete IP/browser login history.

---

## 🚀 Default Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `superadmin@ttcfleet360.com` | `Admin@123` |
| **Admin** | `admin@ttcfleet360.com` | `Admin@123` |
| **Fleet Lead** | `rahul.kumar@ttcfleet360.com` | `Admin@123` |

---

## 💻 Quick Start (Local Development)

### Prerequisites
- Java 17+ & Maven
- Node.js 18+ & npm

### 1. Start the Java Spring Boot Backend
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080`. API documentation available at `http://localhost:8080/swagger-ui.html`.*

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`. Opens to the login screen.*

---

## 🐳 Running with Docker & Docker Compose

Deploy the complete enterprise stack (PostgreSQL, Redis, Spring Boot Backend, and Nginx React Frontend):

```bash
docker-compose up -d --build
```

Access services:
- **Frontend App**: `http://localhost` (or `http://localhost:3000`)
- **Backend API**: `http://localhost:8080/api`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`
- **PostgreSQL Database**: `localhost:5432` (`ttc_fleet360`)
- **Redis Cache Engine**: `localhost:6379`

---

## 📂 Project Structure

```
TTC FLEET 3/
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/main/java/com/ttc/fleet360/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── entities/
│       ├── dto/
│       ├── security/
│       ├── config/
│       └── exceptions/
├── frontend/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layouts/
│       ├── services/
│       ├── context/
│       ├── hooks/
│       ├── routes/
│       ├── assets/
│       └── styles/
├── database/
│   ├── schema.sql
│   └── seed_data.sql
├── docker/
├── docs/
│   ├── ARCHITECTURE.md
│   └── API_DOCUMENTATION.md
├── .github/workflows/
│   └── ci-cd.yml
├── docker-compose.yml
└── README.md
```

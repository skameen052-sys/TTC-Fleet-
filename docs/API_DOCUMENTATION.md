# TTC Fleet360 - REST API Documentation

Swagger OpenAPI interactive UI is accessible locally at:  
`http://localhost:8080/swagger-ui.html`

OpenAPI JSON specification:  
`http://localhost:8080/api-docs`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 POST `/api/auth/login`
- **Description:** Authenticates user credentials via BCrypt and issues a signed JWT Bearer token.
- **Request Body:**
  ```json
  {
    "email": "admin@ttcfleet360.com",
    "password": "Admin@123",
    "rememberMe": true
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzM4NCJ9...",
      "tokenType": "Bearer",
      "expiresInMs": 86400000,
      "userId": 2,
      "email": "admin@ttcfleet360.com",
      "firstName": "Admin",
      "lastName": "Operations",
      "fullName": "Admin Operations",
      "roles": ["ROLE_ADMIN"],
      "permissions": ["USER_READ", "BRANCH_READ", "SUBSCRIPTION_READ"]
    }
  }
  ```

### 1.2 POST `/api/auth/register`
- **Description:** Registers a new user account with role assignment.

### 1.3 POST `/api/auth/logout`
- **Description:** Logs out the user session and records an audit log.

### 1.4 POST `/api/auth/forgot-password`
- **Description:** Generates a verified recovery token.

### 1.5 GET `/api/auth/me`
- **Description:** Returns the authenticated user's profile and roles.

---

## 2. Dashboard Analytics (`/api/dashboard`)

### 2.1 GET `/api/dashboard/summary`
- **Description:** Returns aggregated KPI counters, 6-month fleet trip trends, branch distribution percentages, recent activities, and upcoming renewals matching Image 2.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 120,
      "usersGrowthPercent": 12.0,
      "totalBranches": 12,
      "branchesGrowthPercent": 8.0,
      "activeFleet": 8,
      "fleetGrowthPercent": 5.0,
      "totalSubscriptions": 95,
      "subscriptionsGrowthPercent": 10.0,
      "months": ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
      "totalTripsSeries": [40, 58, 68, 78, 74, 88],
      "onTimeDeliverySeries": [30, 48, 60, 72, 68, 80],
      "branchDistribution": [
        { "city": "Hyderabad", "percentage": 35, "color": "#f97316" },
        { "city": "Bengaluru", "percentage": 30, "color": "#10b981" },
        { "city": "Chennai", "percentage": 20, "color": "#ea580c" },
        { "city": "Others", "percentage": 15, "color": "#8b5cf6" }
      ],
      "recentActivities": [...],
      "subscriptionPlans": [...],
      "upcomingRenewals": [...]
    }
  }
  ```

---

## 3. User Management (`/api/users`)

- **GET `/api/users`**: List and search users with pagination (`search`, `active`, `page`, `size`, `sort`).
- **GET `/api/users/{id}`**: Get single user details.
- **POST `/api/users`**: Create a new system user.
- **PUT `/api/users/{id}`**: Update user profile details.
- **PATCH `/api/users/{id}/status?active={true|false}`**: Toggle active/inactive status.
- **DELETE `/api/users/{id}`**: Permanently remove user.

---

## 4. Role & Permissions (`/api/roles`)

- **GET `/api/roles`**: List all system roles with assigned permissions.
- **GET `/api/roles/permissions`**: List all granular permissions categorized.
- **PUT `/api/roles/{id}/permissions`**: Update permission set for a role.

---

## 5. Branch Management (`/api/branches`)

- **GET `/api/branches`**: Search branches with pagination and status filter.
- **GET `/api/branches/all`**: Get all branches list.
- **POST `/api/branches`**: Create regional hub.
- **PUT `/api/branches/{id}`**: Update hub information.
- **DELETE `/api/branches/{id}`**: Decommission hub.
- **POST `/api/branches/{id}/assign-user?userId={id}&role={role}`**: Allocate staff to hub.

---

## 6. Company Profile (`/api/company`)

- **GET `/api/company`**: Fetch company profile details.
- **PUT `/api/company`**: Update company identity and registration info.
- **POST `/api/company/logo`**: Upload corporate logo to AWS S3.

---

## 7. Subscription Management (`/api/subscriptions`)

- **GET `/api/subscriptions/plans`**: List subscription tiers (Basic, Premium, Enterprise).
- **GET `/api/subscriptions`**: List active subscriptions with search and status.
- **GET `/api/subscriptions/renewals?days=30`**: Get upcoming expiration alerts.
- **POST `/api/subscriptions/{id}/renew?billingCycle={MONTHLY|ANNUAL}`**: Renew subscription.
- **GET `/api/subscriptions/payments`**: List invoice and transaction history.

---

## 8. Configuration Settings (`/api/settings`)

- **GET `/api/settings`**: Get all system configuration parameters.
- **GET `/api/settings/grouped`**: Get settings categorized by group.
- **PUT `/api/settings/{key}?value={value}`**: Update an individual setting.
- **PUT `/api/settings/batch`**: Batch update multiple settings.

---

## 9. Audit Logs (`/api/audit`)

- **GET `/api/audit`**: Filter system activity logs (`module`, `action`, `search`, `fromDate`, `toDate`, `page`, `size`).
- **GET `/api/audit/login-history`**: View user session and login audit trails.
- **GET `/api/audit/recent`**: Get top 5 recent activities for dashboard feeds.

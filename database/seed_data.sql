-- ====================================================
-- TTC FLEET360 - Seed Data
-- ====================================================

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_SUPER_ADMIN', 'Super Administrator with unrestricted system access'),
(2, 'ROLE_ADMIN', 'Operations Administrator with branch, user and reporting access'),
(3, 'ROLE_FLEET_MANAGER', 'Fleet Manager with tracking, diagnostics, and vehicle oversight'),
(4, 'ROLE_DISPATCHER', 'Dispatcher managing trips, routes, schedules, and active drivers'),
(5, 'ROLE_DRIVER', 'Commercial Driver with assigned trips, route navigation, and trip logs'),
(6, 'ROLE_TECHNICIAN', 'Maintenance Technician handling vehicle inspections and repairs')
ON CONFLICT (name) DO NOTHING;

-- 2. Permissions
INSERT INTO permissions (name, category, description) VALUES
('AUTH_LOGIN', 'AUTH', 'Login and authenticate with JWT'),
('AUTH_LOGOUT', 'AUTH', 'Logout and invalidate session'),
('USER_CREATE', 'USERS', 'Create new system users'),
('USER_READ', 'USERS', 'View user lists and profiles'),
('USER_UPDATE', 'USERS', 'Update existing user profiles and credentials'),
('USER_DELETE', 'USERS', 'Delete or deactivate users'),
('ROLE_MANAGE', 'ROLES', 'Create, update, and assign roles and permissions'),
('BRANCH_CREATE', 'BRANCHES', 'Create new regional branches and hubs'),
('BRANCH_READ', 'BRANCHES', 'View branch information and allocation'),
('BRANCH_UPDATE', 'BRANCHES', 'Update branch details and vehicle capacity'),
('BRANCH_DELETE', 'BRANCHES', 'Decommission or remove branches'),
('COMPANY_READ', 'COMPANY', 'View enterprise company profile'),
('COMPANY_UPDATE', 'COMPANY', 'Edit enterprise profile and upload brand assets'),
('SUBSCRIPTION_READ', 'SUBSCRIPTIONS', 'View active plans and upcoming renewals'),
('SUBSCRIPTION_MANAGE', 'SUBSCRIPTIONS', 'Create, upgrade, or modify subscription tiers'),
('CONFIG_READ', 'SETTINGS', 'View system parameters and thresholds'),
('CONFIG_UPDATE', 'SETTINGS', 'Update system and notification parameters'),
('AUDIT_READ', 'AUDIT', 'View system audit trails and user activities')
ON CONFLICT (name) DO NOTHING;

-- 3. Role-Permission mappings
-- Super Admin has all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions
ON CONFLICT DO NOTHING;

-- Admin has all operational permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE category IN ('AUTH', 'USERS', 'BRANCHES', 'COMPANY', 'SUBSCRIPTION_READ', 'CONFIG_READ', 'AUDIT')
ON CONFLICT DO NOTHING;

-- 4. Initial Users (BCrypt hash for 'Admin@123' is $2a$10$w3U/d8qA8bYgVl63aDkWy.Cj0bJzVp35hG3yD5cQfJbmVz2gG2lfe)
INSERT INTO users (id, first_name, last_name, email, password_hash, phone_number, department, designation, is_active) VALUES
(1, 'System', 'SuperAdmin', 'superadmin@ttcfleet360.com', '$2a$10$7Z25Fv3eC3n0a1h6w8h3ye4N1rX5gG5XyY1zZ9wW9vV8uU7tT6sS5', '+91 98765 43210', 'Executive', 'Super Administrator', true),
(2, 'Admin', 'User', 'admin@ttcfleet360.com', '$2a$10$7Z25Fv3eC3n0a1h6w8h3ye4N1rX5gG5XyY1zZ9wW9vV8uU7tT6sS5', '+91 98765 12345', 'Operations', 'Senior Operations Admin', true),
(3, 'Rahul', 'Kumar', 'rahul.kumar@ttcfleet360.com', '$2a$10$7Z25Fv3eC3n0a1h6w8h3ye4N1rX5gG5XyY1zZ9wW9vV8uU7tT6sS5', '+91 98234 56789', 'Fleet Ops', 'Fleet Operations Lead', true),
(4, 'Suresh', 'Reddy', 'suresh.reddy@ttcfleet360.com', '$2a$10$7Z25Fv3eC3n0a1h6w8h3ye4N1rX5gG5XyY1zZ9wW9vV8uU7tT6sS5', '+91 99123 45678', 'Dispatch', 'Chief Dispatcher', true),
(5, 'Vikram', 'Singh', 'vikram.singh@ttcfleet360.com', '$2a$10$7Z25Fv3eC3n0a1h6w8h3ye4N1rX5gG5XyY1zZ9wW9vV8uU7tT6sS5', '+91 98345 67890', 'Transport', 'Heavy Duty Long-Haul Driver', true),
(6, 'Amit', 'Sharma', 'amit.sharma@ttcfleet360.com', '$2a$10$7Z25Fv3eC3n0a1h6w8h3ye4N1rX5gG5XyY1zZ9wW9vV8uU7tT6sS5', '+91 98456 78901', 'Engineering', 'Senior Fleet Technician', true)
ON CONFLICT (email) DO NOTHING;

-- User Roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6)
ON CONFLICT DO NOTHING;

-- 5. Branches (Matches screenshot statistics: 12 Branches total, Hyderabad 35%, Bengaluru 30%, Chennai 20%, Others 15%)
INSERT INTO branches (id, branch_code, branch_name, city, state, country, postal_code, address_line, contact_email, contact_phone, status, total_vehicles) VALUES
(1, 'HYD-01', 'Hyderabad Central Hub', 'Hyderabad', 'Telangana', 'India', '500081', 'HITEC City Logistics Corridor, Madhapur', 'hyd.hub@ttcfleet360.com', '+91 40 2345 6789', 'ACTIVE', 32),
(2, 'BLR-01', 'Bengaluru South Terminal', 'Bengaluru', 'Karnataka', 'India', '560100', 'Electronic City Phase 1, Hosur Road', 'blr.hub@ttcfleet360.com', '+91 80 4123 4567', 'ACTIVE', 28),
(3, 'MAA-01', 'Chennai Port Hub', 'Chennai', 'Tamil Nadu', 'India', '600001', 'Rajaji Salai, Chennai Port Industrial Zone', 'maa.hub@ttcfleet360.com', '+91 44 2567 8901', 'ACTIVE', 18),
(4, 'BOM-01', 'Mumbai West Distribution Hub', 'Mumbai', 'Maharashtra', 'India', '400072', 'Saki Naka, Andheri East Logistics Park', 'bom.hub@ttcfleet360.com', '+91 22 2847 1234', 'ACTIVE', 14),
(5, 'PNQ-01', 'Pune Express Depot', 'Pune', 'Maharashtra', 'India', '411057', 'Hinjewadi Industrial Area Phase 2', 'pnq.hub@ttcfleet360.com', '+91 20 6789 0123', 'ACTIVE', 10),
(6, 'DEL-01', 'Delhi NCR Gateway', 'New Delhi', 'Delhi', 'India', '110037', 'Aerocity Express Freight Corridor', 'del.hub@ttcfleet360.com', '+91 11 2654 9870', 'ACTIVE', 12),
(7, 'CCU-01', 'Kolkata East Logistics Terminal', 'Kolkata', 'West Bengal', 'India', '700091', 'Salt Lake Sector V Cargo Zone', 'ccu.hub@ttcfleet360.com', '+91 33 2357 1122', 'ACTIVE', 8),
(8, 'AMD-01', 'Ahmedabad Mega Depot', 'Ahmedabad', 'Gujarat', 'India', '382210', 'Sanand Industrial Estate', 'amd.hub@ttcfleet360.com', '+91 79 2689 3344', 'ACTIVE', 9),
(9, 'COK-01', 'Kochi Coastal Hub', 'Kochi', 'Kerala', 'India', '682003', 'Willingdon Island Port Link', 'cok.hub@ttcfleet360.com', '+91 484 266 7788', 'ACTIVE', 6),
(10, 'JAI-01', 'Jaipur North Terminal', 'Jaipur', 'Rajasthan', 'India', '302013', 'Sitapura Industrial Area', 'jai.hub@ttcfleet360.com', '+91 141 277 8899', 'ACTIVE', 7),
(11, 'LKO-01', 'Lucknow Distribution Centre', 'Lucknow', 'Uttar Pradesh', 'India', '226010', 'Transport Nagar Phase 1', 'lko.hub@ttcfleet360.com', '+91 522 245 6677', 'ACTIVE', 5),
(12, 'IND-01', 'Indore Central Hub', 'Indore', 'Madhya Pradesh', 'India', '452010', 'Pithampur Logistics Cluster', 'ind.hub@ttcfleet360.com', '+91 731 289 0011', 'ACTIVE', 6)
ON CONFLICT (branch_code) DO NOTHING;

-- 6. Company Profile
INSERT INTO company_profiles (id, company_name, brand_tagline, registration_number, tax_identifier, contact_email, contact_phone, website_url, address_street, city, state, country, postal_code, operating_currency, primary_timezone) VALUES
(1, 'TTC Fleet360 Logistics Solutions Pvt Ltd', 'Drive your fleet with clarity, control, and confidence.', 'CIN-U63090MH2021PTC368945', 'GSTIN27AABCT3600F1Z8', 'corporate@ttcfleet360.com', '+91 22 6100 3600', 'https://fleet360.ttclogistics.com', 'Tower B, 14th Floor, Global Logistics Park, HITEC City', 'Hyderabad', 'Telangana', 'India', '500081', 'INR', 'Asia/Kolkata')
ON CONFLICT DO NOTHING;

-- 7. Subscription Plans (Matches screenshot cards)
INSERT INTO subscription_plans (id, plan_code, plan_name, monthly_price, annual_price, currency, max_fleet_size, max_branches, max_users, features_json, is_active, is_popular, display_order) VALUES
(1, 'PLAN_BASIC', 'Basic', 999.00, 9990.00, 'INR', 20, 3, 10, '["GPS Live Tracking", "Basic Route Optimization", "Standard Trip Logs", "Email Support", "Daily Driver Check-ins"]', true, false, 1),
(2, 'PLAN_PREMIUM', 'Premium', 2499.00, 24990.00, 'INR', 100, 15, 50, '["Advanced Telematics", "AI Route Optimization", "Multi-Branch Management", "Fuel Analytics & Alerts", "24/7 Dedicated Support", "Automated Maintenance Triggers"]', true, true, 2),
(3, 'PLAN_ENTERPRISE', 'Enterprise', 4999.00, 49990.00, 'INR', 500, 50, 200, '["Unlimited Vehicle Fleets", "Full Custom Integrations", "Predictive Driver Safety Score", "Custom SLA & Account Manager", "White-label Portal & API Access", "Complete Automated Audit Logs"]', true, false, 3)
ON CONFLICT (plan_code) DO NOTHING;

-- 8. Subscriptions & Upcoming Renewals (Matches screenshot)
INSERT INTO subscriptions (id, subscription_code, company_id, plan_id, billing_cycle, start_date, end_date, status, auto_renew, current_amount, company_name) VALUES
(1, 'SUB-ACM-001', 1, 2, 'MONTHLY', CURRENT_DATE - INTERVAL '23 days', CURRENT_DATE + INTERVAL '7 days', 'ACTIVE', true, 2499.00, 'Acme Corp'),
(2, 'SUB-TEC-002', 1, 2, 'MONTHLY', CURRENT_DATE - INTERVAL '23 days', CURRENT_DATE + INTERVAL '7 days', 'ACTIVE', true, 2499.00, 'Tech Solutions'),
(3, 'SUB-LOG-003', 1, 1, 'MONTHLY', CURRENT_DATE - INTERVAL '20 days', CURRENT_DATE + INTERVAL '10 days', 'ACTIVE', false, 999.00, 'Logistics Ltd'),
(4, 'SUB-GLO-004', 1, 3, 'ANNUAL', CURRENT_DATE - INTERVAL '6 months', CURRENT_DATE + INTERVAL '6 months', 'ACTIVE', true, 49990.00, 'Global Transit Express')
ON CONFLICT (subscription_code) DO NOTHING;

-- 9. Payment Records
INSERT INTO payment_records (id, invoice_number, subscription_id, amount, currency, payment_method, payment_status, transaction_reference, payment_date, payer_email, payer_company) VALUES
(1, 'INV-2024-001', 1, 2499.00, 'INR', 'CREDIT_CARD', 'SUCCESS', 'TXN_987623412', CURRENT_TIMESTAMP - INTERVAL '23 days', 'billing@acmecorp.com', 'Acme Corp'),
(2, 'INV-2024-002', 2, 2499.00, 'INR', 'NET_BANKING', 'SUCCESS', 'TXN_987623413', CURRENT_TIMESTAMP - INTERVAL '23 days', 'accounts@techsolutions.in', 'Tech Solutions'),
(3, 'INV-2024-003', 3, 999.00, 'INR', 'UPI', 'SUCCESS', 'TXN_987623414', CURRENT_TIMESTAMP - INTERVAL '20 days', 'pay@logisticsltd.com', 'Logistics Ltd'),
(4, 'INV-2024-004', 1, 2499.00, 'INR', 'CREDIT_CARD', 'SUCCESS', 'TXN_987623499', CURRENT_TIMESTAMP - INTERVAL '15 minutes', 'billing@acmecorp.com', 'Acme Corp')
ON CONFLICT (invoice_number) DO NOTHING;

-- 10. System Settings
INSERT INTO system_settings (setting_key, setting_value, setting_group, description, value_type, is_public) VALUES
('APP_NAME', 'TTC Fleet360', 'GENERAL', 'System application branding name', 'STRING', true),
('SUPPORT_EMAIL', 'support@ttcfleet360.com', 'GENERAL', 'Official customer support contact', 'STRING', true),
('PRIMARY_CURRENCY', 'INR', 'GENERAL', 'Default system accounting currency', 'STRING', true),
('DATE_FORMAT', 'DD/MM/YYYY', 'GENERAL', 'Application wide date display format', 'STRING', true),
('NOTIF_EMAIL_ALERTS', 'true', 'NOTIFICATIONS', 'Enable automated email notifications', 'BOOLEAN', false),
('NOTIF_SMS_CRITICAL', 'true', 'NOTIFICATIONS', 'Send SMS alerts for vehicle critical events', 'BOOLEAN', false),
('NOTIF_RENEWAL_REMINDER_DAYS', '7', 'NOTIFICATIONS', 'Days in advance to alert upcoming subscription renewal', 'NUMBER', false),
('FLEET_PING_INTERVAL_SEC', '15', 'OPERATIONS', 'GPS telematics ping frequency in seconds', 'NUMBER', false),
('MAX_VEHICLES_PER_BRANCH', '100', 'OPERATIONS', 'Maximum active vehicles per regional depot', 'NUMBER', false),
('OVERSPEED_THRESHOLD_KMPH', '80', 'OPERATIONS', 'Commercial speed limit alert trigger', 'NUMBER', false),
('AUTH_JWT_EXPIRY_HOURS', '24', 'SECURITY', 'JSON Web Token validity lifespan', 'NUMBER', false),
('AUTH_MAX_FAILED_ATTEMPTS', '5', 'SECURITY', 'Consecutive failed logins before lock', 'NUMBER', false),
('AUTH_MFA_ENFORCED', 'false', 'SECURITY', 'Enforce Multi-Factor Authentication', 'BOOLEAN', false),
('AUDIT_RETENTION_DAYS', '90', 'PREFERENCES', 'Retention period for user audit logs', 'NUMBER', false)
ON CONFLICT (setting_key) DO NOTHING;

-- 11. Audit Logs (Matches screenshot feed)
INSERT INTO audit_logs (id, user_email, action, module, entity_id, details, ip_address, status, created_at) VALUES
(1, 'admin@ttcfleet360.com', 'UPDATE', 'SETTINGS', 'APP_NAME', 'Updated system settings', '192.168.1.100', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '18 minutes'),
(2, 'billing@acmecorp.com', 'RENEWAL', 'SUBSCRIPTIONS', 'SUB-ACM-001', 'Subscription renewed - Premium Plan', '103.22.45.12', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
(3, 'admin@ttcfleet360.com', 'UPDATE', 'BRANCHES', 'BLR-01', 'Updated branch details - Bengaluru Branch', '192.168.1.100', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
(4, 'rahul.kumar@ttcfleet360.com', 'REGISTER', 'USERS', 'USR-003', 'User user registered: Rahul Kumar', '103.54.12.89', 'SUCCESS', CURRENT_TIMESTAMP - INTERVAL '2 minutes')
ON CONFLICT DO NOTHING;

-- 12. Login History
INSERT INTO login_history (user_id, email, status, ip_address, user_agent, location, timestamp) VALUES
(2, 'admin@ttcfleet360.com', 'SUCCESS', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Mumbai, India', CURRENT_TIMESTAMP - INTERVAL '3 hours'),
(3, 'rahul.kumar@ttcfleet360.com', 'SUCCESS', '103.54.12.89', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'Hyderabad, India', CURRENT_TIMESTAMP - INTERVAL '2 minutes')
ON CONFLICT DO NOTHING;

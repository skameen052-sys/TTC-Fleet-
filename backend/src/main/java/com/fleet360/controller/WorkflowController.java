package com.fleet360.controller;

import com.fleet360.model.*;
import com.fleet360.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/workflow")
@CrossOrigin(origins = "*", maxAge = 3600)
public class WorkflowController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ShipmentRepository shipmentRepository;

    @Autowired
    private TripRepository tripRepository;

    @Autowired
    private AllocationRequestRepository allocationRequestRepository;

    @Autowired
    private WarehouseOperationRepository warehouseOperationRepository;

    @Autowired
    private InventoryStockRepository inventoryStockRepository;

    @Autowired
    private BillingInvoiceRepository billingInvoiceRepository;

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private SystemNotificationRepository systemNotificationRepository;

    @Autowired
    private WorkflowAuditLogRepository workflowAuditLogRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private DriverRepository driverRepository;

    private static final DateTimeFormatter ISO_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ==========================================
    // 1. GET AGGREGATED WORKFLOW STATE
    // ==========================================
    @GetMapping("/state")
    public ResponseEntity<Map<String, Object>> getFullState() {
        Map<String, Object> state = new HashMap<>();
        state.put("success", true);
        state.put("timestamp", LocalDateTime.now().format(ISO_FMT));
        state.put("orders", orderRepository.findAll());
        state.put("shipments", shipmentRepository.findAll());
        state.put("trips", tripRepository.findAll());
        state.put("allocations", allocationRequestRepository.findAll());
        state.put("warehouseOperations", warehouseOperationRepository.findAll());
        state.put("inventory", inventoryStockRepository.findAll());
        state.put("invoices", billingInvoiceRepository.findAll());
        state.put("payments", paymentTransactionRepository.findAll());
        state.put("notifications", systemNotificationRepository.findAll());
        state.put("auditLogs", workflowAuditLogRepository.findTop50ByOrderByRecordedAtDesc());
        return ResponseEntity.ok(state);
    }

    // ==========================================
    // 2. CREATE CUSTOMER ORDER
    // ==========================================
    @PostMapping("/orders")
    @Transactional
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody CustomerOrder orderReq) {
        String orderId = orderReq.getOrderId();
        if (orderId == null || orderId.trim().isEmpty()) {
            orderId = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            orderReq.setOrderId(orderId);
        }

        orderReq.setOrderStatus("Pending Approval");
        if (orderReq.getAmount() == null) {
            orderReq.setAmount(14500.0);
        }
        if (orderReq.getCreatedAt() == null) {
            orderReq.setCreatedAt(LocalDateTime.now());
        }

        CustomerOrder saved = orderRepository.save(orderReq);

        // Notify Logistics
        createNotification("ROLE_LOGISTICS_MANAGER", "ALL",
                "New Order Pending Approval",
                "Customer " + (saved.getCustomerName() != null ? saved.getCustomerName() : saved.getCustomerId()) +
                        " placed order " + orderId + " for " + saved.getGoodsCategory() + " (" + saved.getWeightKg() + " kg).",
                "ORDER_CREATED", "logistics", "orders");

        // Audit Log
        logAudit("customer", saved.getCustomerId() != null ? saved.getCustomerId() : "CUST-APP",
                "CREATE_ORDER", "ORDER", orderId, "Created transportation order with status Pending Approval");

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Order " + orderId + " submitted successfully.");
        resp.put("order", saved);
        return ResponseEntity.ok(resp);
    }

    // ==========================================
    // 3. LOGISTICS APPROVES / REJECTS ORDER
    // ==========================================
    @PutMapping("/orders/{orderId}/status")
    @Transactional
    public ResponseEntity<Map<String, Object>> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");
        String actor = body.getOrDefault("actor", "elena.rostova");
        String reason = body.getOrDefault("reason", "");

        Optional<CustomerOrder> opt = orderRepository.findByOrderId(orderId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Order not found: " + orderId));
        }

        CustomerOrder order = opt.get();
        order.setOrderStatus(newStatus);
        orderRepository.save(order);

        // Notify Customer
        createNotification("ROLE_CUSTOMER", order.getCustomerId(),
                "Order Status: " + newStatus,
                "Your order " + orderId + " has been " + newStatus.toLowerCase() + (reason.isEmpty() ? "." : " (" + reason + ")."),
                "ORDER_STATUS_UPDATE", "customer", "orders");

        logAudit("logistics_manager", actor, "UPDATE_ORDER_STATUS", "ORDER", orderId,
                "Order status updated to " + newStatus + (reason.isEmpty() ? "" : " - " + reason));

        Shipment shipment = null;
        Trip trip = null;
        AllocationRequest allocReq = null;

        // When Approved: Automatically create Shipment, Trip, and Allocation Request
        if ("Approved".equalsIgnoreCase(newStatus)) {
            String shipmentId = "SHP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String tripId = "TRP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String reqId = "REQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // Create Shipment
            shipment = new Shipment();
            shipment.setShipmentId(shipmentId);
            shipment.setOrderId(orderId);
            shipment.setCustomerId(order.getCustomerId());
            shipment.setCustomerName(order.getCustomerName());
            shipment.setOrigin(order.getPickupAddress());
            shipment.setDestination(order.getDeliveryAddress());
            shipment.setStatus("Created");
            shipment.setEstimatedDistanceKm(540.0);
            shipment.setCreatedAt(LocalDateTime.now());
            shipment = shipmentRepository.save(shipment);

            // Create Scheduled Trip
            trip = new Trip();
            trip.setTripId(tripId);
            trip.setShipmentId(shipmentId);
            trip.setOrderId(orderId);
            trip.setStartLocation(order.getPickupAddress());
            trip.setDestination(order.getDeliveryAddress());
            trip.setStatus("Assigned");
            trip.setCreatedAt(LocalDateTime.now());
            trip = tripRepository.save(trip);

            // Create Allocation Request to Fleet Manager
            allocReq = new AllocationRequest();
            allocReq.setRequestId(reqId);
            allocReq.setShipmentId(shipmentId);
            allocReq.setOrderId(orderId);
            allocReq.setRequiredCapacityKg(order.getWeightKg() != null ? order.getWeightKg() : 5000.0);
            allocReq.setRequestedVehicleType(order.getWeightKg() != null && order.getWeightKg() > 10000 ? "Heavy Linehaul (Volvo FH16)" : "Medium Freight Van");
            allocReq.setRoute(order.getPickupAddress() + " -> " + order.getDeliveryAddress());
            allocReq.setStatus("Pending");
            allocReq.setCreatedAt(LocalDateTime.now());
            allocReq = allocationRequestRepository.save(allocReq);

            // Link to Order
            order.setAssignedShipmentId(shipmentId);
            order.setAssignedTripId(tripId);
            orderRepository.save(order);

            // Notify Fleet Manager
            createNotification("ROLE_MANAGER", "ALL",
                    "Vehicle & Driver Allocation Request",
                    "New allocation request " + reqId + " for Shipment " + shipmentId + " (" + order.getGoodsCategory() + ", " + order.getWeightKg() + " kg).",
                    "ALLOCATION_REQUEST", "manager", "allocation");

            logAudit("logistics_manager", actor, "CREATE_ALLOCATION_REQUEST", "ALLOCATION", reqId,
                    "Dispatched vehicle/driver allocation request to Fleet Manager for shipment " + shipmentId);
        }

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("order", order);
        resp.put("shipment", shipment);
        resp.put("trip", trip);
        resp.put("allocationRequest", allocReq);
        return ResponseEntity.ok(resp);
    }

    // ==========================================
    // 4. FLEET MANAGER CONFIRMS ALLOCATION
    // ==========================================
    @PutMapping("/allocations/{requestId}/confirm")
    @Transactional
    public ResponseEntity<Map<String, Object>> confirmAllocation(
            @PathVariable String requestId,
            @RequestBody Map<String, String> body) {

        String vehicleReg = body.get("vehicleReg");
        String driverId = body.get("driverId");
        String driverName = body.getOrDefault("driverName", "Marcus Vance");
        String driverPhone = body.getOrDefault("driverPhone", "+1 (555) 019-2834");
        String actor = body.getOrDefault("actor", "Vikram Malhotra");

        Optional<AllocationRequest> opt = allocationRequestRepository.findByRequestId(requestId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Allocation request not found: " + requestId));
        }

        AllocationRequest req = opt.get();
        req.setStatus("Confirmed");
        req.setAssignedVehicleReg(vehicleReg);
        req.setAssignedDriverId(driverId);
        req.setAssignedDriverName(driverName);
        req.setConfirmedAt(LocalDateTime.now());
        allocationRequestRepository.save(req);

        // Update Trip with assigned Vehicle & Driver
        Optional<Trip> tripOpt = tripRepository.findByShipmentId(req.getShipmentId());
        Trip trip = null;
        if (tripOpt.isPresent()) {
            trip = tripOpt.get();
            trip.setVehicleReg(vehicleReg);
            trip.setDriverId(driverId);
            trip.setDriverName(driverName);
            trip.setDriverPhone(driverPhone);
            trip.setStatus("Assigned");
            tripRepository.save(trip);
        }

        // Update Shipment
        Optional<Shipment> shipOpt = shipmentRepository.findByShipmentId(req.getShipmentId());
        if (shipOpt.isPresent()) {
            Shipment s = shipOpt.get();
            s.setAssignedVehicleReg(vehicleReg);
            s.setAssignedDriver(driverName + " (" + driverId + ")");
            shipmentRepository.save(s);
        }

        // Update Vehicle status in DB to "On Trip" if vehicle exists
        List<Vehicle> vehicles = vehicleRepository.findAll();
        for (Vehicle v : vehicles) {
            if (v.getRegNumber() != null && v.getRegNumber().equalsIgnoreCase(vehicleReg)) {
                v.setStatus("On Trip");
                vehicleRepository.save(v);
                break;
            }
        }

        // Notify Driver
        createNotification("ROLE_DRIVER", driverId,
                "New Linehaul Trip Assigned",
                "Trip " + (trip != null ? trip.getTripId() : "TRP") + " assigned to vehicle " + vehicleReg + " for shipment " + req.getShipmentId() + ".",
                "TRIP_ASSIGNED", "driver", "trips");

        // Notify Logistics
        createNotification("ROLE_LOGISTICS_MANAGER", "ALL",
                "Vehicle & Driver Confirmed",
                "Fleet Manager confirmed " + vehicleReg + " with driver " + driverName + " for shipment " + req.getShipmentId() + ".",
                "ALLOCATION_CONFIRMED", "logistics", "shipments");

        logAudit("fleet_manager", actor, "CONFIRM_ALLOCATION", "ALLOCATION", requestId,
                "Allocated vehicle " + vehicleReg + " and driver " + driverName + " (" + driverId + ")");

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("allocation", req);
        resp.put("trip", trip);
        return ResponseEntity.ok(resp);
    }

    // ==========================================
    // 5. DRIVER STATUS TRANSITION WORKFLOW
    // Assigned -> Accepted -> At Pickup -> Picked Up -> Started -> In Transit -> At Destination -> Delivered -> Completed
    // ==========================================
    @PutMapping("/trips/{tripId}/status")
    @Transactional
    public ResponseEntity<Map<String, Object>> updateTripStatus(
            @PathVariable String tripId,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");
        String actor = body.getOrDefault("actor", "Marcus Vance");
        String notes = body.getOrDefault("notes", "");

        Optional<Trip> opt = tripRepository.findByTripId(tripId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Trip not found: " + tripId));
        }

        Trip trip = opt.get();
        String oldStatus = trip.getStatus();
        trip.setStatus(newStatus);

        if ("Started".equalsIgnoreCase(newStatus) || "In Transit".equalsIgnoreCase(newStatus)) {
            // Update Shipment status
            Optional<Shipment> shipOpt = shipmentRepository.findByShipmentId(trip.getShipmentId());
            shipOpt.ifPresent(s -> {
                s.setStatus("In Transit");
                shipmentRepository.save(s);
            });
            // Update Order status
            Optional<CustomerOrder> orderOpt = orderRepository.findByOrderId(trip.getOrderId());
            orderOpt.ifPresent(o -> {
                o.setOrderStatus("In Transit");
                orderRepository.save(o);
            });
        } else if ("Delivered".equalsIgnoreCase(newStatus) || "Completed".equalsIgnoreCase(newStatus)) {
            trip.setDeliveredAt(LocalDateTime.now().format(ISO_FMT));
        }

        tripRepository.save(trip);

        // Notify relevant parties
        createNotification("ROLE_CUSTOMER", "ALL",
                "Delivery Update: " + newStatus,
                "Trip " + tripId + " is now " + newStatus + (notes.isEmpty() ? "." : " (" + notes + ")."),
                "TRIP_STATUS_CHANGE", "customer", "tracking");

        createNotification("ROLE_LOGISTICS_MANAGER", "ALL",
                "Trip " + tripId + " Status: " + newStatus,
                "Driver transitioned trip to " + newStatus,
                "TRIP_STATUS_CHANGE", "logistics", "trips");

        logAudit("driver", actor, "TRIP_STATUS_TRANSITION", "TRIP", tripId,
                "Trip transitioned from " + oldStatus + " to " + newStatus);

        return ResponseEntity.ok(Map.of("success", true, "trip", trip));
    }

    // ==========================================
    // 6. DRIVER GPS TELEMETRY BROADCAST
    // ==========================================
    @PostMapping("/trips/{tripId}/gps")
    @Transactional
    public ResponseEntity<Map<String, Object>> updateTripGps(
            @PathVariable String tripId,
            @RequestBody Map<String, Object> body) {

        Optional<Trip> opt = tripRepository.findByTripId(tripId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Trip not found: " + tripId));
        }

        Trip trip = opt.get();
        if (body.containsKey("lat")) trip.setLatitude(Double.parseDouble(body.get("lat").toString()));
        if (body.containsKey("lng")) trip.setLongitude(Double.parseDouble(body.get("lng").toString()));
        if (body.containsKey("speed")) trip.setCurrentSpeedKmh((int) Double.parseDouble(body.get("speed").toString()));
        if (body.containsKey("eta")) trip.setEtaHours(body.get("eta").toString());

        trip.setLastGpsUpdate(LocalDateTime.now());
        tripRepository.save(trip);

        return ResponseEntity.ok(Map.of("success", true, "message", "GPS telemetry updated.", "trip", trip));
    }

    // ==========================================
    // 7. DRIVER SUBMITS PROOF OF DELIVERY (e-POD)
    // ==========================================
    @PostMapping("/trips/{tripId}/pod")
    @Transactional
    public ResponseEntity<Map<String, Object>> submitPod(
            @PathVariable String tripId,
            @RequestBody Map<String, String> body) {

        String receiverName = body.getOrDefault("receiverName", "Authorized Receiver");
        String signatureSvg = body.getOrDefault("signatureSvg", "data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=");
        String photoUrl = body.getOrDefault("photoUrl", "/assets/pod-delivered.jpg");
        String actor = body.getOrDefault("actor", "Marcus Vance");

        Optional<Trip> opt = tripRepository.findByTripId(tripId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Trip not found: " + tripId));
        }

        Trip trip = opt.get();
        trip.setStatus("Completed");
        trip.setPodSignature(signatureSvg);
        trip.setPodPhotoUrl(photoUrl);
        trip.setDeliveredAt(LocalDateTime.now().format(ISO_FMT));
        tripRepository.save(trip);

        // Update Shipment to Delivered
        Optional<Shipment> shipOpt = shipmentRepository.findByShipmentId(trip.getShipmentId());
        shipOpt.ifPresent(s -> {
            s.setStatus("Delivered");
            shipmentRepository.save(s);
        });

        // Update Customer Order to Completed
        Optional<CustomerOrder> orderOpt = orderRepository.findByOrderId(trip.getOrderId());
        CustomerOrder order = null;
        if (orderOpt.isPresent()) {
            order = orderOpt.get();
            order.setOrderStatus("Completed");
            orderRepository.save(order);
        }

        // Release Vehicle to Available
        if (trip.getVehicleReg() != null) {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            for (Vehicle v : vehicles) {
                if (v.getRegNumber() != null && v.getRegNumber().equalsIgnoreCase(trip.getVehicleReg())) {
                    v.setStatus("Available");
                    vehicleRepository.save(v);
                    break;
                }
            }
        }

        // Auto-Generate Customer Billing Invoice
        BillingInvoice invoice = new BillingInvoice();
        String invoiceId = "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        invoice.setInvoiceId(invoiceId);
        invoice.setOrderId(trip.getOrderId());
        invoice.setShipmentId(trip.getShipmentId());
        invoice.setCustomerId(order != null ? order.getCustomerId() : "CUST-8021");
        invoice.setCustomerName(order != null ? order.getCustomerName() : "NexGen Industrial Corp");

        double subtotal = (order != null && order.getAmount() != null) ? order.getAmount() : 12500.0;
        double gst = Math.round(subtotal * 0.18 * 100.0) / 100.0;
        invoice.setAmount(subtotal);
        invoice.setTax(gst);
        invoice.setTotal(subtotal + gst);
        invoice.setStatus("Pending");
        invoice.setCreatedAt(LocalDateTime.now());
        billingInvoiceRepository.save(invoice);

        // Notify Customer & Billing
        createNotification("ROLE_CUSTOMER", invoice.getCustomerId(),
                "Shipment Delivered - Invoice Generated",
                "Your shipment for order " + trip.getOrderId() + " was delivered to " + receiverName + ". Invoice " + invoiceId + " generated.",
                "SHIPMENT_DELIVERED", "customer", "invoices");

        createNotification("ROLE_FINANCE_MANAGER", "ALL",
                "New Invoice Pending Settlement",
                "Invoice " + invoiceId + " ($" + invoice.getTotal() + ") generated for delivered order " + trip.getOrderId(),
                "INVOICE_GENERATED", "billing", "invoices");

        logAudit("driver", actor, "SUBMIT_POD_COMPLETE_TRIP", "TRIP", tripId,
                "e-POD submitted. Delivered to " + receiverName + ". Vehicle released to Available.");

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("trip", trip);
        resp.put("invoice", invoice);
        return ResponseEntity.ok(resp);
    }

    // ==========================================
    // 8. CUSTOMER PAYS INVOICE
    // ==========================================
    @PostMapping("/billing/pay")
    @Transactional
    public ResponseEntity<Map<String, Object>> payInvoice(@RequestBody Map<String, Object> body) {
        String invoiceId = body.get("invoiceId").toString();
        String paymentMethod = body.getOrDefault("method", "RTGS / Corporate NetBanking").toString();
        String actor = body.getOrDefault("actor", "Sarah Jenkins (Customer)").toString();

        Optional<BillingInvoice> opt = billingInvoiceRepository.findByInvoiceId(invoiceId);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Invoice not found: " + invoiceId));
        }

        BillingInvoice invoice = opt.get();
        invoice.setStatus("Paid");
        invoice.setPaidDate(LocalDateTime.now().format(ISO_FMT));
        invoice.setPaymentMethod(paymentMethod);
        billingInvoiceRepository.save(invoice);

        // Create Payment Transaction Record
        String paymentId = "PAY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        PaymentTransaction pay = new PaymentTransaction();
        pay.setPaymentId(paymentId);
        pay.setInvoiceId(invoiceId);
        pay.setOrderId(invoice.getOrderId());
        pay.setCustomerId(invoice.getCustomerId());
        pay.setAmount(invoice.getTotal());
        pay.setMethod(paymentMethod);
        pay.setTransactionRef("TXN-CORP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        pay.setStatus("Completed");
        pay.setCreatedAt(LocalDateTime.now());
        paymentTransactionRepository.save(pay);

        // Notify Billing & Admin
        createNotification("ROLE_FINANCE_MANAGER", "ALL",
                "Payment Received: " + paymentId,
                "Customer settled invoice " + invoiceId + " for $" + invoice.getTotal() + " via " + paymentMethod,
                "PAYMENT_RECEIVED", "billing", "payments");

        createNotification("ROLE_ADMIN", "ALL",
                "Corporate Cashflow Inflow: $" + invoice.getTotal(),
                "Invoice " + invoiceId + " settled by " + invoice.getCustomerName(),
                "CASHFLOW_UPDATE", "admin", "dashboard");

        logAudit("customer", actor, "SETTLE_INVOICE_PAYMENT", "PAYMENT", paymentId,
                "Settled invoice " + invoiceId + " amount: $" + invoice.getTotal());

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("invoice", invoice);
        resp.put("payment", pay);
        return ResponseEntity.ok(resp);
    }

    // ==========================================
    // 9. WAREHOUSE OPERATIONS (RECEIVE & DISPATCH)
    // ==========================================
    @PostMapping("/warehouse/receive")
    @Transactional
    public ResponseEntity<Map<String, Object>> warehouseReceive(@RequestBody Map<String, String> body) {
        String shipmentId = body.get("shipmentId");
        String warehouseId = body.getOrDefault("warehouseId", "WH-CENTRAL-01");
        String bayNumber = body.getOrDefault("bayNumber", "BAY-04");
        String actor = body.getOrDefault("actor", "Ethan Cole");

        String opId = "WH-RCV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        WarehouseOperation op = new WarehouseOperation();
        op.setOperationId(opId);
        op.setWarehouseId(warehouseId);
        op.setShipmentId(shipmentId);
        op.setOperationType("Receiving");
        op.setBayNumber(bayNumber);
        op.setStatus("Completed");
        op.setCreatedAt(LocalDateTime.now());
        warehouseOperationRepository.save(op);

        // Update Shipment status
        Optional<Shipment> shipOpt = shipmentRepository.findByShipmentId(shipmentId);
        shipOpt.ifPresent(s -> {
            s.setStatus("In Warehouse Cross-Dock");
            shipmentRepository.save(s);
        });

        logAudit("warehouse_manager", actor, "WAREHOUSE_GOODS_RECEIVED", "WAREHOUSE", opId,
                "Goods received and inspected at " + warehouseId + " (" + bayNumber + ")");

        return ResponseEntity.ok(Map.of("success", true, "operation", op));
    }

    @PostMapping("/warehouse/dispatch")
    @Transactional
    public ResponseEntity<Map<String, Object>> warehouseDispatch(@RequestBody Map<String, String> body) {
        String shipmentId = body.get("shipmentId");
        String warehouseId = body.getOrDefault("warehouseId", "WH-CENTRAL-01");
        String bayNumber = body.getOrDefault("bayNumber", "BAY-07");
        String actor = body.getOrDefault("actor", "Ethan Cole");

        String opId = "WH-DSP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        WarehouseOperation op = new WarehouseOperation();
        op.setOperationId(opId);
        op.setWarehouseId(warehouseId);
        op.setShipmentId(shipmentId);
        op.setOperationType("Dispatch");
        op.setBayNumber(bayNumber);
        op.setStatus("Completed");
        op.setCreatedAt(LocalDateTime.now());
        warehouseOperationRepository.save(op);

        // Update Shipment status
        Optional<Shipment> shipOpt = shipmentRepository.findByShipmentId(shipmentId);
        shipOpt.ifPresent(s -> {
            s.setStatus("Ready for Dispatch");
            shipmentRepository.save(s);
        });

        // Notify Driver & Logistics
        createNotification("ROLE_DRIVER", "ALL",
                "Shipment Ready for Dispatch",
                "Shipment " + shipmentId + " inspected and staged at " + bayNumber + " for loading.",
                "SHIPMENT_DISPATCH_READY", "driver", "trips");

        logAudit("warehouse_manager", actor, "WAREHOUSE_DISPATCH_CONFIRMED", "WAREHOUSE", opId,
                "Shipment " + shipmentId + " dispatched from bay " + bayNumber);

        return ResponseEntity.ok(Map.of("success", true, "operation", op));
    }

    // ==========================================
    // 10. RESET DEMO DATA
    // ==========================================
    @PostMapping("/reset-demo")
    @Transactional
    public ResponseEntity<Map<String, Object>> resetDemo() {
        orderRepository.deleteAllInBatch();
        shipmentRepository.deleteAllInBatch();
        tripRepository.deleteAllInBatch();
        allocationRequestRepository.deleteAllInBatch();
        warehouseOperationRepository.deleteAllInBatch();
        inventoryStockRepository.deleteAllInBatch();
        billingInvoiceRepository.deleteAllInBatch();
        paymentTransactionRepository.deleteAllInBatch();
        systemNotificationRepository.deleteAllInBatch();
        workflowAuditLogRepository.deleteAllInBatch();

        // Seed 1 active sample workflow
        CustomerOrder o1 = new CustomerOrder();
        o1.setOrderId("ORD-89214");
        o1.setCustomerId("CUST-8021");
        o1.setCustomerName("NexGen Industrial Corp");
        o1.setCustomerContact("+1 (555) 349-2041");
        o1.setPickupAddress("Los Angeles Logistics Terminal, Dock 14");
        o1.setDeliveryAddress("Phoenix Regional Distribution Hub, Bay 3");
        o1.setGoodsCategory("Automotive Subassemblies & Precision Electronics");
        o1.setPackageQuantity(48);
        o1.setWeightKg(14200.0);
        o1.setSpecialInstructions("Handle with air-ride suspension. High value freight.");
        o1.setOrderStatus("Processing");
        o1.setAmount(18450.0);
        o1.setAssignedShipmentId("SHP-67210");
        o1.setAssignedTripId("TRP-4501");
        o1.setCreatedAt(LocalDateTime.now().minusHours(4));
        orderRepository.save(o1);

        Shipment s1 = new Shipment();
        s1.setShipmentId("SHP-67210");
        s1.setOrderId("ORD-89214");
        s1.setOrigin("Los Angeles, CA");
        s1.setDestination("Phoenix, AZ");
        s1.setAssignedVehicleReg("TTC-8492-HD");
        s1.setAssignedDriver("Marcus Vance (D-01)");
        s1.setStatus("In Transit");
        s1.setEstimatedDistanceKm(612.0);
        s1.setCreatedAt(LocalDateTime.now().minusHours(3));
        shipmentRepository.save(s1);

        Trip t1 = new Trip();
        t1.setTripId("TRP-4501");
        t1.setShipmentId("SHP-67210");
        t1.setOrderId("ORD-89214");
        t1.setVehicleReg("TTC-8492-HD");
        t1.setDriverId("D-01");
        t1.setDriverName("Marcus Vance");
        t1.setDriverPhone("+1 (555) 019-2834");
        t1.setStartLocation("Los Angeles Logistics Terminal");
        t1.setDestination("Phoenix Distribution Hub");
        t1.setStatus("In Transit");
        t1.setLatitude(33.7490);
        t1.setLongitude(-114.7140);
        t1.setCurrentSpeedKmh(92);
        t1.setEtaHours("2h 15m remaining");
        t1.setCreatedAt(LocalDateTime.now().minusHours(2));
        tripRepository.save(t1);

        AllocationRequest a1 = new AllocationRequest();
        a1.setRequestId("REQ-3019");
        a1.setShipmentId("SHP-67210");
        a1.setOrderId("ORD-89214");
        a1.setRequiredCapacityKg(14200.0);
        a1.setRequestedVehicleType("Heavy Linehaul (Volvo FH16)");
        a1.setRoute("Los Angeles, CA -> Phoenix, AZ");
        a1.setAssignedVehicleReg("TTC-8492-HD");
        a1.setAssignedDriverId("D-01");
        a1.setAssignedDriverName("Marcus Vance");
        a1.setStatus("Confirmed");
        a1.setCreatedAt(LocalDateTime.now().minusHours(3));
        allocationRequestRepository.save(a1);

        BillingInvoice inv1 = new BillingInvoice();
        inv1.setInvoiceId("INV-94021");
        inv1.setOrderId("ORD-89214");
        inv1.setShipmentId("SHP-67210");
        inv1.setCustomerId("CUST-8021");
        inv1.setCustomerName("NexGen Industrial Corp");
        inv1.setAmount(15635.59);
        inv1.setTax(2814.41);
        inv1.setTotal(18450.0);
        inv1.setStatus("Paid");
        inv1.setPaymentMethod("RTGS Wire Transfer");
        inv1.setCreatedAt(LocalDateTime.now().minusHours(3));
        billingInvoiceRepository.save(inv1);

        logAudit("admin", "SYSTEM_INIT", "RESET_DEMO_DATA", "SYSTEM", "ALL",
                "Reset and seeded unified workflow test dataset");

        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("message", "Demo workflow data seeded successfully.");
        return ResponseEntity.ok(resp);
    }

    // --- Helper Methods ---
    private void createNotification(String role, String recipientId, String title, String msg, String type, String portal, String tab) {
        SystemNotification notif = new SystemNotification();
        notif.setNotificationId("NOTIF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        notif.setRecipientRole(role);
        notif.setRecipientId(recipientId);
        notif.setTitle(title);
        notif.setMessage(msg);
        notif.setType(type);
        notif.setLinkPortal(portal);
        notif.setLinkTab(tab);
        notif.setRead(false);
        notif.setCreatedAt(LocalDateTime.now());
        systemNotificationRepository.save(notif);
    }

    private void logAudit(String role, String actor, String action, String entityType, String entityId, String details) {
        WorkflowAuditLog log = new WorkflowAuditLog();
        log.setLogId("AUD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        log.setActorRole(role);
        log.setActorUsername(actor);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now().format(ISO_FMT));
        log.setRecordedAt(LocalDateTime.now());
        workflowAuditLogRepository.save(log);
    }
}

# TTC Fleet360 – Customer Dashboard (Dashboard 7 · Customer Portal)

A standalone, single-file customer dashboard built to the TTC Fleet360 UI design
(navy sidebar, orange theme). No build step is needed.

## Run locally

**Windows:** double-click `start-dashboard.bat`. It starts a server on port 5500 and opens
http://localhost:5500/index.html. Keep the black window open while you use it.

**Any OS:**

```bash
cd customer-dashboard
python -m http.server 5500      # or: npx serve -l 5500 .
```

Then open http://localhost:5500/index.html

## Pages

| Sidebar item | What it does |
|---|---|
| Dashboard | Welcome banner, 4 summary cards, recent orders, live shipment tracking, invoices, recent activity, support card |
| My Orders | Orders table with status tabs, search, date filter, sort, pagination, CSV export, cancel order. Links to **Create New Order**, **My Shipments**, **Delivery History** |
| Track Shipment | Map, vehicle and driver details, ETA, delivery progress timeline, proof of delivery |
| Invoices | Invoice list with download. Links to **Payments** (make payment, history) and **Refund Requests** |
| Support | Raise a complaint and see ticket status |
| Profile | Personal details, change password, link to pickup and delivery **Addresses** |
| Notifications | Order updates, delivery alerts and payments, with mark as read |
| Settings | Notification preferences and language |

## Connecting the backend

All data is mock data in the `db` object inside `index.html`. Replace the functions in the
`api` object (`createOrder`, `cancelOrder`, `pay`, `requestRefund`, `raiseTicket`) with real
REST calls to the Spring Boot backend. Payment status must be confirmed by the server, never
by the browser alone.

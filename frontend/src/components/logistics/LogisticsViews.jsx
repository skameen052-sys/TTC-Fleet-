// frontend/src/components/logistics/LogisticsViews.jsx
import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Truck,
  MapPin,
  Calendar,
  Clock,
  User,
  Users,
  Navigation,
  Compass,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Eye,
  Plus,
  RefreshCw,
  Send,
  Sliders,
  DollarSign,
  Download,
  Save,
  Check,
  X,
  FileCheck,
  ShieldCheck,
  Activity,
  Layers,
  Phone,
  Mail,
  Zap,
  ChevronRight,
  TrendingUp,
  BarChart2,
  PieChart,
  Radio,
  Share2,
  Key
} from 'lucide-react';
import { logisticsService } from '../../services/logisticsService';

/* =========================================================================
   1. ORDER MANAGEMENT VIEW
   ========================================================================= */
export const OrderManagementView = ({
  orders = [],
  activeSubTab = 'all-orders',
  onSelectTab,
  onOpenCreateOrder,
  onOpenCreateShipment,
  onOpenAssignModal
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'all-orders');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    if (onSelectTab) onSelectTab(tabId);
  };

  const filteredOrders = orders.filter(ord => {
    if (currentSubTab === 'pending-orders' && ord.status !== 'Pending') return false;
    if (currentSubTab === 'approved-orders' && ord.status !== 'Approved' && ord.status !== 'In Transit' && ord.status !== 'Delivered') return false;
    if (currentSubTab === 'cancelled-orders' && ord.status !== 'Cancelled') return false;

    if (priorityFilter !== 'all' && ord.priority !== priorityFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchId = ord.id.toLowerCase().includes(q);
      const matchCust = ord.customerName.toLowerCase().includes(q);
      const matchOrigin = ord.pickupLocation.toLowerCase().includes(q);
      const matchDest = ord.deliveryLocation.toLowerCase().includes(q);
      if (!matchId && !matchCust && !matchOrigin && !matchDest) return false;
    }
    return true;
  });

  const handleStatusChange = (orderId, newStatus) => {
    logisticsService.updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Boxes className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Order Management Hub</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track, approve, and assign freight orders across nationwide distribution channels
          </p>
        </div>
        <button
          onClick={onOpenCreateOrder}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer Order</span>
        </button>
      </div>

      {/* Sub-tab pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all-orders', label: 'All Orders', count: orders.length },
          { id: 'pending-orders', label: 'Pending Approval', count: orders.filter(o => o.status === 'Pending').length },
          { id: 'approved-orders', label: 'Approved & Active', count: orders.filter(o => o.status === 'Approved' || o.status === 'In Transit').length },
          { id: 'cancelled-orders', label: 'Cancelled', count: orders.filter(o => o.status === 'Cancelled').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => handleSubTabChange(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentSubTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              currentSubTab === tab.id ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, client, origin or destination..."
            className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Standard">Standard</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Origin / Pickup</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Weight / Pallets</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-slate-400">
                    No orders found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(ord => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{ord.id}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {ord.orderDate}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">{ord.customerName}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="truncate max-w-[140px]">{ord.pickupLocation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Navigation className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span className="truncate max-w-[140px]">{ord.deliveryLocation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{ord.weight}</div>
                      <div className="text-[10px] text-slate-400">{ord.pallets} pallets</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ord.priority === 'High'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : ord.priority === 'Medium'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {ord.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">${ord.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        ord.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : ord.status === 'In Transit'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : ord.status === 'Delivered'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {ord.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(ord.id, 'Approved')}
                            title="Approve Order"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {ord.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(ord.id, 'Cancelled')}
                            title="Cancel Order"
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
                  <Boxes className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Order Details: {selectedOrder.id}</h3>
                  <p className="text-xs text-slate-500">{selectedOrder.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px]">Pickup Origin</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.pickupLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Delivery Destination</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.deliveryLocation}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Freight Spec</span>
                  <span className="font-semibold text-slate-800">{selectedOrder.weight} • {selectedOrder.pallets} Pallets</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Freight Value</span>
                  <span className="font-semibold text-emerald-600">${selectedOrder.amount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                <span className="text-slate-600 font-medium">Lifecycle Status</span>
                <span className="font-bold text-orange-600">{selectedOrder.status}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   2. SHIPMENT MANAGEMENT VIEW
   ========================================================================= */
export const ShipmentManagementView = ({
  shipments = [],
  activeSubTab = 'all-shipments',
  onSelectTab,
  onOpenCreateShipment
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'all-shipments');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const filteredShipments = shipments.filter(shp => {
    if (currentSubTab === 'shipments-processing' && shp.status !== 'Processing' && shp.status !== 'Ready for Dispatch') return false;
    if (currentSubTab === 'shipments-in-transit' && shp.status !== 'In Transit') return false;
    if (currentSubTab === 'shipments-delivered' && shp.status !== 'Delivered') return false;

    if (search) {
      const q = search.toLowerCase();
      return shp.id.toLowerCase().includes(q) ||
             shp.customerName.toLowerCase().includes(q) ||
             shp.origin.toLowerCase().includes(q) ||
             shp.destination.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Truck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Shipment Processing & Dispatch</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end dispatch tracking, carrier manifests, and real-time delivery milestones
          </p>
        </div>
        <button
          onClick={onOpenCreateShipment}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Shipment</span>
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all-shipments', label: 'All Shipments', count: shipments.length },
          { id: 'shipments-processing', label: 'Processing & Staged', count: shipments.filter(s => s.status === 'Processing' || s.status === 'Ready for Dispatch').length },
          { id: 'shipments-in-transit', label: 'Active In-Transit', count: shipments.filter(s => s.status === 'In Transit').length },
          { id: 'shipments-delivered', label: 'Delivered Today', count: shipments.filter(s => s.status === 'Delivered').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentSubTab(tab.id);
              if (onSelectTab) onSelectTab(tab.id);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentSubTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              currentSubTab === tab.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Shipment Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Shipment ID</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Origin Hub</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Vehicle & Driver</th>
                <th className="py-3 px-4">ETA</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {filteredShipments.map(shp => (
                <tr key={shp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{shp.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{shp.orderId}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{shp.customerName}</td>
                  <td className="py-3 px-4 text-slate-600">{shp.origin}</td>
                  <td className="py-3 px-4 text-slate-600">{shp.destination}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{shp.assignedVehicle}</div>
                    <div className="text-[10px] text-slate-400">{shp.assignedDriver}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800">{shp.expectedDelivery}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      shp.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : shp.status === 'In Transit'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {shp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. TRIP MANAGEMENT VIEW
   ========================================================================= */
export const TripManagementView = ({
  trips = [],
  activeSubTab = 'all-trips',
  onSelectTab,
  onOpenCreateTrip
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'all-trips');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  const filteredTrips = trips.filter(tr => {
    if (currentSubTab === 'active-trips' && tr.status !== 'In Transit') return false;
    if (currentSubTab === 'completed-trips' && tr.status !== 'Completed') return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Compass className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Trip Dispatch & Route Management</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time transit oversight, linehaul scheduling, and telemetry diagnostics
          </p>
        </div>
        <button
          onClick={onOpenCreateTrip}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-purple-500/20 hover:from-purple-700 hover:to-indigo-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch New Trip</span>
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all-trips', label: 'All Linehauls', count: trips.length },
          { id: 'active-trips', label: 'In-Transit Active', count: trips.filter(t => t.status === 'In Transit').length },
          { id: 'completed-trips', label: 'Completed', count: trips.filter(t => t.status === 'Completed').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentSubTab(tab.id);
              if (onSelectTab) onSelectTab(tab.id);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentSubTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              currentSubTab === tab.id ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Trip Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTrips.map(tr => (
          <div key={tr.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-purple-200 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md font-semibold">
                  {tr.id}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{tr.route}</h3>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                tr.status === 'In Transit'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {tr.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="text-[10px] text-slate-400 block">Assigned Hauler</span>
                <span className="font-semibold text-slate-800">{tr.vehicleNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">CDL Pilot</span>
                <span className="font-semibold text-slate-800">{tr.driverName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Distance</span>
                <span className="font-semibold text-slate-800">{tr.distance}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Expected Arrival</span>
                <span className="font-semibold text-slate-800">{tr.expectedArrival}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                <span>Trip Progress</span>
                <span className="text-purple-600">{tr.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${tr.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   4. VEHICLE & DRIVER ASSIGNMENT VIEW
   ========================================================================= */
export const VehicleAssignmentView = ({
  vehicles = [],
  drivers = [],
  activeSubTab = 'available-vehicles',
  onSelectTab,
  onOpenAssignModal
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'available-vehicles');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fleet Resource Allocation</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pair available heavy haulers with certified CDL commercial pilots for dispatched routes
          </p>
        </div>
        <button
          onClick={onOpenAssignModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition-all"
        >
          <Sliders className="w-4 h-4" />
          <span>Quick Pair Allocation</span>
        </button>
      </div>

      {/* Sub tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'available-vehicles', label: 'Commercial Fleet Haulers', count: vehicles.length },
          { id: 'available-drivers', label: 'Certified CDL Pilots', count: drivers.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentSubTab(tab.id);
              if (onSelectTab) onSelectTab(tab.id);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentSubTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              currentSubTab === tab.id ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {currentSubTab === 'available-vehicles' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vehicles.map(vh => (
            <div key={vh.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-emerald-200 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{vh.regNo}</span>
                  <p className="text-xs text-slate-500">{vh.type}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  vh.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {vh.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Capacity:</span>
                  <span className="font-semibold text-slate-900">{vh.capacity}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current Hub:</span>
                  <span className="font-semibold text-slate-900">{vh.currentLocation}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Fuel Telemetry:</span>
                  <span className="font-semibold text-emerald-600">{vh.fuelLevel}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {drivers.map(dr => (
            <div key={dr.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-emerald-200 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-sm">{dr.name}</span>
                  <p className="text-[11px] font-mono text-slate-400">{dr.id} • {dr.licenseType}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                  dr.status === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  {dr.status}
                </span>
              </div>
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Phone Dispatch:</span>
                  <span className="font-semibold text-slate-900">{dr.phone}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Assigned Rig:</span>
                  <span className="font-semibold text-slate-900">{dr.assignedVehicle || 'Unassigned'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   5. ROUTE MANAGEMENT & OPTIMIZATION VIEW
   ========================================================================= */
export const RouteManagementView = ({ routes = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Navigation className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Interstate Route Optimization</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Algorithmic highway routing minimizing toll expenditure and diesel consumption
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map(rt => (
          <div key={rt.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded font-semibold">
                  {rt.id}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{rt.origin} → {rt.destination}</h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {rt.savings} Saved
              </span>
            </div>
            <div className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="font-semibold text-slate-900">{rt.distance}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Driving Duration:</span>
                <span className="font-semibold text-slate-900">{rt.estDuration}</span>
              </div>
              <div className="flex justify-between">
                <span>Recommended Corridor:</span>
                <span className="font-semibold text-slate-900">{rt.waypoints}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-700 border border-slate-200/60 flex items-start gap-2">
              <Zap className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>{rt.fuelPlan}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   6. GPS TRACKING VIEW
   ========================================================================= */
export const GpsTrackingView = ({ trips = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Radio className="w-5 h-5 animate-pulse text-blue-500" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Satellite GPS Live Fleet Radar</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sub-second OBD-II and GPS telemetry streaming from active commercial linehaul units
          </p>
        </div>
      </div>

      {/* Mock Live Map Display */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-white shadow-xl relative overflow-hidden min-h-[360px] flex flex-col justify-between">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold tracking-wide text-emerald-400 uppercase">Live Telemetry Synchronized</span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Lat/Long Precision: ±1.2m • Refresh: 1000ms
          </div>
        </div>

        {/* Live Active Trip Indicators */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {trips.filter(t => t.status === 'In Transit').map(tr => (
            <div key={tr.id} className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-blue-400 font-bold">{tr.vehicleNumber}</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30">
                  {tr.id}
                </span>
              </div>
              <div className="text-xs font-medium text-slate-200">{tr.route}</div>
              <div className="text-[11px] text-slate-400 mt-1">Pilot: {tr.driverName}</div>
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-300">
                <span>Speed: 62 MPH</span>
                <span className="text-emerald-400">Progress: {tr.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800 pt-4">
          <span>Nationwide Dispatch Geo-Fencing: <strong className="text-slate-200">Enforced</strong></span>
          <span>Active Trackers: <strong className="text-emerald-400">100% Operational</strong></span>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   7. PICKUP & DELIVERY MANAGEMENT VIEW
   ========================================================================= */
export const PickupDeliveryView = ({
  pickups = [],
  deliveries = [],
  activeSubTab = 'pickup-schedule',
  onSelectTab,
  onOpenPodModal
}) => {
  const [currentSubTab, setCurrentSubTab] = useState(activeSubTab || 'pickup-schedule');

  useEffect(() => {
    if (activeSubTab) setCurrentSubTab(activeSubTab);
  }, [activeSubTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <FileCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Dock Pickup & Final Delivery Milestones</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage scheduled dock loading appointments and electronic proof of delivery (ePOD)
          </p>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'pickup-schedule', label: 'Dock Pickups', count: pickups.length },
          { id: 'delivery-schedule', label: 'Customer Deliveries', count: deliveries.length },
          { id: 'proof-of-delivery', label: 'Proof of Delivery (POD)', count: deliveries.filter(d => d.podStatus === 'Signed & Archived').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentSubTab(tab.id);
              if (onSelectTab) onSelectTab(tab.id);
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
              currentSubTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              currentSubTab === tab.id ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {currentSubTab === 'pickup-schedule' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                <th className="py-3 px-4">Pickup ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Facility Address</th>
                <th className="py-3 px-4">Scheduled Slot</th>
                <th className="py-3 px-4">Assigned Pilot</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {pickups.map(pk => (
                <tr key={pk.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{pk.id}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{pk.customerName}</td>
                  <td className="py-3 px-4 text-slate-600">{pk.address}</td>
                  <td className="py-3 px-4 text-slate-600">{pk.scheduledDate}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{pk.driver}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      pk.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {pk.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {pk.status !== 'Completed' && (
                      <button
                        onClick={() => logisticsService.confirmPickup(pk.id)}
                        className="px-2.5 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold rounded-lg text-[11px] transition-colors"
                      >
                        Confirm Dock Loading
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                <th className="py-3 px-4">Delivery ID</th>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Customer Destination</th>
                <th className="py-3 px-4">ETA / Delivery Time</th>
                <th className="py-3 px-4">ePOD Status</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {deliveries.map(del => (
                <tr key={del.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-bold text-slate-900">{del.id}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{del.orderId}</td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{del.customerName}</div>
                    <div className="text-[10px] text-slate-400">{del.destination}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{del.scheduledTime}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {del.podStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      del.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {del.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onOpenPodModal(del)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-[11px] transition-colors"
                    >
                      {del.podStatus === 'Signed & Archived' ? 'View POD' : 'Sign & Complete POD'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   8. CUSTOMER ORDERS & REQUESTS VIEW
   ========================================================================= */
export const CustomerOrdersView = ({ customerRequests = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Customer Portal Bookings & Quotes</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review inbound freight bookings submitted directly through enterprise EDI & customer portal
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customerRequests.map(req => (
          <div key={req.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded font-semibold">
                  {req.id}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{req.customer}</h3>
              </div>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-full">
                ${req.quote.toLocaleString()}
              </span>
            </div>

            <div className="text-xs space-y-1.5 text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Requested Lane:</span>
                <span className="font-semibold text-slate-900">{req.origin} → {req.destination}</span>
              </div>
              <div className="flex justify-between">
                <span>Payload:</span>
                <span className="font-semibold text-slate-900">{req.weight}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-amber-600">{req.status}</span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  logisticsService.addOrder({
                    customerName: req.customer,
                    pickupLocation: req.origin,
                    deliveryLocation: req.destination,
                    weight: req.weight,
                    pallets: 10,
                    priority: 'Medium',
                    amount: req.quote
                  });
                  alert(`Request ${req.id} accepted and transferred into active Order Pipeline!`);
                }}
                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs transition-colors"
              >
                Accept & Convert to Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   9. LOGISTICS REPORTS & ANALYTICS VIEW
   ========================================================================= */
export const LogisticsReportsView = ({ analytics = {} }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <BarChart2 className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Logistics KPI & Operational Reports</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Export monthly carrier scorecards, SLA punctuality matrices, and linehaul expense audits
          </p>
        </div>
        <button
          onClick={() => alert('Generating Comprehensive Logistics Operational Audit PDF...')}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Logistics Audit Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'On-Time Fulfillment Rate', val: `${analytics.onTimeRate || 98.4}%`, trend: '+1.2%', color: 'text-emerald-600' },
          { label: 'Avg Transit Duration', val: analytics.avgDeliveryHours ? `${analytics.avgDeliveryHours} hrs` : '4.6 hrs', trend: '-22 mins', color: 'text-blue-600' },
          { label: 'Linehaul Fleet Utilization', val: `${analytics.fleetUtilization || 89.2}%`, trend: '+3.5%', color: 'text-purple-600' },
          { label: 'Diesel Eco-Score', val: `${analytics.fuelEfficiency || 94.8}%`, trend: '+4.1%', color: 'text-teal-600' }
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <span className="text-xs text-slate-500 font-medium block">{kpi.label}</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className={`text-2xl font-black ${kpi.color}`}>{kpi.val}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================================
   10. NOTIFICATIONS & ALERTS VIEW
   ========================================================================= */
export const LogisticsNotificationsView = ({ notifications = [], alerts = [] }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Logistics Disruption Alerts & Notifications</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Weather disruptions, ETA variances, highway closures, and driver availability alerts
          </p>
        </div>
        <button
          onClick={() => logisticsService.markAllNotificationsRead()}
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 px-3.5 py-2 rounded-xl"
        >
          Mark All As Acknowledged
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Operational Alerts */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>Active Corridor Disruptions</span>
          </h3>
          <div className="space-y-3">
            {alerts.map(al => (
              <div key={al.id} className="p-3 bg-rose-50/60 border border-rose-100 rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-rose-900">{al.title}</span>
                  <span className="text-[10px] text-rose-500 font-medium">{al.time}</span>
                </div>
                <p className="text-rose-700 text-[11px]">{al.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-500" />
            <span>System Telemetry Events</span>
          </h3>
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-900">{n.title}</span>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   11. MY PROFILE VIEW
   ========================================================================= */
export const LogisticsProfileView = ({ manager = {}, onSignOut }) => {
  const [name, setName] = useState(manager.name || 'Elena Rostova');
  const [email, setEmail] = useState(manager.email || 'elena.rostova@fleet360.ttc.com');
  const [phone, setPhone] = useState(manager.phone || '+1 (555) 438-9201');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    logisticsService.updateProfile({ name, email, phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/25">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-slate-900">{name}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
              Logistics Director
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{email} • Staff ID: {manager.id || 'LM-DIR-094'}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">● Active Logistics Operations Session</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Personal Information & Operations Contact
        </h3>
        {saved && (
          <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile settings saved successfully.</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Dispatch Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Logistics Headquarters</label>
            <input
              type="text"
              disabled
              value="Chicago Logistics Command (HQ-CENTRAL)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>
        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs shadow-md shadow-orange-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

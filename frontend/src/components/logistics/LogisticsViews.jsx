// frontend/src/components/logistics/LogisticsViews.jsx
import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronLeft,
  ChevronDown,
  TrendingUp,
  BarChart2,
  PieChart,
  Radio,
  Share2,
  Key,
  Building2,
  Package,
  ArrowUpDown,
  CheckCircle,
  RotateCcw
} from 'lucide-react';
import { logisticsService } from '../../services/logisticsService';
import { workflowService } from '../../services/workflowService';

/* =========================================================================
   1. ORDER MANAGEMENT VIEW (Enterprise Logistics Hub)
   ========================================================================= */
export const OrderManagementView = ({
  orders = [],
  activeSubTab = 'all-orders',
  onSelectTab,
  onOpenCreateOrder,
  onOpenCreateShipment,
  onOpenAssignModal,
  onUpdateOrderStatus
}) => {
  const [ordersList, setOrdersList] = useState(() => (orders.length ? orders : (logisticsService.getData()?.orders || [])));
  const [currentSubTab, setCurrentSubTab] = useState(() => {
    if (activeSubTab === 'pending-orders') return 'pending-orders';
    if (activeSubTab === 'approved-orders') return 'approved-orders';
    if (activeSubTab === 'cancelled-orders') return 'cancelled-orders';
    return 'all-orders';
  });

  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Cancellation modal state
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('Customer requested cancellation');
  const [customRejectReason, setCustomRejectReason] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Subscribe to real-time changes
  useEffect(() => {
    const unsub = logisticsService.subscribe((updated) => {
      if (updated?.orders) setOrdersList(updated.orders);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (orders && orders.length) setOrdersList(orders);
  }, [orders]);

  useEffect(() => {
    if (activeSubTab) {
      if (activeSubTab === 'create-order') {
        if (onOpenCreateOrder) onOpenCreateOrder();
      } else {
        setCurrentSubTab(activeSubTab);
      }
    }
  }, [activeSubTab, onOpenCreateOrder]);

  // Tab counts
  const counts = useMemo(() => {
    const all = ordersList.length;
    const pending = ordersList.filter(o => o.status === 'Pending' || o.status === 'Pending Approval').length;
    const approved = ordersList.filter(o => ['Approved', 'In Transit', 'Processing', 'Delivered'].includes(o.status)).length;
    const cancelled = ordersList.filter(o => o.status === 'Cancelled' || o.status === 'Rejected').length;
    const totalFreightVal = ordersList.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
    return { all, pending, approved, cancelled, totalFreightVal };
  }, [ordersList]);

  // Filtering & Sorting
  const filteredOrders = useMemo(() => {
    return ordersList.filter(ord => {
      // Sub-tab filter
      if (currentSubTab === 'pending-orders') {
        if (ord.status !== 'Pending' && ord.status !== 'Pending Approval') return false;
      } else if (currentSubTab === 'approved-orders') {
        if (!['Approved', 'In Transit', 'Processing', 'Delivered'].includes(ord.status)) return false;
      } else if (currentSubTab === 'cancelled-orders') {
        if (ord.status !== 'Cancelled' && ord.status !== 'Rejected') return false;
      }

      // Priority filter
      if (priorityFilter !== 'all' && ord.priority !== priorityFilter) return false;

      // Text search
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchId = ord.id?.toLowerCase().includes(q);
        const matchCust = ord.customerName?.toLowerCase().includes(q);
        const matchOrigin = ord.pickupLocation?.toLowerCase().includes(q);
        const matchDest = ord.deliveryLocation?.toLowerCase().includes(q);
        const matchType = ord.type?.toLowerCase().includes(q);
        const matchContact = ord.customerContact?.toLowerCase().includes(q);
        if (!matchId && !matchCust && !matchOrigin && !matchDest && !matchType && !matchContact) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.orderDate || '').localeCompare(a.orderDate || '');
      if (sortBy === 'oldest') return (a.orderDate || '').localeCompare(b.orderDate || '');
      if (sortBy === 'amount-desc') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortBy === 'amount-asc') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      if (sortBy === 'id') return (a.id || '').localeCompare(b.id || '');
      return 0;
    });
  }, [ordersList, currentSubTab, priorityFilter, search, sortBy]);

  // Pagination slicing
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedOrders = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safeCurrentPage, pageSize]);

  // Switch SubTab
  const handleSubTabChange = (tabId) => {
    setCurrentSubTab(tabId);
    setCurrentPage(1);
    if (onSelectTab) onSelectTab(tabId);
  };

  // Status Action: Approve
  const handleApprove = (orderId) => {
    const updated = logisticsService.updateOrderStatus(orderId, 'Approved', 'Order validated and approved for linehaul dispatch');
    if (onUpdateOrderStatus) onUpdateOrderStatus(orderId, 'Approved');
    setOrdersList(logisticsService.getData()?.orders || []);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: 'Approved' }));
    }
  };

  // Status Action: Reject / Cancel
  const handleConfirmReject = () => {
    if (!rejectingOrder) return;
    const finalReason = rejectReason === 'Other' ? (customRejectReason || 'Rejected by Logistics Operations') : rejectReason;
    const updated = logisticsService.updateOrderStatus(rejectingOrder.id, 'Cancelled', finalReason);
    if (onUpdateOrderStatus) onUpdateOrderStatus(rejectingOrder.id, 'Cancelled', finalReason);
    setOrdersList(logisticsService.getData()?.orders || []);
    if (selectedOrder && selectedOrder.id === rejectingOrder.id) {
      setSelectedOrder(prev => ({ ...prev, status: 'Cancelled' }));
    }
    setRejectingOrder(null);
    setCustomRejectReason('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '4px 0', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* 1. Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          padding: '20px 24px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 122, 26, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FF7A1A',
              border: '1px solid rgba(255, 122, 26, 0.25)'
            }}
          >
            <Boxes size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                Order Management Hub
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid #DBEAFE'
                }}
              >
                Logistics Dispatch OS
              </span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0', lineHeight: 1.4 }}>
              Track, approve, and assign freight orders across nationwide distribution channels
            </p>
          </div>
        </div>

        {/* Primary CTA: New Customer Order */}
        <button
          type="button"
          onClick={onOpenCreateOrder}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #FF7A1A 0%, #EA580C 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(255, 122, 26, 0.35)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>New Customer Order</span>
        </button>
      </div>

      {/* 2. Top Summary Metrics Cards (4 Metrics) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {/* Card 1: All Orders */}
        <div
          onClick={() => handleSubTabChange('all-orders')}
          style={{
            backgroundColor: '#FFFFFF',
            border: currentSubTab === 'all-orders' ? '2px solid #FF7A1A' : '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px 18px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>Total Consignments</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={14} color="#0F172A" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', marginTop: '6px' }}>
            {counts.all}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '11.5px', color: '#64748B' }}>
            <span>Freight Volume:</span>
            <span style={{ fontWeight: 700, color: '#0F172A' }}>${counts.totalFreightVal.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 2: Pending Approval */}
        <div
          onClick={() => handleSubTabChange('pending-orders')}
          style={{
            backgroundColor: '#FFFFFF',
            border: currentSubTab === 'pending-orders' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px 18px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#B45309' }}>Pending Approvals</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={14} color="#D97706" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#B45309', marginTop: '6px' }}>
            {counts.pending}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '11.5px', color: '#D97706' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span>Awaiting Logistics Validation</span>
          </div>
        </div>

        {/* Card 3: Approved & Active */}
        <div
          onClick={() => handleSubTabChange('approved-orders')}
          style={{
            backgroundColor: '#FFFFFF',
            border: currentSubTab === 'approved-orders' ? '2px solid #10B981' : '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px 18px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#047857' }}>Approved & Active</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={14} color="#059669" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#047857', marginTop: '6px' }}>
            {counts.approved}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '11.5px', color: '#059669' }}>
            <Truck size={12} />
            <span>Dispatched Linehaul Consignments</span>
          </div>
        </div>

        {/* Card 4: Cancelled Orders */}
        <div
          onClick={() => handleSubTabChange('cancelled-orders')}
          style={{
            backgroundColor: '#FFFFFF',
            border: currentSubTab === 'cancelled-orders' ? '2px solid #EF4444' : '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px 18px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#991B1B' }}>Cancelled Orders</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={14} color="#DC2626" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#991B1B', marginTop: '6px' }}>
            {counts.cancelled}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '11.5px', color: '#DC2626' }}>
            <span>Archived / Rejected Bookings</span>
          </div>
        </div>
      </div>

      {/* 3. Sub-Tab Pills Navigation (Functional Tabs) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderBottom: '1.5px solid #E2E8F0',
          paddingBottom: '12px',
          flexWrap: 'wrap'
        }}
      >
        {[
          { id: 'all-orders', label: 'All Orders', count: counts.all, color: '#0F172A' },
          { id: 'pending-orders', label: 'Pending Approvals', count: counts.pending, color: '#D97706' },
          { id: 'approved-orders', label: 'Approved & Active', count: counts.approved, color: '#059669' },
          { id: 'cancelled-orders', label: 'Cancelled Orders', count: counts.cancelled, color: '#DC2626' }
        ].map(tab => {
          const isActive = currentSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSubTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 600,
                backgroundColor: isActive ? '#0F172A' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#475569',
                border: isActive ? '1px solid #0F172A' : '1px solid #CBD5E1',
                cursor: 'pointer',
                boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.25)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  backgroundColor: isActive ? '#FF7A1A' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#475569',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  lineHeight: 1.2
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Search, Filter, Sort and Reset Toolbar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '460px' }}>
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Order ID, client, pickup origin, destination..."
            style={{
              width: '100%',
              padding: '9px 34px 9px 36px',
              fontSize: '12.5px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              outline: 'none',
              color: '#0F172A',
              boxSizing: 'border-box'
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCurrentPage(1);
              }}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Priority filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B' }}>
            <Filter size={13} color="#64748B" />
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                padding: '8px 12px',
                fontSize: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                color: '#0F172A',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High Priority</option>
              <option value="Standard">Standard</option>
            </select>
          </div>

          {/* Sort By */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748B' }}>
            <ArrowUpDown size={13} color="#64748B" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                fontSize: '12px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                color: '#0F172A',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="newest">Sort: Newest Date</option>
              <option value="oldest">Sort: Oldest Date</option>
              <option value="amount-desc">Sort: Highest Amount</option>
              <option value="amount-asc">Sort: Lowest Amount</option>
              <option value="id">Sort: Order ID (A-Z)</option>
            </select>
          </div>

          {/* Reset button if filter active */}
          {(search || priorityFilter !== 'all' || sortBy !== 'newest') && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setPriorityFilter('all');
                setSortBy('newest');
                setCurrentPage(1);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'transparent',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12px',
                color: '#64748B',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* 5. Enterprise Responsive Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden'
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table
            style={{
              width: '100%',
              minWidth: '1000px',
              tableLayout: 'fixed',
              borderCollapse: 'separate',
              borderSpacing: 0,
              fontSize: '12.5px',
              color: '#1E293B'
            }}
          >
            <colgroup>
              <col style={{ width: '125px' }} /> {/* Order ID & Date */}
              <col style={{ width: '160px' }} /> {/* Customer */}
              <col style={{ width: '180px' }} /> {/* Origin / Pickup */}
              <col style={{ width: '180px' }} /> {/* Destination */}
              <col style={{ width: '110px' }} /> {/* Freight Specs */}
              <col style={{ width: '90px' }} />  {/* Priority */}
              <col style={{ width: '100px' }} /> {/* Amount */}
              <col style={{ width: '100px' }} /> {/* Status */}
              <col style={{ width: '115px' }} /> {/* Actions */}
            </colgroup>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Order ID & Date
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Customer
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Origin / Pickup
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Destination
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Weight / Pallets
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Priority
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Amount
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Status
                </th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 24px', textAlign: 'center', color: '#94A3B8' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Boxes size={36} color="#CBD5E1" strokeWidth={1.5} />
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>
                        No orders found in "{currentSubTab.replace('-', ' ').toUpperCase()}"
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                        Try clearing search terms or create a new consignment booking.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((ord, idx) => {
                  const isPending = ord.status === 'Pending' || ord.status === 'Pending Approval';
                  const isApproved = ord.status === 'Approved' || ord.status === 'In Transit' || ord.status === 'Delivered';
                  const isCancelled = ord.status === 'Cancelled' || ord.status === 'Rejected';

                  return (
                    <tr
                      key={ord.id || idx}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                        transition: 'background-color 0.12s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA')}
                    >
                      {/* Col 1: Order ID & Date */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: '#0F172A' }}>
                            {ord.id}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
                          <Calendar size={11} color="#94A3B8" />
                          <span>{ord.orderDate || '2026-11-24'}</span>
                        </div>
                      </td>

                      {/* Col 2: Customer */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: '13px',
                            color: '#0F172A',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={ord.customerName}
                        >
                          {ord.customerName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ord.customerContact || ord.type || 'Commercial Shipper'}
                        </div>
                      </td>

                      {/* Col 3: Origin / Pickup */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <MapPin size={13} color="#FF7A1A" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div style={{ minWidth: 0, width: '100%' }}>
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#0F172A',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              title={ord.pickupLocation}
                            >
                              {ord.pickupLocation}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '1px' }}>
                              Origin Hub
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Col 4: Destination */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <Navigation size={13} color="#0284C7" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div style={{ minWidth: 0, width: '100%' }}>
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#0F172A',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}
                              title={ord.deliveryLocation}
                            >
                              {ord.deliveryLocation}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '1px' }}>
                              Delivery Bay
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Col 5: Weight / Pallets */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 700, fontSize: '12.5px', color: '#0F172A' }}>
                          {(ord.totalWeightKg || ord.weight || 2500).toLocaleString()} kg
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          {ord.pallets || ord.itemsCount || 8} Pallets
                        </div>
                      </td>

                      {/* Col 6: Priority */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        {ord.priority === 'Urgent' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FECACA',
                              color: '#B91C1C',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
                            Urgent
                          </span>
                        ) : ord.priority === 'High' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#FFF7ED',
                              border: '1px solid #FFEDD5',
                              color: '#C2410C',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#EA580C' }} />
                            High
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              backgroundColor: '#F1F5F9',
                              border: '1px solid #E2E8F0',
                              color: '#475569',
                              padding: '3px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: 600
                            }}
                          >
                            <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Col 7: Amount */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0F172A' }}>
                          ${Number(ord.amount || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#16A34A', fontWeight: 600 }}>
                          Commercial
                        </div>
                      </td>

                      {/* Col 8: Status Badge */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle' }}>
                        {isPending ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: '#FFFBEB',
                              border: '1px solid #FDE68A',
                              color: '#B45309',
                              padding: '4px 9px',
                              borderRadius: '14px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                            Pending
                          </span>
                        ) : ord.status === 'Approved' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: '#ECFDF5',
                              border: '1px solid #A7F3D0',
                              color: '#047857',
                              padding: '4px 9px',
                              borderRadius: '14px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                            Approved
                          </span>
                        ) : ord.status === 'In Transit' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: '#EFF6FF',
                              border: '1px solid #BFDBFE',
                              color: '#1D4ED8',
                              padding: '4px 9px',
                              borderRadius: '14px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                            In Transit
                          </span>
                        ) : ord.status === 'Delivered' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: '#FAF5FF',
                              border: '1px solid #E9D5FF',
                              color: '#6B21A8',
                              padding: '4px 9px',
                              borderRadius: '14px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#A855F7' }} />
                            Delivered
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: '#FEF2F2',
                              border: '1px solid #FECACA',
                              color: '#B91C1C',
                              padding: '4px 9px',
                              borderRadius: '14px',
                              fontSize: '11px',
                              fontWeight: 700
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* Col 9: Action Buttons */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(ord.id)}
                                title="Approve this consignment order"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  backgroundColor: '#10B981',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.12s ease'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#10B981')}
                              >
                                <Check size={14} strokeWidth={2.8} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setRejectingOrder(ord)}
                                title="Reject / Cancel this order"
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  backgroundColor: '#EF4444',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  cursor: 'pointer',
                                  transition: 'background-color 0.12s ease'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DC2626')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#EF4444')}
                              >
                                <X size={14} strokeWidth={2.8} />
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(ord)}
                            title="View Full Consignment Details"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '28px',
                              height: '28px',
                              borderRadius: '6px',
                              backgroundColor: '#F1F5F9',
                              color: '#334155',
                              border: '1px solid #CBD5E1',
                              cursor: 'pointer',
                              transition: 'all 0.12s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#E2E8F0';
                              e.currentTarget.style.color = '#0F172A';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#F1F5F9';
                              e.currentTarget.style.color = '#334155';
                            }}
                          >
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 6. Pagination Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 20px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: '#64748B'
          }}
        >
          {/* Left: Showing entries info & Page size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>
              Showing <strong>{filteredOrders.length === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong>{Math.min(safeCurrentPage * pageSize, filteredOrders.length)}</strong> of{' '}
              <strong>{filteredOrders.length}</strong> orders
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '12px',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Right: Page Navigation Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: safeCurrentPage <= 1 ? '#F1F5F9' : '#FFFFFF',
                color: safeCurrentPage <= 1 ? '#94A3B8' : '#0F172A',
                cursor: safeCurrentPage <= 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <ChevronLeft size={13} />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }).map((_, pIdx) => {
              const pageNum = pIdx + 1;
              const isCurrent = pageNum === safeCurrentPage;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  style={{
                    minWidth: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    border: isCurrent ? '1px solid #0F172A' : '1px solid #CBD5E1',
                    backgroundColor: isCurrent ? '#0F172A' : '#FFFFFF',
                    color: isCurrent ? '#FFFFFF' : '#475569',
                    fontSize: '12px',
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              type="button"
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                backgroundColor: safeCurrentPage >= totalPages ? '#F1F5F9' : '#FFFFFF',
                color: safeCurrentPage >= totalPages ? '#94A3B8' : '#0F172A',
                cursor: safeCurrentPage >= totalPages ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Modal: Full Order Details Inspection & Approval */}
      {selectedOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              border: '1px solid #E2E8F0',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF7A1A' }}>
                  <Boxes size={22} strokeWidth={2.4} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Order Consignment: {selectedOrder.id}
                    </h2>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: selectedOrder.status === 'Approved' ? '#ECFDF5' : selectedOrder.status === 'Pending' ? '#FFFBEB' : '#FEF2F2',
                        color: selectedOrder.status === 'Approved' ? '#047857' : selectedOrder.status === 'Pending' ? '#B45309' : '#B91C1C',
                        padding: '2px 8px',
                        borderRadius: '10px'
                      }}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0' }}>
                    Customer: <strong>{selectedOrder.customerName}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '18px' }}>
              {/* Origin & Destination Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#FF7A1A', textTransform: 'uppercase' }}>
                    <MapPin size={12} />
                    <span>Origin / Pickup Location</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                    {selectedOrder.pickupLocation}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    Date: {selectedOrder.orderDate || '2026-11-24'}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase' }}>
                    <Navigation size={12} />
                    <span>Delivery Destination</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                    {selectedOrder.deliveryLocation}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    ETA: {selectedOrder.expectedDelivery || '2026-11-26'}
                  </div>
                </div>
              </div>

              {/* Cargo Specs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Total Weight</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {(selectedOrder.totalWeightKg || selectedOrder.weight || 2500).toLocaleString()} kg
                  </div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Pallet Quantity</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {selectedOrder.pallets || selectedOrder.itemsCount || 8} Pallets
                  </div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Priority</div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: selectedOrder.priority === 'Urgent' ? '#DC2626' : '#C2410C', marginTop: '2px' }}>
                    {selectedOrder.priority || 'Standard'}
                  </div>
                </div>
                <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 600 }}>Freight Value</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#047857', marginTop: '2px' }}>
                    ${Number(selectedOrder.amount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Description & Contact */}
              <div style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                  Cargo Classification & Special Instructions
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginTop: '4px' }}>
                  {selectedOrder.type || selectedOrder.description || 'General Industrial Consignment'}
                </div>
                {selectedOrder.specialInstructions && (
                  <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px', fontStyle: 'italic', backgroundColor: '#FFFBEB', padding: '6px 10px', borderRadius: '6px', border: '1px solid #FDE68A' }}>
                    Note: {selectedOrder.specialInstructions}
                  </div>
                )}
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '8px' }}>
                  Customer Contact: <strong>{selectedOrder.customerContact || '+1 (555) 349-2041'}</strong>
                </div>
              </div>

              {/* Status Audit History Trail */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={13} color="#FF7A1A" />
                  <span>Consignment Status History & Audit Trail</span>
                </div>
                <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                  {(selectedOrder.history && selectedOrder.history.length > 0) ? (
                    selectedOrder.history.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderBottom: i < selectedOrder.history.length - 1 ? '1px solid #F1F5F9' : 'none',
                          backgroundColor: i % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                          fontSize: '11.5px'
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 700, color: '#0F172A' }}>{h.toStatus}</span>
                          <span style={{ color: '#64748B', marginLeft: '6px' }}>by {h.updatedBy || 'Logistics Operations'}</span>
                          {h.reason && <div style={{ color: '#94A3B8', fontSize: '10.5px' }}>{h.reason}</div>}
                        </div>
                        <span style={{ color: '#94A3B8', fontSize: '10.5px' }}>{h.timestamp}</span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '10px 12px', fontSize: '11.5px', color: '#64748B' }}>
                      Status: <strong>{selectedOrder.status}</strong> • Initialized in Logistics OS
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '22px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
              {(selectedOrder.status === 'Pending' || selectedOrder.status === 'Pending Approval') && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setRejectingOrder(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      borderRadius: '8px',
                      backgroundColor: '#FEE2E2',
                      color: '#B91C1C',
                      border: '1px solid #FECACA',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14} />
                    <span>Reject Consignment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      handleApprove(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)'
                    }}
                  >
                    <Check size={14} strokeWidth={2.6} />
                    <span>Approve & Dispatch Linehaul</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. Rejection / Cancellation Reason Modal */}
      {rejectingOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setRejectingOrder(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
              border: '1px solid #FECACA'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', marginBottom: '14px' }}>
              <AlertTriangle size={24} />
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#0F172A' }}>
                Cancel Consignment {rejectingOrder.id}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px', lineHeight: 1.5 }}>
              Please specify the reason for cancelling order from <strong>{rejectingOrder.customerName}</strong>. This status and reason will be archived in the customer and operational audit trail.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {[
                'Customer requested cancellation',
                'Credit limit exceeded / Payment verification failed',
                'Cargo specifications outside linehaul capacity',
                'Route or warehouse scheduling conflict',
                'Other'
              ].map((reasonOpt) => (
                <label
                  key={reasonOpt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '12.5px',
                    color: '#1E293B',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: rejectReason === reasonOpt ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
                    backgroundColor: rejectReason === reasonOpt ? '#FEF2F2' : '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    checked={rejectReason === reasonOpt}
                    onChange={() => setRejectReason(reasonOpt)}
                  />
                  <span>{reasonOpt}</span>
                </label>
              ))}

              {rejectReason === 'Other' && (
                <input
                  type="text"
                  placeholder="Enter custom rejection reason..."
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    outline: 'none',
                    marginTop: '4px'
                  }}
                />
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  fontWeight: 600,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                style={{
                  padding: '9px 18px',
                  borderRadius: '8px',
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.35)'
                }}
              >
                Confirm Cancellation
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

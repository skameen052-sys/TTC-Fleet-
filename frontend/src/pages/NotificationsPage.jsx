import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Plus, RefreshCw, AlertTriangle, Truck, Wrench, ShieldAlert, Package, Check, Clock } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { Modal } from '../components/Modal';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    notificationType: 'SYSTEM',
    priority: 'MEDIUM',
    actionUrl: '/fleet',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationService.getAll();
      if (res && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleCreateNotification = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await notificationService.createNotification(formData);
      if (res && res.data) {
        setNotifications([res.data, ...notifications]);
      }
      setShowModal(false);
      setFormData({
        title: '',
        message: '',
        notificationType: 'SYSTEM',
        priority: 'MEDIUM',
        actionUrl: '/fleet',
      });
    } catch (err) {
      console.error('Failed to create notification', err);
      alert('Failed to send broadcast alert');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = notifications.filter((n) => {
    if (typeFilter === 'ALL') return true;
    return n.notificationType === typeFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'VEHICLE_ALERT':
        return <Truck size={18} color="#f97316" />;
      case 'MAINTENANCE_REMINDER':
        return <Wrench size={18} color="#ef4444" />;
      case 'DRIVER_EXPIRY':
        return <ShieldAlert size={18} color="#f59e0b" />;
      case 'SHIPMENT_UPDATE':
        return <Package size={18} color="#3b82f6" />;
      default:
        return <Bell size={18} color="#8b5cf6" />;
    }
  };

  const getPriorityBadge = (p) => {
    const map = {
      CRITICAL: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' },
      HIGH: { bg: 'rgba(249, 115, 22, 0.2)', text: '#f97316' },
      MEDIUM: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' },
      LOW: { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8' },
    };
    const style = map[p] || map.MEDIUM;
    return (
      <span
        style={{
          background: style.bg,
          color: style.text,
          fontSize: '11px',
          fontWeight: 700,
          padding: '2px 8px',
          borderRadius: '4px',
        }}
      >
        {p}
      </span>
    );
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#fff', margin: 0 }}>
              System Notifications & Operational Alerts
            </h2>
            {unreadCount > 0 && (
              <span
                style={{
                  background: '#f97316',
                  color: '#fff',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  padding: '2px 9px',
                  borderRadius: '20px',
                }}
              >
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Real-time telematics alerts, driver license compliance notices, and periodic maintenance reminders
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchNotifications} disabled={loading}>
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button className="btn-secondary" onClick={handleMarkAllRead} disabled={unreadCount === 0}>
            <CheckCheck size={16} color="#10b981" />
            <span>Mark All as Read</span>
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          background: '#131929',
          padding: '10px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'SYSTEM', label: 'System Broadcasts' },
          { id: 'VEHICLE_ALERT', label: 'Vehicle Alerts' },
          { id: 'MAINTENANCE_REMINDER', label: 'Maintenance Reminders' },
          { id: 'DRIVER_EXPIRY', label: 'Driver Compliance' },
          { id: 'SHIPMENT_UPDATE', label: 'Shipment Updates' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTypeFilter(tab.id)}
            style={{
              background: typeFilter === tab.id ? '#f97316' : 'rgba(255,255,255,0.04)',
              color: typeFilter === tab.id ? '#fff' : '#94a3b8',
              border: '1px solid rgba(255,255,255,0.06)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {loading ? (
          <div
            style={{
              background: '#131929',
              padding: '36px',
              textAlign: 'center',
              color: '#64748b',
              borderRadius: '12px',
            }}
          >
            Loading alerts and notifications...
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              background: '#131929',
              padding: '40px',
              textAlign: 'center',
              color: '#64748b',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Bell size={36} color="#475569" style={{ margin: '0 auto 12px auto' }} />
            <div style={{ fontSize: '15px', color: '#fff', fontWeight: 600 }}>No notifications found</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>All operational alerts have been cleared.</div>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              style={{
                background: item.isRead ? '#111726' : '#151d30',
                border: item.isRead
                  ? '1px solid rgba(255,255,255,0.05)'
                  : '1px solid rgba(249, 115, 22, 0.4)',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getTypeIcon(item.notificationType)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14.5px', fontWeight: 700, color: item.isRead ? '#cbd5e1' : '#fff' }}>
                      {item.title}
                    </span>
                    {getPriorityBadge(item.priority)}
                    {!item.isRead && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#f97316',
                          display: 'inline-block',
                        }}
                      />
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 6px 0', lineHeight: 1.4 }}>
                    {item.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: '#64748b' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                    </span>
                    <span>Recipient: {item.recipientEmail || 'All Admins'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {!item.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(item.id)}
                    title="Mark as read"
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#10b981',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Check size={13} />
                    <span>Mark Read</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Alert Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Broadcast Operational Alert">
        <form onSubmit={handleCreateNotification} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
              Alert Title
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Cyclone advisory for coastal transit route"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Notification Category
              </label>
              <select
                className="form-input"
                value={formData.notificationType}
                onChange={(e) => setFormData({ ...formData, notificationType: e.target.value })}
              >
                <option value="SYSTEM">System Broadcast</option>
                <option value="VEHICLE_ALERT">Vehicle Alert</option>
                <option value="MAINTENANCE_REMINDER">Maintenance Reminder</option>
                <option value="DRIVER_EXPIRY">Driver Compliance</option>
                <option value="SHIPMENT_UPDATE">Shipment Status</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
                Priority Level
              </label>
              <select
                className="form-input"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>
              Detailed Message
            </label>
            <textarea
              required
              rows="3"
              className="form-input"
              placeholder="Enter full operational advisory..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              disabled={submitting}
            >
              {submitting ? 'Broadcasting...' : 'Send Broadcast'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

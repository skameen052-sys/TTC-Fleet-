// frontend/src/components/customer/CustomerModals.jsx
import React, { useState } from 'react';
import {
  X,
  Package,
  Calendar,
  MapPin,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Download,
  CreditCard,
  Building,
  Shield,
  HelpCircle,
  RotateCcw,
  User,
  Phone,
  Mail,
  Check
} from 'lucide-react';

// 1. Order Details Modal
export const OrderDetailsModal = ({ order, isOpen, onClose, onCancelOrder, onTrackShipment }) => {
  if (!isOpen || !order) return null;

  const isPending = order.status === 'Pending';

  return (
    <div className="modal-backdrop-overlay" style={modalOverlayStyle}>
      <div className="modal-content-card" style={{ ...modalCardStyle, maxWidth: '640px' }}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Package size={20} color="#FF7A1A" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#14213D' }}>
              Order Details — {order.id}
            </h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Status Ribbon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F8FAFC',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px'
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Current Status</span>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor:
                    order.status === 'Approved'
                      ? '#DCFCE7'
                      : order.status === 'In Transit'
                      ? '#E0F2FE'
                      : order.status === 'Delivered'
                      ? '#D1FAE5'
                      : order.status === 'Cancelled'
                      ? '#FEE2E2'
                      : '#FEF3C7',
                  color:
                    order.status === 'Approved'
                      ? '#166534'
                      : order.status === 'In Transit'
                      ? '#0369A1'
                      : order.status === 'Delivered'
                      ? '#065F46'
                      : order.status === 'Cancelled'
                      ? '#991B1B'
                      : '#92400E'
                }}
              >
                ● {order.status}
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Order Amount</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#14213D' }}>
                ${(order.amount || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Route Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#079DF2', fontSize: '12px', fontWeight: 700 }}>
                <MapPin size={14} /> Pickup Origin
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                {order.pickupLocation}
              </p>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Date: {order.orderDate}</span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A36A', fontSize: '12px', fontWeight: 700 }}>
                <MapPin size={14} /> Delivery Destination
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
                {order.deliveryLocation}
              </p>
              <span style={{ fontSize: '11px', color: '#64748B' }}>ETA: {order.expectedDelivery || 'Scheduled'}</span>
            </div>
          </div>

          {/* Cargo Specs */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#14213D' }}>
              Cargo & Packaging Specifications
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px' }}>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Category</span>
                <strong style={{ color: '#1E293B' }}>{order.type || 'Commercial Freight'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Total Weight</span>
                <strong style={{ color: '#1E293B' }}>{(order.totalWeightKg || 1000).toLocaleString()} kg</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block' }}>Packages</span>
                <strong style={{ color: '#1E293B' }}>{order.itemsCount || 1} units</strong>
              </div>
            </div>

            {order.description && (
              <div style={{ marginTop: '10px', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Cargo Description: </span>
                <span style={{ color: '#334155' }}>{order.description}</span>
              </div>
            )}
            {order.specialInstructions && (
              <div style={{ marginTop: '6px', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Special Instructions: </span>
                <span style={{ color: '#FF7A1A', fontWeight: 600 }}>{order.specialInstructions}</span>
              </div>
            )}
          </div>

          {/* Assigned Shipment & Driver Info if available */}
          {order.assignedShipmentId && (
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#1E40AF', fontWeight: 700 }}>
                  Active Transit Assignment
                </span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                  Shipment: {order.assignedShipmentId} • Trip: {order.assignedTripId || 'TRIP-7011'}
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onTrackShipment && onTrackShipment(order.assignedShipmentId);
                }}
                style={{
                  backgroundColor: '#079DF2',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Track Live Map
              </button>
            </div>
          )}
        </div>

        <div style={modalFooterStyle}>
          {isPending && onCancelOrder && (
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to cancel order ${order.id}?`)) {
                  onCancelOrder(order.id);
                  onClose();
                }
              }}
              style={{
                backgroundColor: '#FEE2E2',
                color: '#EF4444',
                border: '1px solid #FECACA',
                padding: '8px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel Order
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#14213D',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Invoice View & Printable Modal
export const InvoiceModal = ({ invoice, isOpen, onClose, onMakePayment }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop-overlay" style={modalOverlayStyle}>
      <div className="modal-content-card" style={{ ...modalCardStyle, maxWidth: '680px' }}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} color="#079DF2" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#14213D' }}>
              Invoice {invoice.id}
            </h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>

        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto', backgroundColor: '#FFFFFF' }}>
          {/* Invoice Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#14213D' }}>
                TTC FLEET<span style={{ color: '#FF7A1A' }}>360</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Enterprise Logistics & Linehaul OS</div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                450 N Michigan Ave, Logistics Command Center, Chicago, IL
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#079DF2' }}>INVOICE</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B' }}>{invoice.id}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Date: {invoice.date}</div>
              <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: 600 }}>Due: {invoice.dueDate}</div>
            </div>
          </div>

          {/* Billed To */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '12px' }}>
            <div>
              <span style={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
                BILLED TO:
              </span>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginTop: '3px' }}>
                NexGen Industrial Corp
              </div>
              <div style={{ color: '#64748B' }}>Attn: Sarah Jenkins, Logistics Procurement</div>
              <div style={{ color: '#64748B' }}>Account: CUST-8021 • Tax ID: US-EIN-94-3829104</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }}>
                PAYMENT STATUS:
              </span>
              <div style={{ marginTop: '4px' }}>
                <span
                  style={{
                    padding: '3px 12px',
                    borderRadius: '12px',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    backgroundColor: invoice.status === 'Paid' ? '#DCFCE7' : '#FEF3C7',
                    color: invoice.status === 'Paid' ? '#166534' : '#92400E'
                  }}
                >
                  {invoice.status.toUpperCase()}
                </span>
              </div>
              {invoice.paidDate && (
                <div style={{ fontSize: '11px', color: '#16A36A', marginTop: '4px' }}>
                  Paid on: {invoice.paidDate}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: '#64748B' }}>Description</th>
                <th style={{ padding: '8px 10px', textAlign: 'center', color: '#64748B' }}>Qty</th>
                <th style={{ padding: '8px 10px', textAlign: 'right', color: '#64748B' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items?.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px', color: '#1E293B', fontWeight: 600 }}>{item.desc}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#64748B' }}>{item.qty}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#1E293B' }}>
                    ${item.rate.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ width: '240px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748B' }}>
                <span>Subtotal:</span>
                <span>${(invoice.amount || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#64748B' }}>
                <span>Estimated Tax (8%):</span>
                <span>${(invoice.tax || 0).toLocaleString()}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderTop: '2px solid #E2E8F0',
                  fontWeight: 800,
                  fontSize: '15px',
                  color: '#14213D'
                }}
              >
                <span>Total Amount:</span>
                <span>${(invoice.total || invoice.amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Remittance Info */}
          <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', fontSize: '11px', color: '#64748B' }}>
            <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>Bank Wire / ACH Remittance:</div>
            <div>Bank: JPMorgan Chase NA (Chicago Logistics Clearing) • Routing: 071000013 • Acct: 9482-1082-9901</div>
          </div>
        </div>

        <div style={modalFooterStyle}>
          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              border: '1px solid #E2E8F0',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Printer size={15} /> Print / Save PDF
          </button>

          {invoice.status !== 'Paid' && onMakePayment && (
            <button
              onClick={() => {
                onClose();
                onMakePayment(invoice);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#16A36A',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                marginLeft: 'auto'
              }}
            >
              <CreditCard size={15} /> Make Payment Now
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              backgroundColor: '#14213D',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: invoice.status === 'Paid' ? 'auto' : '8px'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Make Payment Modal
export const MakePaymentModal = ({ invoice, isOpen, onClose, onSubmitPayment }) => {
  const [method, setMethod] = useState('Corporate ACH Transfer');
  const [account, setAccount] = useState('JPMorgan Chase Commercial (****4892)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !invoice) return null;

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onSubmitPayment(invoice.id, { method, account });
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  const amount = invoice.total || invoice.amount;

  return (
    <div className="modal-backdrop-overlay" style={modalOverlayStyle}>
      <div className="modal-content-card" style={{ ...modalCardStyle, maxWidth: '480px' }}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} color="#16A36A" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#14213D' }}>
              Authorize Payment — {invoice.id}
            </h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>

        {isSuccess ? (
          <div style={{ padding: '36px 20px', textAlign: 'center' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}
            >
              <Check size={28} color="#16A36A" strokeWidth={3} />
            </div>
            <h4 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 800, color: '#14213D' }}>
              Payment Authorized!
            </h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>
              ${amount.toLocaleString()} was successfully paid towards {invoice.id}. Receipt generated.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} style={{ padding: '20px' }}>
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '14px',
                borderRadius: '8px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Invoice Reference</span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{invoice.id}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Total Payable</span>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#16A36A' }}>
                  ${amount.toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Payment Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                style={inputStyle}
              >
                <option value="Corporate ACH Transfer">Corporate ACH Direct (Automated Clearing)</option>
                <option value="Fleet Wire Direct">Federal Reserve Fedwire Direct</option>
                <option value="Corporate Amex Commercial">Corporate Commercial Card (Amex ****8291)</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={labelStyle}>Debit Account / Card</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={{ marginBottom: '16px', fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} color="#16A36A" />
              <span>Protected by 256-bit TLS encrypted TTC Corporate Clearing Gateway.</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #E2E8F0',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                style={{
                  backgroundColor: '#16A36A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 20px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isProcessing ? 'Processing Transaction...' : `Pay $${amount.toLocaleString()}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// 4. Proof of Delivery (POD) Modal
export const ProofOfDeliveryModal = ({ delivery, isOpen, onClose }) => {
  if (!isOpen || !delivery) return null;

  return (
    <div className="modal-backdrop-overlay" style={modalOverlayStyle}>
      <div className="modal-content-card" style={{ ...modalCardStyle, maxWidth: '540px' }}>
        <div style={modalHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={20} color="#16A36A" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#14213D' }}>
              Electronic Proof of Delivery (e-POD)
            </h3>
          </div>
          <button onClick={onClose} style={closeBtnStyle}><X size={18} /></button>
        </div>

        <div style={{ padding: '20px' }}>
          <div
            style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              padding: '12px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <CheckCircle2 size={24} color="#16A36A" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>
                Successfully Delivered & Verified
              </div>
              <div style={{ fontSize: '11px', color: '#15803D' }}>
                Delivery ID: {delivery.deliveryId || delivery.id} • Order: {delivery.orderId}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px', marginBottom: '16px' }}>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Destination Dock</span>
              <strong style={{ color: '#1E293B' }}>{delivery.address || delivery.destination || 'Detroit Terminal Bay 12'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Delivered Timestamp</span>
              <strong style={{ color: '#1E293B' }}>{delivery.deliveredTime || '2026-11-21 16:42 EST'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Receiving Dock Master</span>
              <strong style={{ color: '#1E293B' }}>{delivery.recipientName || 'Robert Martinez'}</strong>
            </div>
            <div>
              <span style={{ color: '#64748B', display: 'block' }}>Assigned Driver</span>
              <strong style={{ color: '#1E293B' }}>{delivery.driverName || 'Marcus Vance (CDL-A)'}</strong>
            </div>
          </div>

          {/* Signature Box */}
          <div style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px', marginBottom: '16px', background: '#F8FAFC' }}>
            <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginBottom: '8px' }}>
              Digitally Captured Recipient Signature:
            </span>
            <div
              style={{
                height: '70px',
                border: '1px dashed #CBD5E1',
                borderRadius: '6px',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'cursive',
                fontSize: '22px',
                color: '#1E40AF',
                letterSpacing: '2px'
              }}
            >
              Robert Martinez
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '10px', color: '#94A3B8' }}>
              <span>Security Hash: SHA256:7f8a9e201b89...</span>
              <span>GPS Verified: 42.3314° N, 83.0458° W</span>
            </div>
          </div>
        </div>

        <div style={modalFooterStyle}>
          <button
            onClick={() => window.print()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              border: '1px solid #E2E8F0',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Printer size={15} /> Print POD Certificate
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#14213D',
              color: '#FFFFFF',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Common Styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.65)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '16px'
};

const modalCardStyle = {
  width: '100%',
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
};

const modalHeaderStyle = {
  padding: '16px 20px',
  borderBottom: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#FFFFFF'
};

const modalFooterStyle = {
  padding: '14px 20px',
  borderTop: '1px solid #E2E8F0',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#F8FAFC'
};

const closeBtnStyle = {
  border: 'none',
  background: 'transparent',
  color: '#64748B',
  cursor: 'pointer',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#334155',
  marginBottom: '4px'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  fontSize: '12.5px',
  borderRadius: '6px',
  border: '1px solid #CBD5E1',
  outline: 'none',
  color: '#1E293B',
  backgroundColor: '#FFFFFF',
  boxSizing: 'border-box'
};

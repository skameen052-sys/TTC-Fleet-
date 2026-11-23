import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  FileText,
  DollarSign,
  TrendingDown,
  RotateCcw,
  Building2
} from 'lucide-react';

// ============================================================================
// 1. CREATE INVOICE MODAL
// ============================================================================
export const CreateInvoiceModal = ({ isOpen, onClose, onCreateInvoice }) => {
  const [customerName, setCustomerName] = useState('NexGen Industrial Corp');
  const [serviceType, setServiceType] = useState('Full Truckload (FTL) Heavy Haul');
  const [orderId, setOrderId] = useState('ORD-9106');
  const [billingDate, setBillingDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Bank Wire (RTGS)');
  const [notes, setNotes] = useState('Interstate freight haulage with live telematics monitoring');
  const [items, setItems] = useState([
    { desc: 'Interstate Freight Haulage (Chicago to Detroit)', qty: 1, rate: 85000, taxRate: 18 }
  ]);

  if (!isOpen) return null;

  const addItem = () => {
    setItems([...items, { desc: '', qty: 1, rate: 0, taxRate: 18 }]);
  };

  const removeItem = (idx) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx, field, val) => {
    const updated = [...items];
    updated[idx][field] = field === 'qty' || field === 'rate' ? Number(val) : val;
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateInvoice({
      customerName,
      serviceType,
      orderId,
      billingDate,
      dueDate,
      paymentMethod,
      notes,
      items,
      subtotal,
      tax,
      total,
      status: 'Pending'
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#38bdf8" />
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0 }}>Create Freight Tax Invoice</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Customer Shipper Entity</label>
              <select className="form-select" value={customerName} onChange={e => setCustomerName(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px' }}>
                <option value="NexGen Industrial Corp">NexGen Industrial Corp</option>
                <option value="Apex FMCG Logistics Ltd">Apex FMCG Logistics Ltd</option>
                <option value="Nova Cold Chain Pharma">Nova Cold Chain Pharma</option>
                <option value="Zenith Heavy Machinery">Zenith Heavy Machinery</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Transportation Service Type</label>
              <select className="form-select" value={serviceType} onChange={e => setServiceType(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px' }}>
                <option value="Full Truckload (FTL) Heavy Haul">Full Truckload (FTL) Heavy Haul</option>
                <option value="Less-Than-Truckload (LTL) Palletized">Less-Than-Truckload (LTL) Palletized</option>
                <option value="Refrigerated Cold Chain (-20°C)">Refrigerated Cold Chain (-20°C)</option>
                <option value="Express Rapid Parcel Dispatch">Express Rapid Parcel Dispatch</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Order Reference ID</label>
              <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Billing Date</label>
              <input type="date" value={billingDate} onChange={e => setBillingDate(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Payment Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
          </div>

          {/* Line items */}
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#fff' }}>Freight Billable Line Items</span>
              <button type="button" onClick={addItem} style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.3)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={12} /> Add Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((it, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2.5fr 0.8fr 1.2fr 30px', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Item / service description"
                    value={it.desc}
                    onChange={e => updateItem(idx, 'desc', e.target.value)}
                    style={{ background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '7px 10px', borderRadius: '6px', fontSize: '12px' }}
                    required
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={it.qty}
                    onChange={e => updateItem(idx, 'qty', e.target.value)}
                    style={{ background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '7px 8px', borderRadius: '6px', fontSize: '12px' }}
                    required
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Rate (₹)"
                    value={it.rate}
                    onChange={e => updateItem(idx, 'rate', e.target.value)}
                    style={{ background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '7px 8px', borderRadius: '6px', fontSize: '12px' }}
                    required
                  />
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px', marginTop: '6px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Subtotal:</span>
              <strong style={{ color: '#fff' }}>₹{subtotal.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
              <span>Integrated GST (18%):</span>
              <strong style={{ color: '#38bdf8' }}>₹{tax.toLocaleString('en-IN')}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px', fontWeight: 700, fontSize: '14px' }}>
              <span>Total Invoice Amount:</span>
              <span style={{ color: '#10b981' }}>₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #64748b', color: '#94a3b8', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #2563eb, #0284c7)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Generate & Issue Invoice</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 2. RECORD PAYMENT MODAL
// ============================================================================
export const RecordPaymentModal = ({ isOpen, onClose, invoices = [], onRecordPayment }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(invoices[0]?.id || 'INV-2026-002');
  const [amount, setAmount] = useState('88500');
  const [method, setMethod] = useState('Bank Wire (RTGS)');
  const [transactionRef, setTransactionRef] = useState(`TXN-RTGS-${Math.floor(100000 + Math.random() * 900000)}`);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('Verified via Corporate Treasury Settlement');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const inv = invoices.find(i => i.id === selectedInvoice);
    onRecordPayment({
      invoiceId: selectedInvoice,
      customerName: inv?.customerName || 'Enterprise Shipper',
      amount: Number(amount),
      method,
      transactionRef,
      date,
      notes,
      status: 'Completed'
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={20} color="#10b981" />
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0 }}>Record Customer Payment</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Invoice Reference</label>
            <select
              value={selectedInvoice}
              onChange={e => {
                setSelectedInvoice(e.target.value);
                const inv = invoices.find(i => i.id === e.target.value);
                if (inv) setAmount(String(inv.balance || inv.total));
              }}
              style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px' }}
            >
              {invoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} • {inv.customerName} (Bal: ₹{Number(inv.balance || 0).toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Amount Received (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Settlement Method</label>
              <select value={method} onChange={e => setMethod(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px' }}>
                <option value="Bank Wire (RTGS)">Bank Wire (RTGS)</option>
                <option value="Bank Wire (NEFT)">Bank Wire (NEFT)</option>
                <option value="Corporate ACH">Corporate ACH</option>
                <option value="Online Payment Gateway">Online Payment Gateway</option>
                <option value="Corporate Cheque">Corporate Cheque</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Transaction UTR / Ref Number</label>
              <input type="text" value={transactionRef} onChange={e => setTransactionRef(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Receipt Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Audit Notes</label>
            <input type="text" value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #64748b', color: '#94a3b8', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Confirm & Record Payment</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 3. ADD EXPENSE MODAL
// ============================================================================
export const AddExpenseModal = ({ isOpen, onClose, onAddExpense }) => {
  const [category, setCategory] = useState('Fuel Expenses');
  const [vendor, setVendor] = useState('Indian Oil Corporation (IOCL)');
  const [amount, setAmount] = useState('22179');
  const [vehicleId, setVehicleId] = useState('AP-09-XY-8492 (Volvo FH16)');
  const [driver, setDriver] = useState('Marcus Vance');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Corporate Fuel Card');
  const [description, setDescription] = useState('High-Speed Diesel refueling for interstate route run');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddExpense({
      category,
      vendor,
      amount: Number(amount),
      vehicleId,
      driver,
      date,
      paymentMethod,
      description,
      status: 'Paid'
    });
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <TrendingDown size={20} color="#f97316" />
            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', margin: 0 }}>Log Operational Expense</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Expense Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px' }}>
                <option value="Fuel Expenses">Fuel Expenses</option>
                <option value="Vehicle Maintenance">Vehicle Maintenance</option>
                <option value="Driver Expenses">Driver Expenses</option>
                <option value="Warehouse Expenses">Warehouse Expenses</option>
                <option value="Transportation Charges">Transportation Charges</option>
                <option value="Other Operational Expenses">Other Operational Expenses</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Amount (₹)</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Vendor / Payee</label>
              <input type="text" value={vendor} onChange={e => setVendor(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Outlay Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description / Line Item Details</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.12)', padding: '8px', borderRadius: '6px', boxSizing: 'border-box' }} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #64748b', color: '#94a3b8', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}>Record Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// 4. VIEW / PRINT INVOICE MODAL
// ============================================================================
export const ViewInvoiceModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
      <div style={{ background: '#0b1120', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)', color: '#fff' }}>
        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#2563eb', border: 'none', color: '#fff', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              <Printer size={14} /> Print / Save PDF
            </button>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* Invoice Printable Sheet */}
        <div id="printable-invoice" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '28px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.4px', color: '#fff' }}>
                TTC Fleet<span style={{ color: '#38bdf8' }}>360</span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>TTC Global Freight & Fleet Solutions Pvt. Ltd.</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>GSTIN: 36AAACT8492K1Z9 • PAN: AAACT8492K</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Central Logistics Hub, Gachibowli, Hyderabad, Telangana</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#38bdf8' }}>TAX INVOICE</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{invoice.invoiceNumber}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Date: {invoice.billingDate}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Due: {invoice.dueDate}</div>
              <span style={{ display: 'inline-block', marginTop: '6px', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: invoice.status === 'Paid' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: invoice.status === 'Paid' ? '#10b981' : '#f59e0b' }}>
                {invoice.status}
              </span>
            </div>
          </div>

          {/* Billed To */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '14px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>BILLED TO CLIENT</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>{invoice.customerName}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Customer ID: {invoice.customerId}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Order Ref: {invoice.orderId}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>TRANSPORT SERVICE</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginTop: '4px' }}>{invoice.serviceType}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Method: {invoice.paymentMethod}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>SAC Code: 996511 (Goods Road Transport)</div>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                <th style={{ padding: '8px 12px' }}>Service Description</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Unit Rate</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>GST Rate</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {(invoice.items || []).map((it, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 12px', color: '#fff' }}>{it.desc}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#cbd5e1' }}>{it.qty}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#cbd5e1' }}>₹{Number(it.rate).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#38bdf8' }}>18%</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#fff', fontWeight: 600 }}>₹{(it.qty * it.rate).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal:</span>
                <span style={{ color: '#fff' }}>₹{Number(invoice.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>CGST (9%):</span>
                <span style={{ color: '#38bdf8' }}>₹{Math.round(invoice.tax / 2).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>SGST (9%):</span>
                <span style={{ color: '#38bdf8' }}>₹{Math.round(invoice.tax / 2).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', fontWeight: 800, fontSize: '15px' }}>
                <span>Total Due:</span>
                <span style={{ color: '#10b981' }}>₹{Number(invoice.total).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Banking Instructions */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ color: '#94a3b8' }}>Bank RTGS/NEFT Details:</strong> HDFC Bank Ltd • A/C: 50200084920192 • IFSC: HDFC0001892
            </div>
            <div>
              Digitally signed by TTC Fleet360 Financial Treasury
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

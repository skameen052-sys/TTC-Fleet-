// frontend/src/components/customer/CashfreeCheckoutModal.jsx
// Customer Portal checkout - Cashfree (primary) with example Indian gateways.
// Real flow: backend creates a Cashfree order -> cashfree.js checkout -> backend verifies.
// Fallback: labelled sandbox simulator when the backend / keys are not available.
import React, { useState, useEffect } from 'react';
import {
  X, Smartphone, CreditCard, Landmark, Wallet, Clock, ShieldCheck, Check,
  AlertTriangle, Loader2, QrCode, Receipt, Copy, RotateCcw
} from 'lucide-react';
import {
  GATEWAYS, TEST_VALUES, BANKS, WALLETS, PAY_LATER, UPI_APPS, formatINR,
  createCashfreeOrder, openCashfreeCheckout, verifyCashfreeOrder,
  simulateGatewayPayment, maskDetail
} from '../../services/paymentGateway';

const METHODS = [
  { id: 'UPI', label: 'UPI', icon: Smartphone, note: 'GPay, PhonePe, Paytm, BHIM' },
  { id: 'Cards', label: 'Debit / Credit Card', icon: CreditCard, note: 'Visa, Mastercard, RuPay' },
  { id: 'Net Banking', label: 'Net Banking', icon: Landmark, note: 'All major Indian banks' },
  { id: 'Wallets', label: 'Wallets', icon: Wallet, note: 'Paytm, PhonePe, Amazon Pay' },
  { id: 'Pay Later', label: 'Pay Later', icon: Clock, note: 'Simpl, LazyPay' }
];

const STEPS = ['Creating order with gateway', 'Waiting for your authorisation', 'Verifying payment with bank'];

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 },
  card: { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 880, maxHeight: '92vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,.25)', display: 'grid', gridTemplateColumns: 'minmax(0,320px) minmax(0,1fr)' },
  left: { background: '#14213D', color: '#fff', padding: 24, borderRadius: '16px 0 0 16px', display: 'flex', flexDirection: 'column', gap: 16 },
  right: { padding: 24, position: 'relative' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 6 },
  input: { width: '100%', padding: '11px 12px', border: '1.5px solid #E2E8F0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  chip: (on, color) => ({ padding: '9px 10px', borderRadius: 10, border: `1.5px solid ${on ? color : 'rgba(255,255,255,.15)'}`, background: on ? 'rgba(255,255,255,.08)' : 'transparent', color: '#fff', cursor: 'pointer', textAlign: 'left', fontSize: 12.5 }),
  tab: (on) => ({ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '11px 12px', borderRadius: 10, border: `1.5px solid ${on ? '#FF6B1A' : '#E2E8F0'}`, background: on ? '#FFF4EC' : '#fff', cursor: 'pointer', textAlign: 'left' }),
  option: (on) => ({ padding: '10px 12px', borderRadius: 8, border: `1.5px solid ${on ? '#FF6B1A' : '#E2E8F0'}`, background: on ? '#FFF4EC' : '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1E293B' }),
  payBtn: { width: '100%', padding: '13px', borderRadius: 10, border: 'none', background: '#FF6B1A', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 18 },
  hint: { fontSize: 11.5, color: '#64748B', marginTop: 6 },
  testTag: { background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }
};

export const MakePaymentModal = ({ invoice, isOpen, onClose, onSubmitPayment, customer }) => {
  const [gateway, setGateway] = useState('cashfree');
  const [method, setMethod] = useState('UPI');
  const [upiId, setUpiId] = useState(TEST_VALUES.upiSuccess);
  const [upiMode, setUpiMode] = useState('id'); // id | qr
  const [card, setCard] = useState(TEST_VALUES.card);
  const [bank, setBank] = useState(BANKS[0]);
  const [wallet, setWallet] = useState(WALLETS[0]);
  const [payLater, setPayLater] = useState(PAY_LATER[0]);
  const [phase, setPhase] = useState('form'); // form | processing | success | failed
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) { setPhase('form'); setStep(0); setResult(null); setError(''); }
  }, [isOpen, invoice?.id]);

  if (!isOpen || !invoice) return null;

  const amount = Number(invoice.total || invoice.amount || 0);
  const gw = GATEWAYS.find((g) => g.id === gateway);
  const detail = { UPI: upiMode === 'qr' ? 'UPI QR' : upiId, Cards: card.number, 'Net Banking': bank, Wallets: wallet, 'Pay Later': payLater }[method];

  const validate = () => {
    if (method === 'UPI' && upiMode === 'id' && !/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) return 'Enter a valid UPI ID, e.g. name@okaxis';
    if (method === 'Cards') {
      if (!/^\d{16}$/.test(card.number.replace(/\s/g, ''))) return 'Enter a 16-digit card number';
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return 'Expiry must be MM/YY';
      if (!/^\d{3}$/.test(card.cvv)) return 'CVV must be 3 digits';
    }
    return '';
  };

  const handlePay = async () => {
    const v = validate();
    if (v) { setError(v); return; }
    setError('');
    setPhase('processing');
    setStep(0);

    let outcome = null;
    try {
      // 1) Real Cashfree flow when our backend + keys are available
      if (gateway === 'cashfree') {
        const order = await createCashfreeOrder({ invoiceId: invoice.id, amount, customer });
        if (order) {
          setStep(1);
          const checkout = await openCashfreeCheckout(order);
          if (checkout?.error) throw new Error(checkout.error.message || 'Payment was not completed');
          setStep(2);
          const verified = await verifyCashfreeOrder(order.orderId);
          const p = verified.payments?.[0] || {};
          outcome = {
            demo: false,
            status: verified.orderStatus === 'PAID' ? 'SUCCESS' : 'FAILED',
            failureReason: verified.orderStatus === 'PAID' ? null : `Order status: ${verified.orderStatus}`,
            gateway, gatewayOrderId: order.orderId, gatewayPaymentId: p.cfPaymentId || '-',
            bankReference: p.bankReference || '-', amount, method: p.paymentGroup || method, detail, paidAt: new Date().toISOString()
          };
        }
      }
      // 2) Sandbox simulator (backend offline / keys not set / example gateways)
      if (!outcome) {
        setTimeout(() => setStep(1), 500);
        setTimeout(() => setStep(2), 1200);
        outcome = await simulateGatewayPayment({ gateway, invoiceId: invoice.id, amount, method, detail });
      }
    } catch (e) {
      outcome = { status: 'FAILED', failureReason: e.message, gateway, amount, method };
    }

    setResult(outcome);
    if (outcome.status === 'SUCCESS') {
      setPhase('success');
      onSubmitPayment(invoice.id, {
        method: `${method} (${gw.short})`,
        account: maskDetail(method, detail),
        gateway: gw.short,
        gatewayOrderId: outcome.gatewayOrderId,
        gatewayPaymentId: outcome.gatewayPaymentId,
        bankReference: outcome.bankReference,
        mode: outcome.demo ? 'SANDBOX' : 'LIVE'
      });
    } else {
      setPhase('failed');
    }
  };

  const copy = (t) => { try { navigator.clipboard.writeText(t); } catch (_) {} };

  // ---------------- method forms ----------------
  const renderForm = () => {
    if (method === 'UPI') return (
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button style={s.option(upiMode === 'id')} onClick={() => setUpiMode('id')}>Pay with UPI ID</button>
          <button style={s.option(upiMode === 'qr')} onClick={() => setUpiMode('qr')}><QrCode size={14} style={{ verticalAlign: -2 }} /> Scan QR</button>
        </div>
        {upiMode === 'id' ? (
          <>
            <label style={s.label}>UPI ID</label>
            <input style={s.input} value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@okhdfcbank" />
            <div style={s.hint}>Test: <b>{TEST_VALUES.upiSuccess}</b> succeeds, <b>{TEST_VALUES.upiFailure}</b> fails.</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
              {UPI_APPS.map((a) => <span key={a} style={{ fontSize: 12, padding: '6px 10px', borderRadius: 20, background: '#F1F5F9', color: '#334155', fontWeight: 600 }}>{a}</span>)}
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <div style={{ width: 150, height: 150, borderRadius: 12, border: '1.5px dashed #CBD5E1', display: 'grid', placeItems: 'center', background: 'repeating-conic-gradient(#1E293B 0 25%, #fff 0 50%) 0 0/18px 18px', position: 'relative' }}>
              <span style={{ background: '#fff', padding: '6px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>SAMPLE QR</span>
            </div>
            <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
              Open any UPI app and scan to pay <b>{formatINR(amount)}</b>.<br />
              In live mode Cashfree shows the real dynamic QR here.<br />
              QR is valid for 5 minutes.
            </div>
          </div>
        )}
      </div>
    );
    if (method === 'Cards') return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ gridColumn: '1/-1' }}>
          <label style={s.label}>Card number</label>
          <input style={s.input} value={card.number} maxLength={19} inputMode="numeric"
            onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ') })} />
        </div>
        <div><label style={s.label}>Expiry (MM/YY)</label><input style={s.input} value={card.expiry} maxLength={5} onChange={(e) => setCard({ ...card, expiry: e.target.value })} /></div>
        <div><label style={s.label}>CVV</label><input style={s.input} type="password" value={card.cvv} maxLength={3} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '') })} /></div>
        <div style={{ gridColumn: '1/-1' }}><label style={s.label}>Name on card</label><input style={s.input} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></div>
        <div style={{ ...s.hint, gridColumn: '1/-1' }}>Sandbox test card pre-filled. Card details go straight to the gateway — TTC Fleet360 never stores them.</div>
      </div>
    );
    const list = method === 'Net Banking' ? BANKS : method === 'Wallets' ? WALLETS : PAY_LATER;
    const val = method === 'Net Banking' ? bank : method === 'Wallets' ? wallet : payLater;
    const set = method === 'Net Banking' ? setBank : method === 'Wallets' ? setWallet : setPayLater;
    return (
      <div>
        <label style={s.label}>Choose {method === 'Net Banking' ? 'your bank' : method === 'Wallets' ? 'a wallet' : 'a Pay Later option'}</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
          {list.map((x) => <button key={x} style={s.option(val === x)} onClick={() => set(x)}>{x}</button>)}
        </div>
        <div style={s.hint}>You'll be taken to {val} to approve the payment.</div>
      </div>
    );
  };

  // ---------------- right pane by phase ----------------
  const renderRight = () => {
    if (phase === 'processing') return (
      <div style={{ padding: '40px 10px', textAlign: 'center' }}>
        <Loader2 size={44} color="#FF6B1A" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
        <h3 style={{ margin: '14px 0 20px', color: '#14213D' }}>Processing {formatINR(amount)} via {gw.short}</h3>
        <div style={{ textAlign: 'left', maxWidth: 320, margin: '0 auto' }}>
          {STEPS.map((t, i) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', color: i <= step ? '#14213D' : '#94A3B8', fontWeight: i === step ? 700 : 500, fontSize: 13.5 }}>
              {i < step ? <Check size={16} color="#16A34A" /> : i === step ? <Loader2 size={16} color="#FF6B1A" style={{ animation: 'spin 1s linear infinite' }} /> : <span style={{ width: 16 }} />}
              {t}
            </div>
          ))}
        </div>
        <p style={s.hint}>Please don't close this window or press back.</p>
      </div>
    );
    if (phase === 'success') return (
      <div style={{ padding: '18px 6px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#DCFCE7', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}><Check size={32} color="#16A34A" strokeWidth={3} /></div>
          <h3 style={{ margin: 0, color: '#14213D' }}>Payment successful</h3>
          <p style={{ margin: '6px 0 18px', color: '#64748B', fontSize: 13 }}>{formatINR(amount)} paid for {invoice.id}{result?.demo ? ' (sandbox)' : ''}</p>
        </div>
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: 14, fontSize: 13 }}>
          {[
            ['Gateway', gw.name],
            ['Payment method', `${method} · ${maskDetail(method, detail)}`],
            ['Gateway order ID', result.gatewayOrderId],
            ['Payment ID (cf_payment_id)', result.gatewayPaymentId],
            ['Bank reference (UTR)', result.bankReference],
            ['Paid at', new Date(result.paidAt).toLocaleString('en-IN')]
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '6px 0', borderBottom: '1px dashed #E2E8F0' }}>
              <span style={{ color: '#64748B' }}>{k}</span>
              <b style={{ color: '#1E293B', textAlign: 'right', wordBreak: 'break-all' }}>{v}
                {k.includes('ID') && <Copy size={12} style={{ marginLeft: 6, cursor: 'pointer', verticalAlign: -1 }} onClick={() => copy(v)} />}</b>
            </div>
          ))}
        </div>
        <button style={s.payBtn} onClick={onClose}><Receipt size={16} style={{ verticalAlign: -3, marginRight: 6 }} />Done</button>
      </div>
    );
    if (phase === 'failed') return (
      <div style={{ padding: '30px 6px', textAlign: 'center' }}>
        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FEE2E2', display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}><AlertTriangle size={30} color="#DC2626" /></div>
        <h3 style={{ margin: 0, color: '#14213D' }}>Payment failed</h3>
        <p style={{ margin: '8px 0 4px', color: '#64748B', fontSize: 13 }}>{result?.failureReason || 'The payment could not be completed.'}</p>
        <p style={{ margin: 0, color: '#64748B', fontSize: 12 }}>No money was deducted. If it was, it will be auto-refunded within 5–7 working days.</p>
        <button style={s.payBtn} onClick={() => { setPhase('form'); setResult(null); }}><RotateCcw size={16} style={{ verticalAlign: -3, marginRight: 6 }} />Try again</button>
      </div>
    );
    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,210px) minmax(0,1fr)', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {METHODS.filter((m) => gw.methods.includes(m.id)).map((m) => {
              const Icon = m.icon;
              return (
                <button key={m.id} style={s.tab(method === m.id)} onClick={() => { setMethod(m.id); setError(''); }}>
                  <Icon size={18} color={method === m.id ? '#FF6B1A' : '#475569'} />
                  <span><b style={{ display: 'block', fontSize: 13, color: '#1E293B' }}>{m.label}</b><small style={{ fontSize: 11, color: '#64748B' }}>{m.note}</small></span>
                </button>
              );
            })}
          </div>
          <div>{renderForm()}</div>
        </div>
        {error && <div style={{ marginTop: 12, color: '#DC2626', fontSize: 13, fontWeight: 600 }}>{error}</div>}
        <button style={s.payBtn} onClick={handlePay}>Pay {formatINR(amount)}</button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, fontSize: 11.5, color: '#64748B' }}>
          <ShieldCheck size={14} color="#16A34A" /> PCI-DSS compliant · Secured by {gw.name}
        </div>
      </>
    );
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && phase !== 'processing' && onClose()}>
      <div style={s.card} className="cf-checkout">
        <style>{'@media(max-width:760px){.cf-checkout{grid-template-columns:1fr!important}.cf-checkout>div:first-child{border-radius:16px 16px 0 0!important}}'}</style>
        {/* LEFT: order summary + gateway */}
        <div style={s.left}>
          <div>
            <div style={{ fontSize: 12, opacity: .7 }}>Paying to</div>
            <div style={{ fontSize: 18, fontWeight: 800 }}>TTC Fleet<span style={{ color: '#FF8A3D' }}>360</span> Logistics</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,.06)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 12, opacity: .7 }}>Invoice</div>
            <div style={{ fontWeight: 700 }}>{invoice.id}</div>
            {invoice.orderId && <div style={{ fontSize: 12, opacity: .7, marginTop: 4 }}>Order {invoice.orderId}</div>}
            <div style={{ fontSize: 12, opacity: .7, marginTop: 12 }}>Amount payable</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{formatINR(amount)}</div>
            <div style={{ fontSize: 11, opacity: .6 }}>Inclusive of GST</div>
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: .7, marginBottom: 8 }}>Payment gateway</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {GATEWAYS.map((g) => (
                <button key={g.id} disabled={phase !== 'form'} style={s.chip(gateway === g.id, '#FF6B1A')}
                  onClick={() => { setGateway(g.id); if (!g.methods.includes(method)) setMethod('UPI'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: g.color, marginRight: 8 }} />{g.short}</b>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: g.status === 'active' ? '#16A34A' : 'rgba(255,255,255,.15)' }}>{g.status === 'active' ? 'PRIMARY' : 'EXAMPLE'}</span>
                  </div>
                  <div style={{ fontSize: 11, opacity: .65, marginTop: 3 }}>Fee {g.fee} · {g.settlement}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: methods / status */}
        <div style={s.right}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 17, color: '#14213D' }}>{phase === 'form' ? 'Choose a payment method' : 'Payment status'}</h3>
            <span style={s.testTag}>TEST MODE</span>
            {phase !== 'processing' && <button onClick={onClose} style={{ marginLeft: 'auto', border: 'none', background: '#F1F5F9', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={16} /></button>}
          </div>
          {renderRight()}
        </div>
      </div>
    </div>
  );
};

export default MakePaymentModal;

// frontend/src/services/paymentGateway.js
// -----------------------------------------------------------------------------
// Payment gateway layer for the Customer Portal.
//
// Cashfree is the primary gateway. The flow is:
//   1. Frontend asks OUR backend to create a Cashfree order
//      POST /api/payments/cashfree/orders  ->  { orderId, paymentSessionId, mode }
//   2. Frontend opens Cashfree Checkout with the paymentSessionId (cashfree.js v3)
//   3. Frontend asks OUR backend to verify the order status
//      GET  /api/payments/cashfree/orders/{orderId}  ->  { orderStatus, payments[] }
//   4. Cashfree also calls our webhook (/api/payments/cashfree/webhook) - the
//      backend should trust the webhook / verify call, never the browser alone.
//
// If the backend is offline or Cashfree keys are not configured, the portal
// falls back to a clearly labelled DEMO (sandbox simulator) so the UI can still
// be shown and tested. No real money moves in demo mode.
// -----------------------------------------------------------------------------

export const GATEWAYS = [
  {
    id: 'cashfree',
    name: 'Cashfree Payments',
    short: 'Cashfree',
    color: '#5E2CED',
    status: 'active',
    fee: '1.90% + GST (UPI 0%)',
    settlement: 'T+1 working day',
    methods: ['UPI', 'Cards', 'Net Banking', 'Wallets', 'Pay Later', 'EMI']
  },
  {
    id: 'phonepe',
    name: 'PhonePe Payment Gateway',
    short: 'PhonePe PG',
    color: '#5F259F',
    status: 'example',
    fee: 'As per merchant plan',
    settlement: 'T+1 working day',
    methods: ['UPI', 'Cards', 'Net Banking', 'Wallets']
  },
  {
    id: 'payu',
    name: 'PayU India',
    short: 'PayU',
    color: '#A6C307',
    status: 'example',
    fee: 'As per merchant plan',
    settlement: 'T+2 working days',
    methods: ['UPI', 'Cards', 'Net Banking', 'Wallets', 'EMI']
  },
  {
    id: 'ccavenue',
    name: 'CCAvenue',
    short: 'CCAvenue',
    color: '#1C75BC',
    status: 'example',
    fee: 'As per merchant plan',
    settlement: 'T+2 working days',
    methods: ['UPI', 'Cards', 'Net Banking', 'Wallets']
  }
];

// Sandbox test values published by gateways for testing (no real money).
export const TEST_VALUES = {
  upiSuccess: 'success@upi',
  upiFailure: 'failure@upi',
  card: { number: '4111 1111 1111 1111', expiry: '12/30', cvv: '123', name: 'Test User' }
};

export const BANKS = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Bank of Baroda', 'Punjab National Bank', 'Union Bank of India'];
export const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik', 'Freecharge', 'JioMoney'];
export const PAY_LATER = ['Simpl', 'LazyPay', 'ZestMoney', 'ICICI PayLater'];
export const UPI_APPS = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'];

export const formatINR = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

const API = '/api/payments/cashfree';
const CASHFREE_SDK = 'https://sdk.cashfree.com/js/v3/cashfree.js';

let sdkPromise = null;
function loadCashfreeSdk() {
  if (window.Cashfree) return Promise.resolve(window.Cashfree);
  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = CASHFREE_SDK;
      s.onload = () => resolve(window.Cashfree);
      s.onerror = () => { sdkPromise = null; reject(new Error('Could not load Cashfree SDK')); };
      document.body.appendChild(s);
    });
  }
  return sdkPromise;
}

/** Ask our backend to create a Cashfree order. Returns null when the backend/keys are unavailable. */
export async function createCashfreeOrder({ invoiceId, amount, customer }) {
  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        invoiceId,
        amount,
        customerId: customer?.id || 'CUST-8021',
        customerName: customer?.name || 'Customer',
        customerEmail: customer?.email || 'customer@example.com',
        customerPhone: customer?.phone || '9999999999'
      })
    });
    if (!res.ok) return null; // 502 backend offline / 503 keys not configured
    const data = await res.json();
    return data?.paymentSessionId ? data : null;
  } catch {
    return null;
  }
}

/** Open the real Cashfree checkout as a popup over the page. */
export async function openCashfreeCheckout({ paymentSessionId, mode }) {
  const Cashfree = await loadCashfreeSdk();
  const cashfree = Cashfree({ mode: mode === 'production' ? 'production' : 'sandbox' });
  return cashfree.checkout({ paymentSessionId, redirectTarget: '_modal' });
}

/** Ask our backend for the final order status (source of truth). */
export async function verifyCashfreeOrder(orderId) {
  const res = await fetch(`${API}/orders/${encodeURIComponent(orderId)}`);
  if (!res.ok) throw new Error('Verification failed');
  return res.json(); // { orderId, orderStatus: 'PAID' | 'ACTIVE' | ..., payments: [...] }
}

const rand = (n) => Math.floor(10 ** (n - 1) + Math.random() * 9 * 10 ** (n - 1));

/**
 * Sandbox simulator used when the backend is not running.
 * Mirrors Cashfree's test behaviour: failure@upi fails, everything else succeeds.
 */
export async function simulateGatewayPayment({ gateway, invoiceId, amount, method, detail }) {
  await new Promise((r) => setTimeout(r, 1800));
  const failed = method === 'UPI' && String(detail).toLowerCase() === TEST_VALUES.upiFailure;
  const prefix = { cashfree: 'CF', phonepe: 'PP', payu: 'PU', ccavenue: 'CC' }[gateway] || 'PG';
  return {
    demo: true,
    status: failed ? 'FAILED' : 'SUCCESS',
    failureReason: failed ? 'Payment declined by the UPI app (test failure@upi)' : null,
    gateway,
    gatewayOrderId: `${prefix}_ORD_${invoiceId}_${Date.now().toString().slice(-6)}`,
    gatewayPaymentId: `${rand(10)}`,
    bankReference: `${rand(12)}`,
    amount,
    method,
    detail,
    paidAt: new Date().toISOString()
  };
}

/** Mask card / account details before storing them in history. */
export function maskDetail(method, detail) {
  if (!detail) return '';
  if (method === 'Cards') return '**** **** **** ' + String(detail).replace(/\s/g, '').slice(-4);
  return detail;
}

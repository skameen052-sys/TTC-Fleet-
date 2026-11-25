// frontend/src/utils/globalSearch.js
// Shared "search everything" helper used by the header search boxes in every portal.
// Each portal passes a list of sources (orders, shipments, invoices ...) and the
// page (tab) that should open when a result is clicked.

const TITLE_KEYS = ['invoiceNumber', 'refundNumber', 'billNumber', 'transactionRef', 'regNumber', 'sku', 'id'];
const SUB_KEYS = ['customerName', 'fullName', 'name', 'vendor', 'make', 'category', 'type', 'service', 'subject'];

const fmtAmount = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN') : v);

function rowText(row) {
  return Object.values(row)
    .filter((v) => v !== null && (typeof v === 'string' || typeof v === 'number'))
    .join(' ')
    .toLowerCase();
}

function describe(row) {
  const title = TITLE_KEYS.map((k) => row[k]).find(Boolean) || 'Record';
  const name = SUB_KEYS.map((k) => row[k]).find((v) => v && v !== title);
  const from = row.pickupLocation || row.origin || row.from;
  const to = row.deliveryLocation || row.destination || row.to;
  const route = from && to ? `${String(from).split(' - ')[0]} → ${String(to).split(' - ')[0]}` : '';
  const amount = row.total ?? row.amount;
  const parts = [name, route, amount !== undefined ? fmtAmount(amount) : ''].filter(Boolean);
  return { title: String(title), subtitle: parts.join(' · '), status: row.status || '' };
}

/**
 * @param {string} query   text typed in the header search box
 * @param {Array<{label:string, tab:string, rows:Array<object>}>} sources
 * @param {number} limit   max results returned
 * @returns {Array<{key, label, tab, title, subtitle, status, row}>}
 */
export function searchRecords(query, sources, limit = 8) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const out = [];
  for (const src of sources) {
    for (const row of src.rows || []) {
      if (!row || typeof row !== 'object') continue;
      const text = rowText(row);
      if (terms.every((t) => text.includes(t))) {
        const d = describe(row);
        out.push({ key: `${src.label}-${d.title}-${out.length}`, label: src.label, tab: src.tab, row, ...d });
        if (out.length >= limit) return out;
      }
    }
  }
  return out;
}

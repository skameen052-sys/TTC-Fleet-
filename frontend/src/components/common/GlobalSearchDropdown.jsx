// frontend/src/components/common/GlobalSearchDropdown.jsx
// Results list shown under a header search box. Click (or Enter) opens the page for that record.
import React from 'react';
import { ChevronRight, SearchX } from 'lucide-react';

const STATUS_COLORS = {
  pending: ['#FEF3C7', '#92400E'], processing: ['#FEF3C7', '#92400E'], approved: ['#DBEAFE', '#1E40AF'],
  'in transit': ['#E0F2FE', '#075985'], delivered: ['#DCFCE7', '#166534'], paid: ['#DCFCE7', '#166534'],
  completed: ['#DCFCE7', '#166534'], cancelled: ['#FEE2E2', '#991B1B'], overdue: ['#FEE2E2', '#991B1B']
};

export default function GlobalSearchDropdown({ query, results = [], onSelect, dark = false, align = 'right' }) {
  if (!query || !String(query).trim()) return null;
  const bg = dark ? '#151B2C' : '#FFFFFF';
  const border = dark ? 'rgba(255,255,255,.12)' : '#E2E8F0';
  const title = dark ? '#F1F5F9' : '#14213D';
  const muted = dark ? '#94A3B8' : '#64748B';

  return (
    <div
      role="listbox"
      style={{
        position: 'absolute', top: 'calc(100% + 6px)', ...(align === 'left' ? { left: 0 } : { right: 0 }), width: 'max(100%, 380px)', maxHeight: 380, overflowY: 'auto',
        background: bg, border: `1px solid ${border}`, borderRadius: 12, boxShadow: '0 14px 34px rgba(15,23,42,.18)', zIndex: 200, padding: 6
      }}
      onMouseDown={(e) => e.preventDefault() /* keep input focus while clicking */}
    >
      {results.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 12px', color: muted, fontSize: 13 }}>
          <SearchX size={16} /> No results for “{query}”
        </div>
      ) : (
        results.map((r, i) => {
          const [sbg, sfg] = STATUS_COLORS[String(r.status).toLowerCase()] || ['#F1F5F9', '#475569'];
          return (
            <button
              key={r.key}
              type="button"
              role="option"
              onClick={() => onSelect && onSelect(r)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '9px 10px',
                border: 'none', borderRadius: 8, cursor: 'pointer', background: i === 0 ? (dark ? 'rgba(255,255,255,.05)' : '#F8FAFC') : 'transparent', fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = dark ? 'rgba(255,255,255,.08)' : '#FFF4EC'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = i === 0 ? (dark ? 'rgba(255,255,255,.05)' : '#F8FAFC') : 'transparent'; }}
            >
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#FF7A1A', background: dark ? 'rgba(255,122,26,.12)' : '#FFF4EC', padding: '3px 7px', borderRadius: 6, whiteSpace: 'nowrap', minWidth: 70, textAlign: 'center' }}>
                {r.label}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 700, color: title }}>{r.title}</span>
                {r.subtitle && <span style={{ display: 'block', fontSize: 11.5, color: muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.subtitle}</span>}
              </span>
              {r.status && <span style={{ fontSize: 10.5, fontWeight: 700, background: sbg, color: sfg, padding: '3px 8px', borderRadius: 10, whiteSpace: 'nowrap' }}>{r.status}</span>}
              <ChevronRight size={14} color={muted} />
            </button>
          );
        })
      )}
      {results.length > 0 && (
        <div style={{ padding: '6px 10px 2px', fontSize: 11, color: muted }}>Press Enter to open the first result · Esc to close</div>
      )}
    </div>
  );
}

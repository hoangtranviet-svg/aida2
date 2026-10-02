// Biểu đồ SVG nhẹ, màu lấy từ biến giao diện (đọc được ở cả nền sáng và tối)
import { esc } from './util.js';

const nice = v => { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))); const f = v / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; };

// Cột dọc: data = [{label, value, color?, tip?}]
export function bars(data, { h = 200, unit = '', max = null, color = 'var(--ocean-2)', fmt = v => v, labelEvery = 1, hi = null } = {}) {
  const W = Math.max(320, data.length * 34), H = h, pl = 34, pb = 26, pt = 14, pr = 6;
  const M = max ?? nice(Math.max(1, ...data.map(d => d.value))); const bw = (W - pl - pr) / data.length;
  const y = v => pt + (H - pt - pb) * (1 - v / M);
  const ticks = [0, M / 2, M];
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">
    <g class="grid">${ticks.map(t => `<line x1="${pl}" x2="${W - pr}" y1="${y(t)}" y2="${y(t)}"/>`).join('')}</g>
    ${ticks.map(t => `<text x="${pl - 6}" y="${y(t) + 4}" text-anchor="end">${fmt(t)}${unit}</text>`).join('')}
    ${data.map((d, i) => { const x = pl + i * bw + bw * .18, w = bw * .64, yy = y(d.value); const fill = d.color || (hi != null && i === hi ? 'var(--sun)' : color);
      return `<rect x="${x}" y="${yy}" width="${w}" height="${Math.max(0, H - pb - yy)}" rx="3" fill="${fill}"><title>${esc(d.tip || d.label + ': ' + fmt(d.value) + unit)}</title></rect>
      ${i % labelEvery === 0 ? `<text x="${x + w / 2}" y="${H - 8}" text-anchor="middle">${esc(d.label)}</text>` : ''}`; }).join('')}
  </svg>`;
}

// Thanh ngang có nhãn: data = [{label, value(0..1), sub?}]
export function hbars(data, { fmt = v => Math.round(v * 100) + '%', color = v => v >= .8 ? 'var(--land)' : v >= .5 ? 'var(--ocean-2)' : 'var(--bad)' } = {}) {
  return `<div class="stack" style="gap:9px">${data.map(d => `<div style="display:grid;grid-template-columns:minmax(0,1fr) 54px;gap:4px 10px;align-items:center">
    <div style="min-width:0;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(d.title || d.label)}">${d.html || esc(d.label)}</div>
    <div class="num" style="text-align:right;font-size:13px;font-weight:600">${d.value == null ? '–' : fmt(d.value)}</div>
    <div class="prog" style="grid-column:1/3"><i style="width:${Math.max(0, Math.min(1, d.value || 0)) * 100}%;background:${color(d.value || 0)}"></i></div></div>`).join('')}</div>`;
}

// Đường xu hướng: points = [{label, value}]
export function line(points, { h = 180, max = 10, unit = '', fmt = v => v } = {}) {
  if (!points.length) return '';
  const W = Math.max(320, points.length * 70), H = h, pl = 30, pb = 26, pt = 16, pr = 16;
  const x = i => pl + (points.length === 1 ? (W - pl - pr) / 2 : i * (W - pl - pr) / (points.length - 1)); const y = v => pt + (H - pt - pb) * (1 - v / max);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.value)}`).join(' ');
  const area = d + ` L${x(points.length - 1)},${H - pb} L${x(0)},${H - pb} Z`;
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img">
    <g class="grid">${[0, max / 2, max].map(t => `<line x1="${pl}" x2="${W - pr}" y1="${y(t)}" y2="${y(t)}"/>`).join('')}</g>
    ${[0, max / 2, max].map(t => `<text x="${pl - 6}" y="${y(t) + 4}" text-anchor="end">${fmt(t)}</text>`).join('')}
    <path d="${area}" fill="var(--ocean-soft)" opacity=".8"/><path d="${d}" fill="none" stroke="var(--ocean-2)" stroke-width="2.5" stroke-linejoin="round"/>
    ${points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p.value)}" r="${i === points.length - 1 ? 5 : 3.5}" fill="${i === points.length - 1 ? 'var(--sun)' : 'var(--surface)'}" stroke="var(--ocean-2)" stroke-width="2"><title>${esc(p.label)}: ${fmt(p.value)}${unit}</title></circle>
      <text x="${x(i)}" y="${H - 8}" text-anchor="middle">${esc(p.label)}</text>
      <text x="${x(i)}" y="${y(p.value) - 9}" text-anchor="middle" class="lbl-strong">${fmt(p.value)}</text>`).join('')}
  </svg>`;
}

// Thang màu nhiệt (0..1)
export const heatColor = v => v == null ? 'var(--h0)' : `var(--h${Math.min(5, Math.max(1, Math.ceil(v * 5)))})`;
export const heatText = v => v == null ? 'var(--muted)' : v > .6 ? 'var(--surface)' : 'var(--ink)';

// Phân bố điểm 0–10
export function histogram(scores, { h = 190 } = {}) {
  const bins = Array(10).fill(0); scores.forEach(s => bins[Math.min(9, Math.floor(s))]++);
  return bars(bins.map((n, i) => ({ label: `${i}–${i + 1}`, value: n, color: i < 5 ? 'var(--bad)' : i < 6.5 ? 'var(--sun)' : i < 8 ? 'var(--ocean-2)' : 'var(--land)', tip: `${n} học sinh đạt ${i} – ${i + 1} điểm` })), { h, fmt: v => Math.round(v) });
}

// Phân bố theo giờ trong ngày
export function hours(arr, { h = 150 } = {}) {
  return bars(arr.map((v, i) => ({ label: String(i), value: v, color: i >= 22 || i < 5 ? 'var(--sun)' : 'var(--ocean-2)', tip: `${i} giờ: ${v} lượt hoạt động` })), { h, labelEvery: 3, fmt: v => Math.round(v) });
}

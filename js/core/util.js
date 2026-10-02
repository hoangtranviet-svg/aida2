// Tiện ích dùng chung cho giao diện
import { ic } from './icons.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = t => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const DAY = 864e5;
export const pct = (v, d = 0) => v == null || isNaN(v) ? '–' : (v * 100).toFixed(d).replace('.', ',') + '%';
export const n1 = v => v == null || isNaN(v) ? '–' : (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');
export const n2 = v => v == null || isNaN(v) ? '–' : (Math.round(v * 100) / 100).toFixed(2).replace('.', ',');
const p2 = n => String(n).padStart(2, '0');
export const dd = ts => { if (!ts) return '–'; const d = new Date(ts); return p2(d.getDate()) + '/' + p2(d.getMonth() + 1); };
export const dfull = ts => { if (!ts) return '–'; const d = new Date(ts); return p2(d.getDate()) + '/' + p2(d.getMonth() + 1) + '/' + d.getFullYear(); };
export const dtime = ts => { if (!ts) return '–'; const d = new Date(ts); return p2(d.getHours()) + ':' + p2(d.getMinutes()) + ' ' + dd(ts); };
export const initials = name => String(name || '?').trim().split(/\s+/).slice(-2).map(w => w[0]).join('').toUpperCase();
export const uid = (p = 'id') => p + '-' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
export const sum = a => a.reduce((x, y) => x + (+y || 0), 0);
export const avg = a => a.length ? sum(a) / a.length : null;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const toNum = s => { const v = parseFloat(String(s).replace(/\s/g, '').replace(',', '.')); return isNaN(v) ? null : v; };

export function rel(ts, now = Date.now()) {
  if (!ts) return '–';
  const d = ts - now, a = Math.abs(d), past = d < 0;
  if (a < 6e4) return past ? 'vừa xong' : 'ngay bây giờ';
  if (a < 36e5) { const m = Math.round(a / 6e4); return past ? `${m} phút trước` : `còn ${m} phút`; }
  if (a < DAY) { const h = Math.round(a / 36e5); return past ? `${h} giờ trước` : `còn ${h} giờ`; }
  const dn = Math.round(a / DAY); return past ? `${dn} ngày trước` : `còn ${dn} ngày`;
}
export function dueChip(due, done, now = Date.now()) {
  if (done) return `<span class="pill p-good">Đã xong</span>`;
  if (!due) return `<span class="pill p-info">Không hạn</span>`;
  if (due < now) return `<span class="pill p-bad">Quá hạn ${dd(due)}</span>`;
  if (due - now < 2 * DAY) return `<span class="pill p-warn">Hạn ${rel(due, now).replace('còn ', 'còn ')}</span>`;
  return `<span class="pill p-info">Hạn ${dd(due)}</span>`;
}

// ---- thông báo nổi ----
export function toast(text, icon = 'bell') {
  let box = $('.toasts'); if (!box) { box = document.createElement('div'); box.className = 'toasts'; box.setAttribute('role', 'status'); document.body.append(box); }
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = ic(icon) + `<span>${esc(text)}</span>`;
  box.append(t); setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3600);
}

// ---- hộp thoại (không dùng alert/confirm của trình duyệt) ----
export function modal({ title, body = '', foot = null, wide = false, onMount = null, onClose = null }) {
  const bg = document.createElement('div'); bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-h"><h2>${esc(title)}</h2><button class="icon-btn" data-x aria-label="Đóng">${ic('x')}</button></div><div class="modal-b">${body}</div>${foot !== null ? `<div class="modal-f">${foot}</div>` : ''}</div>`;
  const close = () => { bg.remove(); document.removeEventListener('keydown', key); onClose?.(); };
  const key = e => { if (e.key === 'Escape') close(); };
  bg.addEventListener('mousedown', e => { if (e.target === bg) close(); });
  bg.querySelector('[data-x]').onclick = close; document.addEventListener('keydown', key);
  document.body.append(bg); onMount?.(bg.querySelector('.modal'), close);
  bg.querySelector('input,select,textarea,button:not([data-x])')?.focus();
  return { el: bg.querySelector('.modal'), close };
}
export function ask({ title, text, ok = 'Đồng ý', danger = false }) {
  return new Promise(res => {
    const m = modal({ title, body: `<p>${text}</p>`, foot: `<button class="btn" data-no>Huỷ</button><button class="btn ${danger ? 'danger' : 'pri'}" data-ok>${esc(ok)}</button>`, onClose: () => res(false) });
    m.el.querySelector('[data-no]').onclick = () => { m.close(); };
    m.el.querySelector('[data-ok]').onclick = () => { res(true); m.close(); };
  });
}

// ---- tải tệp: trong claude.ai dùng quyền downloads, ở web riêng dùng liên kết tải ----
let dl = null; let dlTried = false;
export async function saveFile(filename, data, mime = 'application/octet-stream') {
  if (!dlTried) { dlTried = true; try { dl = window.claude?.use ? await window.claude.use('downloads') : null; } catch (e) { dl = null; } }
  if (dl) {
    try { await dl.save({ filename, data: data instanceof Blob ? data : new Blob([data], { type: mime }) }); toast('Đã lưu ' + filename, 'download'); return true; }
    catch (e) { if (e?.code === 'declined') return false; toast('Không lưu được tệp ở chế độ xem này', 'alert'); return false; }
  }
  try {
    const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type: mime }));
    const a = document.createElement('a'); a.href = url; a.download = filename; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000); toast('Đã tải ' + filename, 'download'); return true;
  } catch (e) { toast('Trình duyệt chặn tải tệp', 'alert'); return false; }
}

// ---- AI của Claude (chỉ có khi mở trong claude.ai) ----
let sample = null, sampleTried = null;
export function getSample() {
  if (!sampleTried) sampleTried = (async () => { try { sample = window.claude?.use ? await window.claude.use('sample') : null; } catch (e) { sample = null; } return sample; })();
  return sampleTried;
}
export const hasAI = () => !!sample;

// tooltip đơn giản theo thuộc tính data-tip
export function initTips() {
  const tip = document.createElement('div'); tip.className = 'tip'; document.body.append(tip);
  document.addEventListener('mousemove', e => {
    const el = e.target.closest?.('[data-tip]'); if (!el) { tip.style.display = 'none'; return; }
    tip.textContent = el.dataset.tip; tip.style.display = 'block';
    const x = Math.min(e.clientX + 14, innerWidth - tip.offsetWidth - 8), y = Math.min(e.clientY + 16, innerHeight - tip.offsetHeight - 8);
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  });
}

export const store = {
  get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
};

// GV · Thói quen học & lỗi sai của lớp
import * as D from '../core/data.js';
import { esc, pct, initials } from '../core/util.js';
import { ic } from '../core/icons.js';
import { ERR, MOD } from '../core/qbank.js';
import { classSummary, STRATEGIES } from '../../app/analytics.js';
import { hours, hbars } from '../core/charts.js';
import { studentDrawer } from './parts.js';

let errOpen = null;
const FLAG = { cram: 'Học dồn sát hạn', night: 'Thường học khuya', guess: 'Trả lời quá nhanh, dễ đoán', retry: 'Làm lại khi chưa xem lại', misc: 'Lặp lại cùng lỗi', skip: 'Bỏ qua phần khám phá', noreview: 'Chưa ôn mô-đun cũ', irregular: 'Học chưa đều' };

export default {
  title: 'Thói quen & lỗi sai',
  onData: why => ['attempt', 'module'].includes(why.type),
  render(el, ctx) {
    const c = D.cls(); const cs = classSummary(D.analyticsView(c));
    const fc = {}; cs.per.forEach(p => p.sum.flags.forEach(f => { (fc[f.id] ||= []).push({ p, f }); }));
    const errs = Object.entries(cs.errs).sort((a, b) => b[1].n - a[1].n);
    const night = cs.hours.slice(22).concat(cs.hours.slice(0, 5)).reduce((a, b) => a + b, 0) / Math.max(1, cs.hours.reduce((a, b) => a + b, 0));
    el.innerHTML = `<div class="lead"><p>Mỗi nhận định dựa trên dấu vết thao tác thật (thời điểm học so với hạn, thời gian trả lời, việc xem lại mô hình sau khi sai…) và kèm chiến lược học có cơ sở khoa học. Quy tắc minh bạch để thầy cô kiểm chứng.</p></div>
    <div class="grid g2">
      <div class="card"><div class="card-h"><div><h2>Thói quen phổ biến trong lớp</h2><p>Số học sinh có dấu hiệu · bấm để xem danh sách</p></div></div>
        ${hbars(Object.keys(FLAG).map(k => ({ label: FLAG[k], value: (fc[k] || []).length / Math.max(1, cs.per.length) })).sort((a, b) => b.value - a.value), { fmt: v => Math.round(v * cs.per.length) + ' HS', color: () => 'var(--sun)' })}
        <div class="stack" style="margin-top:10px;gap:6px">${Object.entries(fc).sort((a, b) => b[1].length - a[1].length).map(([k, list]) => `<details><summary style="cursor:pointer;font-weight:600;font-size:13.5px">${FLAG[k]} · ${list.length} học sinh <span class="muted" style="font-weight:500">→ ${esc(STRATEGIES[list[0].f.strategy].name)}</span></summary>
          <div class="list" style="margin:6px 0 4px">${list.map(({ p, f }) => `<button class="li" data-sid="${p.id}" style="width:100%;border:0;border-bottom:1px solid var(--line);background:none;text-align:left"><span class="av sm">${esc(initials(p.name))}</span><span class="t"><b>${esc(p.name)}</b><span>${esc(f.evidence)}</span></span><span class="pill ${f.level === 'high' ? 'p-bad' : 'p-warn'} plain">${f.level === 'high' ? 'Rõ' : 'Vừa'}</span></button>`).join('')}</div></details>`).join('')}</div></div>
      <div class="card"><div class="card-h"><div><h2>Giờ học của cả lớp</h2><p>${pct(night)} hoạt động diễn ra từ 22 giờ đến 5 giờ sáng (cột màu vàng)</p></div></div><div style="overflow-x:auto">${hours(cs.hours, { h: 200 })}</div>
        <div class="divider"></div><h3 style="font-size:15px;margin-bottom:8px">Chiến lược học được gợi ý</h3>
        <div class="stack" style="gap:8px">${[...new Set(Object.values(fc).map(l => l[0].f.strategy))].map(k => `<div class="note">${ic('spark')}<div><b>${esc(STRATEGIES[k].name)}</b><div style="font-size:12.5px">${esc(STRATEGIES[k].how)}</div><div class="muted" style="font-size:12px;margin-top:2px">${esc(STRATEGIES[k].why)}</div></div></div>`).join('')}</div></div>
    </div>
    <div class="card" style="margin-top:16px"><div class="card-h"><div><h2>Lỗi sai thường gặp</h2><p>Mỗi phương án sai trong ngân hàng câu hỏi được gắn một mã lỗi; bấm để xem học sinh mắc lỗi và bước mô hình nên dạy lại</p></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mã</th><th>Lỗi sai</th><th class="r">Lượt</th><th class="r">Học sinh</th><th>Dạy lại bằng mô hình</th></tr></thead><tbody>
      ${errs.map(([k, v]) => `<tr class="click" data-err="${k}"><td class="mono"><b>${k}</b></td><td>${esc(ERR[k]?.[0] || '')}</td><td class="r num">${v.n}</td><td class="r num">${v.students.size}</td><td>${ERR[k]?.[1] ? `${MOD[ERR[k][1]]?.bai} · bước ${ERR[k][2]}` : '–'}</td></tr>
        ${errOpen === k ? `<tr><td colspan="5" style="background:var(--raise)"><div class="row" style="gap:6px">${[...v.students].map(sid => `<button class="btn sm" data-sid="${sid}">${esc(D.userName(sid))}</button>`).join('')}</div></td></tr>` : ''}`).join('')}</tbody></table></div></div>`;
    el.querySelectorAll('[data-sid]').forEach(b => (b.onclick = e => { e.stopPropagation(); studentDrawer(c, b.dataset.sid); }));
    el.querySelectorAll('[data-err]').forEach(tr => (tr.onclick = () => { errOpen = errOpen === tr.dataset.err ? null : tr.dataset.err; ctx.refresh(); }));
  },
};

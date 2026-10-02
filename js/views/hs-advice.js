// HS · Gợi ý cách học (từ thói quen và lỗi sai của chính em)
import * as D from '../core/data.js';
import { $, esc, pct, getSample } from '../core/util.js';
import { ic } from '../core/icons.js';
import { ERR, MOD } from '../core/qbank.js';
import { studentSummary, STRATEGIES, adviceText } from '../../app/analytics.js';
import { hours } from '../core/charts.js';

export default {
  title: 'Gợi ý cách học',
  onData: why => why.type === 'attempt',
  render(el, ctx) {
    const c = D.cls(); const u = D.me(); const sum = studentSummary(D.analyticsView(c), u.uid);
    const errs = Object.entries(sum.errs).sort((a, b) => b[1] - a[1]).slice(0, 4);
    el.innerHTML = `<div class="grid g-main"><div class="stack" style="gap:16px">
      <div class="card" style="background-image:var(--contour);background-size:260px"><span class="eyebrow">Tóm tắt dành cho em</span><p style="font-size:15.5px;line-height:1.7;margin-top:8px" id="adv">${esc(adviceText(sum, 'Em'))}</p>
        <div class="row" style="margin-top:12px"><button class="btn" id="ai" hidden>${ic('spark')} Nhờ AI viết lời khuyên riêng cho em</button></div></div>
      ${sum.flags.length ? sum.flags.map(f => { const s = STRATEGIES[f.strategy]; return `<div class="card"><div class="row" style="flex-wrap:nowrap;align-items:flex-start;gap:14px"><span class="ic" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;flex:none;background:${f.level === 'high' ? 'var(--bad-soft)' : 'var(--sun-soft)'};color:${f.level === 'high' ? 'var(--bad)' : 'var(--warn)'}">${ic('pulse')}</span>
        <div class="stack" style="gap:6px"><h3 style="font-size:16.5px">${esc(f.title)}</h3><span class="muted" style="font-size:13px">Dấu hiệu: ${esc(f.evidence)}</span>
          <div class="note">${ic('spark')}<div><b>Thử: ${esc(s.name)}</b><div>${esc(s.how)}</div><div class="muted" style="font-size:12px;margin-top:3px">Vì sao: ${esc(s.why)}</div></div></div></div></div></div>`; }).join('')
        : `<div class="empty">${ic('check')}<b>Thói quen học của em đang tốt</b><span>Tiếp tục học đều, ôn lại mô-đun cũ mỗi tuần.</span></div>`}
    </div><div class="stack" style="gap:16px">
      <div class="card"><div class="card-h"><div><h2>Giờ em thường học</h2><p>Cột vàng là sau 22 giờ</p></div></div><div style="overflow-x:auto">${hours(sum.hours, { h: 140 })}</div></div>
      <div class="card"><div class="card-h"><div><h2>Lỗi em hay mắc</h2></div></div>${errs.length ? `<div class="list">${errs.map(([k, n]) => `<div class="li"><span class="ic bad">${ic('alert')}</span><div class="t"><b>${esc(ERR[k]?.[0] || k)}</b><span>${n} lần${ERR[k]?.[1] ? ` · xem lại ${MOD[ERR[k][1]]?.bai}, bước ${ERR[k][2]}` : ''}</span></div>${ERR[k]?.[1] && (c.modules[ERR[k][1]]?.state || 'locked') !== 'locked' ? `<button class="btn sm" data-code="${ERR[k][1]}">Xem lại</button>` : ''}</div>`).join('')}</div>` : '<p class="muted">Chưa có lỗi lặp lại.</p>'}</div>
      ${sum.weak.length ? `<div class="card"><div class="card-h"><h2>Mục tiêu cần củng cố</h2></div><div class="list">${sum.weak.slice(0, 5).map(w => `<div class="li"><div class="t"><b class="mono">${w.o}</b><span>nắm vững ${pct(w.score)} sau ${w.n} lượt</span></div></div>`).join('')}</div></div>` : ''}
    </div></div>`;
    el.querySelectorAll('[data-code]').forEach(b => (b.onclick = () => ctx.go('hs-hoc', { code: b.dataset.code })));
    getSample().then(s => { if (!s) return; const b = $('#ai'); if (!b) return; b.hidden = false; b.onclick = async () => {
      const out = $('#adv'); b.disabled = true; out.textContent = 'Đang viết…';
      const data = { thoi_quen: sum.flags.map(f => ({ ten: f.title, bang_chung: f.evidence, chien_luoc: STRATEGIES[f.strategy].name })), loi: errs.map(([k, n]) => ({ loi: ERR[k]?.[0], lan: n })), muc_tieu_yeu: sum.weak.slice(0, 3).map(w => w.o), ngay_hoc_14: sum.days14 };
      try { const r = await s(`Em là học sinh lớp 10. Hãy viết lời khuyên học môn Địa lí cho em (xưng "thầy/cô" – "em"), 4–6 câu, thân thiện, cụ thể, dựa đúng dữ liệu sau và chỉ dùng các chiến lược có trong dữ liệu. Kết thúc bằng một kế hoạch 3 bước cho tuần này.\n${JSON.stringify(data)}`, { modelTier: 'quick', onText: ({ text }) => { out.textContent = text; } }); out.textContent = r.text; }
      catch (e) { out.textContent = adviceText(sum, 'Em'); } finally { b.disabled = false; } }; });
  },
};

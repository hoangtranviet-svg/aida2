// GV · Mô-đun & lịch mở (thời gian thực)
import * as D from '../core/data.js';
import { esc, dd, toast, modal, DAY } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MODULES } from '../core/qbank.js';
import { progress } from '../core/insight.js';
import { statePill, modIcon } from './parts.js';

const toLocal = ts => { const d = new Date(ts - new Date().getTimezoneOffset() * 6e4); return d.toISOString().slice(0, 16); };

export default {
  title: 'Mô-đun & lịch mở',
  onData: why => ['module', 'storage'].includes(why.type) || (why.type === 'attempt'),
  render(el, ctx) {
    const c = D.cls(); const S = D.students(c); const now = Date.now();
    const live = code => new Set([...c.events, ...c.attempts].filter(x => x.m === code && now - x.ts < 10 * 6e4).map(x => x.s)).size;
    const chaps = [...new Set(MODULES.map(m => m.chap))];
    const counts = { open: 0, review: 0, locked: 0 }; MODULES.forEach(m => counts[c.modules[m.code]?.state || 'locked']++);
    el.innerHTML = `<div class="lead"><p>Bấm <b>Mở</b> khi bắt đầu bài trên lớp – học sinh thấy ngay trên máy của mình. <b>Ôn tập</b> giữ mô-đun mở để xem lại nhưng không tính hạn. Hạn hoàn thành dùng để nhắc việc và phân tích thói quen học dồn.</p>
      <div class="row"><span class="pill p-open">${counts.open} đang mở</span><span class="pill p-review">${counts.review} ôn tập</span><span class="pill p-lock">${counts.locked} khoá</span></div></div>
      ${chaps.map(ch => `<div class="chap-h"><h2>${esc(ch.split(' – ')[1] || ch)}</h2><span>${esc(ch.split(' – ')[0])}</span></div>
      <div class="card pad0"><div class="list">${MODULES.filter(m => m.chap === ch).map(m => { const md = c.modules[m.code] || { state: 'locked' }; const ps = S.map(s => progress(c, s.id).mods.find(x => x.code === m.code).pr); const fin = ps.filter(p => p.done).length; const lv = live(m.code);
        return `<div class="li" style="padding:14px 18px;flex-wrap:wrap"><span class="ic ${md.state === 'open' ? 'sun' : ''}">${modIcon(m.code)}</span>
          <div class="t" style="min-width:220px"><b>${m.bai}: ${esc(m.title)}</b><span class="mono">${m.code}</span> <span style="font-size:12.5px;color:var(--muted)">· ${fin}/${S.length} hoàn thành${lv ? ` · <b style="color:var(--land)">${lv} đang học</b>` : ''}</span></div>
          <div class="row" style="gap:8px">${md.state !== 'locked' ? `<label class="row" style="gap:6px;font-size:12.5px;color:var(--muted)">Hạn <input class="inp sm" type="datetime-local" data-due="${m.code}" value="${md.due ? toLocal(md.due) : ''}" style="width:auto"></label>` : ''}
            <div class="seg" data-code="${m.code}">${['locked', 'open', 'review'].map(s => `<button type="button" data-v="${s}" class="${md.state === s ? 'on' : ''}">${{ locked: 'Khoá', open: 'Mở', review: 'Ôn tập' }[s]}</button>`).join('')}</div>
            <button class="btn sm ghost" data-view="${m.lab}" data-tip="Xem mô hình 3D">${ic('eye')}</button></div></div>`; }).join('')}</div></div>`).join('')}`;
    el.querySelectorAll('.seg[data-code]').forEach(sg => sg.querySelectorAll('button').forEach(b => (b.onclick = () => {
      const code = sg.dataset.code, v = b.dataset.v; const md = c.modules[code] || {};
      const patch = { state: v }; if (v === 'open' && !md.due) patch.due = new Date(new Date(now + 3 * DAY).setHours(21, 0, 0, 0)).getTime();
      D.act.setModule(code, patch); const m = MODULES.find(x => x.code === code);
      toast(v === 'open' ? `Đã mở ${m.bai} cho cả lớp` : v === 'review' ? `${m.bai} chuyển sang Ôn tập` : `Đã khoá ${m.bai}`, v === 'locked' ? 'lock' : 'unlock');
    })));
    el.querySelectorAll('[data-due]').forEach(i => (i.onchange = () => { const t = new Date(i.value).getTime(); if (!isNaN(t)) { D.act.setModule(i.dataset.due, { due: t }); toast('Đã đặt hạn ' + dd(t), 'clock'); } }));
    el.querySelectorAll('[data-view]').forEach(b => (b.onclick = () => modal({ title: 'Xem trước mô hình', wide: true, body: `<iframe src="lab.html#${b.dataset.view}" style="width:100%;height:70vh;border:0;border-radius:12px;background:#0b1320" title="Mô hình 3D"></iframe>` })));
  },
};

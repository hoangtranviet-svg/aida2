// HS · Kết quả & nhận xét
import * as D from '../core/data.js';
import { esc, n1, pct, dd, dfull } from '../core/util.js';
import { ic } from '../core/icons.js';
import { OBJ } from '../core/qbank.js';
import { gradebook, testResults, objectiveScores, remedies, levelCls } from '../core/insight.js';
import { line, hbars } from '../core/charts.js';
import { objChip } from './parts.js';

export default {
  title: 'Kết quả & nhận xét',
  onData: why => ['test', 'sub', 'note', 'attempt'].includes(why.type),
  render(el, ctx) {
    const c = D.cls(); const u = D.me(); const gb = gradebook(c, u.uid, { released: true }); const note = c.notes[u.uid]; const rem = remedies(c, u.uid);
    const shown = gb.marks.filter(m => m.t.kind === 'paper' ? m.t.released !== false : (m.t.released || m.t.opts?.show === 'now'));
    el.innerHTML = `<div class="grid g-main"><div class="stack" style="gap:16px">
      <div class="card"><div class="card-h"><div><h2>Bảng điểm môn Địa lí</h2><p>Điểm trung bình môn theo Thông tư 22: điểm giữa kì hệ số 2, cuối kì hệ số 3</p></div><div class="row"><b class="num" style="font:700 30px var(--display)">${n1(gb.dtb)}</b>${gb.level ? `<span class="pill ${levelCls(gb.level)}">${gb.level}</span>` : ''}</div></div>
        ${shown.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Bài</th><th>Loại</th><th>Ngày</th><th class="r">Điểm</th></tr></thead><tbody>${shown.map(m => `<tr><td><b>${esc(m.t.title)}</b></td><td>${{ tx: 'Thường xuyên', gk: 'Giữa kì (×2)', ck: 'Cuối kì (×3)' }[m.t.cat] || ''}</td><td>${dd(m.t.date)}</td><td class="r num"><b>${n1(m.score)}</b></td></tr>`).join('')}</tbody></table></div>` : `<div class="empty">${ic('chart')}<b>Chưa có điểm được công bố</b></div>`}
        ${shown.length > 1 ? `<div style="overflow-x:auto;margin-top:14px">${line(shown.map(m => ({ label: m.t.title.replace('Kiểm tra ', 'KT ').slice(0, 16), value: +m.score.toFixed(1) })), { fmt: v => String(v).replace('.', ',') })}</div>` : ''}</div>
      ${shown.map(m => { const r = testResults(c, m.t).rows.find(x => x.sid === u.uid); const os = objectiveScores(c, m.t, r);
        return Object.keys(os).length ? `<div class="card"><div class="card-h"><div><h2>${esc(m.t.title)}</h2><p>Mức đạt theo từng mục tiêu</p></div>${m.t.kind === 'online' ? `<button class="btn sm" data-review="${m.t.id}">${ic('eye')} Xem bài làm</button>` : ''}</div>${hbars(Object.entries(os).map(([o, v]) => ({ html: objChip(o), title: OBJ[o], value: v.got / v.max })))}</div>` : ''; }).join('')}
      </div><div class="stack" style="gap:16px">
      <div class="card"><div class="card-h"><h2>Nhận xét của thầy/cô</h2></div>${note ? `<p style="line-height:1.65">${esc(note.text)}</p><p class="muted" style="font-size:12px;margin-top:8px">${esc(D.userName(note.by))} · ${dfull(note.ts)}</p>` : '<p class="muted">Thầy/cô chưa gửi nhận xét.</p>'}</div>
      <div class="card"><div class="card-h"><div><h2>Nhiệm vụ cải thiện</h2><p>Mục tiêu dưới 50% trong bài kiểm tra; hoàn thành khi làm đúng thêm 2 câu</p></div></div>
        ${rem.length ? `<div class="list">${rem.map(r => `<div class="li"><div class="t"><div class="row" style="gap:6px">${objChip(r.o)}<span class="muted" style="font-size:12px">${esc(r.test)} · đạt ${pct(r.frac)}</span></div></div>${r.done ? '<span class="pill p-good">Đã cải thiện</span>' : `<button class="btn sm pri" data-o="${r.o}" data-m="${r.module || ''}">Luyện ${r.progress}/2</button>`}</div>`).join('')}</div>` : '<p class="muted">Không có nhiệm vụ cải thiện.</p>'}</div></div></div>`;
    el.querySelectorAll('[data-o]').forEach(b => (b.onclick = () => ctx.go('hs-hoc', { o: b.dataset.o, code: b.dataset.m })));
    el.querySelectorAll('[data-review]').forEach(b => (b.onclick = () => ctx.go('hs-lam-bai', { tid: b.dataset.review })));
  },
};

// HS · Tiến trình của em
import * as D from '../core/data.js';
import { esc, pct, n1, dueChip, DAY, rel } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MOD, OBJ } from '../core/qbank.js';
import { progress, todos, gradebook, levelCls } from '../core/insight.js';
import { studentSummary } from '../../app/analytics.js';
import { hbars, line } from '../core/charts.js';
import { objChip, modIcon } from './parts.js';

export default {
  title: 'Tiến trình của em',
  onData: why => ['module', 'attempt', 'test', 'sub'].includes(why.type),
  render(el, ctx) {
    const c = D.cls(); const u = D.me(); const P = progress(c, u.uid); const T = todos(c, u.uid); const gb = gradebook(c, u.uid, { released: true });
    const sum = studentSummary(D.analyticsView(c), u.uid);
    const days = new Set([...c.events, ...c.attempts].filter(x => x.s === u.uid).map(x => new Date(x.ts).toDateString()));
    let streak = 0; let d = new Date(); if (!days.has(d.toDateString())) d = new Date(Date.now() - DAY);
    while (days.has(d.toDateString()) && streak < 365) { streak++; d = new Date(d.getTime() - DAY); }
    const ok = c.attempts.filter(a => a.s === u.uid && a.correct).length;
    const next = T.filter(t => !t.optional)[0];
    const objs = Object.entries(sum.mastery).sort((a, b) => a[0].localeCompare(b[0]));
    el.innerHTML = `<div class="grid g-main">
      <div class="stack" style="gap:16px">
        <div class="card" style="display:flex;gap:22px;align-items:center;flex-wrap:wrap;background-image:var(--contour);background-size:260px">
          <div class="ring" style="--p:${Math.round(P.pctAvail * 100)}"><div><b>${Math.round(P.pctAvail * 100)}%</b><span>mô-đun đã mở</span></div></div>
          <div style="flex:1;min-width:220px" class="stack"><span class="eyebrow">Chào ${esc(u.name.split(' ').pop())}</span><h2 style="font-size:24px">${P.pctAvail >= .9 ? 'Em đang theo kịp lớp rất tốt!' : P.pctAvail >= .6 ? 'Em đang đi đúng hướng.' : 'Cùng bắt kịp tiến độ của lớp nhé.'}</h2>
            <div><div class="row between" style="font-size:13px"><span class="muted">Cả năm (${P.mods.length} mô-đun)</span><b class="num">${pct(P.pctYear)}</b></div><div class="prog land" style="margin-top:5px"><i style="width:${P.pctYear * 100}%"></i></div></div></div></div>
        ${next ? `<div class="banner card" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;background:var(--sun-soft);border-color:transparent"><span class="ic" style="width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--sun);color:var(--on-sun)">${ic(next.kind === 'test' ? 'test' : next.kind === 'remedy' ? 'target' : 'play')}</span>
          <div style="flex:1;min-width:200px"><span class="eyebrow">Việc nên làm tiếp</span><div style="font:650 17px var(--display);margin-top:2px">${esc(next.title)}</div><div class="muted" style="font-size:13px">${esc(next.sub)}</div></div>${dueChip(next.due, false)}
          <button class="btn sun" id="go">${next.kind === 'test' ? 'Làm bài' : 'Bắt đầu'} ${ic('arrowR')}</button></div>` : ''}
        <div class="card"><div class="card-h"><div><h2>Mô-đun đã mở</h2><p>Khám phá mô hình 40% · luyện tập 60%</p></div><a class="btn sm" href="#hs-lo-trinh">Lộ trình</a></div>
          <div class="list">${P.avail.map(m => `<button class="li" data-code="${m.code}" style="width:100%;border:0;border-bottom:1px solid var(--line);background:none;text-align:left"><span class="ic ${m.st.state === 'open' ? 'sun' : ''}">${modIcon(m.code)}</span>
            <span class="t"><b>${m.bai}: ${esc(m.title)}</b><span>Khám phá ${Math.round(m.pr.explore * 100)}% · luyện tập ${m.pr.nok}/${m.pr.nq} câu${m.pr.last ? ' · ' + rel(m.pr.last) : ''}</span><div class="prog ${m.pr.done ? 'land' : ''}" style="margin-top:6px"><i style="width:${m.pr.pct * 100}%"></i></div></span>
            <b class="num" style="width:44px;text-align:right">${Math.round(m.pr.pct * 100)}%</b></button>`).join('') || '<p class="muted">Chưa có mô-đun nào được mở.</p>'}</div></div>
      </div>
      <div class="stack" style="gap:16px">
        <div class="kpis" style="margin:0;grid-template-columns:repeat(2,1fr)">
          <div class="kpi"><span class="k">Chuỗi ngày học</span><span class="v num">${streak}<small> ngày</small></span><span class="d">${sum.days14} ngày học trong 2 tuần</span></div>
          <div class="kpi"><span class="k">Câu trả lời đúng</span><span class="v num">${ok}</span><span class="d">nắm vững TB ${pct(sum.avg)}</span></div>
          <div class="kpi"><span class="k">Mô-đun hoàn thành</span><span class="v num">${P.nDone}<small>/${P.mods.length}</small></span></div>
          <div class="kpi"><span class="k">Điểm TB môn</span><span class="v num">${n1(gb.dtb)}</span><span class="d">${gb.level ? `<span class="pill ${levelCls(gb.level)}">${gb.level}</span>` : 'chưa có điểm'}</span></div></div>
        <div class="card"><div class="card-h"><div><h2>Mức nắm vững theo mục tiêu</h2><p>Tính từ câu luyện tập, lần gần đây được tính nặng hơn</p></div></div>
          ${objs.length ? hbars(objs.map(([o, v]) => ({ html: objChip(o) + ` <span class="muted" style="font-size:12px">${v.n} lượt</span>`, title: OBJ[o], value: v.score }))) : '<p class="muted">Làm câu luyện tập trong mô-đun để thấy mức nắm vững.</p>'}</div>
        ${gb.marks.length > 1 ? `<div class="card"><div class="card-h"><h2>Điểm kiểm tra</h2></div><div style="overflow-x:auto">${line(gb.marks.map(m => ({ label: m.t.title.replace('Kiểm tra ', 'KT ').slice(0, 16), value: +m.score.toFixed(1) })), { fmt: v => String(v).replace('.', ',') })}</div></div>` : ''}
      </div></div>`;
    el.querySelector('#go')?.addEventListener('click', () => { if (next.kind === 'test') ctx.go('hs-lam-bai', { tid: next.tid }); else if (next.kind === 'remedy') ctx.go('hs-hoc', { o: next.o, code: next.module }); else ctx.go('hs-hoc', { code: next.code }); });
    el.querySelectorAll('[data-code]').forEach(b => (b.onclick = () => ctx.go('hs-hoc', { code: b.dataset.code })));
  },
};

// GV · Tổng quan lớp
import * as D from '../core/data.js';
import { esc, pct, dd, rel, n1, avg, initials } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MODULES, MOD, ERR } from '../core/qbank.js';
import { classSummary } from '../../app/analytics.js';
import { progress, testResults } from '../core/insight.js';
import { heatColor, heatText, line } from '../core/charts.js';
import { studentDrawer } from './parts.js';

export default {
  title: 'Tổng quan lớp',
  onData: why => ['attempt', 'module', 'sub', 'test', 'class', 'storage'].includes(why.type),
  render(el, ctx) {
    const c = D.cls(); const S = D.students(c); const view = D.analyticsView(c); const cs = classSummary(view);
    const now = Date.now(); const openMods = MODULES.filter(m => c.modules[m.code]?.state === 'open');
    const active7 = new Set([...c.events, ...c.attempts].filter(x => now - x.ts < 7 * 864e5).map(x => x.s)).size;
    const prog = S.map(s => progress(c, s.id)); const avgProg = avg(prog.map(p => p.pctAvail));
    const done = c.tests.filter(t => t.status !== 'draft'); const lastT = done.filter(t => testResults(c, t).rows.some(r => r.score10 != null)).sort((a, b) => (b.date || 0) - (a.date || 0))[0];
    const lastR = lastT ? testResults(c, lastT) : null; const lastAvg = lastR ? avg(lastR.rows.filter(r => r.score10 != null).map(r => r.score10)) : null;
    const pend = c.subs.filter(s => s.end && c.tests.find(t => t.id === s.tid)?.items.some(it => it.t === 'tlu' && s.essay?.[it.qid] == null)).length;
    const weakObj = Object.entries(cs.objAvg).sort((a, b) => a[1] - b[1]).slice(0, 6);
    const errs = Object.entries(cs.errs).sort((a, b) => b[1].n - a[1].n).slice(0, 4);
    const trend = done.filter(t => t.cat !== 'gk' || t.status !== 'draft').map(t => ({ t, a: avg(testResults(c, t).rows.filter(r => r.score10 != null).map(r => r.score10)) })).filter(x => x.a != null).sort((a, b) => (a.t.date || 0) - (b.t.date || 0));

    el.innerHTML = `<div class="lead"><div><p>${esc(c.name)} · ${S.length} học sinh · năm học ${esc(c.year || '')}. Số liệu cập nhật ngay khi học sinh thao tác.</p></div>
      <div class="acts"><a class="btn" href="#gv-mo-dun">${ic('unlock')} Mở mô-đun</a><a class="btn pri" href="#gv-tao-de">${ic('wand')} Tạo đề kiểm tra</a></div></div>
    <div class="kpis">
      <div class="kpi"><span class="k">Học sinh hoạt động 7 ngày</span><span class="v num">${active7}<small>/${S.length}</small></span><span class="d">${pct(active7 / Math.max(1, S.length))} sĩ số</span></div>
      <div class="kpi"><span class="k">Hoàn thành mô-đun đã mở</span><span class="v num">${pct(avgProg)}</span><span class="d">trung bình cả lớp</span></div>
      <div class="kpi"><span class="k">Điểm TB bài gần nhất</span><span class="v num">${n1(lastAvg)}</span><span class="d">${lastT ? esc(lastT.title) : 'Chưa có bài'}</span></div>
      <div class="kpi"><span class="k">Cần hỗ trợ</span><span class="v num">${cs.support.length}</span><span class="d">${pend ? `${pend} bài tự luận chờ chấm` : 'học sinh có dấu hiệu cần quan tâm'}</span></div>
    </div>
    <div class="grid g-main">
      <div class="stack" style="gap:16px">
        <div class="card"><div class="card-h"><div><h2>Mô-đun đang mở</h2><p>Tiến độ của lớp trên từng mô-đun</p></div><a class="btn sm" href="#gv-mo-dun">Quản lí</a></div>
          ${openMods.length ? `<div class="list">${openMods.map(m => { const md = c.modules[m.code]; const ps = prog.map(p => p.mods.find(x => x.code === m.code).pr); const started = ps.filter(p => p.started).length, fin = ps.filter(p => p.done).length;
            return `<div class="li"><span class="ic sun">${ic('cube')}</span><div class="t"><b>${m.bai}: ${esc(m.title)}</b><span>${fin} hoàn thành · ${started - fin} đang học · ${S.length - started} chưa bắt đầu · hạn ${dd(md.due)} (${rel(md.due)})</span>
              <div class="prog" style="margin-top:6px;display:flex"><i style="width:${fin / S.length * 100}%;background:var(--land)"></i><i style="width:${(started - fin) / S.length * 100}%;background:var(--ocean-2);border-radius:0"></i></div></div></div>`; }).join('')}</div>` : `<div class="empty">${ic('lock')}<b>Chưa mở mô-đun nào</b><span>Mở mô-đun đầu tiên trong mục “Mô-đun & lịch mở”.</span></div>`}
        </div>
        <div class="card"><div class="card-h"><div><h2>Bản đồ nắm vững theo mục tiêu</h2><p>Mỗi ô là một học sinh × mục tiêu; màu đậm = nắm vững hơn. Bấm tên để xem chi tiết.</p></div></div>
          ${heatmap(c, cs)}</div>
      </div>
      <div class="stack" style="gap:16px">
        <div class="card"><div class="card-h"><div><h2>Cần hỗ trợ</h2><p>Lí do được nêu rõ để thầy cô quyết định</p></div></div>
          ${cs.support.length ? `<div class="list">${cs.support.slice(0, 7).map(s => `<button class="li" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line);text-align:left" data-sid="${s.id}"><span class="av sm">${esc(initials(s.name))}</span><span class="t"><b>${esc(s.name)}</b><span>${esc(s.reasons.slice(0, 2).join(' · '))}</span></span>${ic('chevR')}</button>`).join('')}</div>` : `<div class="empty">${ic('check')}<b>Không có học sinh cần chú ý</b></div>`}</div>
        <div class="card"><div class="card-h"><div><h2>Mục tiêu yếu nhất</h2><p>Theo câu luyện tập trên mô hình</p></div></div>
          <div class="stack" style="gap:9px">${weakObj.map(([o, v]) => `<div><div class="row between" style="font-size:13px"><span class="obj">${o}</span><b class="num">${pct(v)}</b></div><div class="prog" style="margin-top:5px"><i style="width:${v * 100}%;background:${v < .5 ? 'var(--bad)' : 'var(--ocean-2)'}"></i></div></div>`).join('')}</div></div>
        <div class="card"><div class="card-h"><div><h2>Lỗi sai phổ biến</h2></div><a class="btn sm" href="#gv-thoi-quen">Chi tiết</a></div>
          <div class="list">${errs.map(([k, v]) => `<div class="li"><span class="ic bad">${ic('alert')}</span><div class="t"><b>${esc(ERR[k]?.[0] || k)}</b><span>${k} · ${v.n} lượt · ${v.students.size} học sinh</span></div></div>`).join('')}</div></div>
        ${trend.length > 1 ? `<div class="card"><div class="card-h"><h2>Điểm trung bình các bài kiểm tra</h2></div><div style="overflow-x:auto">${line(trend.map(x => ({ label: x.t.title.replace('Kiểm tra ', 'KT ').slice(0, 18), value: +x.a.toFixed(1) })), { fmt: v => String(v).replace('.', ',') })}</div></div>` : ''}
      </div>
    </div>`;
    el.querySelectorAll('[data-sid]').forEach(b => (b.onclick = () => studentDrawer(c, b.dataset.sid)));
  },
};

function heatmap(c, cs) {
  const objs = Object.keys(cs.objAvg).sort(); if (!objs.length) return `<div class="empty">${ic('chart')}<b>Chưa có dữ liệu luyện tập</b></div>`;
  const rows = cs.per.slice().sort((a, b) => (a.sum.avg ?? 1) - (b.sum.avg ?? 1));
  return `<div style="overflow-x:auto"><div class="heat" style="grid-template-columns:150px repeat(${objs.length},minmax(30px,1fr));min-width:${150 + objs.length * 33}px">
    <div></div>${objs.map(o => `<div style="font:600 9.5px var(--mono);color:var(--muted);writing-mode:vertical-rl;transform:rotate(180deg);height:70px;justify-self:center" title="${o}">${o.slice(5)}</div>`).join('')}
    ${rows.map(p => `<button data-sid="${p.id}" style="border:0;background:none;text-align:left;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 6px 0 0;color:var(--ink)">${esc(p.name)}</button>${objs.map(o => { const v = p.sum.mastery[o]?.score; return `<div class="c" style="background:${heatColor(v)};color:${heatText(v)}" data-tip="${esc(p.name)} · ${o}: ${v == null ? 'chưa làm' : Math.round(v * 100) + '%'}">${v == null ? '' : Math.round(v * 100)}</div>`; }).join('')}`).join('')}
  </div></div><div class="legend" style="margin-top:10px"><span><i style="background:var(--h1)"></i>dưới 20%</span><span><i style="background:var(--h3)"></i>40–60%</span><span><i style="background:var(--h5)"></i>trên 80%</span><span><i style="background:var(--h0);border:1px solid var(--line)"></i>chưa làm</span></div>`;
}

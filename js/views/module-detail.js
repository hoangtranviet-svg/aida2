// GV · Dữ liệu làm việc của học sinh trong một mô-đun: ai đã làm, làm gì, học bao lâu, sai ở đâu
import * as D from '../core/data.js';
import { esc, pct, dtime, dd, rel, modal, initials, saveFile } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MOD, ERR, allQ } from '../core/qbank.js';
import { moduleProgress } from '../core/insight.js';
import { studentDrawer, L } from './parts.js';

const MIN = 6e4, GAP = 20 * MIN, IDLE = 5 * MIN, TAIL = 30e3;

// thời lượng dễ đọc
export function fmtDur(ms) {
  if (!ms) return '–';
  const m = Math.round(ms / MIN); if (m < 1) return '< 1 phút';
  if (m < 60) return m + ' phút';
  return Math.floor(m / 60) + ' giờ ' + String(m % 60).padStart(2, '0') + ' phút';
}

// gom hoạt động thành các phiên học; thời gian học = tổng khoảng cách giữa các thao tác (bỏ phần treo máy > 5 phút)
export function workLog(c, sid, code) {
  const ev = c.events.filter(e => e.s === sid && e.m === code);
  const at = c.attempts.filter(a => a.s === sid && a.m === code);
  const all = [...ev.map(e => ({ ...e, k: 'ev' })), ...at.map(a => ({ ...a, k: 'at' }))].sort((a, b) => a.ts - b.ts);
  const sessions = [];
  let cur = null;
  all.forEach(x => {
    if (!cur || x.ts - cur.end > GAP) { cur = { start: x.ts, end: x.ts, ms: TAIL, items: [] }; sessions.push(cur); }
    else { cur.ms += Math.min(x.ts - cur.end, IDLE); cur.end = x.ts; }
    cur.items.push(x);
  });
  sessions.forEach(s => {
    const it = s.items;
    s.steps = [...new Set(it.filter(x => x.type === 'step').map(x => x.payload?.step).filter(Boolean))].sort((a, b) => a - b);
    s.hot = it.filter(x => x.type === 'hotspot').length;
    s.tasks = it.filter(x => x.type === 'task_done').length;
    s.ctrl = it.filter(x => x.type === 'control').length;
    s.review = it.some(x => x.payload?.review) || it.some(x => x.type === 'review_from_quiz');
    s.complete = it.some(x => x.type === 'module_complete');
    s.q = it.filter(x => x.k === 'at'); s.ok = s.q.filter(a => a.correct).length;
  });
  const errs = {}; at.filter(a => a.err).forEach(a => (errs[a.err] = (errs[a.err] || 0) + 1));
  const wrong = at.filter(a => !a.correct).sort((a, b) => b.ts - a.ts);
  const fast = at.filter(a => a.ms < 4000).length;
  return {
    all, sessions, at, wrong, errs, fast,
    time: sessions.reduce((a, s) => a + s.ms, 0),
    steps: new Set(ev.filter(e => e.type === 'step').map(e => e.payload?.step)).size,
    hot: ev.filter(e => e.type === 'hotspot').length,
    tasks: new Set(ev.filter(e => e.type === 'task_done').map(e => e.payload?.task)).size,
    reviews: ev.filter(e => e.type === 'review_from_quiz').length,
    acc: at.length ? at.filter(a => a.correct).length / at.length : null,
    avgMs: at.length ? at.reduce((a, x) => a + (x.ms || 0), 0) / at.length : null,
    first: all[0]?.ts || null, last: all[all.length - 1]?.ts || null,
  };
}

const STATUS = { done: ['Hoàn thành', 'p-good'], doing: ['Đang học', 'p-warn'], none: ['Chưa bắt đầu', 'p-lock'] };
const statusOf = pr => pr.done ? 'done' : pr.started ? 'doing' : 'none';

function sessionText(s) {
  const parts = [];
  if (s.steps.length) parts.push(`xem ${s.steps.length > 1 ? `bước ${s.steps[0]}–${s.steps[s.steps.length - 1]}` : `bước ${s.steps[0]}`}`);
  if (s.hot) parts.push(`${s.hot} điểm thông tin`);
  if (s.ctrl) parts.push(`${s.ctrl} lần điều khiển mô hình`);
  if (s.tasks) parts.push(`${s.tasks} nhiệm vụ`);
  if (s.q.length) parts.push(`${s.q.length} câu luyện tập (${s.ok} đúng)`);
  if (!parts.length) parts.push('mở mô-đun');
  return parts.join(' · ');
}

function detailHTML(c, s, r, Q) {
  const w = r.log; const now = Date.now();
  const errList = Object.entries(w.errs).sort((a, b) => b[1] - a[1]);
  return `<div class="md-detail">
    <div class="row" style="gap:8px;margin-bottom:12px">
      <span class="pill p-info plain">${ic('clock')} ${fmtDur(w.time)} · ${w.sessions.length} phiên</span>
      <span class="pill p-info plain">Khám phá ${pct(r.pr.explore)} · ${w.steps} bước · ${w.hot} điểm thông tin</span>
      <span class="pill p-info plain">Luyện tập ${r.pr.nok}/${r.pr.nq} câu · đúng ${pct(w.acc)}</span>
      ${w.avgMs ? `<span class="pill ${w.fast / Math.max(1, w.at.length) > .3 ? 'p-warn' : 'p-info'} plain">TB ${Math.round(w.avgMs / 1000)} giây/câu${w.fast ? ` · ${w.fast} câu dưới 4 giây` : ''}</span>` : ''}
      ${w.reviews ? `<span class="pill p-good plain">Xem lại mô hình ${w.reviews} lần sau khi sai</span>` : ''}
      <span class="sp"></span><button class="btn sm" data-profile="${s.id}">${ic('user')} Hồ sơ học sinh</button>
    </div>
    ${!w.all.length ? `<p class="muted">Học sinh chưa mở mô-đun này.</p>` : `<div class="g2 grid" style="gap:16px">
      <div><h4 class="md-h">Nhật kí phiên học</h4><ol class="md-tl">${w.sessions.slice().reverse().map(se => `<li><b>${dtime(se.start)}</b> <span class="muted">· ${fmtDur(se.ms)}${se.review ? ' · ôn lại' : ''}${se.complete ? ' · <b style="color:var(--good)">hoàn thành nhiệm vụ</b>' : ''}</span><div>${sessionText(se)}</div></li>`).join('')}</ol></div>
      <div><h4 class="md-h">Lỗi sai mắc phải ${w.wrong.length ? `<span class="muted">(${w.wrong.length} lần trả lời sai)</span>` : ''}</h4>
        ${errList.length ? `<div class="stack" style="gap:6px;margin-bottom:10px">${errList.map(([e, n]) => `<div class="md-err"><span class="mono">${e}</span><span>${esc(ERR[e]?.[0] || 'Lỗi khác')}</span><b class="num">${n} lần</b></div>`).join('')}</div>` : w.at.length ? '<p class="muted">Không có lỗi sai.</p>' : '<p class="muted">Chưa làm câu luyện tập.</p>'}
        ${w.wrong.slice(0, 6).map(a => { const q = Q[a.q]; if (!q) return ''; return `<div class="md-q"><div>${esc(q.q)}</div>
          <div class="muted" style="font-size:12.5px;margin-top:4px">Em chọn <b style="color:var(--bad)">${L[a.choice] ?? '?'}. ${esc(q.a?.[a.choice] ?? '')}</b> · đáp án <b style="color:var(--good)">${L[q.k]}. ${esc(q.a?.[q.k] ?? '')}</b></div>
          <div class="muted" style="font-size:12px;margin-top:2px">${rel(a.ts, now)} · ${Math.round((a.ms || 0) / 1000)} giây${a.err ? ` · ${a.err}` : ''}${w.at.some(x => x.q === a.q && x.correct && x.ts > a.ts) ? ' · <span style="color:var(--good)">đã làm đúng lại</span>' : ''}</div></div>`; }).join('')}
        ${w.wrong.length > 6 ? `<p class="muted" style="font-size:12.5px">… và ${w.wrong.length - 6} lần sai khác.</p>` : ''}
      </div></div>`}
  </div>`;
}

export function moduleDetail(c, code, { filter = 'all' } = {}) {
  const m = MOD[code]; const S = D.students(c); const md = c.modules[code] || { state: 'locked' };
  const Q = allQ(c).byId; const now = Date.now();
  const rows = S.map(s => { const pr = moduleProgress(c, s.id, code); const log = workLog(c, s.id, code); return { s, pr, log, st: statusOf(pr), late: md.due && md.due < now && !pr.done }; });
  const ORD = { none: 0, doing: 1, done: 2 }; rows.sort((a, b) => ORD[a.st] - ORD[b.st] || (b.late ? 1 : 0) - (a.late ? 1 : 0));
  const cnt = { done: 0, doing: 0, none: 0 }; rows.forEach(r => cnt[r.st]++);
  const started = rows.filter(r => r.st !== 'none');
  const avgTime = started.length ? started.reduce((a, r) => a + r.log.time, 0) / started.length : 0;
  const allAt = rows.flatMap(r => r.log.at); const acc = allAt.length ? allAt.filter(a => a.correct).length / allAt.length : null;
  // lỗi theo lớp
  const E = {}; rows.forEach(r => Object.entries(r.log.errs).forEach(([e, n]) => { const o = E[e] ||= { n: 0, who: new Set() }; o.n += n; o.who.add(r.s.id); }));
  const topE = Object.entries(E).sort((a, b) => b[1].who.size - a[1].who.size || b[1].n - a[1].n).slice(0, 5);
  // câu sai nhiều
  const QS = {}; allAt.forEach(a => { const o = QS[a.q] ||= { n: 0, wrong: 0, ch: {} }; o.n++; if (!a.correct) { o.wrong++; o.ch[a.choice] = (o.ch[a.choice] || 0) + 1; } });
  const topQ = Object.entries(QS).filter(([, v]) => v.wrong && v.n >= 3).sort((a, b) => b[1].wrong / b[1].n - a[1].wrong / a[1].n).slice(0, 3);

  const body = `<div class="stack" style="gap:16px">
    <div class="row" style="gap:8px"><span class="mono muted">${code}</span><span class="pill ${md.state === 'open' ? 'p-open' : md.state === 'review' ? 'p-review' : 'p-lock'}">${{ open: 'Đang mở', review: 'Ôn tập', locked: 'Đang khoá' }[md.state]}</span>${md.due ? `<span class="pill ${md.due < now ? 'p-bad' : 'p-info'} plain">${ic('clock')} Hạn ${dtime(md.due)}</span>` : ''}${md.openedAt ? `<span class="muted" style="font-size:12.5px">Mở từ ${dd(md.openedAt)}</span>` : ''}</div>
    <div class="kpis" style="margin:0">
      <div class="kpi"><span class="k">Hoàn thành</span><span class="v num">${cnt.done}<small>/${S.length}</small></span><span class="d">đạt ≥ 80% mô-đun</span></div>
      <div class="kpi"><span class="k">Đang học</span><span class="v num">${cnt.doing}</span><span class="d">${rows.filter(r => r.late && r.st === 'doing').length} em quá hạn</span></div>
      <div class="kpi"><span class="k">Chưa bắt đầu</span><span class="v num">${cnt.none}</span><span class="d">chưa mở mô-đun</span></div>
      <div class="kpi"><span class="k">Thời gian học TB</span><span class="v num" style="font-size:24px">${fmtDur(avgTime)}</span><span class="d">mỗi em đã bắt đầu</span></div>
      <div class="kpi"><span class="k">Trả lời đúng</span><span class="v num">${pct(acc)}</span><span class="d">${allAt.length} lượt luyện tập</span></div>
    </div>
    ${topE.length || topQ.length ? `<div class="g2 grid" style="gap:14px">
      <div class="card"><h4 class="md-h">Lỗi sai phổ biến của lớp</h4>${topE.length ? topE.map(([e, v]) => `<div class="md-err"><span class="mono">${e}</span><span>${esc(ERR[e]?.[0] || 'Lỗi khác')}</span><b class="num" data-tip="${v.n} lần sai">${v.who.size} HS</b></div>`).join('') : '<p class="muted">Chưa có lỗi sai.</p>'}</div>
      <div class="card"><h4 class="md-h">Câu hỏi sai nhiều nhất</h4>${topQ.length ? topQ.map(([id, v]) => { const q = Q[id]; const mc = Object.entries(v.ch).sort((a, b) => b[1] - a[1])[0]; return q ? `<div class="md-q"><div>${esc(q.q)}</div><div class="muted" style="font-size:12.5px;margin-top:4px">Sai ${pct(v.wrong / v.n)} (${v.wrong}/${v.n} lượt)${mc ? ` · hay chọn nhầm <b>${L[mc[0]]}. ${esc(q.a?.[mc[0]] ?? '')}</b>` : ''}</div></div>` : ''; }).join('') : '<p class="muted">Chưa đủ dữ liệu.</p>'}</div>
    </div>` : ''}
    <div class="row" style="gap:10px"><div class="seg" id="mdF">${[['all', 'Tất cả', S.length], ['done', 'Hoàn thành', cnt.done], ['doing', 'Đang học', cnt.doing], ['none', 'Chưa bắt đầu', cnt.none]].map(([v, t, n]) => `<button type="button" data-f="${v}" class="${v === filter ? 'on' : ''}">${t} ${n}</button>`).join('')}</div>
      <input class="inp sm" id="mdS" placeholder="Tìm học sinh…" style="max-width:220px"><span class="sp"></span><span class="muted" style="font-size:12.5px">Bấm vào một học sinh để xem chi tiết</span></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Học sinh</th><th>Trạng thái</th><th style="min-width:140px">Tiến độ</th><th class="r">Thời gian</th><th class="r">Bước đã xem</th><th class="r">Câu đúng</th><th>Lỗi hay mắc</th><th>Lần cuối</th></tr></thead>
      <tbody id="mdT">${rows.map(r => { const e = Object.entries(r.log.errs).sort((a, b) => b[1] - a[1])[0]; return `<tr class="click" data-sid="${r.s.id}" data-st="${r.st}" data-name="${esc(r.s.name.toLowerCase())}">
        <td><div class="row" style="gap:8px;flex-wrap:nowrap"><span class="av sm">${esc(initials(r.s.name))}</span><b style="white-space:nowrap">${esc(r.s.name)}</b></div></td>
        <td><span class="pill ${STATUS[r.st][1]}">${STATUS[r.st][0]}</span>${r.late ? ' <span class="pill p-bad plain">Quá hạn</span>' : ''}</td>
        <td><div class="row" style="gap:8px;flex-wrap:nowrap"><div class="prog ${r.pr.done ? 'land' : ''}" style="flex:1;min-width:70px"><i style="width:${Math.round(r.pr.pct * 100)}%"></i></div><span class="num" style="font-size:12.5px">${pct(r.pr.pct)}</span></div></td>
        <td class="r">${fmtDur(r.log.time)}</td><td class="r">${r.log.steps || '–'}</td><td class="r">${r.pr.nq ? `${r.pr.nok}/${r.pr.nq}` : '–'}</td>
        <td>${e ? `<span class="mono" data-tip="${esc(ERR[e[0]]?.[0] || '')}">${e[0]}</span> <span class="muted">×${e[1]}</span>` : '<span class="muted">–</span>'}</td>
        <td class="muted" style="white-space:nowrap">${r.log.last ? rel(r.log.last, now) : '–'}</td></tr>`; }).join('')}</tbody></table></div>
  </div>`;

  const foot = `<button class="btn" data-csv>${ic('download')} Tải bảng (CSV)</button><button class="btn pri" data-close>Đóng</button>`;
  const dlg = modal({ title: `${m.bai}: ${m.title} – dữ liệu học tập`, body, foot, wide: true });
  dlg.el.classList.add('xl');
  const el = dlg.el; const T = el.querySelector('#mdT');
  let f = filter, q = '';
  const apply = () => T.querySelectorAll('tr[data-sid]').forEach(tr => { const show = (f === 'all' || tr.dataset.st === f) && (!q || tr.dataset.name.includes(q)); tr.hidden = !show; const d = tr.nextElementSibling; if (d?.classList.contains('md-row')) d.hidden = !show; });
  el.querySelectorAll('#mdF button').forEach(b => (b.onclick = () => { f = b.dataset.f; el.querySelectorAll('#mdF button').forEach(x => x.classList.toggle('on', x === b)); apply(); }));
  el.querySelector('#mdS').oninput = e => { q = e.target.value.trim().toLowerCase(); apply(); };
  T.querySelectorAll('tr[data-sid]').forEach(tr => (tr.onclick = () => {
    const nx = tr.nextElementSibling;
    if (nx?.classList.contains('md-row')) { nx.remove(); tr.classList.remove('open'); return; }
    const r = rows.find(x => x.s.id === tr.dataset.sid);
    const d = document.createElement('tr'); d.className = 'md-row'; d.innerHTML = `<td colspan="8">${detailHTML(c, r.s, r, Q)}</td>`;
    tr.after(d); tr.classList.add('open');
    d.querySelector('[data-profile]').onclick = ev => { ev.stopPropagation(); studentDrawer(c, r.s.id); };
  }));
  apply();
  el.querySelector('[data-close]').onclick = () => dlg.close();
  el.querySelector('[data-csv]').onclick = () => {
    const head = ['Họ tên', 'Trạng thái', 'Tiến độ (%)', 'Khám phá (%)', 'Thời gian học (phút)', 'Số phiên', 'Bước đã xem', 'Câu đúng', 'Số câu', 'Lượt trả lời', 'Tỉ lệ đúng (%)', 'Lỗi sai (mã × số lần)', 'Lần đầu', 'Lần cuối'];
    const lines = rows.map(r => [r.s.name, STATUS[r.st][0] + (r.late ? ' (quá hạn)' : ''), Math.round(r.pr.pct * 100), Math.round(r.pr.explore * 100), Math.round(r.log.time / MIN), r.log.sessions.length, r.log.steps, r.pr.nok, r.pr.nq, r.log.at.length, r.log.acc == null ? '' : Math.round(r.log.acc * 100), Object.entries(r.log.errs).map(([e, n]) => `${e}×${n}`).join(' '), r.log.first ? dtime(r.log.first) : '', r.log.last ? dtime(r.log.last) : '']);
    const csv = '﻿' + [head, ...lines].map(l => l.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
    saveFile(`${code}-du-lieu-hoc-tap.csv`, csv, 'text/csv;charset=utf-8');
  };
}

// Phiếu báo cáo học tập gửi phụ huynh (2 trang A4) – xem trên màn hình và xuất PDF
import * as D from '../core/data.js';
import { esc, n1, pct, dd, dfull, avg, DAY } from '../core/util.js';
import { MODULES, MOD, OBJ, ERR, allQ, qOf } from '../core/qbank.js';
import { gradebook, testResults, objectiveScores, progress, remedies, draftComment, todos, levelOf } from '../core/insight.js';
import { studentSummary, STRATEGIES } from '../../app/analytics.js';

// màu cố định (in ấn, không phụ thuộc giao diện sáng/tối)
const K = { ink: '#14283b', mute: '#5d6f80', line: '#d9e1e7', soft: '#f3f6f8', blue: '#1f5f8b', blue2: '#6fa8d1', sun: '#e8913a', green: '#2e9b62', red: '#c0392b', gray: '#c3ccd4' };
const FONT = "'Be Vietnam Pro',Arial,sans-serif";
const PART = { mc: 'Trắc nghiệm nhiều lựa chọn', ds: 'Trắc nghiệm đúng/sai', tln: 'Trả lời ngắn', tlu: 'Tự luận' };
const WEEKS = 8;

// ---------- số liệu ----------
const sessionsOf = ts => { const xs = ts.slice().sort((a, b) => a - b); const out = []; let s = null; xs.forEach(t => { if (!s || t - s.e > 25 * 6e4) { s = { b: t, e: t }; out.push(s); } else s.e = t; }); return out.map(x => ({ b: x.b, min: (x.e - x.b) / 6e4 + 3 })); };
const weekStart = t => { const d = new Date(t); d.setHours(0, 0, 0, 0); const k = (d.getDay() + 6) % 7; return d.getTime() - k * DAY; };
function weeklyMinutes(ts, now) {
  const w0 = weekStart(now) - (WEEKS - 1) * 7 * DAY; const arr = Array(WEEKS).fill(0);
  sessionsOf(ts).forEach(s => { const i = Math.floor((s.b - w0) / (7 * DAY)); if (i >= 0 && i < WEEKS) arr[i] += s.min; });
  return { arr, labels: Array.from({ length: WEEKS }, (_, i) => dd(w0 + i * 7 * DAY)) };
}
const memo = new Map();
function classStats(c) {
  const key = c.id + ':' + c.events.length + ':' + c.attempts.length + ':' + c.tests.length + ':' + c.subs.length; if (memo.has(key)) return memo.get(key);
  const now = Date.now(); const S = D.students(c);
  const tests = c.tests.filter(t => t.status !== 'draft' && (t.kind === 'paper' || t.released || t.status === 'closed')).sort((a, b) => (a.date || 0) - (b.date || 0));
  const res = Object.fromEntries(tests.map(t => [t.id, testResults(c, t)]));
  const tAvg = Object.fromEntries(tests.map(t => [t.id, avg(res[t.id].rows.filter(r => r.score10 != null).map(r => r.score10))]));
  const byS = {}; c.events.forEach(e => (byS[e.s] ||= []).push(e.ts)); c.attempts.forEach(a => (byS[a.s] ||= []).push(a.ts));
  const wk = S.map(s => weeklyMinutes(byS[s.id] || [], now).arr);
  const wAvg = Array.from({ length: WEEKS }, (_, i) => avg(wk.map(a => a[i])));
  const gk = tests.find(t => t.cat === 'gk'); let gkPart = null;
  if (gk) { gkPart = {}; const done = res[gk.id].rows.filter(r => r.per); gk.items.forEach((it, i) => { const p = gkPart[it.t] ||= { max: 0, sum: 0 }; p.max += it.pts; p.sum += avg(done.map(r => r.per[i] || 0)) || 0; }); }
  const out = { tests, res, tAvg, wAvg, gk, gkPart, n: S.length, byS };
  memo.clear(); memo.set(key, out); return out;
}

export function dossier(c, sid) {
  const now = Date.now(); const u = D.userOf(sid); const CS = classStats(c); const view = D.analyticsView(c);
  const sum = studentSummary(view, sid); const gb = gradebook(c, sid); const P = progress(c, sid); const draft = draftComment(c, sid, view);
  const marks = CS.tests.map(t => { const row = CS.res[t.id].rows.find(r => r.sid === sid); return { t, score: row?.score10 ?? null, avg: CS.tAvg[t.id], row }; });
  // GHK I
  let gk = null;
  if (CS.gk) { const row = CS.res[CS.gk.id].rows.find(r => r.sid === sid);
    if (row?.per) { const parts = {}; CS.gk.items.forEach((it, i) => { const p = parts[it.t] ||= { got: 0, max: 0 }; p.got += row.per[i] || 0; p.max += it.pts; });
      const objs = Object.entries(objectiveScores(c, CS.gk, row)).map(([o, v]) => ({ o, f: v.got / v.max, got: v.got, max: v.max }));
      gk = { t: CS.gk, score: row.score10, parts, objs, rank: CS.res[CS.gk.id].rows.filter(r => r.score10 != null && r.score10 > row.score10).length + 1, n: CS.res[CS.gk.id].rows.filter(r => r.score10 != null).length }; } }
  // thời gian trực tuyến
  const ts = CS.byS[sid] || []; const wk = weeklyMinutes(ts, now); const sess = sessionsOf(ts);
  const totalMin = sess.reduce((a, s) => a + s.min, 0); const days = new Set(ts.map(t => new Date(t).toDateString())).size;
  const testTime = c.subs.filter(x => x.uid === sid && x.end).map(x => { const t = c.tests.find(y => y.id === x.tid); return t ? { title: t.title, used: (x.end - x.start) / 6e4, limit: t.duration, blur: x.blur || 0 } : null; }).filter(Boolean);
  // nỗ lực
  const at = c.attempts.filter(a => a.s === sid); const ev = c.events.filter(e => e.s === sid);
  const byQ = {}; at.slice().sort((a, b) => a.ts - b.ts).forEach(a => (byQ[a.q] ||= []).push(a.correct));
  const corrected = Object.values(byQ).filter(a => a[0] === false && a.includes(true)).length; const wrongFirst = Object.values(byQ).filter(a => a[0] === false).length;
  const firstAcc = Object.values(byQ).length ? Object.values(byQ).filter(a => a[0]).length / Object.values(byQ).length : null;
  const reviewSteps = ev.filter(e => e.payload?.review).length; const tasks = ev.filter(e => e.type === 'task_done').length; const completes = P.avail.filter(m => m.pr.done).length;
  const rem = remedies(c, sid);
  // mục tiêu
  const objMap = {}; Object.entries(sum.mastery).forEach(([o, v]) => { if (v.n >= 2) objMap[o] = { o, p: v.score, src: 'luyện tập' }; });
  (gk?.objs || []).forEach(x => { const cur = objMap[x.o]; const f = cur ? (cur.p + x.f) / 2 : x.f; objMap[x.o] = { o: x.o, p: f, src: cur ? 'luyện tập + GHK I' : 'GHK I' }; });
  const mod = o => allQ(c).find(q => q.o === o)?.m;
  const goodObj = Object.values(objMap).filter(x => x.p >= .8).sort((a, b) => b.p - a.p);
  const weakObj = Object.values(objMap).filter(x => x.p < .55).sort((a, b) => a.p - b.p);
  const errTop = Object.entries(sum.errs).sort((a, b) => b[1] - a[1]).slice(0, 2).filter(([, n]) => n >= 2);
  return { c, u, sid, now, sum, gb, P, draft, note: c.notes[sid], marks, gk, CS, wk, totalMin, days, nSess: sess.length, testTime, corrected, wrongFirst, firstAcc, nAns: at.length, reviewSteps, tasks, completes, rem, goodObj, weakObj, mod, errTop, T: todos(c, sid) };
}

// ---------- biểu đồ SVG (màu cố định) ----------
const svgT = (x, y, t, o = {}) => `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${o.s || 10}" fill="${o.c || K.mute}" text-anchor="${o.a || 'middle'}" font-weight="${o.w || 400}">${esc(t)}</text>`;
function chartScores(marks, W = 340, H = 190) {
  const pl = 26, pb = 40, pt = 16, n = marks.length || 1; const bw = (W - pl - 8) / n; const y = v => pt + (H - pt - pb) * (1 - v / 10);
  let g = [0, 5, 10].map(v => `<line x1="${pl}" x2="${W - 4}" y1="${y(v)}" y2="${y(v)}" stroke="${K.line}"/>${svgT(pl - 5, y(v) + 3, v, { a: 'end' })}`).join('');
  marks.forEach((m, i) => {
    const x0 = pl + i * bw + bw * .14, w = bw * .34;
    if (m.avg != null) g += `<rect x="${x0 + w + 2}" y="${y(m.avg)}" width="${w}" height="${H - pb - y(m.avg)}" rx="2" fill="${K.gray}"/>`;
    if (m.score != null) { g += `<rect x="${x0}" y="${y(m.score)}" width="${w}" height="${H - pb - y(m.score)}" rx="2" fill="${m.t.cat === 'gk' ? K.sun : K.blue}"/>` + svgT(x0 + w / 2, y(m.score) - 4, n1(m.score), { c: K.ink, w: 700, s: 10.5 }); }
    else g += svgT(x0 + w / 2, H - pb - 6, 'vắng', { s: 9 });
    const lab = m.t.cat === 'gk' ? 'GHK I' : 'TX' + (marks.filter(x => x.t.cat === 'tx').indexOf(m) + 1);
    g += svgT(x0 + w + 1, H - pb + 14, lab, { c: K.ink, w: 600 }) + svgT(x0 + w + 1, H - pb + 26, dd(m.t.date), { s: 9 });
  });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}
function chartParts(parts, cls, W = 340) {
  const keys = ['mc', 'ds', 'tln', 'tlu'].filter(k => parts[k]); const rh = 34, H = keys.length * rh + 8, lx = 136, bwid = W - lx - 46;
  let g = '';
  keys.forEach((k, i) => { const y0 = 4 + i * rh; const p = parts[k]; const f = p.got / p.max; const cf = cls?.[k] ? cls[k].sum / cls[k].max : null;
    g += svgT(lx - 6, y0 + 12, PART[k], { a: 'end', c: K.ink, s: 9 }) + svgT(lx - 6, y0 + 24, `${n1(p.got)}/${n1(p.max)} điểm`, { a: 'end', s: 8.5 });
    g += `<rect x="${lx}" y="${y0 + 3}" width="${bwid}" height="12" rx="6" fill="${K.soft}"/><rect x="${lx}" y="${y0 + 3}" width="${bwid * f}" height="12" rx="6" fill="${f >= .8 ? K.green : f >= .5 ? K.blue : K.red}"/>`;
    if (cf != null) g += `<rect x="${lx}" y="${y0 + 19}" width="${bwid * cf}" height="6" rx="3" fill="${K.gray}"/>`;
    g += svgT(lx + bwid + 6, y0 + 13, pct(f), { a: 'start', c: K.ink, w: 700 }) + (cf != null ? svgT(lx + bwid + 6, y0 + 25, pct(cf), { a: 'start', s: 8.5 }) : ''); });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}
function chartWeeks(wk, wAvg, W = 340, H = 170) {
  const pl = 30, pb = 24, pt = 14; const M = Math.max(30, ...wk.arr, ...wAvg.map(v => v || 0)) * 1.15; const n = wk.arr.length; const bw = (W - pl - 6) / n; const y = v => pt + (H - pt - pb) * (1 - v / M);
  const step = M > 240 ? 120 : M > 100 ? 50 : M > 40 ? 20 : 10;
  let g = ''; for (let v = 0; v <= M; v += step) g += `<line x1="${pl}" x2="${W - 4}" y1="${y(v)}" y2="${y(v)}" stroke="${K.line}"/>${svgT(pl - 4, y(v) + 3, v, { a: 'end', s: 9 })}`;
  wk.arr.forEach((v, i) => { const x = pl + i * bw + bw * .2, w = bw * .6; g += `<rect x="${x}" y="${y(v)}" width="${w}" height="${H - pb - y(v)}" rx="2" fill="${K.blue}"/>` + (v >= 1 ? svgT(x + w / 2, y(v) - 3, Math.round(v), { c: K.ink, s: 8.5, w: 600 }) : '') + svgT(x + w / 2, H - 8, wk.labels[i], { s: 8.5 }); });
  const pts = wAvg.map((v, i) => `${pl + i * bw + bw / 2},${y(v || 0)}`).join(' ');
  g += `<polyline points="${pts}" fill="none" stroke="${K.sun}" stroke-width="2" stroke-dasharray="4 3"/>` + wAvg.map((v, i) => `<circle cx="${pl + i * bw + bw / 2}" cy="${y(v || 0)}" r="2.5" fill="${K.sun}"/>`).join('');
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}
function chartHours(hours, W = 340, H = 110) {
  const pl = 6, pb = 18, pt = 8; const M = Math.max(1, ...hours); const bw = (W - pl * 2) / 24; const y = v => pt + (H - pt - pb) * (1 - v / M);
  let g = `<line x1="${pl}" x2="${W - pl}" y1="${H - pb}" y2="${H - pb}" stroke="${K.line}"/>`;
  hours.forEach((v, i) => { const x = pl + i * bw + 1; g += `<rect x="${x}" y="${y(v)}" width="${bw - 2}" height="${H - pb - y(v)}" rx="1.5" fill="${i >= 22 || i < 5 ? K.sun : K.blue2}"/>`; if (i % 3 === 0) g += svgT(x + bw / 2, H - 5, i + 'h', { s: 8.5 }); });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}
function chartTestTime(list, W = 340) {
  if (!list.length) return `<p style="color:${K.mute};font-size:11px;margin:4px 0">Chưa có bài làm trực tuyến.</p>`;
  const rh = 30, H = list.length * rh + 4, lx = 120, bwid = W - lx - 40; const M = Math.max(...list.map(x => Math.max(x.used, x.limit)));
  let g = '';
  list.forEach((x, i) => { const y0 = 2 + i * rh; const nm = x.title.replace(/^Kiểm tra /, 'KT ').replace(/\s*\(.*\)$/, ''); const short = nm.length > 26 ? nm.slice(0, 25) + '…' : nm;
    g += svgT(lx - 6, y0 + 11, short, { a: 'end', c: K.ink, s: 9 }) + svgT(lx - 6, y0 + 22, `giới hạn ${x.limit} phút${x.blur ? ` · rời trang ${x.blur} lần` : ''}`, { a: 'end', s: 8 });
    g += `<rect x="${lx}" y="${y0 + 4}" width="${bwid * x.limit / M}" height="14" rx="3" fill="none" stroke="${K.gray}"/><rect x="${lx}" y="${y0 + 4}" width="${bwid * Math.min(x.used, x.limit) / M}" height="14" rx="3" fill="${x.used < x.limit * .4 ? K.sun : K.blue2}"/>` + svgT(lx + bwid * x.limit / M + 5, y0 + 15, Math.round(x.used) + ' ph', { a: 'start', c: K.ink, w: 600, s: 9.5 }); });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}
function modBars(P, W = 340) {
  const list = P.avail.slice(0, 12); const rh = 15, H = list.length * rh + 2, lx = 50, bwid = W - lx - 36;
  let g = ''; list.forEach((m, i) => { const y0 = i * rh; const f = m.pr.pct;
    g += svgT(lx - 6, y0 + 10, m.bai, { a: 'end', c: K.ink, s: 9 }) + `<rect x="${lx}" y="${y0 + 3}" width="${bwid}" height="8" rx="4" fill="${K.soft}"/><rect x="${lx}" y="${y0 + 3}" width="${bwid * f}" height="8" rx="4" fill="${f >= .8 ? K.green : f >= .5 ? K.blue : f > 0 ? K.sun : K.gray}"/>` + svgT(lx + bwid + 5, y0 + 10, Math.round(f * 100) + '%', { a: 'start', c: K.ink, s: 9 }); });
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${g}</svg>`;
}

// ---------- trang A4 (794 × 1123 px) ----------
const CSS = `.a4{width:794px;height:1123px;box-sizing:border-box;padding:38px 42px 30px;background:#fff;color:${K.ink};font-family:${FONT};font-size:11.5px;line-height:1.5;position:relative;overflow:hidden}
.a4 *{box-sizing:border-box}.a4 h1{font-size:17px;margin:0;letter-spacing:.01em;font-weight:700;line-height:1.3}.a4 h2{font-size:12.5px;margin:0 0 6px;text-transform:uppercase;letter-spacing:.04em;color:${K.blue};font-weight:700;line-height:1.3}
.a4 .hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid ${K.ink};padding-bottom:10px;margin-bottom:12px}.a4 .muted{color:${K.mute}}
.a4 .kp{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:14px}.a4 .kp div{background:${K.soft};border-radius:8px;padding:8px 10px}.a4 .kp b{display:block;font-size:19px;line-height:1.2;margin-top:2px}.a4 .kp span{font-size:9.5px;color:${K.mute};text-transform:uppercase;letter-spacing:.03em}
.a4 .g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px}.a4 .bx{border:1px solid ${K.line};border-radius:10px;padding:11px 13px;margin-bottom:12px}.a4 .lg{display:flex;gap:12px;font-size:9.5px;color:${K.mute};margin-top:2px}.a4 .lg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px;vertical-align:-1px}
.a4 ul{margin:0;padding-left:16px}.a4 li{margin:2px 0}.a4 .tag{display:inline-block;font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;background:${K.soft};color:${K.blue};margin-right:4px;font-family:monospace}
.a4 .note{background:#fff8ef;border-left:3px solid ${K.sun};padding:9px 12px;border-radius:0 8px 8px 0;font-size:12px;line-height:1.6}.a4 .ft{position:absolute;left:42px;right:42px;bottom:16px;font-size:9px;color:${K.mute};display:flex;justify-content:space-between;border-top:1px solid ${K.line};padding-top:6px}
.a4 .st{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px}.a4 .st div{background:${K.soft};border-radius:6px;padding:6px 8px;font-size:10px;color:${K.mute}}.a4 .st b{display:block;font-size:15px;color:${K.ink}}
.a4 .sign{display:grid;grid-template-columns:1fr 1fr;gap:20px;text-align:center;margin-top:10px;font-size:11px}.a4 .sign b{display:block;margin-bottom:46px}`;

export function pagesHTML(d) {
  const { c, u, gb, P, gk, CS } = d; const teacher = c.teacherName || D.me()?.name || ''; const school = c.school || '';
  const lvl = gb.level; const lvColor = { 'Tốt': K.green, 'Khá': K.blue, 'Đạt': K.sun, 'Chưa đạt': K.red }[lvl] || K.mute;
  const note = d.note?.text || d.draft.text;
  const hd = (p) => `<div class="hd"><div><div class="muted" style="font-size:10px;text-transform:uppercase;letter-spacing:.05em">${esc(school || 'Lớp học số AIDA 2.0')} · Năm học ${esc(c.year || '')}</div><h1>PHIẾU BÁO CÁO KẾT QUẢ HỌC TẬP MÔN ĐỊA LÍ</h1><div class="muted">Giữa học kì I · Trang ${p}/2</div></div>
    <div style="text-align:right"><div style="font-size:15px;font-weight:700">${esc(u?.name || '')}</div><div>${esc(c.name)}</div><div class="muted">GV: ${esc(teacher)} · ${dfull(d.now)}</div></div></div>`;
  const ft = `<div class="ft"><span>AIDA 2.0 · Dữ liệu từ lớp học số môn Địa lí (mô hình 3D, luyện tập, kiểm tra)</span><span>Điểm trung bình môn tạm tính theo TT 22: (TĐĐGtx + 2×ĐĐGgk) / (số ĐĐGtx + 2)</span></div>`;
  const kp = `<div class="kp"><div><span>Điểm GHK I</span><b style="color:${K.sun}">${gk ? n1(gk.score) : '–'}</b><span style="text-transform:none">${gk ? `TB lớp ${n1(CS.tAvg[gk.t.id])}` : ''}</span></div>
    <div><span>ĐTB môn (tạm tính)</span><b>${n1(gb.dtb)}</b><span style="text-transform:none;color:${lvColor};font-weight:700">${lvl ? 'Mức ' + lvl : ''}</span></div>
    <div><span>Mô-đun đã mở</span><b>${pct(P.pctAvail)}</b><span style="text-transform:none">hoàn thành</span></div>
    <div><span>Thời gian học</span><b>${n1(d.totalMin / 60)} giờ</b><span style="text-transform:none">${d.nSess} buổi trực tuyến</span></div>
    <div><span>Số ngày học</span><b>${d.days}</b><span style="text-transform:none">${d.sum.days14} ngày trong 2 tuần qua</span></div></div>`;
  const objLine = x => `<li><span class="tag">${x.o}</span>${esc(shortObj(x.o))} <b style="color:${x.p >= .8 ? K.green : K.red}">${pct(x.p)}</b></li>`;
  const p1 = `<div class="a4">${hd(1)}${kp}
    <div class="g2"><div class="bx"><h2>Điểm các bài kiểm tra</h2>${chartScores(d.marks)}<div class="lg"><span><i style="background:${K.blue}"></i>Thường xuyên</span><span><i style="background:${K.sun}"></i>Giữa kì I</span><span><i style="background:${K.gray}"></i>Trung bình lớp</span></div></div>
      <div class="bx"><h2>Bài kiểm tra giữa học kì I</h2>${gk ? `<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px"><b style="font-size:24px;color:${K.sun}">${n1(gk.score)}</b><span class="muted">/ 10 điểm · xếp thứ ${gk.rank}/${gk.n} trong lớp · ${esc(gk.t.items.length + ' câu, ' + gk.t.duration + ' phút')}</span></div>${chartParts(gk.parts, CS.gkPart)}<div class="lg"><span><i style="background:${K.green}"></i>Kết quả của em</span><span><i style="background:${K.gray}"></i>Trung bình lớp</span></div>` : '<p class="muted">Chưa có điểm kiểm tra giữa kì.</p>'}</div></div>
    <div class="bx"><h2>Kết quả theo mục tiêu trong bài giữa kì I</h2>${gk ? `<div class="g2" style="gap:6px 18px">${(x => x.length > 12 ? [...x.slice(0, 6), ...x.slice(-6)] : x)(gk.objs.slice().sort((a, b) => b.f - a.f)).map(x => `<div style="display:flex;gap:6px;align-items:center;font-size:10.5px"><span class="tag">${x.o}</span><span style="flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${esc(shortObj(x.o))}</span><b style="color:${x.f >= .8 ? K.green : x.f >= .5 ? K.blue : K.red}">${pct(x.f)}</b></div>`).join('')}</div>` : '–'}</div>
    <div class="bx" style="margin-bottom:0"><h2>Nhận xét của giáo viên</h2><div class="note">${esc(note)}</div>
      <div class="g2" style="margin-top:10px"><div><b style="font-size:11px">Mục tiêu em đã làm được</b><ul style="font-size:10.5px;margin-top:3px">${d.goodObj.slice(0, 5).map(objLine).join('') || '<li class="muted">Chưa đủ dữ liệu.</li>'}</ul></div>
        <div><b style="font-size:11px">Mục tiêu cần cải thiện</b><ul style="font-size:10.5px;margin-top:3px">${d.weakObj.slice(0, 5).map(x => `<li><span class="tag">${x.o}</span>${esc(shortObj(x.o))} <b style="color:${K.red}">${pct(x.p)}</b>${d.mod(x.o) ? ` <span class="muted">→ ôn ${esc(MOD[d.mod(x.o)]?.bai || '')}</span>` : ''}</li>`).join('') || '<li>Không có mục tiêu dưới mức đạt. Rất tốt!</li>'}</ul></div></div></div>
    ${ft}</div>`;
  const flags = d.sum.flags.slice().sort((a, b) => ({ high: 0, mid: 1, low: 2 }[a.level] - { high: 0, mid: 1, low: 2 }[b.level]));
  const p2 = `<div class="a4">${hd(2)}
    <div class="g2"><div class="bx"><h2>Thời gian học trực tuyến theo tuần (phút)</h2>${chartWeeks(d.wk, CS.wAvg)}<div class="lg"><span><i style="background:${K.blue}"></i>Của em</span><span><i style="background:${K.sun}"></i>Trung bình lớp</span></div></div>
      <div class="bx"><h2>Giờ học trong ngày</h2>${chartHours(d.sum.hours)}<div class="lg"><span><i style="background:${K.blue2}"></i>Trước 22 giờ</span><span><i style="background:${K.sun}"></i>Sau 22 giờ</span></div>
        <h2 style="margin-top:10px">Thời gian làm bài kiểm tra trực tuyến</h2>${chartTestTime(d.testTime)}</div></div>
    <div class="g2"><div class="bx"><h2>Quá trình nỗ lực</h2>
        <div class="st"><div><b>${d.nAns}</b>câu luyện tập</div><div><b>${d.corrected}/${d.wrongFirst}</b>câu sai đã sửa đúng</div><div><b>${d.reviewSteps}</b>lần xem lại mô hình</div><div><b>${d.completes}</b>mô-đun hoàn thành</div><div><b>${d.tasks}</b>nhiệm vụ 3D</div><div><b>${d.rem.filter(r => r.done).length}/${d.rem.length}</b>nhiệm vụ cải thiện</div></div>
        <b style="font-size:10.5px">Mức hoàn thành từng mô-đun</b>${modBars(P)}</div>
      <div class="bx"><h2>Thói quen học tập</h2>${flags.length ? flags.slice(0, 3).map(f => `<div style="margin-bottom:8px"><b style="color:${f.level === 'high' ? K.red : K.sun}">● ${esc(f.title)}</b><div class="muted" style="font-size:10px">${esc(f.evidence)}</div><div style="font-size:10.5px"><b>Đề xuất:</b> ${esc(STRATEGIES[f.strategy].name)} – ${esc(STRATEGIES[f.strategy].how)}</div></div>`).join('')
        : `<p style="margin:0 0 8px"><b style="color:${K.green}">● Thói quen học tốt</b><br><span style="font-size:10.5px">Em học đều đặn, khám phá mô hình trước khi luyện tập và xem lại học liệu khi làm sai. Hãy duy trì!</span></p>`}
        ${d.errTop.length ? `<div style="margin-top:4px;font-size:10.5px"><b>Lỗi sai hay gặp:</b><ul>${d.errTop.map(([k, n]) => `<li>${esc(ERR[k]?.[0] || k)} (${n} lần)</li>`).join('')}</ul></div>` : ''}</div></div>
    <div class="bx"><h2>Gia đình có thể đồng hành cùng em</h2><ul>${[...(flags.length ? flags.slice(0, 2).map(f => esc(STRATEGIES[f.strategy].how)) : ['Duy trì thói quen học đều mỗi ngày 15 – 20 phút, trước 22 giờ.']), ...d.T.filter(t => !t.optional).slice(0, 2).map(t => 'Nhắc em hoàn thành: ' + esc(t.title)), 'Cùng em xem lại phiếu này và đặt một mục tiêu cụ thể cho cuối học kì I.'].map(x => `<li>${x}</li>`).join('')}</ul></div>
    <div class="sign"><div><b>Ý kiến của phụ huynh</b><span class="muted">(kí, ghi rõ họ tên)</span></div><div><b>Giáo viên bộ môn</b>${esc(teacher)}</div></div>
    ${ft}</div>`;
  return [p1, p2];
}
function shortObj(o) { const t = OBJ[o] || ''; const s = t.replace(/^(Trình bày|Phân tích|Nêu|Xác định|Phân biệt|Khái quát|Giải thích|Sử dụng|So sánh|Nhận xét|Đọc|Liên hệ)( được| và giải thích được)?\s*/i, ''); const x = s.charAt(0).toUpperCase() + s.slice(1); return x.length > 70 ? x.slice(0, 68).replace(/[ ,;:]+\S*$/, '') + '…' : x.replace(/\.$/, ''); }

// xem trước trong khung riêng (tránh lẫn kiểu chữ của giao diện chính)
export function previewHTML(d, scale = .62) {
  const W = Math.round(794 * scale), Hh = Math.round(1123 * scale);
  const doc = `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&display=swap" rel="stylesheet"><style>body{margin:0;background:transparent;display:flex;flex-wrap:wrap;gap:16px}.pg{width:${W}px;height:${Hh}px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.18);border-radius:4px;flex:none;background:#fff}.pg>div{transform:scale(${scale});transform-origin:0 0}${CSS}</style></head><body>${pagesHTML(d).map(p => `<div class="pg"><div>${p}</div></div>`).join('')}</body></html>`;
  return `<iframe title="Xem trước phiếu báo cáo" style="border:0;width:100%;min-width:${W + 20}px;height:${Hh * 2 + 40}px;display:block" srcdoc="${esc(doc)}"></iframe>`;
}

// ---------- xuất PDF (html2canvas đi kèm trang + bộ ghi PDF tự viết) ----------
let h2c = null;
const loadH2C = () => h2c ||= new Promise((res, rej) => { if (window.html2canvas) return res(); const s = document.createElement('script'); s.src = new URL('../lib/html2canvas.min.js', import.meta.url).href; s.onload = res; s.onerror = () => rej(new Error('Không tải được bộ dựng ảnh trang')); document.head.append(s); });
export async function exportPDF(c, sids, onProgress) {
  await loadH2C(); const { jpegPagesToPdf, canvasToJpegPage } = await import('../lib/pdf.js');
  try { await document.fonts?.ready; } catch (e) { /* */ }
  const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;z-index:-1'; host.innerHTML = `<style>${CSS}</style>`; document.body.append(host);
  const pages = [];
  try {
    for (let i = 0; i < sids.length; i++) {
      const d = dossier(c, sids[i]);
      for (const html of pagesHTML(d)) {
        const box = document.createElement('div'); box.innerHTML = html; host.append(box);
        const cv = await window.html2canvas(box.firstElementChild, { scale: sids.length > 1 ? 1.4 : 2, backgroundColor: '#ffffff', logging: false });
        pages.push(await canvasToJpegPage(cv, sids.length > 1 ? .78 : .9)); box.remove();
      }
      onProgress?.((i + 1) / sids.length);
    }
  } finally { host.remove(); }
  return jpegPagesToPdf(pages);
}
export const fileName = (c, u) => `Phieu_bao_cao_GHK1_${(u?.name || 'hoc_sinh').replace(/\s+/g, '_')}_${c.name.replace(/\s+/g, '')}.pdf`;

// Phân tích: kết quả kiểm tra, độ khó/độ phân biệt, tiến trình học, việc cần làm, nhận xét theo TT 22
import { allQ, qOf, MODULES, MOD, ERR, OBJ, gradeItem } from './qbank.js';
import { students } from './data.js';
import { studentSummary, STRATEGIES } from '../../app/analytics.js';
import { avg, DAY } from './util.js';

// ---------- kết quả bài kiểm tra ----------
export function finalSub(c, tid, sid) { return c.subs.filter(s => s.tid === tid && s.uid === sid && s.end).sort((a, b) => b.end - a.end)[0] || null; }
export function testResults(c, t) {
  const Q = allQ(c).byId;
  const rows = students(c).map(s => {
    let per = null, done = false, blur = 0, pending = 0, sub = null;
    if (t.kind === 'paper') { if (t.scores?.[s.id]) { per = t.scores[s.id].map(v => v == null || v === '' ? null : +v); done = per.some(v => v != null); } }
    else {
      sub = finalSub(c, t.id, s.id);
      if (sub) { done = true; blur = sub.blur || 0; per = t.items.map(it => { if (it.t === 'tlu') { const v = sub.essay?.[it.qid]; if (v == null) pending++; return v ?? null; } return gradeItem(Q[it.qid], sub.answers[it.qid], it.pts).score; /* luôn chấm lại từ câu trả lời */ }); }
    }
    const tot = t.totals?.[s.id] != null ? +t.totals[s.id] : per ? +per.reduce((a, v) => a + (v || 0), 0).toFixed(2) : null;
    const max = t.items.reduce((a, it) => a + it.pts, 0) || 10;
    return { sid: s.id, name: s.name, per, done: done || t.totals?.[s.id] != null, total: tot, score10: tot == null ? null : +(tot / max * 10).toFixed(2), blur, pending, sub };
  });
  return { rows, max: t.items.reduce((a, it) => a + it.pts, 0) || 10 };
}

export function itemStats(c, t, res = testResults(c, t)) {
  const done = res.rows.filter(r => r.per); if (!done.length) return [];
  const sorted = done.slice().sort((a, b) => b.total - a.total); const k = Math.max(1, Math.round(sorted.length * .27));
  const hi = sorted.slice(0, k), lo = sorted.slice(-k);
  return t.items.map((it, i) => {
    const q = qOf(c, it.qid) || (it.o ? { o: it.o, t: it.t, q: '' } : null); const vals = done.map(r => r.per[i]).filter(v => v != null);
    const p = vals.length ? avg(vals) / it.pts : null;
    const ph = avg(hi.map(r => (r.per[i] || 0) / it.pts)), pl = avg(lo.map(r => (r.per[i] || 0) / it.pts));
    const dist = [0, 0, 0, 0];
    if (it.t === 'mc') done.forEach(r => { const a = r.sub?.answers?.[it.qid]; if (a != null) dist[a]++; });
    return { i, it, q, p, d: ph - pl, n: vals.length, dist };
  });
}
export const diffLabel = p => p == null ? '–' : p >= .8 ? 'Dễ' : p >= .5 ? 'Vừa' : p >= .3 ? 'Khó' : 'Rất khó';
export const discLabel = d => d == null ? '–' : d >= .4 ? 'Tốt' : d >= .2 ? 'Đạt' : d >= 0 ? 'Thấp' : 'Cần xem lại';

// điểm theo mục tiêu cho từng HS trong một bài
export function objectiveScores(c, t, row) {
  const by = {}; if (!row.per) return by;
  t.items.forEach((it, i) => { const q = qOf(c, it.qid) || (it.o ? { o: it.o } : null); if (!q || row.per[i] == null) return; const o = by[q.o] ||= { got: 0, max: 0 }; o.got += row.per[i]; o.max += it.pts; });
  return by;
}
// nhiệm vụ cải thiện: mục tiêu < 50% trong bài đã công bố; xong khi làm đúng ≥ 2 câu luyện tập mục tiêu đó sau ngày kiểm tra
export function remedies(c, sid) {
  const out = [];
  c.tests.filter(t => t.released && t.status !== 'draft').forEach(t => {
    const row = testResults(c, t).rows.find(r => r.sid === sid); if (!row?.per) return;
    Object.entries(objectiveScores(c, t, row)).forEach(([o, v]) => {
      if (v.got / v.max >= .5) return;
      const after = c.attempts.filter(a => a.s === sid && a.o === o && a.ts > (t.date || t.created) && a.correct).length;
      out.push({ tid: t.id, test: t.title, o, frac: v.got / v.max, done: after >= 2, progress: Math.min(after, 2), module: allQ(c).find(q => q.o === o)?.m || null, date: t.date });
    });
  });
  return out;
}

// ---------- tiến trình mô-đun ----------
export function moduleProgress(c, sid, code) {
  const ev = c.events.filter(e => e.s === sid && e.m === code); const at = c.attempts.filter(a => a.s === sid && a.m === code);
  const steps = new Set(ev.filter(e => e.type === 'step').map(e => e.payload?.step)).size;
  const complete = ev.some(e => e.type === 'module_complete');
  const explore = complete ? 1 : Math.min(1, steps / 5);
  const qs = allQ(c).filter(q => q.m === code && q.t === 'mc'); const okSet = new Set(at.filter(a => a.correct).map(a => a.q));
  const practice = qs.length ? okSet.size / qs.length : 0;
  const pct = .4 * explore + .6 * practice;
  return { code, explore, practice, pct, steps, nq: qs.length, nok: okSet.size, started: ev.length + at.length > 0, done: pct >= .8, last: Math.max(0, ...ev.map(e => e.ts), ...at.map(a => a.ts)) };
}
export function progress(c, sid) {
  const mods = MODULES.map(m => ({ ...m, st: c.modules[m.code] || { state: 'locked' }, pr: moduleProgress(c, sid, m.code) }));
  const avail = mods.filter(m => m.st.state !== 'locked');
  return { mods, avail, pctAvail: avail.length ? avg(avail.map(m => m.pr.pct)) : 0, pctYear: avg(mods.map(m => m.pr.pct)), nDone: mods.filter(m => m.pr.done).length };
}

// ---------- việc cần làm của HS ----------
export function todos(c, sid, now = Date.now()) {
  const list = [];
  const P = progress(c, sid);
  P.mods.filter(m => m.st.state === 'open' && !m.pr.done).forEach(m => list.push({ kind: 'module', code: m.code, title: `${m.bai}: ${m.title}`, sub: `Đã hoàn thành ${Math.round(m.pr.pct * 100)}% · khám phá ${Math.round(m.pr.explore * 100)}% · luyện tập ${m.pr.nok}/${m.pr.nq} câu`, due: m.st.due, pct: m.pr.pct }));
  c.tests.filter(t => t.kind === 'online' && t.status === 'open').forEach(t => { if (!finalSub(c, t.id, sid)) list.push({ kind: 'test', tid: t.id, title: t.title, sub: `${t.items.length} câu · ${t.duration} phút`, due: t.due }); });
  remedies(c, sid).filter(r => !r.done).forEach(r => list.push({ kind: 'remedy', o: r.o, module: r.module, title: `Cải thiện mục tiêu ${r.o}`, sub: `Sau “${r.test}”: làm đúng thêm ${2 - r.progress} câu luyện tập`, due: (r.date || now) + 7 * DAY, tid: r.tid }));
  P.mods.filter(m => m.st.state === 'review' && !m.pr.done).slice(0, 2).forEach(m => list.push({ kind: 'review', code: m.code, title: `Ôn lại ${m.bai}: ${m.title}`, sub: `Mới hoàn thành ${Math.round(m.pr.pct * 100)}%`, due: null, optional: true }));
  return list.sort((a, b) => (a.optional ? 1 : 0) - (b.optional ? 1 : 0) || (a.due || 9e15) - (b.due || 9e15));
}

// ---------- điểm theo TT 22 ----------
export function gradebook(c, sid, { released = false } = {}) {
  const tests = c.tests.filter(t => t.status !== 'draft' && (released ? (t.released || t.opts?.show === 'now') : (t.kind === 'paper' || t.released || t.status === 'closed')));
  const marks = tests.map(t => { const row = testResults(c, t).rows.find(r => r.sid === sid); return { t, score: row?.score10 ?? null }; }).filter(m => m.score != null);
  const tx = marks.filter(m => m.t.cat === 'tx'), gk = marks.find(m => m.t.cat === 'gk'), ck = marks.find(m => m.t.cat === 'ck');
  const num = tx.reduce((a, m) => a + m.score, 0) + (gk ? 2 * gk.score : 0) + (ck ? 3 * ck.score : 0);
  const den = tx.length + (gk ? 2 : 0) + (ck ? 3 : 0);
  const dtb = den ? +(num / den).toFixed(1) : null;
  return { marks, tx, gk, ck, dtb, final: !!(gk && ck), level: levelOf(dtb) };
}
export const levelOf = v => v == null ? null : v >= 8 ? 'Tốt' : v >= 6.5 ? 'Khá' : v >= 5 ? 'Đạt' : 'Chưa đạt';
export const levelCls = l => ({ 'Tốt': 'p-good', 'Khá': 'p-info', 'Đạt': 'p-warn', 'Chưa đạt': 'p-bad' }[l] || 'p-lock');

// ---------- nhận xét tự sinh (GV sửa trước khi lưu) ----------
export function draftComment(c, sid, view) {
  const sum = studentSummary(view, sid); const gb = gradebook(c, sid); const P = progress(c, sid);
  const parts = [];
  const trend = gb.marks.length >= 2 ? gb.marks[gb.marks.length - 1].score - gb.marks[0].score : 0;
  const good = Object.entries(sum.mastery).filter(([, v]) => v.score >= .8 && v.n >= 2).map(([o]) => o);
  const goodMods = [...new Set(good.map(o => allQ(c).find(q => q.o === o)?.m).filter(Boolean))].map(m => MOD[m]?.title.toLowerCase()).slice(0, 2);
  // ưu điểm
  const pos = [];
  if (sum.days14 >= 6) pos.push('học tập đều đặn, chủ động');
  if (P.pctAvail >= .8) pos.push('hoàn thành tốt các mô-đun được giao');
  if (!sum.flags.some(f => f.id === 'skip') && sum.nEvents > 20) pos.push('tích cực khám phá học liệu 3D');
  if (trend >= 1) pos.push('có tiến bộ rõ về điểm kiểm tra');
  if (goodMods.length) pos.push('nắm vững kiến thức về ' + goodMods.join(', '));
  parts.push(pos.length ? 'Em ' + pos.join('; ') + '.' : 'Em có tham gia các hoạt động học tập trên lớp học số.');
  // hạn chế
  const neg = [];
  const errTop = Object.entries(sum.errs).sort((a, b) => b[1] - a[1])[0];
  if (errTop && errTop[1] >= 3) neg.push('còn nhầm lẫn: ' + (ERR[errTop[0]]?.[0] || '').toLowerCase());
  sum.flags.filter(f => ['cram', 'guess', 'retry', 'irregular'].includes(f.id)).slice(0, 1).forEach(f => neg.push(f.title.toLowerCase()));
  if (P.avail.some(m => m.st.state === 'open' && !m.pr.started)) neg.push('chưa bắt đầu mô-đun đang mở');
  if (neg.length) parts.push('Cần khắc phục: ' + neg.join('; ') + '.');
  // đề nghị
  const f = sum.flags[0]; if (f) parts.push('Đề nghị: ' + STRATEGIES[f.strategy].name.toLowerCase() + ' – ' + STRATEGIES[f.strategy].how.charAt(0).toLowerCase() + STRATEGIES[f.strategy].how.slice(1));
  else if (sum.weak.length) parts.push(`Đề nghị: ôn lại mục tiêu ${sum.weak[0].o} bằng mô hình 3D và làm thêm câu luyện tập.`);
  return { text: parts.join(' '), level: gb.level, dtb: gb.dtb, sum, gb };
}

// ---------- tóm tắt cho phụ huynh ----------
export function parentReport(c, sid, view) {
  const d = draftComment(c, sid, view); const P = progress(c, sid); const T = todos(c, sid);
  return { ...d, P, T, note: c.notes[sid] };
}
export { OBJ };

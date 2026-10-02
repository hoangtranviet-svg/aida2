// Ngân hàng câu hỏi hợp nhất + chấm điểm + sinh đề theo ma trận (CV 7991)
import { BANK, ERR, MODULES } from '../../app/bank.js';
import { EXTRA, LEVEL, LEVEL_NAME, TYPE_NAME } from '../../app/bank2.js';
import { OBJ, CHAP } from '../../app/objectives.js';
import { toNum } from './util.js';
export { ERR, MODULES, LEVEL_NAME, TYPE_NAME, OBJ, CHAP };

export const MOD = Object.fromEntries(MODULES.map(m => [m.code, m]));
const BASE = [...BANK.map(q => ({ ...q, t: 'mc', lv: LEVEL[q.id], src: 'bank' })), ...EXTRA.map(q => ({ ...q, src: 'bank' }))];

let cacheKey = null, cache = null;
// Danh sách câu hỏi của một lớp = ngân hàng chung + câu GV tự thêm, áp mức độ GV chỉnh
export function allQ(cls) {
  const key = cls ? (cls.id || '') + ':' + (cls.questions?.length || 0) + ':' + JSON.stringify(cls.levels || {}) + ':' + (cls.qv || 0) : 'base';
  if (key === cacheKey && cache) return cache;
  const ov = cls?.levels || {};
  const list = [...BASE, ...(cls?.questions || []).map(q => ({ ...q, src: 'custom' }))].map(q => ov[q.id] ? { ...q, lv: ov[q.id] } : q);
  cacheKey = key; cache = list; cache.byId = Object.fromEntries(list.map(q => [q.id, q]));
  return cache;
}
export const qOf = (cls, id) => allQ(cls).byId[id];

// ---- chấm ----
export const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9 ,.\-]/g, ' ').replace(/\s+/g, ' ');
export const DS_RULE = [0, 0.1, 0.25, 0.5, 1]; // số ý đúng 0..4 → tỉ lệ điểm (theo quy định chấm câu Đúng/Sai)

export function gradeItem(q, ans, pts) {
  if (!q) return { score: 0, max: pts, state: 'none' };
  if (ans == null || ans === '' || (Array.isArray(ans) && ans.every(v => v == null))) return { score: 0, max: pts, state: 'blank', correct: false };
  if (q.t === 'mc') { const ok = +ans === q.k; return { score: ok ? pts : 0, max: pts, correct: ok, state: ok ? 'ok' : 'wrong', err: ok ? null : q.e?.[+ans] }; }
  if (q.t === 'ds') {
    const right = q.k.map((v, i) => ans[i] != null && ans[i] === v); const n = right.filter(Boolean).length;
    const errs = q.k.map((v, i) => (ans[i] != null && ans[i] !== v) ? q.e?.[i] : null).filter(Boolean);
    return { score: +(pts * DS_RULE[n]).toFixed(3), max: pts, correct: n === 4, nRight: n, right, state: n === 4 ? 'ok' : n ? 'part' : 'wrong', err: errs[0] || null };
  }
  if (q.t === 'tln') {
    const a = toNum(ans), k = toNum(q.k); const ok = a != null && k != null && Math.abs(a - k) <= (q.tol || 0) + 1e-9;
    return { score: ok ? pts : 0, max: pts, correct: ok, state: ok ? 'ok' : 'wrong', err: ok ? null : 'E27' };
  }
  return { score: null, max: pts, state: 'essay' }; // tự luận: GV chấm
}

// gợi ý điểm tự luận theo các ý trong đáp án (so khớp từ khoá, không dấu)
export function suggestEssay(q, text, pts) {
  const t = ' ' + norm(text) + ' '; const tot = q.rubric.reduce((a, r) => a + r.p, 0) || 1;
  const parts = q.rubric.map(r => { const hit = (r.kw || []).filter(k => t.includes(' ' + norm(k).trim()) || t.includes(norm(k).trim())); const need = Math.min(2, Math.max(1, Math.ceil((r.kw || []).length / 3))); const got = hit.length >= need ? 1 : hit.length ? .5 : 0; return { d: r.d, p: r.p, got, hit }; });
  const raw = parts.reduce((a, x) => a + x.p * x.got, 0) / tot * pts;
  return { score: Math.round(raw * 4) / 4, parts };
}

// ---- mẫu đề ----
export const TEMPLATES = {
  kt45: { name: 'Kiểm tra định kì 45 phút (CV 7991)', duration: 45, parts: [{ t: 'mc', n: 12, pts: 0.25 }, { t: 'ds', n: 2, pts: 1 }, { t: 'tln', n: 4, pts: 0.5 }, { t: 'tlu', n: 2, pts: 1.5 }], levels: { B: .4, H: .3, V: .3 } },
  tn50: { name: 'Cấu trúc thi tốt nghiệp THPT (50 phút)', duration: 50, parts: [{ t: 'mc', n: 18, pts: 0.25 }, { t: 'ds', n: 4, pts: 1 }, { t: 'tln', n: 6, pts: 0.25 }], levels: { B: .4, H: .3, V: .3 } },
  kt15: { name: 'Kiểm tra 15 phút', duration: 15, parts: [{ t: 'mc', n: 8, pts: 0.5 }, { t: 'ds', n: 1, pts: 2 }, { t: 'tln', n: 2, pts: 2 }], levels: { B: .5, H: .3, V: .2 } },
  luyen: { name: 'Bài luyện tập (không tính điểm)', duration: 20, parts: [{ t: 'mc', n: 10, pts: 0.6 }, { t: 'ds', n: 2, pts: 1 }, { t: 'tln', n: 2, pts: 1 }], levels: { B: .4, H: .4, V: .2 } },
};
export const PART_NAME = { mc: 'PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn', ds: 'PHẦN II. Câu trắc nghiệm đúng sai', tln: 'PHẦN III. Câu trắc nghiệm trả lời ngắn', tlu: 'PHẦN IV. Tự luận' };

function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647) / 2147483647; }
const shuffle = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };


// Sinh đề: phân mức độ theo tỉ lệ ĐIỂM (như ma trận CV 7991), chọn câu trải đều các mục tiêu.
// Phần có điểm/câu lớn được xếp mức trước; mỗi câu nhận mức đang thiếu điểm nhiều nhất mà còn câu phù hợp.
export function generate(cls, { template = 'kt45', modules, seed = Date.now(), levels } = {}) {
  const T = TEMPLATES[template]; const lv = levels || T.levels; const r = rng(seed);
  const pool = allQ(cls).filter(q => !modules?.length || modules.includes(q.m));
  const totalPts = T.parts.reduce((a, p) => a + p.n * p.pts, 0);
  const need = { B: totalPts * (lv.B || 0), H: totalPts * (lv.H || 0), V: totalPts * (lv.V || 0) };
  const usedObj = {}; const picked = new Set(); const warn = []; const byPart = {};
  const parts = T.parts.map((p, i) => ({ ...p, i })).sort((a, b) => b.pts - a.pts);
  for (const part of parts) {
    const cand = shuffle(pool.filter(q => q.t === part.t), r); const got = [];
    for (let k = 0; k < part.n; k++) {
      const order = ['B', 'H', 'V'].sort((a, b) => need[b] - need[a]);
      let q = null;
      for (const l of order) { q = cand.filter(x => x.lv === l && !picked.has(x.id)).sort((a, b) => (usedObj[a.o] || 0) - (usedObj[b.o] || 0))[0]; if (q) break; }
      if (!q) break;
      picked.add(q.id); usedObj[q.o] = (usedObj[q.o] || 0) + 1; need[q.lv] -= part.pts; got.push(q);
    }
    if (got.length < part.n) warn.push(`${TYPE_NAME[part.t]}: thiếu ${part.n - got.length} câu trong phạm vi đã chọn`);
    const lo = ['B', 'H', 'V']; got.sort((a, b) => a.m.localeCompare(b.m) || lo.indexOf(a.lv) - lo.indexOf(b.lv));
    byPart[part.i] = got.map(q => ({ qid: q.id, t: q.t, pts: part.pts }));
  }
  const items = T.parts.flatMap((_, i) => byPart[i] || []);
  return { items, warn, template, duration: T.duration };
}

export const total = items => +items.reduce((a, it) => a + it.pts, 0).toFixed(2);

// Ma trận đề: hàng = bài/chủ đề, cột = dạng câu × mức độ
export function matrix(cls, items) {
  const rows = {}; const cols = ['mc', 'ds', 'tln', 'tlu'];
  items.forEach(it => {
    const q = qOf(cls, it.qid); if (!q) return; const key = q.m;
    const r = rows[key] ||= { m: q.m, cells: {}, pts: 0, objs: new Set() };
    const c = r.cells[it.t + q.lv] ||= { n: 0, pts: 0 }; c.n++; c.pts += it.pts; r.pts += it.pts; r.objs.add(q.o);
  });
  const list = Object.values(rows).sort((a, b) => a.m.localeCompare(b.m));
  const totals = {}; list.forEach(r => Object.entries(r.cells).forEach(([k, c]) => { const t = totals[k] ||= { n: 0, pts: 0 }; t.n += c.n; t.pts += c.pts; }));
  const byLv = { B: 0, H: 0, V: 0 }; Object.entries(totals).forEach(([k, c]) => (byLv[k.slice(-1)] += c.pts));
  return { rows: list, totals, byLv, cols, sum: total(items) };
}

// Mã đề: hoán vị câu trong từng phần và phương án trong câu nhiều lựa chọn
export function makeVariants(items, n = 4, seed = 7991) {
  const out = [];
  for (let v = 0; v < n; v++) {
    const r = rng(seed + v * 101); const order = [];
    ['mc', 'ds', 'tln', 'tlu'].forEach(t => { const idx = items.map((it, i) => [it, i]).filter(([it]) => it.t === t).map(([, i]) => i); order.push(...(v === 0 ? idx : shuffle(idx, r))); });
    const perm = {}; items.forEach((it, i) => { if (it.t === 'mc') perm[i] = v === 0 ? [0, 1, 2, 3] : shuffle([0, 1, 2, 3], r); });
    out.push({ code: String(101 + v), order, perm });
  }
  return out;
}

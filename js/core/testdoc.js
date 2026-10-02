// Xuất đề kiểm tra ra Word: đề theo từng mã, đáp án – hướng dẫn chấm, ma trận và bản đặc tả
import { buildDocx, toBlob } from '../lib/office.js';
import { qOf, matrix, MOD, OBJ, LEVEL_NAME, TYPE_NAME, PART_NAME } from './qbank.js';
import { n2 } from './util.js';

const CAT = { tx: 'KIỂM TRA THƯỜNG XUYÊN', gk: 'KIỂM TRA GIỮA HỌC KÌ', ck: 'KIỂM TRA CUỐI HỌC KÌ' };

function header(c, t, code) {
  return { twoCol: [[{ text: 'TRƯỜNG ……………………………\n', b: false }, { text: (c.name || '').toUpperCase(), b: true }, { text: '\n(Đề có ' + t.items.length + ' câu)', i: true }],
    [{ text: (CAT[t.cat] || 'KIỂM TRA') + '\n', b: true }, { text: 'Môn: ĐỊA LÍ 10 – Năm học ' + (c.year || '') + '\n', b: true }, { text: `Thời gian làm bài: ${t.duration || 45} phút, không kể thời gian phát đề`, i: true }]] };
}

export function variantItems(t, v) { return v ? v.order.map(i => ({ ...t.items[i], perm: v.perm[i] || null, src: i })) : t.items.map((it, i) => ({ ...it, src: i })); }

function examBlocks(c, t, v) {
  const B = [header(c, t, v?.code), { p: 'Họ và tên: ………………………………………………… Lớp: …………… ' + (v ? `Mã đề: ${v.code}` : ''), align: 'left' }];
  const list = variantItems(t, v); let no = 0;
  ['mc', 'ds', 'tln', 'tlu'].forEach(type => {
    const its = list.filter(it => it.t === type); if (!its.length) return;
    const pts = its[0].pts; const sumP = its.reduce((a, it) => a + it.pts, 0);
    B.push({ p: [{ text: PART_NAME[type] + '. ', b: true }, { text: type === 'mc' ? `Thí sinh trả lời từ câu 1 đến câu ${its.length}. Mỗi câu chỉ chọn một phương án (${n2(pts)} điểm/câu).` : type === 'ds' ? `Thí sinh trả lời từ câu 1 đến câu ${its.length}. Trong mỗi ý a), b), c), d) ở mỗi câu, chọn đúng hoặc sai.` : type === 'tln' ? `Thí sinh trả lời từ câu 1 đến câu ${its.length} (${n2(pts)} điểm/câu).` : `(${n2(sumP)} điểm)` }], spaceAfter: 6 });
    let k = 0;
    its.forEach(it => {
      const q = qOf(c, it.qid); if (!q) return; k++; no++;
      B.push({ p: [{ text: `Câu ${k}. `, b: true }, { text: q.q + (type === 'tlu' ? ` (${n2(it.pts)} điểm)` : '') }], align: 'both' });
      if (type === 'mc') { const order = it.perm || [0, 1, 2, 3]; const opts = order.map((oi, j) => `${'ABCD'[j]}. ${q.a[oi]}`); const long = opts.some(o => o.length > 38);
        if (long) opts.forEach(o => B.push({ p: o, indent: 0.6 })); else B.push({ table: [opts.slice(0, 2), opts.slice(2)], widths: [8.5, 8.5], border: false }); }
      if (type === 'ds') q.st.forEach((s, i) => B.push({ p: `${'abcd'[i]}) ${s}`, indent: 0.6 }));
    });
  });
  B.push({ p: [{ text: '------ HẾT ------', b: true }], align: 'center' });
  return B;
}

function keyBlocks(c, t, v) {
  const list = variantItems(t, v); const B = [{ h: 2, text: `ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM${v ? ' – MÃ ĐỀ ' + v.code : ''}` }];
  ['mc', 'ds', 'tln', 'tlu'].forEach(type => {
    const its = list.filter(it => it.t === type); if (!its.length) return;
    B.push({ p: [{ text: PART_NAME[type], b: true }] });
    if (type === 'mc') { const row1 = ['Câu'], row2 = ['Đáp án']; its.forEach((it, k) => { const q = qOf(c, it.qid); const order = it.perm || [0, 1, 2, 3]; row1.push(String(k + 1)); row2.push('ABCD'[order.indexOf(q.k)]); });
      for (let s = 0; s < row1.length - 1; s += 12) B.push({ table: [[row1[0], ...row1.slice(1 + s, 13 + s)], [row2[0], ...row2.slice(1 + s, 13 + s)]], header: true, border: true }); }
    if (type === 'ds') { B.push({ table: [['Câu', 'a)', 'b)', 'c)', 'd)'], ...its.map((it, k) => { const q = qOf(c, it.qid); return [String(k + 1), ...q.k.map(x => x ? 'Đ' : 'S')]; })], header: true, border: true });
      B.push({ p: [{ text: 'Mỗi câu: đúng 1 ý được 0,1 điểm; 2 ý 0,25 điểm; 3 ý 0,5 điểm; 4 ý 1 điểm (nhân hệ số theo điểm câu).', i: true }] }); }
    if (type === 'tln') B.push({ table: [['Câu', 'Đáp án', 'Đơn vị'], ...its.map((it, k) => { const q = qOf(c, it.qid); return [String(k + 1), q.k, q.unit || '']; })], header: true, border: true });
    if (type === 'tlu') its.forEach((it, k) => { const q = qOf(c, it.qid); const tot = q.rubric.reduce((a, r) => a + r.p, 0); B.push({ p: [{ text: `Câu ${k + 1} (${n2(it.pts)} điểm)`, b: true }] }); B.push({ table: [['Nội dung', 'Điểm'], ...q.rubric.map(r => [r.d, n2(r.p / tot * it.pts)])], widths: [14, 3], header: true, border: true }); });
  });
  return B;
}

function matrixBlocks(c, t) {
  const M = matrix(c, t.items); const types = ['mc', 'ds', 'tln', 'tlu'].filter(ty => t.items.some(it => it.t === ty));
  const head = ['TT', 'Bài / nội dung', ...types.flatMap(ty => ['B', 'H', 'V'].map(l => `${TYPE_NAME[ty]} – ${LEVEL_NAME[l]}`)), 'Điểm'];
  const rows = M.rows.map((r, i) => [String(i + 1), `${MOD[r.m]?.bai}: ${MOD[r.m]?.title}`, ...types.flatMap(ty => ['B', 'H', 'V'].map(l => r.cells[ty + l]?.n ? String(r.cells[ty + l].n) : '')), n2(r.pts)]);
  const tot = ['', 'Tổng số câu', ...types.flatMap(ty => ['B', 'H', 'V'].map(l => M.totals[ty + l]?.n ? String(M.totals[ty + l].n) : '')), n2(M.sum)];
  const B = [{ h: 2, text: 'MA TRẬN ĐỀ KIỂM TRA (theo Công văn 7991/BGDĐT-GDTrH)' }, { table: [head, ...rows, tot], header: true, border: true, widths: [0.8, 3.6, ...types.flatMap(() => Array(3).fill((17 - 0.8 - 3.6 - 1.2) / (types.length * 3))), 1.2] }];
  B.push({ p: `Tỉ lệ điểm: Biết ${n2(M.byLv.B)} điểm (${Math.round(M.byLv.B / M.sum * 100)}%) · Hiểu ${n2(M.byLv.H)} điểm (${Math.round(M.byLv.H / M.sum * 100)}%) · Vận dụng ${n2(M.byLv.V)} điểm (${Math.round(M.byLv.V / M.sum * 100)}%).` });
  B.push({ h: 2, text: 'BẢN ĐẶC TẢ ĐỀ KIỂM TRA' });
  const spec = {}; t.items.forEach((it, i) => { const q = qOf(c, it.qid); const s = spec[q.o] ||= { o: q.o, m: q.m, n: { B: [], H: [], V: [] } }; s.n[q.lv].push(`${TYPE_NAME[it.t]} câu ${i + 1}`); });
  B.push({ table: [['Mã mục tiêu', 'Yêu cầu cần đạt', 'Biết', 'Hiểu', 'Vận dụng'], ...Object.values(spec).sort((a, b) => a.o.localeCompare(b.o)).map(s => [s.o, OBJ[s.o] || '', s.n.B.length ? String(s.n.B.length) : '', s.n.H.length ? String(s.n.H.length) : '', s.n.V.length ? String(s.n.V.length) : ''])], widths: [2.8, 9.4, 1.6, 1.6, 1.6], header: true, border: true });
  return B;
}

export function testDocx(c, t, { variants = true, key = true, mat = true } = {}) {
  const vs = variants && t.variants?.length ? t.variants : [null]; const blocks = [];
  vs.forEach((v, i) => { if (i) blocks.push({ pageBreak: true }); blocks.push(...examBlocks(c, t, v)); });
  if (key) vs.forEach(v => { blocks.push({ pageBreak: true }); blocks.push(...keyBlocks(c, t, v)); });
  if (mat) { blocks.push({ pageBreak: true }); blocks.push(...matrixBlocks(c, t)); }
  return toBlob(buildDocx({ title: t.title, blocks }), 'docx');
}

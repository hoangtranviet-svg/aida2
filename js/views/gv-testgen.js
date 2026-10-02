// GV · Tạo đề tự động theo ma trận (CV 7991)
import * as D from '../core/data.js';
import { $, esc, n2, toast, modal, uid, saveFile, DAY } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MODULES, MOD, TEMPLATES, TYPE_NAME, LEVEL_NAME, generate, matrix, makeVariants, qOf, allQ, total } from '../core/qbank.js';
import { testDocx } from '../core/testdoc.js';
import { lvChip, objChip, qHTML } from './parts.js';

let S = null; // trạng thái soạn đề (giữ khi chuyển trang)
const fresh = c => ({ title: 'Kiểm tra giữa học kì I', cat: 'gk', template: 'kt45', modules: MODULES.filter(m => c.modules[m.code]?.state !== 'locked').map(m => m.code), lv: { B: 40, H: 30, V: 30 }, nv: 4, kind: 'paper', result: null, seed: 1 });
const toLocal = ts => new Date(ts - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16);

export default {
  title: 'Tạo đề tự động',
  onData: () => false,
  render(el, ctx) {
    const c = D.cls(); S ||= fresh(c); if (!S.modules.length) S.modules = MODULES.slice(0, 8).map(m => m.code);
    const T = TEMPLATES[S.template]; const chaps = [...new Set(MODULES.map(m => m.chap))];
    el.innerHTML = `<div class="lead"><p>Chọn phạm vi và tỉ lệ mức độ; hệ thống lập ma trận, chọn câu trải đều các mục tiêu, trộn mã đề và xuất Word kèm đáp án, ma trận, bản đặc tả.</p></div>
    <div class="grid" style="grid-template-columns:minmax(0,380px) minmax(0,1fr);align-items:start" id="gg">
      <div class="card stack" style="gap:14px">
        <label class="field"><span>Tên bài kiểm tra</span><input class="inp" id="title" value="${esc(S.title)}"></label>
        <div class="field"><span>Loại đánh giá</span><div class="seg" id="cat">${[['tx', 'Thường xuyên'], ['gk', 'Giữa kì'], ['ck', 'Cuối kì']].map(([k, v]) => `<button type="button" data-v="${k}" class="${S.cat === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
        <label class="field"><span>Cấu trúc đề</span><select class="inp" id="tpl">${Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}" ${S.template === k ? 'selected' : ''}>${t.name}</option>`).join('')}</select>
          <small>${T.parts.map(p => `${TYPE_NAME[p.t]}: ${p.n} câu × ${n2(p.pts)} đ`).join(' · ')} · ${T.duration} phút</small></label>
        <div class="field"><span>Phạm vi kiến thức (${S.modules.length} bài)</span>
          <div class="row" style="gap:6px"><button class="btn sm" id="allOpen" type="button">Các bài đã mở</button><button class="btn sm ghost" id="none" type="button">Bỏ chọn</button></div>
          ${chaps.map(ch => `<div style="margin-top:6px"><div class="muted" style="font-size:11.5px;font-weight:600">${esc(ch)}</div><div class="row" style="gap:6px;margin-top:4px">${MODULES.filter(m => m.chap === ch).map(m => `<button type="button" class="btn sm ${S.modules.includes(m.code) ? 'pri' : ''}" data-mod="${m.code}" data-tip="${esc(m.title)}">${m.bai}</button>`).join('')}</div></div>`).join('')}</div>
        <div class="field"><span>Tỉ lệ mức độ (%)</span><div class="row" style="gap:8px;flex-wrap:nowrap">${['B', 'H', 'V'].map(l => `<label class="row" style="gap:6px;flex:1;flex-wrap:nowrap">${lvChip(l)}<input class="inp sm mono" type="number" min="0" max="100" step="5" data-lv="${l}" value="${S.lv[l]}"></label>`).join('')}</div><small id="lvsum"></small></div>
        <div class="row"><label class="field" style="flex:1"><span>Số mã đề</span><input class="inp" type="number" min="1" max="8" id="nv" value="${S.nv}"></label>
          <div class="field" style="flex:1.4"><span>Hình thức</span><div class="seg" id="kind">${[['paper', 'Bài giấy'], ['online', 'Trực tuyến']].map(([k, v]) => `<button type="button" data-v="${k}" class="${S.kind === k ? 'on' : ''}">${v}</button>`).join('')}</div></div></div>
        <button class="btn sun lg" id="gen">${ic('wand')} ${S.result ? 'Sinh lại đề' : 'Sinh đề'}</button>
      </div>
      <div id="out" class="stack" style="gap:16px">${S.result ? '' : `<div class="empty" style="min-height:420px;justify-content:center">${ic('wand')}<b>Chưa có đề</b><span>Chọn phạm vi bên trái rồi bấm “Sinh đề”.</span></div>`}</div>
    </div>`;
    const mq = matchMedia('(max-width:1000px)'); if (mq.matches) $('#gg').style.gridTemplateColumns = 'minmax(0,1fr)';
    const sumLv = () => { const s = S.lv.B + S.lv.H + S.lv.V; $('#lvsum').textContent = s === 100 ? 'Tổng 100%' : `Tổng ${s}% – cần bằng 100%`; $('#lvsum').style.color = s === 100 ? '' : 'var(--bad)'; return s; };
    sumLv();
    $('#title').oninput = e => (S.title = e.target.value);
    $('#cat').querySelectorAll('button').forEach(b => (b.onclick = () => { S.cat = b.dataset.v; ctx.refresh(); }));
    $('#kind').querySelectorAll('button').forEach(b => (b.onclick = () => { S.kind = b.dataset.v; ctx.refresh(); }));
    $('#tpl').onchange = e => { S.template = e.target.value; if (e.target.value === 'kt15') S.cat = 'tx'; S.lv = Object.fromEntries(Object.entries(TEMPLATES[S.template].levels).map(([k, v]) => [k, Math.round(v * 100)])); ctx.refresh(); };
    el.querySelectorAll('[data-mod]').forEach(b => (b.onclick = () => { const k = b.dataset.mod; S.modules = S.modules.includes(k) ? S.modules.filter(x => x !== k) : [...S.modules, k]; ctx.refresh(); }));
    $('#allOpen').onclick = () => { S.modules = MODULES.filter(m => c.modules[m.code]?.state !== 'locked').map(m => m.code); ctx.refresh(); };
    $('#none').onclick = () => { S.modules = []; ctx.refresh(); };
    el.querySelectorAll('[data-lv]').forEach(i => (i.oninput = () => { S.lv[i.dataset.lv] = +i.value || 0; sumLv(); }));
    $('#nv').oninput = e => (S.nv = Math.max(1, Math.min(8, +e.target.value || 1)));
    $('#gen').onclick = () => {
      if (!S.modules.length) { toast('Chọn ít nhất một bài', 'alert'); return; }
      if (sumLv() !== 100) { toast('Tỉ lệ mức độ cần cộng lại bằng 100%', 'alert'); return; }
      S.seed = Date.now() % 1e6; const g = generate(c, { template: S.template, modules: S.modules, seed: S.seed, levels: { B: S.lv.B / 100, H: S.lv.H / 100, V: S.lv.V / 100 } });
      S.result = { ...g, variants: makeVariants(g.items, S.nv, S.seed) }; ctx.refresh();
    };
    if (S.result) drawResult(c, $('#out'), ctx);
  },
};

function drawResult(c, out, ctx) {
  const R = S.result; const M = matrix(c, R.items); const types = ['mc', 'ds', 'tln', 'tlu'].filter(t => R.items.some(it => it.t === t));
  out.innerHTML = `${R.warn.length ? `<div class="note sun">${ic('alert')}<div>${R.warn.map(esc).join('<br>')}. Hãy mở rộng phạm vi bài hoặc bổ sung câu trong Ngân hàng câu hỏi.</div></div>` : ''}
    <div class="card"><div class="card-h"><div><h2>Ma trận đề</h2><p>${R.items.length} câu · ${n2(M.sum)} điểm · ${R.variants.length} mã đề (${R.variants.map(v => v.code).join(', ')})</p></div>
      <div class="row">${['B', 'H', 'V'].map(l => `<span class="tag">${LEVEL_NAME[l]} ${Math.round(M.byLv[l] / M.sum * 100)}%</span>`).join('')}</div></div>
      <div class="tbl-wrap"><table class="tbl" style="font-size:12.5px"><thead><tr><th>Bài</th>${types.map(t => `<th class="c" colspan="3">${TYPE_NAME[t]}</th>`).join('')}<th class="r">Điểm</th></tr>
        <tr><th></th>${types.map(() => ['B', 'H', 'V'].map(l => `<th class="c">${l}</th>`).join('')).join('')}<th></th></tr></thead>
        <tbody>${M.rows.map(r => `<tr><td><b>${MOD[r.m]?.bai}</b> <span class="muted">${esc(MOD[r.m]?.title || '')}</span></td>${types.map(t => ['B', 'H', 'V'].map(l => `<td class="c num">${r.cells[t + l]?.n || ''}</td>`).join('')).join('')}<td class="r num">${n2(r.pts)}</td></tr>`).join('')}
        <tr><td><b>Tổng</b></td>${types.map(t => ['B', 'H', 'V'].map(l => `<td class="c num"><b>${M.totals[t + l]?.n || ''}</b></td>`).join('')).join('')}<td class="r num"><b>${n2(M.sum)}</b></td></tr></tbody></table></div></div>
    <div class="card"><div class="card-h"><div><h2>Câu hỏi trong đề (mã ${R.variants[0].code})</h2><p>Bấm “Đổi” để thay bằng câu cùng dạng, cùng mức, cùng bài.</p></div></div>
      <div class="stack">${types.map(t => `<div class="eyebrow" style="margin-top:6px">${TYPE_NAME[t]}</div>` + R.items.map((it, i) => [it, i]).filter(([it]) => it.t === t).map(([it, i], k) => { const q = qOf(c, it.qid);
        return `<div class="row" style="flex-wrap:nowrap;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--line)"><b class="mono" style="width:28px">${k + 1}</b><div style="flex:1;min-width:0"><div class="row" style="gap:6px;margin-bottom:3px">${lvChip(q.lv)}${objChip(q.o)}<span class="muted mono" style="font-size:11px">${MOD[q.m]?.bai} · ${n2(it.pts)} đ</span></div><div style="font-size:13.5px">${esc(q.q.length > 200 ? q.q.slice(0, 200) + '…' : q.q)}</div></div>
          <button class="btn sm ghost" data-see="${i}">${ic('eye')}</button><button class="btn sm" data-swap="${i}">${ic('shuffle')} Đổi</button></div>`; }).join('')).join('')}</div></div>
    <div class="card row" style="position:sticky;bottom:12px;z-index:5;box-shadow:var(--shadow-lg)"><b style="flex:1;min-width:200px">${esc(S.title)}</b>
      <button class="btn" id="word">${ic('word')} Xuất Word</button><button class="btn" id="draft">${ic('file')} Lưu nháp</button>
      <button class="btn pri" id="assign">${S.kind === 'online' ? ic('play') + ' Giao trực tuyến' : ic('grade') + ' Lưu để nhập điểm'}</button></div>`;
  out.querySelectorAll('[data-swap]').forEach(b => (b.onclick = () => {
    const i = +b.dataset.swap; const it = R.items[i]; const q = qOf(c, it.qid); const used = new Set(R.items.map(x => x.qid));
    const alt = allQ(c).filter(x => x.t === q.t && x.lv === q.lv && x.m === q.m && !used.has(x.id)); const alt2 = alt.length ? alt : allQ(c).filter(x => x.t === q.t && x.lv === q.lv && S.modules.includes(x.m) && !used.has(x.id));
    if (!alt2.length) { toast('Không còn câu thay thế phù hợp', 'alert'); return; }
    it.qid = alt2[Math.floor(Math.random() * alt2.length)].id; ctx.refresh();
  }));
  out.querySelectorAll('[data-see]').forEach(b => (b.onclick = () => { const it = R.items[+b.dataset.see]; const q = qOf(c, it.qid); modal({ title: 'Xem câu hỏi', wide: true, body: qHTML(q, { no: +b.dataset.see + 1, pts: it.pts, mode: 'preview', showMeta: true, ans: q.t === 'tlu' ? '' : q.k }) }); }));
  const build = status => ({ id: uid('t'), title: S.title.trim() || 'Bài kiểm tra', cat: S.cat, kind: S.kind, template: S.template, created: Date.now(), date: Date.now(), status, duration: TEMPLATES[S.template].duration, items: R.items.map(x => ({ ...x })), variants: R.variants, opts: { shuffle: true, antiCheat: true, show: 'after' }, scores: {}, released: false });
  $('#word', out).onclick = () => { const t = build('draft'); saveFile(`${t.title.replace(/[\\/:*?"<>|]/g, '')}.docx`, testDocx(c, t)); };
  $('#draft', out).onclick = () => { D.act.saveTest(build('draft')); toast('Đã lưu nháp trong “Kiểm tra & chấm”', 'check'); S = null; ctx.go('gv-kiem-tra'); };
  $('#assign', out).onclick = () => {
    if (S.kind !== 'online') { const t = build('closed'); t.date = Date.now(); D.act.saveTest(t); toast('Đã lưu. Nhập điểm từng câu sau khi chấm bài giấy.', 'check'); S = null; ctx.go('gv-kiem-tra', { tid: t.id }); return; }
    const now = Date.now(); const m = modal({ title: 'Giao bài trực tuyến', body: `<div class="stack"><label class="field"><span>Mở từ</span><input class="inp" type="datetime-local" id="o" value="${toLocal(now)}"></label>
      <label class="field"><span>Hạn nộp</span><input class="inp" type="datetime-local" id="d" value="${toLocal(now + 2 * DAY)}"></label>
      <label class="field"><span>Thời gian làm bài (phút)</span><input class="inp" type="number" id="du" value="${TEMPLATES[S.template].duration}"></label>
      <label class="check"><input type="checkbox" id="ac" checked> Ghi lại số lần rời khỏi trang khi làm bài</label>
      <label class="check"><input type="checkbox" id="now"> Cho học sinh xem điểm ngay sau khi nộp</label></div>`, foot: `<button class="btn pri" id="go">${ic('play')} Giao bài</button>` });
    m.el.querySelector('#go').onclick = () => { const t = build('open'); t.open = new Date(m.el.querySelector('#o').value).getTime() || now; t.due = new Date(m.el.querySelector('#d').value).getTime() || now + 2 * DAY; t.date = t.open; t.duration = +m.el.querySelector('#du').value || t.duration; t.opts.antiCheat = m.el.querySelector('#ac').checked; t.opts.show = m.el.querySelector('#now').checked ? 'now' : 'after'; t.released = t.opts.show === 'now';
      D.act.saveTest(t); m.close(); toast('Đã giao bài cho cả lớp', 'check'); S = null; ctx.go('gv-kiem-tra', { tid: t.id }); };
  };
}

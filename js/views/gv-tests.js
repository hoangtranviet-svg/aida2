// GV · Kiểm tra & chấm: danh sách bài, quản lí bài trực tuyến, chấm tự luận, nhập điểm bài giấy
import * as D from '../core/data.js';
import { $, esc, n1, n2, dd, dtime, rel, toast, modal, uid, saveFile, toNum, getSample, hasAI, DAY } from '../core/util.js';
import { ic } from '../core/icons.js';
import { qOf, TYPE_NAME, OBJ, suggestEssay, makeVariants } from '../core/qbank.js';
import { testResults, finalSub } from '../core/insight.js';
import { testDocx } from '../core/testdoc.js';
import { qHTML, objChip, confirmInline } from './parts.js';

const CAT = { tx: 'Thường xuyên', gk: 'Giữa kì', ck: 'Cuối kì' };
const ST = { draft: ['Nháp', 'p-lock'], open: ['Đang mở', 'p-open'], closed: ['Đã đóng', 'p-info'] };
let tab = 'sum';

export default {
  title: p => p.tid ? 'Chi tiết bài kiểm tra' : 'Kiểm tra & chấm',
  onData: (why, local, p) => ['test', 'sub'].includes(why.type) && !(p.tid && local),
  render(el, ctx, p) { return p.tid ? detail(el, ctx, p.tid) : list(el, ctx); },
};

function list(el, ctx) {
  const c = D.cls(); const S = D.students(c);
  const tests = c.tests.slice().sort((a, b) => ({ open: 0, draft: 1, closed: 2 }[a.status] - { open: 0, draft: 1, closed: 2 }[b.status]) || (b.date || b.created) - (a.date || a.created));
  el.innerHTML = `<div class="lead"><p>Bài trực tuyến được chấm tự động (trắc nghiệm, đúng/sai, trả lời ngắn); câu tự luận có gợi ý điểm theo hướng dẫn chấm. Bài làm trên giấy: nhập điểm từng câu để phân tích theo mục tiêu.</p>
    <div class="acts"><button class="btn" id="quick">${ic('grade')} Nhập điểm bài giấy</button><a class="btn pri" href="#gv-tao-de">${ic('wand')} Tạo đề mới</a></div></div>
    ${tests.length ? `<div class="grid g3">${tests.map(t => { const R = testResults(c, t); const done = R.rows.filter(r => r.done).length; const pend = R.rows.reduce((a, r) => a + r.pending, 0); const avg = R.rows.filter(r => r.score10 != null); const A = avg.length ? avg.reduce((a, r) => a + r.score10, 0) / avg.length : null;
      return `<button class="card" style="text-align:left;display:flex;flex-direction:column;gap:10px;cursor:pointer" data-tid="${t.id}">
        <div class="row between"><span class="pill ${ST[t.status][1]}">${ST[t.status][0]}</span><span class="tag">${CAT[t.cat] || ''} · ${t.kind === 'online' ? 'Trực tuyến' : 'Bài giấy'}</span></div>
        <h3 style="font-size:16.5px">${esc(t.title)}</h3>
        <span class="muted" style="font-size:12.5px">${t.items.length} câu · ${t.duration || '–'} phút · ${t.status === 'open' && t.due ? 'hạn ' + dtime(t.due) : dd(t.date || t.created)}</span>
        <div class="row" style="margin-top:auto;gap:14px"><span><b class="num" style="font:650 20px var(--display)">${done}</b><span class="muted">/${S.length} ${t.kind === 'online' ? 'đã nộp' : 'có điểm'}</span></span>
          <span><b class="num" style="font:650 20px var(--display)">${n1(A)}</b><span class="muted"> điểm TB</span></span>${pend ? `<span class="pill p-warn">${pend} tự luận chờ chấm</span>` : ''}</div></button>`; }).join('')}</div>`
      : `<div class="empty">${ic('test')}<b>Chưa có bài kiểm tra</b><span>Tạo đề tự động hoặc nhập điểm một bài làm trên giấy.</span></div>`}`;
  el.querySelectorAll('[data-tid]').forEach(b => (b.onclick = () => { tab = 'sum'; ctx.go('gv-kiem-tra', { tid: b.dataset.tid }); }));
  $('#quick').onclick = () => quickPaper(ctx);
}

function quickPaper(ctx) {
  const c = D.cls();
  const m = modal({ title: 'Bài giấy – nhập điểm theo câu', body: `<div class="stack"><label class="field"><span>Tên bài</span><input class="inp" id="t" value="Kiểm tra thường xuyên tháng ${new Date().getMonth() + 1}"></label>
    <div class="row"><label class="field" style="flex:1"><span>Loại</span><select class="inp" id="cat"><option value="tx">Thường xuyên</option><option value="gk">Giữa kì</option><option value="ck">Cuối kì</option></select></label><label class="field" style="flex:1"><span>Ngày kiểm tra</span><input class="inp" type="date" id="d" value="${new Date().toISOString().slice(0, 10)}"></label></div>
    <label class="field"><span>Mã mục tiêu cho từng câu (mỗi dòng một câu: mã | điểm)</span><textarea class="inp mono" id="items" rows="7">DL10.04.02 | 1\nDL10.04.03 | 1\nDL10.04.04 | 1\nDL10.04.05 | 2\nDL10.04.06 | 2\nDL10.04.07 | 3</textarea><small>Gắn mã mục tiêu giúp hệ thống biết lớp yếu phần nào và tự giao bài cải thiện.</small></label><div class="err-msg" id="er"></div></div>`, foot: '<button class="btn pri" id="ok">Tạo bảng nhập điểm</button>' });
  m.el.querySelector('#ok').onclick = () => {
    const items = m.el.querySelector('#items').value.split('\n').filter(l => l.trim()).map(l => { const [o, p] = l.split('|').map(x => x.trim()); return { qid: null, o: o.toUpperCase(), t: 'mc', pts: toNum(p) || 1 }; });
    const bad = items.filter(it => !OBJ[it.o]); if (bad.length) { m.el.querySelector('#er').textContent = 'Mã chưa đúng: ' + bad.map(b => b.o).join(', '); return; }
    const t = { id: uid('t'), title: m.el.querySelector('#t').value.trim() || 'Bài kiểm tra', cat: m.el.querySelector('#cat').value, kind: 'paper', created: Date.now(), date: new Date(m.el.querySelector('#d').value).getTime() || Date.now(), status: 'closed', items, scores: {}, released: false };
    D.act.saveTest(t); m.close(); tab = 'grid'; ctx.go('gv-kiem-tra', { tid: t.id });
  };
}

function detail(el, ctx, tid) {
  const c = D.cls(); const t = c.tests.find(x => x.id === tid); if (!t) { ctx.go('gv-kiem-tra'); return; }
  const R = testResults(c, t); const S = D.students(c);
  const tabs = [['sum', 'Tổng quan'], ...(t.kind === 'online' ? [['subs', `Bài làm (${R.rows.filter(r => r.done).length})`]] : [['grid', 'Nhập điểm']]), ['qs', 'Câu hỏi']];
  if (!tabs.some(x => x[0] === tab)) tab = 'sum';
  el.innerHTML = `<div class="row" style="margin-bottom:12px"><button class="btn ghost sm" id="back">${ic('arrowL')} Tất cả bài</button></div>
    <div class="lead" style="margin-top:0"><div><span class="pill ${ST[t.status][1]}">${ST[t.status][0]}</span> <span class="tag">${CAT[t.cat] || ''}</span> <span class="tag">${t.kind === 'online' ? 'Trực tuyến' : 'Bài giấy'}</span><h2 style="font-size:24px;margin-top:8px">${esc(t.title)}</h2><p>${t.items.length} câu · ${n2(R.max)} điểm${t.variants?.length ? ' · mã đề ' + t.variants.map(v => v.code).join(', ') : ''}</p></div>
      <div class="acts">${t.items.some(it => it.qid) ? `<button class="btn" id="word">${ic('word')} Xuất Word</button>` : ''}<a class="btn" href="#gv-phan-tich" id="ana">${ic('chart')} Phân tích</a><button class="btn danger" id="del">${ic('trash')}</button></div></div>
    <div class="tabs">${tabs.map(([k, v]) => `<button data-tab="${k}" class="${tab === k ? 'on' : ''}">${v}</button>`).join('')}</div><div id="pane"></div>`;
  $('#back').onclick = () => ctx.go('gv-kiem-tra');
  el.querySelectorAll('[data-tab]').forEach(b => (b.onclick = () => { tab = b.dataset.tab; ctx.refresh(); }));
  $('#word') && ($('#word').onclick = () => { if (!t.variants?.length) t.variants = makeVariants(t.items, 1, 7); saveFile(`${t.title.replace(/[\\/:*?"<>|]/g, '')}.docx`, testDocx(c, t)); });
  $('#ana').onclick = e => { e.preventDefault(); ctx.go('gv-phan-tich', { tid: t.id }); };
  $('#del').onclick = e => confirmInline(e.currentTarget, 'Xoá bài và bài làm?', () => { D.act.deleteTest(t.id); ctx.go('gv-kiem-tra'); });
  const pane = $('#pane');
  if (tab === 'sum') summary(pane, c, t, R, ctx);
  if (tab === 'subs') subs(pane, c, t, R);
  if (tab === 'grid') grid(pane, c, t, S);
  if (tab === 'qs') pane.innerHTML = `<div class="stack">${t.items.map((it, i) => it.qid ? qHTML(qOf(c, it.qid), { no: i + 1, pts: it.pts, mode: 'preview', showMeta: true, ans: qOf(c, it.qid)?.t === 'tlu' ? '' : qOf(c, it.qid)?.k }) : `<div class="q"><div class="q-h"><b>Câu ${i + 1}</b><span class="tag">${n2(it.pts)} điểm</span>${objChip(it.o)}</div><span class="muted">${esc(OBJ[it.o] || '')}</span></div>`).join('')}</div>`;
}

const toLocal = ts => new Date(ts - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
function summary(pane, c, t, R, ctx) {
  const done = R.rows.filter(r => r.score10 != null); const avg = done.length ? done.reduce((a, r) => a + r.score10, 0) / done.length : null;
  pane.innerHTML = `<div class="kpis"><div class="kpi"><span class="k">${t.kind === 'online' ? 'Đã nộp' : 'Đã nhập điểm'}</span><span class="v num">${R.rows.filter(r => r.done).length}<small>/${R.rows.length}</small></span></div>
    <div class="kpi"><span class="k">Điểm trung bình</span><span class="v num">${n1(avg)}</span></div>
    <div class="kpi"><span class="k">Từ 5 điểm trở lên</span><span class="v num">${done.length ? Math.round(done.filter(r => r.score10 >= 5).length / done.length * 100) : '–'}<small>%</small></span></div>
    <div class="kpi"><span class="k">Tự luận chờ chấm</span><span class="v num">${R.rows.reduce((a, r) => a + r.pending, 0)}</span></div></div>
    <div class="grid g2"><div class="card stack"><h2 style="font-size:16px">Trạng thái</h2>
      ${t.kind === 'online' ? `<div class="seg" id="st">${['draft', 'open', 'closed'].map(s => `<button type="button" data-v="${s}" class="${t.status === s ? 'on' : ''}">${{ draft: 'Nháp', open: 'Mở cho HS làm', closed: 'Đóng' }[s]}</button>`).join('')}</div>
        <div class="row"><label class="field" style="flex:1"><span>Mở từ</span><input class="inp" type="datetime-local" id="op" value="${t.open ? toLocal(t.open) : ''}"></label><label class="field" style="flex:1"><span>Hạn nộp</span><input class="inp" type="datetime-local" id="du" value="${t.due ? toLocal(t.due) : ''}"></label></div>
        <label class="field" style="max-width:200px"><span>Thời gian làm bài (phút)</span><input class="inp" type="number" id="dur" value="${t.duration || 15}"></label>` : `<label class="field" style="max-width:240px"><span>Ngày kiểm tra</span><input class="inp" type="date" id="dt" value="${new Date(t.date || Date.now()).toISOString().slice(0, 10)}"></label>`}
      <label class="check"><input type="checkbox" id="rel" ${t.released ? 'checked' : ''}> Công bố kết quả cho học sinh (kèm nhiệm vụ cải thiện mục tiêu dưới 50%)</label></div>
      <div class="card"><h2 style="font-size:16px;margin-bottom:10px">Điểm từng học sinh</h2><div class="list" style="max-height:340px;overflow:auto">${R.rows.slice().sort((a, b) => (b.score10 ?? -1) - (a.score10 ?? -1)).map(r => `<div class="li"><div class="t"><b>${esc(r.name)}</b><span>${r.done ? (r.pending ? `${r.pending} câu tự luận chờ chấm` : 'Đã có điểm') : t.kind === 'online' ? 'Chưa nộp' : 'Chưa nhập'}${r.blur ? ` · rời trang ${r.blur} lần` : ''}</span></div><b class="num" style="font-size:16px">${n1(r.score10)}</b></div>`).join('')}</div></div></div>`;
  const save = () => D.act.saveTest(t);
  pane.querySelectorAll('#st button').forEach(b => (b.onclick = () => { t.status = b.dataset.v; if (t.status === 'open' && !t.open) t.open = Date.now(); if (t.status === 'open' && !t.due) t.due = Date.now() + 2 * DAY; if (!t.variants?.length) t.variants = makeVariants(t.items, 2, 7); save(); toast(t.status === 'open' ? 'Đã mở bài cho học sinh' : t.status === 'closed' ? 'Đã đóng bài' : 'Đã chuyển về nháp', 'check'); ctx.refresh(); }));
  $('#op', pane) && ($('#op', pane).onchange = e => { t.open = new Date(e.target.value).getTime(); save(); });
  $('#du', pane) && ($('#du', pane).onchange = e => { t.due = new Date(e.target.value).getTime(); save(); toast('Đã đổi hạn nộp', 'clock'); });
  $('#dur', pane) && ($('#dur', pane).onchange = e => { t.duration = +e.target.value || t.duration; save(); });
  $('#dt', pane) && ($('#dt', pane).onchange = e => { t.date = new Date(e.target.value).getTime(); save(); });
  $('#rel', pane).onchange = e => { t.released = e.target.checked; save(); toast(t.released ? 'Học sinh đã xem được kết quả' : 'Đã ẩn kết quả', 'check'); };
}

function subs(pane, c, t, R) {
  pane.innerHTML = `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Học sinh</th><th>Trạng thái</th><th>Mã đề</th><th class="r">Thời gian làm</th><th class="r">Rời trang</th><th class="r">Điểm (thang 10)</th><th></th></tr></thead><tbody>
    ${R.rows.map(r => { const s = r.sub; const draft = !s && c.subs.find(x => x.tid === t.id && x.uid === r.sid && !x.end);
      return `<tr class="${s ? 'click' : ''}" data-sid="${r.sid}"><td><b>${esc(r.name)}</b></td><td>${s ? (r.pending ? `<span class="pill p-warn">Chờ chấm tự luận</span>` : '<span class="pill p-good">Đã nộp</span>') : draft ? '<span class="pill p-info">Đang làm</span>' : '<span class="pill p-lock">Chưa làm</span>'}</td>
        <td class="mono">${s?.variant || ''}</td><td class="r num">${s ? Math.round((s.end - s.start) / 6e4) + ' phút' : ''}</td><td class="r num">${s ? (s.blur ? `<b style="color:${s.blur >= 3 ? 'var(--bad)' : 'inherit'}">${s.blur}</b>` : '0') : ''}</td>
        <td class="r num"><b>${n1(r.score10)}</b></td><td class="r">${s ? `<button class="btn sm">${r.pending ? 'Chấm' : 'Xem'}</button>` : ''}</td></tr>`; }).join('')}</tbody></table></div>`;
  pane.querySelectorAll('tr.click').forEach(tr => (tr.onclick = () => gradeSub(c, t, finalSub(c, t.id, tr.dataset.sid))));
}

function gradeSub(c, t, sub) {
  const v = t.variants?.find(x => x.code === sub.variant); const order = v ? v.order : t.items.map((_, i) => i);
  const essays = t.items.filter(it => it.t === 'tlu');
  const m = modal({ title: `Bài làm của ${D.userName(sub.uid)}`, wide: true, body: `<div class="row" style="margin-bottom:12px"><span class="tag">Mã đề ${esc(sub.variant || '')}</span><span class="tag">Nộp ${dtime(sub.end)}</span>${sub.blur ? `<span class="pill p-warn">Rời trang ${sub.blur} lần</span>` : ''}</div>
    <div class="stack">${order.map((i, k) => { const it = t.items[i]; const q = qOf(c, it.qid); if (!q) return '';
      if (q.t !== 'tlu') return qHTML(q, { no: k + 1, pts: it.pts, mode: 'review', ans: sub.answers[it.qid], perm: v?.perm[i] });
      const sug = suggestEssay(q, sub.answers[it.qid] || '', it.pts); const cur = sub.essay?.[it.qid];
      return `<div class="q"><div class="q-h"><b>Câu ${k + 1}</b><span class="tag">Tự luận · ${n2(it.pts)} điểm</span>${objChip(q.o)}</div><div class="q-stem">${esc(q.q)}</div>
        <div class="explain" style="white-space:pre-line;background:var(--raise);border:1px solid var(--line)">${esc(sub.answers[it.qid] || '(bỏ trống)')}</div>
        <div class="grid g2" style="margin-top:12px;gap:12px"><div><b style="font-size:13px">Đối chiếu hướng dẫn chấm</b>${sug.parts.map(p => `<div class="row" style="flex-wrap:nowrap;align-items:flex-start;margin-top:6px;font-size:13px"><span class="pill ${p.got === 1 ? 'p-good' : p.got ? 'p-warn' : 'p-lock'} plain">${p.got === 1 ? 'Có' : p.got ? 'Một phần' : 'Chưa thấy'}</span><span>${esc(p.d)} <b class="num">(${n2(p.p)})</b></span></div>`).join('')}</div>
        <div class="stack" style="gap:8px"><span class="lab">Điểm câu này</span><div class="row"><input class="inp mono" style="width:110px" data-score="${it.qid}" value="${cur ?? ''}" placeholder="${n2(sug.score)}"><span class="muted">/ ${n2(it.pts)} · gợi ý ${n2(sug.score)}</span></div>
          <button class="btn sm" data-sug="${it.qid}" data-v="${sug.score}">${ic('check')} Dùng điểm gợi ý</button><button class="btn sm" data-ai="${it.qid}" hidden>${ic('spark')} Hỏi AI chấm thử</button><div class="muted" data-aiout="${it.qid}" style="font-size:12.5px;white-space:pre-line"></div></div></div></div>`; }).join('')}</div>`,
    foot: essays.length ? `<button class="btn pri" id="save">${ic('check')} Lưu điểm tự luận</button>` : '<span class="muted">Bài không có câu tự luận – điểm đã được chấm tự động.</span>' });
  m.el.querySelectorAll('[data-sug]').forEach(b => (b.onclick = () => { m.el.querySelector(`[data-score="${CSS.escape(b.dataset.sug)}"]`).value = String(b.dataset.v).replace('.', ','); }));
  getSample().then(s => { if (!s) return; m.el.querySelectorAll('[data-ai]').forEach(b => { b.hidden = false; b.onclick = async () => {
    const it = t.items.find(x => x.qid === b.dataset.ai); const q = qOf(c, it.qid); const out = m.el.querySelector(`[data-aiout="${CSS.escape(it.qid)}"]`); out.textContent = 'Đang chấm thử…'; b.disabled = true;
    try { const r = await s.json(`Bạn là giáo viên Địa lí THPT chấm câu tự luận theo hướng dẫn chấm. Câu hỏi: ${q.q}\nHướng dẫn chấm (ý – điểm, tổng ${it.pts} điểm sau quy đổi): ${q.rubric.map(r => r.d + ' – ' + r.p).join('; ')}\nBài làm của học sinh: """${sub.answers[it.qid] || ''}"""\nTrả về JSON {"diem": số (bội của 0.25, tối đa ${it.pts}), "nhan_xet": "1–2 câu tiếng Việt nêu ý đạt, ý thiếu"}.`, { modelTier: 'quick' });
      out.textContent = `AI gợi ý ${r.diem} điểm. ${r.nhan_xet || ''}`; m.el.querySelector(`[data-score="${CSS.escape(it.qid)}"]`).value = String(r.diem).replace('.', ','); }
    catch (e) { out.textContent = e.code === 'not_granted' ? 'Chưa được cấp quyền dùng AI.' : 'AI chưa trả lời được, thầy cô chấm theo gợi ý bên trái.'; } finally { b.disabled = false; } }; }); });
  m.el.querySelector('#save')?.addEventListener('click', () => {
    const essay = { ...(sub.essay || {}) }; let bad = false;
    m.el.querySelectorAll('[data-score]').forEach(i => { if (i.value.trim() === '') return; const v = toNum(i.value); const it = t.items.find(x => x.qid === i.dataset.score); if (v == null || v < 0 || v > it.pts) { bad = true; i.style.borderColor = 'var(--bad)'; } else essay[i.dataset.score] = v; });
    if (bad) { toast('Điểm phải nằm trong khoảng cho phép', 'alert'); return; }
    D.act.saveSub({ ...sub, essay }); m.close(); toast('Đã lưu điểm tự luận', 'check');
  });
}

function grid(pane, c, t, S) {
  const head = t.items.map((it, i) => { const o = it.qid ? qOf(c, it.qid)?.o : it.o; return `<th class="c" data-tip="${esc(o + ' – ' + (OBJ[o] || ''))}">C${i + 1}<div class="mono" style="font-size:9.5px;font-weight:500">${o?.slice(5) || ''}</div><div style="font-size:10px;font-weight:500">${n2(it.pts)}đ</div></th>`; }).join('');
  pane.innerHTML = `<div class="note" style="margin-bottom:12px">${ic('info')}<div>Nhập điểm đạt được của từng câu (0 đến điểm tối đa). Có thể dán cả bảng từ Excel: chọn vùng điểm (mỗi dòng một học sinh, theo đúng thứ tự danh sách bên dưới) rồi bấm vào ô đầu tiên và dán.</div></div>
    <div class="tbl-wrap"><table class="tbl" id="g" style="font-size:13px"><thead><tr><th>Học sinh</th>${head}<th class="r">Tổng</th></tr></thead><tbody>
    ${S.map((s, r) => `<tr><td style="white-space:nowrap"><b>${esc(s.name)}</b></td>${t.items.map((it, i) => `<td class="c" style="padding:4px"><input class="inp sm mono" style="width:54px;text-align:center" data-r="${r}" data-i="${i}" value="${t.scores?.[s.id]?.[i] ?? ''}"></td>`).join('')}<td class="r num"><b data-tot="${r}"></b></td></tr>`).join('')}</tbody></table></div>
    <div class="row" style="margin-top:12px"><span class="sp"></span><button class="btn pri" id="sv">${ic('check')} Lưu bảng điểm</button></div>`;
  const cell = (r, i) => pane.querySelector(`[data-r="${r}"][data-i="${i}"]`);
  const tot = r => { let s = 0, any = false; t.items.forEach((_, i) => { const v = toNum(cell(r, i).value); if (v != null) { s += v; any = true; } }); pane.querySelector(`[data-tot="${r}"]`).textContent = any ? n2(s) : ''; };
  S.forEach((_, r) => tot(r));
  pane.querySelectorAll('[data-r]').forEach(inp => {
    inp.oninput = () => { const v = toNum(inp.value); const max = t.items[+inp.dataset.i].pts; inp.style.borderColor = inp.value && (v == null || v < 0 || v > max) ? 'var(--bad)' : ''; tot(+inp.dataset.r); };
    inp.onpaste = e => { const txt = e.clipboardData.getData('text'); if (!/[\t\n]/.test(txt)) return; e.preventDefault(); const r0 = +inp.dataset.r, i0 = +inp.dataset.i;
      txt.replace(/\r/g, '').split('\n').filter(l => l.length).forEach((line, dr) => line.split('\t').forEach((v, di) => { const el = cell(r0 + dr, i0 + di); if (el) el.value = v.trim(); })); S.forEach((_, r) => tot(r)); toast('Đã dán dữ liệu – kiểm tra rồi bấm Lưu', 'check'); };
    inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); cell(+inp.dataset.r + 1, +inp.dataset.i)?.focus(); } };
  });
  $('#sv', pane).onclick = () => {
    const scores = {}; let bad = 0;
    S.forEach((s, r) => { const row = t.items.map((it, i) => { const raw = cell(r, i).value.trim(); if (raw === '') return null; const v = toNum(raw); if (v == null || v < 0 || v > it.pts) { bad++; return null; } return v; }); if (row.some(v => v != null)) scores[s.id] = row; });
    if (bad) { toast(`${bad} ô điểm không hợp lệ (đang tô đỏ)`, 'alert'); return; }
    t.scores = scores; D.act.saveTest(t); toast(`Đã lưu điểm của ${Object.keys(scores).length} học sinh`, 'check');
  };
}

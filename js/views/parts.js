// Thành phần dùng chung giữa các màn hình
import * as D from '../core/data.js';
import { esc, pct, n1, n2, dd, modal, initials } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MOD, ERR, LEVEL_NAME, TYPE_NAME, OBJ, gradeItem } from '../core/qbank.js';
import { studentSummary, STRATEGIES } from '../../app/analytics.js';
import { progress, gradebook, levelCls, remedies } from '../core/insight.js';
import { hbars, hours } from '../core/charts.js';

export const L = 'ABCD';
export const lvChip = lv => `<span class="lv ${lv}" data-tip="${LEVEL_NAME[lv] || ''}">${lv}</span>`;
export const objChip = o => `<span class="obj" data-tip="${esc(OBJ[o] || '')}">${o}</span>`;
export const stateName = { locked: 'Đang khoá', open: 'Đang mở', review: 'Ôn tập' };
export const statePill = s => `<span class="pill ${s === 'open' ? 'p-open' : s === 'review' ? 'p-review' : 'p-lock'}">${stateName[s] || 'Đang khoá'}</span>`;
const MOD_IC = { '02': 'map', '03': 'pin', '04': 'globe', '05': 'sun', '06': 'layers', '07': 'layers', '08': 'flame', '09': 'globe', '10': 'globe', '11': 'route', '12': 'route', '13': 'chart', '14': 'layers', '15': 'spark', '16': 'globe', '17': 'layers', '18': 'map', '19': 'users', '20': 'users' };
export const modIcon = code => ic(MOD_IC[MOD[code]?.lab] || 'cube');

// ---------- hiển thị một câu hỏi ----------
// mode: 'answer' (làm bài) | 'review' (xem đáp án sau khi làm) | 'preview' (GV xem)
export function qHTML(q, { no = '', pts = null, ans, mode = 'answer', perm = null, showMeta = false } = {}) {
  if (!q) return `<div class="q"><span class="muted">Câu hỏi không còn trong ngân hàng.</span></div>`;
  const head = `<div class="q-h"><b>Câu ${no}</b>${pts != null ? `<span class="tag">${n2(pts)} điểm</span>` : ''}${showMeta ? `<span class="tag">${TYPE_NAME[q.t]}</span>${lvChip(q.lv)}${objChip(q.o)}` : ''}</div>`;
  const g = mode === 'review' ? gradeItem(q, ans, pts ?? 1) : null;
  let body = '';
  if (q.t === 'mc') {
    const order = perm || [0, 1, 2, 3];
    body = `<div class="opts">${order.map((oi, j) => { const sel = ans != null && +ans === oi; let cls = sel ? 'sel' : '';
      if (mode !== 'answer') { if (oi === q.k) cls = 'ok'; else if (sel) cls = 'no'; }
      return `<button type="button" class="opt ${cls}" data-mc="${oi}" ${mode !== 'answer' ? 'disabled' : ''}><span class="l">${L[j]}</span><span>${esc(q.a[oi])}</span></button>`; }).join('')}</div>`;
  } else if (q.t === 'ds') {
    body = `<div style="margin-top:10px">${q.st.map((s, i) => { const v = ans?.[i]; const right = mode !== 'answer' ? q.k[i] : null;
      return `<div class="ds-row"><b class="mono">${'abcd'[i]})</b><span>${esc(s)}${mode !== 'answer' ? ` <span class="pill ${right ? 'p-good' : 'p-bad'} plain" style="margin-left:4px">${right ? 'Đúng' : 'Sai'}</span>` : ''}</span>
        <div class="seg" role="group"><button type="button" data-ds="${i}" data-v="1" class="${v === true ? 'on' : ''}" ${mode !== 'answer' ? 'disabled' : ''}>Đúng</button><button type="button" data-ds="${i}" data-v="0" class="${v === false ? 'on' : ''}" ${mode !== 'answer' ? 'disabled' : ''}>Sai</button></div></div>`; }).join('')}</div>`;
  } else if (q.t === 'tln') {
    body = `<div class="row" style="margin-top:12px"><input class="inp mono" data-tln style="max-width:220px" inputmode="decimal" placeholder="Nhập số" value="${esc(ans ?? '')}" ${mode !== 'answer' ? 'disabled' : ''}><span class="muted">${esc(q.unit || '')}</span>
      ${mode !== 'answer' ? `<span class="pill p-good plain">Đáp án: ${esc(q.k)} ${esc(q.unit || '')}</span>` : ''}</div>`;
  } else {
    body = `<textarea class="inp" data-tlu rows="6" style="margin-top:12px" placeholder="Trình bày câu trả lời của em…" ${mode !== 'answer' ? 'disabled' : ''}>${esc(ans ?? '')}</textarea>
      ${mode !== 'answer' ? `<div class="explain"><b>Hướng dẫn chấm</b><ul style="margin:6px 0 0;padding-left:18px">${q.rubric.map(r => `<li>${esc(r.d)} <b class="num">(${n2(r.p)} đ)</b></li>`).join('')}</ul></div>` : ''}`;
  }
  const res = g && g.state !== 'essay' ? `<div class="row" style="margin-top:10px">${g.state === 'ok' ? '<span class="pill p-good">Đúng</span>' : g.state === 'part' ? `<span class="pill p-warn">Đúng ${g.nRight}/4 ý</span>` : g.state === 'blank' ? '<span class="pill p-lock">Bỏ trống</span>' : '<span class="pill p-bad">Chưa đúng</span>'}<span class="muted num">${n2(g.score)} / ${n2(g.max)} điểm</span>${g.err && ERR[g.err] ? `<span class="tag" data-tip="Lỗi sai thường gặp">${g.err} · ${esc(ERR[g.err][0])}</span>` : ''}</div>` : '';
  const exp = mode !== 'answer' && q.x && q.t !== 'tlu' ? `<div class="explain">${esc(q.x)}</div>` : '';
  return `<div class="q" data-qid="${q.id}">${head}<div class="q-stem">${esc(q.q)}</div>${body}${res}${exp}</div>`;
}
// gắn sự kiện trả lời; onAns(qid, value)
export function bindQ(root, q, onAns, getAns) {
  const box = root.querySelector(`[data-qid="${CSS.escape(q.id)}"]`); if (!box) return;
  box.querySelectorAll('[data-mc]').forEach(b => (b.onclick = () => { box.querySelectorAll('[data-mc]').forEach(x => x.classList.toggle('sel', x === b)); onAns(q.id, +b.dataset.mc); }));
  box.querySelectorAll('[data-ds]').forEach(b => (b.onclick = () => { const i = +b.dataset.ds; const cur = (getAns?.(q.id) || [null, null, null, null]).slice(); cur[i] = b.dataset.v === '1'; b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); onAns(q.id, cur); }));
  const t = box.querySelector('[data-tln]'); if (t) t.oninput = () => onAns(q.id, t.value.trim());
  const e = box.querySelector('[data-tlu]'); if (e) e.oninput = () => onAns(q.id, e.value);
}

// ---------- hồ sơ một học sinh (GV) ----------
export function studentDrawer(c, sid) {
  const u = D.userOf(sid); if (!u) return;
  const view = D.analyticsView(c); const sum = studentSummary(view, sid); const P = progress(c, sid); const gb = gradebook(c, sid); const rem = remedies(c, sid);
  const note = c.notes[sid];
  const bg = document.createElement('div'); bg.className = 'modal-bg'; bg.style.placeItems = 'stretch end'; bg.style.padding = '0';
  bg.innerHTML = `<aside class="drawer" role="dialog" aria-label="Hồ sơ ${esc(u.name)}">
    <div class="modal-h"><span class="av">${esc(initials(u.name))}</span><div style="flex:1;min-width:0"><h2>${esc(u.name)}</h2><span class="muted" style="font-size:12.5px">${esc(u.email)}</span></div><button class="icon-btn" data-x aria-label="Đóng">${ic('x')}</button></div>
    <div class="modal-b stack" style="gap:16px">
      <div class="kpis" style="margin:0;grid-template-columns:repeat(3,1fr)"><div class="kpi"><span class="k">Hoàn thành</span><span class="v num" style="font-size:24px">${pct(P.pctAvail)}</span><span class="d">mô-đun đã mở</span></div>
        <div class="kpi"><span class="k">Nắm vững TB</span><span class="v num" style="font-size:24px">${pct(sum.avg)}</span><span class="d">${Object.keys(sum.mastery).length} mục tiêu</span></div>
        <div class="kpi"><span class="k">ĐTB môn</span><span class="v num" style="font-size:24px">${n1(gb.dtb)}</span><span class="d">${gb.level ? `<span class="pill ${levelCls(gb.level)}">${gb.level}</span>` : 'chưa đủ đầu điểm'}</span></div></div>
      <div><h3 style="font-size:15px;margin-bottom:8px">Thói quen cần chú ý</h3>${sum.flags.length ? sum.flags.map(f => `<div class="note ${f.level === 'high' ? 'sun' : ''}" style="margin-bottom:8px">${ic(f.level === 'high' ? 'alert' : 'info')}<div><b>${esc(f.title)}</b><div class="muted" style="font-size:12.5px">${esc(f.evidence)}</div><div style="font-size:12.5px;margin-top:3px">Gợi ý: <b>${esc(STRATEGIES[f.strategy].name)}</b></div></div></div>`).join('') : '<p class="muted">Chưa phát hiện thói quen bất lợi.</p>'}</div>
      <div><h3 style="font-size:15px;margin-bottom:8px">Mô-đun</h3>${hbars(P.avail.map(m => ({ label: `${m.bai} · ${m.title}`, value: m.pr.pct })))}</div>
      <div><h3 style="font-size:15px;margin-bottom:8px">Điểm kiểm tra</h3>${gb.marks.length ? `<div class="list">${gb.marks.map(m => `<div class="li"><div class="t"><b>${esc(m.t.title)}</b><span>${m.t.cat === 'gk' ? 'Giữa kì' : m.t.cat === 'ck' ? 'Cuối kì' : 'Thường xuyên'} · ${dd(m.t.date)}</span></div><b class="num" style="font-size:16px">${n1(m.score)}</b></div>`).join('')}</div>` : '<p class="muted">Chưa có điểm.</p>'}</div>
      ${rem.length ? `<div><h3 style="font-size:15px;margin-bottom:8px">Nhiệm vụ cải thiện</h3>${rem.map(r => `<div class="row" style="margin-bottom:6px">${objChip(r.o)}<span class="muted" style="font-size:12.5px">${esc(r.test)} · ${pct(r.frac)}</span><span class="sp"></span>${r.done ? '<span class="pill p-good">Đã cải thiện</span>' : `<span class="pill p-warn">${r.progress}/2 câu</span>`}</div>`).join('')}</div>` : ''}
      <div><h3 style="font-size:15px;margin-bottom:8px">Giờ học trong ngày</h3><div style="overflow-x:auto">${hours(sum.hours, { h: 120 })}</div></div>
      ${note ? `<div><h3 style="font-size:15px;margin-bottom:8px">Nhận xét đã lưu</h3><div class="explain">${esc(note.text)}</div></div>` : ''}
    </div>
    <div class="modal-f"><a class="btn" href="#gv-nhan-xet" data-close>${ic('comment')} Viết nhận xét</a><button class="btn pri" data-close>Đóng</button></div></aside>`;
  const close = () => bg.remove();
  bg.addEventListener('mousedown', e => { if (e.target === bg) close(); });
  bg.querySelectorAll('[data-x],[data-close]').forEach(b => b.addEventListener('click', close));
  document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
  document.body.append(bg);
}

export function confirmInline(btn, text, fn) {
  if (btn.dataset.armed) { fn(); return; }
  const old = btn.innerHTML; btn.dataset.armed = '1'; btn.innerHTML = text; btn.classList.add('danger');
  setTimeout(() => { if (btn.isConnected) { btn.innerHTML = old; delete btn.dataset.armed; btn.classList.remove('danger'); } }, 3500);
}
export { modal };

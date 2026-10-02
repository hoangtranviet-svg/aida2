// HS · Phòng thi trực tuyến: đếm giờ, lưu tự động, ghi số lần rời trang, chấm tự động
import * as D from '../core/data.js';
import { $, esc, n1, n2, dtime, toast, modal, uid } from '../core/util.js';
import { ic } from '../core/icons.js';
import { qOf, gradeItem, PART_NAME, TYPE_NAME } from '../core/qbank.js';
import { finalSub } from '../core/insight.js';
import { qHTML, bindQ } from './parts.js';

const mmss = ms => { ms = Math.max(0, ms); const m = Math.floor(ms / 6e4), s = Math.floor(ms % 6e4 / 1e3); return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; };

export default {
  title: 'Làm bài kiểm tra',
  onData: () => false,
  render(el, ctx, p) {
    const c = D.cls(); const u = D.me(); const t = c.tests.find(x => x.id === p.tid);
    if (!t) { ctx.go('hs-kiem-tra'); return; }
    const fin = finalSub(c, t.id, u.uid);
    if (fin) return result(el, ctx, c, t, fin);
    const now = Date.now();
    if (t.status !== 'open' || (t.open && t.open > now) || (t.due && t.due < now)) { el.innerHTML = `<div class="empty">${ic('lock')}<b>Bài kiểm tra chưa mở hoặc đã hết hạn</b><a class="btn" href="#hs-kiem-tra">Về danh sách</a></div>`; return; }
    let sub = c.subs.find(s => s.tid === t.id && s.uid === u.uid && !s.end);
    if (!sub) {
      el.innerHTML = `<div class="card" style="max-width:640px;margin:10px auto"><div class="stack" style="gap:14px"><span class="eyebrow">Bài kiểm tra trực tuyến</span><h2 style="font-size:24px">${esc(t.title)}</h2>
        <div class="row"><span class="tag">${t.items.length} câu</span><span class="tag">${t.duration} phút</span><span class="tag">Hạn ${dtime(t.due)}</span></div>
        <ul style="margin:0;padding-left:18px;line-height:1.8"><li>Đồng hồ bắt đầu chạy khi em bấm “Bắt đầu”, hết giờ bài được nộp tự động.</li><li>Câu trả lời được lưu liên tục; nếu mất mạng hay tải lại trang, em làm tiếp từ chỗ cũ.</li>${t.opts?.antiCheat ? '<li><b>Không rời khỏi trang</b> khi đang làm: mỗi lần chuyển sang thẻ hoặc ứng dụng khác đều được ghi lại cho thầy/cô.</li>' : ''}
          <li>Câu đúng/sai: chọn Đúng hoặc Sai cho từng ý a, b, c, d. Câu trả lời ngắn: chỉ ghi số, dùng dấu phẩy cho phần thập phân.</li></ul>
        <button class="btn pri lg" id="start">${ic('play')} Bắt đầu làm bài</button></div></div>`;
      $('#start').onclick = () => { const vi = t.variants?.length ? [...u.uid].reduce((a, ch) => a + ch.charCodeAt(0), 0) % t.variants.length : -1;
        sub = { id: uid('sb'), tid: t.id, uid: u.uid, variant: vi >= 0 ? t.variants[vi].code : null, answers: {}, start: Date.now(), end: null, blur: 0, essay: {} }; D.act.saveSub(sub); ctx.refresh(); };
      return;
    }
    return room(el, ctx, c, t, sub);
  },
};

function room(el, ctx, c, t, sub) {
  const v = t.variants?.find(x => x.code === sub.variant); const order = v ? v.order : t.items.map((_, i) => i);
  const end = Math.min(sub.start + (t.duration || 15) * 6e4, t.due || Infinity);
  let k = 0; const parts = ['mc', 'ds', 'tln', 'tlu'].filter(ty => t.items.some(it => it.t === ty));
  el.innerHTML = `<div class="exam"><div class="stack" style="gap:14px">
      <div><span class="eyebrow">${esc(t.title)}${sub.variant ? ' · Mã đề ' + sub.variant : ''}</span></div>
      ${parts.map(ty => `<h3 style="font-size:15px;margin-top:6px">${PART_NAME[ty]}</h3>` + order.filter(i => t.items[i].t === ty).map(i => { k++; const it = t.items[i]; return `<div id="q-${k}" data-no="${k}">${qHTML(qOf(c, it.qid), { no: k, pts: it.pts, ans: sub.answers[it.qid], perm: v?.perm[i] })}</div>`; }).join('')).join('')}
      <button class="btn pri lg" id="submit2" style="align-self:flex-start">${ic('check')} Nộp bài</button></div>
    <aside class="exam-side"><div class="card stack" style="gap:10px"><span class="muted" style="font-size:12.5px">Thời gian còn lại</span><div class="timer" id="timer">--:--</div>
      <div class="qmap" id="qmap">${order.map((i, j) => `<button type="button" data-jump="${j + 1}" class="${answered(t.items[i], sub) ? 'done' : ''}">${j + 1}</button>`).join('')}</div>
      <span class="muted" style="font-size:12.5px" id="cnt"></span>${t.opts?.antiCheat ? `<span class="pill ${sub.blur ? 'p-warn' : 'p-lock'}" id="blur">${ic('eye')} Rời trang: ${sub.blur}</span>` : ''}
      <span class="muted" style="font-size:12px" id="saved">Đã lưu tự động</span><button class="btn pri" id="submit">${ic('check')} Nộp bài</button></div></aside></div>`;
  const items = order.map(i => t.items[i]);
  const cnt = () => { const n = items.filter(it => answered(it, sub)).length; $('#cnt').textContent = `Đã làm ${n}/${items.length} câu`; };
  let saveT = 0; const save = () => { clearTimeout(saveT); $('#saved').textContent = 'Đang lưu…'; saveT = setTimeout(() => { D.act.saveSub({ ...sub, answers: { ...sub.answers } }); $('#saved').textContent = 'Đã lưu ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }, 800); };
  items.forEach((it, j) => bindQ(el, qOf(c, it.qid), (qid, val) => { sub.answers[qid] = val; el.querySelector(`[data-jump="${j + 1}"]`).classList.toggle('done', answered(it, sub)); cnt(); save(); }, qid => sub.answers[qid]));
  cnt();
  el.querySelectorAll('[data-jump]').forEach(b => (b.onclick = () => document.getElementById('q-' + b.dataset.jump)?.scrollIntoView({ behavior: 'smooth', block: 'center' })));
  let lastBlur = 0; const onHide = () => { if (!t.opts?.antiCheat || sub.end) return; if (Date.now() - lastBlur < 1500) return; lastBlur = Date.now(); sub.blur = (sub.blur || 0) + 1; D.act.saveSub({ ...sub }); const b = $('#blur'); if (b) { b.className = 'pill p-warn'; b.innerHTML = ic('eye') + ' Rời trang: ' + sub.blur; } toast(`Em vừa rời khỏi trang bài làm (lần ${sub.blur}). Thầy/cô sẽ thấy số lần này.`, 'alert'); };
  const vis = () => { if (document.visibilityState === 'hidden') onHide(); };
  document.addEventListener('visibilitychange', vis); addEventListener('blur', onHide);
  const tick = () => { const left = end - Date.now(); const tm = $('#timer'); if (!tm) return; tm.textContent = mmss(left); tm.classList.toggle('low', left < 2 * 6e4); if (left <= 0) submit(true); };
  const iv = setInterval(tick, 500); tick();
  const submit = force => {
    if (sub.end) return;
    const go = () => { clearInterval(iv); clearTimeout(saveT); sub.end = Date.now(); sub.auto = {}; t.items.forEach(it => { if (it.t !== 'tlu') sub.auto[it.qid] = gradeItem(qOf(c, it.qid), sub.answers[it.qid], it.pts).score; });
      D.act.saveSub({ ...sub, answers: { ...sub.answers } }); D.act.logEvent({ m: null, type: 'test_submit', payload: { tid: t.id } }); toast(force ? 'Hết giờ – bài đã được nộp tự động' : 'Đã nộp bài', 'check'); ctx.refresh(); };
    if (force) return go();
    const left = items.filter(it => !answered(it, sub)).length;
    const m = modal({ title: 'Nộp bài?', body: `<p>${left ? `Em còn <b>${left} câu</b> chưa trả lời.` : 'Em đã trả lời tất cả các câu.'} Sau khi nộp sẽ không sửa được nữa.</p>`, foot: `<button class="btn" data-no>Làm tiếp</button><button class="btn pri" data-ok>${ic('check')} Nộp bài</button>` });
    m.el.querySelector('[data-no]').onclick = m.close; m.el.querySelector('[data-ok]').onclick = () => { m.close(); go(); };
  };
  $('#submit').onclick = () => submit(false); $('#submit2').onclick = () => submit(false);
  return () => { clearInterval(iv); document.removeEventListener('visibilitychange', vis); removeEventListener('blur', onHide); };
}

function answered(it, sub) { const a = sub.answers[it.qid]; if (a == null || a === '') return false; if (Array.isArray(a)) return a.every(x => x != null); return true; }

function result(el, ctx, c, t, sub) {
  const show = t.released || t.opts?.show === 'now';
  const v = t.variants?.find(x => x.code === sub.variant); const order = v ? v.order : t.items.map((_, i) => i);
  let got = 0, max = 0, pend = 0; t.items.forEach(it => { max += it.pts; if (it.t === 'tlu') { if (sub.essay?.[it.qid] != null) got += sub.essay[it.qid]; else pend++; } else got += sub.auto?.[it.qid] ?? 0; });
  el.innerHTML = `<div class="card" style="max-width:820px;margin:0 auto 16px"><div class="row" style="gap:18px"><span class="ic" style="width:52px;height:52px;border-radius:14px;display:grid;place-items:center;background:var(--good-soft);color:var(--good)">${ic('check')}</span>
      <div style="flex:1;min-width:200px"><span class="eyebrow">Đã nộp ${dtime(sub.end)}</span><h2 style="font-size:22px">${esc(t.title)}</h2>${sub.blur ? `<span class="muted" style="font-size:12.5px">Rời trang ${sub.blur} lần trong khi làm bài</span>` : ''}</div>
      ${show ? `<div style="text-align:right"><span class="muted" style="font-size:12px">Điểm (thang 10)</span><div class="num" style="font:700 40px var(--display)">${n1(got / max * 10)}</div>${pend ? '<span class="pill p-warn">Chờ chấm tự luận</span>' : ''}</div>` : '<span class="pill p-lock">Chờ thầy/cô công bố kết quả</span>'}</div></div>
    ${show ? `<div class="stack" style="max-width:820px;margin:0 auto">${order.map((i, k) => { const it = t.items[i]; return qHTML(qOf(c, it.qid), { no: k + 1, pts: it.pts, mode: 'review', ans: sub.answers[it.qid], perm: v?.perm[i] }); }).join('')}</div>` : `<div class="empty" style="max-width:820px;margin:0 auto">${ic('clock')}<b>Bài làm đã được lưu</b><span>Kết quả và lời giải sẽ hiện ở đây khi thầy/cô công bố.</span><a class="btn" href="#hs-kiem-tra">Về danh sách bài</a></div>`}`;
}

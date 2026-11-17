// AIDA 2.0 – bộ máy trình chiếu bài giảng (slide) trên web.
// Hai chế độ: "Trình chiếu" (GV dạy trên lớp: hiện từng ý, ghi chú cho GV, ẩn đáp án) và "Tự học" (HS xem, trả lời câu hỏi nhanh).
// Gửi dấu vết học tập lên trang cha theo cùng giao thức với phòng thí nghiệm 3D (source: 'aida-lab').
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const L = ['A', 'B', 'C', 'D'];

export async function runDeck(id) {
  const q = new URLSearchParams(location.search);
  const embedded = q.has('embed'); // nhúng trong trang học của HS
  if (embedded) document.body.classList.add('embed');
  let present = q.get('mode') === 'present' && !embedded;
  let def;
  try { def = (await import(`./decks/${id}.js`)).default; } catch (e) { $('#loading').textContent = 'Không tìm thấy bài giảng “' + id + '”.'; return; }
  document.title = def.title + ' – AIDA 2.0';
  $('#bar h1').textContent = def.title; $('#bar .code').textContent = def.code;
  const S = def.slides; const N = S.length; let cur = 0, frag = 0;
  const seen = new Set(), answered = {}; let completed = false; const t0 = Date.now();

  function track(type, payload = {}) {
    const msg = { source: 'aida-lab', module: def.code, lab: 'deck-' + def.id, type, payload, ts: Date.now() };
    try { if (window.parent !== window) window.parent.postMessage(msg, '*'); } catch (e) { /* */ }
  }
  const bucket = i => Math.min(5, Math.floor(i / N * 5) + 1);   // 5 chặng – tương thích cách tính "bước" của mô-đun 3D
  const toast = t => { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 1800); };

  // ---------- dựng slide ----------
  const sc = $('#scaler'); sc.innerHTML = '';
  const api = { esc, toast, track, answer: (i, ok, extra = {}) => { answered[i] = ok; track('quick_check', { slide: i + 1, correct: ok, ...extra }); paintDots(); checkDone(); } };
  const els = S.map((s, i) => {
    const el = document.createElement('section'); el.className = 'slide ' + (s.kind === 'cover' ? 'cover ' : '') + (s.kind === 'quiz' || s.kind === 'truefalse' ? 'quiz' : '');
    el.innerHTML = KIND[s.kind] ? KIND[s.kind](s, i, def) : `<div class="in">${s.html || ''}</div>`;
    if (s.kind !== 'cover') el.insertAdjacentHTML('beforeend', `<div class="s-foot"><span class="src">${s.src ? 'Nguồn: ' + esc(s.src) : ''}</span><span>${esc(def.short || def.title)} · ${i + 1}/${N}</span></div>`);
    sc.append(el); return el;
  });
  els.forEach((el, i) => { const s = S[i]; MOUNT[s.kind]?.(el, s, i, api); s.mount?.(el, api, i); });
  $('#loading')?.remove();

  // ---------- điều hướng ----------
  const frags = i => [...els[i].querySelectorAll('.frag')];
  function show(i, f = 0) {
    cur = Math.max(0, Math.min(N - 1, i)); frag = f;
    els.forEach((el, k) => el.classList.toggle('on', k === cur));
    frags(cur).forEach((x, k) => x.classList.toggle('shown', !present || k < frag));
    $('#count').textContent = `${cur + 1}/${N}`; $('#prog').style.width = ((cur + 1) / N * 100) + '%';
    $('#prev').disabled = cur === 0 && frag === 0; $('#next').disabled = cur === N - 1 && (!present || frag >= frags(cur).length);
    $('#notes').innerHTML = S[cur].notes ? `<b>Ghi chú cho giáo viên</b><div style="margin-top:6px">${S[cur].notes}</div>` : '<b>Ghi chú cho giáo viên</b><div style="margin-top:6px;opacity:.7">Không có ghi chú cho trang này.</div>';
    if (!seen.has(cur)) { seen.add(cur); track('step', { step: bucket(cur), slide: cur + 1 }); }
    S[cur].onShow?.(els[cur], api);
    paintDots(); checkDone();
    if (!embedded) history.replaceState(null, '', location.pathname + location.search + '#' + def.id + (cur ? '/' + (cur + 1) : ''));
  }
  function next() { const fs = frags(cur); if (present && frag < fs.length) { frag++; fs.forEach((x, k) => x.classList.toggle('shown', k < frag)); $('#next').disabled = cur === N - 1 && frag >= fs.length; $('#prev').disabled = false; return; } if (cur < N - 1) show(cur + 1, 0); }
  function prev() { if (present && frag > 0) { frag--; frags(cur).forEach((x, k) => x.classList.toggle('shown', k < frag)); return; } if (cur > 0) show(cur - 1, present ? frags(cur - 1).length : 0); }
  const quizIdx = S.map((s, i) => (s.kind === 'quiz' || s.kind === 'truefalse') ? i : -1).filter(i => i >= 0);
  function checkDone() {
    if (completed) return;
    if (seen.size === N && quizIdx.every(i => i in answered)) { completed = true; track('module_complete', { ms: Date.now() - t0, correct: quizIdx.filter(i => answered[i]).length, total: quizIdx.length }); toast('Em đã hoàn thành bài giảng này!'); }
  }
  function paintDots() {
    $('#dots').innerHTML = S.map((s, k) => `<button type="button" title="${k + 1}. ${esc(s.title || s.kind)}" class="${k === cur ? 'on ' : ''}${seen.has(k) ? 'seen ' : ''}${quizIdx.includes(k) ? 'q' : ''}" data-k="${k}"></button>`).join('');
    $('#dots').querySelectorAll('button').forEach(b => (b.onclick = () => show(+b.dataset.k)));
  }
  $('#next').onclick = next; $('#prev').onclick = prev;
  addEventListener('keydown', e => {
    if (e.target.closest('input,textarea,select')) return;
    if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); next(); }
    else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') show(0); else if (e.key === 'End') show(N - 1);
    else if (e.key === 'f' || e.key === 'F') full();
    else if ((e.key === 'n' || e.key === 'N') && present) $('#notes').classList.toggle('show');
  });
  let tx = null; $('#stage').addEventListener('touchstart', e => (tx = e.touches[0].clientX), { passive: true });
  $('#stage').addEventListener('touchend', e => { if (tx == null) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 60) (dx < 0 ? next : prev)(); tx = null; });
  // HS bấm "xem lại" từ câu luyện tập → chuyển đến chặng tương ứng
  addEventListener('message', e => { const d = e.data || {}; if (d.aida === 'goStep' && d.step) { show(Math.floor((d.step - 1) / 5 * N)); track('review_from_quiz', { step: d.step }); } });

  // ---------- chế độ, toàn màn hình, co giãn ----------
  const modeBtn = $('#mode');
  const setMode = p => { present = p; document.body.classList.toggle('present', p); modeBtn.textContent = p ? 'Chế độ: Trình chiếu' : 'Chế độ: Tự học'; modeBtn.classList.toggle('on', p); $('#notesBtn').hidden = !p; if (!p) $('#notes').classList.remove('show'); show(cur, p ? 0 : 0); };
  modeBtn.onclick = () => { setMode(!present); toast(present ? 'Trình chiếu: bấm → để hiện từng ý, N để xem ghi chú' : 'Tự học: hiện đầy đủ nội dung'); };
  if (embedded) modeBtn.hidden = true;
  $('#notesBtn').onclick = () => $('#notes').classList.toggle('show');
  function full() { const d = document; if (!d.fullscreenElement) d.documentElement.requestFullscreen?.().catch(() => {}); else d.exitFullscreen?.(); }
  $('#fullBtn').onclick = full;
  function fit() { const st = $('#stage'); const k = Math.min((st.clientWidth - 20) / 1600, (st.clientHeight - 20) / 900); sc.style.transform = `translate(-50%, -50%) scale(${k})`; }
  addEventListener('resize', fit); new ResizeObserver(fit).observe($('#stage')); fit();
  track('open', { mode: present ? 'present' : 'study' });
  const start = +(location.hash.split('/')[1] || 1) - 1;
  setMode(present); show(start || 0);
  window.AIDA_DECK = { show, next, prev, setMode, def };
}

// ---------- các kiểu slide ----------
const head = s => `${s.kicker ? `<div class="s-kick">${s.kicker}</div>` : ''}${s.title ? `<h2 class="s-h">${s.title}</h2>` : ''}`;
const bullets = (b, frag = true) => `<ul class="b">${b.map(x => Array.isArray(x) ? `<li class="${frag ? 'frag' : ''}">${x[0]}<ul>${x.slice(1).map(y => `<li>${y}</li>`).join('')}</ul></li>` : `<li class="${frag ? 'frag' : ''}">${x}</li>`).join('')}</ul>`;
const KIND = {
  cover: (s, i, d) => `${s.art || ''}<div class="in"><div class="s-kick">${s.kicker || ''}</div><h1>${s.title}</h1><div class="sub">${s.sub || ''}</div></div><div class="meta">${s.meta || ''}</div>`,
  goals: s => `<div class="in">${head(s)}<div class="s-body">${bullets(s.items, false)}${s.codes ? `<div style="align-self:end">${s.codes.map(c => `<span class="tag">${c}</span>`).join('')}</div>` : ''}</div></div>`,
  content: s => `<div class="in">${head(s)}<div class="s-body ${s.fig ? (s.layout || 'split') : ''}"><div>${s.bullets ? bullets(s.bullets) : ''}${s.after || ''}</div>${s.fig ? `<div style="min-height:0;display:flex;flex-direction:column">${s.fig}</div>` : ''}</div></div>`,
  html: s => `<div class="in">${head(s)}<div class="s-body">${s.body || ''}</div></div>`,
  quiz: (s, i) => `<div class="in">${s.kicker ? `<div class="s-kick">${s.kicker}</div>` : '<div class="s-kick">Câu hỏi nhanh</div>'}<p class="qs">${s.q}</p>
    <div class="qo">${s.a.map((t, k) => `<button type="button" data-k="${k}"><span class="l">${L[k]}</span><span>${t}</span></button>`).join('')}</div>
    <button class="reveal" type="button">Hiện đáp án</button><div class="qx"><b>${L[s.k]}.</b> ${s.x || ''}</div></div>`,
  truefalse: (s, i) => `<div class="in"><div class="s-kick">${s.kicker || 'Đúng hay sai?'}</div><p class="qs" style="margin-bottom:20px">${s.q}</p>
    <div class="ds">${s.items.map((it, k) => `<div class="r" data-k="${k}"><span>${String.fromCharCode(97 + k)}) ${it[0]}</span><button type="button" data-v="1">Đúng</button><button type="button" data-v="0">Sai</button><div class="why">${it[1] ? '✔ Đúng' : '✘ Sai'} – ${it[2] || ''}</div></div>`).join('')}</div>
    <button class="check-btn" type="button">Kiểm tra</button></div>`,
  summary: s => `<div class="in">${head(s)}<div class="mind"><div class="col">${s.left.map(n => `<div class="node frag"><h4>${n[0]}</h4><p>${n[1]}</p></div>`).join('')}</div><div class="core">${s.core}</div><div class="col">${s.right.map(n => `<div class="node frag"><h4>${n[0]}</h4><p>${n[1]}</p></div>`).join('')}</div></div></div>`,
};
const MOUNT = {
  quiz(el, s, i, api) {
    const bs = [...el.querySelectorAll('.qo button')]; const x = el.querySelector('.qx');
    bs.forEach(b => (b.onclick = () => { const k = +b.dataset.k; const ok = k === s.k; bs.forEach(o => { o.disabled = true; if (+o.dataset.k === s.k) o.classList.add('ok'); }); if (!ok) b.classList.add('no'); x.classList.add('show'); api.answer(i, ok, { choice: k }); }));
    el.querySelector('.reveal').onclick = () => { bs.forEach(o => { o.disabled = true; if (+o.dataset.k === s.k) o.classList.add('ok'); }); x.classList.add('show'); };
  },
  truefalse(el, s, i, api) {
    const pick = {}; el.querySelectorAll('.ds .r').forEach(r => r.querySelectorAll('button').forEach(b => (b.onclick = () => { if (el.querySelector('.ds').classList.contains('done')) return; r.querySelectorAll('button').forEach(o => o.classList.toggle('sel', o === b)); pick[r.dataset.k] = +b.dataset.v; })));
    el.querySelector('.check-btn').onclick = () => {
      if (Object.keys(pick).length < s.items.length) { api.toast('Chọn Đúng hoặc Sai cho tất cả các ý'); return; }
      let nOk = 0; el.querySelectorAll('.ds .r').forEach(r => { const it = s.items[r.dataset.k]; const ok = pick[r.dataset.k] === (it[1] ? 1 : 0); if (ok) nOk++; r.classList.add(ok ? 'ok' : 'no'); });
      el.querySelector('.ds').classList.add('done'); el.querySelector('.check-btn').textContent = `Em đúng ${nOk}/${s.items.length} ý`; el.querySelector('.check-btn').disabled = true;
      api.answer(i, nOk === s.items.length, { nOk, n: s.items.length });
    };
  },
};

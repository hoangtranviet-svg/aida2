// HS · Học mô-đun: mô hình 3D + luyện tập theo mục tiêu (ghi dấu vết để phân tích)
import * as D from '../core/data.js';
import { $, esc, toast } from '../core/util.js';
import { ic } from '../core/icons.js';
import { allQ, MOD, ERR, OBJ } from '../core/qbank.js';
import { moduleProgress } from '../core/insight.js';
import { statePill, objChip, L } from './parts.js';

const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export default {
  title: p => p.o ? 'Luyện tập cải thiện' : (MOD[p.code] ? `${MOD[p.code].bai}: ${MOD[p.code].title}` : 'Học mô-đun'),
  onData: (why, local, p) => why.type === 'module' && why.code === p.code && why.state === 'locked',
  render(el, ctx, p) {
    const c = D.cls(); const u = D.me();
    const code = p.code || allQ(c).find(q => q.o === p.o)?.m; const m = MOD[code];
    if (!m) { ctx.go('hs-lo-trinh'); return; }
    const st = c.modules[code]?.state || 'locked';
    if (st === 'locked' && !p.o) { el.innerHTML = `<div class="empty">${ic('lock')}<b>Mô-đun đang khoá</b><span>Thầy/cô sẽ mở mô-đun này theo lịch học.</span><a class="btn" href="#hs-lo-trinh">Về lộ trình</a></div>`; return; }
    const pool = allQ(c).filter(q => q.t === 'mc' && (p.o ? q.o === p.o : q.m === code));
    el.innerHTML = `<div class="row" style="margin-bottom:12px"><button class="btn ghost sm" id="back">${ic('arrowL')} ${p.o ? 'Việc cần làm' : 'Lộ trình'}</button>${statePill(st)}<span class="mono muted" style="font-size:12px">${code}</span>
      ${p.o ? `${objChip(p.o)}<span class="muted" style="font-size:12.5px">${esc((OBJ[p.o] || '').slice(0, 90))}…</span>` : ''}<span class="sp"></span><a class="btn sm" href="lab.html#${m.lab}" target="_blank" rel="noopener">${ic('arrowR')} Mở mô hình toàn màn hình</a></div>
      <div class="study"><div><iframe id="lab" title="Mô hình 3D ${esc(m.title)}" src="lab.html#${m.lab}" allow="fullscreen"></iframe>
        <p class="muted" style="font-size:12.5px;margin:8px 2px">Các bước em khám phá và câu trả lời được ghi lại để gợi ý cách học phù hợp với em.</p></div>
        <div class="card qpanel" id="quiz"></div></div>`;
    $('#back').onclick = () => ctx.go(p.o ? 'hs-viec-can-lam' : 'hs-lo-trinh');
    D.act.logEvent({ m: code, type: 'module_open', payload: { from: p.o ? 'remedy' : 'path' } });
    const onMsg = e => { const d = e.data; if (!d || d.source !== 'aida-lab') return; D.act.logEvent({ m: d.module || code, type: d.type, payload: d.payload || {}, ts: d.ts || Date.now() }); };
    addEventListener('message', onMsg);
    quiz($('#quiz'), pool, { title: p.o ? 'Luyện tập cải thiện' : 'Luyện tập', code, remedy: !!p.o, onStep: s => $('#lab')?.contentWindow?.postMessage({ aida: 'goStep', step: s }, '*') });
    return () => removeEventListener('message', onMsg);
  },
};

function quiz(box, qs, opt) {
  const c = D.cls(); const u = D.me(); let order = shuffle(qs); let i = 0; const res = []; let t0 = Date.now();
  if (!qs.length) { box.innerHTML = `<div class="empty">${ic('test')}<b>Chưa có câu luyện tập</b></div>`; return; }
  const draw = () => {
    if (i >= order.length) {
      const ok = res.filter(Boolean).length; const pr = moduleProgress(c, u.uid, opt.code);
      box.innerHTML = `<div class="stack" style="gap:12px"><span class="eyebrow">${esc(opt.title)}</span><h2 style="font-size:20px">Em đúng ${ok}/${order.length} câu ngay lần đầu</h2>
        <div><div class="row between" style="font-size:13px"><span>Tiến độ mô-đun</span><b class="num">${Math.round(pr.pct * 100)}%</b></div><div class="prog lg" style="margin-top:6px"><i style="width:${pr.pct * 100}%"></i></div></div>
        ${ok < order.length ? `<button class="btn pri" id="redo">${ic('repeat')} Làm lại các câu sai</button>` : `<div class="note">${ic('check')}<div>Tuyệt vời! ${opt.remedy ? 'Nhiệm vụ cải thiện sẽ được đánh dấu hoàn thành.' : 'Hãy chuyển sang mô-đun tiếp theo hoặc ôn lại sau 1–2 ngày.'}</div></div>`}
        <button class="btn" id="again">${ic('shuffle')} Luyện lại từ đầu</button></div>`;
      $('#redo', box)?.addEventListener('click', () => { order = order.filter((_, k) => !res[k]); res.length = 0; i = 0; draw(); });
      $('#again', box).onclick = () => { order = shuffle(qs); res.length = 0; i = 0; draw(); };
      return;
    }
    const q = order[i]; const idx = shuffle([0, 1, 2, 3]); t0 = Date.now();
    const tries = c.attempts.filter(a => a.s === u.uid && a.q === q.id).length;
    box.innerHTML = `<div class="row between"><span class="eyebrow">${esc(opt.title)}</span><span class="mono muted" style="font-size:12px">${i + 1}/${order.length}</span></div>
      <div class="prog" style="margin:8px 0 12px"><i style="width:${i / order.length * 100}%"></i></div>
      <div class="row" style="margin-bottom:8px">${objChip(q.o)}</div><div class="q-stem" style="font-weight:500">${esc(q.q)}</div>
      <div class="opts">${idx.map((k, j) => `<button type="button" class="opt" data-k="${k}"><span class="l">${L[j]}</span><span>${esc(q.a[k])}</span></button>`).join('')}</div><div id="fb"></div>`;
    box.querySelectorAll('.opt').forEach(b => (b.onclick = () => {
      const k = +b.dataset.k; const ok = k === q.k; const ms = Date.now() - t0;
      D.act.addAttempt({ m: q.m, q: q.id, o: q.o, choice: k, correct: ok, err: ok ? null : q.e?.[k], ms, tryNo: tries + 1, ctx: opt.remedy ? 'remedy' : 'module' });
      res[i] = res[i] ?? ok;
      box.querySelectorAll('.opt').forEach(x => { x.disabled = true; if (+x.dataset.k === q.k) x.classList.add('ok'); }); if (!ok) b.classList.add('no');
      const er = !ok && q.e?.[k] && ERR[q.e[k]];
      $('#fb', box).innerHTML = `<div class="explain"><b style="color:${ok ? 'var(--good)' : 'var(--bad)'}">${ok ? 'Chính xác!' : 'Chưa đúng.'}</b> ${esc(q.x || '')}${er ? `<div class="muted" style="margin-top:6px">Lỗi thường gặp <span class="mono">${q.e[k]}</span>: ${esc(er[0])}.</div>` : ''}</div>
        <div class="row" style="margin-top:10px">${!ok && q.s ? `<button class="btn" id="see">${ic('eye')} Xem lại bước ${q.s} trên mô hình</button>` : ''}<span class="sp"></span><button class="btn pri" id="next">${i === order.length - 1 ? 'Xem kết quả' : 'Câu tiếp'} ${ic('arrowR')}</button></div>`;
      $('#see', box)?.addEventListener('click', () => { opt.onStep(q.s); D.act.logEvent({ m: q.m, type: 'review_from_quiz', payload: { step: q.s, q: q.id } }); toast('Đã chuyển mô hình đến bước ' + q.s, 'eye'); });
      $('#next', box).onclick = () => { i++; draw(); };
    }));
  };
  draw();
}

// HS · Danh sách bài kiểm tra
import * as D from '../core/data.js';
import { esc, n1, dtime, dd, rel } from '../core/util.js';
import { ic } from '../core/icons.js';
import { finalSub, testResults } from '../core/insight.js';

export default {
  title: 'Kiểm tra',
  onData: why => ['test', 'sub'].includes(why.type),
  render(el, ctx) {
    const c = D.cls(); const u = D.me(); const now = Date.now();
    const online = c.tests.filter(t => t.kind === 'online' && t.status !== 'draft');
    const open = online.filter(t => t.status === 'open' && !finalSub(c, t.id, u.uid) && (!t.open || t.open <= now));
    const soon = online.filter(t => t.status === 'open' && t.open > now);
    const done = c.tests.filter(t => t.status !== 'draft' && (finalSub(c, t.id, u.uid) || (t.kind === 'paper' && t.scores?.[u.uid])));
    const card = (t, kind) => { const sub = finalSub(c, t.id, u.uid); const r = testResults(c, t).rows.find(x => x.sid === u.uid); const show = t.released || t.opts?.show === 'now';
      return `<div class="card" style="display:flex;flex-direction:column;gap:10px"><div class="row between"><span class="tag">${t.kind === 'online' ? 'Trực tuyến' : 'Bài giấy'} · ${{ tx: 'Thường xuyên', gk: 'Giữa kì', ck: 'Cuối kì' }[t.cat] || ''}</span>${kind === 'open' ? `<span class="pill p-open">Đang mở</span>` : kind === 'soon' ? `<span class="pill p-info">Mở ${dtime(t.open)}</span>` : show ? '<span class="pill p-good">Có kết quả</span>' : '<span class="pill p-lock">Chờ công bố</span>'}</div>
        <h3 style="font-size:16.5px">${esc(t.title)}</h3><span class="muted" style="font-size:12.5px">${t.items.length} câu · ${t.duration || '–'} phút${kind === 'open' && t.due ? ` · hạn ${dtime(t.due)} (${rel(t.due)})` : ''}${sub ? ` · nộp ${dtime(sub.end)}` : t.kind === 'paper' ? ` · ${dd(t.date)}` : ''}</span>
        ${kind === 'open' ? `<button class="btn pri" data-go="${t.id}">${ic('play')} Làm bài</button>` : kind === 'done' ? (show && r?.score10 != null ? `<div class="row"><b class="num" style="font:700 30px var(--display)">${n1(r.score10)}</b><span class="muted">/10${r.pending ? ' · chờ chấm tự luận' : ''}</span><span class="sp"></span><a class="btn sm" href="#hs-ket-qua">Xem chi tiết</a></div>` : '<span class="muted">Thầy/cô sẽ công bố kết quả sau.</span>') : ''}</div>`; };
    el.innerHTML = `${open.length ? `<div class="sect" style="margin-top:0"><h2>Đang mở</h2><div class="grid g3">${open.map(t => card(t, 'open')).join('')}</div></div>` : `<div class="empty">${ic('test')}<b>Không có bài kiểm tra đang mở</b><span>Khi thầy/cô giao bài, em sẽ nhận thông báo ngay.</span></div>`}
      ${soon.length ? `<div class="sect"><h2>Sắp mở</h2><div class="grid g3">${soon.map(t => card(t, 'soon')).join('')}</div></div>` : ''}
      ${done.length ? `<div class="sect"><h2>Đã làm</h2><div class="grid g3">${done.map(t => card(t, 'done')).join('')}</div></div>` : ''}`;
    el.querySelectorAll('[data-go]').forEach(b => (b.onclick = () => ctx.go('hs-lam-bai', { tid: b.dataset.go })));
  },
};

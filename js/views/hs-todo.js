// HS · Việc cần làm
import * as D from '../core/data.js';
import { esc, dueChip, DAY } from '../core/util.js';
import { ic } from '../core/icons.js';
import { todos } from '../core/insight.js';

const KIC = { module: ['cube', 'sun'], test: ['test', 'bad'], remedy: ['target', ''], review: ['repeat', 'good'] };
const KNAME = { module: 'Mô-đun', test: 'Kiểm tra', remedy: 'Cải thiện', review: 'Ôn tập' };

export default {
  title: 'Việc cần làm',
  onData: why => ['module', 'test', 'attempt', 'sub'].includes(why.type),
  render(el, ctx) {
    const c = D.cls(); const now = Date.now(); const T = todos(c, D.me().uid, now);
    const groups = [['Quá hạn', T.filter(t => !t.optional && t.due && t.due < now)], ['Trong 2 ngày tới', T.filter(t => !t.optional && t.due && t.due >= now && t.due - now < 2 * DAY)], ['Sắp tới', T.filter(t => !t.optional && (!t.due || t.due - now >= 2 * DAY))], ['Nên ôn lại (không bắt buộc)', T.filter(t => t.optional)]].filter(g => g[1].length);
    el.innerHTML = `<div class="lead"><p>Danh sách tự cập nhật khi thầy/cô mở mô-đun, giao bài kiểm tra hoặc khi em hoàn thành. Nhiệm vụ cải thiện xuất hiện sau mỗi bài kiểm tra cho những mục tiêu em đạt dưới 50%.</p></div>
      ${groups.length ? groups.map(([g, list]) => `<div class="sect"><h2>${g} <span class="muted" style="font-weight:500">· ${list.length}</span></h2><div class="card pad0"><div class="list">${list.map(t => `<div class="li" style="padding:14px 18px;flex-wrap:wrap"><span class="ic ${KIC[t.kind][1]}">${ic(KIC[t.kind][0])}</span>
        <div class="t" style="min-width:200px"><b>${esc(t.title)}</b><span>${KNAME[t.kind]} · ${esc(t.sub)}</span>${t.pct != null ? `<div class="prog" style="margin-top:6px;max-width:260px"><i style="width:${t.pct * 100}%"></i></div>` : ''}</div>
        ${t.optional ? '' : dueChip(t.due, false, now)}<button class="btn ${t.kind === 'test' ? 'pri' : ''} sm" data-i="${T.indexOf(t)}">${t.kind === 'test' ? 'Làm bài' : t.kind === 'remedy' ? 'Luyện tập' : 'Học tiếp'} ${ic('arrowR')}</button></div>`).join('')}</div></div></div>`).join('')
      : `<div class="empty">${ic('check')}<b>Em đã hoàn thành mọi việc!</b><span>Hãy ôn lại các mô-đun cũ sau 1 – 2 ngày để nhớ lâu hơn.</span></div>`}`;
    el.querySelectorAll('[data-i]').forEach(b => (b.onclick = () => { const t = T[+b.dataset.i]; if (t.kind === 'test') ctx.go('hs-lam-bai', { tid: t.tid }); else if (t.kind === 'remedy') ctx.go('hs-hoc', { o: t.o, code: t.module }); else ctx.go('hs-hoc', { code: t.code }); }));
  },
};

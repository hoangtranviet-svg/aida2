// HS · Lộ trình mô-đun
import * as D from '../core/data.js';
import { esc, dueChip } from '../core/util.js';
import { ic } from '../core/icons.js';
import { progress } from '../core/insight.js';
import { statePill, modIcon } from './parts.js';

export default {
  title: 'Lộ trình mô-đun',
  onData: why => ['module', 'attempt'].includes(why.type),
  render(el, ctx) {
    const c = D.cls(); const P = progress(c, D.me().uid); const chaps = [...new Set(P.mods.map(m => m.chap))];
    el.innerHTML = `<div class="lead"><p>16 mô-đun 3D của phần 1 – 3 sách Địa lí 10. Mô-đun mở theo lịch học của thầy/cô. Mỗi mô-đun: khám phá mô hình (40%) và luyện tập (60%).</p>
      <div class="row"><span class="pill p-open">${P.mods.filter(m => m.st.state === 'open').length} đang mở</span><span class="pill p-good">${P.nDone} đã hoàn thành</span></div></div>
      ${chaps.map(ch => `<div class="chap-h"><h2>${esc(ch.split(' – ')[1] || ch)}</h2><span>${esc(ch.split(' – ')[0])}</span></div><div class="mods">${P.mods.filter(m => m.chap === ch).map(m => { const can = m.st.state !== 'locked';
        return `<${can ? 'button type="button"' : 'div'} class="mod ${can ? 'can' : 'locked'}" ${can ? `data-code="${m.code}"` : ''} style="text-align:left;${can ? 'cursor:pointer' : ''}">
          <div class="thumb">${modIcon(m.code)}${!can ? `<span style="position:absolute;top:8px;right:8px">${ic('lock')}</span>` : ''}</div>
          <div class="row between"><span class="mod-n">${m.bai.toUpperCase()} · ${m.code}</span>${statePill(m.st.state)}</div>
          <div class="mod-t">${esc(m.title)}</div>
          ${can ? `<div><div class="meta"><span>${m.pr.done ? 'Đã hoàn thành' : m.pr.started ? 'Đang học' : 'Chưa bắt đầu'}</span><b class="num" style="color:var(--ink)">${Math.round(m.pr.pct * 100)}%</b></div><div class="prog ${m.pr.done ? 'land' : ''}" style="margin-top:6px"><i style="width:${m.pr.pct * 100}%"></i></div></div>
            <div class="meta">${m.st.state === 'open' ? dueChip(m.st.due, m.pr.done) : '<span>Xem lại bất cứ lúc nào</span>'}<span>${ic('arrowR')}</span></div>` : '<div class="meta"><span>Mở theo lịch học trên lớp</span></div>'}
        </${can ? 'button' : 'div'}>`; }).join('')}</div>`).join('')}`;
    el.querySelectorAll('[data-code]').forEach(b => (b.onclick = () => ctx.go('hs-hoc', { code: b.dataset.code })));
  },
};

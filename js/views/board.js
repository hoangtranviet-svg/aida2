// Bảng tin lớp (GV đăng, HS xem)
import * as D from '../core/data.js';
import { $, esc, rel, toast } from '../core/util.js';
import { ic } from '../core/icons.js';
import { confirmInline } from './parts.js';

export default {
  title: 'Bảng tin lớp',
  onData: why => why.type === 'post',
  render(el, ctx) {
    const c = D.cls(); const u = D.me(); const gv = u.role === 'gv';
    const posts = c.posts.slice().sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || b.ts - a.ts);
    el.innerHTML = `<div style="max-width:780px" class="stack">
      ${gv ? `<div class="card"><label class="field"><span>Thông báo mới cho ${esc(c.name)}</span><textarea class="inp" id="txt" rows="3" placeholder="VD: Thứ Năm kiểm tra 15 phút phần Khí quyển, các em ôn mô-đun Bài 9."></textarea></label>
        <div class="row" style="margin-top:10px"><label class="check"><input type="checkbox" id="pin"> Ghim lên đầu</label><span class="sp"></span><button class="btn pri" id="send">${ic('megaphone')} Đăng</button></div></div>` : ''}
      ${posts.length ? posts.map(p => `<article class="card"><div class="row"><span class="av sm gv">${esc(D.userName(p.by).split(' ').pop()[0])}</span><div style="flex:1;min-width:0"><b>${esc(D.userName(p.by))}</b><div class="muted" style="font-size:12px">${rel(p.ts)}</div></div>${p.pin ? `<span class="pill p-open plain">${ic('pin')} Đã ghim</span>` : ''}${gv ? `<button class="btn sm ghost" data-del="${p.id}" aria-label="Xoá">${ic('trash')}</button>` : ''}</div>
        <p style="margin-top:10px;white-space:pre-line">${esc(p.text)}</p></article>`).join('') : `<div class="empty">${ic('megaphone')}<b>Chưa có thông báo</b></div>`}</div>`;
    if (gv) {
      $('#send').onclick = () => { const t = $('#txt').value.trim(); if (!t) return; D.act.post({ text: t, pin: $('#pin').checked }); toast('Đã đăng thông báo', 'check'); };
      el.querySelectorAll('[data-del]').forEach(b => (b.onclick = () => confirmInline(b, 'Xoá?', () => D.act.delPost(b.dataset.del))));
    }
    D.act.readPosts(); ctx.badges();
  },
};

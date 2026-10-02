// Quản trị · Duyệt tài khoản giáo viên
import * as D from '../core/data.js';
import { esc, dtime, toast, initials } from '../core/util.js';
import { ic } from '../core/icons.js';
import { confirmInline } from './parts.js';

export default {
  title: 'Duyệt giáo viên',
  onData: why => why.type === 'approval',
  render(el) {
    const T = D.teachers(); const pend = T.filter(t => !t.approved && !t.rejected); const ok = T.filter(t => t.approved); const no = T.filter(t => t.rejected && !t.approved);
    const row = t => `<div class="li"><span class="av gv">${esc(initials(t.name))}</span><div class="t"><b>${esc(t.name)}${t.isAdmin ? ' <span class="pill p-info plain">Quản trị viên</span>' : ''}</b><span>${esc(t.email)} · đăng kí ${dtime(t.created)}</span></div>
      ${t.isAdmin ? '' : t.approved ? `<button class="btn sm ghost" data-no="${t.uid}">${ic('lock')} Thu hồi</button>` : `<button class="btn sm" data-no="${t.uid}">${ic('x')} Từ chối</button><button class="btn sm pri" data-ok="${t.uid}">${ic('check')} Duyệt</button>`}</div>`;
    el.innerHTML = `<div class="lead"><p>Mọi tài khoản đăng kí vai trò <b>Giáo viên</b> phải được duyệt mới tạo được lớp và xem dữ liệu học sinh. Quy tắc bảo mật trên máy chủ cũng chặn tài khoản chưa duyệt, nên không thể vượt qua bằng cách sửa giao diện. Học sinh đăng kí bằng mã lớp không cần duyệt.</p></div>
      <div class="kpis"><div class="kpi"><span class="k">Chờ duyệt</span><span class="v num">${pend.length}</span></div><div class="kpi"><span class="k">Đã duyệt</span><span class="v num">${ok.length}</span></div><div class="kpi"><span class="k">Từ chối / thu hồi</span><span class="v num">${no.length}</span></div></div>
      <div class="card"><div class="card-h"><h2>Chờ duyệt</h2></div>${pend.length ? `<div class="list">${pend.map(row).join('')}</div>` : `<div class="empty">${ic('check')}<b>Không có tài khoản nào đang chờ</b><span>Khi có giáo viên đăng kí, danh sách hiện ở đây ngay lập tức.</span></div>`}</div>
      <div class="grid g2" style="margin-top:16px"><div class="card"><div class="card-h"><h2>Đã duyệt</h2></div><div class="list">${ok.map(row).join('') || '<p class="muted">Chưa có.</p>'}</div></div>
      <div class="card"><div class="card-h"><h2>Từ chối / thu hồi</h2></div><div class="list">${no.map(row).join('') || '<p class="muted">Chưa có.</p>'}</div></div></div>`;
    const act = async (id, v) => { try { await D.approveTeacher(id, v); toast(v ? 'Đã duyệt tài khoản giáo viên' : 'Đã từ chối / thu hồi', v ? 'check' : 'lock'); } catch (e) { toast(e.message, 'alert'); } };
    el.querySelectorAll('[data-ok]').forEach(b => (b.onclick = () => act(b.dataset.ok, true)));
    el.querySelectorAll('[data-no]').forEach(b => (b.onclick = () => confirmInline(b, 'Bấm lần nữa để xác nhận', () => act(b.dataset.no, false))));
  },
};

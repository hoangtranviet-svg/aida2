// Cài đặt & dữ liệu
import * as D from '../core/data.js';
import { $, esc, toast, store } from '../core/util.js';
import { ic } from '../core/icons.js';
import { confirmInline } from './parts.js';

export default {
  title: 'Cài đặt & dữ liệu',
  onData: () => false,
  render(el, ctx) {
    const u = D.me(); const c = D.cls();
    el.innerHTML = `<div class="grid g2" style="align-items:start">
      <div class="card stack"><h2 style="font-size:16px">Tài khoản</h2>
        <div class="row"><span class="av ${u.role === 'gv' ? 'gv' : ''}">${esc(u.name.split(' ').pop()[0])}</span><div><b>${esc(u.name)}</b><div class="muted" style="font-size:12.5px">${esc(u.email)} · ${u.role === 'gv' ? 'Giáo viên' : 'Học sinh'}</div></div></div>
        <div class="divider"></div><h3 style="font-size:14.5px">Đổi mật khẩu</h3>
        <label class="field"><span>Mật khẩu hiện tại</span><input class="inp" type="password" id="o" autocomplete="current-password"></label>
        <label class="field"><span>Mật khẩu mới</span><input class="inp" type="password" id="n" autocomplete="new-password"></label>
        <div class="err-msg" id="er"></div><div><button class="btn pri" id="pw">Đổi mật khẩu</button></div>
        ${u.role === 'hs' ? `<div class="divider"></div><h3 style="font-size:14.5px">Vào thêm lớp</h3><div class="row"><input class="inp mono" id="code" maxlength="6" placeholder="Mã lớp" style="max-width:160px;text-transform:uppercase"><button class="btn" id="join">${ic('key')} Vào lớp</button></div>` : ''}
        <div class="divider"></div><h3 style="font-size:14.5px">Giao diện</h3><div class="seg" id="th">${[['', 'Theo máy'], ['light', 'Sáng'], ['dark', 'Tối']].map(([k, v]) => `<button type="button" data-v="${k}" class="${(store.get('aida2-theme') || '') === k ? 'on' : ''}">${v}</button>`).join('')}</div></div>
      <div class="card stack"><h2 style="font-size:16px">Dữ liệu và máy chủ</h2>
        ${D.MODE === 'demo' ? `<div class="note sun">${ic('info')}<div><b>Đang chạy thử trên trình duyệt.</b> Tài khoản, lớp và bài làm được lưu trong trình duyệt này và tự đồng bộ giữa các thẻ đang mở. Để cả lớp dùng chung trên nhiều thiết bị, cần nối máy chủ (Firebase) – giao diện và chức năng giữ nguyên.</div></div>` : `<div class="note">${ic('shield')}<div><b>Đang dùng máy chủ Firebase.</b> Dữ liệu lưu trên máy chủ, đồng bộ tức thì giữa các thiết bị. Học sinh chỉ xem được điểm, bài làm và nhận xét của chính mình.</div></div>`}
        <ul style="margin:0;padding-left:18px;font-size:13.5px;line-height:1.7"><li>${D.MODE === 'demo' ? 'Mật khẩu được băm SHA-256, không lưu dạng chữ.' : 'Mật khẩu do Firebase Authentication quản lí, giáo viên không xem được.'}</li><li>Nhật kí học tập xuất ra có thể ẩn danh hoá theo mã HS01, HS02…</li><li>${D.MODE === 'demo' ? 'Tệp bài giảng (ảnh, PDF) lưu ở bộ nhớ trình duyệt của máy đã tải lên.' : 'Ảnh bài giảng được nén và lưu trên máy chủ cùng dữ liệu lớp.'}</li></ul>
        ${c ? `<p class="muted" style="font-size:13px">Lớp đang mở: <b>${esc(c.name)}</b> · ${c.members.length} học sinh · ${c.events.length + c.attempts.length} lượt thao tác.</p>` : ''}
        ${D.CAN.reset ? `<div class="row"><button class="btn danger" id="reset">${ic('repeat')} Khôi phục dữ liệu mẫu</button></div>
        <p class="muted" style="font-size:12.5px">Khôi phục sẽ xoá mọi thay đổi trong bản chạy thử và đăng xuất. Tài khoản mẫu: gv@aida.demo / giaovien · hs05@aida.demo / hocsinh.</p>` : ''}</div></div>`;
    $('#pw').onclick = async () => { try { await D.changePassword($('#o').value, $('#n').value); $('#er').textContent = ''; $('#o').value = $('#n').value = ''; toast('Đã đổi mật khẩu', 'check'); } catch (e) { $('#er').textContent = e.message; } };
    $('#join')?.addEventListener('click', async () => { try { const k = await D.joinClass($('#code').value); toast('Đã vào ' + k.name, 'check'); location.hash = 'hs-tien-trinh'; } catch (e) { toast(e.message, 'alert'); } });
    el.querySelectorAll('#th button').forEach(b => (b.onclick = () => { store.set('aida2-theme', b.dataset.v || null); if (b.dataset.v) document.documentElement.dataset.theme = b.dataset.v; else delete document.documentElement.dataset.theme; ctx.refresh(); }));
    $('#reset') && ($('#reset').onclick = e => confirmInline(e.currentTarget, 'Bấm lần nữa để khôi phục', async () => { await D.resetDemo(); toast('Đã khôi phục dữ liệu mẫu', 'check'); location.hash = 'dang-nhap'; }));
  },
};

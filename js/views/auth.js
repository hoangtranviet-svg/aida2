// Đăng nhập, đăng kí, bắt đầu (tạo lớp / vào lớp)
import * as D from '../core/data.js';
import { $, esc, toast } from '../core/util.js';
import { ic, LOGO } from '../core/icons.js';
import { DEMO } from '../core/seed.js';
import { mountGlobe } from '../core/globe.js';

const art = (title, text) => `<section class="auth-art"><a class="logo" href="#gioi-thieu">${LOGO}<span><b>AIDA 2.0</b><small>ĐỊA LÍ · LỚP HỌC SỐ</small></span></a>
  <div><h1>${title}</h1><p>${text}</p></div>
  <div class="auth-coords">21°01′B · 105°51′Đ · Hà Nội — mã mục tiêu DL10.04.03</div></section>`;

function shell(el, title, text, form) {
  el.innerHTML = `<div class="auth fade-in">${art(title, text)}<section class="auth-form"><div class="auth-card">${form}</div></section></div>`;
  return mountGlobe($('.auth-art', el), { markers: [{ lat: 21, lon: 105.8 }], zoom: 3.4, speed: .05 });
}

const login = {
  bare: true, title: 'Đăng nhập',
  render(el, ctx) {
    const stop = shell(el, 'Học Địa lí bằng <em>mô hình 3D</em>, tiến bộ bằng dữ liệu của chính mình.', 'Thầy cô mở mô-đun theo lịch học, học sinh khám phá và luyện tập; hệ thống phân tích thói quen, lỗi sai để gợi ý cách học phù hợp.',
      `<div><h2>Đăng nhập</h2><p class="sub">Chào mừng trở lại lớp học số.</p></div>
      ${D.MODE === 'demo' ? `<div class="quick"><button type="button" data-demo="gv"><b>Giáo viên mẫu</b><span>${DEMO.gv.email}</span></button><button type="button" data-demo="hs"><b>Học sinh mẫu</b><span>${DEMO.hs.email}</span></button></div>
      <div class="or">hoặc dùng tài khoản của bạn</div>` : ''}
      <form class="stack" id="f" novalidate>
        <label class="field"><span>Email</span><input class="inp" id="email" type="email" autocomplete="email" placeholder="ten@truong.edu.vn" required></label>
        <label class="field"><span>Mật khẩu</span><input class="inp" id="pw" type="password" autocomplete="current-password" required></label>
        <label class="check"><input type="checkbox" id="keep" checked> Ghi nhớ trên thiết bị này</label>
        <div class="err-msg" id="err" role="alert"></div>
        <button class="btn pri lg block" type="submit">Đăng nhập ${ic('arrowR')}</button>
      </form>
      <p class="muted" style="text-align:center">Chưa có tài khoản? <a href="#dang-ki">Đăng kí</a></p>`);
    const go = async (email, password) => {
      $('#err').textContent = '';
      try { await D.login({ email, password, keep: $('#keep').checked }); ctx.go(''); }
      catch (e) { $('#err').textContent = e.message; }
    };
    $('#f').onsubmit = e => { e.preventDefault(); go($('#email').value, $('#pw').value); };
    el.querySelectorAll('[data-demo]').forEach(b => (b.onclick = () => { const k = DEMO[b.dataset.demo]; $('#email').value = k.email; $('#pw').value = k.pw; go(k.email, k.pw); }));
    return stop;
  },
};

const register = {
  bare: true, title: 'Đăng kí',
  render(el, ctx) {
    const stop = shell(el, 'Một lớp học, <em>một mã lớp</em>, cả năm học.', 'Giáo viên tạo lớp và nhận mã 6 kí tự. Học sinh đăng kí bằng email rồi nhập mã lớp để vào đúng lớp của mình.',
      `<div><h2>Tạo tài khoản</h2><p class="sub">Mất chưa đến một phút.</p></div>
      <form class="stack" id="f" novalidate>
        <div class="role-pick"><label><input type="radio" name="role" value="hs" checked> <span><b>Học sinh</b><br><small class="muted">Vào lớp bằng mã</small></span></label><label><input type="radio" name="role" value="gv"> <span><b>Giáo viên</b><br><small class="muted">Tạo và quản lí lớp</small></span></label></div>
        <label class="field"><span>Họ và tên</span><input class="inp" id="name" autocomplete="name" placeholder="Nguyễn Văn An" required></label>
        <label class="field"><span>Email</span><input class="inp" id="email" type="email" autocomplete="email" placeholder="ten@truong.edu.vn" required></label>
        <label class="field"><span>Mật khẩu</span><input class="inp" id="pw" type="password" autocomplete="new-password" placeholder="Ít nhất 6 kí tự" required></label>
        <label class="field" id="codeF"><span>Mã lớp</span><input class="inp mono" id="code" maxlength="6" placeholder="VD: DIA10A" style="text-transform:uppercase;letter-spacing:.12em" required><small>Thầy/cô sẽ cho em mã lớp.${D.MODE === 'demo' ? ` Lớp mẫu có mã ${DEMO.code}.` : ''}</small></label>
        <div class="err-msg" id="err" role="alert"></div>
        <button class="btn pri lg block" type="submit">Tạo tài khoản ${ic('arrowR')}</button>
      </form>
      <p class="muted" style="text-align:center">Đã có tài khoản? <a href="#dang-nhap">Đăng nhập</a></p>`);
    const sync = () => { $('#codeF').hidden = el.querySelector('[name=role]:checked').value !== 'hs'; };
    el.querySelectorAll('[name=role]').forEach(r => (r.onchange = sync));
    $('#f').onsubmit = async e => {
      e.preventDefault(); $('#err').textContent = '';
      try { const role = el.querySelector('[name=role]:checked').value; await D.register({ name: $('#name').value, email: $('#email').value, password: $('#pw').value, role, code: $('#code').value }); toast(role === 'gv' ? 'Đã tạo tài khoản. Hãy tạo lớp đầu tiên.' : 'Chào mừng em vào lớp!', 'check'); ctx.go(''); }
      catch (er) { $('#err').textContent = er.message; }
    };
    return stop;
  },
};

// Bắt đầu: GV tạo lớp, HS nhập mã lớp
const start = {
  title: 'Bắt đầu',
  render(el, ctx, params) {
    const u = D.me();
    if (u.role === 'gv') {
      el.innerHTML = `<div class="card" style="max-width:560px;margin:24px auto"><div class="stack" style="gap:14px">
        <span class="eyebrow">Bước 1</span><h2>Tạo lớp học</h2><p class="muted">Sau khi tạo, hệ thống cấp một mã lớp 6 kí tự để học sinh tự đăng kí vào lớp.</p>
        <label class="field"><span>Tên lớp</span><input class="inp" id="n" placeholder="Lớp 10A2"></label>
        <div class="row"><label class="field" style="flex:1"><span>Khối</span><select class="inp" id="g"><option>10</option><option>11</option><option>12</option><option>6</option><option>7</option><option>8</option><option>9</option></select></label>
        <label class="field" style="flex:1"><span>Năm học</span><input class="inp" id="y" value="2026–2027"></label></div>
        <div class="err-msg" id="err"></div><button class="btn pri lg" id="ok">${ic('plus')} Tạo lớp</button></div></div>`;
      $('#ok').onclick = async () => { const n = $('#n').value.trim(); if (n.length < 2) { $('#err').textContent = 'Nhập tên lớp.'; return; } const c = await D.createClass({ name: n, grade: +$('#g').value, year: $('#y').value }); toast(`Đã tạo ${c.name} – mã lớp ${c.code}`, 'check'); location.hash = 'gv-lop'; };
    } else {
      el.innerHTML = `<div class="card" style="max-width:520px;margin:24px auto"><div class="stack" style="gap:14px">
        <span class="eyebrow">Vào lớp</span><h2>Nhập mã lớp</h2><p class="muted">Mã lớp gồm 6 kí tự do thầy/cô cung cấp.</p>
        <input class="inp mono" id="code" maxlength="6" placeholder="DIA10A" style="font-size:22px;letter-spacing:.2em;text-transform:uppercase;text-align:center;min-height:54px">
        <div class="err-msg" id="err"></div><button class="btn pri lg" id="ok">${ic('key')} Vào lớp</button></div></div>`;
      $('#ok').onclick = async () => { try { const c = await D.joinClass($('#code').value); toast('Đã vào ' + c.name, 'check'); location.hash = 'hs-tien-trinh'; } catch (e) { $('#err').textContent = e.message; } };
    }
  },
};
export default { pick: r => r === 'dang-ki' ? register : r === 'bat-dau' ? start : login };

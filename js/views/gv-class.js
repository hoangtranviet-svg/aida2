// GV · Lớp & học sinh
import * as D from '../core/data.js';
import { $, esc, pct, n1, rel, toast, modal, initials } from '../core/util.js';
import { ic } from '../core/icons.js';
import { progress, gradebook, levelCls } from '../core/insight.js';
import { studentDrawer, confirmInline } from './parts.js';

export default {
  title: 'Lớp & học sinh',
  onData: why => ['class', 'attempt', 'sub'].includes(why.type),
  render(el) {
    const c = D.cls(); const S = D.students(c); let q = '';
    const rows = S.map(s => { const P = progress(c, s.id); const gb = gradebook(c, s.id); const last = Math.max(0, ...c.events.filter(e => e.s === s.id).map(e => e.ts), ...c.attempts.filter(a => a.s === s.id).map(a => a.ts)); return { ...s, P, gb, last }; });
    el.innerHTML = `<div class="grid g2" style="margin-bottom:18px">
      <div class="card" style="background-image:var(--contour);background-size:260px"><span class="eyebrow">Mã lớp để học sinh tự đăng kí</span>
        <div class="row" style="margin-top:10px;gap:14px"><b class="mono" style="font-size:40px;letter-spacing:.18em;color:var(--ocean)">${esc(c.code)}</b>
          <button class="btn" id="copy">${ic('copy')} Sao chép</button><button class="btn ghost" id="newcode">${ic('repeat')} Đổi mã</button></div>
        <p class="muted" style="margin-top:10px">Học sinh vào trang, chọn <b>Đăng kí → Học sinh</b>, nhập họ tên, email, mật khẩu và mã lớp này.</p></div>
      <div class="card"><div class="card-h"><div><h2>${esc(c.name)}</h2><p>Khối ${c.grade} · năm học ${esc(c.year || '')}</p></div><button class="btn sm" id="rename">${ic('pen')} Đổi tên</button></div>
        <div class="row" style="gap:22px"><div><b class="num" style="font:650 28px var(--display)">${S.length}</b><div class="muted" style="font-size:12.5px">học sinh</div></div>
          <div><b class="num" style="font:650 28px var(--display)">${c.tests.length}</b><div class="muted" style="font-size:12.5px">bài kiểm tra</div></div>
          <div><b class="num" style="font:650 28px var(--display)">${Object.values(c.modules).filter(m => m.state !== 'locked').length}</b><div class="muted" style="font-size:12.5px">mô-đun đã mở</div></div></div>
        <div class="row" style="margin-top:14px"><button class="btn pri" id="import">${ic('upload')} Nhập danh sách lớp</button></div></div></div>
    <div class="toolbar"><div class="search">${ic('search')}<input class="inp" id="q" placeholder="Tìm học sinh"></div><span class="sp"></span><span class="muted" id="cnt"></span></div>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Học sinh</th><th>Email</th><th class="r">Hoàn thành mô-đun</th><th class="r">ĐTB môn</th><th>Mức</th><th>Hoạt động gần nhất</th><th></th></tr></thead><tbody id="tb"></tbody></table></div>`;
    const draw = () => {
      const list = rows.filter(r => !q || r.name.toLowerCase().includes(q) || r.email.includes(q));
      $('#cnt').textContent = `${list.length} học sinh`;
      $('#tb').innerHTML = list.map(r => `<tr class="click" data-sid="${r.id}"><td><div class="row" style="gap:10px;flex-wrap:nowrap"><span class="av sm">${esc(initials(r.name))}</span><b>${esc(r.name)}</b></div></td><td class="muted">${esc(r.email)}</td>
        <td class="r"><div class="row" style="justify-content:flex-end;flex-wrap:nowrap"><div class="prog" style="width:80px"><i style="width:${r.P.pctAvail * 100}%"></i></div><span class="num">${pct(r.P.pctAvail)}</span></div></td>
        <td class="r num"><b>${n1(r.gb.dtb)}</b></td><td>${r.gb.level ? `<span class="pill ${levelCls(r.gb.level)}">${r.gb.level}</span>` : '<span class="muted">–</span>'}</td>
        <td class="muted">${r.last ? rel(r.last) : 'Chưa hoạt động'}</td><td class="r"><button class="btn sm ghost" data-rm="${r.id}" aria-label="Xoá khỏi lớp">${ic('trash')}</button></td></tr>`).join('') || `<tr><td colspan="7"><div class="empty">${ic('users')}<b>Chưa có học sinh</b><span>Đưa mã lớp cho học sinh hoặc nhập danh sách lớp.</span></div></td></tr>`;
      el.querySelectorAll('tr[data-sid]').forEach(tr => (tr.onclick = e => { if (e.target.closest('[data-rm]')) return; studentDrawer(c, tr.dataset.sid); }));
      el.querySelectorAll('[data-rm]').forEach(b => (b.onclick = () => confirmInline(b, 'Bấm lần nữa để xoá', () => { D.act.removeMember(b.dataset.rm); toast('Đã xoá học sinh khỏi lớp', 'check'); })));
    };
    draw();
    $('#q').oninput = e => { q = e.target.value.trim().toLowerCase(); draw(); };
    $('#copy').onclick = async () => { try { await navigator.clipboard.writeText(c.code); toast('Đã sao chép mã lớp ' + c.code, 'copy'); } catch (e) { toast('Mã lớp: ' + c.code, 'copy'); } };
    $('#newcode').onclick = e => confirmInline(e.currentTarget, 'Mã cũ sẽ hết hiệu lực – bấm lại', () => { const k = D.act.newCode(); toast('Mã lớp mới: ' + k, 'key'); });
    $('#rename').onclick = () => { const m = modal({ title: 'Đổi tên lớp', body: `<input class="inp" id="nn" value="${esc(c.name)}">`, foot: '<button class="btn pri" id="ok">Lưu</button>' }); m.el.querySelector('#ok').onclick = () => { D.act.renameClass(m.el.querySelector('#nn').value.trim() || c.name); m.close(); }; };
    $('#import').onclick = () => {
      const m = modal({ title: 'Nhập danh sách lớp', wide: true, body: `<div class="stack"><p class="muted">Dán từ Excel hai cột: <b>Họ và tên</b> và <b>Email</b> (mỗi học sinh một dòng). Hệ thống tạo tài khoản và thêm vào lớp; học sinh đăng nhập bằng email và mật khẩu ban đầu dưới đây, sau đó tự đổi mật khẩu.</p>
        <textarea class="inp mono" id="ta" rows="9" placeholder="Nguyễn Văn An	an.nv@truong.edu.vn&#10;Trần Thị Bình	binh.tt@truong.edu.vn"></textarea>
        <label class="field" style="max-width:280px"><span>Mật khẩu ban đầu</span><input class="inp mono" id="pw" value="hocsinh2026"></label><div class="err-msg" id="er"></div></div>`, foot: '<button class="btn pri" id="ok">Tạo tài khoản</button>' });
      m.el.querySelector('#ok').onclick = async () => {
        const rows = m.el.querySelector('#ta').value.split(/\n/).map(l => l.split(/\t|;|,(?=\s*\S+@)/).map(x => x.trim())).filter(a => a[0]).map(([name, email]) => ({ name, email }));
        if (!rows.length) { m.el.querySelector('#er').textContent = 'Chưa có dòng nào.'; return; }
        const pw = m.el.querySelector('#pw').value; if (pw.length < 6) { m.el.querySelector('#er').textContent = 'Mật khẩu ban đầu cần ít nhất 6 kí tự.'; return; }
        const r = await D.addStudents(rows, pw); m.close(); toast(`Đã thêm ${r.made} tài khoản mới${r.skipped.length ? `, bỏ qua ${r.skipped.length} dòng (email sai hoặc đã có tài khoản – em đó tự vào lớp bằng mã)` : ''}`, 'users');
      };
    };
  },
};

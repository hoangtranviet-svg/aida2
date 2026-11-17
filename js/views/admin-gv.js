// Quản trị · Toàn bộ tài khoản giáo viên: lớp phụ trách, học sinh, nội dung đã tạo và nhật kí hoạt động
import * as D from '../core/data.js';
import { esc, dtime, dd, rel, modal, initials, saveFile, pct } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MOD } from '../core/qbank.js';
import { TYPES } from '../core/gvlog.js';

const DAY = 864e5;
let cache = null, loading = null;
const st = t => t.isAdmin ? ['Quản trị viên', 'p-info'] : t.approved ? ['Đã duyệt', 'p-good'] : t.rejected ? ['Từ chối / thu hồi', 'p-bad'] : ['Chờ duyệt', 'p-warn'];
const MS = { open: 'Đang mở', review: 'Ôn tập', locked: 'Khoá' };

function summarize(data) {
  const now = Date.now();
  return data.teachers.map(t => {
    const C = data.classes.filter(c => c.teacher === t.uid);
    const sids = new Set(C.flatMap(c => c.members.map(m => m.id)));
    const act7 = new Set(C.flatMap(c => [...c.events, ...c.attempts].filter(e => e.ts > now - 7 * DAY).map(e => e.s)));
    const lastStud = Math.max(0, ...C.flatMap(c => [...c.events, ...c.attempts].map(e => e.ts || 0)));
    // nhật kí: mục ghi tự động + mốc suy ra từ dữ liệu cũ (trước khi bật ghi nhật kí)
    const log = [];
    C.forEach(c => {
      const first = Math.min(...c.gvlog.map(e => e.ts), Infinity);
      c.gvlog.forEach(e => log.push({ ...e, c: c.name }));
      const old = (ts, t, d) => { if (ts && ts < first - 5000) log.push({ ts, t, d, c: c.name, derived: true }); };
      old(c.created, 'class', `tạo lớp ${c.name}`);
      Object.entries(c.modules || {}).forEach(([k, m]) => old(m.openedAt, 'module', `mở mô-đun ${k}`));
      c.posts.forEach(p => old(p.ts, 'post', `đăng thông báo: ${String(p.text || '').slice(0, 60)}`));
      c.tests.forEach(x => old(x.created || x.date, 'test', `bài kiểm tra “${x.title}”`));
      c.slides.forEach(x => old(x.ts, 'slide', `đưa bài giảng “${x.title}”`));
      c.notes.forEach(n => old(n.ts, 'note', 'viết nhận xét học sinh'));
    });
    log.sort((a, b) => b.ts - a.ts);
    const lastAct = Math.max(t.lastSeen || 0, log[0]?.ts || 0);
    return {
      t, C, log, students: sids.size, active7: act7.size, lastStud: lastStud || null, lastAct: lastAct || null,
      modOpen: C.reduce((a, c) => a + Object.values(c.modules || {}).filter(m => m.state !== 'locked').length, 0),
      tests: C.reduce((a, c) => a + c.tests.length, 0), subs: C.reduce((a, c) => a + c.subs.filter(s => s.end).length, 0),
      questions: C.reduce((a, c) => a + c.questions.length, 0), slides: C.reduce((a, c) => a + c.slides.length, 0),
      posts: C.reduce((a, c) => a + c.posts.length, 0), notes: C.reduce((a, c) => a + c.notes.length, 0),
      acts7: log.filter(e => e.ts > now - 7 * DAY).reduce((a, e) => a + (e.n || 1), 0),
    };
  });
}

function detail(r) {
  const { t } = r; const now = Date.now(); const [sl, sc] = st(t);
  const kv = (k, v) => `<div><div class="muted" style="font-size:12px">${k}</div><div style="font-weight:600">${v}</div></div>`;
  const classRows = r.C.map(c => {
    const a7 = new Set([...c.events, ...c.attempts].filter(e => e.ts > now - 7 * DAY).map(e => e.s)).size;
    const mods = Object.entries(c.modules || {}).filter(([, m]) => m.state !== 'locked');
    return `<tr><td><b>${esc(c.name)}</b><div class="muted" style="font-size:12px">${esc(c.year || '')} · mã <span class="mono">${esc(c.code || '')}</span></div></td>
      <td class="r">${c.members.length}</td><td class="r">${a7}<span class="muted"> (${pct(c.members.length ? a7 / c.members.length : null)})</span></td>
      <td>${mods.length ? mods.map(([k, m]) => `<span class="pill ${m.state === 'open' ? 'p-open' : 'p-review'} plain" data-tip="${esc(MOD[k]?.title || '')} · ${MS[m.state]}">${esc(MOD[k]?.bai || k)}</span>`).join(' ') : '<span class="muted">chưa mở</span>'}</td>
      <td class="r">${c.tests.length}<span class="muted"> · ${c.subs.filter(s => s.end).length} bài nộp</span></td><td class="r">${c.questions.length}</td><td class="r">${c.slides.length}</td><td class="r">${c.posts.length}</td><td class="r">${c.notes.length}</td>
      <td class="muted" style="white-space:nowrap">${c.created ? dd(c.created) : '–'}</td></tr>`;
  }).join('');
  const tests = r.C.flatMap(c => c.tests.map(x => ({ ...x, cn: c.name, nsub: c.subs.filter(s => s.tid === x.id && s.end).length, n: c.members.length }))).sort((a, b) => (b.created || b.date || 0) - (a.created || a.date || 0)).slice(0, 12);
  const posts = r.C.flatMap(c => c.posts.map(p => ({ ...p, cn: c.name }))).sort((a, b) => b.ts - a.ts).slice(0, 6);
  const slides = r.C.flatMap(c => c.slides.map(x => ({ ...x, cn: c.name }))).sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 8);
  const types = [...new Set(r.log.map(e => e.t))];
  const body = `<div class="stack" style="gap:16px">
    <div class="row" style="gap:12px;align-items:center"><span class="av gv" style="width:46px;height:46px;font-size:16px">${esc(initials(t.name))}</span><div><div style="font-size:18px;font-weight:700">${esc(t.name)}</div><div class="muted">${esc(t.email)}</div></div><span class="pill ${sc}">${sl}</span></div>
    <div class="card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px">
      ${kv('Ngày đăng kí', t.created ? dtime(t.created) : '–')}
      ${kv('Duyệt / thu hồi', t.reviewedAt ? `${dtime(t.reviewedAt)}${t.reviewedBy ? ` <span class="muted" style="font-weight:400">bởi ${esc(t.reviewedBy)}</span>` : ''}` : t.isAdmin ? 'Quản trị viên' : '–')}
      ${kv('Truy cập gần nhất', t.lastSeen ? `${dtime(t.lastSeen)} <span class="muted" style="font-weight:400">(${rel(t.lastSeen, now)})</span>` : '<span class="muted" style="font-weight:400">chưa ghi nhận</span>')}
      ${kv('Số lần truy cập', t.visits ? t.visits + ' lần' : '<span class="muted" style="font-weight:400">chưa ghi nhận</span>')}
      ${kv('Hoạt động gần nhất', r.lastAct ? rel(r.lastAct, now) : '–')}
      ${kv('Học sinh học gần nhất', r.lastStud ? rel(r.lastStud, now) : '–')}
    </div>
    <div class="kpis" style="margin:0">
      <div class="kpi"><span class="k">Lớp phụ trách</span><span class="v num">${r.C.length}</span></div>
      <div class="kpi"><span class="k">Học sinh</span><span class="v num">${r.students}</span><span class="d">${r.active7} em học trong 7 ngày</span></div>
      <div class="kpi"><span class="k">Bài kiểm tra</span><span class="v num">${r.tests}</span><span class="d">${r.subs} bài đã nộp</span></div>
      <div class="kpi"><span class="k">Câu hỏi ngân hàng</span><span class="v num">${r.questions}</span></div>
      <div class="kpi"><span class="k">Thao tác 7 ngày</span><span class="v num">${r.acts7}</span><span class="d">theo nhật kí hoạt động</span></div>
    </div>
    <div><h3 class="md-h">Lớp phụ trách</h3>${r.C.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Lớp</th><th class="r">HS</th><th class="r">Học 7 ngày</th><th>Mô-đun đã mở</th><th class="r">Kiểm tra</th><th class="r">Câu hỏi</th><th class="r">Bài giảng</th><th class="r">Thông báo</th><th class="r">Nhận xét</th><th>Tạo lớp</th></tr></thead><tbody>${classRows}</tbody></table></div>` : '<p class="muted">Giáo viên chưa tạo lớp nào.</p>'}</div>
    <div class="grid g2" style="gap:14px">
      <div class="card"><h3 class="md-h">Nhật kí hoạt động</h3>
        ${types.length ? `<div class="seg" id="agF" style="margin-bottom:10px;flex-wrap:wrap"><button type="button" class="on" data-f="">Tất cả</button>${types.map(k => `<button type="button" data-f="${k}">${TYPES[k] || k}</button>`).join('')}</div>` : ''}
        <ol class="md-tl" id="agL" style="max-height:420px">${r.log.slice(0, 200).map(e => `<li data-t="${e.t}"><b>${dtime(e.ts)}</b> <span class="muted">· ${esc(e.c)} · ${TYPES[e.t] || e.t}</span><div>${esc(e.d)}${e.n > 1 ? ` <span class="muted">(${e.n} lần)</span>` : ''}${e.derived ? ' <span class="muted" style="font-size:11.5px">· mốc từ dữ liệu</span>' : ''}</div></li>`).join('') || '<li class="muted">Chưa có hoạt động.</li>'}</ol></div>
      <div class="stack" style="gap:14px">
        <div class="card"><h3 class="md-h">Bài kiểm tra gần đây</h3>${tests.length ? tests.map(x => `<div class="row" style="gap:8px;padding:6px 0;border-bottom:1px solid var(--line);flex-wrap:nowrap"><div style="flex:1;min-width:0"><b>${esc(x.title)}</b><div class="muted" style="font-size:12px">${esc(x.cn)} · ${x.kind === 'paper' ? 'bài giấy' : 'trực tuyến'}${x.created || x.date ? ' · ' + dd(x.created || x.date) : ''}</div></div><span class="muted" style="font-size:12.5px;white-space:nowrap">${x.kind === 'paper' ? `${Object.keys(x.scores || {}).length} điểm` : `${x.nsub}/${x.n} nộp`}</span></div>`).join('') : '<p class="muted">Chưa có.</p>'}</div>
        <div class="card"><h3 class="md-h">Thông báo gần đây</h3>${posts.length ? posts.map(p => `<div style="padding:6px 0;border-bottom:1px solid var(--line)"><div class="muted" style="font-size:12px">${dtime(p.ts)} · ${esc(p.cn)}${p.pin ? ' · ghim' : ''}</div><div style="font-size:13.5px">${esc(String(p.text || '').slice(0, 220))}</div></div>`).join('') : '<p class="muted">Chưa có.</p>'}</div>
        <div class="card"><h3 class="md-h">Bài giảng đã đưa lên</h3>${slides.length ? slides.map(x => `<div style="padding:5px 0;font-size:13.5px">${esc(x.title)} <span class="muted" style="font-size:12px">· ${esc(x.cn)}${x.ts ? ' · ' + dd(x.ts) : ''}</span></div>`).join('') : '<p class="muted">Chưa có.</p>'}</div>
      </div>
    </div>
  </div>`;
  const dlg = modal({ title: 'Thông tin giáo viên', body, wide: true }); dlg.el.classList.add('xl');
  dlg.el.querySelectorAll('#agF button').forEach(b => (b.onclick = () => { dlg.el.querySelectorAll('#agF button').forEach(x => x.classList.toggle('on', x === b)); dlg.el.querySelectorAll('#agL li[data-t]').forEach(li => (li.hidden = !!b.dataset.f && li.dataset.t !== b.dataset.f)); }));
}

const RULES_HELP = `<div class="card" style="border-left:4px solid var(--warn)"><h2 style="margin-top:0">Cần cập nhật quy tắc bảo mật Firestore một lần</h2>
  <p>Hiện máy chủ chưa cho tài khoản quản trị đọc lớp học của giáo viên khác. Thầy làm theo các bước:</p>
  <ol><li>Mở <b>console.firebase.google.com</b> → chọn dự án của AIDA 2.0.</li><li>Vào <b>Firestore Database</b> → thẻ <b>Rules</b> (Quy tắc).</li><li>Xoá nội dung cũ, dán toàn bộ nội dung tệp <span class="mono">firestore.rules</span> mới (trong kho mã GitHub của web) → bấm <b>Publish</b>.</li><li>Quay lại trang này, bấm <b>Tải lại</b>.</li></ol>
  <p class="muted">Quy tắc mới chỉ cho phép đúng email quản trị viên <b>xem</b> (không sửa) dữ liệu của mọi lớp.</p></div>`;

export default {
  title: 'Giáo viên & hoạt động',
  onData: why => why.type === 'approval',
  render(el) {
    const draw = () => {
      if (!cache) { el.innerHTML = `<div class="card"><p class="muted">Đang tải dữ liệu của tất cả giáo viên…</p></div>`; return; }
      if (cache.err) { el.innerHTML = cache.err === 'RULES' ? RULES_HELP : `<div class="card"><p>Không tải được: ${esc(cache.err)}</p></div>`; el.insertAdjacentHTML('beforeend', `<p><button class="btn" data-reload>${ic('repeat')} Tải lại</button></p>`); el.querySelector('[data-reload]').onclick = load; return; }
      const R = summarize(cache).sort((a, b) => (b.lastAct || 0) - (a.lastAct || 0)); const now = Date.now();
      const nApproved = R.filter(r => r.t.approved).length, nPend = R.filter(r => !r.t.approved && !r.t.rejected).length;
      const act7 = R.filter(r => r.lastAct && r.lastAct > now - 7 * DAY).length;
      el.innerHTML = `<div class="lead"><p>Toàn bộ tài khoản <b>giáo viên</b>: lớp phụ trách, học sinh, nội dung đã tạo và <b>nhật kí hoạt động</b>. Chỉ quản trị viên xem được trang này; dữ liệu chỉ để xem, không sửa được của giáo viên. Mật khẩu không bao giờ hiển thị (hệ thống không lưu mật khẩu dạng đọc được).</p></div>
        <div class="kpis">
          <div class="kpi"><span class="k">Giáo viên</span><span class="v num">${R.length}</span><span class="d">${nApproved} đã duyệt · ${nPend} chờ duyệt</span></div>
          <div class="kpi"><span class="k">Hoạt động 7 ngày</span><span class="v num">${act7}</span><span class="d">giáo viên có truy cập / thao tác</span></div>
          <div class="kpi"><span class="k">Lớp học</span><span class="v num">${cache.classes.length}</span></div>
          <div class="kpi"><span class="k">Học sinh</span><span class="v num">${R.reduce((a, r) => a + r.students, 0)}</span><span class="d">${R.reduce((a, r) => a + r.active7, 0)} em học trong 7 ngày</span></div>
        </div>
        <div class="row" style="gap:10px;margin-bottom:12px"><input class="inp sm" id="agS" placeholder="Tìm tên, email…" style="max-width:260px"><span class="sp"></span>
          <span class="muted" style="font-size:12.5px">Cập nhật ${rel(cache.at, now)}</span><button class="btn sm" data-reload>${ic('repeat')} Tải lại</button><button class="btn sm" data-csv>${ic('download')} Tải bảng (CSV)</button></div>
        <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Giáo viên</th><th>Trạng thái</th><th>Truy cập gần nhất</th><th class="r">Lớp</th><th class="r">HS</th><th class="r">HS học 7 ngày</th><th class="r">Mô-đun mở</th><th class="r">Kiểm tra</th><th class="r">Câu hỏi</th><th class="r">Bài giảng</th><th class="r">Thông báo</th><th class="r">Thao tác 7 ngày</th></tr></thead>
        <tbody id="agT">${R.map((r, i) => { const [sl, sc] = st(r.t); return `<tr class="click" data-i="${i}" data-q="${esc((r.t.name + ' ' + r.t.email).toLowerCase())}">
          <td><div class="row" style="gap:8px;flex-wrap:nowrap"><span class="av gv sm">${esc(initials(r.t.name))}</span><div><b style="white-space:nowrap">${esc(r.t.name)}</b><div class="muted" style="font-size:12px">${esc(r.t.email)}</div></div></div></td>
          <td><span class="pill ${sc}">${sl}</span></td><td class="muted" style="white-space:nowrap">${r.lastAct ? rel(r.lastAct, now) : '–'}</td>
          <td class="r">${r.C.length}</td><td class="r">${r.students}</td><td class="r">${r.active7}</td><td class="r">${r.modOpen}</td><td class="r">${r.tests}</td><td class="r">${r.questions}</td><td class="r">${r.slides}</td><td class="r">${r.posts}</td><td class="r">${r.acts7 || '–'}</td></tr>`; }).join('')}</tbody></table></div>
        <p class="muted" style="font-size:12.5px;margin-top:10px">Bấm vào một giáo viên để xem đầy đủ: lớp, mô-đun đã mở, bài kiểm tra, thông báo, bài giảng và nhật kí hoạt động. Nhật kí thao tác được ghi từ ngày cập nhật tính năng này; hoạt động trước đó được suy ra từ dữ liệu sẵn có (ghi “mốc từ dữ liệu”).</p>`;
      el.querySelector('#agS').oninput = e => { const q = e.target.value.trim().toLowerCase(); el.querySelectorAll('#agT tr').forEach(tr => (tr.hidden = !!q && !tr.dataset.q.includes(q))); };
      el.querySelectorAll('#agT tr').forEach(tr => (tr.onclick = () => detail(R[+tr.dataset.i])));
      el.querySelector('[data-reload]').onclick = load;
      el.querySelector('[data-csv]').onclick = () => {
        const head = ['Họ tên', 'Email', 'Trạng thái', 'Ngày đăng kí', 'Truy cập gần nhất', 'Số lần truy cập', 'Số lớp', 'Tên lớp', 'Học sinh', 'HS học 7 ngày', 'Mô-đun đã mở', 'Bài kiểm tra', 'Bài đã nộp', 'Câu hỏi', 'Bài giảng', 'Thông báo', 'Nhận xét', 'Thao tác 7 ngày'];
        const lines = R.map(r => [r.t.name, r.t.email, st(r.t)[0], r.t.created ? dtime(r.t.created) : '', r.lastAct ? dtime(r.lastAct) : '', r.t.visits || '', r.C.length, r.C.map(c => c.name).join('; '), r.students, r.active7, r.modOpen, r.tests, r.subs, r.questions, r.slides, r.posts, r.notes, r.acts7]);
        saveFile('giao-vien-hoat-dong.csv', '﻿' + [head, ...lines].map(l => l.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n'), 'text/csv;charset=utf-8');
      };
    };
    const load = () => { cache = null; draw(); loading = D.adminOverview().then(d => { cache = d; }).catch(e => { cache = { err: e.message }; }).finally(() => { if (el.isConnected) draw(); }); };
    if (!cache || cache.err || Date.now() - cache.at > 5 * 60e3) load(); else draw();
  },
};

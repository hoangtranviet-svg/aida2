// AIDA 2.0 – khởi động, định tuyến, khung giao diện theo vai trò
import * as D from './core/data.js';
import { $, $$, esc, toast, initTips, getSample, store, initials } from './core/util.js';
import { ic, LOGO } from './core/icons.js';
import { MOD } from './core/qbank.js';

// ---------- menu theo vai trò ----------
const NAV = {
  gv: [
    ['Lớp học', [['gv-tong-quan', 'Tổng quan', 'home'], ['gv-lop', 'Lớp & học sinh', 'users'], ['gv-mo-dun', 'Mô-đun & lịch mở', 'unlock'], ['gv-bang-tin', 'Bảng tin', 'megaphone']]],
    ['Dạy học', [['gv-bai-giang', 'Bài giảng', 'slides'], ['gv-ngan-hang', 'Ngân hàng câu hỏi', 'bank'], ['gv-tao-de', 'Tạo đề tự động', 'wand']]],
    ['Đánh giá', [['gv-kiem-tra', 'Kiểm tra & chấm', 'grade'], ['gv-phan-tich', 'Phân tích bài kiểm tra', 'chart'], ['gv-thoi-quen', 'Thói quen & lỗi sai', 'pulse'], ['gv-nhan-xet', 'Nhận xét học sinh', 'comment'], ['gv-bao-cao', 'Báo cáo & xuất điểm', 'download']]],
  ],
  hs: [
    ['Học tập', [['hs-tien-trinh', 'Tiến trình của em', 'target'], ['hs-viec-can-lam', 'Việc cần làm', 'todo'], ['hs-lo-trinh', 'Lộ trình mô-đun', 'route'], ['hs-bai-giang', 'Bài giảng', 'slides']]],
    ['Đánh giá', [['hs-kiem-tra', 'Kiểm tra', 'test'], ['hs-ket-qua', 'Kết quả & nhận xét', 'chart'], ['hs-goi-y', 'Gợi ý cách học', 'spark']]],
    ['Lớp', [['hs-bang-tin', 'Bảng tin', 'megaphone']]],
  ],
};
const VIEWS = {
  'gioi-thieu': () => import('./views/landing.js'), 'dang-nhap': () => import('./views/auth.js'), 'dang-ki': () => import('./views/auth.js'), 'bat-dau': () => import('./views/auth.js'),
  'gv-tong-quan': () => import('./views/gv-overview.js'), 'gv-lop': () => import('./views/gv-class.js'), 'gv-mo-dun': () => import('./views/gv-modules.js'), 'gv-bang-tin': () => import('./views/board.js'),
  'gv-bai-giang': () => import('./views/slides.js'), 'gv-ngan-hang': () => import('./views/gv-bank.js'), 'gv-tao-de': () => import('./views/gv-testgen.js'),
  'gv-kiem-tra': () => import('./views/gv-tests.js'), 'gv-phan-tich': () => import('./views/gv-analysis.js'), 'gv-thoi-quen': () => import('./views/gv-habits.js'), 'gv-nhan-xet': () => import('./views/gv-comments.js'), 'gv-bao-cao': () => import('./views/gv-reports.js'),
  'hs-tien-trinh': () => import('./views/hs-progress.js'), 'hs-viec-can-lam': () => import('./views/hs-todo.js'), 'hs-lo-trinh': () => import('./views/hs-path.js'), 'hs-bai-giang': () => import('./views/slides.js'),
  'hs-kiem-tra': () => import('./views/hs-tests.js'), 'hs-ket-qua': () => import('./views/hs-results.js'), 'hs-goi-y': () => import('./views/hs-advice.js'), 'hs-bang-tin': () => import('./views/board.js'),
  'hs-hoc': () => import('./views/hs-study.js'), 'hs-lam-bai': () => import('./views/hs-exam.js'), 'cai-dat': () => import('./views/settings.js'),
};
const PUBLIC = ['gioi-thieu', 'dang-nhap', 'dang-ki'];
const FOCUS = ['hs-hoc', 'hs-lam-bai'];

const root = $('#root');
let cur = { route: null, params: {}, view: null, el: null, cleanup: null };
let goPending = false;
export const ctx = {
  go(route, params = {}) { cur.params = params; goPending = true; if (location.hash.slice(1) === route) { goPending = false; render(); } else location.hash = route; },
  get params() { return cur.params; },
  refresh() { renderView(); },
  badges() { paintBadges(); },
};

// ---------- giao diện sáng/tối ----------
function applyTheme(t) { if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; }
applyTheme(store.get('aida2-theme'));

// ---------- định tuyến ----------
addEventListener('hashchange', () => { if (!goPending) cur.params = {}; goPending = false; render(); });
function homeOf(u) { return u.role === 'gv' ? 'gv-tong-quan' : 'hs-tien-trinh'; }

async function render() {
  let route = location.hash.slice(1) || '';
  const u = D.me();
  if (!route) route = u ? homeOf(u) : 'gioi-thieu';
  if (!VIEWS[route]) route = u ? homeOf(u) : 'gioi-thieu';
  if (!u && !PUBLIC.includes(route)) route = 'dang-nhap';
  if (u && (route === 'dang-nhap' || route === 'dang-ki')) route = homeOf(u);
  if (u && route.startsWith('gv-') && u.role !== 'gv') route = homeOf(u);
  if (u && route.startsWith('hs-') && u.role !== 'hs') route = homeOf(u);
  if (u && !D.cls() && !PUBLIC.includes(route) && route !== 'cai-dat') route = 'bat-dau';
  if (route !== (location.hash.slice(1) || '')) history.replaceState(null, '', '#' + route);
  cur.cleanup?.(); cur.cleanup = null;
  cur.route = route;
  const mod = await VIEWS[route](); cur.view = mod.default || mod[route] || mod;
  if (cur.view.pick) cur.view = cur.view.pick(route);
  if (!u || cur.view.bare) { root.innerHTML = '<div id="page"></div>'; cur.el = $('#page'); }
  else { paintShell(u); cur.el = $('#page'); }
  renderView(true);
}
async function renderView(first = false) {
  const v = cur.view; if (!v || !cur.el) return;
  if (!first) { cur.cleanup?.(); cur.cleanup = null; }
  const top = $('.top .crumb h1'); if (top && v.title) top.textContent = typeof v.title === 'function' ? v.title(cur.params) : v.title;
  try { const r = await v.render(cur.el, ctx, cur.params); if (typeof r === 'function') cur.cleanup = r; }
  catch (e) { console.error(e); cur.el.innerHTML = `<div class="empty">${ic('alert')}<b>Không mở được trang này</b><span>${esc(e.message)}</span></div>`; }
  if (first) scrollTo(0, 0);
  paintBadges();
}

// ---------- khung ----------
function paintShell(u) {
  const c = D.cls(); const nav = NAV[u.role]; const focus = FOCUS.includes(cur.route);
  const title = cur.view?.title ? (typeof cur.view.title === 'function' ? cur.view.title(cur.params) : cur.view.title) : '';
  const group = nav.find(([, items]) => items.some(i => i[0] === cur.route))?.[0] || '';
  root.innerHTML = `<div class="app ${focus ? 'focus' : ''}">
    <aside class="side" aria-label="Menu chính">
      <div class="side-head"><a class="logo" href="#${homeOf(u)}">${LOGO}<span><b>AIDA 2.0</b><small>ĐỊA LÍ · LỚP HỌC SỐ</small></span></a></div>
      ${c ? `<button class="cls-card" data-act="classes" type="button"><div style="min-width:0"><div class="k">Mã lớp · ${esc(c.code)}</div><b>${esc(c.name)}</b></div><span class="chev">${ic('chevD')}</span></button>` : ''}
      <nav class="nav">${nav.map(([g, items]) => `<div class="nav-g">${g}</div>` + items.map(([r, t, i]) => `<a href="#${r}" class="${cur.route === r ? 'on' : ''}" data-r="${r}">${ic(i)}<span>${t}</span><span class="badge" data-badge="${r}" hidden></span></a>`).join('')).join('')}
        <div class="nav-g">Tài khoản</div><a href="#cai-dat" class="${cur.route === 'cai-dat' ? 'on' : ''}">${ic('settings')}<span>Cài đặt & dữ liệu</span></a></nav>
      <div class="side-foot"><span class="av ${u.role === 'gv' ? 'gv' : ''}">${esc(initials(u.name))}</span><div class="who"><b>${esc(u.name)}</b><span>${u.role === 'gv' ? 'Giáo viên' : 'Học sinh'}</span></div>
        <button class="icon-btn" data-act="theme" aria-label="Đổi giao diện sáng/tối" data-tip="Giao diện sáng / tối">${ic(document.documentElement.dataset.theme === 'dark' ? 'sun' : 'moon')}</button>
        <button class="icon-btn" data-act="logout" aria-label="Đăng xuất" data-tip="Đăng xuất">${ic('logout')}</button></div>
    </aside>
    <div class="scrim" data-act="close-nav"></div>
    <div class="main">
      <header class="top"><button class="icon-btn menu-btn" data-act="menu" aria-label="Mở menu">${ic('menu')}</button>
        <div class="crumb"><small>${esc(group || (c ? c.name : ''))}</small><h1>${esc(title)}</h1></div>
        ${D.MODE === 'demo' ? `<span class="demo-chip" data-tip="Dữ liệu lưu trong trình duyệt này. Khi nối máy chủ, dữ liệu dùng chung cho cả lớp.">${ic('info')}<span>Bản chạy thử</span></span>` : ''}
        <button class="icon-btn" data-act="board" aria-label="Bảng tin">${ic('bell')}<span class="dot" data-badge="bell" hidden></span></button>
      </header>
      <main id="page" class="page"></main>
    </div></div>`;
  const app = $('.app');
  app.addEventListener('click', e => {
    const a = e.target.closest('[data-act]');
    if (!a) { const ln = e.target.closest('.nav a, .logo'); if (ln) { app.classList.remove('nav-open'); if (ln.getAttribute('href') === '#' + cur.route) { e.preventDefault(); cur.params = {}; render(); } } return; }
    const k = a.dataset.act;
    if (k === 'menu') app.classList.add('nav-open');
    if (k === 'close-nav') app.classList.remove('nav-open');
    if (k === 'logout') { D.logout(); location.hash = 'dang-nhap'; }
    if (k === 'theme') { const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches); const t = dark ? 'light' : 'dark'; store.set('aida2-theme', t); applyTheme(t); a.innerHTML = ic(t === 'dark' ? 'sun' : 'moon'); }
    if (k === 'board') ctx.go(u.role === 'gv' ? 'gv-bang-tin' : 'hs-bang-tin');
    if (k === 'classes') classPicker(u);
  });
  const topEl = $('.top'); const onScroll = () => topEl.classList.toggle('scrolled', scrollY > 4); addEventListener('scroll', onScroll, { passive: true });
}

async function classPicker(u) {
  const { modal } = await import('./core/util.js');
  const list = D.myClasses();
  const m = modal({ title: 'Lớp của bạn', body: `<div class="list">${list.map(c => `<button class="li" style="width:100%;background:none;border:0;border-bottom:1px solid var(--line);text-align:left" data-cid="${c.id}"><span class="ic">${ic('users')}</span><span class="t"><b>${esc(c.name)}</b><span>Mã lớp ${esc(c.code)} · ${c.members.length} học sinh</span></span>${D.cls()?.id === c.id ? '<span class="pill p-good">Đang mở</span>' : ''}</button>`).join('')}</div>`,
    foot: u.role === 'gv' ? `<button class="btn pri" data-new>${ic('plus')} Tạo lớp mới</button>` : `<button class="btn pri" data-join>${ic('key')} Vào lớp bằng mã</button>` });
  m.el.querySelectorAll('[data-cid]').forEach(b => (b.onclick = async () => { await D.switchClass(b.dataset.cid); m.close(); render(); }));
  m.el.querySelector('[data-new],[data-join]')?.addEventListener('click', () => { m.close(); ctx.go('bat-dau', { add: true }); });
}

// ---------- huy hiệu số trên menu ----------
async function paintBadges() {
  const u = D.me(); const c = D.cls(); if (!u || !c) return;
  const set = (k, n) => $$(`[data-badge="${k}"]`).forEach(b => { b.hidden = !n; b.textContent = n > 99 ? '99+' : n; });
  const read = c.read?.[u.uid] || 0; const unread = c.posts.filter(p => p.ts > read && p.by !== u.uid).length;
  set('bell', unread); set(u.role === 'gv' ? 'gv-bang-tin' : 'hs-bang-tin', unread);
  if (u.role === 'hs') { const { todos } = await import('./core/insight.js'); set('hs-viec-can-lam', todos(c, u.uid).filter(t => !t.optional).length); set('hs-kiem-tra', c.tests.filter(t => t.kind === 'online' && t.status === 'open' && !c.subs.some(s => s.tid === t.id && s.uid === u.uid && s.end)).length); }
  else { const pend = c.subs.filter(s => s.end && c.tests.find(t => t.id === s.tid)?.items.some(it => it.t === 'tlu' && s.essay?.[it.qid] == null)).length; set('gv-kiem-tra', pend); }
}

// ---------- dữ liệu thay đổi (kể cả từ thẻ/thiết bị khác) ----------
D.subscribe((why, local) => {
  if (why.type === 'error') { toast(why.msg, 'alert'); return; }
  if (why.type === 'auth') { render(); return; }
  const u = D.me(); if (!u) return;
  if (why.type === 'reset') { location.hash = 'dang-nhap'; render(); return; }
  if (!local && u.role === 'hs' && why.cid === D.cls()?.id) {
    if (why.type === 'module' && why.state === 'open') { const m = MOD[why.code]; toast(`Thầy/cô vừa mở mô-đun ${m?.bai}: ${m?.title}`, 'unlock'); }
    if (why.type === 'test' && why.status === 'open') toast('Có bài kiểm tra mới đang mở', 'test');
    if (why.type === 'post') toast('Bảng tin lớp có thông báo mới', 'megaphone');
  }
  if (!local && u.role === 'gv' && why.type === 'sub' && why.final) toast('Một học sinh vừa nộp bài kiểm tra', 'test');
  if (why.silent) return;
  const v = cur.view; if (!v || !cur.el) return;
  const policy = v.onData ? v.onData(why, local, cur.params) : !local;
  if (policy) renderView(); else paintBadges();
});

// ---------- khởi động ----------
(async () => {
  try { await D.init(); } catch (e) { root.innerHTML = `<p style="padding:24px">Không khởi động được: ${esc(e.message)}</p>`; return; }
  initTips(); getSample(); render();
})();

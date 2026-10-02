// Bài giảng: GV tải lên (ảnh slide, PDF, liên kết, soạn nhanh); HS xem theo mô-đun đã mở
import * as D from '../core/data.js';
import { $, esc, dd, toast, modal, uid } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MODULES, MOD } from '../core/qbank.js';
import { confirmInline } from './parts.js';

const KIND = { images: 'Ảnh slide', pdf: 'Tệp PDF', link: 'Liên kết', text: 'Soạn nhanh' };
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs';

export default {
  title: 'Bài giảng',
  onData: why => why.type === 'slide' || why.type === 'module',
  render(el) {
    const c = D.cls(); const gv = D.me().role === 'gv';
    const list = c.slides.filter(s => gv || !s.m || (c.modules[s.m]?.state || 'locked') !== 'locked').sort((a, b) => b.ts - a.ts);
    el.innerHTML = `<div class="lead"><p>${gv ? 'Đưa bài giảng lên theo từng mô-đun. Học sinh chỉ thấy bài giảng của mô-đun đã mở. Xuất slide PowerPoint thành ảnh (Tệp → Xuất → PNG) hoặc PDF để hiển thị đẹp trên mọi thiết bị.' : 'Bài giảng của các mô-đun thầy cô đã mở.'}</p>
      ${gv ? `<div class="acts"><button class="btn pri" id="add">${ic('upload')} Thêm bài giảng</button></div>` : ''}</div>
      ${list.length ? `<div class="g3 grid">${list.map(s => `<div class="card" style="display:flex;flex-direction:column;gap:10px">
        <div class="mod" style="padding:0;border:0;box-shadow:none"><div class="thumb">${ic(s.kind === 'link' ? 'arrowR' : s.kind === 'pdf' ? 'file' : 'slides')}</div></div>
        <div><span class="mono muted" style="font-size:11.5px">${s.m ? esc(MOD[s.m]?.bai + ' · ' + s.m) : 'Chung'}</span><h3 style="font-size:16px;margin-top:3px">${esc(s.title)}</h3></div>
        <div class="row"><span class="tag">${KIND[s.kind]}</span>${s.pages ? `<span class="tag">${s.pages.length} trang</span>` : ''}${s.n ? `<span class="tag">${s.n} trang</span>` : ''}<span class="muted" style="font-size:12px">${dd(s.ts)}</span></div>
        <div class="row" style="margin-top:auto"><button class="btn pri sm" data-open="${s.id}">${ic('play')} Xem</button>${gv ? `<button class="btn sm ghost" data-del="${s.id}" aria-label="Xoá">${ic('trash')}</button>` : ''}</div></div>`).join('')}</div>`
        : `<div class="empty">${ic('slides')}<b>Chưa có bài giảng</b><span>${gv ? 'Bấm “Thêm bài giảng” để tải ảnh slide, PDF hoặc dán liên kết.' : 'Thầy cô chưa đưa bài giảng cho các mô-đun đang mở.'}</span></div>`}`;
    el.querySelectorAll('[data-open]').forEach(b => (b.onclick = () => viewer(c.slides.find(s => s.id === b.dataset.open))));
    el.querySelectorAll('[data-del]').forEach(b => (b.onclick = () => confirmInline(b, 'Xoá?', () => { const s = c.slides.find(x => x.id === b.dataset.del); (s.files || []).forEach(D.delFile); D.act.delSlide(s.id); })));
    $('#add')?.addEventListener('click', addDialog);
  },
};

function addDialog() {
  let kind = 'images';
  const m = modal({ title: 'Thêm bài giảng', wide: true, body: `<div class="stack" style="gap:14px">
    <div class="row"><label class="field" style="flex:2;min-width:220px"><span>Tên bài giảng</span><input class="inp" id="t" placeholder="Bài 10 – Thực hành đọc bản đồ các đới khí hậu"></label>
      <label class="field" style="flex:1;min-width:180px"><span>Gắn với mô-đun</span><select class="inp" id="m"><option value="">Chung cho lớp</option>${MODULES.map(x => `<option value="${x.code}">${x.bai} – ${esc(x.title)}</option>`).join('')}</select></label></div>
    <div class="tabs" id="tabs">${Object.entries(KIND).map(([k, v]) => `<button type="button" data-k="${k}" class="${k === kind ? 'on' : ''}">${v}</button>`).join('')}</div>
    <div id="pane"></div><div class="err-msg" id="er"></div></div>`, foot: `<button class="btn pri" id="ok">${ic('upload')} Đưa lên lớp</button>` });
  const E = s => m.el.querySelector(s);
  const pane = () => {
    E('#pane').innerHTML = {
      images: `<label class="field"><span>Chọn ảnh các slide (PNG/JPG, chọn nhiều ảnh cùng lúc – sắp theo tên tệp)</span><input class="inp" type="file" id="f" accept="image/*" multiple></label>`,
      pdf: `<label class="field"><span>Chọn tệp PDF bài giảng</span><input class="inp" type="file" id="f" accept="application/pdf"></label><small class="muted">PDF được hiển thị từng trang ngay trên web.</small>`,
      link: `<label class="field"><span>Liên kết Google Slides, Canva, OneDrive hoặc YouTube</span><input class="inp" id="u" placeholder="https://docs.google.com/presentation/d/…"></label><small class="muted">Nhớ bật quyền “Bất kì ai có liên kết đều xem được”.</small>`,
      text: `<label class="field"><span>Soạn nhanh: mỗi slide cách nhau một dòng trống; dòng đầu là tiêu đề, các dòng sau là ý chính</span><textarea class="inp" id="tx" rows="10" placeholder="Các đới khí hậu&#10;7 đới ở mỗi bán cầu&#10;Việt Nam thuộc đới nhiệt đới&#10;&#10;Nhiệm vụ&#10;Đọc bản đồ hình 10.1"></textarea></label>`,
    }[kind];
  };
  pane();
  E('#tabs').querySelectorAll('button').forEach(b => (b.onclick = () => { kind = b.dataset.k; E('#tabs').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); pane(); }));
  E('#ok').onclick = async () => {
    const title = E('#t').value.trim(); const mm = E('#m').value; E('#er').textContent = '';
    if (!title) { E('#er').textContent = 'Nhập tên bài giảng.'; return; }
    const s = { id: uid('sl'), title, m: mm || null, kind, by: D.me().uid, ts: Date.now() };
    if (kind === 'images' || kind === 'pdf') {
      const files = [...(E('#f').files || [])].sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true }));
      if (!files.length) { E('#er').textContent = 'Chọn tệp trước.'; return; }
      if (files.some(f => f.size > 25e6)) { E('#er').textContent = 'Mỗi tệp tối đa 25 MB.'; return; }
      let blobs = files;
      if (kind === 'pdf' && D.CAN.files === 'cloud') { E('#ok').disabled = true; E('#er').textContent = 'Đang chuyển các trang PDF thành ảnh…'; try { blobs = await pdfToImages(files[0]); s.kind = 'images'; } catch (e) { E('#ok').disabled = false; E('#er').textContent = 'Không đọc được PDF. Hãy xuất slide ra ảnh PNG rồi tải lên.'; return; } }
      E('#er').textContent = 'Đang tải lên…'; E('#ok').disabled = true;
      s.files = []; for (const f of blobs) { const id = uid('f'); await D.putFile(id, f); s.files.push(id); } s.n = s.kind === 'images' ? blobs.length : null;
    } else if (kind === 'link') {
      const u = E('#u').value.trim(); if (!/^https:\/\//.test(u)) { E('#er').textContent = 'Liên kết cần bắt đầu bằng https://'; return; } s.url = u;
    } else {
      const blocks = E('#tx').value.split(/\n\s*\n/).map(b => b.split('\n').map(x => x.trim()).filter(Boolean)).filter(b => b.length);
      if (!blocks.length) { E('#er').textContent = 'Chưa có nội dung.'; return; }
      s.pages = blocks.map(b => ({ k: mm || '', h: b[0], ul: b.slice(1) }));
    }
    D.act.addSlide(s); m.close(); toast('Đã đưa bài giảng lên lớp', 'check');
  };
}

async function loadPdf() { const lib = await import(/* @vite-ignore */ PDFJS); lib.GlobalWorkerOptions.workerSrc = PDFJS.replace('pdf.min.mjs', 'pdf.worker.min.mjs'); return lib; }
async function pdfToImages(file) {
  const lib = await loadPdf(); const pdf = await lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise; const out = [];
  for (let k = 1; k <= Math.min(pdf.numPages, 60); k++) { const pg = await pdf.getPage(k); const vp = pg.getViewport({ scale: 1.6 }); const cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height; await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise; out.push(await new Promise(r => cv.toBlob(r, 'image/jpeg', .85))); }
  return out;
}

// ---------- trình chiếu ----------
async function viewer(s) {
  if (!s) return;
  if (s.kind === 'link') { modal({ title: s.title, body: `<div class="stack"><p>Bài giảng nằm trên dịch vụ bên ngoài. Bấm để mở trong thẻ mới.</p><a class="btn pri" href="${esc(s.url)}" target="_blank" rel="noopener">${ic('arrowR')} Mở bài giảng</a><p class="muted mono" style="word-break:break-all;font-size:12px">${esc(s.url)}</p></div>` }); D.act.logEvent({ m: s.m, type: 'slide_open', payload: { id: s.id } }); return; }
  const m = modal({ title: s.title, wide: true, body: `<div class="deck" id="deck"><span class="muted">Đang tải…</span></div><div class="row" style="margin-top:10px"><span class="muted" style="font-size:12.5px">Dùng phím ← → để chuyển trang</span><span class="sp"></span><button class="btn sm" id="fs">${ic('eye')} Toàn màn hình</button></div>` });
  const deck = m.el.querySelector('#deck'); let pages = [], i = 0;
  D.act.logEvent({ m: s.m, type: 'slide_open', payload: { id: s.id } });
  try {
    if (s.kind === 'text') pages = s.pages.map(p => () => `<div class="tslide"><span class="k">${esc(p.k || '')}</span><h3>${esc(p.h)}</h3>${p.ul?.length ? `<ul>${p.ul.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</div>`);
    if (s.kind === 'images') { const urls = []; for (const id of s.files) { const b = await D.getFile(id); if (b) urls.push(URL.createObjectURL(b)); } pages = urls.map(u => () => `<img src="${u}" alt="">`); if (!urls.length) throw new Error('Tệp chỉ lưu trên máy đã tải lên.'); }
    if (s.kind === 'pdf') {
      const b = await D.getFile(s.files[0]); if (!b) throw new Error('Tệp PDF chỉ lưu trên máy đã tải lên (bản chạy thử).');
      const lib = await loadPdf();
      const pdf = await lib.getDocument({ data: new Uint8Array(await b.arrayBuffer()) }).promise;
      pages = Array.from({ length: pdf.numPages }, (_, k) => async () => { const pg = await pdf.getPage(k + 1); const vp = pg.getViewport({ scale: 1.6 }); const cv = document.createElement('canvas'); cv.width = vp.width; cv.height = vp.height; await pg.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise; return cv; });
    }
  } catch (e) { deck.innerHTML = `<div class="empty" style="background:none;border:0;color:#cfe0e6">${ic('alert')}<b style="color:#fff">Không hiển thị được bài giảng</b><span>${esc(e.message)}</span></div>`; return; }
  const show = async () => {
    const r = await pages[i](); deck.innerHTML = ''; if (typeof r === 'string') deck.innerHTML = r; else deck.append(r);
    deck.insertAdjacentHTML('beforeend', `<button class="nav-l" aria-label="Trang trước">${ic('chevL')}</button><button class="nav-r" aria-label="Trang sau">${ic('chevR')}</button><span class="cnt">${i + 1} / ${pages.length}</span>`);
    deck.querySelector('.nav-l').onclick = () => go(-1); deck.querySelector('.nav-r').onclick = () => go(1);
  };
  const go = d => { const n = Math.max(0, Math.min(pages.length - 1, i + d)); if (n !== i) { i = n; show(); } };
  const key = e => { if (!deck.isConnected) { removeEventListener('keydown', key); return; } if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
  addEventListener('keydown', key);
  m.el.querySelector('#fs').onclick = () => deck.requestFullscreen?.().catch(() => {});
  show();
}

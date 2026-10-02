// GV · Ngân hàng câu hỏi
import * as D from '../core/data.js';
import { $, esc, toast, modal, uid, saveFile } from '../core/util.js';
import { ic } from '../core/icons.js';
import { allQ, MODULES, MOD, TYPE_NAME, LEVEL_NAME, OBJ, ERR } from '../core/qbank.js';
import { qHTML, lvChip, objChip, confirmInline } from './parts.js';
import { buildXlsx, toBlob } from '../lib/office.js';

let F = { m: '', t: '', lv: '', q: '' }; let open = null;

export default {
  title: 'Ngân hàng câu hỏi',
  onData: why => why.type === 'bank',
  render(el, ctx) {
    const c = D.cls(); const Q = allQ(c);
    const count = (t, lv) => Q.filter(q => (!t || q.t === t) && (!lv || q.lv === lv)).length;
    el.innerHTML = `<div class="lead"><p>${Q.length} câu hỏi gắn mã mục tiêu và mức độ, đủ 4 dạng của Công văn 7991. Câu thầy cô tự thêm chỉ dùng trong lớp này. Có thể chỉnh lại mức độ từng câu.</p>
      <div class="acts"><button class="btn" id="tpl">${ic('excel')} Tải mẫu Excel</button><button class="btn" id="imp">${ic('upload')} Nhập từ Excel</button><button class="btn pri" id="add">${ic('plus')} Thêm câu hỏi</button></div></div>
    <div class="tbl-wrap" style="margin-bottom:16px"><table class="tbl"><thead><tr><th>Dạng câu</th>${['B', 'H', 'V'].map(l => `<th class="r">${LEVEL_NAME[l]}</th>`).join('')}<th class="r">Tổng</th></tr></thead>
      <tbody>${Object.keys(TYPE_NAME).map(t => `<tr><td>${TYPE_NAME[t]}</td>${['B', 'H', 'V'].map(l => `<td class="r num">${count(t, l)}</td>`).join('')}<td class="r num"><b>${count(t)}</b></td></tr>`).join('')}</tbody></table></div>
    <div class="toolbar"><div class="search">${ic('search')}<input class="inp" id="fq" placeholder="Tìm theo nội dung hoặc mã mục tiêu" value="${esc(F.q)}"></div>
      <select class="inp" id="fm"><option value="">Mọi bài</option>${MODULES.map(m => `<option value="${m.code}" ${F.m === m.code ? 'selected' : ''}>${m.bai} – ${esc(m.title)}</option>`).join('')}</select>
      <select class="inp" id="ft"><option value="">Mọi dạng</option>${Object.entries(TYPE_NAME).map(([k, v]) => `<option value="${k}" ${F.t === k ? 'selected' : ''}>${v}</option>`).join('')}</select>
      <select class="inp" id="fl"><option value="">Mọi mức độ</option>${Object.entries(LEVEL_NAME).map(([k, v]) => `<option value="${k}" ${F.lv === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
    <div id="list" class="stack"></div>`;
    const draw = () => {
      const s = F.q.toLowerCase();
      const L = Q.filter(q => (!F.m || q.m === F.m) && (!F.t || q.t === F.t) && (!F.lv || q.lv === F.lv) && (!s || q.q.toLowerCase().includes(s) || q.o.toLowerCase().includes(s) || q.id.toLowerCase().includes(s)));
      $('#list').innerHTML = `<p class="muted" style="font-size:13px">${L.length} câu</p>` + L.slice(0, 120).map(q => `<div class="card flat" style="padding:12px 14px">
        <div class="row" style="flex-wrap:nowrap;align-items:flex-start"><div style="flex:1;min-width:0;cursor:pointer" data-toggle="${q.id}">
          <div class="row" style="gap:6px;margin-bottom:4px"><span class="tag">${TYPE_NAME[q.t]}</span>${objChip(q.o)}<span class="mono muted" style="font-size:11px">${MOD[q.m]?.bai || ''}</span>${q.src === 'custom' ? '<span class="pill p-open plain">Câu của lớp</span>' : ''}</div>
          <div style="font-size:14px">${esc(q.q.length > 180 ? q.q.slice(0, 180) + '…' : q.q)}</div></div>
          <div class="row" style="gap:6px;flex-wrap:nowrap"><div class="seg" data-lv="${q.id}">${['B', 'H', 'V'].map(l => `<button type="button" class="${q.lv === l ? 'on' : ''}" data-v="${l}" data-tip="${LEVEL_NAME[l]}">${l}</button>`).join('')}</div>
          ${q.src === 'custom' ? `<button class="btn sm ghost" data-del="${q.id}" aria-label="Xoá">${ic('trash')}</button>` : ''}</div></div>
        ${open === q.id ? `<div style="margin-top:12px">${qHTML(q, { no: '', mode: 'preview', ans: q.t === 'mc' ? q.k : q.t === 'ds' ? q.k : q.t === 'tln' ? q.k : '' })}</div>` : ''}</div>`).join('') + (L.length > 120 ? `<p class="muted">Đang hiện 120 câu đầu – lọc thêm để thu hẹp.</p>` : '');
      el.querySelectorAll('[data-toggle]').forEach(d => (d.onclick = () => { open = open === d.dataset.toggle ? null : d.dataset.toggle; draw(); }));
      el.querySelectorAll('.seg[data-lv] button').forEach(b => (b.onclick = () => { D.act.setLevel(b.parentElement.dataset.lv, b.dataset.v); toast('Đã đổi mức độ', 'check'); }));
      el.querySelectorAll('[data-del]').forEach(b => (b.onclick = () => confirmInline(b, 'Xoá?', () => D.act.delQuestion(b.dataset.del))));
    };
    draw();
    $('#fq').oninput = e => { F.q = e.target.value; draw(); };
    [['#fm', 'm'], ['#ft', 't'], ['#fl', 'lv']].forEach(([s, k]) => ($(s).onchange = e => { F[k] = e.target.value; draw(); }));
    $('#add').onclick = () => editor();
    $('#tpl').onclick = () => saveFile('Mau_ngan_hang_cau_hoi_AIDA.xlsx', toBlob(buildXlsx([{ name: 'Câu hỏi', header: true, freeze: 'A2', widths: [8, 11, 13, 6, 60, 22, 22, 22, 22, 9, 40], rows: [HEAD,
      ['mc', 'DL10.B09', 'DL10.04.04', 'B', 'Gió Đông cực thổi từ', 'áp cao cực về áp thấp ôn đới', 'áp thấp ôn đới về áp cao cực', 'áp cao cận chí tuyến về xích đạo', 'xích đạo về áp cao cận chí tuyến', 'A', 'Gió luôn thổi từ áp cao về áp thấp.'],
      ['ds', 'DL10.B09', 'DL10.04.02', 'H', 'Cho thông tin về nhiệt độ không khí.', 'Nhiệt độ giảm dần từ xích đạo về cực.', 'Lên cao nhiệt độ tăng.', 'Lục địa có biên độ nhiệt lớn hơn đại dương.', 'Đại dương nóng lên nhanh hơn lục địa.', 'ĐSĐS', ''],
      ['tln', 'DL10.B19', 'DL10.08.08', 'V', 'Tỉ suất sinh thô 20‰, tử thô 7‰. Tỉ suất gia tăng tự nhiên là bao nhiêu %?', '', '', '', '', '1,3', 'Đơn vị: %'],
      ['tlu', 'DL10.B12', 'DL10.05.09', 'H', 'Trình bày tác động của dòng biển nóng, lạnh đến khí hậu ven bờ.', 'Dòng biển nóng làm khí hậu ấm, ẩm, mưa nhiều (0,5)', 'Dòng biển lạnh làm khí hậu khô, ít mưa (0,5)', '', '', '', 'Ghi mỗi ý chấm vào một cột A–D, điểm trong ngoặc']] }]), 'xlsx'));
    $('#imp').onclick = () => importDialog(c);
  },
};

const HEAD = ['Dạng (mc/ds/tln/tlu)', 'Mô-đun', 'Mã mục tiêu', 'Mức (B/H/V)', 'Câu hỏi / dẫn', 'A / ý a / ý chấm 1', 'B / ý b / ý chấm 2', 'C / ý c / ý chấm 3', 'D / ý d / ý chấm 4', 'Đáp án', 'Giải thích'];

function fromRow(r) {
  const [t, m, o, lv, q, A, B, C, Dd, k, x] = r.map(v => String(v ?? '').trim());
  if (!['mc', 'ds', 'tln', 'tlu'].includes(t) || !q || !OBJ[o] || !MOD[m]) return null;
  const base = { id: uid('q'), t, m, o, lv: ['B', 'H', 'V'].includes(lv) ? lv : 'H', q, x, s: null };
  if (t === 'mc') { const kk = 'ABCD'.indexOf(k.toUpperCase()); if (kk < 0) return null; return { ...base, a: [A, B, C, Dd], k: kk, e: [0, 1, 2, 3].map(i => i === kk ? null : 'E27') }; }
  if (t === 'ds') { const s = k.toUpperCase().replace(/\s/g, ''); if (s.length !== 4) return null; return { ...base, st: [A, B, C, Dd], k: [...s].map(ch => ch === 'Đ' || ch === 'D' || ch === 'T'), e: [null, null, null, null] }; }
  if (t === 'tln') return k ? { ...base, k, tol: 0, unit: (x.match(/Đơn vị:\s*(.+)/) || [])[1] || '' } : null;
  const rub = [A, B, C, Dd].filter(Boolean).map(d => { const p = parseFloat(((d.match(/\(([\d.,]+)\)\s*$/) || [])[1] || '0.25').replace(',', '.')); return { d: d.replace(/\(([\d.,]+)\)\s*$/, '').trim(), p, kw: d.toLowerCase().split(/[,;]/).map(s => s.trim()).filter(s => s.length > 3).slice(0, 4) }; });
  return { ...base, rubric: rub };
}

function importDialog(c) {
  const m = modal({ title: 'Nhập câu hỏi từ Excel', wide: true, body: `<div class="stack"><p class="muted">Mở tệp mẫu, điền câu hỏi, chọn toàn bộ các dòng (không gồm dòng tiêu đề) rồi dán vào ô dưới. Mã mục tiêu phải đúng theo bảng mã hoá (ví dụ DL10.04.03).</p>
    <textarea class="inp mono" id="ta" rows="10" placeholder="Dán các dòng từ Excel vào đây"></textarea><div id="rs" class="muted"></div></div>`, foot: '<button class="btn pri" id="ok">Thêm vào ngân hàng</button>' });
  const ta = m.el.querySelector('#ta');
  const parse = () => ta.value.split('\n').filter(l => l.trim()).map(l => fromRow(l.split('\t')));
  ta.oninput = () => { const r = parse(); m.el.querySelector('#rs').textContent = `${r.filter(Boolean).length} câu hợp lệ · ${r.filter(x => !x).length} dòng lỗi`; };
  m.el.querySelector('#ok').onclick = () => { const r = parse().filter(Boolean); r.forEach(q => D.act.saveQuestion(q)); m.close(); toast(`Đã thêm ${r.length} câu hỏi`, 'check'); };
}

function editor() {
  let t = 'mc';
  const m = modal({ title: 'Thêm câu hỏi', wide: true, body: `<div class="stack" style="gap:12px">
    <div class="row"><label class="field" style="flex:1;min-width:150px"><span>Dạng câu</span><select class="inp" id="t">${Object.entries(TYPE_NAME).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
      <label class="field" style="flex:2;min-width:200px"><span>Mô-đun</span><select class="inp" id="m">${MODULES.map(x => `<option value="${x.code}">${x.bai} – ${esc(x.title)}</option>`).join('')}</select></label>
      <label class="field" style="flex:1;min-width:120px"><span>Mức độ</span><select class="inp" id="lv"><option value="B">Biết</option><option value="H">Hiểu</option><option value="V">Vận dụng</option></select></label></div>
    <label class="field"><span>Mã mục tiêu</span><select class="inp mono" id="o"></select></label>
    <label class="field"><span>Câu hỏi / phần dẫn</span><textarea class="inp" id="q" rows="3"></textarea></label>
    <div id="body"></div>
    <label class="field"><span>Giải thích đáp án</span><textarea class="inp" id="x" rows="2"></textarea></label><div class="err-msg" id="er"></div></div>`, foot: '<button class="btn pri" id="ok">Lưu câu hỏi</button>' });
  const E = s => m.el.querySelector(s);
  const objs = () => { const md = MOD[E('#m').value]; const chap = md?.code; const pre = Object.keys(OBJ).filter(o => o.startsWith('DL10.')); E('#o').innerHTML = pre.map(o => `<option value="${o}">${o} – ${esc(OBJ[o].slice(0, 90))}</option>`).join(''); const first = allQ(D.cls()).find(q => q.m === chap)?.o; if (first) E('#o').value = first; };
  const body = () => { t = E('#t').value; E('#body').innerHTML = t === 'mc' ? `<div class="grid g2" style="gap:8px">${'ABCD'.split('').map((l, i) => `<label class="field"><span>Phương án ${l}</span><input class="inp" data-a="${i}"></label>`).join('')}</div><label class="field" style="margin-top:8px;max-width:200px"><span>Đáp án đúng</span><select class="inp" id="k">${'ABCD'.split('').map((l, i) => `<option value="${i}">${l}</option>`).join('')}</select></label>`
    : t === 'ds' ? `<div class="stack" style="gap:8px">${'abcd'.split('').map((l, i) => `<div class="row" style="flex-wrap:nowrap"><b class="mono">${l})</b><input class="inp" data-a="${i}" placeholder="Nhận định ${l}"><select class="inp" data-k="${i}" style="width:100px"><option value="1">Đúng</option><option value="0">Sai</option></select></div>`).join('')}</div>`
    : t === 'tln' ? `<div class="row"><label class="field"><span>Đáp án (số)</span><input class="inp mono" id="k" placeholder="13,4"></label><label class="field"><span>Sai số cho phép</span><input class="inp mono" id="tol" value="0"></label><label class="field"><span>Đơn vị</span><input class="inp" id="unit" placeholder="°C"></label></div>`
    : `<div class="stack" style="gap:8px"><span class="lab">Các ý chấm (mỗi dòng: nội dung | điểm)</span><textarea class="inp" id="rub" rows="4" placeholder="Nêu đúng nguyên nhân do sức hút của Mặt Trăng, Mặt Trời | 0,5&#10;Nêu đúng thời điểm triều cường | 0,5"></textarea></div>`; };
  E('#m').onchange = objs; E('#t').onchange = body; objs(); body();
  E('#ok').onclick = () => {
    const q = { id: uid('q'), t, m: E('#m').value, o: E('#o').value, lv: E('#lv').value, q: E('#q').value.trim(), x: E('#x').value.trim(), s: null };
    if (!q.q) { E('#er').textContent = 'Nhập nội dung câu hỏi.'; return; }
    if (t === 'mc') { q.a = [...m.el.querySelectorAll('[data-a]')].map(i => i.value.trim()); q.k = +E('#k').value; q.e = q.a.map((_, i) => i === q.k ? null : 'E27'); if (q.a.some(a => !a)) { E('#er').textContent = 'Nhập đủ 4 phương án.'; return; } }
    if (t === 'ds') { q.st = [...m.el.querySelectorAll('[data-a]')].map(i => i.value.trim()); q.k = [...m.el.querySelectorAll('[data-k]')].map(s => s.value === '1'); q.e = [null, null, null, null]; if (q.st.some(a => !a)) { E('#er').textContent = 'Nhập đủ 4 nhận định.'; return; } }
    if (t === 'tln') { q.k = E('#k').value.trim(); q.tol = parseFloat(E('#tol').value.replace(',', '.')) || 0; q.unit = E('#unit').value.trim(); if (!q.k) { E('#er').textContent = 'Nhập đáp án.'; return; } }
    if (t === 'tlu') { q.rubric = E('#rub').value.split('\n').filter(l => l.trim()).map(l => { const [d, p] = l.split('|'); return { d: d.trim(), p: parseFloat(String(p || '0.25').replace(',', '.')) || .25, kw: d.toLowerCase().split(/[,;]| và /).map(s => s.trim()).filter(s => s.length > 3).slice(0, 4) }; }); if (!q.rubric.length) { E('#er').textContent = 'Nhập ít nhất một ý chấm.'; return; } }
    D.act.saveQuestion(q); m.close(); toast('Đã thêm câu hỏi vào ngân hàng của lớp', 'check');
  };
}

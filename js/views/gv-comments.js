// GV · Nhận xét học sinh (tham chiếu Thông tư 22/2021/TT-BGDĐT)
import * as D from '../core/data.js';
import { $, esc, n1, toast, getSample, dfull, initials } from '../core/util.js';
import { ic } from '../core/icons.js';
import { draftComment, levelCls } from '../core/insight.js';

let filter = 'all';
export default {
  title: 'Nhận xét học sinh',
  onData: () => false,
  render(el, ctx) {
    const c = D.cls(); const view = D.analyticsView(c); const S = D.students(c);
    const rows = S.map(s => ({ s, d: draftComment(c, s.id, view), note: c.notes[s.id] }));
    const list = rows.filter(r => filter === 'all' || (filter === 'todo' ? !r.note : r.note));
    el.innerHTML = `<div class="lead"><div><p>Điểm trung bình môn tính theo Thông tư 22: <span class="mono">ĐTBmhk = (TĐĐGtx + 2×ĐĐGgk + 3×ĐĐGck) / (số ĐĐGtx + 5)</span>; khi chưa có điểm giữa kì hoặc cuối kì, hệ thống tạm tính trên các đầu điểm hiện có. Mức tham chiếu: Tốt ≥ 8,0 · Khá ≥ 6,5 · Đạt ≥ 5,0. Lời nhận xét được soạn sẵn từ dữ liệu học tập; thầy cô sửa rồi lưu.</p></div>
      <div class="acts"><div class="seg" id="flt">${[['all', `Tất cả (${rows.length})`], ['todo', `Chưa lưu (${rows.filter(r => !r.note).length})`], ['done', `Đã lưu (${rows.filter(r => r.note).length})`]].map(([k, v]) => `<button type="button" data-v="${k}" class="${filter === k ? 'on' : ''}">${v}</button>`).join('')}</div>
      <button class="btn pri" id="all">${ic('check')} Lưu tất cả bản nháp</button></div></div>
    <div class="stack">${list.map(({ s, d, note }) => `<div class="card" data-sid="${s.id}"><div class="row" style="flex-wrap:wrap"><span class="av">${esc(initials(s.name))}</span><div style="flex:1;min-width:160px"><b>${esc(s.name)}</b><div class="muted" style="font-size:12.5px">${d.gb.marks.length} đầu điểm${d.gb.final ? '' : ' · tạm tính'}${note ? ' · đã lưu ' + dfull(note.ts) : ''}</div></div>
      <div class="row"><span class="muted" style="font-size:12.5px">ĐTB</span><b class="num" style="font:650 22px var(--display)">${n1(d.dtb)}</b>${d.level ? `<span class="pill ${levelCls(d.level)}">${d.level}</span>` : '<span class="pill p-lock">Chưa đủ điểm</span>'}</div></div>
      <textarea class="inp" rows="3" style="margin-top:12px" data-txt>${esc(note?.text || d.text)}</textarea>
      <div class="row" style="margin-top:8px"><span class="muted" style="font-size:12px">${d.sum.flags.slice(0, 2).map(f => esc(f.title)).join(' · ') || 'Không có cảnh báo thói quen'}</span><span class="sp"></span>
        <button class="btn sm ghost" data-reset>${ic('repeat')} Soạn lại</button><button class="btn sm" data-ai hidden>${ic('spark')} Viết lại bằng AI</button><button class="btn sm pri" data-save>${ic('check')} Lưu</button></div></div>`).join('') || `<div class="empty">${ic('comment')}<b>Không có học sinh trong mục này</b></div>`}</div>`;
    el.querySelectorAll('#flt button').forEach(b => (b.onclick = () => { filter = b.dataset.v; ctx.refresh(); }));
    const save = (card, quiet) => { const r = rows.find(x => x.s.id === card.dataset.sid); D.act.saveNote(r.s.id, { text: card.querySelector('[data-txt]').value.trim(), level: r.d.level, dtb: r.d.dtb }); if (!quiet) toast('Đã lưu nhận xét của ' + r.s.name, 'check'); };
    el.querySelectorAll('.card[data-sid]').forEach(card => {
      const r = rows.find(x => x.s.id === card.dataset.sid);
      card.querySelector('[data-save]').onclick = () => save(card);
      card.querySelector('[data-reset]').onclick = () => { card.querySelector('[data-txt]').value = r.d.text; };
      getSample().then(s => { if (!s) return; const b = card.querySelector('[data-ai]'); b.hidden = false; b.onclick = async () => {
        const ta = card.querySelector('[data-txt]'); b.disabled = true; const old = ta.value; ta.value = 'AI đang viết…';
        try { const out = await s(`Viết lại lời nhận xét học bạ môn Địa lí cho học sinh lớp 10 theo tinh thần Thông tư 22/2021/TT-BGDĐT: 2–3 câu, giọng khích lệ, nêu sự tiến bộ, ưu điểm nổi bật, hạn chế chủ yếu và đề nghị cụ thể. Không dùng tên học sinh, bắt đầu bằng "Em". Không thêm thông tin ngoài dữ liệu.\nDữ liệu: ĐTB ${r.d.dtb ?? 'chưa có'}; mức ${r.d.level ?? 'chưa xếp'}; bản nháp của hệ thống: ${old}`, { modelTier: 'quick', onText: ({ text }) => { ta.value = text; } }); ta.value = out.text.trim(); }
        catch (e) { ta.value = old; toast('AI chưa trả lời được', 'alert'); } finally { b.disabled = false; } }; });
    });
    $('#all').onclick = () => { el.querySelectorAll('.card[data-sid]').forEach(card => save(card, true)); toast(`Đã lưu ${el.querySelectorAll('.card[data-sid]').length} nhận xét`, 'check'); ctx.refresh(); };
  },
};

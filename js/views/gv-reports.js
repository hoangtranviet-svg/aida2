// GV · Báo cáo & xuất điểm (Excel cho vnEdu/SMAS, phiếu gửi phụ huynh)
import * as D from '../core/data.js';
import { $, esc, n1, pct, dd, dfull, saveFile, toast } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MOD, OBJ } from '../core/qbank.js';
import { gradebook, testResults, parentReport, levelCls } from '../core/insight.js';
import { buildXlsx, buildDocx, toBlob, csv } from '../lib/office.js';
import { STRATEGIES } from '../../app/analytics.js';
import { dossier, previewHTML, exportPDF, fileName } from './parent-report.js';

let pick = null;
export default {
  title: 'Báo cáo & xuất điểm',
  onData: () => false,
  render(el, ctx) {
    const c = D.cls(); const S = D.students(c); if (!S.some(s => s.id === pick)) pick = S[0]?.id;
    const tests = c.tests.filter(t => t.status !== 'draft').sort((a, b) => (a.date || 0) - (b.date || 0));
    el.innerHTML = `<div class="grid g3" style="margin-bottom:18px">
      <div class="card stack"><span class="ic" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--land-soft);color:var(--land)">${ic('excel')}</span><h3>Bảng điểm cả lớp</h3><p class="muted" style="font-size:13.5px">Tất cả bài kiểm tra, ĐTB môn theo TT 22, mức tham chiếu và lời nhận xét – một trang tính để chép sang vnEdu/SMAS.</p><button class="btn pri" id="xg">${ic('download')} Tải Excel</button></div>
      <div class="card stack"><span class="ic" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--ocean-soft);color:var(--ocean)">${ic('target')}</span><h3>Mức nắm vững theo mục tiêu</h3><p class="muted" style="font-size:13.5px">Ma trận học sinh × mã mục tiêu từ luyện tập và kiểm tra – dùng cho báo cáo chuyên môn, minh chứng dự án.</p><button class="btn" id="xm">${ic('download')} Tải Excel</button></div>
      <div class="card stack"><span class="ic" style="width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:var(--sun-soft);color:var(--warn)">${ic('pulse')}</span><h3>Nhật kí học tập</h3><p class="muted" style="font-size:13.5px">Toàn bộ thao tác trên mô hình và câu trả lời (ẩn danh hoá được) – dữ liệu gốc để nghiên cứu, đánh giá tác động.</p><button class="btn" id="xl">${ic('download')} Tải CSV</button></div></div>
    <div class="card"><div class="card-h"><div><h2>Phiếu báo cáo gửi phụ huynh</h2><p>2 trang A4: điểm các bài và bài giữa kì I, nhận xét của giáo viên, thời gian học trực tuyến, nỗ lực, mục tiêu đã đạt – cần cải thiện, thói quen và đề xuất</p></div>
      <div class="row" style="flex-wrap:wrap"><select class="inp" id="who" style="max-width:240px">${S.map(s => `<option value="${s.id}" ${s.id === pick ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select>
        <button class="btn pri" id="xpdf">${ic('download')} Tải PDF</button><button class="btn" id="xall">${ic('download')} PDF cả lớp</button><button class="btn ghost" id="xp">${ic('word')} Word</button></div></div>
      <div class="prog" id="pp" hidden style="margin-bottom:10px"><i style="width:0%"></i></div>
      <div id="rep" style="overflow-x:auto"></div></div>`;
    const draw = () => { try { $('#rep').innerHTML = previewHTML(dossier(c, pick), innerWidth < 720 ? Math.min(.6, (innerWidth - 60) / 794) : .62); const f = $('#rep iframe'); f.onload = () => { try { f.style.height = f.contentDocument.body.scrollHeight + 16 + 'px'; } catch (e) { /* */ } }; } catch (e) { console.error(e); $('#rep').innerHTML = '<p class="muted">Chưa đủ dữ liệu để lập phiếu.</p>'; } };
    const run = async (btn, sids, name) => { const old = btn.innerHTML; btn.disabled = true; btn.textContent = 'Đang tạo PDF…'; $('#pp').hidden = false;
      try { const blob = await exportPDF(c, sids, k => { $('#pp i').style.width = Math.round(k * 100) + '%'; }); await saveFile(name, blob, 'application/pdf'); }
      catch (e) { console.error(e); toast(e.message || 'Không tạo được PDF', 'alert'); } finally { btn.disabled = false; btn.innerHTML = old; $('#pp').hidden = true; } };
    $('#xpdf').onclick = () => run($('#xpdf'), [pick], fileName(c, D.userOf(pick)));
    $('#xall').onclick = () => run($('#xall'), S.map(s => s.id), `Phieu_bao_cao_GHK1_ca_lop_${c.name.replace(/\s+/g, '')}.pdf`);
    draw();
    $('#who').onchange = e => { pick = e.target.value; draw(); };
    $('#xg').onclick = () => {
      const head = ['STT', 'Họ và tên', 'Email', ...tests.map(t => `${t.title} (${{ tx: 'TX', gk: 'GK', ck: 'CK' }[t.cat] || ''})`), 'ĐTB môn', 'Mức', 'Nhận xét'];
      const rows = S.map((s, i) => { const gb = gradebook(c, s.id); return [i + 1, s.name, s.email, ...tests.map(t => { const r = testResults(c, t).rows.find(x => x.sid === s.id); return r?.score10 ?? null; }), gb.dtb, gb.level || '', c.notes[s.id]?.text || ''] });
      saveFile(`Bang_diem_${c.name.replace(/\s/g, '_')}.xlsx`, toBlob(buildXlsx([{ name: 'Bảng điểm', header: true, freeze: 'C2', widths: [5, 24, 24, ...tests.map(() => 14), 9, 9, 60], rows: [head, ...rows] }]), 'xlsx'));
    };
    $('#xm').onclick = async () => {
      const { studentSummary } = await import('../../app/analytics.js'); const view = D.analyticsView(c);
      const per = S.map(s => ({ s, m: studentSummary(view, s.id).mastery })); const objs = [...new Set(per.flatMap(p => Object.keys(p.m)))].sort();
      saveFile(`Muc_nam_vung_${c.name.replace(/\s/g, '_')}.xlsx`, toBlob(buildXlsx([{ name: 'Nắm vững', header: true, freeze: 'B2', widths: [24, ...objs.map(() => 11)], rows: [['Học sinh', ...objs], ...per.map(p => [p.s.name, ...objs.map(o => p.m[o] ? Math.round(p.m[o].score * 100) / 100 : null)])] },
        { name: 'Mã mục tiêu', header: true, widths: [12, 100], rows: [['Mã', 'Yêu cầu cần đạt'], ...objs.map(o => [o, OBJ[o] || ''])] }]), 'xlsx'));
    };
    $('#xl').onclick = () => {
      const anon = Object.fromEntries(S.map((s, i) => [s.id, 'HS' + String(i + 1).padStart(2, '0')]));
      const rows = [['ma_hs', 'thoi_gian', 'loai', 'mo_dun', 'chi_tiet', 'ma_muc_tieu', 'dung', 'ma_loi', 'thoi_gian_tra_loi_ms']];
      c.events.forEach(e => rows.push([anon[e.s] || 'khac', new Date(e.ts).toISOString(), e.type, e.m || '', JSON.stringify(e.payload || {}), '', '', '', '']));
      c.attempts.forEach(a => rows.push([anon[a.s] || 'khac', new Date(a.ts).toISOString(), 'answer', a.m, a.q, a.o, a.correct ? 1 : 0, a.err || '', a.ms]));
      saveFile(`Nhat_ki_hoc_tap_${c.name.replace(/\s/g, '_')}.csv`, new Blob([csv(rows)], { type: 'text/csv' }));
    };
    $('#xp').onclick = () => {
      const d = parentReport(c, pick, D.analyticsView(c)); const u = D.userOf(pick);
      const blocks = [{ twoCol: [[{ text: 'TRƯỜNG ……………………\n' }, { text: c.name.toUpperCase(), b: true }], [{ text: 'PHIẾU THÔNG TIN HỌC TẬP\n', b: true }, { text: 'Môn Địa lí – ' + dfull(Date.now()), i: true }]] },
        { h: 2, text: 'Học sinh: ' + u.name }, { p: `Điểm trung bình môn (tạm tính): ${n1(d.dtb)}${d.level ? ' – mức ' + d.level : ''}` }, { p: `Hoàn thành ${pct(d.P.pctAvail)} các mô-đun đã mở.` },
        { h: 3, text: 'Điểm kiểm tra' }, ...(d.gb.marks.length ? [{ table: [['Bài', 'Ngày', 'Điểm'], ...d.gb.marks.map(m => [m.t.title, dd(m.t.date), n1(m.score)])], header: true, border: true, widths: [11, 3, 3] }] : [{ p: 'Chưa có.' }]),
        { h: 3, text: 'Nhận xét của giáo viên' }, { p: d.note?.text || d.text, align: 'both' },
        { h: 3, text: 'Gia đình có thể hỗ trợ' }, ...(d.sum.flags.slice(0, 2).map(f => ({ p: '• ' + STRATEGIES[f.strategy].how }))), ...d.T.filter(t => !t.optional).slice(0, 3).map(t => ({ p: '• Nhắc em hoàn thành: ' + t.title })),
        { p: '' }, { twoCol: [[{ text: 'Ý kiến phụ huynh\n\n\n', b: true }], [{ text: 'Giáo viên bộ môn\n\n\n', b: true }, { text: D.me().name }]] }];
      saveFile(`Phieu_hoc_tap_${u.name.replace(/\s/g, '_')}.docx`, toBlob(buildDocx({ title: 'Phiếu học tập ' + u.name, blocks }), 'docx'));
    };
  },
};

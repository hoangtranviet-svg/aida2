// GV · Phân tích bài kiểm tra
import * as D from '../core/data.js';
import { $, esc, n1, n2, pct, dd, toast, getSample, avg } from '../core/util.js';
import { ic } from '../core/icons.js';
import { MOD, OBJ, ERR, TYPE_NAME } from '../core/qbank.js';
import { testResults, itemStats, objectiveScores, diffLabel, discLabel, remedies } from '../core/insight.js';
import { histogram, hbars } from '../core/charts.js';
import { objChip, lvChip, L } from './parts.js';

export default {
  title: 'Phân tích bài kiểm tra',
  onData: why => ['test', 'sub'].includes(why.type),
  render(el, ctx, p) {
    const c = D.cls(); const tests = c.tests.filter(t => t.status !== 'draft').sort((a, b) => (b.date || 0) - (a.date || 0));
    if (!tests.length) { el.innerHTML = `<div class="empty">${ic('chart')}<b>Chưa có bài kiểm tra để phân tích</b></div>`; return; }
    const t = tests.find(x => x.id === p.tid) || tests[0];
    const R = testResults(c, t); const done = R.rows.filter(r => r.score10 != null); const sc = done.map(r => r.score10).sort((a, b) => a - b);
    const A = avg(sc); const med = sc.length ? (sc.length % 2 ? sc[(sc.length - 1) / 2] : (sc[sc.length / 2 - 1] + sc[sc.length / 2]) / 2) : null;
    const sd = sc.length ? Math.sqrt(avg(sc.map(x => (x - A) ** 2))) : null;
    const IS = itemStats(c, t, R);
    const objs = {}; done.forEach(r => Object.entries(objectiveScores(c, t, r)).forEach(([o, v]) => { const x = objs[o] ||= { got: 0, max: 0, low: 0, n: 0 }; x.got += v.got; x.max += v.max; x.n++; if (v.got / v.max < .5) x.low++; }));
    const objList = Object.entries(objs).map(([o, v]) => ({ o, frac: v.got / v.max, low: v.low, n: v.n })).sort((a, b) => a.frac - b.frac);
    const remed = D.students(c).map(s => ({ s, r: remedies(c, s.id).filter(x => x.tid === t.id) })).filter(x => x.r.length);
    el.innerHTML = `<div class="toolbar"><label class="row" style="gap:8px"><span class="lab">Bài kiểm tra</span><select class="inp" id="pick">${tests.map(x => `<option value="${x.id}" ${x.id === t.id ? 'selected' : ''}>${esc(x.title)} · ${dd(x.date)}</option>`).join('')}</select></label><span class="sp"></span>
      <button class="btn" id="ai" hidden>${ic('spark')} AI tóm tắt cho tổ chuyên môn</button></div>
    <div id="aiout"></div>
    ${!done.length ? `<div class="empty">${ic('grade')}<b>Chưa có điểm</b><span>${t.kind === 'online' ? 'Chưa học sinh nào nộp bài.' : 'Nhập điểm trong “Kiểm tra & chấm”.'}</span></div>` : `
    <div class="kpis"><div class="kpi"><span class="k">Điểm trung bình</span><span class="v num">${n1(A)}</span><span class="d">độ lệch chuẩn ${n2(sd)}</span></div>
      <div class="kpi"><span class="k">Trung vị</span><span class="v num">${n1(med)}</span><span class="d">thấp nhất ${n1(sc[0])} · cao nhất ${n1(sc[sc.length - 1])}</span></div>
      <div class="kpi"><span class="k">Đạt từ 5 điểm</span><span class="v num">${pct(sc.filter(x => x >= 5).length / sc.length)}</span><span class="d">${sc.filter(x => x < 5).length} học sinh dưới 5</span></div>
      <div class="kpi"><span class="k">Từ 8 điểm</span><span class="v num">${pct(sc.filter(x => x >= 8).length / sc.length)}</span><span class="d">${done.length}/${R.rows.length} học sinh có điểm</span></div></div>
    <div class="grid g2"><div class="card"><div class="card-h"><div><h2>Phổ điểm</h2><p>Số học sinh theo khoảng điểm (thang 10)</p></div></div><div style="overflow-x:auto">${histogram(sc)}</div></div>
      <div class="card"><div class="card-h"><div><h2>Mức đạt theo mục tiêu</h2><p>Tỉ lệ điểm đạt trên điểm tối đa của các câu cùng mục tiêu</p></div></div>
        ${hbars(objList.map(x => ({ html: `${objChip(x.o)} <span class="muted" style="font-size:12px">${x.low} HS dưới 50%</span>`, title: OBJ[x.o], value: x.frac })))}</div></div>
    <div class="card" style="margin-top:16px"><div class="card-h"><div><h2>Phân tích từng câu</h2><p>Độ khó p = tỉ lệ điểm đạt (càng thấp càng khó). Độ phân biệt D = chênh lệch giữa nhóm 27% điểm cao và 27% điểm thấp (≥ 0,4 tốt; dưới 0,2 nên xem lại câu).</p></div></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Câu</th><th>Mục tiêu</th><th>Dạng</th><th class="r">p</th><th>Độ khó</th><th class="r">D</th><th>Phân biệt</th><th>Phương án được chọn</th></tr></thead><tbody>
      ${IS.map(s => { const o = s.q?.o || s.it.o; return `<tr><td class="mono"><b>${s.i + 1}</b></td><td>${objChip(o)} ${s.q?.lv ? lvChip(s.q.lv) : ''}</td><td>${TYPE_NAME[s.it.t] || ''}</td>
        <td class="r num">${n2(s.p)}</td><td><span class="pill ${s.p >= .8 ? 'p-good' : s.p >= .5 ? 'p-info' : s.p >= .3 ? 'p-warn' : 'p-bad'}">${diffLabel(s.p)}</span></td>
        <td class="r num">${n2(s.d)}</td><td><span class="pill ${s.d >= .4 ? 'p-good' : s.d >= .2 ? 'p-info' : 'p-bad'} plain">${discLabel(s.d)}</span></td>
        <td>${s.it.t === 'mc' && s.dist.some(Boolean) ? `<div class="row" style="gap:4px;flex-wrap:nowrap">${s.dist.map((n, k) => `<span class="tag" style="${s.q && k === s.q.k ? 'background:var(--good-soft);color:var(--good);border-color:transparent' : ''}" data-tip="${s.q && k !== s.q.k && s.q.e?.[k] ? esc((ERR[s.q.e[k]]?.[0]) || '') : 'Đáp án đúng'}">${'ABCD'[k]}: ${n}</span>`).join('')}</div>` : '<span class="muted">–</span>'}</td></tr>`; }).join('')}</tbody></table></div></div>
    <div class="grid g2" style="margin-top:16px"><div class="card"><div class="card-h"><div><h2>Học sinh cần cải thiện</h2><p>${t.released ? 'Đã giao nhiệm vụ cải thiện cho học sinh' : 'Công bố kết quả để tự động giao nhiệm vụ cải thiện'}</p></div>${t.released ? '' : `<button class="btn sm pri" id="rel">${ic('check')} Công bố & giao</button>`}</div>
        ${remed.length ? `<div class="list" style="max-height:360px;overflow:auto">${remed.map(x => `<div class="li"><div class="t"><b>${esc(x.s.name)}</b><span>${x.r.map(r => r.o).join(', ')}</span></div>${x.r.every(r => r.done) ? '<span class="pill p-good">Đã cải thiện</span>' : `<span class="pill p-warn">${x.r.filter(r => r.done).length}/${x.r.length}</span>`}</div>`).join('')}</div>` : `<p class="muted">${t.released ? 'Không có học sinh nào dưới 50% ở mục tiêu nào.' : 'Danh sách hiện sau khi công bố kết quả.'}</p>`}</div>
      <div class="card"><div class="card-h"><div><h2>Gợi ý cho tiết dạy tiếp theo</h2></div></div>${suggestions(objList, IS)}</div></div>`}`;
    $('#pick').onchange = e => ctx.go('gv-phan-tich', { tid: e.target.value });
    $('#rel')?.addEventListener('click', () => { t.released = true; D.act.saveTest(t); toast('Đã công bố kết quả và giao nhiệm vụ cải thiện', 'check'); });
    getSample().then(s => { if (!s || !done.length) return; const b = $('#ai'); if (!b) return; b.hidden = false; b.onclick = async () => {
      const out = $('#aiout'); out.innerHTML = `<div class="card" style="margin-bottom:16px"><p class="muted">AI đang viết nhận định…</p></div>`; b.disabled = true;
      const data = { bai: t.title, diem_tb: +A.toFixed(2), trung_vi: med, ti_le_dat: +(sc.filter(x => x >= 5).length / sc.length).toFixed(2), muc_tieu: objList.map(x => ({ ma: x.o, yeu_cau: OBJ[x.o], ti_le: +x.frac.toFixed(2) })), cau: IS.map(s => ({ cau: s.i + 1, ma: s.q?.o || s.it.o, p: +(s.p ?? 0).toFixed(2), D: +(s.d ?? 0).toFixed(2) })) };
      try { const r = await s(`Bạn là tổ trưởng chuyên môn Địa lí THPT. Dựa trên dữ liệu bài kiểm tra (JSON) dưới đây, viết nhận định ngắn bằng tiếng Việt cho tổ chuyên môn gồm 3 mục có tiêu đề: "Kết quả chung", "Nội dung học sinh còn yếu" (nêu mã mục tiêu), "Đề xuất điều chỉnh dạy học" (3 gạch đầu dòng cụ thể). Không quá 180 từ, không bịa số liệu.\n${JSON.stringify(data)}`, { modelTier: 'default', onText: ({ text }) => { out.firstElementChild.innerHTML = `<div style="white-space:pre-line">${esc(text)}</div>`; } });
        out.innerHTML = `<div class="card" style="margin-bottom:16px"><div class="card-h"><h2>${ic('spark')} Nhận định của AI</h2><span class="muted" style="font-size:12px">Thầy cô kiểm tra lại trước khi sử dụng</span></div><div style="white-space:pre-line">${esc(r.text)}</div></div>`; }
      catch (e) { out.innerHTML = `<div class="note sun" style="margin-bottom:16px">${ic('alert')}<div>AI chưa trả lời được (${esc(e.code || e.message)}). Các bảng phân tích bên dưới vẫn đầy đủ.</div></div>`; } finally { b.disabled = false; } }; });
  },
};

function suggestions(objList, IS) {
  const out = [];
  objList.filter(x => x.frac < .5).slice(0, 3).forEach(x => { out.push(`<li>Dạy lại mục tiêu ${objChip(x.o)}: ${esc((OBJ[x.o] || '').slice(0, 110))}… Dùng lại mô hình 3D của bài liên quan, cho học sinh tự giải thích hiện tượng.</li>`); });
  IS.filter(s => s.d != null && s.d < .2 && s.n >= 5).slice(0, 2).forEach(s => out.push(`<li>Câu ${s.i + 1} có độ phân biệt thấp (D = ${n2(s.d)}): xem lại cách hỏi hoặc phương án nhiễu trước khi dùng lại.</li>`));
  IS.filter(s => s.p != null && s.p >= .95).slice(0, 1).forEach(s => out.push(`<li>Câu ${s.i + 1} gần như cả lớp làm đúng – có thể nâng mức độ ở lần kiểm tra sau.</li>`));
  return out.length ? `<ul style="margin:0;padding-left:18px;display:flex;flex-direction:column;gap:8px;font-size:13.5px">${out.join('')}</ul>` : '<p class="muted">Kết quả đồng đều, chưa có điều chỉnh đặc biệt.</p>';
}

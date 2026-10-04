// Khung dùng chung cho bài thực hành “Viết báo cáo” (Bài 32, Bài 38):
// các tấm bảng 3D là các bước viết báo cáo, ở giữa là biểu đồ số liệu mẫu, kèm ô tự tính.
import { THREE, vec, mat, boxM, bars, stage, fmtN } from './kit.js';

export const REPORT_STEPS = [
  ['Chọn đề tài', 'Chọn vấn đề cụ thể, vừa sức, có nguồn tư liệu; đặt tên đề tài ngắn gọn, rõ phạm vi (không gian, thời gian).'],
  ['Xây dựng đề cương', 'Lập dàn ý: <b>Mở đầu</b> (lí do chọn đề tài, mục tiêu) – <b>Nội dung</b> (vai trò, tình hình phát triển, phân bố, nguyên nhân, hạn chế) – <b>Kết luận</b> (đánh giá, đề xuất) – <b>Tài liệu tham khảo</b>.'],
  ['Thu thập tư liệu', 'Tìm số liệu, bản đồ, hình ảnh từ nguồn tin cậy (niên giám thống kê, báo cáo của tổ chức quốc tế, SGK, báo chính thống); ghi lại nguồn.'],
  ['Xử lí và trình bày số liệu', 'Chọn lọc, tính toán (tỉ trọng, tốc độ tăng trưởng…), lập bảng, vẽ biểu đồ phù hợp; rút ra nhận xét.'],
  ['Viết và trình bày báo cáo', 'Viết theo đề cương, lời văn khoa học, có dẫn chứng số liệu; trình bày ngắn gọn bằng trang chiếu, kết hợp bản đồ, biểu đồ; trả lời câu hỏi của người nghe.'],
];

// opts: { rows, series, unit, scale, axisMax, axisStep, outline (html), calc: {label, answer, tol, ok, hint}, chartTitle, onBar(r,s) }
export function reportScene(api, opts) {
  const { scene, state } = api;
  stage(api, { bg: 0x13212f });
  scene.add(boxM(40, .1, 26, 0x1b2d3d, [0, -.06, 0]));
  // các tấm bảng các bước
  const boards = []; let next = 0;
  REPORT_STEPS.forEach(([t, h], i) => {
    const a = (-60 + i * 30) * Math.PI / 180; const R = 9;
    const g = new THREE.Group(); g.position.set(Math.sin(a) * R, 0, -Math.cos(a) * R + 2); g.rotation.y = -a; scene.add(g);
    g.add(boxM(.12, 2.4, .12, 0x8d6e4f, [-1.2, 1.2, 0])); g.add(boxM(.12, 2.4, .12, 0x8d6e4f, [1.2, 1.2, 0]));
    const board = boxM(2.8, 1.8, .1, 0xf7f1e3, [0, 2.4, 0], { unique: true }); g.add(board);
    const num = boxM(.5, .5, .12, 0xe67e22, [-1.05, 3.05, .03], { unique: true }); g.add(num);
    api.label(`${i + 1}. ${t}`, { cls: 'sm', pos: vec(0, 3.6, 0), parent: g });
    const info = () => {
      let msg = h;
      if (state.order) { if (i === next) { next++; board.material.color.setHex(0xc8f7c5); msg = `✓ Đúng thứ tự (bước ${i + 1}).<br>` + h; if (next === REPORT_STEPS.length) { api.done('order'); api.toast('Em đã sắp xếp đúng 5 bước viết báo cáo!'); } } else if (i > next) { msg = `✗ Chưa đúng thứ tự – trước đó cần làm bước khác.<br>` + h; } }
      return { title: `Bước ${i + 1}: ${t}`, html: msg, id: 'b' + i };
    };
    api.hotspot(g, info); boards.push({ g, board });
  });
  // biểu đồ số liệu mẫu
  const C = new THREE.Group(); C.position.set(0, 0, 4.2); scene.add(C);
  C.add(boxM(opts.rows.length * 1.6 + 1, .2, 2.2, 0x22384b, [0, .1, 0]));
  const ch = bars(api, { rows: opts.rows, series: opts.series, scale: opts.scale, gap: 1.6, w: .55, depth: .55, parent: C, axisMax: opts.axisMax, axisStep: opts.axisStep, unit: opts.unit, info: opts.info });
  ch.group.position.y = .2;
  api.label(opts.chartTitle, { cls: 'sm', pos: vec(0, opts.axisMax * opts.scale + 1.1, 0), parent: C });
  api.legend(opts.series.map(s => ({ t: s.t, c: '#' + s.c.toString(16).padStart(6, '0') })));
  // điều khiển
  api.heading('Luyện tập');
  api.toggle('order', 'Thử thách: bấm 5 tấm bảng theo đúng thứ tự', false, v => { state.order = v; next = 0; boards.forEach(b => b.board.material.color.setHex(0xf7f1e3)); if (v) api.toast('Bấm lần lượt các tấm bảng từ bước đầu tiên'); });
  api.toggle('outline', 'Xem đề cương mẫu', false, v => { api.readout(v ? opts.outline : null); if (v && state.ready) api.done('outline'); });
  if (opts.calc) {
    const box = document.createElement('div'); box.className = 'ctl';
    box.innerHTML = `<label><span>${opts.calc.label}</span></label><div style="display:flex;gap:6px"><input inputmode="decimal" placeholder="Nhập kết quả" style="flex:1;min-width:0;padding:7px 9px;border-radius:8px;border:1px solid #ccc;font:inherit"><button type="button" style="padding:7px 12px;border-radius:8px">Kiểm tra</button></div><div class="fb" style="font-size:12.5px;margin-top:6px"></div>`;
    api.controlsBox.append(box);
    box.querySelector('button').onclick = () => { const v = parseFloat(box.querySelector('input').value.replace(/\s/g, '').replace(',', '.')); const ok = Math.abs(v - opts.calc.answer) <= opts.calc.tol; const fb = box.querySelector('.fb'); fb.innerHTML = isNaN(v) ? 'Em hãy nhập một số.' : ok ? '✓ ' + opts.calc.ok : 'Chưa đúng. ' + opts.calc.hint; fb.style.color = ok ? '#1e8e5a' : '#c0392b'; api.track('control', { id: 'calc', value: v, ok }); if (ok) api.done('calc'); };
  }
  state.ready = true;
  return { boards, chart: ch };
}

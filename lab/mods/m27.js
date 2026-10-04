// 3D-27 · Bài 27 – Thực hành: Vẽ và nhận xét biểu đồ về sản lượng lương thực của thế giới
import { THREE, vec, mat, boxM, donut, stack, stage, fmtN } from '../kit.js';

// SGK Địa lí 10 – KNTT, Bài 27: sản lượng lương thực thế giới (triệu tấn)
const CROPS = ['Lúa gạo', 'Lúa mì', 'Ngô', 'Cây lương thực khác'];
const COL = [0x7ee081, 0xf4c95d, 0xffa62b, 0xa0aec0];
const Y = { 2000: [598.7, 584.7, 590.7, 284.6], 2019: [753.5, 762.0, 1146.4, 414.0] };
const tot = y => Y[y].reduce((a, b) => a + b, 0);
const pct = (y, i) => Y[y][i] / tot(y) * 100;

export default {
  id: '3D-27', code: 'DL10.B27', title: 'Thực hành: Biểu đồ sản lượng lương thực thế giới',
  objectives: [
    { c: 'DL10.10.08', t: 'Xử lí số liệu, vẽ và nhận xét biểu đồ nông nghiệp' },
    { c: 'DL10.10.04', t: 'Phân bố cây lương thực chính' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 27 (bảng sản lượng lương thực thế giới 2000 và 2019)', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'FAOSTAT – Crops and livestock products', u: 'https://www.fao.org/faostat/en/#data/QCL' },
  ],
  view: { pos: [0, 7, 11], target: [0, 0, 0] },
  steps: [
    { title: 'Bảng số liệu', html: '<p><b>Sản lượng lương thực thế giới</b> (triệu tấn)</p><table style="width:100%;font-size:13px;border-collapse:collapse"><tr><th style="text-align:left">Cây</th><th>2000</th><th>2019</th></tr>' + CROPS.map((c, i) => `<tr><td>${c}</td><td style="text-align:center">${fmtN(Y[2000][i])}</td><td style="text-align:center">${fmtN(Y[2019][i])}</td></tr>`).join('') + `<tr><td><b>Tổng số</b></td><td style="text-align:center"><b>${fmtN(tot(2000))}</b></td><td style="text-align:center"><b>${fmtN(tot(2019))}</b></td></tr></table><p>Yêu cầu: tính cơ cấu, vẽ biểu đồ thể hiện <b>quy mô và cơ cấu</b> sản lượng lương thực thế giới năm 2000 và 2019, nhận xét.</p>`,
      enter: a => { a.state.view('bars'); a.fly([0, 5, 13], [0, 1.5, 0]); } },
    { title: 'Xử lí số liệu: tính cơ cấu', html: '<p style="text-align:center"><b>Tỉ trọng (%) = giá trị thành phần ÷ tổng số × 100</b></p><p>Ví dụ: lúa gạo năm 2000 = 598,7 ÷ 2 058,7 × 100 ≈ <b>29,1%</b>.</p><div class="tip">Hãy tự tính <b>tỉ trọng của ngô năm 2019</b> rồi nhập vào ô ở mục điều khiển (làm tròn 1 chữ số thập phân).</div>',
      enter: a => { a.state.view('bars'); a.fly([0, 5, 13], [0, 1.5, 0]); } },
    { title: 'Chọn dạng biểu đồ', html: '<p>Yêu cầu thể hiện cả <b>quy mô</b> và <b>cơ cấu</b>, ở <b>2 thời điểm</b> → dùng <b>biểu đồ tròn</b>, bán kính hai hình tròn khác nhau theo quy mô:</p><p style="text-align:center"><b>R₂₀₁₉ = R₂₀₀₀ × √(3 075,9 ÷ 2 058,7) ≈ 1,22 × R₂₀₀₀</b></p><div class="tip">Thử chọn từng dạng biểu đồ ở mục điều khiển để so sánh.</div>',
      enter: a => { a.state.view('pie'); a.fly([0, 9, 9], [0, 0, 0]); } },
    { title: 'Nhận xét', html: '<ul><li><b>Quy mô</b>: sản lượng lương thực tăng từ 2 058,7 lên 3 075,9 triệu tấn (gấp khoảng <b>1,5 lần</b>).</li><li><b>Cơ cấu</b> có sự thay đổi: tỉ trọng <b>ngô tăng</b> mạnh (28,7% → 37,3%) và vươn lên đứng đầu; tỉ trọng <b>lúa gạo giảm</b> (29,1% → 24,5%), <b>lúa mì giảm</b> (28,4% → 24,8%), cây lương thực khác giảm nhẹ.</li><li>Nguyên nhân: ngô dễ trồng, năng suất cao, nhu cầu lớn làm thức ăn chăn nuôi, nhiên liệu sinh học.</li></ul>',
      enter: a => { a.state.view('pie'); a.fly([2, 6, 8], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'calc', text: 'Tính và nhập đúng <b>tỉ trọng của ngô năm 2019</b>.' },
    { id: 'pie', text: 'Chọn dạng biểu đồ <b>phù hợp</b> với yêu cầu đề bài.' },
    { id: 'corn', text: 'Bấm vào phần <b>ngô</b> trên biểu đồ năm 2019.' },
    { id: 'radius', text: 'Bật <b>bán kính theo quy mô</b> để so sánh hai hình tròn.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0x0f1d2b });
    scene.add(boxM(30, .1, 18, 0x15293a, [0, -.06, 0]));
    const parts = y => CROPS.map((t, i) => ({ t, v: Y[y][i], c: COL[i], y }));
    const pieInfo = (p) => ({ title: `${p.t} – năm ${p.y}`, html: `Sản lượng: <b>${fmtN(p.v)} triệu tấn</b><br>Tỉ trọng: <b>${fmtN(p.v / tot(p.y) * 100)}%</b>`, id: p.t + p.y, onPick: () => { if (p.t === 'Ngô' && p.y === 2019) api.done('corn'); } });
    const R0 = 2;
    const d1 = donut(api, { parts: parts(2000), r: R0, r0: .7, h: .45, pos: [-3.4, 0, 0], info: pieInfo });
    const d2 = donut(api, { parts: parts(2019), r: R0, r0: .7, h: .45, pos: [3.6, 0, 0], info: pieInfo });
    const l1 = api.label('Năm 2000 · 2 058,7 triệu tấn', { cls: 'big', pos: vec(-3.4, 1.4, 2.6) }); const l2 = api.label('Năm 2019 · 3 075,9 triệu tấn', { cls: 'big', pos: vec(3.6, 1.4, 3) });
    // nhãn phần trăm trên đĩa
    const tagsP = []; [2000, 2019].forEach((y, k) => { let a = Math.PI / 2; Y[y].forEach((v, i) => { const da = v / tot(y) * Math.PI * 2; const m = a - da / 2; const l = api.label(fmtN(pct(y, i)) + '%', { cls: 'sm', pos: vec(0, .7, 0) }); l.userData.m = m; l.userData.k = k; tagsP.push(l); a -= da; }); });
    // dạng cột nhóm và cột chồng
    const BG = new THREE.Group(); scene.add(BG); const cols = [];
    CROPS.forEach((c, i) => [2000, 2019].forEach((y, k) => { const v = Y[y][i]; const h = v * .004; const m = boxM(.55, h, .55, COL[i], [-4.5 + i * 2.6 + k * .65, h / 2, 0], { unique: true }); m.material.opacity = k ? 1 : .55; m.material.transparent = !k; BG.add(m); cols.push(m); api.hotspot(m, { title: `${c} – năm ${y}`, html: `<b>${fmtN(v)} triệu tấn</b>` }); }));
    CROPS.forEach((c, i) => api.label(c, { cls: 'sm plain', pos: vec(-4.2 + i * 2.6, -.35, .8), parent: BG }));
    const bl = api.label('Cột nhạt: 2000 · cột đậm: 2019 (triệu tấn)', { cls: 'sm', pos: vec(0, 5.6, 0), parent: BG });
    const SG = new THREE.Group(); scene.add(SG);
    const s1 = stack(api, { parts: parts(2000).map(p => ({ ...p, v: +pct(2000, CROPS.indexOf(p.t)).toFixed(1) })), pos: [-1.6, 0, 0], h: 4, r: .7, round: false, title: '2000', parent: SG });
    const s2 = stack(api, { parts: parts(2019).map(p => ({ ...p, v: +pct(2019, CROPS.indexOf(p.t)).toFixed(1) })), pos: [1.6, 0, 0], h: 4, r: .7, round: false, title: '2019', parent: SG });
    state.mode = 'bars';
    const applyRadius = on => { const k = on ? Math.sqrt(tot(2019) / tot(2000)) : 1; d2.group.scale.set(k, 1, k); state.k = k; };
    state.view = v => { state.mode = v; const pie = v === 'pie'; d1.group.visible = d2.group.visible = pie; l1.visible = l2.visible = pie; tagsP.forEach(t => (t.visible = pie)); BG.visible = v === 'bars'; SG.visible = v === 'stack'; api.set('chart', v); };
    api.onTick(() => tagsP.forEach(l => { const g = l.userData.k ? d2.group : d1.group; const r = 1.42 * g.scale.x; l.position.set(g.position.x + Math.cos(l.userData.m) * r, .8, -Math.sin(l.userData.m) * r); }));
    api.legend(CROPS.map((t, i) => ({ t, c: '#' + COL[i].toString(16).padStart(6, '0') })));
    // điều khiển
    api.heading('Bài tập tính toán');
    const box = document.createElement('div'); box.className = 'ctl';
    box.innerHTML = '<label><span>Tỉ trọng ngô năm 2019 (%)</span></label><div style="display:flex;gap:6px"><input id="ans" inputmode="decimal" placeholder="VD: 12,3" style="flex:1;min-width:0;padding:7px 9px;border-radius:8px;border:1px solid var(--line,#ccc);font:inherit"><button type="button" id="chk" class="primary" style="padding:7px 12px;border-radius:8px">Kiểm tra</button></div><div id="fb" style="font-size:12.5px;margin-top:6px"></div>';
    api.controlsBox.append(box);
    box.querySelector('#chk').onclick = () => {
      const v = parseFloat(box.querySelector('#ans').value.replace(',', '.')); const ok = Math.abs(v - 37.3) <= .1; const fb = box.querySelector('#fb');
      fb.innerHTML = isNaN(v) ? 'Em hãy nhập một số.' : ok ? '✓ Chính xác: 1 146,4 ÷ 3 075,9 × 100 ≈ <b>37,3%</b>.' : `Chưa đúng. Gợi ý: lấy sản lượng ngô năm 2019 chia cho tổng số năm 2019 rồi nhân 100.`;
      fb.style.color = ok ? '#1e8e5a' : '#c0392b'; api.track('control', { id: 'calc', value: v, ok }); if (ok) api.done('calc');
    };
    api.heading('Dạng biểu đồ');
    api.choice('chart', '', [{ v: 'bars', t: 'Cột nhóm' }, { v: 'stack', t: 'Cột chồng 100%' }, { v: 'pie', t: 'Tròn' }], 'bars', v => {
      if (state.mode !== v) state.view(v);
      const msg = { bars: 'Cột nhóm thể hiện <b>quy mô</b> từng cây, nhưng khó thấy <b>cơ cấu</b>.', stack: 'Cột chồng 100% thể hiện <b>cơ cấu</b> nhưng không thể hiện <b>quy mô</b> tổng sản lượng.', pie: 'Biểu đồ tròn (bán kính khác nhau) thể hiện được <b>cả quy mô và cơ cấu</b> ở 2 thời điểm → <b>phù hợp nhất</b>.' }[v];
      api.readout(msg); if (v === 'pie' && state.ready && !state.fromStep) api.done('pie');
    });
    api.toggle('radius', 'Bán kính theo quy mô (R₂₀₁₉ ≈ 1,22 R₂₀₀₀)', false, v => { applyRadius(v); if (v && state.ready && !state.fromStep) api.done('radius'); });
    const _set = api.set; api.set = (id, v) => { state.fromStep = true; _set(id, v); state.fromStep = false; };
    state.view('bars'); state.ready = true;
  },
};

// 3D-40 · Bài 40 – Phát triển bền vững và tăng trưởng xanh
import { THREE, vec, mat, boxM, cylM, mesh, building, house, tree, forest, turbine, solar, factory, road, crowd, stage, fmtN, globe } from '../kit.js';

const MEAS = [
  ['re', 'Năng lượng tái tạo', 'Sản xuất xanh: điện mặt trời, điện gió thay nhiệt điện than.', 22],
  ['bus', 'Giao thông công cộng, xe điện', 'Lối sống xanh: xe buýt điện, tàu điện, xe đạp; giảm xe cá nhân chạy xăng.', 18],
  ['rec', 'Phân loại, tái chế rác', 'Tiêu dùng xanh, kinh tế tuần hoàn: rác được phân loại tại nguồn, tái chế thành nguyên liệu.', 12],
  ['tree', 'Cây xanh, mặt nước đô thị', 'Đô thị xanh: công viên, hồ điều hoà hấp thụ CO₂, giảm ngập, giảm nắng nóng.', 10],
  ['bld', 'Công trình xanh, tiết kiệm năng lượng', 'Toà nhà dùng đèn LED, cách nhiệt, mái xanh, tiết kiệm nước, điện.', 13],
];

export default {
  id: '3D-40', code: 'DL10.B40', title: 'Phát triển bền vững và tăng trưởng xanh',
  objectives: [
    { c: 'DL10.13.03', t: 'Khái niệm và sự cần thiết phải phát triển bền vững' },
    { c: 'DL10.13.04', t: 'Khái niệm và biểu hiện của tăng trưởng xanh' },
    { c: 'DL10.13.05', t: 'Liên hệ tăng trưởng xanh tại địa phương' },
  ],
  sources: [
    { t: 'Luật Bảo vệ môi trường 2020, Điều 3 (khái niệm phát triển bền vững)', u: 'https://vanban.chinhphu.vn/' },
    { t: 'Quyết định 1658/QĐ-TTg (2021) – Chiến lược quốc gia về tăng trưởng xanh giai đoạn 2021 – 2030, tầm nhìn 2050', u: 'https://vanban.chinhphu.vn/' },
    { t: 'Liên Hợp Quốc – 17 Mục tiêu phát triển bền vững (SDGs)', u: 'https://sdgs.un.org/goals' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 40', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Mức giảm phát thải của từng giải pháp trong mô hình là giá trị minh hoạ (đơn vị quy ước), dùng để so sánh tương đối.',
  view: { pos: [-6, 6, 12], target: [-6, 2, 0] },
  steps: [
    { title: 'Phát triển bền vững', html: '<p><b>Phát triển bền vững</b> là phát triển đáp ứng được nhu cầu của thế hệ hiện tại mà không làm tổn hại đến khả năng đáp ứng nhu cầu của các thế hệ tương lai, trên cơ sở kết hợp chặt chẽ, hài hoà giữa <b>tăng trưởng kinh tế</b>, bảo đảm <b>tiến bộ xã hội</b> và <b>bảo vệ môi trường</b>.</p><div class="tip">Ba trụ cột đỡ “Trái Đất”. Kéo ba thanh điều khiển: nếu một trụ quá thấp, mặt đỡ sẽ nghiêng.</div>',
      enter: a => { a.fly([-6, 6, 12], [-6, 2, 0]); } },
    { title: 'Vì sao phải phát triển bền vững?', html: '<ul><li>Tài nguyên ngày càng cạn kiệt, môi trường ô nhiễm, biến đổi khí hậu gia tăng.</li><li>Tăng trưởng kinh tế nóng gây bất bình đẳng, nghèo đói, xung đột.</li><li>Phải bảo đảm quyền được phát triển của các thế hệ tương lai.</li></ul><p>Liên Hợp Quốc đề ra <b>17 Mục tiêu phát triển bền vững</b> (SDGs) đến năm 2030.</p>',
      enter: a => { a.fly([-4, 5, 10], [-6, 2.5, 0]); } },
    { title: 'Tăng trưởng xanh', html: '<p><b>Tăng trưởng xanh</b> là tăng trưởng kinh tế dựa trên đổi mới mô hình tăng trưởng, ứng dụng công nghệ tiên tiến để <b>sử dụng hiệu quả tài nguyên</b>, <b>giảm phát thải khí nhà kính</b>, ứng phó biến đổi khí hậu, góp phần giảm nghèo, tạo động lực tăng trưởng bền vững.</p><p><b>Biểu hiện</b>: sản xuất xanh, tiêu dùng xanh, lối sống xanh, đô thị xanh.</p><div class="tip">Bật các giải pháp xanh cho thành phố ở mục điều khiển.</div>',
      enter: a => { a.fly([7, 7, 13], [6, 1, 0]); } },
    { title: 'Việt Nam và địa phương em', html: '<ul><li>Việt Nam có <b>Chiến lược quốc gia về tăng trưởng xanh giai đoạn 2021 – 2030, tầm nhìn 2050</b>.</li><li>Cam kết đưa phát thải ròng về “0” vào năm 2050 (COP26).</li><li>Liên hệ địa phương: điện mặt trời mái nhà, xe buýt điện, phân loại rác tại nguồn, trồng cây xanh, nông nghiệp hữu cơ…</li></ul>',
      enter: a => { a.fly([1, 9, 18], [1, 1.5, 0]); } },
  ],
  tasks: [
    { id: 'bal', text: 'Điều chỉnh để <b>ba trụ cột cân bằng</b> (mặt đỡ nằm ngang, các trụ đều cao).' },
    { id: 'env', text: 'Bấm vào trụ cột <b>Môi trường</b>.' },
    { id: 'green', text: 'Bật ít nhất <b>3 giải pháp xanh</b> cho thành phố.' },
    { id: 'half', text: 'Giảm phát thải của thành phố <b>từ 50% trở lên</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa8d4ef });
    scene.add(boxM(60, .3, 30, 0x7aa65a, [0, -.16, 0]));
    // ---- ba trụ cột ----
    const P = new THREE.Group(); P.position.set(-6, 0, 0); scene.add(P);
    P.add(cylM(3.2, 3.4, .3, 0xd8d2c4, [0, .15, 0]));
    const pil = {}; const PIL = { kt: ['Kinh tế', 0xf39c12, -1.8, 'Tăng trưởng kinh tế ổn định, hiệu quả, chất lượng; chuyển dịch cơ cấu hợp lí.'], xh: ['Xã hội', 0x3498db, 0, 'Tiến bộ, công bằng xã hội: xoá đói giảm nghèo, việc làm, giáo dục, y tế, bình đẳng giới.'], mt: ['Môi trường', 0x27ae60, 1.8, 'Bảo vệ môi trường, sử dụng hợp lí tài nguyên, ứng phó với biến đổi khí hậu.'] };
    Object.entries(PIL).forEach(([k, [n, c, x, d]]) => { const m = cylM(.45, .5, 1, c, [x, 0, 0], { unique: true }); P.add(m); pil[k] = m; const info = { title: 'Trụ cột ' + n, html: d, id: k, onPick: () => { if (k === 'mt') api.done('env'); } }; api.hotspot(m, info); m.userData.lbl = api.label(n, { cls: 'sm', pos: vec(x, 0, 1), parent: P, onClick: info }); });
    const top = new THREE.Group(); P.add(top); top.add(cylM(2.6, 2.6, .18, 0xbdb6a6, [0, 0, 0]));
    const E = await globe(api, { mode: 'natural', radius: .9, stars: false, spin: true }); scene.remove(E.G); top.add(E.G); E.G.position.y = 1;
    E.gc.center = new THREE.Vector3(); // không dùng nhãn trên quả cầu nhỏ
    const show = () => api.readout([state.rb, state.rc].filter(Boolean).join('<hr style="border:0;border-top:1px solid rgba(255,255,255,.2);margin:6px 0">'));
    state.v = { kt: 80, xh: 40, mt: 30 }; state.tilt = 0;
    const balance = () => {
      const { kt, xh, mt } = state.v; Object.entries(state.v).forEach(([k, v]) => { const h = .8 + v / 100 * 3.2; pil[k].scale.y = h; pil[k].position.y = .3 + h / 2; pil[k].userData.lbl.position.y = .3 + h + .3; });
      const hk = .3 + .8 + kt / 100 * 3.2, hx = .3 + .8 + xh / 100 * 3.2, hm = .3 + .8 + mt / 100 * 3.2;
      state.tz = Math.atan2(hm - hk, 3.6) ; state.tx = Math.atan2(hx - (hk + hm) / 2, 3) * .5; state.y = Math.max(hk, hx, hm) * .5 + Math.min(hk, hx, hm) * .5;
      const spread = Math.max(kt, xh, mt) - Math.min(kt, xh, mt); const ok = spread <= 15 && Math.min(kt, xh, mt) >= 60;
      state.rb = (`<b>Kinh tế ${kt} · Xã hội ${xh} · Môi trường ${mt}</b><br>${ok ? '✓ <b>Cân bằng – phát triển bền vững</b>' : spread > 15 ? '⚠ Mất cân bằng: một trụ cột bị xem nhẹ → phát triển không bền vững' : 'Các trụ cột còn thấp – cần đầu tư thêm cho cả ba'}`); show();
      if (ok && state.ready) api.done('bal');
    };
    api.onTick(dt => { const k = Math.min(1, dt * 3); top.rotation.z += ((state.tz || 0) - top.rotation.z) * k; top.rotation.x += ((state.tx || 0) - top.rotation.x) * k; top.position.y += ((state.y || 3) - top.position.y) * k; });
    // ---- thành phố xanh ----
    const C = new THREE.Group(); C.position.set(7, 0, 0); scene.add(C);
    C.add(boxM(12, .04, 9, 0xc5ccd2, [0, .02, 0])); C.add(road(12).translateZ(1)); const rv = road(9, { rot: Math.PI / 2 }); C.add(rv);
    [[-4, -2.6, 2.8], [-2.6, -3, 3.6], [2.4, -2.8, 2.6], [4, -3, 3.2], [-4.4, 3, 1.8], [3.6, 3.2, 2]].forEach(([x, z, h]) => { const b = building({ h, color: 0xaebfcc }); b.position.set(x, 0, z); C.add(b); });
    const fac = factory(api, { roof: 0x7f8c8d, chimneys: 2 }); fac.position.set(-3.8, 0, 3.3); fac.scale.setScalar(.8); C.add(fac);
    const cars = []; for (let i = 0; i < 6; i++) { const c = boxM(.4, .2, .22, [0xe74c3c, 0x34495e, 0xf1c40f][i % 3], [0, .15, 1 + (i % 2 ? .12 : -.12)]); C.add(c); cars.push(c); }
    const g = { re: new THREE.Group(), bus: new THREE.Group(), rec: new THREE.Group(), tree: new THREE.Group(), bld: new THREE.Group() }; Object.values(g).forEach(x => C.add(x));
    for (let i = 0; i < 3; i++) { const t = turbine(api, { h: 2.2 }); t.position.set(-5.5 + i * .9, 0, -.8); t.scale.setScalar(.8); g.re.add(t); } const sp = solar({ rows: 1, cols: 3 }); sp.position.set(1.8, 0, -1.2); sp.scale.setScalar(.7); g.re.add(sp);
    const bus = new THREE.Group(); bus.add(boxM(1.2, .4, .34, 0x27ae60, [0, .3, 0])); bus.add(boxM(1.1, .12, .35, 0xd5f5e3, [0, .4, 0], { basic: true })); g.bus.add(bus); const bike = crowd(4, 3, .4, { seed: 2, colors: [0x2ecc71] }); bike.position.set(2.5, 0, 1.8); g.bus.add(bike);
    [[0x3498db], [0xf1c40f], [0x27ae60]].forEach(([c], i) => g.rec.add(boxM(.3, .45, .3, c, [-1.3 + i * .38, .23, 2]))); g.rec.add(boxM(1, .6, .7, 0x95a5a6, [-1, .3, 3.2]));
    const park = new THREE.Group(); park.add(boxM(3, .05, 2, 0x58b368, [0, .03, 0])); park.add(boxM(1.2, .06, .8, 0x3a8fd8, [.6, .04, .2])); park.add(forest(10, 2.8, 1.8, { seed: 6 })); park.position.set(1.4, 0, 3.2); g.tree.add(park);
    [[-2.6, -3], [4, -3]].forEach(([x, z]) => { g.bld.add(boxM(.95, .1, .95, 0x2ecc71, [x, x < 0 ? 3.65 : 3.25, z])); });
    MEAS.forEach(([k, n, d]) => api.hotspot(g[k], { title: n, html: d }));
    state.on = {}; const base = 100;
    const city = () => {
      const red = MEAS.reduce((s, [k, , , r]) => s + (state.on[k] ? r : 0), 0); const em = base - red; const n = Object.values(state.on).filter(Boolean).length;
      fac.userData.setSmoke(state.on.re ? .25 : 1); cars.forEach((c, i) => (c.visible = !state.on.bus || i < 2));
      state.rc = (`<b>Thành phố xanh</b>: ${n}/5 giải pháp<br>Phát thải khí nhà kính: <b>${em}</b> (đơn vị quy ước, ban đầu 100)<br>Giảm ${red}% ${red >= 50 ? '✓' : ''}`); show();
      if (state.ready) { if (n >= 3) api.done('green'); if (red >= 50) api.done('half'); }
    };
    api.onTick((dt, t) => { cars.forEach((c, i) => { c.position.x = -5.5 + ((t * .12 + i / 6) % 1) * 11; }); bus.position.set(-5.5 + ((t * .08) % 1) * 11, 0, .85); });
    api.heading('Ba trụ cột phát triển');
    Object.entries(PIL).forEach(([k, [n]]) => api.slider(k, n, { min: 0, max: 100, step: 5, value: state.v[k] }, v => { state.v[k] = v; balance(); }));
    api.heading('Giải pháp tăng trưởng xanh');
    MEAS.forEach(([k, n]) => api.toggle(k, n, false, v => { state.on[k] = v; g[k].visible = v; if (state.ready) city(); }));
    api.legend([{ c: '#f39c12', t: 'Kinh tế' }, { c: '#3498db', t: 'Xã hội' }, { c: '#27ae60', t: 'Môi trường' }]);
    balance(); city(); state.ready = true;
  },
};

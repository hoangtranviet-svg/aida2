// 3D-13 · Bài 13 – Thực hành: Phân tích chế độ nước của sông Hồng
import { THREE } from '../core.js';

// Lưu lượng nước trung bình tháng của sông Hồng tại trạm Sơn Tây (m³/s) và lượng mưa trung bình tháng ở Hà Nội (mm)
// Số liệu tham khảo dùng phổ biến trong SGK Địa lí (NXB Giáo dục Việt Nam).
const Q = [1318, 1100, 914, 1071, 1893, 4692, 7986, 9246, 6690, 4122, 2813, 1746];
const R = [18.6, 26.2, 43.8, 90.1, 188.5, 239.9, 288.2, 318.0, 265.4, 130.7, 43.4, 23.4];
const QTB = Q.reduce((a, b) => a + b, 0) / 12;          // ≈ 3 633 m³/s
const fmt = v => Math.round(v).toLocaleString('vi-VN');
const SQ = 0.6 / 1000, SR = 1 / 70;                      // tỉ lệ chiều cao cột

export default {
  id: '3D-13', code: 'DL10.B13', title: 'Thực hành: Chế độ nước sông Hồng',
  objectives: [
    { c: 'DL10.05.03', t: 'Trình bày được chế độ nước của một con sông cụ thể' },
    { c: 'DL10.05.02', t: 'Phân tích các nhân tố ảnh hưởng tới chế độ nước sông' },
    { c: 'DL10.05.11', t: 'Phân tích bản đồ, hình vẽ, số liệu về thuỷ quyển' },
  ],
  sources: [
    { t: 'Số liệu lưu lượng trạm Sơn Tây và lượng mưa Hà Nội – SGK Địa lí, NXB Giáo dục Việt Nam (số liệu tham khảo)', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 13', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'USGS – Streamflow and the Water Cycle', u: 'https://www.usgs.gov/special-topics/water-science-school/science/streamflow-and-water-cycle' },
  ],
  view: { pos: [2, 6.5, 15], target: [1.2, 2.2, 0] },
  steps: [
    { title: 'Bảng số liệu', html: '<p>Mô hình dựng biểu đồ 3D từ <b>lưu lượng nước trung bình tháng của sông Hồng tại trạm Sơn Tây</b> (m³/s). Mỗi cột là một tháng.</p><table style="width:100%;font-size:12.5px;border-collapse:collapse">' +
        '<tr><td><b>Tháng</b></td>' + Q.map((_, i) => `<td style="text-align:center">${i + 1}</td>`).join('') + '</tr>' +
        '<tr><td><b>Q</b></td>' + Q.map(v => `<td style="text-align:center;font-size:11px">${v}</td>`).join('') + '</tr></table>' +
        '<div class="tip">Kéo thanh <b>Tháng</b> trong mục điều khiển để xem mực nước sông thay đổi ở mặt cắt bên phải.</div>',
      enter: a => { a.fly([2, 6.5, 15], [1.2, 2.2, 0]); a.state.showRain(false); } },
    { title: 'Lưu lượng trung bình năm', html: '<p>Lưu lượng trung bình năm = tổng lưu lượng 12 tháng ÷ 12</p><p style="text-align:center"><b>43 591 ÷ 12 ≈ 3 633 m³/s</b></p><p>Dải màu cam là mức trung bình năm. Theo quy ước, <b>tháng có lưu lượng lớn hơn trung bình năm thuộc mùa lũ</b>, nhỏ hơn thuộc mùa cạn.</p>',
      enter: a => { a.fly([-1, 4.5, 12], [0, 2.2, 0]); a.state.pulseMean(); } },
    { title: 'Mùa lũ và mùa cạn', html: '<ul><li><b>Mùa lũ: tháng 6 – 10</b> (5 tháng), đỉnh lũ vào <b>tháng 8</b> (9 246 m³/s).</li><li><b>Mùa cạn: tháng 11 – 5</b> (7 tháng), cạn nhất vào <b>tháng 3</b> (914 m³/s).</li><li>Chênh lệch lưu lượng tháng lớn nhất và nhỏ nhất gấp khoảng <b>10 lần</b> → chế độ nước phân mùa rõ rệt.</li></ul>',
      enter: a => { a.fly([1, 6, 13], [1, 2.5, 0]); a.state.colorSeason(true); } },
    { title: 'Vì sao có chế độ nước như vậy?', html: '<p>Bật <b>Lượng mưa</b> để so sánh. Sông Hồng được cấp nước chủ yếu bởi <b>nước mưa</b>; lưu vực chịu ảnh hưởng của gió mùa:</p><ul><li>Mùa hạ mưa nhiều (tháng 5 – 10) → mùa lũ trùng mùa mưa.</li><li>Mùa đông ít mưa → mùa cạn.</li><li>Lũ lớn nhất vào tháng 8 cùng lúc lượng mưa lớn nhất.</li></ul><p>Ngoài ra: <b>hồ thuỷ điện Hoà Bình, Sơn La</b> điều tiết lũ; <b>rừng đầu nguồn</b> bị chặt phá làm lũ lên nhanh, mùa cạn càng cạn.</p>',
      enter: a => { a.fly([3, 5, 14], [1, 2, -.5]); a.state.showRain(true); } },
    { title: 'Vận dụng', html: '<p>Tổng lượng nước sông Hồng chảy qua trạm Sơn Tây trong một năm:</p><p style="text-align:center"><b>3 633 m³/s × 31 536 000 s ≈ 114,6 tỉ m³</b></p><p>Hãy tự tính lượng nước chảy qua trong <b>riêng tháng 8</b> (31 ngày) và so sánh với tháng 3.</p><div class="tip">Gợi ý: Q × số ngày × 86 400 giây.</div>',
      enter: a => { a.fly([2, 6.5, 15], [1.2, 2.2, 0]); } },
  ],
  tasks: [
    { id: 'peak', text: 'Kéo thanh Tháng đến <b>tháng có lũ lớn nhất</b>.' },
    { id: 'low', text: 'Tìm <b>tháng cạn nhất</b> trên thanh Tháng.' },
    { id: 'mean', text: 'Bấm vào <b>mức lưu lượng trung bình năm</b> (dải màu cam).' },
    { id: 'rain', text: 'Bật <b>lượng mưa</b> để so sánh mùa mưa và mùa lũ.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x0e1f2c);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x203040, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.position.set(4, 10, 8); scene.add(sun);
    // nền lưới
    const grid = new THREE.GridHelper(16, 16, 0x31506a, 0x1c3446); grid.position.set(0, 0, 0); scene.add(grid);
    const ax = new THREE.Group(); scene.add(ax);
    for (let v = 0; v <= 10000; v += 2000) {
      const y = v * SQ; const l = new THREE.Mesh(new THREE.BoxGeometry(12.4, .012, .012), new THREE.MeshBasicMaterial({ color: 0x3d5d77 })); l.position.set(0, y, -.9); ax.add(l);
      api.label(fmt(v), { cls: 'sm plain', pos: new THREE.Vector3(-6.6, y, -.9) });
    }
    api.label('m³/s', { cls: 'sm', pos: new THREE.Vector3(-6.6, 6.5, -.9) });
    // cột lưu lượng
    const bars = Q.map((q, i) => {
      const h = q * SQ; const m = new THREE.Mesh(new THREE.BoxGeometry(.62, h, .62), new THREE.MeshStandardMaterial({ color: 0x5a9fd6, roughness: .5, emissive: 0x000000 }));
      m.position.set(-5.5 + i, h / 2, 0); scene.add(m);
      api.label('T' + (i + 1), { cls: 'sm plain', pos: new THREE.Vector3(-5.5 + i, -.35, .5) });
      api.hotspot(m, { title: `Tháng ${i + 1}`, html: `Lưu lượng trung bình: <b>${fmt(q)} m³/s</b> (${q > QTB ? 'cao hơn' : 'thấp hơn'} trung bình năm → <b>${q > QTB ? 'mùa lũ' : 'mùa cạn'}</b>).<br>Lượng mưa ở Hà Nội: ${String(R[i]).replace('.', ',')} mm.`, id: 'bar' + (i + 1) });
      return m;
    });
    // cột lượng mưa (ẩn lúc đầu)
    const rainG = new THREE.Group(); scene.add(rainG);
    R.forEach((r, i) => { const h = r * SR; const m = new THREE.Mesh(new THREE.BoxGeometry(.28, h, .28), new THREE.MeshStandardMaterial({ color: 0x6cc79a, transparent: true, opacity: .9 })); m.position.set(-5.5 + i + .28, h / 2, -.55); rainG.add(m); });
    const rainLbl = api.label('Lượng mưa Hà Nội (mm) – cột xanh lá', { cls: 'sm', pos: new THREE.Vector3(0, 5.2, -.6) });
    // mức trung bình năm
    const meanM = new THREE.Mesh(new THREE.BoxGeometry(12.6, .05, 1.2), new THREE.MeshBasicMaterial({ color: 0xf0a040, transparent: true, opacity: .75 })); meanM.position.set(0, QTB * SQ, 0); scene.add(meanM);
    const meanInfo = { title: 'Lưu lượng trung bình năm', html: '≈ <b>3 633 m³/s</b>. Các tháng có cột vượt lên trên dải cam thuộc <b>mùa lũ</b> (tháng 6 – 10).', id: 'mean', onPick: () => api.done('mean') };
    api.hotspot(meanM, meanInfo);
    api.label('Trung bình năm ≈ 3 633 m³/s', { cls: 'warm', pos: new THREE.Vector3(6.6, QTB * SQ + .25, 0), onClick: meanInfo });
    // mặt cắt lòng sông bên phải
    const sec = new THREE.Group(); sec.position.set(9.6, 0, 0); scene.add(sec);
    const bankShape = new THREE.Shape(); bankShape.moveTo(-2.4, 4.2); bankShape.lineTo(-1.6, 4.0); bankShape.lineTo(-1.2, .6); bankShape.lineTo(-.6, 0); bankShape.lineTo(.6, 0); bankShape.lineTo(1.2, .6); bankShape.lineTo(1.6, 4.0); bankShape.lineTo(2.4, 4.2); bankShape.lineTo(2.4, -.6); bankShape.lineTo(-2.4, -.6);
    const bank = new THREE.Mesh(new THREE.ExtrudeGeometry(bankShape, { depth: 3, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0x8a6a45, roughness: .95 })); bank.position.z = -1.5; sec.add(bank);
    const grass = new THREE.Mesh(new THREE.BoxGeometry(.8, .12, 3), new THREE.MeshStandardMaterial({ color: 0x4f8a3f })); grass.position.set(-2.0, 4.18, 0); sec.add(grass); const g2 = grass.clone(); g2.position.x = 2.0; sec.add(g2);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x3d8fd8, transparent: true, opacity: .8, roughness: .2 });
    const water = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 2.9), waterMat); sec.add(water);
    const lvlLbl = api.label('', { cls: 'cold', pos: new THREE.Vector3(9.6, 4.8, 1.6) });
    api.label('Mặt cắt lòng sông', { cls: 'sm', pos: new THREE.Vector3(9.6, -.9, 1.6) });
    // dòng chảy
    const flowN = 60; const flow = new THREE.InstancedMesh(new THREE.SphereGeometry(.04, 6, 4), new THREE.MeshBasicMaterial({ color: 0xd8f0ff }), flowN); sec.add(flow);
    const fd = Array.from({ length: flowN }, () => ({ x: Math.random() * 2 - 1, y: Math.random(), z: Math.random() }));
    const m4 = new THREE.Matrix4();
    state.month = 1; state.level = 0;
    const setMonth = mo => {
      state.month = mo; const q = Q[mo - 1];
      bars.forEach((b, i) => { b.material.emissive.setHex(i === mo - 1 ? 0x553300 : 0x000000); });
      lvlLbl.element.innerHTML = `Tháng ${mo}: <b>${fmt(q)} m³/s</b>`;
      api.readout(`<b>Tháng ${mo}</b><br>Lưu lượng: ${fmt(q)} m³/s<br>Lượng mưa Hà Nội: ${String(R[mo - 1]).replace('.', ',')} mm<br>${q > QTB ? '🌊 Mùa lũ' : '🏜 Mùa cạn'}`);
      if (mo === 8) api.done('peak'); if (mo === 3) api.done('low');
    };
    api.onTick(dt => {
      const q = Q[state.month - 1]; const target = .25 + Math.sqrt(q / 9246) * 3.5; state.level += (target - state.level) * Math.min(1, dt * 3);
      const lv = state.level; const halfW = .6 + Math.min(lv, .6) / .6 * .6 + Math.max(0, lv - .6) * (.4 / 3.4);
      water.scale.set(halfW * 2, lv, 1); water.position.set(0, lv / 2, 0);
      const sp = .3 + q / 9246 * 2.2; const muddy = q / 9246; waterMat.color.setRGB(.24 + muddy * .35, .56 - muddy * .12, .85 - muddy * .45);
      for (let i = 0; i < flowN; i++) { const d = fd[i]; d.z = (d.z + dt * sp * .4) % 1; m4.makeTranslation(d.x * halfW * .9, d.y * lv * .9 + .05, -1.4 + d.z * 2.8); flow.setMatrixAt(i, m4); }
      flow.instanceMatrix.needsUpdate = true;
    });
    // trạng thái điều khiển từ các bước
    state.showRain = v => { state.fromStep = true; api.set('rain', v); state.fromStep = false; };
    const paintSeason = v => { bars.forEach((b, i) => b.material.color.setHex(v ? (Q[i] > QTB ? 0x2f6fd0 : 0xa9c9e6) : 0x5a9fd6)); api.legend(v ? [{ c: '#2f6fd0', t: 'Mùa lũ (Q > TB năm)' }, { c: '#a9c9e6', t: 'Mùa cạn' }, { c: '#f0a040', t: 'Lưu lượng TB năm' }] : null); };
    state.colorSeason = v => api.set('season', v);
    state.pulse = 0; state.pulseMean = () => { state.pulse = 3; };
    api.onTick(dt => { if (state.pulse > 0) { state.pulse -= dt; meanM.material.opacity = state.pulse > 0 ? .45 + .4 * Math.abs(Math.sin(state.pulse * 3)) : .75; } });
    api.heading('Điều khiển');
    api.slider('month', 'Tháng', { min: 1, max: 12, step: 1, value: 1, format: v => 'Tháng ' + v }, setMonth);
    api.toggle('rain', 'Lượng mưa (Hà Nội)', false, v => { rainG.visible = v; rainLbl.visible = v; if (v && !state.fromStep) api.done('rain'); });
    api.toggle('season', 'Tô màu mùa lũ – mùa cạn', false, paintSeason);
    let play = null;
    api.toggle('play', 'Tự chạy qua 12 tháng', false, v => { clearInterval(play); if (v) play = setInterval(() => api.set('month', state.month % 12 + 1), 1100); });
  },
};

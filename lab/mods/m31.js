// 3D-31 · Bài 31 – Tác động của công nghiệp đối với môi trường, phát triển năng lượng tái tạo, định hướng phát triển công nghiệp
import { THREE, vec, mat, boxM, cylM, mesh, factory, turbine, solar, building, house, forest, water, stage, emitter, rng, fmtN } from '../kit.js';

// IPCC AR5 WGIII, Annex III: phát thải vòng đời trung vị (g CO2 tương đương / kWh)
const EF = { coal: 820, gas: 490, solar: 48, wind: 11, hydro: 24 };

export default {
  id: '3D-31', code: 'DL10.B31', title: 'Công nghiệp và môi trường, năng lượng tái tạo',
  objectives: [
    { c: 'DL10.11.05', t: 'Tác động của công nghiệp đối với môi trường; sự cần thiết phát triển năng lượng tái tạo' },
    { c: 'DL10.11.03', t: 'Định hướng phát triển công nghiệp trong tương lai' },
  ],
  sources: [
    { t: 'IPCC AR5 WGIII (2014), Annex III – Technology-specific cost and performance parameters', u: 'https://www.ipcc.ch/report/ar5/wg3/', n: 'hệ số phát thải vòng đời' },
    { t: 'IEA – Renewables', u: 'https://www.iea.org/energy-system/renewables' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 31', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Mô phỏng giả định nguồn điện hoá thạch gồm 60% than, 40% khí; nguồn tái tạo gồm mặt trời, gió, thuỷ điện chia đều. Số liệu chỉ để so sánh mức phát thải tương đối.',
  view: { pos: [0, 9, 17], target: [0, 1, 0] },
  steps: [
    { title: 'Công nghiệp tác động đến môi trường', html: '<ul><li><b>Không khí</b>: khói bụi, SO₂, NOₓ, CO₂ từ nhà máy nhiệt điện, luyện kim, xi măng → ô nhiễm không khí, <b>mưa axit</b>, tăng hiệu ứng nhà kính.</li><li><b>Nước</b>: nước thải chưa xử lí làm ô nhiễm sông, hồ, biển.</li><li><b>Đất</b>: chất thải rắn, chất thải nguy hại.</li><li>Khai thác làm <b>cạn kiệt tài nguyên</b>, thay đổi cảnh quan.</li></ul><div class="tip">Bấm vào khói nhà máy nhiệt điện và dòng nước thải.</div>',
      enter: a => { a.fly([-7, 9, 16], [-4, 1.5, 0]); } },
    { title: 'Giải pháp giảm tác động', html: '<ul><li>Lắp hệ thống <b>lọc bụi, xử lí khí thải</b>, <b>xử lí nước thải</b> tập trung.</li><li>Đổi mới công nghệ sạch, tiết kiệm năng lượng; tái chế, kinh tế tuần hoàn.</li><li>Quy hoạch khu công nghiệp xa khu dân cư, có vành đai cây xanh.</li></ul><div class="tip">Bật các giải pháp ở mục điều khiển và quan sát dòng sông.</div>',
      enter: a => { a.fly([-2, 8, 13], [-2, 0, 1]); } },
    { title: 'Vì sao phải phát triển năng lượng tái tạo?', html: '<ul><li>Nhiên liệu hoá thạch (than, dầu, khí) <b>có hạn</b>, đang cạn dần.</li><li>Đốt nhiên liệu hoá thạch là nguồn phát thải khí nhà kính lớn nhất → <b>biến đổi khí hậu</b>.</li><li>Năng lượng tái tạo (mặt trời, gió, thuỷ năng, sinh khối, địa nhiệt, thuỷ triều) <b>sạch, vô tận</b>, phân bố rộng, góp phần bảo đảm an ninh năng lượng.</li></ul><div class="tip">Kéo thanh <b>Tỉ trọng điện tái tạo</b> và đọc lượng phát thải.</div>',
      enter: a => { a.fly([5, 8, 14], [4, 1, 0]); } },
    { title: 'Định hướng phát triển công nghiệp', html: '<ul><li>Phát triển <b>công nghiệp xanh</b>, các-bon thấp; tăng tỉ trọng năng lượng tái tạo.</li><li>Ứng dụng công nghệ cao, tự động hoá, trí tuệ nhân tạo.</li><li>Sử dụng tiết kiệm, hiệu quả tài nguyên; tái chế chất thải.</li></ul>',
      enter: a => { a.fly([0, 11, 18], [0, 1, 0]); } },
  ],
  tasks: [
    { id: 'acid', text: 'Bấm vào <b>khói</b> của nhà máy nhiệt điện than.' },
    { id: 'water', text: 'Bật <b>xử lí nước thải</b> để làm sạch dòng sông.' },
    { id: 'renew', text: 'Tăng điện tái tạo tới khi phát thải giảm <b>hơn một nửa</b>.' },
    { id: 'wind', text: 'Bấm vào một <b>tua-bin gió</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa8d4ef });
    const sky = scene.background; const skyClean = new THREE.Color(0xa8d4ef), skyDirty = new THREE.Color(0xb7ab92);
    scene.add(water(80, 50, { color: 0x2b78b8, y: -.3 }));
    scene.add(boxM(28, .5, 16, 0x8a6a45, [0, -.25, 0])); const grd = boxM(28, .04, 16, 0x86b464, [0, 0, 0], { unique: true }); scene.add(grd);
    // nhà máy nhiệt điện than
    const plant = new THREE.Group(); plant.position.set(-7, 0, -3); scene.add(plant);
    plant.add(boxM(3, 1.4, 2, 0x7f8c8d, [0, .7, 0]));
    const towers = []; for (let i = 0; i < 2; i++) { const t = mesh(new THREE.CylinderGeometry(.75, 1.05, 2.4, 20, 1, true), 0xd5d8dc, [2.4 + i * 1.8, 1.2, .3]); plant.add(t); towers.push(t); }
    plant.add(cylM(.18, .25, 4.2, 0xb04a3a, [-1, 2.1, -.5]));
    const smk = [emitter(api, plant, vec(-1, 4.3, -.5), { color: 0x555555, n: 22, rise: 1.6, spread: .9, size: .35 }), emitter(api, plant, vec(2.4, 2.5, .3), { color: 0xf2f2f2, n: 12, rise: 1, spread: .4, size: .4 }), emitter(api, plant, vec(4.2, 2.5, .3), { color: 0xf2f2f2, n: 12, rise: 1, spread: .4, size: .4 })];
    const coalPile = mesh(new THREE.ConeGeometry(1, .8, 8), 0x222222, [-2.6, .4, 1]); plant.add(coalPile);
    const smokeInfo = { title: 'Khói thải nhà máy nhiệt điện than', html: 'Chứa bụi, SO₂, NOₓ và CO₂. SO₂, NOₓ kết hợp hơi nước tạo <b>mưa axit</b> làm hại cây trồng, ăn mòn công trình; CO₂ làm tăng <b>hiệu ứng nhà kính</b>.', id: 'acid', onPick: () => api.done('acid') };
    const smokeHit = mesh(new THREE.SphereGeometry(1.4, 10, 8), 0x000000, [-1, 5.6, -.5], { opacity: .001 }); plant.add(smokeHit);
    api.hotspot(smokeHit, smokeInfo); api.hotspot(plant, smokeInfo);
    api.label('Nhiệt điện than', { cls: 'sm warm', pos: vec(-7, 4.3, -1.4), onClick: smokeInfo });
    // nhà máy xả nước thải + sông
    const riv = boxM(1.4, .05, 16, 0x3a8fd8, [-1.5, .04, 0], { unique: true, rough: .2 }); scene.add(riv);
    const plume = boxM(1.36, .06, 6, 0x4a3b2a, [-1.5, .05, 3], { unique: true, opacity: .85 }); scene.add(plume);
    const fac = factory(api, { roof: 0x8e44ad, chimneys: 1 }); fac.position.set(-4, 0, 2.6); scene.add(fac);
    const pipe = cylM(.08, .08, 1.6, 0x555555, [-2.6, .15, 2.6]); pipe.rotation.z = Math.PI / 2; scene.add(pipe);
    const wInfo = () => ({ title: 'Nước thải công nghiệp', html: state.wt ? 'Nước thải đã qua <b>trạm xử lí</b> trước khi xả ra sông → sông sạch hơn, cá tôm sinh sống được.' : 'Nước thải <b>chưa xử lí</b> chứa hoá chất, kim loại nặng → ô nhiễm sông, ảnh hưởng sức khoẻ người dân vùng hạ lưu.' });
    api.hotspot(plume, wInfo); api.hotspot(fac, wInfo); api.label('Nước thải', { cls: 'sm', pos: vec(-1.5, .9, 3.6), onClick: wInfo });
    const wtp = new THREE.Group(); wtp.position.set(-3.2, 0, 5); scene.add(wtp); for (let i = 0; i < 2; i++) { wtp.add(cylM(.5, .5, .3, 0x95a5a6, [i * 1.1, .15, 0])); wtp.add(cylM(.42, .42, .02, 0x3ad8a0, [i * 1.1, .31, 0], { basic: true })); }
    // dân cư
    [[1.5, 5], [2.6, 5.6], [3.6, 4.8], [1.8, 6.4]].forEach(([x, z]) => { const h = house(); h.position.set(x, 0, z); scene.add(h); });
    [[1.8, -5.5, 2.8], [3, -5.8, 3.6], [4.2, -5.4, 2.4]].forEach(([x, z, h]) => { const b = building({ h }); b.position.set(x, 0, z); scene.add(b); });
    const trees = forest(16, 5, 3, { seed: 3 }); trees.position.set(-9.5, 0, 4.2); scene.add(trees);
    // năng lượng tái tạo
    const RE = new THREE.Group(); scene.add(RE); const turbs = []; const panels = [];
    for (let i = 0; i < 6; i++) { const t = turbine(api, { h: 2.6 }); t.position.set(7 + (i % 3) * 2, 0, -5 + Math.floor(i / 3) * 2.4); RE.add(t); turbs.push(t); api.hotspot(t, { title: 'Điện gió', html: 'Tua-bin biến động năng của gió thành điện. Phát thải vòng đời rất thấp (khoảng 11 g CO₂/kWh). Việt Nam có tiềm năng điện gió lớn ở ven biển Nam Trung Bộ, Nam Bộ.', id: 'wind', onPick: () => api.done('wind') }); }
    for (let i = 0; i < 4; i++) { const p = solar({ rows: 2, cols: 3 }); p.position.set(7.4 + (i % 2) * 2.8, 0, 1.4 + Math.floor(i / 2) * 2); RE.add(p); panels.push(p); api.hotspot(p, { title: 'Điện mặt trời', html: 'Tấm pin quang điện biến ánh sáng mặt trời thành điện. Việt Nam có số giờ nắng cao, nhất là Nam Trung Bộ và Nam Bộ.' }); }
    api.label('Năng lượng tái tạo', { cls: 'sm cold', pos: vec(9, 4, -3) });
    // tính phát thải
    state.r = 0; state.wt = false; state.filter = false;
    const update = () => {
      const r = state.r / 100; const fossil = (.6 * EF.coal + .4 * EF.gas); const ren = (EF.solar + EF.wind + EF.hydro) / 3; const I = (1 - r) * fossil + r * ren; const base = fossil;
      smk[0].rate((1 - r) * (state.filter ? .5 : 1)); smk[1].rate(1 - r); smk[2].rate(1 - r);
      turbs.forEach((t, i) => { t.visible = i < Math.ceil(r * 6) || r > .02 && i === 0; t.userData.setSpeed(1.2 + r * 2); }); panels.forEach((p, i) => (p.visible = i < Math.ceil(r * 4)));
      sky.copy(skyDirty).lerp(skyClean, Math.min(1, r * 1.2 + (state.filter ? .3 : 0)));
      riv.material.color.setHex(state.wt ? 0x3a8fd8 : 0x5b7f7a); plume.visible = !state.wt; wtp.visible = state.wt;
      api.readout(`<b>Cơ cấu nguồn điện</b>: hoá thạch ${Math.round((1 - r) * 100)}% · tái tạo ${Math.round(r * 100)}%<br>Phát thải: <b>${fmtN(I, 0)} g CO₂/kWh</b> (giảm ${fmtN((1 - I / base) * 100, 0)}% so với 100% hoá thạch)`);
      if (state.ready && I < base / 2) api.done('renew');
    };
    api.heading('Năng lượng');
    api.slider('r', 'Tỉ trọng điện tái tạo', { min: 0, max: 100, step: 5, value: 0, format: v => v + '%' }, v => { state.r = v; update(); });
    api.heading('Giải pháp môi trường');
    api.toggle('wt', 'Xử lí nước thải tập trung', false, v => { state.wt = v; update(); if (v && state.ready) api.done('water'); });
    api.toggle('filter', 'Lọc bụi, xử lí khí thải', false, v => { state.filter = v; update(); });
    api.legend([{ c: '#555555', t: 'Khói bụi, khí thải' }, { c: '#4a3b2a', t: 'Nước thải chưa xử lí' }, { c: '#5dade2', t: 'Năng lượng tái tạo' }]);
    state.ready = true; update();
  },
};

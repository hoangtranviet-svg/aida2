// 3D-25 · Bài 25 – Địa lí ngành lâm nghiệp và ngành thuỷ sản
import { THREE, vec, mat, boxM, cylM, mesh, tree, water, boat, bars, stage, rng, fmtN, emitter, truck } from '../kit.js';

// FAO SOFIA 2022 (năm 2020) và SOFIA 2024 (năm 2022) – sản lượng động vật thuỷ sản, triệu tấn
const FISH = [{ t: '2020', v: [90.3, 87.5] }, { t: '2022', v: [91.0, 94.4] }];

export default {
  id: '3D-25', code: 'DL10.B25', title: 'Địa lí ngành lâm nghiệp và thuỷ sản',
  objectives: [
    { c: 'DL10.10.03', t: 'Vai trò, đặc điểm lâm nghiệp, thuỷ sản' },
    { c: 'DL10.10.04', t: 'Phân bố lâm nghiệp, thuỷ sản trên thế giới' },
    { c: 'DL10.10.08', t: 'Phân tích số liệu thống kê' },
  ],
  sources: [
    { t: 'FAO – The State of World Fisheries and Aquaculture 2024', u: 'https://www.fao.org/publications/home/fao-flagship-publications/the-state-of-world-fisheries-and-aquaculture', n: 'sản lượng khai thác, nuôi trồng 2022' },
    { t: 'FAO – The State of World Fisheries and Aquaculture 2022', u: 'https://www.fao.org/publications/home/fao-flagship-publications/the-state-of-world-fisheries-and-aquaculture', n: 'số liệu năm 2020' },
    { t: 'FAO – Global Forest Resources Assessment 2020', u: 'https://www.fao.org/forest-resources-assessment/2020/', n: 'diện tích rừng thế giới' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 25', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Mô phỏng che phủ rừng theo thời gian là minh hoạ định tính. Số liệu thuỷ sản là động vật thuỷ sản (không gồm rong, tảo).',
  view: { pos: [0, 9, 17], target: [0, 1, 0] },
  steps: [
    { title: 'Lâm nghiệp: vai trò, đặc điểm', html: '<ul><li><b>Vai trò</b>: cung cấp gỗ, lâm sản, dược liệu, nguyên liệu cho công nghiệp (giấy, đồ gỗ); <b>phòng hộ</b> (giữ đất, giữ nước, chống xói mòn, điều hoà khí hậu); bảo tồn đa dạng sinh học.</li><li><b>Đặc điểm</b>: cây rừng có <b>chu kì sinh trưởng dài</b>; hoạt động gồm trồng rừng, khai thác, chế biến lâm sản; phân bố chủ yếu ở vùng đồi núi.</li></ul>',
      enter: a => { a.fly([-9, 8, 13], [-5, 1.2, 0]); } },
    { title: 'Khai thác rừng: tàn phá hay bền vững?', html: '<p>Rừng thế giới khoảng <b>4,06 tỉ ha</b>, chiếm 31% diện tích đất liền (FAO, 2020); hơn một nửa nằm ở 5 nước: Liên bang Nga, Bra-xin, Ca-na-đa, Hoa Kỳ, Trung Quốc.</p><p>Khai thác quá mức làm mất rừng, đất bị xói mòn, lũ lụt tăng. Cần khai thác đi đôi với <b>trồng mới</b>, bảo vệ rừng.</p><div class="tip">Chọn cách khai thác rồi kéo thanh <b>Số năm</b>.</div>',
      enter: a => { a.fly([-11, 9, 14], [-5, 1, 0]); } },
    { title: 'Thuỷ sản: vai trò, đặc điểm', html: '<ul><li><b>Vai trò</b>: cung cấp thực phẩm giàu đạm, nguyên liệu cho công nghiệp chế biến, hàng xuất khẩu, tạo việc làm.</li><li><b>Đặc điểm</b>: đối tượng là sinh vật sống dưới nước; phụ thuộc diện tích mặt nước, nguồn lợi thuỷ sản; gồm <b>khai thác</b> và <b>nuôi trồng</b>.</li></ul>',
      enter: a => { a.fly([7, 6, 12], [6, 0, 0]); } },
    { title: 'Nuôi trồng vượt khai thác', html: '<p>Năm 2022, sản lượng động vật thuỷ sản <b>nuôi trồng (94,4 triệu tấn)</b> lần đầu vượt <b>khai thác (91,0 triệu tấn)</b> (FAO, 2024).</p><ul><li>Khai thác nhiều: Trung Quốc, In-đô-nê-xi-a, Pê-ru, Ấn Độ, Liên bang Nga, Hoa Kỳ, Việt Nam.</li><li>Nuôi trồng: Trung Quốc chiếm hơn một nửa; Ấn Độ, In-đô-nê-xi-a, Việt Nam, Băng-la-đét.</li></ul><div class="tip">Bấm vào các cột để đọc số liệu.</div>',
      enter: a => { a.fly([6, 5, 9.5], [6, 2.2, -3]); } },
  ],
  tasks: [
    { id: 'cut', text: 'Chọn <b>Khai thác quá mức</b> và kéo thời gian tới khi độ che phủ rừng <b>dưới 30%</b>.' },
    { id: 'sus', text: 'Chuyển sang <b>khai thác bền vững</b> để thấy rừng được phục hồi.' },
    { id: 'aqua', text: 'Bấm vào cột <b>nuôi trồng năm 2022</b>.' },
    { id: 'cage', text: 'Bấm vào <b>lồng bè nuôi cá</b> trên biển.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa9d6f0 });
    const sea = water(40, 30, { color: 0x2c7fc0, y: -.2 }); sea.position.x = 8; scene.add(sea);
    // ---- vùng đồi núi có rừng ----
    const land = new THREE.Group(); land.position.set(-6, 0, 0); scene.add(land);
    land.add(boxM(14, .6, 12, 0x8a6a45, [0, -.3, 0])); land.add(boxM(14, .04, 12, 0x7cae5c, [0, 0, 0]));
    const hill = mesh(new THREE.SphereGeometry(5, 32, 14, 0, Math.PI * 2, 0, Math.PI / 2), 0x6c9a4a, [0, -.2, -1], { flat: true, unique: true }); hill.scale.y = .62; land.add(hill);
    const trees = []; const R = rng(11);
    for (let i = 0; i < 90; i++) { const a = R() * Math.PI * 2, r = Math.sqrt(R()) * 4.4; const x = Math.cos(a) * r, z = -1 + Math.sin(a) * r; const y = Math.sqrt(Math.max(0, 25 - x * x - (z + 1) * (z + 1))) * .62 - .25; const t = tree({ h: 1, kind: i % 3 ? 'cone' : 'round', color: [0x2f7d3a, 0x3c8f44, 0x276b33][i % 3] }); t.position.set(x, Math.max(0, y), z); land.add(t); trees.push({ t, cut: R(), regrow: R() }); }
    api.hotspot(hill, () => ({ title: 'Rừng đầu nguồn', html: `Độ che phủ hiện tại: <b>${Math.round(state.cover)}%</b>. Rừng giữ đất, điều tiết dòng chảy cho sông ở vùng hạ lưu.` }));
    api.label('Rừng đầu nguồn', { cls: 'sm', pos: vec(0, 4.2, -1), parent: land });
    const stumps = new THREE.Group(); land.add(stumps);
    const log = truck({ color: 0x8b5a2b }); log.position.set(3.5, 0, 4); land.add(log);
    const riv = boxM(1.2, .05, 6, 0x3a8fd8, [4.6, .03, 2.5], { unique: true, rough: .2 }); land.add(riv);
    const mud = emitter(api, land, vec(4.6, .1, 4.5), { color: 0x9c7a4f, n: 10, rise: .1, spread: .6, size: .2 });
    api.hotspot(riv, () => ({ title: 'Sông ở hạ lưu', html: state.cover < 40 ? 'Nước đục, nhiều phù sa do <b>đất bị xói mòn</b> trên sườn đồi trọc; mùa mưa dễ lũ quét, mùa khô cạn kiệt.' : 'Rừng còn tốt nên nước sông trong hơn, dòng chảy điều hoà hơn giữa các mùa.' }));
    // ---- biển: khai thác và nuôi trồng ----
    const S = new THREE.Group(); S.position.set(7, 0, 0); scene.add(S);
    const boats = []; for (let i = 0; i < 4; i++) { const b = boat({ color: [0x2e86de, 0xe74c3c, 0xf39c12, 0x16a085][i] }); b.scale.setScalar(1.3); S.add(b); boats.push(b); api.hotspot(b, { title: 'Tàu khai thác thuỷ sản', html: 'Đánh bắt cá, tôm, mực ngoài khơi và ven bờ. Khai thác phụ thuộc nguồn lợi; khai thác quá mức làm cạn kiệt nguồn lợi hải sản.' }); }
    api.onTick((dt, t) => boats.forEach((b, i) => { const a = t * .12 + i * 1.6; b.position.set(Math.cos(a) * 3 + 2, -.15, Math.sin(a) * 2.2 + 2.5); b.rotation.y = -a; }));
    const cages = new THREE.Group(); cages.position.set(-1.5, -.1, 3.5); S.add(cages);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) { const c = new THREE.Mesh(new THREE.TorusGeometry(.42, .05, 8, 20), mat(0xf5b041)); c.rotation.x = Math.PI / 2; c.position.set(i * 1.05, 0, j * 1.05); cages.add(c); cages.add(mesh(new THREE.CircleGeometry(.4, 20), 0x1f5f8b, [i * 1.05, .01, j * 1.05], { opacity: .8 }).rotateX(-Math.PI / 2)); }
    const cInfo = { title: 'Lồng bè nuôi cá trên biển', html: 'Nuôi trồng thuỷ sản đang tăng nhanh nhờ chủ động được sản lượng, đáp ứng nhu cầu thị trường. Cần quản lí ô nhiễm môi trường nước và dịch bệnh.', id: 'cage', onPick: () => api.done('cage') };
    api.hotspot(cages, cInfo); api.label('Nuôi trồng (lồng bè)', { cls: 'sm', pos: vec(1, .7, 4), parent: S, onClick: cInfo });
    // biểu đồ sản lượng
    const B = new THREE.Group(); B.position.set(6, 0, -4); scene.add(B);
    B.add(boxM(4.4, .3, 2, 0x1a3346, [0, .15, 0]));
    const ch = bars(api, { rows: FISH, series: [{ t: 'Khai thác', c: 0x4f9cff }, { t: 'Nuôi trồng', c: 0x3ddc84 }], scale: .045, gap: 1.9, w: .6, depth: .6, parent: B, axisMax: 100, axisStep: 25, fmt: v => fmtN(v),
      info: (r, s) => ({ title: `${s.t} – năm ${r.t}`, html: `Sản lượng động vật thuỷ sản: <b>${fmtN(r.v[s.t === 'Khai thác' ? 0 : 1])} triệu tấn</b>`, id: s.t + r.t, onPick: () => { if (s.t === 'Nuôi trồng' && r.t === '2022') api.done('aqua'); } }) });
    ch.group.position.y = .3;
    api.label('Sản lượng thuỷ sản thế giới (triệu tấn)', { cls: 'sm', pos: vec(0, 5.4, 0), parent: B });
    api.legend([{ c: '#4f9cff', t: 'Khai thác' }, { c: '#3ddc84', t: 'Nuôi trồng' }]);
    // ---- mô phỏng che phủ rừng ----
    state.cover = 80; state.mode = 'over'; state.year = 0;
    const simulate = () => {
      const y = state.year; let cover;
      if (state.mode === 'over') cover = Math.max(8, 80 - y * 2.6);
      else cover = 80 - 12 * Math.abs(Math.sin(y / 30 * Math.PI * 3)) * .6; // khai thác luân phiên, trồng lại
      state.cover = cover; const k = cover / 80;
      trees.forEach(o => { const alive = state.mode === 'over' ? o.cut < k : (o.cut < k || o.regrow > .3); o.t.visible = alive; const g = state.mode === 'sus' && !(o.cut < k) ? .45 + .55 * ((y / 10 + o.regrow) % 1) : 1; o.t.scale.setScalar(g); });
      hill.material.color.setHex(cover < 30 ? 0xa48a5a : cover < 55 ? 0x8fa255 : 0x6c9a4a);
      riv.material.color.setHex(cover < 30 ? 0x8a6f4a : cover < 55 ? 0x5f8fae : 0x3a8fd8); mud.rate(cover < 40 ? 1 : 0);
      log.visible = y > 0;
      api.readout(`<b>${state.mode === 'over' ? 'Khai thác quá mức' : 'Khai thác đi đôi trồng rừng'}</b> · sau ${y} năm<br>Độ che phủ rừng: <b>${Math.round(cover)}%</b>${cover < 30 ? '<br>⚠ Đồi trọc, đất xói mòn, sông đục phù sa' : ''}`);
      if (state.ready) { if (state.mode === 'over' && cover < 30) api.done('cut'); if (state.mode === 'sus' && y > 0) api.done('sus'); }
    };
    api.heading('Rừng đầu nguồn');
    api.choice('mode', 'Cách khai thác', [{ v: 'over', t: 'Khai thác quá mức' }, { v: 'sus', t: 'Khai thác bền vững' }], 'over', v => { state.mode = v; simulate(); });
    api.slider('year', 'Số năm', { min: 0, max: 30, step: 1, value: 0, format: v => v + ' năm' }, v => { state.year = v; simulate(); });
    state.ready = true;
  },
};

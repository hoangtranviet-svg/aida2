// 3D-26 · Bài 26 – Tổ chức lãnh thổ nông nghiệp, một số vấn đề phát triển nông nghiệp hiện đại, định hướng tương lai
import { THREE, vec, mat, boxM, cylM, mesh, house, field, forest, factory, truck, road, cow, crowd, water, solar, stage, rng, collector } from '../kit.js';

const LEVELS = [
  ['farm', 'Trang trại', [6, 5, 7], [0, 0, 0]],
  ['complex', 'Thể tổng hợp nông nghiệp', [10, 14, 17], [1, 0, 0]],
  ['region', 'Vùng nông nghiệp', [0, 56, 50], [0, 0, 2]],
];

export default {
  id: '3D-26', code: 'DL10.B26', title: 'Tổ chức lãnh thổ nông nghiệp và nông nghiệp hiện đại',
  objectives: [
    { c: 'DL10.10.05', t: 'Vai trò, đặc điểm các hình thức tổ chức lãnh thổ nông nghiệp' },
    { c: 'DL10.10.06', t: 'Vấn đề phát triển nông nghiệp hiện đại' },
    { c: 'DL10.10.02', t: 'Định hướng phát triển nông nghiệp trong tương lai' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 26', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'FAO – Climate-smart agriculture', u: 'https://www.fao.org/climate-smart-agriculture/en/' },
  ],
  note: 'Cảnh mô hình là lãnh thổ giả định, phóng to – thu nhỏ để so sánh quy mô ba hình thức tổ chức.',
  view: { pos: [6, 5, 7], target: [0, 0, 0] },
  steps: [
    { title: 'Tổ chức lãnh thổ nông nghiệp', html: '<p>Là sự sắp xếp, phối hợp các đối tượng nông nghiệp trên một lãnh thổ nhằm sử dụng hợp lí các điều kiện tự nhiên, kinh tế – xã hội, đem lại hiệu quả cao về kinh tế, xã hội và môi trường.</p><p><b>Vai trò</b>: thúc đẩy chuyên môn hoá sản xuất; sử dụng hợp lí tài nguyên, bảo vệ môi trường; góp phần hiện đại hoá nông nghiệp.</p>',
      enter: a => { a.set('lvl', 0); } },
    { title: 'Trang trại', html: '<ul><li>Mục đích chủ yếu là <b>sản xuất hàng hoá</b>.</li><li>Quy mô đất đai, vốn tương đối lớn; áp dụng khoa học – kĩ thuật, cơ giới hoá.</li><li>Có thuê mướn lao động; quản lí theo cách tiến bộ.</li></ul><div class="tip">Bấm vào ngôi nhà chủ trang trại và nhà kính.</div>',
      enter: a => { a.set('lvl', 0); } },
    { title: 'Thể tổng hợp nông nghiệp', html: '<ul><li>Hình thức cao hơn: liên kết các <b>hộ gia đình, trang trại, hợp tác xã, doanh nghiệp</b>.</li><li>Gắn vùng nguyên liệu với <b>cơ sở chế biến</b>, dịch vụ nông nghiệp → sản xuất theo chuỗi, giảm chi phí, tăng giá trị.</li></ul><div class="tip">Theo dõi xe chở nông sản về nhà máy chế biến.</div>',
      enter: a => { a.set('lvl', 1); } },
    { title: 'Vùng nông nghiệp', html: '<ul><li>Hình thức cao nhất; là những lãnh thổ có sự tương đồng về điều kiện sinh thái, kinh tế – xã hội.</li><li>Có hướng <b>chuyên môn hoá</b> sản xuất (vùng lúa, vùng cây công nghiệp, vùng chăn nuôi…).</li><li>Là cơ sở để phân bố hợp lí cây trồng, vật nuôi và quy hoạch phát triển nông nghiệp.</li></ul>',
      enter: a => { a.set('lvl', 2); } },
    { title: 'Nông nghiệp hiện đại và định hướng tương lai', html: '<p><b>Vấn đề</b>: dân số tăng, nhu cầu lương thực lớn; đất nông nghiệp thu hẹp; biến đổi khí hậu, thiên tai; ô nhiễm do lạm dụng hoá chất.</p><p><b>Định hướng</b>:</p><ul><li>Nông nghiệp <b>công nghệ cao, thông minh</b> (cảm biến, máy bay không người lái, tự động hoá).</li><li>Nông nghiệp <b>xanh, hữu cơ</b>, tuần hoàn.</li><li>Nông nghiệp <b>thích ứng với biến đổi khí hậu</b>; liên kết theo chuỗi giá trị.</li></ul><div class="tip">Bật <b>Công nghệ cao</b> để xem trang trại thông minh.</div>',
      enter: a => { a.set('lvl', 0); a.fly([7, 6, 8], [0, .5, 0]); } },
  ],
  tasks: [
    { id: 'farm', text: 'Bấm vào <b>nhà kính</b> của trang trại.' },
    { id: 'complex', text: 'Bấm vào <b>nhà máy chế biến</b> trong thể tổng hợp nông nghiệp.' },
    { id: 'region', text: 'Bấm vào <b>2 vùng chuyên môn hoá</b> khác nhau.' },
    { id: 'smart', text: 'Bật <b>Công nghệ cao</b> cho trang trại.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa8d4ef });
    scene.add(boxM(120, .3, 120, 0x7aa65a, [0, -.2, 0]));
    // ---------- cấp 1: trang trại ----------
    const F = new THREE.Group(); scene.add(F);
    F.add(boxM(5.2, .03, 4.2, 0x95c26a, [0, .01, 0]));
    for (let i = 0; i < 6; i++) F.add(cylM(.03, .03, .4, 0xd8c39a, [-2.6 + i * 1.04, .2, -2.1]));
    const fh = house({ w: .9, h: .6, d: .7, roof: 0x2f6f9f }); fh.position.set(-1.8, 0, -1.3); F.add(fh);
    api.hotspot(fh, { title: 'Chủ trang trại', html: 'Trang trại do một chủ quản lí, sản xuất <b>hàng hoá</b> theo nhu cầu thị trường; có thuê lao động, ghi chép sổ sách, hạch toán kinh tế.' });
    const ghG = new THREE.Group(); ghG.position.set(1.2, 0, -1.1); F.add(ghG);
    for (let i = 0; i < 2; i++) { const g = new THREE.Group(); g.add(boxM(1.2, .55, 1.6, 0xe8f6ff, [0, .28, 0], { opacity: .45 })); g.add(boxM(1.2, .03, 1.6, 0xffffff, [0, .57, 0], { opacity: .7 })); for (let r = 0; r < 4; r++) g.add(boxM(1, .1, .15, 0x2ecc71, [0, .06, -.6 + r * .4])); g.position.x = i * 1.35; ghG.add(g); }
    const ghInfo = { title: 'Nhà kính trồng rau, hoa', html: 'Trang trại áp dụng kĩ thuật cao: nhà kính, tưới nhỏ giọt, giống mới → năng suất cao, sản xuất quanh năm.', id: 'farm', onPick: () => api.done('farm') };
    api.hotspot(ghG, ghInfo); api.label('Nhà kính', { cls: 'sm', pos: vec(1.9, 1, -1.1), parent: F, onClick: ghInfo });
    const fl = field(2.4, 1.6, { color: 0xd8c24a, row: 0xb9a33a }); fl.position.set(-1.1, 0, .9); F.add(fl);
    const tractor = new THREE.Group(); tractor.add(boxM(.35, .22, .25, 0xd35400, [0, .2, 0])); tractor.add(boxM(.15, .18, .2, 0x34495e, [-.1, .38, 0])); tractor.add(cylM(.12, .12, .05, 0x222222, [-.12, .12, .14]).rotateX(Math.PI / 2)); tractor.add(cylM(.12, .12, .05, 0x222222, [-.12, .12, -.14]).rotateX(Math.PI / 2)); F.add(tractor);
    api.hotspot(tractor, { title: 'Cơ giới hoá', html: 'Máy kéo, máy gặt đập liên hợp thay thế sức người, giảm chi phí, tăng năng suất lao động.' });
    api.onTick((dt, t) => { const k = (Math.sin(t * .4) + 1) / 2; tractor.position.set(-2.1 + k * 2, 0, .9 + Math.sin(t * 2) * .02); });
    const workers = crowd(4, 1.4, .6, { seed: 4 }); workers.position.set(1.6, 0, 1); F.add(workers);
    api.hotspot(workers, { title: 'Lao động làm thuê', html: 'Trang trại thường thuê mướn lao động theo mùa vụ hoặc thường xuyên.' });
    const pen = new THREE.Group(); pen.position.set(1.8, 0, 1.2); for (let i = 0; i < 3; i++) { const c = cow(); c.position.set(-.5 + i * .5, 0, -.3); pen.add(c); } F.add(pen);
    api.label('Trang trại', { cls: 'big', pos: vec(0, 1.8, 0), parent: F });
    // công nghệ cao
    const smart = new THREE.Group(); F.add(smart);
    const drone = new THREE.Group(); drone.add(boxM(.25, .06, .25, 0x2c3e50)); for (const [x, z] of [[.18, .18], [-.18, .18], [.18, -.18], [-.18, -.18]]) drone.add(cylM(.1, .1, .01, 0xbdc3c7, [x, .05, z])); smart.add(drone);
    const sp = solar({ rows: 1, cols: 3 }); sp.position.set(-1.6, 0, 1.8); sp.scale.setScalar(.7); smart.add(sp);
    const sensors = []; for (let i = 0; i < 5; i++) { const s = cylM(.03, .03, .35, 0xecf0f1, [-2 + i * .45, .18, .5]); smart.add(s); const led = mesh(new THREE.SphereGeometry(.05, 8, 6), 0x2ecc71, [-2 + i * .45, .38, .5], { basic: true, unique: true }); smart.add(led); sensors.push(led); }
    api.hotspot(drone, { title: 'Máy bay không người lái', html: 'Phun thuốc, bón phân chính xác theo bản đồ đồng ruộng, giảm lượng hoá chất, bảo vệ sức khoẻ người lao động.' });
    api.hotspot(sp, { title: 'Năng lượng mặt trời cho bơm tưới', html: 'Nông nghiệp xanh: dùng năng lượng tái tạo, tiết kiệm nước, giảm phát thải.' });
    api.onTick((dt, t) => { drone.position.set(-1.1 + Math.cos(t * .8) * 1.1, 1.1 + Math.sin(t * 3) * .05, .9 + Math.sin(t * .8) * .6); sensors.forEach((l, i) => l.material.color.setHex(Math.sin(t * 4 + i) > 0 ? 0x2ecc71 : 0x145a32)); });
    // ---------- cấp 2: thể tổng hợp ----------
    const X = new THREE.Group(); scene.add(X); const R = rng(5);
    const farms = [[-8, -5], [-9, 4], [-3, 8], [6, -7], [9, 3], [4, 8]];
    farms.forEach(([x, z], i) => { const f = field(3, 2.2, { color: [0x9cc34a, 0xd8c24a, 0x7fb84a][i % 3] }); f.position.set(x, 0, z); X.add(f); const h = house({ roof: 0xb5523a }); h.position.set(x + 1.9, 0, z - .8); X.add(h); });
    api.label('Hộ gia đình, trang trại (vùng nguyên liệu)', { cls: 'sm', pos: vec(-8, 1.5, 4), parent: X });
    const coop = new THREE.Group(); coop.add(boxM(1.8, .8, 1.2, 0xf5e6c8, [0, .4, 0])); coop.add(boxM(1.9, .06, 1.3, 0x27ae60, [0, .83, 0])); coop.position.set(-4, 0, 0); X.add(coop);
    api.hotspot(coop, { title: 'Hợp tác xã', html: 'Cung ứng giống, vật tư, dịch vụ làm đất, tưới tiêu; tổ chức thu mua, liên kết các hộ sản xuất.' }); api.label('Hợp tác xã', { cls: 'sm', pos: vec(-4, 1.4, 0), parent: X });
    const fac = factory(api, { roof: 0x16a085 }); fac.position.set(5, 0, 0); fac.scale.setScalar(1.1); X.add(fac);
    const facInfo = { title: 'Nhà máy chế biến nông sản', html: 'Doanh nghiệp chế biến là <b>hạt nhân</b> của thể tổng hợp nông nghiệp: bao tiêu sản phẩm, đầu tư kĩ thuật cho vùng nguyên liệu, tạo ra sản phẩm có giá trị cao.', id: 'complex', onPick: () => api.done('complex') };
    api.hotspot(fac, facInfo); api.label('Nhà máy chế biến', { cls: 'sm warm', pos: vec(5, 2.6, 0), parent: X, onClick: facInfo });
    X.add(road(20).translateZ(3.2)); const rv = road(16, { rot: Math.PI / 2 }); rv.position.x = 3.4; X.add(rv);
    const trucks = []; for (let i = 0; i < 3; i++) { const t = truck({ color: 0xf39c12 }); t.scale.setScalar(1.2); X.add(t); trucks.push(t); }
    api.onTick((dt, t) => trucks.forEach((tr, i) => { const k = ((t * .08 + i / 3) % 1); tr.position.set(-9 + k * 12.4, 0, 3.2); }));
    // ---------- cấp 3: vùng nông nghiệp ----------
    const V = new THREE.Group(); scene.add(V);
    const zoneSeen = collector(api, 'region', 2);
    const zones = [
      ['Vùng chuyên canh lúa (đồng bằng)', 0xe8d44d, [-22, 0, 14], 18, 14, 'Đồng bằng phù sa, nguồn nước dồi dào, đông lao động → chuyên môn hoá lúa gạo, thuỷ sản nước ngọt.'],
      ['Vùng cây công nghiệp lâu năm (cao nguyên)', 0x8e5a2b, [20, 0, -14], 18, 14, 'Đất badan, khí hậu cận xích đạo có mùa khô → cà phê, cao su, hồ tiêu, điều.'],
      ['Vùng chăn nuôi gia súc (đồng cỏ, trung du)', 0x7ed957, [-22, 0, -14], 18, 14, 'Đồng cỏ rộng, khí hậu mát → chăn nuôi bò sữa, bò thịt, trâu.'],
      ['Vùng rau, hoa, cây ăn quả ven đô thị', 0xff8fab, [20, 0, 14], 18, 14, 'Gần thị trường tiêu thụ lớn, có vốn và công nghệ → rau an toàn, hoa, cây ăn quả chất lượng cao.'],
    ];
    zones.forEach(([n, c, p, w, d, h]) => { const z = boxM(w, .1, d, c, [p[0], .06, p[2]], { opacity: .55, unique: true }); V.add(z); const info = { title: n, html: h, id: n, onPick: () => zoneSeen(n) }; api.hotspot(z, info); api.label(n, { cls: 'big', pos: vec(p[0], 2, p[2]), parent: V, onClick: info }); });
    V.add(forest(40, 16, 8, { seed: 9, h: 1.6 }).translateX(20).translateZ(-14));
    // điều khiển
    const showLvl = i => { const [id, name, pos, tg] = LEVELS[i]; F.visible = true; X.visible = i >= 1; V.visible = i >= 2; api.fly(pos, tg, 1500); api.readout(`<b>Cấp ${i + 1}: ${name}</b><br>${['Quy mô nhỏ nhất: một đơn vị sản xuất hàng hoá.', 'Liên kết nhiều cơ sở sản xuất với nhà máy chế biến.', 'Quy mô lớn nhất: lãnh thổ chuyên môn hoá.'][i]}`); };
    api.heading('Quy mô lãnh thổ');
    api.slider('lvl', 'Hình thức tổ chức', { min: 0, max: 2, step: 1, value: 0, format: v => LEVELS[v][1] }, showLvl);
    api.toggle('smart', 'Công nghệ cao (trang trại thông minh)', false, v => { smart.visible = v; if (v && state.ready) api.done('smart'); });
    api.legend([{ c: '#e8d44d', t: 'Lúa' }, { c: '#8e5a2b', t: 'Cây công nghiệp' }, { c: '#7ed957', t: 'Chăn nuôi' }, { c: '#ff8fab', t: 'Rau, hoa, quả' }]);
    state.ready = true;
  },
};

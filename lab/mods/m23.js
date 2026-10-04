// 3D-23 · Bài 23 – Vai trò, đặc điểm, các nhân tố ảnh hưởng tới phát triển và phân bố nông nghiệp, lâm nghiệp, thuỷ sản
import { THREE, vec, mat, boxM, cylM, mesh, island, forest, house, field, water, crowd, cow, truck, boat, road, place, stage, collector } from '../kit.js';

// mùa vụ lúa (minh hoạ 2 vụ/năm ở đồng bằng sông Hồng): độ cao cây và giai đoạn theo tháng
const GROW = [.05, .2, .5, .8, 1, .05, .25, .6, .9, 1, .05, .05];
const STAGE = ['đất nghỉ, làm đất', 'gieo cấy vụ đông xuân', 'lúa đẻ nhánh', 'lúa làm đòng, trổ bông', 'thu hoạch vụ đông xuân', 'làm đất, gieo cấy vụ mùa', 'lúa đẻ nhánh', 'lúa làm đòng', 'lúa chín', 'thu hoạch vụ mùa', 'trồng cây vụ đông / đất nghỉ', 'trồng cây vụ đông / đất nghỉ'];
const FAC = {
  soil: ['Đất trồng', 'tn', 'Đất là <b>tư liệu sản xuất chủ yếu, không thể thay thế</b>. Quỹ đất, chất lượng đất ảnh hưởng tới quy mô, năng suất và phân bố cây trồng.'],
  climate: ['Khí hậu', 'tn', 'Nhiệt, ẩm, ánh sáng quyết định cơ cấu cây trồng, vật nuôi, thời vụ và khả năng xen canh, tăng vụ. Thiên tai (bão, hạn, rét) gây nhiều thiệt hại.'],
  river: ['Nguồn nước', 'tn', 'Nước sông, hồ, nước ngầm cung cấp cho tưới tiêu; vùng nhiều mặt nước thuận lợi nuôi trồng thuỷ sản.'],
  bio: ['Sinh vật', 'tn', 'Các giống cây trồng, vật nuôi, đồng cỏ tự nhiên, nguồn lợi thuỷ sản là cơ sở phát triển chăn nuôi, lâm nghiệp, thuỷ sản.'],
  people: ['Dân cư, lao động', 'xh', 'Nông nghiệp cần nhiều lao động; kinh nghiệm sản xuất và thị trường tiêu thụ tại chỗ ảnh hưởng tới cơ cấu, phân bố sản xuất.'],
  tech: ['Khoa học – công nghệ', 'xh', 'Giống mới, nhà kính, tưới nhỏ giọt, cơ giới hoá giúp tăng năng suất, giảm phụ thuộc vào tự nhiên.'],
  market: ['Thị trường tiêu thụ', 'xh', 'Nhu cầu thị trường trong nước và xuất khẩu điều tiết sản xuất, thúc đẩy hình thành vùng chuyên canh.'],
  policy: ['Chính sách, vốn, cơ sở hạ tầng', 'xh', 'Chính sách đất đai, tín dụng, hệ thống thuỷ lợi, đường giao thông, kho lạnh… tạo điều kiện mở rộng sản xuất.'],
};

export default {
  id: '3D-23', code: 'DL10.B23', title: 'Nông nghiệp, lâm nghiệp, thuỷ sản: vai trò, đặc điểm, nhân tố',
  objectives: [
    { c: 'DL10.10.01', t: 'Vai trò, đặc điểm của nông nghiệp, lâm nghiệp, thuỷ sản' },
    { c: 'DL10.10.02', t: 'Các nhân tố ảnh hưởng tới phát triển và phân bố' },
    { c: 'DL10.10.07', t: 'Giải thích thực tế sản xuất ở địa phương' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 23', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'FAO – The State of Food and Agriculture', u: 'https://www.fao.org/publications/sofa/' },
  ],
  note: 'Lịch mùa vụ là minh hoạ đơn giản cho hai vụ lúa chính ở đồng bằng sông Hồng; thực tế thời vụ thay đổi theo địa phương và từng năm.',
  view: { pos: [0, 9, 15], target: [0, 0, 0] },
  steps: [
    { title: 'Vai trò', html: '<ul><li>Cung cấp <b>lương thực, thực phẩm</b> cho con người – vai trò không thể thay thế.</li><li>Cung cấp <b>nguyên liệu</b> cho công nghiệp chế biến (thực phẩm, giấy, dệt…).</li><li>Tạo <b>hàng xuất khẩu</b>, việc làm và thu nhập cho dân cư nông thôn.</li><li>Lâm nghiệp còn <b>bảo vệ môi trường</b>: điều hoà khí hậu, giữ đất, giữ nước, chống xói mòn.</li></ul>',
      enter: a => { a.state.step(1); a.fly([1.5, 11, 16], [1.5, 0, 0]); } },
    { title: 'Đặc điểm của nông nghiệp', html: '<ul><li><b>Đất trồng</b> là tư liệu sản xuất chủ yếu, không thể thay thế.</li><li>Đối tượng lao động là <b>cây trồng, vật nuôi</b> – những cơ thể sống.</li><li>Có <b>tính mùa vụ</b>.</li><li><b>Phụ thuộc</b> nhiều vào điều kiện tự nhiên.</li><li>Ngày càng gắn với khoa học – công nghệ, liên kết sản xuất và hướng tới thị trường.</li></ul><div class="tip">Kéo thanh <b>Tháng</b> để thấy tính mùa vụ của cây lúa; bật <b>Hạn hán</b> để thấy sự phụ thuộc vào tự nhiên.</div>',
      enter: a => { a.state.step(2); a.fly([-3, 6, 10], [-2, 0, 0]); } },
    { title: 'Đặc điểm lâm nghiệp, thuỷ sản', html: '<ul><li><b>Lâm nghiệp</b>: đối tượng là cây rừng có <b>chu kì sinh trưởng dài</b>; rừng có nhiều chức năng (sản xuất, phòng hộ, đặc dụng); phân bố ở vùng đồi núi.</li><li><b>Thuỷ sản</b>: đối tượng là sinh vật sống dưới nước; phụ thuộc vào <b>diện tích mặt nước</b>, nguồn lợi thuỷ sản; gồm khai thác và nuôi trồng.</li></ul>',
      enter: a => { a.state.step(3); a.fly([5, 7, 11], [4, 0, -1]); } },
    { title: 'Các nhân tố ảnh hưởng', html: '<ul><li><b>Tự nhiên</b>: đất, khí hậu, nguồn nước, sinh vật – là tiền đề, ảnh hưởng tới quy mô, cơ cấu, năng suất, phân bố.</li><li><b>Kinh tế – xã hội</b>: dân cư – lao động, khoa học – công nghệ, thị trường, chính sách, vốn, cơ sở hạ tầng – có tính quyết định tới hướng phát triển.</li></ul><div class="tip">Các vòng xanh lá là nhân tố tự nhiên, vòng cam là nhân tố kinh tế – xã hội. Bấm để đọc.</div>',
      enter: a => { a.state.step(4); a.fly([1.5, 12, 15], [1.5, 0, 0]); } },
  ],
  tasks: [
    { id: 'season', text: 'Kéo thanh Tháng tới một <b>tháng thu hoạch lúa</b>.' },
    { id: 'dry', text: 'Bật <b>Hạn hán</b> để thấy nông nghiệp phụ thuộc vào tự nhiên.' },
    { id: 'tn', text: 'Bấm vào <b>2 nhân tố tự nhiên</b>.' },
    { id: 'xh', text: 'Bấm vào <b>2 nhân tố kinh tế – xã hội</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa8d4ef });
    scene.add(water(70, 50, { color: 0x2f7bbd, y: -.15 }));
    const L = new THREE.Group(); scene.add(L); L.add(island(20, 13, { color: 0x79ad5b }));
    // đồi rừng
    const hill = mesh(new THREE.SphereGeometry(3.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), 0x5f8f45, [-6.2, -.3, -3.4], { flat: true }); hill.scale.y = .55; L.add(hill);
    const fr = forest(26, 4.2, 3.2, { kind: 'cone', seed: 2 }); fr.position.set(-6.2, 1.1, -3.4); L.add(fr);
    api.hotspot(hill, { title: 'Rừng trồng và rừng tự nhiên', html: 'Cây rừng có chu kì sinh trưởng dài (keo 5 – 7 năm, gỗ lớn hàng chục năm). Rừng vừa cho gỗ, lâm sản vừa phòng hộ đầu nguồn, chống xói mòn.' });
    api.label('Lâm nghiệp', { cls: 'sm', pos: vec(-6.2, 3.2, -3.4), parent: L });
    // sông
    const riv = water(1.1, 13, { color: 0x3a8fd8, y: .03 }); riv.position.set(-2.4, 0, 0); L.add(riv);
    // ruộng lúa
    const fields = []; for (let i = 0; i < 6; i++) { const f = field(2.2, 1.8, { color: 0x7fc24a, row: 0x5fa236, n: 5 }); f.position.set(.4 + (i % 3) * 2.5, 0, -3.6 + Math.floor(i / 3) * 2.2); L.add(f); fields.push(f); }
    api.label('Ruộng lúa', { cls: 'sm', pos: vec(2.9, 1.2, -4.8), parent: L });
    // chăn nuôi
    const pasture = boxM(3.6, .05, 2.6, 0x9fd06a, [-5.5, .03, 3.2]); L.add(pasture); for (let i = 0; i < 6; i++) { const c = cow({ color: i % 2 ? 0xffffff : 0x8b5a2b }); c.position.set(-6.6 + (i % 3) * .9, .02, 2.6 + Math.floor(i / 3) * .9); c.rotation.y = i; L.add(c); }
    api.label('Chăn nuôi', { cls: 'sm', pos: vec(-5.5, 1, 3.2), parent: L });
    // ao nuôi thuỷ sản + biển
    const pond = boxM(2.6, .05, 1.8, 0x2f8fc8, [6.2, .04, 3.8], { rough: .2 }); L.add(pond); for (let i = 0; i < 6; i++) L.add(cylM(.04, .04, .4, 0xc9b27a, [5.1 + i * .44, .2, 3]));
    api.hotspot(pond, { title: 'Nuôi trồng thuỷ sản', html: 'Ao, đầm nuôi tôm, cá ven biển – phụ thuộc diện tích mặt nước, nguồn nước sạch, con giống, thức ăn.' }); api.label('Nuôi trồng thuỷ sản', { cls: 'sm', pos: vec(6.2, .9, 3.8), parent: L });
    const bt = boat(); bt.position.set(12, -.12, 6); scene.add(bt); api.hotspot(bt, { title: 'Khai thác thuỷ sản', html: 'Đánh bắt cá, tôm, mực ngoài biển – phụ thuộc nguồn lợi thuỷ sản và thời tiết trên biển.' });
    api.onTick((dt, t) => { bt.position.x = 12 + Math.sin(t * .2) * 2; bt.rotation.z = Math.sin(t * 2) * .05; });
    // làng, nhà kính, chợ
    const village = new THREE.Group(); [[0, 0], [.9, .3], [-.8, .4], [.2, 1]].forEach(([x, z]) => { const h = house(); h.position.set(x, 0, z); village.add(h); }); village.add(crowd(6, 2, 1.4).translateZ(.6));
    const gh = new THREE.Group(); gh.add(boxM(2.5, .9, 1.6, 0xe8f6ff, [0, .45, 0], { opacity: .4 })); gh.add(boxM(2.5, .05, 1.6, 0xffffff, [0, .92, 0], { opacity: .6 })); for (let i = 0; i < 4; i++) gh.add(boxM(2.2, .15, .25, 0x2ecc71, [0, .08, -.5 + i * .33]));
    const mk = new THREE.Group(); mk.add(boxM(1.4, .6, .9, 0xf6efe2, [0, .3, 0])); mk.add(boxM(1.5, .06, 1, 0xe74c3c, [0, .66, 0])); const tk = truck(); tk.position.set(1.4, 0, .2); mk.add(tk);
    const office = new THREE.Group(); office.add(boxM(1.1, .8, .8, 0xf5e6c8, [0, .4, 0])); office.add(boxM(.2, .05, .9, 0xda251d, [0, .83, 0]));
    // vòng nhân tố
    const seen = { tn: collector(api, 'tn', 2), xh: collector(api, 'xh', 2) }; const rings = [];
    const factor = (id, obj, pos, r, ly) => {
      const [name, k, html] = FAC[id];
      if (obj) { obj.position.set(...pos); L.add(obj); }
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, .05, 8, 40), mat(k === 'tn' ? 0x3ddc84 : 0xff9f43, { basic: true, unique: true, opacity: .9 })); ring.rotation.x = Math.PI / 2; ring.position.set(pos[0], .1, pos[2]); L.add(ring); rings.push(ring);
      const info = { title: name, html: `<span style="opacity:.8">Nhân tố ${k === 'tn' ? 'tự nhiên' : 'kinh tế – xã hội'}</span><br>${html}`, id, onPick: () => seen[k](id) };
      api.hotspot(ring, info); if (obj) api.hotspot(obj, info);
      api.label(name, { cls: 'sm ' + (k === 'tn' ? 'cold' : 'warm'), pos: vec(pos[0], ly, pos[2]), parent: L, onClick: info });
    };
    factor('soil', null, [3, 0, -.4], .7, .6);
    factor('river', null, [-2.4, 0, -1], .8, .7);
    factor('bio', null, [-5.5, 0, 3.2], 1.9, 1.6);
    const sun = mesh(new THREE.SphereGeometry(.6, 20, 14), 0xffd34d, [0, 6.5, -6], { emissive: 0xffb000 }); scene.add(sun); const cloud = new THREE.Group(); [[0, 0], [.5, .1], [-.5, .05], [.2, .35]].forEach(([x, y]) => cloud.add(mesh(new THREE.SphereGeometry(.45, 12, 10), 0xffffff, [x, y, 0]))); cloud.position.set(-3, 5.5, -5); scene.add(cloud);
    const cInfo = { title: FAC.climate[0], html: FAC.climate[2], id: 'climate', onPick: () => seen.tn('climate') }; api.hotspot(sun, cInfo); api.hotspot(cloud, cInfo); api.label(FAC.climate[0], { cls: 'sm cold', pos: vec(-1.5, 6.6, -5.5), onClick: cInfo });
    factor('people', village, [3.2, 0, 2.6], 1.5, 1.6);
    factor('tech', gh, [7.2, 0, -3.2], 1.6, 1.6);
    factor('market', mk, [7.3, 0, .6], 1.3, 1.4);
    factor('policy', office, [-.6, 0, 3.6], 1, 1.4);
    L.add(road(13, { rot: 0 }).translateZ(1.6).translateX(1));
    // điều khiển
    state.month = 1; state.dry = false; state.tech = false;
    const paint = () => {
      const g = GROW[state.month - 1]; const ripe = (state.month === 5 || state.month === 10 || state.month === 9 || state.month === 4);
      fields.forEach((f, i) => { const isGH = false; let k = g * (state.dry ? .45 : 1); f.userData.grow(k); f.userData.tint(state.dry ? 0xb59a5a : ripe && g > .85 ? 0xe2c044 : g < .1 ? 0x8b6b3e : 0x7fc24a); });
      riv.scale.x = state.dry ? .35 : 1; pasture.material = mat(state.dry ? 0xc8b46a : 0x9fd06a); pond.scale.set(state.dry ? .7 : 1, 1, state.dry ? .7 : 1);
      cloud.visible = !state.dry; sun.scale.setScalar(state.dry ? 1.4 : 1);
      api.readout(`<b>Tháng ${state.month}</b>: ${STAGE[state.month - 1]}${state.dry ? '<br>⚠ <b>Hạn hán</b>: thiếu nước tưới, lúa còi cọc, năng suất giảm mạnh' : ''}`);
    };
    api.heading('Đặc điểm sản xuất');
    api.slider('month', 'Tháng', { min: 1, max: 12, step: 1, value: 1, format: v => 'Tháng ' + v }, v => { state.month = v; paint(); if ((v === 5 || v === 10) && state.ready) api.done('season'); });
    api.toggle('dry', 'Hạn hán', false, v => { state.dry = v; paint(); if (v && state.ready && !state.fromStep) api.done('dry'); });
    api.toggle('play', 'Tự chạy qua 12 tháng', false, v => { clearInterval(state.play); if (v) state.play = setInterval(() => { state.fromStep = true; api.set('month', state.month % 12 + 1); state.fromStep = false; }, 1100); });
    state.step = n => { rings.forEach(r => (r.visible = n === 4 || n === 1)); };
    api.legend([{ c: '#3ddc84', t: 'Nhân tố tự nhiên' }, { c: '#ff9f43', t: 'Nhân tố kinh tế – xã hội' }]);
    state.ready = true;
  },
};

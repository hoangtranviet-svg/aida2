// 3D-33 · Bài 33 – Cơ cấu, vai trò, đặc điểm, các nhân tố ảnh hưởng đến sự phát triển và phân bố dịch vụ
import { THREE, vec, mat, boxM, cylM, mesh, building, house, crowd, road, truck, tower, tree, stage, rng, collector, flag } from '../kit.js';

const GRP = { kd: ['Dịch vụ kinh doanh', 0x3498db, 'cold'], td: ['Dịch vụ tiêu dùng', 0xe67e22, 'warm'], cong: ['Dịch vụ công', 0x2ecc71, ''] };
// [id, tên, nhóm, x, z, loại mô hình, mô tả]
const SV = [
  ['bank', 'Ngân hàng', 'kd', -6, -3, 'tall', 'Cung cấp vốn, thanh toán, bảo hiểm cho các doanh nghiệp – thuộc dịch vụ kinh doanh (tài chính).'],
  ['logi', 'Trung tâm logistics, vận tải', 'kd', -7, 2.6, 'ware', 'Vận chuyển, kho bãi hàng hoá phục vụ sản xuất, thương mại.'],
  ['tel', 'Viễn thông, Internet', 'kd', -2.8, -4.6, 'tower', 'Truyền tải thông tin, dữ liệu cho doanh nghiệp và người dân.'],
  ['re', 'Văn phòng bất động sản, tư vấn', 'kd', -3.6, -1.6, 'mid', 'Dịch vụ nghề nghiệp: tư vấn pháp lí, kế toán, bất động sản, quảng cáo…'],
  ['mall', 'Siêu thị, trung tâm thương mại', 'td', 2.6, -3.6, 'mall', 'Bán buôn, bán lẻ hàng hoá cho người tiêu dùng.'],
  ['food', 'Nhà hàng, quán ăn', 'td', 5.6, -.4, 'shop', 'Dịch vụ ăn uống phục vụ nhu cầu cá nhân.'],
  ['hotel', 'Khách sạn, du lịch', 'td', 6.2, -4.4, 'tall', 'Lưu trú, lữ hành – dịch vụ tiêu dùng cá nhân.'],
  ['hosp', 'Bệnh viện, phòng khám', 'td', 2.4, 3.2, 'hosp', 'Chăm sóc sức khoẻ – dịch vụ cá nhân (y tế).'],
  ['school', 'Trường học', 'td', 6, 3.4, 'school', 'Giáo dục, đào tạo – dịch vụ cá nhân phục vụ nhu cầu học tập.'],
  ['gov', 'Cơ quan hành chính công', 'cong', -1, 1.8, 'gov', 'Cấp giấy tờ, quản lí nhà nước, dịch vụ hành chính công phục vụ chung cho xã hội.'],
  ['fire', 'Phòng cháy chữa cháy', 'cong', -4.2, 4.4, 'fire', 'Bảo đảm an toàn cho cộng đồng – thuộc dịch vụ công.'],
];

export default {
  id: '3D-33', code: 'DL10.B33', title: 'Dịch vụ: cơ cấu, vai trò, đặc điểm, nhân tố',
  objectives: [
    { c: 'DL10.12.01', t: 'Cơ cấu, vai trò, đặc điểm, nhân tố ảnh hưởng tới dịch vụ' },
    { c: 'DL10.12.05', t: 'Liên hệ hoạt động dịch vụ ở địa phương' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 33', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'World Bank – Services, value added (% of GDP)', u: 'https://data.worldbank.org/indicator/NV.SRV.TOTL.ZS' },
  ],
  note: 'Thành phố là mô hình giả định. Cách xếp nhóm theo cơ cấu dịch vụ trong SGK: dịch vụ kinh doanh, dịch vụ tiêu dùng, dịch vụ công.',
  view: { pos: [0, 12, 15], target: [0, 0, 0] },
  steps: [
    { title: 'Cơ cấu ngành dịch vụ', html: '<ul><li><b>Dịch vụ kinh doanh</b>: giao thông vận tải, bưu chính viễn thông, tài chính, ngân hàng, bảo hiểm, bất động sản, dịch vụ nghề nghiệp.</li><li><b>Dịch vụ tiêu dùng</b>: bán buôn, bán lẻ, du lịch, dịch vụ cá nhân (y tế, giáo dục, thể dục thể thao…).</li><li><b>Dịch vụ công</b>: hành chính công, các hoạt động đoàn thể, bảo đảm an ninh, an toàn xã hội.</li></ul><div class="tip">Bấm vào từng công trình để biết nó thuộc nhóm nào.</div>',
      enter: a => { a.set('color', false); a.fly([0, 12, 15], [0, 0, 0]); } },
    { title: 'Vai trò', html: '<ul><li>Thúc đẩy các ngành sản xuất vật chất phát triển; gắn kết sản xuất với tiêu dùng.</li><li>Sử dụng tốt nguồn lao động, tạo nhiều việc làm.</li><li>Khai thác tốt tài nguyên thiên nhiên, di sản văn hoá, lịch sử, thành tựu khoa học – công nghệ.</li><li>Nâng cao chất lượng cuộc sống.</li></ul>',
      enter: a => { a.set('color', true); a.fly([4, 10, 13], [0, 0, 0]); } },
    { title: 'Đặc điểm', html: '<ul><li>Sản phẩm phần lớn <b>vô hình</b> (phi vật chất).</li><li>Quá trình sản xuất và tiêu dùng thường diễn ra <b>đồng thời</b>, sản phẩm không lưu giữ được.</li><li>Phát triển gắn với trình độ phát triển kinh tế, mức sống; tập trung chủ yếu ở <b>đô thị</b>.</li></ul>',
      enter: a => { a.set('color', true); a.fly([-5, 9, 12], [-1, 0, 0]); } },
    { title: 'Nhân tố ảnh hưởng', html: '<ul><li><b>Vị trí địa lí</b>: ảnh hưởng tới mạng lưới dịch vụ.</li><li><b>Tự nhiên</b> (địa hình, khí hậu, tài nguyên…): ảnh hưởng tới một số ngành (giao thông, du lịch).</li><li><b>Kinh tế – xã hội</b>: trình độ phát triển kinh tế, quy mô và cơ cấu dân số, phân bố dân cư, truyền thống văn hoá, khoa học – công nghệ, vốn, thị trường, chính sách.</li></ul><div class="tip">Kéo thanh <b>Dân số đô thị</b>: dân càng đông, mạng lưới dịch vụ càng dày đặc.</div>',
      enter: a => { a.fly([0, 13, 16], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'kd', text: 'Tìm <b>2 cơ sở dịch vụ kinh doanh</b>.' },
    { id: 'td', text: 'Tìm <b>2 cơ sở dịch vụ tiêu dùng</b>.' },
    { id: 'cong', text: 'Tìm <b>1 cơ sở dịch vụ công</b>.' },
    { id: 'pop', text: 'Tăng <b>dân số đô thị</b> lên mức cao nhất.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa8d4ef });
    scene.add(boxM(60, .3, 40, 0x7aa65a, [0, -.16, 0])); scene.add(boxM(18, .04, 13, 0xc5ccd2, [0, .01, 0]));
    scene.add(road(18).translateZ(-.2)); const rv = road(13, { rot: Math.PI / 2 }); rv.position.x = .8; scene.add(rv);
    const seen = { kd: collector(api, 'kd', 2), td: collector(api, 'td', 2), cong: collector(api, 'cong', 1) };
    const rings = [];
    const model = (k) => {
      const g = new THREE.Group();
      if (k === 'tall') g.add(building({ h: 3.2, w: 1.1, d: 1.1, color: 0x9fb7c9 }));
      else if (k === 'mid') g.add(building({ h: 1.8, w: 1.2, d: 1, color: 0xb8c6d1 }));
      else if (k === 'ware') { g.add(boxM(2, .9, 1.3, 0xa6acaf, [0, .45, 0])); const t = truck(); t.position.set(1.4, 0, .5); g.add(t); }
      else if (k === 'tower') g.add(tower({ h: 3 }));
      else if (k === 'mall') { g.add(boxM(2.2, 1, 1.5, 0xf6efe2, [0, .5, 0])); g.add(boxM(2.3, .12, 1.6, 0xe74c3c, [0, 1.05, 0])); }
      else if (k === 'shop') { g.add(boxM(1.1, .6, .8, 0xf6efe2, [0, .3, 0])); const aw = boxM(1.2, .05, .5, 0xf39c12, [0, .62, .4]); aw.rotation.x = .3; g.add(aw); }
      else if (k === 'hosp') { g.add(boxM(1.8, 1.2, 1.2, 0xffffff, [0, .6, 0])); g.add(boxM(.5, .14, .02, 0xe74c3c, [0, .9, .61], { basic: true })); g.add(boxM(.14, .5, .02, 0xe74c3c, [0, .9, .611], { basic: true })); }
      else if (k === 'school') { g.add(boxM(2, .9, .9, 0xf7dc6f, [0, .45, 0])); const f = flag(); f.position.set(1.3, 0, .6); g.add(f); }
      else if (k === 'gov') { g.add(boxM(1.6, 1, 1.1, 0xf5e6c8, [0, .5, 0])); g.add(mesh(new THREE.SphereGeometry(.35, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), 0xd4a017, [0, 1, 0])); const f = flag(); f.position.set(.9, 1, 0); g.add(f); }
      else if (k === 'fire') { g.add(boxM(1.4, .9, 1, 0xc0392b, [0, .45, 0])); g.add(boxM(.7, .55, .02, 0x34495e, [0, .3, .51])); }
      return g;
    };
    SV.forEach(([id, name, gk, x, z, k, desc]) => {
      const g = model(k); g.position.set(x, 0, z); scene.add(g);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, .05, 8, 36), mat(GRP[gk][1], { basic: true, unique: true })); ring.rotation.x = Math.PI / 2; ring.position.set(x, .08, z); scene.add(ring); rings.push(ring);
      const info = { title: name, html: `Thuộc nhóm: <b>${GRP[gk][0]}</b><br>${desc}`, id, onPick: () => seen[gk](id) };
      api.hotspot(g, info); api.label(name, { cls: 'sm', pos: vec(x, k === 'tall' ? 3.7 : k === 'tower' ? 3.4 : 2, z), onClick: info });
    });
    // dân cư tăng theo thanh trượt
    const R = rng(21); const extra = new THREE.Group(); scene.add(extra); const extras = [];
    for (let i = 0; i < 36; i++) { let x, z; do { x = (R() - .5) * 30; z = (R() - .5) * 22; } while (Math.abs(x) < 9.5 && Math.abs(z) < 7); const h = R() < .55 ? house() : building({ h: 1 + R() * 2.2, w: .8, d: .8, color: 0xb8c6d1 }); h.position.set(x, 0, z); extra.add(h); extras.push(h); }
    const people = []; for (let i = 0; i < 5; i++) { const c = crowd(8, 14, 9, { seed: 30 + i }); scene.add(c); people.push(c); }
    const shops = []; for (let i = 0; i < 10; i++) { const s = model('shop'); let x, z; do { x = (R() - .5) * 26; z = (R() - .5) * 18; } while (Math.abs(x) < 9.5 && Math.abs(z) < 7); s.position.set(x, 0, z); s.scale.setScalar(.7); scene.add(s); shops.push(s); api.hotspot(s, { title: 'Cửa hàng, dịch vụ nhỏ', html: 'Khi dân số đông, nhu cầu tăng, mạng lưới cửa hàng, dịch vụ mở rộng ra các khu dân cư mới.' }); }
    api.heading('Nhân tố dân cư');
    api.slider('pop', 'Dân số đô thị', { min: 1, max: 5, step: 1, value: 1, format: v => ['', 'thị trấn', 'thị xã', 'thành phố nhỏ', 'thành phố lớn', 'đô thị rất lớn'][v] }, v => {
      extras.forEach((e, i) => (e.visible = i < (v - 1) * 9)); people.forEach((p, i) => (p.visible = i < v)); shops.forEach((s, i) => (s.visible = i < (v - 1) * 2.5));
      api.readout(`<b>${['', 'Thị trấn', 'Thị xã', 'Thành phố nhỏ', 'Thành phố lớn', 'Đô thị rất lớn'][v]}</b><br>Dân số càng đông, nhu cầu càng lớn → dịch vụ phát triển đa dạng, mạng lưới dày đặc hơn.`);
      if (v === 5 && state.ready) api.done('pop');
    });
    api.heading('Hiển thị');
    api.toggle('color', 'Tô màu theo nhóm dịch vụ', false, v => { rings.forEach(r => (r.visible = v)); api.legend(v ? Object.values(GRP).map(([t, c]) => ({ t, c: '#' + c.toString(16).padStart(6, '0') })) : null); });
    state.ready = true;
  },
};

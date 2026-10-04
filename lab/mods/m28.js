// 3D-28 · Bài 28 – Vai trò, đặc điểm, cơ cấu ngành công nghiệp, các nhân tố ảnh hưởng tới phát triển và phân bố
import { THREE, vec, mat, boxM, cylM, mesh, forest, house, building, factory, field, water, crowd, mine, ship, crane, container, road, stage, emitter } from '../kit.js';

// ngành công nghiệp thử đặt nhà máy và mức phù hợp tại từng địa điểm (3: rất phù hợp, 0: không phù hợp)
const IND = {
  cement: ['Xi măng', 0x95a5a6, { A: [3, 'Gần mỏ đá vôi: nguyên liệu nặng, cồng kềnh, chi phí vận chuyển lớn → đặt nhà máy <b>gần vùng nguyên liệu</b>.'], B: [0, 'Xa mỏ đá vôi, phải chở hàng triệu tấn nguyên liệu; khói bụi gây ô nhiễm khu đông dân.'], C: [0, 'Không có nguyên liệu; chiếm đất nông nghiệp màu mỡ.'], D: [1, 'Thuận lợi xuất khẩu nhưng xa nguồn nguyên liệu chính.'] }],
  textile: ['Dệt may, da giày', 0xe84393, { A: [0, 'Vùng núi ít dân, thiếu lao động, xa thị trường.'], B: [3, 'Cần <b>nhiều lao động</b>, gần <b>thị trường tiêu thụ</b> đông dân → đặt ở đô thị, khu đông dân.'], C: [1, 'Có lao động nông thôn nhưng xa thị trường, hạ tầng hạn chế.'], D: [2, 'Thuận lợi nhập nguyên liệu, xuất khẩu sản phẩm; cần thêm lao động.'] }],
  food: ['Chế biến nông sản', 0x27ae60, { A: [0, 'Xa vùng nguyên liệu nông sản; sản phẩm tươi dễ hư hỏng.'], B: [1, 'Gần thị trường nhưng xa nguồn nguyên liệu tươi sống.'], C: [3, 'Nguyên liệu nông sản tươi, dễ hỏng → đặt nhà máy <b>gần vùng nguyên liệu</b>.'], D: [1, 'Thuận lợi xuất khẩu nhưng xa nguyên liệu.'] }],
  petro: ['Lọc hoá dầu', 0xe67e22, { A: [0, 'Xa nguồn dầu thô nhập bằng tàu biển, xa cảng.'], B: [0, 'Nguy cơ cháy nổ, ô nhiễm – không đặt giữa đô thị đông dân.'], C: [0, 'Không có nguyên liệu, gây ô nhiễm đất nông nghiệp.'], D: [3, 'Gần <b>cảng nước sâu</b> để nhập dầu thô, xuất sản phẩm; xa khu dân cư → <b>vị trí địa lí</b>, giao thông quyết định.'] }],
};
const SITES = { A: ['A – Vùng núi có mỏ', [-6.6, 0, -2.8]], B: ['B – Thành phố lớn', [3, 0, -2]], C: ['C – Đồng bằng nông nghiệp', [-6, 0, 4.2]], D: ['D – Cảng biển nước sâu', [9.2, 0, 4.2]] };

export default {
  id: '3D-28', code: 'DL10.B28', title: 'Công nghiệp: vai trò, đặc điểm, cơ cấu, nhân tố phân bố',
  objectives: [
    { c: 'DL10.11.01', t: 'Vai trò, đặc điểm, cơ cấu ngành công nghiệp' },
    { c: 'DL10.11.02', t: 'Nhân tố ảnh hưởng tới phát triển và phân bố công nghiệp' },
    { c: 'DL10.11.03', t: 'Định hướng phát triển công nghiệp trong tương lai' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 28', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'UNIDO – International Standard Industrial Classification (ISIC Rev.4)', u: 'https://unstats.un.org/unsd/classifications/Econ/isic' },
  ],
  note: 'Bản đồ là lãnh thổ giả định để luyện tập lựa chọn vị trí đặt nhà máy theo các nhân tố.',
  view: { pos: [0, 13, 17], target: [0, 0, 0] },
  steps: [
    { title: 'Vai trò của công nghiệp', html: '<ul><li>Đóng vai trò <b>chủ đạo</b> trong nền kinh tế: cung cấp tư liệu sản xuất, máy móc cho mọi ngành, sản phẩm tiêu dùng cho xã hội.</li><li>Thúc đẩy nông nghiệp, dịch vụ phát triển; khai thác hiệu quả tài nguyên.</li><li>Tạo việc làm, tăng thu nhập; thúc đẩy đô thị hoá, góp phần xoá dần chênh lệch giữa các vùng.</li></ul>',
      enter: a => { a.fly([0, 13, 17], [0, 0, 0]); a.state.chain(false); } },
    { title: 'Đặc điểm sản xuất công nghiệp', html: '<ul><li>Sản xuất gồm <b>hai giai đoạn</b>: tác động vào đối tượng lao động để tạo nguyên liệu (khai thác) → chế biến nguyên liệu thành sản phẩm.</li><li>Có tính <b>tập trung cao độ</b>, chuyên môn hoá, hợp tác hoá chặt chẽ.</li><li>Ít phụ thuộc vào điều kiện tự nhiên; tiêu thụ nhiều năng lượng, tác động mạnh đến môi trường.</li></ul><div class="tip">Theo dõi băng chuyền chở đá vôi từ mỏ (giai đoạn 1) về nhà máy (giai đoạn 2).</div>',
      enter: a => { a.fly([-3, 8, 5], [-5.5, 0, -3.8]); a.state.chain(true); } },
    { title: 'Cơ cấu ngành công nghiệp', html: '<p>Theo cách phân loại hiện nay, công nghiệp gồm:</p><ul><li><b>Khai khoáng</b> (than, dầu khí, quặng kim loại…).</li><li><b>Chế biến, chế tạo</b> (điện tử, cơ khí, hoá chất, dệt may, thực phẩm…).</li><li><b>Sản xuất, phân phối điện, khí đốt, nước nóng, hơi nước</b>.</li><li><b>Cung cấp nước; quản lí và xử lí rác thải, nước thải</b>.</li></ul>',
      enter: a => { a.fly([2, 10, 13], [1, 0, 0]); } },
    { title: 'Nhân tố ảnh hưởng', html: '<ul><li><b>Vị trí địa lí</b>: ảnh hưởng tới việc lựa chọn địa điểm, cơ cấu ngành.</li><li><b>Tự nhiên</b>: khoáng sản, nguồn nước, đất, khí hậu… – nguồn nguyên liệu, năng lượng.</li><li><b>Kinh tế – xã hội</b>: dân cư – lao động, thị trường, vốn, khoa học – công nghệ, chính sách, cơ sở hạ tầng – có vai trò <b>quyết định</b>.</li></ul><div class="tip">Chọn một ngành ở mục điều khiển, rồi bấm vào địa điểm A, B, C hoặc D để đặt nhà máy.</div>',
      enter: a => { a.fly([2.5, 18, 22], [1.5, 0, 1]); } },
    { title: 'Định hướng phát triển', html: '<ul><li>Phát triển công nghiệp <b>công nghệ cao</b>, tự động hoá, công nghiệp 4.0.</li><li>Công nghiệp <b>xanh</b>, tiết kiệm năng lượng, năng lượng tái tạo, kinh tế tuần hoàn.</li><li>Tổ chức lãnh thổ hợp lí (khu công nghiệp, khu công nghệ cao), gắn với bảo vệ môi trường.</li></ul>',
      enter: a => { a.fly([6, 9, 14], [3, 0, 0]); } },
  ],
  tasks: [
    { id: 'cement', text: 'Đặt nhà máy <b>xi măng</b> ở vị trí phù hợp nhất.' },
    { id: 'textile', text: 'Đặt nhà máy <b>dệt may</b> ở vị trí phù hợp nhất.' },
    { id: 'food', text: 'Đặt nhà máy <b>chế biến nông sản</b> ở vị trí phù hợp nhất.' },
    { id: 'petro', text: 'Đặt nhà máy <b>lọc hoá dầu</b> ở vị trí phù hợp nhất.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa8d4ef });
    const sea = water(60, 40, { color: 0x2b78b8, y: -.2 }); scene.add(sea);
    const L = new THREE.Group(); scene.add(L);
    L.add(boxM(24, .5, 15, 0x8a6a45, [-.5, -.25, -.5])); L.add(boxM(24, .04, 15, 0x86b464, [-.5, 0, -.5]));
    // núi + mỏ đá vôi
    [[-10, -5.5, 2.4], [-8.5, -6.4, 1.8], [-11, -2.8, 1.6]].forEach(([x, z, h]) => { const m = mesh(new THREE.ConeGeometry(h * 1.1, h * 1.6, 6), 0x7d8f6a, [x, h * .8, z], { flat: true }); L.add(m); });
    const q = mine(); q.position.set(-4.4, .02, -5.6); q.scale.setScalar(1.2); L.add(q);
    api.hotspot(q, { title: 'Mỏ đá vôi', html: 'Nguyên liệu chính để sản xuất xi măng. Khai thác mỏ là <b>giai đoạn 1</b> của sản xuất công nghiệp.' });
    api.label('Mỏ đá vôi', { cls: 'sm', pos: vec(-4.4, 1, -5.6), parent: L });
    L.add(forest(14, 4, 2.5, { kind: 'cone', seed: 3 }).translateX(-10).translateZ(-.5));
    // sông
    const riv = boxM(1, .05, 15, 0x3a8fd8, [-2.4, .03, -.5], { rough: .2 }); L.add(riv);
    // đồng bằng
    for (let i = 0; i < 4; i++) { const f = field(2, 1.6, { color: [0x9cc34a, 0xd8c24a][i % 2] }); f.position.set(-9 + (i % 2) * 2.3, 0, 3 + Math.floor(i / 2) * 2); L.add(f); }
    [[-4.8, 2.4], [-4.4, 5.6]].forEach(([x, z]) => { const h = house(); h.position.set(x, 0, z); L.add(h); });
    // thành phố
    const city = new THREE.Group(); city.position.set(3, 0, -3.5); L.add(city);
    [[-1.5, -1, 2.6], [-.4, -1.2, 3.6], [.8, -1, 2.2], [-1.2, .4, 1.6], [1.6, .2, 3], [.3, .9, 1.8]].forEach(([x, z, h], i) => { const b = building({ h, w: .9, d: .9, color: [0x9fb7c9, 0xb8c6d1, 0x8fa9bd][i % 3] }); b.position.set(x * 1.2, 0, z * 1.2 - 1.6); city.add(b); });
    city.add(crowd(14, 5, 1.4, { seed: 8 }).translateZ(1.2));
    api.label('Thành phố lớn: đông lao động, thị trường lớn', { cls: 'sm', pos: vec(0, 4.4, -1.6), parent: city });
    // cảng
    const port = new THREE.Group(); port.position.set(10.2, 0, 5.4); L.add(port);
    port.add(boxM(3.2, .3, 2, 0x9aa3ab, [0, .15, 0])); const cr = crane(); cr.position.set(-.6, .3, -.4); port.add(cr);
    [0x2e86de, 0xe67e22, 0x27ae60].forEach((c, i) => { const k = container({ color: c }); k.position.set(.5 + (i % 2) * .62, .3 + Math.floor(i / 2) * .27, .4); port.add(k); });
    const tk = ship({ color: 0x34495e, cargo: false, len: 3 }); tk.position.set(14, -.15, 6); scene.add(tk);
    api.hotspot(tk, { title: 'Tàu chở dầu thô', html: 'Dầu thô nhập khẩu bằng tàu biển cỡ lớn → nhà máy lọc dầu cần cảng nước sâu.' });
    api.label('Cảng nước sâu', { cls: 'sm', pos: vec(0, 2.6, 0), parent: port });
    L.add(road(22).translateZ(1.4).translateX(-.5)); const rv = road(8, { rot: Math.PI / 2 }); rv.position.set(5.6, 0, -2.4); L.add(rv);
    // băng chuyền 2 giai đoạn
    const chainG = new THREE.Group(); L.add(chainG);
    const belt = new THREE.CatmullRomCurve3([vec(-4.4, .4, -5.6), vec(-5.4, .4, -4.4), vec(-6.4, .4, -3.2)]);
    chainG.add(new THREE.Mesh(new THREE.TubeGeometry(belt, 20, .06, 6), mat(0x34495e)));
    api.flowAlong(belt, { count: 8, color: 0xdcdcdc, size: .1, speed: .2, parent: chainG });
    state.chain = v => { chainG.visible = v; };
    // các địa điểm đặt nhà máy
    const placed = {}; const pads = {};
    Object.entries(SITES).forEach(([k, [name, p]]) => {
      const pad = new THREE.Group(); pad.position.set(...p); L.add(pad);
      pad.add(cylM(1, 1, .08, 0xf7f1e3, [0, .05, 0], { opacity: .55 }));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1, .06, 8, 40), mat(0xffd36b, { basic: true, unique: true })); ring.rotation.x = Math.PI / 2; ring.position.y = .1; pad.add(ring); pads[k] = { pad, ring };
      const info = () => {
        const ind = state.ind; const [iname, col, sc] = IND[ind]; const [score, why] = sc[k];
        if (placed[k]) { pad.remove(placed[k]); placed[k] = null; }
        const f = factory(api, { roof: col, chimneys: ind === 'petro' ? 3 : ind === 'cement' ? 2 : 1 }); f.scale.setScalar(.7); f.position.y = .08; pad.add(f); placed[k] = f;
        ring.material.color.setHex([0xe74c3c, 0xf39c12, 0xf1c40f, 0x2ecc71][score]);
        if (score === 3) api.done(ind);
        return { title: `${iname} tại ${name}`, html: `${'★'.repeat(score)}${'☆'.repeat(3 - score)} ${['Không phù hợp', 'Ít phù hợp', 'Khá phù hợp', 'Rất phù hợp'][score]}<br>${why}`, id: ind + k };
      };
      api.hotspot(pad, info); api.label(name, { cls: 'big', pos: vec(p[0], 1.6, p[2]), parent: L, onClick: info });
    });
    api.onTick((dt, t) => Object.values(pads).forEach(({ ring }, i) => { ring.scale.setScalar(1 + .06 * Math.sin(t * 3 + i)); }));
    api.heading('Chọn ngành công nghiệp');
    state.ind = 'cement';
    api.choice('ind', '', Object.entries(IND).map(([v, [t]]) => ({ v, t })), 'cement', v => { state.ind = v; Object.values(pads).forEach(({ pad, ring }) => { ring.material.color.setHex(0xffd36b); }); Object.keys(placed).forEach(k => { if (placed[k]) { pads[k].pad.remove(placed[k]); placed[k] = null; } }); api.readout(`<b>${IND[v][0]}</b><br>Bấm vào A, B, C hoặc D để đặt nhà máy và xem đánh giá.`); });
    api.legend([{ c: '#2ecc71', t: 'Rất phù hợp' }, { c: '#f1c40f', t: 'Khá phù hợp' }, { c: '#f39c12', t: 'Ít phù hợp' }, { c: '#e74c3c', t: 'Không phù hợp' }]);
  },
};

// 3D-01 · Bài 1 – Môn Địa lí với định hướng nghề nghiệp
import { THREE, vec, mat, boxM, cylM, mesh, tree, building, house, ship, plane, tower, flag, globe, collector } from '../kit.js';

// nghề: [id, tên, nhóm (tn: tự nhiên, xh: kinh tế – xã hội, cn: công nghệ địa không gian), sở thích, mô tả]
const JOBS = [
  ['kt', 'Dự báo khí tượng – thuỷ văn', 'tn', 'nature', 'Theo dõi, dự báo thời tiết, bão, lũ; cần kiến thức khí quyển, thuỷ quyển (Bài 9 – 13). Làm việc ở các đài, trạm khí tượng thuỷ văn.'],
  ['mt', 'Quản lí tài nguyên – môi trường', 'tn', 'nature', 'Điều tra, bảo vệ đất, nước, rừng, biển; đánh giá tác động môi trường của dự án. Cần hiểu quy luật của vỏ địa lí (Bài 17 – 18).'],
  ['dc', 'Địa chất – khoáng sản', 'tn', 'nature', 'Khảo sát cấu tạo vỏ Trái Đất, tìm kiếm khoáng sản, cảnh báo sạt lở, động đất (Bài 4 – 8).'],
  ['qh', 'Quy hoạch đô thị và vùng', 'xh', 'people', 'Bố trí khu dân cư, khu công nghiệp, giao thông, cây xanh hợp lí trên lãnh thổ – vận dụng địa lí dân cư và kinh tế (Bài 19 – 37).'],
  ['dl', 'Du lịch – lữ hành', 'xh', 'people', 'Thiết kế tour, hướng dẫn viên, quản lí điểm du lịch; cần hiểu tài nguyên du lịch tự nhiên và văn hoá các vùng (Bài 36).'],
  ['lg', 'Logistics – giao thông vận tải', 'xh', 'people', 'Tổ chức tuyến vận chuyển hàng hoá, cảng biển, kho bãi; dựa trên vị trí địa lí và mạng lưới giao thông (Bài 34).'],
  ['gis', 'Hệ thông tin địa lí (GIS)', 'cn', 'tech', 'Thu thập, phân tích dữ liệu không gian bằng máy tính: bản đồ số, chỉ đường, quản lí đô thị thông minh (Bài 2 – 3).'],
  ['vt', 'Viễn thám – bản đồ số', 'cn', 'tech', 'Dùng ảnh vệ tinh, máy bay không người lái để theo dõi rừng, mùa màng, ngập lụt, đô thị hoá; thành lập bản đồ.'],
  ['gv', 'Giáo viên, nhà nghiên cứu địa lí', 'xh', 'people', 'Giảng dạy, nghiên cứu ở trường học, viện nghiên cứu; tư vấn chính sách phát triển bền vững.'],
];
const GROUP = { tn: ['Địa lí tự nhiên', 0x4fb3ff, 'cold'], xh: ['Địa lí kinh tế – xã hội', 0xffa24f, 'warm'], cn: ['Công nghệ địa không gian', 0x7ee0a8, ''] };

export default {
  id: '3D-01', code: 'DL10.B01', title: 'Môn Địa lí với định hướng nghề nghiệp',
  objectives: [
    { c: 'DL10.00.01', t: 'Đặc điểm cơ bản của môn Địa lí' },
    { c: 'DL10.00.02', t: 'Vai trò của môn Địa lí đối với đời sống' },
    { c: 'DL10.00.03', t: 'Ngành nghề liên quan đến kiến thức địa lí' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 1', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'Chương trình GDPT 2018 môn Địa lí (Thông tư 32/2018/TT-BGDĐT)', u: 'https://moet.gov.vn/' },
    { t: 'Esri – What is GIS?', u: 'https://www.esri.com/en-us/what-is-gis/overview' },
  ],
  note: 'Danh sách nghề là ví dụ tiêu biểu, không đầy đủ. Mô hình chỉ gợi ý định hướng; em nên tìm hiểu thêm chương trình đào tạo của các trường.',
  view: { pos: [0, 3.2, 11], target: [0, .2, 0] },
  steps: [
    { title: 'Địa lí học nghiên cứu gì?', html: '<p>Môn Địa lí ở trường phổ thông phản ánh khoa học Địa lí, gồm hai mảng lớn:</p><ul><li><b>Địa lí tự nhiên</b>: các thành phần tự nhiên (địa hình, khí hậu, nước, đất, sinh vật…).</li><li><b>Địa lí kinh tế – xã hội</b>: dân cư, các ngành kinh tế và sự phân bố của chúng.</li></ul><p>Vì vậy Địa lí có <b>tính tổng hợp</b>: kết nối kiến thức tự nhiên và xã hội.</p><div class="tip">Bấm vào hai vòng quỹ đạo màu xanh và màu cam.</div>',
      enter: a => { a.state.highlight(null); a.fly([0, 3.2, 11], [0, .2, 0]); } },
    { title: 'Đặc điểm của môn Địa lí', html: '<ul><li>Mang <b>tính tổng hợp</b>, liên quan nhiều môn: Vật lí, Hoá học, Sinh học, Lịch sử, Kinh tế…</li><li>Gắn với <b>lãnh thổ</b> cụ thể (từ địa phương, quốc gia đến toàn cầu) và luôn trả lời câu hỏi “ở đâu, vì sao ở đó”.</li><li>Có <b>tính thực tiễn</b> cao, sử dụng nhiều công cụ: bản đồ, biểu đồ, số liệu, GIS, ảnh vệ tinh.</li></ul>',
      enter: a => { a.state.highlight(null); a.fly([4, 4, 9], [0, .3, 0]); } },
    { title: 'Vai trò đối với đời sống', html: '<ul><li>Giúp giải thích các hiện tượng tự nhiên, kinh tế – xã hội xung quanh (vì sao có bão, vì sao dân cư tập trung ở đồng bằng…).</li><li>Hình thành kĩ năng đọc bản đồ, phân tích số liệu, tư duy không gian.</li><li>Giúp ứng xử phù hợp với môi trường, ứng phó thiên tai, biến đổi khí hậu.</li><li>Là nền tảng cho nhiều ngành nghề.</li></ul>',
      enter: a => { a.state.highlight(null); a.fly([-3, 2.5, 10], [0, .2, 0]); } },
    { title: 'Nghề nghiệp liên quan', html: '<p>Mỗi trạm quanh quả địa cầu là một nhóm nghề sử dụng kiến thức địa lí. Màu viền cho biết nghề gắn với mảng nào.</p><div class="tip">Bấm vào từng trạm để đọc mô tả. Thử chọn <b>sở thích</b> của em ở mục điều khiển: các nghề phù hợp sẽ sáng lên.</div>',
      enter: a => { a.fly([0, 6, 9.5], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'tn', text: 'Bấm vào một nghề thuộc mảng <b>Địa lí tự nhiên</b>.' },
    { id: 'xh', text: 'Bấm vào một nghề thuộc mảng <b>Địa lí kinh tế – xã hội</b>.' },
    { id: 'cn', text: 'Tìm nghề dùng <b>ảnh vệ tinh</b> để theo dõi rừng, ngập lụt.' },
    { id: 'pick', text: 'Chọn <b>sở thích</b> của em để xem các nghề phù hợp.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x0b1622);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x1a2a38, .9));
    const E = await globe(api, { mode: 'natural', radius: 1.6, spin: true });
    // hai vòng quỹ đạo: tự nhiên và KT – XH
    const ringN = new THREE.Mesh(new THREE.TorusGeometry(2.3, .03, 8, 96), mat(0x4fb3ff, { basic: true })); ringN.rotation.x = Math.PI / 2.4; scene.add(ringN);
    const ringS = new THREE.Mesh(new THREE.TorusGeometry(2.6, .03, 8, 96), mat(0xffa24f, { basic: true })); ringS.rotation.x = Math.PI / 1.7; ringS.rotation.y = .5; scene.add(ringS);
    const rN = { title: 'Địa lí tự nhiên', html: 'Nghiên cứu các thành phần tự nhiên: thạch quyển, khí quyển, thuỷ quyển, thổ nhưỡng quyển, sinh quyển và quy luật của vỏ địa lí (Phần hai SGK).' };
    const rS = { title: 'Địa lí kinh tế – xã hội', html: 'Nghiên cứu dân cư, các nguồn lực, các ngành nông nghiệp, công nghiệp, dịch vụ và sự phân bố của chúng; phát triển bền vững (Phần ba SGK).' };
    api.hotspot(ringN, rN); api.hotspot(ringS, rS);
    api.label('Địa lí tự nhiên', { cls: 'cold', pos: vec(-2.4, .9, 0), onClick: rN });
    api.label('Địa lí kinh tế – xã hội', { cls: 'warm', pos: vec(2.7, -.9, 0), onClick: rS });
    api.onTick(dt => { ringN.rotation.z += dt * .15; ringS.rotation.z -= dt * .1; });
    // các trạm nghề trên vòng tròn lớn
    const icon = id => {
      const g = new THREE.Group();
      if (id === 'kt') { g.add(cylM(.02, .02, .7, 0xdddddd, [0, .35, 0])); g.add(mesh(new THREE.SphereGeometry(.18, 16, 12), 0xffffff, [0, .85, 0])); g.add(cylM(.12, .12, .05, 0x4fb3ff, [.25, .5, 0])); }
      else if (id === 'mt') { g.add(tree({ h: .8 })); const t2 = tree({ h: .6, kind: 'cone' }); t2.position.x = .25; g.add(t2); }
      else if (id === 'dc') { [0x8d6e4f, 0xb08d57, 0x6b5038].forEach((c, i) => g.add(boxM(.6, .15, .45, c, [0, .08 + i * .15, 0]))); g.add(mesh(new THREE.OctahedronGeometry(.12), 0x9be7ff, [.1, .62, 0], { metal: .5, rough: .2 })); }
      else if (id === 'qh') { [[-.2, .5], [.05, .8], [.28, .35]].forEach(([x, h]) => { const b = building({ w: .2, h, d: .2 }); b.position.x = x; g.add(b); }); }
      else if (id === 'dl') { const h = house({ w: .35, h: .25, d: .3, roof: 0xd35400 }); g.add(h); const f = flag(0xda251d); f.position.x = .3; g.add(f); }
      else if (id === 'lg') { const s = ship({ len: .8 }); s.scale.setScalar(.5); g.add(s); }
      else if (id === 'gis') { const s = boxM(.6, .4, .03, 0x1e2a36, [0, .45, 0]); g.add(s); g.add(boxM(.54, .34, .01, 0x2f7d6a, [0, .45, .02], { basic: true })); g.add(cylM(.03, .03, .25, 0x999999, [0, .12, 0])); g.add(mesh(new THREE.SphereGeometry(.04, 8, 6), 0xff4040, [.1, .5, .04], { basic: true })); }
      else if (id === 'vt') { g.add(boxM(.2, .2, .2, 0xd4af37, [0, .5, 0], { metal: .6, rough: .3 })); g.add(boxM(.5, .02, .2, 0x1d3f7a, [-.35, .5, 0])); g.add(boxM(.5, .02, .2, 0x1d3f7a, [.35, .5, 0])); }
      else if (id === 'gv') { g.add(boxM(.6, .4, .05, 0x1f5b3a, [0, .45, 0])); g.add(boxM(.66, .04, .1, 0x8b5a2b, [0, .23, .03])); }
      return g;
    };
    const st = []; const seenCat = collector(api, '_', 99);
    JOBS.forEach(([id, name, grp, like, desc], i) => {
      const a = i / JOBS.length * Math.PI * 2; const R = 3.9;
      const g = new THREE.Group(); g.position.set(Math.cos(a) * R, -.6 + Math.sin(i * 1.7) * .25, Math.sin(a) * R); scene.add(g);
      const base = cylM(.42, .48, .12, 0x1c2c3c, [0, 0, 0]); g.add(base);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(.45, .035, 8, 32), mat(GROUP[grp][1], { basic: true, unique: true })); rim.rotation.x = Math.PI / 2; rim.position.y = .07; g.add(rim);
      const ic = icon(id); ic.position.y = .06; g.add(ic);
      const info = { title: name, html: `<span style="color:#9fb">${GROUP[grp][0]}</span><br>${desc}`, id, onPick: () => { api.done(grp === 'cn' ? (id === 'vt' ? 'cn' : '') : grp); seenCat(id); } };
      api.hotspot(g, info);
      const l = api.label(name, { cls: 'sm ' + GROUP[grp][2], pos: vec(0, 1.25, 0), parent: g, onClick: info });
      st.push({ g, rim, like, l, ic });
    });
    api.onTick((dt, t) => st.forEach((s, i) => { s.ic.rotation.y = Math.sin(t * .6 + i) * .4; const k = s.on ? 1 + .12 * Math.sin(t * 5) : 1; s.g.scale.setScalar(k); }));
    state.highlight = like => st.forEach(s => { s.on = like && s.like === like; s.rim.material.color.setHex(like && !s.on ? 0x34475a : (s.on ? 0xfff07a : GROUP[JOBS[st.indexOf(s)][2]][1])); });
    api.legend([{ c: '#4fb3ff', t: 'Địa lí tự nhiên' }, { c: '#ffa24f', t: 'Địa lí kinh tế – xã hội' }, { c: '#7ee0a8', t: 'Công nghệ địa không gian' }]);
    api.heading('Định hướng');
    api.choice('like', 'Em thích làm việc với…', [{ v: 'none', t: 'Tất cả' }, { v: 'nature', t: 'Thiên nhiên' }, { v: 'people', t: 'Con người' }, { v: 'tech', t: 'Công nghệ' }], 'none', v => {
      state.highlight(v === 'none' ? null : v);
      if (v !== 'none' && state.ready) { api.done('pick'); const n = JOBS.filter(j => j[3] === v).map(j => j[1]); api.readout(`<b>Gợi ý nghề phù hợp</b><br>${n.join('<br>')}`); } else api.readout(null);
    });
    api.toggle('spin', 'Xoay quả địa cầu', true, v => E.setSpin(v));
    state.ready = true;
  },
};

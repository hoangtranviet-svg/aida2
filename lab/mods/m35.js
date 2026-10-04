// 3D-35 · Bài 35 – Địa lí ngành bưu chính viễn thông
import { THREE, vec, mat, boxM, mesh, globe, latLonToVec3, fmtN } from '../kit.js';

const HN = [21.03, 105.85], PR = [48.86, 2.35];
const CABLES = [
  [[21, 108], [10, 110], [1.2, 104], [5.5, 96], [6, 80], [12.5, 52], [12.6, 43.4], [20, 38.5], [27.5, 34], [29.9, 32.6], [32, 30], [36.8, 12], [43.3, 5.4]],
  [[22, 114], [26, 135], [35, 160], [40, -150], [37, -123]],
  [[40.4, -73.8], [45, -45], [50, -20], [50.3, -4.5]],
  [[-23, -43], [-5, -30], [10, -25], [33, -16], [38.7, -9.2]],
  [[1.2, 104], [-8, 112], [-20, 112], [-31.9, 115.8]],
];
// đường cáp HN → Pa-ri (giản lược) để tính trễ
const RT = [[21.03, 105.85], [21, 108], [10, 110], [1.2, 104], [5.5, 96], [6, 80], [12.5, 52], [12.6, 43.4], [20, 38.5], [27.5, 34], [29.9, 32.6], [32, 30], [36.8, 12], [43.3, 5.4], [48.86, 2.35]];
const gc = (a, b) => { const R = 6371, d = Math.PI / 180; const x = Math.sin((b[0] - a[0]) * d / 2) ** 2 + Math.cos(a[0] * d) * Math.cos(b[0] * d) * Math.sin((b[1] - a[1]) * d / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };

export default {
  id: '3D-35', code: 'DL10.B35', title: 'Địa lí ngành bưu chính viễn thông',
  objectives: [
    { c: 'DL10.12.02', t: 'Vai trò, đặc điểm ngành bưu chính viễn thông' },
    { c: 'DL10.12.03', t: 'Nhân tố ảnh hưởng, tình hình phát triển và phân bố' },
  ],
  sources: [
    { t: 'ITU – Facts and Figures 2023', u: 'https://www.itu.int/itu-d/reports/statistics/facts-figures-2023/', n: 'tỉ lệ người dùng Internet' },
    { t: 'TeleGeography – Submarine Cable Map', u: 'https://www.submarinecablemap.com/' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 35', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Tuyến cáp quang biển vẽ giản lược; quỹ đạo vệ tinh không theo tỉ lệ (vệ tinh địa tĩnh thực tế ở độ cao khoảng 35 786 km). Thời gian truyền tin tính gần đúng: ánh sáng trong sợi quang khoảng 200 000 km/s, sóng vô tuyến khoảng 300 000 km/s.',
  view: { pos: [0, 2.5, 9], target: [0, 0, 0] },
  steps: [
    { title: 'Vai trò', html: '<ul><li>Bảo đảm thông tin liên lạc nhanh, thông suốt giữa các vùng, các nước.</li><li>Phục vụ sản xuất, kinh doanh, quản lí; là nền tảng của <b>chuyển đổi số</b>, thương mại điện tử, ngân hàng số, học trực tuyến.</li><li>Góp phần bảo đảm an ninh, quốc phòng; nâng cao đời sống, dân trí.</li></ul>',
      enter: a => { a.state.faceLon(80); a.fly([0, 2.5, 9], [0, 0, 0]); } },
    { title: 'Đặc điểm', html: '<ul><li><b>Bưu chính</b>: chuyển phát thư, bưu phẩm, bưu kiện, chuyển tiền…; phát triển mạnh nhờ thương mại điện tử (chuyển phát nhanh).</li><li><b>Viễn thông</b>: truyền tin tức tức thời qua mạng điện thoại, Internet, truyền hình; dựa trên cáp quang, vệ tinh, sóng di động.</li><li>Sản phẩm là <b>dịch vụ thông tin</b>; công nghệ thay đổi rất nhanh.</li></ul><div class="tip">Bấm vào tuyến cáp quang biển và vệ tinh.</div>',
      enter: a => { a.state.faceLon(40); a.fly([3, 3.5, 9], [0, .5, 0]); } },
    { title: 'Cáp quang hay vệ tinh?', html: '<p>Hơn 95% lưu lượng Internet quốc tế đi qua <b>cáp quang biển</b>; vệ tinh phục vụ vùng xa xôi, trên biển, khi thiên tai.</p><div class="tip">Gửi một tin nhắn từ <b>Hà Nội</b> đến <b>Pa-ri</b> bằng hai cách ở mục điều khiển và so sánh thời gian.</div>',
      enter: a => { a.state.faceLon(55); a.fly([0, 5, 10], [0, .5, 0]); } },
    { title: 'Tình hình phát triển và nhân tố', html: '<p>Năm 2023, khoảng <b>67% dân số thế giới</b> (5,4 tỉ người) sử dụng Internet (ITU). Tỉ lệ rất cao ở các nước phát triển, thấp ở nhiều nước kém phát triển → <b>khoảng cách số</b>.</p><p><b>Nhân tố</b>: trình độ phát triển kinh tế, khoa học – công nghệ (quyết định); dân cư, mức sống; chính sách.</p>',
      enter: a => { a.state.faceLon(10); a.fly([0, 2, 8.5], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'cable', text: 'Bấm vào một <b>tuyến cáp quang biển</b>.' },
    { id: 'fiber', text: 'Gửi tin nhắn Hà Nội → Pa-ri qua <b>cáp quang</b>.' },
    { id: 'sat', text: 'Gửi tin nhắn Hà Nội → Pa-ri qua <b>vệ tinh địa tĩnh</b>.' },
    { id: 'gap', text: 'Bấm vào thanh <b>tỉ lệ dùng Internet</b> để đọc số liệu.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x050c18);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x101820, .8));
    const E = await globe(api, { mode: 'night', radius: 2 });
    const cInfo = { title: 'Cáp quang biển', html: 'Sợi quang truyền tín hiệu ánh sáng với dung lượng cực lớn, đặt dưới đáy biển nối các châu lục. Việt Nam kết nối quốc tế qua nhiều tuyến cáp quang biển (APG, AAG, IA, SMW3, ADC…).', id: 'cable', onPick: () => api.done('cable') };
    CABLES.forEach(c => { const t = E.path(c, { color: 0x3df2ff, width: .007, flow: 12 }); api.hotspot(t, cInfo); });
    [HN, PR].forEach((p, i) => { E.dot(p[0], p[1], { color: i ? 0xffd36b : 0xff4d6d, size: .05 }); api.label(i ? 'Pa-ri' : 'Hà Nội', { cls: 'sm' + (i ? '' : ' warm'), pos: latLonToVec3(p[0] + 2, p[1], 2.15), parent: E.G, globe: E.gc }); });
    // vệ tinh địa tĩnh (minh hoạ, không theo tỉ lệ)
    const SR = 3.4; const orbit = new THREE.Mesh(new THREE.TorusGeometry(SR, .006, 6, 160), mat(0x8899aa, { basic: true, opacity: .5 })); orbit.rotation.x = Math.PI / 2; E.G.add(orbit);
    const sats = []; [105, 15, -75].forEach(lo => { const s = new THREE.Group(); s.add(boxM(.12, .12, .12, 0xd4af37, null, { metal: .6, rough: .3 })); s.add(boxM(.36, .01, .1, 0x1d3f7a, [-.25, 0, 0])); s.add(boxM(.36, .01, .1, 0x1d3f7a, [.25, 0, 0])); s.position.copy(latLonToVec3(0, lo, SR)); s.lookAt(0, 0, 0); E.G.add(s); sats.push(s); api.hotspot(s, { title: 'Vệ tinh viễn thông địa tĩnh', html: 'Bay ở độ cao khoảng 35 786 km, quay cùng tốc độ Trái Đất nên “đứng yên” so với mặt đất; phủ sóng diện rộng, phục vụ truyền hình, liên lạc vùng sâu, trên biển.' }); });
    api.label('Vệ tinh địa tĩnh (không theo tỉ lệ)', { cls: 'sm', pos: latLonToVec3(0, 105, SR + .3), parent: E.G, globe: { center: new THREE.Vector3(), radius: 1.6 } });
    // tin nhắn
    const pkt = mesh(new THREE.SphereGeometry(.07, 12, 10), 0xffffff, null, { basic: true }); E.G.add(pkt); pkt.visible = false;
    const fiberCurve = (() => { const pts = []; for (let i = 0; i < RT.length - 1; i++) { const a = latLonToVec3(...RT[i], 1), b = latLonToVec3(...RT[i + 1], 1); for (let k = 0; k < 8; k++) pts.push(a.clone().lerp(b, k / 8).normalize().multiplyScalar(2.03)); } pts.push(latLonToVec3(...PR, 2.03)); return new THREE.CatmullRomCurve3(pts); })();
    const fiberLen = RT.slice(1).reduce((s, p, i) => s + gc(RT[i], p), 0);
    const satCurve = new THREE.CatmullRomCurve3([latLonToVec3(...HN, 2.02), latLonToVec3(10, 75, 2.9), latLonToVec3(0, 60, SR), latLonToVec3(25, 35, 2.9), latLonToVec3(...PR, 2.02)]);
    const beam = new THREE.Mesh(new THREE.TubeGeometry(satCurve, 60, .01, 6), mat(0xffd36b, { basic: true, opacity: .8 })); E.G.add(beam); beam.visible = false;
    let anim = null;
    const send = mode => {
      E.setSpin(false); state.faceLon(55);
      const curve = mode === 'fiber' ? fiberCurve : satCurve; beam.visible = mode === 'sat';
      let ms, dist;
      if (mode === 'fiber') { dist = fiberLen; ms = dist / 200000 * 1000; }
      else { const up = 35786 + 2000, down = 35786 + 4000; dist = up + down; ms = dist / 300000 * 1000; }
      anim = { curve, t: 0 }; pkt.visible = true; pkt.material.color.setHex(mode === 'fiber' ? 0x3df2ff : 0xffd36b);
      api.readout(`<b>Hà Nội → Pa-ri qua ${mode === 'fiber' ? 'cáp quang biển' : 'vệ tinh địa tĩnh'}</b><br>Quãng đường tín hiệu ≈ <b>${fmtN(dist, 0)} km</b><br>Thời gian truyền một chiều ≈ <b>${fmtN(ms, 0)} ms</b> (${fmtN(ms / 1000, 2)} giây)<br>${mode === 'fiber' ? 'Đường truyền dài theo đáy biển nhưng độ trễ thấp, dung lượng rất lớn.' : 'Phải đi lên – xuống quỹ đạo cao khoảng 36 000 km nên độ trễ lớn hơn nhiều.'}`);
      api.done(mode);
    };
    api.onTick(dt => { if (!anim) return; anim.t += dt * .35; if (anim.t >= 1) { anim.t = 1; } pkt.position.copy(anim.curve.getPointAt(anim.t)); if (anim.t >= 1) { anim = null; setTimeout(() => (pkt.visible = false), 1200); } });
    // thanh tỉ lệ dùng Internet
    const bar = new THREE.Group(); bar.position.set(3.6, -1.2, 0); scene.add(bar);
    const b1 = boxM(.5, 3 * .67, .5, 0x3ddc84, [0, 3 * .67 / 2, 0]); const b0 = boxM(.52, 3, .52, 0x2b3a4a, [0, 1.5, 0], { opacity: .35 }); bar.add(b0, b1);
    const gInfo = { title: 'Người dùng Internet trên thế giới (2023)', html: 'Khoảng <b>67%</b> dân số thế giới (5,4 tỉ người) dùng Internet; khoảng 2,6 tỉ người vẫn chưa kết nối, chủ yếu ở các nước thu nhập thấp (ITU, 2023).', id: 'gap', onPick: () => api.done('gap') };
    api.hotspot(b1, gInfo); api.hotspot(b0, gInfo); api.label('67% dùng Internet (2023)', { cls: 'sm', pos: vec(0, 3.4, 0), parent: bar, onClick: gInfo });
    api.heading('Gửi tin nhắn Hà Nội → Pa-ri');
    api.choice('send', '', [{ v: 'fiber', t: 'Qua cáp quang biển' }, { v: 'sat', t: 'Qua vệ tinh địa tĩnh' }], '', v => { if (v && state.ready) send(v); });
    api.toggle('spin', 'Xoay quả địa cầu', true, v => E.setSpin(v));
    api.legend([{ c: '#3df2ff', t: 'Cáp quang biển (giản lược)' }, { c: '#d4af37', t: 'Vệ tinh viễn thông' }]);
    state.ready = true;
  },
};

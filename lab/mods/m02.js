// 3D-02 · Bài 2 – Một số phương pháp biểu hiện các đối tượng địa lí trên bản đồ
import { THREE } from '../core.js';
import { VIETNAM } from '../geo.js';

const K = .9; // 1° ≈ 0,9 đơn vị mô hình
const P = (lat, lon, y = 0) => new THREE.Vector3((lon - 106) * K, y, -(lat - 16) * K);
const inside = (lon, lat) => { let c = false; for (let i = 0, j = VIETNAM.length - 1; i < VIETNAM.length; j = i++) { const [xi, yi] = VIETNAM[i], [xj, yj] = VIETNAM[j]; if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) c = !c; } return c; };
const SYMBOLS = [
  ['tdien', 'Thuỷ điện Hoà Bình', 20.81, 105.33], ['tdien', 'Thuỷ điện Sơn La', 21.45, 103.98], ['tdien', 'Thuỷ điện Y-a-ly', 14.22, 107.83],
  ['ndien', 'Nhiệt điện Phả Lại', 21.11, 106.3], ['ndien', 'Nhiệt điện Phú Mỹ', 10.6, 107.05],
  ['than', 'Mỏ than Quảng Ninh', 21.02, 107.25], ['dau', 'Mỏ dầu Bạch Hổ', 9.75, 107.95],
  ['bay', 'Sân bay quốc tế Nội Bài', 21.22, 105.81], ['bay', 'Sân bay quốc tế Đà Nẵng', 16.05, 108.2], ['bay', 'Sân bay quốc tế Tân Sơn Nhất', 10.82, 106.66],
];
const SYM_STYLE = { tdien: [0x2f86d8, 'Nhà máy thuỷ điện'], ndien: [0xe0502a, 'Nhà máy nhiệt điện'], than: [0x2a2a2a, 'Khai thác than'], dau: [0x7a3fa0, 'Khai thác dầu khí'], bay: [0xf2c12e, 'Sân bay quốc tế'] };
const AREAS = [
  ['Vùng trồng lúa (Đồng bằng sông Hồng)', 20.75, 106.2, .7, 0xf0d34a], ['Vùng trồng lúa (Đồng bằng sông Cửu Long)', 10.0, 105.6, 1.25, 0xf0d34a],
  ['Vùng trồng cà phê (Tây Nguyên)', 12.8, 108.1, 1.0, 0x8a4a2a], ['Vùng trồng chè (Trung du và miền núi Bắc Bộ)', 21.7, 105.0, .8, 0x3aa05a],
];
// dân số các vùng (triệu người, làm tròn – Niên giám thống kê; dùng để minh hoạ phương pháp bản đồ – biểu đồ)
const REGIONS = [['Trung du và miền núi Bắc Bộ', 21.8, 104.6, 13], ['Đồng bằng sông Hồng', 20.9, 106.1, 23], ['Bắc Trung Bộ và DH miền Trung', 16.5, 107.4, 20], ['Tây Nguyên', 13.2, 108.0, 6], ['Đông Nam Bộ', 11.2, 106.7, 19], ['Đồng bằng sông Cửu Long', 9.9, 105.5, 17]];

export default {
  id: '3D-02', code: 'DL10.B02', title: 'Các phương pháp biểu hiện trên bản đồ',
  objectives: [{ c: 'DL10.01.01', t: 'Phân biệt một số phương pháp biểu hiện các đối tượng địa lí trên bản đồ' }, { c: 'DL10.01.02', t: 'Sử dụng bản đồ trong học tập và đời sống' }],
  sources: [
    { t: 'ICA – International Cartographic Association: Cartographic methods', u: 'https://icaci.org/' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 2 (Hình 2.1 – 2.5)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Đường biên giới phần đất liền đã giản lược. Bản đồ minh hoạ phương pháp biểu hiện, không dùng để tra cứu ranh giới. Vị trí các đối tượng là gần đúng.',
  view: { pos: [3, 12, 12], target: [0, 0, 0] },
  steps: [
    { title: 'Bản đồ và lưới kinh, vĩ tuyến', html: '<p>Bản đồ thể hiện các đối tượng địa lí bằng hệ thống kí hiệu. Mọi vị trí được xác định nhờ <b>toạ độ địa lí</b> (vĩ độ, kinh độ).</p><div class="tip">Bấm vào bất kì điểm nào trên đất liền để đọc toạ độ. Thử tìm toạ độ của Hà Nội.</div>',
      enter: a => { a.state.layer('none'); a.fly([3, 12, 12], [0, 0, 0]); } },
    { title: 'Phương pháp kí hiệu', html: '<p>Dùng các <b>kí hiệu</b> (hình học, chữ, tượng hình) đặt <b>đúng vị trí</b> của đối tượng để thể hiện các đối tượng phân bố theo <b>điểm cụ thể</b>: nhà máy, mỏ khoáng sản, sân bay…</p><p>Thể hiện được: vị trí, số lượng, cấu trúc, chất lượng (qua hình dạng, màu, kích thước kí hiệu).</p>',
      enter: a => { a.state.layer('kihieu'); a.fly([4, 10, 10], [.5, 0, -1]); } },
    { title: 'Phương pháp kí hiệu đường chuyển động', html: '<p>Dùng <b>mũi tên</b> để thể hiện <b>sự di chuyển</b> của đối tượng: gió, bão, dòng biển, luồng di dân, hàng hoá…</p><p>Thể hiện được: hướng di chuyển, khối lượng, tốc độ (qua độ dài, độ rộng, màu của mũi tên).</p>',
      enter: a => { a.state.layer('chuyendong'); a.fly([6, 12, 10], [1, 0, 0]); } },
    { title: 'Phương pháp chấm điểm', html: '<p>Dùng các <b>điểm chấm</b> có giá trị như nhau để thể hiện đối tượng <b>phân bố phân tán, lẻ tẻ</b> (dân cư, gia súc…). Mỗi chấm ứng với một số lượng nhất định.</p><p>Nơi chấm dày → đối tượng tập trung đông.</p>',
      enter: a => { a.state.layer('chamdiem'); a.fly([2, 12, 9], [0, 0, 0]); } },
    { title: 'Phương pháp khoanh vùng', html: '<p>Dùng <b>đường viền, màu sắc, kí hiệu</b> để khoanh lại vùng phân bố của đối tượng <b>không phân bố khắp lãnh thổ</b> mà chỉ ở từng vùng (vùng trồng lúa, cà phê, chè…).</p>',
      enter: a => { a.state.layer('khoanhvung'); a.fly([4, 11, 10], [0, 0, 0]); } },
    { title: 'Phương pháp bản đồ – biểu đồ', html: '<p>Dùng <b>biểu đồ</b> (cột, tròn…) đặt trong từng đơn vị lãnh thổ để thể hiện <b>giá trị tổng cộng</b> của đối tượng ở đơn vị đó (dân số, sản lượng…).</p><div class="tip">Chiều cao cột ứng với dân số mỗi vùng. Bấm vào cột để đọc số liệu.</div>',
      enter: a => { a.state.layer('bando'); a.fly([8, 8, 11], [0, 1, 0]); } },
  ],
  tasks: [
    { id: 'hanoi', text: 'Bấm vào bản đồ để tìm <b>toạ độ Hà Nội</b> (khoảng 21°B, 105,8°Đ).' },
    { id: 'sym', text: 'Bấm vào kí hiệu <b>nhà máy thuỷ điện</b> trên sông Đà.' },
    { id: 'storm', text: 'Bấm vào mũi tên <b>đường đi của bão</b>.' },
    { id: 'region', text: 'Ở phương pháp bản đồ – biểu đồ, tìm vùng <b>đông dân nhất</b>.' },
    { id: 'islands', text: 'Tìm <b>quần đảo Hoàng Sa</b> và <b>quần đảo Trường Sa</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0xdbe8ef);
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-4, 12, 6); scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8899aa, .8));
    // biển
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(24, 22), new THREE.MeshStandardMaterial({ color: 0x9fcbe6, roughness: .8 })); sea.rotation.x = -Math.PI / 2; sea.position.set(2, -.02, -.5); scene.add(sea);
    api.label('Biển Đông', { cls: 'cold big', pos: P(14, 112, .1) });
    // lưới kinh, vĩ tuyến
    const gm = new THREE.LineBasicMaterial({ color: 0x5b7a90, transparent: true, opacity: .5 });
    for (let lat = 8; lat <= 24; lat += 2) { scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([P(lat, 100), P(lat, 116)]), gm)); api.label(`${lat}°B`, { cls: 'sm plain', pos: P(lat, 100.3, .05) }); }
    for (let lon = 102; lon <= 116; lon += 2) { scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([P(7, lon), P(25, lon)]), gm)); api.label(`${lon}°Đ`, { cls: 'sm plain', pos: P(24.7, lon, .05) }); }
    // đất liền
    const shape = new THREE.Shape(VIETNAM.map(([lo, la]) => new THREE.Vector2((lo - 106) * K, (la - 16) * K)));
    const land = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: .22, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0xe9dfb8, roughness: .95 }));
    land.rotation.x = -Math.PI / 2; scene.add(land);
    api.hotspot(land, pt => { const lon = pt.x / K + 106, lat = -pt.z / K + 16; const near = Math.hypot(lat - 21.03, lon - 105.85) < .45; if (near) api.done('hanoi');
      return { title: 'Toạ độ địa lí', html: `Vĩ độ: <b>${lat.toFixed(2).replace('.', ',')}°B</b><br>Kinh độ: <b>${lon.toFixed(2).replace('.', ',')}°Đ</b>${near ? '<br>→ Đây là khu vực <b>Hà Nội</b>.' : ''}`, id: 'coord' }; });
    const cityDot = (n, la, lo, big) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(big ? .1 : .07, big ? .1 : .07, .08, 16), new THREE.MeshStandardMaterial({ color: 0xc0392b })); m.position.copy(P(la, lo, .26)); scene.add(m); api.label(n, { cls: 'sm', pos: P(la, lo, .5) }); };
    cityDot('Hà Nội', 21.03, 105.85, true); cityDot('TP Hồ Chí Minh', 10.82, 106.63, true); cityDot('Đà Nẵng', 16.05, 108.2); cityDot('Huế', 16.46, 107.59);
    // quần đảo
    const isl = (n, la, lo, cnt, spread) => { const g = new THREE.Group(); for (let i = 0; i < cnt; i++) { const m = new THREE.Mesh(new THREE.CylinderGeometry(.05 + Math.random() * .05, .07, .12, 8), new THREE.MeshStandardMaterial({ color: 0xe9dfb8 })); m.position.copy(P(la + (Math.random() - .5) * spread, lo + (Math.random() - .5) * spread * 1.4, .02)); g.add(m); } scene.add(g);
      const info = { title: n, html: n.includes('Hoàng') ? 'Huyện đảo Hoàng Sa, thành phố Đà Nẵng.' : 'Huyện đảo Trường Sa, tỉnh Khánh Hoà.', id: n, onPick: () => { state.isl.add(n); if (state.isl.size === 2) api.done('islands'); } };
      g.children.forEach(c => api.hotspot(c, info)); api.label(n, { cls: 'sm', pos: P(la + spread * .6 + .3, lo, .2), onClick: info }); };
    state.isl = new Set();
    isl('Quần đảo Hoàng Sa (Việt Nam)', 16.5, 112.0, 14, 1.0); isl('Quần đảo Trường Sa (Việt Nam)', 9.5, 114.2, 20, 2.6);
    // la bàn & thước tỉ lệ
    const nArrow = api.arrow(P(22.5, 113, .1), P(24, 113, .1), 0x223344, .5, .3); scene.add(nArrow); api.label('B', { cls: 'big', pos: P(24.6, 113, .2) });
    const sb = new THREE.Mesh(new THREE.BoxGeometry(K * 1.8, .05, .1), new THREE.MeshBasicMaterial({ color: 0x223344 })); sb.position.copy(P(7.6, 103.9, .05)); scene.add(sb);
    api.label('0 – 200 km', { cls: 'sm plain', pos: P(7.2, 103.9, .05) });

    const layers = { kihieu: new THREE.Group(), chuyendong: new THREE.Group(), chamdiem: new THREE.Group(), khoanhvung: new THREE.Group(), bando: new THREE.Group() };
    Object.values(layers).forEach(g => scene.add(g));
    // 1. kí hiệu
    SYMBOLS.forEach(([t, n, la, lo]) => {
      const [c] = SYM_STYLE[t]; const geo = t === 'bay' ? new THREE.ConeGeometry(.14, .3, 3) : t === 'than' ? new THREE.BoxGeometry(.22, .22, .22) : t === 'dau' ? new THREE.CylinderGeometry(.04, .12, .4, 6) : t === 'tdien' ? new THREE.SphereGeometry(.13, 16, 12) : new THREE.CylinderGeometry(.11, .11, .3, 12);
      const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: c, roughness: .5 })); m.position.copy(P(la, lo, .42)); layers.kihieu.add(m);
      const info = { title: n, html: `Kí hiệu: <b>${SYM_STYLE[t][1]}</b>. Được đặt đúng vị trí đối tượng trên bản đồ.`, id: n, onPick: () => { if (n.includes('Hoà Bình') || n.includes('Sơn La')) api.done('sym'); } };
      api.hotspot(m, info); api.label(n, { cls: 'sm', pos: P(la, lo, .78), parent: layers.kihieu, onClick: info });
    });
    // 2. đường chuyển động
    const flow = (pts, col, n, info, r = .05) => { const c = new THREE.CatmullRomCurve3(pts.map(([la, lo]) => P(la, lo, .7))); const t = api.tube(c.getPoints(60), r, col, { opacity: .55 }); layers.chuyendong.add(t); api.flowAlong(c, { count: 12, color: col, size: r * 1.6, speed: .12, parent: layers.chuyendong }); const end = c.getPointAt(1), pre = c.getPointAt(.95); layers.chuyendong.add(api.arrow(pre, end.clone().add(end.clone().sub(pre).multiplyScalar(.6)), col, .35, .2)); api.hotspot(t, info); api.label(n, { cls: 'sm', pos: c.getPointAt(.15).add(new THREE.Vector3(0, .3, 0)), parent: layers.chuyendong, onClick: info }); };
    flow([[25, 113], [23.5, 110], [22, 107.5], [20.5, 105.5]], 0x3f7fd8, 'Gió mùa Đông Bắc', { title: 'Gió mùa Đông Bắc', html: 'Thổi vào nước ta từ tháng 11 đến tháng 4, lạnh và khô (nửa đầu mùa đông), gây mùa đông lạnh ở miền Bắc.', id: 'gmdb' });
    flow([[6, 100.5], [8, 103], [10.5, 105], [12.5, 107]], 0x2fa860, 'Gió mùa Tây Nam', { title: 'Gió mùa Tây Nam', html: 'Thổi vào nước ta từ tháng 5 đến tháng 10, nóng ẩm, gây mưa lớn cho Nam Bộ và Tây Nguyên.', id: 'gmtn' });
    flow([[13.5, 117], [15, 113], [16.3, 110], [17, 107]], 0xd62f2f, 'Đường đi của bão', { title: 'Đường đi của bão', html: 'Bão hình thành trên biển, di chuyển theo hướng mũi tên và đổ bộ vào đất liền. Mũi tên càng to thể hiện cường độ càng mạnh.', id: 'storm', onPick: () => api.done('storm') }, .09);
    // 3. chấm điểm
    {
      const centers = [[21.0, 105.9, .55, 1], [10.8, 106.7, .45, .9], [10.0, 105.7, .9, .7], [16.0, 108.2, .3, .4], [19.8, 105.8, .5, .45], [12.2, 109.1, .3, .25], [13.0, 108.0, .9, .2], [21.6, 104.5, 1.1, .2], [18.6, 105.6, .4, .35]];
      const pts = []; let guard = 0;
      while (pts.length < 520 && guard++ < 30000) { const c = centers[Math.floor(Math.random() * centers.length)]; if (Math.random() > c[3]) continue; const la = c[0] + (Math.random() + Math.random() - 1) * c[2] * 1.6, lo = c[1] + (Math.random() + Math.random() - 1) * c[2] * 1.6; if (inside(lo, la)) pts.push(P(la, lo, .25)); }
      const im = new THREE.InstancedMesh(new THREE.SphereGeometry(.035, 6, 4), new THREE.MeshBasicMaterial({ color: 0xb0302a }), pts.length); const m4 = new THREE.Matrix4(); pts.forEach((p, i) => { m4.makeTranslation(p.x, p.y, p.z); im.setMatrixAt(i, m4); }); layers.chamdiem.add(im);
      api.label('1 chấm = 200 000 người (minh hoạ)', { cls: 'sm', pos: P(8.3, 110.5, .1), parent: layers.chamdiem });
    }
    // 4. khoanh vùng
    AREAS.forEach(([n, la, lo, r, c]) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r * K, 48), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .45, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.copy(P(la, lo, .24)); m.scale.set(1, n.includes('Cửu Long') ? .7 : 1, 1); layers.khoanhvung.add(m);
      const ring = new THREE.Mesh(new THREE.RingGeometry(r * K - .03, r * K, 64), new THREE.MeshBasicMaterial({ color: c })); ring.rotation.x = -Math.PI / 2; ring.position.copy(P(la, lo, .25)); ring.scale.copy(m.scale); layers.khoanhvung.add(ring);
      api.label(n, { cls: 'sm', pos: P(la, lo, .5), parent: layers.khoanhvung }); });
    // 5. bản đồ – biểu đồ
    REGIONS.forEach(([n, la, lo, v]) => { const h = v / 23 * 3; const m = new THREE.Mesh(new THREE.BoxGeometry(.35, h, .35), new THREE.MeshStandardMaterial({ color: 0x3f7fd8 })); m.position.copy(P(la, lo, .22 + h / 2)); layers.bando.add(m);
      const info = { title: n, html: `Dân số khoảng <b>${v} triệu người</b> (làm tròn).${v === 23 ? '<br>→ Vùng đông dân nhất.' : ''}`, id: n, onPick: () => { if (v === 23) api.done('region'); } };
      api.hotspot(m, info); api.label(`${v} tr`, { cls: 'sm', pos: P(la, lo, .4 + h), parent: layers.bando, onClick: info }); });
    api.label('Dân số các vùng (triệu người, làm tròn)', { cls: '', pos: P(8.3, 111, .2), parent: layers.bando });

    state.layer = v => { state.cur = v; for (const [k, g] of Object.entries(layers)) g.visible = k === v || state.all;
      api.legend(v === 'kihieu' ? Object.values(SYM_STYLE).map(([c, t]) => ({ c: '#' + c.toString(16).padStart(6, '0'), t })) : v === 'khoanhvung' ? [{ c: '#f0d34a', t: 'Lúa' }, { c: '#8a4a2a', t: 'Cà phê' }, { c: '#3aa05a', t: 'Chè' }] : v === 'chuyendong' ? [{ c: '#3f7fd8', t: 'Gió mùa Đông Bắc' }, { c: '#2fa860', t: 'Gió mùa Tây Nam' }, { c: '#d62f2f', t: 'Bão' }] : null); };
    api.heading('Lớp bản đồ');
    api.toggle('all', 'Hiện tất cả các phương pháp', false, v => { state.all = v; Object.values(layers).forEach(g => (g.visible = v || g.visible)); if (!v) state.layer(state.cur || 'none'); });
  },
};

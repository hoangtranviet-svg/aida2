// 3D-10 · Bài 10 – Thực hành: Đọc bản đồ các đới và kiểu khí hậu, phân tích biểu đồ khí hậu
import { THREE, makeGlobe, latLonToVec3, starfield } from '../core.js';
import { earthTexture, CLIMATE_ZONES } from '../earth.js';

const ZONE_INFO = {
  'Đới khí hậu xích đạo': 'Nóng ẩm quanh năm, nhiệt độ trung bình trên 25 °C, biên độ nhiệt năm rất nhỏ; mưa nhiều quanh năm (thường trên 2 000 mm/năm).',
  'Đới khí hậu cận xích đạo': 'Nóng quanh năm, có hai mùa rõ rệt: mùa mưa và mùa khô do gió mùa.',
  'Đới khí hậu nhiệt đới': 'Nóng, lượng mưa giảm dần về phía chí tuyến. Phân hoá thành kiểu nhiệt đới gió mùa (mưa nhiều – như Việt Nam) và nhiệt đới lục địa (khô hạn, nhiều hoang mạc).',
  'Đới khí hậu cận nhiệt': 'Có mùa hạ nóng, mùa đông ấm. Gồm các kiểu cận nhiệt gió mùa, cận nhiệt lục địa và cận nhiệt địa trung hải (mưa vào mùa đông).',
  'Đới khí hậu ôn đới': 'Bốn mùa rõ rệt. Kiểu ôn đới hải dương (mát, mưa quanh năm) và ôn đới lục địa (mùa đông lạnh, mưa ít, biên độ nhiệt lớn).',
  'Đới khí hậu cận cực': 'Mùa đông rất dài và lạnh, mùa hạ ngắn và mát; mưa ít.',
  'Đới khí hậu cực': 'Lạnh giá quanh năm, nhiệt độ trung bình phần lớn dưới 0 °C, mưa rất ít.',
};
// Số liệu nhiệt độ (°C) và lượng mưa (mm) trung bình tháng – MINH HOẠ GẦN ĐÚNG; tổng lượng mưa và kiểu khí hậu theo Hình 10.2 SGK
const STATIONS = [
  { id: 'hn', name: 'Hà Nội (Việt Nam)', type: 'Nhiệt đới gió mùa', total: 1694,
    t: [16.4, 17.2, 20.2, 23.9, 27.4, 28.9, 29.2, 28.6, 27.5, 24.9, 21.5, 18.2], r: [19, 26, 44, 90, 188, 240, 288, 318, 265, 131, 43, 42] },
  { id: 'up', name: 'U-pha (Liên bang Nga)', type: 'Ôn đới lục địa', total: 584,
    t: [-13.5, -12.0, -5.5, 5.0, 13.0, 17.5, 19.5, 17.0, 11.0, 3.5, -4.5, -10.5], r: [32, 25, 26, 33, 48, 64, 62, 56, 54, 54, 59, 71] },
  { id: 'va', name: 'Va-len-xi-a (Ai-len)', type: 'Ôn đới hải dương', total: 1416,
    t: [7.5, 7.5, 8.4, 9.4, 11.4, 13.6, 15.2, 15.4, 14.1, 12.0, 9.6, 8.1], r: [164, 118, 118, 81, 87, 78, 87, 108, 121, 148, 144, 162] },
];

export default {
  id: '3D-10', code: 'DL10.B10', title: 'Các đới và kiểu khí hậu trên Trái Đất',
  objectives: [
    { c: 'DL10.04.07', t: 'Đọc bản đồ các đới khí hậu; phân tích biểu đồ một số kiểu khí hậu' },
    { c: 'DL10.04.06', t: 'Phân tích bảng số liệu, hình vẽ về các yếu tố khí quyển' },
  ],
  sources: [
    { t: 'NOAA Climate.gov – Climate Zones (Köppen) overview', u: 'https://www.climate.gov/maps-data' },
    { t: 'WMO – Climatological Standard Normals', u: 'https://community.wmo.int/en/activity-areas/climate-services/climate-products-and-initiatives/wmo-climatological-normals' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 10 (Hình 10.1, 10.2)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Ranh giới các đới khí hậu trên quả địa cầu được vẽ theo vĩ độ (đơn giản hoá); thực tế ranh giới uốn lượn theo lục địa, đại dương và địa hình. Số liệu từng tháng của biểu đồ là số liệu minh hoạ gần đúng; tổng lượng mưa năm theo SGK.',
  view: { pos: [0, 1.2, 6.2], target: [0, 0, 0] },
  steps: [
    { title: 'Các đới khí hậu', html: '<p>Trên mỗi bán cầu có <b>7 đới khí hậu</b>, từ Xích đạo về cực: xích đạo, cận xích đạo, nhiệt đới, cận nhiệt, ôn đới, cận cực, cực. Các đới phân bố gần như <b>đối xứng qua Xích đạo</b>.</p><div class="tip">Bấm vào tên từng đới để đọc đặc điểm.</div>',
      enter: a => { a.state.show('globe'); a.fly([0, 1.2, 6.2], [0, 0, 0]); } },
    { title: 'Việt Nam thuộc đới nào?', html: '<p>Phần lớn lãnh thổ Việt Nam nằm trong <b>đới khí hậu nhiệt đới</b>, kiểu <b>nhiệt đới gió mùa</b>: nóng ẩm, mưa nhiều, có mùa đông lạnh ở miền Bắc. Phần cực Nam (Nam Bộ) mang tính chất <b>cận xích đạo</b>.</p>',
      enter: a => { a.state.show('globe'); a.state.faceLon(106); a.fly([0, 1.6, 5.2], [0, .5, 0]); } },
    { title: 'Đọc biểu đồ khí hậu', html: '<p>Biểu đồ khí hậu gồm: <b>cột</b> – lượng mưa từng tháng (mm), <b>đường</b> – nhiệt độ trung bình từng tháng (°C).</p><p>Cách phân tích: nhiệt độ cao nhất, thấp nhất, biên độ nhiệt năm; tổng lượng mưa, các tháng mưa nhiều/ít → kết luận kiểu khí hậu.</p><div class="tip">Chọn từng trạm, xoay biểu đồ 3D, bấm vào cột để đọc số liệu.</div>',
      enter: a => { a.state.show('chart'); a.fly([0, 4, 11], [0, 2, 0]); } },
    { title: 'So sánh ba kiểu khí hậu', html: '<ul><li><b>Nhiệt đới gió mùa</b> (Hà Nội): nóng quanh năm, mưa tập trung vào mùa hạ.</li><li><b>Ôn đới lục địa</b> (U-pha): mùa đông rất lạnh (dưới 0 °C), biên độ nhiệt lớn, mưa ít.</li><li><b>Ôn đới hải dương</b> (Va-len-xi-a): ấm áp quanh năm, biên độ nhiệt nhỏ, mưa nhiều vào thu – đông.</li></ul>',
      enter: a => { a.state.show('chart'); a.set('st', 'all'); a.fly([0, 5, 25], [0, 2, 0]); } },
  ],
  tasks: [
    { id: 'zones', text: 'Bấm vào <b>4 đới khí hậu</b> khác nhau.' },
    { id: 'hnmax', text: 'Trên biểu đồ Hà Nội, bấm vào <b>tháng mưa nhiều nhất</b>.' },
    { id: 'upcold', text: 'Tìm tháng <b>lạnh nhất của U-pha</b> (bấm vào điểm nhiệt độ).' },
    { id: 'all', text: 'Xem <b>cả 3 biểu đồ</b> cùng lúc để so sánh.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    starfield(scene);
    const key = new THREE.DirectionalLight(0xffffff, 2); key.position.set(4, 6, 10); scene.add(key);
    const tex = await earthTexture({ mode: 'climate' });
    const G = new THREE.Group(), C = new THREE.Group(); scene.add(G, C);
    const GR = 2;
    const globe = makeGlobe(api, { radius: GR, texture: tex, lines: [0, 23.45, -23.45, 66.55, -66.55] }); G.add(globe);
    const gc = { center: new THREE.Vector3(), radius: GR };
    const seenZ = new Set();
    const zl = new THREE.Group(); G.add(zl); // nhãn đứng yên
    CLIMATE_ZONES.forEach(z => {
      const lat = (z.min + z.max) / 2; const info = { title: z.name, html: ZONE_INFO[z.name] + `<br><small>Khoảng vĩ độ (gần đúng): ${z.min}° – ${z.max}° ở mỗi bán cầu.</small>`, id: z.name, onPick: () => { seenZ.add(z.name); if (seenZ.size >= 4) api.done('zones'); } };
      api.label(z.name.replace('Đới khí hậu ', ''), { cls: 'sm', pos: latLonToVec3(Math.min(lat, 80), -40, GR * 1.04), parent: zl, globe: gc, onClick: info });
      if (lat < 75) api.label(z.name.replace('Đới khí hậu ', ''), { cls: 'sm', pos: latLonToVec3(-lat, -40, GR * 1.04), parent: zl, globe: gc, onClick: info });
    });
    const vn = new THREE.Mesh(new THREE.SphereGeometry(.035, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff2244 })); vn.position.copy(latLonToVec3(16, 106, GR * 1.01)); globe.add(vn);
    api.label('Việt Nam', { cls: 'warm', pos: latLonToVec3(16, 106, GR * 1.08), parent: globe, globe: gc });
    state.faceLon = L => { state.lock = true; globe.rotation.y = -Math.PI / 2 - L * Math.PI / 180; clearTimeout(state.lt); state.lt = setTimeout(() => (state.lock = false), 8000); };
    api.onTick(dt => { if (state.cur === 'globe' && !state.lock && api.get('spin')) globe.rotation.y += dt * .07; });

    // ===== biểu đồ khí hậu 3D =====
    const MONTH = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const rainH = mm => mm / 320 * 4, tempY = c => (c + 20) / 50 * 4; // trục: mưa 0–320 mm, nhiệt độ −20…30 °C
    const charts = {};
    STATIONS.forEach((S, si) => {
      const g = new THREE.Group(); C.add(g); charts[S.id] = g;
      const z = 0; const x0 = -3.3;
      const base = new THREE.Mesh(new THREE.BoxGeometry(7.4, .06, 1.6), new THREE.MeshStandardMaterial({ color: 0x33475a })); base.position.set(0, -.03, z); g.add(base);
      S.r.forEach((mm, i) => {
        const h = Math.max(rainH(mm), .02); const b = new THREE.Mesh(new THREE.BoxGeometry(.42, h, .8), new THREE.MeshStandardMaterial({ color: 0x3b8ee8, roughness: .5 }));
        b.position.set(x0 + i * .6, h / 2, z); g.add(b);
        const info = { title: `${S.name} – tháng ${i + 1}`, html: `Lượng mưa: <b>${mm} mm</b><br>Nhiệt độ: <b>${String(S.t[i]).replace('.', ',')} °C</b>`, id: `${S.id}-r${i + 1}`, onPick: () => { if (S.id === 'hn' && mm === Math.max(...S.r)) api.done('hnmax'); } };
        api.hotspot(b, info);
        api.label(MONTH[i], { cls: 'sm plain', pos: new THREE.Vector3(x0 + i * .6, -.25, z + .9), parent: g });
      });
      const pts = S.t.map((c, i) => new THREE.Vector3(x0 + i * .6, tempY(c), z));
      g.add(api.tube(pts, .04, 0xff5a3a));
      S.t.forEach((c, i) => { const s = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), new THREE.MeshStandardMaterial({ color: 0xff5a3a })); s.position.copy(pts[i]); g.add(s);
        api.hotspot(s, { title: `${S.name} – tháng ${i + 1}`, html: `Nhiệt độ: <b>${String(c).replace('.', ',')} °C</b>`, id: `${S.id}-t${i + 1}`, onPick: () => { if (S.id === 'up' && c === Math.min(...S.t)) api.done('upcold'); } }); });
      // trục
      const ax = (x, col) => { const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x, 0, z), new THREE.Vector3(x, 4.1, z)]), new THREE.LineBasicMaterial({ color: col })); g.add(l); };
      ax(x0 - .5, 0xff8a6a); ax(x0 + 11 * .6 + .5, 0x7fb6ff);
      [-20, -10, 0, 10, 20, 30].forEach(c => api.label(`${c}°`, { cls: 'sm plain', pos: new THREE.Vector3(x0 - .9, tempY(c), z), parent: g }));
      [0, 100, 200, 300].forEach(mm => api.label(`${mm}`, { cls: 'sm plain', pos: new THREE.Vector3(x0 + 11 * .6 + .95, rainH(mm), z), parent: g }));
      const tmin = Math.min(...S.t), tmax = Math.max(...S.t);
      api.label(`<b>${S.name}</b><br>${S.type} · ${S.total} mm/năm · biên độ ${(tmax - tmin).toFixed(1).replace('.', ',')} °C`, { cls: '', pos: new THREE.Vector3(0, 4.7, z), parent: g });
    });
    const layout = v => {
      const ids = v === 'all' ? ['hn', 'up', 'va'] : [v];
      Object.entries(charts).forEach(([id, g]) => { const k = ids.indexOf(id); g.visible = k >= 0; g.position.set(v === 'all' ? (k - 1) * 9 : 0, 0, 0); });
      if (v === 'all') api.done('all');
    };
    state.show = n => { state.cur = n; G.visible = n === 'globe'; C.visible = n === 'chart'; cg.style.display = n === 'globe' ? '' : 'none'; cc.style.display = n === 'chart' ? '' : 'none';
      api.legend(n === 'globe' ? CLIMATE_ZONES.map(z => ({ c: `rgb(${z.c.join(',')})`, t: z.name.replace('Đới khí hậu ', '') })) : [{ c: '#3b8ee8', t: 'Lượng mưa (mm)' }, { c: '#ff5a3a', t: 'Nhiệt độ (°C)' }]); };
    const base = api.controlsBox;
    const cg = document.createElement('div'); base.append(cg); api.controlsBox = cg; api.heading('Tuỳ chọn');
    api.toggle('spin', 'Xoay quả địa cầu', true, () => {});
    const cc = document.createElement('div'); base.append(cc); api.controlsBox = cc; api.heading('Trạm khí tượng');
    api.choice('st', '', [{ v: 'hn', t: 'Hà Nội' }, { v: 'up', t: 'U-pha' }, { v: 'va', t: 'Va-len-xi-a' }, { v: 'all', t: 'Cả ba' }], 'hn', layout);
    api.controlsBox = base;
  },
};

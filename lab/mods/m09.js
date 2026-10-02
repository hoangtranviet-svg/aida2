// 3D-09 · Bài 9 – Khí quyển, các yếu tố khí hậu
import { THREE, makeGlobe, geoCurve, starfield, latLonToVec3, circleLat } from '../core.js';
import { earthTexture } from '../earth.js';

// thang độ cao “nén” để nhìn được cả tầng đối lưu (vài km) lẫn tầng nhiệt (hàng trăm km)
const H = [[0, 0], [16, 2.2], [55, 3.6], [85, 4.5], [800, 6.2], [1200, 6.9]];
function hy(km) { for (let i = 1; i < H.length; i++) if (km <= H[i][0]) { const [a, ya] = H[i - 1], [b, yb] = H[i]; return ya + (yb - ya) * (km - a) / (b - a); } return H[H.length - 1][1]; }

const LAYERS = [
  { id: 'doiluu', name: 'Tầng đối lưu', from: 0, to: 12, rng: '0 – 8/16 km', col: 0x5ec8ff,
    html: 'Từ mặt đất lên tới 8 km (ở cực) – 16 km (ở Xích đạo). Tập trung khoảng 80% khối lượng không khí và gần như toàn bộ hơi nước, bụi. Nhiệt độ <b>giảm dần theo độ cao</b> (trung bình 0,6 °C/100 m). Mây, mưa, gió, bão… đều diễn ra ở đây, nên đây là tầng quan trọng nhất đối với đời sống.' },
  { id: 'binhluu', name: 'Tầng bình lưu', from: 12, to: 53, rng: '≈ 16 – 51/55 km', col: 0x7f9cff,
    html: 'Không khí khô, chuyển động theo chiều ngang là chủ yếu. Có <b>lớp ô-dôn ở độ cao 20 – 25 km</b> hấp thụ phần lớn tia tử ngoại của Mặt Trời, bảo vệ sự sống. Nhiệt độ <b>tăng dần theo độ cao</b> do ô-dôn hấp thụ năng lượng.' },
  { id: 'giua', name: 'Tầng giữa', from: 53, to: 83, rng: '≈ 51/55 – 80/85 km', col: 0x9a7fff,
    html: 'Nhiệt độ giảm mạnh theo độ cao, xuống tới khoảng −80 đến −90 °C ở đỉnh tầng – nơi lạnh nhất của khí quyển. Phần lớn <b>thiên thạch bốc cháy</b> khi bay vào tầng này.' },
  { id: 'nhiet', name: 'Tầng nhiệt', from: 83, to: 800, rng: '≈ 80/85 – 800 km', col: 0xd17fff,
    html: 'Không khí rất loãng, nhiệt độ tăng rất cao (có thể trên 1 000 °C). Các phân tử khí bị i-on hoá, có tác dụng phản xạ sóng vô tuyến. Đây là nơi xuất hiện <b>cực quang</b> và nơi nhiều vệ tinh, Trạm Vũ trụ Quốc tế (≈ 400 km) bay qua.' },
  { id: 'khuechtan', name: 'Tầng khuếch tán', from: 800, to: 1200, rng: 'trên 800 km', col: 0x5a6aa8,
    html: 'Không khí cực kì loãng, các phân tử khí (chủ yếu hi-đrô, hê-li) có thể thoát dần vào không gian vũ trụ. Ranh giới với vũ trụ không rõ ràng.' },
];
const TEMP_TABLE = [[0, 24.5, 1.8], [20, 25.0, 7.4], [30, 20.4, 13.3], [40, 14.0, 17.7], [50, 5.4, 23.8], [60, -0.6, 29.0], [70, -10.4, 32.2]];

export default {
  id: '3D-09', code: 'DL10.B09', title: 'Khí quyển, các yếu tố khí hậu',
  objectives: [
    { c: 'DL10.04.01', t: 'Nêu được khái niệm khí quyển' },
    { c: 'DL10.04.02', t: 'Sự phân bố nhiệt độ không khí' },
    { c: 'DL10.04.03', t: 'Sự hình thành các đai khí áp' },
    { c: 'DL10.04.04', t: 'Các loại gió chính, gió địa phương' },
    { c: 'DL10.04.05', t: 'Nhân tố ảnh hưởng và phân bố mưa' },
    { c: 'DL10.04.08', t: 'Giải thích hiện tượng thời tiết, khí hậu' },
  ],
  sources: [
    { t: 'NOAA JetStream – Layers of the Atmosphere', u: 'https://www.noaa.gov/jetstream/atmosphere/layers-of-atmosphere', n: 'cấu trúc tầng, nhiệt độ theo độ cao' },
    { t: 'UCAR Center for Science Education – Layers of Earth’s Atmosphere', u: 'https://scied.ucar.edu/learning-zone/atmosphere/layers-earths-atmosphere' },
    { t: 'NOAA JetStream – Global Atmospheric Circulations', u: 'https://www.noaa.gov/jetstream/global/global-atmospheric-circulations', n: 'mô hình 3 vòng hoàn lưu, đai khí áp' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 9 (Hình 9.1, 9.4, 9.5, 9.6; Bảng 9)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Thang độ cao của mô hình được “nén” (không theo tỉ lệ thật) để có thể nhìn cùng lúc tầng đối lưu dày vài km và tầng nhiệt dày hàng trăm km.',
  view: { pos: [0, 4.4, 16.5], target: [0, 3.4, 0] },

  steps: [
    { title: 'Khí quyển là gì?', html: `<p><b>Khí quyển</b> là lớp không khí bao quanh Trái Đất, luôn chịu ảnh hưởng của Vũ Trụ, trước hết là Mặt Trời.</p><p>Thành phần chính: <b>ni-tơ 78,1%</b>, <b>ô-xy 20,9%</b>, còn lại là ác-gông, các-bô-níc, hơi nước, bụi…</p><div class="tip">Xoay mô hình bằng chuột/ngón tay. Bấm vào các nhãn có dấu ⓘ để đọc thông tin.</div>`,
      enter: a => { a.state.show('layers'); a.fly([0, 4.4, 16.5], [0, 3.4, 0]); a.readout('<b>Thành phần không khí</b><br>Ni-tơ 78,1% · Ô-xy 20,9%<br>Khí khác ≈ 1% (Ar, CO₂, hơi nước…)'); } },
    { title: 'Năm tầng khí quyển', html: `<p>Theo chiều thẳng đứng, khí quyển chia thành 5 tầng: <b>đối lưu – bình lưu – giữa – nhiệt – khuếch tán</b>.</p><p>Quan sát đường <b>nhiệt độ</b> bên phải: khi lên cao, nhiệt độ lúc giảm, lúc tăng – đó là cơ sở để chia tầng.</p><div class="tip">Bấm lần lượt vào từng tầng để so sánh độ cao và đặc điểm.</div>`,
      enter: a => { a.state.show('layers'); a.fly([5.5, 4.2, 12], [1.2, 3.4, 0]); a.readout(null); } },
    { title: 'Nhiệt độ không khí theo vĩ độ', html: `<p>Càng xa Xích đạo, góc chiếu của tia sáng Mặt Trời càng nhỏ → cùng một chùm tia phải chiếu lên diện tích lớn hơn → nhận ít nhiệt hơn.</p><p>Vì vậy <b>nhiệt độ trung bình năm giảm dần từ Xích đạo về cực</b>, còn <b>biên độ nhiệt năm tăng dần</b>. Ngoài ra nhiệt độ còn thay đổi theo lục địa – đại dương và theo địa hình.</p><div class="tip">Bấm vào các nhãn vĩ độ để xem số liệu Bảng 9 (SGK).</div>`,
      enter: a => { a.state.show('globe', 'temp'); a.fly([0, 0.8, 5.2], [0, 0, 0]); } },
    { title: 'Các đai khí áp', html: `<p>Các đai áp cao và áp thấp phân bố <b>xen kẽ và đối xứng</b> qua đai áp thấp xích đạo.</p><ul><li>Áp thấp xích đạo, áp cao cực: nguyên nhân <b>nhiệt lực</b>.</li><li>Áp cao cận chí tuyến, áp thấp ôn đới: nguyên nhân <b>động lực</b>.</li></ul><div class="tip">Bật “Hoàn lưu thẳng đứng” để thấy không khí bốc lên ở đai áp thấp và giáng xuống ở đai áp cao.</div>`,
      enter: a => { a.state.show('globe', 'pressure'); a.fly([0.6, 0.6, 5.4], [0, 0, 0]); } },
    { title: 'Các loại gió chính', html: `<ul><li><b style="color:#e8603c">Gió Mậu dịch</b>: từ áp cao cận chí tuyến về áp thấp xích đạo; hướng đông bắc (BCB), đông nam (BCN); khá khô.</li><li><b style="color:#2f8fe0">Gió Tây ôn đới</b>: từ áp cao cận chí tuyến về áp thấp ôn đới; hướng tây nam (BCB), tây bắc (BCN); ẩm, gây mưa.</li><li><b>Gió Đông cực</b>: từ áp cao cực về áp thấp ôn đới; rất lạnh và khô.</li></ul><p>Do Trái Đất tự quay, gió bị <b>lệch hướng</b>: sang phải ở bán cầu Bắc, sang trái ở bán cầu Nam.</p>`,
      enter: a => { a.state.show('globe', 'winds'); a.fly([0, 1.2, 5.6], [0, 0, 0]); } },
    { title: 'Gió mùa', html: `<p><b>Gió mùa</b> thổi theo mùa, hướng và tính chất hai mùa trái ngược nhau. Nguyên nhân chủ yếu: lục địa và đại dương nóng lên, lạnh đi không đều (hoặc chênh lệch giữa hai bán cầu).</p><p>Ở Nam Á, Đông Nam Á: mùa hạ gió từ biển thổi vào (nóng ẩm, mưa nhiều); mùa đông gió từ lục địa thổi ra (lạnh, khô).</p><div class="tip">Chuyển giữa “Mùa hạ” và “Mùa đông”.</div>`,
      enter: a => { a.state.show('globe', 'monsoon'); a.state.globeSpin = false; a.state.faceAsia(); a.fly([2.2, 1.8, 4.2], [0, 0.3, 0]); } },
    { title: 'Gió đất – gió biển', html: `<p>Ở vùng ven biển, ban ngày đất nóng nhanh hơn biển → khí áp trên đất thấp hơn → <b>gió biển</b> thổi vào đất liền. Ban đêm đất nguội nhanh hơn → <b>gió đất</b> thổi ra biển.</p><div class="tip">Chuyển “Ngày/Đêm” và quan sát chiều mũi tên.</div>`,
      enter: a => { a.state.show('coast'); a.fly([0, 3, 11], [0, 1.4, 0]); } },
    { title: 'Gió phơn', html: `<p>Gió vượt núi: ở <b>sườn đón gió</b>, không khí bốc lên, nhiệt độ giảm (≈ 0,6 °C/100 m khi không khí ẩm), hơi nước ngưng tụ gây mưa. Sang <b>sườn khuất gió</b>, không khí khô đi xuống, nhiệt độ tăng ≈ 1 °C/100 m → gió <b>khô nóng</b>.</p><p>Ví dụ ở nước ta: gió Tây khô nóng (gió Lào) ở Bắc Trung Bộ.</p><div class="tip">Kéo thanh “Vị trí khối khí” và theo dõi bảng số liệu.</div>`,
      enter: a => { a.state.show('foehn'); a.fly([0, 3.4, 13.5], [0, 2, 0]); } },
    { title: 'Mưa và sự phân bố mưa', html: `<p>Lượng mưa phụ thuộc: <b>khí áp</b> (áp thấp mưa nhiều), <b>frông</b>, <b>gió</b> (gió từ biển, gió Tây ôn đới mưa nhiều), <b>dòng biển</b> (dòng nóng mưa nhiều), <b>địa hình</b> (sườn đón gió mưa nhiều).</p><p>Theo vĩ độ: mưa nhiều nhất ở <b>Xích đạo</b>, khá ít ở <b>vùng chí tuyến</b>, mưa nhiều ở <b>ôn đới</b>, mưa ít ở <b>cực</b>.</p>`,
      enter: a => { a.state.show('globe', 'rain'); a.fly([0, 0.8, 5.2], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'layers', text: 'Bấm vào <b>tầng đối lưu</b> và <b>tầng bình lưu</b> để so sánh hai tầng.', hint: 'Bước 2' },
    { id: 'ozone', text: 'Tìm và bấm vào <b>lớp ô-dôn</b>. Nó nằm ở tầng nào?', hint: 'Lớp màu cam mỏng' },
    { id: 'stp', text: 'Bấm vào <b>đai áp cao cận chí tuyến</b> để xem gió nào thổi ra từ đai này.', hint: 'Bước 4' },
    { id: 'monsoon', text: 'Xem gió mùa ở <b>cả mùa hạ và mùa đông</b>.', hint: 'Bước 6' },
    { id: 'night', text: 'Chuyển mô hình ven biển sang <b>ban đêm</b> và quan sát gió đất.', hint: 'Bước 7' },
    { id: 'foehn', text: 'Đưa khối khí vượt núi xuống <b>chân sườn khuất gió</b> và đọc nhiệt độ.', hint: 'Bước 8' },
  ],

  async setup(api) {
    const { scene, state } = api;
    starfield(scene);
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(8, 6, 10); scene.add(sun);
    const tex = await earthTexture({ mode: 'natural' });
    const groups = { layers: new THREE.Group(), globe: new THREE.Group(), coast: new THREE.Group(), foehn: new THREE.Group() };
    Object.values(groups).forEach(g => scene.add(g));
    const overlays = {};
    const clicked = new Set();

    // ===================== A. CÁC TẦNG KHÍ QUYỂN =====================
    {
      const g = groups.layers, R = 6;
      const earth = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), new THREE.MeshStandardMaterial({ map: tex, roughness: .95 }));
      earth.position.y = -R; earth.rotation.z = 0.2; earth.rotation.y = -1.2; g.add(earth);
      const cap = 0.62; // góc mở của chỏm cầu (rad)
      LAYERS.forEach((L, i) => {
        const r0 = R + hy(L.from), r1 = R + hy(L.to);
        const geo = new THREE.SphereGeometry(r1, 96, 24, 0, Math.PI * 2, 0, cap);
        const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: L.col, transparent: true, opacity: 0.12 + i * 0.015, side: THREE.DoubleSide, depthWrite: false }));
        m.position.y = -R; g.add(m);
        const rim = circleLat(90 - cap / Math.PI * 180, r1, new THREE.LineBasicMaterial({ color: L.col, transparent: true, opacity: .9 }));
        rim.position.y = -R; g.add(rim);
        const ym = (hy(L.from) + hy(L.to)) / 2;
        api.label(`${L.name}<br><span style="font-weight:400;opacity:.85">${L.rng}</span>`, {
          pos: new THREE.Vector3(-2.6, ym, 0.4), parent: g, cls: '',
          onClick: { title: L.name + ' (' + L.rng + ')', html: L.html, id: L.id, onPick: () => { clicked.add(L.id); if (clicked.has('doiluu') && clicked.has('binhluu')) api.done('layers'); } },
        });
        if (i < LAYERS.length - 1) api.label(`${L.to === 12 ? '8 – 16' : L.to === 53 ? '51 – 55' : L.to === 83 ? '80 – 85' : '800'} km`, { cls: 'sm plain', pos: new THREE.Vector3(3.9, hy(L.to), 0), parent: g });
      });
      // lớp ô-dôn
      const oz = new THREE.Mesh(new THREE.SphereGeometry(R + hy(22.5), 96, 12, 0, Math.PI * 2, 0, cap * .98),
        new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: .26, side: THREE.DoubleSide, depthWrite: false }));
      oz.position.y = -R; g.add(oz);
      api.label('Lớp ô-dôn (20 – 25 km)', { cls: 'warm', pos: new THREE.Vector3(1.2, hy(22.5) + .05, 1.6), parent: g,
        onClick: { title: 'Lớp ô-dôn', id: 'ozone', html: 'Nằm trong <b>tầng bình lưu</b>, ở độ cao khoảng 20 – 25 km. Ô-dôn hấp thụ phần lớn tia tử ngoại (UV) có hại từ Mặt Trời. Các chất CFC (từng dùng trong tủ lạnh, bình xịt) làm suy giảm tầng ô-dôn.', onPick: () => api.done('ozone') } });
      // mây
      const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: .92 });
      const clouds = new THREE.Group(); g.add(clouds);
      for (let k = 0; k < 9; k++) {
        const c = new THREE.Group(); const ang = (k / 9 - .5) * 1.0; const h = hy(2 + (k % 3) * 2.2);
        for (let j = 0; j < 4; j++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.16 + Math.random() * .1, 12, 10), cloudMat); s.position.set(j * .17 - .25, Math.random() * .06, Math.random() * .1); c.add(s); }
        c.position.set(Math.sin(ang) * (R + h), Math.cos(ang) * (R + h) - R, (k % 2 ? .8 : -.6)); clouds.add(c);
      }
      api.onTick(dt => { clouds.rotation.z += dt * .01; });
      // máy bay ~10 km
      const plane = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(.04, .03, .5, 10), new THREE.MeshStandardMaterial({ color: 0xeeeeee })); body.rotation.z = Math.PI / 2; plane.add(body);
      const wing = new THREE.Mesh(new THREE.BoxGeometry(.12, .01, .5), new THREE.MeshStandardMaterial({ color: 0xcc3333 })); plane.add(wing);
      g.add(plane); api.label('Máy bay ≈ 10 km', { cls: 'sm', pos: new THREE.Vector3(0, .18, 0), parent: plane });
      // thiên thạch bốc cháy ~ tầng giữa
      const meteors = [];
      for (let k = 0; k < 4; k++) {
        const m = new THREE.Mesh(new THREE.ConeGeometry(.04, .5, 8), new THREE.MeshBasicMaterial({ color: 0xffb347 }));
        m.userData.t = Math.random(); m.userData.x = -1.5 + k * 1.2; g.add(m); meteors.push(m);
      }
      api.label('Thiên thạch bốc cháy', { cls: 'sm warm', pos: new THREE.Vector3(2.4, hy(70), .5), parent: g });
      // cực quang ~ tầng nhiệt
      const auroraMat = new THREE.MeshBasicMaterial({ color: 0x3dff8a, transparent: true, opacity: .55, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
      const aurora = new THREE.Mesh(new THREE.PlaneGeometry(3, .9, 40, 1), auroraMat); aurora.position.set(-1.6, hy(180), -1); g.add(aurora);
      const apos = aurora.geometry.attributes.position; const a0 = apos.array.slice();
      api.label('Cực quang', { cls: 'sm', pos: new THREE.Vector3(-1.6, hy(180) + .55, -1), parent: g });
      // vệ tinh ~ 400 km
      const sat = new THREE.Group();
      sat.add(new THREE.Mesh(new THREE.BoxGeometry(.14, .14, .14), new THREE.MeshStandardMaterial({ color: 0xd8c27a, metalness: .6, roughness: .3 })));
      const panel = new THREE.Mesh(new THREE.BoxGeometry(.6, .01, .16), new THREE.MeshStandardMaterial({ color: 0x2b4f9e, metalness: .4 })); sat.add(panel);
      g.add(sat); api.label('Vệ tinh, ISS ≈ 400 km', { cls: 'sm', pos: new THREE.Vector3(0, .22, 0), parent: sat });
      api.onTick((dt, t) => {
        const a1 = Math.sin(t * .15) * .45; const r1 = R + hy(10);
        plane.position.set(Math.sin(a1) * r1, Math.cos(a1) * r1 - R, 1.2); plane.rotation.z = -a1;
        const a2 = ((t * .05) % 1.2) - .6; const r2 = R + hy(400);
        sat.position.set(Math.sin(a2) * r2, Math.cos(a2) * r2 - R, 0); sat.rotation.z = -a2;
        meteors.forEach(m => { m.userData.t = (m.userData.t + dt * .35) % 1; const k = m.userData.t; m.position.set(m.userData.x + k * .8, hy(110 - k * 40), .3); m.rotation.z = 2.4; m.material.opacity = 1 - k; m.material.transparent = true; m.scale.setScalar(1 - k * .6); });
        for (let i = 0; i < apos.count; i++) { const x = a0[i * 3]; apos.setZ(i, Math.sin(x * 2 + t * 1.3) * .25); apos.setY(i, a0[i * 3 + 1] + Math.sin(x * 3 + t) * .06); }
        apos.needsUpdate = true; auroraMat.opacity = .45 + .2 * Math.sin(t * 2);
      });
      // đồ thị nhiệt độ theo độ cao
      const T = [[0, 15], [12, -56], [20, -56], [50, -2], [85, -90], [120, 50], [200, 600], [400, 1000]];
      const X = c => 4.6 + Math.max(-100, Math.min(c, 140)) / 60;
      const pts = T.map(([h, c]) => new THREE.Vector3(X(c), hy(h), 0));
      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
      g.add(api.tube(curve.getPoints(120), .025, 0xffd166));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(X(-100), 0, 0), new THREE.Vector3(X(-100), hy(1100), 0)]), new THREE.LineBasicMaterial({ color: 0x8899aa })));
      g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(X(-100), 0, 0), new THREE.Vector3(X(140), 0, 0)]), new THREE.LineBasicMaterial({ color: 0x8899aa })));
      [[-100, '−100'], [-50, '−50'], [0, '0'], [50, '50 °C']].forEach(([c, t]) => api.label(t, { cls: 'sm plain', pos: new THREE.Vector3(X(c), -.25, 0), parent: g }));
      api.label('Nhiệt độ không khí', { cls: 'sm warm', pos: new THREE.Vector3(X(40), hy(6), 0), parent: g });
      api.label('15 °C', { cls: 'sm plain', pos: new THREE.Vector3(X(15) + .2, .1, 0), parent: g });
      api.label('−56 °C', { cls: 'sm plain', pos: new THREE.Vector3(X(-56) - .45, hy(14), 0), parent: g });
      api.label('≈ −90 °C', { cls: 'sm plain', pos: new THREE.Vector3(X(-90) - .45, hy(85), 0), parent: g });
      api.label('&gt; 1 000 °C', { cls: 'sm plain', pos: new THREE.Vector3(X(140), hy(400) + .2, 0), parent: g });
    }

    // ===================== B. QUẢ ĐỊA CẦU: nhiệt độ, khí áp, gió, mưa =====================
    const GR = 1.6;
    const globe = makeGlobe(api, { radius: GR, texture: tex, lines: [0, 23.45, -23.45, 66.55, -66.55] });
    const spin = new THREE.Group(); spin.add(globe); groups.globe.add(spin);
    state.globeSpin = true;
    state.faceAsia = () => { globe.rotation.y = Math.PI; };
    api.onTick(dt => { if (state.globeSpin) globe.rotation.y += dt * .05; });
    const gc = { center: new THREE.Vector3(), radius: GR };
    const statics = {}; // nhãn đứng yên (không quay theo Trái Đất) cho từng lớp phủ
    const st = name => statics[name] || (statics[name] = (() => { const g = new THREE.Group(); groups.globe.add(g); return g; })());

    function bandMesh(lat0, lat1, color, r, op = .45) {
      const t0 = (90 - lat1) * Math.PI / 180, t1 = (90 - lat0) * Math.PI / 180;
      return new THREE.Mesh(new THREE.SphereGeometry(r, 96, 16, 0, Math.PI * 2, t0, t1 - t0), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: false }));
    }
    function rampTexture(fn) { // fn(lat) -> [r,g,b,a]
      const c = document.createElement('canvas'); c.width = 4; c.height = 256; const x = c.getContext('2d'); const im = x.createImageData(4, 256);
      for (let y = 0; y < 256; y++) { const lat = 90 - (y + .5) / 256 * 180; const [r, g, b, a] = fn(lat); for (let k = 0; k < 4; k++) im.data.set([r, g, b, a], (y * 4 + k) * 4); }
      x.putImageData(im, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }
    // nhiệt độ
    overlays.temp = new THREE.Group(); globe.add(overlays.temp);
    {
      const tempAt = lat => { const a = Math.abs(lat); for (let i = 1; i < TEMP_TABLE.length; i++) if (a <= TEMP_TABLE[i][0]) { const [l0, t0] = TEMP_TABLE[i - 1], [l1, t1] = TEMP_TABLE[i]; return t0 + (t1 - t0) * (a - l0) / (l1 - l0); } return -10.4 - (a - 70) * 1.1; };
      const STOPS = [[-30, [59, 76, 192]], [-8, [111, 168, 220]], [4, [150, 210, 190]], [14, [246, 213, 92]], [25, [232, 96, 60]]];
      const col = t => { if (t <= STOPS[0][0]) return [...STOPS[0][1], 165]; for (let i = 1; i < STOPS.length; i++) if (t <= STOPS[i][0]) { const [a, ca] = STOPS[i - 1], [b, cb] = STOPS[i]; const k = (t - a) / (b - a); return [...ca.map((v, j) => Math.round(v + (cb[j] - v) * k)), 165]; } return [...STOPS[STOPS.length - 1][1], 165]; };
      const m = new THREE.Mesh(new THREE.SphereGeometry(GR * 1.008, 96, 64), new THREE.MeshBasicMaterial({ map: rampTexture(l => col(tempAt(l))), transparent: true, depthWrite: false }));
      overlays.temp.add(m);
      overlays.temp.userData.static = st('temp');
      TEMP_TABLE.forEach(([lat, t, amp]) => {
        api.label(`${lat}°B · ${String(t).replace('.', ',')} °C`, { cls: 'sm', pos: latLonToVec3(lat, -35, GR * 1.04), parent: overlays.temp.userData.static, globe: gc,
          onClick: { title: `Vĩ độ ${lat}°B`, id: 'lat' + lat, html: `Nhiệt độ trung bình năm: <b>${String(t).replace('.', ',')} °C</b><br>Biên độ nhiệt năm: <b>${String(amp).replace('.', ',')} °C</b><br><small>Nguồn: Bảng 9, SGK Địa lí 10 – KNTT</small>` } });
      });
      // tia sáng Mặt Trời song song
      const rays = new THREE.Group(); overlays.temp.userData.rays = rays; groups.globe.add(rays);
      [-60, -30, 0, 30, 60].forEach(lat => { const p = latLonToVec3(lat, 0, GR); const y = p.y; const a = api.arrow(new THREE.Vector3(5, y, 0), new THREE.Vector3(Math.sqrt(GR * GR - y * y) + .05, y, 0), 0xffe066, .18, .09); rays.add(a); });
      api.label('Tia sáng Mặt Trời', { cls: 'sm warm', pos: new THREE.Vector3(4.2, 1.5, 0), parent: rays });
    }
    // khí áp
    overlays.pressure = new THREE.Group(); globe.add(overlays.pressure);
    const BELTS = [
      { lat: 0, w: 6, name: 'Áp thấp xích đạo (−)', low: true, html: 'Hình thành do nguyên nhân <b>nhiệt lực</b>: nhiệt độ cao quanh năm, không khí nở ra, bốc lên mạnh, hơi nước nhiều → khí áp thấp. Đây là nơi <b>gió Mậu dịch</b> của hai bán cầu thổi đến.' },
      { lat: 30, w: 5, name: 'Áp cao cận chí tuyến (+)', low: false, id: 'stp', html: 'Hình thành do nguyên nhân <b>động lực</b>: không khí bốc lên ở Xích đạo, di chuyển về chí tuyến rồi giáng xuống. Từ đây thổi ra <b>gió Mậu dịch</b> (về Xích đạo) và <b>gió Tây ôn đới</b> (về vùng ôn đới).' },
      { lat: -30, w: 5, name: 'Áp cao cận chí tuyến (+)', low: false, id: 'stp', html: 'Hình thành do nguyên nhân <b>động lực</b>. Từ đây thổi ra <b>gió Mậu dịch</b> (về Xích đạo) và <b>gió Tây ôn đới</b> (về vùng ôn đới).' },
      { lat: 60, w: 5, name: 'Áp thấp ôn đới (−)', low: true, html: 'Hình thành do nguyên nhân <b>động lực</b>: không khí từ áp cao cận chí tuyến và áp cao cực di chuyển tới, gặp nhau và bốc lên.' },
      { lat: -60, w: 5, name: 'Áp thấp ôn đới (−)', low: true, html: 'Hình thành do nguyên nhân <b>động lực</b>.' },
      { lat: 86, w: 8, name: 'Áp cao cực (+)', low: false, html: 'Hình thành do nguyên nhân <b>nhiệt lực</b>: nhiệt độ rất thấp, không khí co lại, nặng, giáng xuống → khí áp cao. Từ đây thổi ra <b>gió Đông cực</b>.' },
      { lat: -86, w: 8, name: 'Áp cao cực (+)', low: false, html: 'Hình thành do nguyên nhân <b>nhiệt lực</b>.' },
    ];
    BELTS.forEach(b => {
      const m = bandMesh(Math.max(-90, b.lat - b.w), Math.min(90, b.lat + b.w), b.low ? 0xff5a5a : 0x4fa3ff, GR * 1.01, .5); overlays.pressure.add(m);
      const info = { title: b.name, html: b.html, id: b.id || b.name, onPick: () => { if (b.id === 'stp') api.done('stp'); } };
      api.hotspot(m, info);
      api.label(b.name, { cls: 'sm ' + (b.low ? 'warm' : 'cold'), pos: latLonToVec3(Math.sign(b.lat) * Math.min(Math.abs(b.lat), 78), -35, GR * 1.05), parent: st('pressure'), globe: gc, onClick: info });
    });
    // hoàn lưu thẳng đứng (3 vòng)
    const cells = new THREE.Group(); overlays.pressure.add(cells);
    const cellLoop = (pts, color) => {
      const v = pts.map(([lat, h]) => latLonToVec3(lat, 0, GR * (1.02 + h)));
      const c = new THREE.CatmullRomCurve3(v, true, 'centripetal');
      cells.add(api.tube(c.getPoints(160), .008, color, { opacity: .5 }));
      api.flowAlong(c, { count: 18, color, size: .025, speed: .07, parent: cells });
    };
    for (const s of [1, -1]) {
      cellLoop([[s * 27, .02], [s * 4, .02], [s * 2, .18], [s * 2, .32], [s * 15, .36], [s * 28, .32], [s * 29, .18]], 0xffe08a); // Hadley
      cellLoop([[s * 33, .02], [s * 57, .02], [s * 59, .14], [s * 58, .26], [s * 45, .3], [s * 32, .26], [s * 31, .14]], 0x9fd8ff); // Ferrel
      cellLoop([[s * 87, .02], [s * 63, .02], [s * 61, .12], [s * 62, .22], [s * 75, .25], [s * 86, .2], [s * 87.5, .1]], 0xe6e6ff); // cực
    }
    // gió chính
    overlays.winds = new THREE.Group(); globe.add(overlays.winds);
    const WR = GR * 1.025;
    const lons = [-160, -100, -40, 20, 80, 140];
    const windDef = [
      { name: 'Gió Mậu dịch', col: 0xff6a3d, seg: s => lons.map(l => [[s * 28, l], [s * 16, l - 12], [s * 4, l - 26]]) },
      { name: 'Gió Tây ôn đới', col: 0x3ea0ff, seg: s => lons.map(l => [[s * 33, l], [s * 45, l + 14], [s * 57, l + 30]]) },
      { name: 'Gió Đông cực', col: 0xe8eef5, seg: s => lons.map(l => [[s * 84, l], [s * 74, l - 12], [s * 64, l - 26]]) },
    ];
    windDef.forEach(w => [1, -1].forEach(s => w.seg(s).forEach(path => {
      const c = geoCurve(path, WR); overlays.winds.add(api.tube(c.getPoints(40), .006, w.col, { opacity: .55 }));
      api.flowAlong(c, { count: 6, color: w.col, size: .022, speed: .12, parent: overlays.winds });
    })));
    [['Gió Mậu dịch', 16, 'warm'], ['Gió Tây ôn đới', 45, 'cold'], ['Gió Đông cực', 74, '']].forEach(([n, lat, cls]) => {
      api.label(n, { cls: 'sm ' + cls, pos: latLonToVec3(lat > 70 ? 70 : lat, -60, GR * 1.06), parent: st('winds'), globe: gc });
      api.label(n, { cls: 'sm ' + cls, pos: latLonToVec3(-(lat > 70 ? 70 : lat), -60, GR * 1.06), parent: st('winds'), globe: gc });
    });
    // gió mùa châu Á
    overlays.monsoon = new THREE.Group(); globe.add(overlays.monsoon);
    const mSummer = new THREE.Group(), mWinter = new THREE.Group(); overlays.monsoon.add(mSummer, mWinter);
    const MR = GR * 1.03;
    [[[-12, 70], [2, 74], [16, 82]], [[-10, 88], [5, 92], [20, 96]], [[-6, 108], [8, 110], [22, 108]], [[-2, 128], [14, 122], [28, 116]]].forEach(p => {
      const c = geoCurve(p, MR); mSummer.add(api.tube(c.getPoints(40), .01, 0x31d07f, { opacity: .7 })); api.flowAlong(c, { count: 7, color: 0x31d07f, size: .028, speed: .14, parent: mSummer });
    });
    [[[48, 105], [32, 110], [16, 108]], [[44, 92], [30, 90], [18, 84]], [[42, 122], [28, 118], [14, 114]], [[40, 75], [28, 76], [14, 74]]].forEach(p => {
      const c = geoCurve(p, MR); mWinter.add(api.tube(c.getPoints(40), .01, 0x8ec5ff, { opacity: .7 })); api.flowAlong(c, { count: 7, color: 0x8ec5ff, size: .028, speed: .14, parent: mWinter });
    });
    api.label('Gió mùa hạ: từ biển vào (nóng, ẩm)', { cls: 'sm warm', pos: latLonToVec3(2, 95, GR * 1.12), parent: mSummer });
    api.label('Gió mùa đông: từ lục địa ra (lạnh, khô)', { cls: 'sm cold', pos: latLonToVec3(42, 100, GR * 1.12), parent: mWinter });
    api.label('Việt Nam', { cls: 'sm', pos: latLonToVec3(16, 106, GR * 1.02), parent: overlays.monsoon });
    // mưa
    overlays.rain = new THREE.Group(); globe.add(overlays.rain);
    {
      const rainAt = lat => { const a = Math.abs(lat); return Math.max(0, 1 * Math.exp(-((a - 3) ** 2) / 120) + .55 * Math.exp(-((a - 52) ** 2) / 160) + .08 - .06 * (a > 70)); };
      const m = new THREE.Mesh(new THREE.SphereGeometry(GR * 1.008, 96, 64), new THREE.MeshBasicMaterial({ map: rampTexture(l => { const k = Math.min(1, rainAt(l)); return [Math.round(240 - 200 * k), Math.round(225 - 120 * k), Math.round(160 + 90 * k), 170]; }), transparent: true, depthWrite: false }));
      overlays.rain.add(m);
      [[3, 'Mưa nhiều nhất', 'Khu vực Xích đạo: áp thấp, không khí bốc lên mạnh, nhiều đại dương và rừng → mưa nhiều nhất.'], [26, 'Mưa ít', 'Vùng chí tuyến: áp cao, gió Mậu dịch khô, diện tích lục địa lớn → mưa ít, nhiều hoang mạc.'], [52, 'Mưa khá nhiều', 'Vùng ôn đới: áp thấp ôn đới, gió Tây ôn đới từ biển thổi vào → mưa nhiều.'], [80, 'Mưa rất ít', 'Vùng cực: áp cao, không khí lạnh, hơi nước ít → mưa rất ít.']].forEach(([lat, t, h]) => {
        api.label(t, { cls: 'sm', pos: latLonToVec3(lat, -35, GR * 1.05), parent: st('rain'), globe: gc, onClick: { title: t + ` (≈ ${lat}°)`, html: h, id: 'rain' + lat } });
      });
    }

    // ===================== C. GIÓ ĐẤT – GIÓ BIỂN =====================
    {
      const g = groups.coast;
      const sea = new THREE.Mesh(new THREE.BoxGeometry(6, .6, 4), new THREE.MeshStandardMaterial({ color: 0x2c74b8, roughness: .3, metalness: .1 })); sea.position.set(-3, -.3, 0); g.add(sea);
      const land = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 4), new THREE.MeshStandardMaterial({ color: 0x8a6b45 })); land.position.set(3, -.1, 0); g.add(land);
      const grass = new THREE.Mesh(new THREE.BoxGeometry(6, .05, 4), new THREE.MeshStandardMaterial({ color: 0x5f8f3e })); grass.position.set(3, .42, 0); g.add(grass);
      for (let i = 0; i < 9; i++) { const h = .4 + Math.random() * 1.2; const b = new THREE.Mesh(new THREE.BoxGeometry(.35, h, .35), new THREE.MeshStandardMaterial({ color: 0xcfd6dd, emissive: 0x000000 })); b.position.set(2 + (i % 5) * .7, .45 + h / 2, -1 + Math.floor(i / 5) * .9); b.userData.win = true; g.add(b); }
      const boat = new THREE.Mesh(new THREE.ConeGeometry(.25, .6, 3), new THREE.MeshStandardMaterial({ color: 0xffffff })); boat.position.set(-3.5, .3, .6); g.add(boat);
      const sky = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), new THREE.MeshBasicMaterial({ color: 0x8fc8ff })); sky.position.set(0, 4, -4); g.add(sky);
      const sunM = new THREE.Mesh(new THREE.SphereGeometry(.45, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffd34d })); sunM.position.set(4.5, 4.6, -3.5); g.add(sunM);
      const loopDay = new THREE.CatmullRomCurve3([new THREE.Vector3(-4, .5, 0), new THREE.Vector3(2.5, .7, 0), new THREE.Vector3(3.2, 2.2, 0), new THREE.Vector3(1, 3.2, 0), new THREE.Vector3(-3, 3.1, 0), new THREE.Vector3(-4.4, 1.8, 0)], true);
      const pts = loopDay.getPoints(100); const loopNight = new THREE.CatmullRomCurve3(pts.slice().reverse(), true);
      const tubeD = api.tube(pts, .025, 0xffffff, { opacity: .35, closed: true }); g.add(tubeD);
      const fD = api.flowAlong(loopDay, { count: 24, color: 0xfff0a0, size: .07, speed: .12, parent: g });
      const fN = api.flowAlong(loopNight, { count: 24, color: 0xa8d8ff, size: .07, speed: .12, parent: g });
      const lL = api.label('', { cls: 'big', pos: new THREE.Vector3(3, 3.9, 0), parent: g });
      const lS = api.label('', { cls: 'big', pos: new THREE.Vector3(-3, 3.9, 0), parent: g });
      const lW = api.label('', { cls: 'big', pos: new THREE.Vector3(-.6, 1.05, 1.6), parent: g });
      state.setDayNight = v => {
        const day = v === 'day';
        fD.visible = day; fN.visible = !day; sky.material.color.set(day ? 0x8fc8ff : 0x0e1a3a); sunM.material.color.set(day ? 0xffd34d : 0xe6ecff);
        g.children.forEach(o => { if (o.userData.win) o.material.emissive.set(day ? 0x000000 : 0x6a5a20); });
        api.setLabelText(lL, day ? 'Đất liền: nóng nhanh → <b>áp thấp (−)</b>' : 'Đất liền: nguội nhanh → <b>áp cao (+)</b>');
        api.setLabelText(lS, day ? 'Biển: mát hơn → <b>áp cao (+)</b>' : 'Biển: ấm hơn → <b>áp thấp (−)</b>');
        api.setLabelText(lW, day ? '➜ GIÓ BIỂN (ban ngày)' : '⬅ GIÓ ĐẤT (ban đêm)');
        lL.element.className = 'lbl big ' + (day ? 'warm' : 'cold'); lS.element.className = 'lbl big ' + (day ? 'cold' : 'warm');
        if (!day) api.done('night');
      };
    }

    // ===================== D. GIÓ PHƠN =====================
    {
      const g = groups.foehn;
      const shape = new THREE.Shape(); shape.moveTo(-7, 0); shape.lineTo(-5, 0);
      for (let i = 0; i <= 40; i++) { const x = -5 + i * .25; const y = 4 * Math.exp(-(x * x) / 6.5); shape.lineTo(x, y); }
      shape.lineTo(7, 0); shape.lineTo(7, -.6); shape.lineTo(-7, -.6); shape.closePath();
      const mnt = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 3, bevelEnabled: false }), new THREE.MeshStandardMaterial({ color: 0x6f8b52, roughness: .95 }));
      mnt.position.z = -1.5; g.add(mnt);
      const snow = new THREE.Mesh(new THREE.ConeGeometry(.55, .5, 24), new THREE.MeshStandardMaterial({ color: 0xffffff })); snow.position.set(0, 3.85, 0); g.add(snow);
      const leeTint = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.2), new THREE.MeshBasicMaterial({ color: 0xffa040, transparent: true, opacity: .12, depthWrite: false })); leeTint.position.set(3.6, 1.4, 1.6); g.add(leeTint);
      const yOf = x => 4 * Math.exp(-(x * x) / 6.5);
      const path = new THREE.CatmullRomCurve3(Array.from({ length: 41 }, (_, i) => { const x = -6.5 + i * 13 / 40; return new THREE.Vector3(x, Math.max(yOf(x), 0) + .35, 1.6); }));
      g.add(api.tube(path.getPoints(120), .02, 0xffffff, { opacity: .35 }));
      const parcel = new THREE.Mesh(new THREE.SphereGeometry(.28, 24, 16), new THREE.MeshStandardMaterial({ color: 0x9fd0ff, transparent: true, opacity: .9 })); g.add(parcel);
      const cloud = new THREE.Group(); const cm = new THREE.MeshStandardMaterial({ color: 0xe9eef3 });
      for (let i = 0; i < 7; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.35 + Math.random() * .2, 14, 10), cm); s.position.set(-2.2 + i * .35, 3.1 + Math.random() * .3, .9 + Math.random() * .4); cloud.add(s); }
      g.add(cloud);
      const drops = new THREE.InstancedMesh(new THREE.CylinderGeometry(.012, .012, .18, 4), new THREE.MeshBasicMaterial({ color: 0x7fc0ff }), 120); g.add(drops);
      const dd = Array.from({ length: 120 }, () => [-3.6 + Math.random() * 3, Math.random(), .8 + Math.random() * .9]); const m4 = new THREE.Matrix4();
      api.label('Sườn đón gió: mát, mưa', { cls: 'cold', pos: new THREE.Vector3(-4.2, 3.4, 1.6), parent: g });
      api.label('Sườn khuất gió: khô, nóng', { cls: 'warm', pos: new THREE.Vector3(4.2, 3.4, 1.6), parent: g });
      api.label('Đỉnh núi 2 000 m', { cls: 'sm', pos: new THREE.Vector3(0, 4.6, 0), parent: g });
      api.label('Gió ➜', { cls: 'big', pos: new THREE.Vector3(-6.4, 1.2, 1.6), parent: g });
      state.foehnS = 0; state.foehnAuto = true;
      const update = s => {
        const p = path.getPointAt(s); parcel.position.copy(p);
        let h, T; if (s <= .5) { h = 2000 * s / .5; T = 25 - .6 * h / 100; } else { h = 2000 * (1 - (s - .5) / .5); T = 13 + (2000 - h) / 100; }
        const hot = Math.max(0, (T - 13) / 20); parcel.material.color.setRGB(.6 + hot * .4, .8 - hot * .35, 1 - hot * .7);
        if (state.current === 'foehn') api.readout(`<b>Khối khí</b><br>Độ cao: <b>${Math.round(h)} m</b><br>Nhiệt độ: <b>${T.toFixed(1).replace('.', ',')} °C</b><br>${s < .5 ? 'Đi lên sườn đón gió: −0,6 °C/100 m, hơi nước ngưng tụ → mưa' : 'Đi xuống sườn khuất gió: +1 °C/100 m, không khí khô'}`);
        if (s > .97) api.done('foehn');
      };
      state.foehnUpdate = update;
      api.onTick((dt, t) => {
        if (state.current !== 'foehn') return;
        if (state.foehnAuto && !api.paused) state.foehnS = (state.foehnS + dt * .06) % 1;
        update(state.foehnS);
        for (let i = 0; i < dd.length; i++) { dd[i][1] = (dd[i][1] + dt * .9) % 1; const x = dd[i][0]; const top = 3.0, bot = yOf(x) + .05; m4.makeTranslation(x, top - (top - bot) * dd[i][1], dd[i][2]); drops.setMatrixAt(i, m4); }
        drops.instanceMatrix.needsUpdate = true;
      });
    }

    // ===================== ĐIỀU KHIỂN & CHUYỂN CẢNH =====================
    const ctlBox = api.controlsBox;
    const sections = {};
    const sec = name => { const d = document.createElement('div'); ctlBox.append(d); sections[name] = d; return d; };
    // khí áp: bật hoàn lưu thẳng đứng
    api.controlsBox = sec('pressure'); api.heading('Tuỳ chọn');
    api.toggle('cells', 'Hoàn lưu thẳng đứng (3 vòng)', false, v => { cells.visible = v; });
    api.controlsBox = sec('winds'); api.heading('Tuỳ chọn');
    api.toggle('beltsInWinds', 'Hiện các đai khí áp', true, v => { state.beltsInWinds = v; if (state.current === 'globe' && state.overlay === 'winds') overlays.pressure.visible = v; });
    api.toggle('spin', 'Trái Đất tự quay', true, v => { state.globeSpin = v; });
    api.controlsBox = sec('monsoon'); api.heading('Mùa');
    const seen = new Set();
    api.choice('season', '', [{ v: 'summer', t: '☀ Mùa hạ' }, { v: 'winter', t: '❄ Mùa đông' }], 'summer', v => { mSummer.visible = v === 'summer'; mWinter.visible = v === 'winter'; seen.add(v); if (seen.size === 2) api.done('monsoon'); });
    api.controlsBox = sec('coast'); api.heading('Thời điểm');
    api.choice('dn', '', [{ v: 'day', t: '☀ Ban ngày' }, { v: 'night', t: '☾ Ban đêm' }], 'day', v => state.setDayNight(v));
    api.controlsBox = sec('foehn'); api.heading('Khối khí');
    api.toggle('foehnAuto', 'Tự chạy', true, v => { state.foehnAuto = v; });
    api.slider('foehnPos', 'Vị trí khối khí', { min: 0, max: 1, step: .01, value: 0, format: v => v < .5 ? 'sườn đón gió' : v < .52 ? 'đỉnh núi' : 'sườn khuất gió' }, v => { state.foehnS = v; if (state.ready && state.foehnAuto) api.set('foehnAuto', false); state.foehnUpdate?.(v); });
    api.controlsBox = ctlBox;

    state.show = (name, overlay) => {
      state.current = name; state.overlay = overlay;
      for (const [k, g] of Object.entries(groups)) g.visible = k === name;
      for (const [k, o] of Object.entries(overlays)) o.visible = k === overlay;
      overlays.temp.userData.rays.visible = overlay === 'temp';
      for (const [k, g] of Object.entries(statics)) g.visible = k === overlay || (k === 'pressure' && overlay === 'winds' && state.beltsInWinds !== false);
      if (overlay === 'winds') overlays.pressure.visible = state.beltsInWinds !== false;
      if (overlay === 'winds' || overlay === 'pressure') cells.visible = overlay === 'pressure' ? !!api.get('cells') : false;
      if (overlay !== 'monsoon') state.globeSpin = api.get('spin') !== false;
      for (const [k, d] of Object.entries(sections)) d.style.display = (k === overlay || k === name) ? '' : 'none';
      if (name !== 'foehn') api.readout(null);
      const leg = {
        pressure: [{ c: '#ff5a5a', t: 'Đai áp thấp (−)' }, { c: '#4fa3ff', t: 'Đai áp cao (+)' }],
        winds: [{ c: '#ff6a3d', t: 'Gió Mậu dịch' }, { c: '#3ea0ff', t: 'Gió Tây ôn đới' }, { c: '#e8eef5', t: 'Gió Đông cực' }],
        temp: [{ c: '#ff6a3a', t: 'Nóng' }, { c: '#e0d070', t: 'Ấm' }, { c: '#3a7ee0', t: 'Lạnh' }],
        rain: [{ c: '#2869f0', t: 'Mưa nhiều' }, { c: '#f0e1a0', t: 'Mưa ít' }],
        monsoon: [{ c: '#31d07f', t: 'Gió mùa hạ' }, { c: '#8ec5ff', t: 'Gió mùa đông' }],
      }[overlay] || (name === 'layers' ? LAYERS.map(L => ({ c: '#' + L.col.toString(16).padStart(6, '0'), t: L.name })) : null);
      api.legend(leg);
      if (name === 'coast') state.setDayNight(api.get('dn') || 'day');
    };
    state.show('layers'); state.ready = true;
  },
};

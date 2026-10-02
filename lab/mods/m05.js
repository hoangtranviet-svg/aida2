// 3D-05 · Bài 5 – Hệ quả địa lí các chuyển động của Trái Đất
import { THREE, makeGlobe, starfield, latLonToVec3, circleLat, geoCurve } from '../core.js';
import { earthTexture } from '../earth.js';

const TILT = 23.45 * Math.PI / 180;
const OR = 9; // bán kính quỹ đạo (không theo tỉ lệ)
const DATES = [[80, '21 – 3', 'Xuân phân', 'Mặt Trời lên thiên đỉnh ở Xích đạo. Ngày và đêm dài bằng nhau ở mọi nơi.'],
  [173, '22 – 6', 'Hạ chí', 'Mặt Trời lên thiên đỉnh ở chí tuyến Bắc (23°27′B). Bán cầu Bắc ngày dài nhất, đêm ngắn nhất; từ vòng cực Bắc trở lên có ngày dài 24 giờ.'],
  [266, '23 – 9', 'Thu phân', 'Mặt Trời lên thiên đỉnh ở Xích đạo. Ngày và đêm dài bằng nhau ở mọi nơi.'],
  [356, '22 – 12', 'Đông chí', 'Mặt Trời lên thiên đỉnh ở chí tuyến Nam (23°27′N). Bán cầu Bắc ngày ngắn nhất, đêm dài nhất; từ vòng cực Bắc trở lên có đêm dài 24 giờ.']];
const MONTHS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
const doyToDate = d => { d = Math.round(d); let m = 11; while (m > 0 && d <= MONTHS[m]) m--; return `${d - MONTHS[m]}/${m + 1}`; };
const decl = d => 23.45 * Math.sin(2 * Math.PI * (284 + d) / 365);
function dayLength(lat, d) {
  const x = -Math.tan(lat * Math.PI / 180) * Math.tan(decl(d) * Math.PI / 180);
  if (x >= 1) return 0; if (x <= -1) return 24;
  return 2 * Math.acos(x) * 180 / Math.PI / 15;
}
const hm = h => `${Math.floor(h)} giờ ${String(Math.round((h % 1) * 60)).padStart(2, '0')} phút`;

export default {
  id: '3D-05', code: 'DL10.B05', title: 'Hệ quả địa lí các chuyển động của Trái Đất',
  objectives: [
    { c: 'DL10.02.02', t: 'Phân tích hệ quả các chuyển động của Trái Đất' },
    { c: 'DL10.02.03', t: 'Liên hệ thực tế địa phương về mùa, ngày đêm' },
    { c: 'DL10.02.04', t: 'Dùng hình vẽ, lược đồ phân tích hệ quả chuyển động' },
  ],
  sources: [
    { t: 'NASA Space Place – What Causes the Seasons?', u: 'https://spaceplace.nasa.gov/seasons/' },
    { t: 'NOAA SciJinks – What causes the seasons?', u: 'https://scijinks.gov/what-causes-the-seasons/' },
    { t: 'NOAA Global Monitoring Lab – Solar position calculations', u: 'https://gml.noaa.gov/grad/solcalc/' , n: 'công thức độ dài ngày theo vĩ độ' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 5 (Hình 5.1 – 5.4)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Khoảng cách và kích thước Mặt Trời – Trái Đất không theo tỉ lệ. Độ dài ngày tính bằng công thức thiên văn gần đúng (bỏ qua khúc xạ khí quyển).',
  view: { pos: [0, 9, 20], target: [0, 0, 0] },
  steps: [
    { title: 'Trái Đất quay quanh Mặt Trời', html: '<p>Trái Đất chuyển động quanh Mặt Trời theo hướng <b>từ tây sang đông</b>, hết <b>365 ngày 6 giờ</b>. Trục Trái Đất luôn <b>nghiêng 66°33′</b> so với mặt phẳng quỹ đạo và <b>không đổi hướng</b> trong không gian.</p><div class="tip">Kéo thanh “Ngày trong năm” hoặc bấm vào 4 mốc ngày trên quỹ đạo.</div>',
      enter: a => { a.state.mode('orbit'); a.fly([0, 9, 20], [0, 0, 0]); } },
    { title: 'Các mùa trong năm', html: '<p>Vì trục nghiêng và không đổi hướng, mỗi bán cầu lần lượt <b>ngả về phía Mặt Trời</b> rồi chếch xa Mặt Trời → góc chiếu sáng và thời gian chiếu sáng thay đổi → sinh ra <b>các mùa</b>.</p><p>Ở bán cầu Bắc: mùa xuân (21-3 → 22-6), mùa hạ (22-6 → 23-9), mùa thu (23-9 → 22-12), mùa đông (22-12 → 21-3). Bán cầu Nam có mùa ngược lại.</p>',
      enter: a => { a.state.mode('orbit'); a.fly([2, 16, 14], [0, 0, 0]); } },
    { title: 'Ngày đêm dài ngắn theo mùa và vĩ độ', html: '<p>Đường phân chia sáng – tối không đi qua hai cực (trừ ngày 21-3 và 23-9) nên các vĩ tuyến bị chia thành hai phần không bằng nhau → <b>ngày đêm dài ngắn khác nhau</b>.</p><ul><li>Xích đạo: ngày = đêm quanh năm.</li><li>Càng xa Xích đạo, chênh lệch càng lớn.</li><li>Ở hai cực: 6 tháng ngày, 6 tháng đêm.</li></ul><div class="tip">Chọn vĩ độ và ngày, đọc bảng số liệu ở góc phải.</div>',
      enter: a => { a.state.mode('close'); } },
    { title: 'Sự luân phiên ngày đêm', html: '<p>Trái Đất hình khối cầu nên luôn có một nửa được chiếu sáng (ngày), một nửa không được chiếu sáng (đêm). Nhờ <b>chuyển động tự quay</b> từ tây sang đông (một vòng hết 24 giờ), mọi nơi lần lượt có ngày và đêm luân phiên.</p>',
      enter: a => { a.state.mode('close'); a.set('spinOn', true); } },
    { title: 'Giờ trên Trái Đất', html: '<p>Bề mặt Trái Đất chia thành <b>24 múi giờ</b>, mỗi múi rộng 15° kinh tuyến. Giờ ở múi số 0 (có kinh tuyến gốc đi qua Grin-uých) là <b>giờ GMT</b>. Việt Nam thuộc <b>múi giờ số 7</b>.</p><p>Kinh tuyến 180° là <b>đường chuyển ngày quốc tế</b>.</p><div class="tip">Kéo “Giờ GMT” để xem giờ ở Hà Nội và các thành phố khác.</div>',
      enter: a => { a.state.mode('zones'); } },
    { title: 'Sự lệch hướng chuyển động', html: '<p>Do Trái Đất tự quay, các vật chuyển động trên bề mặt (gió, dòng biển, đường đạn…) bị <b>lệch hướng</b>: <b>sang phải</b> ở bán cầu Bắc và <b>sang trái</b> ở bán cầu Nam (nếu nhìn theo hướng chuyển động).</p>',
      enter: a => { a.state.mode('coriolis'); } },
  ],
  tasks: [
    { id: 'solstice', text: 'Kéo đến ngày <b>Hạ chí (22-6)</b> và quan sát bán cầu nào ngả về phía Mặt Trời.' },
    { id: 'equinox', text: 'Tìm một ngày mà <b>mọi nơi có ngày = đêm</b>.', hint: 'Bấm vào các mốc trên quỹ đạo' },
    { id: 'polar', text: 'Tìm ngày và vĩ độ có <b>đêm dài 24 giờ</b> ở bán cầu Bắc.', hint: 'Bước 3: vĩ độ trên 66°33′B' },
    { id: 'hanoi7', text: 'Đặt giờ GMT sao cho ở <b>Hà Nội là 7 giờ sáng</b>.', hint: 'Bước 5: Việt Nam ở múi giờ số 7' },
    { id: 'coriolis', text: 'Bấm vào mũi tên chuyển động ở <b>bán cầu Nam</b> để xem nó lệch sang phía nào.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    starfield(scene);
    const tex = await earthTexture({ mode: 'natural' });
    // Mặt Trời
    const sun = new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 32), new THREE.MeshBasicMaterial({ color: 0xffc94a }));
    scene.add(sun);
    const glow = api.glow('#ffb43c', 7); scene.add(glow);
    scene.children.filter(o => o.isAmbientLight).forEach(o => (o.intensity = .12));
    scene.add(new THREE.PointLight(0xffffff, 300, 0, 2));
    api.label('Mặt Trời', { pos: new THREE.Vector3(0, 2.4, 0) });
    // quỹ đạo
    const orbitPts = []; for (let i = 0; i <= 200; i++) { const t = i / 200 * Math.PI * 2; orbitPts.push(new THREE.Vector3(OR * Math.cos(t), 0, -OR * Math.sin(t))); }
    const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(orbitPts), new THREE.LineBasicMaterial({ color: 0x8fb4d8, transparent: true, opacity: .6 }));
    scene.add(orbit);
    const posOf = d => { const th = 2 * Math.PI * (d - 173) / 365.25; return new THREE.Vector3(OR * Math.cos(th), 0, -OR * Math.sin(th)); };
    // mốc ngày
    const markers = new THREE.Group(); scene.add(markers);
    DATES.forEach(([d, t, n, h]) => {
      const p = posOf(d); const m = new THREE.Mesh(new THREE.SphereGeometry(.18, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd29e })); m.position.copy(p); markers.add(m);
      const info = { title: `Ngày ${t} – ${n}`, html: h, id: 'date' + d, onPick: () => api.set('doy', d) };
      api.hotspot(m, info);
      api.label(`${t}<br><small>${n}</small>`, { pos: p.clone().multiplyScalar(1.22).setY(.6), parent: markers, onClick: info });
    });
    [['Mùa xuân', 126], ['Mùa hạ', 220], ['Mùa thu', 311], ['Mùa đông', 35]].forEach(([n, d]) => api.label(n + ' (BCB)', { cls: 'sm plain', pos: posOf(d).multiplyScalar(.82).setY(.2), parent: markers }));
    // Trái Đất
    const earthPos = new THREE.Group(); scene.add(earthPos);
    const tilt = new THREE.Group(); tilt.rotation.z = TILT; earthPos.add(tilt);
    const gc = { center: new THREE.Vector3(), radius: 1 }; // tâm Trái Đất để ẩn nhãn ở mặt khuất (cập nhật khi Trái Đất di chuyển)
    const globe = makeGlobe(api, { radius: 1, texture: tex, lines: [0, 23.45, -23.45, 66.55, -66.55], gc }); tilt.add(globe);
    const axis = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, 3.2, 8), new THREE.MeshBasicMaterial({ color: 0xffffff })); tilt.add(axis);
    api.label('Cực Bắc', { cls: 'sm', pos: new THREE.Vector3(0, 1.75, 0), parent: tilt });
    // vòng vĩ độ đang chọn
    let latRing = null; const latMat = new THREE.LineBasicMaterial({ color: 0xff4d6d });
    const setLatRing = lat => { if (latRing) globe.remove(latRing); latRing = circleLat(lat, 1.012, latMat); globe.add(latRing); };
    // điểm Mặt Trời lên thiên đỉnh
    const sub = new THREE.Mesh(new THREE.SphereGeometry(.06, 12, 8), new THREE.MeshBasicMaterial({ color: 0xffe14a })); earthPos.add(sub);
    // múi giờ
    const zones = new THREE.Group(); globe.add(zones);
    for (let z = 0; z < 24; z++) {
      const lon0 = -7.5 + z * 15; const g = new THREE.SphereGeometry(1.006, 6, 32, (lon0 + 180) * Math.PI / 180, 15 * Math.PI / 180, 0, Math.PI);
      zones.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: z % 2 ? 0x6fb1ff : 0xffd166, transparent: true, opacity: .16, depthWrite: false })));
    }
    const idl = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 65 }, (_, i) => latLonToVec3(90 - i * 180 / 64, 180, 1.01))), new THREE.LineBasicMaterial({ color: 0xff5050 }));
    zones.add(idl);
    const gw = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 65 }, (_, i) => latLonToVec3(90 - i * 180 / 64, 0, 1.01))), new THREE.LineBasicMaterial({ color: 0xffffff }));
    zones.add(gw);
    const CITY = [['Hà Nội', 21.03, 105.85, 7], ['Luân Đôn', 51.5, -0.13, 0], ['Tô-ki-ô', 35.7, 139.7, 9], ['Niu Oóc', 40.7, -74, -5], ['Mát-xcơ-va', 55.75, 37.6, 3]];
    const cityLabels = CITY.map(([n, la, lo]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(.025, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3355 })); m.position.copy(latLonToVec3(la, lo, 1.01)); zones.add(m); return api.label(n, { cls: 'sm', pos: latLonToVec3(la, lo, 1.08), parent: zones, globe: gc }); });
    api.label('Đường chuyển ngày quốc tế (180°)', { cls: 'sm warm', pos: latLonToVec3(10, 180, 1.12), parent: zones, globe: gc });
    api.label('Kinh tuyến gốc (Grin-uých)', { cls: 'sm', pos: latLonToVec3(30, 0, 1.12), parent: zones, globe: gc });
    // lệch hướng
    const cor = new THREE.Group(); globe.add(cor);
    const corPaths = [{ s: 1, pts: [[60, -40], [45, -36], [30, -40], [18, -48]], txt: 'BCB: lệch sang phải' }, { s: -1, pts: [[-60, -40], [-45, -36], [-30, -40], [-18, -48]], txt: 'BCN: lệch sang trái' }];
    const straight = [[[60, -40], [18, -40]], [[-60, -40], [-18, -40]]];
    corPaths.forEach((c, i) => {
      const cv = geoCurve(c.pts, 1.03); const tube = api.tube(cv.getPoints(60), .018, c.s > 0 ? 0xffb347 : 0x7fd1ff); cor.add(tube);
      api.flowAlong(cv, { count: 8, color: 0xffffff, size: .03, speed: .15, parent: cor });
      const sv = geoCurve(straight[i], 1.025); cor.add(api.tube(sv.getPoints(40), .006, 0xffffff, { opacity: .45 }));
      const info = { title: c.s > 0 ? 'Bán cầu Bắc' : 'Bán cầu Nam', html: c.s > 0 ? 'Vật chuyển động từ cực về Xích đạo bị lệch sang <b>phải</b> (lệch về phía tây). Đường trắng mờ là hướng ban đầu.' : 'Vật chuyển động từ cực về Xích đạo bị lệch sang <b>trái</b> (lệch về phía tây). Đường trắng mờ là hướng ban đầu.', id: 'cor' + c.s, onPick: () => { if (c.s < 0) api.done('coriolis'); } };
      api.hotspot(tube, info);
      api.label(c.txt, { cls: c.s > 0 ? 'warm' : 'cold', pos: latLonToVec3(c.s * 40, -60, 1.15), parent: cor, globe: gc, onClick: info });
    });

    // ---------- trạng thái ----------
    state.doy = 173; state.lat = 21; state.gmt = 0; state.spin = false; state.m = 'orbit';
    const prevEarth = new THREE.Vector3();
    const place = () => {
      const p = posOf(state.doy); earthPos.position.copy(p);
      // điểm Mặt Trời lên thiên đỉnh nằm trên đường nối tâm Trái Đất – Mặt Trời
      sub.position.copy(p.clone().negate().normalize().multiplyScalar(1.02));
      if (state.m !== 'orbit') {
        const d = p.clone().sub(prevEarth); api.camera.position.add(d); api.controls.target.add(d);
      }
      prevEarth.copy(p); gc.center.copy(p);
      const dl = dayLength(state.lat, state.doy), dc = decl(state.doy);
      const date = doyToDate(state.doy);
      if (state.m === 'orbit') api.readout(`<b>Ngày ${date}</b><br>Mặt Trời lên thiên đỉnh ở vĩ độ <b>${Math.abs(dc).toFixed(1).replace('.', ',')}°${dc >= 0 ? 'B' : 'N'}</b><br>Bán cầu Bắc: <b>${dc > 1 ? 'ngả về phía Mặt Trời' : dc < -1 ? 'chếch xa Mặt Trời' : 'nhận ánh sáng như bán cầu Nam'}</b>`);
      else if (state.m === 'close') api.readout(`<b>Ngày ${date} · vĩ độ ${Math.abs(state.lat)}°${state.lat >= 0 ? 'B' : 'N'}</b><br>Ngày dài: <b>${dl <= 0 ? '0 giờ (đêm địa cực)' : dl >= 24 ? '24 giờ (ngày địa cực)' : hm(dl)}</b><br>Đêm dài: <b>${dl >= 24 ? '0 giờ' : dl <= 0 ? '24 giờ' : hm(24 - dl)}</b>`);
      if (Math.abs(state.doy - 173) <= 1) api.done('solstice');
      if (Math.abs(state.doy - 80) <= 1 || Math.abs(state.doy - 266) <= 1) api.done('equinox');
      if (state.m === 'close' && state.lat > 0 && dl <= 0) api.done('polar');
    };
    state.place = place;
    // quay Trái Đất để kinh tuyến L hướng thẳng về Mặt Trời (tính trong khung trục nghiêng)
    const faceLon = L => {
      const local = earthPos.position.clone().negate().normalize().applyAxisAngle(new THREE.Vector3(0, 0, 1), -TILT);
      globe.rotation.y = Math.atan2(-local.z, local.x) - L * Math.PI / 180;
    };
    const setTime = () => {
      // kinh độ có giờ trưa (Mặt Trời ở phía trên kinh tuyến) = (12 − GMT) × 15
      const noonLon = (12 - state.gmt) * 15;
      faceLon(noonLon);
      const hn = ((state.gmt + 7) % 24 + 24) % 24;
      api.readout(`<b>Giờ GMT: ${String(state.gmt).padStart(2, '0')}:00</b><br>${CITY.map(([n, , , z]) => `${n}: <b>${String(((state.gmt + z) % 24 + 24) % 24).padStart(2, '0')}:00</b>`).join('<br>')}`);
      if (hn === 7) api.done('hanoi7');
    };
    state.setTime = setTime;
    api.onTick(dt => {
      if (state.spin && state.m !== 'zones') globe.rotation.y += dt * .8;
      if (state.orbitRun && state.m === 'orbit') { state.doy = (state.doy + dt * 12) % 365 || 1; if (sDoy) sDoy.input.value = Math.round(state.doy); place(); }
      glow.scale.setScalar(1 + .05 * Math.sin(performance.now() / 400));
    });
    state.mode = m => {
      state.m = m;
      markers.visible = orbit.visible = m === 'orbit';
      (globe.userData.lineLabels || []).forEach(l => (l.visible = m !== 'orbit'));
      zones.visible = m === 'zones'; cor.visible = m === 'coriolis';
      if (latRing) latRing.visible = m === 'close';
      ctl.lat.style.display = m === 'close' ? '' : 'none'; ctl.gmt.style.display = m === 'zones' ? '' : 'none';
      ctl.doy.style.display = (m === 'orbit' || m === 'close') ? '' : 'none';
      api.legend(m === 'zones' ? [{ c: '#ffd166', t: 'Múi giờ chẵn' }, { c: '#6fb1ff', t: 'Múi giờ lẻ' }, { c: '#ff5050', t: 'Đường chuyển ngày' }] : null);
      prevEarth.copy(earthPos.position);
      if (m !== 'orbit') {
        const p = earthPos.position; const toSun = p.clone().negate().normalize();
        const side = new THREE.Vector3(0, 1, 0).cross(toSun).normalize();
        const camPos = m === 'close' ? p.clone().add(side.multiplyScalar(4.2)).add(new THREE.Vector3(0, .6, 0)) : m === 'coriolis' ? p.clone().add(toSun.clone().multiplyScalar(4.4)) : p.clone().add(toSun.clone().multiplyScalar(3.2)).add(side.multiplyScalar(1.2)).add(new THREE.Vector3(0, 1, 0));
        api.fly(camPos, p.clone(), 1300);
      }
      if (m === 'zones') { state.spin = false; setTime(); } else place();
      if (m === 'coriolis') { state.spin = false; faceLon(-40); }
    };

    // ---------- điều khiển ----------
    const ctl = {}; let sDoy = null;
    const wrap = name => { const d = document.createElement('div'); api.controlsBox.append(d); ctl[name] = d; const prev = api.controlsBox; return () => { api.controlsBox = d; return prev; }; };
    let restore = wrap('doy')(); api.heading('Thời gian');
    sDoy = api.slider('doy', 'Ngày trong năm', { min: 1, max: 365, step: 1, value: 173, format: v => doyToDate(v) }, v => { state.doy = v; if (state.m === 'zones' || state.m === 'coriolis') return; place(); });
    api.toggle('orbitRun', 'Tự chạy theo quỹ đạo', false, v => { state.orbitRun = v; });
    api.toggle('spinOn', 'Trái Đất tự quay', false, v => { state.spin = v; });
    api.controlsBox = restore;
    restore = wrap('lat')(); api.heading('Vĩ độ quan sát');
    api.slider('lat', 'Vĩ độ', { min: -90, max: 90, step: 1, value: 21, format: v => v === 21 ? '21°B (Hà Nội)' : `${Math.abs(v)}°${v >= 0 ? 'B' : 'N'}` }, v => { state.lat = v; setLatRing(v); place(); });
    api.controlsBox = restore;
    restore = wrap('gmt')(); api.heading('Giờ');
    api.slider('gmt', 'Giờ GMT', { min: 0, max: 23, step: 1, value: 0, format: v => `${v}:00` }, v => { state.gmt = v; if (state.m === 'zones') setTime(); });
    api.controlsBox = restore;
    place();
  },
};

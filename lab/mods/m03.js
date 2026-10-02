// 3D-03 · Bài 3 – Sử dụng bản đồ trong học tập và đời sống, một số ứng dụng của GPS và bản đồ số
import { THREE, makeGlobe, latLonToVec3, starfield } from '../core.js';
import { earthTexture } from '../earth.js';

const SR = 4.17; // bán kính quỹ đạo GPS ≈ (6 371 + 20 200) / 6 371 bán kính Trái Đất
export default {
  id: '3D-03', code: 'DL10.B03', title: 'GPS và bản đồ số',
  objectives: [{ c: 'DL10.01.02', t: 'Sử dụng bản đồ trong học tập và đời sống' }, { c: 'DL10.01.03', t: 'Một số ứng dụng của GPS và bản đồ số' }],
  sources: [
    { t: 'GPS.gov – Space Segment (chòm vệ tinh GPS)', u: 'https://www.gps.gov/space-segment' },
    { t: 'FAA – Satellite Navigation: GPS – How It Works', u: 'https://www.faa.gov/about/office_org/headquarters_offices/ato/service_units/techops/navservices/gnss/gps/howitworks' },
    { t: 'GPS.gov – Activity: How to find a position using GPS', u: 'https://www.gps.gov/sites/default/files/2025-07/NSTA_GPS_Positioning_Exercise_Instructions.pdf' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 3 (Hình 3.1, 3.2)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Mô hình gồm 24 vệ tinh trên 6 mặt phẳng quỹ đạo nghiêng 55° (cấu hình cơ bản của GPS); thực tế đang có khoảng 30 vệ tinh hoạt động. Khoảng cách theo tỉ lệ, kích thước vệ tinh phóng to.',
  view: { pos: [0, 4, 13], target: [0, 0, 0] },
  steps: [
    { title: 'GPS là gì?', html: '<p><b>GPS</b> (Global Positioning System – hệ thống định vị toàn cầu) gồm 3 bộ phận:</p><ul><li><b>Các vệ tinh</b> bay quanh Trái Đất ở độ cao khoảng <b>20 200 km</b>, mỗi vòng khoảng 12 giờ.</li><li><b>Các trạm điều khiển</b> trên mặt đất.</li><li><b>Thiết bị thu</b> (điện thoại, máy định vị…).</li></ul><p>Ở bất kì nơi nào, thiết bị thu luôn “nhìn thấy” ít nhất 4 vệ tinh.</p>',
      enter: a => { a.state.mode('const'); a.fly([0, 4, 13], [0, 0, 0]); } },
    { title: 'Xác định vị trí như thế nào?', html: '<p>Mỗi vệ tinh liên tục phát tín hiệu kèm thời điểm phát. Thiết bị thu đo <b>thời gian tín hiệu đi tới</b> → tính được <b>khoảng cách</b> tới vệ tinh. Vị trí của em nằm trên mặt cầu tâm là vệ tinh, bán kính là khoảng cách đó.</p><ul><li>1 vệ tinh: vô số vị trí (cả mặt cầu).</li><li>2 vệ tinh: một đường tròn.</li><li>3 vệ tinh: 2 điểm (loại 1 điểm ở ngoài vũ trụ).</li><li>4 vệ tinh: 1 điểm chính xác, đồng thời hiệu chỉnh sai số đồng hồ.</li></ul><div class="tip">Tăng dần “Số vệ tinh dùng để định vị”.</div>',
      enter: a => { a.state.mode('tri'); a.fly([3, 9, 17], [0, .5, 0]); } },
    { title: 'Ứng dụng GPS và bản đồ số', html: '<p><b>Bản đồ số</b> là bản đồ lưu trữ dưới dạng số, hiển thị trên máy tính, điện thoại; kết hợp với GPS cho phép:</p><ul><li>Xác định vị trí, tìm đường đi, ước tính thời gian di chuyển.</li><li>Theo dõi vị trí phương tiện (xe buýt, gọi xe, giao hàng), quản lí giao thông.</li><li>Theo dõi đường đi của bão, cứu hộ, cứu nạn; đo đạc, quy hoạch, nông nghiệp chính xác…</li></ul><div class="tip">Bấm vào điểm thu tín hiệu (Hà Nội) để đọc toạ độ.</div>',
      enter: a => { a.state.mode('const'); a.fly([3.5, 3.6, 4.6], [.3, .5, 0]); } },
  ],
  tasks: [
    { id: 'vis', text: 'Quan sát ít nhất 10 giây: số vệ tinh máy thu nhận được tín hiệu có lúc nào <b>dưới 4</b> không?' },
    { id: 'two', text: 'Chọn <b>2 vệ tinh</b> và quan sát: vị trí có thể nằm trên hình gì?' },
    { id: 'four', text: 'Chọn <b>4 vệ tinh</b> để xác định chính xác vị trí.' },
    { id: 'coord', text: 'Bấm vào máy thu ở Hà Nội để đọc <b>toạ độ</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    starfield(scene);
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(5, 6, 9); scene.add(key);
    const tex = await earthTexture({ mode: 'natural' });
    const globe = makeGlobe(api, { radius: 1, texture: tex }); scene.add(globe);
    globe.rotation.y = -Math.PI / 2 - 105.85 * Math.PI / 180 + .5;
    // máy thu
    const rx = new THREE.Mesh(new THREE.SphereGeometry(.04, 16, 12), new THREE.MeshBasicMaterial({ color: 0xff2d55 })); rx.position.copy(latLonToVec3(21.03, 105.85, 1.01)); globe.add(rx);
    const rxInfo = { title: 'Máy thu GPS ở Hà Nội', html: 'Toạ độ: <b>21°02′B, 105°51′Đ</b><br>Điện thoại hiển thị vị trí này trên bản đồ số với sai số chỉ vài mét.', id: 'rx', onPick: () => api.done('coord') };
    api.hotspot(rx, rxInfo); api.label('Hà Nội (máy thu)', { cls: 'warm sm', pos: latLonToVec3(21.03, 105.85, 1.14), parent: globe, onClick: rxInfo });
    // vệ tinh: 6 mặt phẳng × 4
    const sats = []; const satGeo = new THREE.BoxGeometry(.09, .09, .09); const panelGeo = new THREE.BoxGeometry(.32, .01, .07);
    const orbits = new THREE.Group(); scene.add(orbits);
    for (let p = 0; p < 6; p++) {
      const raan = p * Math.PI / 3; const inc = 55 * Math.PI / 180;
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(inc, raan, 0, 'YXZ'));
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, i) => new THREE.Vector3(Math.cos(i / 128 * Math.PI * 2) * SR, 0, Math.sin(i / 128 * Math.PI * 2) * SR).applyQuaternion(q))), new THREE.LineBasicMaterial({ color: 0x5a7da0, transparent: true, opacity: .35 }));
      orbits.add(ring);
      for (let k = 0; k < 4; k++) {
        const s = new THREE.Group(); s.add(new THREE.Mesh(satGeo, new THREE.MeshStandardMaterial({ color: 0xd8c27a, metalness: .6, roughness: .3 })));
        s.add(new THREE.Mesh(panelGeo, new THREE.MeshStandardMaterial({ color: 0x2b4f9e, metalness: .3 }))); scene.add(s);
        sats.push({ s, q, ph: k * Math.PI / 2 + p * .5 });
      }
    }
    const lines = new THREE.Group(); scene.add(lines);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x7dffb0, transparent: true, opacity: .8 });
    // mặt cầu khoảng cách (định vị)
    const triG = new THREE.Group(); scene.add(triG);
    const sphMat = [0xffb347, 0x7fd1ff, 0xff7aa8, 0xb0ff7a].map(c => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .08, depthWrite: false, side: THREE.DoubleSide }));
    const sphWire = [0xffb347, 0x7fd1ff, 0xff7aa8, 0xb0ff7a].map(c => new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: .06 }));
    const spheres = [0, 1, 2, 3].map(i => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), sphMat[i]), new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), sphWire[i])); triG.add(g); return g; });
    const circle = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffffff })); triG.add(circle);
    const ghost = new THREE.Mesh(new THREE.SphereGeometry(.07, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff })); triG.add(ghost);
    const fix = new THREE.Mesh(new THREE.RingGeometry(.08, .12, 32), new THREE.MeshBasicMaterial({ color: 0xff2d55, side: THREE.DoubleSide })); triG.add(fix);
    state.n = 1; state.t = 0; state.m = 'const';
    const rxW = new THREE.Vector3(); const nrm = new THREE.Vector3();
    api.onTick(dt => {
      state.t += dt * (state.m === 'tri' ? .02 : .08);
      sats.forEach(o => { const a = o.ph + state.t; o.s.position.set(Math.cos(a) * SR, 0, Math.sin(a) * SR).applyQuaternion(o.q); o.s.lookAt(0, 0, 0); });
      rx.getWorldPosition(rxW); nrm.copy(rxW).normalize();
      const vis = sats.filter(o => o.s.position.clone().sub(rxW).dot(nrm) > 0).sort((a, b) => a.s.position.distanceTo(rxW) - b.s.position.distanceTo(rxW));
      lines.children.forEach(l => l.geometry.dispose()); lines.clear();
      if (state.m === 'const') vis.forEach(o => lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([rxW, o.s.position]), lineMat)));
      sats.forEach(o => o.s.scale.setScalar(vis.includes(o) ? 1.25 : .85));
      if (state.m === 'const') { api.readout(`<b>Máy thu ở Hà Nội</b><br>Đang nhận tín hiệu từ <b>${vis.length}</b> vệ tinh (đường xanh)`); state.watch = (state.watch || 0) + dt; if (state.watch > 10) api.done('vis'); }
      // định vị
      const use = vis.slice(0, state.n);
      spheres.forEach((g, i) => { g.visible = state.m === 'tri' && i < use.length; if (g.visible) { g.position.copy(use[i].s.position); g.scale.setScalar(use[i].s.position.distanceTo(rxW)); } });
      circle.visible = ghost.visible = fix.visible = false;
      if (state.m === 'tri') {
        use.forEach(o => lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([rxW, o.s.position]), lineMat)));
        if (use.length === 2) { // đường tròn giao của 2 mặt cầu: tâm trên đoạn nối 2 vệ tinh, đi qua máy thu
          const A = use[0].s.position, B = use[1].s.position; const ab = B.clone().sub(A).normalize();
          const c = A.clone().add(ab.clone().multiplyScalar(rxW.clone().sub(A).dot(ab))); const r = rxW.distanceTo(c);
          const u = rxW.clone().sub(c).normalize(), v = ab.clone().cross(u);
          circle.geometry.setFromPoints(Array.from({ length: 97 }, (_, i) => { const t = i / 96 * Math.PI * 2; return c.clone().add(u.clone().multiplyScalar(Math.cos(t) * r)).add(v.clone().multiplyScalar(Math.sin(t) * r)); }));
          circle.visible = true;
        }
        if (use.length === 3) { // điểm thứ hai: đối xứng của máy thu qua mặt phẳng chứa 3 vệ tinh
          const [A, B, C] = use.map(o => o.s.position); const n = B.clone().sub(A).cross(C.clone().sub(A)).normalize();
          const d = rxW.clone().sub(A).dot(n); ghost.position.copy(rxW.clone().sub(n.multiplyScalar(2 * d))); ghost.visible = true;
        }
        if (use.length >= 3) { fix.position.copy(rxW).add(nrm.clone().multiplyScalar(.01)); fix.lookAt(rxW.clone().add(nrm)); fix.visible = use.length === 4; }
        const txt = ['', 'Vị trí có thể là <b>bất kì điểm nào trên mặt cầu</b>.', 'Vị trí nằm trên <b>đường tròn</b> (giao của 2 mặt cầu – đường trắng).', 'Còn <b>2 điểm</b>: một điểm trên mặt đất, một điểm trắng ở ngoài không gian (loại).', '<b>Xác định được 1 điểm duy nhất</b> và hiệu chỉnh sai số thời gian → vị trí chính xác.'][use.length];
        api.readout(`<b>Dùng ${use.length} vệ tinh</b><br>${txt}`);
      }
    });
    state.mode = m => { state.m = m; orbits.visible = true; triG.visible = m === 'tri'; cT.style.display = m === 'tri' ? '' : 'none'; api.legend(m === 'tri' ? [{ c: '#ffb347', t: 'Mặt cầu vệ tinh 1' }, { c: '#7fd1ff', t: 'Mặt cầu vệ tinh 2' }, { c: '#ff7aa8', t: 'Mặt cầu vệ tinh 3' }, { c: '#b0ff7a', t: 'Mặt cầu vệ tinh 4' }] : null); };
    const base = api.controlsBox; const cT = document.createElement('div'); base.append(cT); api.controlsBox = cT; api.heading('Định vị');
    api.choice('n', 'Số vệ tinh dùng để định vị', [1, 2, 3, 4].map(v => ({ v: String(v), t: `${v} vệ tinh` })), '1', v => { state.n = +v; if (+v === 2) api.done('two'); if (+v === 4) api.done('four'); });
    api.controlsBox = base;
  },
};

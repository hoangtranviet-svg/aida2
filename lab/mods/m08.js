// 3D-08 · Bài 8 – Thực hành: Sự phân bố các vành đai động đất, núi lửa
import { THREE, makeGlobe, geoCurve, latLonToVec3, starfield } from '../core.js';
import { earthTexture } from '../earth.js';
import { BOUNDARIES, PLATES, VOLCANOES, QUAKES } from '../geo.js';

const GR = 2;
export default {
  id: '3D-08', code: 'DL10.B08', title: 'Sự phân bố các vành đai động đất, núi lửa',
  objectives: [
    { c: 'DL10.03.05', t: 'Nhận xét, giải thích sự phân bố vành đai động đất, núi lửa' },
    { c: 'DL10.03.02', t: 'Vận dụng thuyết kiến tạo mảng để giải thích' },
  ],
  sources: [
    { t: 'USGS Earthquake Hazards Program – Significant earthquakes', u: 'https://earthquake.usgs.gov/earthquakes/browse/significant.php' },
    { t: 'Smithsonian Institution – Global Volcanism Program', u: 'https://volcano.si.edu/' },
    { t: 'USGS – This Dynamic Earth', u: 'https://pubs.usgs.gov/gip/dynamic/dynamic.html' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 8 (Hình 8)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Các chấm động đất được rải dọc ranh giới mảng để minh hoạ mức độ tập trung, không phải số liệu từng trận. Vị trí núi lửa và các trận động đất lớn lấy theo USGS, Smithsonian.',
  view: { pos: [0, 1.5, 6.8], target: [0, 0, 0] },
  steps: [
    { title: 'Quan sát toàn cầu', html: '<p>Bật/tắt các lớp: <b>núi lửa</b> (tam giác đỏ), <b>động đất</b> (chấm vàng nhấp nháy) và <b>ranh giới mảng</b>. Hãy nhận xét: động đất, núi lửa phân bố đều khắp hay tập trung thành dải?</p>',
      enter: a => { a.state.focus(null); a.fly([0, 1.5, 6.8], [0, 0, 0]); } },
    { title: 'Vành đai lửa Thái Bình Dương', html: '<p>Vành đai chạy vòng quanh Thái Bình Dương: bờ tây châu Mỹ, A-lê-út, Cam-sát-ca, Nhật Bản, Phi-líp-pin, In-đô-nê-xi-a, Niu Di-lân. Tập trung khoảng <b>3/4 số núi lửa đang hoạt động</b> và phần lớn các trận động đất mạnh.</p><p><b>Giải thích</b>: đây là nơi mảng Thái Bình Dương và các mảng nhỏ ven nó <b>bị hút chìm</b> dưới các mảng xung quanh.</p>',
      enter: a => { a.state.focus('tbd'); a.state.faceLon(170); a.fly([0, 1.2, 6.2], [0, 0, 0]); } },
    { title: 'Vành đai Địa Trung Hải – Hi-ma-lay-a', html: '<p>Dải động đất, núi lửa kéo dài từ Địa Trung Hải qua Thổ Nhĩ Kỳ, I-ran tới dãy Hi-ma-lay-a và In-đô-nê-xi-a.</p><p><b>Giải thích</b>: mảng Phi và mảng Ấn Độ – Ô-xtrây-li-a <b>xô vào</b> mảng Âu – Á.</p>',
      enter: a => { a.state.focus('dth'); a.state.faceLon(55); a.fly([0, 2.2, 6.2], [0, .4, 0]); } },
    { title: 'Dọc các sống núi giữa đại dương', html: '<p>Ở nơi các mảng <b>tách giãn</b> (sống núi giữa Đại Tây Dương, Ấn Độ Dương…) cũng có động đất (thường nông, yếu hơn) và núi lửa, ví dụ đảo Ai-xơ-len.</p>',
      enter: a => { a.state.focus('tach'); a.state.faceLon(-30); a.fly([0, 1.5, 6.5], [0, 0, 0]); } },
    { title: 'Những trận động đất lớn', html: '<p>Bấm vào các vòng tròn đỏ lớn để xem một số trận động đất mạnh trong lịch sử. Hầu hết đều nằm ở <b>ranh giới hội tụ</b> của các mảng.</p>',
      enter: a => { a.state.focus('quake'); a.state.faceLon(120); a.fly([0, 1.5, 6.5], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'v3', text: 'Bấm vào <b>3 núi lửa</b> thuộc Vành đai lửa Thái Bình Dương.' },
    { id: 'fuji', text: 'Tìm núi lửa <b>Phú Sĩ</b> (Nhật Bản).' },
    { id: 'q2004', text: 'Tìm trận động đất – sóng thần <b>Ấn Độ Dương 2004</b>.' },
    { id: 'iceland', text: 'Tìm một núi lửa nằm trên <b>sống núi giữa Đại Tây Dương</b>.', hint: 'Ai-xơ-len' },
  ],

  async setup(api) {
    const { scene, state } = api;
    starfield(scene);
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 10); scene.add(key);
    const tex = await earthTexture({ mode: 'natural' });
    const globe = makeGlobe(api, { radius: GR, texture: tex }); scene.add(globe);
    const gc = { center: new THREE.Vector3(), radius: GR };
    // ranh giới
    const bGroup = new THREE.Group(); globe.add(bGroup);
    const bt = { tach: [], tu: [], truot: [] };
    BOUNDARIES.forEach(b => { const c = geoCurve(b.pts, GR * 1.006); const m = api.tube(c.getPoints(b.pts.length * 10), .01, b.type === 'tach' ? 0x3fc1ff : b.type === 'tu' ? 0xff5a4a : 0xffd23f, { opacity: .8 }); bGroup.add(m); bt[b.type].push({ b, c, m }); });
    const pl = PLATES.map(([n, la, lo]) => api.label(n, { cls: 'sm plain', pos: latLonToVec3(la, lo, GR * 1.02), parent: bGroup, globe: gc }));
    // động đất minh hoạ: rải điểm dọc ranh giới (hội tụ dày hơn)
    const qGroup = new THREE.Group(); globe.add(qGroup);
    const qPts = [];
    bt.tu.forEach(({ c }) => { for (let i = 0; i < 70; i++) qPts.push({ p: c.getPointAt(Math.random()).normalize().multiplyScalar(GR * 1.01).add(new THREE.Vector3().randomDirection().multiplyScalar(.04)), s: Math.random() }); });
    bt.tach.forEach(({ c }) => { for (let i = 0; i < 25; i++) qPts.push({ p: c.getPointAt(Math.random()).normalize().multiplyScalar(GR * 1.01), s: Math.random() }); });
    bt.truot.forEach(({ c }) => { for (let i = 0; i < 12; i++) qPts.push({ p: c.getPointAt(Math.random()).normalize().multiplyScalar(GR * 1.01), s: Math.random() }); });
    const qMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffd84a }), qPts.length); qGroup.add(qMesh);
    const m4 = new THREE.Matrix4();
    // núi lửa
    const vGroup = new THREE.Group(); globe.add(vGroup);
    const seenV = new Set();
    const PACIFIC = ['Phú Sĩ', 'Sa-ku-ra-gi-ma', 'Pi-na-tu-bô', 'Ma-y-on', 'Ta-an', 'Krắc-ca-tau', 'Mê-ra-pi', 'Tam-bô-ra', 'Ra-bau', 'Ru-a-pê-hu', 'Ê-rê-bớt', 'Klu-chép', 'Si-sôn', 'Rê-đao', 'Xanh Hê-len', 'Rê-ni-ơ', 'Pô-pô', 'Phu-ê-gô', 'A-ren-an', 'Ru-ít', 'Cô-tô-pa-xi', 'Vi-gia-ri-ca', 'Ô-xô-nô'];
    VOLCANOES.forEach(([n, la, lo]) => {
      const cone = new THREE.Mesh(new THREE.ConeGeometry(.035, .09, 8), new THREE.MeshStandardMaterial({ color: 0xe8432e, emissive: 0x6a1205 }));
      const p = latLonToVec3(la, lo, GR * 1.02); cone.position.copy(p); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.clone().normalize()); vGroup.add(cone);
      const pac = PACIFIC.some(k => n.startsWith(k));
      const info = { title: 'Núi lửa ' + n, html: `Toạ độ ≈ ${Math.abs(la).toFixed(1).replace('.', ',')}°${la >= 0 ? 'B' : 'N'}, ${Math.abs(lo).toFixed(1).replace('.', ',')}°${lo >= 0 ? 'Đ' : 'T'}.<br>${pac ? 'Thuộc <b>Vành đai lửa Thái Bình Dương</b>.' : n.includes('Ai-xơ-len') ? 'Nằm trên <b>sống núi giữa Đại Tây Dương</b> (mảng tách giãn).' : n.includes('I-ta-li-a') || n.includes('Thổ') ? 'Thuộc vành đai <b>Địa Trung Hải – Hi-ma-lay-a</b>.' : n.includes('Ha-oai') ? 'Núi lửa <b>điểm nóng</b> giữa mảng Thái Bình Dương.' : 'Liên quan tới đới <b>tách giãn</b> hoặc điểm nóng.'}`, id: n,
        onPick: () => { if (pac) { seenV.add(n); if (seenV.size >= 3) api.done('v3'); } if (n.startsWith('Phú Sĩ')) api.done('fuji'); if (n.includes('Ai-xơ-len')) api.done('iceland'); } };
      api.hotspot(cone, info);
    });
    // trận động đất lớn
    const bigG = new THREE.Group(); globe.add(bigG); const rings = [];
    QUAKES.forEach(([n, la, lo, M, h]) => {
      const p = latLonToVec3(la, lo, GR * 1.012);
      const ring = new THREE.Mesh(new THREE.RingGeometry(.05, .075, 32), new THREE.MeshBasicMaterial({ color: 0xff3030, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
      ring.position.copy(p); ring.lookAt(p.clone().multiplyScalar(2)); bigG.add(ring); rings.push(ring);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(.04, 12, 8), new THREE.MeshBasicMaterial({ color: 0xff3030 })); dot.position.copy(p); bigG.add(dot);
      const info = { title: `Động đất ${n}`, html: `Độ lớn: <b>M ${M}</b>.<br>${h}`, id: n, onPick: () => { if (n.startsWith('Ấn Độ Dương')) api.done('q2004'); } };
      api.hotspot(dot, info);
      api.label(n, { cls: 'sm warm', pos: latLonToVec3(la, lo, GR * 1.09), parent: bigG, globe: gc, onClick: info });
    });
    api.onTick((dt, t) => {
      for (let i = 0; i < qPts.length; i++) { const k = (t * .6 + qPts[i].s) % 1; const sc = .6 + Math.sin(k * Math.PI) * .9; m4.makeScale(sc, sc, sc).setPosition(qPts[i].p); qMesh.setMatrixAt(i, m4); }
      qMesh.instanceMatrix.needsUpdate = true;
      rings.forEach((r, i) => { const k = (t * .5 + i * .17) % 1; r.scale.setScalar(1 + k * 3); r.material.opacity = 1 - k; });
      if (api.get('spin') && !state.lock) globe.rotation.y += dt * .06;
    });
    // làm nổi bật vành đai
    const hl = new THREE.Group(); globe.add(hl);
    const belt = (pairs, col) => { const c = geoCurve(pairs, GR * 1.03); const m = api.tube(c.getPoints(pairs.length * 12), .05, col, { opacity: .28 }); hl.add(m); return m; };
    const H = {
      tbd: [belt([[-46, 168], [-38, 178], [-22, -175], [-12, 160], [-6, 150], [-8, 125], [-7, 108], [0, 126], [12, 125], [24, 123], [35, 140], [45, 150], [52, 160], [55, 165], [52, 175], [52, -170], [56, -158], [60, -148], [55, -133], [48, -125], [40, -124], [32, -117], [20, -106], [13, -91], [8, -83], [0, -80], [-15, -76], [-30, -72], [-45, -74]], 0xff8a3d)],
      dth: [belt([[37, -10], [38, 14], [38, 28], [38, 42], [34, 52], [30, 66], [30, 80], [28, 92], [20, 95], [5, 95], [-5, 102], [-9, 115]], 0xffd23f)],
      tach: bt.tach.map(({ c }) => { const m = api.tube(c.getPoints(80).map(v => v.clone().normalize().multiplyScalar(GR * 1.03)), .045, 0x3fc1ff, { opacity: .3 }); hl.add(m); return m; }),
    };
    state.focus = f => {
      Object.entries(H).forEach(([k, arr]) => arr.forEach(m => (m.visible = k === f)));
      bigG.visible = f === 'quake' || api.get('showQ');
    };
    state.faceLon = L => { state.lock = true; globe.rotation.y = -Math.PI / 2 - L * Math.PI / 180; clearTimeout(state.lt); state.lt = setTimeout(() => (state.lock = false), 6000); }; // đưa kinh tuyến L ra trước camera
    api.heading('Lớp hiển thị');
    api.toggle('showV', 'Núi lửa', true, v => (vGroup.visible = v));
    api.toggle('showE', 'Động đất (minh hoạ)', true, v => (qGroup.visible = v));
    api.toggle('showB', 'Ranh giới mảng', false, v => (bGroup.visible = v));
    api.toggle('showQ', 'Trận động đất lớn', false, v => (bigG.visible = v));
    api.toggle('spin', 'Xoay quả địa cầu', true, () => {});
    api.legend([{ c: '#e8432e', t: 'Núi lửa' }, { c: '#ffd84a', t: 'Động đất (minh hoạ)' }, { c: '#ff3030', t: 'Động đất lớn' }, { c: '#ff5a4a', t: 'Ranh giới hội tụ' }, { c: '#3fc1ff', t: 'Ranh giới tách giãn' }]);
  },
};

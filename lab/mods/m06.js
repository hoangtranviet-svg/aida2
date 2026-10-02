// 3D-06 · Bài 6 – Thạch quyển, thuyết kiến tạo mảng
import { THREE, makeGlobe, geoCurve, latLonToVec3, starfield } from '../core.js';
import { earthTexture } from '../earth.js';
import { BOUNDARIES, PLATES } from '../geo.js';

const TYPE = { tach: { c: 0x3fc1ff, t: 'Tách giãn' }, tu: { c: 0xff5a4a, t: 'Hội tụ (xô vào nhau)' }, truot: { c: 0xffd23f, t: 'Trượt ngang (chuyển dạng)' } };

export default {
  id: '3D-06', code: 'DL10.B06', title: 'Thạch quyển, thuyết kiến tạo mảng',
  objectives: [
    { c: 'DL10.03.01', t: 'Khái niệm thạch quyển; phân biệt thạch quyển với vỏ Trái Đất' },
    { c: 'DL10.03.02', t: 'Thuyết kiến tạo mảng; giải thích núi trẻ, vành đai động đất, núi lửa' },
  ],
  sources: [
    { t: 'USGS – This Dynamic Earth: Understanding plate motions', u: 'https://pubs.usgs.gov/gip/dynamic/understanding.html' },
    { t: 'Bird, P. (2003) – An updated digital model of plate boundaries (PB2002)', u: 'https://doi.org/10.1029/2001GC000252', n: 'ranh giới mảng, đã giản lược' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 6 (Hình 6.1 – 6.4)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Ranh giới mảng trên quả địa cầu đã được giản lược để dễ quan sát. Các mặt cắt không theo tỉ lệ.',
  view: { pos: [0, 2, 6.5], target: [0, 0, 0] },
  steps: [
    { title: 'Thạch quyển là gì?', html: '<p><b>Thạch quyển</b> là lớp vỏ cứng ngoài cùng của Trái Đất, dày khoảng <b>100 km</b>, gồm <b>vỏ Trái Đất và phần trên cùng của lớp man-ti</b>. Thạch quyển nằm trên lớp man-ti quánh dẻo.</p><div class="tip">Phân biệt: vỏ Trái Đất chỉ dày 5 – 70 km, còn thạch quyển dày hơn vì có thêm phần trên của man-ti.</div>',
      enter: a => { a.state.show('section', 'tach'); a.state.showLitho(true); a.fly([0, 2.5, 15.5], [0, -1, 0]); } },
    { title: 'Các mảng kiến tạo', html: '<p>Theo <b>thuyết kiến tạo mảng</b>, thạch quyển bị gãy vỡ thành các <b>mảng kiến tạo</b> (7 mảng lớn và nhiều mảng nhỏ). Các mảng nhẹ, nổi trên lớp man-ti quánh dẻo và <b>dịch chuyển</b> chậm (vài cm/năm) nhờ các <b>dòng đối lưu</b> vật chất trong man-ti.</p><div class="tip">Bấm vào tên các mảng và các đường ranh giới.</div>',
      enter: a => { a.state.show('globe'); a.fly([0, 2, 6.5], [0, 0, 0]); } },
    { title: 'Hai mảng tách xa nhau', html: '<p>Ở nơi hai mảng <b>tách giãn</b>, mác-ma từ man-ti trào lên tạo thành <b>sống núi giữa đại dương</b> và lớp vỏ mới; kèm theo động đất, núi lửa. Ví dụ: sống núi giữa Đại Tây Dương, thung lũng tách giãn Đông Phi.</p>',
      enter: a => { a.state.show('section', 'tach'); a.state.showLitho(false); a.fly([0, 2.5, 13], [0, -1, 0]); } },
    { title: 'Mảng đại dương xô vào mảng lục địa', html: '<p>Mảng đại dương nặng hơn bị <b>hút chìm</b> xuống dưới mảng lục địa, tạo <b>vực biển sâu</b>; mảng lục địa bị nén ép, uốn lên thành <b>dãy núi trẻ</b> có nhiều <b>núi lửa</b>, động đất. Ví dụ: dãy An-đét ở Nam Mỹ.</p>',
      enter: a => { a.state.show('section', 'hutchim'); a.fly([0, 2.5, 13], [0, -1, 0]); } },
    { title: 'Hai mảng lục địa va chạm', html: '<p>Hai mảng lục địa xô vào nhau, vỏ bị <b>dồn ép, nhô cao</b> thành các dãy núi đồ sộ, kèm theo động đất. Ví dụ: dãy Hi-ma-lay-a hình thành do mảng Ấn Độ – Ô-xtrây-li-a xô vào mảng Âu – Á.</p>',
      enter: a => { a.state.show('section', 'vacham'); a.fly([0, 3, 13], [0, -.5, 0]); } },
    { title: 'Hai mảng trượt ngang', html: '<p>Hai mảng <b>trượt ngang</b> qua nhau theo đứt gãy chuyển dạng, không tạo vỏ mới cũng không mất vỏ nhưng gây <b>động đất mạnh</b>. Ví dụ: đứt gãy San An-đrê-át (Hoa Kỳ).</p>',
      enter: a => { a.state.show('section', 'truot'); a.fly([0, 7, 10], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'litho', text: 'Bấm vào <b>thạch quyển</b> trên mặt cắt và so sánh độ dày với vỏ Trái Đất.', hint: 'Bước 1' },
    { id: 'plates', text: 'Bấm vào tên <b>3 mảng kiến tạo</b> bất kì.', hint: 'Bước 2' },
    { id: 'ridge', text: 'Bấm vào một đường ranh giới <b>tách giãn</b> (màu xanh) trên quả địa cầu.' },
    { id: 'andes', text: 'Chạy mô phỏng hút chìm đến khi <b>núi lửa phun</b>.', hint: 'Bước 4, kéo “Tiến trình”' },
    { id: 'himalaya', text: 'Cho hai mảng lục địa va chạm đến khi <b>dãy núi cao nhất</b>.', hint: 'Bước 5' },
  ],

  async setup(api) {
    const { scene, state } = api;
    starfield(scene);
    const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(5, 8, 10); scene.add(key);
    const tex = await earthTexture({ mode: 'natural' });
    const groups = { globe: new THREE.Group(), section: new THREE.Group() };
    Object.values(groups).forEach(g => scene.add(g));

    // ===== quả địa cầu + ranh giới mảng =====
    const GR = 2;
    const globe = makeGlobe(api, { radius: GR, texture: tex, grid: true }); groups.globe.add(globe);
    const gc = { center: new THREE.Vector3(), radius: GR };
    BOUNDARIES.forEach(b => {
      const c = geoCurve(b.pts, GR * 1.008); const tube = api.tube(c.getPoints(b.pts.length * 10), .014, TYPE[b.type].c); globe.add(tube);
      const info = { title: b.name, html: `Kiểu ranh giới: <b>${TYPE[b.type].t}</b>.`, id: b.name, onPick: () => { if (b.type === 'tach') api.done('ridge'); } };
      api.hotspot(tube, info);
    });
    const seenP = new Set();
    PLATES.forEach(([n, la, lo]) => api.label(n, { pos: latLonToVec3(la, lo, GR * 1.03), parent: globe, globe: gc,
      onClick: { title: n, html: 'Một mảng kiến tạo của thạch quyển. Mảng gồm phần lục địa và/hoặc phần đáy đại dương, di chuyển như một khối thống nhất.', id: n, onPick: () => { seenP.add(n); if (seenP.size >= 3) api.done('plates'); } } }));
    api.onTick(dt => { if (state.cur === 'globe' && api.get('gspin')) globe.rotation.y += dt * .08; });

    // ===== mặt cắt =====
    const S = groups.section; const D = 3;
    const mat = c => new THREE.MeshStandardMaterial({ color: c, roughness: .85 });
    const mantle = new THREE.Mesh(new THREE.BoxGeometry(14, 2.4, D), mat(0xb4521f)); mantle.position.y = -3.2; S.add(mantle);
    api.label('Man-ti quánh dẻo', { cls: 'warm', pos: new THREE.Vector3(-5, -.2, D / 2 + .05), parent: mantle });
    // dòng đối lưu trong man-ti
    const conv = new THREE.Group(); S.add(conv);
    const loop = (cx, dir) => { const pts = []; for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2 * dir; pts.push(new THREE.Vector3(cx + Math.cos(a) * 2.6, -3.2 + Math.sin(a) * .8, D / 2 + .06)); } const c = new THREE.CatmullRomCurve3(pts, true); conv.add(api.tube(c.getPoints(80), .02, 0xffd08a, { opacity: .6 })); api.flowAlong(c, { count: 10, color: 0xffe4b0, size: .06, speed: .06, parent: conv }); };
    // các mô hình con
    const sub = { tach: new THREE.Group(), hutchim: new THREE.Group(), vacham: new THREE.Group(), truot: new THREE.Group() };
    Object.values(sub).forEach(g => S.add(g));
    // --- tách giãn ---
    const T = sub.tach;
    const stripeTex = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 8; const x = c.getContext('2d'); for (let i = 0; i < 16; i++) { x.fillStyle = i % 2 ? '#3c4a5a' : '#556578'; x.fillRect(i * 16, 0, 16, 8); } const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return t; })();
    const plateMat = new THREE.MeshStandardMaterial({ map: stripeTex, roughness: .8 });
    const pL = new THREE.Mesh(new THREE.BoxGeometry(6.6, .9, D), plateMat); const pR = new THREE.Mesh(new THREE.BoxGeometry(6.6, .9, D), plateMat.clone()); pR.material.map = stripeTex.clone(); T.add(pL, pR);
    const lithoL = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.0, D), mat(0x7a5a45)); const lithoR = lithoL.clone(); T.add(lithoL, lithoR);
    const ridge = new THREE.Mesh(new THREE.ConeGeometry(1.2, .9, 4, 1), mat(0x4a5868)); ridge.rotation.y = Math.PI / 4; ridge.scale.z = 1.6; ridge.position.set(0, .45, 0); T.add(ridge);
    const magma = new THREE.Mesh(new THREE.CylinderGeometry(.25, .7, 2.2, 16), new THREE.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0xff4a00, emissiveIntensity: .8 })); magma.position.set(0, -1.2, 0); T.add(magma);
    const seaT = new THREE.Mesh(new THREE.BoxGeometry(14, 1.4, D), new THREE.MeshStandardMaterial({ color: 0x2f7fc1, transparent: true, opacity: .55 })); seaT.position.y = 1.15; T.add(seaT);
    api.label('Sống núi giữa đại dương', { pos: new THREE.Vector3(0, 2.2, 0), parent: T });
    api.label('⟵ Mảng tách xa', { cls: 'cold', pos: new THREE.Vector3(-4, .1, D / 2 + .05), parent: T });
    api.label('Mảng tách xa ⟶', { cls: 'cold', pos: new THREE.Vector3(4, .1, D / 2 + .05), parent: T });
    api.label('Mác-ma trào lên', { cls: 'sm warm', pos: new THREE.Vector3(0, -1.4, D / 2 + .05), parent: T });
    // nhãn thạch quyển / vỏ
    const lithoInfo = { title: 'Thạch quyển (≈ 100 km)', id: 'litho', html: 'Gồm <b>vỏ Trái Đất</b> (phần màu xám phía trên) và <b>phần trên cùng của man-ti</b> (phần nâu bên dưới). Thạch quyển cứng, bị chia thành các mảng.', onPick: () => api.done('litho') };
    const lithoLbl = [api.label('Thạch quyển', { cls: 'big', pos: new THREE.Vector3(-5.6, -.3, D / 2 + .1), parent: T, onClick: lithoInfo }),
      api.label('Vỏ Trái Đất', { cls: 'sm', pos: new THREE.Vector3(-3, .3, D / 2 + .1), parent: T }),
      api.label('Phần trên man-ti', { cls: 'sm', pos: new THREE.Vector3(-3, -.65, D / 2 + .1), parent: T })];
    api.hotspot(lithoL, lithoInfo); api.hotspot(pL, lithoInfo);
    state.showLitho = v => lithoLbl.forEach(l => (l.visible = v));
    // --- hút chìm ---
    const H = sub.hutchim;
    const cont = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.8, D), mat(0x8a7356)); cont.position.set(3.8, .25, 0); H.add(cont);
    const andes = new THREE.Mesh(new THREE.ConeGeometry(1.4, 1, 5), new THREE.MeshStandardMaterial({ color: 0x7d8c5a, flatShading: true })); andes.position.set(2.2, 1.15, 0); H.add(andes);
    const volc = new THREE.Mesh(new THREE.ConeGeometry(.5, .8, 16), mat(0x5a4a40)); volc.position.set(3.2, 1.15, .6); H.add(volc);
    const lava = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(60 * 3), 3)), new THREE.PointsMaterial({ color: 0xff6a1a, size: .12 })); H.add(lava);
    const oStripe = stripeTex.clone(); oStripe.repeat.x = 1.4;
    const oce = new THREE.Mesh(new THREE.BoxGeometry(11, .7, D, 60, 1, 1), new THREE.MeshStandardMaterial({ map: oStripe, roughness: .8 })); H.add(oce);
    { const P = oce.geometry.attributes.position; for (let i = 0; i < P.count; i++) { const x = P.getX(i) - 2.5; const bend = x > 0 ? -x * x * .18 - x * .35 : 0; P.setX(i, x > 0 ? x * .82 : x); P.setY(i, P.getY(i) - .35 + bend); } P.needsUpdate = true; oce.geometry.computeVertexNormals(); }
    const seaH = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.0, D), new THREE.MeshStandardMaterial({ color: 0x2f7fc1, transparent: true, opacity: .45 })); seaH.position.set(-3.3, .5, 0); H.add(seaH);
    api.label('Mảng đại dương ⟶', { cls: 'cold', pos: new THREE.Vector3(-4.5, -.2, D / 2 + .05), parent: H });
    api.label('⟵ Mảng lục địa', { cls: 'warm', pos: new THREE.Vector3(4.6, -.3, D / 2 + .05), parent: H });
    api.label('Vực biển sâu', { cls: 'sm', pos: new THREE.Vector3(.3, -.1, D / 2 + .05), parent: H });
    api.label('Mảng đại dương bị hút chìm', { cls: 'sm cold', pos: new THREE.Vector3(3.2, -1.9, D / 2 + .05), parent: H });
    const andesL = api.label('Dãy núi trẻ, núi lửa (VD: An-đét)', { pos: new THREE.Vector3(2.2, 2.4, 0), parent: H });
    // --- va chạm lục địa ---
    const V = sub.vacham;
    const cA = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, D, 30, 6, 1), mat(0x9a7b5a)); const cB = new THREE.Mesh(new THREE.BoxGeometry(6, 1.6, D, 30, 6, 1), mat(0x8a6f53)); V.add(cA, cB);
    const aP = cA.geometry.attributes.position, a0 = aP.array.slice(); const bP = cB.geometry.attributes.position, b0 = bP.array.slice();
    const hm = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1, 6, 3), new THREE.MeshStandardMaterial({ color: 0x8c8f7a, flatShading: true })); V.add(hm);
    const snow = new THREE.Mesh(new THREE.ConeGeometry(.7, .4, 6), mat(0xffffff)); V.add(snow);
    api.label('Mảng Ấn Độ – Ô-xtrây-li-a ⟶', { cls: 'warm', pos: new THREE.Vector3(-4.5, -.2, D / 2 + .05), parent: V });
    api.label('⟵ Mảng Âu – Á', { cls: 'warm', pos: new THREE.Vector3(4.6, -.2, D / 2 + .05), parent: V });
    const himL = api.label('Hi-ma-lay-a', { cls: 'big', pos: new THREE.Vector3(0, 3, 0), parent: V });
    // --- trượt ngang ---
    const R = sub.truot;
    const bA = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 3), mat(0xa08a64)); bA.position.set(0, 0, -1.55); const bB = new THREE.Mesh(new THREE.BoxGeometry(10, 1, 3), mat(0x8f7a58)); bB.position.set(0, 0, 1.55); R.add(bA, bB);
    const road = (z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.4, .02, 3), mat(0x444444)); m.position.set(0, .52, z); return m; };
    const rA = road(-1.55), rB = road(1.55); bA.add(rA); bB.add(rB); rA.position.set(0, .52, 0); rB.position.set(0, .52, 0);
    api.label('Đứt gãy (VD: San An-đrê-át)', { pos: new THREE.Vector3(0, 1.4, 0), parent: R });
    const ring = new THREE.Mesh(new THREE.RingGeometry(.2, .3, 32), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = .55; R.add(ring);

    // ===== tiến trình =====
    state.p = 0;
    const apply = () => {
      const p = state.p;
      // tách giãn
      const gap = .6 + p * 2.2; pL.position.set(-3.3 - gap / 2, -.05, 0); pR.position.set(3.3 + gap / 2, -.05, 0);
      lithoL.position.set(pL.position.x, -1.0, 0); lithoR.position.set(pR.position.x, -1.0, 0);
      stripeTex.offset.x = -p * .3; pR.material.map.offset.x = p * .3; ridge.scale.y = .6 + p * .6; magma.scale.x = magma.scale.z = .8 + p * .6;
      // hút chìm: mảng đại dương tiến sang phải và cắm xuống
      oStripe.offset.x = -p * 1.2; // mảng đại dương trôi về phía lục địa rồi cắm xuống
      andes.scale.set(1, .5 + p * 1.5, 1); andes.position.y = 1.15 + (.5 + p * 1.5) * .5; volc.position.y = 1.3 + p * .6;
      const erupt = p > .7; lava.visible = erupt; andesL.visible = p > .3; if (erupt) api.done('andes');
      // va chạm
      const push = p * 1.2;
      for (let i = 0; i < aP.count; i++) { const x0 = a0[i * 3], y0 = a0[i * 3 + 1]; const x = x0 - 3 + push; const near = Math.max(0, 1 - Math.abs(x - 0) / 2.4); aP.setX(i, x); aP.setY(i, y0 + near * p * 1.2 * (y0 > 0 ? 1 : .4)); }
      for (let i = 0; i < bP.count; i++) { const x0 = b0[i * 3], y0 = b0[i * 3 + 1]; const x = x0 + 3 - push; const near = Math.max(0, 1 - Math.abs(x - 0) / 2.4); bP.setX(i, x); bP.setY(i, y0 + near * p * 1.2 * (y0 > 0 ? 1 : .4)); }
      aP.needsUpdate = bP.needsUpdate = true; cA.geometry.computeVertexNormals(); cB.geometry.computeVertexNormals();
      hm.scale.set(1, .2 + p * 2.6, 1); hm.position.y = .8 + (.2 + p * 2.6) * .5; snow.position.y = .8 + (.2 + p * 2.6) - .1; snow.visible = p > .55; himL.visible = p > .4;
      if (p > .97) api.done('himalaya');
      // trượt ngang
      bA.position.x = p * 1.4; bB.position.x = -p * 1.4;
    };
    state.apply = apply;
    api.onTick((dt, t) => {
      if (state.cur !== 'section') return;
      if (api.get('auto') && !api.paused) { state.p = (state.p + dt * .08) % 1; apply(); }
      if (lava.visible) { const a = lava.geometry.attributes.position; for (let i = 0; i < 60; i++) { const k = (t * .8 + i / 60) % 1; a.setXYZ(i, volc.position.x + Math.sin(i * 7.1) * k * .6, volc.position.y + .4 + k * 1.4 - k * k * 1.2, .6 + Math.cos(i * 3.3) * k * .5); } a.needsUpdate = true; }
      ring.scale.setScalar(1 + ((t * .8) % 1) * 4); ring.material.opacity = 1 - ((t * .8) % 1);
    });

    state.show = (name, s) => {
      state.cur = name; for (const [k, g] of Object.entries(groups)) g.visible = k === name;
      if (s) { state.secType = s; for (const [k, g] of Object.entries(sub)) g.visible = k === s; mantle.visible = conv.visible = s !== 'truot'; }
      ctlS.style.display = name === 'section' ? '' : 'none'; ctlG.style.display = name === 'globe' ? '' : 'none';
      api.legend(name === 'globe' ? Object.values(TYPE).map(x => ({ c: '#' + x.c.toString(16).padStart(6, '0'), t: x.t })) : null);
      apply();
    };
    loop(-3.4, 1); loop(3.4, -1);
    const base = api.controlsBox;
    const ctlS = document.createElement('div'); base.append(ctlS); api.controlsBox = ctlS; api.heading('Mô phỏng');
    api.toggle('auto', 'Tự chạy', true, () => {});
    api.slider('prog', 'Tiến trình (hàng triệu năm)', { min: 0, max: 1, step: .01, value: 0, format: v => `${Math.round(v * 100)}%` }, v => { if (state.ready) api.set('auto', false); state.p = v; apply(); });
    const ctlG = document.createElement('div'); base.append(ctlG); api.controlsBox = ctlG; api.heading('Tuỳ chọn');
    api.toggle('gspin', 'Xoay quả địa cầu', true, () => {});
    api.controlsBox = base; state.ready = true;
  },
};

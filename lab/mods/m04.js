// 3D-04 · Bài 4 – Sự hình thành Trái Đất, vỏ Trái Đất và vật liệu cấu tạo vỏ Trái Đất
import { THREE, starfield } from '../core.js';
import { earthTexture } from '../earth.js';

const R = 3; const km = d => R * (6371 - d) / 6371; // bán kính ứng với độ sâu d (km)
const LAYERS = [
  { id: 'vo', name: 'Vỏ Trái Đất', r0: km(70), r1: R, col: 0x9b7653, depth: '0 – 70 km', html: 'Lớp ngoài cùng, rắn, mỏng: dày khoảng <b>5 km ở đại dương</b> và tới <b>70 km ở lục địa</b>. Chiếm khoảng 1% thể tích, 0,5% khối lượng Trái Đất. <i>(Trên mô hình đã phóng to độ dày để dễ quan sát.)</i>' },
  { id: 'mantitren', name: 'Man-ti trên', r0: km(700), r1: km(70), col: 0xd9772b, depth: '≈ 70 – 700 km', html: 'Vật chất ở trạng thái quánh dẻo. Phần trên cùng của man-ti cùng với vỏ Trái Đất tạo thành <b>thạch quyển</b>, trôi trên lớp quánh dẻo bên dưới.' },
  { id: 'mantiduoi', name: 'Man-ti dưới', r0: km(2900), r1: km(700), col: 0xc4521f, depth: '≈ 700 – 2 900 km', html: 'Vật chất ở trạng thái rắn. Man-ti chiếm khoảng 80% thể tích và 68,5% khối lượng Trái Đất.' },
  { id: 'nhanngoai', name: 'Nhân ngoài', r0: km(5100), r1: km(2900), col: 0xf0a531, depth: '2 900 – 5 100 km', html: 'Vật chất ở <b>trạng thái lỏng</b>, nhiệt độ rất cao (khoảng 5 000 °C). Thành phần chủ yếu là sắt, ni-ken. Sự chuyển động của nhân ngoài tạo ra từ trường Trái Đất.' },
  { id: 'nhantrong', name: 'Nhân trong', r0: 0, r1: km(5100), col: 0xffe27a, depth: '5 100 – 6 371 km', html: 'Vật chất ở <b>trạng thái rắn</b> do áp suất cực lớn, thành phần chủ yếu là sắt và ni-ken; nhiệt độ có thể tới khoảng 5 000 – 6 000 °C.' },
];
// tỉ lệ thật làm vỏ quá mỏng: phóng to vỏ thành 0,12 đơn vị
LAYERS[0].r0 = R - 0.12; LAYERS[1].r1 = R - 0.12;

export default {
  id: '3D-04', code: 'DL10.B04', title: 'Sự hình thành Trái Đất, vỏ Trái Đất',
  objectives: [{ c: 'DL10.02.01', t: 'Nguồn gốc hình thành Trái Đất, đặc điểm vỏ Trái Đất, vật liệu cấu tạo' }],
  sources: [
    { t: 'USGS – This Dynamic Earth: Inside the Earth', u: 'https://pubs.usgs.gov/gip/dynamic/inside.html' },
    { t: 'NASA Solar System Exploration – Earth: Facts', u: 'https://science.nasa.gov/earth/facts/' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 4 (Hình 4.1, 4.2)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Độ dày các lớp theo tỉ lệ thật, riêng vỏ Trái Đất được phóng to để nhìn thấy được.',
  view: { pos: [-6.5, 4, 8], target: [0, 0, 0] },
  steps: [
    { title: 'Trái Đất hình thành như thế nào?', html: '<p>Theo giả thuyết phổ biến, khoảng <b>4,6 tỉ năm trước</b>, một đám mây bụi và khí khổng lồ (tinh vân Mặt Trời) quay và co lại. Phần lớn vật chất dồn về tâm tạo thành Mặt Trời; phần còn lại tạo thành vành đĩa, các hạt va chạm, kết dính dần thành các hành tinh, trong đó có Trái Đất.</p><div class="tip">Kéo thanh “Thời gian” để xem quá trình kết tụ.</div>',
      enter: a => { a.state.show('form'); a.fly([0, 9, 14], [0, 0, 0]); } },
    { title: 'Cấu trúc bên trong Trái Đất', html: '<p>Theo chiều sâu, Trái Đất gồm 3 lớp chính: <b>vỏ Trái Đất</b>, <b>man-ti</b> (trên và dưới) và <b>nhân</b> (ngoài và trong). Càng vào sâu, nhiệt độ và áp suất càng tăng.</p><div class="tip">Mô hình đã bổ đi một phần tư. Bấm vào tên từng lớp để xem đặc điểm.</div>',
      enter: a => { a.state.show('inner'); a.fly([-6.5, 4, 8], [0, 0, 0]); } },
    { title: 'Vỏ lục địa và vỏ đại dương', html: '<p>Vỏ Trái Đất có hai kiểu:</p><ul><li><b>Vỏ lục địa</b>: dày (trung bình 35 – 40 km, ở miền núi tới 70 km), gồm tầng trầm tích, tầng granit và tầng badan.</li><li><b>Vỏ đại dương</b>: mỏng (5 – 10 km), không có tầng granit.</li></ul><p>Ranh giới giữa vỏ và man-ti gọi là mặt <b>Mô-hô</b>.</p>',
      enter: a => { a.state.show('crust'); a.fly([0, 3.2, 10], [0, -.6, 0]); } },
    { title: 'Vật liệu cấu tạo vỏ Trái Đất', html: '<p>Vỏ Trái Đất được cấu tạo bởi <b>khoáng vật</b> và <b>đá</b>.</p><ul><li><b>Đá mác-ma</b> (granit, badan): do mác-ma nguội đặc lại.</li><li><b>Đá trầm tích</b> (đá vôi, sét…): do vật liệu lắng tụ, nén chặt.</li><li><b>Đá biến chất</b> (đá hoa, gơ-nai…): đá cũ bị biến đổi do nhiệt độ, áp suất cao.</li></ul>',
      enter: a => { a.state.show('crust'); a.fly([-5, 2.5, 7], [0, -.6, 0]); } },
  ],
  tasks: [
    { id: 'form', text: 'Kéo thời gian đến khi <b>Trái Đất hình thành xong</b>.' },
    { id: 'core', text: 'Bấm vào lớp có vật chất ở <b>trạng thái lỏng</b>.', hint: 'Bước 2' },
    { id: 'litho', text: 'Tìm lớp có phần trên cùng góp phần tạo nên <b>thạch quyển</b>.' },
    { id: 'granit', text: 'Bấm vào tầng <b>granit</b> và cho biết nó chỉ có ở kiểu vỏ nào.', hint: 'Bước 3' },
  ],

  async setup(api) {
    const { scene, state } = api;
    starfield(scene);
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(6, 8, 10); scene.add(key);
    const tex = await earthTexture({ mode: 'natural' });
    const groups = { form: new THREE.Group(), inner: new THREE.Group(), crust: new THREE.Group() };
    Object.values(groups).forEach(g => scene.add(g));

    // ========== A. Hình thành ==========
    {
      const g = groups.form;
      const sun = new THREE.Mesh(new THREE.SphereGeometry(.9, 32, 24), new THREE.MeshBasicMaterial({ color: 0xffc04d })); g.add(sun); g.add(api.glow('#ffb040', 5));
      const N = 2500; const pos = new Float32Array(N * 3); const from = [], to = [];
      const planet = new THREE.Vector3(5, 0, 0);
      for (let i = 0; i < N; i++) {
        const r = 2 + Math.random() * 6.5, a = Math.random() * Math.PI * 2;
        from.push(new THREE.Vector3(Math.cos(a) * r, (Math.random() - .5) * .35, Math.sin(a) * r));
        const d = new THREE.Vector3().randomDirection().multiplyScalar(.55 + Math.random() * .05); to.push(d);
      }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const dust = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xd9b48a, size: .06 })); g.add(dust);
      const proto = new THREE.Mesh(new THREE.SphereGeometry(.6, 48, 32), new THREE.MeshStandardMaterial({ color: 0xc8582a, emissive: 0x6a1a00, roughness: .8 })); g.add(proto);
      const tl = api.label('', { cls: 'big', pos: new THREE.Vector3(0, 3, 0), parent: g });
      state.formT = 0; state.formAngle = 0;
      const update = () => {
        const t = state.formT; const k = Math.min(1, Math.max(0, (t - .15) / .8));
        const pa = state.formAngle; const pp = new THREE.Vector3(Math.cos(pa) * 5, 0, Math.sin(pa) * 5);
        for (let i = 0; i < N; i++) {
          const f = from[i].clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), state.formAngle * (1.2 - from[i].length() / 10));
          const near = i % 3 === 0; // một phần vật chất kết tụ vào hành tinh
          const p = near ? f.lerp(pp.clone().add(to[i]), k) : f.multiplyScalar(1 + k * .4);
          pos.set([p.x, p.y, p.z], i * 3);
        }
        geo.attributes.position.needsUpdate = true; dust.material.opacity = 1 - k * .6; dust.material.transparent = true;
        proto.position.copy(pp); proto.scale.setScalar(.15 + .85 * k);
        proto.material.emissive.setRGB(.45 * (1 - k * .7), .1 * (1 - k), 0);
        const ty = 4.6 - 4.6 * t; api.setLabelText(tl, t < .15 ? `≈ ${ty.toFixed(1).replace('.', ',')} tỉ năm trước: tinh vân Mặt Trời` : t < .95 ? `Các hạt va chạm, kết tụ…` : 'Trái Đất nguyên thuỷ hình thành');
        if (t >= .99) api.done('form');
      };
      state.formUpdate = update;
      api.onTick(dt => { if (state.cur !== 'form') return; state.formAngle += dt * .25; update(); });
    }

    // ========== B. Cấu trúc bên trong (bổ một phần tư) ==========
    {
      const g = groups.inner;
      const PH0 = Math.PI / 2, PHL = Math.PI * 1.5; // khuyết phần phi ∈ [0, π/2]
      const surf = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64, PH0, PHL), new THREE.MeshStandardMaterial({ map: tex, roughness: .9, side: THREE.DoubleSide }));
      // dịch UV cho khớp kết cấu (SphereGeometry có phiStart)
      const uv = surf.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setX(i, PH0 / (2 * Math.PI) + uv.getX(i) * PHL / (2 * Math.PI)); uv.needsUpdate = true;
      g.add(surf);
      const halfRing = (r0, r1, col, rotY, emissive = 0) => {
        const m = new THREE.Mesh(new THREE.RingGeometry(Math.max(r0, .001), r1, 96, 1, -Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: emissive, side: THREE.DoubleSide, roughness: .7 }));
        m.rotation.y = rotY; return m;
      };
      LAYERS.forEach((L, i) => {
        const glowK = i >= 3 ? .45 : i >= 1 ? .2 : 0;
        const a = halfRing(L.r0, L.r1, L.col, Math.PI, glowK); // mặt cắt phía −x
        const b = halfRing(L.r0, L.r1, L.col, -Math.PI / 2, glowK); // mặt cắt phía +z
        g.add(a, b);
        const info = { title: `${L.name} (${L.depth})`, html: L.html, id: L.id, onPick: () => { if (L.id === 'nhanngoai') api.done('core'); if (L.id === 'mantitren') api.done('litho'); } };
        api.hotspot(a, info); api.hotspot(b, info);
        const rm = (L.r0 + L.r1) / 2;
        api.label(L.name, { pos: new THREE.Vector3(-.15, rm * .75, rm * .66), parent: g, onClick: info });
      });
      api.label('Mặt cắt bổ dọc', { cls: 'sm plain', pos: new THREE.Vector3(-1.5, -3.4, 1.5), parent: g });
      api.onTick(dt => { if (state.cur === 'inner' && api.get('spin')) g.rotation.y += dt * .15; });
    }

    // ========== C. Khối vỏ Trái Đất ==========
    {
      const g = groups.crust; const W = 10, D = 3;
      const box = (x0, x1, y0, y1, col, name, html, id) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, D), new THREE.MeshStandardMaterial({ color: col, roughness: .9 }));
        m.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); g.add(m);
        if (name) { const info = { title: name, html, id, onPick: () => { if (id === 'granit') api.done('granit'); } }; api.hotspot(m, info); api.label(name, { cls: 'sm', pos: new THREE.Vector3((x0 + x1) / 2, (y0 + y1) / 2, D / 2 + .05), parent: g, onClick: info }); }
        return m;
      };
      // vỏ đại dương (trái) và vỏ lục địa (phải); trục y: 0 = mực nước biển
      box(-5, 0, -2.6, -2.2, 0x5a4636, 'Man-ti', 'Lớp nằm dưới vỏ Trái Đất, ranh giới là mặt Mô-hô.', 'manti');
      box(0, 5, -2.6, -2.2, 0x5a4636);
      box(-5, 0, -1.55, -1.0, 0x3b3f46, 'Tầng badan', 'Đá badan sẫm màu, nặng; có ở cả vỏ đại dương và vỏ lục địa.', 'badan-dd');
      box(-5, 0, -1.0, -.8, 0xc9b27c, 'Trầm tích', 'Tầng trầm tích mỏng phủ trên đáy đại dương.', 'tt-dd');
      box(-5, 0, -2.2, -1.55, 0x5a4636);
      box(0, 5, -2.2, -1.4, 0x3b3f46, 'Tầng badan', 'Tầng dưới cùng của vỏ lục địa.', 'badan-ld');
      box(0, 5, -1.4, -.2, 0xd8a8a0, 'Tầng granit', 'Gồm đá granit và các loại đá nhẹ khác. <b>Chỉ có ở vỏ lục địa</b>, vỏ đại dương không có tầng này.', 'granit');
      box(0, 5, -.2, .25, 0xd9c08a, 'Tầng trầm tích', 'Do vật liệu vụn, sét lắng tụ và nén chặt; không liên tục, dày mỏng khác nhau.', 'tt-ld');
      const water = new THREE.Mesh(new THREE.BoxGeometry(5, .8, D), new THREE.MeshStandardMaterial({ color: 0x2f7fc1, transparent: true, opacity: .75, roughness: .2 }));
      water.position.set(-2.5, -.4, 0); g.add(water);
      api.label('Đại dương', { cls: 'cold', pos: new THREE.Vector3(-2.5, -.2, D / 2 + .1), parent: g });
      // núi trên lục địa
      const mtn = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.1, 4), new THREE.MeshStandardMaterial({ color: 0x7c8a5a, flatShading: true })); mtn.position.set(3.4, .8, 0); mtn.rotation.y = Math.PI / 4; g.add(mtn);
      const moho = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-5, -1.55, D / 2 + .02), new THREE.Vector3(0, -1.55, D / 2 + .02), new THREE.Vector3(0, -2.2, D / 2 + .02), new THREE.Vector3(5, -2.2, D / 2 + .02)]), new THREE.LineDashedMaterial({ color: 0xffffff, dashSize: .15, gapSize: .1 }));
      moho.computeLineDistances(); g.add(moho);
      api.label('Mặt Mô-hô', { cls: 'sm warm', pos: new THREE.Vector3(1.6, -2.2, D / 2 + .1), parent: g });
      api.label('Vỏ đại dương (5 – 10 km)', { cls: 'big cold', pos: new THREE.Vector3(-2.5, 1.2, 0), parent: g });
      api.label('Vỏ lục địa (35 – 70 km)', { cls: 'big warm', pos: new THREE.Vector3(2.5, 1.8, 0), parent: g });
    }

    state.show = name => { state.cur = name; for (const [k, g] of Object.entries(groups)) g.visible = k === name; ctlForm.style.display = name === 'form' ? '' : 'none'; ctlInner.style.display = name === 'inner' ? '' : 'none'; api.legend(name === 'inner' ? LAYERS.map(L => ({ c: '#' + L.col.toString(16).padStart(6, '0'), t: `${L.name} · ${L.depth}` })) : null); };
    const base = api.controlsBox;
    const ctlForm = document.createElement('div'); base.append(ctlForm); api.controlsBox = ctlForm; api.heading('Thời gian');
    api.slider('formT', 'Quá trình hình thành', { min: 0, max: 1, step: .01, value: 0, format: v => v < .15 ? 'tinh vân' : v < .99 ? 'đang kết tụ' : 'hoàn thành' }, v => { state.formT = v; state.formUpdate?.(); });
    const ctlInner = document.createElement('div'); base.append(ctlInner); api.controlsBox = ctlInner; api.heading('Tuỳ chọn');
    api.toggle('spin', 'Xoay mô hình', false, () => {});
    api.controlsBox = base;
  },
};

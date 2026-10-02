// 3D-14 · Bài 14 – Đất trên Trái Đất
import { THREE } from '../core.js';
import { vegetation } from '../veg.js';

// Hình 14.1 SGK: Tầng chứa mùn – Tầng tích tụ – Tầng đá mẹ – Tầng đá gốc
const HOR = [
  { id: 'mun', name: 'Tầng chứa mùn', c: 0x4a3524, t: 0.9, h: 'Tầng trên cùng, màu sẫm, chứa nhiều <b>chất hữu cơ (mùn)</b> do xác sinh vật phân huỷ; nhiều rễ cây, giun đất, vi sinh vật. Quyết định <b>độ phì</b> của đất.' },
  { id: 'tichtu', name: 'Tầng tích tụ', c: 0x9a5b32, t: 1.0, h: 'Nơi tích tụ các chất (sét, sắt, nhôm…) bị nước mưa rửa trôi từ tầng trên xuống.' },
  { id: 'meme', name: 'Tầng đá mẹ', c: 0xc9a25a, t: 1.0, h: 'Gồm các mảnh vụn đá bị phong hoá từ đá gốc, là nguồn cung cấp <b>chất khoáng</b> cho đất. Đá mẹ quyết định thành phần khoáng, màu sắc, độ dày của đất.' },
  { id: 'goc', name: 'Tầng đá gốc', c: 0xd8c08a, t: 1.1, h: 'Đá chưa bị phong hoá hoặc phong hoá rất ít, nằm dưới cùng.' },
];
const FACTORS = [
  ['Đá mẹ', 'Cung cấp chất khoáng; quyết định thành phần khoáng vật, thành phần cơ giới, màu sắc của đất (VD: đất trên đá badan thường màu đỏ, giàu dinh dưỡng).'],
  ['Khí hậu', 'Nhiệt và ẩm làm đá gốc bị phá huỷ thành sản phẩm phong hoá; ảnh hưởng tới tốc độ phân giải chất hữu cơ, rửa trôi. Vùng nóng ẩm đất hình thành nhanh và dày.'],
  ['Sinh vật', 'Đóng vai trò <b>chủ đạo</b>: thực vật cung cấp xác hữu cơ, vi sinh vật phân giải tạo mùn, động vật (giun…) làm tơi xốp đất.'],
  ['Địa hình', 'Ở vùng núi, nhiệt ẩm thay đổi theo độ cao tạo các vành đai đất; sườn dốc đất mỏng, dễ xói mòn; vùng trũng đất dày, ẩm.'],
  ['Thời gian', 'Thời gian hình thành đất là tuổi của đất. Đất ở vùng nhiệt đới, cận nhiệt thường có tuổi già nhất.'],
  ['Con người', 'Hoạt động sản xuất làm đất tốt lên (bón phân, cải tạo) hoặc thoái hoá (phá rừng, canh tác không hợp lí gây xói mòn, bạc màu).'],
];

export default {
  id: '3D-14', code: 'DL10.B14', title: 'Đất và phẫu diện đất',
  objectives: [{ c: 'DL10.06.01', t: 'Khái niệm đất; phân biệt lớp vỏ phong hoá và đất' }, { c: 'DL10.06.02', t: 'Các nhân tố hình thành đất' }],
  sources: [
    { t: 'USDA NRCS – A Soil Profile (soil horizons)', u: 'https://www.nrcs.usda.gov/sites/default/files/2023-12/How_to_Make_a_Mini_Soil_Profile.pdf' },
    { t: 'FAO – Soils portal: soil formation', u: 'https://www.fao.org/soils-portal/en/' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 14 (Hình 14.1, 14.2)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Tên các tầng theo Hình 14.1 SGK. Tốc độ hình thành đất trên mô hình được rút ngắn (thực tế cần hàng trăm đến hàng nghìn năm để hình thành vài cm đất).',
  view: { pos: [6, 3.5, 9], target: [0, -1.4, 0] },
  steps: [
    { title: 'Đất là gì?', html: '<p><b>Đất</b> là lớp vật chất mỏng bao phủ bề mặt các lục địa và đảo, được tạo thành do quá trình phong hoá các loại đá. Thành phần: chất khoáng, chất hữu cơ, không khí và nước.</p><p>Đặc trưng cơ bản của đất là <b>độ phì</b>: khả năng cung cấp nước, chất dinh dưỡng, nhiệt, khí… giúp thực vật sinh trưởng.</p>',
      enter: a => { a.state.age(1); a.fly([6, 3.5, 9], [0, -1.4, 0]); } },
    { title: 'Phẫu diện đất', html: '<p><b>Phẫu diện đất</b> là mặt cắt thẳng đứng của đất, gồm các tầng khác nhau về màu sắc, vật liệu, độ phì.</p><p><b>Vỏ phong hoá</b> là sản phẩm phong hoá của đá gốc – phần trên cùng của vỏ Trái Đất. <b>Đất</b> chỉ là phần trên cùng của vỏ phong hoá, nơi có chất hữu cơ và độ phì.</p><div class="tip">Bấm vào từng tầng đất và hai dấu ngoặc “Đất”, “Vỏ phong hoá”.</div>',
      enter: a => { a.state.age(1); a.fly([1.2, -.5, 8.5], [0, -1.6, 0]); } },
    { title: 'Đất hình thành theo thời gian', html: '<p>Đá gốc bị phong hoá (do nhiệt, nước, sinh vật) → vụn ra thành <b>đá mẹ</b> → sinh vật đến sống, để lại xác hữu cơ → vi sinh vật phân giải thành <b>mùn</b> → nước mưa rửa trôi vật chất xuống tạo <b>tầng tích tụ</b>.</p><div class="tip">Kéo thanh “Thời gian hình thành đất” từ 0 lên.</div>',
      enter: a => { a.state.age(0); a.fly([6, 3.5, 9], [0, -1.4, 0]); } },
    { title: 'Các nhân tố hình thành đất', html: '<p>Sáu nhân tố: <b>đá mẹ, khí hậu, sinh vật, địa hình, thời gian, con người</b>. Trong đó sinh vật đóng vai trò chủ đạo.</p><div class="tip">Bấm vào các biểu tượng xung quanh khối đất.</div>',
      enter: a => { a.state.age(1); a.fly([0, 6, 11], [0, -1, 0]); } },
  ],
  tasks: [
    { id: 'mun', text: 'Bấm vào tầng quyết định <b>độ phì</b> của đất.' },
    { id: 'diff', text: 'Bấm vào dấu ngoặc <b>“Vỏ phong hoá”</b> để phân biệt với đất.' },
    { id: 'grow', text: 'Cho đất hình thành từ đầu (kéo thời gian từ 0 đến 100%).' },
    { id: 'f6', text: 'Bấm vào đủ <b>6 nhân tố</b> hình thành đất.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0xbfdcf0);
    const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(5, 10, 8); scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xe6f3ff, 0x5a4630, .7));
    const W = 4, D = 3; const g = new THREE.Group(); scene.add(g);
    // nền cỏ xung quanh
    const lawnM = new THREE.MeshStandardMaterial({ color: 0x7aa555 });
    [[0, -6.5, 16, 10], [-5, 0, 6, 3], [5, 0, 6, 3]].forEach(([x, z, w, d]) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, .1, d), lawnM); m.position.set(x, -.05, z); scene.add(m); });
    // các tầng: hộp có nhiễu bề mặt ranh giới
    const tex = (c, dots) => { const cv = document.createElement('canvas'); cv.width = cv.height = 128; const x = cv.getContext('2d'); x.fillStyle = '#' + c.toString(16).padStart(6, '0'); x.fillRect(0, 0, 128, 128); for (let i = 0; i < dots; i++) { x.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '0,0,0'},${Math.random() * .25})`; const r = 1 + Math.random() * (dots < 120 ? 7 : 2); x.beginPath(); x.arc(Math.random() * 128, Math.random() * 128, r, 0, 7); x.fill(); } const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t; };
    const boxes = HOR.map((H, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(W, 1, D), new THREE.MeshStandardMaterial({ map: tex(H.c, i === 2 ? 60 : 400), roughness: 1 })); g.add(m); return m; });
    // đá trong tầng đá mẹ/đá gốc
    const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.16, 0), new THREE.MeshStandardMaterial({ color: 0xb08a50, flatShading: true }), 40); g.add(rocks);
    // rễ cây & giun
    const roots = new THREE.Group(); g.add(roots);
    for (let i = 0; i < 9; i++) { const pts = []; let p = new THREE.Vector3(-1.6 + Math.random() * 3.2, 0, D / 2 + .01); for (let k = 0; k < 6; k++) { pts.push(p.clone()); p = p.clone().add(new THREE.Vector3((Math.random() - .5) * .3, -.22, 0)); } roots.add(api.tube(pts, .018, 0xe8d9b0)); }
    const worm = api.tube([new THREE.Vector3(-.6, -.5, D / 2 + .02), new THREE.Vector3(-.4, -.6, D / 2 + .02), new THREE.Vector3(-.2, -.55, D / 2 + .02), new THREE.Vector3(0, -.62, D / 2 + .02)], .035, 0xd88a8a); roots.add(worm);
    // thực vật trên mặt
    const vegG = new THREE.Group(); g.add(vegG); const veg = vegetation();
    for (let i = 0; i < 26; i++) veg.add(i % 4 ? 'grass' : 'broad', -1.8 + Math.random() * 3.6, 0, -1.3 + Math.random() * 2.6, i % 4 ? .8 : .45); veg.build(vegG);
    // nhãn tầng
    const lbl = HOR.map(H => api.label(H.name, { pos: new THREE.Vector3(-W / 2 - .2, 0, D / 2), parent: g, onClick: { title: H.name, html: H.h, id: H.id, onPick: () => { if (H.id === 'mun') api.done('mun'); } } }));
    lbl.forEach(l => (l.element.style.transform += ''));
    // ngoặc “Đất” và “Vỏ phong hoá”
    const brk = (col) => new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: col }));
    const bDat = brk(0x2a2a2a), bVo = brk(0x2a2a2a); g.add(bDat, bVo);
    const lDat = api.label('Đất', { cls: 'big', pos: new THREE.Vector3(), parent: g, onClick: { title: 'Đất', html: 'Gồm tầng chứa mùn và tầng tích tụ – phần trên cùng của vỏ phong hoá, có <b>chất hữu cơ</b> và <b>độ phì</b>.', id: 'dat' } });
    const lVo = api.label('Vỏ phong hoá', { cls: 'big', pos: new THREE.Vector3(), parent: g, onClick: { title: 'Vỏ phong hoá', html: 'Toàn bộ sản phẩm phong hoá của đá gốc: gồm <b>đất</b> và <b>tầng đá mẹ</b>. Vỏ phong hoá dày hơn đất; tầng đá mẹ chưa có độ phì.', id: 'vo', onPick: () => api.done('diff') } });
    // biểu tượng nhân tố
    const fG = new THREE.Group(); scene.add(fG); const seenF = new Set();
    const icons = [
      () => new THREE.Mesh(new THREE.DodecahedronGeometry(.35, 0), new THREE.MeshStandardMaterial({ color: 0x8a8a8a, flatShading: true })),
      () => { const s = new THREE.Group(); s.add(new THREE.Mesh(new THREE.SphereGeometry(.3, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffc94a }))); const c = new THREE.Mesh(new THREE.SphereGeometry(.25, 12, 8), new THREE.MeshStandardMaterial({ color: 0xffffff })); c.position.set(.3, -.1, .1); s.add(c); return s; },
      () => { const s = new THREE.Group(); const v = vegetation(); v.add('broad', 0, -.4, 0, .6); v.build(s); return s; },
      () => new THREE.Mesh(new THREE.ConeGeometry(.45, .6, 4), new THREE.MeshStandardMaterial({ color: 0x7c8a5a, flatShading: true })),
      () => new THREE.Mesh(new THREE.TorusGeometry(.28, .06, 8, 24), new THREE.MeshStandardMaterial({ color: 0x2f7fd8 })),
      () => { const s = new THREE.Group(); const b = new THREE.Mesh(new THREE.CapsuleGeometry(.12, .35, 4, 8), new THREE.MeshStandardMaterial({ color: 0xe0a070 })); s.add(b); const h = new THREE.Mesh(new THREE.SphereGeometry(.12, 12, 8), new THREE.MeshStandardMaterial({ color: 0xe8c0a0 })); h.position.y = .38; s.add(h); return s; },
    ];
    FACTORS.forEach(([n, h], i) => {
      const a = (i / FACTORS.length) * Math.PI * 2 + .3; const o = icons[i](); o.position.set(Math.cos(a) * 5.4, 1.2, Math.sin(a) * 4.2 - 1.2); fG.add(o);
      const info = { title: 'Nhân tố: ' + n, html: h, id: 'f-' + n, onPick: () => { seenF.add(n); if (seenF.size >= 6) api.done('f6'); } };
      api.hotspot(o, info); api.label(n, { pos: new THREE.Vector3(0, .65, 0), parent: o, onClick: info });
    });
    api.onTick(dt => fG.children.forEach((o, i) => { o.rotation.y += dt * .5; o.position.y = 1.2 + Math.sin(performance.now() / 700 + i) * .08; }));

    // ===== tuổi đất: 0 → 1 =====
    const m4 = new THREE.Matrix4();
    const rockPos = Array.from({ length: 40 }, () => [(-W / 2 + .2) + Math.random() * (W - .4), Math.random(), (Math.random() - .5) * (D - .3)]);
    state.age = v => { state.prog = true; api.set('age', v); state.prog = false; };
    const apply = v => {
      // độ dày các tầng (đơn vị mô hình) tăng dần theo thời gian
      const th = [.9 * THREE.MathUtils.smoothstep(v, .5, 1), 1.0 * THREE.MathUtils.smoothstep(v, .35, .9), 1.0 * THREE.MathUtils.smoothstep(v, 0, .5), 1.4];
      let y = 0; const tops = [];
      th.forEach((t, i) => { const tt = Math.max(t, .001); boxes[i].scale.y = tt; boxes[i].position.y = y - tt / 2; boxes[i].visible = t > .01; tops.push([y, y - tt]); y -= tt; });
      g.position.y = 0;
      lbl.forEach((l, i) => { l.position.set(-W / 2 - .15, (tops[i][0] + tops[i][1]) / 2, D / 2); l.visible = th[i] > .15; });
      for (let i = 0; i < 40; i++) { const [x, f, z] = rockPos[i]; const k = i < 26 ? 2 : 3; const [a, b] = tops[k]; const s = th[k] > .05 ? 1 : 0; m4.makeScale(s, s, s).setPosition(x, b + (a - b) * f, z); rocks.setMatrixAt(i, m4); }
      rocks.instanceMatrix.needsUpdate = true;
      roots.visible = vegG.visible = v > .55; roots.scale.y = Math.max(.01, th[0] + th[1] * .5);
      const setB = (line, top, bot, x, lab) => { line.geometry.setFromPoints([new THREE.Vector3(x - .2, top, D / 2), new THREE.Vector3(x, top, D / 2), new THREE.Vector3(x, bot, D / 2), new THREE.Vector3(x - .2, bot, D / 2)]); lab.position.set(x + .55, (top + bot) / 2, D / 2); };
      setB(bDat, 0, tops[1][1], W / 2 + .3, lDat); setB(bVo, 0, tops[2][1], W / 2 + 1.4, lVo);
      bDat.visible = lDat.visible = th[1] > .2; bVo.visible = lVo.visible = th[2] > .2;
      api.readout(v < .999 ? `<b>Thời gian hình thành</b>: ${Math.round(v * 100)}%<br>${v < .3 ? 'Đá gốc đang bị phong hoá' : v < .6 ? 'Hình thành tầng đá mẹ, sinh vật bắt đầu phát triển' : 'Mùn tích luỹ, hình thành các tầng đất'}` : null);
      if (!state.prog) { if (v >= .999 && state.from0) api.done('grow'); if (v < .05) state.from0 = true; }
    };
    api.heading('Thời gian');
    api.slider('age', 'Thời gian hình thành đất', { min: 0, max: 1, step: .01, value: 1, format: v => `${Math.round(v * 100)}%` }, apply);
  },
};

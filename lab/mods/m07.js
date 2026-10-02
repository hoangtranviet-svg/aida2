// 3D-07 · Bài 7 – Nội lực và ngoại lực
import { THREE } from '../core.js';

const LAYER_COLS = [0xd9c08a, 0xb98a5a, 0xe2d2a8, 0x9c6b45, 0xcbb07a, 0x8a5a3a];

export default {
  id: '3D-07', code: 'DL10.B07', title: 'Nội lực và ngoại lực',
  objectives: [{ c: 'DL10.03.03', t: 'Khái niệm, nguyên nhân, tác động của nội lực, ngoại lực' }, { c: 'DL10.03.04', t: 'Phân tích sơ đồ, tranh ảnh về tác động của nội lực, ngoại lực' }],
  sources: [
    { t: 'USGS – Folds and faults (Geology in the Parks)', u: 'https://www.nps.gov/subjects/geology/geologic-structures.htm' },
    { t: 'British Geological Survey – Weathering and erosion', u: 'https://www.bgs.ac.uk/discovering-geology/' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 7 (Hình 7.1 – 7.3)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Thời gian trên mô hình được rút ngắn: các quá trình thực tế diễn ra trong hàng nghìn đến hàng triệu năm.',
  view: { pos: [0, 5, 13], target: [0, 0, 0] },
  steps: [
    { title: 'Nội lực là gì?', html: '<p><b>Nội lực</b> là lực phát sinh từ bên trong Trái Đất. Nguyên nhân chủ yếu do nguồn năng lượng trong lòng Trái Đất: sự phân huỷ các chất phóng xạ, sự dịch chuyển vật chất theo trọng lực, năng lượng của các phản ứng hoá học…</p><p>Nội lực tác động qua <b>vận động kiến tạo</b>: theo phương thẳng đứng (nâng lên, hạ xuống) và theo phương nằm ngang (uốn nếp, đứt gãy).</p>',
      enter: a => { a.state.show('fold'); a.set('p', 0); a.fly([0, 5, 13], [0, 0, 0]); } },
    { title: 'Hiện tượng uốn nếp', html: '<p>Các lớp đá có độ dẻo cao bị <b>nén ép theo phương nằm ngang</b> → uốn cong thành nếp uốn, không bị phá vỡ tính liên tục. Cường độ nén ép mạnh tạo nên các <b>dãy núi uốn nếp</b>.</p><div class="tip">Kéo thanh “Lực nén ép”.</div>',
      enter: a => { a.state.show('fold'); a.set('p', .75); a.fly([2, 4, 11], [0, .3, 0]); } },
    { title: 'Hiện tượng đứt gãy', html: '<p>Ở vùng đá cứng, vận động theo phương nằm ngang làm đá bị <b>gãy vỡ và dịch chuyển</b>:</p><ul><li>Bộ phận trồi lên: <b>địa luỹ</b> (VD: khối núi Con Voi).</li><li>Bộ phận sụt xuống: <b>địa hào</b> (VD: thung lũng sông Hồng, hồ Bai-can).</li></ul>',
      enter: a => { a.state.show('fault'); a.set('p', .7); a.fly([0, 5, 13], [0, 0, 0]); } },
    { title: 'Ngoại lực là gì?', html: '<p><b>Ngoại lực</b> là lực phát sinh ở bên ngoài, trên bề mặt Trái Đất. Nguyên nhân chủ yếu là <b>năng lượng bức xạ Mặt Trời</b>. Ngoại lực tác động thông qua các quá trình: <b>phong hoá → bóc mòn → vận chuyển → bồi tụ</b>.</p>',
      enter: a => { a.state.show('ero'); a.set('p', 0); a.fly([-2, 6, 13], [0, .5, 0]); } },
    { title: 'Ngoại lực san bằng địa hình', html: '<ul><li><b>Phong hoá</b>: đá bị phá huỷ, biến đổi tại chỗ (lí học, hoá học, sinh học).</li><li><b>Bóc mòn</b>: dòng nước, gió, sóng, băng hà… làm sản phẩm phong hoá dời khỏi vị trí ban đầu (xâm thực tạo khe rãnh, thung lũng).</li><li><b>Vận chuyển</b> và <b>bồi tụ</b>: vật liệu được mang đi rồi tích tụ ở nơi thấp (bãi bồi, đồng bằng châu thổ).</li></ul><p>Xu hướng chung: nội lực làm bề mặt <b>gồ ghề</b>, ngoại lực có xu hướng <b>san bằng</b>.</p><div class="tip">Kéo thanh “Thời gian”.</div>',
      enter: a => { a.state.show('ero'); a.set('p', .8); a.fly([4, 5, 11], [0, .3, 0]); } },
  ],
  tasks: [
    { id: 'fold', text: 'Tăng lực nén ép để tạo <b>nếp uốn</b> rõ nhất.' },
    { id: 'horst', text: 'Chuyển sang <b>địa luỹ</b> và bấm vào khối trồi lên.' },
    { id: 'graben', text: 'Chuyển sang <b>địa hào</b> và bấm vào khối sụt xuống.' },
    { id: 'delta', text: 'Kéo thời gian đến cuối để thấy <b>bồi tụ</b> tạo đồng bằng ở chân núi.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0xb7d6ee);
    const sun = new THREE.DirectionalLight(0xffffff, 2.4); sun.position.set(-5, 10, 8); scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xe6f3ff, 0x5a4630, .7));
    const groups = { fold: new THREE.Group(), fault: new THREE.Group(), ero: new THREE.Group() };
    Object.values(groups).forEach(g => scene.add(g));
    const L = 10, D = 4, TH = .45;

    // ===== uốn nếp =====
    const folds = [];
    LAYER_COLS.forEach((c, i) => {
      const geo = new THREE.BoxGeometry(L, TH, D, 120, 1, 1); const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: c, roughness: .95 }));
      groups.fold.add(m); folds.push({ m, base: geo.attributes.position.array.slice(), y0: -i * TH });
    });
    const pushL = api.arrow(new THREE.Vector3(-8, -1, 0), new THREE.Vector3(-5.6, -1, 0), 0xd23b2a, .6, .35); const pushR = api.arrow(new THREE.Vector3(8, -1, 0), new THREE.Vector3(5.6, -1, 0), 0xd23b2a, .6, .35);
    groups.fold.add(pushL, pushR);
    api.label('Lực nén ép', { cls: 'warm', pos: new THREE.Vector3(-7, -.2, 0), parent: groups.fold });
    api.label('Lực nén ép', { cls: 'warm', pos: new THREE.Vector3(7, -.2, 0), parent: groups.fold });
    const lFold = api.label('Nếp uốn → dãy núi uốn nếp', { pos: new THREE.Vector3(0, 2.6, 0), parent: groups.fold });
    // ===== đứt gãy =====
    const blocks = [];
    [-1, 0, 1].forEach(k => {
      const b = new THREE.Group();
      LAYER_COLS.slice(0, 5).forEach((c, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(L / 3 - .04, TH, D), new THREE.MeshStandardMaterial({ color: c, roughness: .95 })); m.position.y = -i * TH; b.add(m); });
      b.position.x = k * L / 3; groups.fault.add(b); blocks.push(b);
    });
    const midInfo = () => state.ftype === 'horst'
      ? { title: 'Địa luỹ', html: 'Bộ phận <b>trồi lên</b> giữa các đường đứt gãy. Ví dụ ở Việt Nam: dãy núi Con Voi (Lào Cai – Yên Bái).', id: 'horst', onPick: () => api.done('horst') }
      : { title: 'Địa hào', html: 'Bộ phận <b>sụt xuống</b> giữa các đường đứt gãy. Ví dụ: thung lũng sông Hồng, hồ Bai-can (Nga), thung lũng tách giãn Đông Phi.', id: 'graben', onPick: () => api.done('graben') };
    blocks[1].children.forEach(m => api.hotspot(m, midInfo));
    const lMid = api.label('', { cls: 'big', pos: new THREE.Vector3(0, 1.3, 0), parent: blocks[1] });
    const faultLines = new THREE.Group(); groups.fault.add(faultLines);
    [-L / 6, L / 6].forEach(x => { const l = new THREE.Mesh(new THREE.BoxGeometry(.04, 3.2, D + .05), new THREE.MeshBasicMaterial({ color: 0x3a2a1a })); l.position.set(x, -1, 0); faultLines.add(l); });
    api.label('Đường đứt gãy', { cls: 'sm', pos: new THREE.Vector3(L / 6, -2.9, D / 2), parent: groups.fault });
    state.ftype = 'horst';
    // ===== xâm thực – bồi tụ =====
    const ero = groups.ero;
    const geo = new THREE.PlaneGeometry(12, 7, 150, 90); geo.rotateX(-Math.PI / 2);
    const P = geo.attributes.position; const base = P.array.slice(); const col = new Float32Array(P.count * 3);
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const terr = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 })); ero.add(terr);
    const skirt = new THREE.Mesh(new THREE.BoxGeometry(12, 1.2, 7), new THREE.MeshStandardMaterial({ color: 0x7a5a3a })); skirt.position.y = -.62; ero.add(skirt);
    const sea = new THREE.Mesh(new THREE.BoxGeometry(2.4, .5, 7), new THREE.MeshStandardMaterial({ color: 0x2f7fc1, transparent: true, opacity: .75 })); sea.position.set(-4.8, -.12, 0); ero.add(sea);
    const riverPts = []; const rz = x => .5 * Math.sin(x * .6);
    const H0 = (x, z) => 3.6 * Math.exp(-(((x - 2.5) ** 2) / 4 + (z ** 2) / 5)) + .9 * Math.exp(-(((x - 4) ** 2) / 1.5 + ((z - 2) ** 2) / 2));
    const hAt = (x, z, t) => {
      const valley = .9 * t * Math.exp(-((z - rz(x)) ** 2) / .35) * THREE.MathUtils.smoothstep(x, -3, 3.5);
      const deposit = .55 * t * Math.exp(-(((x + 2.6) ** 2) / 1.6 + (z ** 2) / 6));
      return Math.max(H0(x, z) * (1 - .45 * t) - valley + deposit, x < -3.6 ? -.3 : 0);
    };
    const river = new THREE.Group(); ero.add(river);
    const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.07, 0), new THREE.MeshStandardMaterial({ color: 0x8a7a6a, flatShading: true }), 120); ero.add(rocks);
    const rd = Array.from({ length: 120 }, () => ({ k: Math.random(), dz: (Math.random() - .5) * .3 }));
    const lbls = [
      api.label('Phong hoá (đá vỡ vụn)', { cls: 'sm', pos: new THREE.Vector3(2.5, 4.2, 0), parent: ero }),
      api.label('Bóc mòn, xâm thực tạo thung lũng', { cls: 'sm', pos: new THREE.Vector3(1, 2.4, 1.6), parent: ero }),
      api.label('Vận chuyển', { cls: 'sm', pos: new THREE.Vector3(-.8, 1.2, 1.4), parent: ero }),
      api.label('Bồi tụ → đồng bằng', { cls: 'sm warm', pos: new THREE.Vector3(-2.6, 1.1, -1.4), parent: ero }),
    ];
    const m4 = new THREE.Matrix4();
    let riverCurve = null;
    const updEro = t => {
      for (let i = 0; i < P.count; i++) {
        const x = base[i * 3], z = base[i * 3 + 2]; const y = hAt(x, z, t); P.setY(i, y);
        const dep = .55 * t * Math.exp(-(((x + 2.6) ** 2) / 1.6 + (z ** 2) / 6));
        const c = y > 2.6 ? [.55, .52, .5] : dep > .15 ? [.78, .7, .45] : y > .8 ? [.38, .52, .3] : [.5, .66, .36];
        col.set(c, i * 3);
      }
      P.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.computeVertexNormals();
      river.clear(); const pts = []; for (let x = 3.2; x >= -4; x -= .2) pts.push(new THREE.Vector3(x, hAt(x, rz(x), t) + .05, rz(x)));
      riverCurve = new THREE.CatmullRomCurve3(pts); river.add(api.tube(riverCurve.getPoints(80), .06 + t * .04, 0x2f86d8));
      lbls[1].visible = t > .2; lbls[3].visible = t > .6; if (t > .97) api.done('delta');
    };
    api.onTick(dt => {
      if (state.cur !== 'ero' || !riverCurve) return;
      for (let i = 0; i < 120; i++) { const d = rd[i]; d.k = (d.k + dt * .08) % 1; const p = riverCurve.getPointAt(d.k); m4.makeTranslation(p.x, p.y + .03, p.z + d.dz); rocks.setMatrixAt(i, m4); }
      rocks.instanceMatrix.needsUpdate = true;
    });

    const apply = p => {
      if (state.cur === 'fold') {
        const A = p * 1.3, squeeze = 1 - p * .25;
        folds.forEach(({ m, base, y0 }) => { const a = m.geometry.attributes.position; for (let i = 0; i < a.count; i++) { const x = base[i * 3] * squeeze; a.setX(i, x); a.setY(i, base[i * 3 + 1] + y0 + A * Math.sin(x * .9 + .3)); } a.needsUpdate = true; m.geometry.computeVertexNormals(); });
        pushL.position.x = -8 + p * 1.6; pushR.position.x = 8 - p * 1.6; lFold.visible = p > .5; if (p > .95) api.done('fold');
      } else if (state.cur === 'fault') {
        const dy = (state.ftype === 'horst' ? 1 : -1) * p * 1.4; blocks[1].position.y = dy; blocks[0].position.y = blocks[2].position.y = -dy * .15;
        api.setLabelText(lMid, state.ftype === 'horst' ? 'Địa luỹ (trồi lên)' : 'Địa hào (sụt xuống)'); lMid.visible = p > .3;
      } else if (state.cur === 'ero') updEro(p);
    };
    state.show = n => { state.cur = n; for (const [k, g] of Object.entries(groups)) g.visible = k === n; cf.style.display = n === 'fault' ? '' : 'none'; apply(api.get('p')); sp.labelText(n === 'fold' ? 'Lực nén ép' : n === 'fault' ? 'Mức độ dịch chuyển' : 'Thời gian (triệu năm)'); };
    api.heading('Mô phỏng');
    const sp = api.slider('p', 'Mức độ', { min: 0, max: 1, step: .01, value: .6, format: v => `${Math.round(v * 100)}%` }, apply);
    sp.labelText = t => { sp.input.parentElement.querySelector('label span').textContent = t; };
    const base0 = api.controlsBox; const cf = document.createElement('div'); base0.append(cf); api.controlsBox = cf;
    api.choice('ftype', 'Kiểu đứt gãy', [{ v: 'horst', t: 'Địa luỹ' }, { v: 'graben', t: 'Địa hào' }], 'horst', v => { state.ftype = v; apply(api.get('p')); });
    api.controlsBox = base0;
  },
};

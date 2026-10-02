// 3D-18 · Bài 18 – Quy luật địa đới và quy luật phi địa đới
import { THREE, makeGlobe, latLonToVec3, starfield } from '../core.js';
import { earthTexture, NATURAL_ZONES } from '../earth.js';
import { vegetation, beltMountain } from '../veg.js';

export default {
  id: '3D-18', code: 'DL10.B18', title: 'Quy luật địa đới và phi địa đới',
  objectives: [{ c: 'DL10.07.03', t: 'Khái niệm, biểu hiện, ý nghĩa của quy luật địa đới và phi địa đới' }, { c: 'DL10.07.04', t: 'Giải thích hiện tượng tự nhiên bằng các quy luật địa lí' }],
  sources: [
    { t: 'NASA Earth Observatory – Mission: Biomes', u: 'https://earthobservatory.nasa.gov/biome' },
    { t: 'National Geographic Education – Latitude and climate', u: 'https://education.nationalgeographic.org/resource/climate-zones/' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 18', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Ranh giới các đới tự nhiên trên quả địa cầu vẽ theo vĩ độ (giản lược). Mặt cắt địa ô dựng theo vĩ tuyến khoảng 40°B ở Bắc Mỹ, không theo tỉ lệ.',
  view: { pos: [0, 1.2, 6.4], target: [0, 0, 0] },
  steps: [
    { title: 'Nguyên nhân của quy luật địa đới', html: '<p><b>Quy luật địa đới</b> là sự thay đổi có quy luật của các thành phần địa lí và cảnh quan theo <b>vĩ độ</b> (từ Xích đạo về hai cực).</p><p>Nguyên nhân: Trái Đất hình cầu → góc chiếu của tia sáng Mặt Trời giảm dần từ Xích đạo về cực → lượng bức xạ mặt trời giảm dần.</p><div class="tip">Quan sát chùm tia sáng song song chiếu vào quả địa cầu.</div>',
      enter: a => { a.state.show('globe'); a.state.rays(true); a.fly([0, 1.2, 6.4], [0, 0, 0]); } },
    { title: 'Biểu hiện: các đới tự nhiên', html: '<p>Biểu hiện của quy luật địa đới: các vòng đai nhiệt, các đai khí áp và đới gió, các đới khí hậu, <b>các nhóm đất và kiểu thảm thực vật</b> – đều phân bố thành dải theo vĩ độ.</p><div class="tip">Bấm vào tên các đới tự nhiên.</div>',
      enter: a => { a.state.show('globe'); a.state.rays(false); a.fly([0, 1.5, 6], [0, 0, 0]); } },
    { title: 'Quy luật phi địa đới: đai cao', html: '<p><b>Quy luật phi địa đới</b> là quy luật phân bố không phụ thuộc vào tính chất phân bố theo địa đới. Nguyên nhân: nguồn năng lượng bên trong Trái Đất tạo nên sự phân chia bề mặt thành lục địa, đại dương và địa hình núi cao.</p><p><b>Quy luật đai cao</b>: sự thay đổi có quy luật của các thành phần tự nhiên theo <b>độ cao địa hình</b> (do nhiệt độ giảm, độ ẩm thay đổi khi lên cao).</p>',
      enter: a => { a.state.show('mtn'); a.fly([0, 6, 13], [0, 3, 0]); } },
    { title: 'Quy luật phi địa đới: địa ô', html: '<p><b>Quy luật địa ô</b>: sự thay đổi có quy luật của các thành phần tự nhiên và cảnh quan theo <b>kinh độ</b>, do sự phân bố đất liền – biển, đại dương làm khí hậu lục địa thay đổi từ đông sang tây; ngoài ra còn do các dãy núi chạy theo hướng kinh tuyến.</p><p>Ví dụ ở Bắc Mỹ, khoảng vĩ tuyến 40°B: rừng ven Thái Bình Dương → núi, hoang mạc, bán hoang mạc → thảo nguyên → rừng lá rộng ven Đại Tây Dương.</p>',
      enter: a => { a.state.show('dia'); a.fly([0, 9, 21], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'rays', text: 'Bấm vào chùm tia sáng ở <b>vùng cực</b> để so sánh với Xích đạo.' },
    { id: 'z3', text: 'Bấm vào <b>3 đới tự nhiên</b> trên quả địa cầu.' },
    { id: 'snow', text: 'Trên ngọn núi, bấm vào vành đai <b>băng tuyết</b>.' },
    { id: 'steppe', text: 'Trên mặt cắt địa ô, bấm vào vùng <b>thảo nguyên</b> và giải thích vì sao nó ở sâu trong lục địa.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    const stars = starfield(scene);
    const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(6, 6, 9); scene.add(key);
    scene.add(new THREE.HemisphereLight(0xdff0ff, 0x6b5a3a, .5));
    const groups = { globe: new THREE.Group(), mtn: new THREE.Group(), dia: new THREE.Group() };
    Object.values(groups).forEach(g => scene.add(g));
    // ===== quả địa cầu đới tự nhiên =====
    const tex = await earthTexture({ mode: 'zones' });
    const GR = 2; const globe = makeGlobe(api, { radius: GR, texture: tex, lines: [0, 23.45, -23.45, 66.55, -66.55] }); groups.globe.add(globe);
    const gc = { center: new THREE.Vector3(), radius: GR };
    const zl = new THREE.Group(); groups.globe.add(zl); const seenZ = new Set();
    NATURAL_ZONES.forEach(z => { const lat = (z.min + z.max) / 2; api.label(z.name, { cls: 'sm', pos: latLonToVec3(Math.min(lat, 82), -45, GR * 1.04), parent: zl, globe: gc, onClick: { title: z.name, html: `Phân bố khoảng ${z.min}° – ${z.max}° (gần đúng) ở mỗi bán cầu; thay đổi theo vĩ độ là biểu hiện của <b>quy luật địa đới</b>.`, id: z.name, onPick: () => { seenZ.add(z.name); if (seenZ.size >= 3) api.done('z3'); } } }); });
    const rays = new THREE.Group(); groups.globe.add(rays);
    [0, 30, 60, 80].forEach(lat => {
      const p = latLonToVec3(lat, 0, GR); const y = p.y; const x = Math.sqrt(Math.max(GR * GR - y * y, 0));
      const beam = new THREE.Mesh(new THREE.BoxGeometry(6, .1, .1), new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: .7 })); beam.position.set(x + 3, y, 0); rays.add(beam);
      const spot = new THREE.Mesh(new THREE.SphereGeometry(.12, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffd23f })); spot.position.set(x, y, 0); spot.scale.set(.3, 1 / Math.max(Math.cos(lat * Math.PI / 180), .18), 1.0); rays.add(spot);
      const info = { title: `Tia sáng ở vĩ độ ${lat}°`, html: lat === 0 ? 'Tia sáng chiếu gần như <b>vuông góc</b> → năng lượng tập trung trên diện tích nhỏ → nóng.' : `Tia sáng chiếu <b>xiên</b> (góc nhỏ) → cùng chùm tia phải trải trên diện tích lớn hơn khoảng ${(1 / Math.cos(lat * Math.PI / 180)).toFixed(1).replace('.', ',')} lần so với ở Xích đạo → lạnh hơn.`, id: 'ray' + lat, onPick: () => { if (lat >= 60) api.done('rays'); } };
      api.hotspot(beam, info);
    });
    api.label('Tia sáng Mặt Trời (song song)', { cls: 'sm warm', pos: new THREE.Vector3(4.8, 2.3, 0), parent: rays });
    state.rays = v => { rays.visible = v; };
    api.onTick(dt => { if (state.cur === 'globe') globe.rotation.y += dt * .06; });

    // ===== núi: đai cao =====
    {
      const g = groups.mtn;
      const belts = [
        { to: .25, kind: 'tropic', color: [.2, .45, .22], name: 'Rừng nhiệt đới' },
        { to: .45, kind: 'broad', color: [.36, .56, .28], name: 'Rừng lá rộng' },
        { to: .65, kind: 'conifer', color: [.22, .4, .28], name: 'Rừng lá kim' },
        { to: .8, kind: 'shrub', color: [.55, .58, .45], name: 'Đồng cỏ núi cao, đài nguyên' },
        { to: 1.01, kind: null, color: [.95, .97, 1], name: 'Băng tuyết' },
      ];
      const m = beltMountain({ r: 5, H: 7, belts, density: 1.3 }); g.add(m);
      belts.forEach((b, i) => {
        const f = i === 0 ? b.to / 2 : (belts[i - 1].to + b.to) / 2; const y = f * 7; const rr = 5 * Math.acos(Math.pow(Math.min(.99, f), 1 / 1.6)) * 2 / Math.PI;
        api.label(`${b.name}`, { pos: new THREE.Vector3(rr * .6, y + .2, rr * .8), parent: g, onClick: { title: b.name, html: `Vành đai ${b.name.toLowerCase()} – độ cao khoảng ${Math.round((i ? belts[i - 1].to : 0) * 7000 / 1.4)} – ${Math.round(Math.min(b.to, 1) * 7000 / 1.4)} m (minh hoạ cho một núi cao ở vùng nhiệt đới).`, id: 'belt' + i, onPick: () => { if (!b.kind) api.done('snow'); } } });
      });
      const ax = api.arrow(new THREE.Vector3(-6.5, 0, 0), new THREE.Vector3(-6.5, 7.6, 0), 0x2f7fd8, .5, .25); g.add(ax);
      api.label('Độ cao tăng → nhiệt độ giảm', { pos: new THREE.Vector3(-6.5, 8.1, 0), parent: g });
    }

    // ===== mặt cắt địa ô (theo kinh độ) =====
    {
      const g = groups.dia; const D = 5;
      const segs = [
        { n: 'Thái Bình Dương', w: 3, c: 0x2a72b8, sea: true },
        { n: 'Rừng lá kim ven biển', w: 3, c: 0x2f5a3c, k: 'conifer', d: 1, h: 'Ven Thái Bình Dương, nhận nhiều hơi ẩm từ biển và gió Tây ôn đới → rừng lá kim rậm rạp.' },
        { n: 'Núi (dãy Coóc-đi-e)', w: 3, c: 0x7a7a6a, mtn: true, h: 'Dãy núi chạy theo hướng kinh tuyến chắn gió ẩm từ biển → sườn đông khô hạn.' },
        { n: 'Hoang mạc, bán hoang mạc', w: 3, c: 0xd9bf88, k: 'cactus', d: .2, h: 'Nằm khuất sau núi, xa biển → khô hạn, thực vật nghèo nàn.' },
        { n: 'Thảo nguyên', w: 3.5, c: 0xb4b060, k: 'grass', d: 1.4, h: 'Sâu trong nội địa, lượng mưa vừa phải, không đủ cho rừng phát triển → đồng cỏ rộng lớn (thảo nguyên Bắc Mỹ, vựa lúa mì).', id: 'steppe' },
        { n: 'Rừng lá rộng, rừng hỗn hợp', w: 3.5, c: 0x4f8a3a, k: 'broad', d: 1, h: 'Gần Đại Tây Dương, khí hậu ẩm hơn → rừng lá rộng và rừng hỗn hợp.' },
        { n: 'Đại Tây Dương', w: 3, c: 0x2a72b8, sea: true },
      ];
      const total = segs.reduce((s, x) => s + x.w, 0); let x = -total / 2; const veg = vegetation();
      segs.forEach((S, i) => {
        const cx = x + S.w / 2;
        const ground = new THREE.Mesh(new THREE.BoxGeometry(S.w, S.sea ? .25 : .4, D), new THREE.MeshStandardMaterial({ color: S.c, roughness: S.sea ? .2 : 1, transparent: !!S.sea, opacity: S.sea ? .85 : 1 })); ground.position.set(cx, S.sea ? -.15 : 0, 0); g.add(ground);
        if (S.mtn) { const m = new THREE.Mesh(new THREE.ConeGeometry(1.4, 2.6, 7, 3), new THREE.MeshStandardMaterial({ color: 0x8a8a78, flatShading: true })); m.position.set(cx, 1.5, 0); m.scale.z = 2.2; g.add(m); const sn = new THREE.Mesh(new THREE.ConeGeometry(.45, .8, 7), new THREE.MeshStandardMaterial({ color: 0xffffff })); sn.position.set(cx, 2.45, 0); sn.scale.z = 2.2; g.add(sn); }
        if (S.k) for (let k = 0; k < 40 * S.d; k++) veg.add(S.k, x + .15 + Math.random() * (S.w - .3), .2, (Math.random() - .5) * (D - .4), S.k === 'grass' ? 1 : .55);
        const info = S.h ? { title: S.n, html: S.h, id: S.n, onPick: () => { if (S.id === 'steppe') api.done('steppe'); } } : null;
        api.label(S.n, { cls: 'sm' + (S.sea ? ' cold' : ''), pos: new THREE.Vector3(cx, S.mtn ? 3.4 : 1.6, D / 2), parent: g, onClick: info || undefined });
        x += S.w;
      });
      veg.build(g);
      g.add(api.arrow(new THREE.Vector3(-total / 2 + 1, 3.6, -1), new THREE.Vector3(-total / 2 + 7, 3.6, -1), 0x9fd3ff, .4, .2));
      api.label('Gió ẩm từ biển', { cls: 'sm cold', pos: new THREE.Vector3(-total / 2 + 3.5, 4.1, -1), parent: g });
      api.label('Tây ⟵ ⟶ Đông (dọc vĩ tuyến ≈ 40°B, Bắc Mỹ)', { pos: new THREE.Vector3(0, -.9, D / 2 + .3), parent: g });
    }

    state.show = n => { state.cur = n; for (const [k, g] of Object.entries(groups)) g.visible = k === n; stars.visible = n === 'globe'; scene.background = n === 'globe' ? null : new THREE.Color(0xa9d4f2);
      api.legend(n === 'globe' ? NATURAL_ZONES.map(z => ({ c: `rgb(${z.c.join(',')})`, t: z.name })) : null); };
  },
};

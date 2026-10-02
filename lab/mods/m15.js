// 3D-15 · Bài 15 – Sinh quyển
import { THREE } from '../core.js';
import { vegetation, beltMountain } from '../veg.js';

// Hình 15 SGK: các vành đai thực vật theo vĩ độ (từ vùng nhiệt đới lên cực) và theo độ cao (ở vùng nhiệt đới)
const ZONES = [
  { n: 'Rừng nhiệt đới', k: 'tropic', d: .9, c: [.18, .42, .2], h: 'Khí hậu nóng ẩm quanh năm, mưa nhiều; rừng rậm nhiều tầng, đa dạng sinh học cao nhất. Đất đỏ vàng (feralit).' },
  { n: 'Xa van', k: 'acacia', d: .25, g: .6, c: [.62, .62, .3], h: 'Khí hậu nóng, có mùa khô kéo dài; đồng cỏ cao xen cây bụi, cây gỗ thấp (keo, bao báp). Đất đỏ.' },
  { n: 'Hoang mạc, bán hoang mạc', k: 'cactus', d: .12, c: [.86, .74, .5], h: 'Khí hậu rất khô hạn, nhiệt độ ngày đêm chênh lệch lớn; thực vật nghèo nàn, thích nghi với khô hạn (xương rồng, cây bụi gai).' },
  { n: 'Thảo nguyên ôn đới', k: 'grass', d: .9, c: [.62, .66, .32], h: 'Khí hậu ôn đới lục địa nửa khô hạn; chủ yếu là cỏ. Đất đen màu mỡ, thuận lợi trồng lúa mì.' },
  { n: 'Rừng lá rộng ôn đới', k: 'broad', d: .7, c: [.36, .56, .26], h: 'Khí hậu ôn đới hải dương ẩm; cây rụng lá vào mùa đông (sồi, dẻ). Đất nâu, xám.' },
  { n: 'Rừng hỗn hợp', k: 'mix', d: .7, c: [.3, .5, .3], h: 'Chuyển tiếp giữa rừng lá rộng và rừng lá kim: xen kẽ cây lá rộng và cây lá kim.' },
  { n: 'Rừng lá kim', k: 'conifer', d: .8, c: [.2, .38, .27], h: 'Khí hậu ôn đới lạnh, mùa đông dài; rừng thông, tùng, vân sam (rừng tai-ga). Đất pốt-dôn.' },
  { n: 'Đài nguyên', k: 'shrub', d: .6, c: [.55, .58, .45], h: 'Khí hậu cận cực lạnh; rêu, địa y, cây bụi thấp. Mùa hè ngắn, đất bị đóng băng nhiều tháng.' },
  { n: 'Hoang mạc cực', k: 'ice', d: .25, c: [.92, .95, .97], h: 'Băng tuyết phủ gần như quanh năm; thực vật hầu như không phát triển được.' },
];
const BELTS = [
  { to: .3, kind: 'tropic', color: [.2, .45, .22], name: 'Rừng nhiệt đới' },
  { to: .5, kind: 'broad', color: [.36, .56, .28], name: 'Rừng lá rộng ôn đới' },
  { to: .7, kind: 'conifer', color: [.22, .4, .28], name: 'Rừng lá kim' },
  { to: .85, kind: 'shrub', color: [.55, .58, .45], name: 'Đài nguyên' },
  { to: 1.01, kind: null, color: [.95, .97, 1], name: 'Băng tuyết' },
];

export default {
  id: '3D-15', code: 'DL10.B15', title: 'Sinh quyển và các vành đai thực vật',
  objectives: [{ c: 'DL10.06.03', t: 'Khái niệm, giới hạn, đặc điểm sinh quyển; nhân tố ảnh hưởng tới sinh vật' }, { c: 'DL10.06.04', t: 'Phân tích sơ đồ, hình vẽ phân bố sinh vật' }],
  sources: [
    { t: 'NASA Earth Observatory – Mission: Biomes', u: 'https://earthobservatory.nasa.gov/biome' },
    { t: 'National Geographic Education – Biome', u: 'https://education.nationalgeographic.org/resource/biome/' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 15 (Hình 15)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Mô hình 3D dựng lại theo bố cục Hình 15 SGK: dải ngang thể hiện thay đổi theo vĩ độ, ngọn núi bên trái thể hiện thay đổi theo độ cao ở vùng nhiệt đới. Không theo tỉ lệ.',
  view: { pos: [0, 10, 22], target: [0, 1, 0] },
  steps: [
    { title: 'Sinh quyển là gì?', html: '<p><b>Sinh quyển</b> là một trong những bộ phận cấu tạo nên lớp vỏ Trái Đất, nơi có sự sống tồn tại.</p><p>Giới hạn: phía trên tới nơi <b>tiếp xúc với lớp ô-dôn</b>; phía dưới xuống tận <b>đáy sâu của các hố đại dương</b> và tới <b>đáy lớp vỏ phong hoá</b> trên đất liền. Như vậy sinh quyển gồm: phần thấp của khí quyển, toàn bộ thuỷ quyển và phần trên của thạch quyển.</p>',
      enter: a => { a.state.show('limit'); a.fly([0, 2, 15], [0, .5, 0]); } },
    { title: 'Đặc điểm của sinh quyển', html: '<ul><li>Khối lượng nhỏ hơn nhiều so với các quyển khác.</li><li>Có khả năng <b>tích luỹ năng lượng</b> nhờ quang hợp của cây xanh.</li><li>Có mối quan hệ mật thiết với các quyển khác: tham gia vòng tuần hoàn nước, hình thành đất, thay đổi thành phần khí quyển.</li></ul>',
      enter: a => { a.state.show('limit'); a.fly([-6, 3, 13], [0, 0, 0]); } },
    { title: 'Khí hậu: thay đổi theo vĩ độ', html: '<p>Nhiệt độ, ánh sáng, lượng mưa thay đổi từ Xích đạo về cực → thảm thực vật thay đổi thành các vành đai: rừng nhiệt đới → xa van → hoang mạc → thảo nguyên → rừng lá rộng → rừng hỗn hợp → rừng lá kim → đài nguyên → hoang mạc cực.</p><div class="tip">Bấm vào tên từng vành đai. Dùng thanh “Đi dọc vĩ tuyến” để di chuyển camera.</div>',
      enter: a => { a.state.show('strip'); a.fly([-1, 12, 27], [-1, 1, 0]); } },
    { title: 'Địa hình: thay đổi theo độ cao', html: '<p>Lên cao, nhiệt độ giảm, độ ẩm thay đổi → các vành đai thực vật thay đổi theo độ cao <b>tương tự như thay đổi theo vĩ độ</b>. Ở vùng nhiệt đới: rừng nhiệt đới → rừng lá rộng ôn đới → rừng lá kim → đài nguyên → băng tuyết.</p><p>Độ dốc và hướng sườn cũng ảnh hưởng tới nhiệt, ẩm, ánh sáng mà thực vật nhận được.</p>',
      enter: a => { a.state.show('strip'); a.fly([-20, 6, 8], [-13, 2.5, -1]); } },
    { title: 'Đất, sinh vật và con người', html: '<ul><li><b>Đất</b>: cấu trúc, độ pH, độ phì ảnh hưởng tới sự phân bố thực vật.</li><li><b>Sinh vật</b>: thức ăn quyết định sự phân bố của động vật.</li><li><b>Con người</b>: mở rộng phân bố cây trồng, vật nuôi (tích cực); phá rừng, thu hẹp môi trường sống (tiêu cực).</li></ul><div class="tip">Bật “Tác động phá rừng” để thấy rừng nhiệt đới bị thu hẹp.</div>',
      enter: a => { a.state.show('strip'); a.fly([-9, 7, 10], [-8, 1, 0]); } },
  ],
  tasks: [
    { id: 'top', text: 'Bấm vào <b>giới hạn trên</b> của sinh quyển.' },
    { id: 'z3', text: 'Bấm vào <b>3 vành đai thực vật</b> theo vĩ độ.' },
    { id: 'conifer', text: 'Trên ngọn núi, bấm vào vành đai <b>rừng lá kim</b>. Ở dải vĩ độ, vành đai này nằm ở đâu?' },
    { id: 'defor', text: 'Bật <b>tác động phá rừng</b> và quan sát.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0xa9d4f2);
    const sun = new THREE.DirectionalLight(0xffffff, 2.3); sun.position.set(-6, 14, 10); scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xdff0ff, 0x6b5a3a, .7));
    const groups = { limit: new THREE.Group(), strip: new THREE.Group() };
    Object.values(groups).forEach(g => scene.add(g));

    // ===== A. giới hạn sinh quyển =====
    {
      const g = groups.limit; const D = 3;
      const atm = new THREE.Mesh(new THREE.BoxGeometry(12, 5, D), new THREE.MeshStandardMaterial({ color: 0x7fb8ef, transparent: true, opacity: .25, depthWrite: false })); atm.position.y = 2.5; g.add(atm);
      const oz = new THREE.Mesh(new THREE.BoxGeometry(12, .25, D), new THREE.MeshStandardMaterial({ color: 0xffa040, transparent: true, opacity: .6 })); oz.position.y = 4.4; g.add(oz);
      const ocean = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, D), new THREE.MeshStandardMaterial({ color: 0x2a6fb3, transparent: true, opacity: .8 })); ocean.position.set(-3, -1.6, 0); g.add(ocean);
      const land = new THREE.Mesh(new THREE.BoxGeometry(6, .5, D), new THREE.MeshStandardMaterial({ color: 0x8a6a40 })); land.position.set(3, -.25, 0); g.add(land);
      const rock = new THREE.Mesh(new THREE.BoxGeometry(6, 2.7, D), new THREE.MeshStandardMaterial({ color: 0x6a6a70 })); rock.position.set(3, -1.85, 0); g.add(rock);
      const floor = new THREE.Mesh(new THREE.BoxGeometry(6, .4, D), new THREE.MeshStandardMaterial({ color: 0x6a6a70 })); floor.position.set(-3, -3.4, 0); g.add(floor);
      const veg = vegetation(); for (let i = 0; i < 40; i++) veg.add(Math.random() < .5 ? 'broad' : 'conifer', .4 + Math.random() * 5.3, 0, (Math.random() - .5) * 2.6, .5); veg.build(g);
      // vỏ bọc sinh quyển
      const env = new THREE.Mesh(new THREE.BoxGeometry(12.2, 7.9, D + .2), new THREE.MeshBasicMaterial({ color: 0x40ff80, transparent: true, opacity: .12, depthWrite: false }));
      env.position.y = (4.4 + -3.2) / 2 + .05; env.scale.y = (4.4 + 3.2) / 7.9; g.add(env);
      const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(12.2, 7.6, D + .2)), new THREE.LineBasicMaterial({ color: 0x40ff80 })); edge.position.y = .6; g.add(edge);
      api.label('Giới hạn trên: tiếp xúc lớp ô-dôn', { cls: 'warm', pos: new THREE.Vector3(0, 4.9, D / 2), parent: g, onClick: { title: 'Giới hạn trên của sinh quyển', html: 'Tới nơi tiếp xúc với lớp ô-dôn của khí quyển. Phần lớn sinh vật tập trung ở tầng đối lưu gần mặt đất, nhưng bào tử, vi khuẩn có thể bị gió đưa lên rất cao.', id: 'top', onPick: () => api.done('top') } });
      api.label('Đáy các hố đại dương sâu nhất', { cls: 'cold', pos: new THREE.Vector3(-3, -3.3, D / 2 + .1), parent: g });
      api.label('Đáy lớp vỏ phong hoá', { cls: 'sm', pos: new THREE.Vector3(3, -.55, D / 2 + .1), parent: g });
      api.label('Khí quyển (tầng đối lưu)', { cls: 'sm', pos: new THREE.Vector3(-4, 2.2, D / 2), parent: g });
      api.label('Thuỷ quyển', { cls: 'sm cold', pos: new THREE.Vector3(-3, -1.4, D / 2 + .1), parent: g });
      api.label('Thạch quyển', { cls: 'sm', pos: new THREE.Vector3(3, -2.2, D / 2 + .1), parent: g });
      api.label('SINH QUYỂN', { cls: 'big', pos: new THREE.Vector3(6.6, 1, 0), parent: g });
    }

    // ===== B. dải vành đai thực vật (Hình 15) =====
    {
      const g = groups.strip; const X0 = -9, w = 2.6, D = 6;
      const veg = vegetation();
      const tropicPatches = [];
      ZONES.forEach((Z, i) => {
        const x0 = X0 + i * w;
        const ground = new THREE.Mesh(new THREE.BoxGeometry(w, .3, D), new THREE.MeshStandardMaterial({ color: new THREE.Color(...Z.c), roughness: 1 })); ground.position.set(x0 + w / 2, -.15, 0); g.add(ground);
        const n = Math.round(60 * Z.d);
        for (let k = 0; k < n; k++) {
          const x = x0 + .15 + Math.random() * (w - .3), z = (Math.random() - .5) * (D - .4);
          const kind = Z.k === 'mix' ? (Math.random() < .5 ? 'broad' : 'conifer') : Z.k;
          veg.add(kind, x, 0, z, kind === 'grass' ? .9 : kind === 'ice' ? 1 : .55);
          if (Z.k === 'tropic') tropicPatches.push([x, z]);
        }
        if (Z.g) for (let k = 0; k < 40; k++) veg.add('grass', x0 + Math.random() * w, 0, (Math.random() - .5) * D, .7);
        const seenZ = state.seenZ || (state.seenZ = new Set());
        api.label(Z.n, { cls: 'sm', pos: new THREE.Vector3(x0 + w / 2, 2.3 + (i % 2) * .5, D / 2), parent: g, onClick: { title: Z.n, html: Z.h, id: Z.n, onPick: () => { seenZ.add(Z.n); if (seenZ.size >= 3) api.done('z3'); } } });
      });
      veg.build(g);
      // vùng bị phá rừng (che phủ đất trống)
      const bare = new THREE.Group(); g.add(bare); bare.visible = false;
      for (let i = 0; i < 9; i++) { const p = new THREE.Mesh(new THREE.CylinderGeometry(.35 + Math.random() * .3, .35, 1.9, 10), new THREE.MeshStandardMaterial({ color: 0xa0784a })); p.position.set(X0 + .3 + Math.random() * (w - .6), .9, (Math.random() - .5) * (D - 1)); bare.add(p); }
      state.bare = bare;
      api.label('Đất trống do phá rừng', { cls: 'sm warm', pos: new THREE.Vector3(X0 + w / 2, 2.2, -D / 2), parent: bare });
      // núi nhiệt đới (theo độ cao)
      const mtn = beltMountain({ r: 4, H: 6.5, belts: BELTS }); mtn.position.set(-13.4, 0, -.5); g.add(mtn);
      BELTS.forEach((b, i) => {
        const f = i === 0 ? b.to / 2 : (BELTS[i - 1].to + b.to) / 2; const y = f * 6.5;
        const rr = 4 * Math.acos(Math.pow(Math.min(.99, f), 1 / 1.6)) * 2 / Math.PI;
        api.label(b.name, { cls: 'sm', pos: new THREE.Vector3(-13.4 - rr * .7, y + .2, -.5 + rr * .7), parent: g, onClick: { title: b.name + ' (theo độ cao)', html: `Ở vùng nhiệt đới, lên cao nhiệt độ giảm (trung bình 0,6 °C/100 m) nên xuất hiện vành đai <b>${b.name.toLowerCase()}</b>, giống vành đai tương ứng khi đi về phía cực.`, id: 'belt-' + b.name, onPick: () => { if (b.kind === 'conifer') api.done('conifer'); } } });
      });
      // mũi tên chú thích
      g.add(api.arrow(new THREE.Vector3(X0, -.1, D / 2 + .8), new THREE.Vector3(X0 + w * 9 + .5, -.1, D / 2 + .8), 0x1f8a5a, .5, .25));
      api.label('Theo vĩ tuyến: từ vùng nhiệt đới lên cực ➜', { pos: new THREE.Vector3(2, -.6, D / 2 + .8), parent: g });
      g.add(api.arrow(new THREE.Vector3(-18, 0, -.5), new THREE.Vector3(-18, 7, -.5), 0x2f7fd8, .5, .25));
      api.label('Theo độ cao', { pos: new THREE.Vector3(-18.3, 7.5, -.5), parent: g });
      state.stripCam = v => { api.controls.target.x = v; };
    }

    state.show = n => { state.cur = n; for (const [k, g] of Object.entries(groups)) g.visible = k === n; cs.style.display = n === 'strip' ? '' : 'none'; };
    const base = api.controlsBox; const cs = document.createElement('div'); base.append(cs); api.controlsBox = cs; api.heading('Tuỳ chọn');
    api.toggle('defor', 'Tác động phá rừng', false, v => { state.bare.visible = v; if (v) api.done('defor'); });
    api.slider('walk', 'Đi dọc vĩ tuyến', { min: -14, max: 12, step: .5, value: 0, format: v => v < -8 ? 'núi nhiệt đới' : v < -4 ? 'nhiệt đới' : v < 3 ? 'cận nhiệt – ôn đới' : 'ôn đới lạnh – cực' }, v => {
      if (!state.ready) return; const dx = v - api.controls.target.x; api.controls.target.x += dx; api.camera.position.x += dx; });
    api.controlsBox = base; state.ready = true;
  },
};

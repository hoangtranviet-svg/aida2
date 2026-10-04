// 3D-21 · Bài 21 – Các nguồn lực phát triển kinh tế
import { THREE, vec, mat, boxM, cylM, mesh, island, forest, house, building, factory, ship, field, water, crowd, mine, flag, crane, container, road, place, stage } from '../kit.js';

// [id, tên, nhóm nguồn gốc, phạm vi, mô tả]
const RES = {
  port: ['Vị trí địa lí', 'vt', 'in', 'Giáp biển, nằm trên tuyến hàng hải quốc tế → thuận lợi giao lưu, trao đổi hàng hoá với các nước. Vị trí tạo <b>thuận lợi hay khó khăn</b> cho việc trao đổi, tiếp cận, cùng phát triển giữa các lãnh thổ.'],
  mine: ['Khoáng sản', 'tn', 'in', 'Tài nguyên khoáng sản (than, quặng, đá vôi…) là nguyên liệu cho công nghiệp. Thuộc nguồn lực <b>tự nhiên</b>.'],
  land: ['Đất, nước, khí hậu', 'tn', 'in', 'Đất phù sa, nguồn nước sông và khí hậu nhiệt đới ẩm là cơ sở để phát triển nông nghiệp. Nguồn lực tự nhiên là <b>cơ sở tự nhiên</b> của quá trình sản xuất.'],
  forest: ['Rừng (sinh vật)', 'tn', 'in', 'Tài nguyên sinh vật cung cấp gỗ, dược liệu, cảnh quan du lịch và giữ đất, giữ nước.'],
  town: ['Dân cư và nguồn lao động', 'xh', 'in', 'Số lượng, chất lượng lao động (trình độ, kĩ năng) quyết định khả năng sản xuất và cũng là thị trường tiêu thụ.'],
  bank: ['Vốn', 'xh', 'in', 'Vốn đầu tư từ ngân sách, doanh nghiệp, người dân dùng để xây dựng nhà máy, cơ sở hạ tầng.'],
  lab: ['Khoa học – công nghệ', 'xh', 'in', 'Trường đại học, viện nghiên cứu tạo ra công nghệ mới, nâng cao năng suất lao động.'],
  gov: ['Chính sách, thể chế', 'xh', 'in', 'Đường lối, chính sách phát triển (thu hút đầu tư, cải cách hành chính…) có vai trò định hướng, tạo môi trường cho phát triển kinh tế.'],
  market: ['Thị trường', 'xh', 'in', 'Thị trường tiêu thụ trong nước và quốc tế quyết định quy mô, cơ cấu sản xuất.'],
  ext: ['Nguồn lực từ bên ngoài', 'xh', 'out', 'Vốn đầu tư nước ngoài (FDI, ODA), khoa học – công nghệ, kinh nghiệm quản lí, thị trường quốc tế. Đây là <b>nguồn lực ngoài nước</b> (ngoại lực), rất quan trọng, đặc biệt với các nước đang phát triển.'],
};
const ORIGIN = { vt: ['Vị trí địa lí', 0xffd166, ''], tn: ['Tự nhiên', 0x4fd18b, 'cold'], xh: ['Kinh tế – xã hội', 0xff8a5c, 'warm'] };
const SCOPE = { in: ['Trong nước (nội lực)', 0x5ab0ff], out: ['Ngoài nước (ngoại lực)', 0xff5ad1] };

export default {
  id: '3D-21', code: 'DL10.B21', title: 'Các nguồn lực phát triển kinh tế',
  objectives: [
    { c: 'DL10.09.01', t: 'Khái niệm, phân loại, vai trò các nguồn lực' },
    { c: 'DL10.09.05', t: 'Phân tích sơ đồ nguồn lực' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 21', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'World Bank – Foreign direct investment, net inflows (BoP, current US$)', u: 'https://data.worldbank.org/indicator/BX.KLT.DINV.CD.WD' },
  ],
  note: 'Mô hình là một vùng lãnh thổ giả định, dựng để minh hoạ các loại nguồn lực.',
  view: { pos: [0, 9, 15], target: [0, 0, 0] },
  steps: [
    { title: 'Nguồn lực là gì?', html: '<p><b>Nguồn lực</b> là tổng thể vị trí địa lí, các nguồn tài nguyên thiên nhiên, hệ thống tài sản quốc gia, nguồn nhân lực, đường lối chính sách, vốn và thị trường… ở cả trong nước và ngoài nước có thể được khai thác để phục vụ phát triển kinh tế của một lãnh thổ.</p><div class="tip">Mỗi vật thể có viền sáng trên đảo là một nguồn lực. Bấm để đọc.</div>',
      enter: a => { a.set('cls', 'none'); a.fly([0, 9, 15], [0, 0, 0]); } },
    { title: 'Phân loại theo nguồn gốc', html: '<ul><li><b>Vị trí địa lí</b>: tự nhiên, kinh tế, chính trị, giao thông.</li><li><b>Tự nhiên</b>: đất, khí hậu, nước, sinh vật, khoáng sản, biển.</li><li><b>Kinh tế – xã hội</b>: dân cư và nguồn lao động, vốn, thị trường, khoa học – kĩ thuật và công nghệ, chính sách, lịch sử – văn hoá.</li></ul>',
      enter: a => { a.set('cls', 'origin'); a.fly([3, 10, 12], [0, 0, 0]); } },
    { title: 'Phân loại theo phạm vi lãnh thổ', html: '<ul><li><b>Nguồn lực trong nước</b> (nội lực): các nguồn lực bên trong lãnh thổ.</li><li><b>Nguồn lực ngoài nước</b> (ngoại lực): vốn, công nghệ, kinh nghiệm quản lí, thị trường từ bên ngoài.</li></ul><div class="tip">Con tàu đang cập cảng mang theo nguồn lực bên ngoài – hãy bấm vào nó.</div>',
      enter: a => { a.set('cls', 'scope'); a.fly([14, 8, 15], [6, 0, 2]); } },
    { title: 'Vai trò của các nguồn lực', html: '<ul><li><b>Vị trí địa lí</b>: tạo thuận lợi hoặc khó khăn cho trao đổi, giao lưu giữa các vùng, các nước.</li><li><b>Tự nhiên</b>: là cơ sở tự nhiên của quá trình sản xuất.</li><li><b>Kinh tế – xã hội</b>: có <b>vai trò quyết định</b> đối với sự phát triển kinh tế.</li><li>Nội lực giữ vai trò quyết định; ngoại lực rất quan trọng, cần kết hợp hài hoà.</li></ul>',
      enter: a => { a.set('cls', 'origin'); a.fly([-6, 8, 12], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'tn', text: 'Bấm vào <b>2 nguồn lực tự nhiên</b> khác nhau.' },
    { id: 'xh', text: 'Bấm vào <b>2 nguồn lực kinh tế – xã hội</b> khác nhau.' },
    { id: 'ext', text: 'Tìm <b>nguồn lực từ bên ngoài</b> lãnh thổ.' },
    { id: 'cls', text: 'Đổi cách phân loại sang <b>theo phạm vi lãnh thổ</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0x9cc9e8 });
    const sea = water(60, 40, { color: 0x2e78b7, y: -.15 }); scene.add(sea);
    const L = new THREE.Group(); scene.add(L);
    L.add(island(18, 12));
    const rimMats = {}; const seen = { tn: new Set(), xh: new Set() };
    const mark = (id, obj, pos, ly = 1.6, r = 1.1) => {
      const [name, o] = RES[id];
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, .05, 8, 40), mat(0xffffff, { basic: true, unique: true })); ring.rotation.x = Math.PI / 2; ring.position.set(pos[0], .08, pos[2]); L.add(ring);
      rimMats[id] = ring.material;
      const info = { title: name, html: RES[id][3] + `<br><span style="opacity:.8">Nguồn gốc: <b>${ORIGIN[o][0]}</b> · Phạm vi: <b>${SCOPE[RES[id][2]][0]}</b></span>`, id, onPick: () => { if (seen[o]) { seen[o].add(id); if (seen[o].size >= 2) api.done(o); } if (id === 'ext') api.done('ext'); } };
      place(api, L, obj, pos, { info, label: name, ly });
      api.hotspot(ring, info);
    };
    // cảng biển (vị trí)
    const port = new THREE.Group(); port.add(boxM(3, .3, 1.6, 0x9aa3ab, [0, .15, 0])); const cr = crane(); cr.position.set(-.8, .3, -.3); port.add(cr);
    [0x2e86de, 0xe67e22, 0x27ae60, 0xc0392b].forEach((c, i) => { const k = container({ color: c }); k.position.set(.3 + (i % 2) * .65, .3 + Math.floor(i / 2) * .27, .2); port.add(k); });
    port.scale.setScalar(.75); mark('port', port, [7.4, 0, 3.6], 2.2, 1.4);
    // mỏ
    const mn = mine(); mn.add(boxM(.3, .2, .2, 0xf1c40f, [.8, .1, .6])); mark('mine', mn, [-6.5, .02, -3.2], 1.2, 1.4);
    // ruộng + sông
    const lnd = new THREE.Group(); const riv = water(8, .9, { color: 0x3a8fd8, y: .03 }); riv.position.set(0, 0, 1.3); lnd.add(riv);
    for (let i = 0; i < 3; i++) { const f = field(1.6, 1.4, { color: [0x9cc34a, 0xd8c24a, 0x7fb84a][i] }); f.position.set(-2.2 + i * 1.8, 0, 0); lnd.add(f); }
    mark('land', lnd, [-1.2, 0, 3.6], 1.3, 2.2);
    // rừng
    mark('forest', forest(18, 3.4, 2.4, { kind: 'cone', seed: 4 }), [-6.4, 0, 2.2], 1.8, 1.8);
    // đô thị, dân cư
    const town = new THREE.Group(); [[-1, 0], [0, -.9], [1, 0], [0, .9], [-1, -1]].forEach(([x, z], i) => { const h = house({ wall: [0xf1e3c8, 0xe8d0b0, 0xf6efe2][i % 3] }); h.position.set(x, 0, z); town.add(h); }); town.add(crowd(10, 2.6, 2.2));
    mark('town', town, [-1.8, 0, -3.3], 1.6, 1.8);
    // ngân hàng (vốn)
    const bk = new THREE.Group(); bk.add(boxM(1.4, .9, 1, 0xe8e2d4, [0, .45, 0])); for (let i = 0; i < 4; i++) bk.add(cylM(.07, .07, .8, 0xffffff, [-.5 + i * .33, .45, .55])); const pd = mesh(new THREE.ConeGeometry(.95, .35, 4), 0xc9b37e, [0, 1.07, 0]); pd.rotation.y = Math.PI / 4; pd.scale.z = .75; bk.add(pd);
    mark('bank', bk, [2.6, 0, -3.6], 1.7);
    // khoa học công nghệ
    const lb = new THREE.Group(); lb.add(building({ w: 1.2, h: 1.2, d: .9, color: 0xd0dde8 })); lb.add(mesh(new THREE.SphereGeometry(.35, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), 0xffffff, [0, 1.2, 0]));
    mark('lab', lb, [5.4, 0, -3.4], 2);
    // chính sách
    const gv = new THREE.Group(); gv.add(boxM(1.3, .8, .9, 0xf5e6c8, [0, .4, 0])); gv.add(mesh(new THREE.SphereGeometry(.3, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), 0xd4a017, [0, .8, 0])); const fl = flag(); fl.position.set(.7, .8, 0); gv.add(fl);
    mark('gov', gv, [.4, 0, -.6], 1.8);
    // thị trường
    const mk = new THREE.Group(); [0xe74c3c, 0x3498db, 0xf39c12].forEach((c, i) => { mk.add(boxM(.55, .45, .5, 0xf6efe2, [-.6 + i * .6, .22, 0])); const aw = boxM(.6, .05, .6, c, [-.6 + i * .6, .5, .05]); aw.rotation.x = .25; mk.add(aw); }); mk.add(crowd(5, 1.8, .6, { seed: 9 }).translateZ(.6));
    mark('market', mk, [3.2, 0, 1.0], 1.4, 1.3);
    // nhà máy (minh hoạ sản xuất)
    const fac = factory(api); fac.position.set(4.2, 0, 4.2); fac.scale.setScalar(.7); L.add(fac);
    L.add(road(10, { rot: 0 }).translateZ(-1.9).translateX(.5));
    // tàu từ bên ngoài
    const sh = ship({ color: 0x8e44ad, len: 2.6 }); const shG = new THREE.Group(); shG.add(sh); scene.add(shG);
    const extInfo = { title: RES.ext[0], html: RES.ext[3], id: 'ext', onPick: () => api.done('ext') };
    api.hotspot(shG, extInfo); const shL = api.label('Vốn FDI, công nghệ, thị trường quốc tế', { cls: 'sm', pos: vec(0, 1.3, 0), parent: shG, onClick: extInfo });
    const shRing = new THREE.Mesh(new THREE.TorusGeometry(1.6, .05, 8, 40), mat(0xffffff, { basic: true, unique: true })); shRing.rotation.x = Math.PI / 2; shG.add(shRing); rimMats.ext = shRing.material;
    api.onTick((dt, t) => { const k = (Math.sin(t * .25) + 1) / 2; shG.position.set(17 - k * 6, -.1, 5.4); shG.rotation.y = Math.PI; sh.position.y = Math.sin(t * 2) * .04; });
    // phân loại → tô màu viền
    const recolor = v => {
      Object.entries(rimMats).forEach(([id, m]) => { const [, o, sc] = RES[id]; m.color.setHex(v === 'origin' ? ORIGIN[o][1] : v === 'scope' ? SCOPE[sc][1] : 0xffffff); });
      api.legend(v === 'origin' ? Object.values(ORIGIN).map(([t, c]) => ({ t, c: '#' + c.toString(16).padStart(6, '0') })) : v === 'scope' ? Object.values(SCOPE).map(([t, c]) => ({ t, c: '#' + c.toString(16).padStart(6, '0') })) : null);
      if (v === 'scope') { const n = Object.values(RES).filter(r => r[2] === 'in').length; api.readout(`<b>Theo phạm vi lãnh thổ</b><br>Trong nước: ${n} nguồn lực trên đảo<br>Ngoài nước: con tàu cập cảng`); }
      else if (v === 'origin') api.readout('<b>Theo nguồn gốc</b><br>Vàng: vị trí · Xanh lá: tự nhiên<br>Cam: kinh tế – xã hội'); else api.readout(null);
    };
    api.onTick((dt, t) => Object.values(rimMats).forEach(m => { m.opacity = .6 + .4 * Math.sin(t * 3); m.transparent = true; }));
    api.heading('Phân loại nguồn lực');
    api.choice('cls', '', [{ v: 'none', t: 'Không tô' }, { v: 'origin', t: 'Theo nguồn gốc' }, { v: 'scope', t: 'Theo phạm vi' }], 'none', v => { recolor(v); if (v === 'scope' && state.ready && !state.fromStep) api.done('cls'); });
    const _set = api.set; api.set = (id, v) => { state.fromStep = true; _set(id, v); state.fromStep = false; };
    state.ready = true;
  },
};

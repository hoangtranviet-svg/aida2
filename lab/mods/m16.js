// 3D-16 · Bài 16 – Thực hành: Phân tích phân bố đất và sinh vật trên thế giới
import { THREE, latLonToVec3 } from '../core.js';
import { earthTexture } from '../earth.js';

// Các kiểu thảm thực vật chính và nhóm đất tương ứng (sơ đồ khái quát theo SGK)
const Z = [
  { k: 'ice', veg: 'Hoang mạc lạnh, băng tuyết', soil: 'Hầu như không có đất', cv: [236, 242, 247], cs: [236, 242, 247] },
  { k: 'tun', veg: 'Đài nguyên', soil: 'Đất đài nguyên', cv: [158, 168, 138], cs: [150, 140, 120] },
  { k: 'tai', veg: 'Rừng lá kim (tai-ga)', soil: 'Đất pốt-dôn', cv: [44, 96, 70], cs: [176, 168, 150] },
  { k: 'bro', veg: 'Rừng lá rộng và rừng hỗn hợp ôn đới', soil: 'Đất nâu và xám rừng lá rộng ôn đới', cv: [92, 152, 72], cs: [138, 104, 70] },
  { k: 'ste', veg: 'Thảo nguyên, cây bụi chịu hạn và đồng cỏ núi cao', soil: 'Đất đen, hạt dẻ thảo nguyên', cv: [186, 196, 104], cs: [52, 44, 38] },
  { k: 'med', veg: 'Rừng và cây bụi lá cứng cận nhiệt', soil: 'Đất nâu đỏ rừng và cây bụi lá cứng', cv: [130, 150, 70], cs: [160, 86, 56] },
  { k: 'sub', veg: 'Rừng cận nhiệt ẩm', soil: 'Đất đỏ vàng cận nhiệt ẩm', cv: [70, 140, 80], cs: [206, 138, 62] },
  { k: 'des', veg: 'Hoang mạc, bán hoang mạc', soil: 'Đất xám hoang mạc, bán hoang mạc', cv: [226, 198, 134], cs: [196, 190, 170] },
  { k: 'sav', veg: 'Xa van, cây bụi', soil: 'Đất đỏ, nâu đỏ xa van', cv: [176, 172, 78], cs: [176, 74, 50] },
  { k: 'tro', veg: 'Rừng nhiệt đới, xích đạo', soil: 'Đất đỏ vàng (feralit), đất đen nhiệt đới', cv: [30, 104, 46], cs: [214, 96, 40] },
];
const ZK = Object.fromEntries(Z.map(z => [z.k, z]));
const box = (lo, la, l0, l1, a0, a1) => lo >= l0 && lo <= l1 && la >= a0 && la <= a1;
// phân loại khái quát theo vĩ độ + vị trí trong lục địa (đủ để đọc quy luật, không thay bản đồ chính xác)
function biome(lo, la) {
  const al = Math.abs(la);
  if (la < -60 || al > 78 || (lo > -60 && lo < -15 && la > 60)) return 'ice';
  if (al > 66 || (la > 60 && lo > 140) || (la > 58 && lo < -60 && lo > -170 && la > 64)) return 'tun';
  const desert = box(lo, la, -17, 35, 15, 32) || box(lo, la, 35, 60, 14, 32) || box(lo, la, 60, 76, 23, 33) || box(lo, la, 50, 75, 36, 46) || box(lo, la, 88, 115, 37, 46)
    || box(lo, la, 115, 142, -32, -18) || box(lo, la, 12, 24, -28, -17) || box(lo, la, -75, -68, -28, -12) || box(lo, la, -117, -103, 24, 37) || box(lo, la, -72, -64, -50, -38);
  if (desert) return 'des';
  if (la > 50) return 'tai';
  const steppe = box(lo, la, 40, 125, 44, 52) || box(lo, la, -112, -96, 32, 52) || box(lo, la, -66, -56, -40, -28) || box(lo, la, 28, 50, 44, 52);
  if (steppe) return 'ste';
  if (al > 44) return 'bro';
  const med = box(lo, la, -10, 40, 30, 44) || box(lo, la, -125, -115, 30, 42) || box(lo, la, -74, -70, -38, -30) || box(lo, la, 114, 124, -36, -30) || box(lo, la, 17, 28, -35, -32);
  if (med) return 'med';
  if (al > 28 || (la > 22 && lo > 100 && lo < 125)) return 'sub';
  if (al > 10 || box(lo, la, -60, -38, -22, -5) || box(lo, la, 28, 42, -12, 6)) return 'sav';
  return 'tro';
}

export default {
  id: '3D-16', code: 'DL10.B16', title: 'Thực hành: Phân bố đất và sinh vật trên thế giới',
  objectives: [
    { c: 'DL10.06.04', t: 'Phân tích sơ đồ, bản đồ phân bố các nhóm đất và sinh vật trên thế giới' },
    { c: 'DL10.06.03', t: 'Các nhân tố ảnh hưởng đến sự phân bố của sinh vật' },
    { c: 'DL10.07.03', t: 'Quy luật địa đới' },
  ],
  sources: [
    { t: 'Olson et al. (2001), Terrestrial Ecoregions of the World – WWF (sơ đồ đã khái quát hoá, Việt hoá)', u: 'https://www.worldwildlife.org/publications/terrestrial-ecoregions-of-the-world' },
    { t: 'FAO/UNESCO – Digital Soil Map of the World', u: 'https://www.fao.org/soils-portal/data-hub/soil-maps-and-databases/faounesco-soil-map-of-the-world/en/' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 16', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  view: { pos: [0, 1.2, 3.4], target: [0, 0, 0] },
  steps: [
    { title: 'Hai bản đồ, một quy luật', html: '<p>Quả địa cầu thể hiện <b>các kiểu thảm thực vật</b> chính. Chuyển sang lớp <b>Nhóm đất</b> để thấy mỗi kiểu thảm thực vật đi cùng một nhóm đất đặc trưng.</p><div class="tip">Bấm vào tên các đới trên quả địa cầu để xem cặp thảm thực vật – đất.</div>',
      enter: a => { a.state.layer('veg'); a.state.face(15, 20); } },
    { title: 'Từ xích đạo về cực', html: '<p>Theo kinh tuyến 20°Đ (châu Phi – châu Âu), đi từ xích đạo lên phía bắc lần lượt gặp:</p><ol><li>Rừng nhiệt đới, xích đạo – đất đỏ vàng (feralit)</li><li>Xa van – đất đỏ, nâu đỏ xa van</li><li>Hoang mạc – đất xám hoang mạc</li><li>Rừng và cây bụi lá cứng cận nhiệt – đất nâu đỏ</li><li>Rừng lá rộng ôn đới – đất nâu và xám</li><li>Rừng lá kim – đất pốt-dôn</li><li>Đài nguyên – đất đài nguyên</li></ol><p>Đây là biểu hiện của <b>quy luật địa đới</b>: nhiệt và ẩm thay đổi theo vĩ độ.</p>',
      enter: a => { a.state.layer('veg'); a.state.transect(true); a.state.face(25, 20, 3.0); } },
    { title: 'Vì sao đất và sinh vật đi cùng nhau?', html: '<ul><li><b>Khí hậu</b> (nhiệt, ẩm) quyết định cả kiểu thảm thực vật lẫn quá trình hình thành đất.</li><li><b>Sinh vật</b> cung cấp chất hữu cơ, quyết định độ phì của đất; ngược lại đất nuôi dưỡng thực vật.</li><li>Vì vậy ranh giới các đới đất gần trùng ranh giới các kiểu thảm thực vật.</li></ul>',
      enter: a => { a.state.layer('soil'); a.state.transect(true); } },
    { title: 'Không chỉ theo vĩ độ', html: '<p>Cùng vĩ độ nhưng khác vị trí so với biển, thảm thực vật vẫn thay đổi (quy luật <b>địa ô</b>): ở khoảng 40°B tại Bắc Mỹ, từ đông sang tây có rừng lá rộng → thảo nguyên → hoang mạc → rừng ven Thái Bình Dương.</p><p>Hoang mạc lớn nằm ở chí tuyến và sâu trong lục địa (Xa-ha-ra, Ả Rập, Trung Á), nơi khô hạn quanh năm.</p>',
      enter: a => { a.state.layer('veg'); a.state.transect(false); a.state.face(-100, 35); } },
    { title: 'Việt Nam ở đâu?', html: '<p>Việt Nam nằm trong vùng nội chí tuyến, khí hậu nhiệt đới ẩm gió mùa → thảm thực vật chủ yếu là <b>rừng nhiệt đới</b>, đất chủ yếu là <b>đất đỏ vàng (feralit)</b>. Ở miền núi cao xuất hiện rừng cận nhiệt và đất mùn trên núi (quy luật đai cao).</p>',
      enter: a => { a.state.layer('soil'); a.state.face(106, 16, 2.6); } },
  ],
  tasks: [
    { id: 'soil', text: 'Chuyển sang lớp <b>Nhóm đất</b>.' },
    { id: 'z3', text: 'Bấm vào <b>3 đới</b> khác nhau để xem cặp thảm thực vật – đất.' },
    { id: 'tr', text: 'Bật <b>tuyến cắt 20°Đ</b> từ xích đạo lên Bắc Âu.' },
    { id: 'vn', text: 'Tìm và bấm vào <b>Việt Nam</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x07131b);
    scene.add(new THREE.AmbientLight(0xffffff, 1.1)); const dl = new THREE.DirectionalLight(0xffffff, .9); dl.position.set(3, 2, 4); scene.add(dl);
    // lấy mặt nạ lục địa rồi tô hai lớp bản đồ
    const base = await earthTexture({ mode: 'plain', w: 1440, h: 720 }); const mask = base.userData.mask; const W = mask.width, H = mask.height;
    const paint = key => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); const img = x.createImageData(W, H); const o = img.data;
      for (let y = 0; y < H; y++) { const la = 90 - (y + .5) / H * 180; for (let i = 0; i < W; i++) { const p = (y * W + i) * 4; const lo = (i + .5) / W * 360 - 180;
        let col; if (mask.data[p] > 127) { col = ZK[biome(lo, la)][key]; const n = .93 + .07 * Math.sin(i * .9 + y * 1.3); col = col.map(v => v * n); } else col = [24, 62, 104];
        o[p] = col[0]; o[p + 1] = col[1]; o[p + 2] = col[2]; o[p + 3] = 255; } }
      x.putImageData(img, 0, 0); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
    const TEX = { veg: paint('cv'), soil: paint('cs') };
    const mat = new THREE.MeshStandardMaterial({ map: TEX.veg, roughness: .9 });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), mat); scene.add(globe);
    const gc = { center: new THREE.Vector3(), radius: 1 };
    // lưới kinh vĩ tuyến mờ
    const gm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .12 });
    [-60, -30, 0, 30, 60].forEach(lat => { const pts = []; for (let lo = -180; lo <= 180; lo += 3) pts.push(latLonToVec3(lat, lo, 1.002)); scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lat === 0 ? new THREE.LineBasicMaterial({ color: 0xf0be57, transparent: true, opacity: .5 }) : gm)); });
    // tuyến cắt 20°Đ
    const trG = new THREE.Group(); scene.add(trG);
    { const pts = []; for (let la = -2; la <= 72; la += 1) pts.push(latLonToVec3(la, 20, 1.006)); trG.add(api.tube(pts, .006, 0xffd166)); }
    const TR = [[3, 'tro'], [11, 'sav'], [24, 'des'], [36, 'med'], [48, 'bro'], [60, 'tai'], [69, 'tun']];
    TR.forEach(([la, k], i) => api.label(`${i + 1}`, { cls: 'sm warm', pos: latLonToVec3(la, 20, 1.03), parent: trG, globe: gc, onClick: { title: `${i + 1}. ${ZK[k].veg}`, html: `Đất tương ứng: <b>${ZK[k].soil}</b>.`, id: 'tr-' + k } }));
    // nhãn các đới
    const seen = new Set();
    const zoneLbl = (k, la, lo) => api.label(ZK[k].veg, { cls: 'sm', pos: latLonToVec3(la, lo, 1.02), globe: gc, onClick: () => ({ title: ZK[k].veg, html: `<p>Nhóm đất tương ứng: <b>${ZK[k].soil}</b>.</p><p class="muted">Bấm nút <b>Nhóm đất</b> để thấy vùng đất này trên bản đồ.</p>`, id: 'z-' + k, onPick: () => { seen.add(k); if (seen.size >= 3) api.done('z3'); } }) });
    zoneLbl('tro', -3, -62); zoneLbl('tro', 0, 22); zoneLbl('sav', -15, 28); zoneLbl('des', 23, 10); zoneLbl('des', -25, 132); zoneLbl('med', 38, 15); zoneLbl('sub', 30, 112);
    zoneLbl('ste', 48, 70); zoneLbl('ste', 42, -102); zoneLbl('bro', 50, 10); zoneLbl('tai', 60, 100); zoneLbl('tai', 56, -100); zoneLbl('tun', 70, 80); zoneLbl('ice', 74, -40);
    api.label('Việt Nam', { cls: 'warm', pos: latLonToVec3(16, 106.5, 1.03), globe: gc, onClick: { title: 'Việt Nam', html: 'Rừng nhiệt đới ẩm gió mùa trên <b>đất đỏ vàng (feralit)</b>; vùng núi cao có rừng cận nhiệt và đất mùn núi cao.', id: 'vn', onPick: () => api.done('vn') } });
    // điều khiển
    const legend = key => api.legend(Z.map(z => ({ c: `rgb(${(key === 'veg' ? z.cv : z.cs).join(',')})`, t: key === 'veg' ? z.veg : z.soil })));
    const quiet = f => { state.fromStep = true; f(); state.fromStep = false; };
    state.layer = key => quiet(() => api.set('layer', key));
    state.transect = v => quiet(() => api.set('tr', v));
    state.face = (lon, lat, dist = 3.4) => { api.set('spin', false); const p = latLonToVec3(lat, lon, dist).applyAxisAngle(new THREE.Vector3(0, 1, 0), scene.rotation.y); api.fly([p.x, p.y, p.z], [0, 0, 0]); };
    api.heading('Lớp bản đồ');
    api.choice('layer', '', [{ v: 'veg', t: 'Thảm thực vật' }, { v: 'soil', t: 'Nhóm đất' }], 'veg', v => { mat.map = TEX[v]; mat.needsUpdate = true; legend(v); if (v === 'soil' && !state.fromStep) api.done('soil'); });
    api.toggle('tr', 'Tuyến cắt theo kinh tuyến 20°Đ', false, v => { trG.visible = v; if (v && !state.fromStep) api.done('tr'); });
    api.toggle('spin', 'Tự xoay quả địa cầu', true, v => (state.spin = v));
    api.onTick(dt => { if (state.spin && !api.paused) scene.rotation.y += dt * .05 * api.speed; });
    legend('veg');
  },
};

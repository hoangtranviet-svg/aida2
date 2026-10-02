// 3D-20 · Bài 20 – Phân bố dân cư và đô thị hoá trên thế giới
import { THREE, makeGlobe, latLonToVec3, starfield } from '../core.js';
import { earthTexture } from '../earth.js';
import { CITIES, DENSE } from '../geo.js';

const GR = 2;
export default {
  id: '3D-20', code: 'DL10.B20', title: 'Phân bố dân cư và đô thị hoá',
  objectives: [
    { c: 'DL10.08.04', t: 'Tác động của các nhân tố đến phân bố dân cư' },
    { c: 'DL10.08.05', t: 'Đô thị hoá: khái niệm, nhân tố, ảnh hưởng' },
    { c: 'DL10.08.09', t: 'Nhận xét, giải thích phân bố dân cư qua bản đồ, số liệu' },
  ],
  sources: [
    { t: 'UN DESA – World Urbanization Prospects 2018', u: 'https://population.un.org/wup/' , n: 'dân số các siêu đô thị (ước tính 2020)' },
    { t: 'NASA SEDAC – Gridded Population of the World', u: 'https://sedac.ciesin.columbia.edu/data/collection/gpw-v4' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 20', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Lớp “mức độ tập trung dân cư” là vùng minh hoạ giản lược, không phải bản đồ mật độ chính xác. Dân số đô thị là ước tính năm 2020 theo UN WUP 2018, làm tròn, tính cho cả vùng đô thị.',
  view: { pos: [0, 1.8, 6.6], target: [0, 0, 0] },
  steps: [
    { title: 'Dân cư phân bố không đều', html: '<p>Dân cư thế giới phân bố <b>không đều</b>: tập trung đông ở Đông Á, Nam Á, Đông Nam Á, Tây Âu, Đông Bắc Hoa Kỳ, ven sông Nin…; thưa thớt ở hoang mạc, vùng cực, rừng rậm xích đạo, núi cao.</p><p>Thước đo: <b>mật độ dân số</b> = số dân / diện tích (người/km²).</p>',
      enter: a => { a.state.layer('dense'); a.state.faceLon(90); a.fly([0, 1.8, 6.6], [0, 0, 0]); } },
    { title: 'Nhân tố ảnh hưởng', html: '<ul><li><b>Tự nhiên</b>: khí hậu ôn hoà, nguồn nước, địa hình bằng phẳng, đất đai màu mỡ thu hút dân cư.</li><li><b>Kinh tế – xã hội</b> (quyết định): trình độ phát triển lực lượng sản xuất, tính chất nền kinh tế, lịch sử khai thác lãnh thổ, chuyển cư.</li></ul><div class="tip">Xoay quả địa cầu: so sánh đồng bằng sông Hằng, sông Nin với hoang mạc Xa-ha-ra, vùng cực.</div>',
      enter: a => { a.state.layer('dense'); a.state.faceLon(30); a.fly([0, 2.4, 6], [0, .4, 0]); } },
    { title: 'Đô thị hoá và siêu đô thị', html: '<p><b>Đô thị hoá</b> là quá trình tăng nhanh số dân thành thị, sự tập trung dân cư vào các thành phố lớn và phổ biến lối sống thành thị.</p><p><b>Siêu đô thị</b>: đô thị có từ <b>10 triệu dân</b> trở lên. Phần lớn siêu đô thị hiện nay ở châu Á.</p><div class="tip">Chiều cao cột tỉ lệ với số dân. Bấm vào từng cột.</div>',
      enter: a => { a.state.layer('city'); a.state.faceLon(110); a.fly([0, 2.6, 6.4], [0, .3, 0]); } },
    { title: 'Ảnh hưởng của đô thị hoá', html: '<ul><li><b>Tích cực</b>: thúc đẩy chuyển dịch cơ cấu kinh tế, thay đổi phân bố dân cư và lao động, phổ biến lối sống văn minh.</li><li><b>Tiêu cực</b> (khi đô thị hoá tự phát, không gắn với công nghiệp hoá): thiếu việc làm, nhà ở, ô nhiễm môi trường, ùn tắc giao thông, tệ nạn xã hội.</li></ul>',
      enter: a => { a.state.layer('both'); a.state.faceLon(106); a.fly([0, 2, 5.6], [0, .4, 0]); } },
  ],
  tasks: [
    { id: 'tokyo', text: 'Tìm siêu đô thị <b>đông dân nhất</b> thế giới.' },
    { id: 'vn', text: 'Bấm vào <b>2 thành phố của Việt Nam</b>.' },
    { id: 'africa', text: 'Bấm vào một siêu đô thị ở <b>châu Phi</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    starfield(scene);
    const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 6, 10); scene.add(key);
    const tex = await earthTexture({ mode: 'plain' });
    const globe = makeGlobe(api, { radius: GR, texture: tex }); scene.add(globe);
    const gc = { center: new THREE.Vector3(), radius: GR };
    // lớp mức độ tập trung dân cư (minh hoạ)
    const dCan = document.createElement('canvas'); dCan.width = 1024; dCan.height = 512; const dx = dCan.getContext('2d');
    DENSE.forEach(([la, lo, r, k]) => { const x = (lo + 180) / 360 * 1024, y = (90 - la) / 180 * 512, rr = r / 360 * 1024 * 1.4; const gr = dx.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(255,70,40,${.85 * k})`); gr.addColorStop(.5, `rgba(255,150,40,${.45 * k})`); gr.addColorStop(1, 'rgba(255,200,60,0)'); dx.fillStyle = gr; dx.fillRect(x - rr, y - rr, rr * 2, rr * 2); });
    const dTex = new THREE.CanvasTexture(dCan); dTex.colorSpace = THREE.SRGBColorSpace;
    const dense = new THREE.Mesh(new THREE.SphereGeometry(GR * 1.006, 96, 64), new THREE.MeshBasicMaterial({ map: dTex, transparent: true, depthWrite: false })); globe.add(dense);
    // cột đô thị
    const cityG = new THREE.Group(); globe.add(cityG); const seenVN = new Set();
    const AFR = ['Cai-rô', 'La-gốt', 'Kin-sa-sa'];
    CITIES.forEach(([n, la, lo, pop]) => {
      const h = pop / 37.4 * 1.1 + .03; const p = latLonToVec3(la, lo, GR); const dir = p.clone().normalize();
      const mega = pop >= 10; const vn = n === 'Hà Nội' || n === 'TP Hồ Chí Minh';
      const col = new THREE.Mesh(new THREE.CylinderGeometry(.025, .025, h, 10), new THREE.MeshStandardMaterial({ color: vn ? 0xff2d55 : mega ? 0xffc23d : 0x8fd3ff, emissive: vn ? 0x550010 : 0x332200 }));
      col.position.copy(p.clone().add(dir.clone().multiplyScalar(h / 2))); col.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); cityG.add(col);
      const info = { title: n, html: `Dân số vùng đô thị (ước tính 2020): <b>${String(pop).replace('.', ',')} triệu người</b>${mega ? '<br>→ <b>Siêu đô thị</b> (từ 10 triệu dân trở lên)' : ''}`, id: n, onPick: () => { if (n === 'Tô-ki-ô') api.done('tokyo'); if (vn) { seenVN.add(n); if (seenVN.size === 2) api.done('vn'); } if (AFR.includes(n)) api.done('africa'); } };
      api.hotspot(col, info);
      if (pop >= 19 || vn) api.label(n, { cls: 'sm' + (vn ? ' warm' : ''), pos: p.clone().add(dir.clone().multiplyScalar(h + .08)), parent: cityG, globe: gc, onClick: info });
    });
    state.faceLon = L => { state.lock = true; globe.rotation.y = -Math.PI / 2 - L * Math.PI / 180; clearTimeout(state.lt); state.lt = setTimeout(() => (state.lock = false), 7000); };
    api.onTick(dt => { if (!state.lock && api.get('spin')) globe.rotation.y += dt * .06; });
    state.layer = v => { dense.visible = v !== 'city'; cityG.visible = v !== 'dense'; api.legend(v === 'dense' ? [{ c: '#ff4628', t: 'Rất đông dân' }, { c: '#ff9628', t: 'Đông dân' }, { c: '#7a9a6a', t: 'Thưa dân' }] : [{ c: '#ffc23d', t: 'Siêu đô thị (≥ 10 triệu)' }, { c: '#8fd3ff', t: 'Đô thị lớn' }, { c: '#ff2d55', t: 'Việt Nam' }]); };
    api.heading('Tuỳ chọn');
    api.toggle('spin', 'Xoay quả địa cầu', true, () => {});
  },
};

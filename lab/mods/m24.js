// 3D-24 · Bài 24 – Địa lí ngành nông nghiệp (trồng trọt, chăn nuôi)
import { THREE, vec, globe, latLonToVec3 } from '../kit.js';

// toạ độ đại diện của một số nước
const C = {
  CN: ['Trung Quốc', 34, 108], IN: ['Ấn Độ', 22, 79], BD: ['Băng-la-đét', 24, 90], ID: ['In-đô-nê-xi-a', -2, 113], VN: ['Việt Nam', 16, 107], TH: ['Thái Lan', 15, 101],
  RU: ['Liên bang Nga', 54, 50], US: ['Hoa Kỳ', 39, -97], AU: ['Ô-xtrây-li-a', -27, 134], CA: ['Ca-na-đa', 52, -105], FR: ['Pháp', 46.5, 2.5], BR: ['Bra-xin', -12, -50],
  AR: ['Ác-hen-ti-na', -34, -64], CO: ['Cô-lôm-bi-a', 4, -73], ET: ['Ê-ti-ô-pi-a', 9, 39], KE: ['Kê-ni-a', 0, 38], LK: ['Xri Lan-ca', 7.8, 80.7], TR: ['Thổ Nhĩ Kỳ', 39, 35],
  PK: ['Pa-ki-xtan', 30, 70], ES: ['Tây Ban Nha', 40, -4], DE: ['Đức', 51, 10], NZ: ['Niu Di-lân', -42, 173], IR: ['I-ran', 32, 53], UA: ['U-crai-na', 49, 32],
};
// [id, tên, nhóm, màu, các nước, vùng sinh thái [lat, lon, bán kính°], điều kiện sinh thái, phân bố]
const P = [
  ['rice', 'Lúa gạo', 'luong', 0x7ee081, ['CN', 'IN', 'BD', 'ID', 'VN', 'TH'], [[25, 105, 18], [20, 82, 12], [-3, 112, 8]], 'Ưa khí hậu nóng, ẩm, chân ruộng ngập nước, đất phù sa màu mỡ; cần nhiều lao động.', 'Tập trung ở miền nhiệt đới và cận nhiệt gió mùa châu Á (khoảng 90% sản lượng thế giới).'],
  ['wheat', 'Lúa mì', 'luong', 0xf4c95d, ['CN', 'IN', 'RU', 'US', 'FR', 'AU', 'CA'], [[48, 40, 16], [38, -98, 12], [52, -105, 8], [35, 112, 10], [-32, 140, 9], [28, 77, 7]], 'Ưa khí hậu ấm, khô; đầu thời kì sinh trưởng cần nhiệt độ thấp; đất màu mỡ.', 'Chủ yếu ở miền ôn đới và cận nhiệt: Trung Quốc, Ấn Độ, Liên bang Nga, Hoa Kỳ, Pháp, Ô-xtrây-li-a, Ca-na-đa…'],
  ['corn', 'Ngô', 'luong', 0xffe066, ['US', 'CN', 'BR', 'AR', 'UA'], [[40, -92, 12], [40, 115, 10], [-20, -50, 12], [-33, -62, 8], [48, 32, 7]], 'Ưa khí hậu nóng, đất ẩm, nhiều mùn, dễ thoát nước; dễ thích nghi với dao động của khí hậu.', 'Trồng ở miền nhiệt đới, cận nhiệt và ôn đới nóng. Là cây lương thực có sản lượng lớn nhất hiện nay.'],
  ['coffee', 'Cà phê', 'cn', 0xa0522d, ['BR', 'VN', 'ID', 'CO', 'ET'], [[-15, -47, 9], [12, 108, 4], [-4, 104, 6], [4, -74, 5], [8, 38, 5]], 'Ưa nhiệt, ẩm; cần đất tơi xốp, nhiều màu (đất badan, đất đá vôi).', 'Vùng nhiệt đới: Bra-xin (đứng đầu thế giới), Việt Nam, In-đô-nê-xi-a, Cô-lôm-bi-a, Ê-ti-ô-pi-a…'],
  ['tea', 'Chè', 'cn', 0x2e8b57, ['CN', 'IN', 'KE', 'LK', 'TR', 'VN'], [[28, 115, 8], [26, 92, 5], [0, 37, 4], [7.5, 80.8, 2], [41, 41, 3]], 'Ưa nhiệt độ ôn hoà, lượng mưa nhiều và rải đều, đất chua; thường trồng trên đồi.', 'Vùng cận nhiệt và nhiệt đới có địa hình cao: Trung Quốc, Ấn Độ, Kê-ni-a, Xri Lan-ca, Thổ Nhĩ Kỳ, Việt Nam…'],
  ['cane', 'Mía', 'cn', 0xb5e48c, ['BR', 'IN', 'CN', 'TH', 'PK'], [[-21, -48, 8], [24, 80, 9], [23, 109, 5], [15, 101, 5], [30, 72, 4]], 'Ưa nóng, ẩm, cần nhiều nước theo mùa; đất phù sa màu mỡ.', 'Miền nhiệt đới: Bra-xin, Ấn Độ, Trung Quốc, Thái Lan, Pa-ki-xtan…'],
  ['cotton', 'Bông', 'cn', 0xf8f9fa, ['CN', 'IN', 'US', 'BR', 'PK'], [[40, 82, 6], [21, 76, 7], [33, -95, 9], [-14, -54, 6], [29, 71, 4]], 'Ưa nóng, nhiều ánh sáng, khí hậu ổn định; đất tốt, nhiều phân bón.', 'Miền nhiệt đới và cận nhiệt: Trung Quốc, Ấn Độ, Hoa Kỳ, Bra-xin, Pa-ki-xtan…'],
  ['cattle', 'Bò', 'cnuoi', 0xd35400, ['BR', 'IN', 'US', 'CN', 'AR', 'ET'], [[-15, -52, 12], [22, 79, 9], [38, -100, 11], [-34, -62, 7], [9, 39, 5]], 'Cần đồng cỏ tươi tốt, nguồn thức ăn công nghiệp; nuôi lấy thịt, sữa.', 'Bra-xin, Ấn Độ, Hoa Kỳ, Trung Quốc, Ác-hen-ti-na, Ê-ti-ô-pi-a…'],
  ['pig', 'Lợn', 'cnuoi', 0xff8fab, ['CN', 'US', 'BR', 'ES', 'DE', 'VN', 'RU'], [[30, 112, 12], [41, -90, 8], [-22, -50, 7], [48, 8, 8], [18, 106, 4]], 'Thức ăn là lương thực, phụ phẩm của trồng trọt, công nghiệp thực phẩm → gắn với vùng trồng lương thực, đông dân.', 'Trung Quốc chiếm gần một nửa đàn lợn thế giới; Hoa Kỳ, Bra-xin, Tây Ban Nha, Đức, Việt Nam…'],
  ['sheep', 'Cừu', 'cnuoi', 0xe9ecef, ['CN', 'IN', 'AU', 'IR', 'NZ'], [[42, 100, 12], [-28, 140, 12], [-42, 172, 4], [32, 55, 7], [24, 76, 6]], 'Ưa khí hậu khô, đồng cỏ cận nhiệt, ôn đới khô hạn; nuôi lấy lông, thịt.', 'Vùng khô hạn: Trung Quốc, Ô-xtrây-li-a, Niu Di-lân, I-ran, Ấn Độ…'],
  ['poultry', 'Gia cầm', 'cnuoi', 0xffd166, ['CN', 'US', 'ID', 'BR', 'IN', 'VN'], [[30, 112, 10], [36, -88, 9], [-5, 110, 6], [-20, -48, 7], [22, 80, 7]], 'Chu kì nuôi ngắn, thức ăn đa dạng, dễ nuôi ở cả quy mô hộ gia đình và công nghiệp.', 'Có ở hầu hết các nước; nhiều nhất: Trung Quốc, Hoa Kỳ, In-đô-nê-xi-a, Bra-xin, Ấn Độ…'],
];

export default {
  id: '3D-24', code: 'DL10.B24', title: 'Địa lí ngành nông nghiệp',
  objectives: [
    { c: 'DL10.10.03', t: 'Vai trò, đặc điểm các ngành trồng trọt, chăn nuôi' },
    { c: 'DL10.10.04', t: 'Phân bố một số cây trồng, vật nuôi chính trên thế giới' },
    { c: 'DL10.10.08', t: 'Đọc bản đồ nông nghiệp' },
  ],
  sources: [
    { t: 'FAOSTAT – Crops and livestock products', u: 'https://www.fao.org/faostat/en/#data/QCL', n: 'nước sản xuất, chăn nuôi nhiều' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 24', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Vùng màu là vùng phân bố chủ yếu được giản lược để minh hoạ. Danh sách nước là một số nước sản xuất, chăn nuôi nhiều theo FAOSTAT (không xếp hạng).',
  view: { pos: [0, 1.6, 6.8], target: [0, 0, 0] },
  steps: [
    { title: 'Ngành trồng trọt', html: '<p><b>Vai trò</b>: cung cấp lương thực, thực phẩm; nguyên liệu cho công nghiệp chế biến; cơ sở để phát triển chăn nuôi; nguồn hàng xuất khẩu.</p><p><b>Lúa gạo</b>: ưa nóng ẩm, ruộng ngập nước, đất phù sa → tập trung ở <b>châu Á gió mùa</b>.</p><div class="tip">Chọn cây trồng, vật nuôi ở mục điều khiển. Vùng sáng màu là nơi phân bố chủ yếu; cột là một số nước sản xuất nhiều.</div>',
      enter: a => { a.set('crop', 'rice'); a.state.faceLon(100); a.fly([0, 1.6, 6.8], [0, 0, 0]); } },
    { title: 'Lúa mì và ngô', html: '<ul><li><b>Lúa mì</b>: ưa khí hậu ấm, khô, đầu kì sinh trưởng cần nhiệt độ thấp → miền ôn đới, cận nhiệt (đồng bằng Đông Âu, Bắc Mỹ, Hoa Bắc…).</li><li><b>Ngô</b>: dễ thích nghi, trồng ở nhiệt đới, cận nhiệt, ôn đới nóng; Hoa Kỳ, Trung Quốc, Bra-xin, Ác-hen-ti-na.</li></ul>',
      enter: a => { a.set('crop', 'wheat'); a.state.faceLon(20); a.fly([0, 3, 6.4], [0, .5, 0]); } },
    { title: 'Cây công nghiệp', html: '<p>Đặc điểm: phần lớn <b>ưa nhiệt, ẩm</b>, cần đất thích hợp → trồng ở vùng nhiệt đới, cận nhiệt; hình thành <b>vùng chuyên canh</b> gắn với cơ sở chế biến.</p><p>Cà phê (Bra-xin đứng đầu, Việt Nam đứng thứ hai), chè, mía, bông…</p>',
      enter: a => { a.set('crop', 'coffee'); a.state.faceLon(-30); a.fly([0, .8, 6.6], [0, -.2, 0]); } },
    { title: 'Ngành chăn nuôi', html: '<p><b>Vai trò</b>: cung cấp thực phẩm dinh dưỡng cao (thịt, trứng, sữa), nguyên liệu (da, lông), hàng xuất khẩu, sức kéo, phân bón.</p><p><b>Đặc điểm</b>: phụ thuộc chặt chẽ vào <b>cơ sở nguồn thức ăn</b>; đang chuyển từ chăn thả sang chuồng trại, chăn nuôi công nghiệp.</p><ul><li><b>Bò</b>: đồng cỏ, thức ăn công nghiệp. <b>Lợn</b>: vùng lương thực, đông dân. <b>Cừu</b>: vùng khô hạn. <b>Gia cầm</b>: phổ biến khắp nơi.</li></ul>',
      enter: a => { a.set('crop', 'sheep'); a.state.faceLon(150); a.fly([0, -1.5, 6.6], [0, -.4, 0]); } },
  ],
  tasks: [
    { id: 'vn', text: 'Với cây <b>lúa gạo</b>, bấm vào cột của <b>Việt Nam</b>.' },
    { id: 'br', text: 'Tìm nước <b>sản xuất cà phê nhiều nhất</b> thế giới.' },
    { id: 'sheep', text: 'Với vật nuôi <b>cừu</b>, bấm vào một nước ở <b>châu Đại Dương</b>.' },
    { id: 'all', text: 'Xem lần lượt ít nhất <b>5 loại</b> cây trồng, vật nuôi.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x06101c);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x101820, .8));
    const E = await globe(api, { mode: 'plain', radius: 2 });
    // lớp vùng phân bố (vẽ trên canvas)
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const cx = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const zone = new THREE.Mesh(new THREE.SphereGeometry(2.012, 96, 64), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })); E.G.add(zone);
    const pins = new THREE.Group(); E.G.add(pins); const seenT = new Set();
    const show = id => {
      const p = P.find(x => x[0] === id); if (!p) return; const [, name, grp, col, cs, zs, eco, dist] = p;
      cx.clearRect(0, 0, 1024, 512); const c = new THREE.Color(col); const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
      zs.forEach(([la, lo, r]) => { const x = (lo + 180) / 360 * 1024, y = (90 - la) / 180 * 512, rr = r / 360 * 1024; const g = cx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, `rgba(${rgb},.75)`); g.addColorStop(.6, `rgba(${rgb},.4)`); g.addColorStop(1, `rgba(${rgb},0)`); cx.fillStyle = g; cx.beginPath(); cx.ellipse(x, y, rr, rr * .8, 0, 0, Math.PI * 2); cx.fill(); });
      tex.needsUpdate = true;
      while (pins.children.length) pins.remove(pins.children[0]);
      api.state.lbls?.forEach(l => { l.visible = false; l.element.remove(); l.removeFromParent(); }); api.state.lbls = [];
      cs.forEach(k => {
        const [cn, la, lo] = C[k];
        const info = { title: `${name} – ${cn}`, html: `${cn} là một trong những nước ${grp === 'cnuoi' ? 'chăn nuôi' : 'sản xuất'} <b>${name.toLowerCase()}</b> nhiều nhất thế giới.<br><span style="opacity:.85">${dist}</span>`, id: id + k, onPick: () => { if (id === 'rice' && k === 'VN') api.done('vn'); if (id === 'coffee' && k === 'BR') api.done('br'); if (id === 'sheep' && (k === 'AU' || k === 'NZ')) api.done('sheep'); } };
        const m = E.pin(la, lo, { h: .32, color: col, r: .03, info, parent: pins });
        const l = api.label(cn, { cls: 'sm' + (k === 'VN' ? ' warm' : ''), pos: latLonToVec3(la, lo, 2.42), parent: pins, globe: E.gc, onClick: info }); api.state.lbls.push(l);
      });
      api.readout(`<b>${name}</b><br><span style="opacity:.85">Điều kiện sinh thái:</span> ${eco}<br><span style="opacity:.85">Phân bố:</span> ${dist}`);
      api.legend([{ c: '#' + c.getHexString(), t: `Vùng phân bố chủ yếu – ${name.toLowerCase()}` }]);
      seenT.add(id); if (seenT.size >= 5) api.done('all');
    };
    const opts = g => P.filter(p => p[2] === g).map(p => ({ v: p[0], t: p[1] }));
    const groups = { luong: 'crop', cn: 'crop2', cnuoi: 'crop3' };
    const only = id => document.querySelectorAll('.controls .seg').forEach(seg => { if (!seg.querySelector(`[data-v="${id}"]`)) seg.querySelectorAll('button').forEach(b => b.classList.remove('on')); });
    api.heading('Cây lương thực'); api.choice('crop', '', opts('luong'), 'rice', v => { if (v) { show(v); only(v); } });
    api.heading('Cây công nghiệp'); api.choice('crop2', '', opts('cn'), '', v => { if (v) { show(v); only(v); } });
    api.heading('Vật nuôi'); api.choice('crop3', '', opts('cnuoi'), '', v => { if (v) { show(v); only(v); } });
    // từ các bước: api.set('crop', id) chọn đúng nhóm
    const _set = api.set; api.set = (id, v) => { if (id === 'crop') { const g = P.find(p => p[0] === v)?.[2]; _set(groups[g], v); } else _set(id, v); };
    api.toggle('spin', 'Xoay quả địa cầu', true, v => E.setSpin(v));
    show('rice');
  },
};

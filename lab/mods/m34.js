// 3D-34 · Bài 34 – Địa lí ngành giao thông vận tải
import { THREE, vec, mat, boxM, cylM, globe, ship, truck, plane, latLonToVec3, fmtN } from '../kit.js';

const ROUTES = [
  ['Á – Âu qua Ma-lắc-ca và Xuy-ê', 0x8fd3ff, [[31, 122.5], [22, 116], [10, 110], [1.2, 104], [5.5, 96], [6, 80], [12.5, 52], [12.6, 43.4], [20, 38.5], [27.5, 34], [29.9, 32.6], [32, 30], [34, 22], [36.8, 12], [37.4, 0], [36, -6], [43, -10], [48, -6], [51, 2], [51.9, 4]]],
  ['Xuyên Thái Bình Dương', 0xffd36b, [[31, 122.5], [34, 142], [40, 180], [38, -150], [33.6, -118.5]]],
  ['Qua kênh Pa-na-ma', 0xff9f6e, [[33.6, -118.5], [20, -106], [9, -80], [12, -77], [20, -74.5], [30, -76], [40.4, -73.8]]],
  ['Xuyên Đại Tây Dương', 0x9be7a8, [[40.4, -73.8], [42, -50], [49, -20], [51, 2], [51.9, 4]]],
];
const PORTS = [
  ['sh', 'Thượng Hải', 31.2, 121.5, 'Cảng container lớn nhất thế giới nhiều năm liền, cửa ngõ của đồng bằng sông Trường Giang.'],
  ['sg', 'Xin-ga-po', 1.26, 103.8, 'Nằm trên eo biển Ma-lắc-ca – tuyến hàng hải nhộn nhịp bậc nhất; cảng trung chuyển hàng đầu thế giới.'],
  ['sz', 'Thâm Quyến', 22.5, 114.1, 'Một trong những cảng container lớn nhất thế giới, phục vụ vùng công nghiệp châu thổ Châu Giang.'],
  ['bs', 'Bu-san', 35.1, 129, 'Cảng lớn nhất Hàn Quốc, trung chuyển quan trọng ở Đông Bắc Á.'],
  ['ja', 'Giê-ben A-li (Đu-bai)', 25, 55.1, 'Cảng lớn nhất Trung Đông, nối châu Á – châu Âu – châu Phi.'],
  ['rt', 'Rốt-téc-đam', 51.9, 4.4, 'Cảng lớn nhất châu Âu, cửa ngõ của sông Rai-nơ.'],
  ['la', 'Lốt An-giơ-lét', 33.7, -118.3, 'Cảng container lớn nhất Hoa Kỳ, đầu mối tuyến xuyên Thái Bình Dương.'],
  ['cm', 'Cái Mép – Thị Vải (Việt Nam)', 10.5, 107, 'Cụm cảng nước sâu ở Bà Rịa – Vũng Tàu, tàu container cỡ lớn đi thẳng sang châu Âu, Bắc Mỹ.'],
];
const KEYS = [
  ['suez', 'Kênh Xuy-ê', 30.5, 32.3, 'Nối Địa Trung Hải với Biển Đỏ (Ai Cập), rút ngắn đường biển Á – Âu hàng nghìn km so với đi vòng qua châu Phi.'],
  ['pana', 'Kênh Pa-na-ma', 9.1, -79.7, 'Nối Thái Bình Dương với Đại Tây Dương, tránh phải đi vòng qua mũi Nam Mỹ.'],
  ['mal', 'Eo biển Ma-lắc-ca', 3, 100.5, 'Eo biển giữa bán đảo Ma-lai-xi-a và đảo Xu-ma-tra, nối Ấn Độ Dương với Thái Bình Dương.'],
];
// đánh giá tương đối (1 thấp – 5 cao) theo đặc điểm trong SGK
const MODES = [
  ['Ô tô', 'road', [3, 2, 3, 5], 'Cơ động, linh hoạt, phối hợp với các loại hình khác; hiệu quả ở cự li ngắn và trung bình. Tốn nhiên liệu, gây ô nhiễm, tai nạn.'],
  ['Đường sắt', 'rail', [3, 4, 4, 2], 'Chở hàng nặng, đi xa, tốc độ nhanh, ổn định, giá rẻ; kém cơ động, chỉ hoạt động trên tuyến đường ray cố định.'],
  ['Đường biển', 'sea', [1, 5, 5, 2], 'Đảm nhiệm phần lớn khối lượng hàng hoá buôn bán quốc tế; khối lượng luân chuyển lớn nhất; giá rẻ, chậm.'],
  ['Hàng không', 'air', [5, 1, 1, 3], 'Tốc độ nhanh nhất, chở người, hàng giá trị cao; cước phí đắt, trọng tải thấp, phát thải nhiều.'],
  ['Đường ống', 'pipe', [2, 4, 4, 1], 'Vận chuyển dầu, khí đốt, nước; liên tục, ít tốn kém khi vận hành; xây dựng tốn kém, chỉ chở chất lỏng, khí.'],
];
const CRIT = ['Tốc độ', 'Khối lượng chở', 'Giá rẻ', 'Linh hoạt'];
const CC = [0xff6b6b, 0x4f9cff, 0x3ddc84, 0xffd36b];

export default {
  id: '3D-34', code: 'DL10.B34', title: 'Địa lí ngành giao thông vận tải',
  objectives: [
    { c: 'DL10.12.02', t: 'Vai trò, đặc điểm ngành giao thông vận tải' },
    { c: 'DL10.12.03', t: 'Nhân tố ảnh hưởng, tình hình phát triển và phân bố' },
    { c: 'DL10.12.04', t: 'Đọc bản đồ, tính toán số liệu giao thông vận tải' },
  ],
  sources: [
    { t: 'UNCTAD – Review of Maritime Transport', u: 'https://unctad.org/topic/transport-and-trade-logistics/review-of-maritime-transport' },
    { t: 'Lloyd’s List – One Hundred Ports', u: 'https://www.lloydslist.com/one-hundred-container-ports-2024' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 34', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Tuyến hàng hải vẽ giản lược. Điểm đánh giá các loại hình chỉ so sánh tương đối theo đặc điểm trong SGK, không phải số liệu đo đạc.',
  view: { pos: [0, 1.6, 7], target: [0, 0, 0] },
  steps: [
    { title: 'Vai trò và đặc điểm', html: '<ul><li><b>Vai trò</b>: đảm bảo sự liên tục của sản xuất, nối sản xuất với tiêu dùng; phục vụ đi lại; tăng cường giao lưu giữa các vùng, các nước; củng cố an ninh, quốc phòng.</li><li><b>Đặc điểm</b>: sản phẩm là <b>sự chuyên chở người và hàng hoá</b>. Chỉ tiêu đánh giá: khối lượng vận chuyển (tấn, người), khối lượng luân chuyển (tấn.km, người.km), cự li vận chuyển trung bình (km).</li></ul><p style="text-align:center"><b>Cự li trung bình = khối lượng luân chuyển ÷ khối lượng vận chuyển</b></p>',
      enter: a => { a.state.view('globe'); a.state.faceLon(80); a.fly([0, 1.6, 7], [0, 0, 0]); } },
    { title: 'Nhân tố ảnh hưởng', html: '<ul><li><b>Vị trí địa lí</b>: quy định sự có mặt, vai trò của một số loại hình (nước giáp biển → đường biển).</li><li><b>Tự nhiên</b>: địa hình, khí hậu, sông ngòi ảnh hưởng đến thiết kế, khai thác các tuyến đường.</li><li><b>Kinh tế – xã hội</b> (quyết định): sự phát triển và phân bố các ngành kinh tế; phân bố dân cư, đô thị lớn; khoa học – công nghệ; vốn; chính sách.</li></ul>',
      enter: a => { a.state.view('globe'); a.state.faceLon(10); a.fly([0, 2.4, 6.6], [0, .3, 0]); } },
    { title: 'Vận tải đường biển', html: '<p>Đường biển đảm nhận phần lớn khối lượng hàng hoá buôn bán quốc tế. Các tuyến chính nối <b>Đông Á – châu Âu – Bắc Mỹ</b>, đi qua những “nút thắt” như eo biển Ma-lắc-ca, kênh Xuy-ê, kênh Pa-na-ma.</p><p>Các cảng container lớn tập trung ở <b>Đông Á</b>.</p><div class="tip">Bấm vào kênh đào, eo biển và các cảng (cột vàng).</div>',
      enter: a => { a.state.view('globe'); a.state.faceLon(70); a.fly([0, 1.8, 6.6], [0, .4, 0]); } },
    { title: 'So sánh các loại hình vận tải', html: '<p>Mỗi loại hình có ưu điểm, hạn chế riêng; cần <b>phối hợp</b> để vận chuyển hiệu quả (vận tải đa phương thức).</p><div class="tip">Bấm vào từng cột để đọc đặc điểm. Cột cao = mức độ cao (so sánh tương đối).</div>',
      enter: a => { a.state.view('modes'); } },
    { title: 'Tính cự li vận chuyển trung bình', html: '<p>Ví dụ: một hãng tàu trong năm vận chuyển <b>12 triệu tấn</b> hàng, khối lượng luân chuyển là <b>96 tỉ tấn.km</b>.</p><p>Cự li vận chuyển trung bình = 96 000 triệu tấn.km ÷ 12 triệu tấn = ?</p><div class="tip">Nhập kết quả (km) ở mục điều khiển.</div>',
      enter: a => { a.state.view('modes'); } },
  ],
  tasks: [
    { id: 'suez', text: 'Bấm vào <b>kênh đào nối Địa Trung Hải với Biển Đỏ</b>.' },
    { id: 'sh', text: 'Tìm <b>cảng container lớn nhất thế giới</b>.' },
    { id: 'air', text: 'Bấm vào cột <b>tốc độ</b> của vận tải hàng không.' },
    { id: 'calc', text: 'Tính đúng <b>cự li vận chuyển trung bình</b>.' },
  ],

  async setup(api) {
    const { scene, state, camera } = api;
    scene.background = new THREE.Color(0x06101c);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x101820, .8));
    const E = await globe(api, { mode: 'plain', radius: 2 });
    ROUTES.forEach(([n, c, pts]) => { const t = E.path(pts, { color: c, width: .009, flow: 16 }); api.hotspot(t, { title: 'Tuyến hàng hải ' + n, html: 'Tuyến vận tải container, hàng rời, dầu thô quan trọng của thế giới.' }); });
    PORTS.forEach(([id, n, la, lo, d]) => { const info = { title: 'Cảng ' + n, html: d, id, onPick: () => { if (id === 'sh') api.done('sh'); } }; E.pin(la, lo, { h: .22, color: 0xffc23d, r: .03, info }); api.label(n, { cls: 'sm' + (id === 'cm' ? ' warm' : ''), pos: latLonToVec3(la, lo, 2.32), parent: E.G, globe: E.gc, onClick: info }); });
    KEYS.forEach(([id, n, la, lo, d]) => { const info = { title: n, html: d, id, onPick: () => { if (id === 'suez') api.done('suez'); } }; const m = E.dot(la, lo, { color: 0xff3df2, size: .06, info }); api.label(n, { cls: 'sm cold', pos: latLonToVec3(la - 3, id === 'mal' ? lo - 7 : lo, 2.18), parent: E.G, globe: E.gc, onClick: info }); });
    const sh = ship({ len: 2 }); sh.scale.setScalar(.08); E.G.add(sh); const curve = new THREE.CatmullRomCurve3(ROUTES[0][2].map(([a, b]) => latLonToVec3(a, b, 2.02)));
    api.onTick((dt, t) => { const k = (t * .02) % 1; const p = curve.getPointAt(k); const q = curve.getPointAt(Math.min(.999, k + .01)); sh.position.copy(p); sh.lookAt(q); sh.rotateY(-Math.PI / 2); });
    // biểu đồ so sánh loại hình
    const M = new THREE.Group(); M.position.set(0, -60, 0); scene.add(M);
    M.add(boxM(12, .2, 6, 0x15293a, [0, -.1, 0]));
    MODES.forEach(([n, k, v, d], i) => {
      const x = -4.8 + i * 2.4;
      v.forEach((s, j) => { const h = s * .55; const b = boxM(.38, h, .38, CC[j], [x - .6 + j * .4, h / 2, 0], { unique: true }); M.add(b); api.hotspot(b, { title: `${n} – ${CRIT[j]}`, html: `Mức ${s}/5. ${d}`, id: k + j, onPick: () => { if (k === 'air' && j === 0) api.done('air'); } }); });
      let ic; if (k === 'road') ic = truck(); else if (k === 'sea') { ic = ship({ len: 1.2 }); ic.scale.setScalar(.45); } else if (k === 'air') { ic = plane(); } else if (k === 'rail') { ic = new THREE.Group(); for (let c = 0; c < 3; c++) ic.add(boxM(.4, .25, .22, c ? 0x2e86de : 0xc0392b, [c * .44 - .44, .15, 0])); } else { ic = new THREE.Group(); ic.add(cylM(.12, .12, 1.4, 0x7f8c8d, [0, .15, 0]).rotateZ(Math.PI / 2)); }
      ic.position.set(x, 0, 1.6); M.add(ic);
      api.label(n, { cls: 'sm', pos: vec(x, -.4, 2.3), parent: M });
    });
    const applyView = v => {
      const g = v === 'globe'; E.G.visible = g; M.visible = !g;
      if (!g) { api.fly([0, -53.5, 12.5], [0, -58.8, 0]); api.legend(CRIT.map((t, j) => ({ t, c: '#' + CC[j].toString(16).padStart(6, '0') }))); }
      else api.legend([{ c: '#ffc23d', t: 'Cảng biển lớn' }, { c: '#ff3df2', t: 'Kênh đào, eo biển' }, { c: '#8fd3ff', t: 'Tuyến hàng hải chính' }]);
    };
    // điều khiển
    api.heading('Bài tập');
    const box = document.createElement('div'); box.className = 'ctl';
    box.innerHTML = '<label><span>Cự li vận chuyển trung bình (km)</span></label><div style="display:flex;gap:6px"><input inputmode="decimal" placeholder="Nhập kết quả" style="flex:1;min-width:0;padding:7px 9px;border-radius:8px;border:1px solid #ccc;font:inherit"><button type="button" style="padding:7px 12px;border-radius:8px">Kiểm tra</button></div><div class="fb" style="font-size:12.5px;margin-top:6px"></div>';
    api.controlsBox.append(box);
    box.querySelector('button').onclick = () => { const v = parseFloat(box.querySelector('input').value.replace(/\s|\./g, '').replace(',', '.')); const ok = Math.abs(v - 8000) < 1; const fb = box.querySelector('.fb'); fb.innerHTML = isNaN(v) ? 'Em hãy nhập một số.' : ok ? '✓ 96 tỉ tấn.km = 96 000 triệu tấn.km; 96 000 ÷ 12 = <b>8 000 km</b>.' : 'Chưa đúng. Đổi 96 tỉ = 96 000 triệu rồi chia cho 12 triệu tấn.'; fb.style.color = ok ? '#1e8e5a' : '#c0392b'; api.track('control', { id: 'calc', value: v, ok }); if (ok) api.done('calc'); };
    api.heading('Hiển thị');
    api.choice('view', '', [{ v: 'globe', t: 'Quả địa cầu' }, { v: 'modes', t: 'So sánh loại hình' }], 'globe', v => applyView(v));
    state.view = v => { applyView(v); api.set('view', v); };
    api.toggle('spin', 'Xoay quả địa cầu', true, v => E.setSpin(v));
    state.view('globe');
  },
};

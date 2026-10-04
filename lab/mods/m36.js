// 3D-36 · Bài 36 – Địa lí ngành du lịch
import { THREE, vec, boxM, globe, bars, latLonToVec3, fmtN } from '../kit.js';

// UN Tourism (2025): khách quốc tế năm 2024 theo khu vực (triệu lượt) và mức so với 2019
const REG = [
  ['eu', 'Châu Âu', 50, 15, 747, 1.01, 'Khu vực đón nhiều khách quốc tế nhất: nhiều di sản văn hoá, hạ tầng hiện đại, đi lại thuận tiện giữa các nước EU.'],
  ['ap', 'Châu Á – Thái Bình Dương', 25, 110, 316, .87, 'Tăng nhanh nhờ kinh tế phát triển, văn hoá đa dạng, nhiều điểm đến biển đảo; năm 2024 phục hồi 87% so với 2019.'],
  ['am', 'Châu Mỹ', 30, -95, 213, .97, 'Hoa Kỳ, Mê-hi-cô, Ca-na-đa là các điểm đến lớn; tài nguyên thiên nhiên phong phú.'],
  ['me', 'Trung Đông', 25, 45, 95, 1.32, 'Tăng mạnh nhất (vượt 2019 khoảng 32%) nhờ đầu tư lớn vào du lịch, sự kiện quốc tế, đường bay trung chuyển.'],
  ['af', 'Châu Phi', 5, 20, 74, 1.09, 'Du lịch sinh thái, hoang dã (xa-van), di sản; quy mô còn nhỏ.'],
];
const WORLD = [{ t: '2019', v: [1.46] }, { t: '2020', v: [.4] }, { t: '2023', v: [1.3] }, { t: '2024', v: [1.4] }];
const VN = [{ t: '2019', v: [18.0] }, { t: '2023', v: [12.6] }, { t: '2024', v: [17.6] }];

export default {
  id: '3D-36', code: 'DL10.B36', title: 'Địa lí ngành du lịch',
  objectives: [
    { c: 'DL10.12.02', t: 'Vai trò, đặc điểm ngành du lịch' },
    { c: 'DL10.12.03', t: 'Nhân tố ảnh hưởng, tình hình phát triển và phân bố du lịch' },
    { c: 'DL10.12.04', t: 'Phân tích số liệu ngành dịch vụ' },
  ],
  sources: [
    { t: 'UN Tourism – World Tourism Barometer (01/2025), tóm tắt của Bộ VHTTDL', u: 'https://bvhttdl.gov.vn/14-ti-luot-khach-quoc-te-tren-toan-cau-nam-2024-20250210091436717.htm', n: 'khách quốc tế theo khu vực năm 2024' },
    { t: 'Tổng cục Thống kê – khách quốc tế đến Việt Nam năm 2024 (VietnamPlus)', u: 'https://www.vietnamplus.vn/khach-quoc-te-den-viet-nam-tang-manh-ve-gan-muc-truoc-dich-covid-19-post1006168.vnp' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 36', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Số khách năm 2019 của từng khu vực được tính ngược từ tỉ lệ phục hồi năm 2024, làm tròn. Năm 2020 thế giới giảm khoảng 3/4 lượng khách do đại dịch COVID-19 (số làm tròn).',
  view: { pos: [0, .4, 11.5], target: [0, -1.3, 0] },
  steps: [
    { title: 'Vai trò và đặc điểm', html: '<ul><li><b>Vai trò</b>: đóng góp lớn vào GDP, thu ngoại tệ; tạo nhiều việc làm; thúc đẩy các ngành khác (giao thông, thương mại, thủ công…); quảng bá hình ảnh đất nước; góp phần bảo tồn di sản.</li><li><b>Đặc điểm</b>: gắn chặt với <b>tài nguyên du lịch</b>; mang tính <b>mùa vụ</b>; sản phẩm du lịch được “tiêu dùng” tại chỗ; liên quan đến nhiều ngành.</li></ul>',
      enter: a => { a.set('year', '2024'); a.state.faceLon(20); a.fly([0, .4, 11.5], [0, -1.3, 0]); } },
    { title: 'Nhân tố ảnh hưởng', html: '<ul><li><b>Tài nguyên du lịch</b>: tự nhiên (bãi biển, hang động, rừng, núi…) và văn hoá (di tích, lễ hội, ẩm thực…) – quyết định sức hút, loại hình du lịch.</li><li><b>Kinh tế – xã hội</b>: mức sống và thời gian rỗi của người dân, cơ sở hạ tầng, dịch vụ lưu trú, chính sách (miễn thị thực), an ninh chính trị, quảng bá.</li></ul>',
      enter: a => { a.state.faceLon(100); a.fly([0, 2.6, 8], [0, .4, 0]); } },
    { title: 'Tình hình phát triển và phân bố', html: '<p>Năm 2024 thế giới đón khoảng <b>1,4 tỉ lượt khách quốc tế</b> (99% mức năm 2019), doanh thu khoảng 1 600 tỉ USD.</p><ul><li><b>Châu Âu</b> đón nhiều khách nhất (747 triệu lượt).</li><li><b>Trung Đông</b> tăng mạnh nhất so với 2019.</li><li>Châu Á – Thái Bình Dương phục hồi chậm hơn (87%).</li></ul><div class="tip">Đổi năm ở mục điều khiển, bấm vào các cột khu vực.</div>',
      enter: a => { a.state.faceLon(30); a.fly([0, 1.5, 11.5], [0, -1, 0]); } },
    { title: 'Du lịch Việt Nam', html: '<p>Khách quốc tế đến Việt Nam: <b>18,0 triệu</b> (2019) → giảm mạnh do đại dịch → <b>12,6 triệu</b> (2023) → <b>17,6 triệu</b> (2024, bằng 97,6% năm 2019).</p><p>Tài nguyên nổi bật: vịnh Hạ Long, Phong Nha – Kẻ Bàng (thiên nhiên); cố đô Huế, phố cổ Hội An (văn hoá); hơn 3 000 km bờ biển.</p>',
      enter: a => { a.state.faceLon(106); a.fly([4.5, -1.8, 7], [3.6, -3.6, 1.2]); } },
  ],
  tasks: [
    { id: 'eu', text: 'Bấm vào khu vực <b>đón nhiều khách quốc tế nhất</b>.' },
    { id: 'me', text: 'Tìm khu vực <b>tăng mạnh nhất</b> so với năm 2019.' },
    { id: 'covid', text: 'Bấm vào cột <b>năm 2020</b> trên biểu đồ thế giới để thấy tác động của đại dịch.' },
    { id: 'vn', text: 'Bấm vào cột <b>Việt Nam năm 2024</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x06101c);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x101820, .8));
    const E = await globe(api, { mode: 'natural', radius: 2 });
    const cols = REG.map(([id, n, la, lo, v24, rec, d]) => {
      const info = () => ({ title: n, html: `${state.year === '2019' ? `Năm 2019: khoảng <b>${fmtN(v24 / rec, 0)} triệu lượt</b>` : `Năm 2024: <b>${fmtN(v24, 0)} triệu lượt</b> (${rec >= 1 ? 'vượt' : 'bằng'} ${fmtN(rec * 100, 0)}% năm 2019)`} khách quốc tế.<br>${d}`, id, onPick: () => { if (id === 'eu') api.done('eu'); if (id === 'me' && state.year === '2024') api.done('me'); } });
      const m = E.pin(la, lo, { h: .1, color: 0xff7a59, r: .09, info });
      const l = api.label(n, { cls: 'sm', pos: latLonToVec3(la, lo, 2.2), parent: E.G, globe: E.gc, onClick: info });
      return { m, l, v24, rec, la, lo };
    });
    const setYear = y => { state.year = y; cols.forEach(c => { const v = y === '2019' ? c.v24 / c.rec : c.v24; const h = v * .0016; c.m.userData.setH(h); c.l.position.copy(latLonToVec3(c.la, c.lo, 2 + h + .15)); c.l.element.innerHTML = `${REG[cols.indexOf(c)][1]}: <b>${fmtN(v, 0)}</b> tr`; }); };
    // biểu đồ thế giới
    const W = new THREE.Group(); W.position.set(-3.6, -4.6, 1.2); W.scale.setScalar(.7); scene.add(W);
    bars(api, { rows: WORLD, series: [{ t: 'Khách quốc tế thế giới (tỉ lượt)', c: 0x5dade2 }], scale: 1.6, gap: .9, w: .5, depth: .4, parent: W, info: (r) => ({ title: `Thế giới năm ${r.t}`, html: `Khoảng <b>${fmtN(r.v[0], 2)} tỉ lượt</b> khách quốc tế.${r.t === '2020' ? '<br>Đại dịch COVID-19: đóng cửa biên giới, lượng khách giảm khoảng 3/4.' : ''}`, id: 'w' + r.t, onPick: () => { if (r.t === '2020') api.done('covid'); } }) });
    api.label('Thế giới (tỉ lượt khách)', { cls: 'sm', pos: vec(0, 2.9, 0), parent: W });
    // biểu đồ Việt Nam
    const V = new THREE.Group(); V.position.set(3.6, -4.6, 1.2); V.scale.setScalar(.7); scene.add(V);
    bars(api, { rows: VN, series: [{ t: 'Khách quốc tế đến Việt Nam (triệu lượt)', c: 0xff4d6d }], scale: .13, gap: .9, w: .5, depth: .4, parent: V, info: (r) => ({ title: `Việt Nam năm ${r.t}`, html: `<b>${fmtN(r.v[0])} triệu lượt</b> khách quốc tế.`, id: 'vn' + r.t, onPick: () => { if (r.t === '2024') api.done('vn'); } }) });
    api.label('Việt Nam (triệu lượt khách)', { cls: 'sm warm', pos: vec(0, 2.9, 0), parent: V });
    api.heading('Khách quốc tế theo khu vực');
    api.choice('year', 'Năm', [{ v: '2019', t: '2019' }, { v: '2024', t: '2024' }], '2024', setYear);
    api.toggle('spin', 'Xoay quả địa cầu', true, v => E.setSpin(v));
    api.legend([{ c: '#ff7a59', t: 'Khách quốc tế đến khu vực' }, { c: '#5dade2', t: 'Thế giới' }, { c: '#ff4d6d', t: 'Việt Nam' }]);
    setYear('2024');
  },
};

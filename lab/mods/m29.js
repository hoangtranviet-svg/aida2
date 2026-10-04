// 3D-29 · Bài 29 – Địa lí một số ngành công nghiệp
import { THREE, vec, globe, donut, latLonToVec3, fmtN } from '../kit.js';

const C = {
  CN: ['Trung Quốc', 34, 108], IN: ['Ấn Độ', 22, 79], ID: ['In-đô-nê-xi-a', -2, 113], US: ['Hoa Kỳ', 39, -97], AU: ['Ô-xtrây-li-a', -25, 130], RU: ['Liên bang Nga', 60, 80],
  SA: ['Ả-rập Xê-út', 24, 45], CA: ['Ca-na-đa', 56, -110], IQ: ['I-rắc', 33, 44], BR: ['Bra-xin', -12, -50], JP: ['Nhật Bản', 36, 138], KR: ['Hàn Quốc', 36, 128], VN: ['Việt Nam', 16, 107],
  BD: ['Băng-la-đét', 24, 90], TR: ['Thổ Nhĩ Kỳ', 39, 35], DE: ['Đức', 51, 10], FR: ['Pháp', 46.5, 2.5], ZA: ['Nam Phi', -29, 25], CL: ['Chi-lê', -30, -71], CD: ['CHDC Công-gô', -3, 23],
};
// [id, tên, màu, các nước, vai trò, đặc điểm, phân bố]
const IND = [
  ['coal', 'Khai thác than', 0x555555, ['CN', 'IN', 'ID', 'US', 'AU', 'RU'], 'Nguồn nhiên liệu cho nhà máy nhiệt điện, luyện kim (than cốc); nguyên liệu cho hoá chất.', 'Trữ lượng lớn nhưng không tái tạo; khai thác gây ô nhiễm, phát thải khí nhà kính.', 'Các nước khai thác nhiều: Trung Quốc (hơn một nửa sản lượng thế giới), Ấn Độ, In-đô-nê-xi-a, Hoa Kỳ, Ô-xtrây-li-a, Liên bang Nga.'],
  ['oil', 'Khai thác dầu khí', 0xe67e22, ['US', 'SA', 'RU', 'CA', 'IQ', 'CN'], '“Vàng đen”: nhiên liệu quan trọng nhất, nguyên liệu cho công nghiệp hoá dầu (chất dẻo, sợi tổng hợp, phân bón…).', 'Khai thác cần công nghệ, vốn lớn; vận chuyển bằng đường ống, tàu chở dầu; dễ gây ô nhiễm khi sự cố.', 'Tập trung ở Trung Đông, Bắc Mỹ, Liên bang Nga: Hoa Kỳ, Ả-rập Xê-út, Liên bang Nga, Ca-na-đa, I-rắc, Trung Quốc…'],
  ['metal', 'Khai thác quặng kim loại', 0xc0392b, ['AU', 'BR', 'CN', 'IN', 'RU', 'CL', 'CD', 'ZA'], 'Nguyên liệu cho luyện kim đen (quặng sắt) và luyện kim màu (đồng, bô-xít, vàng…).', 'Phân bố theo nơi có mỏ; khai thác thường kèm làm giàu quặng.', 'Quặng sắt: Ô-xtrây-li-a, Bra-xin, Trung Quốc, Ấn Độ, Liên bang Nga. Đồng: Chi-lê, CHDC Công-gô… Kim loại quý: Nam Phi…'],
  ['power', 'Điện lực', 0xf1c40f, ['CN', 'US', 'IN', 'RU', 'JP'], 'Cơ sở để phát triển công nghiệp hiện đại, đẩy mạnh khoa học – kĩ thuật, nâng cao đời sống.', 'Sản phẩm không lưu giữ được, sản xuất và tiêu dùng gần như đồng thời; cơ cấu nguồn điện đang chuyển dịch sang năng lượng tái tạo.', 'Sản lượng điện lớn ở các nước phát triển và nước đông dân, công nghiệp hoá nhanh: Trung Quốc, Hoa Kỳ, Ấn Độ, Liên bang Nga, Nhật Bản…'],
  ['elec', 'Điện tử – tin học', 0x3498db, ['US', 'CN', 'JP', 'KR', 'VN', 'DE'], 'Ngành mũi nhọn, thước đo trình độ phát triển kinh tế – kĩ thuật; sản phẩm phục vụ mọi ngành.', 'Cần lao động có trình độ, công nghệ cao; ít gây ô nhiễm, không cần nhiều diện tích, ít tiêu tốn nguyên liệu.', 'Hoa Kỳ, Trung Quốc, Nhật Bản, Hàn Quốc, các nước EU…; Việt Nam là một trung tâm lắp ráp điện thoại, linh kiện điện tử lớn.'],
  ['textile', 'Sản xuất hàng tiêu dùng (dệt may, da giày)', 0xe84393, ['CN', 'IN', 'BD', 'VN', 'TR'], 'Đáp ứng nhu cầu tiêu dùng hằng ngày, tạo nhiều việc làm, hàng xuất khẩu.', 'Cần nhiều lao động, vốn đầu tư ít, thời gian thu hồi vốn nhanh.', 'Phân bố rộng rãi, nhất là các nước đông dân: Trung Quốc, Ấn Độ, Băng-la-đét, Việt Nam, Thổ Nhĩ Kỳ…'],
  ['food', 'Công nghiệp thực phẩm', 0x27ae60, ['US', 'CN', 'BR', 'FR', 'DE', 'IN'], 'Đáp ứng nhu cầu ăn uống, tăng giá trị nông sản, tạo hàng xuất khẩu.', 'Nguyên liệu từ nông, lâm, thuỷ sản; vốn ít, thu hồi vốn nhanh; gắn với vùng nguyên liệu hoặc thị trường.', 'Có ở mọi quốc gia; phát triển mạnh ở Hoa Kỳ, Trung Quốc, Bra-xin, các nước EU, Ấn Độ…'],
];
// Ember – Global Electricity Review 2024: cơ cấu sản lượng điện thế giới năm 2023 (%)
const MIX = [['Than', 35.4, 0x4d4d4d], ['Khí tự nhiên', 22.5, 0xe67e22], ['Thuỷ điện', 14.3, 0x2e86de], ['Điện hạt nhân', 9.1, 0x9b59b6], ['Điện gió', 7.8, 0x5dade2], ['Điện mặt trời', 5.5, 0xf4d03f], ['Sinh khối và tái tạo khác', 2.7, 0x27ae60], ['Nhiên liệu hoá thạch khác', 2.7, 0x95a5a6]];

export default {
  id: '3D-29', code: 'DL10.B29', title: 'Địa lí một số ngành công nghiệp',
  objectives: [
    { c: 'DL10.11.04', t: 'Vai trò, đặc điểm, phân bố một số ngành công nghiệp' },
    { c: 'DL10.11.08', t: 'Đọc bản đồ công nghiệp' },
  ],
  sources: [
    { t: 'Ember – Global Electricity Review 2024', u: 'https://ember-energy.org/latest-insights/global-electricity-review-2024/', n: 'cơ cấu nguồn điện thế giới 2023' },
    { t: 'Energy Institute – Statistical Review of World Energy', u: 'https://www.energyinst.org/statistical-review', n: 'than, dầu khí' },
    { t: 'USGS – Mineral Commodity Summaries', u: 'https://www.usgs.gov/centers/national-minerals-information-center/mineral-commodity-summaries', n: 'quặng kim loại' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 29', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Cột trên quả địa cầu đánh dấu một số nước dẫn đầu (không theo tỉ lệ sản lượng). Cơ cấu nguồn điện làm tròn theo Ember (2024); nhóm “tái tạo khác” gồm sinh khối, địa nhiệt…',
  view: { pos: [0, 1.4, 7], target: [0, 0, 0] },
  steps: [
    { title: 'Công nghiệp năng lượng: than', html: '<p>Công nghiệp năng lượng gồm <b>khai thác than, dầu khí</b> và <b>điện lực</b>.</p><p><b>Than</b> là nhiên liệu cho nhiệt điện, luyện kim. Trung Quốc khai thác hơn một nửa sản lượng than thế giới.</p><div class="tip">Chọn ngành ở mục điều khiển; bấm vào cột để đọc thông tin.</div>',
      enter: a => { a.set('ind', 'coal'); a.state.faceLon(100); a.fly([0, 1.6, 7], [0, 0, 0]); } },
    { title: 'Dầu khí', html: '<p>Dầu mỏ là nhiên liệu quan trọng (“vàng đen”), nguyên liệu cho hoá dầu. Khu vực <b>Trung Đông</b> có trữ lượng lớn nhất; Hoa Kỳ, Liên bang Nga, Ả-rập Xê-út khai thác nhiều nhất.</p>',
      enter: a => { a.set('ind', 'oil'); a.state.faceLon(45); a.fly([0, 2, 7], [0, .3, 0]); } },
    { title: 'Điện lực', html: '<p>Năm 2023, nguồn điện thế giới vẫn chủ yếu từ <b>than (35%)</b> và khí; năng lượng tái tạo (thuỷ điện, gió, mặt trời, sinh khối…) chiếm khoảng <b>30%</b> và tăng nhanh.</p><div class="tip">Bấm vào từng phần của biểu đồ vành khuyên.</div>',
      enter: a => { a.set('ind', 'power'); a.fly([3.4, 1.8, 7.4], [2.2, 0, 0]); } },
    { title: 'Luyện kim, điện tử – tin học', html: '<ul><li><b>Khai thác quặng kim loại</b>: nguyên liệu cho luyện kim; phân bố theo nơi có mỏ.</li><li><b>Điện tử – tin học</b>: ngành mũi nhọn, cần lao động trình độ cao, ít gây ô nhiễm; Hoa Kỳ, Nhật Bản, Hàn Quốc, Trung Quốc… Việt Nam là cơ sở lắp ráp điện tử lớn.</li></ul>',
      enter: a => { a.set('ind', 'elec'); a.state.faceLon(130); a.fly([0, 1.5, 7], [0, 0, 0]); } },
    { title: 'Hàng tiêu dùng và thực phẩm', html: '<ul><li><b>Dệt may, da giày</b>: cần nhiều lao động, vốn ít, thu hồi vốn nhanh → phát triển mạnh ở các nước đông dân, lao động rẻ.</li><li><b>Thực phẩm</b>: nguyên liệu từ nông – lâm – thuỷ sản, có ở mọi nước.</li></ul>',
      enter: a => { a.set('ind', 'textile'); a.state.faceLon(95); a.fly([0, 1.2, 7], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'coal', text: 'Với ngành than, bấm vào nước <b>khai thác than nhiều nhất</b>.' },
    { id: 'oil', text: 'Với ngành dầu khí, bấm vào một nước ở <b>Trung Đông</b>.' },
    { id: 'mix', text: 'Bấm vào phần <b>điện mặt trời</b> hoặc <b>điện gió</b> trên biểu đồ nguồn điện.' },
    { id: 'vn', text: 'Tìm <b>Việt Nam</b> trong ngành dệt may hoặc điện tử.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x06101c);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x101820, .8));
    const E = await globe(api, { mode: 'plain', radius: 2 });
    const pins = new THREE.Group(); E.G.add(pins); let lbls = [];
    // biểu đồ nguồn điện
    const D = donut(api, { parts: MIX.map(([t, v, c]) => ({ t, v, c })), r: 1.1, r0: .5, h: .25, pos: [3.4, -.6, 0], info: p => ({ title: p.t, html: `Chiếm <b>${fmtN(p.v)}%</b> sản lượng điện thế giới năm 2023 (Ember, 2024).`, id: p.t, onPick: () => { if (p.t === 'Điện mặt trời' || p.t === 'Điện gió') api.done('mix'); } }) });
    D.group.rotation.x = .9; const dl = api.label('Cơ cấu nguồn điện thế giới 2023', { cls: 'sm', pos: vec(3.4, .9, 0) });
    const show = id => {
      const p = IND.find(x => x[0] === id); const [, name, col, cs, role, feat, dist] = p;
      while (pins.children.length) pins.remove(pins.children[0]); lbls.forEach(l => { l.visible = false; l.element.remove(); l.removeFromParent(); }); lbls = [];
      cs.forEach((k, i) => {
        const [cn, la, lo] = C[k];
        const info = { title: `${name} – ${cn}`, html: dist, id: id + k, onPick: () => { if (id === 'coal' && k === 'CN') api.done('coal'); if (id === 'oil' && (k === 'SA' || k === 'IQ')) api.done('oil'); if ((id === 'textile' || id === 'elec') && k === 'VN') api.done('vn'); } };
        E.pin(la, lo, { h: .42 - i * .03, color: col, r: .035, info, parent: pins });
        lbls.push(api.label(cn, { cls: 'sm' + (k === 'VN' ? ' warm' : ''), pos: latLonToVec3(la, lo, 2.5 - i * .03), parent: pins, globe: E.gc, onClick: info }));
      });
      D.group.visible = dl.visible = id === 'power';
      api.readout(`<b>${name}</b><br><span style="opacity:.8">Vai trò:</span> ${role}<br><span style="opacity:.8">Đặc điểm:</span> ${feat}`);
    };
    api.heading('Ngành công nghiệp');
    api.choice('ind', '', IND.map(([v, t]) => ({ v, t: t.replace(' (dệt may, da giày)', '') })), 'coal', show);
    api.toggle('spin', 'Xoay quả địa cầu', true, v => E.setSpin(v));
    api.legend(null);
    show('coal');
  },
};

// 3D-37 · Bài 37 – Địa lí ngành thương mại và ngành tài chính ngân hàng
import { THREE, vec, mat, boxM, cylM, mesh, globe, latLonToVec3, stage, fmtN, container } from '../kit.js';

// Tổng cục Thống kê: xuất, nhập khẩu hàng hoá của Việt Nam (tỉ USD)
const VN = { 2023: [355.5, 327.5], 2024: [405.53, 380.76] };
const FIN = [['New York', 40.7, -74], ['Luân Đôn', 51.5, -.1], ['Xin-ga-po', 1.3, 103.8], ['Hồng Công', 22.3, 114.2], ['Thượng Hải', 31.2, 121.5], ['Tô-ky-ô', 35.7, 139.7], ['Phran-phuốc', 50.1, 8.7]];
const PART = [['us', 'Hoa Kỳ', 38, -97, 0xff6b6b, 'Thị trường <b>xuất khẩu lớn nhất</b> của Việt Nam (điện thoại, máy tính, dệt may, đồ gỗ, giày dép…).'], ['cn', 'Trung Quốc', 34, 108, 0xffd36b, 'Thị trường <b>nhập khẩu lớn nhất</b> của Việt Nam (máy móc, nguyên liệu, linh kiện), đồng thời là thị trường xuất khẩu lớn.'], ['eu', 'Liên minh châu Âu (EU)', 50, 10, 0x4f9cff, 'Đối tác thương mại lớn; Hiệp định EVFTA (có hiệu lực từ 2020) mở rộng thị trường.'], ['as', 'ASEAN', 5, 110, 0x3ddc84, 'Thị trường khu vực gần gũi, hưởng ưu đãi thuế quan trong khu vực mậu dịch tự do ASEAN (AFTA).'], ['kr', 'Hàn Quốc', 36.5, 128, 0xc77dff, 'Nhà đầu tư FDI lớn và đối tác nhập khẩu linh kiện điện tử quan trọng.'], ['jp', 'Nhật Bản', 36, 138, 0xff9f43, 'Đối tác thương mại, đầu tư và viện trợ phát triển (ODA) lớn.']];

export default {
  id: '3D-37', code: 'DL10.B37', title: 'Thương mại và tài chính ngân hàng',
  objectives: [
    { c: 'DL10.12.02', t: 'Vai trò, đặc điểm ngành thương mại, tài chính ngân hàng' },
    { c: 'DL10.12.03', t: 'Nhân tố, tình hình phát triển và phân bố' },
    { c: 'DL10.12.04', t: 'Tính toán, phân tích số liệu' },
  ],
  sources: [
    { t: 'Tổng cục Thống kê – Bức tranh xuất, nhập khẩu hàng hoá năm 2024', u: 'https://www.nso.gov.vn/du-lieu-va-so-lieu-thong-ke/2025/01/buc-tranh-xuat-nhap-khau-hang-hoa-cua-viet-nam-nam-2024-phuc-hoi-phat-trien-va-nhung-ky-luc-moi/' },
    { t: 'WTO – World Trade Statistical Review', u: 'https://www.wto.org/english/res_e/statis_e/statis_e.htm' },
    { t: 'Z/Yen – Global Financial Centres Index', u: 'https://www.longfinance.net/programmes/financial-centre-futures/global-financial-centres-index/' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 37', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Cung thương mại vẽ giản lược, chỉ thể hiện các đối tác chính. Danh sách trung tâm tài chính là một số trung tâm lớn, không xếp hạng.',
  view: { pos: [-3, 4, 11], target: [-3, 1.2, 0] },
  steps: [
    { title: 'Ngành thương mại', html: '<ul><li><b>Vai trò</b>: khâu nối sản xuất với tiêu dùng; điều tiết sản xuất, hướng dẫn tiêu dùng; thúc đẩy chuyên môn hoá, phân công lao động theo lãnh thổ.</li><li><b>Nội thương</b>: trao đổi hàng hoá, dịch vụ trong một nước. <b>Ngoại thương</b>: trao đổi giữa các nước, gắn thị trường trong nước với thị trường thế giới.</li><li>Hoạt động theo quy luật <b>cung – cầu</b>.</li></ul>',
      enter: a => { a.fly([-3, 4, 11], [-3, 1.2, 0]); } },
    { title: 'Cán cân xuất nhập khẩu', html: '<p style="text-align:center"><b>Cán cân xuất nhập khẩu = giá trị xuất khẩu − giá trị nhập khẩu</b></p><ul><li>Dương → <b>xuất siêu</b>; âm → <b>nhập siêu</b>.</li><li>Năm 2024, Việt Nam xuất khẩu 405,53 tỉ USD, nhập khẩu 380,76 tỉ USD → xuất siêu 24,77 tỉ USD (năm thứ 9 liên tiếp).</li></ul><div class="tip">Chọn số liệu Việt Nam hoặc tự kéo thanh xuất khẩu, nhập khẩu và quan sát chiếc cân.</div>',
      enter: a => { a.fly([-4, 3.5, 8.5], [-4, 1.3, 0]); } },
    { title: 'Thị trường thế giới', html: '<ul><li>Thương mại thế giới phát triển mạnh, tập trung vào các nước phát triển và các nền kinh tế lớn ở Đông Á.</li><li><b>WTO</b> (Tổ chức Thương mại Thế giới, Việt Nam gia nhập năm 2007) và các hiệp định thương mại tự do thúc đẩy tự do hoá thương mại.</li><li>Đối tác lớn của Việt Nam: Hoa Kỳ, Trung Quốc, EU, ASEAN, Hàn Quốc, Nhật Bản.</li></ul><div class="tip">Bấm vào các cung thương mại.</div>',
      enter: a => { a.state.faceLon(80); a.fly([5, 2.6, 9], [4.6, .6, 0]); } },
    { title: 'Tài chính ngân hàng', html: '<ul><li><b>Vai trò</b>: huy động, phân phối vốn cho nền kinh tế; thanh toán, chuyển tiền; bảo hiểm rủi ro; ổn định tiền tệ.</li><li><b>Đặc điểm</b>: ứng dụng mạnh công nghệ số (ngân hàng số, thanh toán không tiền mặt); hoạt động toàn cầu.</li><li><b>Trung tâm tài chính lớn</b>: New York, Luân Đôn, Xin-ga-po, Hồng Công, Thượng Hải, Tô-ky-ô…</li></ul>',
      enter: a => { a.state.faceLon(-10); a.fly([5.5, 3.4, 9], [4.6, .8, 0]); } },
  ],
  tasks: [
    { id: 'vn', text: 'Chọn số liệu <b>Việt Nam năm 2024</b> để xem cán cân.' },
    { id: 'deficit', text: 'Kéo thanh để tạo tình huống <b>nhập siêu</b>.' },
    { id: 'us', text: 'Bấm vào thị trường <b>xuất khẩu lớn nhất</b> của Việt Nam.' },
    { id: 'fin', text: 'Bấm vào một <b>trung tâm tài chính</b> lớn.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x0b1724);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x1a2a38, 1.1)); const sl = new THREE.DirectionalLight(0xffffff, 1.4); sl.position.set(3, 8, 6); scene.add(sl);
    scene.add(boxM(9, .1, 5, 0x1c2f40, [-4, -.05, 0]));
    // chiếc cân
    const S = new THREE.Group(); S.position.set(-4, 0, 0); scene.add(S);
    S.add(cylM(.6, .8, .2, 0x8d6e4f, [0, .1, 0])); S.add(cylM(.08, .1, 2.6, 0xb08d57, [0, 1.4, 0])); S.add(mesh(new THREE.ConeGeometry(.2, .3, 4), 0xd4af37, [0, 2.8, 0]));
    const beam = new THREE.Group(); beam.position.y = 2.6; S.add(beam); beam.add(boxM(4.4, .1, .14, 0xd4af37, [0, 0, 0], { metal: .5, rough: .3 }));
    const pan = (x, col, label) => { const g = new THREE.Group(); g.position.x = x; beam.add(g); const h = new THREE.Group(); g.add(h); h.add(cylM(.01, .01, 1.2, 0xdddddd, [0, -.6, 0])); h.add(cylM(.85, .6, .12, col, [0, -1.25, 0], { unique: true })); const pile = new THREE.Group(); pile.position.y = -1.18; h.add(pile); return { g, h, pile, lbl: api.label(label, { cls: 'sm', pos: vec(x, 2.6 - 1.9, .9), parent: S }) }; };
    const pX = pan(-2, 0x3ddc84, 'Xuất khẩu'), pN = pan(2, 0xff6b6b, 'Nhập khẩu');
    const fill = (p, v, col) => { while (p.pile.children.length) p.pile.remove(p.pile.children[0]); const n = Math.round(v / 40); for (let i = 0; i < n; i++) { const c = container({ color: col }); c.scale.setScalar(.75); c.position.set(((i % 3) - 1) * .48, Math.floor(i / 3) * .2, (Math.floor(i / 3) % 2) * .1 - .05); p.pile.add(c); } };
    api.hotspot(pX.g, () => ({ title: 'Giá trị xuất khẩu', html: `<b>${fmtN(state.x)} tỉ USD</b>` })); api.hotspot(pN.g, () => ({ title: 'Giá trị nhập khẩu', html: `<b>${fmtN(state.n)} tỉ USD</b>` }));
    state.x = 300; state.n = 300; state.tilt = 0;
    const update = () => {
      const b = state.x - state.n; state.tiltT = Math.max(-.32, Math.min(.32, -b / 150));
      fill(pX, state.x, 0x27ae60); fill(pN, state.n, 0xc0392b);
      api.readout(`Xuất khẩu: <b>${fmtN(state.x)}</b> tỉ USD · Nhập khẩu: <b>${fmtN(state.n)}</b> tỉ USD<br>Tổng kim ngạch: ${fmtN(state.x + state.n)} tỉ USD<br>Cán cân: <b>${b >= 0 ? '+' : ''}${fmtN(b)}</b> tỉ USD → ${b > 0 ? '<b>xuất siêu</b>' : b < 0 ? '<b>nhập siêu</b>' : 'cân bằng'}`);
      if (state.ready && !state.preset && b < 0) api.done('deficit');
    };
    api.onTick(dt => { state.tilt += (state.tiltT - state.tilt) * Math.min(1, dt * 3); beam.rotation.z = state.tilt; [pX, pN].forEach(p => { p.h.rotation.z = -state.tilt; }); pX.lbl.position.y = .7 + Math.sin(state.tilt) * 2; pN.lbl.position.y = .7 - Math.sin(state.tilt) * 2; });
    // quả địa cầu: đối tác thương mại, trung tâm tài chính
    const E = await globe(api, { mode: 'plain', radius: 1.7, stars: false });
    E.G.position.set(4.6, 1.2, 0);
    const VNp = [16, 107]; E.dot(...VNp, { color: 0xff3d3d, size: .06 }); api.label('Việt Nam', { cls: 'sm warm', pos: latLonToVec3(18, 107, 1.85), parent: E.G, globe: { center: E.G.position, radius: 1.7 } });
    const gcv = { center: E.G.position, radius: 1.7 };
    PART.forEach(([id, n, la, lo, c, d]) => { const info = { title: `${n}`, html: d, id, onPick: () => { if (id === 'us') api.done('us'); } }; const t = E.arc(VNp, [la, lo], { color: c, lift: id === 'us' || id === 'eu' ? .18 : .4, width: .012, flow: 8 }); api.hotspot(t, info); E.dot(la, lo, { color: c, size: .05, info }); api.label(n, { cls: 'sm', pos: latLonToVec3(la + 3, lo, 1.86), parent: E.G, globe: gcv, onClick: info }); });
    FIN.forEach(([n, la, lo]) => { const info = { title: 'Trung tâm tài chính ' + n, html: 'Nơi tập trung ngân hàng, sở giao dịch chứng khoán, công ty bảo hiểm, quỹ đầu tư lớn; chi phối dòng vốn toàn cầu.', id: n, onPick: () => api.done('fin') }; E.pin(la, lo, { h: .25, color: 0xd4af37, r: .03, info }); });
    // vì globe() dùng nhãn ẩn theo tâm (0,0,0), sửa tâm cho nhãn của quả cầu đã dời chỗ
    E.gc.center = E.G.position;
    api.heading('Cán cân xuất nhập khẩu');
    api.choice('preset', 'Số liệu', [{ v: 'free', t: 'Tự điều chỉnh' }, { v: '2023', t: 'Việt Nam 2023' }, { v: '2024', t: 'Việt Nam 2024' }], 'free', v => {
      if (v !== 'free') { state.preset = true; api.set('x', VN[v][0]); api.set('n', VN[v][1]); state.preset = false; if (v === '2024' && state.ready) api.done('vn'); }
    });
    api.slider('x', 'Xuất khẩu (tỉ USD)', { min: 0, max: 500, step: .01, value: 300, format: v => fmtN(v) }, v => { state.x = v; update(); });
    api.slider('n', 'Nhập khẩu (tỉ USD)', { min: 0, max: 500, step: .01, value: 300, format: v => fmtN(v) }, v => { state.n = v; update(); });
    api.toggle('spin', 'Xoay quả địa cầu', true, v => E.setSpin(v));
    api.legend([{ c: '#3ddc84', t: 'Xuất khẩu' }, { c: '#ff6b6b', t: 'Nhập khẩu' }, { c: '#d4af37', t: 'Trung tâm tài chính' }]);
    state.ready = true; update();
  },
};

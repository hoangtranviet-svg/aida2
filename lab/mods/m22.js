// 3D-22 · Bài 22 – Cơ cấu kinh tế, tổng sản phẩm trong nước (GDP) và tổng thu nhập quốc gia (GNI)
import { THREE, vec, mat, boxM, cylM, island, factory, crowd, stack, stage, fmtN, person } from '../kit.js';

const VN2019 = [{ t: 'Nông, lâm nghiệp và thuỷ sản', v: 15.5, c: 0x6cc24a }, { t: 'Công nghiệp và xây dựng', v: 38.3, c: 0xf39c3d }, { t: 'Dịch vụ', v: 46.2, c: 0x4f9cff }];
// mô phỏng xu hướng chuyển dịch cơ cấu ngành theo trình độ phát triển (không phải số liệu một nước cụ thể)
const model = k => { const a = 42 * Math.pow(1 - k, 1.6) + 1.5; const i = 22 + 18 * Math.sin(Math.PI * Math.min(1, k * 1.15)) - 2 * k; return [a, i, 100 - a - i]; };
const COL = [0x6cc24a, 0xf39c3d, 0x4f9cff], NAME = ['Nông, lâm nghiệp và thuỷ sản', 'Công nghiệp và xây dựng', 'Dịch vụ'];

export default {
  id: '3D-22', code: 'DL10.B22', title: 'Cơ cấu kinh tế, GDP và GNI',
  objectives: [
    { c: 'DL10.09.02', t: 'Khái niệm, các loại cơ cấu kinh tế' },
    { c: 'DL10.09.03', t: 'So sánh GDP, GNI, GDP và GNI bình quân đầu người' },
    { c: 'DL10.09.06', t: 'Biểu đồ cơ cấu nền kinh tế' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 22 (Bảng cơ cấu GDP Việt Nam năm 2019)', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'Tổng cục Thống kê (GSO) – Niên giám thống kê', u: 'https://www.gso.gov.vn/' },
    { t: 'World Bank – GNI, Atlas method (definition)', u: 'https://datahelpdesk.worldbank.org/knowledgebase/articles/378832' },
  ],
  note: 'Cơ cấu Việt Nam 2019 theo SGK (không tính thuế sản phẩm trừ trợ cấp sản phẩm). Cột “mô phỏng” chỉ minh hoạ xu hướng chuyển dịch, không phải số liệu thực. Các giá trị GDP, GNI trong phần thử nghiệm là đơn vị quy ước.',
  view: { pos: [-3, 5, 13], target: [-3, 2, 0] },
  steps: [
    { title: 'Cơ cấu kinh tế', html: '<p><b>Cơ cấu kinh tế</b> là tổng thể các ngành, lĩnh vực, bộ phận kinh tế có quan hệ hữu cơ, tương đối ổn định hợp thành.</p><ul><li><b>Theo ngành</b>: nông, lâm nghiệp và thuỷ sản; công nghiệp và xây dựng; dịch vụ – phản ánh trình độ phát triển.</li><li><b>Theo thành phần kinh tế</b>: kinh tế trong nước (nhà nước, ngoài nhà nước) và khu vực có vốn đầu tư nước ngoài.</li><li><b>Theo lãnh thổ</b>: toàn cầu – khu vực, quốc gia, vùng.</li></ul>',
      enter: a => { a.fly([-3, 5, 13], [-3, 2, 0]); } },
    { title: 'Chuyển dịch cơ cấu ngành', html: '<p>Cột giữa là cơ cấu GDP của <b>Việt Nam năm 2019</b>: nông – lâm – thuỷ sản 15,5%, công nghiệp – xây dựng 38,3%, dịch vụ 46,2%.</p><p>Khi kinh tế phát triển, tỉ trọng <b>nông nghiệp giảm</b>, công nghiệp tăng rồi chững lại, <b>dịch vụ tăng</b> mạnh.</p><div class="tip">Kéo thanh “Trình độ phát triển” và quan sát cột mô phỏng bên trái.</div>',
      enter: a => { a.fly([-4, 4.5, 11], [-4, 2, 0]); } },
    { title: 'GDP – tổng sản phẩm trong nước', html: '<p><b>GDP</b> là giá trị thị trường của tất cả hàng hoá và dịch vụ cuối cùng được sản xuất ra <b>trong phạm vi lãnh thổ</b> một nước, trong một thời kì nhất định (thường là 1 năm).</p><p>Mọi nhà máy trên “đảo quốc gia” – của người trong nước (mái xanh) hay doanh nghiệp FDI (mái tím) – đều tạo ra GDP.</p>',
      enter: a => { a.fly([7, 6, 12], [6, 1, 0]); } },
    { title: 'GNI – tổng thu nhập quốc gia', html: '<p><b>GNI</b> là tổng thu nhập do <b>công dân</b> của một nước tạo ra trong một thời kì nhất định, dù ở trong hay ngoài nước.</p><p style="text-align:center"><b>GNI = GDP + thu nhập từ nước ngoài chuyển về − thu nhập chuyển ra nước ngoài</b></p><ul><li>Lợi nhuận doanh nghiệp FDI chuyển về nước họ → làm GNI nhỏ hơn GDP.</li><li>Kiều hối, lương của công dân làm việc ở nước ngoài gửi về → làm GNI tăng.</li></ul><div class="tip">Kéo hai thanh điều khiển để thấy khi nào GNI lớn hơn hay nhỏ hơn GDP.</div>',
      enter: a => { a.fly([6, 7, 15], [5.5, 1, 0]); } },
    { title: 'Bình quân đầu người', html: '<p><b>GDP/người</b> = GDP ÷ số dân; <b>GNI/người</b> = GNI ÷ số dân.</p><p>Hai chỉ tiêu này dùng để so sánh <b>mức sống</b>, trình độ phát triển giữa các nước. Ngân hàng Thế giới dùng GNI/người để xếp các nước vào nhóm thu nhập thấp, trung bình thấp, trung bình cao, cao.</p>',
      enter: a => { a.fly([2, 7, 17], [2, 1.5, 0]); } },
  ],
  tasks: [
    { id: 'vn', text: 'Bấm vào phần <b>dịch vụ</b> trong cột Việt Nam 2019 để đọc tỉ trọng.' },
    { id: 'dev', text: 'Kéo “Trình độ phát triển” tới khi <b>dịch vụ chiếm trên 70%</b>.' },
    { id: 'less', text: 'Tạo tình huống <b>GNI nhỏ hơn GDP</b>.' },
    { id: 'more', text: 'Tạo tình huống <b>GNI lớn hơn GDP</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0x0f1d2b, grid: 0 });
    const grid = new THREE.GridHelper(40, 40, 0x2b4256, 0x1a2c3c); grid.position.y = -.01; scene.add(grid);
    // ---- cơ cấu ngành ----
    const info = (p) => ({ title: p.t, html: `Chiếm <b>${fmtN(p.v)}%</b> GDP.`, id: p.t });
    const sM = stack(api, { parts: model(0).map((v, i) => ({ t: NAME[i], v, c: COL[i] })), pos: [-7, 0, 0], title: 'Mô phỏng theo trình độ', info });
    const sV = stack(api, { parts: VN2019, pos: [-3.5, 0, 0], title: 'Việt Nam 2019', info: (p) => ({ ...info(p), onPick: () => { if (p.t === 'Dịch vụ') api.done('vn'); } }) });
    api.legend(NAME.map((t, i) => ({ t, c: '#' + COL[i].toString(16).padStart(6, '0') })));
    // ---- đảo quốc gia: GDP, GNI ----
    const N = new THREE.Group(); N.position.set(6, 0, 0); scene.add(N);
    N.add(island(7, 5, { color: 0x5f9a4c }));
    api.label('Lãnh thổ quốc gia', { cls: 'sm', pos: vec(-2.8, .4, 2.6), parent: N });
    const facs = [];
    [[-2, -1, 0x3b7dd8, 'dn'], [0, -1.2, 0x3b7dd8, 'dn'], [2, -1, 0x8e44ad, 'fdi'], [-1, 1, 0x3b7dd8, 'dn'], [1.6, 1.1, 0x8e44ad, 'fdi']].forEach(([x, z, roof, k]) => {
      const f = factory(api, { roof, chimneys: 1 }); f.scale.setScalar(.55); f.position.set(x, 0, z); N.add(f); facs.push(f);
      api.hotspot(f, { title: k === 'fdi' ? 'Doanh nghiệp có vốn đầu tư nước ngoài' : 'Doanh nghiệp trong nước', html: k === 'fdi' ? 'Sản xuất trên lãnh thổ nên giá trị tạo ra được tính vào <b>GDP</b>; nhưng phần lợi nhuận chuyển về nước chủ đầu tư bị trừ khi tính <b>GNI</b>.' : 'Giá trị tạo ra được tính vào cả GDP và GNI.' });
    });
    N.add(crowd(8, 4, 1.2, { seed: 5 }).translateZ(2));
    // nước ngoài: công dân làm việc ở nước ngoài, nhà đầu tư nước ngoài
    const abroad = new THREE.Group(); abroad.position.set(13.5, 0, -3); scene.add(abroad); abroad.add(island(3.4, 3, { color: 0x8ba870 }));
    api.label('Nước ngoài', { cls: 'sm', pos: vec(0, 1.6, 1.4), parent: abroad });
    for (let i = 0; i < 4; i++) { const p = person({ color: 0x27ae60 }); p.position.set(-1 + i * .55, 0, .5); abroad.add(p); }
    const hq = boxM(1, 1.2, .8, 0xb9a6d6, [.6, .6, -.6]); abroad.add(hq);
    const mkArc = (a, b, color, lift) => { const pts = []; for (let i = 0; i <= 30; i++) { const t = i / 30; const p = a.clone().lerp(b, t); p.y += Math.sin(Math.PI * t) * lift; pts.push(p); } const c = new THREE.CatmullRomCurve3(pts); const tube = new THREE.Mesh(new THREE.TubeGeometry(c, 40, .05, 8), mat(color, { basic: true, unique: true, opacity: .8 })); scene.add(tube); const fl = api.flowAlong(c, { count: 14, color, size: .12, speed: .2 }); return { tube, fl }; };
    const out = mkArc(vec(8.5, .8, -1), vec(13.6, 1.3, -3.6), 0xc77dff, 2.4); // lợi nhuận FDI chuyển ra
    const inn = mkArc(vec(12.8, .8, -2.2), vec(5, .8, 1), 0x3ddc84, 1.4);    // kiều hối chuyển về
    const outInfo = { title: 'Thu nhập chuyển ra nước ngoài', html: 'Lợi nhuận, lương của nhà đầu tư, người lao động nước ngoài làm việc trên lãnh thổ chuyển về nước họ → <b>trừ</b> khỏi GDP khi tính GNI.' };
    const inInfo = { title: 'Thu nhập từ nước ngoài chuyển về', html: 'Kiều hối, lương, lợi nhuận đầu tư ra nước ngoài của công dân chuyển về → <b>cộng</b> vào GDP khi tính GNI.' };
    api.hotspot(out.tube, outInfo); api.hotspot(inn.tube, inInfo);
    const lo = api.label('Chuyển ra', { cls: 'sm', pos: vec(11, 3.6, -2.3), onClick: outInfo }); const li = api.label('Chuyển về', { cls: 'sm', pos: vec(9, 2.3, -.5), onClick: inInfo });
    // cột GDP, GNI
    const B = new THREE.Group(); B.position.set(1.2, 0, 2.6); scene.add(B);
    const bG = boxM(.6, 1, .6, 0xf1c40f, null, { unique: true }); bG.position.x = -.4; const bN = boxM(.6, 1, .6, 0x2ecc71, null, { unique: true }); bN.position.x = .4; B.add(bG, bN);
    const lG = api.label('', { cls: 'sm', pos: vec(-.4, 0, 0), parent: B }); const lN = api.label('', { cls: 'sm', pos: vec(.4, 0, 0), parent: B });
    api.hotspot(bG, { title: 'GDP', html: 'Giá trị sản xuất trong phạm vi lãnh thổ (đơn vị quy ước = 100).' });
    api.hotspot(bN, { title: 'GNI', html: 'GNI = GDP + chuyển về − chuyển ra.' });
    const S = .025; state.inc = 5; state.outc = 10; state.k = 0;
    const calc = () => {
      const gni = 100 + state.inc - state.outc; const pop = state.pop || 50;
      bG.scale.y = 100 * S; bG.position.y = 100 * S / 2; bN.scale.y = gni * S; bN.position.y = gni * S / 2;
      lG.position.y = 100 * S + .35; lN.position.y = gni * S + .35; lG.element.textContent = 'GDP = 100'; lN.element.textContent = 'GNI = ' + fmtN(gni);
      out.tube.scale.setScalar(1); out.fl.visible = out.tube.visible = state.outc > 0; inn.fl.visible = inn.tube.visible = state.inc > 0; lo.visible = state.outc > 0; li.visible = state.inc > 0;
      out.tube.material.opacity = .25 + state.outc / 30 * .7; inn.tube.material.opacity = .25 + state.inc / 30 * .7;
      api.readout(`<b>Đơn vị quy ước</b><br>GDP = 100<br>Chuyển về: +${state.inc} · Chuyển ra: −${state.outc}<br>GNI = <b>${fmtN(gni)}</b> → ${gni < 100 ? 'GNI < GDP' : gni > 100 ? 'GNI > GDP' : 'GNI = GDP'}<br>Dân số: ${pop} (đv) → GDP/người = ${fmtN(100 / pop, 2)}, GNI/người = ${fmtN(gni / pop, 2)}`);
      if (state.ready && !state.fromStep) { if (gni < 100) api.done('less'); if (gni > 100) api.done('more'); }
    };
    api.heading('Cơ cấu ngành');
    api.slider('k', 'Trình độ phát triển', { min: 0, max: 1, step: .01, value: 0, format: v => v < .3 ? 'thấp (nông nghiệp là chủ yếu)' : v < .7 ? 'đang công nghiệp hoá' : 'cao (dịch vụ là chủ yếu)' }, v => {
      const m = model(v); sM.set(m.map((x, i) => ({ t: NAME[i], v: x, c: COL[i] }))); if (m[2] > 70 && state.ready) api.done('dev');
    });
    api.heading('GDP và GNI (đơn vị quy ước)');
    api.slider('inc', 'Thu nhập từ nước ngoài chuyển về', { min: 0, max: 30, step: 1, value: 5 }, v => { state.inc = v; calc(); });
    api.slider('outc', 'Thu nhập chuyển ra nước ngoài', { min: 0, max: 30, step: 1, value: 10 }, v => { state.outc = v; calc(); });
    api.slider('pop', 'Dân số (đơn vị quy ước)', { min: 10, max: 100, step: 5, value: 50 }, v => { state.pop = v; calc(); });
    calc(); state.ready = true;
  },
};

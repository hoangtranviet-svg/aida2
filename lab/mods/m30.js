// 3D-30 · Bài 30 – Tổ chức lãnh thổ công nghiệp
import { THREE, vec, mat, boxM, cylM, mesh, house, building, factory, forest, crowd, road, truck, water, stage, mine, solar } from '../kit.js';

const FORMS = {
  point: ['Điểm công nghiệp', 'Hình thức <b>đơn giản nhất</b>, đồng nhất với một điểm dân cư; gồm một (hoặc vài) xí nghiệp nằm gần nguồn nguyên liệu; giữa các xí nghiệp <b>hầu như không có mối liên hệ</b> sản xuất.<br><i>Vai trò</i>: góp phần công nghiệp hoá nông thôn, tiêu thụ nông sản, tạo việc làm và thu nhập cho địa phương.', [-14, 0, 0]],
  zone: ['Khu công nghiệp', 'Tập trung <b>nhiều xí nghiệp</b> có khả năng hợp tác sản xuất cao; có <b>ranh giới xác định</b>, <b>không có dân cư sinh sống</b>; dùng <b>chung cơ sở hạ tầng</b> (đường, điện, nước, xử lí nước thải).<br><i>Vai trò</i>: hình thức quan trọng ở các nước đang phát triển; thu hút đầu tư, đóng góp lớn vào giá trị xuất khẩu, tạo nhiều việc làm.', [0, 0, 0]],
  center: ['Trung tâm công nghiệp', 'Gắn với <b>đô thị vừa và lớn</b>, có vị trí địa lí thuận lợi; gồm các khu công nghiệp, điểm công nghiệp, xí nghiệp có mối liên hệ chặt chẽ về sản xuất, kĩ thuật, công nghệ; có các <b>xí nghiệp nòng cốt</b> (hạt nhân) và xí nghiệp bổ trợ, phục vụ.<br><i>Vai trò</i>: hạt nhân tăng trưởng, có sức lan toả rộng, đi đầu ứng dụng công nghệ mới.', [16, 0, 0]],
};

export default {
  id: '3D-30', code: 'DL10.B30', title: 'Tổ chức lãnh thổ công nghiệp',
  objectives: [
    { c: 'DL10.11.06', t: 'Quan niệm, vai trò, đặc điểm các hình thức tổ chức lãnh thổ công nghiệp' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 30', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'UNIDO – International Guidelines for Industrial Parks (2019)', u: 'https://www.unido.org/sites/default/files/files/2019-11/International_Guidelines_for_Industrial_Parks.pdf' },
  ],
  note: 'Ba cảnh là mô hình giả định, đặt cạnh nhau để so sánh quy mô và mức độ liên kết.',
  view: { pos: [1, 26, 40], target: [1, 0, 0] },
  steps: [
    { title: 'Tổ chức lãnh thổ công nghiệp', html: '<p>Là sự sắp xếp, phối hợp giữa các xí nghiệp, các hình thức tổ chức công nghiệp trên một lãnh thổ nhằm <b>sử dụng hợp lí</b> các nguồn lực, đạt hiệu quả cao về kinh tế, xã hội, môi trường.</p><p><b>Vai trò</b>: sử dụng hợp lí tài nguyên, phát huy sức mạnh tổng hợp của lãnh thổ, thu hút nguồn lực bên ngoài, góp phần công nghiệp hoá, hiện đại hoá.</p>',
      enter: a => { a.state.focus(null); a.fly([1, 26, 40], [1, 0, 0]); } },
    { title: 'Điểm công nghiệp', html: FORMS.point[1] + '<div class="tip">Ví dụ: một nhà máy chế biến gỗ cạnh vùng rừng nguyên liệu, một xưởng chế biến chè ở vùng đồi.</div>', enter: a => { a.state.focus('point'); a.fly([-12, 8, 11], [-14, 0, 0]); } },
    { title: 'Khu công nghiệp', html: FORMS.zone[1] + '<div class="tip">Bấm vào trạm xử lí nước thải tập trung và cổng khu công nghiệp.</div>', enter: a => { a.state.focus('zone'); a.fly([3, 11, 13], [0, 0, 0]); } },
    { title: 'Trung tâm công nghiệp', html: FORMS.center[1] + '<div class="tip">Xí nghiệp nòng cốt có mái màu đỏ; xí nghiệp bổ trợ có mái màu xám.</div>', enter: a => { a.state.focus('center'); a.fly([19, 13, 15], [16, 0, 0]); } },
  ],
  tasks: [
    { id: 'point', text: 'Bấm vào <b>điểm công nghiệp</b>.' },
    { id: 'infra', text: 'Trong khu công nghiệp, bấm vào <b>công trình hạ tầng dùng chung</b>.' },
    { id: 'core', text: 'Trong trung tâm công nghiệp, bấm vào một <b>xí nghiệp nòng cốt</b>.' },
    { id: 'compare', text: 'Mở bảng <b>so sánh</b> ba hình thức ở mục điều khiển.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa8d4ef });
    scene.add(boxM(70, .3, 30, 0x7aa65a, [1, -.16, 0]));
    const groups = {};
    const title = (k, y) => { const [n] = FORMS[k]; const info = { title: n, html: FORMS[k][1], id: k, onPick: () => { if (k === 'point') api.done('point'); } }; api.label(n, { cls: 'big', pos: vec(FORMS[k][2][0], y, FORMS[k][2][2] - 4), onClick: info }); return info; };
    // ---- điểm công nghiệp ----
    const P = new THREE.Group(); P.position.set(...FORMS.point[2]); scene.add(P); groups.point = P;
    P.add(forest(30, 7, 4, { seed: 2, kind: 'cone' }).translateZ(-2.5));
    [[-2, 2.2], [-1, 3], [-2.8, 3.2], [-1.6, 4]].forEach(([x, z]) => { const h = house(); h.position.set(x, 0, z); P.add(h); });
    const pf = factory(api, { roof: 0x8e6e53, chimneys: 1 }); pf.position.set(1.4, 0, 1.2); P.add(pf);
    const pInfo = title('point', 3.5); api.hotspot(pf, pInfo);
    const lt = truck({ color: 0x8b5a2b }); lt.position.set(.3, 0, -.4); P.add(lt); api.onTick((dt, t) => { lt.position.x = -1 + ((t * .15) % 1) * 2.4; });
    P.add(road(6).translateZ(.3));
    // ---- khu công nghiệp ----
    const Z = new THREE.Group(); Z.position.set(...FORMS.zone[2]); scene.add(Z); groups.zone = Z;
    Z.add(boxM(11, .04, 8, 0xc9cfd4, [0, .02, 0]));
    for (const [w, d, x, z] of [[11, .12, 0, -4], [11, .12, 0, 4], [.12, 8, -5.5, 0], [.12, 8, 5.5, 0]]) Z.add(boxM(w, .5, d, 0x7f8c8d, [x, .25, z]));
    const gate = new THREE.Group(); gate.add(boxM(.3, 1.2, .3, 0x34495e, [-.9, .6, 0])); gate.add(boxM(.3, 1.2, .3, 0x34495e, [.9, .6, 0])); gate.add(boxM(2.2, .3, .3, 0x2c3e50, [0, 1.3, 0])); gate.position.set(0, 0, 4); Z.add(gate);
    api.hotspot(gate, { title: 'Cổng khu công nghiệp', html: 'Khu công nghiệp có <b>ranh giới xác định</b>, được quản lí tập trung; không có dân cư sinh sống bên trong.' });
    Z.add(road(11).translateZ(.4)); const zr = road(8, { rot: Math.PI / 2 }); Z.add(zr);
    const zc = [0x2980b9, 0x16a085, 0x8e44ad, 0xd35400, 0x2c3e50, 0x27ae60];
    [[-3.6, -2.2], [-1.4, -2.2], [2.2, -2.2], [4, -2.2], [-3.6, 2.2], [2.6, 2.2]].forEach(([x, z], i) => { const f = factory(api, { roof: zc[i], chimneys: i % 2, smoke: i % 3 === 0 }); f.scale.setScalar(.75); f.position.set(x, 0, z); Z.add(f); api.hotspot(f, { title: 'Xí nghiệp trong khu công nghiệp', html: 'Các xí nghiệp sản xuất, cung cấp linh kiện cho nhau (hợp tác sản xuất), chủ yếu hướng tới xuất khẩu.' }); });
    const infra = new THREE.Group(); infra.position.set(-1.4, 0, 2.4); Z.add(infra);
    for (let i = 0; i < 2; i++) { infra.add(cylM(.55, .55, .35, 0x95a5a6, [i * 1.3, .18, 0])); infra.add(cylM(.48, .48, .02, 0x3a8fd8, [i * 1.3, .37, 0], { basic: true })); }
    const sub = new THREE.Group(); sub.position.set(4.4, 0, 2.6); Z.add(sub); for (let i = 0; i < 3; i++) sub.add(boxM(.15, 1, .15, 0xbdc3c7, [i * .35, .5, 0])); sub.add(boxM(.9, .06, .1, 0xbdc3c7, [.35, .95, 0]));
    const inInfo = { title: 'Hạ tầng dùng chung', html: 'Trạm xử lí nước thải tập trung, trạm biến áp, đường nội bộ, cấp nước… do các xí nghiệp <b>dùng chung</b> → giảm chi phí đầu tư, dễ kiểm soát môi trường.', id: 'infra', onPick: () => api.done('infra') };
    api.hotspot(infra, inInfo); api.hotspot(sub, inInfo); api.label('Xử lí nước thải tập trung', { cls: 'sm', pos: vec(-.8, 1.1, 2.4), parent: Z, onClick: inInfo });
    title('zone', 3.5);
    const workers = crowd(10, 3, 1.2, { seed: 7 }); workers.position.set(0, 0, 6); Z.add(workers);
    // ---- trung tâm công nghiệp ----
    const T = new THREE.Group(); T.position.set(...FORMS.center[2]); scene.add(T); groups.center = T;
    const sky = [[-2, -3, 3.2], [-1, -3.4, 4.2], [.2, -3, 2.8], [1.3, -3.3, 3.6], [-.4, -1.8, 2], [1.4, -1.8, 2.4], [-1.8, -1.6, 1.8]];
    sky.forEach(([x, z, h], i) => { const b = building({ h, w: .9, d: .9, color: [0x9fb7c9, 0xb8c6d1, 0x8fa9bd][i % 3] }); b.position.set(x, 0, z); T.add(b); });
    T.add(crowd(18, 5, 1.8, { seed: 11 }).translateZ(-.3));
    const cores = [[-4.2, 1.6], [4.4, 1.2]]; cores.forEach(([x, z]) => { const f = factory(api, { roof: 0xc0392b, chimneys: 2 }); f.scale.setScalar(1.05); f.position.set(x, 0, z); T.add(f); api.hotspot(f, { title: 'Xí nghiệp nòng cốt (hạt nhân)', html: 'Xí nghiệp quy mô lớn, quyết định hướng chuyên môn hoá của trung tâm (ví dụ: cơ khí, hoá chất, điện tử). Các xí nghiệp bổ trợ cung cấp linh kiện, dịch vụ cho xí nghiệp nòng cốt.', id: 'core', onPick: () => api.done('core') }); });
    [[-4.6, 4.2], [-2.6, 4.4], [2.4, 4.2], [4.6, 4], [0, 4.6]].forEach(([x, z]) => { const f = factory(api, { roof: 0x7f8c8d, chimneys: 0, smoke: false }); f.scale.setScalar(.55); f.position.set(x, 0, z); T.add(f); api.hotspot(f, { title: 'Xí nghiệp bổ trợ, phục vụ', html: 'Sản xuất chi tiết, bao bì, sửa chữa, vận tải… phục vụ xí nghiệp nòng cốt và đời sống đô thị.' }); });
    T.add(road(12).translateZ(2.9)); const tr = road(10, { rot: Math.PI / 2 }); T.add(tr);
    title('center', 5.2);
    // nối liên kết trong trung tâm
    const links = new THREE.Group(); T.add(links);
    cores.forEach(([x, z]) => [[-4.6, 4.2], [-2.6, 4.4], [2.4, 4.2], [4.6, 4], [0, 4.6]].forEach(([a, b]) => { const c = new THREE.CatmullRomCurve3([vec(x, .9, z), vec((x + a) / 2, 1.8, (z + b) / 2), vec(a, .6, b)]); links.add(new THREE.Mesh(new THREE.TubeGeometry(c, 16, .02, 5), mat(0xffd36b, { basic: true, opacity: .7 }))); }));
    // tập trung vào 1 hình thức
    state.focus = k => { links.visible = !k || k === 'center'; };
    // điều khiển: bảng so sánh
    api.heading('So sánh');
    api.toggle('cmp', 'Bảng so sánh ba hình thức', false, v => {
      if (v && state.ready) api.done('compare');
      api.readout(v ? '<table style="font-size:12px;border-collapse:collapse"><tr><th></th><th>Điểm CN</th><th>Khu CN</th><th>Trung tâm CN</th></tr><tr><td>Quy mô</td><td>nhỏ</td><td>vừa</td><td>lớn</td></tr><tr><td>Dân cư</td><td>gắn điểm dân cư</td><td>không có dân</td><td>gắn đô thị</td></tr><tr><td>Liên kết</td><td>hầu như không</td><td>hợp tác sản xuất</td><td>chặt chẽ, có hạt nhân</td></tr><tr><td>Hạ tầng</td><td>riêng lẻ</td><td>dùng chung</td><td>hoàn chỉnh</td></tr></table>' : null);
    });
    state.ready = true;
  },
};

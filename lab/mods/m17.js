// 3D-17 · Bài 17 – Vỏ địa lí, quy luật thống nhất và hoàn chỉnh
import { THREE } from '../core.js';

// Khối cắt sơ đồ (không đúng tỉ lệ): biển bên trái, đồi núi có rừng bên phải
const W = 12, D = 6;
const ground = (x, z) => x < -1.5 ? -1.6 + .2 * Math.sin(z) : .15 + 1.9 * Math.exp(-(((x - 3.2) ** 2) / 4 + ((z + .4) ** 2) / 5)) + .3 * THREE.MathUtils.smoothstep(x, -1.5, 0) - .3;

export default {
  id: '3D-17', code: 'DL10.B17', title: 'Vỏ địa lí, quy luật thống nhất và hoàn chỉnh',
  objectives: [
    { c: 'DL10.07.01', t: 'Khái niệm vỏ địa lí; phân biệt vỏ địa lí và vỏ Trái Đất' },
    { c: 'DL10.07.02', t: 'Khái niệm, biểu hiện, ý nghĩa của quy luật thống nhất và hoàn chỉnh' },
    { c: 'DL10.07.04', t: 'Giải thích hiện tượng tự nhiên bằng quy luật địa lí' },
  ],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 17', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'NASA Earth Observatory – Deforestation and the water cycle', u: 'https://earthobservatory.nasa.gov/features/Deforestation' },
    { t: 'FAO – Forests and Water', u: 'https://www.fao.org/forestry/water/en/' },
  ],
  view: { pos: [-9, 7, 13], target: [0, .8, 0] },
  steps: [
    { title: 'Vỏ địa lí là gì?', html: '<p><b>Vỏ địa lí</b> (lớp vỏ cảnh quan) là lớp vỏ của Trái Đất, ở đó các lớp vỏ bộ phận (<b>khí quyển, thạch quyển, thuỷ quyển, thổ nhưỡng quyển, sinh quyển</b>) xâm nhập và tác động lẫn nhau.</p><div class="tip">Bấm vào tên từng quyển trên khối cắt.</div>',
      enter: a => { a.fly([-9, 7, 13], [0, .8, 0]); a.state.forest(true); } },
    { title: 'Giới hạn của vỏ địa lí', html: '<ul><li><b>Giới hạn trên</b>: nơi tiếp giáp lớp ô-dôn (khoảng 25 km).</li><li><b>Giới hạn dưới</b>: ở đại dương tới đáy vực thẳm (khoảng 11 km); ở lục địa tới đáy lớp vỏ phong hoá.</li><li>Chiều dày khoảng <b>30 – 35 km</b>.</li></ul><p class="muted">Khối cắt là sơ đồ, độ cao các lớp không theo tỉ lệ.</p>',
      enter: a => { a.fly([10, 5, 12], [3, 1.5, 0]); a.state.brackets(true); } },
    { title: 'Vỏ địa lí khác vỏ Trái Đất', html: '<table style="width:100%;font-size:13px;border-collapse:collapse"><tr><th></th><th>Vỏ Trái Đất</th><th>Vỏ địa lí</th></tr>' +
        '<tr><td><b>Độ dày</b></td><td>5 km (đại dương) – 70 km (lục địa)</td><td>30 – 35 km</td></tr>' +
        '<tr><td><b>Thành phần</b></td><td>Chỉ gồm các tầng đá (trầm tích, granit, badan)</td><td>Gồm cả khí, nước, đất, sinh vật và đá</td></tr>' +
        '<tr><td><b>Giới hạn</b></td><td>Từ bề mặt đến mặt Mô-hô</td><td>Từ lớp ô-dôn đến đáy vực thẳm / đáy vỏ phong hoá</td></tr></table>',
      enter: a => { a.fly([10, 5, 12], [3, 1.5, 0]); a.state.brackets(true); } },
    { title: 'Quy luật thống nhất và hoàn chỉnh', html: '<p>Là quy luật về <b>mối quan hệ quy định lẫn nhau</b> giữa các thành phần và mỗi bộ phận lãnh thổ của vỏ địa lí.</p><p><b>Nguyên nhân</b>: các thành phần cùng chịu tác động của nội lực, ngoại lực và luôn trao đổi vật chất, năng lượng với nhau.</p><p><b>Biểu hiện</b>: một thành phần thay đổi sẽ kéo theo sự thay đổi của các thành phần còn lại.</p>',
      enter: a => { a.fly([-9, 7, 13], [0, .8, 0]); } },
    { title: 'Thử nghiệm: chặt phá rừng đầu nguồn', html: '<p>Bật <b>Chặt phá rừng</b> và quan sát chuỗi thay đổi:</p><ol><li><b>Sinh vật</b>: mất rừng, động vật mất nơi sống.</li><li><b>Đất</b>: mưa rơi thẳng xuống, đất bị xói mòn, bạc màu.</li><li><b>Nước</b>: nước chảy tràn nhanh → lũ lên nhanh, nước sông đục; mùa khô sông cạn.</li><li><b>Khí hậu</b>: độ ẩm giảm, biên độ nhiệt tăng.</li></ol>',
      enter: a => { a.fly([-4, 6, 12], [2, .8, 0]); } },
    { title: 'Ý nghĩa thực tiễn', html: '<p>Trước khi khai thác, sử dụng bất kì thành phần nào của tự nhiên cần <b>nghiên cứu kĩ, toàn diện</b> tất cả các thành phần để dự báo trước tác động.</p><p><b>Liên hệ</b>: phá rừng đầu nguồn ở miền núi phía Bắc làm tăng lũ quét, sạt lở; trồng rừng ngập mặn ven biển giúp chắn sóng, giữ đất, tăng nguồn lợi thuỷ sản.</p>',
      enter: a => { a.fly([-9, 7, 13], [0, .8, 0]); } },
  ],
  tasks: [
    { id: 'q4', text: 'Bấm vào tên <b>4 quyển</b> khác nhau trên khối cắt.' },
    { id: 'top', text: 'Bấm vào <b>giới hạn trên</b> của vỏ địa lí.' },
    { id: 'cmp', text: 'Bấm vào thước <b>Vỏ Trái Đất</b> để so sánh với vỏ địa lí.' },
    { id: 'cut', text: 'Bật <b>Chặt phá rừng</b> và theo dõi chuỗi thay đổi.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x0d1c27);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x403020, 1.0)); const sun = new THREE.DirectionalLight(0xffffff, 1.7); sun.position.set(-5, 10, 7); scene.add(sun);
    // địa hình bề mặt
    const geo = new THREE.PlaneGeometry(W, D, 120, 60); geo.rotateX(-Math.PI / 2); const P = geo.attributes.position; const col = new Float32Array(P.count * 3);
    for (let i = 0; i < P.count; i++) { const x = P.getX(i), z = P.getZ(i), y = ground(x, z); P.setY(i, y); col.set(x < -1.5 ? [.75, .68, .5] : y > 1.4 ? [.45, .42, .35] : [.5, .38, .25], i * 3); }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
    const surf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 })); scene.add(surf);
    // mặt cắt phía trước: các lớp
    const front = (y0, y1, x0, x1, color, op = 1) => { const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, .06), new THREE.MeshStandardMaterial({ color, transparent: op < 1, opacity: op })); m.position.set((x0 + x1) / 2, (y0 + y1) / 2, D / 2 + .03); scene.add(m); return m; };
    front(-1.6, -1.15, -6, -1.5, 0xc9b98a);           // trầm tích đáy biển
    front(-.15, .05, -1.5, 6, 0x6b4a2c);               // tầng đất (thổ nhưỡng)
    front(-.75, -.15, -1.5, 6, 0x8f7a5c);              // vỏ phong hoá
    front(-3.2, -.75, -1.5, 6, 0x8d8f96);              // granit
    front(-3.2, -1.15, -6, -1.5, 0x5d6270);            // badan đáy đại dương
    front(-4.6, -3.2, -6, 6, 0x4b4f5e);                // badan
    front(-5.6, -4.6, -6, 6, 0x7a3b2c, .9);            // man-ti trên
    const sea = new THREE.Mesh(new THREE.BoxGeometry(4.5, 1.75, D), new THREE.MeshStandardMaterial({ color: 0x2b78c2, transparent: true, opacity: .78, roughness: .2 })); sea.position.set(-3.75, -.7, 0); scene.add(sea);
    // khí quyển (khối trong suốt) và lớp ô-dôn
    const air = new THREE.Mesh(new THREE.BoxGeometry(W, 4.6, D), new THREE.MeshStandardMaterial({ color: 0x9fd0ff, transparent: true, opacity: .07, depthWrite: false })); air.position.set(0, 2.5, 0); scene.add(air);
    const ozone = new THREE.Mesh(new THREE.BoxGeometry(W, .14, D), new THREE.MeshBasicMaterial({ color: 0xb48cff, transparent: true, opacity: .55 })); ozone.position.set(0, 4.9, 0); scene.add(ozone);
    // rừng
    const treeM = new THREE.MeshStandardMaterial({ color: 0x2f7a3a }); const trunkM = new THREE.MeshStandardMaterial({ color: 0x5a3d24 });
    const N = 220; const crowns = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.22, 0), treeM, N); const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.03, .04, .3, 5), trunkM, N);
    const TP = []; for (let k = 0; k < 2000 && TP.length < N; k++) { const x = -.8 + Math.random() * 6.4, z = (Math.random() - .5) * D * .9; const y = ground(x, z); if (y > .1) TP.push({ x, y, z, s: .8 + Math.random() * .6 }); }
    crowns.count = trunks.count = TP.length; scene.add(crowns, trunks);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
    state.treeK = 1; state.cut = false;
    // sông chảy xuống biển
    const riv = new THREE.CatmullRomCurve3([new THREE.Vector3(4.5, ground(4.5, 1.6) + .05, 1.6), new THREE.Vector3(2, ground(2, 2) + .05, 2), new THREE.Vector3(0, ground(0, 1.6) + .05, 1.4), new THREE.Vector3(-1.6, -.85, 1.2)]);
    const rivMesh = api.tube(riv.getPoints(80), .07, 0x3d8fd8); scene.add(rivMesh);
    const rivFlow = api.flowAlong(riv, { count: 30, color: 0xcfe9ff, size: .045, speed: .12 });
    // mưa
    const RN = 220; const rain = new THREE.InstancedMesh(new THREE.CylinderGeometry(.012, .012, .2, 4), new THREE.MeshBasicMaterial({ color: 0x7fb8ff }), RN); scene.add(rain);
    const rd = Array.from({ length: RN }, () => ({ x: -.5 + Math.random() * 6, z: (Math.random() - .5) * D * .8, k: Math.random() }));
    // đất bị cuốn trôi
    const EN = 120; const ero = new THREE.InstancedMesh(new THREE.SphereGeometry(.045, 6, 4), new THREE.MeshStandardMaterial({ color: 0x8a5a2c }), EN); scene.add(ero);
    const ed = Array.from({ length: EN }, () => ({ x: 1 + Math.random() * 4, z: (Math.random() - .5) * D * .7, k: Math.random() }));
    api.onTick((dt, t) => {
      const target = state.cut ? 0 : 1; state.treeK += (target - state.treeK) * Math.min(1, dt * 1.5);
      TP.forEach((p, i) => { const s = p.s * Math.max(0, state.treeK); m4.compose(v1.set(p.x, p.y + .45 * s, p.z), q, v2.set(s, s, s)); crowns.setMatrixAt(i, m4); m4.compose(v1.set(p.x, p.y + .15 * s, p.z), q, v2.set(s, s, s)); trunks.setMatrixAt(i, m4); });
      crowns.instanceMatrix.needsUpdate = trunks.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < RN; i++) { const d = rd[i]; d.k = (d.k + dt * .8) % 1; const yb = ground(d.x, d.z); const top = state.cut ? 4.2 : 4.2; const stop = state.cut ? yb : yb + .6 * state.treeK + (1 - state.treeK) * 0; m4.makeTranslation(d.x, top - (top - stop) * d.k, d.z); rain.setMatrixAt(i, m4); }
      rain.instanceMatrix.needsUpdate = true;
      const er = 1 - state.treeK; for (let i = 0; i < EN; i++) { const d = ed[i]; d.k = (d.k + dt * .25) % 1; const x = d.x - d.k * 3.2, z = d.z * (1 - d.k * .6) + 1.4 * d.k; const s = er > .2 ? er : 0; m4.compose(v1.set(x, ground(x, z) + .06, z), q, v2.set(s, s, s)); ero.setMatrixAt(i, m4); }
      ero.instanceMatrix.needsUpdate = true;
      rivMesh.material.color.setRGB(.24 + er * .4, .56 - er * .2, .85 - er * .6);
      rivFlow.material.color.setRGB(.8 + er * .1, .9 - er * .35, 1 - er * .6);
      ozone.material.opacity = .45 + .15 * Math.sin(t * 1.5);
    });
    // nhãn các quyển
    const seen = new Set(); const sphere = (name, html, pos, cls = '') => api.label(name, { cls, pos, onClick: { title: name, html, id: 'q-' + name, onPick: () => { seen.add(name); if (seen.size >= 4) api.done('q4'); } } });
    sphere('Khí quyển', 'Lớp không khí; trong vỏ địa lí là phần dưới khí quyển tới lớp ô-dôn. Cung cấp nhiệt, ẩm, gây mưa, gió tác động lên các quyển khác.', new THREE.Vector3(-4, 3.2, 1), 'cold');
    sphere('Thuỷ quyển', 'Nước biển, đại dương, sông, hồ, nước ngầm. Nước tham gia phong hoá, vận chuyển vật chất, nuôi dưỡng sinh vật.', new THREE.Vector3(-3.8, -.2, 2.6), 'cold');
    sphere('Thạch quyển', 'Phần trên của vỏ Trái Đất (đá) – trong vỏ địa lí tới đáy lớp vỏ phong hoá. Là nền tảng, cung cấp vật liệu khoáng cho đất.', new THREE.Vector3(3, -2, D / 2 + .3));
    sphere('Thổ nhưỡng quyển', 'Lớp đất trên bề mặt lục địa – nơi tiếp xúc, giao thoa của khí, thuỷ, thạch và sinh quyển.', new THREE.Vector3(0, .25, D / 2 + .3), 'warm');
    sphere('Sinh quyển', 'Toàn bộ sinh vật cùng môi trường sống. Thực vật giữ đất, điều hoà nước, góp phần điều hoà khí hậu.', new THREE.Vector3(3.2, 2.9, -.4));
    api.label('Giới hạn trên – lớp ô-dôn (≈ 25 km)', { cls: 'sm', pos: new THREE.Vector3(-4.5, 5.25, 0), onClick: { title: 'Giới hạn trên của vỏ địa lí', html: 'Nơi tiếp giáp lớp ô-dôn của khí quyển, ở độ cao khoảng <b>25 km</b>.', id: 'top', onPick: () => api.done('top') } });
    // thước so sánh
    const brG = new THREE.Group(); scene.add(brG);
    const bracket = (x, y0, y1, color) => { const g = new THREE.Group(); const mat = new THREE.MeshBasicMaterial({ color }); const v = new THREE.Mesh(new THREE.BoxGeometry(.06, y1 - y0, .06), mat); v.position.set(x, (y0 + y1) / 2, D / 2 + .4); g.add(v); [y0, y1].forEach(y => { const h = new THREE.Mesh(new THREE.BoxGeometry(.4, .06, .06), mat); h.position.set(x - .17, y, D / 2 + .4); g.add(h); }); brG.add(g); return g; };
    bracket(6.5, -.75, 4.9, 0xf0be57); bracket(7.4, -3.2, .3, 0xb0b8c8);
    api.label('Vỏ địa lí ≈ 30 – 35 km', { cls: 'warm', pos: new THREE.Vector3(6.6, 2.3, D / 2 + .5), parent: brG, onClick: { title: 'Vỏ địa lí', html: 'Từ lớp ô-dôn tới đáy vực thẳm đại dương (≈ 11 km) và đáy lớp vỏ phong hoá ở lục địa; gồm cả khí, nước, đất, sinh vật, đá.', id: 'vdl' } });
    api.label('Vỏ Trái Đất 5 – 70 km', { cls: '', pos: new THREE.Vector3(7.5, -1.5, D / 2 + .5), parent: brG, onClick: { title: 'Vỏ Trái Đất', html: 'Lớp vỏ cứng, chỉ gồm các tầng đá; dày khoảng 5 km ở đại dương đến 70 km ở lục địa, kéo xuống tới mặt Mô-hô.', id: 'cmp', onPick: () => api.done('cmp') } });
    api.label('Đáy lớp vỏ phong hoá', { cls: 'sm plain', pos: new THREE.Vector3(1.5, -.95, D / 2 + .3) });
    api.label('Lớp Man-ti', { cls: 'sm plain', pos: new THREE.Vector3(-3, -5.1, D / 2 + .3) });
    api.label('Không theo tỉ lệ', { cls: 'sm plain', pos: new THREE.Vector3(-5.6, -6, D / 2 + .3) });
    // chuỗi thay đổi khi chặt rừng
    const chain = [
      ['1. Sinh vật', 'Mất rừng, động vật mất nơi sống', new THREE.Vector3(3, 3.6, -1.5)],
      ['2. Đất', 'Xói mòn, rửa trôi, bạc màu', new THREE.Vector3(2.4, 1.2, 2.6)],
      ['3. Nước', 'Lũ lên nhanh, nước đục; mùa khô cạn kiệt', new THREE.Vector3(-.6, .6, 2.6)],
      ['4. Khí hậu', 'Độ ẩm giảm, biên độ nhiệt tăng', new THREE.Vector3(1, 4.3, 0)],
    ].map(([t, d, p]) => { const l = api.label(`${t}: ${d}`, { cls: 'sm warm', pos: p }); l.visible = false; return l; });
    let timers = [];
    const runChain = on => { timers.forEach(clearTimeout); timers = []; chain.forEach(l => (l.visible = false)); if (!on) { api.readout(null); return; }
      chain.forEach((l, i) => timers.push(setTimeout(() => { l.visible = true; api.readout(`<b>Chuỗi thay đổi</b><br>${chain.slice(0, i + 1).map(c => c.element.textContent).join('<br>')}`); }, 900 + i * 1300))); };
    state.forest = v => api.set('cut', !v);
    state.brackets = v => api.set('br', v);
    api.heading('Thử nghiệm');
    api.toggle('cut', 'Chặt phá rừng đầu nguồn', false, v => { state.cut = v; runChain(v); if (v) api.done('cut'); });
    api.toggle('br', 'Thước so sánh độ dày', true, v => (brG.visible = v));
  },
};

// 3D-11a · Bài 11 – Các nhân tố ảnh hưởng đến chế độ nước sông (nguồn cấp nước)
import { THREE } from '../core.js';
import { FAM11 } from './fam11.js';

const W = 20, Dz = 12, X0 = -W / 2;
const rz = x => 1.1 * Math.sin(x * .33 + .4);                 // tim dòng sông
function h(x, z) {
  let y = .25 + .055 * (x - X0);                               // nghiêng dần về hạ lưu (phía tây)
  y += 4.6 * Math.exp(-(((x - 7) ** 2) / 5 + ((z + .3) ** 2) / 9));
  y += 2.7 * Math.exp(-(((x - 3) ** 2) / 4 + ((z - 4) ** 2) / 3.5));
  y += 2.5 * Math.exp(-(((x - 2) ** 2) / 5 + ((z + 4.3) ** 2) / 3));
  y += .8 * Math.exp(-(((x + 5) ** 2) / 6 + ((z + 4.5) ** 2) / 3));
  const valley = THREE.MathUtils.smoothstep(7.2 - x, 0, 3);    // thung lũng mở dần về hạ lưu
  y -= (.9 + .25 * Math.max(0, x)) * Math.exp(-((z - rz(x)) ** 2) / 1.3) * valley;
  return y;
}
const MON = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
// số liệu khí hậu minh hoạ (mm, °C)
const CLIM = {
  nd: { name: 'Nhiệt đới gió mùa (Việt Nam)', rain: [20, 25, 45, 90, 190, 240, 290, 320, 260, 180, 60, 25], temp: [16, 17, 20, 24, 27, 29, 29, 28, 27, 24, 21, 17] },
  od: { name: 'Ôn đới lạnh, núi cao', rain: [55, 50, 55, 40, 30, 30, 35, 30, 35, 50, 55, 55], temp: [-14, -12, -6, 1, 8, 13, 15, 14, 8, -1, -7, -12] },
};

// mô hình thuỷ văn đơn giản: tách 3 nguồn cấp và cho qua "bộ điều tiết" rừng – nước ngầm – hồ
function hydro(o) {
  const C = CLIM[o.clim];
  const infil = .05 + .3 * o.forest + (o.perm ? .2 : 0);          // phần thấm xuống đất
  const et = .12 + .08 * o.forest;                                  // bốc hơi, thoát hơi nước
  const run = Math.max(.05, 1 - infil - et);
  const quick = (o.steep ? .9 : .6) * (1 - .5 * o.forest);                                // dốc: nước dồn nhanh
  const kb = o.perm ? .2 : .45;                                    // tầng chứa nước lớn → nhả nước chậm, đều
  const kl = o.lake ? .42 : 1;
  let snow = 0, G = 20, lag = [0, 0, 0], L = [0, 0, 0];
  let out = [];
  for (let yr = 0; yr < 4; yr++) {
    out = [];
    for (let m = 0; m < 12; m++) {
      const P = C.rain[m], T = C.temp[m];
      let liquid = P, melt = 0;
      if (T < 0) { snow += P; liquid = 0; } else if (snow > 0) { melt = Math.min(snow, snow * Math.min(1, T / 9) + 6 * T); snow -= melt; }
      const sR = liquid * run, sM = melt * (run + .1);
      G += liquid * infil + melt * infil * .6; const base = kb * G; G -= base;
      // nước chảy mặt: một phần đến ngay, phần còn lại muộn một tháng (rừng, địa hình thoải làm chậm)
      const inR = sR * quick + lag[0], inM = sM * quick + lag[1]; lag = [sR * (1 - quick), sM * (1 - quick), 0];
      const inc = [inR, inM, base];
      const q = inc.map((v, k) => { L[k] += v; const r = L[k] * kl; L[k] -= r; return r; });
      out.push({ rain: q[0], snow: q[1], gw: q[2], tot: q[0] + q[1] + q[2], P, T, pack: snow });
    }
  }
  const mean = out.reduce((a, v) => a + v.tot, 0) / 12;
  const flood = out.map(v => v.tot > mean);
  const sum = k => out.reduce((a, v) => a + v[k], 0);
  const tot = sum('tot');
  return { out, mean, flood, share: { rain: sum('rain') / tot, snow: sum('snow') / tot, gw: sum('gw') / tot }, max: Math.max(...out.map(v => v.tot)), min: Math.max(mean * .04, Math.min(...out.map(v => v.tot))) };
}

export default {
  id: '3D-11a', lab: '11a', family: FAM11, sub: true, code: 'DL10.B11', title: 'Nhân tố ảnh hưởng đến chế độ nước sông',
  objectives: [{ c: 'DL10.05.02', t: 'Các nhân tố ảnh hưởng tới chế độ nước sông' }, { c: 'DL10.05.05', t: 'Nước băng tuyết và nước ngầm' }],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 11: Thuỷ quyển, nước trên lục địa', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'USGS Water Science School – Streamflow and the Water Cycle', u: 'https://www.usgs.gov/special-topics/water-science-school/science/streamflow-and-water-cycle' },
    { t: 'NOAA/NWS – Snowmelt and spring flooding', u: 'https://www.weather.gov/safety/flood-snowmelt' },
  ],
  note: 'Số liệu mưa, nhiệt độ và lưu lượng là minh hoạ (tương đối), dùng để so sánh tác động của từng nhân tố; không phải số đo của một con sông cụ thể.',
  view: { pos: [-15, 12, 15], target: [0, 0, 0] },
  steps: [
    { title: 'Ba nguồn cấp nước cho sông', html: '<p>Sông được cấp nước từ <b>nước mưa</b>, <b>băng tuyết tan</b> và <b>nước ngầm</b>. Nguồn cấp nào chiếm ưu thế sẽ quyết định <b>chế độ nước sông</b> – sự thay đổi lưu lượng nước trong năm.</p><p>Đồ thị góc trên bên phải tách lưu lượng sông thành 3 phần màu theo 3 nguồn cấp. Các tháng tô nền đậm là <b>mùa lũ</b> (lưu lượng lớn hơn trung bình năm).</p><div class="tip">Kéo thanh <b>Tháng</b> hoặc bật <b>Chạy qua 12 tháng</b> để thấy sông to, nhỏ theo mùa.</div>',
      enter: a => { a.state.apply({ clim: 'nd' }); a.fly([-15, 12, 15], [0, 0, 0]); } },
    { title: 'Chế độ mưa', html: '<p>Ở vùng <b>nhiệt đới gió mùa</b> như Việt Nam, sông chủ yếu do <b>nước mưa</b> cung cấp nên <b>mùa lũ trùng với mùa mưa</b> (khoảng tháng 6 – 10 ở miền Bắc), mùa cạn trùng mùa khô.</p><p>Mưa càng tập trung theo mùa thì chênh lệch lưu lượng giữa mùa lũ và mùa cạn càng lớn.</p>',
      enter: a => { a.state.apply({ clim: 'nd', month: 7 }); a.fly([-12, 9, 12], [-1, 1, 0]); } },
    { title: 'Băng tuyết tan', html: '<p>Ở vùng <b>ôn đới lạnh</b> và <b>núi cao</b>, mùa đông nhiệt độ dưới 0 °C: mưa rơi dưới dạng tuyết và <b>tích lại</b> trên núi, sông ít nước.</p><p>Sang <b>xuân – hạ</b>, nhiệt độ tăng, băng tuyết tan → sông có <b>lũ vào mùa xuân – hạ</b> (VD: các sông ở Xi-bia, sông bắt nguồn từ Hi-ma-lay-a).</p>',
      enter: a => { a.state.apply({ clim: 'od', month: 5 }); a.fly([6, 11, 15], [5, 2, 0]); } },
    { title: 'Nước ngầm', html: '<p>Nước mưa thấm xuống đất trở thành <b>nước ngầm</b>, rồi rỉ ra lòng sông <b>quanh năm</b>. Nhờ đó sông vẫn có nước vào mùa khô – nước ngầm có vai trò <b>điều hoà dòng chảy</b>.</p><p>Nơi có đá dễ thấm nước (cát, sỏi, <b>đá vôi</b>), lượng nước ngầm cấp cho sông rất lớn.</p><div class="tip">Quan sát mặt cắt ở đầu khối địa hình: các hạt xanh là nước ngầm chảy vào lòng sông.</div>',
      enter: a => { a.state.apply({ perm: true }); a.fly([-17, 3, 6], [-9, -1, 0]); } },
    { title: 'Địa hình, thực vật, hồ đầm', html: '<ul><li><b>Địa hình</b>: miền núi dốc, nước dồn nhanh → lũ lên nhanh, rút nhanh; đồng bằng thoải, nước chảy chậm.</li><li><b>Thực vật</b> (rừng): giữ nước, tăng thấm → <b>giảm đỉnh lũ</b>, tăng lượng nước mùa cạn. Mất rừng → lũ lớn, mùa cạn cạn kiệt.</li><li><b>Hồ, đầm</b>: chứa nước mùa lũ, trả nước mùa cạn → <b>điều hoà chế độ nước sông</b> (VD: Biển Hồ ở Cam-pu-chia điều hoà sông Mê Công).</li></ul>',
      enter: a => { a.fly([-6, 13, 14], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'od', text: 'Chọn khí hậu <b>ôn đới lạnh, núi cao</b> và tìm tháng sông có lũ do <b>băng tuyết tan</b>.', hint: 'kéo thanh Tháng sang tháng 5 – 7' },
    { id: 'forest', text: 'Giảm <b>độ che phủ rừng</b> xuống dưới 20% và so sánh đỉnh lũ trên đồ thị.' },
    { id: 'lake', text: 'Bật <b>hồ, đầm trên dòng sông</b> – đồ thị lưu lượng thay đổi thế nào?' },
    { id: 'perm', text: 'Chọn nền <b>đá thấm nước tốt</b> (đá vôi, cát sỏi) để tăng nguồn nước ngầm cấp cho sông.' },
    { id: 'src3', text: 'Bấm vào <b>3 nguồn cấp nước</b> trên mô hình: mưa, băng tuyết tan, nước ngầm.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0xa9cfee); scene.fog = new THREE.Fog(0xa9cfee, 34, 70);
    const sunL = new THREE.DirectionalLight(0xffffff, 2.3); sunL.position.set(-8, 14, 9); scene.add(sunL);
    scene.add(new THREE.HemisphereLight(0xd9ecff, 0x5a4a30, .85));
    const o = state.o = { clim: 'nd', month: 7, forest: .7, lake: false, perm: false, steep: true, play: true };
    let H = hydro(o);

    // ---------- địa hình ----------
    const geo = new THREE.PlaneGeometry(W, Dz, 200, 120); geo.rotateX(-Math.PI / 2);
    const P = geo.attributes.position; const col = new Float32Array(P.count * 3); const hs = new Float32Array(P.count);
    for (let i = 0; i < P.count; i++) { const y = h(P.getX(i), P.getZ(i)); P.setY(i, y); hs[i] = y; }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
    const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 })); scene.add(ground);
    const cA = new THREE.Color(), cB = new THREE.Color();
    function paint(snowLine) {
      for (let i = 0; i < P.count; i++) {
        const y = hs[i];
        if (y > snowLine) cA.setRGB(.95, .97, 1);
        else if (y > 3.3) cA.setRGB(.52, .5, .46);
        else if (y > 1.6) cA.setRGB(.36, .48, .27);
        else cA.setRGB(.5, .63, .33);
        if (y > snowLine - .35 && y <= snowLine) { cB.setRGB(.82, .86, .9); cA.lerp(cB, (y - snowLine + .35) / .35); }
        col.set([cA.r, cA.g, cA.b], i * 3);
      }
      geo.attributes.color.needsUpdate = true;
    }
    // mép khối (đất) cho đẹp
    const skirtM = new THREE.MeshStandardMaterial({ color: 0x7a5b3c, roughness: 1 });
    [[0, Dz / 2, 0], [0, -Dz / 2, Math.PI]].forEach(([x, z, r]) => {
      const pts = []; for (let i = 0; i <= 120; i++) { const xx = X0 + i / 120 * W; pts.push(new THREE.Vector2(xx, h(xx, z))); }
      const s = new THREE.Shape([new THREE.Vector2(X0, -2.2), ...pts, new THREE.Vector2(-X0, -2.2)]);
      const m = new THREE.Mesh(new THREE.ShapeGeometry(s), skirtM); m.position.z = z; if (r) { m.rotation.y = r; m.scale.x = -1; } scene.add(m);
    });
    {
      const pts = []; for (let i = 0; i <= 120; i++) { const zz = -Dz / 2 + i / 120 * Dz; pts.push(new THREE.Vector2(zz, h(-X0, zz))); }
      const s = new THREE.Shape([new THREE.Vector2(-Dz / 2, -2.2), ...pts, new THREE.Vector2(Dz / 2, -2.2)]);
      const m = new THREE.Mesh(new THREE.ShapeGeometry(s), skirtM); m.rotation.y = Math.PI / 2; m.position.x = -X0; m.scale.x = -1; scene.add(m);
    }

    // ---------- mặt cắt ngang thung lũng ở cửa sông (x = X0): tầng chứa nước ngầm ----------
    const cw = 1024, ch = 420, yTop = 3.5, yBot = -2.2; const face = document.createElement('canvas'); face.width = cw; face.height = ch; const fx = face.getContext('2d');
    const ZZ = i => -Dz / 2 + i / cw * Dz, YY = y => (yTop - y) / (yTop - yBot) * ch;
    const faceTex = new THREE.CanvasTexture(face); faceTex.colorSpace = THREE.SRGBColorSpace;
    const faceM = new THREE.Mesh(new THREE.PlaneGeometry(Dz, yTop - yBot), new THREE.MeshBasicMaterial({ map: faceTex, transparent: true }));
    faceM.rotation.y = -Math.PI / 2; faceM.position.set(X0 - .01, (yTop + yBot) / 2, 0); scene.add(faceM);
    let wtLevel = 0;
    function drawFace() {
      fx.clearRect(0, 0, cw, ch);
      const aqTop = -.35, aqBot = o.perm ? -1.75 : -1.05; wtLevel = (o.perm ? .05 : -.3) + (H.out[o.month - 1].gw / (H.max || 1)) * .35;
      for (let i = 0; i < cw; i++) {
        const z = ZZ(cw - 1 - i), top = h(X0, z);   // mặt phẳng quay: đảo chiều để khớp địa hình
        const band = (a, b, c) => { const y0 = Math.min(a, top), y1 = Math.min(b, top); if (y0 > y1) { fx.fillStyle = c; fx.fillRect(i, YY(y0), 1, YY(y1) - YY(y0) + 1); } };
        band(top, aqTop, '#7b5a39'); band(aqTop, aqBot, o.perm ? '#c9b07a' : '#a58d68'); band(aqBot, yBot, '#5d6068');
        const wt = Math.min(top - .05, wtLevel); if (wt > aqBot) { fx.fillStyle = 'rgba(60,140,220,.45)'; fx.fillRect(i, YY(wt), 1, YY(aqBot) - YY(wt)); }
      }
      fx.strokeStyle = 'rgba(160,215,255,.95)'; fx.setLineDash([10, 7]); fx.lineWidth = 3; fx.beginPath();
      for (let i = 0; i < cw; i += 4) { const z = ZZ(cw - 1 - i), top = h(X0, z); const y = YY(Math.min(top - .05, wtLevel)); i ? fx.lineTo(i, y) : fx.moveTo(i, y); } fx.stroke(); fx.setLineDash([]);
      fx.font = '600 20px Be Vietnam Pro, sans-serif'; fx.fillStyle = 'rgba(255,255,255,.92)';
      fx.fillText('Tầng đất', 40, YY(-.15)); fx.fillText(o.perm ? 'Tầng chứa nước: cát, sỏi, đá vôi (thấm tốt)' : 'Tầng chứa nước mỏng (thấm kém)', 40, YY(aqBot) - 12);
      fx.fillText('Đá không thấm nước', 40, YY(-1.95)); fx.fillStyle = 'rgba(190,230,255,.95)'; fx.fillText('Mực nước ngầm', cw - 230, YY(wtLevel) - 10);
      faceTex.needsUpdate = true;
    }
    // hạt nước ngầm chảy từ hai bên vào lòng sông
    const gwN = 70; const gwI = new THREE.InstancedMesh(new THREE.SphereGeometry(.06, 8, 6), new THREE.MeshBasicMaterial({ color: 0x8fdcff }), gwN); scene.add(gwI);
    const gwD = Array.from({ length: gwN }, (_, i) => ({ side: i % 2 ? 1 : -1, k: Math.random(), y: Math.random() }));

    // ---------- sông: dải nước đổi bề rộng theo lưu lượng ----------
    const NS = 220, xs = [], RX0 = 7.2;
    for (let i = 0; i <= NS; i++) xs.push(RX0 - i / NS * (RX0 - X0));
    const rGeo = new THREE.BufferGeometry(); const rPos = new Float32Array((NS + 1) * 2 * 3); const idx = [];
    for (let i = 0; i < NS; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    rGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3)); rGeo.setIndex(idx);
    const river = new THREE.Mesh(rGeo, new THREE.MeshStandardMaterial({ color: 0x2f86d8, roughness: .15, metalness: .1, side: THREE.DoubleSide, transparent: true, opacity: .93 })); scene.add(river);
    const bedY = x => { let m = 1e9; for (let d = -.6; d <= .6; d += .2) m = Math.min(m, h(x, rz(x) + d)); return m; };
    const rY = xs.map(x => bedY(x) + .07);
    let curW = .3;
    function shapeRiver(w) {
      for (let i = 0; i <= NS; i++) {
        const x = xs[i], z = rz(x); const dz = .33 * Math.cos(x * .33 + .4) * 1.1; const n = new THREE.Vector2(-dz, 1).normalize();
        const ww = w * (.35 + .65 * THREE.MathUtils.smoothstep(RX0 - x, 0, 5)) * (o.lake && Math.abs(x + 1.5) < 1.6 ? 1 : 1);
        rPos.set([x + n.x * ww, rY[i] + w * .12, z + n.y * ww, x - n.x * ww, rY[i] + w * .12, z - n.y * ww], i * 6);
      }
      rGeo.attributes.position.needsUpdate = true; rGeo.computeVertexNormals();
    }
    const curve = new THREE.CatmullRomCurve3(xs.filter((_, i) => i % 10 === 0).map((x, k) => new THREE.Vector3(x, rY[k * 10] + .12, rz(x))));
    const flowN = 60; const flowI = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0xd8f1ff }), flowN); scene.add(flowI);
    const flowK = Array.from({ length: flowN }, (_, i) => ({ k: i / flowN, o: (Math.random() - .5) }));

    // ---------- hồ trên dòng sông ----------
    const lakeX = -2.2, lakeZ = rz(lakeX);
    const lake = new THREE.Mesh(new THREE.CircleGeometry(1, 48), new THREE.MeshStandardMaterial({ color: 0x2c7fd0, roughness: .1, metalness: .1, transparent: true, opacity: .95 }));
    lake.rotation.x = -Math.PI / 2; lake.scale.set(2.1, 1.35, 1); lake.position.set(lakeX, bedY(lakeX) + .3, lakeZ); scene.add(lake);
    const lakeRim = new THREE.Mesh(new THREE.RingGeometry(1, 1.12, 48), new THREE.MeshStandardMaterial({ color: 0x9ab06a })); lakeRim.rotation.x = -Math.PI / 2; lakeRim.scale.copy(lake.scale); lakeRim.position.copy(lake.position).add(new THREE.Vector3(0, -.01, 0)); scene.add(lakeRim);

    // ---------- rừng ----------
    const maxT = 520; const trees = new THREE.InstancedMesh(new THREE.ConeGeometry(.17, .55, 6), new THREE.MeshStandardMaterial({ color: 0x2c6a33, roughness: .9 }), maxT); scene.add(trees);
    const tPos = []; const m4 = new THREE.Matrix4();
    for (let k = 0; k < 5000 && tPos.length < maxT; k++) { const x = X0 + 1 + Math.random() * (W - 3), z = (Math.random() - .5) * (Dz - 1); const y = h(x, z); if (y > .7 && y < 3.4 && Math.abs(z - rz(x)) > .9 && !(Math.abs(x - lakeX) < 2.6 && Math.abs(z - lakeZ) < 1.8)) tPos.push([x, y, z, .7 + Math.random() * .6]); }
    tPos.sort(() => Math.random() - .5).forEach(([x, y, z, s], i) => { m4.makeScale(s, s, s).setPosition(x, y + .25 * s, z); trees.setMatrixAt(i, m4); });
    // đất trống khi mất rừng
    const stumps = new THREE.InstancedMesh(new THREE.CylinderGeometry(.05, .06, .1, 5), new THREE.MeshStandardMaterial({ color: 0x8a6440 }), maxT); scene.add(stumps);
    tPos.forEach(([x, y, z], i) => { m4.makeTranslation(x, y + .04, z); stumps.setMatrixAt(i, m4); });

    // ---------- mây, mưa, tuyết rơi ----------
    const cloudM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: .95 });
    const clouds = [[-4, 6.4, -2], [1, 6.8, 2], [5.5, 7.4, -1], [-7, 6.2, 3]].map(p => { const g = new THREE.Group(); for (let i = 0; i < 7; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.5 + Math.random() * .35, 14, 10), cloudM); s.position.set((i - 3) * .55, Math.random() * .35, (Math.random() - .5) * .8); g.add(s); } g.position.set(...p); scene.add(g); return g; });
    const dropN = 600; const drops = new THREE.InstancedMesh(new THREE.CylinderGeometry(.014, .014, .26, 4), new THREE.MeshBasicMaterial({ color: 0x5aa7ff }), dropN); scene.add(drops);
    const flakes = new THREE.InstancedMesh(new THREE.SphereGeometry(.045, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), dropN); scene.add(flakes);
    const dD = Array.from({ length: dropN }, (_, i) => ({ c: i % 4, ox: (Math.random() - .5) * 3.4, oz: (Math.random() - .5) * 1.8, k: Math.random() }));
    // nước băng tuyết tan chảy xuống sông
    const meltCurves = [[7.5, -2.6], [6.4, 2.2], [8.4, .9]].map(([x, z]) => { const pts = []; for (let t = 0; t <= 1.0001; t += .1) { const xx = THREE.MathUtils.lerp(x, 5.6, t), zz = THREE.MathUtils.lerp(z, rz(5.6), t); pts.push(new THREE.Vector3(xx, h(xx, zz) + .08, zz)); } return new THREE.CatmullRomCurve3(pts); });
    const melts = meltCurves.map(cv => { const im = api.flowAlong(cv, { count: 14, color: 0xcff1ff, size: .06, speed: .18 }); return im; });

    // ---------- biểu đồ lưu lượng ----------
    const cv = document.createElement('canvas'); cv.width = 640; cv.height = 330; const cx = cv.getContext('2d');
    const COL = { rain: '#3b8ff0', snow: '#b9e3ff', gw: '#1fb39a' };
    function chart() {
      const { out, mean, flood } = H; const max = Math.max(H.max, 1) * 1.12; const L = 46, R = 12, T = 18, B = 40, w = cv.width - L - R, hh = cv.height - T - B;
      cx.clearRect(0, 0, cv.width, cv.height); cx.font = '500 18px Be Vietnam Pro, sans-serif';
      const X = m => L + (m + .5) / 12 * w, Y = v => T + hh - v / max * hh;
      flood.forEach((f, m) => { if (f) { cx.fillStyle = 'rgba(255,200,120,.16)'; cx.fillRect(L + m / 12 * w, T, w / 12, hh); } });
      cx.strokeStyle = 'rgba(255,255,255,.18)'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(L, T + hh); cx.lineTo(L + w, T + hh); cx.stroke();
      const bw = w / 12 * .64;
      out.forEach((v, m) => { let y0 = 0; ['gw', 'snow', 'rain'].forEach(k => { const hgt = v[k] / max * hh; cx.fillStyle = COL[k]; cx.fillRect(X(m) - bw / 2, Y(y0) - hgt, bw, hgt); y0 += v[k]; }); });
      cx.setLineDash([7, 6]); cx.strokeStyle = '#ffd29e'; cx.lineWidth = 2; cx.beginPath(); cx.moveTo(L, Y(mean)); cx.lineTo(L + w, Y(mean)); cx.stroke(); cx.setLineDash([]);
      cx.fillStyle = '#ffd29e'; cx.fillText('TB năm', L + w - 74, Y(mean) - 8);
      const m = o.month - 1; cx.strokeStyle = '#fff'; cx.lineWidth = 2.5; cx.strokeRect(X(m) - bw / 2 - 4, Y(out[m].tot) - 4, bw + 8, out[m].tot / max * hh + 4);
      cx.fillStyle = 'rgba(232,241,244,.85)'; cx.textAlign = 'center'; out.forEach((_, k) => cx.fillText(String(k + 1), X(k), T + hh + 26)); cx.textAlign = 'left';
      cx.save(); cx.translate(16, T + hh / 2); cx.rotate(-Math.PI / 2); cx.textAlign = 'center'; cx.fillText('Lưu lượng', 0, 0); cx.restore();
    }
    const fl = H => { const ms = H.flood.map((f, i) => f ? i + 1 : 0).filter(Boolean); if (!ms.length) return '–'; // gom các tháng liên tiếp (kể cả vòng qua tháng 12)
      const runs = []; ms.forEach(m => { const r = runs[runs.length - 1]; if (r && m === r[1] + 1) r[1] = m; else runs.push([m, m]); });
      if (runs.length > 1 && runs[0][0] === 1 && runs[runs.length - 1][1] === 12) { const a = runs.pop(); runs[0][0] = a[0]; }
      return runs.map(([a, b]) => a === b ? `T${a}` : `T${a} – T${b}`).join(', '); };
    function readout() {
      const v = H.out[o.month - 1]; const top = Object.entries(H.share).sort((a, b) => b[1] - a[1])[0];
      const nm = { rain: 'nước mưa', snow: 'băng tuyết tan', gw: 'nước ngầm' };
      api.readout(`<div style="display:flex;justify-content:space-between;gap:8px"><b>Tháng ${o.month}</b><span>${v.T} °C · mưa ${v.P} mm${v.pack > 5 ? ' · <span style="color:#cfeaff">tuyết phủ</span>' : ''}</span></div>
        <div>Lưu lượng: <b>${Math.round(v.tot / H.mean * 100)}%</b> so với TB năm · ${H.flood[o.month - 1] ? '<b style="color:#ffb27a">mùa lũ</b>' : '<span style="color:#9fd3df">mùa cạn</span>'}</div>
        <div>Mùa lũ: <b>${fl(H)}</b> · nguồn cấp chính: <b>${nm[top[0]]}</b> (${Math.round(top[1] * 100)}%)</div>
        <div>Chênh lệch lũ/cạn: <b>${(H.max / Math.max(H.min, .1)).toFixed(1).replace('.', ',')} lần</b></div>`);
      const r = document.getElementById('readout'); r.classList.add('wide'); r.append(cv);
      chart();
    }
    api.legend([{ c: COL.rain, t: 'Nước mưa' }, { c: COL.snow, t: 'Băng tuyết tan' }, { c: COL.gw, t: 'Nước ngầm' }, { c: 'rgba(255,200,120,.5)', t: 'Mùa lũ (trên TB năm)' }]);

    // ---------- cập nhật theo lựa chọn ----------
    let curNorm = .5, tgtNorm = .5, snowLine = 9;
    function update() {
      H = hydro(o); const v = H.out[o.month - 1];
      tgtNorm = v.tot / H.max;
      const T = v.T; snowLine = o.clim === 'nd' ? 99 : v.pack > 5 ? THREE.MathUtils.lerp(1.2, 3.4, THREE.MathUtils.clamp((T + 9) / 20, 0, 1)) : T > 12 ? 4.4 : 3.6;
      paint(snowLine);
      const nT = Math.round(tPos.length * o.forest); trees.count = nT; stumps.count = tPos.length; stumps.visible = o.forest < .95;
      lake.visible = lakeRim.visible = o.lake;
      melts.forEach(im => (im.visible = v.snow / (H.max || 1) > .08));
      drawFace(); readout();
    }
    state.apply = p => { Object.assign(o, p); ['clim', 'month', 'forest', 'lake', 'perm', 'steep'].forEach(k => p[k] !== undefined && api.set(k, k === 'forest' ? Math.round(p[k] * 100) : k === 'lake' ? p[k] : k === 'perm' ? (p[k] ? 'y' : 'n') : k === 'steep' ? (p[k] ? 'y' : 'n') : p[k])); update(); };

    // ---------- vòng lặp ----------
    let acc = 0;
    api.onTick((dt, t) => {
      if (o.play && !api.paused) { acc += dt; if (acc > 1.5) { acc = 0; o.month = o.month % 12 + 1; api.set('month', o.month); update(); } }
      curNorm += (tgtNorm - curNorm) * Math.min(1, dt * 3);
      const w = .12 + .5 * curNorm; if (Math.abs(w - curW) > .002) { curW = w; shapeRiver(w); }
      const v = H.out[o.month - 1]; const rainI = o.clim === 'nd' || v.T >= 0 ? v.P / 320 : 0; const snowI = o.clim === 'od' && v.T < 0 ? v.P / 80 : 0;
      clouds.forEach((g, i) => { g.position.x += Math.sin(t * .2 + i) * .002; g.scale.setScalar(.5 + .3 * Math.max(rainI, snowI)); g.children.forEach(s => (s.material.opacity = .55 + .4 * Math.max(rainI, snowI))); });
      for (let i = 0; i < dropN; i++) {
        const d = dD[i]; const g = clouds[d.c]; const x = g.position.x + d.ox, z = g.position.z + d.oz; const yb = h(x, z);
        const rainOn = i / dropN < rainI, snowOn = i / dropN < snowI;
        d.k = (d.k + dt * (snowOn ? .25 : .95)) % 1;
        const y = g.position.y - .3 - (g.position.y - .3 - yb) * d.k;
        m4.makeScale(rainOn ? 1 : 0, rainOn ? 1 : 0, rainOn ? 1 : 0).setPosition(x, y, z); drops.setMatrixAt(i, m4);
        m4.makeScale(snowOn ? 1 : 0, snowOn ? 1 : 0, snowOn ? 1 : 0).setPosition(x + Math.sin(d.k * 9 + i) * .12, y, z); flakes.setMatrixAt(i, m4);
      }
      drops.instanceMatrix.needsUpdate = flakes.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < flowN; i++) { const f = flowK[i]; f.k = (f.k + dt * (.02 + .07 * curNorm)) % 1; const p = curve.getPointAt(f.k); m4.makeTranslation(p.x, p.y + curW * .12, p.z + f.o * curW); flowI.setMatrixAt(i, m4); }
      flowI.instanceMatrix.needsUpdate = true;
      const gwRate = v.gw / (H.max || 1);
      for (let i = 0; i < gwN; i++) {
        const g = gwD[i]; g.k = (g.k + dt * (.06 + .25 * gwRate)) % 1; const z0 = rz(X0) + g.side * (5.5 - g.k * 5.2); const top = h(X0, z0);
        const y = Math.min(top - .1, wtLevel - .05) - .1 - g.y * (o.perm ? 1.1 : .5) * (1 - g.k * .7);
        const show = i / gwN < .25 + gwRate * 1.4 ? 1 : 0; m4.makeScale(show, show, show).setPosition(X0 - .05, y, z0); gwI.setMatrixAt(i, m4);
      }
      gwI.instanceMatrix.needsUpdate = true;
    });

    // ---------- nhãn ----------
    const SEEN = new Set(); const pick = id => () => { SEEN.add(id); if (SEEN.size >= 3) api.done('src3'); };
    api.label('Mưa', { cls: 'cold', pos: new THREE.Vector3(-1, 5.6, 2), onClick: { title: 'Nguồn cấp: nước mưa', html: 'Nguồn cấp quan trọng nhất ở vùng nhiệt đới, ôn đới ấm. Sông có <b>mùa lũ trùng mùa mưa</b>. Lượng mưa và sự phân hoá mưa theo mùa quyết định chênh lệch lũ – cạn.', id: 'src-mua', onPick: pick('mua') } });
    api.label('Băng tuyết tan', { pos: new THREE.Vector3(7, 5.6, -.4), onClick: { title: 'Nguồn cấp: băng tuyết tan', html: 'Ở vùng ôn đới lạnh, núi cao: tuyết tích lại suốt mùa đông, tan vào xuân – hạ khi nhiệt độ lên trên 0 °C → <b>lũ mùa xuân – hạ</b>. Chọn khí hậu “ôn đới lạnh, núi cao” để quan sát.', id: 'src-bang', onPick: pick('bang') } });
    api.label('Nước ngầm', { cls: 'cold', pos: new THREE.Vector3(X0 - .1, -.9, -3.6), onClick: { title: 'Nguồn cấp: nước ngầm', html: 'Nước ngầm rỉ ra lòng sông quanh năm, giúp sông <b>có nước cả mùa khô</b>, điều hoà dòng chảy. Đá thấm nước tốt (cát, sỏi, đá vôi) → nguồn nước ngầm dồi dào.', id: 'src-ngam', onPick: pick('ngam') } });
    api.label('Rừng giữ nước', { cls: 'sm', pos: new THREE.Vector3(1, 3.2, -4.3), onClick: { title: 'Thực vật', html: 'Tán rừng chặn bớt nước mưa, rễ cây và thảm mục giúp nước <b>thấm xuống đất</b> → giảm lượng nước chảy tràn, <b>giảm lũ</b>, tăng nước ngầm cấp cho sông mùa cạn.' } });
    api.label('Hồ, đầm', { cls: 'sm cold', pos: new THREE.Vector3(lakeX, 1.2, lakeZ + 1.3), onClick: { title: 'Hồ, đầm', html: 'Hồ chứa bớt nước mùa lũ và trả lại nước mùa cạn → <b>điều hoà chế độ nước sông</b>. Bật/tắt hồ ở bảng điều khiển để so sánh đồ thị.' } });
    api.label('Thượng nguồn: dốc, nước chảy xiết', { cls: 'sm', pos: new THREE.Vector3(5.2, 3.4, 1.8) });
    api.label('Hạ lưu: thoải', { cls: 'sm', pos: new THREE.Vector3(-7.5, 1.1, -1.5) });

    // ---------- điều khiển ----------
    api.heading('Khí hậu lưu vực');
    api.choice('clim', '', [{ v: 'nd', t: 'Nhiệt đới gió mùa' }, { v: 'od', t: 'Ôn đới lạnh, núi cao' }], o.clim, v => { o.clim = v; update(); });
    api.heading('Thời gian');
    api.slider('month', 'Tháng', { min: 1, max: 12, value: o.month, format: v => 'Tháng ' + v }, v => { o.month = v; update(); if (o.clim === 'od' && v >= 4 && v <= 7 && H.out[v - 1].snow > H.out[v - 1].rain * .5) api.done('od'); });
    api.toggle('play', 'Chạy qua 12 tháng', o.play, v => (o.play = v));
    api.heading('Các nhân tố');
    api.slider('forest', 'Độ che phủ rừng', { min: 0, max: 100, step: 5, value: o.forest * 100, format: v => v + '%' }, v => { o.forest = v / 100; update(); if (v < 20) api.done('forest'); });
    api.choice('perm', 'Nền đá, nước ngầm', [{ v: 'n', t: 'Đá ít thấm nước' }, { v: 'y', t: 'Đá thấm nước tốt' }], 'n', v => { o.perm = v === 'y'; update(); if (o.perm) api.done('perm'); });
    api.choice('steep', 'Địa hình lưu vực', [{ v: 'y', t: 'Dốc (miền núi)' }, { v: 'n', t: 'Thoải' }], 'y', v => { o.steep = v === 'y'; update(); });
    api.toggle('lake', 'Có hồ, đầm trên dòng sông', o.lake, v => { o.lake = v; update(); if (v) api.done('lake'); });
    shapeRiver(curW); update();
    const watch = setInterval(() => { if (o.clim === 'od' && o.month >= 4 && o.month <= 7 && H.out[o.month - 1].snow > H.out[o.month - 1].rain * .5) { api.done('od'); } }, 1000);
    addEventListener('pagehide', () => clearInterval(watch));
  },
};

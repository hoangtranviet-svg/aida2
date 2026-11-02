// 3D-11d · Bài 11 – Nước ngầm: hình thành, cấp nước cho gì, vai trò và hậu quả khai thác quá mức
import { THREE } from '../core.js';
import { FAM11 } from './fam11.js';

const ss = THREE.MathUtils.smoothstep, lerp = THREE.MathUtils.lerp, clamp = THREE.MathUtils.clamp;
const XL = -10, XR = 10, ZD = 3, YB = -3.6, YT = 3.6;
const RIVER = 1.4, WELL_D = -1.3, WELL_K = 5.3, COAST = 7.4;
const AQ_BASE = -1.35, CLAY_B = -1.9, CONF_B = -2.9;
// mặt đất (chưa tính sụt lún)
const h0 = x => .95 - .05 * x + 2.5 * Math.exp(-((x + 7.3) ** 2) / 7) - .75 * Math.exp(-((x - RIVER) ** 2) / .3) - 1.3 * ss(x, COAST - .6, COAST + .8);

export default {
  id: '3D-11d', lab: '11d', family: FAM11, sub: true, code: 'DL10.B11', title: 'Nước ngầm và vai trò của nước ngầm',
  objectives: [{ c: 'DL10.05.05', t: 'Nước băng tuyết và nước ngầm' }, { c: 'DL10.05.06', t: 'Giải pháp bảo vệ nguồn nước ngọt' }],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 11: Nước ngầm', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'USGS Water Science School – Groundwater', u: 'https://www.usgs.gov/special-topics/water-science-school/science/groundwater-what-groundwater' },
    { t: 'USGS – Land Subsidence (sụt lún do khai thác nước ngầm)', u: 'https://www.usgs.gov/special-topics/water-science-school/science/land-subsidence' },
    { t: 'USGS – Saltwater Intrusion', u: 'https://www.usgs.gov/mission-areas/water-resources/science/saltwater-intrusion' },
  ],
  note: 'Mặt cắt minh hoạ; chiều dày các tầng và độ sâu được phóng đại để dễ quan sát.',
  view: { pos: [0, 5.5, 23], target: [0, -.2, 0] },
  steps: [
    { title: 'Nước ngầm là gì?', html: '<p><b>Nước ngầm</b> là nước nằm trong các lỗ hổng, khe nứt của đất đá dưới mặt đất.</p><ul><li>Nguồn cung cấp chủ yếu: <b>nước mưa</b>, nước sông, hồ <b>thấm</b> xuống.</li><li>Nước thấm qua lớp đất, đọng lại trên <b>tầng không thấm nước</b> (sét, đá) tạo <b>tầng chứa nước</b> (cát, sỏi).</li><li>Mặt trên của phần đất đá đã bão hoà nước gọi là <b>mực nước ngầm</b>.</li></ul><div class="tip">Quan sát mặt cắt phía trước: các hạt xanh là nước mưa thấm xuống và nước ngầm chuyển động.</div>',
      enter: a => { a.state.apply({ season: 'r', pump: 20 }); a.fly([0, 5.5, 23], [0, -.2, 0]); } },
    { title: 'Nước ngầm cấp nước cho sông, hồ, thực vật', html: '<p>Nước ngầm chảy chậm từ nơi cao về nơi thấp rồi:</p><ul><li>Lộ ra thành <b>mạch nước</b>, suối ở chân đồi.</li><li>Rỉ ra <b>lòng sông, hồ</b> quanh năm → sông vẫn có nước vào <b>mùa khô</b> (điều hoà dòng chảy).</li><li>Cung cấp nước cho <b>rễ cây</b>, duy trì rừng, đầm lầy.</li><li>Ở ven biển, nước ngầm chảy ra biển và ngăn nước mặn lấn vào.</li></ul>',
      enter: a => { a.state.apply({ season: 'd', pump: 20 }); a.fly([-3, 4.5, 15], [-2, -.3, 1]); } },
    { title: 'Vai trò đối với con người', html: '<ul><li><b>Sinh hoạt</b>: giếng đào, giếng khoan cung cấp nước cho hàng triệu người; nhiều đô thị ở Việt Nam dùng nước ngầm.</li><li><b>Nông nghiệp</b>: tưới tiêu, nhất là vào mùa khô.</li><li><b>Công nghiệp</b>: nước làm mát, chế biến; nước khoáng, nước nóng phục vụ chữa bệnh, du lịch.</li></ul><p>Nước ngầm thường sạch hơn nước mặt vì được lọc qua các lớp đất đá.</p>',
      enter: a => { a.fly([1.5, 4.5, 15], [1.5, -.3, 1]); } },
    { title: 'Khai thác quá mức', html: '<p>Hút nước nhiều hơn lượng được bổ sung gây:</p><ul><li><b>Hạ thấp mực nước ngầm</b>, tạo phễu quanh giếng khoan; giếng nông bị cạn.</li><li><b>Sụt lún mặt đất</b> do đất đá mất nước bị nén lại (VD: Hà Nội, TP Hồ Chí Minh, Đồng bằng sông Cửu Long).</li><li><b>Xâm nhập mặn</b> vào tầng chứa nước ven biển.</li></ul><div class="tip">Kéo thanh <b>Mức khai thác</b> lên trên 70% để quan sát.</div>',
      enter: a => { a.state.apply({ pump: 85, season: 'd' }); a.fly([5, 3.5, 15], [5, -1, 1]); } },
    { title: 'Bảo vệ nguồn nước ngầm', html: '<ul><li>Khai thác <b>hợp lí</b>, có quy hoạch; không khoan giếng tràn lan.</li><li><b>Trồng và bảo vệ rừng</b>, hạn chế bê tông hoá để nước mưa thấm xuống.</li><li>Thu gom, <b>xử lí nước thải</b>, rác thải; không để hoá chất ngấm vào đất.</li><li>Bổ sung nhân tạo cho nước ngầm (hồ thấm, giếng hồi quy), dùng nước tiết kiệm.</li></ul>',
      enter: a => { a.state.apply({ pump: 25, surf: 'g' }); a.fly([0, 5.5, 23], [0, -.2, 0]); } },
  ],
  tasks: [
    { id: 'dry', text: 'Chọn <b>mùa khô</b> và bấm vào nhãn cho thấy nước ngầm vẫn cấp nước cho sông.' },
    { id: 'wells', text: 'Bấm vào <b>giếng đào</b> và <b>giếng khoan</b> để biết nước ngầm dùng vào việc gì.' },
    { id: 'pump', text: 'Tăng <b>mức khai thác</b> trên 70% và tìm 2 hậu quả: <b>sụt lún</b>, <b>xâm nhập mặn</b>.' },
    { id: 'surf', text: 'Chọn bề mặt <b>bê tông hoá</b> và so sánh lượng nước thấm xuống.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0xbcd9f0); scene.fog = new THREE.Fog(0xbcd9f0, 34, 70);
    const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(-6, 12, 10); scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xe8f3ff, 0x6b5a40, .95));
    const o = state.o = { season: 'r', pump: 20, surf: 'g' };
    const m4 = new THREE.Matrix4();
    const sub = x => (o.pump / 100) ** 2 * .45 * Math.exp(-((x - WELL_K) ** 2) / 2.2);   // sụt lún quanh khu khoan
    const ground = x => h0(x) - sub(x);
    // mực nước ngầm (tầng không áp)
    const WT = x => {
      const seas = o.season === 'r' ? .25 : -.2, rech = o.surf === 'c' ? -.25 : 0;
      let w = Math.min(h0(x) - .5, .4 * h0(x) - .05 + seas + rech * ss(x, 2.5, 7));
      w = lerp(w, h0(RIVER) - .02, Math.exp(-((x - RIVER) ** 2) / .9));              // nước ngầm rỉ ra sông
      if (x > COAST - .5) w = lerp(w, 0, ss(x, COAST - .5, COAST + .6));
      const p = o.pump / 100; w -= 1.35 * p * p * Math.exp(-((x - WELL_K) ** 2) / (1.2 + 2.5 * p));                // phễu hạ thấp mực nước
      return Math.max(w, AQ_BASE + .05);
    };
    const toe = () => COAST - .8 - 4.2 * (o.pump / 100) ** 1.6;                      // mũi nêm nước mặn

    // ---------- mặt đất 3D ----------
    const NX = 240, NZ = 30; const geo = new THREE.PlaneGeometry(XR - XL, ZD * 2, NX, NZ); geo.rotateX(-Math.PI / 2);
    const P = geo.attributes.position; const col = new Float32Array(P.count * 3); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const terrain = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 })); scene.add(terrain);
    const cc = new THREE.Color();
    function shapeGround() {
      for (let i = 0; i < P.count; i++) {
        const x = P.getX(i), z = P.getZ(i); const y = ground(x) + (Math.abs(z) < ZD - .2 ? .04 * Math.sin(z * 2 + x) : 0); P.setY(i, y);
        if (x > COAST + .1) cc.setRGB(.86, .8, .6); else if (x > 3.9 && x < 7) cc.setRGB(o.surf === 'c' ? .55 : .62, o.surf === 'c' ? .56 : .6, o.surf === 'c' ? .58 : .55);
        else if (x < -4.2) cc.setRGB(.3, .47, .25); else if (Math.abs(x - RIVER) < .7) cc.setRGB(.5, .58, .36); else cc.setRGB(.55, .7, .35);
        if (o.surf === 'c' && x > -2.6 && x < 3.9 && Math.abs(x - RIVER) > .8) cc.setRGB(.6, .6, .6);
        col.set([cc.r, cc.g, cc.b], i * 3);
      }
      P.needsUpdate = true; geo.attributes.color.needsUpdate = true; geo.computeVertexNormals();
    }
    // mặt cắt phía trước (vẽ bằng canvas)
    const CW = 1800, CH = Math.round(CW * (YT - YB) / (XR - XL));
    const cv = document.createElement('canvas'); cv.width = CW; cv.height = CH; const cx = cv.getContext('2d');
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
    const face = new THREE.Mesh(new THREE.PlaneGeometry(XR - XL, YT - YB), new THREE.MeshBasicMaterial({ map: tex, transparent: true })); face.position.set(0, (YT + YB) / 2, ZD + .005); scene.add(face);
    const back = new THREE.Mesh(new THREE.PlaneGeometry(XR - XL, YT - YB), new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.BackSide })); back.position.set(0, (YT + YB) / 2, -ZD - .005); scene.add(back);
    const PX = x => (x - XL) / (XR - XL) * CW, PY = y => (YT - y) / (YT - YB) * CH;
    function drawFace() {
      cx.clearRect(0, 0, CW, CH); const tc = toe();
      for (let i = 0; i < CW; i++) {
        const x = XL + (i + .5) / CW * (XR - XL); const top = ground(x); const wt = WT(x);
        const band = (a, b, c) => { const y0 = Math.min(a, top), y1 = Math.min(b, top); if (y0 > y1) { cx.fillStyle = c; cx.fillRect(i, PY(y0), 1, PY(y1) - PY(y0) + 1); } };
        if (x > COAST - .3) { cx.fillStyle = '#3f86c6'; const sy = Math.max(top, -0); if (top < 0) cx.fillRect(i, PY(0), 1, PY(top) - PY(0)); }
        band(top, top - .32, '#6b4a2f');                     // đất
        band(top - .32, AQ_BASE, '#d8c08c');                 // cát, sỏi (vùng thông khí)
        band(Math.min(wt, top - .32), AQ_BASE, '#5aa3d6');   // vùng bão hoà nước
        band(AQ_BASE, CLAY_B, '#8a6f5a');                    // sét
        band(CLAY_B, CONF_B, '#4f8fc0');                     // tầng chứa nước có áp
        band(CONF_B, YB, '#5b5e66');                         // đá gốc
        // nêm nước mặn ven biển
        if (x > tc) { const k = clamp((x - tc) / (COAST + 1 - tc), 0, 1); const yTop = lerp(AQ_BASE, Math.min(0, top), k); const yTop2 = lerp(CONF_B, CLAY_B, clamp((x - tc - .6) / (COAST + 1 - tc), 0, 1));
          cx.fillStyle = 'rgba(70,120,110,.92)'; if (yTop > AQ_BASE) cx.fillRect(i, PY(Math.min(yTop, top)), 1, PY(AQ_BASE) - PY(Math.min(yTop, top))); if (yTop2 > CONF_B) cx.fillRect(i, PY(yTop2), 1, PY(CONF_B) - PY(yTop2)); }
      }
      // hạt cát, sỏi
      cx.fillStyle = 'rgba(120,90,50,.25)'; for (let k = 0; k < 2600; k++) { const x = XL + Math.random() * (XR - XL), y = lerp(AQ_BASE, ground(x) - .32, Math.random()); if (y < ground(x) - .32) cx.fillRect(PX(x), PY(y), 3, 3); }
      cx.fillStyle = 'rgba(255,255,255,.12)'; for (let k = 0; k < 900; k++) { const x = XL + Math.random() * (XR - XL), y = lerp(CONF_B, CLAY_B, Math.random()); cx.beginPath(); cx.arc(PX(x), PY(y), 2.5, 0, 7); cx.fill(); }
      // mực nước ngầm
      cx.strokeStyle = '#e8f7ff'; cx.lineWidth = 4; cx.setLineDash([16, 10]); cx.beginPath();
      for (let i = 0; i <= CW; i += 6) { const x = XL + i / CW * (XR - XL); if (x > COAST + .4) break; const y = PY(Math.min(WT(x), ground(x) - .02)); i ? cx.lineTo(i, y) : cx.moveTo(i, y); } cx.stroke(); cx.setLineDash([]);
      // mặt đất ban đầu (khi sụt lún)
      if (o.pump > 45) { cx.strokeStyle = 'rgba(255,90,60,.9)'; cx.lineWidth = 3; cx.setLineDash([8, 8]); cx.beginPath(); for (let x = 3.6; x <= 7.2; x += .05) { const px = PX(x), py = PY(h0(x)); x === 3.6 ? cx.moveTo(px, py) : cx.lineTo(px, py); } cx.stroke(); cx.setLineDash([]); }
      // giếng
      const well = (x, depth, w, c) => { cx.fillStyle = c; cx.fillRect(PX(x) - w / 2, PY(ground(x) + .15), w, PY(depth) - PY(ground(x) + .15)); };
      well(WELL_D, WT(WELL_D) - .45, 20, '#9a8c7c'); cx.fillStyle = '#4aa0e0'; cx.fillRect(PX(WELL_D) - 7, PY(WT(WELL_D)), 14, PY(WT(WELL_D) - .45) - PY(WT(WELL_D)));
      well(WELL_K, CONF_B + .25, 10, '#cfd6dc'); cx.fillStyle = '#2f7fc0'; cx.fillRect(PX(WELL_K) - 3, PY(Math.min(WT(WELL_K), ground(WELL_K) - .2)), 6, PY(CONF_B + .25) - PY(Math.min(WT(WELL_K), ground(WELL_K) - .2)));
      // chữ
      cx.font = '600 21px Be Vietnam Pro, sans-serif'; cx.fillStyle = 'rgba(255,255,255,.95)'; cx.textBaseline = 'middle';
      cx.fillText('Đất', PX(-9.4), PY(ground(-9.6) - .16));
      cx.fillStyle = 'rgba(60,40,20,.85)'; cx.fillText('Đất đá thấm nước (vùng thông khí)', PX(-3.6), PY(lerp(WT(-3.4), ground(-3.4) - .32, .5)));
      cx.fillStyle = 'rgba(255,255,255,.95)'; cx.fillText('Tầng chứa nước ngầm (cát, sỏi bão hoà nước)', PX(-9.4), PY((AQ_BASE + WT(-8)) / 2 - .1));
      cx.fillText('Tầng sét không thấm nước', PX(-9.4), PY((AQ_BASE + CLAY_B) / 2)); cx.fillText('Tầng chứa nước có áp', PX(-9.4), PY((CLAY_B + CONF_B) / 2)); cx.fillText('Đá gốc', PX(-9.4), PY((CONF_B + YB) / 2));
      if (o.pump > 55) { cx.fillStyle = 'rgba(210,255,240,.95)'; cx.fillText('Nước mặn', PX(COAST + .2), PY(-.95)); }
      tex.needsUpdate = true;
    }

    // ---------- vật thể trên mặt đất ----------
    const top = new THREE.Group(); scene.add(top);
    const sea = new THREE.Mesh(new THREE.BoxGeometry(XR - COAST + .2, 1.3, ZD * 2), new THREE.MeshStandardMaterial({ color: 0x2f7fc4, transparent: true, opacity: .8, roughness: .15 })); sea.position.set((XR + COAST) / 2 + .1, -.65, 0); scene.add(sea);
    const river = new THREE.Mesh(new THREE.BoxGeometry(1, .08, ZD * 2), new THREE.MeshStandardMaterial({ color: 0x2f86d8, roughness: .15 })); scene.add(river);
    const rFlow = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0xd9f1ff }), 40); scene.add(rFlow); const rk = Array.from({ length: 40 }, (_, i) => ({ k: i / 40, x: Math.random() - .5 }));
    // rừng trên đồi
    const trees = new THREE.InstancedMesh(new THREE.ConeGeometry(.2, .65, 6), new THREE.MeshStandardMaterial({ color: 0x2c6a33 }), 120); top.add(trees);
    const tp = []; for (let i = 0; i < 120; i++) { const x = lerp(-9.7, -4.4, Math.random()), z = (Math.random() - .5) * (ZD * 2 - .6); tp.push([x, z]); }
    // ruộng, nhà, giếng đào
    const fieldG = new THREE.Group(); top.add(fieldG);
    for (let i = 0; i < 8; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(.8, .03, 1.1), new THREE.MeshStandardMaterial({ color: [0x8fbf4a, 0x6fa63a][i % 2] })); f.userData.x = -3.6 + (i % 4) * .85; f.position.z = -2 + Math.floor(i / 4) * 1.3; fieldG.add(f); }
    const houses = new THREE.Group(); top.add(houses);
    [[-1.9, -1.2], [-.6, -1.6], [-2.4, .6], [-.3, .3]].forEach(([x, z]) => { const g = new THREE.Group(); g.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(.5, .35, .45), new THREE.MeshStandardMaterial({ color: 0xf1e3c8 })), {})); const r = new THREE.Mesh(new THREE.ConeGeometry(.42, .3, 4), new THREE.MeshStandardMaterial({ color: 0xb5523a })); r.position.y = .32; r.rotation.y = Math.PI / 4; g.add(r); g.userData.x = x; g.position.z = z; houses.add(g); });
    const dug = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, .25, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0x9a8c7c, side: THREE.DoubleSide })); dug.position.z = ZD - .3; top.add(dug);
    // thành phố + giếng khoan
    const city = new THREE.Group(); top.add(city);
    for (let i = 0; i < 14; i++) { const hgt = .6 + Math.random() * 1.6; const b = new THREE.Mesh(new THREE.BoxGeometry(.45, hgt, .45), new THREE.MeshStandardMaterial({ color: [0x9fb7c9, 0xc4ccd4, 0x8aa1b4][i % 3] })); b.position.set(lerp(4.2, 6.8, (i % 5) / 4) + (Math.random() - .5) * .1, hgt / 2, -2.3 + Math.floor(i / 5) * 1.25); b.userData.x = b.position.x; city.add(b); }
    const pumpH = new THREE.Group(); pumpH.add(new THREE.Mesh(new THREE.BoxGeometry(.4, .3, .35), new THREE.MeshStandardMaterial({ color: 0x4f6d84 }))); const pipe = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .5, 10), new THREE.MeshStandardMaterial({ color: 0xcfd6dc })); pipe.position.set(.25, .1, 0); pumpH.add(pipe); pumpH.position.z = ZD - .3; top.add(pumpH);
    function placeTop() {
      const m = new THREE.Matrix4(); tp.forEach(([x, z], i) => { m.makeTranslation(x, ground(x) + .3, z); trees.setMatrixAt(i, m); }); trees.instanceMatrix.needsUpdate = true;
      fieldG.children.forEach(f => (f.position.set(f.userData.x, ground(f.userData.x) + .02, f.position.z)));
      houses.children.forEach(g => (g.position.set(g.userData.x, ground(g.userData.x) + .17, g.position.z)));
      city.children.forEach(b => (b.position.y = ground(b.userData.x) + b.geometry.parameters.height / 2));
      dug.position.set(WELL_D, ground(WELL_D) + .1, ZD - .3); pumpH.position.set(WELL_K, ground(WELL_K) + .15, ZD - .3);
      const rw = o.season === 'r' ? 1.0 : .62; river.scale.x = rw; river.position.set(RIVER, h0(RIVER) + .07, 0);
    }

    // ---------- mưa + hạt nước trên mặt cắt ----------
    const RN = 300; const rain = new THREE.InstancedMesh(new THREE.CylinderGeometry(.013, .013, .24, 4), new THREE.MeshBasicMaterial({ color: 0x5aa7ff }), RN); scene.add(rain);
    const rd = Array.from({ length: RN }, () => ({ x: lerp(XL + .3, COAST, Math.random()), z: (Math.random() - .5) * ZD * 2, k: Math.random() }));
    const IN = 70; const inf = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0x8fdcff }), IN); scene.add(inf);
    const id = Array.from({ length: IN }, () => ({ x: lerp(XL + .3, COAST - .5, Math.random()), k: Math.random() }));
    const FN = 120; const flow = new THREE.InstancedMesh(new THREE.SphereGeometry(.055, 6, 4), new THREE.MeshBasicMaterial({ color: 0xe6f8ff }), FN); scene.add(flow);
    const fd = Array.from({ length: FN }, (_, i) => ({ k: Math.random(), r: Math.random(), path: i % 4 }));
    // đường đi của nước ngầm (x0, x1, tầng)
    const pathPos = (d, t) => {
      const p = o.pump / 100;
      if (d.path === 0) { const x = lerp(-9, RIVER - .15, t); return [x, lerp(WT(x) - .15, AQ_BASE + .1, .25 + .5 * d.r) + .15 * Math.sin(t * 3)]; }      // đồi → sông
      if (d.path === 1) { const toWell = d.r < p; const x = toWell ? lerp(2.3, WELL_K - .1, t) : lerp(4.6, RIVER + .15, t); return [x, lerp(WT(x) - .12, AQ_BASE + .1, .3 + .4 * d.r)]; } // về sông hoặc về giếng khoan
      if (d.path === 2) { const toWell = d.r < p * 1.2; const x = toWell ? lerp(-9.5, WELL_K, t) : lerp(-9.5, 9.5, t); return [x, lerp(CLAY_B - .15, CONF_B + .15, .2 + .6 * d.r)]; }          // tầng có áp
      const x = lerp(5.6, COAST + .6, t); return [x, lerp(WT(x) - .1, AQ_BASE + .1, .3 + .5 * d.r)];                                                   // ra biển
    };
    // mạch nước ở chân đồi chảy ra sông
    const springX = -4.3; const springCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(springX, h0(springX) + .05, ZD - .4), new THREE.Vector3(-2.8, h0(-2.8) + .05, ZD - .9), new THREE.Vector3(-1.5, h0(-1.5) + .05, ZD - 1.6), new THREE.Vector3(.2, h0(.2) + .05, ZD - 2.3), new THREE.Vector3(RIVER - .3, h0(RIVER) + .05, ZD - 2.6)]);
    const springT = api.tube(springCurve.getPoints(40), .05, 0x3d93dd); scene.add(springT);
    const springF = api.flowAlong(springCurve, { count: 14, color: 0xd9f1ff, size: .045, speed: .1 });

    // ---------- nhãn ----------
    const zF = ZD + .25; const set2 = (k, n) => { const s = state[k] ||= new Set(); return id => { s.add(id); if (s.size >= n) api.done(k); }; };
    const wells = set2('wells', 2), pumpSeen = set2('pump', 2);
    const Lb = (t, x, y, info, cls = 'sm') => api.label(t, { cls, pos: new THREE.Vector3(x, y, zF), onClick: info });
    Lb('Nước mưa thấm xuống', -6.6, 3.6, { title: 'Nước mưa thấm xuống', html: 'Nước mưa thấm qua lớp đất, đi xuống qua các lỗ hổng của cát, sỏi cho tới khi gặp tầng không thấm nước. Rừng, thảm cỏ giúp nước thấm nhiều; bề mặt <b>bê tông hoá</b> làm nước chảy tràn, ít thấm.' }, 'cold');
    const lWT = Lb('Mực nước ngầm', -5.9, 0, { title: 'Mực nước ngầm', html: 'Mặt trên của tầng đất đá đã bão hoà nước. Mùa mưa mực nước ngầm <b>dâng</b>, mùa khô <b>hạ</b>; khai thác quá mức làm mực nước hạ sâu.' }, 'cold');
    Lb('Mạch nước → suối', springX + .1, h0(springX) + .6, { title: 'Mạch nước', html: 'Nơi mực nước ngầm cắt mặt đất (chân đồi, sườn thung lũng), nước ngầm lộ ra thành <b>mạch nước</b>, chảy thành suối rồi đổ vào sông.' });
    Lb('Nước ngầm cấp nước cho sông', RIVER, h0(RIVER) + .9, { title: 'Nước ngầm cấp nước cho sông', html: 'Nước ngầm rỉ ra lòng sông <b>quanh năm</b>. Vào <b>mùa khô</b>, khi không có mưa, sông vẫn còn nước chủ yếu nhờ nước ngầm → nước ngầm <b>điều hoà dòng chảy</b> sông.', id: 'gw-river', onPick: () => { if (o.season === 'd') api.done('dry'); } }, 'cold');
    Lb('Rễ cây hút nước', -7.6, h0(-7.6) + 1.05, { title: 'Thực vật', html: 'Rễ cây hút nước trong đất và nước ngầm nông, duy trì rừng, thảm thực vật, đầm lầy. Ngược lại, rừng giúp nước mưa thấm xuống, <b>bổ sung</b> nước ngầm.' });
    Lb('Giếng đào: nước sinh hoạt', WELL_D, ground(WELL_D) + 1.05, { title: 'Giếng đào', html: 'Giếng nông lấy nước ở tầng nước ngầm không áp, phục vụ <b>sinh hoạt</b> (ăn uống, tắm giặt) và <b>tưới</b> rau màu ở nông thôn. Khi mực nước ngầm hạ, giếng đào dễ bị <b>cạn</b>.', id: 'well-d', onPick: () => wells('d') });
    Lb('Tưới ruộng', -3.1, ground(-3.1) + .65, { title: 'Nông nghiệp', html: 'Nước ngầm được bơm lên <b>tưới tiêu</b>, đặc biệt quan trọng vào mùa khô và ở vùng khô hạn.' });
    const lK = Lb('Giếng khoan: đô thị, công nghiệp', WELL_K, ground(WELL_K) + 2.5, { title: 'Giếng khoan', html: 'Giếng sâu lấy nước ở <b>tầng chứa nước có áp</b>, cung cấp nước sạch cho <b>đô thị</b>, nhà máy (công nghiệp, chế biến). Nước ngầm sâu thường sạch, ổn định.', id: 'well-k', onPick: () => wells('k') });
    const lSub = Lb('Sụt lún mặt đất', 7.0, ground(7.0) + 1.7, { title: 'Sụt lún mặt đất', html: 'Khi nước bị hút ra quá nhiều, các lớp sét, cát mất nước bị <b>nén lại</b> → mặt đất <b>lún</b>, gây nứt nhà, hỏng đường, ngập úng. Đường đứt đỏ trên mặt cắt là mặt đất ban đầu.', id: 'sub', onPick: () => pumpSeen('sub') }, 'warm');
    const lSalt = Lb('Xâm nhập mặn', COAST + .9, -.5, { title: 'Xâm nhập mặn', html: 'Mực nước ngầm ngọt hạ thấp thì <b>nước biển lấn sâu</b> vào tầng chứa nước ven biển → giếng bị nhiễm mặn, không dùng được cho sinh hoạt, tưới tiêu (VD: Đồng bằng sông Cửu Long).', id: 'salt', onPick: () => pumpSeen('salt') }, 'warm');
    const lCone = Lb('Phễu hạ thấp mực nước', WELL_K - 1.4, -.9, { title: 'Phễu hạ thấp mực nước ngầm', html: 'Bơm hút liên tục làm mực nước ngầm quanh giếng hạ xuống thành hình <b>phễu</b>; phễu càng sâu, rộng khi khai thác càng nhiều.' }, 'warm');
    api.label('Biển', { cls: 'big cold', pos: new THREE.Vector3(8.8, .3, 0) });

    // ---------- cập nhật ----------
    function update() {
      shapeGround(); placeTop(); drawFace();
      lSub.visible = o.pump > 45; lSalt.visible = o.pump > 40; lCone.visible = o.pump > 35;
      lSub.position.y = ground(7.0) + 1.7; lWT.position.y = WT(-5.9) + .05;
      const avgWT = [-6, -3, 3, 5.3].map(x => h0(x) - WT(x)); const gwRiver = clamp(.55 + (o.season === 'r' ? .25 : 0) - (o.pump / 100) * .45 - (o.surf === 'c' ? .2 : 0), 0, 1);
      api.readout(`<b>${o.season === 'r' ? 'Mùa mưa' : 'Mùa khô'}</b> · bề mặt: ${o.surf === 'c' ? 'bê tông hoá' : 'rừng, đồng ruộng'}
        <div>Mực nước ngầm ở giếng đào: <b>~${(avgWT[1] * 4).toFixed(0)} m</b> dưới mặt đất</div>
        <div>Ở khu giếng khoan: <b>~${(avgWT[3] * 4).toFixed(0)} m</b>${o.pump > 60 ? ' <b style="color:#ff9b7a">(phễu sâu)</b>' : ''}</div>
        <div>Nước ngầm cấp cho sông: <b>${gwRiver > .66 ? 'nhiều' : gwRiver > .4 ? 'trung bình' : 'ít'}</b></div>
        ${o.pump > 60 ? '<div style="color:#ffb08f;margin-top:4px">⚠ Khai thác quá mức: sụt lún, xâm nhập mặn</div>' : ''}
        <div style="font-size:12px;opacity:.75;margin-top:4px">Độ sâu mang tính minh hoạ.</div>`);
    }
    state.apply = p => { Object.assign(o, p); if (p.season) api.set('season', p.season); if (p.pump !== undefined) api.set('pump', p.pump); if (p.surf) api.set('surf', p.surf); update(); };

    api.onTick((dt, t) => {
      const rainy = o.season === 'r';
      for (let i = 0; i < RN; i++) { const d = rd[i]; d.k = (d.k + dt * .9) % 1; const s = rainy ? 1 : 0; m4.makeScale(s, s, s).setPosition(d.x, 6 - (6 - ground(d.x)) * d.k, d.z); rain.setMatrixAt(i, m4); }
      rain.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < IN; i++) { const d = id[i]; d.k = (d.k + dt * .22) % 1; const paved = o.surf === 'c' && d.x > -2.6 && d.x < 7; const on = rainy && !(paved && i % 4) ? 1 : 0; const y = lerp(ground(d.x) - .05, WT(d.x), d.k); m4.makeScale(on, on, on).setPosition(d.x, y, zF - .2); inf.setMatrixAt(i, m4); }
      inf.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < FN; i++) { const d = fd[i]; d.k = (d.k + dt * .04) % 1; const [x, y] = pathPos(d, d.k); m4.makeTranslation(x, y, zF - .2); flow.setMatrixAt(i, m4); }
      flow.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < 40; i++) { const d = rk[i]; d.k = (d.k + dt * .08) % 1; m4.makeTranslation(RIVER + d.x * .6 * river.scale.x, h0(RIVER) + .09, ZD - d.k * ZD * 2); rFlow.setMatrixAt(i, m4); }
      rFlow.instanceMatrix.needsUpdate = true;
      springT.visible = springF.visible = o.season === 'r' || o.pump < 60;
    });

    api.heading('Mùa');
    api.choice('season', '', [{ v: 'r', t: 'Mùa mưa' }, { v: 'd', t: 'Mùa khô' }], o.season, v => { o.season = v; update(); });
    api.heading('Con người tác động');
    api.slider('pump', 'Mức khai thác nước ngầm', { min: 0, max: 100, step: 5, value: o.pump, format: v => v + '%' }, v => { o.pump = v; update(); });
    api.choice('surf', 'Bề mặt đất', [{ v: 'g', t: 'Rừng, đồng ruộng' }, { v: 'c', t: 'Bê tông hoá' }], o.surf, v => { o.surf = v; update(); if (v === 'c') api.done('surf'); });
    update();
  },
};

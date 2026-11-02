// 3D-11c · Bài 11 – Băng tuyết: từ tuyết thành băng, sông băng và nước băng tan cấp cho sông
import { THREE } from '../core.js';
import { FAM11 } from './fam11.js';

const ss = THREE.MathUtils.smoothstep, lerp = THREE.MathUtils.lerp, clamp = THREE.MathUtils.clamp;
const XW = 9, Z0 = -9.5, Z1 = 7.5;
const floorY = z => .4 + 5.6 * Math.pow(clamp((Z1 - z) / (Z1 - Z0), 0, 1), 1.35);
function h(x, z) {
  const ax = Math.abs(x);
  let y = floorY(z) + 4.4 * ss(ax, 2.0, 6.2) * (1 + .18 * Math.sin(z * .8 + x * .6));
  y += 3.2 * Math.exp(-(((x - 4.3) ** 2) + ((z + 6) ** 2)) / 5) + 3.6 * Math.exp(-(((x + 4.8) ** 2) + ((z + 7.2) ** 2)) / 4.5) + 2.6 * Math.exp(-((x ** 2) + ((z + 9.6) ** 2)) / 3.5);
  y += 3.4 * ss(-z, 7.6, 9.6) * (1 - .5 * ss(ax, 3, 6));
  return y;
}
// sông băng: bề rộng, độ dày theo vị trí z, phụ thuộc vị trí lưỡi băng zt
const halfW = (z, zt) => 2.35 - .5 * ss(z, zt - 3, zt);
const thick = (z, zt) => z > zt ? 0 : 1.15 * Math.sqrt(clamp((zt - z) / 3.2, 0, 1)) * (1 - .25 * ss(z, -9, -6.5));

export default {
  id: '3D-11c', lab: '11c', family: FAM11, sub: true, code: 'DL10.B11', title: 'Băng tuyết và sông băng',
  objectives: [{ c: 'DL10.05.05', t: 'Nước băng tuyết và nước ngầm' }, { c: 'DL10.05.02', t: 'Nhân tố ảnh hưởng tới chế độ nước sông' }],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 11: Nước băng tuyết', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'NSIDC – All About Glaciers', u: 'https://nsidc.org/learn/parts-cryosphere/glaciers' },
    { t: 'USGS Water Science School – Ice, Snow, and Glaciers and the Water Cycle', u: 'https://www.usgs.gov/special-topics/water-science-school/science/ice-snow-and-glaciers-and-water-cycle' },
  ],
  note: 'Kích thước, tốc độ chảy và độ cao chỉ mang tính minh hoạ. Sông băng thật chảy rất chậm – từ vài cm đến vài m mỗi ngày.',
  view: { pos: [16, 16, 21], target: [0, 3, -1] },
  steps: [
    { title: 'Băng tuyết trên Trái Đất', html: '<p>Phần lớn nước ngọt trên Trái Đất (khoảng <b>70%</b>) ở dạng <b>băng tuyết</b>: các khiên băng ở <b>Nam Cực</b>, <b>Grơn-len</b> và sông băng trên <b>núi cao</b>. Băng phủ khoảng 10% diện tích lục địa.</p><p>Băng tuyết hình thành ở nơi nhiệt độ thấp quanh năm: vùng cực và núi cao, phía trên <b>giới hạn tuyết phủ quanh năm</b>.</p>',
      enter: a => { a.state.apply({ season: 'w' }); a.fly([16, 16, 21], [0, 3, -1]); } },
    { title: 'Từ tuyết thành băng', html: '<p>Tuyết rơi tích tụ năm này qua năm khác. Dưới sức nặng của các lớp bên trên, tuyết bị <b>nén chặt</b> và <b>tái kết tinh</b>:</p><ol style="padding-left:18px"><li><b>Tuyết mới</b>: xốp, chứa nhiều không khí.</li><li><b>Tuyết hạt (firn)</b>: các tinh thể tuyết thành hạt, đặc hơn.</li><li><b>Băng</b>: đặc, ít bọt khí, có màu xanh lam.</li></ol><div class="tip">Quan sát <b>lõi băng</b> bên trái khối núi và bấm vào từng lớp.</div>',
      enter: a => { a.state.apply({ core: true }); a.fly([-5, 6, 17], [-11, 2.8, 8.5]); } },
    { title: 'Sông băng chuyển động', html: '<p>Khi băng đủ dày, dưới sức nặng của chính nó, băng <b>trượt chậm</b> xuống thung lũng thành <b>sông băng</b>.</p><ul><li><b>Vùng tích tụ</b> (phía trên): tuyết rơi nhiều hơn lượng tan.</li><li><b>Đường cân bằng</b>: ranh giới giữa tích tụ và tiêu hao.</li><li><b>Vùng tiêu hao</b> (phía dưới): băng tan, bốc hơi nhiều hơn lượng tuyết bổ sung.</li></ul><p>Sông băng bào mòn tạo <b>thung lũng chữ U</b>, mang theo đất đá rồi bồi lại thành <b>băng tích</b>.</p>',
      enter: a => { a.state.apply({ season: 's' }); a.fly([12, 13, 13], [0, 2.5, -1]); } },
    { title: 'Nước băng tan cấp nước cho sông', html: '<p>Mùa <b>xuân – hạ</b>, nhiệt độ tăng, băng tuyết tan → nước chảy ra từ <b>lưỡi băng</b> thành suối, sông. Sông được cấp nước băng tuyết có <b>lũ vào mùa xuân – hạ</b>; mùa đông nước ít.</p><p>Nhiều sông lớn châu Á (sông Hằng, sông Ấn, Trường Giang, Mê Công) bắt nguồn từ vùng băng tuyết <b>Hi-ma-lay-a – Tây Tạng</b>.</p><div class="tip">Chuyển giữa <b>Mùa đông</b> và <b>Mùa hè</b> để so sánh lượng nước tan.</div>',
      enter: a => { a.state.apply({ season: 's' }); a.fly([8, 9, 17], [0, 1.2, 3.5]); } },
    { title: 'Băng tan do biến đổi khí hậu', html: '<p>Khi nhiệt độ Trái Đất tăng, đường cân bằng dâng cao, <b>sông băng thu hẹp</b>, lưỡi băng lùi dần; vết <b>băng tích</b> cũ còn lại cho biết sông băng từng vươn tới đâu.</p><ul><li>Trước mắt: lượng nước tan tăng, nguy cơ lũ, vỡ hồ băng.</li><li>Lâu dài: nguồn nước cho sông giảm, thiếu nước mùa khô; nước biển dâng.</li></ul><div class="tip">Kéo thanh <b>Nhiệt độ tăng thêm</b> lên +2 °C hoặc hơn.</div>',
      enter: a => { a.state.apply({ season: 's' }); a.fly([15, 13, 18], [0, 2, 1]); } },
  ],
  tasks: [
    { id: 'core', text: 'Bấm vào lớp <b>tuyết hạt (firn)</b> trên lõi băng.' },
    { id: 'ela', text: 'Tìm và bấm vào <b>đường cân bằng</b> của sông băng.' },
    { id: 'summer', text: 'Chuyển sang <b>mùa hè</b> và quan sát nước băng tan chảy thành sông.' },
    { id: 'warm', text: 'Tăng nhiệt độ thêm <b>+2 °C</b> trở lên và quan sát lưỡi băng lùi.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0xb9d6ee); scene.fog = new THREE.Fog(0xb9d6ee, 32, 70);
    const sun = new THREE.DirectionalLight(0xffffff, 2.3); sun.position.set(8, 14, 10); scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xe8f3ff, 0x5e5446, .9));
    const o = state.o = { season: 'w', warm: 0, core: true };
    const m4 = new THREE.Matrix4();

    // ---------- địa hình ----------
    const geo = new THREE.PlaneGeometry(XW * 2, Z1 - Z0, 180, 170); geo.rotateX(-Math.PI / 2); geo.translate(0, 0, (Z0 + Z1) / 2);
    const P = geo.attributes.position; const col = new Float32Array(P.count * 3); const hs = new Float32Array(P.count);
    for (let i = 0; i < P.count; i++) { const y = h(P.getX(i), P.getZ(i)); P.setY(i, y); hs[i] = y; }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
    const nY = geo.attributes.normal;
    scene.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 })));
    const c = new THREE.Color(), snowC = new THREE.Color(.95, .97, 1), rockC = new THREE.Color(.5, .48, .45), grassC = new THREE.Color(.42, .55, .3), tundra = new THREE.Color(.55, .55, .42);
    function paintTerrain(snowLine) {
      for (let i = 0; i < P.count; i++) {
        const y = hs[i], steep = 1 - nY.getY(i);
        if (y < 2.2) c.copy(grassC).lerp(tundra, ss(y, 1.2, 2.2)); else c.copy(tundra).lerp(rockC, ss(y, 2.2, 3.4));
        if (steep > .45) c.lerp(rockC, .7);
        const sn = ss(y, snowLine - .3, snowLine + .3) * (steep > .55 ? .45 : 1); c.lerp(snowC, sn);
        col.set([c.r, c.g, c.b], i * 3);
      }
      geo.attributes.color.needsUpdate = true;
    }
    // mép khối
    const skirt = new THREE.MeshStandardMaterial({ color: 0x6d5c4b, roughness: 1 });
    { const pts = []; for (let i = 0; i <= 120; i++) { const x = -XW + i / 120 * 2 * XW; pts.push(new THREE.Vector2(x, h(x, Z1))); } const s = new THREE.Shape([new THREE.Vector2(-XW, -1.5), ...pts, new THREE.Vector2(XW, -1.5)]); const m = new THREE.Mesh(new THREE.ShapeGeometry(s), skirt); m.position.z = Z1; scene.add(m); }
    { const pts = []; for (let i = 0; i <= 120; i++) { const z = Z1 - i / 120 * (Z1 - Z0); pts.push(new THREE.Vector2(z, h(XW, z))); } const s = new THREE.Shape([new THREE.Vector2(Z1, -1.5), ...pts, new THREE.Vector2(Z0, -1.5)]); const m = new THREE.Mesh(new THREE.ShapeGeometry(s), skirt); m.rotation.y = Math.PI / 2; m.position.x = XW; m.scale.x = -1; scene.add(m); }

    { const pts = []; for (let i = 0; i <= 120; i++) { const z = Z0 + i / 120 * (Z1 - Z0); pts.push(new THREE.Vector2(z, h(-XW, z))); } const s2 = new THREE.Shape([new THREE.Vector2(Z0, -1.5), ...pts, new THREE.Vector2(Z1, -1.5)]); const m = new THREE.Mesh(new THREE.ShapeGeometry(s2), skirt); m.rotation.y = -Math.PI / 2; m.position.x = -XW; m.scale.x = -1; scene.add(m); }
    // ---------- sông băng ----------
    const GX = 64, GZ = 150, gZ0 = -9.2, gZ1 = 7;
    const gGeo = new THREE.PlaneGeometry(1, 1, GX, GZ); gGeo.rotateX(-Math.PI / 2);
    const gP = gGeo.attributes.position; const gC = new Float32Array(gP.count * 3); gGeo.setAttribute('color', new THREE.BufferAttribute(gC, 3));
    const glacier = new THREE.Mesh(gGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .35, metalness: .05 })); scene.add(glacier);
    const iceC = new THREE.Color(0x8ec9e8), iceD = new THREE.Color(0x5fa7d0), dirt = new THREE.Color(0x6b6259);
    let zt = 4.6, zE = -2.5;
    function buildGlacier() {
      for (let iz = 0; iz <= GZ; iz++) for (let ix = 0; ix <= GX; ix++) {
        const i = iz * (GX + 1) + ix; const z = lerp(gZ0, gZ1, iz / GZ); const hw = halfW(z, zt); const u = lerp(-1, 1, ix / GX); const x = u * hw;
        const T = thick(z, zt) * (1 - Math.pow(Math.abs(u), 4)); const base = h(x, z);
        gP.setXYZ(i, x, T > .02 ? base + T : base - .2, z);
        if (z < zE) c.copy(snowC); else { c.copy(iceC).lerp(iceD, .25 + .2 * Math.sin(z * 4 + u * 1.5)); c.lerp(snowC, ss(zE + .6 - z, 0, .6)); }
        const mor = Math.max(Math.exp(-(u * u) / .004), Math.exp(-((Math.abs(u) - .9) ** 2) / .004)); if (z > zE - .5) c.lerp(dirt, .75 * mor);
        gC.set([c.r, c.g, c.b], i * 3);
      }
      gP.needsUpdate = true; gGeo.attributes.color.needsUpdate = true; gGeo.computeVertexNormals();
    }
    // đường cân bằng
    const elaLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: 0xff8a3d, dashSize: .25, gapSize: .15 })); scene.add(elaLine);
    // khe nứt + đá vụn trôi theo băng
    const crev = new THREE.InstancedMesh(new THREE.BoxGeometry(.6, .05, .04), new THREE.MeshBasicMaterial({ color: 0x4a86aa }), 60); scene.add(crev);
    const cd = Array.from({ length: 60 }, () => ({ z: lerp(-3.5, 1, Math.random()), u: (Math.random() - .5) * 1.2, l: .5 + Math.random() * .7 }));
    const rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(.09, 0), new THREE.MeshStandardMaterial({ color: 0x5d5650 }), 90); scene.add(rocks);
    const rk = Array.from({ length: 90 }, (_, i) => ({ z: lerp(-7, 5, Math.random()), u: [0, -.9, .9][i % 3] + (Math.random() - .5) * .08 }));
    const surfY = (x, z) => { const hw = halfW(z, zt); const u = x / hw; return h(x, z) + thick(z, zt) * (1 - Math.pow(Math.min(1, Math.abs(u)), 4)); };
    // băng tích cuối (dấu vết sông băng xưa)
    const moraine = new THREE.Mesh(new THREE.TorusGeometry(2.6, .28, 10, 40, Math.PI), new THREE.MeshStandardMaterial({ color: 0x8a7a66, roughness: 1 }));
    moraine.rotation.x = Math.PI / 2; moraine.rotation.z = Math.PI; moraine.scale.set(1, 1.1, .7); moraine.position.set(0, h(0, 6.1) + .02, 5.7); scene.add(moraine);

    // ---------- nước băng tan: suối, hồ trước lưỡi băng ----------
    const meltPts = []; for (let i = 0; i <= 30; i++) { const t = i / 30; const z = lerp(4.7, Z1 + .05, t); meltPts.push(new THREE.Vector3(Math.sin(z * 1.4) * .5, 0, z)); }
    const meltTube = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshStandardMaterial({ color: 0x6fb8e0, roughness: .2 })); scene.add(meltTube);
    let meltCurve = null; const meltI = new THREE.InstancedMesh(new THREE.SphereGeometry(.055, 6, 4), new THREE.MeshBasicMaterial({ color: 0xe6f7ff }), 50); scene.add(meltI); const mk = Array.from({ length: 50 }, (_, i) => i / 50);
    const pond = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshStandardMaterial({ color: 0x7cc3d8, roughness: .1 })); pond.rotation.x = -Math.PI / 2; scene.add(pond);
    function buildMelt(rate) {
      const start = zt + .25; const pts = meltPts.filter(p => p.z >= start).map(p => new THREE.Vector3(p.x, h(p.x, p.z) + .06, p.z));
      if (pts.length < 3) { meltTube.visible = meltI.visible = false; return; }
      pts.unshift(new THREE.Vector3(0, h(0, zt) + .12, zt + .05));
      meltCurve = new THREE.CatmullRomCurve3(pts); meltTube.geometry.dispose(); meltTube.geometry = new THREE.TubeGeometry(meltCurve, 60, .05 + .13 * rate, 8);
      meltTube.visible = meltI.visible = rate > .05;
      pond.visible = zt < 5.2 && rate > .05; const pz = Math.min(zt + 1, 6.2); pond.position.set(Math.sin(pz * 1.4) * .5, h(0, pz) + .07, pz); pond.scale.set(.5 + .5 * rate, .4 + .4 * rate, 1);
    }

    // ---------- tuyết rơi ----------
    const SN = 500; const flakes = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), SN); scene.add(flakes);
    const fd = Array.from({ length: SN }, () => ({ x: (Math.random() - .5) * 14, z: lerp(-9, 3, Math.random()), k: Math.random() }));

    // ---------- lõi băng: tuyết mới → tuyết hạt → băng ----------
    const core = new THREE.Group(); core.position.set(-11.2, 0, 8.6); scene.add(core);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(.9, 1, .3, 32), new THREE.MeshStandardMaterial({ color: 0x3b4a58 })); ped.position.y = .15; core.add(ped);
    const LAYERS = [
      { t: 'Băng', h: 2.4, c: 0x5aa9dc, op: .9, info: { title: 'Băng sông băng', html: 'Sau hàng chục đến hàng trăm năm bị nén, các hạt tuyết dính liền thành <b>băng</b> đặc, rất ít bọt khí. Băng hấp thụ ánh sáng đỏ nên có màu <b>xanh lam</b>. Khối lượng riêng gần 0,9 g/cm³.' } },
      { t: 'Tuyết hạt (firn)', h: 1.5, c: 0xdfe9ee, op: 1, info: { title: 'Tuyết hạt (firn)', html: 'Tuyết đã qua ít nhất một mùa hè, bị nén và <b>tái kết tinh</b> thành các hạt tròn, chặt hơn tuyết mới (khoảng 0,4 – 0,8 g/cm³). Đây là giai đoạn trung gian giữa tuyết và băng.', id: 'firn', onPick: () => api.done('core') } },
      { t: 'Tuyết mới', h: .9, c: 0xffffff, op: 1, info: { title: 'Tuyết mới', html: 'Tuyết vừa rơi rất <b>xốp</b>, chứa tới 90% không khí (khoảng 0,05 – 0,2 g/cm³).' } },
    ];
    let y0 = .3; const coreLabels = [];
    LAYERS.forEach(L => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, L.h, 40), new THREE.MeshStandardMaterial({ color: L.c, roughness: L.op < 1 ? .15 : .9, transparent: L.op < 1, opacity: L.op })); m.position.y = y0 + L.h / 2; core.add(m); api.hotspot(m, L.info);
      coreLabels.push(api.label(L.t, { cls: L.t === 'Băng' ? 'cold' : '', pos: new THREE.Vector3(.9, y0 + L.h / 2, 0), parent: core, onClick: L.info })); y0 += L.h;
    });
    // bọt khí trong lõi
    for (let i = 0; i < 70; i++) { const yy = .3 + Math.random() * (y0 - .3); const dens = yy > 4.2 ? 0 : yy > 2.7 ? .5 : .15; if (Math.random() > dens + .1) continue; const b = new THREE.Mesh(new THREE.SphereGeometry(.03 + Math.random() * .03, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .8 })); const a = Math.random() * 6.28; b.position.set(Math.cos(a) * .63, yy, Math.sin(a) * .63); core.add(b); }
    const press = api.arrow(new THREE.Vector3(-1.05, y0 - .1, 0), new THREE.Vector3(-1.05, .6, 0), 0xffb347, .3, .18); core.add(press);
    coreLabels.push(api.label('Nén chặt theo thời gian ↓', { cls: 'sm warm', pos: new THREE.Vector3(-1.1, y0 + .45, 0), parent: core }));
    coreLabels.push(api.label('Lõi băng', { cls: 'big', pos: new THREE.Vector3(0, y0 + 1.05, 0), parent: core }));

    // ---------- nhãn ----------
    const lAcc = api.label('Vùng tích tụ', { pos: new THREE.Vector3(0, 0, 0), onClick: { title: 'Vùng tích tụ', html: 'Phần trên cao của sông băng: lượng <b>tuyết rơi lớn hơn lượng tan</b>, tuyết dồn lại, nén thành băng và cung cấp băng cho cả sông băng.' } });
    const lEla = api.label('Đường cân bằng', { cls: 'warm', pos: new THREE.Vector3(), onClick: { title: 'Đường cân bằng', html: 'Ranh giới giữa vùng tích tụ và vùng tiêu hao: lượng tuyết bổ sung <b>bằng</b> lượng băng mất đi trong năm. Khi khí hậu ấm lên, đường cân bằng <b>dâng cao</b>, vùng tích tụ thu hẹp.', id: 'ela', onPick: () => api.done('ela') } });
    const lAbl = api.label('Vùng tiêu hao', { cls: 'cold', pos: new THREE.Vector3(), onClick: { title: 'Vùng tiêu hao', html: 'Phần thấp của sông băng: băng <b>tan, bốc hơi</b> nhiều hơn lượng tuyết bổ sung. Băng từ trên chảy xuống bù lại phần mất đi.' } });
    const lSnout = api.label('Lưỡi băng', { cls: 'sm', pos: new THREE.Vector3(), onClick: { title: 'Lưỡi băng', html: 'Đầu cuối của sông băng. Lưỡi băng tiến xuống khi băng bổ sung nhiều, <b>lùi lên</b> khi băng tan nhiều – dấu hiệu rõ của biến đổi khí hậu.' } });
    const lMelt = api.label('Nước băng tan → sông', { cls: 'cold', pos: new THREE.Vector3(), onClick: { title: 'Nước băng tuyết tan', html: 'Nước tan chảy ra từ lưỡi băng thành suối, sông. Sông được cấp nước băng tuyết có <b>lũ vào mùa xuân – hạ</b>, mùa đông ít nước vì nước đóng băng.' } });
    api.label('Khe nứt băng', { cls: 'sm', pos: new THREE.Vector3(1.6, surfY(1.4, -1.5) + .5, -1.5), onClick: { title: 'Khe nứt băng', html: 'Khi chảy qua đoạn dốc hoặc chỗ uốn, lớp băng phía trên giòn bị <b>nứt</b> thành các khe sâu.' } });
    api.label('Băng tích', { cls: 'sm', pos: new THREE.Vector3(-2.3, h(-2.3, 6) + .6, 6), onClick: { title: 'Băng tích', html: 'Đất đá do sông băng bào mòn, mang theo rồi <b>bồi lại</b> ở hai bên và ở lưỡi băng. Dải băng tích cuối cho biết sông băng từng vươn tới đâu.' } });
    api.label('Thung lũng chữ U', { cls: 'sm', pos: new THREE.Vector3(-4.4, h(-4.4, 1) + .5, 1), onClick: { title: 'Thung lũng chữ U', html: 'Sông băng mang theo đá vụn <b>bào mòn</b> đáy và sườn thung lũng, biến thung lũng chữ V của sông thành thung lũng chữ U, đáy rộng, sườn dốc.' } });

    // ---------- cập nhật ----------
    let melt = 0;
    function update() {
      const summer = o.season === 's';
      zt = 4.6 - 1.15 * o.warm;
      zE = summer ? -2.4 + 1.6 * o.warm : zt + 1; // mùa đông tuyết phủ kín sông băng
      paintTerrain(summer ? 7.6 + .6 * o.warm : 2.6 + .3 * o.warm);
      buildGlacier();
      // đường cân bằng
      const pts = []; const hw = halfW(zE, zt); for (let i = 0; i <= 40; i++) { const x = lerp(-hw, hw, i / 40); pts.push(new THREE.Vector3(x, surfY(x, zE) + .05, zE)); }
      elaLine.geometry.dispose(); elaLine.geometry = new THREE.BufferGeometry().setFromPoints(pts); elaLine.computeLineDistances(); elaLine.visible = summer && zE < zt - .3;
      melt = summer ? clamp(.55 + .2 * o.warm, 0, 1) : .06; buildMelt(melt);
      lAcc.position.set(0, surfY(0, -6) + .7, -6);
      lEla.position.set(halfW(zE, zt) + .4, surfY(0, zE) + .4, zE); lEla.visible = elaLine.visible;
      const za = (Math.max(zE, -2) + zt) / 2; lAbl.position.set(0, surfY(0, za) + .6, za); lAbl.visible = summer && zt - zE > 1.5;
      lSnout.position.set(1.2, h(0, zt) + .9, zt); lMelt.position.set(1.6, h(0, Math.min(zt + 1.5, 6.6)) + .5, Math.min(zt + 1.5, 6.6)); lMelt.visible = summer;
      core.visible = o.core; coreLabels.forEach(l => (l.visible = o.core));
      const len = (zt - (-9.2)) * .45, ela = Math.round((2300 + 260 * floorY(zE)) / 10) * 10;
      api.readout(`<b>${summer ? 'Mùa hè' : 'Mùa đông'}</b>${o.warm ? ` · nhiệt độ tăng <b>+${String(o.warm).replace('.', ',')} °C</b>` : ''}
        <div>Chiều dài sông băng: <b>${len.toFixed(1).replace('.', ',')} km</b></div>
        <div>Đường cân bằng: ${summer ? `<b>~${ela.toLocaleString('vi-VN')} m</b>` : 'tuyết phủ gần hết sông băng'}</div>
        <div>Nước băng tan cấp cho sông: <b>${melt > .7 ? 'rất nhiều' : melt > .4 ? 'nhiều' : 'rất ít'}</b></div>
        <div style="font-size:12px;opacity:.8;margin-top:4px">Số liệu độ cao, chiều dài mang tính minh hoạ.</div>`);
    }
    state.apply = p => { Object.assign(o, p); if (p.season) api.set('season', p.season); if (p.warm !== undefined) api.set('warm', p.warm); if (p.core !== undefined) api.set('core', p.core); update(); };

    api.onTick((dt, t) => {
      const summer = o.season === 's';
      for (let i = 0; i < SN; i++) { const f = fd[i]; f.k = (f.k + dt * .16) % 1; const on = (summer ? i < SN * .12 && f.z < zE : i < SN * .8) ? 1 : 0; const top = 10.5, yb = Math.max(h(f.x, f.z), surfY(0, f.z)); m4.makeScale(on, on, on).setPosition(f.x + Math.sin(f.k * 9 + i) * .15, top - (top - yb) * f.k, f.z); flakes.setMatrixAt(i, m4); }
      flakes.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < 90; i++) { const r = rk[i]; r.z += dt * .12; if (r.z > zt - .1) r.z = -7 + Math.random() * 1.5; const x = r.u * halfW(r.z, zt); const vis = r.z > zE - .3 ? 1 : 0; m4.makeScale(vis, vis, vis).setPosition(x, surfY(x, r.z) + .02, r.z); rocks.setMatrixAt(i, m4); }
      rocks.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < 60; i++) { if (i >= 34) { m4.makeScale(0, 0, 0); crev.setMatrixAt(i, m4); continue; } const d = cd[i]; d.z += dt * .06; if (d.z > Math.min(1.5, zt - .6)) d.z = -3.5; const x = d.u * halfW(d.z, zt); const vis = summer && d.z > zE ? 1 : 0; m4.makeScale(vis * d.l, vis, vis).setPosition(x, surfY(x, d.z) + .01, d.z); crev.setMatrixAt(i, m4); }
      crev.instanceMatrix.needsUpdate = true;
      if (meltCurve && meltI.visible) { for (let i = 0; i < 50; i++) { mk[i] = (mk[i] + dt * (.05 + .2 * melt)) % 1; const p = meltCurve.getPointAt(mk[i]); const s = i / 50 < .2 + melt ? 1 : 0; m4.makeScale(s, s, s).setPosition(p.x, p.y + .06, p.z); meltI.setMatrixAt(i, m4); } meltI.instanceMatrix.needsUpdate = true; }
    });

    api.heading('Mùa');
    api.choice('season', '', [{ v: 'w', t: 'Mùa đông' }, { v: 's', t: 'Mùa hè (băng tan)' }], o.season, v => { o.season = v; update(); if (v === 's') api.done('summer'); });
    api.heading('Biến đổi khí hậu');
    api.slider('warm', 'Nhiệt độ tăng thêm', { min: 0, max: 3, step: .5, value: 0, format: v => '+' + String(v).replace('.', ',') + ' °C' }, v => { o.warm = v; update(); if (v >= 2) api.done('warm'); });
    api.toggle('core', 'Hiện lõi băng (tuyết → băng)', true, v => { o.core = v; update(); });
    update();
  },
};

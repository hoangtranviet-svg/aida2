// 3D-11 · Bài 11 – Thuỷ quyển, nước trên lục địa
import { THREE } from '../core.js';

const W = 18, Dz = 8;
// địa hình: biển phía tây (x < −3), đồng bằng, núi cao phía đông
function h(x, z) {
  const coast = THREE.MathUtils.smoothstep(x, -4, -1.5);
  let y = -1.2 * (1 - coast) + .25 * coast;
  y += 3.8 * Math.exp(-(((x - 5.2) ** 2) / 5 + ((z + .3) ** 2) / 7));
  y += 1.2 * Math.exp(-(((x - 7.5) ** 2) / 2 + ((z - 2.4) ** 2) / 3));
  // thung lũng sông
  const rz = .6 * Math.sin(x * .45) - .2; y -= .35 * Math.exp(-((z - rz) ** 2) / .5) * coast * (x < 4.5 ? 1 : 0);
  // hồ
  y -= .45 * Math.exp(-(((x - .8) ** 2) + ((z + 2.4) ** 2)) / .9);
  return y;
}
const riverZ = x => .6 * Math.sin(x * .45) - .2;

export default {
  id: '3D-11', code: 'DL10.B11', title: 'Vòng tuần hoàn nước, nước trên lục địa',
  objectives: [
    { c: 'DL10.05.01', t: 'Khái niệm thuỷ quyển' },
    { c: 'DL10.05.02', t: 'Các nhân tố ảnh hưởng tới chế độ nước sông' },
    { c: 'DL10.05.05', t: 'Nước băng tuyết và nước ngầm' },
    { c: 'DL10.05.06', t: 'Giải pháp bảo vệ nguồn nước ngọt' },
  ],
  sources: [
    { t: 'USGS Water Science School – The Water Cycle (bản tiếng Việt có trên trang USGS)', u: 'https://www.usgs.gov/special-topics/water-science-school/science/water-cycle' },
    { t: 'NASA Earth Observatory – The Water Cycle', u: 'https://earthobservatory.nasa.gov/features/Water' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 11', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  view: { pos: [-3, 9, 15], target: [1, 0, 0] },
  steps: [
    { title: 'Thuỷ quyển', html: '<p><b>Thuỷ quyển</b> là lớp nước trên Trái Đất, gồm nước trong biển và đại dương, nước trên lục địa (sông, hồ, băng tuyết, nước ngầm) và hơi nước trong khí quyển.</p><p>Nước biển và đại dương chiếm khoảng <b>97,5%</b>; nước ngọt chỉ khoảng <b>2,5%</b>, phần lớn ở dạng băng.</p>',
      enter: a => { a.state.cycle('big'); a.fly([-3, 9, 15], [1, 0, 0]); } },
    { title: 'Vòng tuần hoàn nhỏ và lớn', html: '<ul><li><b>Vòng tuần hoàn nhỏ</b>: nước biển bốc hơi → mây → mưa rơi xuống ngay trên biển.</li><li><b>Vòng tuần hoàn lớn</b>: hơi nước từ biển được gió đưa vào lục địa → mưa, tuyết → nước chảy trên mặt, thấm xuống đất thành nước ngầm → theo sông chảy ra biển.</li></ul><div class="tip">Chuyển giữa hai vòng tuần hoàn và bấm vào tên các quá trình.</div>',
      enter: a => { a.fly([-4, 7, 14], [0, 1, 0]); } },
    { title: 'Các nguồn cấp nước cho sông', html: '<p>Chế độ nước sông phụ thuộc vào nguồn cấp nước:</p><ul><li><b>Nước mưa</b>: ở vùng nhiệt đới, mùa lũ trùng mùa mưa.</li><li><b>Băng tuyết tan</b>: ở vùng ôn đới lạnh, núi cao; lũ vào mùa xuân – hạ.</li><li><b>Nước ngầm</b>: điều hoà dòng chảy, giúp sông có nước cả mùa khô.</li></ul><p>Ngoài ra còn có địa hình, thực vật, hồ đầm tác động đến dòng chảy.</p>',
      enter: a => { a.state.cycle('big'); a.fly([8, 6, 12], [3, 1, 0]); } },
    { title: 'Nước ngầm và hồ', html: '<p><b>Nước ngầm</b> nằm trong các lớp đất đá thấm nước dưới mặt đất, được cung cấp từ nước mưa, nước sông hồ thấm xuống. Hãy quan sát mặt cắt phía trước khối địa hình.</p><p><b>Hồ</b> là vùng trũng chứa nước trên lục địa; theo nguồn gốc có hồ móng ngựa, hồ kiến tạo, hồ núi lửa, hồ băng hà, hồ nhân tạo (hồ thuỷ điện).</p>',
      enter: a => { a.fly([2, 2, 13], [1, -1.2, 2]); } },
    { title: 'Bảo vệ nguồn nước ngọt', html: '<ul><li>Sử dụng nước tiết kiệm, hợp lí.</li><li>Xử lí nước thải trước khi thải ra môi trường; không xả rác xuống sông, hồ.</li><li>Trồng và bảo vệ rừng đầu nguồn để giữ nước, điều hoà dòng chảy.</li><li>Khai thác nước ngầm hợp lí, tránh cạn kiệt, sụt lún.</li></ul>',
      enter: a => { a.fly([-3, 9, 15], [1, 0, 0]); } },
  ],
  tasks: [
    { id: 'small', text: 'Chuyển sang <b>vòng tuần hoàn nhỏ</b> và quan sát mưa rơi ở đâu.' },
    { id: 'src3', text: 'Bấm vào <b>3 nguồn cấp nước cho sông</b>: mưa, băng tuyết tan, nước ngầm.' },
    { id: 'evap', text: 'Bấm vào quá trình <b>bốc hơi</b>.' },
    { id: 'lake', text: 'Tìm và bấm vào <b>hồ</b>.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x9cc8ea);
    scene.fog = new THREE.Fog(0x9cc8ea, 30, 60);
    const sunL = new THREE.DirectionalLight(0xffffff, 2.4); sunL.position.set(-6, 12, 8); scene.add(sunL);
    scene.add(new THREE.HemisphereLight(0xcfe8ff, 0x5a4a30, .8));
    const sunM = new THREE.Mesh(new THREE.SphereGeometry(.7, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffe066 })); sunM.position.set(-8, 8.5, -4); scene.add(sunM); { const gl = api.glow('#fff1a0', 5); gl.position.copy(sunM.position); scene.add(gl); }
    // địa hình
    const geo = new THREE.PlaneGeometry(W, Dz, 180, 80); geo.rotateX(-Math.PI / 2);
    const P = geo.attributes.position; const col = new Float32Array(P.count * 3);
    for (let i = 0; i < P.count; i++) {
      const x = P.getX(i), z = P.getZ(i); const y = h(x, z); P.setY(i, y);
      let c; if (y > 3.0) c = [.96, .97, 1]; else if (y > 2.2) c = [.55, .55, .5]; else if (y > .9) c = [.32, .47, .25]; else if (y > .05) c = [.42, .6, .3]; else if (y > -.2) c = [.85, .78, .55]; else c = [.55, .5, .42];
      col.set(c, i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3)); geo.computeVertexNormals();
    const ground = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95, flatShading: false })); scene.add(ground);
    // biển
    const sea = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.25, Dz), new THREE.MeshStandardMaterial({ color: 0x2b78c2, transparent: true, opacity: .82, roughness: .2 })); sea.position.set(-W / 2 + 3.3, -.6, 0); scene.add(sea);
    // hồ
    const lake = new THREE.Mesh(new THREE.CircleGeometry(1.0, 32), new THREE.MeshStandardMaterial({ color: 0x3a8fd6, roughness: .15 })); lake.rotation.x = -Math.PI / 2; lake.position.set(.8, .02, -2.4); scene.add(lake);
    // sông
    const rPts = []; for (let x = 4.4; x >= -3.4; x -= .2) rPts.push(new THREE.Vector3(x, Math.max(h(x, riverZ(x)), -.05) + .06, riverZ(x)));
    const river = new THREE.CatmullRomCurve3(rPts);
    scene.add(api.tube(river.getPoints(200), .09, 0x2f86d8));
    api.flowAlong(river, { count: 40, color: 0xbfe6ff, size: .06, speed: .05 });
    // rừng
    const treeG = new THREE.ConeGeometry(.18, .55, 6); const treeM = new THREE.MeshStandardMaterial({ color: 0x2f6b34 });
    const trees = new THREE.InstancedMesh(treeG, treeM, 160); let n = 0; const m4 = new THREE.Matrix4();
    for (let k = 0; k < 600 && n < 160; k++) { const x = -1 + Math.random() * 7, z = (Math.random() - .5) * Dz * .9; const y = h(x, z); if (y > .5 && y < 2.4 && Math.abs(z - riverZ(x)) > .4) { m4.makeTranslation(x, y + .25, z); trees.setMatrixAt(n++, m4); } }
    trees.count = n; scene.add(trees);
    // mặt cắt phía trước: tầng đất – tầng chứa nước ngầm – đá
    {
      const cw = 900, ch = 300; const c = document.createElement('canvas'); c.width = cw; c.height = ch; const x2 = c.getContext('2d');
      const yTop = -3.5, yBot = 4.5; const Y = y => (yBot - y) / (yBot - yTop) * ch; const X = i => i / cw * W - W / 2;
      x2.fillStyle = 'rgba(0,0,0,0)'; x2.clearRect(0, 0, cw, ch);
      for (let i = 0; i < cw; i++) {
        const x = X(i), top = h(x, Dz / 2);
        const grad = [[top, '#7a5a3a'], [top - .5, '#8f6f45'], [-1.6, '#6c8fa8'], [-2.6, '#5c5f66'], [yTop, '#5c5f66']];
        for (let k = 0; k < grad.length - 1; k++) { const y0 = Math.min(grad[k][0], top), y1 = Math.min(grad[k + 1][0], top); if (y0 <= y1) continue; x2.fillStyle = grad[k][1]; x2.fillRect(i, Y(y0), 1, Y(y1) - Y(y0) + 1); }
        if (x < -3) { x2.fillStyle = '#2b78c2'; x2.fillRect(i, Y(0), 1, Y(top) - Y(0)); }
      }
      x2.fillStyle = 'rgba(255,255,255,.85)'; x2.font = '600 15px Be Vietnam Pro, sans-serif';
      x2.fillText('Tầng đất', cw * .55, Y(-.4)); x2.fillText('Tầng chứa nước ngầm (cát, sỏi)', cw * .45, Y(-1.95)); x2.fillText('Tầng đá không thấm nước', cw * .45, Y(-2.95));
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      const face = new THREE.Mesh(new THREE.PlaneGeometry(W, yBot - yTop), new THREE.MeshBasicMaterial({ map: t, transparent: true })); face.position.set(0, (yBot + yTop) / 2, Dz / 2 + .01); scene.add(face);
      // dòng nước ngầm
      const gw = new THREE.CatmullRomCurve3([new THREE.Vector3(6, -1.7, Dz / 2 + .05), new THREE.Vector3(3, -1.9, Dz / 2 + .05), new THREE.Vector3(0, -2.0, Dz / 2 + .05), new THREE.Vector3(-2.5, -1.8, Dz / 2 + .05), new THREE.Vector3(-4, -1.1, Dz / 2 + .05)]);
      api.flowAlong(gw, { count: 26, color: 0x9fe0ff, size: .07, speed: .03 });
      const gwHot = new THREE.Mesh(new THREE.BoxGeometry(10, .9, .1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })); gwHot.position.set(1, -2, Dz / 2 + .05); scene.add(gwHot);
      state.gwHot = gwHot;
    }
    // mây + mưa + bốc hơi
    const cloudM = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1 });
    const mkCloud = () => { const g = new THREE.Group(); for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(.45 + Math.random() * .3, 14, 10), cloudM); s.position.set((i - 2.5) * .5, Math.random() * .3, (Math.random() - .5) * .6); g.add(s); } scene.add(g); return g; };
    const clouds = [0, 1, 2].map(i => ({ g: mkCloud(), t: i / 3 }));
    const rainN = 260; const rain = new THREE.InstancedMesh(new THREE.CylinderGeometry(.015, .015, .25, 4), new THREE.MeshBasicMaterial({ color: 0x5aa7ff }), rainN); scene.add(rain);
    const rd = Array.from({ length: rainN }, (_, i) => ({ c: i % 3, ox: (Math.random() - .5) * 2.4, oz: (Math.random() - .5) * 1.2, k: Math.random() }));
    const vapN = 120; const vap = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .6 }), vapN); scene.add(vap);
    const vd = Array.from({ length: vapN }, (_, i) => ({ x: i < 90 ? -8.5 + Math.random() * 5.5 : 1 + Math.random() * 4, z: (Math.random() - .5) * Dz * .8, k: Math.random(), land: i >= 90 }));
    const snowN = 80; const snow = new THREE.InstancedMesh(new THREE.SphereGeometry(.04, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }), snowN); scene.add(snow);
    const sd = Array.from({ length: snowN }, () => ({ x: 4.2 + Math.random() * 2, z: -1.4 + Math.random() * 2.2, k: Math.random() }));
    state.big = true;
    api.onTick((dt, t) => {
      clouds.forEach((c, i) => {
        c.t = (c.t + dt * .035) % 1;
        const x = state.big ? -7 + c.t * 13 : -7.5 + ((c.t * 5) % 1) * 4.2; c.g.position.set(x, 5.4 + Math.sin(t + i) * .15, -1.6 + i * 1.5);
        const s = state.big ? (c.t < .15 ? c.t / .15 : 1) : 1; c.g.scale.setScalar(.6 + s * .5);
      });
      for (let i = 0; i < rainN; i++) {
        const d = rd[i]; const cg = clouds[d.c].g; d.k = (d.k + dt * .9) % 1;
        const raining = state.big ? cg.position.x > 0 : true;
        const x = cg.position.x + d.ox, z = cg.position.z + d.oz; const yb = Math.max(h(x, z), 0);
        if (!raining) { m4.makeScale(0, 0, 0); rain.setMatrixAt(i, m4); continue; }
        m4.makeTranslation(x, cg.position.y - .3 - (cg.position.y - .3 - yb) * d.k, z); rain.setMatrixAt(i, m4);
      }
      rain.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < vapN; i++) { const d = vd[i]; d.k = (d.k + dt * .25) % 1; const show = !d.land || state.big; const y0 = d.land ? h(d.x, d.z) + .5 : 0; m4.makeScale(show ? 1 : 0, show ? 1 : 0, show ? 1 : 0).setPosition(d.x + Math.sin(d.k * 6 + i) * .15, y0 + d.k * 4.6, d.z); vap.setMatrixAt(i, m4); }
      vap.instanceMatrix.needsUpdate = true;
      for (let i = 0; i < snowN; i++) { const d = sd[i]; d.k = (d.k + dt * .2) % 1; const sh = state.big ? 1 : 0; m4.makeScale(sh, sh, sh).setPosition(d.x + Math.sin(d.k * 8 + i) * .1, 5.2 - d.k * (5.2 - h(d.x, d.z)), d.z); snow.setMatrixAt(i, m4); }
      snow.instanceMatrix.needsUpdate = true;
    });
    // nhãn quá trình
    const L = (t, p, info, cls = '') => api.label(t, { cls, pos: p, onClick: info });
    const evapInfo = { title: 'Bốc hơi', html: 'Nước ở biển, sông, hồ, đất ẩm nhận nhiệt từ Mặt Trời, chuyển thành hơi nước bay lên. Đại dương cung cấp phần lớn hơi nước cho khí quyển.', id: 'evap', onPick: () => api.done('evap') };
    L('Bốc hơi', new THREE.Vector3(-6, 2.3, 2), evapInfo, 'cold');
    L('Ngưng tụ → mây', new THREE.Vector3(-3, 6.6, 0), { title: 'Ngưng tụ', html: 'Hơi nước bốc lên cao, gặp lạnh ngưng tụ thành các hạt nước nhỏ, tạo thành mây.' });
    L('Gió đưa hơi nước vào đất liền ➜', new THREE.Vector3(-.5, 7.4, -1), { title: 'Vận chuyển hơi nước', html: 'Gió mang mây và hơi nước từ biển vào lục địa – khâu quan trọng của vòng tuần hoàn lớn.' });
    L('Thoát hơi nước (thực vật)', new THREE.Vector3(2.8, 2.6, 2.6), { title: 'Thoát hơi nước', html: 'Thực vật hút nước từ đất và thải hơi nước qua lá, góp phần đưa hơi nước trở lại khí quyển.' });
    L('Hồ', new THREE.Vector3(.8, .6, -2.4), { title: 'Hồ', html: 'Vùng trũng chứa nước trên lục địa. Hồ điều hoà dòng chảy, cung cấp nước, nuôi trồng thuỷ sản, du lịch… Theo nguồn gốc: hồ móng ngựa, hồ kiến tạo, hồ núi lửa, hồ băng hà, hồ nhân tạo.', id: 'lake', onPick: () => api.done('lake') }, 'cold');
    L('Sông chảy ra biển', new THREE.Vector3(-2.2, .7, 1), { title: 'Dòng chảy mặt', html: 'Nước mưa, nước băng tuyết tan chảy trên bề mặt, tập trung vào sông suối rồi đổ ra biển, khép kín vòng tuần hoàn lớn.' });
    const SRCSEEN = new Set(); const pick = id => () => { SRCSEEN.add(id); if (SRCSEEN.size >= 3) api.done('src3'); };
    const SRC = {
      mua: { title: 'Nguồn cấp: nước mưa', html: 'Ở vùng nhiệt đới như Việt Nam, sông chủ yếu được cấp nước bởi mưa → <b>mùa lũ trùng với mùa mưa</b>, mùa cạn trùng mùa khô.', id: 'src-mua', onPick: pick('mua') },
      bang: { title: 'Nguồn cấp: băng tuyết tan', html: 'Sông bắt nguồn từ núi cao hoặc vùng ôn đới lạnh có lũ vào <b>mùa xuân – hạ</b> khi nhiệt độ tăng, băng tuyết tan.', id: 'src-bang', onPick: pick('bang') },
      ngam: { title: 'Nguồn cấp: nước ngầm', html: 'Nước ngầm thấm ra sông quanh năm, giúp <b>điều hoà dòng chảy</b>, sông vẫn có nước vào mùa khô. Nơi có nhiều đá vôi, nước ngầm cấp cho sông rất lớn.', id: 'src-ngam', onPick: pick('ngam') },
    };
    api.hotspot(state.gwHot, SRC.ngam);
    L('Mưa', new THREE.Vector3(1.5, 4.3, -1), SRC.mua, 'cold');
    L('Băng tuyết tan', new THREE.Vector3(5.2, 4.6, -.3), SRC.bang);
    L('Thấm → nước ngầm', new THREE.Vector3(1.5, -1.4, Dz / 2 + .2), SRC.ngam, 'cold');
    api.label('Biển', { cls: 'big cold', pos: new THREE.Vector3(-7, .4, 2.5) });
    state.cycle = v => { state.big = v === 'big'; api.set('cyc', v); };
    api.heading('Vòng tuần hoàn');
    api.choice('cyc', '', [{ v: 'small', t: 'Vòng nhỏ' }, { v: 'big', t: 'Vòng lớn' }], 'big', v => { state.big = v === 'big'; if (v === 'small') api.done('small'); });
  },
};

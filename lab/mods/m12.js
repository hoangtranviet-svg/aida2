// 3D-12 · Bài 12 – Nước biển và đại dương: sóng, thuỷ triều, dòng biển
import { THREE, makeGlobe, geoCurve, latLonToVec3, starfield } from '../core.js';
import { earthTexture } from '../earth.js';
import { CURRENTS } from '../geo.js';

export default {
  id: '3D-12', code: 'DL10.B12', title: 'Sóng biển, thuỷ triều và dòng biển',
  objectives: [
    { c: 'DL10.05.07', t: 'Tính chất của nước biển và đại dương' },
    { c: 'DL10.05.08', t: 'Giải thích hiện tượng sóng biển và thuỷ triều' },
    { c: 'DL10.05.09', t: 'Chuyển động của các dòng biển' },
    { c: 'DL10.05.10', t: 'Vai trò của biển và đại dương' },
  ],
  sources: [
    { t: 'NOAA National Ocean Service – Tides and Water Levels', u: 'https://oceanservice.noaa.gov/education/tutorial_tides/' },
    { t: 'NOAA – What are spring and neap tides?', u: 'https://oceanservice.noaa.gov/facts/springtide.html' },
    { t: 'NOAA Ocean Explorer – Ocean currents', u: 'https://oceanexplorer.noaa.gov/facts/currents.html' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 12 (Hình 12.1 – 12.5)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Độ phồng của nước do thuỷ triều được phóng đại rất nhiều lần để quan sát. Đường đi của dòng biển đã được giản lược.',
  view: { pos: [0, 5, 12], target: [0, 0, 0] },
  steps: [
    { title: 'Sóng biển', html: '<p><b>Sóng biển</b> là hình thức dao động của nước biển theo chiều thẳng đứng. Nguyên nhân chủ yếu là <b>gió</b>: gió càng mạnh, sóng càng lớn.</p><p>Quan sát quả phao: các phân tử nước chủ yếu <b>chuyển động theo vòng tròn tại chỗ</b>, chỉ có hình dạng sóng truyền đi.</p><p>Động đất, núi lửa dưới đáy biển có thể gây <b>sóng thần</b> rất nguy hiểm.</p>',
      enter: a => { a.state.show('wave'); a.fly([0, 5, 12], [0, 0, 0]); } },
    { title: 'Thuỷ triều', html: '<p><b>Thuỷ triều</b> là hiện tượng dao động thường xuyên, có chu kì của nước biển, chủ yếu do <b>sức hút của Mặt Trăng và Mặt Trời</b> cùng với lực li tâm khi Trái Đất tự quay.</p><p>Nước phồng lên ở phía hướng về Mặt Trăng và ở phía đối diện → hầu hết các nơi có hai lần triều lên, hai lần triều xuống mỗi ngày.</p>',
      enter: a => { a.state.show('tide'); a.fly([0, 9, 9], [0, 0, 0]); } },
    { title: 'Triều cường và triều kém', html: '<ul><li><b>Triều cường</b> (triều lớn nhất): Mặt Trời, Mặt Trăng, Trái Đất <b>thẳng hàng</b> – ngày không trăng (mùng 1 âm lịch) và trăng tròn (ngày 15 âm lịch).</li><li><b>Triều kém</b> (triều nhỏ nhất): Mặt Trời và Mặt Trăng ở vị trí <b>vuông góc</b> so với Trái Đất – ngày trăng thượng huyền, hạ huyền (khoảng mùng 8, 23 âm lịch).</li></ul><div class="tip">Kéo thanh “Ngày âm lịch”.</div>',
      enter: a => { a.state.show('tide'); a.fly([0, 13, 2], [0, 0, 0]); } },
    { title: 'Dòng biển', html: '<p><b>Dòng biển</b> là sự chuyển động của nước biển thành dòng, như những “dòng sông” trong đại dương. Nguyên nhân chủ yếu: các <b>gió thường xuyên</b> (Mậu dịch, Tây ôn đới).</p><ul><li><b>Dòng biển nóng</b> (đỏ): thường từ vùng vĩ độ thấp chảy về vĩ độ cao, ở bờ đông các lục địa (vùng nhiệt đới).</li><li><b>Dòng biển lạnh</b> (xanh): từ vĩ độ cao chảy về vĩ độ thấp, ở bờ tây các lục địa (vùng nhiệt đới).</li></ul>',
      enter: a => { a.state.show('curr'); a.fly([0, 2, 6.5], [0, 0, 0]); } },
  ],
  tasks: [
    { id: 'storm', text: 'Tăng <b>sức gió</b> lên mức lớn nhất và quan sát độ cao sóng.' },
    { id: 'spring', text: 'Kéo đến ngày âm lịch có <b>triều cường</b>.' },
    { id: 'neap', text: 'Kéo đến ngày âm lịch có <b>triều kém</b>.' },
    { id: 'cold', text: 'Bấm vào một <b>dòng biển lạnh</b> chảy dọc bờ tây Nam Mỹ.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    const stars = starfield(scene);
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 8, 6); scene.add(key);
    const groups = { wave: new THREE.Group(), tide: new THREE.Group(), curr: new THREE.Group() };
    Object.values(groups).forEach(g => scene.add(g));

    // ===== sóng =====
    {
      const g = groups.wave;
      const geo = new THREE.PlaneGeometry(16, 8, 160, 60); geo.rotateX(-Math.PI / 2);
      const P = geo.attributes.position; const base = P.array.slice();
      const water = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x1f6fb4, roughness: .25, metalness: .1, flatShading: false, transparent: true, opacity: .92 })); g.add(water);
      const floor = new THREE.Mesh(new THREE.BoxGeometry(16, .3, 8), new THREE.MeshStandardMaterial({ color: 0xc8b48a })); floor.position.y = -2.4; g.add(floor);
      const buoy = new THREE.Mesh(new THREE.SphereGeometry(.22, 24, 16), new THREE.MeshStandardMaterial({ color: 0xff5a2a })); g.add(buoy);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.5, .015, 8, 64), new THREE.MeshBasicMaterial({ color: 0xffffff })); ring.position.set(0, 0, 2.2); g.add(ring);
      const wind = new THREE.Group(); g.add(wind);
      for (let i = 0; i < 5; i++) { const a = api.arrow(new THREE.Vector3(-7, 2.2 + i * .25, -2 + i), new THREE.Vector3(-4.5, 2.2 + i * .25, -2 + i), 0xffffff, .3, .15); wind.add(a); }
      api.label('Gió', { cls: 'big', pos: new THREE.Vector3(-6, 3.6, 0), parent: g });
      api.label('Phân tử nước chuyển động vòng tròn tại chỗ', { cls: 'sm', pos: new THREE.Vector3(0, 1.3, 2.2), parent: g });
      api.label('Hướng truyền sóng ➜', { cls: 'sm cold', pos: new THREE.Vector3(4.5, 1.2, -3), parent: g });
      state.wind = .5;
      api.onTick((dt, t) => {
        if (state.cur !== 'wave') return;
        const A = .08 + state.wind * .7, k = 1.1, w = 1.6;
        for (let i = 0; i < P.count; i++) { const x = base[i * 3], z = base[i * 3 + 2]; P.setY(i, A * Math.sin(k * x - w * t) + A * .25 * Math.sin(k * 1.7 * x + z * .8 - w * 1.3 * t)); }
        P.needsUpdate = true; geo.computeVertexNormals();
        const ph = k * 0 - w * t; buoy.position.set(-A * Math.cos(ph) * .9, A * Math.sin(ph) + .1, 2.2); ring.scale.setScalar(Math.max(A, .1) / .5 * .9);
        wind.children.forEach((a, i) => { a.position.x = ((t * (1 + state.wind * 3) + i * .7) % 4) - 1; });
        api.readout(`<b>Sức gió</b>: ${state.wind < .3 ? 'nhẹ' : state.wind < .7 ? 'vừa' : 'rất mạnh (bão)'}<br>Độ cao sóng (minh hoạ): <b>${(A * 2 * 4).toFixed(1).replace('.', ',')} m</b>`);
      });
    }

    // ===== thuỷ triều =====
    {
      const g = groups.tide;
      const tex = await earthTexture({ mode: 'natural' });
      const earth = makeGlobe(api, { radius: 1.4, texture: tex, grid: false }); g.add(earth);
      const bulge = new THREE.Mesh(new THREE.SphereGeometry(1.42, 64, 48), new THREE.MeshStandardMaterial({ color: 0x3aa0ff, transparent: true, opacity: .45, roughness: .2, depthWrite: false })); g.add(bulge);
      const moon = new THREE.Mesh(new THREE.SphereGeometry(.38, 32, 24), new THREE.MeshStandardMaterial({ color: 0xcfcfcf, roughness: 1 })); g.add(moon);
      const orbit = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, i) => new THREE.Vector3(Math.cos(i / 128 * Math.PI * 2) * 5, 0, Math.sin(i / 128 * Math.PI * 2) * 5))), new THREE.LineBasicMaterial({ color: 0x8899aa, transparent: true, opacity: .5 })); g.add(orbit);
      const sunDir = new THREE.Vector3(-1, 0, 0);
      const sun = new THREE.Mesh(new THREE.SphereGeometry(1.2, 32, 24), new THREE.MeshBasicMaterial({ color: 0xffc94a })); sun.position.set(-11, 0, 0); g.add(sun);
      const sg = api.glow('#ffb43c', 6); sg.position.copy(sun.position); g.add(sg);
      api.label('Mặt Trời', { pos: new THREE.Vector3(-11, 1.8, 0), parent: g });
      const mL = api.label('Mặt Trăng', { cls: 'sm', pos: new THREE.Vector3(0, .7, 0), parent: moon });
      const phaseL = api.label('', { cls: 'big', pos: new THREE.Vector3(0, 3.2, 0), parent: g });
      state.lunar = 1;
      const upd = () => {
        const d = state.lunar; const ang = Math.PI + (d - 1) / 29.5 * Math.PI * 2; // ngày 1: Mặt Trăng nằm giữa Trái Đất và Mặt Trời
        moon.position.set(Math.cos(ang) * 5, 0, Math.sin(ang) * 5);
        const mdir = moon.position.clone().normalize();
        const align = Math.abs(Math.cos(2 * (ang - Math.PI))); // 1: thẳng hàng, 0: vuông góc
        const amp = .18 + .3 * align;
        bulge.scale.set(1, 1, 1); bulge.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), mdir);
        bulge.scale.set(1 + amp, 1 - amp * .25, 1 - amp * .25);
        const name = align > .9 ? 'TRIỀU CƯỜNG' : align < .2 ? 'TRIỀU KÉM' : 'Triều trung bình';
        api.setLabelText(phaseL, `Ngày ${d} âm lịch · ${name}`); phaseL.element.className = 'lbl big ' + (align > .9 ? 'warm' : align < .2 ? 'cold' : '');
        if (state.cur === 'tide') api.readout(`<b>Ngày ${d} âm lịch</b><br>${d === 1 ? 'Không trăng' : d === 15 ? 'Trăng tròn' : d === 8 ? 'Trăng thượng huyền' : d === 23 ? 'Trăng hạ huyền' : ''}<br>Mức triều: <b>${name}</b>`);
        if (state.cur === 'tide' && align > .97) api.done('spring'); if (state.cur === 'tide' && align < .1) api.done('neap');
      };
      state.tideUpd = upd;
      api.onTick(dt => { if (state.cur !== 'tide') return; earth.rotation.y += dt * .4; if (api.get('tideAuto') && !api.paused) { state.lunarF = ((state.lunarF || 1) + dt * 1.2 - 1) % 29.5 + 1; state.lunar = Math.round(state.lunarF); upd(); } });
    }

    // ===== dòng biển =====
    {
      const g = groups.curr;
      const tex = await earthTexture({ mode: 'natural' });
      const GR = 2; const globe = makeGlobe(api, { radius: GR, texture: tex, lines: [0, 23.45, -23.45] }); g.add(globe);
      const gc = { center: new THREE.Vector3(), radius: GR };
      CURRENTS.forEach(c => {
        const cv = geoCurve(c.pts, GR * 1.012); const col = c.warm ? 0xff5040 : 0x3f9bff;
        const tube = api.tube(cv.getPoints(c.pts.length * 12), .02, col, { opacity: .7 }); globe.add(tube);
        api.flowAlong(cv, { count: c.pts.length * 2, color: c.warm ? 0xffc0b0 : 0xc0e0ff, size: .03, speed: .06, parent: globe });
        const info = { title: c.name, html: `${c.warm ? '<b>Dòng biển nóng</b>: làm tăng nhiệt độ, độ ẩm, gây mưa cho vùng ven bờ nó chảy qua.' : '<b>Dòng biển lạnh</b>: làm giảm nhiệt độ, không khí ven bờ khô, ít mưa; thường hình thành hoang mạc ven biển (VD: A-ta-ca-ma, Na-míp).'}`, id: c.name, onPick: () => { if (c.name.includes('Pê-ru')) api.done('cold'); } };
        api.hotspot(tube, info);
        const mid = c.pts[Math.floor(c.pts.length / 2)];
        api.label(c.name.replace('Dòng biển ', ''), { cls: 'sm ' + (c.warm ? 'warm' : 'cold'), pos: latLonToVec3(mid[0], mid[1], GR * 1.06), parent: globe, globe: gc, onClick: info });
      });
      api.onTick(dt => { if (state.cur === 'curr' && api.get('cspin')) globe.rotation.y += dt * .06; });
    }

    state.show = n => {
      state.cur = n; for (const [k, g] of Object.entries(groups)) g.visible = k === n;
      stars.visible = n !== 'wave'; scene.background = n === 'wave' ? new THREE.Color(0x9fd0f0) : null;
      cw.style.display = n === 'wave' ? '' : 'none'; ct.style.display = n === 'tide' ? '' : 'none'; cc.style.display = n === 'curr' ? '' : 'none';
      api.readout(null); if (n === 'tide') state.tideUpd();
      api.legend(n === 'curr' ? [{ c: '#ff5040', t: 'Dòng biển nóng' }, { c: '#3f9bff', t: 'Dòng biển lạnh' }] : null);
    };
    const base = api.controlsBox;
    const cw = document.createElement('div'); base.append(cw); api.controlsBox = cw; api.heading('Gió');
    api.slider('wind', 'Sức gió', { min: 0, max: 1, step: .01, value: .4, format: v => v < .3 ? 'nhẹ' : v < .7 ? 'vừa' : 'rất mạnh' }, v => { state.wind = v; if (v > .97) api.done('storm'); });
    const ct = document.createElement('div'); base.append(ct); api.controlsBox = ct; api.heading('Mặt Trăng');
    api.slider('lunar', 'Ngày âm lịch', { min: 1, max: 29, step: 1, value: 1, format: v => `ngày ${v}` }, v => { state.lunar = v; state.lunarF = v; if (state.ready) api.set('tideAuto', false); state.tideUpd?.(); });
    api.toggle('tideAuto', 'Tự chạy', false, () => {});
    const cc = document.createElement('div'); base.append(cc); api.controlsBox = cc; api.heading('Tuỳ chọn');
    api.toggle('cspin', 'Xoay quả địa cầu', true, () => {});
    api.controlsBox = base; state.ready = true;
  },
};

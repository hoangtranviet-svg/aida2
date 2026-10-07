// Màn hình đăng nhập: mô hình 3D theo hình nền AIDA 2.0
// Quả địa cầu chấm (Natural Earth 1:50m), Việt Nam và hai quần đảo Hoàng Sa, Trường Sa, 5 tầng khí quyển (độ dày phóng đại),
// hai quỹ đạo: 3 mức độ nhận thức (Biết – Hiểu – Vận dụng) và học liệu 3D – AI.
import { LAND, VN, decode } from './landmask.js';

const R = Math.PI / 180;
const C0 = { lat: 13, lon: 106.5 }; // tâm hình ban đầu

// Tên tầng và độ cao theo SGK Địa lí 10 (KNTT) – thống nhất với mô-đun Bài 9 trong kho học liệu
export const LAYERS = [
  { r: 1.032, name: 'Tầng đối lưu', alt: '0 – 8/16 km', col: '#5ec8ff' },
  { r: 1.062, name: 'Tầng bình lưu', alt: '≈ 16 – 50 km', col: '#7f9cff' },
  { r: 1.090, name: 'Tầng giữa', alt: '≈ 50 – 80 km', col: '#9a7fff' },
  { r: 1.126, name: 'Tầng nhiệt', alt: '≈ 80 – 800 km', col: '#d17fff' },
  { r: 1.172, name: 'Tầng khuếch tán', alt: 'trên 800 km', col: '#a9b4ec' },
];

// Đảo chính của hai quần đảo (toạ độ gần đúng)
const HOANG_SA = [[16.83, 112.34], [16.98, 112.26], [16.67, 112.73], [16.53, 111.61], [16.45, 111.70], [16.46, 111.74], [16.58, 111.68], [15.78, 111.20], [16.05, 111.78], [16.95, 112.33], [16.23, 111.55]];
const TRUONG_SA = [[8.64, 111.92], [11.43, 114.33], [11.45, 114.28], [10.18, 114.36], [10.38, 114.48], [10.38, 114.36], [9.88, 114.33], [11.05, 114.28], [10.68, 114.42], [8.97, 113.69], [7.89, 112.91], [10.83, 115.83], [8.85, 112.6], [9.25, 113.15], [9.72, 114.2], [10.92, 114.06]];

const PLACES = [
  { lat: 21.03, lon: 105.85, text: 'Hà Nội', cls: 'cap', dx: 4, al: 'r' },
  { lat: 16.62, lon: 112.95, text: 'QĐ. Hoàng Sa', cls: 'isl', dx: 8 },
  { lat: 10.05, lon: 116.1, text: 'QĐ. Trường Sa', cls: 'isl', dx: 8 },
  { lat: 13.4, lon: 111.4, text: 'Biển Đông', cls: 'sea', dx: 0 },
];

const ORBITS = [
  { r: 1.36, tilt: [-64, 0, 22], speed: .045, col: 0xbcd0ff, items: [{ t: 'Biết', a: 3.3 }, { t: 'Hiểu', a: 2.55 }, { t: 'Vận dụng', a: 1.25, cls: 'gold' }] },
  { r: 1.58, tilt: [-72, 0, -16], speed: -.032, col: 0x9fb4ff, items: [{ t: 'Học liệu 3D', a: 2.2 }, { t: 'AI', a: 5.35, cls: 'red' }] },
];

const xyz = (lat, lon, r = 1) => [r * Math.cos(lat * R) * Math.sin(lon * R), r * Math.sin(lat * R), r * Math.cos(lat * R) * Math.cos(lon * R)];
const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(1).replace('.', ',').replace(',0', '')}°${v >= 0 ? pos : neg}`;

function dots() {
  const land = decode(LAND), vn = decode(VN);
  const inVN = (lat, lon) => lat > 8 && lat < 23.6 && lon > 102 && lon < 110 && (vn(lat, lon) || vn(lat + .2, lon) || vn(lat - .2, lon) || vn(lat, lon + .2) || vn(lat, lon - .2));
  const P = [], C = [], S = [];
  const add = (lat, lon, col, s) => { P.push(...xyz(lat, lon, 1.002)); C.push(...col); S.push(s); };
  const st = .9;
  for (let lat = -84 + st / 2; lat < 84; lat += st) {
    const n = Math.max(1, Math.round(360 * Math.cos(lat * R) / st));
    for (let i = 0; i < n; i++) { const lon = -180 + (i + .5) * 360 / n; if (land(lat, lon) && !inVN(lat, lon)) add(lat, lon, [.78, .84, 1], .0088); }
  }
  const gold = [1, .78, .25];
  for (let lat = 8.4; lat < 23.5; lat += .26) for (let lon = 102.1; lon < 110; lon += .26) if (vn(lat, lon)) add(lat, lon, gold, .0052);
  for (const [la, lo] of [...HOANG_SA, ...TRUONG_SA]) add(la, lo, gold, .0062);
  return { P, C, S };
}

export async function mountHero(box, { layout, hud } = {}) {
  let THREE;
  try { THREE = await import('three'); } catch (e) { box.classList.add('no3d'); return () => {}; }
  if (!box.isConnected) return () => {};
  const canvas = document.createElement('canvas'); box.prepend(canvas);
  const lay = document.createElement('div'); lay.className = 'h3-labels'; box.append(lay);
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch (e) { box.classList.add('no3d'); return () => {}; }
  const pr = Math.min(devicePixelRatio || 1, 2); renderer.setPixelRatio(pr);
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, .1, 200);

  const tiltG = new THREE.Group(); scene.add(tiltG); // nghiêng theo vĩ độ tâm hình
  const spin = new THREE.Group(); tiltG.add(spin); // quay quanh trục Trái Đất

  // thân cầu
  const body = new THREE.Mesh(new THREE.SphereGeometry(.996, 96, 72), new THREE.ShaderMaterial({
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix*vec4(position,1.); vN = normalize(normalMatrix*normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: `varying vec3 vN; varying vec3 vV; void main(){
      float f = clamp(dot(vN, vV), 0., 1.);
      float l = clamp(dot(vN, normalize(vec3(-.45,.55,.7))), 0., 1.);
      vec3 deep = vec3(.035,.06,.30), mid = vec3(.09,.16,.62);
      vec3 c = mix(deep, mid, pow(f, 1.4)) + vec3(.03,.06,.2)*pow(l,3.);
      c += vec3(.25,.4,1.)*pow(1.-f, 4.)*.9;
      gl_FragColor = vec4(c, 1.); }`,
  }));
  spin.add(body);
  // lưới kinh – vĩ tuyến 15°
  const gpts = [];
  for (let lat = -75; lat <= 75; lat += 15) for (let i = 0; i < 180; i++) { gpts.push(...xyz(lat, i * 2, 1.0015), ...xyz(lat, i * 2 + 2, 1.0015)); }
  for (let lon = 0; lon < 360; lon += 15) for (let i = -88; i < 88; i += 2) { gpts.push(...xyz(i, lon, 1.0015), ...xyz(i + 2, lon, 1.0015)); }
  const grid = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(gpts, 3)), new THREE.LineBasicMaterial({ color: 0x8fa8ff, transparent: true, opacity: .07, depthWrite: false }));
  spin.add(grid);
  // chấm lục địa
  const D = dots();
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.Float32BufferAttribute(D.P, 3));
  pg.setAttribute('color', new THREE.Float32BufferAttribute(D.C, 3));
  pg.setAttribute('size', new THREE.Float32BufferAttribute(D.S, 1));
  const dotMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, uniforms: { uScale: { value: 1 } },
    vertexShader: `attribute float size; attribute vec3 color; uniform float uScale; varying vec3 vC; varying float vA;
      void main(){ vec4 wp = modelMatrix*vec4(position,1.); vec3 n = normalize(wp.xyz); vec3 v = normalize(cameraPosition - wp.xyz);
        float f = dot(n, v); vA = smoothstep(.02, .3, f); vC = color;
        vec4 mv = viewMatrix*wp; gl_PointSize = max(size*uScale/-mv.z, 1.4); gl_Position = projectionMatrix*mv; }`,
    fragmentShader: `varying vec3 vC; varying float vA; void main(){ vec2 p = gl_PointCoord-.5; float d = length(p); if (d > .5) discard; gl_FragColor = vec4(vC, vA*smoothstep(.5,.32,d)*.92); }`,
  });
  spin.add(new THREE.Points(pg, dotMat));

  // tầng khí quyển: vòng bao (đường viền nhìn thấy của mặt cầu bán kính r) + dải màu mờ
  const shellG = new THREE.Group(); scene.add(shellG);
  const shells = LAYERS.map((L, i) => {
    const col = new THREE.Color(L.col);
    const line = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .32 }));
    const band = new THREE.Mesh(new THREE.RingGeometry(1, 1.01, 160, 1), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .07, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    shellG.add(band, line); return { L, line, band, base: [.32, .07], hi: 0 };
  });
  // quầng sáng
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.2, 64, 48), new THREE.ShaderMaterial({ transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 n; void main(){ n = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'varying vec3 n; void main(){ float i = pow(max(.0, .62 - dot(n, vec3(0.,0.,1.))), 2.4); gl_FragColor = vec4(.3,.45,1.,1.)*i*.55; }' }));
  scene.add(halo);

  // quỹ đạo
  const orbG = new THREE.Group(); scene.add(orbG);
  const orbits = ORBITS.map(o => {
    const g = new THREE.Group(); g.rotation.set(o.tilt[0] * R, o.tilt[1] * R, o.tilt[2] * R); orbG.add(g);
    const pts = []; for (let i = 0; i <= 256; i++) { const a = i / 256 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * o.r, Math.sin(a) * o.r, 0)); }
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: o.col, transparent: true, opacity: .26 })));
    return { ...o, g, phase: 0 };
  });
  // sao
  const sp = []; for (let i = 0; i < 900; i++) { const a = Math.random() * Math.PI * 2, z = -20 - Math.random() * 40, d = 6 + Math.random() * 40; sp.push(Math.cos(a) * d, Math.sin(a) * d * .7, z); }
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)), new THREE.PointsMaterial({ color: 0xc9d6ff, size: 1.3, sizeAttenuation: false, transparent: true, opacity: .55 }));
  scene.add(stars);

  // nhãn HTML
  const mk = (cls, html) => { const d = document.createElement('div'); d.className = 'h3-l ' + cls; d.innerHTML = html; lay.append(d); return d; };
  const layerLbl = shells.map((s, i) => { const d = mk('layer', `<i></i><b>${s.L.name}</b><small>${s.L.alt}</small>`); d.style.setProperty('--c', s.L.col);
    d.addEventListener('pointerenter', () => (s.hi = 1)); d.addEventListener('pointerleave', () => (s.hi = 0)); return d; });
  const placeLbl = PLACES.map(p => ({ ...p, el: mk('place ' + p.cls + (p.al ? ' al-' + p.al : ''), p.cls === 'cap' ? `<span>${p.text}</span><i></i>` : `<span>${p.text}</span>`) }));
  const satLbl = orbits.flatMap(o => o.items.map(it => ({ o, it, el: mk('sat ' + (it.cls || ''), `<i></i><span>${it.t}</span>`) })));
  const note = mk('h3-note', 'Độ dày các tầng khí quyển được phóng đại');

  // bố cục
  let W = 0, H = 0, f = 1, Dz = 4, G = { cx: 0, cy: 0, r: 100 }, side = 'left';
  const size = () => {
    W = box.clientWidth; H = box.clientHeight; if (!W || !H) return;
    renderer.setSize(W, H, false);
    G = layout ? layout(W, H) : { cx: W / 2, cy: H / 2, r: Math.min(W, H) * .32 };
    side = G.side || 'left';
    f = (H / 2) / Math.tan(cam.fov / 2 * R);
    Dz = Math.sqrt(1 + (f / G.r) ** 2);
    cam.aspect = W / H; cam.position.set(0, 0, Dz); cam.lookAt(0, 0, 0);
    cam.setViewOffset(W, H, W / 2 - G.cx, H / 2 - G.cy, W, H); cam.updateProjectionMatrix();
    dotMat.uniforms.uScale.value = f * pr;
    shells.forEach(s => {
      const rs = s.L.r * Dz / Math.sqrt(Dz * Dz - s.L.r ** 2), prev = shells.indexOf(s) ? shells[shells.indexOf(s) - 1].L.r : 1;
      const rp = prev * Dz / Math.sqrt(Dz * Dz - prev ** 2);
      const pts = []; for (let i = 0; i < 200; i++) { const a = i / 200 * Math.PI * 2; pts.push(Math.cos(a) * rs, Math.sin(a) * rs, 0); }
      s.line.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); s.line.geometry.computeBoundingSphere();
      s.band.geometry.dispose(); s.band.geometry = new THREE.RingGeometry(rp, rs, 160, 1); s.rpx = f * rs / Dz;
    });
    placeLayers();
  };
  // nhãn tầng khí quyển chạy theo cung tròn, mỗi nhãn nằm ngoài đường viền tầng của nó
  const legend = mk('h3-legend', LAYERS.map(L => `<span style="--c:${L.col}"><i></i>${L.name}</span>`).join(''));
  function placeLayers(tight = false) {
    legend.hidden = !G.legend; layerLbl.forEach(d => (d.hidden = !!G.legend));
    if (G.legend) { legend.style.transform = `translate(0px,${Math.min(H - 34, G.cy + shells[4].rpx + 8).toFixed(0)}px)`; legend.style.width = W + 'px'; note.hidden = true; return; }
    layerLbl.forEach(d => d.classList.toggle('tight', tight));
    const ws = layerLbl.map(d => d.offsetWidth || 90);
    const arcs = ws.map((w, i) => (w + 10) / (shells[i].rpx + 8) / R);
    const total = arcs.reduce((a, b) => a + b, 0);
    const block = G.block || [];
    // thử các góc bắt đầu, chọn vị trí ít chồng lên chữ / thẻ đăng nhập nhất
    const sim = th0 => { let th = th0, hit = 0; const out = [];
      arcs.forEach((a, i) => { const rr = shells[i].rpx + 5;
        for (let k = 0; k <= 4; k++) { const t = (th + a * k / 4) * R, x = G.cx + (rr + 6) * Math.sin(t), y = G.cy - (rr + 6) * Math.cos(t);
          if (x < 4 || y < 4 || x > W - 4) hit += 2; if (block.some(r => x > r.x - 6 && x < r.x + r.w + 6 && y > r.y - 6 && y < r.y + r.h + 6)) hit++; }
        out.push(th); th += a; });
      return { hit, out }; };
    let best = null;
    const cands = []; if (side === 'left') for (let t = -95; t <= 20 - total; t += 1) cands.push(t); else for (let t = 6; t <= 95 - total; t++) cands.push(t);
    if (!cands.length) cands.push(side === 'left' ? -95 : 6);
    for (const t of cands) { const r = sim(t); r.score = r.hit * 100 + Math.abs(t + total / 2 - (side === 'left' ? -30 : 35)); if (!best || r.score < best.score) best = r; }
    if (best.hit && !tight) return placeLayers(true);
    layerLbl.forEach((d, i) => {
      const th = best.out[i], rr = shells[i].rpx + 5, x = G.cx + rr * Math.sin(th * R), y = G.cy - rr * Math.cos(th * R);
      d.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${th.toFixed(2)}deg)`;
    });
    note.style.transform = `translate(${(G.cx - G.r * .5).toFixed(0)}px,${(G.cy + shells[4].rpx + 14).toFixed(0)}px)`;
    note.hidden = G.cy + shells[4].rpx + 30 > H;
  }
  const ro = new ResizeObserver(size); ro.observe(box); addEventListener('resize', size);
  if (document.fonts?.ready) document.fonts.ready.then(() => box.isConnected && placeLayers());

  // tương tác: kéo để xoay, rê chuột tạo thị sai nhẹ
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let drag = null, off = { lon: 0, lat: 0 }, par = { x: 0, y: 0 }, parT = { x: 0, y: 0 };
  canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, lon: off.lon, lat: off.lat }; canvas.setPointerCapture(e.pointerId); box.classList.add('dragging'); });
  canvas.addEventListener('pointermove', e => { if (!drag) return; off.lon = drag.lon - (e.clientX - drag.x) * .25; off.lat = Math.max(-40, Math.min(40, drag.lat + (e.clientY - drag.y) * .2)); });
  const up = () => { drag = null; box.classList.remove('dragging'); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  const onMove = e => { parT = { x: (e.clientX / innerWidth - .5), y: (e.clientY / innerHeight - .5) }; };
  addEventListener('pointermove', onMove);

  const v = new THREE.Vector3(), proj = p => { v.copy(p).project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; };
  let raf = 0, vis = true, t0 = performance.now(), T = 0;
  const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; if (vis && !raf) raf = requestAnimationFrame(loop); }); io.observe(box);
  const wp = new THREE.Vector3();
  function loop(now) {
    raf = 0; if (!box.isConnected) return stop(); if (!vis || document.hidden) { t0 = performance.now(); setTimeout(() => { if (!raf && box.isConnected) raf = requestAnimationFrame(loop); }, 400); return; }
    const dt = Math.min(.05, (now - t0) / 1000); t0 = now; if (!reduce) T += dt;
    if (!drag) { off.lon *= 1 - Math.min(1, dt * .6); off.lat *= 1 - Math.min(1, dt * .6); }
    par.x += (parT.x - par.x) * Math.min(1, dt * 3); par.y += (parT.y - par.y) * Math.min(1, dt * 3);
    const lon = C0.lon + 16 * Math.sin(T * .09) + off.lon, lat = C0.lat + off.lat + par.y * 3;
    spin.rotation.y = -(lon + par.x * 4) * R; tiltG.rotation.x = lat * R;
    orbG.rotation.set(par.y * .06, par.x * .08, 0);
    orbits.forEach(o => (o.phase = T * o.speed));
    shells.forEach(s => { const k = s.hi ? 1 : 0; s.line.material.opacity += ((k ? .9 : s.base[0]) - s.line.material.opacity) * .2; s.band.material.opacity += ((k ? .22 : s.base[1]) - s.band.material.opacity) * .2; });
    stars.rotation.z = T * .004;
    renderer.render(scene, cam);
    // nhãn trên bề mặt
    scene.updateMatrixWorld();
    for (const p of placeLbl) {
      wp.set(...xyz(p.lat, p.lon, 1.003)).applyMatrix4(spin.matrixWorld);
      const facing = wp.clone().normalize().dot(cam.position.clone().sub(wp).normalize());
      const [x, y] = proj(wp); p.el.style.transform = `translate(${(x + p.dx).toFixed(1)}px,${y.toFixed(1)}px)`; p.el.style.opacity = Math.max(0, Math.min(1, (facing - .15) * 5)).toFixed(2);
    }
    for (const s of satLbl) {
      const a = s.it.a + s.o.phase; wp.set(Math.cos(a) * s.o.r, Math.sin(a) * s.o.r, 0).applyMatrix4(s.o.g.matrixWorld);
      const [x, y] = proj(wp), dc = Math.hypot(x - G.cx, y - G.cy);
      const hidden = wp.z < 0 && dc < G.r * 1.02;
      const under = (G.avoid || []).some(r => x > r.x - 20 && x < r.x + r.w && y > r.y - 12 && y < r.y + r.h + 12);
      s.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; s.el.style.opacity = hidden ? 0 : under ? .16 : wp.z < 0 ? .55 : 1;
      s.el.style.zIndex = wp.z < 0 ? 0 : 2;
    }
    if (hud) hud(`${fmt(lat, 'B', 'N')} · ${fmt(((lon + 540) % 360) - 180, 'Đ', 'T')}`);
    raf = requestAnimationFrame(loop);
  }
  size(); raf = requestAnimationFrame(loop);
  function stop() { cancelAnimationFrame(raf); raf = 0; ro.disconnect(); io.disconnect(); removeEventListener('resize', size); removeEventListener('pointermove', onMove); renderer.dispose(); }
  return stop;
}

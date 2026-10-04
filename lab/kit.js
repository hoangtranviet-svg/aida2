// Bộ dựng hình dùng chung cho các mô-đun Địa lí kinh tế – xã hội (Bài 1, 21 – 40):
// cảnh mô hình thu nhỏ (diorama), biểu đồ 3D, quả địa cầu có ghim và cung nối.
import { THREE, makeGlobe, latLonToVec3, starfield } from './core.js';
import { earthTexture } from './earth.js';

export { THREE, latLonToVec3 };
export const vec = (x, y, z) => new THREE.Vector3(x, y, z);
export const fmtN = (v, d = 1) => Number(v).toLocaleString('vi-VN', { maximumFractionDigits: d, minimumFractionDigits: 0 });

// ---------- vật liệu (dùng lại để nhẹ) ----------
const MATS = new Map();
export function mat(color, o = {}) {
  const k = color + JSON.stringify(o);
  if (!o.unique && MATS.has(k)) return MATS.get(k);
  const m = o.basic ? new THREE.MeshBasicMaterial({ color, transparent: !!o.opacity, opacity: o.opacity ?? 1 })
    : new THREE.MeshStandardMaterial({ color, roughness: o.rough ?? .8, metalness: o.metal ?? 0, transparent: !!o.opacity, opacity: o.opacity ?? 1, emissive: o.emissive ?? 0x000000, flatShading: !!o.flat });
  if (!o.unique) MATS.set(k, m); return m;
}
export function mesh(geo, color, pos, o = {}) { const m = new THREE.Mesh(geo, o.material || mat(color, o)); if (pos) m.position.set(...pos); m.castShadow = false; return m; }
export const boxM = (w, h, d, color, pos, o) => mesh(new THREE.BoxGeometry(w, h, d), color, pos, o);
export const cylM = (rt, rb, h, color, pos, o = {}) => mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 16), color, pos, o);

// ---------- ánh sáng, nền ----------
export function stage(api, { bg = 0x10202f, sky = false, grid = false, hemi = 1.1, sun = 1.7 } = {}) {
  const { scene } = api;
  scene.background = new THREE.Color(bg);
  if (sky) scene.fog = new THREE.Fog(bg, 40, 90);
  scene.add(new THREE.HemisphereLight(0xe6f2ff, 0x2a3a2a, hemi));
  const s = new THREE.DirectionalLight(0xfff4e0, sun); s.position.set(6, 12, 8); scene.add(s);
  if (grid) { const g = new THREE.GridHelper(grid, grid, 0x31506a, 0x1c3446); g.position.y = -.01; scene.add(g); }
  return s;
}
// nền đảo/miếng đất có viền
export function island(w = 22, d = 14, { color = 0x6fa257, side = 0x8a6a45, h = .6 } = {}) {
  const g = new THREE.Group();
  g.add(boxM(w, h, d, side, [0, -h / 2 - .02, 0]));
  g.add(boxM(w, .04, d, color, [0, 0, 0]));
  return g;
}

// ---------- vật thể mô hình ----------
export function tree({ h = .9, color = 0x2f7d3a, kind = 'round' } = {}) {
  const g = new THREE.Group();
  g.add(cylM(.05, .07, h * .45, 0x6b4a2b, [0, h * .225, 0], { seg: 6 }));
  if (kind === 'cone') g.add(mesh(new THREE.ConeGeometry(h * .3, h * .75, 7), color, [0, h * .75, 0], { flat: true }));
  else if (kind === 'palm') { for (let i = 0; i < 5; i++) { const l = boxM(.5, .03, .12, 0x3f9a45, [0, h * .48, 0]); l.rotation.y = i * 1.25; l.rotation.z = -.35; l.position.x = Math.cos(i * 1.25) * .2; l.position.z = -Math.sin(i * 1.25) * .2; g.add(l); } }
  else g.add(mesh(new THREE.IcosahedronGeometry(h * .32, 0), color, [0, h * .65, 0], { flat: true }));
  return g;
}
export function forest(n, w, d, opt = {}) {
  const g = new THREE.Group(); const rnd = rng(opt.seed || 7);
  for (let i = 0; i < n; i++) { const t = tree({ h: (opt.h || .9) * (.75 + rnd() * .5), color: opt.color || [0x2f7d3a, 0x3c8f44, 0x276b33][i % 3], kind: opt.kind }); t.position.set((rnd() - .5) * w, 0, (rnd() - .5) * d); g.add(t); }
  return g;
}
export function house({ w = .7, h = .5, d = .6, wall = 0xf1e3c8, roof = 0xb5523a } = {}) {
  const g = new THREE.Group(); g.add(boxM(w, h, d, wall, [0, h / 2, 0]));
  const r = mesh(new THREE.ConeGeometry(Math.max(w, d) * .78, h * .6, 4), roof, [0, h + h * .3, 0], { flat: true }); r.rotation.y = Math.PI / 4; g.add(r);
  return g;
}
export function building({ w = .9, h = 2, d = .9, color = 0x9fb7c9, win = 0xffe9a6 } = {}) {
  const g = new THREE.Group(); g.add(boxM(w, h, d, color, [0, h / 2, 0], { rough: .5, metal: .1 }));
  const rows = Math.max(1, Math.floor(h / .35));
  for (let r = 0; r < rows; r++) for (const s of [-1, 1]) { const wv = boxM(w * .7, .08, .02, win, [0, .25 + r * .35, s * (d / 2 + .011)], { basic: true }); g.add(wv); }
  return g;
}
export function factory(api, { color = 0x8d99a6, roof = 0x5d6875, chimneys = 2, smoke = true, smokeColor = 0x8e8e8e } = {}) {
  const g = new THREE.Group();
  g.add(boxM(2, .9, 1.2, color, [0, .45, 0]));
  for (let i = 0; i < 3; i++) { const r = mesh(new THREE.CylinderGeometry(.3, .3, 1.2, 3, 1, false, 0, Math.PI), roof, [-.66 + i * .66, .9, 0]); r.rotation.x = Math.PI / 2; r.rotation.y = Math.PI / 2; r.scale.set(1, 1, 1); g.add(r); }
  const em = [];
  for (let i = 0; i < chimneys; i++) { const x = .55 + i * .35; g.add(cylM(.09, .12, 1.6, 0xb04a3a, [x, .8 + .0, -.35])); g.add(cylM(.1, .1, .1, 0xeeeeee, [x, 1.3, -.35])); if (smoke) em.push(emitter(api, g, vec(x, 1.65, -.35), { color: smokeColor })); }
  g.userData.smoke = em;
  g.userData.setSmoke = k => em.forEach(e => e.rate(k));
  return g;
}
// khói/hơi bốc lên: hạt cầu mờ tái sử dụng
export function emitter(api, parent, pos, { color = 0x9a9a9a, n = 14, rise = .9, spread = .25, size = .16 } = {}) {
  const parts = []; let k = 1;
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(size, 8, 6), new THREE.MeshStandardMaterial({ color, transparent: true, opacity: .5, depthWrite: false, roughness: 1 }));
    m.userData.t = i / n; parent.add(m); parts.push(m);
  }
  api.onTick(dt => {
    parts.forEach((m, i) => {
      m.userData.t += dt * .35; if (m.userData.t > 1) m.userData.t -= 1;
      const t = m.userData.t; m.visible = k > .02 && (i / n) < k + .05;
      m.position.set(pos.x + Math.sin(i * 7.1) * spread * t, pos.y + t * rise * 2, pos.z + Math.cos(i * 3.3) * spread * t);
      const s = (.5 + t * 1.6) * (.6 + k * .6); m.scale.setScalar(s); m.material.opacity = (1 - t) * .55 * Math.min(1, k * 1.5);
    });
  });
  return { rate: v => { k = v; } };
}
export function turbine(api, { h = 2.2, speed = 1.6 } = {}) {
  const g = new THREE.Group(); g.add(cylM(.04, .07, h, 0xf2f4f6, [0, h / 2, 0]));
  const hub = new THREE.Group(); hub.position.set(0, h, .08); g.add(hub);
  hub.add(cylM(.07, .07, .14, 0xffffff, [0, 0, 0]).rotateX(Math.PI / 2));
  for (let i = 0; i < 3; i++) { const b = boxM(.08, .9, .02, 0xffffff, [0, .45, 0]); const p = new THREE.Group(); p.add(b); p.rotation.z = i * Math.PI * 2 / 3; hub.add(p); }
  let sp = speed; api.onTick(dt => { hub.rotation.z -= dt * sp; });
  g.userData.setSpeed = v => { sp = v; };
  return g;
}
export function solar({ rows = 2, cols = 3 } = {}) {
  const g = new THREE.Group();
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const p = boxM(.7, .03, .45, 0x1d3f7a, [c * .8 - (cols - 1) * .4, .35, r * .7 - (rows - 1) * .35], { rough: .3, metal: .4 }); p.rotation.x = -.5; g.add(p);
    g.add(cylM(.02, .02, .35, 0x9aa5ae, [c * .8 - (cols - 1) * .4, .17, r * .7 - (rows - 1) * .35]));
  }
  return g;
}
export function ship({ color = 0xc0392b, cargo = true, len = 2.4 } = {}) {
  const g = new THREE.Group();
  const hull = boxM(len, .3, .6, color, [0, .15, 0]); g.add(hull);
  const bow = mesh(new THREE.ConeGeometry(.3, .5, 4), color, [len / 2 + .2, .15, 0]); bow.rotation.z = -Math.PI / 2; bow.rotation.x = Math.PI / 4; g.add(bow);
  g.add(boxM(.4, .45, .5, 0xf2f2f2, [-len / 2 + .3, .52, 0]));
  if (cargo) { const cs = [0x2e86de, 0xe67e22, 0x27ae60, 0xf1c40f]; for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) g.add(boxM(.36, .2, .24, cs[(i + j) % 4], [-.2 + i * .38, .41 + j * .0, j ? .13 : -.13])); }
  return g;
}
export function boat({ color = 0x2e86de } = {}) {
  const g = new THREE.Group(); g.add(boxM(.8, .16, .3, color, [0, .08, 0])); g.add(boxM(.2, .2, .2, 0xffffff, [-.15, .26, 0])); g.add(cylM(.01, .01, .6, 0x6b4a2b, [.15, .45, 0])); return g;
}
export function truck({ color = 0xe67e22 } = {}) {
  const g = new THREE.Group(); g.add(boxM(.7, .32, .32, color, [-.1, .26, 0])); g.add(boxM(.24, .26, .3, 0x34495e, [.38, .23, 0]));
  for (const x of [-.3, .1, .38]) for (const z of [-.16, .16]) g.add(cylM(.07, .07, .05, 0x222222, [x, .07, z]).rotateX(Math.PI / 2));
  return g;
}
export function plane({ color = 0xffffff } = {}) {
  const g = new THREE.Group(); g.add(cylM(.06, .05, .9, color, [0, 0, 0]).rotateZ(Math.PI / 2));
  g.add(boxM(.22, .02, 1, color, [0, 0, 0])); g.add(boxM(.12, .2, .02, 0xd35400, [-.4, .1, 0])); return g;
}
export function person({ color = 0x3498db, skin = 0xf0c8a0 } = {}) {
  const g = new THREE.Group(); g.add(cylM(.07, .09, .3, color, [0, .15, 0], { seg: 8 })); g.add(mesh(new THREE.SphereGeometry(.07, 10, 8), skin, [0, .37, 0])); return g;
}
export function crowd(n, w, d, opt = {}) { const g = new THREE.Group(); const r = rng(opt.seed || 3); const cs = opt.colors || [0x3498db, 0xe74c3c, 0x2ecc71, 0xf1c40f, 0x9b59b6]; for (let i = 0; i < n; i++) { const p = person({ color: cs[i % cs.length] }); p.position.set((r() - .5) * w, 0, (r() - .5) * d); g.add(p); } return g; }
export function cow({ color = 0xffffff, spot = 0x333333 } = {}) {
  const g = new THREE.Group(); g.add(boxM(.42, .2, .2, color, [0, .26, 0])); g.add(boxM(.14, .14, .14, color, [.26, .32, 0])); g.add(boxM(.12, .04, .21, spot, [-.05, .37, 0]));
  for (const x of [-.15, .15]) for (const z of [-.07, .07]) g.add(boxM(.05, .16, .05, color, [x, .08, z])); return g;
}
export function field(w, d, { color = 0x9cc34a, row = 0x6f9a2a, n = 6, rot = 0 } = {}) {
  const g = new THREE.Group(); g.add(boxM(w, .05, d, 0x8b6b3e, [0, .02, 0]));
  const rows = []; for (let i = 0; i < n; i++) { const r = boxM(w * .92, .12, d / n * .5, i % 2 ? color : row, [0, .1, -d / 2 + (i + .5) * d / n]); g.add(r); rows.push(r); }
  g.rotation.y = rot; g.userData.rows = rows;
  g.userData.grow = k => rows.forEach(r => { r.scale.y = Math.max(.05, k); r.position.y = .05 + .06 * Math.max(.05, k); });
  g.userData.tint = c => rows.forEach((r, i) => { r.material = mat(i % 2 ? c : new THREE.Color(c).multiplyScalar(.8).getHex()); });
  return g;
}
export function water(w, d, { color = 0x3a86c8, y = .01 } = {}) { return boxM(w, .04, d, color, [0, y, 0], { rough: .2, metal: .1, opacity: .9 }); }
export function road(len, { w = .5, color = 0x3d4248, rot = 0 } = {}) { const g = new THREE.Group(); g.add(boxM(len, .03, w, color, [0, .03, 0])); for (let i = 0; i < len / .6; i++) g.add(boxM(.25, .035, .04, 0xf0f0f0, [-len / 2 + .3 + i * .6, .035, 0], { basic: true })); g.rotation.y = rot; return g; }
export function tower({ h = 2.4 } = {}) { // cột ăng-ten viễn thông
  const g = new THREE.Group(); const pts = [];
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; pts.push([Math.cos(a) * .25, Math.sin(a) * .25]); }
  pts.forEach(([x, z]) => { const l = cylM(.02, .02, h, 0xd8dde2, [x / 2, h / 2, z / 2]); l.rotation.z = -x * .2; l.rotation.x = z * .2; g.add(l); });
  for (let i = 1; i < 6; i++) g.add(boxM(.3 - i * .04, .02, .3 - i * .04, 0xc0392b, [0, i * h / 6, 0]));
  g.add(boxM(.08, .3, .05, 0xffffff, [.06, h * .85, 0])); g.add(boxM(.08, .3, .05, 0xffffff, [-.06, h * .85, 0]));
  return g;
}
export function container({ color = 0x2e86de } = {}) { return boxM(.6, .26, .26, color, [0, .13, 0]); }
export function crane() { const g = new THREE.Group(); g.add(boxM(.12, 2.2, .12, 0xf39c12, [0, 1.1, 0])); g.add(boxM(1.8, .1, .1, 0xf39c12, [.5, 2.2, 0])); g.add(cylM(.01, .01, .9, 0x333333, [1.2, 1.75, 0])); return g; }
export function mine() { // mỏ lộ thiên dạng bậc
  const g = new THREE.Group(); [1.2, .95, .7, .45].forEach((r, i) => g.add(cylM(r, r, .12, [0x8d6e4f, 0x7a5d41, 0x6b5038, 0x5a432f][i], [0, -.06 - i * .12, 0], { seg: 18 })));
  return g;
}
export function flag(color = 0xda251d) { const g = new THREE.Group(); g.add(cylM(.015, .015, .8, 0xdddddd, [0, .4, 0])); g.add(boxM(.3, .18, .01, color, [.15, .7, 0])); return g; }

// ---------- biểu đồ 3D ----------
// cột: rows = [{t, v:[...]}], series = [{t, c}]; trả về {group, bars, set(rows)}
export function bars(api, { rows, series, scale = 1, gap = 1.3, w = .5, depth = .5, x0 = null, unit = '', fmt = v => fmtN(v), parent = api.scene, info = null, labels = true, axisMax = null, axisStep = null } = {}) {
  const g = new THREE.Group(); parent.add(g); const ns = series.length; const W = rows.length * gap;
  const startX = x0 ?? -W / 2 + gap / 2; const out = [];
  if (axisMax) for (let v = 0; v <= axisMax + 1e-9; v += axisStep) { const y = v * scale; g.add(boxM(W + .4, .01, .01, 0x3d5d77, [startX - gap / 2 + W / 2, y, -depth], { basic: true })); api.label(fmt(v), { cls: 'sm plain', pos: vec(startX - gap / 2 - .45, y, -depth), parent: g }); }
  rows.forEach((r, i) => {
    const cx = startX + i * gap; out[i] = [];
    series.forEach((s, j) => {
      const m = boxM(w, 1, depth, s.c, null, { unique: true, rough: .5 }); m.position.set(cx + (j - (ns - 1) / 2) * w * 1.05, 0, 0); g.add(m); out[i][j] = m;
      m.userData.v = r.v[j];
      api.hotspot(m, () => (info ? info(r, s, i, j) : { title: `${r.t} – ${s.t}`, html: `<b>${fmt(m.userData.v)}</b> ${unit}` }));
    });
    if (labels) api.label(r.t, { cls: 'sm plain', pos: vec(cx, -.3, depth / 2 + .2), parent: g });
  });
  const set = (rs, anim = true) => rs.forEach((r, i) => r.v.forEach((v, j) => { const m = out[i]?.[j]; if (!m) return; m.userData.v = v; m.userData.h = Math.max(v * scale, .002); if (!anim) apply(m, 1); }));
  const apply = (m, k) => { const cur = m.scale.y; const h = cur + (m.userData.h - cur) * k; m.scale.y = h; m.position.y = h / 2; };
  api.onTick(dt => out.flat().forEach(m => apply(m, Math.min(1, dt * 5))));
  set(rows, false);
  return { group: g, bars: out, set };
}
// cột chồng (cơ cấu %): parts = [{t, v, c}] → khối trụ xếp chồng; trả về {group, set(parts)}
export function stack(api, { parts, h = 4, r = .7, parent = api.scene, pos = [0, 0, 0], title = '', info = null, round = true } = {}) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g); const segs = [];
  parts.forEach((p, i) => { const m = round ? cylM(r, r, 1, p.c, null, { unique: true, seg: 32 }) : boxM(r * 2, 1, r * 2, p.c, null, { unique: true }); g.add(m); segs.push(m); api.hotspot(m, () => (info ? info(m.userData.p, i) : { title: m.userData.p.t, html: `<b>${fmtN(m.userData.p.v)}%</b>` })); });
  const lbl = title ? api.label(title, { cls: 'sm', pos: vec(0, h + .45, 0), parent: g }) : null;
  const tags = parts.map(() => api.label('', { cls: 'sm plain', pos: vec(r + .15, 0, r), parent: g }));
  const target = []; const set = ps => { const tot = ps.reduce((a, p) => a + p.v, 0) || 1; let y = 0; ps.forEach((p, i) => { const hh = p.v / tot * h; segs[i].userData.p = p; target[i] = { y: y + hh / 2, h: Math.max(hh, .001) }; tags[i].element.textContent = p.v >= 3 ? fmtN(p.v) + '%' : ''; y += hh; }); };
  api.onTick(dt => segs.forEach((m, i) => { const t = target[i]; if (!t) return; const k = Math.min(1, dt * 5); m.scale.y += (t.h - m.scale.y) * k; m.position.y += (t.y - m.position.y) * k; tags[i].position.set(r + .2, m.position.y, r * .7); }));
  set(parts); segs.forEach((m, i) => { m.scale.y = target[i].h; m.position.y = target[i].y; });
  return { group: g, segs, set, label: lbl };
}
// biểu đồ tròn/vành khuyên nổi: parts [{t,v,c}]
export function donut(api, { parts, r = 2, r0 = .9, h = .5, parent = api.scene, pos = [0, 0, 0], info = null, pop = .15 } = {}) {
  const g = new THREE.Group(); g.position.set(...pos); parent.add(g); let segs = [];
  const build = ps => {
    segs.forEach(s => g.remove(s)); segs = [];
    const tot = ps.reduce((a, p) => a + p.v, 0) || 1; let a0 = Math.PI / 2;
    ps.forEach((p, i) => {
      const da = p.v / tot * Math.PI * 2; if (da <= 0) return;
      const sh = new THREE.Shape(); sh.absarc(0, 0, r, a0, a0 - da, true); sh.absarc(0, 0, r0, a0 - da, a0, false);
      const m = mesh(new THREE.ExtrudeGeometry(sh, { depth: h + i * .0, bevelEnabled: false, curveSegments: 48 }), p.c, null, { unique: true, rough: .5 });
      m.rotation.x = -Math.PI / 2; const mid = a0 - da / 2; m.userData.dir = [Math.cos(mid), -Math.sin(mid)]; m.userData.p = p;
      g.add(m); segs.push(m); api.hotspot(m, () => (info ? info(p, i) : { title: p.t, html: `<b>${fmtN(p.v / tot * 100)}%</b>` }));
      a0 -= da;
    });
  };
  build(parts);
  return { group: g, get segs() { return segs; }, set: build, popOut: i => segs.forEach((m, k) => { const d = k === i ? pop : 0; m.position.set(m.userData.dir[0] * d, 0, m.userData.dir[1] * d); }) };
}

// ---------- quả địa cầu ----------
export async function globe(api, { mode = 'plain', radius = 2, spin = true, stars = true, lines = [] } = {}) {
  const { scene, state } = api;
  if (stars) starfield(scene);
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 6, 10); scene.add(key);
  const tex = await earthTexture({ mode });
  const gc = { center: new THREE.Vector3(), radius };
  const G = makeGlobe(api, { radius, texture: tex, lines, gc }); scene.add(G);
  let lock = false, lt = 0, spinOn = spin;
  const faceLon = (L, lat = 0) => { lock = true; G.userData.target = -Math.PI / 2 - L * Math.PI / 180; clearTimeout(lt); lt = setTimeout(() => (lock = false), 8000); };
  api.onTick(dt => {
    if (G.userData.target != null) { let d = G.userData.target - G.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); G.rotation.y += d * Math.min(1, dt * 3); if (Math.abs(d) < .002) G.userData.target = null; }
    else if (!lock && spinOn) G.rotation.y += dt * .05;
  });
  const pin = (lat, lon, { h = .3, color = 0xffc23d, r = .025, label = null, cls = 'sm', info = null, parent = G } = {}) => {
    const p = latLonToVec3(lat, lon, radius); const dir = p.clone().normalize();
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 10), new THREE.MeshStandardMaterial({ color, emissive: new THREE.Color(color).multiplyScalar(.25) }));
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir); parent.add(m);
    const setH = hh => { m.scale.y = Math.max(hh, .01); m.position.copy(p.clone().add(dir.clone().multiplyScalar(hh / 2))); if (m.userData.lbl) m.userData.lbl.position.copy(p.clone().add(dir.clone().multiplyScalar(hh + .1))); };
    if (label) m.userData.lbl = api.label(label, { cls, pos: p.clone().add(dir.clone().multiplyScalar(h + .1)), parent, globe: gc, onClick: info || undefined });
    setH(h); m.userData.setH = setH;
    if (info) api.hotspot(m, info);
    return m;
  };
  const dot = (lat, lon, { color = 0xff5a5a, size = .045, info = null, parent = G } = {}) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(size, 12, 10), new THREE.MeshStandardMaterial({ color, emissive: new THREE.Color(color).multiplyScalar(.35) }));
    m.position.copy(latLonToVec3(lat, lon, radius * 1.005)); parent.add(m); if (info) api.hotspot(m, info); return m;
  };
  // cung nối hai điểm (đường bay, tuyến hàng hải, dòng thương mại)
  const arc = (a, b, { color = 0x8fd3ff, lift = .35, width = .008, flow = 0, parent = G, sea = false } = {}) => {
    const va = latLonToVec3(a[0], a[1], radius), vb = latLonToVec3(b[0], b[1], radius); const pts = [];
    for (let i = 0; i <= 48; i++) { const t = i / 48; const v = va.clone().lerp(vb, t).normalize(); const hgt = sea ? .012 : Math.sin(Math.PI * t) * lift * va.distanceTo(vb) / (2 * radius); pts.push(v.multiplyScalar(radius * (1.004 + hgt))); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, width, 6, false), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .85 })); parent.add(tube);
    if (flow) tube.userData.flow = api.flowAlong(curve, { count: flow, color, size: width * 2.6, speed: .12, parent });
    tube.userData.curve = curve; return tube;
  };
  // đường đi qua nhiều điểm (tuyến hàng hải bám mặt biển)
  const path = (pairs, { color = 0x8fd3ff, width = .008, flow = 0, parent = G, h = .012 } = {}) => {
    const pts = []; for (let i = 0; i < pairs.length - 1; i++) { const a = latLonToVec3(...pairs[i], 1), b = latLonToVec3(...pairs[i + 1], 1); for (let k = 0; k < 10; k++) pts.push(a.clone().lerp(b, k / 10).normalize().multiplyScalar(radius * (1 + h))); }
    pts.push(latLonToVec3(...pairs[pairs.length - 1], radius * (1 + h)));
    const curve = new THREE.CatmullRomCurve3(pts);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, pts.length * 3, width, 6, false), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: .85 })); parent.add(tube);
    if (flow) tube.userData.flow = api.flowAlong(curve, { count: flow, color, size: width * 2.6, speed: .05, parent });
    return tube;
  };
  state.faceLon = faceLon;
  return { G, gc, radius, faceLon, pin, dot, arc, path, setSpin: v => { spinOn = v; } };
}

// ---------- tiện ích ----------
export function rng(seed = 1) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
export function pulse(api, obj, { color = 0xffd36b } = {}) { // nhấp nháy viền sáng để gợi ý bấm
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.5, .03, 8, 32), new THREE.MeshBasicMaterial({ color, transparent: true })); ring.rotation.x = Math.PI / 2; obj.add(ring);
  api.onTick((dt, t) => { const k = (t * .8) % 1; ring.scale.setScalar(.6 + k * 1.2); ring.material.opacity = 1 - k; });
  return ring;
}
// đặt vật thể + hotspot + nhãn trong một lệnh
export function place(api, parent, obj, pos, { info = null, label = null, cls = 'sm', ly = 1.4, rot = 0, scale = 1 } = {}) {
  obj.position.set(...pos); obj.rotation.y = rot; obj.scale.setScalar(scale); parent.add(obj);
  if (info) api.hotspot(obj, info);
  if (label) obj.userData.lbl = api.label(label, { cls, pos: vec(pos[0], pos[1] + ly, pos[2]), parent, onClick: info || undefined });
  return obj;
}
// tập hợp nhiệm vụ "bấm đủ N mục"
export function collector(api, taskId, need) { const s = new Set(); return id => { s.add(id); if (s.size >= need) api.done(taskId); return s.size; }; }

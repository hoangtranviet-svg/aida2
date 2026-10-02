// AIDA 2.0 – Phòng thí nghiệm 3D: bộ khung dùng chung cho mọi mô-đun
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
export { THREE };

// Nhãn HTML gắn vào vật thể 3D (tự viết, thay cho CSS2DRenderer)
class Label2D extends THREE.Object3D {
  constructor(element) { super(); this.element = element; this.isLabel2D = true; }
}

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, attrs = {}, html = '') => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v);
  }
  if (html) e.innerHTML = html;
  return e;
};
const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const DEG = Math.PI / 180;
export function latLonToVec3(lat, lon, r = 1) {
  const phi = (90 - lat) * DEG, th = (lon + 180) * DEG;
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
}

export async function runLab(def) {
  const params = new URLSearchParams(location.search);
  const embedded = window.parent !== window || params.has('embed');
  document.title = `${def.id} · ${def.title}`;

  // ---------- khung giao diện ----------
  $('#bar .code').textContent = `${def.code} · ${def.id}`;
  $('#bar h1').textContent = def.title;
  if (embedded) $('#bar .back').style.display = 'none';
  const objs = $('#objs');
  (def.objectives || []).forEach(o => objs.append(el('span', { class: 'obj', title: o.t || '' }, o.c || o)));

  const stage = $('#stage'), wrap = $('#canvas-wrap'), layer = $('#label-layer');
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  wrap.append(renderer.domElement);

  const state2d = { w: 1, h: 1 };
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 5000);
  camera.position.set(0, 0, 4);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h); state2d.w = w; state2d.h = h;
    camera.aspect = w / Math.max(h, 1); camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage); resize();

  // ---------- theo dõi hành vi (gửi về web chính) ----------
  const session = { start: Date.now(), events: 0 };
  function track(type, payload = {}) {
    session.events++;
    const msg = { source: 'aida-lab', module: def.code, lab: def.id, type, payload, ts: Date.now() };
    try { if (window.parent !== window) window.parent.postMessage(msg, '*'); } catch (e) { /* bỏ qua */ }
    window.dispatchEvent(new CustomEvent('aida', { detail: msg }));
  }

  // ---------- tiện ích ----------
  const tickers = [];
  const labels = [];
  let labelsOn = true;
  const api = {
    THREE, scene, camera, controls, renderer, state: {}, def, track, DEG, latLonToVec3,
    onTick(fn) { tickers.push(fn); return fn; },
    label(text, opts = {}) {
      const d = el('div', { class: 'lbl ' + (opts.cls || '') }, text);
      d.style.position = 'absolute'; d.style.left = '0'; d.style.top = '0'; layer.append(d);
      const o = new Label2D(d);
      if (opts.pos) o.position.copy(opts.pos);
      o.userData.globe = opts.globe || null; // {center, radius} để ẩn nhãn ở mặt sau quả cầu
      if (opts.onClick) {
        d.style.pointerEvents = 'auto'; d.style.cursor = 'pointer'; d.classList.add('click');
        d.addEventListener('click', ev => {
          ev.stopPropagation();
          const info = typeof opts.onClick === 'function' ? opts.onClick() : opts.onClick;
          if (!info) return;
          api.showInfo(info.title, info.html || ''); track('hotspot', { id: info.id || info.title });
          info.onPick?.(api);
        });
      }
      (opts.parent || scene).add(o);
      labels.push(o);
      return o;
    },
    setLabelText(o, html) { o.element.innerHTML = html; },
    fly(pos, target, ms = 1200) {
      const p0 = camera.position.clone(), t0 = controls.target.clone();
      const p1 = pos.clone ? pos.clone() : new THREE.Vector3(...pos);
      const t1 = target ? (target.clone ? target.clone() : new THREE.Vector3(...target)) : t0.clone();
      flight = { p0, t0, p1, t1, ms, s: performance.now() };
    },
    hotspot(obj, info) { hotspots.push({ obj, info }); obj.userData.hotspot = info; },
    showInfo(title, html) {
      const box = $('#info'); box.innerHTML = `<button class="x" aria-label="Đóng">×</button><h3>${title}</h3><div>${html}</div>`;
      box.style.display = 'block'; $('.x', box).onclick = () => (box.style.display = 'none');
    },
    hideInfo() { $('#info').style.display = 'none'; },
    readout(html) { const r = $('#readout'); if (!html) { r.style.display = 'none'; return; } r.innerHTML = html; r.style.display = 'block'; },
    legend(items) {
      const L = $('#legend'); if (!items || !items.length) { L.style.display = 'none'; return; }
      L.innerHTML = items.map(i => `<div><i style="background:${i.c}"></i>${i.t}</div>`).join(''); L.style.display = 'block';
    },
    toast(t) { const T = $('#toast'); T.textContent = t; T.classList.add('show'); clearTimeout(T._t); T._t = setTimeout(() => T.classList.remove('show'), 2600); },
    // điều khiển
    controlsBox: null,
    toggle(id, text, value, cb) {
      const w = el('div', { class: 'ctl' });
      const lab = el('label', { class: 'sw' }); const inp = el('input', { type: 'checkbox' }); inp.checked = value;
      lab.append(inp, document.createTextNode(text)); w.append(lab); api.controlsBox.append(w);
      const set = (v, silent) => { inp.checked = v; cb(v); if (!silent) track('control', { id, value: v }); };
      inp.addEventListener('change', () => set(inp.checked));
      ctrls[id] = { set: v => set(v, true), get: () => inp.checked };
      cb(value); return ctrls[id];
    },
    slider(id, text, o, cb) {
      const w = el('div', { class: 'ctl' });
      const vEl = el('span'); const lab = el('label', {}, `<span>${text}</span>`); lab.append(vEl);
      const inp = el('input', { type: 'range', min: o.min, max: o.max, step: o.step || 1 }); inp.value = o.value;
      w.append(lab, inp); api.controlsBox.append(w);
      const fmt = o.format || (v => v);
      const apply = v => { vEl.textContent = fmt(+v); cb(+v); };
      let tm; inp.addEventListener('input', () => { apply(inp.value); clearTimeout(tm); tm = setTimeout(() => track('control', { id, value: +inp.value }), 400); });
      ctrls[id] = { set: v => { inp.value = v; apply(v); }, get: () => +inp.value, input: inp };
      apply(o.value); return ctrls[id];
    },
    choice(id, text, options, value, cb) {
      const w = el('div', { class: 'ctl' }); if (text) w.append(el('label', {}, `<span>${text}</span>`));
      const seg = el('div', { class: 'seg' });
      const btns = options.map(op => { const b = el('button', { type: 'button' }, op.t); b.dataset.v = op.v; seg.append(b); return b; });
      w.append(seg); api.controlsBox.append(w);
      const set = (v, silent) => { btns.forEach(b => b.classList.toggle('on', b.dataset.v == v)); cb(v); if (!silent) track('control', { id, value: v }); };
      btns.forEach(b => b.addEventListener('click', () => set(b.dataset.v)));
      ctrls[id] = { set: v => set(v, true), get: () => btns.find(b => b.classList.contains('on'))?.dataset.v };
      set(value, true); return ctrls[id];
    },
    heading(t) { api.controlsBox.append(el('h4', {}, t)); },
    set(id, v) { ctrls[id]?.set(v); },
    get(id) { return ctrls[id]?.get(); },
    done(taskId) {
      const t = tasks.find(x => x.id === taskId); if (!t || t.done) return;
      t.done = true; renderTasks(); api.toast('✓ Hoàn thành: ' + t.short);
      track('task_done', { task: taskId, ms: Date.now() - session.start });
      if (tasks.every(x => x.done)) { setTimeout(() => api.toast('🎉 Em đã hoàn thành tất cả nhiệm vụ của mô-đun!'), 2700); track('module_complete', { ms: Date.now() - session.start }); }
    },
    paused: false, speed: 1,
    // hình học dùng chung
    textSprite(text, { size = 0.2, color = '#fff', bg = null, font = 600 } = {}) {
      const c = document.createElement('canvas'); const ctx = c.getContext('2d');
      const fs = 64; ctx.font = `${font} ${fs}px 'Be Vietnam Pro',sans-serif`;
      const w = Math.ceil(ctx.measureText(text).width) + 32; c.width = w; c.height = fs + 32;
      ctx.font = `${font} ${fs}px 'Be Vietnam Pro',sans-serif`;
      if (bg) { ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(0, 0, w, c.height, 18); ctx.fill(); }
      ctx.fillStyle = color; ctx.textBaseline = 'middle'; ctx.fillText(text, 16, c.height / 2 + 2);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthWrite: false, transparent: true }));
      s.scale.set(size * w / c.height, size, 1); return s;
    },
    arrow(from, to, color = 0xffffff, headLen = 0.12, headW = 0.06) {
      const dir = to.clone().sub(from); const len = dir.length();
      return new THREE.ArrowHelper(dir.normalize(), from, len, color, Math.min(headLen, len * .4), headW);
    },
    tube(points, radius = 0.01, color = 0xffffff, opts = {}) {
      const curve = new THREE.CatmullRomCurve3(points, !!opts.closed);
      const g = new THREE.TubeGeometry(curve, opts.seg || Math.max(32, points.length * 8), radius, 8, !!opts.closed);
      const m = new THREE.MeshBasicMaterial({ color, transparent: !!opts.opacity, opacity: opts.opacity ?? 1 });
      const mesh = new THREE.Mesh(g, m); mesh.userData.curve = curve; return mesh;
    },
    glow(color = '#ffcc55', size = 6) {
      const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, color); g.addColorStop(.35, color + '88'); g.addColorStop(1, color + '00');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128);
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
      s.scale.set(size, size, 1); return s;
    },
    // các hạt chạy dọc đường cong – dùng cho gió, dòng biển, dòng chảy
    flowAlong(curve, { count = 20, color = 0xffffff, size = 0.03, speed = 0.08, parent = scene } = {}) {
      const geo = new THREE.SphereGeometry(size, 8, 8); const mat = new THREE.MeshBasicMaterial({ color });
      const im = new THREE.InstancedMesh(geo, mat, count); parent.add(im);
      const off = Array.from({ length: count }, (_, i) => i / count); const m4 = new THREE.Matrix4();
      api.onTick(dt => {
        if (!im.visible) return;
        for (let i = 0; i < count; i++) {
          off[i] = (off[i] + dt * speed) % 1; const p = curve.getPointAt(off[i]);
          m4.makeTranslation(p.x, p.y, p.z); im.setMatrixAt(i, m4);
        }
        im.instanceMatrix.needsUpdate = true;
      });
      return im;
    },
  };
  const ctrls = {}; const hotspots = []; let flight = null;

  // ---------- bảng điều khiển ----------
  const steps = def.steps || [];
  const tasks = (def.tasks || []).map(t => ({ ...t, short: t.short || t.text.replace(/<[^>]+>/g, '').slice(0, 48), done: false }));
  const body = $('#panel .body');
  const paneExplore = el('div'); const paneTasks = el('div'); const paneSrc = el('div', { class: 'src' });
  body.append(paneExplore, paneTasks, paneSrc);
  const dots = el('div', { class: 'steps-dots' }); const stepBox = el('div', { class: 'step' });
  const nav = el('div', { class: 'nav' });
  const prev = el('button', { type: 'button' }, '← Trước'); const next = el('button', { type: 'button', class: 'primary' }, 'Tiếp →');
  nav.append(prev, next);
  const cbox = el('div', { class: 'controls' }); api.controlsBox = cbox;
  paneExplore.append(dots, stepBox, nav, cbox);
  const seen = new Set(); let cur = -1, stepT = Date.now();
  steps.forEach((s, i) => { const b = el('button', { type: 'button', title: s.title }, String(i + 1)); b.onclick = () => go(i); dots.append(b); });
  function go(i) {
    if (i < 0 || i >= steps.length) return;
    if (cur >= 0) track('step_leave', { step: cur + 1, ms: Date.now() - stepT });
    cur = i; stepT = Date.now(); seen.add(i);
    [...dots.children].forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('seen', seen.has(k)); });
    stepBox.innerHTML = `<h2>${i + 1}. ${steps[i].title}</h2>${steps[i].html || ''}`;
    prev.disabled = i === 0; next.textContent = i === steps.length - 1 ? 'Làm nhiệm vụ →' : 'Tiếp →';
    api.hideInfo();
    try { steps[i].enter?.(api); } catch (e) { console.error(e); }
    track('step', { step: i + 1, title: steps[i].title });
  }
  prev.onclick = () => go(cur - 1);
  next.onclick = () => { if (cur === steps.length - 1) showTab('tasks'); else go(cur + 1); };

  function renderTasks() {
    paneTasks.innerHTML = '<p style="font-size:13px;color:var(--muted);margin-top:0">Thao tác trực tiếp trên mô hình. Nhiệm vụ tự đánh dấu khi em làm đúng.</p>';
    tasks.forEach(t => paneTasks.append(el('div', { class: 'task' + (t.done ? ' done' : '') },
      `<div class="ck">${t.done ? '✓' : ''}</div><div><p>${t.text}</p>${t.hint ? `<small>Gợi ý: ${t.hint}</small>` : ''}</div>`)));
    const tb = $('#panel .tab[data-t="tasks"]'); if (tb) tb.textContent = `Nhiệm vụ (${tasks.filter(t => t.done).length}/${tasks.length})`;
  }
  paneSrc.innerHTML = `<p style="font-size:13px;color:var(--muted);margin-top:0">Mô hình do AIDA dựng lại bằng WebGL, Việt hoá và đối chiếu với SGK Địa lí 10 (Kết nối tri thức). Tư liệu gốc tham khảo:</p><ul>${(def.sources || []).map(s => `<li><a href="${s.u}" target="_blank" rel="noopener">${s.t}</a>${s.n ? ` – ${s.n}` : ''}</li>`).join('')}</ul>${def.note ? `<p style="font-size:12.5px;color:var(--muted)">${def.note}</p>` : ''}`;
  function showTab(t) {
    document.querySelectorAll('#panel .tab').forEach(b => b.classList.toggle('on', b.dataset.t === t));
    paneExplore.style.display = t === 'explore' ? '' : 'none'; paneTasks.style.display = t === 'tasks' ? '' : 'none'; paneSrc.style.display = t === 'src' ? '' : 'none';
    track('tab', { tab: t });
  }
  document.querySelectorAll('#panel .tab').forEach(b => (b.onclick = () => showTab(b.dataset.t)));

  // ---------- HUD ----------
  const hud = $('#hud');
  const bPlay = el('button', { type: 'button' }, '⏸ Tạm dừng');
  bPlay.onclick = () => { api.paused = !api.paused; bPlay.textContent = api.paused ? '▶ Chạy' : '⏸ Tạm dừng'; track('control', { id: 'pause', value: api.paused }); };
  const bSpeed = el('button', { type: 'button' }, 'Tốc độ ×1');
  const speeds = [0.5, 1, 2, 4]; let si = 1;
  bSpeed.onclick = () => { si = (si + 1) % speeds.length; api.speed = speeds[si]; bSpeed.textContent = `Tốc độ ×${speeds[si]}`; };
  const bLbl = el('button', { type: 'button', class: 'on' }, 'Nhãn');
  bLbl.onclick = () => { labelsOn = !labelsOn; bLbl.classList.toggle('on', labelsOn); };
  const bReset = el('button', { type: 'button' }, '⟲ Góc nhìn');
  bReset.onclick = () => { if (steps[cur]?.enter) steps[cur].enter(api); else if (def.view) api.fly(def.view.pos, def.view.target); };
  hud.append(bPlay, bSpeed, bLbl, bReset);
  $('#bar .full').onclick = () => { const d = document.documentElement; document.fullscreenElement ? document.exitFullscreen() : d.requestFullscreen?.(); };

  // ---------- chọn đối tượng (hotspot) ----------
  const ray = new THREE.Raycaster(); const ptr = new THREE.Vector2(); let downAt = null;
  function pick(ev) {
    const r = renderer.domElement.getBoundingClientRect();
    ptr.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const objs = hotspots.filter(h => isVisible(h.obj)).map(h => h.obj);
    const hit = ray.intersectObjects(objs, true)[0];
    if (!hit) return null;
    let o = hit.object; while (o && !o.userData.hotspot) o = o.parent;
    return o ? { o, info: o.userData.hotspot, point: hit.point } : null;
  }
  function isVisible(o) { while (o) { if (!o.visible) return false; o = o.parent; } return true; }
  renderer.domElement.addEventListener('pointerdown', e => (downAt = [e.clientX, e.clientY]));
  renderer.domElement.addEventListener('pointerup', e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
    const h = pick(e); if (!h) return;
    const info = typeof h.info === 'function' ? h.info(h.point) : h.info;
    if (!info) return;
    api.showInfo(info.title, info.html || ''); track('hotspot', { id: info.id || info.title });
    info.onPick?.(api);
  });
  renderer.domElement.addEventListener('pointermove', e => {
    if (e.buttons) return; renderer.domElement.style.cursor = pick(e) ? 'pointer' : 'grab';
  });

  // ---------- dựng cảnh của mô-đun ----------
  await def.setup(api);
  if (def.view) { camera.position.set(...def.view.pos); controls.target.set(...def.view.target); }
  renderTasks(); showTab('explore'); go(0);
  $('#loading').style.display = 'none';
  track('open', { title: def.title });

  // ---------- vòng lặp ----------
  const clock = new THREE.Clock(); let elapsed = 0; const tmp = new THREE.Vector3(); const camDir = new THREE.Vector3();
  renderer.setAnimationLoop(() => {
    const raw = Math.min(clock.getDelta(), 0.05);
    const dt = api.paused ? 0 : raw * api.speed; elapsed += dt;
    if (flight) {
      const k = Math.min((performance.now() - flight.s) / flight.ms, 1), e = ease(k);
      camera.position.lerpVectors(flight.p0, flight.p1, e); controls.target.lerpVectors(flight.t0, flight.t1, e);
      if (k >= 1) flight = null;
    }
    for (const f of tickers) f(dt, elapsed, raw);
    controls.update();
    for (const o of labels) {
      let vis = labelsOn && isVisible(o);
      if (vis && o.userData.globe) {
        const g = o.userData.globe; o.getWorldPosition(tmp);
        const n = tmp.clone().sub(g.center).normalize(); camDir.copy(camera.position).sub(tmp).normalize();
        vis = n.dot(camDir) > 0.05;
      }
      if (vis) {
        o.getWorldPosition(tmp); tmp.project(camera);
        if (tmp.z > 1 || tmp.z < -1) vis = false;
        else o.element.style.transform = `translate(-50%,-50%) translate(${((tmp.x + 1) / 2 * state2d.w).toFixed(1)}px,${((1 - tmp.y) / 2 * state2d.h).toFixed(1)}px)`;
      }
      o.element.classList.toggle('hidden', !vis);
    }
    renderer.render(scene, camera);
  });
  // lệnh từ web lớp học (VD: mở lại đúng bước khi học sinh trả lời sai)
  addEventListener('message', e => { const d = e.data || {}; if (d.aida === 'goStep' && d.step) { showTab('explore'); go(Math.min(d.step, steps.length) - 1); track('review_from_quiz', { step: d.step }); } });
  addEventListener('pagehide', () => track('close', { ms: Date.now() - session.start, steps_seen: seen.size, steps_total: steps.length, tasks_done: tasks.filter(t => t.done).length, tasks_total: tasks.length }));
  window.AIDA_LAB = api; // để kiểm thử
  return api;
}

// ---------- quả địa cầu dùng chung ----------
export function makeGlobe(api, { radius = 1, texture = null, color = 0x2a6fb0, grid = true, lines = [], gc = null } = {}) {
  const g = new THREE.Group();
  const mat = texture ? new THREE.MeshStandardMaterial({ map: texture, roughness: 0.95, metalness: 0 }) : new THREE.MeshStandardMaterial({ color, roughness: .9 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 64), mat); g.add(mesh); g.userData.mesh = mesh;
  if (grid) {
    const gm = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 });
    for (let lat = -60; lat <= 60; lat += 30) g.add(circleLat(lat, radius * 1.002, gm));
    for (let lon = 0; lon < 180; lon += 30) g.add(meridian(lon, radius * 1.002, gm));
  }
  const special = { 0: ['Xích đạo', 0xffd166], 23.45: ['Chí tuyến Bắc', 0xff9f6e], '-23.45': ['Chí tuyến Nam', 0xff9f6e], 66.55: ['Vòng cực Bắc', 0x8fd3ff], '-66.55': ['Vòng cực Nam', 0x8fd3ff] };
  lines.forEach(lat => {
    const [name, col] = special[lat] || [`${lat}°`, 0xffffff];
    const l = circleLat(+lat, radius * 1.004, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .85 })); g.add(l);
    (g.userData.lineLabels ||= []).push(api.label(name, { cls: 'sm', pos: latLonToVec3(+lat, -20, radius * 1.03), parent: g, globe: gc || { center: new THREE.Vector3(), radius } }));
  });
  return g;
}
export function circleLat(lat, r, mat) {
  const pts = []; for (let i = 0; i <= 128; i++) pts.push(latLonToVec3(lat, -180 + i * 360 / 128, r));
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
}
export function meridian(lon, r, mat) {
  const pts = []; for (let i = 0; i <= 128; i++) { const a = i / 128 * 360; const lat = a <= 180 ? 90 - a : a - 270; const ln = a <= 180 ? lon : lon + 180; pts.push(latLonToVec3(lat, ln, r)); }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
}
// đường cong trên mặt cầu nối các điểm (lat,lon)
export function geoCurve(pairs, r) {
  const pts = []; for (let i = 0; i < pairs.length - 1; i++) {
    const a = latLonToVec3(...pairs[i], 1), b = latLonToVec3(...pairs[i + 1], 1);
    for (let k = 0; k < 8; k++) pts.push(a.clone().lerp(b, k / 8).normalize().multiplyScalar(r));
  }
  pts.push(latLonToVec3(...pairs[pairs.length - 1], r));
  return new THREE.CatmullRomCurve3(pts);
}
// nền sao
export function starfield(scene, n = 1500, r = 400) {
  const g = new THREE.BufferGeometry(); const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { const v = new THREE.Vector3().randomDirection().multiplyScalar(r * (0.6 + Math.random() * 0.4)); p.set([v.x, v.y, v.z], i * 3); }
  g.setAttribute('position', new THREE.BufferAttribute(p, 3));
  const s = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: false, transparent: true, opacity: .7 }));
  scene.add(s); return s;
}

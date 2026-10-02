// Quả địa cầu 3D cho trang giới thiệu và trang đăng nhập (Three.js, kết cấu bề mặt vẽ ngay trên trình duyệt)
export async function mountGlobe(box, { tilt = 23.4, speed = 0.08, markers = [], zoom = 3.1, mode = 'natural' } = {}) {
  let THREE, earthTexture;
  try { THREE = await import('three'); ({ earthTexture } = await import('../../lab/earth.js')); } catch (e) { box.classList.add('no3d'); return () => {}; }
  const canvas = document.createElement('canvas'); box.prepend(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene(); const cam = new THREE.PerspectiveCamera(35, 1, .1, 100); cam.position.set(0, 0, zoom);
  scene.add(new THREE.AmbientLight(0xffffff, .55)); const sun = new THREE.DirectionalLight(0xfff4e0, 2.1); sun.position.set(-3, 1.4, 2.5); scene.add(sun);
  const earth = new THREE.Group(); earth.rotation.z = -tilt * Math.PI / 180; scene.add(earth);
  const spin = new THREE.Group(); earth.add(spin);
  let tex = null; try { tex = await earthTexture({ mode, w: 1536, h: 768 }); } catch (e) { /* dùng màu trơn */ }
  const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), new THREE.MeshStandardMaterial({ map: tex, color: tex ? 0xffffff : 0x2a6fb0, roughness: .85, metalness: 0 }));
  spin.add(globe);
  // lưới kinh vĩ tuyến
  const gm = new THREE.LineBasicMaterial({ color: 0x9fd6f0, transparent: true, opacity: .16 });
  for (let lat = -60; lat <= 60; lat += 30) { const r = Math.cos(lat * Math.PI / 180), y = Math.sin(lat * Math.PI / 180); const pts = []; for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * r * 1.003, y * 1.003, Math.sin(a) * r * 1.003)); } spin.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lat === 0 ? new THREE.LineBasicMaterial({ color: 0xf0be57, transparent: true, opacity: .55 }) : gm)); }
  for (let lon = 0; lon < 180; lon += 30) { const pts = []; for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * Math.cos(lon * Math.PI / 180) * 1.003, Math.sin(a) * 1.003, Math.cos(a) * Math.sin(lon * Math.PI / 180) * -1.003)); } spin.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gm)); }
  // quầng khí quyển
  const atm = new THREE.Mesh(new THREE.SphereGeometry(1.06, 64, 48), new THREE.ShaderMaterial({ transparent: true, side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 n; void main(){ n = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
    fragmentShader: 'varying vec3 n; void main(){ float i = pow(.72 - dot(n, vec3(0.,0.,1.)), 3.); gl_FragColor = vec4(.42,.75,1.,1.)*i*1.6; }' }));
  scene.add(atm);
  // điểm đánh dấu
  const v3 = (lat, lon, r = 1) => { const p = (90 - lat) * Math.PI / 180, t = (lon + 180) * Math.PI / 180; return new THREE.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)); };
  const mk = markers.map(m => { const s = new THREE.Mesh(new THREE.SphereGeometry(.018, 16, 12), new THREE.MeshBasicMaterial({ color: 0xf0be57 })); s.position.copy(v3(m.lat, m.lon, 1.01)); spin.add(s);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.025, .034, 32), new THREE.MeshBasicMaterial({ color: 0xf0be57, transparent: true, opacity: .8, side: THREE.DoubleSide })); ring.position.copy(v3(m.lat, m.lon, 1.012)); ring.lookAt(v3(m.lat, m.lon, 2)); spin.add(ring); return { ...m, s, ring }; });
  // hướng Việt Nam về phía người xem lúc đầu
  const vn = v3(16, 106); spin.rotation.y = Math.atan2(-vn.x, vn.z) - .5;
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(Array.from({ length: 1800 }, () => (Math.random() - .5) * 60), 3)), new THREE.PointsMaterial({ color: 0xbfd8e6, size: .045, transparent: true, opacity: .7 }));
  scene.add(stars);
  const size = () => { const w = box.clientWidth, h = box.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
  const ro = new ResizeObserver(size); ro.observe(box); size();
  let drag = null, vel = speed, raf = 0, visible = true, t0 = performance.now();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, ry: spin.rotation.y, rx: earth.rotation.x }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => { if (!drag) return; spin.rotation.y = drag.ry + (e.clientX - drag.x) * .006; earth.rotation.x = Math.max(-.6, Math.min(.6, drag.rx + (e.clientY - drag.y) * .004)); });
  canvas.addEventListener('pointerup', () => (drag = null));
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) loop(); }); io.observe(box);
  function loop() {
    raf = 0; if (!visible || !box.isConnected) return;
    const now = performance.now(), dt = Math.min(.05, (now - t0) / 1000); t0 = now;
    if (!drag && !reduce) spin.rotation.y += vel * dt;
    mk.forEach((m, i) => { const k = 1 + .35 * Math.sin(now / 400 + i); m.ring.scale.set(k, k, k); });
    renderer.render(scene, cam); raf = requestAnimationFrame(loop);
  }
  loop();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); renderer.dispose(); };
}

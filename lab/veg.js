// Thảm thực vật dựng bằng InstancedMesh (dùng chung cho mô-đun 15 và 18)
import * as THREE from 'three';

const M = c => new THREE.MeshStandardMaterial({ color: c, roughness: .9, flatShading: true });
const PARTS = {
  trunk: [new THREE.CylinderGeometry(.04, .06, 1, 5), M(0x6b4a2e)],
  tropic: [new THREE.IcosahedronGeometry(.5, 0), M(0x1f6a2a)],
  acacia: [new THREE.CylinderGeometry(.55, .4, .18, 7), M(0x6f8f2f)],
  cactus: [new THREE.CylinderGeometry(.06, .07, 1, 6), M(0x5f8a3a)],
  grass: [new THREE.ConeGeometry(.12, .35, 4), M(0xb9b65a)],
  broad: [new THREE.IcosahedronGeometry(.42, 0), M(0x5f9b3a)],
  conifer: [new THREE.ConeGeometry(.28, 1, 6), M(0x24563a)],
  shrub: [new THREE.IcosahedronGeometry(.14, 0), M(0x8c8f5a)],
  ice: [new THREE.IcosahedronGeometry(.25, 0), M(0xeef4f8)],
};
// danh sách phần cấu thành của từng loại cây: [part, dx, dy, dz, sx, sy, sz]
const KIND = {
  tropic: [['trunk', 0, .6, 0, 1, 1.2, 1], ['tropic', 0, 1.4, 0, 1.2, 1, 1.2]],
  acacia: [['trunk', 0, .45, 0, .8, .9, .8], ['acacia', 0, .95, 0, 1, 1, 1]],
  cactus: [['cactus', 0, .4, 0, 1, .8, 1]],
  grass: [['grass', 0, .17, 0, 1, 1, 1]],
  broad: [['trunk', 0, .45, 0, 1, .9, 1], ['broad', 0, 1.05, 0, 1, 1, 1]],
  conifer: [['trunk', 0, .2, 0, 1, .4, 1], ['conifer', 0, .8, 0, 1, 1.1, 1]],
  shrub: [['shrub', 0, .08, 0, 1, .7, 1]],
  ice: [['ice', 0, .05, 0, 1.4, .4, 1.4]],
};
export function vegetation() {
  const mats = {}; Object.keys(PARTS).forEach(k => (mats[k] = []));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  return {
    add(kind, x, y, z, s = 1, rot = Math.random() * 6) {
      e.set(0, rot, 0); q.setFromEuler(e);
      for (const [p, dx, dy, dz, sx, sy, sz] of KIND[kind]) {
        m4.compose(new THREE.Vector3(x + dx * s, y + dy * s, z + dz * s), q, new THREE.Vector3(sx * s, sy * s, sz * s));
        mats[p].push(m4.clone());
      }
    },
    build(group) {
      for (const [p, list] of Object.entries(mats)) {
        if (!list.length) continue;
        const im = new THREE.InstancedMesh(PARTS[p][0], PARTS[p][1], list.length);
        list.forEach((m, i) => im.setMatrixAt(i, m)); im.instanceMatrix.needsUpdate = true; group.add(im);
      }
    },
  };
}

// Núi có các vành đai thực vật theo độ cao.
// belts: [{ to: tỉ lệ độ cao 0..1 (giới hạn trên), kind, color: [r,g,b] 0..1, name }]
export function beltMountain({ r = 3.5, H = 5, belts, density = 1 }) {
  const g = new THREE.Group();
  const geo = new THREE.CircleGeometry(r, 90, 0, Math.PI * 2); // lưới tròn rồi nâng độ cao
  const seg = new THREE.PlaneGeometry(r * 2, r * 2, 90, 90); seg.rotateX(-Math.PI / 2);
  const P = seg.attributes.position; const col = new Float32Array(P.count * 3);
  const hAt = (x, z) => { const d = Math.hypot(x, z) / r; if (d >= 1) return 0; const n = Math.sin(x * 3.1) * .04 + Math.cos(z * 2.7) * .04; return H * Math.pow(Math.cos(d * Math.PI / 2), 1.6) * (1 + n); };
  const beltOf = f => belts.find(b => f <= b.to) || belts[belts.length - 1];
  for (let i = 0; i < P.count; i++) { const x = P.getX(i), z = P.getZ(i); const y = hAt(x, z); P.setY(i, y); const b = beltOf(y / H); col.set(b.color, i * 3); }
  seg.setAttribute('color', new THREE.BufferAttribute(col, 3)); seg.computeVertexNormals();
  const mesh = new THREE.Mesh(seg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 }));
  g.add(mesh); geo.dispose();
  const veg = vegetation();
  for (let k = 0; k < 2600 * density; k++) {
    const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * r * .97; const x = Math.cos(a) * d, z = Math.sin(a) * d; const y = hAt(x, z);
    if (y < .05) continue; const b = beltOf(y / H); if (!b.kind) continue;
    const s = b.kind === 'tropic' ? .32 : b.kind === 'broad' ? .3 : b.kind === 'conifer' ? .28 : .35;
    if (Math.random() < (b.kind === 'shrub' ? .5 : .32)) veg.add(b.kind, x, y - .02, z, s);
  }
  veg.build(g);
  g.userData.hAt = hAt; g.userData.H = H;
  return g;
}

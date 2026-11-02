// 3D-11b · Bài 11 – Nguồn gốc hình thành hồ: hồ móng ngựa, hồ kiến tạo, hồ núi lửa
import { THREE } from '../core.js';
import { FAM11 } from './fam11.js';

const V2 = (x, y) => new THREE.Vector2(x, y);
const lerp = THREE.MathUtils.lerp, clamp = THREE.MathUtils.clamp, ss = THREE.MathUtils.smoothstep;
const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);

// dải nước/bãi bồi mỏng chạy theo đường cong trên mặt phẳng
function ribbonGeo(pts, width, y, { w0 = null } = {}) {
  const pos = [], idx = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const t = V2(b.x - a.x, b.y - a.y).normalize(); const n = V2(-t.y, t.x);
    const w = (typeof width === 'function' ? width(i / (pts.length - 1)) : width) / 2;
    pos.push(pts[i].x + n.x * w, y, pts[i].y + n.y * w, pts[i].x - n.x * w, y, pts[i].y - n.y * w);
    if (i < pts.length - 1) { const k = i * 2; idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
}
const curvePts = (ctrl, n = 160) => new THREE.SplineCurve(ctrl).getSpacedPoints(n);

const TYPES = {
  mn: { name: 'Hồ móng ngựa', force: 'Ngoại lực – dòng chảy của sông', how: 'Sông uốn khúc: nước xói lở bờ lõm, bồi tụ bờ lồi → khúc uốn ngày càng cong, eo đất hẹp dần. Mùa lũ, nước phá eo, sông chảy thẳng; khúc uốn cũ bị phù sa bịt hai đầu thành hồ hình móng ngựa.', ex: 'Các hồ móng ngựa ven sông Hồng, sông Mi-xi-xi-pi (Hoa Kỳ), sông A-ma-dôn.' },
  kt: { name: 'Hồ kiến tạo', force: 'Nội lực – vận động kiến tạo (tách giãn, đứt gãy)', how: 'Lực kéo tách làm vỏ Trái Đất đứt gãy; một khối đá sụt xuống giữa các đường đứt gãy tạo thành vùng trũng sâu, kéo dài (địa hào). Nước sông, nước mưa đổ vào → hồ rất sâu.', ex: 'Hồ Bai-can (Nga) – hồ sâu nhất thế giới, khoảng 1 640 m; hồ Tan-ga-ni-ca, hồ Ma-la-uy ở thung lũng tách giãn Đông Phi.' },
  bh: { name: 'Hồ băng hà', force: 'Ngoại lực – hoạt động của băng hà (sông băng)', how: 'Sông băng trượt xuống thung lũng, bào mòn khoét thành lòng chảo và đẩy đất đá thành dải băng tích chắn ngang. Khi khí hậu ấm lên, băng tan, nước đọng lại trong lòng chảo → hồ.', ex: 'Ngũ Hồ (Hồ Lớn) ở Bắc Mỹ; hàng chục nghìn hồ ở Phần Lan, Ca-na-đa.' },
  nt: { name: 'Hồ nhân tạo', force: 'Con người – xây đập ngăn sông', how: 'Con người xây đập chắn ngang dòng sông; nước bị giữ lại, dâng lên ngập thung lũng phía trên đập thành hồ chứa.', ex: 'Hồ Hoà Bình (sông Đà), hồ Thác Bà (sông Chảy), hồ Trị An (sông Đồng Nai), hồ Dầu Tiếng (sông Sài Gòn).' },
  nl: { name: 'Hồ núi lửa', force: 'Nội lực – hoạt động núi lửa', how: 'Núi lửa phun trào làm buồng mác-ma rỗng đi; đỉnh núi sụp xuống tạo miệng hố rộng (miệng núi lửa, hõm chảo). Khi núi lửa ngừng hoạt động, nước mưa, nước ngầm đọng lại trong miệng hố → hồ tròn, sâu.', ex: 'Biển Hồ (hồ T’Nưng, Gia Lai), hồ Tơ Nưng; hồ Crây-tơ (Crater Lake, Hoa Kỳ).' },
};

export default {
  id: '3D-11b', lab: '11b', family: FAM11, sub: true, code: 'DL10.B11', title: 'Nguồn gốc hình thành hồ',
  objectives: [{ c: 'DL10.05.01', t: 'Thuỷ quyển, nước trên lục địa: hồ' }],
  sources: [
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 11 (Hồ: phân loại theo nguồn gốc)', u: 'https://hanhtrangso.nxbgd.vn/' },
    { t: 'USGS – Oxbow lakes and meandering rivers', u: 'https://www.usgs.gov/media/images/oxbow-lake' },
    { t: 'Britannica – Lake Baikal', u: 'https://www.britannica.com/place/Lake-Baikal' },
    { t: 'NPS – Crater Lake: How the lake formed', u: 'https://www.nps.gov/crla/learn/nature/how-crater-lake-formed.htm' },
    { t: 'NSIDC – Glacial landforms (hồ băng hà, băng tích)', u: 'https://nsidc.org/learn/parts-cryosphere/glaciers/glacier-landforms' },
  ],
  note: 'Tỉ lệ đứng, thời gian và kích thước được phóng đại để dễ quan sát; quá trình thực tế diễn ra trong hàng trăm đến hàng triệu năm.',
  view: { pos: [0, 10, 13], target: [0, 0, 0] },
  steps: [
    { title: 'Hồ và nguồn gốc của hồ', html: '<p><b>Hồ</b> là vùng trũng chứa nước trên lục địa, không thông trực tiếp với biển. Theo <b>nguồn gốc hình thành</b>, có:</p><ul><li><b>Hồ do ngoại lực</b>: hồ móng ngựa (dòng chảy), hồ băng hà (băng hà bào mòn)…</li><li><b>Hồ do nội lực</b>: hồ kiến tạo, hồ núi lửa.</li><li><b>Hồ nhân tạo</b>: hồ thuỷ điện, hồ thuỷ lợi (VD: hồ Hoà Bình, hồ Dầu Tiếng).</li></ul><div class="tip">Chọn loại hồ, rồi bật <b>Tự chạy</b> hoặc kéo thanh <b>Quá trình hình thành</b>.</div>',
      enter: a => a.state.show('mn', 0) },
    { title: 'Hồ móng ngựa', html: '<p><b>Lực tạo thành:</b> ngoại lực – dòng chảy của sông.</p><ol style="padding-left:18px"><li>Ở đồng bằng, sông chảy uốn khúc. Dòng nước xô vào <b>bờ lõm</b> làm bờ bị <b>xói lở</b>; ở <b>bờ lồi</b> nước chảy chậm, phù sa được <b>bồi tụ</b>.</li><li>Khúc uốn ngày càng cong, <b>eo đất</b> giữa hai đoạn sông hẹp dần.</li><li>Mùa lũ, nước <b>phá eo</b>, sông chảy thẳng theo đường ngắn hơn.</li><li>Khúc uốn cũ bị phù sa <b>bịt hai đầu</b>, tách khỏi sông → <b>hồ hình móng ngựa</b>.</li></ol>',
      enter: a => a.state.show('mn', 0, true) },
    { title: 'Hồ băng hà', html: '<p><b>Lực tạo thành:</b> ngoại lực – hoạt động của <b>băng hà</b>.</p><ol style="padding-left:18px"><li>Thời kì khí hậu lạnh, <b>sông băng</b> trượt chậm xuống thung lũng, mang theo đá vụn <b>bào mòn</b> đáy và sườn: thung lũng chữ V thành chữ U, nhiều chỗ bị <b>khoét sâu</b> thành lòng chảo.</li><li>Đất đá bị băng đẩy, bồi lại ở lưỡi băng thành dải <b>băng tích</b> chắn ngang thung lũng.</li><li>Khí hậu ấm lên, băng <b>tan và lùi</b> dần; nước băng tan, nước mưa đọng lại trong lòng chảo bị băng tích chắn → <b>hồ băng hà</b>.</li></ol><p>VD: <b>Ngũ Hồ</b> (Bắc Mỹ); Phần Lan được gọi là “xứ sở nghìn hồ”.</p>',
      enter: a => a.state.show('bh', 0, true) },
    { title: 'Hồ kiến tạo', html: '<p><b>Lực tạo thành:</b> nội lực – vận động kiến tạo.</p><ol style="padding-left:18px"><li>Lực <b>kéo tách</b> làm lớp đá bị <b>đứt gãy</b>.</li><li>Khối đá ở giữa các đường đứt gãy <b>sụt xuống</b>, tạo vùng trũng hẹp, dài và sâu (<b>địa hào</b>).</li><li>Nước sông, nước mưa, nước ngầm đổ vào vùng trũng → <b>hồ kiến tạo</b>: thường dài, hẹp và rất sâu.</li></ol><p>VD: hồ <b>Bai-can</b> (Nga) sâu khoảng 1 640 m – sâu nhất thế giới.</p>',
      enter: a => a.state.show('kt', 0, true) },
    { title: 'Hồ núi lửa', html: '<p><b>Lực tạo thành:</b> nội lực – hoạt động núi lửa.</p><ol style="padding-left:18px"><li>Mác-ma từ <b>buồng mác-ma</b> theo ống phun lên, núi lửa <b>phun trào</b>.</li><li>Buồng mác-ma rỗng đi, đỉnh núi mất chỗ dựa và <b>sụp xuống</b> → miệng hố rộng, sâu (hõm chảo).</li><li>Núi lửa ngừng hoạt động, nước mưa và nước ngầm <b>đọng lại</b> trong miệng hố → <b>hồ núi lửa</b> hình tròn, sâu.</li></ol><p>VD: <b>Biển Hồ (hồ T’Nưng)</b> ở Pleiku, Gia Lai là miệng núi lửa cổ.</p>',
      enter: a => a.state.show('nl', 0, true) },
    { title: 'Hồ nhân tạo', html: '<p><b>Do con người tạo ra:</b> xây <b>đập</b> chắn ngang dòng sông.</p><ol style="padding-left:18px"><li>Chọn chỗ thung lũng hẹp, xây đập ngăn sông.</li><li>Nước bị giữ lại phía trên đập, <b>dâng lên</b> ngập thung lũng thành <b>hồ chứa</b>.</li><li>Nước qua tua-bin để <b>phát điện</b>, xả xuống hạ du để tưới, cấp nước.</li></ol><p><b>Lợi ích:</b> thuỷ điện, thuỷ lợi, cắt lũ, cấp nước, nuôi thuỷ sản, du lịch. <b>Mặt trái:</b> ngập đất, di dân, giữ phù sa, thay đổi dòng chảy hạ du.</p><p>VD: hồ <b>Hoà Bình</b> (sông Đà), <b>Thác Bà</b> (sông Chảy), <b>Trị An</b> (sông Đồng Nai), <b>Dầu Tiếng</b> (sông Sài Gòn).</p>',
      enter: a => a.state.show('nt', 0, true) },
    { title: 'So sánh và vai trò của hồ', html: '<ul><li>Hồ <b>móng ngựa</b>: nhỏ, nông, hình cong – do <b>ngoại lực</b>.</li><li>Hồ <b>kiến tạo</b>: dài, hẹp, rất sâu – do <b>nội lực</b> (đứt gãy).</li><li>Hồ <b>núi lửa</b>: tròn, sâu, ở đỉnh núi – do <b>nội lực</b> (núi lửa).</li><li>Hồ <b>băng hà</b>: nhiều hồ liền nhau ở vùng từng bị băng phủ – do <b>ngoại lực</b> (băng hà).</li><li>Hồ <b>nhân tạo</b>: phía trên đập, hình dạng theo thung lũng – do <b>con người</b>.</li></ul><p><b>Vai trò của hồ:</b> điều hoà dòng chảy sông, cung cấp nước sinh hoạt và tưới tiêu, nuôi trồng thuỷ sản, thuỷ điện, du lịch, điều hoà khí hậu địa phương.</p>',
      enter: a => a.state.show(a.state.type || 'mn', 1) },
  ],
  tasks: [
    { id: 'mn', text: 'Xem hết quá trình hình thành <b>hồ móng ngựa</b> (tới 100%).' },
    { id: 'kt', text: 'Xem hết quá trình hình thành <b>hồ kiến tạo</b>.' },
    { id: 'nl', text: 'Xem hết quá trình hình thành <b>hồ núi lửa</b>.' },
    { id: 'bh', text: 'Xem hết quá trình hình thành <b>hồ băng hà</b>.' },
    { id: 'nt', text: 'Xem hết quá trình hình thành <b>hồ nhân tạo</b>.' },
    { id: 'bank', text: 'Bấm vào nhãn <b>bờ lõm</b> và <b>bờ lồi</b> để biết nơi sông xói lở, nơi bồi tụ.' },
  ],

  async setup(api) {
    const { scene, state, renderer } = api;
    renderer.localClippingEnabled = true;
    scene.background = new THREE.Color(0xb3d4ef); scene.fog = new THREE.Fog(0xb3d4ef, 30, 60);
    const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-6, 12, 9); scene.add(sun);
    scene.add(new THREE.HemisphereLight(0xe0efff, 0x6b5a40, .9));
    const M = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: o.r ?? .9, metalness: 0, side: o.side ?? THREE.FrontSide, transparent: !!o.op, opacity: o.op ?? 1, clippingPlanes: o.clip || null });
    const WATER = 0x2b80d0;
    const G = { mn: new THREE.Group(), kt: new THREE.Group(), nl: new THREE.Group(), bh: new THREE.Group(), nt: new THREE.Group() }; Object.values(G).forEach(g => scene.add(g));
    const labelsOf = { mn: [], kt: [], nl: [], bh: [], nt: [] }; const m4b = new THREE.Matrix4();
    const L = (type, text, pos, opt = {}) => { const l = api.label(text, { pos, parent: G[type], ...opt }); labelsOf[type].push(l); return l; };
    const tick = { mn: null, kt: null, nl: null, bh: null, nt: null };

    // =================== 1. HỒ MÓNG NGỰA ===================
    {
      const g = G.mn; const Wp = 16, Dp = 10;
      // bãi bồi (đồng bằng) + mặt cắt
      const plain = new THREE.Mesh(new THREE.BoxGeometry(Wp, 1.2, Dp), [M(0x7a5b3c), M(0x7a5b3c), M(0x86b35a), M(0x7a5b3c), M(0x8f6b45), M(0x7a5b3c)]); plain.position.y = -.6; g.add(plain);
      // lớp phù sa ở mặt cắt trước
      { const al = new THREE.Mesh(new THREE.PlaneGeometry(Wp, .35), new THREE.MeshBasicMaterial({ color: 0xb08a5a })); al.position.set(0, -.2, Dp / 2 + .005); g.add(al); }
      const fields = new THREE.Group(); g.add(fields);
      for (let i = 0; i < 26; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(.9 + Math.random() * .8, .02, .6 + Math.random() * .5), M([0x9cc45a, 0x7fae46, 0xb7cf6a][i % 3])); const x = (Math.random() - .5) * (Wp - 1), z = Math.random() < .5 ? 2.8 + Math.random() * 1.8 : -4.6 + Math.random() * .8; f.position.set(x, .011, z); fields.add(f); }
      const water = new THREE.Mesh(new THREE.BufferGeometry(), M(WATER, { r: .15 })); water.position.y = .03; g.add(water);
      const lakeM = new THREE.Mesh(new THREE.BufferGeometry(), M(0x2f7fb8, { r: .15 })); lakeM.position.y = .028; g.add(lakeM);
      const barM = new THREE.Mesh(new THREE.BufferGeometry(), M(0xe0c48a, { r: 1 })); barM.position.y = .02; g.add(barM);
      const plugM = new THREE.Group(); g.add(plugM);
      const plugs = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.CircleGeometry(.5, 20), M(0xc9a873)); m.rotation.x = -Math.PI / 2; m.position.y = .035; plugM.add(m); return m; });
      const flowI = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0xd9f1ff }), 70); g.add(flowI);
      const erodeA = []; for (let i = 0; i < 4; i++) { const a = api.arrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), 0xff7a45, .28, .16); g.add(a); erodeA.push(a); }
      const m4 = new THREE.Matrix4(); let path = null, flowK = Array.from({ length: 70 }, (_, i) => i / 70);
      const lConcave = L('mn', 'Bờ lõm: xói lở', new THREE.Vector3(), { cls: 'warm', onClick: { title: 'Bờ lõm – nơi xói lở', html: 'Ở khúc uốn, dòng nước chảy mạnh nhất áp sát <b>bờ lõm</b> (phía ngoài khúc uốn), khoét sâu và làm bờ <b>sạt lở</b> → khúc uốn lấn dần ra ngoài.', id: 'lom', onPick: () => bankSeen('lom') } });
      const lConvex = L('mn', 'Bờ lồi: bồi tụ', new THREE.Vector3(), { onClick: { title: 'Bờ lồi – nơi bồi tụ', html: 'Phía trong khúc uốn (<b>bờ lồi</b>) nước chảy chậm, phù sa lắng đọng tạo <b>bãi bồi</b> → bờ lồi lấn dần ra lòng sông.', id: 'loi', onPick: () => bankSeen('loi') } });
      const lNeck = L('mn', 'Eo đất hẹp dần', new THREE.Vector3(), { cls: 'sm' });
      const lCut = L('mn', 'Lũ phá eo → sông chảy thẳng', new THREE.Vector3(), { cls: 'sm cold' });
      const lLake = L('mn', 'Hồ móng ngựa', new THREE.Vector3(), { cls: 'big cold' });
      const bset = new Set(); const bankSeen = id => { bset.add(id); if (bset.size >= 2) api.done('bank'); };
      let lastP = -1;
      tick.mn = (p, dt) => {
        if (Math.abs(p - lastP) < 1e-4 && path) return; lastP = p;
        // p: 0 – .62 uốn khúc phát triển; .62 – .72 lũ phá eo; .72 – 1 bịt hai đầu → hồ
        const grow = ss(p, 0, .62);
        const R = lerp(1.15, 2.35, grow), gap = Math.min(lerp(2.25, .22, grow), R * 1.9);
        const zc = -Math.sqrt(R * R - gap * gap / 4) + .9;
        const thL = Math.atan2(.9 - zc, -gap / 2), thR = Math.atan2(.9 - zc, gap / 2) + Math.PI * 2;
        const loop = []; for (let i = 0; i <= 60; i++) { const th = lerp(thL, thR, i / 60); loop.push(V2(R * Math.cos(th), zc + R * Math.sin(th))); }
        const left = [V2(-8.2, 2.2), V2(-5.5, 2.1), V2(-3, 1.7), V2(-gap / 2 - .7, 1.45)], right = [V2(gap / 2 + .7, 1.45), V2(3, 1.7), V2(5.5, 2.1), V2(8.2, 2.2)];
        const cut = p > .66;
        const ctrl = cut ? [...left, V2(0, 1.1), ...right] : [...left, ...loop.filter((_, i) => i % 3 === 0), ...right];
        path = new THREE.SplineCurve(ctrl); const pts = path.getSpacedPoints(220);
        const wR = .42;
        water.geometry.dispose(); water.geometry = ribbonGeo(pts, wR, 0);
        // bãi bồi bờ lồi: dải cát phía trong khúc uốn
        const inner = []; for (let i = 6; i <= 54; i++) { const th = lerp(thL, thR, i / 60); const rr = R - wR / 2 - .05 - .25 * grow; inner.push(V2(rr * Math.cos(th), zc + rr * Math.sin(th))); }
        barM.geometry.dispose(); barM.geometry = ribbonGeo(inner, t => (.15 + .55 * grow) * Math.sin(Math.PI * t) + .02, 0); barM.visible = grow > .05;
        // hồ móng ngựa: khúc uốn cũ, hai đầu bị phù sa bịt dần
        lakeM.visible = cut; plugM.visible = cut;
        if (cut) {
          const close = ss(p, .7, 1); const a0 = .06 + .1 * close, a1 = 1 - a0;
          const lk = []; for (let i = 0; i <= 80; i++) { const th = lerp(thL, thR, lerp(a0, a1, i / 80)); lk.push(V2(R * Math.cos(th), zc + R * Math.sin(th))); }
          lakeM.geometry.dispose(); lakeM.geometry = ribbonGeo(lk, t => wR * (1 - .25 * close) * Math.min(1, Math.sin(Math.PI * t) * 4), 0);
          lakeM.material.color.setHex(close > .6 ? 0x3b7f9a : 0x2f7fb8);
          [thL + (thR - thL) * .07, thR - (thR - thL) * .07].forEach((th, k) => { plugs[k].position.x = R * Math.cos(th); plugs[k].position.z = zc + R * Math.sin(th); plugs[k].scale.setScalar(.2 + .45 * close); });
        }
        // mũi tên xói lở ở bờ lõm
        erodeA.forEach((a, k) => { const th = lerp(thL, thR, .2 + k * .2); const dir = new THREE.Vector3(Math.cos(th), 0, Math.sin(th)); a.position.set((R + .35) * Math.cos(th), .15, zc + (R + .35) * Math.sin(th)); a.setDirection(dir); a.setLength(.5, .22, .14); a.visible = !cut; });
        const thB = lerp(thL, thR, .5);
        lConcave.position.set((R + 1.0) * Math.cos(thB), .4, zc + (R + 1.0) * Math.sin(thB)); lConcave.visible = !cut;
        lConvex.position.set(0, .4, zc + .2); lConvex.visible = !cut && grow > .1;
        lNeck.position.set(0, .5, 2.05); lNeck.visible = !cut && grow > .45;
        lCut.position.set(0, .5, 1.75); lCut.visible = cut && p < .86;
        lLake.position.set(0, .6, zc - R + .2); lLake.visible = p > .8;
        state.mnFlow = pts;
      };
      api.onTick(dt => { if (!g.visible || !path) return; for (let i = 0; i < 70; i++) { flowK[i] = (flowK[i] + dt * .06) % 1; const q = path.getPointAt(flowK[i]); m4.makeTranslation(q.x, .07, q.y + ((i % 5) - 2) * .06); flowI.setMatrixAt(i, m4); } flowI.instanceMatrix.needsUpdate = true; });
      L('mn', 'Hướng dòng chảy →', new THREE.Vector3(-6.2, .5, 2.9), { cls: 'sm' });
    }

    // =================== 2. HỒ KIẾN TẠO ===================
    {
      const g = G.kt; const D = 8, top = 0, bot = -4;
      const LAY = [[0, -.5, 0x8ba765], [-.5, -1.4, 0xc79a62], [-1.4, -2.3, 0xa8774d], [-2.3, -3.2, 0xd4b48a], [-3.2, -4, 0x8a6d55]];
      // đứt gãy nghiêng vào trong (địa hào): x = ±(2.1 − 0.3·(top − y))
      const fx = (s, y) => s * (2.1 - .3 * (top - y));
      const prism = (poly, color) => { const sh = new THREE.Shape(poly); const geo = new THREE.ExtrudeGeometry(sh, { depth: D, bevelEnabled: false }); geo.translate(0, 0, -D / 2); return new THREE.Mesh(geo, M(color)); };
      const blocks = { L: new THREE.Group(), C: new THREE.Group(), R: new THREE.Group() };
      LAY.forEach(([y0, y1, c]) => {
        blocks.L.add(prism([V2(-7, y0), V2(fx(-1, y0), y0), V2(fx(-1, y1), y1), V2(-7, y1)], c));
        blocks.C.add(prism([V2(fx(-1, y0), y0), V2(fx(1, y0), y0), V2(fx(1, y1), y1), V2(fx(-1, y1), y1)], c));
        blocks.R.add(prism([V2(fx(1, y0), y0), V2(7, y0), V2(7, y1), V2(fx(1, y1), y1)], c));
      });
      Object.values(blocks).forEach(b => g.add(b));
      // đường đứt gãy ở mặt cắt
      const fl = s => { const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(fx(s, top + .4), top + .4, D / 2 + .02), new THREE.Vector3(fx(s, bot), bot, D / 2 + .02)]), new THREE.LineBasicMaterial({ color: 0xff3b30 })); g.add(ln); return ln; };
      fl(-1); fl(1);
      const pull = [-1, 1].map(s => { const a = api.arrow(new THREE.Vector3(s * 3.4, -2.2, D / 2 + .3), new THREE.Vector3(s * 5.4, -2.2, D / 2 + .3), 0xff5a36, .4, .25); g.add(a); return a; });
      const downA = api.arrow(new THREE.Vector3(0, 1.6, D / 2 + .3), new THREE.Vector3(0, .4, D / 2 + .3), 0xffd23f, .35, .22); g.add(downA);
      // nước
      const lake = new THREE.Mesh(new THREE.BoxGeometry(1, 1, D - .02), M(WATER, { r: .1, op: .88 })); g.add(lake);
      const streams = [-1, 1].map(s => { const pts = []; for (let i = 0; i <= 20; i++) { const t = i / 20; pts.push(new THREE.Vector3(s * lerp(6.5, 2.3, t), .03, lerp(-3.5, -1.2, t) + Math.sin(t * 6) * .3)); } const c = new THREE.CatmullRomCurve3(pts); const m = api.tube(pts, .07, 0x2f86d8); g.add(m); const f = api.flowAlong(c, { count: 12, color: 0xd9f1ff, size: .05, speed: .12, parent: g }); return [m, f]; });
      // rừng trên hai khối nâng
      for (let i = 0; i < 40; i++) { const s = i % 2 ? 1 : -1; const t = new THREE.Mesh(new THREE.ConeGeometry(.16, .5, 6), M(0x2e6b34)); t.position.set(s * (3 + Math.random() * 3.6), .25, (Math.random() - .5) * (D - 1)); g.add(t); }
      const lF = L('kt', 'Đứt gãy', new THREE.Vector3(fx(-1, -1) - .5, -.9, D / 2 + .3), { cls: 'warm', onClick: { title: 'Đứt gãy', html: 'Khi lực kéo tách vượt quá độ bền của đá, lớp đá bị <b>đứt gãy</b>; các khối đá dịch chuyển theo mặt đứt gãy.' } });
      const lG = L('kt', 'Khối sụt (địa hào)', new THREE.Vector3(0, -2.2, D / 2 + .3), { onClick: { title: 'Địa hào', html: 'Khối đá nằm giữa hai đường đứt gãy bị <b>sụt xuống</b>, tạo vùng trũng hẹp và dài – nơi hình thành hồ kiến tạo.' } });
      const lP = L('kt', '⟵ Lực kéo tách (nội lực) ⟶', new THREE.Vector3(0, -3.4, D / 2 + .3), { cls: 'sm warm' });
      const lK = L('kt', 'Hồ kiến tạo: dài, hẹp, rất sâu', new THREE.Vector3(0, 1, -1.5), { cls: 'big cold' });
      tick.kt = p => {
        const sink = 2.2 * ss(p, .08, .6), spread = .18 * ss(p, .08, .6);
        blocks.C.position.y = -sink; blocks.L.position.x = -spread; blocks.R.position.x = spread;
        pull.forEach(a => (a.visible = p > .03 && p < .7)); downA.visible = p > .08 && p < .62;
        const fill = ss(p, .62, .98); const lev = -sink + .05 + (sink - .45) * fill;
        const w = fx(1, lev) * 2 + 2 * spread; lake.visible = fill > .01; lake.scale.set(w, Math.max(.01, lev + sink), 1); lake.position.set(0, (lev - sink) / 2, 0);
        streams.forEach(([m, f]) => (m.visible = f.visible = p > .55));
        lF.visible = p > .1; lG.visible = p > .2 && p < .85; lP.visible = p < .7; lK.visible = p > .9;
      };
    }

    // =================== 3. HỒ NÚI LỬA ===================
    {
      const g = G.nl; const clip = [new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)];
      const prof = c => { // c: mức sụp đỉnh 0 → 1
        const Hs = lerp(4.0, 2.7, c), rc = lerp(.45, 2.1, c), dc = lerp(.35, 1.45, c), rb = 5.4;
        const pts = [V2(0, Hs - dc), V2(rc * .75, Hs - dc), V2(rc * .93, Hs - dc * .55), V2(rc, Hs)];
        for (let i = 1; i <= 14; i++) { const t = i / 14; pts.push(V2(lerp(rc, rb, t), Hs * Math.pow(1 - t, 1.55))); }
        return { pts, Hs, rc, dc };
      };
      const cone = new THREE.Mesh(new THREE.BufferGeometry(), M(0x857a6a, { clip, side: THREE.DoubleSide })); g.add(cone);
      const ground = new THREE.Mesh(new THREE.CylinderGeometry(7, 7, 3.2, 64), [M(0x6e5a48, { clip }), M(0x8fa860, { clip }), M(0x6e5a48, { clip })]); ground.position.y = -1.6; g.add(ground);
      const face = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: 0x6f5848 })); face.position.z = .001; g.add(face);
      const chamber = new THREE.Mesh(new THREE.CircleGeometry(1, 40), new THREE.MeshBasicMaterial({ color: 0xff5a1f })); chamber.position.set(0, -2.0, .01); g.add(chamber);
      const conduit = new THREE.Mesh(new THREE.PlaneGeometry(.32, 1), new THREE.MeshBasicMaterial({ color: 0xff7a2f })); conduit.position.z = .012; g.add(conduit);
      const wFace = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0x3a8ad6 })); wFace.position.z = .013; g.add(wFace);
      const wTop = new THREE.Mesh(new THREE.CircleGeometry(1, 48), M(WATER, { r: .1, clip })); wTop.rotation.x = -Math.PI / 2; g.add(wTop);
      const glowS = api.glow('#ff7a2f', 3); g.add(glowS);
      // phun trào: tro, đá, khói
      const N = 160; const ej = new THREE.InstancedMesh(new THREE.SphereGeometry(.09, 6, 4), new THREE.MeshBasicMaterial({ color: 0xff7a2f }), N); g.add(ej);
      const ash = new THREE.InstancedMesh(new THREE.SphereGeometry(.35, 8, 6), new THREE.MeshStandardMaterial({ color: 0x6b6b6b, transparent: true, opacity: .55, roughness: 1 }), 50); g.add(ash);
      const ed = Array.from({ length: N }, () => ({ v: new THREE.Vector3((Math.random() - .5) * 2.4, 3 + Math.random() * 3.5, -Math.random() * 1.6), t: Math.random() * 1.6 }));
      const ad = Array.from({ length: 50 }, () => ({ x: (Math.random() - .5) * 1.4, z: -Math.random() * 1.4, t: Math.random() }));
      const rain = new THREE.InstancedMesh(new THREE.CylinderGeometry(.015, .015, .25, 4), new THREE.MeshBasicMaterial({ color: 0x5aa7ff }), 160); g.add(rain);
      const rd = Array.from({ length: 160 }, () => ({ x: (Math.random() - .5) * 5, z: -Math.random() * 2.5, k: Math.random() }));
      const m4 = new THREE.Matrix4(); let cur = { p: 0, c: 0, prof: prof(0) };
      L('nl', 'Buồng mác-ma', new THREE.Vector3(1.9, -2.3, .3), { cls: 'warm', onClick: { title: 'Buồng mác-ma', html: 'Nơi tích tụ mác-ma nóng chảy ở dưới sâu. Khi phun trào, mác-ma theo <b>ống phun</b> trào lên mặt đất; buồng mác-ma rỗng dần.' } });
      const lErupt = L('nl', 'Phun trào', new THREE.Vector3(0, 6.6, -.5), { cls: 'warm' });
      const lCol = L('nl', 'Đỉnh sụp → miệng hố rộng', new THREE.Vector3(-3.2, 3.6, .3), { cls: 'sm' });
      const lLake = L('nl', 'Hồ núi lửa', new THREE.Vector3(0, 3.4, -1.2), { cls: 'big cold' });
      L('nl', 'Mặt cắt núi lửa', new THREE.Vector3(-4.6, -.6, .3), { cls: 'sm' });
      tick.nl = (p, dt, t) => {
        const c = ss(p, .42, .66); const P = prof(c); cur.prof = P;
        if (Math.abs(c - cur.c) > .003 || !cone.geometry.attributes.position) {
          cur.c = c; cone.geometry.dispose(); cone.geometry = new THREE.LatheGeometry(P.pts, 96);
          const sh = new THREE.Shape(); sh.moveTo(-7, -3.2); sh.lineTo(7, -3.2); sh.lineTo(7, 0); sh.lineTo(5.4, 0);
          for (let i = P.pts.length - 1; i >= 0; i--) sh.lineTo(P.pts[i].x, P.pts[i].y);
          for (let i = 1; i < P.pts.length; i++) sh.lineTo(-P.pts[i].x, P.pts[i].y);
          sh.lineTo(-7, 0); sh.closePath(); face.geometry.dispose(); face.geometry = new THREE.ShapeGeometry(sh, 4);
        }
        const rise = ss(p, 0, .2), erupt = ss(p, .18, .26) * (1 - ss(p, .46, .56)), empty = ss(p, .26, .6);
        const floor = P.Hs - P.dc;
        chamber.scale.set(1.9 * (1 - .55 * empty), .85 * (1 - .6 * empty), 1); chamber.material.color.setHex(p > .7 ? 0x7a3a26 : 0xff5a1f);
        const topY = lerp(-1.4, floor, rise); conduit.visible = p < .75; conduit.scale.y = Math.max(.01, topY + 1.4); conduit.position.y = (topY - 1.4) / 2 - .6 + .6; conduit.position.y = (-1.6 + topY) / 2; conduit.scale.y = Math.max(.01, topY + 1.6);
        conduit.material.color.setHex(p > .6 ? 0x5a4a40 : 0xff7a2f);
        glowS.visible = erupt > .02; glowS.position.set(0, floor + .5, -.2); glowS.material.opacity = erupt;
        for (let i = 0; i < N; i++) { const d = ed[i]; d.t += dt; if (d.t > 1.6) { d.t = 0; } const s = erupt > .05 ? 1 : 0; m4.makeScale(s, s, s).setPosition(d.v.x * d.t, floor + d.v.y * d.t - 4.9 * d.t * d.t * .55, d.v.z * d.t); ej.setMatrixAt(i, m4); }
        ej.instanceMatrix.needsUpdate = true;
        for (let i = 0; i < 50; i++) { const d = ad[i]; d.t = (d.t + dt * .12) % 1; const s = erupt * (.6 + d.t * 1.6); m4.makeScale(s, s, s).setPosition(d.x * (1 + d.t * 3), floor + .6 + d.t * 6, d.z * (1 + d.t * 2)); ash.setMatrixAt(i, m4); }
        ash.instanceMatrix.needsUpdate = true;
        // nước mưa đọng lại thành hồ
        const fill = ss(p, .7, .98); const lev = floor + (P.dc * .85) * fill; const rAt = y => { // bán kính trong miệng hố theo độ cao
          const a = P.pts[1], b = P.pts[2], cc = P.pts[3]; if (y <= b.y) return lerp(a.x, b.x, (y - a.y) / Math.max(.001, b.y - a.y)); return lerp(b.x, cc.x, (y - b.y) / Math.max(.001, cc.y - b.y)); };
        const rw = rAt(lev); wTop.visible = wFace.visible = fill > .01; wTop.scale.set(rw, rw, 1); wTop.position.y = lev;
        wFace.scale.set(rw * 2 * .97, Math.max(.01, lev - floor), 1); wFace.position.y = (lev + floor) / 2;
        const raining = p > .66 && p < .99;
        for (let i = 0; i < 160; i++) { const d = rd[i]; d.k = (d.k + dt * .9) % 1; const s = raining ? 1 : 0; m4.makeScale(s, s, s).setPosition(d.x, 7 - d.k * (7 - Math.max(floor, 1)), d.z); rain.setMatrixAt(i, m4); }
        rain.instanceMatrix.needsUpdate = true;
        lErupt.visible = erupt > .2; lCol.visible = p > .5 && p < .8; lCol.position.set(-P.rc - .8, P.Hs + .4, .3); lLake.visible = p > .88; lLake.position.y = lev + .7;
      };
    }

    // =================== 4. HỒ BĂNG HÀ ===================
    {
      const g = G.bh; const X0 = -6.5, X1 = 6.5, Zh = 4.5, NX = 130, NZ = 90;
      const st = { carve: 0, mor: 0 };
      const base = (x, z) => { const az = Math.abs(z); const wv = lerp(.25, 1.7, st.carve);
        let y = 1.0 - .12 * x + 3.1 * ss(az, wv, 4.3) + 2.6 * ss(-x, 3.6, 6.5) * (1 - .3 * ss(az, 2, 4));
        y -= 1.15 * st.carve * Math.exp(-(((x - .6) ** 2) / 4.2 + (z ** 2) / 1.5));
        y += .75 * st.mor * Math.exp(-((x - 4.3) ** 2) / .22) * (1 - ss(az, 2.3, 3.4));
        return y; };
      const tGeo = new THREE.PlaneGeometry(X1 - X0, Zh * 2, NX, NZ); tGeo.rotateX(-Math.PI / 2);
      const tP = tGeo.attributes.position; const tC = new Float32Array(tP.count * 3); tGeo.setAttribute('color', new THREE.BufferAttribute(tC, 3));
      g.add(new THREE.Mesh(tGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 })));
      const sk = new THREE.Mesh(new THREE.BufferGeometry(), M(0x6d5c4b)); g.add(sk);
      const skE = new THREE.Mesh(new THREE.BufferGeometry(), M(0x6d5c4b)); skE.rotation.y = Math.PI / 2; skE.position.x = X1; skE.scale.x = -1; g.add(skE);
      const gGeo = new THREE.PlaneGeometry(1, 1, 110, 44); gGeo.rotateX(-Math.PI / 2); const gP = gGeo.attributes.position;
      const glacier = new THREE.Mesh(gGeo, M(0xa9d8f0, { r: .3 })); g.add(glacier);
      const lake = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), M(0x3f8fc9, { r: .1 })); lake.rotation.x = -Math.PI / 2; g.add(lake);
      const flowA = [-1.2, 1.2].map(z => { const a = api.arrow(new THREE.Vector3(), new THREE.Vector3(1, 0, 0), 0xffffff, .35, .2); g.add(a); a.userData.z = z; return a; });
      const meltI = new THREE.InstancedMesh(new THREE.SphereGeometry(.05, 6, 4), new THREE.MeshBasicMaterial({ color: 0xdff4ff }), 40); g.add(meltI); const mk = Array.from({ length: 40 }, () => ({ k: Math.random(), z: (Math.random() - .5) * 2 }));
      const c = new THREE.Color(); let xt = -6.5, Tm = 0, lastP = -1, lev = 0;
      const lCarve = L('bh', 'Băng bào mòn, khoét lòng chảo', new THREE.Vector3(.6, 3.2, 0), { cls: 'sm', onClick: { title: 'Băng bào mòn', html: 'Sông băng rất nặng, mang theo đá vụn ở đáy, trượt chậm xuống thung lũng và <b>bào mòn</b> đáy, sườn: thung lũng chữ V thành chữ U, nhiều chỗ bị khoét sâu thành <b>lòng chảo</b>.' } });
      const lMor = L('bh', 'Băng tích chắn ngang', new THREE.Vector3(4.3, 2.0, 2.2), { cls: 'warm', onClick: { title: 'Băng tích', html: 'Đất đá do băng mang theo bị đẩy, bồi lại ở lưỡi băng tạo thành dải <b>băng tích</b> cao, chắn ngang thung lũng như một con đê tự nhiên.' } });
      const lMelt = L('bh', 'Khí hậu ấm lên, băng tan, lùi dần', new THREE.Vector3(-2.5, 3.6, 0), { cls: 'sm cold' });
      const lLake = L('bh', 'Hồ băng hà', new THREE.Vector3(.8, 2.2, 0), { cls: 'big cold' });
      const lGl = L('bh', 'Sông băng chảy →', new THREE.Vector3(-3.5, 4.2, 0), { cls: 'sm' });
      tick.bh = (p, dt) => {
        if (Math.abs(p - lastP) > 1e-4) {
          lastP = p; st.carve = ss(p, .05, .45); st.mor = ss(p, .15, .5);
          for (let i = 0; i < tP.count; i++) { const x = tP.getX(i), z = tP.getZ(i); const y = base(x, z); tP.setY(i, y);
            if (y > 4.2) c.setRGB(.95, .97, 1); else if (y > 2.9) c.setRGB(.55, .53, .5); else c.setRGB(.42, .56, .32).lerp(new THREE.Color(.58, .52, .42), ss(y, 2, 2.9));
            if (st.mor > .05 && Math.abs(x - 4.3) < .6 && Math.abs(z) < 3) c.lerp(new THREE.Color(.62, .55, .45), .7 * st.mor);
            tC.set([c.r, c.g, c.b], i * 3); }
          tP.needsUpdate = true; tGeo.attributes.color.needsUpdate = true; tGeo.computeVertexNormals();
          // mép trước
          const pts = []; for (let i = 0; i <= 80; i++) { const x = X0 + i / 80 * (X1 - X0); pts.push(V2(x, base(x, Zh))); }
          sk.geometry.dispose(); sk.geometry = new THREE.ShapeGeometry(new THREE.Shape([V2(X0, -1), ...pts, V2(X1, -1)])); sk.position.z = Zh;
          const pe = []; for (let i = 0; i <= 80; i++) { const z = -Zh + i / 80 * Zh * 2; pe.push(V2(z, base(X1, z))); }
          skE.geometry.dispose(); skE.geometry = new THREE.ShapeGeometry(new THREE.Shape([V2(-Zh, -1), ...pe, V2(Zh, -1)]));
          // sông băng: tiến tới, rồi lùi khi khí hậu ấm lên
          xt = p < .45 ? lerp(-3.2, 4.0, ss(p, .02, .3)) : lerp(4.0, -6.6, ss(p, .45, .8));
          Tm = 1.3 * (p < .45 ? ss(p, .02, .22) : 1 - .55 * ss(p, .45, .8));
          for (let i = 0; i < gP.count; i++) { const ix = i % 111, iz = Math.floor(i / 111); const x = lerp(X0, 4.4, ix / 110), z = lerp(-2.2, 2.2, iz / 44);
            const T = Tm * Math.sqrt(clamp((xt - x) / 2.2, 0, 1)) * Math.max(0, 1 - Math.pow(Math.abs(z) / 2.2, 4)); gP.setXYZ(i, x, base(x, z) + (T > .03 ? T : -.3), z); }
          gP.needsUpdate = true; gGeo.computeVertexNormals(); glacier.visible = p > .02 && xt > X0 + .1;
          // hồ: nước băng tan, nước mưa đọng trong lòng chảo, bị băng tích chắn lại
          const fill = ss(p, .74, .98); const bottom = base(.6, 0), crest = base(4.3, 0); lev = lerp(bottom + .03, crest - .1, fill);
          lake.visible = fill > .01; lake.scale.set(4.2 - (-3.6), 6, 1); lake.position.set((4.2 - 3.6) / 2, lev, 0);
          flowA.forEach(a => { const x0 = Math.min(xt - 1.6, 2); a.position.set(x0 - 1.2, base(x0, a.userData.z) + Tm + .25, a.userData.z); a.visible = p > .1 && p < .45; });
          lCarve.visible = p > .15 && p < .5; lMor.visible = p > .35; lMelt.visible = p > .48 && p < .8; lLake.visible = p > .88; lLake.position.y = lev + .8; lGl.visible = p > .05 && p < .45;
        }
        const melting = p > .48 && p < .97;
        for (let i = 0; i < 40; i++) { const d = mk[i]; d.k = (d.k + dt * .25) % 1; const x = lerp(xt, Math.min(xt + 2.5, 3.8), d.k); const s = melting && xt > -6 ? 1 : 0; m4b.makeScale(s, s, s).setPosition(x, Math.max(base(x, d.z), lev) + .06, d.z); meltI.setMatrixAt(i, m4b); }
        meltI.instanceMatrix.needsUpdate = true;
      };
    }

    // =================== 5. HỒ NHÂN TẠO ===================
    {
      const g = G.nt; const X0 = -6.5, X1 = 6.5, Zh = 4.5, DAM = 1.6;
      const rz = x => .35 * Math.sin(x * .7);
      const floor = x => x < DAM - .3 ? 0 : -.55 * ss(x, DAM - .3, DAM + 1.2);
      const hT = (x, z) => { const d = Math.abs(z - rz(x)); return floor(x) + .02 * x * 0 + 3.4 * ss(d, .35, 4.2) + .5 * Math.sin(x * .9 + z * .5) * ss(d, 1.5, 4); };
      const tGeo = new THREE.PlaneGeometry(X1 - X0, Zh * 2, 130, 90); tGeo.rotateX(-Math.PI / 2);
      const tP = tGeo.attributes.position; const tC = new Float32Array(tP.count * 3); const c = new THREE.Color();
      for (let i = 0; i < tP.count; i++) { const x = tP.getX(i), z = tP.getZ(i); const y = hT(x, z); tP.setY(i, y); c.setRGB(.42, .58, .3).lerp(new THREE.Color(.33, .47, .25), ss(y, 1, 3)); if (y < .5) c.lerp(new THREE.Color(.62, .66, .4), .6); tC.set([c.r, c.g, c.b], i * 3); }
      tGeo.setAttribute('color', new THREE.BufferAttribute(tC, 3)); tGeo.computeVertexNormals();
      g.add(new THREE.Mesh(tGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .95 })));
      { const pts = []; for (let i = 0; i <= 80; i++) { const z = -Zh + i / 80 * Zh * 2; pts.push(V2(z, hT(X1, z))); } const m = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([V2(-Zh, -1.2), ...pts, V2(Zh, -1.2)])), M(0x6d5c4b)); m.rotation.y = Math.PI / 2; m.position.x = X1; m.scale.x = -1; g.add(m); }
      { const pts = []; for (let i = 0; i <= 80; i++) { const x = X0 + i / 80 * (X1 - X0); pts.push(V2(x, hT(x, Zh))); } const m = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([V2(X0, -1.2), ...pts, V2(X1, -1.2)])), M(0x6d5c4b)); m.position.z = Zh; g.add(m); }
      // rừng trên sườn đồi
      for (let i = 0; i < 90; i++) { const x = lerp(X0 + .3, X1 - .3, Math.random()), z = (Math.random() - .5) * (Zh * 2 - .5); const y = hT(x, z); if (y < 1.2 || Math.abs(x - DAM) < .6) continue; const t = new THREE.Mesh(new THREE.ConeGeometry(.15, .45, 6), M(0x2e6b34)); t.position.set(x, y + .22, z); g.add(t); }
      // làng ven sông (sẽ bị ngập khi tích nước)
      const village = new THREE.Group(); g.add(village);
      [[-4.6, 1.0], [-3.8, -1.2], [-2.4, 1.3], [-1.3, -1.1], [-4.9, -.9]].forEach(([x, z]) => { const hs = new THREE.Group(); hs.add(new THREE.Mesh(new THREE.BoxGeometry(.38, .26, .32), M(0xf1e3c8))); const r = new THREE.Mesh(new THREE.ConeGeometry(.32, .24, 4), M(0xb5523a)); r.position.y = .24; r.rotation.y = Math.PI / 4; hs.add(r); hs.position.set(x, hT(x, z) + .13, z); village.add(hs); });
      // mặt nước: sông/hồ phía trên đập và sông phía dưới đập
      const up = new THREE.Mesh(new THREE.PlaneGeometry(DAM - X0 - .05, Zh * 2 - .1), M(WATER, { r: .12 })); up.rotation.x = -Math.PI / 2; up.position.x = (X0 + DAM) / 2; g.add(up);
      const down = new THREE.Mesh(new THREE.PlaneGeometry(X1 - DAM - .1, Zh * 2 - .1), M(WATER, { r: .12 })); down.rotation.x = -Math.PI / 2; down.position.set((DAM + X1) / 2 + .05, -.47, 0); g.add(down);
      // đập, nhà máy thuỷ điện, đường dây
      const dam = new THREE.Mesh(new THREE.BoxGeometry(.7, 1, 6.4), M(0xbfc3c7, { r: .7 })); dam.position.x = DAM; g.add(dam);
      const crest = new THREE.Mesh(new THREE.BoxGeometry(.8, .08, 6.4), M(0x8d9399)); g.add(crest);
      const plant = new THREE.Group(); plant.add(new THREE.Mesh(new THREE.BoxGeometry(.6, .45, 1.2), M(0x6f8aa0))); { const rf = new THREE.Mesh(new THREE.BoxGeometry(.62, .06, 1.22), M(0x3f5466)); rf.position.y = .25; plant.add(rf); }
      plant.position.set(DAM + .75, -.3, rz(DAM + .75) + .9); g.add(plant);
      const pylons = new THREE.Group(); g.add(pylons);
      [[3.2, 2.2], [4.6, 2.9], [6, 3.6]].forEach(([x, z]) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(.03, .07, 1.3, 6), M(0x9aa3ab)); p.position.set(x, hT(x, z) + .65, z); pylons.add(p); const a = new THREE.Mesh(new THREE.BoxGeometry(.5, .04, .04), M(0x9aa3ab)); a.position.set(x, hT(x, z) + 1.25, z); a.rotation.y = -.5; pylons.add(a); });
      const wire = new THREE.Line(new THREE.BufferGeometry().setFromPoints([[DAM + .75, 0, rz(DAM + .75) + .9], [3.2, 2.2], [4.6, 2.9], [6, 3.6]].map((v, i) => i ? new THREE.Vector3(v[0], hT(v[0], v[1]) + 1.25, v[1]) : new THREE.Vector3(v[0], .05, v[2]))), new THREE.LineBasicMaterial({ color: 0x333a40 })); pylons.add(wire);
      const outflow = api.flowAlong(new THREE.CatmullRomCurve3([new THREE.Vector3(DAM + .45, -.1, rz(DAM)), new THREE.Vector3(3.5, -.4, rz(3.5)), new THREE.Vector3(6.4, -.42, rz(6.4))]), { count: 22, color: 0xdff4ff, size: .05, speed: .12, parent: g });
      const upflow = api.flowAlong(new THREE.CatmullRomCurve3([-6.4, -4, -2, 0, DAM + .4].map(x => new THREE.Vector3(x, .1, rz(x)))), { count: 26, color: 0xdff4ff, size: .05, speed: .1, parent: g });
      const lDam = L('nt', 'Đập ngăn sông', new THREE.Vector3(DAM, 3.2, -2.6), { cls: 'warm', onClick: { title: 'Đập', html: 'Con người xây <b>đập</b> chắn ngang dòng sông ở chỗ thung lũng hẹp. Nước bị giữ lại phía trên đập, dâng lên và lan rộng thành <b>hồ chứa</b>.' } });
      const lRes = L('nt', 'Hồ chứa (lòng hồ)', new THREE.Vector3(-2.5, 3, 0), { cls: 'big cold', onClick: { title: 'Hồ nhân tạo', html: 'Hồ nhân tạo dùng để <b>phát điện</b>, <b>thuỷ lợi</b> (tưới tiêu), <b>cắt lũ</b> cho hạ du, cấp nước sinh hoạt, nuôi thuỷ sản, giao thông, du lịch.' } });
      const lVil = L('nt', 'Nhà dân, ruộng đất bị ngập → di dân', new THREE.Vector3(-3.6, 1.5, 1.9), { cls: 'sm warm', onClick: { title: 'Mặt trái của hồ nhân tạo', html: 'Lòng hồ làm <b>ngập</b> làng mạc, đất canh tác, rừng → phải <b>di dân, tái định cư</b>. Đập còn giữ lại phù sa, làm thay đổi dòng chảy và hệ sinh thái ở hạ du.' } });
      const lPow = L('nt', 'Nhà máy thuỷ điện', new THREE.Vector3(DAM + 1.2, .9, rz(DAM) + 1.6), { cls: 'sm', onClick: { title: 'Thuỷ điện', html: 'Nước từ hồ chảy qua đường ống làm quay <b>tua-bin</b> phát điện, rồi trả lại dòng sông phía dưới đập.' } });
      let lastP = -1;
      tick.nt = p => {
        if (Math.abs(p - lastP) < 1e-4) return; lastP = p;
        const build = ss(p, .22, .5), fill = ss(p, .52, .95);
        const dh = lerp(.05, 3.0, build); dam.scale.y = dh; dam.position.y = dh / 2 - .5; dam.visible = build > .01; crest.position.set(DAM, dh - .5 + .04, 0); crest.visible = build > .9;
        const lev = lerp(.08, 2.45, fill); up.position.y = lev;
        village.children.forEach(hs => (hs.visible = hs.position.y + .1 > lev));
        plant.visible = pylons.visible = build > .95; outflow.visible = p < .22 || fill > .15; upflow.visible = fill < .05;
        lDam.visible = build > .3; lRes.visible = fill > .6; lRes.position.y = lev + .8; lVil.visible = fill > .2 && fill < .75; lPow.visible = build > .95;
      };
      L('nt', 'Hướng dòng chảy →', new THREE.Vector3(-5.6, .9, rz(-5.6) - .8), { cls: 'sm' });
    }

    // =================== điều khiển chung ===================
    const VIEW = { mn: [[0, 10.5, 11], [0, 0, -.6]], kt: [[5, 6, 13], [0, -1.2, 0]], nl: [[3.5, 5.5, 13], [0, 1.2, 0]], bh: [[12.5, 8.5, 6.5], [-.5, 1.2, 0]], nt: [[10.5, 7, 7.5], [-1, .8, 0]] };
    state.type = 'mn'; state.p = 0; state.play = false; let lastT = 0, syncing = false;
    const setP = v => { syncing = true; api.set('p', Math.round(v * 100)); syncing = false; };
    function render(dt = 0) {
      Object.entries(G).forEach(([k, g]) => (g.visible = k === state.type));
      tick[state.type](state.p, dt, lastT);
      const T = TYPES[state.type];
      const stage = state.type === 'mn' ? (state.p < .62 ? 'Sông uốn khúc: xói lở bờ lõm, bồi tụ bờ lồi' : state.p < .72 ? 'Mùa lũ: nước phá eo đất' : 'Khúc uốn cũ bị bịt hai đầu → hồ')
        : state.type === 'kt' ? (state.p < .08 ? 'Lớp đá chịu lực kéo tách' : state.p < .62 ? 'Đứt gãy, khối giữa sụt xuống' : 'Nước đổ vào vùng trũng → hồ')
          : state.type === 'nl' ? (state.p < .2 ? 'Mác-ma dâng lên theo ống phun' : state.p < .46 ? 'Núi lửa phun trào' : state.p < .68 ? 'Buồng mác-ma rỗng, đỉnh núi sụp' : 'Nước mưa đọng trong miệng hố → hồ')
            : state.type === 'bh' ? (state.p < .45 ? 'Sông băng chảy, bào mòn khoét lòng chảo, đẩy đất đá thành băng tích' : state.p < .76 ? 'Khí hậu ấm lên, sông băng tan và lùi dần' : 'Nước đọng trong lòng chảo, bị băng tích chắn → hồ')
              : (state.p < .22 ? 'Sông chảy tự nhiên trong thung lũng' : state.p < .52 ? 'Con người xây đập chắn ngang sông' : 'Nước dâng sau đập, ngập thung lũng → hồ chứa');
      api.readout(`<b>${T.name}</b> · ${Math.round(state.p * 100)}%<div style="margin-top:4px">Lực tạo thành: <b>${T.force}</b></div><div style="margin-top:4px;color:#bfe6ff">▸ ${stage}</div><div style="margin-top:6px;font-size:12px;opacity:.85">VD: ${T.ex}</div>`);
      if (state.p >= .97) api.done(state.type);
    }
    state.show = (type, p = 0, play = false) => {
      state.type = type; state.p = p; api.set('type', type); setP(p); state.play = play; api.set('play', play);
      api.fly(...VIEW[type]); render();
    };
    api.onTick((dt, t) => { lastT = t; if (state.play) { state.p = Math.min(1, state.p + dt * .055); setP(state.p); if (state.p >= 1) { state.play = false; api.set('play', false); } } render(dt); });
    api.heading('Loại hồ');
    api.choice('type', '', [{ v: 'mn', t: 'Hồ móng ngựa' }, { v: 'bh', t: 'Hồ băng hà' }, { v: 'kt', t: 'Hồ kiến tạo' }, { v: 'nl', t: 'Hồ núi lửa' }, { v: 'nt', t: 'Hồ nhân tạo' }], 'mn', v => { if (v !== state.type) { state.type = v; state.p = 0; setP(0); state.play = true; api.set('play', true); api.fly(...VIEW[v]); } });
    api.heading('Quá trình hình thành');
    api.slider('p', 'Tiến trình', { min: 0, max: 100, value: 0, format: v => v + '%' }, v => { if (!syncing) state.p = v / 100; });
    api.toggle('play', 'Tự chạy quá trình', false, v => { state.play = v; if (v && state.p >= 1) state.p = 0; });
    render();
  },
};

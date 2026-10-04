// 3D-39 · Bài 39 – Môi trường và tài nguyên thiên nhiên
import { THREE, vec, mat, boxM, cylM, mesh, tree, forest, house, building, water, stage, rng, fmtN, emitter } from '../kit.js';

// tài nguyên để phân loại theo khả năng bị hao kiệt
const BINS = { non: ['Không khôi phục được', 0xc0392b], re: ['Có thể khôi phục', 0x27ae60], inf: ['Không bị hao kiệt', 0xf1c40f] };
const ITEMS = [
  ['coal', 'Than đá', 'non', 'Khoáng sản hình thành qua hàng triệu năm; khai thác hết sẽ không phục hồi được trong thời gian lịch sử loài người.'],
  ['oil', 'Dầu mỏ', 'non', 'Nhiên liệu hoá thạch, trữ lượng có hạn.'],
  ['iron', 'Quặng sắt', 'non', 'Khoáng sản kim loại – tài nguyên không khôi phục được (có thể tái chế kim loại để tiết kiệm).'],
  ['forest', 'Rừng', 're', 'Có thể tái sinh, trồng mới nếu khai thác hợp lí, không vượt quá khả năng phục hồi.'],
  ['soil', 'Đất trồng', 're', 'Có thể phục hồi độ phì nếu canh tác hợp lí, bón phân, chống xói mòn; nếu thoái hoá nặng thì rất khó phục hồi.'],
  ['fish', 'Cá biển', 're', 'Sinh sản, tăng đàn tự nhiên; khai thác quá mức làm cạn kiệt nguồn lợi.'],
  ['sun', 'Năng lượng Mặt Trời', 'inf', 'Nguồn năng lượng gần như vô tận, không bị hao kiệt khi sử dụng.'],
  ['wind', 'Năng lượng gió', 'inf', 'Không bị hao kiệt; sử dụng không làm giảm nguồn tài nguyên.'],
];

export default {
  id: '3D-39', code: 'DL10.B39', title: 'Môi trường và tài nguyên thiên nhiên',
  objectives: [
    { c: 'DL10.13.01', t: 'Khái niệm, đặc điểm của môi trường và tài nguyên thiên nhiên' },
    { c: 'DL10.13.02', t: 'Vai trò của môi trường, tài nguyên thiên nhiên đối với xã hội loài người' },
  ],
  sources: [
    { t: 'Luật Bảo vệ môi trường 2020 (Luật số 72/2020/QH14), Điều 3', u: 'https://vanban.chinhphu.vn/' },
    { t: 'UNEP – Global Resources Outlook', u: 'https://www.unep.org/resources/Global-Resource-Outlook-2024' },
    { t: 'SGK Địa lí 10 – Kết nối tri thức, Bài 39', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Mô phỏng trữ lượng tài nguyên là minh hoạ định tính (đơn vị quy ước).',
  view: { pos: [0, 8, 15], target: [0, 1, 0] },
  steps: [
    { title: 'Môi trường', html: '<p><b>Môi trường</b> bao gồm các yếu tố vật chất tự nhiên và nhân tạo quan hệ mật thiết với nhau, bao quanh con người, có ảnh hưởng đến đời sống, kinh tế, xã hội, sự tồn tại, phát triển của con người, sinh vật và tự nhiên (Luật Bảo vệ môi trường 2020).</p><ul><li><b>Môi trường tự nhiên</b>: đất, nước, không khí, sinh vật…</li><li><b>Môi trường xã hội</b>: quan hệ giữa người với người.</li><li><b>Môi trường nhân tạo</b>: nhà cửa, đường sá, nhà máy… do con người tạo ra.</li></ul>',
      enter: a => { a.fly([0, 8, 15], [0, 1, 0]); } },
    { title: 'Vai trò của môi trường', html: '<ul><li>Là <b>không gian sống</b> của con người.</li><li>Là nơi <b>cung cấp tài nguyên</b> cho sản xuất, đời sống.</li><li>Là nơi <b>chứa đựng, phân huỷ chất thải</b> do con người tạo ra.</li><li>Lưu trữ, cung cấp thông tin; bảo vệ con người trước các tác động bên ngoài (tầng ô-dôn…).</li></ul><p>Môi trường có vai trò rất quan trọng nhưng <b>không có vai trò quyết định</b> sự phát triển của xã hội loài người.</p>',
      enter: a => { a.fly([-5, 7, 12], [-3, 1, 0]); } },
    { title: 'Tài nguyên thiên nhiên', html: '<p>Là các thành phần của tự nhiên mà con người có thể sử dụng làm phương tiện sản xuất và đối tượng tiêu dùng.</p><ul><li>Theo <b>thuộc tính tự nhiên</b>: đất, nước, khí hậu, sinh vật, khoáng sản…</li><li>Theo <b>công dụng kinh tế</b>: tài nguyên nông nghiệp, công nghiệp, du lịch…</li><li>Theo <b>khả năng bị hao kiệt</b>: không bị hao kiệt; có thể bị hao kiệt (không khôi phục được hoặc khôi phục được).</li></ul><div class="tip">Chọn một nhóm ở mục điều khiển, rồi bấm vào tài nguyên thuộc nhóm đó.</div>',
      enter: a => { a.fly([0, 9, 11], [0, 0, 2]); } },
    { title: 'Khai thác và sử dụng hợp lí', html: '<p>Tài nguyên không khôi phục được sẽ <b>cạn kiệt</b> theo thời gian khai thác; tài nguyên khôi phục được chỉ bền vững khi khai thác <b>không vượt quá khả năng phục hồi</b>.</p><div class="tip">Kéo thanh <b>Số năm khai thác</b> và chọn mức khai thác rừng.</div>',
      enter: a => { a.fly([13, 5, 9], [11.5, 1.5, -.5]); } },
  ],
  tasks: [
    { id: 'non', text: 'Xếp đúng <b>2 tài nguyên không khôi phục được</b>.' },
    { id: 're', text: 'Xếp đúng <b>2 tài nguyên có thể khôi phục</b>.' },
    { id: 'inf', text: 'Xếp đúng <b>1 tài nguyên không bị hao kiệt</b>.' },
    { id: 'sus', text: 'Tìm mức khai thác rừng để trữ lượng rừng <b>không giảm</b> sau 50 năm.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    stage(api, { bg: 0xa8d4ef });
    scene.add(boxM(40, .3, 26, 0x7aa65a, [0, -.16, 0]));
    // ba thùng phân loại
    const binPos = { non: [-5, 0, -4], re: [0, 0, -4.6], inf: [5, 0, -4] }; const cnt = { non: 0, re: 0, inf: 0 }; const need = { non: 2, re: 2, inf: 1 };
    Object.entries(BINS).forEach(([k, [n, c]]) => { const g = new THREE.Group(); g.position.set(...binPos[k]); scene.add(g); g.add(boxM(3.2, .2, 2.2, c, [0, .1, 0])); g.add(boxM(3.2, .7, .12, c, [0, .35, -1.05])); g.add(boxM(.12, .7, 2.2, c, [-1.55, .35, 0])); g.add(boxM(.12, .7, 2.2, c, [1.55, .35, 0])); api.label(n, { cls: 'big', pos: vec(0, 1.3, -1), parent: g }); api.hotspot(g, { title: n, html: { non: 'Hình thành trong thời gian địa chất rất dài; dùng hết sẽ không phục hồi được (khoáng sản).', re: 'Có khả năng tái tạo, phục hồi nếu khai thác hợp lí (đất, sinh vật, nước…).', inf: 'Không bị hao kiệt khi sử dụng (năng lượng Mặt Trời, gió, thuỷ triều…).' }[k] }); });
    // các tài nguyên
    const make = id => {
      const g = new THREE.Group();
      if (id === 'coal') for (let i = 0; i < 5; i++) g.add(mesh(new THREE.DodecahedronGeometry(.22), 0x222222, [(i % 3) * .3 - .3, .2 + Math.floor(i / 3) * .25, 0], { flat: true }));
      else if (id === 'oil') { g.add(cylM(.25, .25, .7, 0x1f3b5a, [0, .35, 0])); g.add(cylM(.26, .26, .05, 0xf39c12, [0, .5, 0])); }
      else if (id === 'iron') for (let i = 0; i < 4; i++) g.add(mesh(new THREE.DodecahedronGeometry(.2), 0x8e4a2a, [(i % 2) * .3 - .15, .2 + Math.floor(i / 2) * .22, 0], { flat: true, metal: .4 }));
      else if (id === 'forest') { g.add(tree({ h: 1 })); const t = tree({ h: .8, kind: 'cone' }); t.position.x = .4; g.add(t); }
      else if (id === 'soil') { g.add(boxM(.8, .25, .8, 0x6b4a2b, [0, .12, 0])); g.add(boxM(.8, .06, .8, 0x4a7a2c, [0, .27, 0])); }
      else if (id === 'fish') { const b = mesh(new THREE.SphereGeometry(.22, 12, 8), 0x5dade2, [0, .4, 0]); b.scale.set(1.6, .8, .6); g.add(b); const t = mesh(new THREE.ConeGeometry(.15, .3, 4), 0x5dade2, [-.42, .4, 0]); t.rotation.z = Math.PI / 2; g.add(t); }
      else if (id === 'sun') g.add(mesh(new THREE.SphereGeometry(.35, 16, 12), 0xffd34d, [0, .6, 0], { emissive: 0xffa000 }));
      else if (id === 'wind') { g.add(cylM(.03, .05, 1.2, 0xffffff, [0, .6, 0])); for (let i = 0; i < 3; i++) { const b = boxM(.06, .5, .02, 0xffffff, [0, .25, 0]); const p = new THREE.Group(); p.position.set(0, 1.2, .05); p.rotation.z = i * 2.09; p.add(b); g.add(p); } }
      return g;
    };
    const R = rng(5); const order = ITEMS.map((x, i) => [x, R()]).sort((a, b) => a[1] - b[1]).map(x => x[0]);
    order.forEach(([id, n, cls, d], i) => {
      const g = make(id); const home = vec(-7 + i * 2, 0, 2.6); g.position.copy(home); scene.add(g); g.userData.home = home;
      const l = api.label(n, { cls: 'sm', pos: vec(0, 1.6, 0), parent: g });
      api.hotspot(g, () => {
        if (g.userData.done) return { title: n, html: `Đã xếp vào nhóm <b>${BINS[cls][0]}</b>. ${d}` };
        const pick = state.bin;
        if (!pick || pick === 'none') return { title: n, html: `Em hãy chọn một nhóm ở mục điều khiển trước khi bấm.<br>${d}` };
        if (pick === cls) { g.userData.done = true; const b = binPos[cls]; const k = cnt[cls]++; g.userData.to = vec(b[0] - .9 + (k % 3) * .9, .2, b[2] + .3); if (cnt[cls] >= need[cls]) api.done(cls); return { title: `✓ ${n}`, html: `Đúng: thuộc nhóm <b>${BINS[cls][0]}</b>.<br>${d}` }; }
        api.track('control', { id: 'sort_wrong', value: id }); return { title: `✗ ${n}`, html: `Chưa đúng – ${n.toLowerCase()} không thuộc nhóm “${BINS[pick][0]}”. Hãy thử nhóm khác.` };
      });
    });
    api.onTick(dt => scene.children.forEach(o => { if (o.userData.to) { o.position.lerp(o.userData.to, Math.min(1, dt * 3)); } }));
    // mô phỏng trữ lượng
    const T = new THREE.Group(); T.position.set(11.5, 0, -.5); scene.add(T);
    const tank = (x, col, name) => { const g = new THREE.Group(); g.position.x = x; T.add(g); g.add(boxM(1.4, 3, 1.4, 0xffffff, [0, 1.5, 0], { opacity: .2 })); const f = boxM(1.3, 1, 1.3, col, [0, .5, 0], { unique: true }); g.add(f); api.label(name, { cls: 'sm', pos: vec(0, x < 0 ? 3.5 : 3.95, 0), parent: g }); return f; };
    const fC = tank(-1.3, 0x333333, 'Than (không khôi phục)'), fF = tank(1.3, 0x2f7d3a, 'Rừng (khôi phục được)');
    const sim = () => {
      const y = state.y; const coal = Math.max(0, 100 - y * 2.2); let f = 100; const cut = state.rate === 'over' ? 6 : 3; for (let i = 0; i < y; i++) { f = f - cut + 3 * (f / 100); f = Math.max(0, Math.min(100, f)); }
      fC.scale.y = Math.max(.01, coal / 100 * 2.9); fC.position.y = fC.scale.y / 2; fF.scale.y = Math.max(.01, f / 100 * 2.9); fF.position.y = fF.scale.y / 2;
      api.readout(`<b>Sau ${y} năm khai thác</b><br>Than: còn ${fmtN(coal, 0)}% trữ lượng${coal <= 0 ? ' – <b>cạn kiệt</b>' : ''}<br>Rừng (${state.rate === 'over' ? 'khai thác quá mức' : 'khai thác hợp lí'}): còn ${fmtN(f, 0)}%`);
      if (state.ready && state.rate === 'ok' && y >= 50 && f >= 99) api.done('sus');
    };
    api.heading('Phân loại tài nguyên');
    api.choice('bin', 'Nhóm đang chọn', [{ v: 'non', t: 'Không khôi phục' }, { v: 're', t: 'Khôi phục được' }, { v: 'inf', t: 'Không hao kiệt' }], '', v => { state.bin = v; });
    api.heading('Trữ lượng theo thời gian');
    state.y = 0; state.rate = 'over';
    api.choice('rate', 'Khai thác rừng', [{ v: 'over', t: 'Quá mức' }, { v: 'ok', t: 'Hợp lí (≤ khả năng phục hồi)' }], 'over', v => { state.rate = v; sim(); });
    api.slider('y', 'Số năm khai thác', { min: 0, max: 60, step: 1, value: 0, format: v => v + ' năm' }, v => { state.y = v; sim(); });
    api.legend(Object.values(BINS).map(([t, c]) => ({ t, c: '#' + c.toString(16).padStart(6, '0') })));
    state.ready = true; sim();
  },
};

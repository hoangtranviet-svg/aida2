// 3D-19 · Bài 19 – Quy mô dân số, gia tăng dân số và cơ cấu dân số thế giới
import { THREE } from '../core.js';

const AGES = Array.from({ length: 17 }, (_, i) => (i < 16 ? `${i * 5}–${i * 5 + 4}` : '80+'));
// ba dạng tháp tiêu biểu (tỉ lệ tương đối theo nhóm tuổi – dạng mô phỏng)
const SHAPES = {
  expand: AGES.map((_, i) => Math.exp(-i * 5 / 32)),
  stable: AGES.map((_, i) => { const a = i * 5; return a < 45 ? 1 - a * .004 : Math.exp(-(((a - 40) / 26) ** 2)) * .82; }),
  shrink: AGES.map((_, i) => { const a = i * 5; return a < 45 ? .62 + a * .008 : Math.exp(-(((a - 45) / 30) ** 2)) * .98 + (a >= 80 ? .1 : 0); }),
};
function shapeAt(t) { // t: 0 mở rộng → .5 ổn định → 1 thu hẹp
  const [A, B, k] = t < .5 ? [SHAPES.expand, SHAPES.stable, t / .5] : [SHAPES.stable, SHAPES.shrink, (t - .5) / .5];
  const v = A.map((x, i) => x + (B[i] - x) * k); const s = v.reduce((p, x) => p + x, 0); return v.map(x => x / s * 100);
}
const sexRatio = i => (i < 4 ? 1.05 : i < 12 ? 1.0 : i < 15 ? .88 : .7);

export default {
  id: '3D-19', code: 'DL10.B19', title: 'Tháp dân số và cơ cấu dân số',
  objectives: [
    { c: 'DL10.08.03', t: 'Các loại cơ cấu dân số' },
    { c: 'DL10.08.06', t: 'So sánh các loại tháp dân số tiêu biểu' },
    { c: 'DL10.08.08', t: 'Phân tích biểu đồ, số liệu dân số' },
  ],
  sources: [
    { t: 'UN DESA – World Population Prospects (Population pyramids)', u: 'https://population.un.org/wpp/' },
    { t: 'U.S. Census Bureau – International Database: population pyramids', u: 'https://www.census.gov/data-tools/demo/idb/' },
    { t: 'SGK Địa lí 10 – KNTT, Bài 19 (Hình 19.1)', u: 'https://hanhtrangso.nxbgd.vn/' },
  ],
  note: 'Hình dạng tháp là dạng mô phỏng tiêu biểu, không phải số liệu của một quốc gia cụ thể. Ngưỡng phân loại dân số trẻ/già chỉ để tham khảo.',
  view: { pos: [0, 4, 15], target: [0, 2.6, 0] },
  steps: [
    { title: 'Tháp dân số là gì?', html: '<p><b>Tháp dân số</b> (tháp tuổi) là biểu đồ thể hiện <b>cơ cấu dân số theo tuổi và giới</b>: trục đứng là các nhóm tuổi, hai bên là tỉ lệ nam (trái) và nữ (phải).</p><p>Qua tháp dân số có thể biết tình hình sinh, tử, tuổi thọ, nguồn lao động của một nước.</p>',
      enter: a => { a.state.mode('one'); a.set('stage', 0); a.fly([0, 4, 15], [0, 2.6, 0]); } },
    { title: 'Ba kiểu tháp tiêu biểu', html: '<ul><li><b>Mở rộng</b>: đáy rộng, đỉnh nhọn, cạnh thoải → tỉ suất sinh cao, dân số tăng nhanh, tuổi thọ thấp.</li><li><b>Ổn định</b>: đáy và các nhóm tuổi giữa gần bằng nhau → sinh, tử đều thấp, dân số tăng chậm.</li><li><b>Thu hẹp</b>: đáy hẹp, phình ở giữa và đỉnh → sinh rất thấp, dân số già, có xu hướng giảm.</li></ul><div class="tip">Bấm vào từng tháp để đọc nhận xét.</div>',
      enter: a => { a.state.mode('three'); a.fly([0, 5, 26], [0, 2.6, 0]); } },
    { title: 'Chuyển đổi theo thời gian', html: '<p>Khi kinh tế – xã hội phát triển, tỉ suất sinh giảm, tuổi thọ tăng → tháp dân số chuyển dần từ dạng <b>mở rộng</b> sang <b>ổn định</b> rồi <b>thu hẹp</b> (dân số già hoá).</p><div class="tip">Kéo thanh “Giai đoạn phát triển” và theo dõi tỉ lệ các nhóm tuổi.</div>',
      enter: a => { a.state.mode('one'); a.fly([4, 5, 14], [0, 2.6, 0]); } },
    { title: 'Cơ cấu xã hội', html: '<p>Ngoài cơ cấu sinh học (tuổi, giới), còn có <b>cơ cấu xã hội</b>:</p><ul><li><b>Cơ cấu theo lao động</b>: nguồn lao động, dân số hoạt động theo khu vực kinh tế.</li><li><b>Cơ cấu theo trình độ văn hoá</b>: tỉ lệ biết chữ, số năm đi học trung bình – phản ánh chất lượng dân số.</li></ul>',
      enter: a => { a.state.mode('one'); a.fly([-5, 4, 13], [0, 2.6, 0]); } },
  ],
  tasks: [
    { id: 'pick3', text: 'Bấm vào cả <b>3 kiểu tháp</b> để đọc nhận xét.' },
    { id: 'old', text: 'Kéo giai đoạn phát triển tới khi dân số chuyển sang <b>dân số già</b>.' },
    { id: 'bar', text: 'Bấm vào thanh <b>nhóm tuổi 0–4</b> để đọc tỉ lệ.' },
  ],

  async setup(api) {
    const { scene, state } = api;
    scene.background = new THREE.Color(0x0f1b2a);
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 8, 10); scene.add(key);
    scene.add(new THREE.HemisphereLight(0xdfefff, 0x203040, .7));
    const grid = new THREE.GridHelper(30, 30, 0x2c4054, 0x1d2c3b); grid.position.y = -.01; scene.add(grid);
    const BH = .32, SC = .55; // chiều cao thanh, hệ số % → độ dài
    const makePyr = () => {
      const g = new THREE.Group(); const m = [], f = [];
      AGES.forEach((a, i) => {
        const bm = new THREE.Mesh(new THREE.BoxGeometry(1, BH * .9, .9), new THREE.MeshStandardMaterial({ color: 0x4f9cff, roughness: .5 }));
        const bf = new THREE.Mesh(new THREE.BoxGeometry(1, BH * .9, .9), new THREE.MeshStandardMaterial({ color: 0xff7aa8, roughness: .5 }));
        bm.position.y = bf.position.y = BH * (i + .5); g.add(bm, bf); m.push(bm); f.push(bf);
      });
      const axis = new THREE.Mesh(new THREE.BoxGeometry(.06, BH * 17, .06), new THREE.MeshBasicMaterial({ color: 0xffffff })); axis.position.y = BH * 8.5; g.add(axis);
      g.userData = { m, f, set(t) { const v = shapeAt(t); v.forEach((p, i) => { const r = sexRatio(i); const pm = p * r / (1 + r), pf = p / (1 + r); m[i].scale.x = Math.max(pm * SC, .01); m[i].position.x = -pm * SC / 2 - .05; f[i].scale.x = Math.max(pf * SC, .01); f[i].position.x = pf * SC / 2 + .05; m[i].userData.v = pm; f[i].userData.v = pf; }); return v; } };
      return g;
    };
    // tháp chính
    const main = makePyr(); scene.add(main);
    AGES.forEach((a, i) => { if (i % 2 === 0 || i === 16) api.label(a, { cls: 'sm plain', pos: new THREE.Vector3(-4.6, BH * (i + .5), 0), parent: main }); });
    api.label('Nam', { cls: 'cold', pos: new THREE.Vector3(-2.5, BH * 17 + .5, 0), parent: main });
    api.label('Nữ', { cls: 'warm', pos: new THREE.Vector3(2.5, BH * 17 + .5, 0), parent: main });
    main.userData.m.concat(main.userData.f).forEach((b, k) => { const i = k % 17; const male = k < 17; api.hotspot(b, () => ({ title: `${male ? 'Nam' : 'Nữ'}, nhóm tuổi ${AGES[i]}`, html: `Chiếm <b>${b.userData.v.toFixed(1).replace('.', ',')}%</b> tổng dân số.`, id: 'bar' + i, onPick: () => { if (i === 0) api.done('bar'); } })); });
    // ba tháp so sánh
    const trio = new THREE.Group(); scene.add(trio); const seen = new Set();
    [['expand', 0, 'Tháp mở rộng', 'Đáy rộng, đỉnh nhọn: tỉ suất sinh cao, trẻ em đông, tuổi thọ trung bình thấp. Thường gặp ở các nước đang phát triển có mức sinh cao.'],
     ['stable', .5, 'Tháp ổn định', 'Đáy thu hẹp, các nhóm tuổi trẻ và trung niên gần bằng nhau: tỉ suất sinh và tử đều thấp, dân số tăng chậm.'],
     ['shrink', 1, 'Tháp thu hẹp', 'Đáy hẹp, phình ở giữa và phía trên: sinh rất thấp, tỉ lệ người già cao, dân số có xu hướng giảm. Thường gặp ở các nước phát triển.']].forEach(([id, t, n, h], k) => {
      const p = makePyr(); p.userData.set(t); p.position.x = (k - 1) * 11; trio.add(p);
      const info = { title: n, html: h, id, onPick: () => { seen.add(id); if (seen.size === 3) api.done('pick3'); } };
      p.userData.m.concat(p.userData.f).forEach(b => api.hotspot(b, info));
      api.label(n, { cls: 'big', pos: new THREE.Vector3(0, BH * 17 + .8, 0), parent: p, onClick: info });
    });
    const update = t => {
      const v = main.userData.set(t);
      const young = v.slice(0, 3).reduce((a, b) => a + b, 0), old = v.slice(13).reduce((a, b) => a + b, 0), work = 100 - young - old;
      const kind = young >= 35 ? 'Dân số trẻ' : old >= 14 ? 'Dân số già' : 'Đang chuyển tiếp (già hoá)';
      if (state.m === 'one') api.readout(`<b>${t < .25 ? 'Giai đoạn đầu (sinh cao)' : t < .75 ? 'Giai đoạn giữa' : 'Giai đoạn cuối (sinh thấp)'}</b><br>0 – 14 tuổi: <b>${young.toFixed(1).replace('.', ',')}%</b><br>15 – 64 tuổi: <b>${work.toFixed(1).replace('.', ',')}%</b><br>65 tuổi trở lên: <b>${old.toFixed(1).replace('.', ',')}%</b><br>→ <b>${kind}</b>`);
      if (old >= 14 && state.ready) api.done('old');
    };
    state.mode = md => { state.m = md; main.visible = md === 'one'; trio.visible = md === 'three'; if (md === 'three') api.readout(null); else update(api.get('stage') || 0); cs.style.display = md === 'one' ? '' : 'none'; };
    api.legend([{ c: '#4f9cff', t: 'Nam' }, { c: '#ff7aa8', t: 'Nữ' }]);
    const base = api.controlsBox; const cs = document.createElement('div'); base.append(cs); api.controlsBox = cs; api.heading('Thời gian');
    api.slider('stage', 'Giai đoạn phát triển', { min: 0, max: 1, step: .01, value: 0, format: v => v < .25 ? 'sinh cao, tử cao' : v < .75 ? 'sinh giảm, tử thấp' : 'sinh thấp, tử thấp' }, update);
    api.controlsBox = base; state.ready = true;
  },
};

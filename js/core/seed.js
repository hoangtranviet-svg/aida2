// Dữ liệu mẫu cho bản chạy thử: 1 giáo viên, lớp 10A1 với 30 học sinh (tên giả lập), dấu vết học tập 4 tuần.
import { BANK, MODULES } from '../../app/bank.js';
import { emptyClass } from './data-demo.js';
import { generate, allQ, gradeItem, makeVariants } from './qbank.js';

const DAY = 864e5;
const NAMES = ['Nguyễn Minh Anh', 'Trần Gia Bảo', 'Lê Ngọc Châu', 'Phạm Đức Duy', 'Hoàng Thu Giang', 'Vũ Minh Hiếu', 'Đặng Khánh Huyền', 'Bùi Quang Huy', 'Đỗ Mai Khanh', 'Ngô Tuấn Kiệt',
  'Dương Bảo Lâm', 'Lý Phương Linh', 'Phan Hoàng Long', 'Võ Thảo My', 'Trịnh Hải Nam', 'Đinh Bảo Ngọc', 'Hồ Gia Phúc', 'Mai Thanh Phương', 'Tạ Minh Quân', 'Lương Diễm Quỳnh',
  'Cao Đức Sơn', 'Chu Minh Tâm', 'Lưu Thanh Thảo', 'Kiều Anh Thư', 'Tô Quốc Trung', 'Hà Ngọc Trâm', 'Quách Minh Tuấn', 'Vương Khánh Vân', 'Triệu Hoàng Việt', 'Doãn Hải Yến'];
function rng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

export const DEMO = { gv: { email: 'gv@aida.demo', pw: 'giaovien' }, hs: { email: 'hs05@aida.demo', pw: 'hocsinh' }, code: 'DIA10A' };

export async function seedDB(hash) {
  const now = Date.now(); const r = rng(20261002);
  const users = {};
  const gv = { uid: 'gv01', name: 'Trần Việt Hoàng', email: DEMO.gv.email, role: 'gv', pw: await hash(DEMO.gv.pw), classes: ['c-10a1'], created: now - 40 * DAY };
  users.gv01 = gv;
  const hsPw = await hash(DEMO.hs.pw);
  const PROF = ['steady', 'steady', 'steady', 'steady', 'crammer', 'crammer', 'nightowl', 'guesser', 'misc', 'struggler', 'skipper', 'inactive'];
  const studs = NAMES.map((n, i) => { const id = 'hs' + String(i + 1).padStart(2, '0'); const u = { uid: id, name: n, email: id + '@aida.demo', role: 'hs', pw: hsPw, classes: ['c-10a1'], created: now - 30 * DAY, demo: PROF[i % PROF.length] }; users[id] = u; return u; });

  const c = emptyClass({ id: 'c-10a1', code: DEMO.code, name: 'Lớp 10A1', grade: 10, year: '2026–2027', teacher: 'gv01', created: now - 35 * DAY, members: studs.map(s => s.uid) });
  MODULES.forEach(m => (c.modules[m.code] = { state: 'locked' }));
  const sched = [['DL10.B02', -24, -19], ['DL10.B03', -22, -17], ['DL10.B04', -18, -13], ['DL10.B05', -15, -10], ['DL10.B06', -11, -6], ['DL10.B07', -8, -3], ['DL10.B08', -6, -1], ['DL10.B09', -3, 2]];
  sched.forEach(([code, o, d], i) => { c.modules[code] = { state: i < 6 ? 'review' : 'open', openedAt: now + o * DAY, due: now + d * DAY + 15 * 36e5 }; });

  // dấu vết học tập trên mô hình 3D và câu luyện tập
  studs.forEach(s => {
    const p = s.demo; const skill = p === 'struggler' ? .35 : p === 'steady' ? .82 : .62;
    sched.forEach(([code, o, d]) => {
      if (p === 'inactive' && code >= 'DL10.B08') return;
      if (code === 'DL10.B09' && r() < .35) return;
      const open = now + o * DAY, due = Math.min(now - 36e5, now + d * DAY + 15 * 36e5);
      const sessions = p === 'crammer' ? 1 : 2 + Math.floor(r() * 2);
      for (let k = 0; k < sessions; k++) {
        let t = p === 'crammer' ? due - r() * 20 * 36e5 : open + (due - open) * (k + r() * .8) / sessions;
        const hour = p === 'nightowl' ? 22 + Math.floor(r() * 3) : 15 + Math.floor(r() * 6);
        const dt = new Date(t); dt.setHours(hour % 24, Math.floor(r() * 60)); t = Math.min(dt.getTime(), now - 6e5); if (t < open) t = open + 36e5;
        if (p !== 'skipper') for (let st = 1; st <= 4 + Math.floor(r() * 4); st++) c.events.push({ s: s.uid, m: code, type: 'step', payload: { step: st }, ts: t + st * 45e3 });
        if (p !== 'skipper' && r() < .7) c.events.push({ s: s.uid, m: code, type: 'task_done', payload: { task: 't' + k }, ts: t + 6 * 6e4 });
        if (p !== 'skipper' && k === sessions - 1 && r() < .8) c.events.push({ s: s.uid, m: code, type: 'module_complete', payload: {}, ts: t + 9 * 6e4 });
        const qs = BANK.filter(q => q.m === code); let tt = t + (p === 'skipper' ? 3e4 : 8 * 6e4);
        qs.forEach(q => {
          let tries = 0, ok = false;
          while (!ok && tries < 2) {
            tries++; const ms = p === 'guesser' ? 1500 + r() * 2500 : 6000 + r() * 20000;
            ok = r() < (p === 'guesser' ? .45 : skill) + (tries > 1 ? .15 : 0) + (k * .08);
            let choice = q.k, err = null;
            if (!ok) { const wrong = [0, 1, 2, 3].filter(x => x !== q.k); choice = wrong[Math.floor(r() * 3)]; if (p === 'misc') { const pref = ['E10', 'E02'].find(cd => q.e.includes(cd)); if (pref) choice = q.e.indexOf(pref); } err = q.e[choice]; }
            tt += ms + 5e3; c.attempts.push({ s: s.uid, m: code, q: q.id, o: q.o, choice, correct: ok, err, ms: Math.round(ms), ts: Math.min(tt, now - 6e4), tryNo: tries });
            if (!ok && !['guesser', 'skipper', 'misc'].includes(p) && r() < .8) { tt += 4e4; c.events.push({ s: s.uid, m: code, type: 'step', payload: { step: q.s, review: true }, ts: Math.min(tt, now - 6e4) }); }
          }
        });
      }
    });
  });

  const skillOf = s => s.demo === 'struggler' ? .4 : s.demo === 'steady' ? .85 : s.demo === 'inactive' ? .45 : .66;
  // 1) Kiểm tra giấy tháng 9 – GV nhập điểm từng câu
  const kt9 = BANK.filter(q => ['DL10.B02', 'DL10.B03', 'DL10.B04', 'DL10.B05'].includes(q.m)).filter((q, i) => i % 2 === 0).slice(0, 10);
  const t1 = { id: 't-kt09', title: 'Kiểm tra thường xuyên tháng 9', cat: 'tx', kind: 'paper', created: now - 8 * DAY, date: now - 5 * DAY, status: 'closed', released: true, duration: 15,
    items: kt9.map(q => ({ qid: q.id, t: 'mc', pts: 1 })), scores: {} };
  studs.forEach(s => { t1.scores[s.uid] = t1.items.map(it => (r() < skillOf(s) - (it.qid.startsWith('DL10.02.02') ? .2 : 0) ? 1 : 0)); });

  // 2) Kiểm tra 15 phút trực tuyến – Bài 9, đang mở
  const cls0 = c; const g = generate(cls0, { template: 'kt15', modules: ['DL10.B09'], seed: 909 });
  const t2 = { id: 't-15p-b9', title: 'Kiểm tra 15 phút – Khí quyển (Bài 9)', cat: 'tx', kind: 'online', template: 'kt15', created: now - 2 * DAY, open: now - 26 * 36e5, due: now + 22 * 36e5, date: now - 26 * 36e5,
    status: 'open', duration: 15, items: g.items, variants: makeVariants(g.items, 2, 909), opts: { shuffle: true, antiCheat: true, show: 'after' }, released: false };
  const Q = allQ(cls0).byId;
  studs.forEach((s, i) => {
    if (s.demo === 'inactive' || s.uid === 'hs05' || (i % 4 === 3 && s.demo !== 'steady')) return; // một số em chưa làm (HS mẫu hs05 để dành làm thử)
    const sk = skillOf(s); const v = i % 2; const start = now - (20 - i % 18) * 36e5;
    const answers = {};
    t2.items.forEach(it => {
      const q = Q[it.qid];
      if (q.t === 'mc') answers[it.qid] = r() < sk ? q.k : [0, 1, 2, 3].filter(x => x !== q.k)[Math.floor(r() * 3)];
      if (q.t === 'ds') answers[it.qid] = q.k.map(k => (r() < sk + .05 ? k : !k));
      if (q.t === 'tln') answers[it.qid] = r() < sk - .15 ? q.k : String((parseFloat(q.k.replace(',', '.')) + (r() < .5 ? 2 : -1)).toString().replace('.', ','));
    });
    const blur = s.demo === 'guesser' ? 4 : s.demo === 'crammer' ? 1 : 0;
    const sub = { id: 'sb-' + s.uid + '-t2', tid: t2.id, uid: s.uid, variant: t2.variants[v].code, answers, start, end: start + (8 + Math.floor(r() * 6)) * 6e4, blur, essay: {} };
    sub.auto = {}; t2.items.forEach(it => { sub.auto[it.qid] = gradeItem(Q[it.qid], answers[it.qid], it.pts).score; });
    c.subs.push(sub);
  });

  // 3) Đề giữa kì I – bản nháp sinh theo ma trận CV 7991
  const g3 = generate(cls0, { template: 'kt45', modules: ['DL10.B02', 'DL10.B03', 'DL10.B04', 'DL10.B05', 'DL10.B06', 'DL10.B07', 'DL10.B08', 'DL10.B09', 'DL10.B10'], seed: 2026 });
  const t3 = { id: 't-gk1', title: 'Kiểm tra giữa học kì I', cat: 'gk', kind: 'paper', template: 'kt45', created: now - DAY, date: now + 12 * DAY, status: 'draft', duration: 45, items: g3.items, variants: makeVariants(g3.items, 4, 2026), opts: { shuffle: true }, scores: {} };
  c.tests.push(t1, t2, t3);

  c.posts.push(
    { id: 'p2', by: 'gv01', ts: now - 3 * 36e5, pin: true, text: 'Bài kiểm tra 15 phút phần Khí quyển đã mở đến 20 giờ ngày mai. Các em làm trên máy tính hoặc điện thoại, không rời khỏi trang khi đang làm bài.' },
    { id: 'p1', by: 'gv01', ts: now - 3 * DAY, text: 'Thầy đã mở mô-đun Bài 9. Trước buổi học thứ Năm, các em khám phá mô hình 3D các tầng khí quyển và hoàn thành phần luyện tập nhé.' },
  );
  c.slides.push(
    { id: 'sl-b9', title: 'Bài 9 – Khí quyển, các yếu tố khí hậu', m: 'DL10.B09', kind: 'text', by: 'gv01', ts: now - 3 * DAY, pages: [
      { k: 'DL10.04.01 · DL10.04.03', h: 'Khí quyển và các đai khí áp', ul: ['Khí quyển: lớp không khí bao quanh Trái Đất, chịu ảnh hưởng của vũ trụ, trước hết là Mặt Trời', '5 tầng: đối lưu, bình lưu, giữa, nhiệt, ngoài', 'Tầng đối lưu tập trung khoảng 80% khối lượng không khí và gần như toàn bộ hơi nước'] },
      { k: 'DL10.04.03', h: 'Vì sao có các đai áp cao, áp thấp?', ul: ['Nguyên nhân nhiệt lực: không khí nóng nở ra, bốc lên → áp thấp (xích đạo)', 'Nguyên nhân động lực: không khí giáng xuống → áp cao (cận chí tuyến)', 'Mô hình 3D: bật lớp “Hoàn lưu khí quyển” để quan sát'] },
      { k: 'DL10.04.04', h: 'Gió chính trên Trái Đất', ul: ['Gió Mậu dịch: từ áp cao cận chí tuyến về áp thấp xích đạo', 'Gió Tây ôn đới: từ áp cao cận chí tuyến về áp thấp ôn đới', 'Gió Đông cực: từ áp cao cực về áp thấp ôn đới'] },
      { k: 'Nhiệm vụ', h: 'Trước giờ học', ul: ['Mở mô-đun Bài 9, đi hết 9 bước khám phá', 'Làm phần luyện tập; sai câu nào bấm “Xem lại bước” trên mô hình', 'Ghi 1 câu hỏi em còn thắc mắc vào vở'] },
    ] },
    { id: 'sl-b5', title: 'Bài 5 – Hệ quả các chuyển động của Trái Đất', m: 'DL10.B05', kind: 'text', by: 'gv01', ts: now - 15 * DAY, pages: [
      { k: 'DL10.02.02', h: 'Chuyển động tự quay', ul: ['Luân phiên ngày đêm', 'Giờ trên Trái Đất, đường chuyển ngày quốc tế', 'Sự lệch hướng chuyển động của các vật thể'] },
      { k: 'DL10.02.02', h: 'Chuyển động quanh Mặt Trời', ul: ['Các mùa trong năm', 'Ngày đêm dài ngắn theo mùa và theo vĩ độ'] },
    ] },
  );
  return { v: 3, demo: true, users, classes: { [c.id]: c } };
}

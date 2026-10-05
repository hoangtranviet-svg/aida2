// Lớp mẫu 10KHXH5: 41 học sinh (họ tên theo danh sách thầy cung cấp, không lưu mã định danh, ngày sinh),
// đủ dấu vết học tập 6 tuần, 3 bài thường xuyên, bài kiểm tra giữa học kì I và nhận xét mẫu.
// Điểm ĐĐGtx lần 1 và ĐĐGgk lấy theo bảng điểm thầy gửi; các dữ liệu khác do hệ thống mô phỏng.
import { BANK, MODULES, ERR } from '../../app/bank.js';
import { generate, allQ, gradeItem, makeVariants } from './qbank.js';

export const SAMPLE_NAME = 'Lớp 10KHXH5';
const DAY = 864e5, H = 36e5, MIN = 6e4;
// [họ và tên, ĐĐGtx1, ĐĐGgk]
const ROSTER = [
  ['Đinh Hoàng Bách', 10, 7], ['Nguyễn Linh Anh', 10, 9], ['Đàm Bảo Hân', 10, 9.5], ['Nguyễn Ngọc Uyên Linh', 10, 9], ['Ngô Gia Hân', 10, 9], ['Nguyễn Gia Huy', 10, 9],
  ['Đinh Thùy Dương', 10, 9], ['Lã Hoàng Vân Linh', 9, 6], ['Lê Minh Tuấn Khang', 10, 9.5], ['Nguyễn Trúc Linh', 10, 8.5], ['Đinh Anh Minh', 9, 4], ['Trần Khánh Ngọc', 10, 7.5],
  ['Nguyễn Minh Quân', 10, 7], ['Mai Ngọc Bảo Sơn', 10, 7.5], ['Vương Ngọc Linh', 10, 8.5], ['Nguyễn Bảo Linh', 9, 6], ['Lê Đức Thiện', 9, 6], ['Phùng Khánh Ngọc', 10, 9.5],
  ['Nguyễn Khánh An', 9, 7], ['Lưu Trung Anh', 10, 9], ['Lương Thanh Hà', 10, 8.5], ['Tống Duy Anh', 10, 6.5], ['Trần Nguyên Đức', 10, 7.5], ['Trịnh Bảo Hân', 9, 6],
  ['Lê Bội Linh', 9, 5.5], ['Lê Chúc Linh', 10, 8.5], ['Phùng Khắc Minh', 10, 8], ['Bùi Trí Nguyên', 8, 4.5], ['Nguyễn Tuấn Phong', 10, 9.5], ['Nguyễn Hải Trà', 9, 7.5],
  ['Nguyễn Minh Quang', 10, 9.5], ['Lê Nam Anh', 10, 9], ['Vũ Đức Chính', 10, 9.5], ['Lưu Bảo Anh', 10, 10], ['Phạm Quốc An', 10, 8.5], ['Tạ Tuấn Anh', 10, 9.5],
  ['Phùng Ngọc Lâm', 10, 9.5], ['Nguyễn Nhật Minh', 10, 9.5], ['Hoàng Kiều Ngân', 10, 9.5], ['Hoàng Như Mai', 10, 9], ['Nguyễn Ngọc Mỹ Quyên', 10, 9.5],
];
// hồ sơ thói quen (mô phỏng) – quyết định dấu vết học tập
const PROF = {
  star: { skill: .9, sess: 2, hour: [16, 20], ms: [7, 22], review: true },
  steady: { skill: .82, sess: 2, hour: [15, 21], ms: [6, 20], review: true },
  crammer: { skill: .74, sess: 1, hour: [19, 23], ms: [5, 15], review: true, cram: true },
  nightowl: { skill: .74, sess: 2, hour: [22, 25], ms: [6, 18], review: true },
  guesser: { skill: .56, sess: 1, hour: [17, 22], ms: [1.4, 3.6], review: false },
  misc: { skill: .64, sess: 2, hour: [16, 21], ms: [6, 18], review: false, misc: ['E06', 'E07', 'E01', 'E14'] },
  struggler: { skill: .5, sess: 1, hour: [18, 22], ms: [8, 25], review: true, skip: .3 },
  skipper: { skill: .6, sess: 1, hour: [18, 23], ms: [3, 9], review: false, noExplore: true, skip: .15 },
};
function profileOf(gk, i) {
  if (gk >= 9.5) return i % 5 === 3 ? 'nightowl' : 'star';
  if (gk >= 9) return i % 3 === 2 ? 'crammer' : 'steady';
  if (gk >= 8) return ['crammer', 'nightowl', 'steady'][i % 3];
  if (gk >= 7) return ['crammer', 'misc', 'nightowl'][i % 3];
  if (gk >= 6) return ['guesser', 'misc', 'skipper'][i % 3];
  return i % 2 ? 'struggler' : 'skipper';
}
function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const pick = (r, a) => a[Math.floor(r() * a.length)];
const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z]+/g, '');

// lịch mở mô-đun (ngày so với hiện tại)
const SCHED = [['DL10.B01', -44, -40], ['DL10.B02', -41, -36], ['DL10.B03', -38, -33], ['DL10.B04', -35, -30], ['DL10.B05', -31, -26], ['DL10.B06', -28, -23],
  ['DL10.B07', -25, -20], ['DL10.B08', -22, -17], ['DL10.B09', -18, -12], ['DL10.B10', -14, -9], ['DL10.B11', -3, 4]];

export function buildSample({ now = Date.now(), teacher = 'gv01', teacherName = 'Trần Việt Hoàng', prefix = 'mau' } = {}) {
  const r = rng(10558);
  const studs = ROSTER.map(([name, tx, gk], i) => ({ id: `${prefix}${String(i + 1).padStart(2, '0')}`, name, tx, gk, prof: profileOf(gk, i), email: `${plain(name.split(' ').pop())}.${String(i + 1).padStart(2, '0')}@10khxh5.demo` }));
  const pseudo = { id: 'mau-10khxh5', questions: [], levels: {}, qv: 0 }; const AQ = allQ(pseudo); const Q = AQ.byId;
  const modules = {}; MODULES.forEach(m => (modules[m.code] = { state: 'locked' }));
  SCHED.forEach(([code, o, d], i) => { modules[code] = { state: i < SCHED.length - 1 ? 'review' : 'open', openedAt: now + o * DAY + 8 * H, due: now + d * DAY + 20 * H }; });
  const events = [], attempts = [];
  const clampT = t => Math.min(t, now - 5 * MIN);
  const atHour = (t, h, rr) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime() + (h + rr()) * H; };

  studs.forEach((s, si) => {
    const P = PROF[s.prof]; const rr = rng(7000 + si * 131);
    const skill = Math.max(.35, Math.min(.95, P.skill + (s.gk - 7.5) * .04));
    SCHED.forEach(([code, o, d], mi) => {
      const md = modules[code]; const isOpen = md.state === 'open';
      if (isOpen && rr() < (P.cram ? .8 : .45)) return; // mô-đun đang mở: nhiều em chưa bắt đầu
      if (P.skip && rr() < P.skip) return;
      const qs = BANK.filter(q => q.m === code);
      const nSess = P.sess + (rr() < .3 ? 1 : 0);
      const wrongs = [];
      for (let k = 0; k < nSess; k++) {
        let day;
        if (P.cram) day = md.due - (6 + rr() * 14) * H;
        else day = md.openedAt + (md.due - md.openedAt) * Math.min(.95, (k + rr() * .8) / nSess);
        let t = atHour(day, P.hour[0] + Math.floor(rr() * (P.hour[1] - P.hour[0])), rr); if (P.hour[1] > 24 && rr() < .5) t = atHour(day, 23, rr);
        if (t > md.due && !isOpen) t = md.due - 2 * H; if (t < md.openedAt) t = md.openedAt + 3 * H;
        t = clampT(t); if (t > now - 10 * MIN) continue;
        events.push({ s: s.id, m: code, type: 'open', payload: {}, ts: t });
        // khám phá mô hình
        if (!P.noExplore || k > 0) {
          const nSteps = k === 0 ? 4 + Math.floor(rr() * 5) : 2 + Math.floor(rr() * 3);
          for (let st = 1; st <= nSteps; st++) { t += (35 + rr() * 70) * 1e3; events.push({ s: s.id, m: code, type: 'step', payload: { step: st }, ts: clampT(t) }); if (rr() < .4) { t += 2e4; events.push({ s: s.id, m: code, type: 'hotspot', payload: { id: 'h' + st }, ts: clampT(t) }); } }
          if (rr() < (s.prof === 'star' ? .95 : .7)) { t += 2 * MIN; events.push({ s: s.id, m: code, type: 'task_done', payload: { task: 't' + k }, ts: clampT(t) }); }
          if (k === nSess - 1 && nSteps >= 5 && rr() < .85) { t += MIN; events.push({ s: s.id, m: code, type: 'module_complete', payload: {}, ts: clampT(t) }); }
        }
        // luyện tập
        const list = k === 0 ? qs : qs.filter(q => wrongs.includes(q.id));
        list.forEach(q => {
          let tries = 0, ok = false; const hard = q.lv === 'V' ? .14 : q.lv === 'H' ? .06 : 0;
          while (!ok && tries < 2) {
            tries++; const ms = (P.ms[0] + rr() * (P.ms[1] - P.ms[0])) * 1e3;
            ok = rr() < (s.prof === 'guesser' ? .5 : skill - hard) + (tries > 1 ? .18 : 0) + k * .15;
            let choice = q.k, err = null;
            if (!ok) { const wrong = [0, 1, 2, 3].filter(x => x !== q.k); choice = wrong[Math.floor(rr() * 3)]; if (P.misc) { const pref = P.misc.find(cd => q.e.includes(cd)); if (pref) choice = q.e.indexOf(pref); } err = q.e[choice]; }
            t += ms + 4e3; attempts.push({ s: s.id, m: code, q: q.id, o: q.o, choice, correct: ok, err, ms: Math.round(ms), ts: clampT(t), tryNo: tries + k * 2 });
            if (!ok && k === 0 && tries === 2) wrongs.push(q.id);
            if (!ok && P.review && rr() < .85) { t += 40e3 + rr() * 60e3; events.push({ s: s.id, m: code, type: 'step', payload: { step: q.s || 1, review: true }, ts: clampT(t) }); }
          }
        });
      }
    });
  });

  // ---------- ôn tập trước kiểm tra giữa kì (6 – 8 ngày trước) ----------
  studs.forEach((s, si) => {
    const P = PROF[s.prof]; const rr = rng(5100 + si * 29); if (['skipper', 'struggler'].includes(s.prof) && rr() < .6) return;
    const n = s.prof === 'star' || s.prof === 'steady' ? 3 : 1 + Math.floor(rr() * 2);
    shuffle(SCHED.slice(0, 10), rr).slice(0, n).forEach(([code], k) => {
      let t = atHour(now - (8 - k * .9 - rr()) * DAY, P.hour[0] + Math.floor(rr() * (Math.min(24, P.hour[1]) - P.hour[0])), rr); t = clampT(t);
      events.push({ s: s.id, m: code, type: 'open', payload: { review: true }, ts: t });
      for (let st = 1; st <= 3; st++) { t += 50e3; events.push({ s: s.id, m: code, type: 'step', payload: { step: st, review: true }, ts: clampT(t) }); }
      BANK.filter(q => q.m === code).slice(0, 3).forEach(q => { t += 25e3; const ok = rr() < .85; attempts.push({ s: s.id, m: code, q: q.id, o: q.o, choice: ok ? q.k : (q.k + 1) % 4, correct: ok, err: ok ? null : q.e[(q.k + 1) % 4], ms: 9000, ts: clampT(t), tryNo: 5 }); });
    });
  });

  // ---------- bài kiểm tra ----------
  const tests = [], subs = [], scoresOf = {};
  // TX1: kiểm tra giấy 10 câu (Bài 1 – 4), điểm theo bảng điểm
  const tx1Items = shuffle(AQ.filter(q => q.t === 'mc' && ['DL10.B01', 'DL10.B02', 'DL10.B03', 'DL10.B04'].includes(q.m)), rng(401)).slice(0, 10).map(q => ({ qid: q.id, t: 'mc', pts: 1 }));
  const t1 = { id: 'tx1-giay', title: 'Kiểm tra thường xuyên 1 (trên giấy) – Bài 1 – 4', cat: 'tx', kind: 'paper', created: now - 31 * DAY, date: now - 29 * DAY, status: 'closed', released: true, duration: 15, items: tx1Items, scores: {} };
  studs.forEach((s, si) => { const rr = rng(900 + si); const wrong = new Set(shuffle(t1.items.map((_, i) => i), rr).slice(0, Math.round(10 - s.tx))); t1.scores[s.id] = t1.items.map((_, i) => (wrong.has(i) ? 0 : 1)); });
  // TX2, TX3: trực tuyến 15 phút
  const online = (id, title, mods, seed, day) => {
    const g = generate(pseudo, { template: 'kt15', modules: mods, seed });
    const t = { id, title, cat: 'tx', kind: 'online', template: 'kt15', created: now + (day - 2) * DAY, open: now + day * DAY + 19 * H, due: now + (day + 2) * DAY + 21 * H, date: now + day * DAY + 19 * H, status: 'closed', released: true, duration: 15, items: g.items, variants: makeVariants(g.items, 2, seed), opts: { shuffle: true, antiCheat: true, show: 'after' } };
    studs.forEach((s, si) => {
      const P = PROF[s.prof]; const rr = rng(seed + si * 17); if (s.prof === 'struggler' && rr() < .25) return; // một em không làm
      const sk = Math.max(.3, Math.min(.97, (s.gk / 10) * .9 + .08 + (rr() - .5) * .12)); const answers = {};
      t.items.forEach(it => { const q = Q[it.qid];
        if (q.t === 'mc') answers[it.qid] = rr() < sk ? q.k : [0, 1, 2, 3].filter(x => x !== q.k)[Math.floor(rr() * 3)];
        if (q.t === 'ds') answers[it.qid] = q.k.map(k => (rr() < sk + .05 ? k : !k));
        if (q.t === 'tln') answers[it.qid] = rr() < sk - .1 ? q.k : String(Math.round((parseFloat(String(q.k).replace(',', '.')) * 1.1 + 1) * 10) / 10).replace('.', ','); });
      let start = P.cram ? t.due - (3 + rr() * 5) * H : t.open + (2 + rr() * 30) * H; const hh = new Date(start).getHours(); if (hh < 6) start += 8 * H;
      start = Math.min(start, now - 2 * H);
      const mins = s.prof === 'guesser' || s.prof === 'skipper' ? 4 + rr() * 3 : 9 + rr() * 5.5;
      const sub = { id: `${id}_${s.id}`, tid: id, uid: s.id, variant: t.variants[si % 2].code, answers, start, end: start + mins * MIN, blur: s.prof === 'guesser' ? 3 : s.prof === 'crammer' ? 1 : 0, essay: {}, sample: true };
      sub.auto = {}; t.items.forEach(it => { sub.auto[it.qid] = gradeItem(Q[it.qid], answers[it.qid], it.pts).score; });
      subs.push(sub);
    });
    return t;
  };
  const t2 = online('tx2-15p', 'Kiểm tra 15 phút – Trái Đất, thạch quyển (Bài 5 – 7)', ['DL10.B05', 'DL10.B06', 'DL10.B07'], 5205, -21);
  const t3 = online('tx3-15p', 'Kiểm tra 15 phút – Khí quyển (Bài 8 – 9)', ['DL10.B08', 'DL10.B09'], 5309, -11);
  // GHK I: đề 45 phút theo CV 7991, Bài 1 – 10, chấm trên giấy theo từng câu; tổng điểm khớp bảng điểm
  const gk = generate(pseudo, { template: 'kt45', modules: SCHED.slice(0, 10).map(x => x[0]), seed: 2610 });
  const t4 = { id: 'ghk1', title: 'Kiểm tra giữa học kì I', cat: 'gk', kind: 'paper', template: 'kt45', created: now - 9 * DAY, date: now - 5 * DAY, status: 'closed', released: true, duration: 45, items: gk.items, variants: makeVariants(gk.items, 4, 2610), opts: { shuffle: true }, scores: {} };
  studs.forEach((s, si) => { t4.scores[s.id] = fitScores(t4.items, Q, s.gk, rng(3100 + si * 7), s); });
  tests.push(t1, t2, t3, t4);

  // ---------- luyện tập cải thiện sau GHK I (một số em) ----------
  studs.forEach((s, si) => {
    const rr = rng(4400 + si); if (!['star', 'steady', 'misc', 'struggler'].includes(s.prof) || rr() < .35) return;
    const weakO = t4.items.map((it, i) => ({ o: Q[it.qid].o, f: t4.scores[s.id][i] / it.pts })).filter(x => x.f < .5).map(x => x.o);
    [...new Set(weakO)].slice(0, 2).forEach(o => { let t = atHour(now - (3 - rr() * 2) * DAY, 17 + Math.floor(rr() * 3), rr);
      BANK.filter(q => q.o === o).slice(0, 3).forEach(q => { t += 50e3; attempts.push({ s: s.id, m: q.m, q: q.id, o, choice: q.k, correct: true, err: null, ms: 15000, ts: clampT(t), tryNo: 3 }); }); });
  });

  // ---------- nhận xét mẫu của giáo viên ----------
  const notes = {};
  studs.forEach((s, si) => { notes[s.id] = { text: commentFor(s, t4, Q, si), level: null, dtb: null, by: teacher, ts: now - 2 * DAY, sample: true }; });
  const posts = [
    { id: 'mau-p3', by: teacher, ts: now - 2 * DAY, pin: true, text: 'Thầy đã công bố điểm kiểm tra giữa học kì I và gửi phiếu báo cáo học tập giữa kì cho phụ huynh. Em nào có mục tiêu dưới 50% hãy làm nhiệm vụ cải thiện trong mục “Việc cần làm” trước thứ Sáu nhé.' },
    { id: 'mau-p2', by: teacher, ts: now - 3 * DAY, text: 'Mô-đun Bài 11 (Thuỷ quyển, nước trên lục địa) đã mở. Các em khám phá mô hình vòng tuần hoàn nước trước buổi học tới.' },
    { id: 'mau-p1', by: teacher, ts: now - 9 * DAY, text: 'Lịch kiểm tra giữa học kì I: 45 phút, phạm vi Bài 1 – 10. Các em ôn lại các mô-đun ở chế độ Ôn tập và làm lại các câu luyện tập đã sai.' },
  ];
  return {
    cls: { name: SAMPLE_NAME, grade: 10, year: '2026–2027', school: 'THPT Wellspring – Mùa Xuân', teacher, teacherName, created: now - 46 * DAY, modules, levels: {}, qv: 0, sample: true },
    studs, events: events.sort((a, b) => a.ts - b.ts), attempts: attempts.sort((a, b) => a.ts - b.ts), tests, subs, notes, posts,
  };
}

function shuffle(a, r) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// chia điểm từng câu sao cho tổng đúng bằng điểm thật; mỗi em có 1 – 2 mục tiêu yếu hơn
function fitScores(items, Q, target, r, s) {
  const f = target / 10; const objs = [...new Set(items.map(it => Q[it.qid].o))]; const weak = new Set(shuffle(objs, r).slice(0, target >= 9.5 ? 0 : target >= 8 ? 1 : 2));
  const sc = items.map(it => { const q = Q[it.qid]; const p = Math.max(.05, Math.min(.98, f + (weak.has(q.o) ? -.35 : .06) + (q.lv === 'V' ? -.1 : 0)));
    if (it.t === 'ds') { const v = r() < p ? 1 : r() < p ? .5 : r() < .5 ? .25 : 0; return v * it.pts; }
    if (it.t === 'tlu') return Math.round(it.pts * Math.min(1, p + (r() - .5) * .2) * 4) / 4;
    return r() < p ? it.pts : 0; });
  const sum = () => +sc.reduce((a, b) => a + b, 0).toFixed(2);
  let guard = 0;
  while (Math.abs(sum() - target) > 1e-6 && guard++ < 400) {
    const up = sum() < target; const cand = items.map((it, i) => i).filter(i => { const it = items[i]; return up ? sc[i] < it.pts : sc[i] > 0; });
    if (!cand.length) break; const i = cand[Math.floor(r() * cand.length)]; const it = items[i];
    const step = it.t === 'tlu' || it.t === 'mc' ? .25 : it.t === 'tln' ? it.pts : .25 * it.pts;
    if (it.t === 'ds') { const lv = [0, .25, .5, 1].map(x => x * it.pts); const k = lv.indexOf(sc[i]); sc[i] = lv[Math.max(0, Math.min(3, k + (up ? 1 : -1)))]; }
    else if (it.t === 'mc' || it.t === 'tln') sc[i] = up ? it.pts : 0;
    else sc[i] = Math.max(0, Math.min(it.pts, sc[i] + (up ? step : -step)));
    if (Math.abs(sum() - target) < .26 && Math.abs(sum() - target) > 1e-6) { // tinh chỉnh bằng câu tự luận
      const d = target - sum(); const j = items.findIndex((x, k) => x.t === 'tlu' && sc[k] + d >= 0 && sc[k] + d <= x.pts); if (j >= 0) sc[j] = +(sc[j] + d).toFixed(2);
    }
  }
  return sc.map(v => +v.toFixed(2));
}

// lời nhận xét mẫu (giọng giáo viên, theo TT 22) – dựa trên điểm và thói quen mô phỏng
function commentFor(s, t4, Q, si) {
  const row = t4.scores[s.id]; const byO = {}; t4.items.forEach((it, i) => { const o = Q[it.qid].m; const v = byO[o] ||= { g: 0, m: 0, mod: o }; v.g += row[i]; v.m += it.pts; });
  const goodMod = Object.values(byO).filter(v => v.g / v.m >= .85).map(v => v.mod); const weakMod = Object.values(byO).filter(v => v.g / v.m < .5).map(v => v.mod);
  const TOPIC = { 'DL10.B01': 'môn Địa lí và định hướng nghề nghiệp', 'DL10.B02': 'các phương pháp biểu hiện trên bản đồ', 'DL10.B03': 'GPS và bản đồ số', 'DL10.B04': 'sự hình thành Trái Đất, vỏ Trái Đất', 'DL10.B05': 'hệ quả các chuyển động của Trái Đất',
    'DL10.B06': 'thạch quyển, thuyết kiến tạo mảng', 'DL10.B07': 'nội lực và ngoại lực', 'DL10.B08': 'vành đai động đất, núi lửa', 'DL10.B09': 'khí quyển và các yếu tố khí hậu', 'DL10.B10': 'các đới và kiểu khí hậu' };
  const T = m => TOPIC[m] || (MODULES.find(x => x.code === m)?.title || '').toLowerCase();
  const good = [...new Set(goodMod)].slice(0, 2).map(T).join(', '); const weak = [...new Set(weakMod)].slice(0, 2).map(T).join(', ');
  const gk = String(s.gk).replace('.', ',');
  const habit = {
    star: 'học đều đặn, chủ động khám phá đầy đủ các mô hình 3D và luôn xem lại học liệu khi làm sai',
    steady: 'học tập đều đặn, hoàn thành đúng hạn các mô-đun được giao',
    crammer: 'có ý thức hoàn thành nhiệm vụ nhưng thường dồn việc học vào sát hạn nộp',
    nightowl: 'chăm chỉ nhưng hay học sau 22 giờ, ảnh hưởng đến sự tỉnh táo khi học',
    guesser: 'làm bài luyện tập khá nhanh, nhiều câu trả lời vội chưa đọc kĩ phương án',
    misc: 'tích cực luyện tập nhưng còn lặp lại một số lỗi sai giữa các bài',
    struggler: 'đã cố gắng tham gia nhưng chưa hoàn thành đầy đủ các mô-đun',
    skipper: 'thường làm câu hỏi ngay mà chưa khám phá mô hình, một số mô-đun chưa hoàn thành',
  }[s.prof];
  const advice = {
    star: 'Em tiếp tục phát huy, thử sức với các câu hỏi vận dụng và hỗ trợ các bạn trong nhóm học tập.',
    steady: 'Em nên dành thêm thời gian cho các câu hỏi vận dụng, liên hệ thực tế để đạt kết quả cao hơn.',
    crammer: 'Đề nghị em chia việc học thành 2 – 3 buổi ngắn cách nhau 1 – 2 ngày trước hạn để nhớ lâu hơn.',
    nightowl: 'Đề nghị em ưu tiên học trước 22 giờ và ngủ đủ giấc; gia đình có thể hỗ trợ em sắp xếp giờ học hợp lí.',
    guesser: 'Đề nghị em đọc kĩ cả 4 phương án, tự giải thích vì sao chọn đáp án trước khi trả lời.',
    misc: 'Đề nghị em mở lại đúng bước mô hình liên quan đến lỗi sai và tự giải thích lại hiện tượng trước khi làm bài.',
    struggler: 'Đề nghị em hoàn thành các mô-đun còn thiếu, làm nhiệm vụ cải thiện và hỏi thầy khi chưa hiểu bài.',
    skipper: 'Đề nghị em đi hết các bước khám phá trên mô hình 3D trước khi làm câu hỏi luyện tập.',
  }[s.prof];
  const lead = s.gk >= 9 ? 'Em có kết quả học tập tốt' : s.gk >= 7.5 ? 'Em có kết quả học tập khá' : s.gk >= 6 ? 'Em đạt yêu cầu về kiến thức cơ bản' : 'Kết quả học tập của em còn hạn chế';
  const parts = [`${lead}, điểm kiểm tra giữa học kì I đạt ${gk}.`, `Em ${habit}.`];
  if (good) parts.push(`Em nắm vững kiến thức về ${good}.`);
  if (weak) parts.push(`Cần củng cố thêm phần ${weak}.`);
  parts.push(advice);
  return parts.join(' ');
}

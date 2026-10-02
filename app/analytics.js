// Bộ phân tích dấu vết học tập AIDA 2.0 – quy tắc minh bạch, giải thích được.
// Đầu vào: state { students, modules, events, attempts, tests }; thời gian tính bằng ms.
import { BANK, ERR } from './bank.js';

const DAY = 864e5;
const QBY = Object.fromEntries(BANK.map(q => [q.id, q]));

// Chiến lược học có bằng chứng khoa học (Dunlosky et al., 2013; Roediger & Karpicke, 2006; Cepeda et al., 2006)
export const STRATEGIES = {
  spaced: { name: 'Ôn giãn cách', how: 'Chia việc học thành 3 buổi ngắn (15 – 20 phút) cách nhau 1 – 2 ngày trước hạn, thay vì học dồn một buổi.', why: 'Học giãn cách giúp nhớ lâu hơn rõ rệt so với học dồn (Cepeda và cộng sự, 2006).' },
  retrieval: { name: 'Tự kiểm tra có suy nghĩ', how: 'Trước khi chọn đáp án, tự trả lời trong đầu và nói được vì sao; đọc kĩ cả 4 phương án.', why: 'Luyện truy xuất là một trong hai kĩ thuật hiệu quả nhất (Dunlosky và cộng sự, 2013).' },
  model: { name: 'Học lại bằng mô hình', how: 'Mở lại đúng bước trong mô hình 3D, thao tác và tự giải thích hiện tượng trước khi làm lại câu hỏi.', why: 'Kết hợp hình ảnh trực quan với lời giải thích (mã hoá kép) giúp sửa hiểu lầm bền vững hơn.' },
  review: { name: 'Xem lại trước khi làm lại', how: 'Khi sai, đọc phần giải thích và xem lại học liệu rồi mới làm lại – đừng đoán liên tiếp.', why: 'Phản hồi kèm giải thích giúp sửa lỗi; đoán lại liên tục chỉ củng cố lỗi.' },
  interleave: { name: 'Ôn tập xen kẽ', how: 'Mỗi tuần dành 10 phút ôn lại các mô-đun đã học (chế độ Ôn tập), xen kẽ các chương khác nhau.', why: 'Ôn xen kẽ giúp phân biệt các khái niệm dễ nhầm (Rohrer & Taylor, 2007).' },
  sleep: { name: 'Học vào giờ tỉnh táo', how: 'Ưu tiên học trước 22 giờ, ngủ đủ giấc để não củng cố trí nhớ.', why: 'Giấc ngủ đóng vai trò quan trọng trong việc củng cố trí nhớ dài hạn.' },
  explore: { name: 'Khám phá trước, làm bài sau', how: 'Đi hết các bước khám phá và làm nhiệm vụ trên mô hình 3D trước khi làm câu hỏi.', why: 'Xây nền hiểu biết trước giúp câu hỏi luyện tập hiệu quả hơn.' },
};

export function mastery(attempts) {
  // điểm nắm vững theo mục tiêu: trung bình có trọng số, lần làm gần nhất nặng hơn
  const by = {};
  attempts.slice().sort((a, b) => a.ts - b.ts).forEach(a => { (by[a.o] ||= []).push(a.correct ? 1 : 0); });
  const out = {};
  for (const [o, arr] of Object.entries(by)) {
    const last = arr.slice(-6); let w = 0, s = 0; last.forEach((v, i) => { const k = 1 + i * .5; w += k; s += v * k; });
    out[o] = { n: arr.length, score: s / w };
  }
  return out;
}

export function studentSummary(st, sid, now = Date.now()) {
  const ev = st.events.filter(e => e.s === sid); const at = st.attempts.filter(a => a.s === sid);
  const all = ev.concat(at).sort((a, b) => a.ts - b.ts);
  const m = mastery(at);
  const hours = Array(24).fill(0); all.forEach(x => hours[new Date(x.ts).getHours()]++);
  const days14 = new Set(all.filter(x => now - x.ts < 14 * DAY).map(x => new Date(x.ts).toDateString())).size;
  const flags = [];
  // 1. học dồn sát hạn
  let cramNum = 0, cramDen = 0;
  for (const [code, md] of Object.entries(st.modules)) {
    if (!md.due || !md.openedAt) continue;
    const xs = all.filter(x => x.m === code && x.ts >= md.openedAt && x.ts <= md.due);
    if (xs.length < 4) continue;
    cramDen += xs.length; cramNum += xs.filter(x => md.due - x.ts < DAY).length;
  }
  const cram = cramDen ? cramNum / cramDen : 0;
  if (cramDen >= 8 && cram > .6) flags.push({ id: 'cram', level: cram > .8 ? 'high' : 'mid', title: 'Học dồn sát hạn', evidence: `${Math.round(cram * 100)}% hoạt động diễn ra trong 24 giờ trước hạn nộp`, strategy: 'spaced' });
  // 2. học khuya
  const night = all.length ? all.filter(x => { const h = new Date(x.ts).getHours(); return h >= 22 || h < 5; }).length / all.length : 0;
  if (all.length >= 10 && night > .3) flags.push({ id: 'night', level: night > .5 ? 'high' : 'mid', title: 'Thường học khuya', evidence: `${Math.round(night * 100)}% hoạt động sau 22 giờ`, strategy: 'sleep' });
  // 3. đoán nhanh
  const fast = at.filter(a => a.ms < 4000); const fastWrong = fast.filter(a => !a.correct).length;
  if (at.length >= 6 && fast.length / at.length > .3 && fastWrong / Math.max(fast.length, 1) > .4) flags.push({ id: 'guess', level: 'mid', title: 'Trả lời quá nhanh, dễ đoán mò', evidence: `${fast.length}/${at.length} câu trả lời dưới 4 giây, sai ${fastWrong} câu`, strategy: 'retrieval' });
  // 4. làm lại liên tiếp mà không xem lại học liệu
  let retryNoReview = 0, retries = 0;
  const byQ = {}; at.sort((a, b) => a.ts - b.ts).forEach(a => (byQ[a.q] ||= []).push(a));
  for (const arr of Object.values(byQ)) for (let i = 1; i < arr.length; i++) { if (!arr[i - 1].correct) { retries++; const between = ev.filter(e => e.ts > arr[i - 1].ts && e.ts < arr[i].ts && (e.type === 'step' || e.type === 'hotspot')).length; if (!between) retryNoReview++; } }
  if (retryNoReview >= 3 && retryNoReview / retries > .6) flags.push({ id: 'retry', level: 'mid', title: 'Làm lại ngay khi sai, chưa xem lại', evidence: `${retryNoReview} lần làm lại câu sai mà không mở lại mô hình`, strategy: 'review' });
  // 5. lỗi sai lặp lại
  const errs = {}; at.filter(a => a.err).forEach(a => (errs[a.err] = (errs[a.err] || 0) + 1));
  const nErr = Object.values(errs).reduce((a, b) => a + b, 0);
  const avgPerCode = nErr / Math.max(Object.keys(errs).length, 1);
  const rep = Object.entries(errs).filter(([, n]) => n >= 4 && n >= 2 * avgPerCode).sort((a, b) => b[1] - a[1]);
  if (rep.length) flags.push({ id: 'misc', level: rep[0][1] >= 5 ? 'high' : 'mid', title: 'Lặp lại cùng một lỗi sai', evidence: rep.slice(0, 2).map(([c, n]) => `${c} (${ERR[c]?.[0] || ''}) × ${n}`).join('; '), strategy: 'model', err: rep[0][0] });
  // 6. bỏ qua phần khám phá
  const quizMods = [...new Set(at.map(a => a.m))]; let skip = 0;
  quizMods.forEach(code => { const first = at.filter(a => a.m === code).sort((a, b) => a.ts - b.ts)[0]; const stepsBefore = ev.filter(e => e.m === code && e.type === 'step' && e.ts < first.ts).length; if (stepsBefore < 2) skip++; });
  if (quizMods.length >= 2 && skip / quizMods.length >= .5) flags.push({ id: 'skip', level: 'mid', title: 'Làm câu hỏi khi chưa khám phá mô hình', evidence: `${skip}/${quizMods.length} mô-đun làm bài trước khi xem các bước khám phá`, strategy: 'explore' });
  // 7. ít ôn tập / học không đều
  const reviewMods = Object.entries(st.modules).filter(([, md]) => md.state === 'review').map(([c]) => c);
  const revisits = all.filter(x => reviewMods.includes(x.m) && now - x.ts < 10 * DAY).length;
  if (reviewMods.length && revisits === 0 && all.length >= 5) flags.push({ id: 'noreview', level: 'low', title: 'Chưa ôn lại các mô-đun cũ', evidence: `${reviewMods.length} mô-đun ở chế độ Ôn tập chưa được mở lại trong 10 ngày`, strategy: 'interleave' });
  if (all.length && days14 <= 2) flags.push({ id: 'irregular', level: 'mid', title: 'Học chưa đều', evidence: `Chỉ học ${days14} ngày trong 14 ngày qua`, strategy: 'spaced' });
  // mô-đun đang mở chưa bắt đầu
  const openMods = Object.entries(st.modules).filter(([, md]) => md.state === 'open');
  const notStarted = openMods.filter(([c]) => !all.some(x => x.m === c)).map(([c, md]) => ({ code: c, due: md.due }));
  const weak = Object.entries(m).filter(([, v]) => v.n >= 2 && v.score < .5).map(([o, v]) => ({ o, ...v })).sort((a, b) => a.score - b.score);
  const avg = Object.values(m).length ? Object.values(m).reduce((s, v) => s + v.score, 0) / Object.values(m).length : null;
  return { sid, mastery: m, avg, flags, errs, hours, days14, weak, notStarted, nAttempts: at.length, nEvents: ev.length };
}

export function classSummary(st, now = Date.now()) {
  const per = st.students.map(s => ({ ...s, sum: studentSummary(st, s.id, now) }));
  const errs = {}; st.attempts.filter(a => a.err).forEach(a => { (errs[a.err] ||= { n: 0, students: new Set() }).n++; errs[a.err].students.add(a.s); });
  const hours = Array(24).fill(0); per.forEach(p => p.sum.hours.forEach((v, h) => (hours[h] += v)));
  const objs = {}; per.forEach(p => Object.entries(p.sum.mastery).forEach(([o, v]) => { (objs[o] ||= []).push(v.score); }));
  const objAvg = Object.fromEntries(Object.entries(objs).map(([o, arr]) => [o, arr.reduce((a, b) => a + b, 0) / arr.length]));
  const support = per.map(p => {
    const reasons = [];
    if (p.sum.avg !== null && p.sum.avg < .6) reasons.push(`nắm vững trung bình ${Math.round(p.sum.avg * 100)}%`);
    p.sum.notStarted.forEach(ns => { if (ns.due && ns.due - now < 2 * DAY) reasons.push(`chưa bắt đầu ${ns.code} (hạn ${new Date(ns.due).toLocaleDateString('vi-VN')})`); });
    const hi = p.sum.flags.filter(f => f.level === 'high'); if (hi.length) reasons.push(hi.map(f => f.title.toLowerCase()).join(', '));
    if (p.sum.nEvents + p.sum.nAttempts === 0) reasons.push('chưa có hoạt động nào');
    return { id: p.id, name: p.name, reasons, risk: reasons.length };
  }).filter(x => x.risk).sort((a, b) => b.risk - a.risk);
  return { per, errs, hours, objAvg, support };
}

// Bài kiểm tra tháng: items = [{no, o}], scores[sid] = [0..1 cho từng câu]
export function testAnalysis(test, st) {
  const res = {};
  for (const [sid, arr] of Object.entries(test.scores)) {
    const byO = {}; test.items.forEach((it, i) => { (byO[it.o] ||= []).push(arr[i] ?? 0); });
    const weak = Object.entries(byO).filter(([, v]) => v.reduce((a, b) => a + b, 0) / v.length < .5).map(([o]) => o);
    const total = arr.reduce((a, b) => a + b, 0) / test.items.length * 10;
    // nhiệm vụ cải thiện hoàn thành khi trả lời đúng ≥ 2 câu của mục tiêu đó sau ngày kiểm tra
    const fixed = weak.filter(o => st.attempts.filter(a => a.s === sid && a.o === o && a.ts > test.date && a.correct).length >= 2);
    res[sid] = { total, weak, fixed };
  }
  return res;
}

export function adviceText(sum, name = 'Em') {
  if (!sum.nAttempts && !sum.nEvents) return `${name} chưa có hoạt động học nào. Hãy bắt đầu với mô-đun đang mở: đi qua các bước khám phá mô hình 3D rồi làm câu hỏi luyện tập nhé.`;
  const parts = [];
  const good = Object.entries(sum.mastery).filter(([, v]) => v.score >= .8).length;
  if (good) parts.push(`${name} đã nắm vững ${good} mục tiêu – rất tốt!`);
  const top = sum.flags.slice().sort((a, b) => ({ high: 0, mid: 1, low: 2 }[a.level] - { high: 0, mid: 1, low: 2 }[b.level])).slice(0, 2);
  top.forEach(f => { const s = STRATEGIES[f.strategy]; parts.push(`Hệ thống nhận thấy: ${f.title.toLowerCase()} (${f.evidence}). Gợi ý: ${s.name.toLowerCase()} – ${s.how.charAt(0).toLowerCase() + s.how.slice(1)}`); });
  if (sum.weak.length) parts.push(`Mục tiêu cần củng cố: ${sum.weak.slice(0, 3).map(w => w.o).join(', ')}.`);
  return parts.join(' ');
}

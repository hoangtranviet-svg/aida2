// Nhật kí hoạt động của giáo viên (để quản trị viên theo dõi). Dùng chung cho máy chủ thật và bản chạy thử.
// Mỗi mục: { ts, t: loại, d: mô tả ngắn, n: số lần gộp }
const cut = (s, n = 70) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const ST = { open: 'mở', locked: 'khoá', review: 'chuyển sang ôn tập', draft: 'nháp', closed: 'đã đóng', scheduled: 'hẹn giờ' };

// thao tác nào được ghi lại và mô tả thế nào
const RULES = {
  setModule: (code, p) => p?.state ? { t: 'module', d: `${ST[p.state] || p.state} mô-đun ${code}` } : p && 'due' in p ? { t: 'module', d: `đặt hạn mô-đun ${code}` } : null,
  saveTest: t => ({ t: 'test', d: `${cut(t.title, 50)} (${t.kind === 'paper' ? 'bài giấy' : 'trực tuyến'}${t.status ? ', ' + (ST[t.status] || t.status) : ''})` }),
  deleteTest: () => ({ t: 'test', d: 'xoá một bài kiểm tra' }),
  addSlide: s => ({ t: 'slide', d: `đưa bài giảng “${cut(s.title, 50)}”` }),
  delSlide: () => ({ t: 'slide', d: 'xoá một bài giảng' }),
  post: p => ({ t: 'post', d: `đăng thông báo: ${cut(p.text, 60)}` }),
  delPost: () => ({ t: 'post', d: 'xoá một thông báo' }),
  saveNote: () => ({ t: 'note', d: 'viết nhận xét học sinh' }),
  saveQuestion: q => ({ t: 'question', d: 'thêm/sửa câu hỏi ngân hàng' }),
  delQuestion: () => ({ t: 'question', d: 'xoá câu hỏi ngân hàng' }),
  removeMember: () => ({ t: 'member', d: 'xoá học sinh khỏi lớp' }),
  newCode: () => ({ t: 'class', d: 'đổi mã lớp' }),
  renameClass: n => ({ t: 'class', d: `đổi tên lớp thành “${cut(n, 30)}”` }),
};
export const TYPES = { module: 'Mô-đun', test: 'Kiểm tra', slide: 'Bài giảng', post: 'Bảng tin', note: 'Nhận xét', question: 'Ngân hàng câu hỏi', member: 'Học sinh', class: 'Lớp học' };

// bọc các hàm act: chạy như cũ, sau đó ghi nhật kí (chỉ khi người thao tác là GV của lớp – do hàm push tự kiểm tra)
export function wrapActs(act, push) {
  Object.entries(RULES).forEach(([k, rule]) => {
    const fn = act[k]; if (typeof fn !== 'function') return;
    act[k] = (...a) => { const r = fn(...a); try { const e = rule(...a); if (e) push(e); } catch (err) { /* không làm hỏng thao tác chính */ } return r; };
  });
}
// gộp các thao tác lặp lại liên tục (VD: nhập điểm từng ô, thêm hàng loạt câu hỏi)
export function makeBuffer(flush, wait = 4000) {
  let buf = [], tm = 0, last = null;
  const api = {
    push(e) {
      const now = Date.now();
      const same = last && last.t === e.t && (last.d === e.d || e.t === 'question') && now - last.ts < 10 * 60e3;
      if (same) { if (!buf.includes(last)) { last = { ...last, n: 0 }; buf.push(last); } last.n++; last.ts = now; }
      else { last = { ts: now, ...e, n: 1 }; buf.push(last); }
      clearTimeout(tm); tm = setTimeout(api.flush, wait);
    },
    flush() { clearTimeout(tm); if (!buf.length) return; const b = buf; buf = []; flush(b.map(x => ({ ...x }))); },
    reset() { api.flush(); last = null; },
  };
  return api;
}

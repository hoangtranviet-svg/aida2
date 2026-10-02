// Lớp dữ liệu máy chủ thật: Firebase Authentication + Cloud Firestore (gói miễn phí Spark).
// Cùng giao diện hàm với data-demo.js. Dữ liệu lớp được giữ trong bộ nhớ (C) và đồng bộ thời gian thực bằng onSnapshot.
//
// Cấu trúc Firestore:
//   users/{uid}                          hồ sơ: name, email, role ('gv'|'hs'), classes[]
//   codes/{MÃLỚP}                        { cid } – tra mã lớp khi học sinh đăng kí
//   classes/{cid}                        name, grade, year, code, teacher, teacherName, modules{}, levels{}, qv
//   classes/{cid}/members/{uid}          học sinh trong lớp: name, email, code, joined
//   classes/{cid}/posts|slides|questions|tests|files/{id}   do GV ghi, cả lớp đọc
//   classes/{cid}/logs/{uid}_{yyyymm}    dấu vết học tập của từng HS theo tháng: events[], attempts[]
//   classes/{cid}/subs/{tid}_{uid}       bài làm trực tuyến
//   classes/{cid}/marks/{uid}            điểm bài giấy: { [tid]: [điểm từng câu] }
//   classes/{cid}/notes/{uid}            nhận xét của GV
//   classes/{cid}/reads/{uid}            thời điểm đọc bảng tin
const V = '10.12.2';
const SDK = n => `https://www.gstatic.com/firebasejs/${V}/firebase-${n}.js`;
let A, Au, F, app, auth, fs, CFG;

export const MODE = 'firebase';
export const CAN = { reset: false, files: 'cloud' };

let user = null, uidCur = null, busy = false;
let C = null; const members = {}; let classList = [];
let unsubs = []; const fns = new Set();
const emit = (why, local = false) => fns.forEach(f => f(why, local));
export const subscribe = fn => (fns.add(fn), () => fns.delete(fn));
const clean = o => JSON.parse(JSON.stringify(o));
const mkid = p => p + '-' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
const ym = (t = Date.now()) => { const d = new Date(t); return d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0'); };
const lsGet = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* */ } };
const fail = (what) => e => { console.warn(what, e); emit({ type: 'error', msg: `Chưa lưu được (${what}). Kiểm tra kết nối mạng rồi thử lại.` }); };

const ERRS = { 'auth/invalid-credential': 'Email hoặc mật khẩu chưa đúng.', 'auth/wrong-password': 'Mật khẩu chưa đúng.', 'auth/user-not-found': 'Không có tài khoản với email này.', 'auth/email-already-in-use': 'Email này đã có tài khoản. Hãy đăng nhập.', 'auth/weak-password': 'Mật khẩu cần ít nhất 6 kí tự.', 'auth/invalid-email': 'Email chưa đúng định dạng.', 'auth/too-many-requests': 'Thử sai quá nhiều lần. Đợi vài phút rồi thử lại.', 'auth/network-request-failed': 'Không kết nối được máy chủ. Kiểm tra mạng.' };
const nice = e => new Error(ERRS[e?.code] || e?.message || 'Có lỗi xảy ra.');

export async function init(cfg) {
  CFG = cfg;
  [A, Au, F] = await Promise.all([import(SDK('app')), import(SDK('auth')), import(SDK('firestore'))]);
  app = A.initializeApp(cfg); auth = Au.getAuth(app);
  try { fs = F.initializeFirestore(app, { localCache: F.persistentLocalCache({ tabManager: F.persistentMultipleTabManager() }) }); } catch (e) { fs = F.getFirestore(app); }
  await new Promise(res => { const un = Au.onAuthStateChanged(auth, async u => { un(); await onUser(u); res(); }); });
  Au.onAuthStateChanged(auth, async u => { if (busy) return; if ((u?.uid || null) !== uidCur) { await onUser(u); emit({ type: 'auth' }, true); } });
  addEventListener('pagehide', flush); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush(); });
}

async function onUser(u) {
  uidCur = u?.uid || null; detach(); C = null; user = null; classList = [];
  if (!u) return;
  const s = await F.getDoc(F.doc(fs, 'users', u.uid)).catch(() => null);
  const d = s?.exists() ? s.data() : { name: u.displayName || u.email, email: u.email, role: 'hs', classes: [] };
  user = { uid: u.uid, name: d.name, email: d.email, role: d.role, classes: d.classes || [], created: d.created };
  classList = (await Promise.all(user.classes.map(cid => F.getDoc(F.doc(fs, 'classes', cid)).then(x => x.exists() ? { id: cid, ...x.data() } : null).catch(() => null)))).filter(Boolean);
  const want = lsGet('aida2-fb-cid-' + u.uid); const cid = classList.find(c => c.id === want)?.id || classList[0]?.id;
  if (cid) await openClass(cid);
}

// ---------- tài khoản ----------
export const me = () => user && { ...user, classes: classList.map(c => c.id) };
export const userName = id => members[id]?.name || (C && id === C.teacher ? C.teacherName : user?.uid === id ? user.name : 'Không rõ');
export const userOf = id => members[id] ? { uid: id, ...members[id], role: 'hs' } : (user?.uid === id ? me() : null);

function check({ name, email, password }) {
  if (String(name || '').trim().length < 3) throw new Error('Nhập họ và tên đầy đủ.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email || '').trim())) throw new Error('Email chưa đúng định dạng, ví dụ: ten@truong.edu.vn');
  if (String(password).length < 6) throw new Error('Mật khẩu cần ít nhất 6 kí tự.');
}
export async function register({ name, email, password, role, code }) {
  check({ name, email, password }); name = name.trim(); email = email.trim().toLowerCase();
  let cid = null, CODE = null;
  if (role === 'hs') { CODE = String(code || '').trim().toUpperCase(); const s = CODE ? await F.getDoc(F.doc(fs, 'codes', CODE)) : null; if (!s?.exists()) throw new Error('Không tìm thấy lớp với mã này. Hỏi lại thầy/cô mã lớp (6 kí tự).'); cid = s.data().cid; }
  busy = true;
  try {
    const cr = await Au.createUserWithEmailAndPassword(auth, email, password).catch(e => { throw nice(e); });
    await Au.updateProfile(cr.user, { displayName: name }).catch(() => {});
    await F.setDoc(F.doc(fs, 'users', cr.user.uid), { name, email, role, classes: cid ? [cid] : [], created: Date.now() });
    if (cid) await F.setDoc(F.doc(fs, 'classes', cid, 'members', cr.user.uid), { name, email, code: CODE, joined: Date.now() });
    await onUser(cr.user);
  } finally { busy = false; }
  return me();
}
export async function login({ email, password, keep = true }) {
  busy = true;
  try {
    await Au.setPersistence(auth, keep ? Au.browserLocalPersistence : Au.browserSessionPersistence);
    const cr = await Au.signInWithEmailAndPassword(auth, String(email).trim().toLowerCase(), password).catch(e => { throw nice(e); });
    await onUser(cr.user);
  } finally { busy = false; }
  return me();
}
export function logout() { flush(); detach(); C = null; user = null; uidCur = null; Au.signOut(auth).catch(() => {}); }
export async function changePassword(oldPw, newPw) {
  if (String(newPw).length < 6) throw new Error('Mật khẩu mới cần ít nhất 6 kí tự.');
  const u = auth.currentUser; try { await Au.reauthenticateWithCredential(u, Au.EmailAuthProvider.credential(u.email, oldPw)); await Au.updatePassword(u, newPw); } catch (e) { throw nice(e); }
}

// ---------- lớp ----------
const code6 = () => { const S = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 6; i++) s += S[Math.floor(Math.random() * S.length)]; return s; };
export const classByCode = () => null;
export const myClasses = () => classList.map(c => c.id === C?.id ? C : { ...c, members: c.members || [] });
export const cls = () => C;
export async function switchClass(cid) { lsSet('aida2-fb-cid-' + uidCur, cid); await openClass(cid); emit({ type: 'switch' }, true); }
export async function createClass({ name, grade = 10, year }) {
  let code = code6(); for (let i = 0; i < 5 && (await F.getDoc(F.doc(fs, 'codes', code))).exists(); i++) code = code6();
  const ref = F.doc(F.collection(fs, 'classes')); const b = F.writeBatch(fs);
  b.set(ref, { name: name.trim(), grade, year: year || '2026–2027', code, teacher: user.uid, teacherName: user.name, modules: {}, levels: {}, qv: 0, created: Date.now() });
  b.set(F.doc(fs, 'codes', code), { cid: ref.id });
  b.update(F.doc(fs, 'users', user.uid), { classes: F.arrayUnion(ref.id) });
  await b.commit(); classList.push({ id: ref.id, name: name.trim(), code }); lsSet('aida2-fb-cid-' + user.uid, ref.id); await openClass(ref.id);
  return C;
}
export async function joinClass(code) {
  const CODE = String(code || '').trim().toUpperCase(); const s = await F.getDoc(F.doc(fs, 'codes', CODE)); if (!s.exists()) throw new Error('Mã lớp không đúng.');
  const cid = s.data().cid;
  await F.setDoc(F.doc(fs, 'classes', cid, 'members', user.uid), { name: user.name, email: user.email, code: CODE, joined: Date.now() });
  await F.updateDoc(F.doc(fs, 'users', user.uid), { classes: F.arrayUnion(cid) });
  const c = await F.getDoc(F.doc(fs, 'classes', cid)); classList.push({ id: cid, ...c.data() }); lsSet('aida2-fb-cid-' + user.uid, cid); await openClass(cid);
  return C;
}
// GV nhập danh sách: tạo tài khoản bằng một phiên Firebase phụ để không đăng xuất GV
export async function addStudents(rows, password) {
  const app2 = A.initializeApp(CFG, 'them-hs-' + Date.now()); const auth2 = Au.getAuth(app2); const fs2 = F.getFirestore(app2);
  let made = 0; const skipped = [];
  for (const r of rows) {
    const email = String(r.email || '').trim().toLowerCase(), name = String(r.name || '').trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { skipped.push(r); continue; }
    try {
      const cr = await Au.createUserWithEmailAndPassword(auth2, email, password);
      await F.setDoc(F.doc(fs2, 'users', cr.user.uid), { name, email, role: 'hs', classes: [C.id], created: Date.now() });
      await F.setDoc(F.doc(fs, 'classes', C.id, 'members', cr.user.uid), { name, email, code: C.code, joined: Date.now() });
      await Au.signOut(auth2); made++;
    } catch (e) { skipped.push({ ...r, reason: ERRS[e.code] || e.message }); }
  }
  A.deleteApp(app2).catch(() => {});
  return { made, skipped };
}
export const students = (c = C) => c === C ? (C?.members || []).map(id => ({ id, name: members[id]?.name || 'Học sinh', email: members[id]?.email || '' })).sort((a, b) => a.name.split(' ').pop().localeCompare(b.name.split(' ').pop(), 'vi')) : [];
export function analyticsView(c = C) { return { students: students(c), modules: c.modules, events: c.events, attempts: c.attempts }; }
export async function resetDemo() { throw new Error('Không áp dụng khi dùng máy chủ thật.'); }

// ---------- đồng bộ một lớp ----------
function detach() { unsubs.forEach(u => { try { u(); } catch (e) { /* */ } }); unsubs = []; }
function listen(ref, apply, type) {
  return new Promise(res => {
    let first = true;
    const un = F.onSnapshot(ref, { includeMetadataChanges: false }, snap => {
      const extra = apply(snap) || []; rebuild();
      if (first) { first = false; res(); return; }
      const local = snap.metadata.hasPendingWrites; extra.forEach(w => emit({ cid: C?.id, ...w }, local)); emit({ cid: C?.id, type }, local);
    },
      err => { console.warn('Không đọc được', type, err.code); if (first) { first = false; res(); } });
    unsubs.push(un);
  });
}
let base = {}; let pendingEv = [];
function rebuild() {
  if (!C) return;
  const logs = Object.values(base.logs || {});
  C.events = logs.flatMap(l => l.events || []).concat(pendingEv);
  C.attempts = logs.flatMap(l => l.attempts || []);
  C.tests = (base.tests || []).map(t => { if (t.kind !== 'paper') return t; const scores = {}; Object.entries(base.marks || {}).forEach(([sid, m]) => { if (m[t.id]) scores[sid] = m[t.id]; }); return { ...t, scores }; });
}
async function openClass(cid) {
  detach(); flush(); base = { logs: {}, marks: {}, tests: [] }; pendingEv = [];
  Object.keys(members).forEach(k => delete members[k]);
  C = { id: cid, members: [], modules: {}, levels: {}, events: [], attempts: [], tests: [], subs: [], slides: [], posts: [], notes: {}, questions: [], read: {} };
  const cref = F.doc(fs, 'classes', cid); const col = n => F.collection(fs, 'classes', cid, n);
  await listen(cref, s => { if (!s.exists()) return; const before = C.modules || {}; Object.assign(C, s.data(), { id: cid });
    return Object.entries(C.modules || {}).filter(([k, m]) => before[k]?.state !== m.state).map(([code, m]) => ({ type: 'module', code, state: m.state })); }, 'class');
  const gv = C.teacher === uidCur; const me = uidCur;
  const docsOf = s => s.docs.map(d => ({ id: d.id, ...d.data() }));
  const jobs = [
    listen(col('posts'), s => { C.posts = docsOf(s).sort((a, b) => b.ts - a.ts); }, 'post'),
    listen(col('slides'), s => { C.slides = docsOf(s); }, 'slide'),
    listen(col('questions'), s => { C.questions = docsOf(s); C.qv = (C.qv || 0) + 1; }, 'bank'),
    listen(col('tests'), s => { const before = Object.fromEntries((base.tests || []).map(t => [t.id, t.status])); base.tests = docsOf(s);
      return base.tests.filter(t => t.status === 'open' && before[t.id] !== 'open').map(t => ({ type: 'test', id: t.id, status: 'open' })); }, 'test'),
    listen(F.doc(fs, 'classes', cid, 'reads', me), s => { C.read = { [me]: s.exists() ? s.data().posts : 0 }; }, 'read'),
  ];
  if (gv) jobs.push(
    listen(col('members'), s => { C.members = s.docs.map(d => d.id); s.docs.forEach(d => (members[d.id] = d.data())); }, 'class'),
    listen(col('logs'), s => { base.logs = Object.fromEntries(s.docs.map(d => [d.id, d.data()])); }, 'attempt'),
    listen(col('subs'), s => { const before = Object.fromEntries(C.subs.map(x => [x.id, x.end])); C.subs = docsOf(s);
      return C.subs.filter(x => x.end && !before[x.id]).map(x => ({ type: 'sub', tid: x.tid, final: true })); }, 'sub'),
    listen(col('notes'), s => { C.notes = Object.fromEntries(s.docs.map(d => [d.id, d.data()])); }, 'note'),
    listen(col('marks'), s => { base.marks = Object.fromEntries(s.docs.map(d => [d.id, d.data()])); }, 'test'),
  );
  else jobs.push(
    listen(F.doc(fs, 'classes', cid, 'members', me), s => { C.members = s.exists() ? [me] : []; if (s.exists()) members[me] = s.data(); }, 'class'),
    listen(F.query(col('logs'), F.where('uid', '==', me)), s => { base.logs = Object.fromEntries(s.docs.map(d => [d.id, d.data()])); }, 'attempt'),
    listen(F.query(col('subs'), F.where('uid', '==', me)), s => { C.subs = docsOf(s); }, 'sub'),
    listen(F.doc(fs, 'classes', cid, 'notes', me), s => { C.notes = s.exists() ? { [me]: s.data() } : {}; }, 'note'),
    listen(F.doc(fs, 'classes', cid, 'marks', me), s => { base.marks = s.exists() ? { [me]: s.data() } : {}; }, 'test'),
  );
  await Promise.all(jobs); rebuild();
}

// ---------- ghi dữ liệu ----------
let evBuf = [], evT = 0;
function flush() {
  clearTimeout(evT); if (!evBuf.length || !C || !uidCur) return; const buf = evBuf; evBuf = []; pendingEv = [];
  F.setDoc(F.doc(fs, 'classes', C.id, 'logs', uidCur + '_' + ym()), { uid: uidCur, events: F.arrayUnion(...buf.map(clean)) }, { merge: true }).catch(fail('nhật kí học tập'));
}
const cref = () => F.doc(fs, 'classes', C.id); const sub = (n, id) => F.doc(fs, 'classes', C.id, n, id);
export const act = {
  setModule: (code, patch) => { const m = { ...(C.modules[code] || { state: 'locked' }), ...patch }; if (patch.state === 'open' && C.modules[code]?.state !== 'open') m.openedAt = Date.now(); C.modules[code] = m; F.updateDoc(cref(), new F.FieldPath('modules', code), clean(m)).catch(fail('mô-đun')); },
  logEvent: e => { if (C.teacher === uidCur) return; const ev = { s: uidCur, ts: Date.now(), ...e }; evBuf.push(ev); pendingEv.push(ev); C.events.push(ev); clearTimeout(evT); evT = setTimeout(flush, 5000); },
  addAttempt: a => { if (C.teacher === uidCur) return; F.setDoc(F.doc(fs, 'classes', C.id, 'logs', uidCur + '_' + ym()), { uid: uidCur, attempts: F.arrayUnion(clean({ s: uidCur, ts: Date.now(), ...a })) }, { merge: true }).catch(fail('câu trả lời')); },
  saveTest: t => {
    const { scores, ...rest } = t; F.setDoc(sub('tests', t.id), clean(rest)).catch(fail('bài kiểm tra'));
    if (t.kind === 'paper' && scores) { const b = F.writeBatch(fs); Object.entries(scores).forEach(([sid, row]) => b.set(sub('marks', sid), { [t.id]: row }, { merge: true })); b.commit().catch(fail('bảng điểm')); }
  },
  deleteTest: id => { const b = F.writeBatch(fs); b.delete(sub('tests', id)); C.subs.filter(s => s.tid === id).forEach(s => b.delete(sub('subs', s.id))); b.commit().catch(fail('xoá bài')); },
  saveSub: s => { const id = s.tid + '_' + s.uid; F.setDoc(sub('subs', id), clean({ ...s, id, end: s.end ?? null, savedAt: F.serverTimestamp() })).catch(fail('bài làm')); },
  addSlide: s => F.setDoc(sub('slides', s.id), clean(s)).catch(fail('bài giảng')),
  delSlide: id => F.deleteDoc(sub('slides', id)).catch(fail('xoá bài giảng')),
  post: p => { const id = mkid('p'); F.setDoc(sub('posts', id), clean({ id, by: uidCur, ts: Date.now(), ...p })).catch(fail('thông báo')); },
  delPost: id => F.deleteDoc(sub('posts', id)).catch(fail('xoá thông báo')),
  readPosts: () => { C.read = { [uidCur]: Date.now() }; F.setDoc(sub('reads', uidCur), { posts: Date.now() }).catch(() => {}); },
  saveNote: (sid, note) => F.setDoc(sub('notes', sid), clean({ ...note, by: uidCur, ts: Date.now() })).catch(fail('nhận xét')),
  saveQuestion: q => F.setDoc(sub('questions', q.id), clean(q)).catch(fail('câu hỏi')),
  delQuestion: id => F.deleteDoc(sub('questions', id)).catch(fail('xoá câu hỏi')),
  setLevel: (qid, lv) => { C.levels[qid] = lv; F.updateDoc(cref(), new F.FieldPath('levels', qid), lv).catch(fail('mức độ')); },
  removeMember: sid => F.deleteDoc(sub('members', sid)).catch(fail('xoá học sinh')),
  newCode: () => { const old = C.code, code = code6(); const b = F.writeBatch(fs); b.update(cref(), { code }); b.set(F.doc(fs, 'codes', code), { cid: C.id }); b.delete(F.doc(fs, 'codes', old)); b.commit().catch(fail('mã lớp')); return code; },
  renameClass: name => F.updateDoc(cref(), { name }).catch(fail('tên lớp')),
};

// ---------- ảnh bài giảng: lưu trong Firestore (không cần gói trả phí của Storage) ----------
async function toJpeg(blob, maxW = 1600) {
  const img = await createImageBitmap(blob); let w = img.width, h = img.height; if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; cv.getContext('2d').drawImage(img, 0, 0, w, h);
  for (const q of [.85, .75, .62, .5]) { const url = cv.toDataURL('image/jpeg', q); if (url.length < 900000) return url; }
  cv.width = Math.round(w * .7); cv.height = Math.round(h * .7); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height); return cv.toDataURL('image/jpeg', .6);
}
export async function putFile(id, blob) { const data = await toJpeg(blob); await F.setDoc(sub('files', id), { data, by: uidCur, ts: Date.now() }); }
export async function getFile(id) { const s = await F.getDoc(sub('files', id)).catch(() => null); if (!s?.exists()) return null; return await (await fetch(s.data().data)).blob(); }
export async function delFile(id) { F.deleteDoc(sub('files', id)).catch(() => {}); }

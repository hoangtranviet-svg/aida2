// Lớp dữ liệu AIDA 2.0
// Chế độ "demo": lưu trong trình duyệt (localStorage + IndexedDB), đồng bộ tức thì giữa các thẻ bằng BroadcastChannel.
// Khi nối máy chủ (Firebase), chỉ thay phần thân các hàm trong tệp này; giao diện gọi đúng các hàm như cũ.
import { store, uid } from './util.js';

export const MODE = 'demo';
export const CAN = { reset: true, files: 'local' };
const KEY = 'aida2-db-v3', SKEY = 'aida2-session-v3';
let db = null, session = null;
const subs = new Set();
let chan = null; try { chan = new BroadcastChannel('aida2-v3'); } catch (e) { /* không hỗ trợ */ }

async function hash(s) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('aida2|' + s)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join(''); }
  catch (e) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return 'h' + h; }
}
export { hash as _hash };

function persist(why) {
  store.set(KEY, db);
  try { chan?.postMessage({ why }); } catch (e) { /* */ }
  subs.forEach(f => f(why, true));
}
function reload(why) { const v = store.get(KEY); if (v) db = v; subs.forEach(f => f(why, false)); }
chan && (chan.onmessage = e => reload(e.data?.why || {}));
addEventListener('storage', e => { if (e.key === KEY) reload({ type: 'storage' }); });
export const subscribe = fn => (subs.add(fn), () => subs.delete(fn));

let ADMINS = ['gv@aida.demo'];
const isAdminEmail = e => ADMINS.includes(String(e || '').toLowerCase());
export async function init(cfg, admins = []) {
  ADMINS = ['gv@aida.demo', ...admins.map(a => a.toLowerCase())];
  db = store.get(KEY);
  if (!db || !db.v || db.v < 4) { const { seedDB } = await import('./seed.js'); db = await seedDB(hash); store.set(KEY, db); }
  session = (() => { try { return JSON.parse(sessionStorage.getItem(SKEY)); } catch (e) { return null; } })() || store.get(SKEY + '-keep');
  if (session && !db.users[session.uid]) session = null;
  return db;
}
const saveSession = (keep = true) => { try { sessionStorage.setItem(SKEY, JSON.stringify(session)); } catch (e) { /* */ } if (keep) store.set(SKEY + '-keep', session); };

// ---------- tài khoản ----------
const pub = u => u && ({ uid: u.uid, name: u.name, email: u.email, role: u.role, classes: u.classes || [], created: u.created, isAdmin: isAdminEmail(u.email), approved: u.role !== 'gv' || u.approved === true || isAdminEmail(u.email), rejected: !!u.rejected });
export const me = () => session && pub(db.users[session.uid]);
export const userName = id => db.users[id]?.name || 'Không rõ';
export const userOf = id => pub(db.users[id]);
const findEmail = email => Object.values(db.users).find(u => u.email === String(email).trim().toLowerCase());

export async function register({ name, email, password, role, code }) {
  email = String(email || '').trim().toLowerCase(); name = String(name || '').trim();
  if (name.length < 3) throw new Error('Nhập họ và tên đầy đủ.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Email chưa đúng định dạng, ví dụ: ten@truong.edu.vn');
  if (String(password).length < 6) throw new Error('Mật khẩu cần ít nhất 6 kí tự.');
  if (findEmail(email)) throw new Error('Email này đã có tài khoản. Hãy đăng nhập.');
  let cls = null;
  if (role === 'hs') { cls = classByCode(code); if (!cls) throw new Error('Không tìm thấy lớp với mã này. Hỏi lại thầy/cô mã lớp (6 kí tự).'); }
  const u = { uid: uid('u'), name, email, role, pw: await hash(password), classes: [], created: Date.now(), ...(role === 'gv' ? { approved: isAdminEmail(email) } : {}) };
  db.users[u.uid] = u;
  if (cls) { cls.members.push(u.uid); u.classes.push(cls.id); }
  session = { uid: u.uid, cid: cls?.id || null }; saveSession(); persist({ type: 'user' });
  return pub(u);
}
export async function login({ email, password, keep = true }) {
  const u = findEmail(email); if (!u) throw new Error('Không có tài khoản với email này.');
  if (u.pw !== await hash(password)) throw new Error('Mật khẩu chưa đúng.');
  session = { uid: u.uid, cid: u.classes[0] || null }; saveSession(keep); return pub(u);
}
export function logout() { session = null; try { sessionStorage.removeItem(SKEY); } catch (e) { /* */ } store.set(SKEY + '-keep', null); }

// ---------- lớp học ----------
const code6 = () => { const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let s = ''; for (let i = 0; i < 6; i++) s += A[Math.floor(Math.random() * A.length)]; return s; };
export const classByCode = code => Object.values(db.classes).find(c => c.code === String(code || '').trim().toUpperCase());
export const myClasses = () => (db.users[session?.uid]?.classes || []).map(id => db.classes[id]).filter(Boolean);
export const cls = () => session?.cid ? db.classes[session.cid] : null;
export function switchClass(cid) { session.cid = cid; saveSession(); subs.forEach(f => f({ type: 'switch' }, true)); }
export function emptyClass(o) { return { id: uid('c'), code: code6(), created: Date.now(), members: [], modules: {}, events: [], attempts: [], tests: [], subs: [], slides: [], posts: [], notes: {}, questions: [], levels: {}, ...o }; }
export async function createClass({ name, grade = 10, year }) {
  const u = db.users[session.uid]; if (!me().approved) throw new Error('Tài khoản giáo viên chưa được phê duyệt.'); const c = emptyClass({ name: name.trim(), grade, year: year || '2026–2027', teacher: u.uid });
  while (classByCode(c.code)) c.code = code6();
  db.classes[c.id] = c; u.classes.push(c.id); session.cid = c.id; saveSession(); persist({ type: 'class' }); return c;
}
// lớp mẫu 10KHXH5 đầy đủ dữ liệu (học sinh mẫu đăng nhập bằng mật khẩu "hocsinh")
export async function createSampleClass(onStep) {
  if (!me().approved) throw new Error('Tài khoản giáo viên chưa được phê duyệt.');
  const { buildSample } = await import('./sample.js'); const u = db.users[session.uid];
  const pre = 'm' + Math.random().toString(36).slice(2, 6); const S = buildSample({ teacher: u.uid, teacherName: u.name, prefix: pre });
  const pw = await hash('hocsinh'); const c = emptyClass({ ...S.cls, teacher: u.uid, members: S.studs.map(s => s.id) }); while (classByCode(c.code)) c.code = code6();
  S.studs.forEach(st => { db.users[st.id] = { uid: st.id, name: st.name, email: pre + '.' + st.email, role: 'hs', pw, classes: [c.id], created: Date.now() }; });
  Object.assign(c, { events: S.events, attempts: S.attempts, tests: S.tests, subs: S.subs, notes: S.notes, posts: S.posts });
  db.classes[c.id] = c; u.classes.unshift(c.id); session.cid = c.id; saveSession(); persist({ type: 'class' }); onStep?.(1); return c;
}
export async function joinClass(code) {
  const c = classByCode(code); if (!c) throw new Error('Mã lớp không đúng.');
  const u = db.users[session.uid]; if (!c.members.includes(u.uid)) c.members.push(u.uid); if (!u.classes.includes(c.id)) u.classes.push(c.id);
  session.cid = c.id; saveSession(); persist({ type: 'class' }); return c;
}
// GV nhập danh sách lớp: tạo sẵn tài khoản (mật khẩu ban đầu do GV phát cho HS)
export async function addStudents(rows, password) {
  const c = cls(); const pw = await hash(password); const made = [], skipped = [];
  for (const r of rows) {
    const email = String(r.email || '').trim().toLowerCase(); const name = String(r.name || '').trim();
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { skipped.push(r); continue; }
    let u = findEmail(email);
    if (!u) { u = { uid: uid('u'), name, email, role: 'hs', pw, classes: [], created: Date.now() }; db.users[u.uid] = u; made.push(u); }
    if (!c.members.includes(u.uid)) c.members.push(u.uid); if (!u.classes.includes(c.id)) u.classes.push(c.id);
  }
  persist({ cid: c.id, type: 'class' }); return { made: made.length, skipped };
}
export async function changePassword(oldPw, newPw) {
  const u = db.users[session.uid]; if (u.pw !== await hash(oldPw)) throw new Error('Mật khẩu hiện tại chưa đúng.');
  if (String(newPw).length < 6) throw new Error('Mật khẩu mới cần ít nhất 6 kí tự.');
  u.pw = await hash(newPw); persist({ type: 'user' });
}
export const students = (c = cls()) => (c?.members || []).map(id => db.users[id]).filter(Boolean).map(u => ({ id: u.uid, name: u.name, email: u.email })).sort((a, b) => a.name.split(' ').pop().localeCompare(b.name.split(' ').pop(), 'vi'));

// ---------- thao tác trong lớp (mọi thay đổi đi qua đây) ----------
function mut(fn, why) { const c = cls(); if (!c) return; const r = fn(c); persist({ cid: c.id, ...why }); return r; }
export const act = {
  setModule: (code, patch) => mut(c => { const m = c.modules[code] ||= { state: 'locked' }; const was = m.state; Object.assign(m, patch); if (patch.state === 'open' && was !== 'open') m.openedAt = Date.now(); return was; }, { type: 'module', code, state: patch.state }),
  logEvent: e => mut(c => { c.events.push({ s: session.uid, ts: Date.now(), ...e }); if (c.events.length > 40000) c.events.splice(0, 4000); }, { type: 'event', silent: true }),
  addAttempt: a => mut(c => c.attempts.push({ s: session.uid, ts: Date.now(), ...a }), { type: 'attempt' }),
  saveTest: t => mut(c => { const i = c.tests.findIndex(x => x.id === t.id); if (i >= 0) c.tests[i] = t; else c.tests.push(t); }, { type: 'test', id: t.id, status: t.status }),
  deleteTest: id => mut(c => { c.tests = c.tests.filter(t => t.id !== id); c.subs = c.subs.filter(s => s.tid !== id); }, { type: 'test', id }),
  saveSub: s => mut(c => { const i = c.subs.findIndex(x => x.id === s.id); if (i >= 0) c.subs[i] = s; else c.subs.push(s); }, { type: 'sub', tid: s.tid, final: !!s.end }),
  addSlide: s => mut(c => c.slides.push(s), { type: 'slide' }),
  delSlide: id => mut(c => { c.slides = c.slides.filter(s => s.id !== id); }, { type: 'slide' }),
  post: p => mut(c => c.posts.unshift({ id: uid('p'), by: session.uid, ts: Date.now(), ...p }), { type: 'post' }),
  delPost: id => mut(c => { c.posts = c.posts.filter(p => p.id !== id); }, { type: 'post' }),
  readPosts: () => mut(c => { (c.read ||= {})[session.uid] = Date.now(); }, { type: 'read', silent: true }),
  saveNote: (sid, note) => mut(c => { c.notes[sid] = { ...note, by: session.uid, ts: Date.now() }; }, { type: 'note', sid }),
  saveQuestion: q => mut(c => { const i = c.questions.findIndex(x => x.id === q.id); if (i >= 0) c.questions[i] = q; else c.questions.push(q); c.qv = (c.qv || 0) + 1; }, { type: 'bank' }),
  delQuestion: id => mut(c => { c.questions = c.questions.filter(q => q.id !== id); c.qv = (c.qv || 0) + 1; }, { type: 'bank' }),
  setLevel: (qid, lv) => mut(c => { c.levels[qid] = lv; c.qv = (c.qv || 0) + 1; }, { type: 'bank' }),
  removeMember: sid => mut(c => { c.members = c.members.filter(x => x !== sid); const u = db.users[sid]; if (u) u.classes = u.classes.filter(x => x !== c.id); }, { type: 'class' }),
  newCode: () => mut(c => { c.code = code6(); return c.code; }, { type: 'class' }),
  renameClass: name => mut(c => { c.name = name; }, { type: 'class' }),
};
export async function resetDemo() { const { seedDB } = await import('./seed.js'); db = await seedDB(hash); session = null; logout(); store.set(KEY, db); persist({ type: 'reset' }); }

// ---------- tệp bài giảng (ảnh, PDF) – IndexedDB ----------
let idb = null;
function openIDB() {
  if (idb) return idb;
  idb = new Promise((res, rej) => { try { const r = indexedDB.open('aida2-files', 1); r.onupgradeneeded = () => r.result.createObjectStore('f'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); } catch (e) { rej(e); } });
  return idb;
}
const mem = new Map();
export async function putFile(id, blob) { mem.set(id, blob); try { const d = await openIDB(); await new Promise((res, rej) => { const t = d.transaction('f', 'readwrite'); t.objectStore('f').put(blob, id); t.oncomplete = res; t.onerror = () => rej(t.error); }); } catch (e) { /* giữ trong phiên */ } }
export async function getFile(id) { if (mem.has(id)) return mem.get(id); try { const d = await openIDB(); return await new Promise((res, rej) => { const r = d.transaction('f').objectStore('f').get(id); r.onsuccess = () => res(r.result || null); r.onerror = () => rej(r.error); }); } catch (e) { return null; } }
export async function delFile(id) { mem.delete(id); try { const d = await openIDB(); d.transaction('f', 'readwrite').objectStore('f').delete(id); } catch (e) { /* */ } }

// dạng dữ liệu cho bộ phân tích cũ
export function analyticsView(c = cls()) { return { students: students(c), modules: c.modules, events: c.events, attempts: c.attempts }; }
export const raw = () => db;

// ---------- quản trị: duyệt tài khoản giáo viên ----------
export const teachers = () => Object.values(db.users).filter(u => u.role === 'gv').map(pub).sort((a, b) => (a.approved ? 1 : 0) - (b.approved ? 1 : 0) || b.created - a.created);
export async function approveTeacher(id, ok) {
  if (!me()?.isAdmin) throw new Error('Chỉ quản trị viên được duyệt tài khoản.');
  const u = db.users[id]; if (!u) return; u.approved = !!ok; u.rejected = !ok; u.reviewedAt = Date.now(); persist({ type: 'approval', uid: id });
}

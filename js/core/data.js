// Mặt tiền lớp dữ liệu: chọn máy chủ thật (Firebase) nếu có cấu hình, ngược lại chạy thử trên trình duyệt.
// Giao diện chỉ gọi các hàm trong tệp này nên không phụ thuộc máy chủ.
let B = null;
export let MODE = 'demo';
export let CAN = { reset: true, files: 'local' };

export async function init() {
  let cfg = null, admins = []; try { const K = await import('../config.js'); cfg = K.FIREBASE; admins = K.ADMINS || []; } catch (e) { cfg = null; }
  B = cfg ? await import('./data-fb.js') : await import('./data-demo.js');
  MODE = B.MODE; CAN = B.CAN;
  B.subscribe((why, local) => subs.forEach(fn => fn(why, local)));
  return B.init(cfg, admins);
}
const subs = new Set();
export const subscribe = fn => (subs.add(fn), () => subs.delete(fn));
const f = name => (...a) => B[name](...a);
export const me = f('me'), userName = f('userName'), userOf = f('userOf');
export const register = f('register'), login = f('login'), logout = f('logout'), changePassword = f('changePassword');
export const classByCode = f('classByCode'), myClasses = f('myClasses'), cls = f('cls'), switchClass = f('switchClass');
export const createSampleClass = f('createSampleClass');
export const createClass = f('createClass'), joinClass = f('joinClass'), addStudents = f('addStudents'), students = f('students');
export const teachers = f('teachers'), approveTeacher = f('approveTeacher');
export const resetDemo = f('resetDemo'), putFile = f('putFile'), getFile = f('getFile'), delFile = f('delFile'), analyticsView = f('analyticsView');
export const act = new Proxy({}, { get: (_, k) => (...a) => B.act[k](...a) });

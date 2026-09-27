// 利用者の設定と進み具合を、この端末の localStorage にだけ保存する
const KEY = 'em-profile';
const PROGRESS = 'em-progress';

export function getProfile() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}

export function setProfile(patch) {
  const p = { ...getProfile(), ...patch };
  try { localStorage.setItem(KEY, JSON.stringify(p)); } catch {}
  applyProfile(p);
  return p;
}

export function applyProfile(p = getProfile()) {
  const h = document.documentElement;
  if (p.furigana) h.dataset.grade = p.furigana; else delete h.dataset.grade;
  h.dataset.cur = p.cur === 'off' ? 'off' : 'on';
  if (p.who) h.dataset.who = p.who;
  if (p.device) h.dataset.device = p.device;
  const sel = document.getElementById('furigana-select');
  if (sel && p.furigana) sel.value = p.furigana;
}

export function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS) || '{}'); } catch { return {}; }
}

export function setProgress(lessonId, patch) {
  const all = getProgress();
  all[lessonId] = { ...(all[lessonId] || {}), ...patch };
  try { localStorage.setItem(PROGRESS, JSON.stringify(all)); } catch {}
  return all[lessonId];
}

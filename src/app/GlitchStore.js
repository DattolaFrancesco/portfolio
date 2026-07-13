
let active = false;
const listeners = new Set();

export function getGlitch() {
  return active;
}

export function setGlitch(value) {
  if (active === value) return;
  active = value;
  listeners.forEach((listener) => listener(active));
}

export function toggleGlitch() {
  setGlitch(!active);
}

export function subscribeGlitch(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
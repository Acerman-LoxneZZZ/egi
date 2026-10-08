import { mountInterface } from './experience/interface.js';
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)'), smallScreen = matchMedia('(max-width: 700px)');
const buttons = [...document.querySelectorAll('[data-motion], #motion-toggle')]; let manualPause = false;
try { manualPause = localStorage.getItem('egypt-motion') === 'off'; } catch { /* Optional preference. */ }
let generation = 0, sceneApi, removeExperience = () => {}, removeInterface = () => {};
const canvas = document.createElement('canvas'); canvas.id = 'gateway-canvas'; canvas.className = 'flight-canvas'; canvas.setAttribute('aria-hidden', 'true');
document.querySelector('.gateway-scene').append(canvas);
function capturePosition() {
  const chapter = [...document.querySelectorAll('[data-chapter]')].find(el => el.getBoundingClientRect().top <= 120 && el.getBoundingClientRect().bottom > 120);
  return chapter ? { chapter, offset: 120 - chapter.getBoundingClientRect().top } : null;
}
function teardown() { removeExperience(); removeExperience = () => {}; sceneApi?.dispose(); sceneApi = null; }
function fallback() {
  const position = capturePosition(); ++generation; teardown(); document.body.dataset.mode = 'static'; canvas.remove();
  removeInterface(); removeInterface = mountInterface({ reducedMotion: true });
  if (position) window.scrollTo({ top: position.chapter.offsetTop + position.offset - 120, behavior: 'instant' });
  buttons.forEach(button => { button.hidden = true; });
}
async function boot() {
  const token = ++generation, position = capturePosition(); teardown(); removeInterface();
  const reduced = systemMotion.matches || manualPause || smallScreen.matches;
  document.body.dataset.mode = reduced ? 'static' : 'preparing'; removeInterface = mountInterface({ reducedMotion: reduced });
  buttons.forEach(button => {
    button.hidden = smallScreen.matches; button.disabled = systemMotion.matches; button.setAttribute('aria-pressed', String(reduced));
    button.setAttribute('aria-label', systemMotion.matches ? 'Анимация отключена' : manualPause ? 'Включить анимацию' : 'Выключить анимацию'); button.title = button.getAttribute('aria-label');
  });
  if (position) window.scrollTo({ top: position.chapter.offsetTop + position.offset - 120, behavior: 'instant' });
  if (reduced) return;
  document.querySelector('.gateway-scene').append(canvas);
  try {
    const context = canvas.getContext('webgl2', { alpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!context) { fallback(); return; }
    const [{ createScene }, { mountExperience }, assets] = await Promise.all([import('./scene/scene.js'), import('./experience/scroll.js'), fetch('/assets/manifest.json').then(response => { if (!response.ok) throw new Error('asset manifest'); return response.json(); })]);
    const prepared = await createScene({ canvas, context, assets, reducedMotion: false, onFallback: fallback });
    if (token !== generation) { prepared.dispose(); return; }
    sceneApi = prepared; removeExperience = mountExperience({ sceneApi, reducedMotion: false }); document.body.dataset.mode = 'webgl';
  } catch { if (token === generation) fallback(); }
}
buttons.forEach(button => button.addEventListener('click', () => {
  manualPause = !manualPause; try { localStorage.setItem('egypt-motion', manualPause ? 'off' : 'on'); } catch { /* Preference is nonessential. */ } boot();
}));
systemMotion.addEventListener('change', boot); smallScreen.addEventListener('change', boot);
window.addEventListener('pagehide', () => { ++generation; teardown(); removeInterface(); });
window.addEventListener('pageshow', event => { if (event.persisted) boot(); }); boot();

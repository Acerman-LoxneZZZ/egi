import { chromium } from 'playwright';
import fs from 'node:fs';
const base = process.env.APP_URL || 'http://127.0.0.1:4173/';
const out = '.impeccable/review';
const filter = process.env.QA_ONLY?.split('|');
const results = filter && fs.existsSync(`${out}/browser-report.json`) ? JSON.parse(fs.readFileSync(`${out}/browser-report.json`)).results : [];
const failures = [];
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--disable-gpu-sandbox'] });
async function check(name, fn) {
  if (filter && !filter.some(word => name.includes(word))) return;
  const previous = results.findIndex(result => result.name === name); if (previous >= 0) results.splice(previous, 1);
  try { const detail = await fn(); results.push({ name, pass: true, detail }); }
  catch (error) { failures.push(name); results.push({ name, pass: false, error: error.message }); }
}
function requireThat(condition, message) { if (!condition) throw new Error(message); }
async function ready(page) { await page.goto(base, { waitUntil: 'networkidle' }); await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => { img.loading = 'eager'; return img.decode().catch(() => {}); })); }); await page.waitForFunction(() => ['webgl', 'static'].includes(document.body.dataset.mode)); }
async function readable(page) {
  return page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, chapters: [...document.querySelectorAll('[data-chapter]')].map(el => ({ id: el.id, heading: !!el.querySelector('h2'), height: el.offsetHeight, text: el.innerText.length })), missing: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(id => id && !document.getElementById(id)) }));
}
try {
  for (const [width, height, name] of [[1672,941,'comp'],[1440,900,'desktop'],[1280,800,'desktop-1280'],[390,844,'mobile']]) {
    await check(`layout ${width}px`, async () => {
      const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
      const page = await context.newPage(), errors = [];
      page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
      await ready(page);
      await page.addStyleTag({ content: '.museum-plaque{opacity:1!important;transform:none!important}' });
      const report = await readable(page);
      requireThat(report.scrollWidth <= width, `horizontal overflow: ${report.scrollWidth}`);
      requireThat(report.chapters.length === 7 && report.chapters.every(c => c.heading && c.height > 300 && c.text > 350), 'seven complete chapters required');
      requireThat(!report.missing.length, 'broken internal links: ' + report.missing);
      requireThat(!errors.length, errors.join('\n'));
      await page.screenshot({ path: `${out}/${name}-hero.png` });
      if (width === 1440) { await page.locator('#motion-toggle').click(); await page.waitForFunction(() => document.body.dataset.mode === 'static'); await page.screenshot({ path: `${out}/${name}.png`, fullPage: true }); await page.locator('#motion-toggle').click(); await page.waitForFunction(() => document.body.dataset.mode === 'webgl'); }
      if (width === 390) await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
      if (width === 1672) await page.screenshot({ path: `${out}/hero-repro.png` });
      const mode = await page.locator('body').getAttribute('data-mode');
      if (width === 1440) {
        requireThat(mode === 'webgl', 'desktop must prepare real WebGL');
        for (const [p, filename] of [[.35,'flight-approach'],[.56,'flight-threshold'],[.85,'flight-exit']]) {
          await page.evaluate(progress => window.scrollTo({ top: innerHeight * 2.15 * progress, behavior: 'instant' }), p);
          await page.waitForTimeout(350); await page.screenshot({ path: `${out}/${filename}.png` });
        }
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await page.waitForTimeout(350);
        requireThat(Number(await page.locator('#gateway-canvas').getAttribute('data-progress')) < .01, 'reverse must restore current camera progress');
        await page.locator('.enter-link').click(); await page.waitForTimeout(2800);
        const landing = await page.locator('#nile').evaluate(el => ({ top: el.getBoundingClientRect().top, scrollY, offsetTop: el.offsetTop }));
        requireThat(Math.abs(landing.top - 70) < 30, 'enter must land on Nile: ' + JSON.stringify(landing));
        await page.screenshot({ path: `${out}/nile-reading.png` });
        for (const id of ['pyramids','pharaohs','writing','gods','life','legacy']) {
          await page.locator('#reading-bar summary').click(); await page.locator(`#reading-bar a[href="#${id}"]`).click(); await page.waitForTimeout(1700);
          requireThat(await page.locator('#' + id).evaluate(el => Math.abs(el.getBoundingClientRect().top - 70) < 30), 'navigation failed: ' + id);
          if (id === 'pharaohs' || id === 'writing' || id === 'gods') await page.screenshot({ path: `${out}/${id}-reading.png` });
        }
        const frame = await page.evaluate(() => new Promise(resolve => { const stamps = []; let last = performance.now(); function tick(now) { stamps.push(now - last); last = now; if (stamps.length < 60) requestAnimationFrame(tick); else { stamps.sort((a,b)=>a-b); resolve({ median: stamps[30], p95: stamps[57] }); } } requestAnimationFrame(tick); }));
        results.push({ name: 'observed frame intervals (headless Chrome)', pass: true, detail: frame });
        requireThat(!errors.length, errors.join('\n'));
      }
      await context.close(); return { mode, ...report, errors };
    });
  }
  await check('JavaScript disabled', async () => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } }); const page = await context.newPage();
    await page.goto(base, { waitUntil: 'networkidle' });
    requireThat(await page.locator('[data-chapter]').count() === 7, 'missing static chapters');
    await page.locator('#chapter-index a[href="#writing"]').click();
    await page.waitForTimeout(1200);
    requireThat(await page.locator('#writing').isVisible(), 'writing unavailable');
    requireThat(await page.locator('#writing').evaluate(el => el.getBoundingClientRect().top < 150), 'native anchor failed');
    await page.screenshot({ path: `${out}/no-javascript.png` }); await context.close();
  });
  await check('continuous gateway and text/photo entrances', async () => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage(); await ready(page); await page.waitForTimeout(1000);
    const initial = await page.locator('#gateway-canvas').evaluate(el => ({ opacity: getComputedStyle(el).opacity,
      visible: el.classList.contains('is-visible'), progress: Number(el.dataset.progress), frames: Number(el.dataset.frames) }));
    requireThat(initial.visible && initial.opacity === '1' && initial.progress === 0 && initial.frames > 0,
      'the rendered scene must own the first frame before scrolling: ' + JSON.stringify(initial));
    requireThat(await page.locator('.giza-plate').evaluate(el => el.currentSrc.endsWith('/assets/giza-world.png')),
      'the static portal must use the flight panorama');
    await page.screenshot({ path: `${out}/motion-rest.png` });
    await page.evaluate(() => { document.querySelector('#gateway').classList.remove('scene-active'); document.querySelector('#gateway-canvas').style.visibility = 'hidden'; });
    await page.screenshot({ path: `${out}/motion-fallback.png` });
    await page.evaluate(() => { document.querySelector('#gateway').classList.add('scene-active'); document.querySelector('#gateway-canvas').style.visibility = ''; window.scrollTo({ top: 8, behavior: 'instant' }); });
    await page.waitForTimeout(200);
    requireThat(await page.locator('#gateway-canvas').evaluate(el => getComputedStyle(el).opacity === '1'),
      'the first scroll must not crossfade the photograph');
    await page.screenshot({ path: `${out}/motion-start.png` });
    const text = page.locator('#pyramids .reading-copy'), photo = page.locator('#pyramids figure');
    const synchronized = await page.evaluate(async () => {
      const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
      function state(el, chapter) {
        let opacity = 1, x = 0, y = 0;
        for (let node = el; node && node !== chapter; node = node.parentElement) {
          const css = getComputedStyle(node), matrix = new DOMMatrixReadOnly(css.transform);
          opacity *= Number(css.opacity); x += matrix.m41; y += matrix.m42;
        }
        return { opacity, x, y };
      }
      const chapters = [...document.querySelectorAll('[data-chapter]')], report = [];
      for (const chapter of chapters) {
        const text = [...chapter.querySelectorAll('.chapter-heading,.reading-copy,.museum-plaque')];
        const photos = [...chapter.querySelectorAll('figure,.legacy-image')];
        const content = [...text, ...photos];
        const prepared = content.every((el, index) => {
          const s = state(el, chapter);
          return s.opacity < .01 && (index < text.length ? s.x < -1 : s.x > 1) && Math.abs(s.y) < .01;
        });
        window.scrollTo({ top: chapter.getBoundingClientRect().top + scrollY - innerHeight * .84, behavior: 'instant' });
        for (let i = 0; i < 6; i++) await frame();
        const waitsUntilVisible = content.every(el => state(el, chapter).opacity < .01);
        window.scrollTo({ top: chapter.getBoundingClientRect().top + scrollY - innerHeight * .6, behavior: 'instant' });
        let moving = false, sideways = false, opposite = false, together = true;
        for (let i = 0; i < 30; i++) {
          await frame(); const states = content.map(el => state(el, chapter));
          moving ||= states.some(s => s.opacity > .01 && s.opacity < .98);
          sideways ||= states.some(s => s.opacity > .01 && s.opacity < .98 && Math.abs(s.x) > .1 && Math.abs(s.y) < .01);
          opposite ||= states.every((s, index) => s.opacity > .01 && s.opacity < .98 &&
            (index < text.length ? s.x < -.1 : s.x > .1));
          together &&= states.every(s => Math.abs(s.opacity - states[0].opacity) < .0001 &&
            Math.abs(Math.abs(s.x) - Math.abs(states[0].x)) < .01 && Math.abs(s.y - states[0].y) < .01);
        }
        report.push({ id: chapter.id, prepared, waitsUntilVisible, moving, sideways, opposite, together });
      }
      return report;
    });
    requireThat(synchronized.length === 7 && synchronized.every(chapter => chapter.prepared && chapter.waitsUntilVisible && chapter.moving && chapter.sideways && chapter.opposite && chapter.together),
      'each topic must enter from opposite sides and fade together throughout the entrance: ' + JSON.stringify(synchronized));
    await page.evaluate(() => window.scrollTo({ top: document.querySelector('#pyramids').getBoundingClientRect().top + scrollY - 80, behavior: 'instant' }));
    await page.waitForTimeout(1400);
    for (const target of [text, photo]) requireThat(await target.evaluate(el => {
      const css = getComputedStyle(el), matrix = new DOMMatrixReadOnly(css.transform);
      return Number(css.opacity) > .99 && Math.abs(matrix.m41) < .1 && Math.abs(matrix.m42) < .1;
    }), 'the entrance must finish at the original readable layout');
    await page.screenshot({ path: `${out}/motion-reading.png` });
    await page.locator('#reading-bar [data-motion]').click(); await page.waitForFunction(() => document.body.dataset.mode === 'static');
    requireThat(await page.locator('[data-chapter]').evaluateAll(chapters => chapters.every(chapter =>
      [...chapter.querySelectorAll('.reading-copy,figure,.chapter-heading,.legacy-image')].every(el => Number(getComputedStyle(el).opacity) === 1))),
      'turning off motion must restore every text and photograph');
    await context.close(); return { initial, panorama: 'shared', synchronized, cleanup: 'all content visible' };
  });
  await check('reduced motion, including preference change', async () => {
    const context = await browser.newContext({ reducedMotion: 'reduce' }); const page = await context.newPage(); await ready(page);
    requireThat(await page.locator('.pin-spacer').count() === 0, 'reduced motion must not pin');
    await page.locator('#chapter-index a[href="#life"]').click();
    requireThat(await page.locator('#life').evaluate(el => el.getBoundingClientRect().top < 100), 'native reading navigation unavailable');
    await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForFunction(() => document.body.dataset.mode === 'webgl');
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForFunction(() => document.body.dataset.mode === 'static');
    requireThat(await page.locator('.pin-spacer').count() === 0 && await page.locator('[data-chapter]').count() === 7, 'cleanup failed after preference change');
    await context.close();
  });
  await check('WebGL unavailable', async () => {
    const context = await browser.newContext(); await context.addInitScript(() => { const original = HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext = function(type, ...args) { return /^webgl/.test(type) ? null : original.call(this, type, ...args); }; });
    const page = await context.newPage(); await ready(page);
    requireThat(await page.locator('body').getAttribute('data-mode') === 'static', 'fallback not selected');
    requireThat(await page.locator('[data-chapter]').count() === 7 && await page.locator('.pin-spacer').count() === 0, 'fallback blocks document'); await context.close();
  });
  await check('context loss releases the flight and preserves reading', async () => {
    const context = await browser.newContext(); const page = await context.newPage(); await ready(page);
    await page.evaluate(() => document.querySelector('#gateway-canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
    await page.waitForFunction(() => document.body.dataset.mode === 'static');
    requireThat(await page.locator('.pin-spacer').count() === 0 && await page.locator('[data-chapter]').count() === 7, 'context loss left pin or missing content'); await context.close();
  });
  await check('image failure preserves the document', async () => {
    const context = await browser.newContext(); await context.route('**/assets/giza-world.png', route => route.abort()); const page = await context.newPage(); await ready(page);
    requireThat(await page.locator('body').getAttribute('data-mode') === 'static', 'image failure must use static layout');
    requireThat(await page.locator('h1').isVisible() && await page.locator('[data-chapter]').count() === 7, 'failure hides information'); await context.close();
  });
  await check('keyboard and user animation control', async () => {
    const context = await browser.newContext(); const page = await context.newPage(); await ready(page);
    await page.keyboard.press('Tab'); requireThat(await page.locator('.skip-link').evaluate(el => el === document.activeElement), 'first focus should skip to reading');
    await page.locator('#motion-toggle').click(); await page.waitForFunction(() => document.body.dataset.mode === 'static');
    requireThat(await page.locator('.pin-spacer').count() === 0, 'animation toggle leaves runway');
    await page.locator('#motion-toggle').click(); await page.waitForFunction(() => document.body.dataset.mode === 'webgl');
    requireThat(await page.locator('.pin-spacer').count() === 1, 'toggle did not restore exactly one flight'); await context.close();
  });
  await check('visibility event stops and resumes actual render frames', async () => {
    const context = await browser.newContext(); const page = await context.newPage(); await ready(page);
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    const before = await page.locator('#gateway-canvas').getAttribute('data-frames');
    await page.waitForTimeout(300); requireThat(await page.locator('#gateway-canvas').getAttribute('data-frames') === before, 'render continued while hidden');
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.waitForTimeout(300); requireThat(Number(await page.locator('#gateway-canvas').getAttribute('data-frames')) > Number(before), 'render did not resume'); await context.close();
  });
} finally { await browser.close(); fs.writeFileSync(`${out}/browser-report.json`, JSON.stringify({ base, results, failures }, null, 2)); }
console.log(JSON.stringify({ checks: results.length, failures, report: `${out}/browser-report.json` }));
if (failures.length) process.exitCode = 1;

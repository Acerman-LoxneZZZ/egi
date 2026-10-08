import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { sampleFlight } from './flight.js';
gsap.registerPlugin(ScrollTrigger);

export function mountExperience({ sceneApi, reducedMotion }) {
  if (reducedMotion) return () => {};
  const gateway = document.querySelector('#gateway'), canvas = document.querySelector('#gateway-canvas');
  const home = canvas.parentElement, copy = document.querySelector('#gateway-copy');
  const header = gateway.querySelector('header'), index = document.querySelector('#chapter-index');
  const anchor = [...document.querySelectorAll('[data-chapter]')].find(el => el.getBoundingClientRect().top <= 120 && el.getBoundingClientRect().bottom > 120);
  const anchorOffset = anchor ? 120 - anchor.getBoundingClientRect().top : 0;
  const stage = document.createElement('div'); stage.className = 'flight-stage';
  gateway.before(stage); stage.append(gateway);
  // A native HTML glimpse retains the approved first viewport while the runway is pinned.
  const glimpse = document.querySelector('#nile').cloneNode(true);
  glimpse.removeAttribute('id'); glimpse.removeAttribute('aria-labelledby'); glimpse.removeAttribute('data-chapter');
  glimpse.classList.add('gateway-preview'); glimpse.setAttribute('aria-hidden', 'true'); glimpse.inert = true;
  glimpse.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  glimpse.querySelector('.reading-copy').remove(); glimpse.querySelector('.museum-plaque').remove(); stage.append(glimpse);
  const lenis = new Lenis({ autoRaf: false, duration: 1.15, smoothWheel: true, syncTouch: false });
  const oldBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto'; lenis.on('scroll', ScrollTrigger.update);
  let isAmbient = false, lastTime = 0;
  function resize() { sceneApi.resize(window.innerWidth, isAmbient ? window.innerHeight : gateway.clientHeight, window.devicePixelRatio); }
  let trigger;
  function apply(progress) {
    const state = sampleFlight(progress); sceneApi.setFlight(state);
    const nextAmbient = progress >= 1 && window.scrollY >= (trigger?.end ?? Infinity);
    if (nextAmbient !== isAmbient) {
      isAmbient = nextAmbient; sceneApi.setAmbient(isAmbient); canvas.classList.toggle('ambient-canvas', isAmbient);
      (isAmbient ? document.body : home).append(canvas); resize();
    }
    // The prepared scene owns the image from rest onward: scrolling moves the
    // camera, never crossfades between differently cropped photographs.
    gateway.classList.add('scene-active'); canvas.classList.add('is-visible');
    for (const el of [copy, header, index]) { el.style.opacity = String(state.copyOpacity); el.inert = state.copyOpacity < .15; }
    copy.style.translate = `0 ${-40 * (1 - state.copyOpacity)}px`;
    header.style.translate = `0 ${-16 * (1 - state.copyOpacity)}px`;
    index.style.translate = `0 ${22 * (1 - state.copyOpacity)}px`;
    glimpse.style.opacity = String(Math.max(0, 1 - progress * 12)); canvas.dataset.progress = progress.toFixed(3);
  }
  trigger = ScrollTrigger.create({ trigger: stage, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * 2.15), pin: stage,
    pinSpacing: true, invalidateOnRefresh: true, onUpdate(self) { apply(self.progress); } });
  function ticker(time) { const delta = lastTime ? Math.min(.1, time - lastTime) : 1 / 60; lastTime = time; lenis.raf(time * 1000); sceneApi.render(time, delta); }
  gsap.ticker.add(ticker); gsap.ticker.lagSmoothing(0);
  const visibility = () => { sceneApi.setPaused(document.hidden); document.hidden ? lenis.stop() : lenis.start(); lastTime = 0; };
  const navigate = event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.getAttribute('href').slice(1)); if (!target) return;
    event.preventDefault(); history.replaceState(null, '', link.getAttribute('href'));
    lenis.scrollTo(target, { duration: link.classList.contains('enter-link') ? 2.4 : 1.35,
      onComplete() { if (target.id !== 'gateway') { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } } });
  };
  const revealContext = gsap.context(() => {
    if (window.scrollY < 40 && (!location.hash || location.hash === '#gateway')) {
      gsap.fromTo(copy.querySelectorAll('h1,p,.enter-link'), { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: .75, stagger: .1, ease: 'expo.out', clearProps: 'transform,opacity' });
    }
    for (const chapter of document.querySelectorAll('[data-chapter]')) {
      if (chapter.getBoundingClientRect().top < window.innerHeight * .9) continue;
      // One chapter timeline brings text and photographs in from opposite
      // sides. Animate text roots only, so nested headings and facts move once.
      const candidates = [...chapter.querySelectorAll('.chapter-intro,.artifact-text,.legacy-content,.chapter-heading,.reading-copy,.museum-plaque')];
      const text = candidates.filter(el => !candidates.some(parent => parent !== el && parent.contains(el)));
      const photos = chapter.querySelectorAll('figure,.legacy-image');
      gsap.set(text, { x: -36, opacity: 0 });
      gsap.set(photos, { x: 36, opacity: 0 });
      gsap.timeline({ defaults: { duration: 1.3, ease: 'power2.out', clearProps: 'transform,opacity' },
        scrollTrigger: { trigger: chapter, start: 'top 65%', once: true } })
        .to(text, { x: 0, opacity: 1 }, 0)
        .to(photos, { x: 0, opacity: 1 }, 0);
    }
  });
  window.addEventListener('resize', resize, { passive: true }); document.addEventListener('visibilitychange', visibility); document.addEventListener('click', navigate);
  resize(); ScrollTrigger.refresh();
  if (anchor) lenis.scrollTo(anchor.offsetTop + anchorOffset - 120, { immediate: true });
  else if (location.hash && location.hash !== '#gateway') { const destination = document.getElementById(location.hash.slice(1)); if (destination) lenis.scrollTo(destination, { immediate: true }); }
  apply(trigger.progress);
  sceneApi.render(0, 0);
  return () => {
    gsap.ticker.remove(ticker); revealContext.revert(); trigger.kill(true); lenis.destroy();
    window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visibility); document.removeEventListener('click', navigate);
    document.documentElement.style.scrollBehavior = oldBehavior;
    home.append(canvas); canvas.classList.remove('ambient-canvas', 'is-visible'); canvas.style.opacity = ''; gateway.classList.remove('scene-active');
    for (const el of [copy, header, index]) { el.style.opacity = ''; el.style.translate = ''; el.inert = false; }
    stage.replaceWith(gateway);
  };
}

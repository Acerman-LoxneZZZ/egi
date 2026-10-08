export function mountInterface({ reducedMotion = false } = {}) {
  const chapters = [...document.querySelectorAll('[data-chapter]')], links = [...document.querySelectorAll('#chapter-index a')];
  const counter = document.querySelector('#chapter-current'), bar = document.querySelector('#reading-bar'), current = document.querySelector('#reading-current');
  const menu = bar.querySelector('details'); let scheduled = 0;
  function update() {
    scheduled = 0; let active = 0;
    for (let i = 0; i < chapters.length; i++) if (chapters[i].getBoundingClientRect().top <= window.innerHeight * .38) active = i;
    for (let i = 0; i < links.length; i++) i === active ? links[i].setAttribute('aria-current', 'location') : links[i].removeAttribute('aria-current');
    counter.textContent = String(active + 1).padStart(2, '0');
    current.textContent = String(active + 1).padStart(2, '0') + ' / 07 · ' + links[active].textContent;
    const visible = document.querySelector('#gateway').getBoundingClientRect().bottom < 120; bar.hidden = !visible; if (!visible) menu.open = false;
    for (const link of menu.querySelectorAll('a')) link.getAttribute('href') === links[active].getAttribute('href') ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current');
  }
  const schedule = () => { if (!scheduled) scheduled = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true }); window.addEventListener('resize', schedule, { passive: true });
  const close = event => { if (event.target.closest('a')) menu.open = false; };
  const escape = event => { if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } };
  menu.addEventListener('click', close); document.addEventListener('keydown', escape); const removers = [];
  if (!reducedMotion && matchMedia('(hover:hover) and (pointer:fine)').matches) {
    for (const plaque of document.querySelectorAll('.museum-plaque')) {
      const move = event => { const r = plaque.getBoundingClientRect(), x = (event.clientX - r.left) / r.width - .5, y = (event.clientY - r.top) / r.height - .5;
        plaque.style.rotate = `${-y} ${x} 0 ${Math.min(3, Math.hypot(x, y) * 4)}deg`; };
      const leave = () => { plaque.style.rotate = ''; };
      plaque.addEventListener('pointermove', move); plaque.addEventListener('pointerleave', leave);
      removers.push(() => { plaque.removeEventListener('pointermove', move); plaque.removeEventListener('pointerleave', leave); leave(); });
    }
  }
  update();
  return () => { if (scheduled) cancelAnimationFrame(scheduled); removers.forEach(fn => fn()); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); menu.removeEventListener('click', close); document.removeEventListener('keydown', escape); };
}

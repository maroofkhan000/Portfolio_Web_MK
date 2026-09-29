(() => {
  const root = document.body;
  const hero = document.querySelector('.hero');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Intro: wait for the portrait + fonts, then play ---------- */
  const person = document.querySelector('.person');
  const imgReady = person.complete ? Promise.resolve() : new Promise(r => { person.onload = r; person.onerror = r; });
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  const timeout = new Promise(r => setTimeout(r, 2500));
  Promise.race([Promise.all([imgReady, fontsReady]), timeout]).then(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      root.classList.add('is-ready');
      placeBar(activeLink, true);
    }));
  });

  /* ---------- Nav underline that follows hover ---------- */
  const links = [...document.querySelectorAll('.nav__links a')];
  const bar = document.querySelector('.nav__bar');
  let activeLink = links.find(a => a.classList.contains('is-active')) || links[0];
  function placeBar(a, instant) {
    if (!a) return;
    if (instant) bar.style.transition = 'none';
    bar.style.left = a.parentElement.offsetLeft + 'px';
    bar.style.width = a.offsetWidth + 'px';
    if (instant) { bar.offsetWidth; bar.style.transition = ''; }
  }
  links.forEach(a => {
    a.addEventListener('mouseenter', () => placeBar(a));
    a.addEventListener('click', () => {
      links.forEach(l => l.classList.remove('is-active'));
      a.classList.add('is-active');
      activeLink = a;
      placeBar(a);
    });
  });
  document.querySelector('.nav__links').addEventListener('mouseleave', () => placeBar(activeLink));
  // lets the section scroll-spy (sections.js) move the underline
  window.setNavActive = href => {
    const a = links.find(l => l.getAttribute('href') === href);
    if (!a || a === activeLink) return;
    links.forEach(l => l.classList.remove('is-active'));
    a.classList.add('is-active');
    activeLink = a;
    placeBar(a);
  };
  addEventListener('resize', () => placeBar(activeLink, true));

  if (reduced) return;

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = el.classList.contains('pill') ? 0.22 : 0.4;
    const host = el.closest('.action') || el;
    host.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    host.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });

  /* ---------- Depth: pointer parallax + scroll-driven camera ---------- */
  const layers = [...document.querySelectorAll('[data-depth]')].map(el => ({
    el,
    depth: +el.dataset.depth || 0,
    tilt: !!el.dataset.tilt,
    ss: +el.dataset.ss || 0,     // scroll scale
    sy: +el.dataset.sy || 0,     // scroll y (design px @ 923h)
    sx: +el.dataset.sx || 0,     // scroll x (design px @ 1536w)
    fade: !!el.dataset.fade,
    spread: !!el.dataset.spread,
  }));
  const fadeOnly = [...document.querySelectorAll('[data-fade]:not([data-depth])')];

  const target = { mx: 0, my: 0, p: 0 };
  const cur = { mx: 0, my: 0, p: 0 };

  addEventListener('pointermove', e => {
    target.mx = (e.clientX / innerWidth) * 2 - 1;
    target.my = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  document.addEventListener('pointerleave', () => { target.mx = 0; target.my = 0; });

  // gentle drift on touch devices where there is no pointer hover
  const coarse = matchMedia('(hover: none)').matches;

  // progress runs over the hero's own scroll track, not the whole page
  const track = document.querySelector('.scroll-track');
  let heroVisible = true;
  const readScroll = () => {
    const max = track.offsetHeight - innerHeight;
    target.p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    heroVisible = scrollY < track.offsetHeight;
  };
  addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  const clamp01 = v => Math.min(1, Math.max(0, v));
  const easeInOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function frame(t) {
    if (coarse) {
      target.mx = Math.sin(t / 3200) * .35;
      target.my = Math.cos(t / 4100) * .25;
    }
    cur.mx += (target.mx - cur.mx) * 0.06;
    cur.my += (target.my - cur.my) * 0.06;
    cur.p  += (target.p  - cur.p)  * 0.09;
    if (!heroVisible && Math.abs(target.p - cur.p) < 0.001) { requestAnimationFrame(frame); return; }

    const W = innerWidth, H = innerHeight;
    const p = easeInOut(cur.p);

    for (const L of layers) {
      const tx = -cur.mx * L.depth * W * 0.5 + L.sx * p * (W / 1536);
      const ty = -cur.my * L.depth * H * 0.5 + L.sy * p * (H / 923);
      let s = 1 + L.ss * p;
      let rot = '';
      if (L.tilt) rot = ` rotateY(${cur.mx * 4}deg) rotateX(${-cur.my * 2.5}deg)`;
      if (L.spread) s = 1 + 0.18 * p;
      L.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${s.toFixed(4)})${rot}`;
      if (L.fade) L.el.style.opacity = clamp01(1 - p * 1.8).toFixed(3);
      if (L.spread) L.el.style.opacity = clamp01(1 - p * 1.5).toFixed(3);
    }
    for (const el of fadeOnly) el.style.filter = `opacity(${clamp01(1 - p * 2.5).toFixed(3)})`;

    drawDust(t);
    requestAnimationFrame(frame);
  }

  /* ---------- 02 particle dust ---------- */
  const cvs = document.querySelector('.dust');
  const ctx = cvs.getContext('2d');
  let dpr = 1, cw = 0, ch = 0, motes = [];

  function sizeDust() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    cw = hero.clientWidth; ch = hero.clientHeight;
    cvs.width = cw * dpr; cvs.height = ch * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(140, (cw * ch) / 11000));
    motes = Array.from({ length: n }, () => {
      // cluster loosely around the ring / head, as in the layer kit
      const a = Math.random() * Math.PI * 2;
      const d = Math.pow(Math.random(), .7);
      return {
        x: cw * .5 + Math.cos(a) * d * cw * .45,
        y: ch * .45 + Math.sin(a) * d * ch * .45,
        r: .4 + Math.random() * 1.5,
        vx: (Math.random() - .5) * .08,
        vy: -.03 - Math.random() * .12,
        ph: Math.random() * Math.PI * 2,
        z: .3 + Math.random() * 1.2,
      };
    });
  }
  sizeDust();
  addEventListener('resize', sizeDust);

  function drawDust(t) {
    ctx.clearRect(0, 0, cw, ch);
    const ox = -cur.mx * 30, oy = -cur.my * 20;
    for (const m of motes) {
      m.x += m.vx; m.y += m.vy;
      if (m.y < -10) { m.y = ch + 10; m.x = cw * (.15 + Math.random() * .7); }
      if (m.x < -10) m.x = cw + 10; else if (m.x > cw + 10) m.x = -10;
      const tw = .35 + .65 * (.5 + .5 * Math.sin(t / 900 + m.ph));
      ctx.globalAlpha = .55 * tw;
      ctx.fillStyle = m.r > 1.3 ? '#e2a560' : '#b98a55';
      ctx.beginPath();
      ctx.arc(m.x + ox * m.z, m.y + oy * m.z, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(frame);
})();

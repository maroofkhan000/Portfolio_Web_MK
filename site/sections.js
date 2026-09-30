(() => {
  const D = window.PORTFOLIO;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- tiny DOM helpers (text is always set as text, never HTML) ---------- */
  function el(tag, cls, ...kids) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    for (const k of kids.flat()) if (k != null && k !== '') n.append(k);
    return n;
  }
  function link(cls, href, label, external) {
    const a = el('a', cls, label);
    const url = cleanUrl(href);
    if (url) a.href = url; else a.classList.add('is-off');
    if (external && url) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    return a;
  }
  function cleanUrl(u) {
    if (typeof u !== 'string') return '';
    u = u.trim();
    return /^(https?:\/\/|mailto:)/i.test(u) || u.startsWith('assets/') ? u : '';
  }
  function img(src, alt) {
    const i = document.createElement('img');
    i.src = src; i.alt = alt || ''; i.loading = 'lazy'; i.decoding = 'async';
    return i;
  }
  // static line icons
  function svgPath(d) {
    const ns = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(ns, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    const p = document.createElementNS(ns, 'path');
    p.setAttribute('d', d);
    s.append(p);
    return s;
  }
  const arrow = dir => svgPath(dir === 'up' ? 'M7 17 17 7M8 7h9v9' : 'M5 12h14M13 6l6 6-6 6');
  const CAP = 'M2 9l10-5 10 5-10 5zM6 11v5c3 2.5 9 2.5 12 0v-5';

  /* ---------- About: education + certificates ---------- */
  function renderEducation(list) {
    const box = $('#education-list');
    box.replaceChildren(...list.map(e => {
      const icon = el('span', 'edu-card__icon', svgPath(CAP));
      const meta = el('div', 'meta', el('span', '', e.period || ''), e.cgpa ? el('span', '', 'CGPA: ' + e.cgpa) : null);
      return el('article', 'edu-card rv', icon,
        el('div', 'edu-card__main', el('h4', '', e.degree), el('p', '', e.school)),
        meta,
        e.description ? el('p', 'edu-card__desc', e.description) : null);
    }));
  }

  function renderCerts(list) {
    $('#cert-list').replaceChildren(...list.map(c => {
      const media = el('div', 'cert__img');
      if (c.image) media.append(img(c.image, c.title + ' certificate'));
      const verify = link('cert__link', c.link, 'Verify certificate', true);
      verify.append(arrow('up'));
      return el('article', 'cert rv', media,
        el('div', 'cert__body',
          el('span', 'cert__date', c.date || ''),
          el('h4', 'cert__title', c.title),
          el('span', 'cert__issuer', c.issuer || ''),
          verify));
    }));
  }

  /* ---------- Security: four-stage method ---------- */
  function renderSteps(list) {
    $('#chain-steps').replaceChildren(...list.map(s => el('article', 'step-card rv',
      el('span', 'step__n', s.n),
      el('span', 'step__key', s.key),
      el('h3', 'step__title', s.title),
      el('p', 'step__text', s.text),
      el('div', 'chips', s.chips.map(c => el('span', 'chip', c)))
    )));
  }

  /* ---------- technology tiles (brand icons as colour masks) ---------- */
  const EYE = 'M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z';
  function renderTiles(sel, list) {
    $(sel).replaceChildren(...list.map(t => {
      let ic;
      if (t.icon === 'nmap') {
        ic = svgPath(EYE);
        ic.classList.add('tile__svg');
      } else {
        ic = el('span', 'tile__icon');
        ic.style.setProperty('--ic', `var(--ic-${t.icon})`);
      }
      const tile = el('div', 'tile', ic, el('span', '', t.name));
      tile.style.setProperty('--c', t.color);
      if (/^#0{3,6}$/i.test(t.color)) tile.dataset.dark = '1';   // black logos flip to light on the dark hover
      return tile;
    }));
  }

  /* ---------- Tools of the Trade: arsenal cards that boot up, with a hover popup ---------- */
  function toolIcon(t) {
    if (t.icon === 'nmap') {
      const ic = svgPath(EYE);
      ic.classList.add('tool__svg');
      return ic;
    }
    const ic = el('span', 'tool__glyph');
    ic.style.setProperty('--ic', `var(--ic-${t.icon})`);
    return ic;
  }

  function renderArsenal(list) {
    $('#sec-tiles').replaceChildren(...list.map((t, i) => {
      const card = el('div', 'tool',
        el('div', 'tool__top', el('span', 'tool__idx', String(i + 1).padStart(2, '0')), el('span', 'tool__role', t.role || 'Tool')),
        el('div', 'tool__badge', el('span', 'tool__ring'), toolIcon(t)),
        el('h4', 'tool__name', t.name),
        el('div', 'tool__load',
          el('span', 'tool__bar', el('i', '')),
          el('span', 'tool__status', el('b', 'tool__st tool__st--wait', 'Loading'), el('b', 'tool__st tool__st--ok', 'Armed'))));
      card.style.setProperty('--c', t.color);
      card.style.setProperty('--i', i);
      if (/^#0{3,6}$/i.test(t.color)) card.dataset.dark = '1';
      card.tabIndex = 0;
      card.setAttribute('aria-label', `${t.name} — ${t.role || ''}. ${t.use || ''}`);
      card._pop = () => popTool(t);
      return card;
    }));
  }

  const CAT_ICONS = {
    Bug: 'M8 8a4 4 0 0 1 8 0v1H8zM6 10h12v4a6 6 0 0 1-12 0zM12 10v10M3 13h3M18 13h3M4 7l3 2M20 7l-3 2M4 19l3-2M20 19l-3-2',
    ShieldCheck: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5',
    FileCode2: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M10 13l-2 2 2 2M14 13l2 2-2 2',
    Server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01',
  };

  function renderMatrix(skills, live) {
    const cards = skills.map((g, i) => {
      const list = g.skills || [];
      const ic = svgPath(CAT_ICONS[g.iconName] || CAT_ICONS.ShieldCheck);
      const card = el('div', 'cat rv',
        el('div', 'cat__head', el('span', 'cat__icon', ic), el('span', 'cat__count', String(list.length).padStart(2, '0'))),
        el('h4', 'cat__title', g.title),
        el('div', 'cat__chips', list.map((s, k) => {
          const c = el('span', 'cat__chip', s);
          c.style.setProperty('--k', k);
          c.tabIndex = 0;
          c._pop = () => popSkill(s, g);
          return c;
        })),
        el('span', 'cat__hint', matchMedia('(hover: none)').matches ? 'Tap a skill' : 'Hover a skill'));
      card.style.setProperty('--i', i);
      return card;
    });
    const src = el('p', 'matrix__src' + (live ? ' is-live' : ''), el('i', ''),
      live ? 'Synced live from my portfolio database' : 'Skill matrix');
    $('#skill-matrix').replaceChildren(el('div', 'cats', cards), src);
  }

  /* one floating popup shared by every arsenal / skill card */
  const pop = el('div', 'apop');
  pop.setAttribute('role', 'tooltip');
  document.body.append(pop);
  let popFor = null, popHide = 0;

  function popTool(t) {
    const head = el('div', 'apop__head', el('span', 'apop__icon', toolIcon(t)),
      el('div', '', el('b', 'apop__name', t.name), el('span', 'apop__role', t.role || 'Tool')));
    head.style.setProperty('--c', t.color);
    if (/^#0{3,6}$/i.test(t.color)) head.dataset.dark = '1';
    return [head, el('p', 'apop__text', t.use || ''),
      el('div', 'apop__chips', (t.does || []).map(d => el('span', '', d)))];
  }
  // just the one skill under the pointer, not the whole category
  function popSkill(s, g) {
    const note = (D.skillNotes || {})[norm(s)];
    return [el('div', 'apop__head apop__head--cat', el('div', '', el('b', 'apop__name', s),
      el('span', 'apop__role', g.title))), note ? el('p', 'apop__text', note) : null].filter(Boolean);
  }

  function placePop() {
    if (!popFor) return;
    const r = popFor.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, gap = 14;
    const above = r.top - h - gap > 70;
    const x = Math.min(innerWidth - w - 12, Math.max(12, r.left + r.width / 2 - w / 2));
    const y = above ? r.top - h - gap : Math.min(innerHeight - h - 12, r.bottom + gap);
    pop.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    pop.style.setProperty('--ax', `${(r.left + r.width / 2 - x).toFixed(1)}px`);
    pop.classList.toggle('is-below', !above);
    if ((r.bottom < 0 || r.top > innerHeight)) closePop();
  }
  function openPop(card) {
    clearTimeout(popHide);
    if (popFor === card) return;
    if (popFor) popFor.classList.remove('is-popped');
    popFor = card;
    card.classList.add('is-popped');
    pop.replaceChildren(...card._pop());
    pop.classList.remove('is-open');
    placePop();
    void pop.offsetWidth;
    pop.classList.add('is-open');
  }
  function closePop() {
    if (!popFor) return;
    popFor.classList.remove('is-popped');
    popFor = null;
    pop.classList.remove('is-open');
  }
  const cardOf = e => e.target.closest && e.target.closest('.tool, .cat__chip');
  document.addEventListener('pointerover', e => { const c = cardOf(e); if (c && e.pointerType === 'mouse') openPop(c); });
  document.addEventListener('pointerout', e => {
    const c = cardOf(e);
    if (c && e.pointerType === 'mouse' && !c.contains(e.relatedTarget)) popHide = setTimeout(closePop, 80);
  });
  // keyboard focus opens it; a tap's focus is left to the click handler so it can toggle
  let pressAt = 0;
  document.addEventListener('pointerdown', () => { pressAt = performance.now(); });
  document.addEventListener('focusin', e => { const c = cardOf(e); if (c && performance.now() - pressAt > 400) openPop(c); });
  document.addEventListener('focusout', e => { if (cardOf(e)) popHide = setTimeout(closePop, 80); });
  // touch: tap a card to open, tap anywhere else to close
  document.addEventListener('click', e => {
    const c = cardOf(e);
    if (c) { if (popFor === c && matchMedia('(hover: none)').matches) closePop(); else openPop(c); }
    else closePop();
  });
  addEventListener('scroll', placePop, { passive: true });
  addEventListener('resize', placePop);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePop(); });

  /* ---------- CTF labs + recognition ---------- */
  function renderLabs(ctf) {
    const learn = el('p', 'labs__learn', ctf.learning.join(' · '));
    $('#labs').replaceChildren(...ctf.labs.map(l => el('div', 'lab', el('h4', '', l.t), el('p', '', l.d))), learn);
  }

  function renderRecognition(list) {
    const r = list[0];
    if (!r) return;
    const who = el('div', 'recog__who', img(r.avatar, r.name + ' logo'), el('div', '', el('b', '', r.name), el('span', '', r.role)));
    const view = link('recog__link', r.link, 'View recognition', true);
    view.append(arrow('up'));
    const kids = [el('p', 'recog__quote', r.content.trim()), who];
    if (r.image) kids.push(el('div', 'recog__img', img(r.image, 'Certificate of achievement from ' + r.name)));
    kids.push(view);
    $('#recognition').replaceChildren(...kids);
  }

  /* ---------- projects (horizontal track) ---------- */
  function renderProjects(list) {
    const cards = list.map((p, i) => {
      const live = link('', p.liveLink, 'Live Demo', true); live.append(arrow());
      const code = link('', p.githubLink, 'GitHub', true); code.append(arrow());
      const media = el('div', 'proj__media');
      if (p.image) media.append(img(p.image, p.title + ' preview'));
      return el('article', 'proj',
        el('div', 'proj__info',
          el('span', 'proj__tag' + (p.track === 'security' ? ' is-sec' : ''), p.tag || p.type || 'Project'),
          el('h3', 'proj__title', p.title),
          el('p', 'proj__desc', p.description),
          el('div', 'chips', (p.techStack || []).map(t => el('span', 'chip', t))),
          el('div', 'proj__links', live, code)),
        media);
    });
    $('#project-track').replaceChildren(...cards);
    $('#proj-total').textContent = String(list.length).padStart(2, '0');
  }

  function renderAll(live) {
    renderEducation(D.education);
    renderCerts(D.certificates);
    renderSteps(D.methodology);
    renderArsenal(D.securityTools);
    renderTiles('#web-tiles', D.webStack);
    renderMatrix(D.skills, live);
    renderLabs(D.ctf);
    renderRecognition(D.recognition);
    renderProjects(D.projects);
    const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  }
  renderAll(false);

  /* ---------- live sync with the portfolio database ---------- */
  function getJSON(path) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    return fetch(`${D.API}/${path}`, { signal: ctrl.signal })
      .then(r => (r.ok ? r.json() : null))
      .catch(() => null)
      .finally(() => clearTimeout(t));
  }
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  async function syncFromDatabase() {
    const [profile, education, skills, projects, certificates, recognition] = await Promise.all(
      ['profile', 'education', 'skills', 'projects', 'certificates', 'security-recognition'].map(getJSON));
    let live = false;

    if (profile && profile.title) {
      live = true;
      $$('[data-bind="profile.title"]').forEach(n => { n.textContent = profile.title; });
    }
    if (Array.isArray(education) && education.length) {
      live = true;
      const cgpa = D.education[0] && D.education[0].cgpa;
      D.education = education.map(e => ({ degree: e.degree, school: e.school, period: e.period, description: e.description, cgpa }));
    }
    if (Array.isArray(skills) && skills.length) {
      live = true;
      // security categories first
      const order = ['attackvectors', 'toolsarsenal'];
      D.skills = skills.slice().sort((a, b) => {
        const ia = order.indexOf(norm(a.title)), ib = order.indexOf(norm(b.title));
        return (ia < 0 ? 9 : ia) - (ib < 0 ? 9 : ib);
      });
    }
    if (Array.isArray(certificates) && certificates.length) {
      live = true;
      D.certificates = certificates.map(c => {
        const local = D.certificates.find(x => norm(x.title) === norm(c.title));
        return { ...c, image: local ? local.image : '' };
      }).sort((a, b) => {
        const sec = x => /cyber|hack|secur/i.test(x.title) ? 0 : 1;
        return sec(a) - sec(b);
      });
    }
    if (Array.isArray(recognition) && recognition.length) {
      live = true;
      D.recognition = recognition.map((r, i) => ({
        ...r, avatar: (D.recognition[i] || {}).avatar || '', image: (D.recognition[i] || {}).image || '',
      }));
    }
    if (Array.isArray(projects) && projects.length) {
      live = true;
      projects.forEach(p => {
        const mine = D.projects.find(x => norm(x.title) === norm(p.title));
        const patch = { description: p.description, techStack: p.techStack, githubLink: p.githubLink, liveLink: p.liveLink };
        if (mine) Object.assign(mine, patch);
        else D.projects.push({ title: p.title, tag: p.type || 'Project', track: 'web', image: '', ...patch });
      });
    }
    if (!live) return;
    renderAll(true);
    document.dispatchEvent(new CustomEvent('portfolio:rendered'));
  }

  /* =================================================================
     Motion
  ================================================================= */
  const nav = $('.nav');
  const onScrollNav = () => nav.classList.toggle('is-scrolled', scrollY > innerHeight * 0.6);
  addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  const hasGsap = window.gsap && window.ScrollTrigger;
  if (!hasGsap || reduced) {
    syncFromDatabase();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (window.SplitText) gsap.registerPlugin(SplitText);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  let gliding = false;
  // in-page links glide instead of jumping
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id === '#home' ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) {
      gliding = true;
      lenis.scrollTo(target, { offset: 0, duration: 1.6, onComplete: () => { gliding = false; } });
    } else (target === 0 ? scrollTo({ top: 0, behavior: 'smooth' }) : target.scrollIntoView({ behavior: 'smooth' }));
  });

  /* ---------- nav spy: last section whose top has crossed 45% of the viewport ---------- */
  const spySections = $$('section[data-nav]');
  const spy = () => {
    if (!window.setNavActive) return;
    const line = innerHeight * 0.45;
    let current = '#home';
    for (const sec of spySections) if (sec.getBoundingClientRect().top <= line) current = sec.dataset.nav;
    window.setNavActive(current);
  };
  if (lenis) lenis.on('scroll', spy); else addEventListener('scroll', spy, { passive: true });
  addEventListener('resize', spy);

  /* ---------- headings: lines rise out of a mask ---------- */
  function splitHeadings() {
    $$('[data-split]').forEach(h => {
      if (h.dataset.splitDone || !window.SplitText) return;
      h.dataset.splitDone = '1';
      const st = SplitText.create(h, { type: 'lines', linesClass: 'line', mask: 'lines' });
      gsap.from(st.lines, {
        yPercent: 110, rotate: 2, duration: 1.2, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: h, start: 'top 86%' },
      });
    });
  }

  /* ---------- generic reveals ---------- */
  function bindReveals() {
    const fresh = $$('.rv:not([data-bound])');
    fresh.forEach(n => { n.dataset.bound = '1'; });
    if (!fresh.length) return;
    gsap.set(fresh, { autoAlpha: 0, y: 60 });
    ScrollTrigger.batch(fresh, {
      start: 'top 90%', once: true,
      onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08 }),
    });
  }

  const TILE_FROM = { autoAlpha: 0, y: 40, rotateX: -55, transformOrigin: '50% 100%' };

  function bindTiles() {
    // "Tools of the Trade": cards deal in, then each one boots (bar loads, status flips to Armed)
    const grid = $('#sec-tiles');
    const tools = $$('#sec-tiles .tool:not([data-bound])');
    tools.forEach(n => { n.dataset.bound = '1'; });
    if (tools.length) {
      grid.classList.add('is-wait');
      grid.classList.remove('is-on');
      gsap.set(tools, { autoAlpha: 0, y: 50, rotateX: -60, scale: .92, transformOrigin: '50% 100%' });
      ScrollTrigger.create({
        trigger: grid, start: 'top 88%', once: true,
        onEnter: () => {
          gsap.to(tools, {
            autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 1.1, ease: 'back.out(1.5)',
            stagger: { each: 0.07, grid: 'auto', from: 'start' }, clearProps: 'transform,opacity,visibility',
          });
          grid.classList.add('is-on');
        },
      });
    }
    // skill cards: chips type in one after another once the card is on screen
    $$('#skill-matrix .cats:not([data-bound])').forEach(cats => {
      cats.dataset.bound = '1';
      cats.classList.add('is-wait');
      ScrollTrigger.create({ trigger: cats, start: 'top 85%', once: true, onEnter: () => cats.classList.add('is-on') });
    });
    bindWebTiles();
  }

  // "Technologies I Work With": replay the flip-up every time the grid scrolls back into view
  let webTilesST = null;
  function bindWebTiles() {
    const tiles = $$('#web-tiles .tile');
    if (!tiles.length || tiles[0].dataset.bound) return;
    tiles.forEach(n => { n.dataset.bound = '1'; });
    if (webTilesST) webTilesST.kill();
    const hide = () => gsap.set(tiles, { ...TILE_FROM, overwrite: true });
    const play = () => gsap.fromTo(tiles, TILE_FROM, {
      autoAlpha: 1, y: 0, rotateX: 0, duration: 1.5, ease: 'back.out(1.4)', stagger: 0.06,
      clearProps: 'transform', overwrite: true,
    });
    hide();
    webTilesST = ScrollTrigger.create({
      trigger: '#web-tiles', start: 'top 92%', end: 'bottom 8%',
      onEnter: play, onEnterBack: play,
      onLeave: hide, onLeaveBack: hide,
    });
    if (webTilesST.isActive) play();
  }

  function countUps() {
    $$('[data-count]:not([data-bound])').forEach(n => {
      n.dataset.bound = '1';
      const to = parseFloat(n.dataset.count);
      const dec = +(n.dataset.decimals || 0);
      const o = { v: 0 };
      gsap.to(o, {
        v: to, duration: 1.8, ease: 'power3.out',
        scrollTrigger: { trigger: n, start: 'top 90%' },
        onUpdate: () => { n.textContent = o.v.toFixed(dec); },
      });
    });
  }

  /* ---------- About: pinned story — words light up, portrait develops ---------- */
  function aboutStory(desktop) {
    const lede = $('.about__lede');
    let words = [];
    if (window.SplitText) words = SplitText.create(lede, { type: 'words', wordsClass: 'w' }).words;
    const frame = $('.portrait__frame'), photo = $('.portrait__frame img');
    const ring = $('.portrait__ring rect'), chips = $$('.portrait__chip');

    const tl = gsap.timeline({
      scrollTrigger: desktop
        ? { trigger: '.about__pin', start: 'top top', end: '+=120%', pin: true, scrub: 0.8 }
        : { trigger: '.about__pin', start: 'top 75%', end: 'bottom 60%', scrub: 0.8 },
    });
    tl.fromTo(frame, { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
                     { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none', duration: 1 }, 0)
      .fromTo(photo, { scale: 1.3, yPercent: -4, transformOrigin: '50% 15%', filter: 'grayscale(1) contrast(1.05)' },
                     { scale: 1, yPercent: 0, filter: 'grayscale(0) contrast(1)', ease: 'none', duration: 1.6 }, 0)
      .fromTo(ring, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: 1.4 }, 0.1)
      .from(chips, { autoAlpha: 0, scale: 0.6, y: 30, stagger: 0.25, ease: 'back.out(2)', duration: 0.5 }, 0.8);
    if (words.length) tl.to(words, { opacity: 1, stagger: 1.6 / words.length, ease: 'none', duration: 0.2 }, 0.1);

    // gentle float on the chips after they land
    chips.forEach((c, i) => gsap.to(c, { y: '+=10', duration: 2.4 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 }));
  }

  /* ---------- marquee reacts to scroll velocity ---------- */
  function marquee() {
    const track = $('.marquee__track');
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: '.marquee', start: 'top bottom', end: 'bottom top',
      onUpdate: s => {
        const v = gsap.utils.clamp(-6, 6, s.getVelocity() / 250);
        gsap.to(loop, { timeScale: s.direction * (1 + Math.abs(v)), duration: 0.4, overwrite: true });
        gsap.to(track, { skewX: -v * 1.2, duration: 0.4, overwrite: 'auto' });
      },
    });
  }

  /* ---------- projects: vertical scroll drives a horizontal track ---------- */
  let projTween = null;
  function projectsTrack(desktop) {
    if (projTween) { projTween.scrollTrigger && projTween.scrollTrigger.kill(); projTween.kill(); projTween = null; }
    const track = $('#project-track');
    const cards = $$('.proj', track);
    const bar = $('#proj-bar'), cur = $('#proj-cur');
    if (!desktop) {
      gsap.set(track, { x: 0 });
      cards.forEach(c => { c.classList.add('rv'); });
      bindReveals();
      return;
    }
    const dist = () => Math.max(0, track.scrollWidth - innerWidth);
    projTween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: '.projects__pin', start: 'top top', end: () => '+=' + dist(),
        pin: true, scrub: 0.9, invalidateOnRefresh: true,
        // settle on a card so each one stops fully in view
        snap: {
          snapTo: v => {
            const d = dist() || 1;
            const pts = cards.map(c => Math.min(1, (c.offsetLeft - cards[0].offsetLeft) / d));
            return pts.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a));
          },
          duration: { min: 0.25, max: 0.7 }, delay: 0.08, ease: 'power2.inOut', inertia: false,
        },
        onUpdate: s => {
          bar.style.transform = `scaleX(${s.progress})`;
          cur.textContent = String(Math.min(cards.length, Math.round(s.progress * (cards.length - 1)) + 1)).padStart(2, '0');
        },
      },
    });
    cards.forEach(card => {
      const im = $('.proj__media img', card);
      // gentle zoom-out as the card arrives (never crops the screenshot at rest)
      if (im) gsap.fromTo(im, { scale: 1.12 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: projTween, start: 'left right', end: 'left 20%', scrub: true },
      });
      gsap.from(card, {
        rotateY: -10, scale: 0.94, opacity: 0.75, transformOrigin: '0% 50%', ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: projTween, start: 'left 100%', end: 'left 55%', scrub: true },
      });
    });
  }

  /* ---------- contact: letters tumble in ---------- */
  function contactTitle() {
    const t = $('.contact__title');
    if (!window.SplitText) return;
    delete t.dataset.split;
    // whole words (not letters) so the italic "Connect" keeps its natural joins and overhangs
    const st = SplitText.create(t, { type: 'lines, words', linesClass: 'ct-line', wordsClass: 'ct-word', mask: 'lines' });
    gsap.from(st.words, {
      yPercent: 115, rotate: 6, duration: 1.4, ease: 'expo.out', stagger: 0.12,
      scrollTrigger: { trigger: t, start: 'top 85%' },
    });
  }

  /* ---------- pointer tilt on cards ---------- */
  function tilt() {
    if (matchMedia('(hover: none)').matches) return;
    $$('[data-tilt], .proj, .step-card').forEach(card => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: 0.6, ease: 'power3.out' });
      });
      card.addEventListener('pointerleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.8, ease: 'power3.out' }));
    });
  }

  /* ---------- transition 1: hero -> about, blur closes in from the sides, then about surfaces ---------- */
  function portal() {
    const page = $('.page'), hero = $('.hero');
    const [left, right] = $$('.portal-blur__side');
    const ease = t => t * t * (3 - 2 * t);
    const seg = (t, a, b) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
    const apply = t => {
      if (t <= 0 || t >= 1) {
        page.style.transform = page.style.opacity = page.style.filter = hero.style.filter = '';
        left.style.transform = 'translate3d(-100%, 0, 0)';
        right.style.transform = 'translate3d(100%, 0, 0)';
        left.style.opacity = right.style.opacity = 0;
        return;
      }
      // hold the page still under the blur so it surfaces in place
      page.style.transform = `translate3d(0, ${-innerHeight * (1 - t)}px, 0)`;
      // 0 -> .55: the blur slides in from both edges until it meets over the photo
      const close = seg(t, 0, 0.55);
      left.style.transform = `translate3d(${(-100 + close * 100).toFixed(2)}%, 0, 0)`;
      right.style.transform = `translate3d(${(100 - close * 100).toFixed(2)}%, 0, 0)`;
      // the photo itself only goes soft once the fog has reached it
      const soften = seg(t, 0.2, 0.6);
      hero.style.filter = soften > 0 ? `blur(${(soften * 16).toFixed(1)}px)` : '';
      // .5 -> 1: about sharpens out of the blur while the blur clears away
      const show = seg(t, 0.5, 1);
      page.style.opacity = show.toFixed(3);
      page.style.filter = show < 1 ? `blur(${((1 - show) * 18).toFixed(1)}px)` : '';
      left.style.opacity = right.style.opacity = (1 - seg(t, 0.75, 1)).toFixed(3);
    };
    apply(0);
    // large screens: rest on the fully zoomed hero for .8s before the blur starts closing in
    const big = matchMedia('(min-width: 1024px)');
    // fires once per pass; re-arms only after scrolling back above the hold point
    let armed = true;
    ScrollTrigger.create({
      trigger: page, start: 'top bottom',
      onEnter: s => {
        if (!armed || !lenis || gliding || !big.matches) return;
        armed = false;
        lenis.stop();
        lenis.scrollTo(s.start + 1, { immediate: true, force: true });
        setTimeout(() => lenis.start(), 800);
      },
      onLeaveBack: () => { armed = true; },
    });
    ScrollTrigger.create({
      trigger: page, start: 'top bottom', end: 'top top', scrub: true,
      onUpdate: s => apply(s.progress),
      onLeave: () => apply(1), onEnterBack: s => apply(s.progress), onLeaveBack: () => apply(0),
    });
  }

  /* ---------- transition 2: about sinks back as security slides over it ---------- */
  function curtain() {
    gsap.to(['.stats', '.edu-row'], {
      scale: 0.94, opacity: 0.35, filter: 'blur(2px)', transformOrigin: '50% 100%', ease: 'none',
      scrollTrigger: { trigger: '.security', start: 'top bottom', end: 'top 15%', scrub: true },
    });
  }

  /* ---------- transition 3: the night chapter expands from an inset card ---------- */
  function nightPanel() {
    gsap.fromTo('.projects',
      { clipPath: 'inset(0% 5% 0% 5% round 48px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
        scrollTrigger: { trigger: '.projects', start: 'top bottom', end: 'top top', scrub: true } });
    gsap.from('.projects__head', {
      y: 80, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.projects', start: 'top 80%', end: 'top 20%', scrub: true },
    });
  }

  /* ---------- boot ---------- */
  portal();
  contactTitle();
  splitHeadings();
  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 901px)', mobile: '(max-width: 900px)' }, ctx => {
    aboutStory(ctx.conditions.desktop);
    projectsTrack(ctx.conditions.desktop);
  });
  curtain();
  nightPanel();
  marquee();
  bindReveals();
  bindTiles();
  countUps();
  tilt();

  document.addEventListener('portfolio:rendered', () => {
    projectsTrack(matchMedia('(min-width: 901px)').matches);
    bindReveals();
    bindTiles();
    tilt();
    ScrollTrigger.refresh();
  });
  addEventListener('load', () => ScrollTrigger.refresh());
  // web fonts and late images change text/box heights after the first measure;
  // re-measure whenever the page height actually changes so pins start in the right place
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
  let lastH = 0, reT = 0;
  new ResizeObserver(() => {
    const h = document.documentElement.scrollHeight;
    if (Math.abs(h - lastH) < 2) return;
    lastH = h;
    clearTimeout(reT);
    reT = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe($('.page'));
  syncFromDatabase();
})();

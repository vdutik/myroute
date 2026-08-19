/**
 * МІЙ КУРС — lightweight interactions (no Lenis, minimal GSAP scrub)
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function splitChars(el) {
    var text = el.getAttribute('data-split') || el.textContent || '';
    el.setAttribute('aria-label', text);
    el.innerHTML = '';
    var frag = document.createDocumentFragment();
    Array.from(text).forEach(function (ch) {
      var span = document.createElement('span');
      span.className = 'char';
      span.innerHTML = ch === ' ' ? '&nbsp;' : ch;
      frag.appendChild(span);
    });
    el.appendChild(frag);
    return el.querySelectorAll('.char');
  }

  function initHeader() {
    var header = document.querySelector('[data-header]');
    var burger = document.querySelector('[data-burger]');
    var nav = document.querySelector('[data-nav]');
    if (!header) return;

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 20);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    if (burger && nav) {
      burger.addEventListener('click', function () {
        nav.classList.toggle('is-open');
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('is-open');
        });
      });
    }
  }

  function initProgress() {
    var bar = document.querySelector('[data-progress]');
    if (!bar) return;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? window.scrollY / max : 0;
        bar.style.transform = 'scaleX(' + p + ')';
        ticking = false;
      });
    }, { passive: true });
  }

  function initCursor() {
    var root = document.querySelector('[data-cursor]');
    if (!root || !finePointer || reduced) {
      if (root) root.style.display = 'none';
      return;
    }

    document.documentElement.classList.add('has-cursor');
    var ring = root.querySelector('.cursor__ring');
    var dot = root.querySelector('.cursor__dot');

    var hoverSelector = [
      'a',
      'button',
      'input',
      'textarea',
      'select',
      'label',
      'summary',
      '[role="button"]',
      '[data-magnetic]',
      '[data-tilt]',
      '[data-glow]',
      '.bento__item',
      '.journey__card',
      '.quote',
      '.contact-card',
      '.site-nav__drop-btn',
      '.route__stop',
      '.spec-card',
      '.feat-card'
    ].join(',');

    window.addEventListener('pointermove', function (e) {
      var t = 'translate(' + e.clientX + 'px,' + e.clientY + 'px) translate(-50%,-50%)';
      if (dot) dot.style.transform = t;
      if (ring) ring.style.transform = t;
      root.classList.toggle('is-hover', !!(e.target && e.target.closest && e.target.closest(hoverSelector)));
    }, { passive: true });
  }

  function initMagnetic() {
    if (!finePointer || reduced) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = 'translate(' + (dx * 0.18) + 'px,' + (dy * 0.22) + 'px)';
      });
      btn.addEventListener('pointerleave', function () {
        btn.style.transform = '';
      });
    });
  }

  function initGlow() {
    document.querySelectorAll('[data-glow]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--gx', ((e.clientX - r.left) / r.width) * 100 + '%');
        el.style.setProperty('--gy', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  function initHeroVideo() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var media = hero.querySelector('[data-hero-media]');
    var video = hero.querySelector('video');
    var img = hero.querySelector('.hero__media img');
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('preload', 'metadata');

    function fallback() {
      video.style.opacity = '0';
      video.pause();
      if (media) media.classList.add('is-fallback');
      if (img) img.style.zIndex = '2';
    }

    video.addEventListener('error', fallback);
    var p = video.play();
    if (p && p.catch) p.catch(fallback);

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var play = video.play();
            if (play && play.catch) play.catch(function () {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.05 });
      io.observe(hero);
    }
  }

  function initHeroIntro() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;

    document.querySelectorAll('[data-split]').forEach(splitChars);

    var chars = hero.querySelectorAll('.char');
    var items = hero.querySelectorAll('[data-hero-item]');
    var heroInView = hero.getBoundingClientRect().bottom > 80;

    // If page opened mid-scroll / with hash — show hero content immediately, no fade-out traps
    if (!hasGsap || reduced || !heroInView) {
      hero.classList.add('is-ready');
      chars.forEach(function (n) {
        n.style.opacity = '1';
        n.style.transform = 'none';
      });
      items.forEach(function (n) {
        n.style.opacity = '1';
        n.style.transform = 'none';
      });
      return;
    }

    var gsap = window.gsap;
    gsap.set(chars, { yPercent: 110, opacity: 0 });
    gsap.set(items, { y: 20, opacity: 0 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(chars, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.03 }, 0.1)
      .to(items, { y: 0, opacity: 1, duration: 0.65, stagger: 0.08 }, 0.35);

    hero.classList.add('is-ready');
  }

  function initCounters() {
    var nodes = document.querySelectorAll('[data-count]');
    if (!nodes.length) return;

    function fill(el) {
      var end = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (!hasGsap || reduced) {
        el.textContent = end.toLocaleString('uk-UA') + suffix;
        return;
      }
      var obj = { v: 0 };
      window.gsap.to(obj, {
        v: end,
        duration: end > 1000 ? 1.6 : 1.1,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.floor(obj.v).toLocaleString('uk-UA') + suffix;
        }
      });
    }

    if (!('IntersectionObserver' in window)) {
      nodes.forEach(fill);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        fill(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    nodes.forEach(function (n) {
      var r = n.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        fill(n);
      } else {
        io.observe(n);
      }
    });
  }

  function initReveals() {
    var nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length) return;

    function show(n) {
      n.classList.add('is-in');
    }

    if (reduced || !('IntersectionObserver' in window)) {
      nodes.forEach(show);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        show(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

    nodes.forEach(function (n) {
      var r = n.getBoundingClientRect();
      // Already on screen after reload/hash — reveal immediately
      if (r.top < window.innerHeight * 0.95 && r.bottom > 40) {
        show(n);
      } else {
        io.observe(n);
      }
    });
  }

  function clamp01(v) {
    return Math.max(0, Math.min(1, v));
  }

  function seg(p, a, b) {
    if (b <= a) return p >= b ? 1 : 0;
    return clamp01((p - a) / (b - a));
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  /** Scroll-scrub with inertia: lerps displayed progress toward the scroll target */
  function smoothScrub(getTarget, apply) {
    var current = -1;
    var rafId = null;

    function tick() {
      var target = getTarget();
      if (current < 0) current = target;
      var diff = target - current;
      if (Math.abs(diff) < 0.0004) {
        current = target;
        apply(current);
        rafId = null;
        return;
      }
      current += diff * 0.12;
      apply(current);
      rafId = requestAnimationFrame(tick);
    }

    function request() {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    window.addEventListener('pageshow', request);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) request();
    });
    request();
    setTimeout(request, 0);
    setTimeout(request, 100);
    setTimeout(request, 400);
  }

  /** 0..1 through a tall sticky section — both directions, after reload */
  function sceneProgress(section) {
    var vh = window.innerHeight || 1;
    var total = Math.max(1, section.offsetHeight - vh);
    return clamp01(-section.getBoundingClientRect().top / total);
  }

  function onScrollFrame(fn) {
    var ticking = false;
    function run() {
      ticking = false;
      fn();
    }
    function request() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(run);
    }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    window.addEventListener('pageshow', request);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) request();
    });
    request();
    setTimeout(request, 0);
    setTimeout(request, 100);
    setTimeout(request, 400);
  }

  function initDockScene() {
    var root = document.querySelector('[data-dock]');
    if (!root) return;

    var title = root.querySelector('[data-dock-title]');
    var text = root.querySelector('[data-dock-text]');
    var eyebrow = root.querySelector('[data-dock-eyebrow]');
    var dots = root.querySelectorAll('[data-dock-dot]');
    var truck = root.querySelector('[data-dock-truck]');
    var door = root.querySelector('[data-dock-door]');
    var palletBoxes = root.querySelectorAll('[data-dock-box]');
    var cargoBoxes = root.querySelectorAll('[data-cargo-box]');
    var dust = root.querySelector('[data-dock-dust]');
    var hint = root.querySelector('[data-dock-hint]');
    var loadLabel = root.querySelector('[data-dock-load-label]');
    var loadPct = root.querySelector('[data-dock-load-pct]');
    var loadFill = root.querySelector('[data-dock-load-fill]');
    var loadSteps = root.querySelectorAll('[data-dock-load-step]');

    var captions = [
      {
        title: 'Фура під рампою',
        text: 'Склад у Польщі. Тент подано під рампу — вантаж підготовлений до завантаження.',
        eyebrow: 'На складі',
        load: 'Очікування'
      },
      {
        title: 'Завантаження в авто',
        text: 'Палети зі складу заходять у причіп. Кожна позиція фіксується перед виїздом.',
        eyebrow: 'На складі',
        load: 'Завантаження'
      },
      {
        title: 'Перевірка документів',
        text: 'Документи і фотографія вантажу готові — можна рушати в дорогу.',
        eyebrow: 'На складі',
        load: 'Перевірка'
      },
      {
        title: 'Фура вирушила',
        text: 'Вантаж у дорозі. Митниця, транзит і доставка — під нашим супроводом.',
        eyebrow: 'В дорозі',
        load: 'Виїзд'
      }
    ];

    var currentStep = -1;
    function setStep(step) {
      if (step === currentStep) return;
      currentStep = step;
      var cap = captions[step] || captions[0];
      if (title) title.textContent = cap.title;
      if (text) text.textContent = cap.text;
      if (eyebrow) eyebrow.textContent = cap.eyebrow;
      if (loadLabel) loadLabel.textContent = cap.load;
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === step);
      });
      loadSteps.forEach(function (s, i) {
        s.classList.toggle('is-active', i === step);
        s.classList.toggle('is-done', i < step);
      });
    }

    function applyProgress(p) {
      p = clamp01(p);

      var step = 0;
      if (p >= 0.72) step = 3;
      else if (p >= 0.48) step = 2;
      else if (p >= 0.12) step = 1;
      setStep(step);

      var loadP = easeInOutCubic(seg(p, 0.08, 0.72));
      var pct = Math.round(loadP * 100);
      if (loadPct) loadPct.textContent = pct + '%';
      if (loadFill) loadFill.style.width = pct + '%';

      if (hint) hint.classList.toggle('is-hidden', p > 0.04);

      palletBoxes.forEach(function (box, i) {
        var t = seg(p, 0.10 + i * 0.035, 0.26 + i * 0.035);
        box.style.opacity = String(1 - t);
        box.style.transform =
          'translate(' + (t * (120 + i * 18)) + 'px,' + (t * (-40 - (i % 3) * 12)) + 'px)';
      });

      cargoBoxes.forEach(function (box, i) {
        var t = seg(p, 0.14 + i * 0.035, 0.28 + i * 0.035);
        box.style.opacity = String(t);
        box.style.transform = 'translateY(' + ((1 - t) * -28) + 'px) scale(' + (0.85 + 0.15 * t) + ')';
      });

      var doorT = seg(p, 0.42, 0.56);
      if (door) door.style.transform = 'scaleX(' + (1 - doorT * 0.88) + ')';

      var driveT = easeInOutCubic(seg(p, 0.55, 0.92));
      if (truck) truck.style.transform = 'translateX(' + (driveT * 58) + '%)';

      if (dust) {
        var dustIn = seg(p, 0.58, 0.72);
        var dustOut = seg(p, 0.72, 0.9);
        dust.style.opacity = String(Math.max(0, dustIn - dustOut));
        dust.style.transform = 'translateX(' + ((dustIn * 80) + (dustOut * 80)) + 'px)';
      }
    }

    if (reduced) {
      applyProgress(1);
      return;
    }

    smoothScrub(function () {
      return sceneProgress(root);
    }, applyProgress);
  }

  function initRouteScene() {
    var root = document.querySelector('[data-route]');
    if (!root) return;

    var truck = root.querySelector('[data-route-truck]');
    var progressEl = root.querySelector('[data-route-progress]');
    var stops = root.querySelectorAll('[data-route-stop]');
    var title = root.querySelector('[data-route-title]');
    var text = root.querySelector('[data-route-text]');
    var hint = root.querySelector('[data-route-hint]');

    var captions = [
      { title: 'Від порту до складу', text: 'Китай, Європа та країни поза ЄС — міжнародні маршрути з контролем статусу в дорозі.' },
      { title: 'Морський хаб', text: 'Партія в європейському порту. Далі — складська консолідація та виїзд автотранспортом.' },
      { title: 'Консолідація в ЄС', text: 'Збір партій на складі. Далі транзит маршрутом — із контролем статусу рейсу в дорозі.' },
      { title: 'Видача в Україні', text: 'Прибуття, розвантаження та закриття документів по рейсу.' }
    ];

    var current = -1;
    function setRouteStep(step) {
      if (step === current) return;
      current = step;
      stops.forEach(function (stop, i) {
        stop.classList.toggle('is-active', i === step);
        stop.classList.toggle('is-passed', i < step);
      });
      var cap = captions[step] || captions[0];
      if (title) title.textContent = cap.title;
      if (text) text.textContent = cap.text;
    }

    function applyProgress(p) {
      p = clamp01(p);
      if (hint) hint.classList.toggle('is-hidden', p > 0.05);

      var step = 0;
      if (p >= 0.78) step = 3;
      else if (p >= 0.52) step = 2;
      else if (p >= 0.22) step = 1;
      setRouteStep(step);

      if (truck) truck.style.left = (4 + p * 92) + '%';
      if (progressEl) progressEl.style.transform = 'scaleX(' + p + ')';
    }

    if (reduced) {
      applyProgress(1);
      return;
    }

    smoothScrub(function () {
      return sceneProgress(root);
    }, applyProgress);
  }

  ready(function () {
    initHeader();
    initProgress();
    initCursor();
    initMagnetic();
    initGlow();
    initHeroVideo();
    initHeroIntro();
    initCounters();
    initReveals();
    initDockScene();
    initRouteScene();
  });
})();

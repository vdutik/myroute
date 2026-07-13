/**
 * МІЙ КУРС — site interactions v5
 */
(function () {
  'use strict';

  document.documentElement.classList.add('mr-js');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function initHeader() {
    var header = document.querySelector('.main-header');
    if (!header) return;

    function update() {
      header.classList.toggle('mr-header-scrolled', window.scrollY > 40);
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function splitTitle(el) {
    var text = (el.textContent || '').trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';

    Array.prototype.forEach.call(text, function (ch, i) {
      var span = document.createElement('span');
      span.className = 'mr-char' + (ch === ' ' ? ' is-space' : '');
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      span.style.animationDelay = (0.25 + i * 0.04) + 's';
      el.appendChild(span);
    });
  }

  function initHero() {
    var hero = document.querySelector('.mr-hero');
    if (!hero) return;

    var title = hero.querySelector('[data-split-title]');
    if (title && !reducedMotion) splitTitle(title);

    requestAnimationFrame(function () {
      hero.classList.add('is-ready');
    });

    var media = hero.querySelector('.mr-hero__media');
    if (!media) return;
    var video = media.querySelector('video');
    var fallback = media.querySelector('img');
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    function showFallback() {
      video.style.opacity = '0';
      if (fallback) fallback.style.opacity = '1';
    }

    video.addEventListener('error', showFallback);
    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(showFallback);
    }
  }

  function initReveals() {
    var nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });

    setTimeout(function () {
      nodes.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }, 2500);
  }

  function initJourneyRail() {
    var rail = document.querySelector('[data-journey-rail]');
    if (!rail || reducedMotion) return;

    var dragging = false;
    var startX = 0;
    var scrollLeft = 0;

    rail.addEventListener('pointerdown', function (e) {
      dragging = true;
      startX = e.clientX;
      scrollLeft = rail.scrollLeft;
      rail.setPointerCapture(e.pointerId);
    });

    rail.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      rail.scrollLeft = scrollLeft - (e.clientX - startX);
    });

    function endDrag() {
      dragging = false;
    }

    rail.addEventListener('pointerup', endDrag);
    rail.addEventListener('pointercancel', endDrag);
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 72;
        window.scrollTo({
          top: top,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      });
    });
  }

  onReady(function () {
    initHeader();
    initHero();
    initReveals();
    initJourneyRail();
    initAnchors();
  });
})();

(function () {
  'use strict';

  var cards = document.querySelectorAll('.adr-class-card');
  cards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      var wasExpanded = card.classList.contains('is-expanded');
      cards.forEach(function (other) {
        other.classList.remove('is-expanded');
      });
      if (!wasExpanded) card.classList.add('is-expanded');
    });
  });

  var sections = Array.prototype.slice.call(
    document.querySelectorAll('.adr-page [id^="adr-"]')
  );
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.adr-quick-nav__list a[href^="#"]')
  );

  if (sections.length && navLinks.length) {
    var onScroll = function () {
      var scrollPos = window.scrollY + 140;
      var current = '';
      sections.forEach(function (sec) {
        if (sec.offsetTop <= scrollPos) current = sec.id;
      });
      navLinks.forEach(function (link) {
        var active = current && link.getAttribute('href') === '#' + current;
        link.classList.toggle('is-active', !!active);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = link.getAttribute('href');
      if (!target || target.charAt(0) !== '#') return;
      var el = document.querySelector(target);
      if (!el) return;
      e.preventDefault();
      var top = el.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();

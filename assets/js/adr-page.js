(function ($) {
    'use strict';

    /* Expandable class cards */
    $('.adr-class-card').on('click', function (e) {
        if ($(e.target).closest('a').length) return;
        var $card = $(this);
        var wasExpanded = $card.hasClass('is-expanded');
        $('.adr-class-card').removeClass('is-expanded');
        if (!wasExpanded) {
            $card.addClass('is-expanded');
        }
    });

    /* Quick nav active state on scroll */
    var $sections = $('.adr-page [id^="adr-"]');
    var $navLinks = $('.adr-quick-nav__list a');

    if ($sections.length && $navLinks.length) {
        $(window).on('scroll', function () {
            var scrollPos = $(window).scrollTop() + 120;
            var current = '';
            $sections.each(function () {
                var $sec = $(this);
                if ($sec.offset().top <= scrollPos) {
                    current = $sec.attr('id');
                }
            });
            $navLinks.removeClass('is-active');
            if (current) {
                $navLinks.filter('[href="#' + current + '"]').addClass('is-active');
            }
        });
    }

    /* Smooth scroll for quick nav */
    $('.adr-quick-nav__list a').on('click', function (e) {
        var target = $(this).attr('href');
        if (target && target.charAt(0) === '#') {
            e.preventDefault();
            var $el = $(target);
            if ($el.length) {
                $('html, body').animate({ scrollTop: $el.offset().top - 70 }, 500);
            }
        }
    });

})(jQuery);

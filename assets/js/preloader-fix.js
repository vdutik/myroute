/**
 * Global Preloader Fix for Dark Theme
 * Closes the preloader as soon as the DOM is ready so content appears quickly,
 * with safety fallbacks in case earlier triggers fail.
 */

$(document).ready(function() {
    // Close as soon as DOM is interactive - no need to wait for all images
    setTimeout(closePreloader, 200);

    $('body').addClass('loaded');

    // Backup: window load
    $(window).on('load', closePreloader);

    // Force close fallback
    setTimeout(forceClosePreloader, 2000);
});

function closePreloader() {
    const preloader = $('.loader-wrap');
    if (preloader.length && preloader.is(':visible')) {
        preloader.addClass('fade-out');
        setTimeout(function() {
            preloader.remove();
        }, 800); // Match CSS transition duration
    }
}

function forceClosePreloader() {
    const preloader = $('.loader-wrap');
    if (preloader.length) {
        preloader.addClass('fade-out');
        setTimeout(function() {
            preloader.remove();
            $('body').addClass('loaded');
        }, 800);
    }
}

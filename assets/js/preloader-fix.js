/**
 * Global Preloader Fix for Dark Theme
 * Ensures preloader always closes on all pages
 */

$(document).ready(function() {
    console.log('Preloader fix script loaded');
    
    // Method 1: Standard window load
    $(window).on('load', function() {
        console.log('Window loaded, closing preloader');
        setTimeout(function() {
            closePreloader();
        }, 500);
    });
    
    // Method 2: DOM ready backup
    setTimeout(function() {
        console.log('DOM ready backup, closing preloader');
        closePreloader();
    }, 1500);
    
    // Method 3: Document ready backup
    setTimeout(function() {
        console.log('Document ready backup, closing preloader');
        closePreloader();
    }, 2500);
    
    // Method 4: Force close after 4 seconds
    setTimeout(function() {
        console.log('Force close preloader');
        forceClosePreloader();
    }, 4000);
    
    // Method 5: Add loaded class to body
    setTimeout(function() {
        $('body').addClass('loaded');
        console.log('Added loaded class to body');
    }, 800);
    
    // Method 6: Check if all images are loaded
    if ($('img').length > 0) {
        $('img').on('load', function() {
            setTimeout(closePreloader, 300);
        });
    }
});

function closePreloader() {
    const preloader = $('.loader-wrap');
    if (preloader.length && preloader.is(':visible')) {
        console.log('Closing preloader with fadeOut');
        preloader.fadeOut(300, function() {
            $(this).remove();
            console.log('Preloader removed');
        });
    }
}

function forceClosePreloader() {
    const preloader = $('.loader-wrap');
    if (preloader.length) {
        console.log('Force closing preloader');
        preloader.addClass('hidden').remove();
        $('body').addClass('loaded');
    }
}

// Additional check for pages that might have issues
$(window).on('beforeunload', function() {
    closePreloader();
});

// Check if preloader is still visible after 8 seconds
setTimeout(function() {
    if ($('.loader-wrap').is(':visible')) {
        console.log('Preloader still visible after 8 seconds, forcing close');
        forceClosePreloader();
    }
}, 8000);

// Emergency fallback - check every 2 seconds
let checkCount = 0;
const maxChecks = 10;
const checkInterval = setInterval(function() {
    checkCount++;
    if (checkCount >= maxChecks) {
        clearInterval(checkInterval);
        return;
    }
    
    if ($('.loader-wrap').is(':visible')) {
        console.log(`Emergency check ${checkCount}: Preloader still visible`);
        if (checkCount >= 5) {
            forceClosePreloader();
            clearInterval(checkInterval);
        }
    } else {
        clearInterval(checkInterval);
    }
}, 2000);

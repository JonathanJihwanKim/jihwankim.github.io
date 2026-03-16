/**
 * lightbox.js — Image zoom overlay for blog posts
 * Attaches click handlers to article images for full-screen viewing.
 */
(function () {
    'use strict';

    var lightbox = document.getElementById('lightbox');
    var lightboxImage = document.getElementById('lightbox-image');
    var lightboxClose = document.getElementById('lightbox-close');
    var articleContent = document.querySelector('.article-content');

    if (!lightbox || !lightboxImage || !lightboxClose || !articleContent) return;

    var articleImages = articleContent.querySelectorAll('img');

    function openLightbox(imgSrc, imgAlt) {
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt || 'Enlarged image';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(function () {
            lightboxImage.src = '';
            lightboxImage.alt = '';
        }, 250);
    }

    articleImages.forEach(function (img) {
        img.addEventListener('click', function () {
            openLightbox(img.src, img.alt);
        });
        img.setAttribute('tabindex', '0');
        img.setAttribute('role', 'button');
        img.setAttribute('aria-label', 'Click to view full size: ' + (img.alt || 'image'));
        img.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(img.src, img.alt);
            }
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
})();

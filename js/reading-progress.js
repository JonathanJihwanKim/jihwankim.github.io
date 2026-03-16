/**
 * reading-progress.js — Scroll-based reading progress bar for blog posts
 */
(function () {
    'use strict';

    var bar = document.getElementById('reading-progress');
    var article = document.querySelector('.article-content');
    if (!bar || !article) return;

    function updateProgress() {
        var articleTop = article.getBoundingClientRect().top + window.pageYOffset;
        var articleHeight = article.offsetHeight;
        var scrolled = window.pageYOffset - articleTop;
        var progress = Math.max(0, Math.min(100, (scrolled / articleHeight) * 100));
        bar.style.width = progress + '%';
        bar.setAttribute('aria-valuenow', Math.round(progress));
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
})();

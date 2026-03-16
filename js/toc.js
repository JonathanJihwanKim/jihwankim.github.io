/**
 * toc.js — Table of contents generation and scroll-spy
 * Generates TOC from h2 headings in .article-content
 * Supports both desktop sidebar (#toc-list) and mobile dropdown (#toc-mobile-list)
 */
(function () {
    'use strict';

    var article = document.querySelector('.article-content');
    if (!article) return;

    var headings = article.querySelectorAll('h2');
    if (headings.length < 2) return;

    var tocList = document.getElementById('toc-list');
    var tocMobileList = document.getElementById('toc-mobile-list');
    var tocLinks = [];

    headings.forEach(function (h, i) {
        if (!h.id) {
            h.id = 'section-' + i + '-' + h.textContent.trim().toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '');
        }

        // Desktop TOC
        if (tocList) {
            var a = document.createElement('a');
            a.href = '#' + h.id;
            a.className = 'toc-link';
            a.textContent = h.textContent;
            a.addEventListener('click', function (e) {
                e.preventDefault();
                h.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            tocList.appendChild(a);
            tocLinks.push({ link: a, heading: h });
        }

        // Mobile TOC
        if (tocMobileList) {
            var mobileA = document.createElement('a');
            mobileA.href = '#' + h.id;
            mobileA.textContent = h.textContent;
            mobileA.addEventListener('click', function (e) {
                e.preventDefault();
                h.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile TOC
                var content = document.getElementById('toc-mobile-content');
                var toggle = document.getElementById('toc-mobile-toggle');
                if (content) content.classList.remove('expanded');
                if (toggle) toggle.classList.remove('expanded');
            });
            tocMobileList.appendChild(mobileA);
        }
    });

    // Mobile TOC toggle
    var tocMobileToggle = document.getElementById('toc-mobile-toggle');
    var tocMobileContent = document.getElementById('toc-mobile-content');
    if (tocMobileToggle && tocMobileContent) {
        tocMobileToggle.addEventListener('click', function () {
            tocMobileToggle.classList.toggle('expanded');
            tocMobileContent.classList.toggle('expanded');
        });
    }

    // Scroll-spy for desktop TOC
    if (tocLinks.length > 0) {
        function updateTOC() {
            var scrollY = window.pageYOffset;
            var active = 0;
            for (var i = 0; i < tocLinks.length; i++) {
                var top = tocLinks[i].heading.getBoundingClientRect().top + window.pageYOffset;
                if (scrollY >= top - 120) { active = i; }
            }
            tocLinks.forEach(function (item, i) {
                item.link.classList.toggle('active', i === active);
            });
        }
        window.addEventListener('scroll', updateTOC, { passive: true });
        updateTOC();
    }
})();

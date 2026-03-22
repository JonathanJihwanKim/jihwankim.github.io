/**
 * counter.js — Visitor & reader counters via Cloudflare Workers + KV
 * Counter started on 2026-03-22. Visits before this date are not counted.
 * Used on all pages: homepage (index.html), blog posts (posts/*.html), about, tools.
 */
(function () {
    'use strict';

    // Counter started on 2026-03-22. Visits before this date are not counted.
    var API = 'https://powerbimvp-counter.jonathan-jihwankim.workers.dev';
    var isPost = window.location.pathname.includes('/posts/');

    function fmt(n) {
        return typeof n === 'number' && !isNaN(n) ? n.toLocaleString() : '\u2014';
    }

    function recordView(page) {
        var key = 'counted:' + page;
        if (sessionStorage.getItem(key)) return Promise.resolve(null);
        return fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page: page })
        })
        .then(function (r) { return r.json(); })
        .then(function (d) { sessionStorage.setItem(key, '1'); return d; })
        .catch(function () { return null; });
    }

    function readCounts(pages) {
        return fetch(API + '?pages=' + encodeURIComponent(pages.join(',')))
            .then(function (r) { return r.json(); })
            .catch(function () { return {}; });
    }

    function readTotal() {
        return fetch(API)
            .then(function (r) { return r.json(); })
            .then(function (d) { return d.total; })
            .catch(function () { return null; });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var page = window.location.pathname;

        // Record this visit
        recordView(page).then(function (data) {
            // On blog post: update reader count from POST response
            if (isPost && data) {
                var el = document.getElementById('reader-count-number');
                if (el) el.textContent = fmt(data.count);
            }
        });

        if (!isPost) {
            // Homepage: site-wide visitor count
            readTotal().then(function (total) {
                var el = document.getElementById('visitor-count-number');
                if (el && total !== null) el.textContent = fmt(total);
            });

            // Homepage: per-post reader counts on cards
            setTimeout(function () {
                var cards = document.querySelectorAll('.post-card-readers[data-path]');
                if (!cards.length) return;
                var pages = [];
                cards.forEach(function (c) { pages.push('/' + c.getAttribute('data-path')); });
                readCounts(pages).then(function (counts) {
                    cards.forEach(function (c) {
                        var p = '/' + c.getAttribute('data-path');
                        if (counts[p] != null) {
                            var v = c.querySelector('.reader-count-value');
                            if (v) { v.textContent = fmt(counts[p]); c.classList.add('loaded'); }
                        }
                    });
                });
            }, 100);
        } else {
            // Blog post: if sessionStorage already counted, fetch via GET
            if (sessionStorage.getItem('counted:' + page)) {
                fetch(API + '?page=' + encodeURIComponent(page))
                    .then(function (r) { return r.json(); })
                    .then(function (d) {
                        var el = document.getElementById('reader-count-number');
                        if (el) el.textContent = fmt(d.count);
                    })
                    .catch(function () {});
            }
        }
    });
})();

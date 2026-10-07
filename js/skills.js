/**
 * skills.js - Fills the "What I'm good at" cards on the About page
 * Each card lists the two most-read posts in its category plus the newest one.
 * Categories come from the skill field in js/blog-data.js (window.blogPosts),
 * reader counts from the same Cloudflare Worker that js/counter.js writes to.
 * This script only reads counts. If they can't be read, the links written in
 * about.html stay as they are.
 */
(function () {
    'use strict';

    var API = 'https://powerbimvp-counter.jonathan-jihwankim.workers.dev';
    var MOST_READ = 2;

    var lists = document.querySelectorAll('.skill-card-posts[data-skill]');
    var posts = window.blogPosts;
    if (!lists.length || !posts || !window.fetch) return;

    var ownPosts = posts.filter(function (post) { return !!post.skill; });

    // A post can be counted under /posts/x.html or /posts/x, so read both and add them up
    var paths = [];
    ownPosts.forEach(function (post) {
        paths.push('/' + post.url, '/' + post.url.replace(/\.html$/, ''));
    });

    function readsOf(counts, post) {
        var withExt = counts['/' + post.url] || 0;
        var withoutExt = counts['/' + post.url.replace(/\.html$/, '')] || 0;
        return withExt + withoutExt;
    }

    // Curly quotes in titles (U+2018, U+2019, U+201C, U+201D) shown as straight ones
    var SINGLE_QUOTES = new RegExp('[' + String.fromCharCode(0x2018, 0x2019) + ']', 'g');
    var DOUBLE_QUOTES = new RegExp('[' + String.fromCharCode(0x201C, 0x201D) + ']', 'g');

    // Long titles are cut at the first colon when the part before it can stand alone
    function shortTitle(title) {
        var plain = title.replace(SINGLE_QUOTES, "'").replace(DOUBLE_QUOTES, '"');
        var colon = plain.indexOf(': ');
        if (colon > 0 && plain.slice(0, colon).split(' ').length >= 5) {
            return plain.slice(0, colon);
        }
        return plain;
    }

    function pickPosts(candidates, counts) {
        // candidates are newest first, as in blog-data.js
        var newest = candidates[0];
        var byReads = candidates.slice().sort(function (a, b) {
            return readsOf(counts, b) - readsOf(counts, a) || (b.sortDate > a.sortDate ? 1 : -1);
        });
        var top = byReads.slice(0, MOST_READ);
        var picks = top.map(function (post) { return { post: post, label: 'Most read' }; });
        if (top.indexOf(newest) === -1) {
            picks.push({ post: newest, label: 'Newest' });
        } else if (byReads[MOST_READ]) {
            picks.push({ post: byReads[MOST_READ], label: 'Most read' });
        }
        return picks;
    }

    function renderList(list, picks) {
        var fragment = document.createDocumentFragment();
        picks.forEach(function (pick) {
            var item = document.createElement('li');
            var link = document.createElement('a');
            link.href = pick.post.url;

            var icon = document.createElement('span');
            icon.className = 'material-symbols-outlined';
            icon.setAttribute('aria-hidden', 'true');
            icon.textContent = 'article';

            var text = document.createElement('span');
            text.className = 'skill-post-title';
            text.textContent = shortTitle(pick.post.title);

            var tag = document.createElement('span');
            tag.className = 'skill-post-tag' + (pick.label === 'Newest' ? ' skill-post-tag--new' : '');
            tag.textContent = pick.label;

            link.appendChild(icon);
            link.appendChild(text);
            link.appendChild(tag);
            item.appendChild(link);
            fragment.appendChild(item);
        });
        list.innerHTML = '';
        list.appendChild(fragment);
    }

    // The worker answers at most 20 pages per request, so ask in batches and merge
    var BATCH = 20;
    var requests = [];
    for (var start = 0; start < paths.length; start += BATCH) {
        requests.push(
            fetch(API + '?pages=' + encodeURIComponent(paths.slice(start, start + BATCH).join(',')))
                .then(function (r) { return r.json(); })
        );
    }

    Promise.all(requests)
        .then(function (batches) {
            var counts = {};
            batches.forEach(function (batch) {
                if (!batch || typeof batch !== 'object') return;
                Object.keys(batch).forEach(function (key) { counts[key] = batch[key]; });
            });
            for (var i = 0; i < lists.length; i++) {
                var skill = lists[i].getAttribute('data-skill');
                var candidates = ownPosts.filter(function (post) { return post.skill === skill; });
                if (candidates.length) renderList(lists[i], pickPosts(candidates, counts));
            }
        })
        .catch(function () {});
})();

/**
 * theme.js — Mobile menu, search overlay, and global interactions
 * Shared across all pages on powerbimvp.com
 */
(function () {
    'use strict';

    var isPost = window.location.pathname.includes('/posts/');
    var base = isPost ? '../' : '';

    // --- Mobile Menu ---
    var mobileToggle = document.getElementById('mobile-menu-toggle');
    var mobileOverlay = document.getElementById('mobile-nav-overlay');
    var mobilePanel = document.getElementById('mobile-nav-panel');
    var mobileClose = document.getElementById('mobile-nav-close');

    function openMobileMenu() {
        mobileOverlay.classList.add('active');
        mobilePanel.classList.add('active');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileOverlay.classList.remove('active');
        mobilePanel.classList.remove('active');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

    // Close on resize to desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) closeMobileMenu();
    });

    // --- Search Overlay ---
    var searchToggle = document.getElementById('search-toggle');
    var searchOverlay = document.getElementById('search-overlay');
    var searchInput = document.getElementById('search-input');
    var searchClose = document.getElementById('search-close');
    var searchResults = document.getElementById('search-results');

    function openSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(function () {
            if (searchInput) searchInput.focus();
        }, 100);
    }

    function closeSearch() {
        if (!searchOverlay) return;
        searchOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (searchInput) searchInput.value = '';
        if (searchResults) searchResults.innerHTML = '';
    }

    if (searchToggle) searchToggle.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);

    // Close search on click outside
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function (e) {
            if (e.target === searchOverlay) closeSearch();
        });
    }

    // Global ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (searchOverlay && searchOverlay.classList.contains('active')) {
                closeSearch();
            }
            if (mobilePanel && mobilePanel.classList.contains('active')) {
                closeMobileMenu();
            }
        }
    });

    // Keyboard shortcut: Ctrl+K or Cmd+K to open search
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchOverlay && searchOverlay.classList.contains('active')) {
                closeSearch();
            } else {
                openSearch();
            }
        }
    });

    // --- Search functionality (works on all pages) ---
    // Posts data is defined in blog-data.js on the homepage.
    // On other pages, we redirect to the homepage with a search param.
    var searchTimeout;
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function () {
                performSearch(searchInput.value);
            }, 200);
        });

        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                var query = searchInput.value.trim();
                if (query) {
                    // Always redirect to homepage with search param
                    window.location.href = base + 'index.html?search=' + encodeURIComponent(query);
                }
            }
        });
    }

    function performSearch(query) {
        if (!searchResults) return;
        query = query.toLowerCase().trim();

        if (!query) {
            searchResults.innerHTML = '';
            return;
        }

        // If window.blogPosts exists (homepage), search locally
        if (window.blogPosts) {
            var results = window.blogPosts.filter(function (post) {
                return post.title.toLowerCase().includes(query) ||
                       post.preview.toLowerCase().includes(query) ||
                       post.tags.some(function (t) { return t.toLowerCase().includes(query); });
            });

            if (results.length === 0) {
                searchResults.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-tertiary);font-size:0.875rem;">No posts found</div>';
                return;
            }

            searchResults.innerHTML = results.map(function (post) {
                return '<a href="' + post.url + '" class="search-result-item">' +
                       '<h4>' + post.title + '</h4>' +
                       '<p>' + post.preview + '</p>' +
                       '</a>';
            }).join('');
        } else {
            // On non-homepage pages, show a prompt to search
            searchResults.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-tertiary);font-size:0.875rem;">Press Enter to search on the blog</div>';
        }
    }
})();

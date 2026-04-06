/**
 * blog-data.js — Posts data, rendering, search, pagination, and tag filtering
 * Used on the homepage (index.html) only.
 */
(function () {
    'use strict';

    // Blog posts data — newest first
    var posts = [
        {
            id: 9,
            title: "From \u2018Mark as Date Table\u2019 to Calendars: My First Year-Week Calendar with Calendar-Based Time Intelligence",
            preview: "Creating a year-week calendar with calendar-based time intelligence revealed the critical role of category configuration \u2014 a missing Year category silently returned wrong results, and an unnecessary Date category added complexity without benefit. Exploring the new calendar UI, the Week vs. Week of Year distinction, and how TMDL makes calendar definitions source-controllable.",
            date: "April 6, 2026",
            sortDate: "2026-04-06",
            tags: ["DAX", "Power BI", "TMDL"],
            url: "posts/calendar-based-time-intelligence-year-week.html",
            featuredImage: "images/blog/calendar-time-intelligence/featured.png",
            readingTime: "10 min read",
            difficulty: "Intermediate"
        },
        {
            id: 8,
            title: "Selective Branching in Fabric: Feature Branches Without the Clutter",
            preview: "Exploring Fabric's selective branching feature end-to-end: from picking only the items you need, to committing changes in an isolated workspace, creating a pull request in Azure DevOps, and syncing back to main.",
            date: "March 29, 2026",
            sortDate: "2026-03-29",
            tags: ["Fabric", "Git", "DevOps"],
            url: "posts/fabric-selective-branching-git-workspace.html",
            featuredImage: "images/blog/fabric-selective-branching/featured.png",
            readingTime: "7 min read",
            difficulty: "Intermediate"
        },
        {
            id: 7,
            title: "Tracing Power BI Visuals Back to Source",
            preview: "A colleague asked what measure drives a visual and how to trace it back to the source. Walking through PBIP files manually is painful at scale. PBIP Lineage Explorer solves this instantly, client-side.",
            date: "March 21, 2026",
            sortDate: "2026-03-21",
            tags: ["Power BI", "PBIR", "Open Source", "TMDL"],
            url: "posts/pbip-lineage-explorer-tracing-visuals-to-source.html",
            featuredImage: "images/blog/pbip-lineage-explorer/featured.png",
            readingTime: "14 min read",
            difficulty: "Advanced"
        },
        {
            id: 6,
            title: "PBIR JSON Doesn't Tell the Full Story: What's Missing from Field Parameters and Calculation Groups",
            preview: "PBIR visual JSON only captures the last saved state \u2014 hiding calculation group usage and full field parameter selections. Learn how teaching Claude to trace from report to semantic model revealed hidden gaps and led to building pbip-documenter.",
            date: "March 7, 2026",
            sortDate: "2026-03-07",
            tags: ["Power BI", "PBIR", "AI", "Open Source"],
            url: "posts/pbir-json-hidden-gaps-field-parameters.html",
            featuredImage: "images/blog/pbir-json-hidden-gaps/featured.png",
            readingTime: "10 min read",
            difficulty: "Intermediate"
        },
        {
            id: 5,
            title: "Answering Like a Developer: Tracing Measures Through PBIR Visual JSON, Field Parameters, and TMDL",
            preview: "Discover how to trace measures through PBIR visual JSON files and field parameters to TMDL definitions \u2014 answering stakeholder questions like a developer, without opening Desktop.",
            date: "February 14, 2026",
            sortDate: "2026-02-14",
            tags: ["Power BI", "PBIR", "DevOps", "TMDL"],
            url: "posts/pbir-visual-json-field-parameters.html",
            featuredImage: "images/blog/pbir-visual-json-field-parameters/featured.png",
            readingTime: "15 min read",
            difficulty: "Advanced"
        },
        {
            id: 4,
            title: "From Clicking to Coding: How PBIR Transformed Edit Interactions in Power BI",
            preview: "Learn how PBIR transforms Edit Interactions in Power BI from clicking through the UI to code-based configuration. Discover DevOps workflows, version control, bulk editing, and validation through JSON.",
            date: "February 1, 2026",
            sortDate: "2026-02-01",
            tags: ["Power BI", "PBIR", "DevOps"],
            url: "posts/pbir-edit-interactions.html",
            featuredImage: "images/blog/pbir-edit-interactions/featured.png",
            readingTime: "12 min read",
            difficulty: "Intermediate"
        },
        {
            id: 3,
            title: "From Click-by-Click to Code: How PBIR Transformed My Filters Pane Visibility and Layer Order Workflow",
            preview: "Learn how PBIR transforms filter visibility and layer order management in Power BI. Discover the default-omission pattern, DevOps workflows, and AI-assisted automation.",
            date: "January 25, 2026",
            sortDate: "2026-01-25",
            tags: ["Power BI", "PBIR", "DevOps"],
            url: "posts/pbir-filter-layer-order.html",
            featuredImage: "images/blog/pbir-filter-layer-order/featured.png",
            readingTime: "10 min read",
            difficulty: "Intermediate"
        },
        {
            id: 2,
            title: "Building Hybrid Semantic Models with Tabular Editor: Combining Direct Lake and Import Mode",
            preview: "Explore the hybrid semantic model pattern combining Direct Lake and Import mode tables. Learn the workflow, gateway configuration, and TMDL structure for enterprise deployments.",
            date: "January 17, 2026",
            sortDate: "2026-01-17",
            tags: ["Power BI", "Fabric", "Direct Lake"],
            url: "posts/building-hybrid-semantic-models-tabular-editor.html",
            featuredImage: "images/blog/hybrid-semantic-models/featured.png",
            readingTime: "14 min read",
            difficulty: "Advanced"
        },
        {
            id: 1,
            title: "Building a Portable Time Intelligence Library with DAX User-Defined Functions",
            preview: "Learn how to create reusable, model-independent DAX functions that work across any semantic model. Covers UDF design patterns, TMDL integration, and sharing through DAX Lib.",
            date: "January 11, 2026",
            sortDate: "2026-01-11",
            tags: ["DAX", "Power BI", "UDF"],
            url: "posts/building-portable-time-intelligence-library-dax-udf.html",
            featuredImage: "images/blog/dax-udf/featured.png",
            readingTime: "11 min read",
            difficulty: "Intermediate"
        }
    ];

    // Expose globally for search overlay (used by theme.js)
    window.blogPosts = posts;

    var postsContainer = document.getElementById('posts-container');
    var noResults = document.getElementById('no-results');
    var paginationContainer = document.getElementById('pagination');
    var postsPerPage = 6;
    var currentPage = 1;
    var activeTag = 'all';
    var searchQuery = '';

    // --- Tag Filter ---
    var tagButtons = document.querySelectorAll('.tag-pill[data-tag]');
    tagButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            tagButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            activeTag = btn.getAttribute('data-tag');
            currentPage = 1;

            // Update URL
            var url = new URL(window.location);
            if (activeTag === 'all') {
                url.searchParams.delete('tag');
            } else {
                url.searchParams.set('tag', activeTag);
            }
            url.searchParams.delete('search');
            window.history.replaceState({}, '', url);

            renderPosts(getFilteredPosts());
        });
    });

    function getFilteredPosts() {
        var filtered = posts;

        // Tag filter
        if (activeTag !== 'all') {
            filtered = filtered.filter(function (post) {
                return post.tags.some(function (t) { return t === activeTag; });
            });
        }

        // Search filter
        if (searchQuery) {
            var q = searchQuery.toLowerCase();
            filtered = filtered.filter(function (post) {
                return post.title.toLowerCase().includes(q) ||
                       post.preview.toLowerCase().includes(q) ||
                       post.tags.some(function (t) { return t.toLowerCase().includes(q); });
            });
        }

        return filtered;
    }

    function getDifficultyClass(difficulty) {
        if (!difficulty) return '';
        return 'difficulty-badge--' + difficulty.toLowerCase();
    }

    function getTagDataAttr(tag) {
        return 'data-tag="' + tag + '"';
    }

    function renderPosts(filteredPosts) {
        if (!postsContainer) return;
        postsContainer.innerHTML = '';

        if (filteredPosts.length === 0) {
            if (noResults) noResults.style.display = 'block';
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        if (noResults) noResults.style.display = 'none';

        var startIndex = (currentPage - 1) * postsPerPage;
        var paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

        paginatedPosts.forEach(function (post, index) {
            var isFeatured = (index === 0 && currentPage === 1 && !searchQuery);
            var card = document.createElement('a');
            card.href = post.url;
            card.className = 'post-card animate-in' + (isFeatured ? ' post-card--featured' : '');

            var imageHtml = post.featuredImage
                ? '<img src="' + post.featuredImage + '" alt="' + post.title + '" class="post-card-image" loading="lazy">'
                : '';

            var tagsHtml = post.tags.slice(0, 3).map(function (tag) {
                return '<span class="tag" ' + getTagDataAttr(tag) + '>' + tag + '</span>';
            }).join('');

            var difficultyHtml = post.difficulty
                ? '<span class="difficulty-badge ' + getDifficultyClass(post.difficulty) + '">' + post.difficulty + '</span>'
                : '';

            var readingTimeHtml = post.readingTime
                ? '<span class="reading-time"><span class="material-symbols-outlined">schedule</span>' + post.readingTime + '</span>'
                : '';

            card.innerHTML =
                imageHtml +
                '<div class="post-card-body">' +
                    '<div class="post-card-meta-top">' + difficultyHtml + readingTimeHtml + '</div>' +
                    '<h3 class="post-card-title">' + post.title + '</h3>' +
                    '<p class="post-card-preview">' + post.preview + '</p>' +
                    '<div class="post-card-tags">' + tagsHtml + '</div>' +
                    '<div class="post-card-footer">' +
                        '<span class="post-card-date">' + post.date + '</span>' +
                        '<span class="post-card-readers" data-path="' + post.url + '">' +
                            '<span class="material-symbols-outlined">visibility</span> ' +
                            '<span class="reader-count-value"></span>' +
                        '</span>' +
                        '<span class="post-card-read-more">Read <span class="material-symbols-outlined">arrow_forward</span></span>' +
                    '</div>' +
                '</div>';

            postsContainer.appendChild(card);

            // Inject partner card after the 3rd post on page 1
            if (index === 2 && currentPage === 1 && window.sponsors && window.sponsors.length > 0) {
                window.sponsors.forEach(function (s) {
                    var partnerCard = document.createElement('a');
                    partnerCard.href = s.url;
                    partnerCard.target = '_blank';
                    partnerCard.rel = 'noopener';
                    partnerCard.className = 'partner-card animate-in';
                    partnerCard.innerHTML =
                        '<img src="' + s.heroImage + '" alt="' + s.name + ' — ' + s.tagline + '" class="partner-card-image" loading="lazy">' +
                        '<div class="partner-card-body">' +
                            '<span class="partner-label">Partner</span>' +
                            '<h3 class="partner-card-name">' + s.name + '</h3>' +
                            '<p class="partner-card-desc">' + s.description + '</p>' +
                            '<span class="partner-cta-btn">' +
                                '<span class="material-symbols-outlined">open_in_new</span> Visit on Instagram' +
                            '</span>' +
                        '</div>';
                    postsContainer.appendChild(partnerCard);
                });
            }
        });

        renderPagination(filteredPosts.length);
    }

    function renderPagination(totalPosts) {
        if (!paginationContainer) return;
        var totalPages = Math.ceil(totalPosts / postsPerPage);
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        for (var i = 1; i <= Math.min(totalPages, 7); i++) {
            var btn = document.createElement('button');
            btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
            btn.textContent = i;
            btn.setAttribute('data-page', i);
            btn.addEventListener('click', function () {
                currentPage = parseInt(this.getAttribute('data-page'));
                renderPosts(getFilteredPosts());
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationContainer.appendChild(btn);
        }
    }

    // --- Initialize ---
    document.addEventListener('DOMContentLoaded', function () {
        // Check URL params
        var params = new URLSearchParams(window.location.search);

        // Tag from URL
        var tagParam = params.get('tag');
        if (tagParam) {
            activeTag = tagParam;
            tagButtons.forEach(function (btn) {
                btn.classList.toggle('active', btn.getAttribute('data-tag') === tagParam);
            });
        }

        // Search from URL (redirected from blog post search)
        var searchParam = params.get('search');
        if (searchParam) {
            searchQuery = searchParam;
            // Show in search overlay
            var searchInput = document.getElementById('search-input');
            if (searchInput) searchInput.value = searchParam;
        }

        renderPosts(getFilteredPosts());
    });
})();

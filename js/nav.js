/**
 * nav.js — Shared top navigation component for powerbimvp.com
 * Injects the site header, mobile nav panel, and search overlay into all pages.
 * Also fills the footer, the support boxes, and the support/partner placements.
 * Detects whether the page is a blog post (/posts/) or root to set correct asset paths.
 */
(function () {
    var isPost = window.location.pathname.includes('/posts/');
    var base = isPost ? '../' : '';
    var currentPath = window.location.pathname;
    var year = new Date().getFullYear();

    // Partner (ad) placements are switched off. Set to true to bring them all back:
    // the Seoul Bites widgets, the inline post banner, the homepage card, the footer
    // link, and the hidden partner sections on the Sponsors page.
    var SHOW_PARTNERS = false;

    // Support links used by every placement below
    var BMC_URL = 'https://buymeacoffee.com/jihwankim';
    var GHS_URL = 'https://github.com/sponsors/JonathanJihwanKim';
    var LINKEDIN_URL = 'https://www.linkedin.com/in/jihwankim1975/';

    // --- Partner / Sponsor Data (exposed globally for blog-data.js) ---
    window.sponsors = SHOW_PARTNERS ? [
        {
            name: 'Seoul Bites',
            tagline: 'Authentic Korean, Made with Care',
            description: 'Proudly supported by Seoul Bites \u2014 handmade Korean catering for events in the Netherlands.',
            url: 'https://www.instagram.com/seoulbites.nl/',
            heroImage: 'images/sponsors/seoulbites/banner-hero.jpg',
            fullBanner: 'images/sponsors/seoulbites/banner-full.jpg',
            sidebarBanner: 'images/sponsors/seoulbites/banner-rows12.jpg',
            brandBanner: 'images/sponsors/seoulbites/banner-row1.jpg',
            showcaseBanner: 'images/sponsors/seoulbites/banner-rows1234.jpg',
            animatedBanner: 'images/sponsors/seoulbites/20260507.gif',
            qrCode: 'images/sponsors/seoulbites/qrcode.png'
        }
    ] : [];

    // Reveal the partner sections that pages mark with `hidden data-partner-section`
    if (SHOW_PARTNERS) {
        var partnerSections = document.querySelectorAll('[data-partner-section]');
        for (var p = 0; p < partnerSections.length; p++) {
            partnerSections[p].removeAttribute('hidden');
        }
    }

    // Determine active nav link
    function isActive(page) {
        if (page === 'blog') return currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.includes('/posts/');
        if (page === 'about') return currentPath.includes('about');
        if (page === 'tools') return currentPath.includes('tools');
        if (page === 'sponsors') return currentPath.includes('sponsors');
        return false;
    }

    // Inject site header
    var header = document.getElementById('site-header');
    if (header) {
        header.innerHTML = `
            <nav class="site-nav">
                <a href="${base}index.html" class="site-name">JIHWAN KIM</a>
                <div class="nav-links">
                    <a href="${base}index.html" class="${isActive('blog') ? 'active' : ''}">Blog</a>
                    <a href="${base}about.html" class="${isActive('about') ? 'active' : ''}">About</a>
                    <a href="${base}tools.html" class="${isActive('tools') ? 'active' : ''}">Tools</a>
                    <a href="${base}sponsors.html" class="${isActive('sponsors') ? 'active' : ''}">Support</a>
                </div>
                <div class="nav-right">
                    <button class="nav-search-btn" id="search-toggle" aria-label="Search posts">
                        <span class="material-symbols-outlined">search</span>
                    </button>
                    <a href="https://mvp.microsoft.com/en-US/mvp/profile/385eb34e-c755-ed11-9561-000d3a197333" target="_blank" rel="noopener" title="Microsoft MVP Profile">
                        <img src="${base}images/mvp-icon.png" alt="Microsoft MVP" class="nav-mvp-badge">
                    </a>
                    <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Open menu" aria-expanded="false">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </nav>
        `;
    }

    // Inject mobile nav overlay + panel
    var mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-nav-overlay';
    mobileOverlay.id = 'mobile-nav-overlay';
    document.body.appendChild(mobileOverlay);

    var mobilePanel = document.createElement('div');
    mobilePanel.className = 'mobile-nav-panel';
    mobilePanel.id = 'mobile-nav-panel';
    mobilePanel.innerHTML = `
        <button class="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu">
            <span class="material-symbols-outlined">close</span>
        </button>
        <div class="mobile-nav-links">
            <a href="${base}index.html" class="${isActive('blog') ? 'active' : ''}">
                <span class="material-symbols-outlined">article</span> Blog
            </a>
            <a href="${base}about.html" class="${isActive('about') ? 'active' : ''}">
                <span class="material-symbols-outlined">person</span> About
            </a>
            <a href="${base}tools.html" class="${isActive('tools') ? 'active' : ''}">
                <span class="material-symbols-outlined">build</span> Tools
            </a>
            <a href="${base}sponsors.html" class="${isActive('sponsors') ? 'active' : ''}">
                <span class="material-symbols-outlined">volunteer_activism</span> Support
            </a>
        </div>
    `;
    document.body.appendChild(mobilePanel);

    // Inject search overlay
    var searchOverlay = document.createElement('div');
    searchOverlay.className = 'search-overlay';
    searchOverlay.id = 'search-overlay';
    searchOverlay.innerHTML = `
        <div class="search-container">
            <div class="search-input-wrapper">
                <span class="material-symbols-outlined">search</span>
                <input type="text" class="search-input" id="search-input" placeholder="Search posts..." aria-label="Search blog posts">
                <button class="search-close" id="search-close">ESC</button>
            </div>
            <div class="search-results" id="search-results"></div>
        </div>
    `;
    document.body.appendChild(searchOverlay);

    // Inject footer
    var footer = document.getElementById('site-footer');
    if (footer) {
        var sponsorHtml = isPost ? '' : `
                <div class="footer-sponsor">
                    <span class="footer-sponsor-text">Five free Power BI tools, kept current as PBIR and TMDL change. Your support keeps them going.</span>
                    <a href="${BMC_URL}" target="_blank" rel="noopener" class="btn-sponsor">
                        <span class="material-symbols-outlined" aria-hidden="true">coffee</span> Buy me a coffee
                    </a>
                    <a href="${GHS_URL}" target="_blank" rel="noopener" class="btn-sponsor-outline">
                        <span class="material-symbols-outlined" aria-hidden="true">favorite</span> Sponsor on GitHub
                    </a>
                </div>`;
        var partnerLinks = window.sponsors.map(function (s) {
            return `<a href="${base}sponsors.html" class="partner-footer-link">Partner: ${s.name}</a>`;
        }).join(' &middot; ');
        var partnerHtml = partnerLinks ? `<p class="footer-partners">${partnerLinks}</p>` : '';
        footer.innerHTML = `
            <div class="footer-inner">
                <div class="footer-left">
                    <p class="footer-copyright">&copy; ${year} powerbimvp.com &middot; Jihwan Kim</p>
                    <p class="footer-tagline">Deep technical writing on Power BI, PBIR, DAX, and Microsoft Fabric</p>
                    <p class="footer-talk">Questions or ideas? <a href="${LINKEDIN_URL}" target="_blank" rel="noopener">Message me on LinkedIn</a>.</p>
                    ${partnerHtml}
                </div>
                ${sponsorHtml}
            </div>
        `;
    }

    // --- Support box (end of posts and Tools page) ---
    // Pages hold an empty <div class="support-box"> and the wording lives here.
    // data-tool="ID" picks the related tool, data-guest="true" is the guest post
    // wording, and data-variant="tools" is the Tools page version.
    var TOOLS = {
        'pbi-lineage-lenz': { name: 'PBI Lineage Lenz', repo: 'pbi-lineage-lenz' },
        'pbip-lineage-explorer': { name: 'PBIP Lineage Explorer', repo: 'pbip-lineage-explorer' },
        'pbip-documenter': { name: 'PBIP Documenter', repo: 'pbip-documenter' },
        'pbip-impact-analyzer': { name: 'PBIP Impact Analyzer', repo: 'pbip-impact-analyzer' },
        'pbir-visual-manager': { name: 'PBIR Visual Manager', repo: 'isHiddenInViewMode' }
    };
    var DEFAULT_TOOL = 'pbi-lineage-lenz';

    function supportOption(href, style, icon, label, caption) {
        return `
                <div class="support-box-option">
                    <a href="${href}" target="_blank" rel="noopener" class="support-box-btn support-box-btn--${style}">
                        <span class="material-symbols-outlined" aria-hidden="true">${icon}</span> ${label}
                    </a>
                    <p class="support-box-caption">${caption}</p>
                </div>`;
    }

    function renderSupportBox(box) {
        var isTools = box.getAttribute('data-variant') === 'tools';
        var isGuest = box.hasAttribute('data-guest') && box.getAttribute('data-guest') !== 'false';
        var toolId = box.getAttribute('data-tool');
        var tool = TOOLS[Object.prototype.hasOwnProperty.call(TOOLS, toolId) ? toolId : DEFAULT_TOOL];
        var liveUrl = 'https://jonathanjihwankim.github.io/' + tool.repo + '/';
        var repoUrl = isTools ? 'https://github.com/JonathanJihwanKim?tab=repositories' : 'https://github.com/JonathanJihwanKim/' + tool.repo;

        // Share the canonical post URL, not whatever query string the visitor arrived with
        var ogUrl = document.querySelector('meta[property="og:url"]');
        var pageUrl = (ogUrl && ogUrl.getAttribute('content')) || window.location.href;
        var shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(pageUrl);

        var title = 'If this post saved you time';
        var note = 'I run every experiment on my own semantic model and take every screenshot myself. Your support pays for that time and keeps my five free Power BI tools current.';
        if (isTools) {
            title = 'Using these tools at work?';
            note = 'Sponsoring on GitHub keeps all five tools current as PBIR and TMDL change. Companies can sponsor as an organization.';
        } else if (isGuest) {
            title = 'Enjoyed this guest post?';
            note = 'powerbimvp.com is a one-person site, and the five Power BI tools I build here are free for everyone. If this post saved you time, you can support both.';
        }

        var bmcCaption = 'Card or PayPal, one-time or monthly';
        var ghsCaption = 'Through your GitHub account, personal or company';
        // BMC leads on posts (no GitHub account needed), GitHub leads on the Tools page
        var options = isTools
            ? supportOption(GHS_URL, 'primary', 'favorite', 'Sponsor on GitHub', ghsCaption) +
              supportOption(BMC_URL, 'outline', 'coffee', 'Buy me a coffee', bmcCaption)
            : supportOption(BMC_URL, 'primary', 'coffee', 'Buy me a coffee', bmcCaption) +
              supportOption(GHS_URL, 'outline', 'favorite', 'Sponsor on GitHub', ghsCaption);

        var relatedLine = isTools ? '' : `
                <p class="support-box-line">Related free tool: <a href="${liveUrl}" target="_blank" rel="noopener">${tool.name}</a>, which runs in your browser.</p>`;
        var talkLine = isTools
            ? `Questions about a tool? Ask in its GitHub Discussions, or <a href="${LINKEDIN_URL}" target="_blank" rel="noopener">message me on LinkedIn</a>.`
            : `Want to talk something through? <a href="${LINKEDIN_URL}" target="_blank" rel="noopener">Message me on LinkedIn</a>, free of charge.`;

        box.innerHTML = `
            <div class="support-box-head">
                <span class="support-box-photo"><img src="${base}images/profile-1.jpg" alt="Jihwan Kim" loading="lazy"></span>
                <h3 class="support-box-title">${title}</h3>
                <p class="support-box-note">${note}</p>
            </div>
            <div class="support-box-options">${options}
            </div>
            <div class="support-box-extra">${relatedLine}
                <p class="support-box-line">No budget for it? A <a href="${repoUrl}" target="_blank" rel="noopener">star on GitHub</a> or a <a href="${shareUrl}" target="_blank" rel="noopener">share on LinkedIn</a> helps too.</p>
                <p class="support-box-line">${talkLine}</p>
            </div>
        `;
    }

    var supportBoxes = document.querySelectorAll('.support-box');
    for (var b = 0; b < supportBoxes.length; b++) {
        renderSupportBox(supportBoxes[b]);
    }

    // Inject sidebar sponsor CTA on blog posts (desktop only)
    if (isPost) {
        // Guest posts were not tested on my model, so the sidebar says less there
        var isGuestPost = !!document.querySelector('.support-box[data-guest]:not([data-guest="false"])');
        var sidebarText = isGuestPost
            ? 'Five free Power BI tools, built and kept current in my own time.'
            : 'Five free Power BI tools, and every post tested on my own model.';
        var sidebarSponsor = document.createElement('div');
        sidebarSponsor.className = 'sidebar-sponsor';
        sidebarSponsor.innerHTML = `
            <div class="sidebar-sponsor-label">Support my work</div>
            <p class="sidebar-sponsor-text">${sidebarText}</p>
            <a href="${BMC_URL}" target="_blank" rel="noopener" class="sidebar-sponsor-btn sidebar-sponsor-btn--primary">
                <span class="material-symbols-outlined" aria-hidden="true">coffee</span> Buy me a coffee
            </a>
            <a href="${GHS_URL}" target="_blank" rel="noopener" class="sidebar-sponsor-btn sidebar-sponsor-btn--outline">
                <span class="material-symbols-outlined" aria-hidden="true">favorite</span> Sponsor on GitHub
            </a>
        `;
        document.body.appendChild(sidebarSponsor);

        // Hide sidebar sponsor when footer is visible
        var footerEl = document.getElementById('site-footer');
        if (footerEl && window.IntersectionObserver) {
            new IntersectionObserver(function (entries) {
                sidebarSponsor.classList.toggle('hidden', entries[0].isIntersecting);
            }, { threshold: 0 }).observe(footerEl);
        }

        // Inject sidebar partner widget(s) on blog posts (desktop, left side)
        if (window.sponsors.length > 0) {
            window.sponsors.forEach(function (s) {
                var sidebarPartner = document.createElement('a');
                sidebarPartner.className = 'partner-sidebar';
                sidebarPartner.href = s.url;
                sidebarPartner.target = '_blank';
                sidebarPartner.rel = 'noopener';
                sidebarPartner.innerHTML = `
                    <div class="partner-sidebar-label">Partner</div>
                    <img src="${base}${s.sidebarBanner}" alt="${s.name} — ${s.tagline}" loading="lazy">
                `;
                document.body.appendChild(sidebarPartner);

                // Hide when footer is visible
                var footerForPartner = document.getElementById('site-footer');
                if (footerForPartner && window.IntersectionObserver) {
                    new IntersectionObserver(function (entries) {
                        sidebarPartner.classList.toggle('hidden', entries[0].isIntersecting);
                    }, { threshold: 0 }).observe(footerForPartner);
                }
            });

            // Inject inline partner banner after the support box in blog posts
            var supportBoxEl = document.querySelector('.support-box');
            if (supportBoxEl && supportBoxEl.parentNode) {
                var firstSponsor = window.sponsors[0];
                var inlinePartner = document.createElement('a');
                inlinePartner.className = 'partner-inline';
                inlinePartner.href = firstSponsor.url;
                inlinePartner.target = '_blank';
                inlinePartner.rel = 'noopener';
                inlinePartner.innerHTML = `
                    <div class="partner-inline-header">
                        <span class="partner-label">Partner</span>
                        <span class="partner-cta-btn">
                            <span class="material-symbols-outlined">open_in_new</span> Visit
                        </span>
                    </div>
                    <img src="${base}${firstSponsor.brandBanner}" alt="${firstSponsor.name} — ${firstSponsor.tagline}" loading="lazy">
                `;
                supportBoxEl.parentNode.insertBefore(inlinePartner, supportBoxEl.nextSibling);
            }
        }
    }

    // Inject floating pill sponsor on homepage
    if (!isPost && (currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath === '/')) {
        var PILL_DISMISSED_KEY = 'support-pill-dismissed';
        var pillDismissed = false;
        try {
            pillDismissed = window.sessionStorage.getItem(PILL_DISMISSED_KEY) === '1';
        } catch (e) {
            // Storage blocked (private mode, strict settings): the pill just shows
        }

        if (!pillDismissed) {
            var pill = document.createElement('div');
            pill.className = 'sponsor-pill hidden';
            pill.innerHTML = `
                <span class="sponsor-pill-text">Enjoying the posts?</span>
                <a href="${BMC_URL}" target="_blank" rel="noopener" class="sponsor-pill-btn sponsor-pill-btn--primary">
                    <span class="material-symbols-outlined" aria-hidden="true">coffee</span> Buy me a coffee
                </a>
                <a href="${GHS_URL}" target="_blank" rel="noopener" class="sponsor-pill-btn sponsor-pill-btn--outline">
                    <span class="material-symbols-outlined" aria-hidden="true">favorite</span> Sponsor
                </a>
                <button type="button" class="sponsor-pill-close" aria-label="Close">
                    <span class="material-symbols-outlined" aria-hidden="true">close</span>
                </button>
            `;
            document.body.appendChild(pill);

            // Show the pill only after the hero has scrolled out of view, and hide it
            // again while the footer is visible. A missing hero counts as scrolled past.
            var heroEl = document.querySelector('.blog-intro');
            var footerForPill = document.getElementById('site-footer');
            var hasObserver = !!window.IntersectionObserver;
            var heroInView = !!(heroEl && hasObserver);
            var footerInView = false;

            var updatePill = function () {
                pill.classList.toggle('hidden', pillDismissed || heroInView || footerInView);
            };

            pill.querySelector('.sponsor-pill-close').addEventListener('click', function () {
                pillDismissed = true;
                try {
                    window.sessionStorage.setItem(PILL_DISMISSED_KEY, '1');
                } catch (e) {
                    // Storage blocked: the pill stays closed until the next page load
                }
                updatePill();
            });

            if (hasObserver) {
                if (heroEl) {
                    new IntersectionObserver(function (entries) {
                        heroInView = entries[entries.length - 1].isIntersecting;
                        updatePill();
                    }, { threshold: 0 }).observe(heroEl);
                }
                if (footerForPill) {
                    new IntersectionObserver(function (entries) {
                        footerInView = entries[entries.length - 1].isIntersecting;
                        updatePill();
                    }, { threshold: 0 }).observe(footerForPill);
                }
            }
            updatePill();
        }
    }
})();

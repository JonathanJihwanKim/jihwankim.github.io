/**
 * nav.js — Shared top navigation component for powerbimvp.com
 * Injects the site header, mobile nav panel, and search overlay into all pages.
 * Detects whether the page is a blog post (/posts/) or root to set correct asset paths.
 */
(function () {
    var isPost = window.location.pathname.includes('/posts/');
    var base = isPost ? '../' : '';
    var currentPath = window.location.pathname;
    var year = new Date().getFullYear();

    // Determine active nav link
    function isActive(page) {
        if (page === 'blog') return currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath.includes('/posts/');
        if (page === 'about') return currentPath.includes('about');
        if (page === 'tools') return currentPath.includes('tools');
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
                    <span class="footer-sponsor-text">4 free Power BI tools — used by developers worldwide. Your support keeps them updated.</span>
                    <a href="https://github.com/sponsors/JonathanJihwanKim" target="_blank" rel="noopener" class="btn-sponsor">
                        <span class="material-symbols-outlined">volunteer_activism</span> Sponsor
                    </a>
                    <a href="https://buymeacoffee.com/jihwankim" target="_blank" rel="noopener" class="btn-sponsor-outline">
                        <span class="material-symbols-outlined">coffee</span> Buy me a coffee
                    </a>
                </div>`;
        footer.innerHTML = `
            <div class="footer-inner">
                <div class="footer-left">
                    <p class="footer-copyright">&copy; ${year} powerbimvp.com &middot; Jihwan Kim</p>
                    <p class="footer-tagline">Deep technical writing on Power BI, PBIR, DAX, and Microsoft Fabric</p>
                </div>
                ${sponsorHtml}
            </div>
        `;
    }

    // Inject sidebar sponsor CTA on blog posts (desktop only)
    if (isPost) {
        var sidebarSponsor = document.createElement('div');
        sidebarSponsor.className = 'sidebar-sponsor';
        sidebarSponsor.innerHTML = `
            <div class="sidebar-sponsor-label">Support my work</div>
            <p class="sidebar-sponsor-text">4 free Power BI tools — your support keeps them updated.</p>
            <a href="https://github.com/sponsors/JonathanJihwanKim" target="_blank" rel="noopener" class="sidebar-sponsor-btn sidebar-sponsor-btn--primary">
                <span class="material-symbols-outlined">volunteer_activism</span> Sponsor
            </a>
            <a href="https://buymeacoffee.com/jihwankim" target="_blank" rel="noopener" class="sidebar-sponsor-btn sidebar-sponsor-btn--outline">
                <span class="material-symbols-outlined">coffee</span> Buy me a coffee
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
    }

    // Inject floating pill sponsor on homepage
    if (!isPost && (currentPath.endsWith('/') || currentPath.endsWith('/index.html') || currentPath === '/')) {
        var pill = document.createElement('div');
        pill.className = 'sponsor-pill';
        pill.innerHTML = `
            <span class="sponsor-pill-text">Support my free tools</span>
            <a href="https://github.com/sponsors/JonathanJihwanKim" target="_blank" rel="noopener" class="sponsor-pill-btn sponsor-pill-btn--primary">
                <span class="material-symbols-outlined">volunteer_activism</span> Sponsor
            </a>
            <a href="https://buymeacoffee.com/jihwankim" target="_blank" rel="noopener" class="sponsor-pill-btn sponsor-pill-btn--outline">
                <span class="material-symbols-outlined">coffee</span> Buy me a coffee
            </a>
        `;
        document.body.appendChild(pill);

        // Hide pill when footer is visible
        var footerEl = document.getElementById('site-footer');
        if (footerEl && window.IntersectionObserver) {
            new IntersectionObserver(function (entries) {
                pill.classList.toggle('hidden', entries[0].isIntersecting);
            }, { threshold: 0 }).observe(footerEl);
        }
    }
})();

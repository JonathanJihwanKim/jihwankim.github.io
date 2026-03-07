/**
 * sidebar.js — Shared sidebar component for powerbimvp.com
 * Injects the sidebar HTML into <aside id="sidebar"> on all pages.
 * Detects whether the page is a blog post (/posts/) or root to set correct asset paths.
 */
(function () {
    var isPost = window.location.pathname.includes('/posts/');
    var base = isPost ? '../' : '';
    var year = new Date().getFullYear();

    // Search behavior: blog posts redirect to index.html with ?search= param
    // Index page: the inline JS attaches listeners to #search-btn / #sidebar-search
    var searchKeydown = isPost
        ? 'onkeydown="if(event.key===\'Enter\'){window.location.href=\'' + base + 'index.html?search=\'+encodeURIComponent(this.value)}"'
        : '';
    var searchBtnOnclick = isPost
        ? 'onclick="window.location.href=\'' + base + 'index.html?search=\'+encodeURIComponent(document.getElementById(\'sidebar-search\').value)"'
        : '';
    var searchBtnId = isPost ? '' : 'id="search-btn"';

    document.getElementById('sidebar').innerHTML = `
        <div class="sidebar-content">
            <h1 class="name">JIHWAN KIM</h1>

            <p class="title">
                <a href="https://mvp.microsoft.com/en-US/mvp/profile/385eb34e-c755-ed11-9561-000d3a197333" target="_blank" rel="noopener">Microsoft MVP</a> |
                <a href="https://community.fabric.microsoft.com/t5/user/viewprofilepage/user-id/291628" target="_blank" rel="noopener">Power BI &amp; Microsoft Fabric Community Super User</a> |
                Senior Power BI &amp; Microsoft Fabric Architect
            </p>

            <p class="bio">I build enterprise-grade, AI-ready data solutions that delivers faster insights @IKEA</p>

            <div class="links-header">
                <span class="material-symbols-outlined">link</span>
                Links
            </div>
            <div class="links">
                <a href="https://mvp.microsoft.com/en-US/mvp/profile/385eb34e-c755-ed11-9561-000d3a197333" target="_blank" rel="noopener">
                    <span class="icon-wrapper"><img src="${base}images/mvp-icon.png" alt="MVP"></span>
                    Microsoft MVP profile
                </a>
                <a href="https://www.linkedin.com/in/jihwankim1975/" target="_blank" rel="noopener">
                    <span class="icon-wrapper"><img src="${base}images/linkedin-icon.png" alt="LinkedIn"></span>
                    LinkedIn profile
                </a>
                <a href="https://github.com/JonathanJihwanKim/pbip-impact-analyzer" target="_blank" rel="noopener">
                    <span class="icon-wrapper"><span class="material-symbols-outlined" style="font-size:20px;color:var(--primary-500)">analytics</span></span>
                    PBIP Impact Analyzer
                </a>
                <a href="https://github.com/JonathanJihwanKim/isHiddenInViewMode" target="_blank" rel="noopener">
                    <span class="icon-wrapper"><span class="material-symbols-outlined" style="font-size:20px;color:var(--primary-500)">visibility</span></span>
                    PBIR Visual Manager
                </a>
                <a href="https://github.com/JonathanJihwanKim/pbip-documenter" target="_blank" rel="noopener">
                    <span class="icon-wrapper"><span class="material-symbols-outlined" style="font-size:20px;color:var(--primary-500)">description</span></span>
                    PBIP Documenter
                </a>
                <a href="https://jihwanpowerbifabric.wixsite.com/supplychainflow/blog" target="_blank" rel="noopener">
                    <span class="icon-wrapper"><span class="material-symbols-outlined" style="font-size:20px;color:var(--primary-500)">history</span></span>
                    Previous blog - Power BI &amp; Microsoft Fabric
                </a>
            </div>

            <div class="sponsor-links-container">
                <div class="sponsor-links-header">
                    <span class="material-symbols-outlined">favorite</span>
                    Support
                </div>
                <a href="https://buymeacoffee.com/jihwankim" target="_blank" rel="noopener" class="sponsor-link-item">
                    <span class="icon-wrapper"><span class="material-symbols-outlined sponsor-pulse" style="font-size:20px;color:var(--accent-500)">coffee</span></span>
                    Support my free Power BI tools
                </a>
                <a href="https://github.com/sponsors/JonathanJihwanKim" target="_blank" rel="noopener" class="sponsor-link-item">
                    <span class="icon-wrapper"><span class="material-symbols-outlined sponsor-pulse" style="font-size:20px;color:var(--primary-500)">volunteer_activism</span></span>
                    Sponsor on GitHub
                </a>
            </div>

            <div class="blog-description">
                <h2>Insights on Power BI, Microsoft Fabric, and enterprise data solutions</h2>
            </div>

            <div class="search-container">
                <input type="text" id="sidebar-search" placeholder="Search posts..." aria-label="Search blog posts" ${searchKeydown}>
                <button ${searchBtnId} aria-label="Search" ${searchBtnOnclick}>
                    <span class="material-symbols-outlined">search</span>
                </button>
            </div>

            <div class="profile-photos">
                <img src="${base}images/profile-1.jpg" alt="Jihwan Kim" class="profile-photo">
                <img src="${base}images/profile-2.png" alt="Jihwan Kim" class="profile-photo">
            </div>

            <footer class="copyright">
                <p>&copy; ${year} powerbimvp.com | Jihwan Kim</p>
            </footer>
        </div>
    `;
})();

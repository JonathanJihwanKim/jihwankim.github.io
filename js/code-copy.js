/**
 * code-copy.js - Copy button for code blocks in a post
 * Puts the .code-copy-btn styled in article.css into every code block. It copies
 * the full text of the block, including any lines hidden by code-collapse.js.
 */
(function () {
    'use strict';

    var blocks = document.querySelectorAll('.article-content pre');
    if (!blocks.length) return;

    function copyText(text, done) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                done(true);
            }, function () {
                done(fallbackCopy(text));
            });
            return;
        }
        done(fallbackCopy(text));
    }

    function fallbackCopy(text) {
        var area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.top = '-1000px';
        document.body.appendChild(area);
        area.select();
        var ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (e) {
            ok = false;
        }
        document.body.removeChild(area);
        return ok;
    }

    Array.prototype.forEach.call(blocks, function (pre) {
        var code = pre.querySelector('code');
        if (!code) return;

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'code-copy-btn';
        button.setAttribute('aria-label', 'Copy code to clipboard');

        var icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = 'content_copy';
        var label = document.createElement('span');
        label.textContent = 'Copy';
        button.appendChild(icon);
        button.appendChild(label);

        var resetTimer = null;

        button.addEventListener('click', function () {
            copyText(code.textContent, function (ok) {
                button.classList.toggle('copied', ok);
                icon.textContent = ok ? 'check' : 'error';
                label.textContent = ok ? 'Copied' : 'Copy failed';
                if (resetTimer) clearTimeout(resetTimer);
                resetTimer = setTimeout(function () {
                    button.classList.remove('copied');
                    icon.textContent = 'content_copy';
                    label.textContent = 'Copy';
                }, 2000);
            });
        });

        pre.appendChild(button);
    });
})();

/**
 * code-collapse.js - Collapse long code blocks to their first lines
 * Adds a toggle under any pre[data-collapse] in a post. The attribute value is
 * the number of lines shown while collapsed. Without JavaScript the full block
 * is shown, so nothing is ever hidden from a reader.
 */
(function () {
    'use strict';

    var blocks = document.querySelectorAll('.article-content pre[data-collapse]');
    if (!blocks.length) return;

    Array.prototype.forEach.call(blocks, function (pre, index) {
        var code = pre.querySelector('code');
        if (!code) return;

        var visibleLines = parseInt(pre.getAttribute('data-collapse'), 10) || 15;
        var totalLines = code.textContent.replace(/\n+$/, '').split('\n').length;
        if (totalLines <= visibleLines) return;

        var style = window.getComputedStyle(code);
        var lineHeight = parseFloat(style.lineHeight);
        if (isNaN(lineHeight)) {
            lineHeight = parseFloat(style.fontSize) * 1.6;
        }
        var collapsedHeight = Math.round(lineHeight * visibleLines + parseFloat(style.paddingTop));

        if (!pre.id) pre.id = 'code-block-' + (index + 1);

        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-outline code-collapse-toggle';
        button.setAttribute('aria-controls', pre.id);

        var icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.setAttribute('aria-hidden', 'true');
        var label = document.createElement('span');
        button.appendChild(icon);
        button.appendChild(label);

        function collapse() {
            pre.style.maxHeight = collapsedHeight + 'px';
            pre.classList.add('is-collapsed');
            button.setAttribute('aria-expanded', 'false');
            icon.textContent = 'expand_more';
            label.textContent = 'Show all ' + totalLines + ' lines';
        }

        function expand() {
            pre.style.maxHeight = '';
            pre.classList.remove('is-collapsed');
            button.setAttribute('aria-expanded', 'true');
            icon.textContent = 'expand_less';
            label.textContent = 'Show less';
        }

        button.addEventListener('click', function () {
            if (pre.classList.contains('is-collapsed')) {
                expand();
            } else {
                collapse();
                pre.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
        });

        pre.parentNode.insertBefore(button, pre.nextSibling);
        collapse();
    });
})();

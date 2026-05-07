    // ==UserScript==
    // @name         Instagram to Imginn Redirector
    // @namespace    SW5zdGFncmFtIHRvIEltZ2lubiBSZWRpcmVjdG9y
    // @version      1.1
    // @description  Auto redirect Instagram links to Imginn, a privacy-focused viewer
    // @author       Leonidas
    // @license      GPLv3
    // @icon         https://i25.servimg.com/u/f25/11/94/21/24/imginn10.png
    // @match        *://*/*
    // @run-at       document-start
    // @grant        none
    // ==/UserScript==
     
    (function() {
        'use strict';
     
        // --- 1. Handle Direct Navigation to Instagram ---
        if (window.__cpLocation.hostname.includes('instagram.com')) {
            // Use replace() so we don't break the browser's Back button
            // We only keep the pathname (e.g. /p/12345/) to strip out tracking parameters like ?igshid=...
            window.__cpLocation.replace('https://imginn.com' + window.__cpLocation.pathname);
            return; // Stop execution on Instagram domains
        }
     
        // --- 2. High-Performance Link Interceptor (Replaces MutationObserver) ---
        // Instead of scanning the page constantly, we just wait for the user to click a link.
        // If it's an Instagram link, we hijack the click and send them to Imginn.
        window.addEventListener('click', (e) => {
            // Find if the clicked element (or its parent) is a link to Instagram
            const link = e.target.closest('a[href*="instagram.com"]');
            if (!link) return;
     
            try {
                const url = new URL(link.href);
                
                // Ensure it's actually an Instagram domain
                if (url.hostname.includes('instagram.com')) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    e.stopPropagation();
     
                    // Redirect to Imginn using just the path (strips trackers)
                    window.__cpLocation.href = 'https://imginn.com' + url.pathname;
                }
            } catch (err) {
                // Ignore invalid URLs silently
            }
        }, true); // 'true' means capture phase: we intercept it BEFORE the website's own scripts can!
     
        // --- 3. Hover Effect (Optional UX Polish) ---
        // Update the link URL visually when the user hovers over it, so they see where it goes.
        window.addEventListener('mouseover', (e) => {
            const link = e.target.closest('a[href*="instagram.com"]');
            if (!link || link.dataset.imginnRewritten) return;
     
            try {
                const url = new URL(link.href);
                if (url.hostname.includes('instagram.com')) {
                    link.href = 'https://imginn.com' + url.pathname;
                    link.title = (link.title || '') + ' (Redirects to Imginn)';
                    link.dataset.imginnRewritten = 'true'; // Mark as processed
                }
            } catch (err) {}
        }, { passive: true });
     
    })();


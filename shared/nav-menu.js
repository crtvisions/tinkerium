/**
 * Global Navigation Menu
 * Inserts the nav menu into any page and handles toggle functionality
 */

(function() {
    // Create and insert nav HTML
    const navHTML = `
        <div class="nav-dropdown">
            <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation menu">☰</button>
            <nav class="nav-menu" id="navMenu">
                <a href="/" class="nav-link">HOME</a>
                <a href="/tools/code-to-mp4/" class="nav-link">CODE TO MP4</a>
                <a href="/tools/ascii-art/" class="nav-link">ASCII-FY</a>
                <a href="/tools/shader-playground/" class="nav-link">SHADER PLAYGROUND</a>
                <a href="/tools/wave-visualizer/" class="nav-link">WAVE VISUALIZER</a>
            </nav>
        </div>
    `;

    // Insert nav at the beginning of body
    document.addEventListener('DOMContentLoaded', function() {
        document.body.insertAdjacentHTML('afterbegin', navHTML);
        
        // Set up toggle functionality
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const navDropdown = document.querySelector('.nav-dropdown');
                if (navDropdown && !navDropdown.contains(event.target)) {
                    navMenu.classList.remove('active');
                }
            });
        }
    });
})();

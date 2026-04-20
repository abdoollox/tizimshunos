/**
 * TIZIMSHUNOS - LOGIC
 * Pure Vanilla JavaScript. Lightweight, modular, no dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize system indicators
    initSystem();

    // 2. Smooth Scrolling for anchor links (Logical flow)
    initSmoothScroll();

    // 3. System Lock Modal
    initLockTeaser();

    // 4. Dark / Light mode
    initTheme();

    // 5. Easter Egg - Language Troll
    initLangTroll();

    // 6. Mobile Menu
    initMobileMenu();
});

function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mobileNav');

    if (btn && nav) {
        btn.addEventListener('click', () => {
            nav.classList.toggle('active');
            btn.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = nav.querySelectorAll('.nav-link, .btn-secondary, .btn-contact');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                btn.classList.remove('active');
            });
        });
    }
}

function initSystem() {
    // Set current year in footer dynamically
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Developer log to verify script is active structure
    console.log('[System Status]: OK. Logic over everything.');
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initLockTeaser() {
    const modeToggle = document.getElementById('modeToggle');
    const lockModal = document.getElementById('lockModal');
    const closeBtn = document.getElementById('closeModalBtn');
    
    // Select labels gracefully 
    const modeLabels = document.querySelectorAll('.mode-label');
    
    if (modeToggle && lockModal && closeBtn) {
        modeToggle.addEventListener('change', function(e) {
            if (this.checked) {
                // Open modal
                lockModal.classList.add('active');
                
                // Style labels (Observer -> muted, Player -> active)
                if(modeLabels.length >= 2) {
                    modeLabels[0].classList.remove('active');
                    modeLabels[0].classList.add('text-muted');
                    modeLabels[1].classList.add('active');
                    modeLabels[1].classList.remove('text-muted');
                }
            }
        });
        
        closeBtn.addEventListener('click', function() {
            // Revert state back
            modeToggle.checked = false;
            lockModal.classList.remove('active');
            
            if(modeLabels.length >= 2) {
                modeLabels[0].classList.add('active');
                modeLabels[0].classList.remove('text-muted');
                modeLabels[1].classList.remove('active');
                modeLabels[1].classList.add('text-muted');
            }
        });
    }
}

function initTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const iconSun = document.getElementById('themeIconSun');
    const iconMoon = document.getElementById('themeIconMoon');

    if (!btn) return;

    // Restore saved theme; default is 'light'
    const saved = localStorage.getItem('tizimshunos-theme') || 'light';
    applyTheme(saved);

    btn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('tizimshunos-theme', next);
    });

    function applyTheme(theme) {
        html.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            iconSun.style.display = 'block';  // show sun (click to go light)
            iconMoon.style.display = 'none';
            btn.setAttribute('title', 'Light rejimga o\'tish ☀️');
        } else {
            iconSun.style.display = 'none';
            iconMoon.style.display = 'block'; // show moon (click to go dark)
            btn.setAttribute('title', 'Dark rejimga o\'tish 🌙');
        }
    }
}

function initLangTroll() {
    const dropdowns = document.querySelectorAll('.lang-dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggleBtn = dropdown.querySelector('.lang-toggle');
        const options = dropdown.querySelectorAll('.lang-option');
        
        // Toggle menu open/close
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });
        }
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });

        // The troll logic
        const toastMsgs = [
            "🤖 Qo'ysangizchi, meni ham o'zingizni ham qiynamang. Ikkimiz uchun qulay bo'lgan mantiq tilida — o'zbekchada gaplashamiz 😉",
            "⚡ VibeCoding qoidasi: Asl holat eng mukammal holatdir. O'zimizning tilda davom etaylik!",
            "🎯 404 Error: Tarjimon kofe ichgani ketdi. Keling o'zbekchada gaplashamiz.",
            "✨ Tilni o'zgartirish o'rniga, keling logikani o'zgartiramiz... hazil, o'zbekchada qolaqolsin!"
        ];
        let msgIndex = 0;

        options.forEach(opt => {
            opt.addEventListener('click', function() {
                // Close menu
                dropdown.classList.remove('open');
                
                // Show toast
                showToast(toastMsgs[msgIndex]);
                msgIndex = (msgIndex + 1) % toastMsgs.length;
            });
        });
    });

    function showToast(message) {
        let container = document.querySelector('.vibe-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'vibe-toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'vibe-toast';
        toast.innerText = message;
        
        container.appendChild(toast);

        // Remove toast smoothly
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }
}

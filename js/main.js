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

    // 7. Skill Gamification
    initSkillGamification();
});

function initSkillGamification() {
    const cards = document.querySelectorAll('.skill-card');
    
    cards.forEach(card => {
        const core = card.querySelector('.draggable-core');
        const lane = card.querySelector('.interaction-lane');
        const socket = card.querySelector('.socket-target');
        const animBox = card.querySelector('.skill-animation-box');
        const skillId = card.getAttribute('data-skill');
        const activeColor = core.getAttribute('data-color');

        if (!core || !lane) return;

        // Store initial state for deactivation
        const initialAnimContent = animBox.innerHTML;

        let isDragging = false;
        let startX = 0;
        let currentX = 0;
        let maxDelta = 0;

        core.addEventListener('pointerdown', (e) => {
            if (card.classList.contains('activated')) return;
            isDragging = true;
            maxDelta = lane.offsetWidth - core.offsetWidth - 16;
            startX = e.clientX - currentX;
            core.setPointerCapture(e.pointerId);
            core.style.transition = 'none';
        });

        window.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            
            let x = e.clientX - startX;
            x = Math.max(0, Math.min(x, maxDelta));
            currentX = x;
            core.style.transform = `translateX(${currentX}px)`;

            // Check if close to socket
            if (currentX > maxDelta * 0.9) {
                socket.style.transform = 'scale(1.2)';
                socket.style.borderColor = activeColor;
            } else {
                socket.style.transform = 'scale(1)';
                socket.style.borderColor = '';
            }
        });

        window.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            isDragging = false;

            if (currentX > maxDelta * 0.85) {
                // SUCCESS: Connect
                activateSkill(card, skillId, activeColor, animBox);
            } else {
                // FAIL: Snap back
                core.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                currentX = 0;
                core.style.transform = `translateX(0px)`;
                socket.style.transform = 'scale(1)';
            }
        });

        // DEACTIVATION: Click on socket to reset
        socket.addEventListener('click', () => {
            if (card.classList.contains('activated')) {
                deactivateSkill(card, initialAnimContent, core);
            }
        });

        function deactivateSkill(card, initialHtml, core) {
            animBox.style.transition = 'opacity 0.4s ease';
            animBox.style.opacity = '0';
            
            setTimeout(() => {
                card.classList.remove('activated');
                card.style.boxShadow = '';
                animBox.innerHTML = initialHtml;
                animBox.style.opacity = '1';
                
                // Animate core sliding back
                core.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                core.style.opacity = '1';
                core.style.pointerEvents = 'auto';
                currentX = 0;
                core.style.transform = `translateX(0px)`;
                
                socket.style.transform = 'scale(1)';
                socket.style.borderColor = '';
            }, 300);
        }
    });

    function activateSkill(card, id, color, animBox) {
        card.classList.add('activated');
        card.style.setProperty('--active-color', color);
        // Instant visual change for "activated" state of core via CSS
        // but let's sync the JS currentX
        card.style.boxShadow = `0 20px 50px -10px ${color}33`;

        // Trigger specific animations
        if (id === 'sort') {
            animBox.innerHTML = `
                <div style="display:flex; gap:8px;">
                    ${[1,2,3,4,5].map(i => `<div style="width:24px; height:24px; background:${color}; border-radius:4px; display:flex; align-items:center; justify-content:center; color:white; font-size:10px; font-weight:bold; animation: slideIn 0.3s ${i*0.1}s both;">${i}</div>`).join('')}
                </div>
                <style>
                    @keyframes slideIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
                </style>
            `;
        } else if (id === 'explain') {
            animBox.innerHTML = `
                <div style="position:relative; display:flex; align-items:center; justify-content:center; width:100%; height:100%;">
                    <div style="font-size:2.5rem; font-weight:900; color:${color}; text-shadow:0 0 20px ${color}80; animation: clarityPulse 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;">!</div>
                </div>
                <style>
                    @keyframes clarityPulse { 
                        0% { transform: scale(0) rotate(-45deg); opacity:0; } 
                        100% { transform: scale(1) rotate(0); opacity:1; } 
                    }
                </style>
            `;
        } else if (id === 'create') {
            animBox.innerHTML = `
                <div id="particle-container-${id}" style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
                    <div style="width:12px; height:12px; background:${color}; border-radius:50%; box-shadow:0 0 30px ${color};"></div>
                </div>
            `;
            // Simple Particle Burst Logic
            const container = animBox.querySelector('div');
            for(let i=0; i<12; i++) {
                const p = document.createElement('div');
                const angle = (i / 12) * Math.PI * 2;
                const dist = 30 + Math.random() * 20;
                p.style.cssText = `
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: ${color};
                    border-radius: 50%;
                    opacity: 0;
                    transform: translate(0, 0);
                    animation: burst-${id} 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    animation-delay: ${Math.random() * 0.2}s;
                `;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                
                const styleSheet = document.createElement('style');
                styleSheet.innerHTML = `
                    @keyframes burst-${id} {
                        0% { transform: translate(0,0) scale(1); opacity:1; }
                        100% { transform: translate(${tx}px, ${ty}px) scale(0); opacity:0; }
                    }
                `;
                document.head.appendChild(styleSheet);
                container.appendChild(p);
            }
        }
    }
}


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

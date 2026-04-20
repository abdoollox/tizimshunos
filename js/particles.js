/**
 * PARTICLE SYSTEM ENGINE
 * Chaos (OFFLINE) ↔ Order (ONLINE) animation
 * Canvas API + requestAnimationFrame — GPU-accelerated
 */
(function () {
    'use strict';

    const PARTICLE_COUNT = 150;
    const GRID_SPACING = 40;
    const TRANSITION_DURATION = 1200; // ms

    // Easing: cubic-bezier(0.16, 1, 0.3, 1)
    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    // --- DOM Elements ---
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    const avatarTrigger = document.getElementById('avatarTrigger');
    const avatarContainer = document.getElementById('avatarContainer');
    const gridOverlay = document.getElementById('gridOverlay');
    const restOfPage = document.getElementById('restOfPage');
    const aboutSection = document.getElementById('about');

    if (!canvas || !avatarTrigger) return;

    let W, H;
    let isOnline = false;
    let transitionStart = null;
    let animationId = null;

    // --- Particle Class ---
    class Particle {
        constructor(index) {
            this.index = index;
            this.radius = 1.5 + Math.random() * 1.5;
            this.opacity = 0.15 + Math.random() * 0.35;

            // Chaos state: random positions and velocities
            this.x = 0;
            this.y = 0;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;

            // Grid target (calculated later)
            this.gridX = 0;
            this.gridY = 0;

            // Transition tracking
            this.startX = 0;
            this.startY = 0;
        }

        randomize(w, h) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
        }
    }

    // --- Build particles ---
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(i));
    }

    // --- Resize handler ---
    function resize() {
        const section = canvas.parentElement;
        W = section.offsetWidth;
        H = section.offsetHeight;
        canvas.width = W * window.devicePixelRatio;
        canvas.height = H * window.devicePixelRatio;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

        // Redistribute chaos positions
        particles.forEach(p => p.randomize(W, H));

        // Calculate grid positions
        calculateGrid();
    }

    function calculateGrid() {
        // Match CSS grid (40px squares starting from 0,0)
        // We want dots in the CENTER of squares (20, 20 offset)
        const cols = Math.ceil(W / GRID_SPACING);
        const rows = Math.ceil(H / GRID_SPACING);
        
        const totalSlots = cols * rows;

        particles.forEach((p, i) => {
            if (i < totalSlots) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                p.gridX = col * GRID_SPACING + (GRID_SPACING / 2);
                p.gridY = row * GRID_SPACING + (GRID_SPACING / 2);
            } else {
                // Extra particles (if any)
                p.gridX = (Math.floor(Math.random() * cols)) * GRID_SPACING + (GRID_SPACING / 2);
                p.gridY = (Math.floor(Math.random() * rows)) * GRID_SPACING + (GRID_SPACING / 2);
            }
        });
    }

    // --- Render Loop ---
    function render() {
        ctx.clearRect(0, 0, W, H);

        const now = performance.now();
        let progress = 0;

        if (transitionStart !== null) {
            const elapsed = now - transitionStart;
            progress = Math.min(elapsed / TRANSITION_DURATION, 1);
            progress = easeOutExpo(progress);

            if (elapsed >= TRANSITION_DURATION) {
                transitionStart = null;
            }
        }

        // Get current theme for particle color
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const baseColor = isDark ? '255, 255, 255' : '0, 0, 0';
        const blueColor = '59, 130, 246';

        particles.forEach(p => {
            let drawX, drawY, drawOpacity, drawRadius, color;

            if (isOnline) {
                // Transitioning TO grid or already at grid
                if (transitionStart !== null) {
                    drawX = p.startX + (p.gridX - p.startX) * progress;
                    drawY = p.startY + (p.gridY - p.startY) * progress;
                } else {
                    drawX = p.gridX;
                    drawY = p.gridY;
                }
                drawOpacity = 0.12 + 0.08 * progress;
                drawRadius = 1.5;
                color = blueColor;
            } else {
                // Transitioning TO chaos or already chaotic
                if (transitionStart !== null) {
                    const targetX = p.x;
                    const targetY = p.y;
                    drawX = p.startX + (targetX - p.startX) * progress;
                    drawY = p.startY + (targetY - p.startY) * progress;
                } else {
                    // Free-floating chaos
                    p.x += p.vx;
                    p.y += p.vy;

                    // Wrap around edges
                    if (p.x < 0) p.x = W;
                    if (p.x > W) p.x = 0;
                    if (p.y < 0) p.y = H;
                    if (p.y > H) p.y = 0;

                    drawX = p.x;
                    drawY = p.y;
                }
                drawOpacity = p.opacity;
                drawRadius = p.radius;
                color = baseColor;
            }

            ctx.beginPath();
            ctx.arc(drawX, drawY, drawRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${drawOpacity})`;
            ctx.fill();
        });

        animationId = requestAnimationFrame(render);
    }

    // --- Toggle handler ---
    function toggleSystem() {
        isOnline = !isOnline;

        // Save current positions as start for transition
        particles.forEach(p => {
            if (isOnline) {
                p.startX = p.x;
                p.startY = p.y;
            } else {
                p.startX = p.gridX;
                p.startY = p.gridY;
                // Set new random chaos targets
                p.x = Math.random() * W;
                p.y = Math.random() * H;
            }
        });

        transitionStart = performance.now();

        // Update UI
        if (avatarContainer) avatarContainer.classList.toggle('system-on', isOnline);
        gridOverlay.classList.toggle('visible', isOnline);

        // Progressive Reveal Logic
        if (isOnline) {
            document.body.classList.add('system-activated');
            if (aboutSection) aboutSection.classList.add('system-active');
            if (restOfPage) {
                restOfPage.style.display = 'block';
                // Small delay to allow display:block to take effect before opacity transition
                setTimeout(() => {
                    restOfPage.classList.add('is-visible');
                }, 50);
            }
        }
    }

    // --- Init ---
    avatarTrigger.addEventListener('click', toggleSystem);
    
    // Keyboard support for accessibility
    avatarTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleSystem();
        }
    });

    window.addEventListener('resize', resize);

    resize();
    render();
})();

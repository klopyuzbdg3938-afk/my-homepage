/* ==========================================================================
   GSUUX | Interactive Logic & Fluid Water-Gold Canvas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initThemeToggle();
    initEnergySimulatorGame();
    initLetterCards();
    initMouseWaterRipples();
});

/* Global Water Wave Trigger Array for Ambient Canvas */
let spawnCanvasWaterWave = null;

/* Interactive Mouse Water Ripple Listener (点击触发 Canvas 极简水气折射水波) */
function initMouseWaterRipples() {
    document.addEventListener('click', (e) => {
        // Avoid ripples on interactive buttons, links, or canvas game
        if (e.target.closest('button, a, input, canvas#simulator-canvas')) return;

        if (spawnCanvasWaterWave) {
            spawnCanvasWaterWave(e.clientX, e.clientY);
        }
    });
}

/* --------------------------------------------------------------------------
   1. Mysterious Breathing Starfield & Interactive Fluid Gravity Engine
      - Gravitational Particle Convergence (点击周围粒子瞬时聚拢 & 漩涡引力)
      - Starlight Splash Micro-Burst (星水爆破溅散特效)
      - Dynamic Organic Water Waves (晶莹水波引力光环)
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Canvas size initialization strictly OUTSIDE animation loop
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize listener strictly OUTSIDE animation loop
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const activeWaterWaves = [];
    const gravityPulses = [];
    const splashParticles = [];

    // Register global click trigger
    spawnCanvasWaterWave = function(clickX, clickY) {
        // 1. Gravitational Pulse (引力漩涡): Pull all nearby particles within 380px toward (clickX, clickY)
        gravityPulses.push({
            x: clickX,
            y: clickY,
            radius: 380,
            life: 28 // 28 animation frames of gravitational pull
        });

        // 2. Liquid Sparkle Splash Particles (星水爆破溅散粒子 18 颗 - 丰富颜光系)
        const splashColors = ['#FFF4D0', '#DFB76C', '#E5C185', '#60A5FA', '#93C5FD', '#3B82F6'];
        for (let k = 0; k < 18; k++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4.2 + 1.2;
            splashParticles.push({
                x: clickX,
                y: clickY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 2.0 + 0.8,
                color: splashColors[Math.floor(Math.random() * splashColors.length)],
                alpha: 0.98,
                decay: Math.random() * 0.028 + 0.018
            });
        }

        // 3. Shockwave Water Ring (灵动引力水波光环)
        activeWaterWaves.push({ x: clickX, y: clickY, radius: 2, maxRadius: 220, alpha: 0.65, speed: 4.0, delay: 0 });
        activeWaterWaves.push({ x: clickX, y: clickY, radius: 0, maxRadius: 170, alpha: 0.45, speed: 3.2, delay: 4 });
    };

    const particleCount = 360; // 360 Master 3D Parallax Multi-Tiered Starfield Nodes
    const particles = [];

    // Rich Imperial Gold Spectrum & Royal Lapis Lazuli / Sapphire Blue Spectrum
    const goldColors = ['#FFF4D0', '#E5C185', '#DFB76C', '#C89B45', '#9A7732'];
    const blueColors = ['#E0F2FE', '#93C5FD', '#60A5FA', '#2563EB', '#1D4ED8'];

    for (let i = 0; i < particleCount; i++) {
        const isGold = Math.random() > 0.45;
        const colorPalette = isGold ? goldColors : blueColors;

        // 4-Tiered 3D Depth Parallax Hierarchy:
        // Tier 4: Dewdrop (30 particles)
        // Tier 3: Foreground Bright Stars (70 particles)
        // Tier 2: Midground Star Dust (120 particles)
        // Tier 1: Deep Space Dust (140 particles)
        const isDewdrop = i >= 330;
        const isForeground = i < 70;
        const isMidground = i >= 70 && i < 190;
        const isDeepSpace = i >= 190 && i < 330;

        const color = isDewdrop ? (Math.random() > 0.5 ? '#93C5FD' : '#60A5FA') : colorPalette[Math.floor(Math.random() * colorPalette.length)];

        let radius, baseAlpha, pulseSpeed, vx, vy;

        if (isDewdrop) {
            radius = Math.random() * 1.4 + 1.1;
            baseAlpha = Math.random() * 0.25 + 0.55;
            pulseSpeed = Math.random() * 0.01 + 0.005;
            vx = 0;
            vy = Math.random() * 0.28 + 0.18;
        } else if (isForeground) {
            radius = Math.random() * 1.3 + 1.3; // 1.3px ~ 2.6px
            baseAlpha = Math.random() * 0.35 + 0.50;
            pulseSpeed = Math.random() * 0.022 + 0.01;
            vx = (Math.random() - 0.5) * 0.22;
            vy = (Math.random() - 0.5) * 0.22 - 0.01;
        } else if (isMidground) {
            radius = Math.random() * 0.6 + 0.8; // 0.8px ~ 1.4px
            baseAlpha = Math.random() * 0.25 + 0.28;
            pulseSpeed = Math.random() * 0.012 + 0.005;
            vx = (Math.random() - 0.5) * 0.10;
            vy = (Math.random() - 0.5) * 0.10;
        } else {
            // Deep Space Dust (微弱幽微远景)
            radius = Math.random() * 0.4 + 0.3; // 0.3px ~ 0.7px
            baseAlpha = Math.random() * 0.15 + 0.08;
            pulseSpeed = Math.random() * 0.006 + 0.002;
            vx = (Math.random() - 0.5) * 0.04;
            vy = (Math.random() - 0.5) * 0.04;
        }

        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: radius,
            color: color,
            baseAlpha: baseAlpha,
            pulseSpeed: pulseSpeed,
            pulsePhase: Math.random() * Math.PI * 2,
            isForeground: isForeground,
            isMidground: isMidground,
            isDeepSpace: isDeepSpace,
            isDewdrop: isDewdrop,
            baseVx: vx,
            baseVy: vy,
            vx: vx,
            vy: vy
        });
    }

    function render() {
        requestAnimationFrame(render);

        // Clear canvas with pitch black (#000000) - Clean night sky
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Process Gravitational Pulses (计算点击处粒子聚拢引力 - 具视差物理拉力)
        for (let g = gravityPulses.length - 1; g >= 0; g--) {
            const pulse = gravityPulses[g];
            pulse.life--;
            if (pulse.life <= 0) {
                gravityPulses.splice(g, 1);
                continue;
            }

            for (let i = 0; i < particleCount; i++) {
                const p = particles[i];
                const dx = pulse.x - p.x;
                const dy = pulse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < pulse.radius && dist > 5) {
                    // Parallax force: Foreground particles accelerate faster than deep space particles
                    const depthFactor = p.isForeground ? 0.55 : (p.isMidground ? 0.35 : 0.18);
                    const force = (1 - dist / pulse.radius) * depthFactor;
                    p.vx += (dx / dist) * force;
                    p.vy += (dy / dist) * force;
                    p.baseAlpha = Math.min(0.96, p.baseAlpha + 0.04);
                }
            }
        }

        // Render Starfield Particles
        for (let i = 0; i < particleCount; i++) {
            const p = particles[i];

            // Peaceful slow drift with 3D depth parallax & smooth velocity restoration
            p.x += p.vx;
            p.y += p.vy;
            p.vx += (p.baseVx - p.vx) * 0.05;
            p.vy += (p.baseVy - p.vy) * 0.05;

            // Screen boundary wrapping
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;

            // Asynchronous Sine-Wave Twinkling (多层级呼吸闪烁)
            p.pulsePhase += p.pulseSpeed;
            const amp = p.isForeground ? 0.42 : (p.isMidground ? 0.24 : 0.12);
            const currentAlpha = p.baseAlpha + Math.sin(p.pulsePhase) * amp;
            const clampAlpha = Math.max(0.05, Math.min(0.98, currentAlpha));

            // Draw glowing star node with depth-adjusted shadowBlur
            ctx.save();
            ctx.globalAlpha = clampAlpha;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = p.isForeground ? p.radius * 4.5 : (p.isMidground ? p.radius * 2.0 : 0);
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Render Starlight Splash Particles (点击微特效 星水点爆溅散)
        for (let s = splashParticles.length - 1; s >= 0; s--) {
            const sp = splashParticles[s];
            sp.x += sp.vx;
            sp.y += sp.vy;
            sp.vx *= 0.92;
            sp.vy *= 0.92;
            sp.alpha -= sp.decay;

            if (sp.alpha <= 0) {
                splashParticles.splice(s, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, sp.alpha);
            ctx.fillStyle = sp.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = sp.color;
            ctx.beginPath();
            ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Render Canvas Organic Liquid Water Waves (极薄晶莹水丝)
        for (let w = activeWaterWaves.length - 1; w >= 0; w--) {
            const wave = activeWaterWaves[w];
            if (wave.delay > 0) {
                wave.delay--;
                continue;
            }

            wave.radius += wave.speed;
            wave.alpha *= 0.955; // Smooth liquid decay

            if (wave.alpha < 0.01 || wave.radius >= wave.maxRadius) {
                activeWaterWaves.splice(w, 1);
                continue;
            }

            const lineProgress = wave.radius / wave.maxRadius;
            const lineWidth = Math.max(0.4, (1 - lineProgress) * 1.4);

            ctx.save();
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = `rgba(147, 197, 253, ${wave.alpha * 0.6})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(96, 165, 250, 0.5)';
            ctx.stroke();

            // Inner subtle refraction wave
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, Math.max(0, wave.radius * 0.97 - 2), 0, Math.PI * 2);
            ctx.lineWidth = lineWidth * 0.6;
            ctx.strokeStyle = `rgba(223, 183, 108, ${wave.alpha * 0.4})`;
            ctx.stroke();
            ctx.restore();
        }
    }

    render();
}

/* --------------------------------------------------------------------------
   2. Theme Toggle (Gold-Water Balance Modes)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    const themes = ['theme-balance', 'theme-water', 'theme-gold'];
    let currentThemeIdx = 0;

    themeBtn.addEventListener('click', () => {
        document.body.classList.remove(...themes);
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        const newTheme = themes[currentThemeIdx];
        document.body.classList.add(newTheme);

        // Feedback toast
        let themeName = '金水相涵 (平衡)';
        if (newTheme === 'theme-water') themeName = '凝水澄澈 (养润)';
        if (newTheme === 'theme-gold') themeName = '耀金充盈 (坚致)';

        showToast(`气场已切换至：${themeName}`);
    });
}

/* --------------------------------------------------------------------------
   3. Interactive Sci-Fi Energy Resonator Physics Simulator Game
   -------------------------------------------------------------------------- */
function initEnergySimulatorGame() {
    const canvas = document.getElementById('game-simulator-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const container = document.getElementById('simulator-container');
    const waterBar = document.getElementById('hud-water-bar');
    const waterNum = document.getElementById('hud-water-num');
    const goldBar = document.getElementById('hud-gold-bar');
    const goldNum = document.getElementById('hud-gold-num');
    const scoreVal = document.getElementById('hud-score-val');
    const victoryBanner = document.getElementById('victory-banner');
    const simHint = document.getElementById('sim-hint');

    let width = (canvas.width = container.clientWidth);
    let height = (canvas.height = container.clientHeight);

    window.addEventListener('resize', () => {
        if (!container) return;
        width = canvas.width = container.clientWidth;
        height = canvas.height = container.clientHeight;
    });

    // Audio synthesizer for crystal chimes using Web Audio API (with throttling to prevent audio distortion)
    let audioCtx = null;
    let lastChimeTime = 0;
    function playChime(freq = 587, type = 'sine') {
        const now = Date.now();
        if (now - lastChimeTime < 70) return; // Throttle chime audio
        lastChimeTime = now;
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.25);
        } catch (e) {}
    }

    // Game State
    let waterCap = 25.0; // 0 to 100
    let goldCap = 25.0;  // 0 to 100
    let score = 480;
    let mode = 'magnet'; // 'magnet' or 'repel'
    let isVictory = false;

    // Control Buttons Setup
    const btnMagnet = document.getElementById('btn-mode-magnet');
    const btnRepel = document.getElementById('btn-mode-repel');
    const btnFillFull = document.getElementById('btn-fill-full');
    const btnReset = document.getElementById('btn-reset-sim');

    if (btnMagnet) {
        btnMagnet.addEventListener('click', () => {
            mode = 'magnet';
            btnMagnet.classList.add('active');
            btnRepel.classList.remove('active');
            showToast('已切换至：引擎引流模式');
        });
    }

    if (btnRepel) {
        btnRepel.addEventListener('click', () => {
            mode = 'repel';
            btnRepel.classList.add('active');
            btnMagnet.classList.remove('active');
            showToast('已切换至：协作脉冲模式');
        });
    }

    if (btnFillFull) {
        btnFillFull.addEventListener('click', () => {
            waterCap = 100;
            goldCap = 100;
            score += 1000;
            updateHUD();
            triggerVictory();
            showToast('⚡【全网激活】社区协作效能达到 100%！');
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            waterCap = 10;
            goldCap = 10;
            score = 100;
            isVictory = false;
            if (victoryBanner) victoryBanner.classList.remove('active');
            updateHUD();
            showToast('已重置协作沙盘');
        });
    }

    // Update HUD
    function updateHUD() {
        if (waterBar) waterBar.style.width = `${waterCap}%`;
        if (waterNum) waterNum.textContent = `${waterCap.toFixed(1)}%`;
        if (goldBar) goldBar.style.width = `${goldCap}%`;
        if (goldNum) goldNum.textContent = `${goldCap.toFixed(1)}%`;
        if (scoreVal) scoreVal.textContent = `${String(Math.floor(score)).padStart(4, '0')} PTS`;

        if (waterCap >= 100 && goldCap >= 100 && !isVictory) {
            triggerVictory();
        }
    }

    function triggerVictory() {
        isVictory = true;
        if (victoryBanner) victoryBanner.classList.add('active');

        // Play chord
        playChime(523);
        setTimeout(() => playChime(659), 100);
        setTimeout(() => playChime(783), 200);
        setTimeout(() => playChime(1046), 350);

        // Massive splash particles
        for (let i = 0; i < 35; i++) {
            splashes.push({
                x: width * 0.36,
                y: height - 60,
                vx: (Math.random() - 0.5) * 12,
                vy: -Math.random() * 10 - 2,
                color: '#38BDF8',
                radius: Math.random() * 4 + 2,
                life: 1.0
            });
            splashes.push({
                x: width * 0.64,
                y: height - 60,
                vx: (Math.random() - 0.5) * 12,
                vy: -Math.random() * 10 - 2,
                color: '#D4AF37',
                radius: Math.random() * 4 + 2,
                life: 1.0
            });
        }
    }

    // Mouse Tracking
    let mouse = { x: -1000, y: -1000, active: false };
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
        if (simHint) simHint.classList.add('fade-out');
    });

    container.addEventListener('mouseleave', () => {
        mouse.active = false;
    });

    // Touch support
    function handleTouch(e) {
        if (e.touches && e.touches.length > 0) {
            const rect = container.getBoundingClientRect();
            mouse.x = e.touches[0].clientX - rect.left;
            mouse.y = e.touches[0].clientY - rect.top;
            mouse.active = true;
            if (simHint) simHint.classList.add('fade-out');
        }
    }

    container.addEventListener('touchstart', handleTouch, { passive: true });
    container.addEventListener('touchmove', handleTouch, { passive: true });
    container.addEventListener('touchend', () => {
        mouse.active = false;
    });

    // Desktop High-Performance Particle System
    const particleMax = 40;
    const particles = [];
    const splashes = [];

    let isSimVisible = true;
    let animFrameId = null;

    if ('IntersectionObserver' in window && container) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isSimVisible = entry.isIntersecting;
                if (isSimVisible && !animFrameId) {
                    loop();
                }
            });
        }, { threshold: 0.05 });
        observer.observe(container);
    }

    const waterLabels = ["共居", "助餐", "监测", "陪聊"];
    const goldLabels = ["时间", "客厅", "志愿", "公约"];

    function spawnParticle() {
        if (particles.length >= particleMax) return;
        const type = Math.random() > 0.5 ? 'water' : 'gold';
        const labelList = type === 'water' ? waterLabels : goldLabels;
        const symbolStr = labelList[Math.floor(Math.random() * labelList.length)];

        particles.push({
            x: Math.random() * width,
            y: -15,
            type: type,
            color: type === 'water' ? '#38BDF8' : '#D4AF37',
            radius: Math.random() * 3 + 14,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.5 + 1.2,
            symbol: symbolStr
        });
    }

    // Main Loop
    function loop() {
        if (!isSimVisible) {
            animFrameId = null;
            return;
        }
        animFrameId = requestAnimationFrame(loop);
        ctx.clearRect(0, 0, width, height);

        // 1. Draw Grid Lines
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        ctx.restore();

        // 2. Define Dual U Vessels
        const uLeft = { x: width * 0.36, y: height - 120, w: 90, h: 100 };
        const uRight = { x: width * 0.64, y: height - 120, w: 90, h: 100 };

        function drawUVessel(vessel, fillPercent, color, label) {
            ctx.save();
            const fillH = (vessel.h - 10) * (fillPercent / 100);

            // Liquid Fill
            if (fillH > 0) {
                ctx.fillStyle = color === 'water' ? 'rgba(56, 189, 248, 0.35)' : 'rgba(212, 175, 55, 0.35)';
                ctx.shadowBlur = 20;
                ctx.shadowColor = color === 'water' ? '#38BDF8' : '#D4AF37';

                ctx.beginPath();
                const startY = vessel.y + vessel.h - fillH;
                ctx.rect(vessel.x - vessel.w / 2 + 6, startY, vessel.w - 12, fillH);
                ctx.fill();
            }

            // U Outline
            ctx.strokeStyle = color === 'water' ? '#38BDF8' : '#D4AF37';
            ctx.lineWidth = 4;
            ctx.shadowBlur = 15;
            ctx.shadowColor = color === 'water' ? '#38BDF8' : '#D4AF37';

            ctx.beginPath();
            ctx.moveTo(vessel.x - vessel.w / 2, vessel.y);
            ctx.lineTo(vessel.x - vessel.w / 2, vessel.y + vessel.h - 25);
            ctx.quadraticCurveTo(
                vessel.x - vessel.w / 2, vessel.y + vessel.h,
                vessel.x, vessel.y + vessel.h
            );
            ctx.quadraticCurveTo(
                vessel.x + vessel.w / 2, vessel.y + vessel.h,
                vessel.x + vessel.w / 2, vessel.y + vessel.h - 25
            );
            ctx.lineTo(vessel.x + vessel.w / 2, vessel.y);
            ctx.stroke();

            // Label
            ctx.fillStyle = '#94A3B8';
            ctx.font = '12px "Noto Serif SC", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, vessel.x, vessel.y + vessel.h + 20);

            // U Symbol inside
            ctx.fillStyle = color === 'water' ? '#BAE6FD' : '#FCE896';
            ctx.font = 'bold 22px "Cinzel", serif';
            ctx.fillText('U', vessel.x, vessel.y + vessel.h / 2 + 6);

            ctx.restore();
        }

        drawUVessel(uLeft, waterCap, 'water', '【左 U 樽 - 社区资源共享率】');
        drawUVessel(uRight, goldCap, 'gold', '【右 U 樽 - 邻里互助响应度】');

        // 3. Gravitational Cursor Ring
        if (mouse.active) {
            ctx.save();
            ctx.strokeStyle = mode === 'magnet' ? 'rgba(56, 189, 248, 0.6)' : 'rgba(251, 113, 133, 0.6)';
            ctx.fillStyle = mode === 'magnet' ? 'rgba(56, 189, 248, 0.08)' : 'rgba(251, 113, 133, 0.08)';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);

            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 65, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Dot
            ctx.fillStyle = mode === 'magnet' ? '#38BDF8' : '#FB7185';
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // 4. Update Particles
        if (Math.random() < 0.12) spawnParticle();

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];

            p.vy += 0.035; // Gravity
            p.vx *= 0.96;  // Viscous fluid air resistance
            p.vy *= 0.98;

            if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 140 && dist > 1) {
                    const force = (140 - dist) / 140;
                    if (mode === 'magnet') {
                        p.vx += (dx / dist) * force * 0.85;
                        p.vy += (dy / dist) * force * 0.85;
                    } else {
                        p.vx -= (dx / dist) * force * 1.4;
                        p.vy -= (dy / dist) * force * 1.4;
                    }
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            // Render Particle
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 14;
            ctx.shadowColor = p.color;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // 2-Character Chinese Label Text
            ctx.fillStyle = '#0B0E14';
            ctx.font = 'bold 11px "Noto Serif SC", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.symbol, p.x, p.y);
            ctx.restore();

            // Collision check with Left/Right U vessels (Precise Boundary)
            let absorbed = false;

            if (Math.abs(p.x - uLeft.x) < (uLeft.w / 2 + 5) && p.y >= (uLeft.y - 10) && p.y <= (uLeft.y + uLeft.h)) {
                absorbed = true;
                if (p.type === 'water') {
                    waterCap = Math.min(100, waterCap + 2.5);
                    score += 30;
                    playChime(600 + Math.random() * 200);
                } else {
                    goldCap = Math.min(100, goldCap + 1.0);
                    score += 15;
                    playChime(500);
                }
            }

            if (Math.abs(p.x - uRight.x) < (uRight.w / 2 + 5) && p.y >= (uRight.y - 10) && p.y <= (uRight.y + uRight.h)) {
                absorbed = true;
                if (p.type === 'gold') {
                    goldCap = Math.min(100, goldCap + 2.5);
                    score += 30;
                    playChime(800 + Math.random() * 200);
                } else {
                    waterCap = Math.min(100, waterCap + 1.0);
                    score += 15;
                    playChime(650);
                }
            }

            if (absorbed) {
                for (let s = 0; s < 8; s++) {
                    splashes.push({
                        x: p.x,
                        y: p.y,
                        vx: (Math.random() - 0.5) * 7,
                        vy: -Math.random() * 5 - 1.5,
                        color: p.color,
                        radius: Math.random() * 3.5 + 1,
                        life: 1.0
                    });
                }
                updateHUD();
                particles.splice(i, 1);
                continue;
            }

            if (p.y > height + 20 || p.x < -30 || p.x > width + 30) {
                particles.splice(i, 1);
            }
        }

        // 5. Render Splashes
        for (let i = splashes.length - 1; i >= 0; i--) {
            const s = splashes[i];
            s.x += s.vx;
            s.y += s.vy;
            s.life -= 0.04;

            ctx.save();
            ctx.globalAlpha = Math.max(0, s.life);
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            if (s.life <= 0) splashes.splice(i, 1);
        }
    }

    loop();
}

/* --------------------------------------------------------------------------
   4. Letter Cards Interactivity
   -------------------------------------------------------------------------- */
function initLetterCards() {
    const cards = document.querySelectorAll('.letter-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            cards.forEach((c) => c.classList.remove('active-card'));
            card.classList.add('active-card');
            
            const letter = card.getAttribute('data-letter');
            showToast(`已聚焦意境：[${letter.toUpperCase()}]`);
        });
    });
}

/* --------------------------------------------------------------------------
   5. Articles & Insights Modal
   -------------------------------------------------------------------------- */
const articleData = {
    1: {
        category: '智慧养老 & 共享共同体',
        title: '当科技遇见银发：如何用数字温情重塑共享养老？',
        date: '2026-07-19',
        content: `
            <p><strong>前言：</strong>在现代老龄化社会中，养老不应当被局限于单一的“照料”，而是一种尊严、陪伴与自主生活方式的延伸。GSUUX 共享养老课题旨在探索如何用现代化轻量科技，打造兼具独立性与社交温情的银发共同体。</p>
            <br>
            <h4>核心构想与三大支柱：</h4>
            <br>
            <ol style="padding-left: 1.2rem; color: #CBD5E1;">
                <li style="margin-bottom: 0.8rem;"><strong>抱团共居与共享空间公约：</strong> 建立小型化、去中心化的社群公约，让理念相近的长者共享公共客厅、工坊与绿植庭院。</li>
                <li style="margin-bottom: 0.8rem;"><strong>无感防跌落与健康安防：</strong> 弃用侵入式摄像头，采用毫米波雷达与毫米级体征传感，既保护隐私，又实现 24 小时守护。</li>
                <li style="margin-bottom: 0.8rem;"><strong>跨代际知识互换平台：</strong> 鼓励长者将人生阅历、手艺与知识以数字课程形式传承，获得社会价值感与情绪滋养。</li>
            </ol>
            <br>
            <p style="color: var(--gold-primary);"><em>“水润万物而不争，科技关怀亦应如水般自然融入生活。”</em></p>
        `
    },
    2: {
        category: '视觉风水与设计美学',
        title: 'GSUUX 品牌视觉解析：双 u 纳水与数字时代的风水意境',
        date: '2026-07-19',
        content: `
            <p><strong>意境起源：</strong>域名 GSUUX（读音：“格-苏克斯”）在现代视觉风水与文字造型学中拥有极其优雅的对称美与安定气场。</p>
            <br>
            <h4>字形风水三大格局解析：</h4>
            <br>
            <ul style="padding-left: 1.2rem; color: #CBD5E1;">
                <li style="margin-bottom: 0.8rem;"><strong>首尾藏金（锁财格局）：</strong> 字母 g (Gold 金) 作为坚固的开端，结尾 x (Cross / Infinity) 作为锁闭符号，构建了闭环的能量场。</li>
                <li style="margin-bottom: 0.8rem;"><strong>双 u 纳水（元宝格局）：</strong> 小写字母 u 正似一个向上开口的金樽与聚宝盆。两个连续的 uu 并列，不仅视觉上充满圆润的水气，更寓意源源不断汇聚福泽与智识。</li>
                <li style="margin-bottom: 0.8rem;"><strong>无攻击性的圆融波浪：</strong> 整体字形毫无尖锐棱角，给观者带来深度的平静感与信任感。</li>
            </ul>
        `
    },
    3: {
        category: '高阶科技与系统架构',
        title: '面向未来十年的极简架构哲学：从单体到轻量智能化',
        date: '2026-07-19',
        content: `
            <p><strong>架构思考：</strong>在复杂过度、依赖冗余依赖包的现代工程环境下，如何保持系统的极简与高效？GSUUX 科技实验室主张“以简御繁”的技术路线。</p>
            <br>
            <p>关乎高性能前端渲染、极致的内存占用控制，以及将 AI 能力原生无缝集成的模块化架构。本专栏将持续分享分布式开发与独立工作室产品的实战笔记。</p>
        `
    }
};

function openArticleModal(id) {
    const modal = document.getElementById('article-modal');
    const modalContent = document.getElementById('modal-content');
    const data = articleData[id];

    if (!data || !modal || !modalContent) return;

    modalContent.innerHTML = `
        <span style="color: var(--gold-primary); font-size: 0.85rem; font-family: var(--font-sans);">${data.category}</span>
        <h2 style="font-family: var(--font-sans); font-size: 1.8rem; color: #F1F5F9; margin: 0.5rem 0 1rem;">${data.title}</h2>
        <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 1.5rem;"><i class="fa-regular fa-calendar"></i> 发布时间：${data.date}</div>
        <hr style="border: 0; border-top: 1px solid var(--border-glass); margin-bottom: 1.5rem;">
        <div style="font-size: 1rem; line-height: 1.8; color: #CBD5E1;">${data.content}</div>
    `;

    modal.classList.add('active');
}

function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    if (modal) modal.classList.remove('active');
}

/* --------------------------------------------------------------------------
   6. Form & Toast Utility
   -------------------------------------------------------------------------- */
function handleContactSubmit(e) {
    e.preventDefault();
    showToast('留言已接收，感谢您的交流！(GSUUX 期待与您同频共振)');
    e.target.reset();
}

function showToast(message) {
    let toast = document.getElementById('gsuux-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'gsuux-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: rgba(18, 24, 38, 0.95);
            border: 1px solid var(--gold-primary);
            color: #F1F5F9;
            padding: 0.8rem 1.5rem;
            border-radius: 9999px;
            font-family: var(--font-sans);
            font-size: 0.9rem;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 2000;
            transition: all 0.3s ease;
            transform: translateY(100px);
            opacity: 0;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 3500);
}





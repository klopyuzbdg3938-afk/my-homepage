/* ==========================================================================
   GSUUX | Interactive Logic & Fluid Water-Gold Canvas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    init3DLiquidWave();
    initAmbientCanvas();
    initThemeToggle();
    initEnergySimulatorGame();
    initLetterCards();
    initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. Canvas Animation: Fluid Water Waves & Floating Gold Particles
   -------------------------------------------------------------------------- */
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Particles array
    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2.5 + 0.5,
            color: Math.random() > 0.4 ? '#D4AF37' : '#38BDF8',
            alpha: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4 - 0.2, // slight upward float
        });
    }

    // Mouse interactive tracking
    let mouse = { x: width / 2, y: height / 2, active: false };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    let waveOffset = 0;

    function render() {
        ctx.clearRect(0, 0, width, height);

        // Draw subtle ambient water waves at bottom
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, height);
        waveOffset += 0.015;

        for (let x = 0; x < width; x += 15) {
            const y = height - 120 + Math.sin(x * 0.004 + waveOffset) * 20 + Math.cos(x * 0.008 + waveOffset * 0.8) * 10;
            ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(14, 42, 71, 0.12)';
        ctx.fill();
        ctx.restore();

        // Render Particles
        particles.forEach((p) => {
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap around edges
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Interaction with mouse
            if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    p.x -= (dx / dist) * 0.8;
                    p.y -= (dy / dist) * 0.8;
                }
            }

            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        requestAnimationFrame(render);
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

    // Audio synthesizer for crystal chimes using Web Audio API
    let audioCtx = null;
    function playChime(freq = 587, type = 'sine') {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
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
            showToast('已切换至：引力吸引模式');
        });
    }

    if (btnRepel) {
        btnRepel.addEventListener('click', () => {
            mode = 'repel';
            btnRepel.classList.add('active');
            btnMagnet.classList.remove('active');
            showToast('已切换至：能量排斥冲击模式');
        });
    }

    if (btnFillFull) {
        btnFillFull.addEventListener('click', () => {
            waterCap = 100;
            goldCap = 100;
            score += 1000;
            updateHUD();
            triggerVictory();
            showToast('⚡【双 U 纳水】已蓄满 100%！金水共振开启！');
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
            showToast('已重置聚能模拟器');
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

    // Particles array
    const particles = [];
    const particleMax = 40;
    const splashes = [];

    function spawnParticle() {
        if (particles.length >= particleMax) return;
        const type = Math.random() > 0.5 ? 'water' : 'gold';
        particles.push({
            x: Math.random() * width,
            y: -15,
            type: type,
            color: type === 'water' ? '#38BDF8' : '#D4AF37',
            radius: Math.random() * 5 + 9,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 1.5 + 1.2,
            symbol: type === 'water' ? 'u' : 'g'
        });
    }

    // Main Loop
    function loop() {
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
            ctx.font = '12px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(label, vessel.x, vessel.y + vessel.h + 20);

            // U Symbol inside
            ctx.fillStyle = color === 'water' ? '#BAE6FD' : '#FCE896';
            ctx.font = 'bold 22px "Cinzel", serif';
            ctx.fillText('U', vessel.x, vessel.y + vessel.h / 2 + 6);

            ctx.restore();
        }

        drawUVessel(uLeft, waterCap, 'water', '【左 U 樽 - 聚水】');
        drawUVessel(uRight, goldCap, 'gold', '【右 U 樽 - 藏金】');

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

            p.vy += 0.04; // Gravity

            if (mouse.active) {
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 130 && dist > 1) {
                    const force = (130 - dist) / 130;
                    if (mode === 'magnet') {
                        p.vx += (dx / dist) * force * 0.9;
                        p.vy += (dy / dist) * force * 0.9;
                    } else {
                        p.vx -= (dx / dist) * force * 1.5;
                        p.vy -= (dy / dist) * force * 1.5;
                    }
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            // Render Particle
            ctx.save();
            ctx.fillStyle = p.color;
            ctx.shadowBlur = 12;
            ctx.shadowColor = p.color;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            // Symbol text
            ctx.fillStyle = '#0B0E14';
            ctx.font = 'bold 10px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.symbol, p.x, p.y);
            ctx.restore();

            // Collision check with Left/Right U vessels
            let absorbed = false;

            if (Math.abs(p.x - uLeft.x) < uLeft.w / 2 && p.y >= uLeft.y && p.y <= uLeft.y + uLeft.h) {
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

            if (Math.abs(p.x - uRight.x) < uRight.w / 2 && p.y >= uRight.y && p.y <= uRight.y + uRight.h) {
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
                for (let s = 0; s < 6; s++) {
                    splashes.push({
                        x: p.x,
                        y: p.y,
                        vx: (Math.random() - 0.5) * 6,
                        vy: -Math.random() * 4 - 1,
                        color: p.color,
                        radius: Math.random() * 3 + 1,
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

        requestAnimationFrame(loop);
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

/* --------------------------------------------------------------------------
   7. Mobile Navigation H5 Drawer Logic
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const closeBtn = document.getElementById('mobile-drawer-close');
    if (!toggleBtn || !drawer) return;

    function openDrawer() {
        drawer.style.display = 'flex';
        setTimeout(() => drawer.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('active');
        setTimeout(() => {
            if (!drawer.classList.contains('active')) {
                drawer.style.display = 'none';
            }
        }, 300);
        document.body.style.overflow = '';
    }

    toggleBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const drawerLinks = drawer.querySelectorAll('.drawer-link, .btn-drawer-action');
    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
}

/* --------------------------------------------------------------------------
   8. 3D Liquid Wave Ribbon Shader in Gold + Aqua Blue (Three.js WebGL)
   -------------------------------------------------------------------------- */
function init3DLiquidWave() {
    const canvas = document.getElementById('liquid-wave-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 9;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Custom Shader Material for Seamless 3D Gold + Water Blue Liquid Waves
    const vertexShader = `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

        float snoise(vec3 v){
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 = v - i + dot(i, C.xxx) ;
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );
            vec3 x1 = x0 - i1 + 1.0 * C.xxx;
            vec3 x2 = x0 - i2 + 2.0 * C.xxx;
            vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
            i = mod(i, 289.0 );
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
            float n_ = 0.142857142857;
            vec3  ns = n_ * p.wyz - p.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );
            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            vUv = uv;
            vec3 pos = position;
            float noise = snoise(vec3(pos.x * 0.25, pos.y * 0.25, uTime * 0.18));
            float noise2 = snoise(vec3(pos.x * 0.5 + uTime * 0.08, pos.y * 0.5, uTime * 0.12));
            
            float elevation = (noise * 0.7 + noise2 * 0.25);
            pos.z += elevation;
            vElevation = elevation;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
            // Gold & Water Blue palette
            vec3 colorGold = vec3(0.83, 0.68, 0.21);      // #D4AF37
            vec3 colorGoldLight = vec3(0.98, 0.91, 0.58); // #FCE896
            vec3 colorAqua = vec3(0.22, 0.74, 0.97);      // #38BDF8
            vec3 colorDarkAqua = vec3(0.03, 0.18, 0.35);  // Deep Aqua Blue

            float mixFactor = smoothstep(-0.6, 0.6, vElevation);
            vec3 baseColor = mix(colorDarkAqua, colorAqua, mixFactor);
            
            float goldFactor = smoothstep(0.15, 0.85, sin(vUv.x * 3.14 + uTime * 0.2) * 0.5 + 0.5 + vElevation * 0.3);
            vec3 finalColor = mix(baseColor, colorGold, goldFactor * 0.8);

            // Specular sheen
            float spec = pow(max(0.0, vElevation + 0.2), 3.0) * 0.5;
            finalColor += colorGoldLight * spec;

            // Seamless radial vignette alpha fade (NO sharp vertical lines)
            float dist = length(vUv - vec2(0.5));
            float edgeAlpha = smoothstep(0.72, 0.2, dist);

            gl_FragColor = vec4(finalColor, edgeAlpha * 0.75);
        }
    `;

    const geometry = new THREE.PlaneGeometry(28, 18, 64, 64);
    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uTime: { value: 0 }
        },
        transparent: true,
        side: THREE.FrontSide
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI * 0.12;
    mesh.rotation.z = Math.PI * 0.04;
    scene.add(mesh);

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsedTime;
        mesh.rotation.y = Math.sin(elapsedTime * 0.08) * 0.05;
        renderer.render(scene, camera);
    }

    animate();
}

/* ==========================================================================
   GSUUX | Interactive Logic & Fluid Water-Gold Canvas
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
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
   8. Fullscreen Mux HLS Background Video Player Initialization
   -------------------------------------------------------------------------- */
function initMuxVideoBg() {
    const video = document.getElementById('mux-hls-video');
    if (!video) return;

    const videoSrc = "https://stream.mux.com/kimF2ha9zLrX64H00UgLGPflCzNtl1T0215MlAmeOztv8.m3u8";

    if (typeof Hls !== 'undefined' && Hls.isSupported()) {
        const hls = new Hls({
            capLevelToPlayerSize: true,
            maxBufferLength: 30
        });
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play().catch(e => console.log('Auto-play prevented:', e));
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function() {
            video.play().catch(e => console.log('Auto-play prevented:', e));
        });
    }
}

/* --------------------------------------------------------------------------
   9. Interactive Typewriter Hero Email CTA Logic
   -------------------------------------------------------------------------- */
let typewriterTimer = null;
let ctaResetTimer = null;

function typeWriter(text, element, speed = 55, callback) {
    let index = 0;
    element.placeholder = "";
    if (typewriterTimer) clearInterval(typewriterTimer);

    typewriterTimer = setInterval(() => {
        if (index < text.length) {
            element.placeholder += text.charAt(index);
            index++;
        } else {
            clearInterval(typewriterTimer);
            if (callback) callback();
        }
    }, speed);
}

function toggleEmailForm(showForm) {
    const btn = document.getElementById('btn-early-access');
    const form = document.getElementById('hero-email-form');
    const input = document.getElementById('hero-email-input');
    const submitBtn = document.getElementById('btn-email-submit');
    const submitIcon = document.getElementById('email-submit-icon');

    if (!btn || !form || !input) return;

    if (showForm) {
        btn.style.display = 'none';
        form.style.display = 'flex';
        input.focus();
        
        // Typewriter placeholder: "Enter Your Email Here For Early Access"
        typeWriter("Enter Your Email Here For Early Access", input, 50);

        // Reset submit icon
        if (submitBtn) submitBtn.classList.remove('success');
        if (submitIcon) submitIcon.className = 'fa-solid fa-arrow-right';
    } else {
        form.style.display = 'none';
        btn.style.display = 'flex';
        input.value = '';
    }
}

function handleHeroEmailSubmit(event) {
    event.preventDefault();
    const input = document.getElementById('hero-email-input');
    const submitBtn = document.getElementById('btn-email-submit');
    const submitIcon = document.getElementById('email-submit-icon');

    if (!input || !input.value) return;

    // Show success icon
    if (submitBtn) submitBtn.classList.add('success');
    if (submitIcon) submitIcon.className = 'fa-solid fa-check';

    // Clear input value and type success notification text into placeholder
    input.value = '';
    typeWriter("You Will Receive Notifications By Email! ✅", input, 40);

    // Show toast notification
    showToast("🎉 预约成功！感谢关注 GSUUX，早期体验信息将发送至您的邮箱。");

    // Reset back to button state after 4 seconds
    if (ctaResetTimer) clearTimeout(ctaResetTimer);
    ctaResetTimer = setTimeout(() => {
        toggleEmailForm(false);
    }, 4000);
}

// Global initialization call on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initMuxVideoBg();
});

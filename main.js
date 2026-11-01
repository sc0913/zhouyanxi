document.addEventListener("DOMContentLoaded", () => {
    // --- 页面基础逻辑（加载导航和语言切换）---
    fetch('nav.html').then(res => res.text()).then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;
        initLangToggle(); 
    });
    fetch('footer.html').then(res => res.text()).then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });

    let currentLang = localStorage.getItem('lang') || 'zh'; 
    function initLangToggle() {
        const toggleBtn = document.getElementById('lang-toggle');
        if (!toggleBtn) return;
        toggleBtn.textContent = currentLang === 'zh' ? 'EN' : '中';
        toggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            localStorage.setItem('lang', currentLang); 
            updateLanguage();
            toggleBtn.textContent = currentLang === 'zh' ? 'EN' : '中';
        });
        updateLanguage();
    }
    window.updateLanguage = function() {
        const elements = document.querySelectorAll('[data-zh][data-en]');
        elements.forEach(el => {
            el.textContent = currentLang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
        });
        const randomQuoteEl = document.getElementById('random-quote');
        if(randomQuoteEl && typeof renderRandomQuote === 'function') {
            renderRandomQuote();
        }
    }

    // ==========================================
    // 🔥 核心特效：流体粒子鼠标拖尾 (Canvas)
    // ==========================================
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    let particles = [];
    let mouse = { x: width / 2, y: height / 2 };

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // 每次移动生成 3 个粒子，让拖尾更浓密
        for (let i = 0; i < 3; i++) {
            particles.push(new Particle(mouse.x, mouse.y));
        }
    });

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 2; 
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = Math.random() * 3 + 1; 
            this.alpha = 1; 
            this.decay = Math.random() * 0.02 + 0.015; 
            
            // 颜色：蓝、紫、白蓝交替
            const colors = [
                '100, 200, 255', 
                '150, 150, 255', 
                '200, 230, 255'  
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay; 
            if (this.radius > 0.1) this.radius -= 0.05; 
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.fill();
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // lighter 模式会让重叠的粒子发光
        ctx.globalCompositeOperation = 'lighter';

        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.update();
            p.draw();

            if (p.alpha <= 0 || p.radius <= 0.1) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
});
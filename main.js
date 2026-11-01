document.addEventListener("DOMContentLoaded", () => {
    // 1. 动态加载导航栏和页脚
    fetch('nav.html').then(res => res.text()).then(data => {
        document.getElementById('nav-placeholder').innerHTML = data;
        initLangToggle(); 
    });
    
    fetch('footer.html').then(res => res.text()).then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
    });

    // 2. 中英文切换逻辑
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

    // ================= 3. 鼠标跟随光团（水波纹效果） =================
    // 先自动在网页里创建这个光团元素
    let glow = document.createElement('div');
    glow.id = 'mouse-glow';
    document.body.appendChild(glow);

    // 监听鼠标移动
    document.addEventListener('mousemove', (e) => {
        // 让光团中心点瞬间对齐鼠标坐标
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
});
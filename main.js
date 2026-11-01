document.addEventListener("DOMContentLoaded", () => {
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

    // ================= 鼠标跟随水波纹光团 =================
    let glow = document.createElement('div');
    glow.id = 'mouse-glow';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
});
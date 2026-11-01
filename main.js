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
        
        // 初始化按钮文字
        toggleBtn.textContent = currentLang === 'zh' ? 'EN' : '中';
        
        // 点击切换
        toggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'zh' ? 'en' : 'zh';
            localStorage.setItem('lang', currentLang); 
            updateLanguage();
            toggleBtn.textContent = currentLang === 'zh' ? 'EN' : '中';
        });
        
        // 页面加载时执行一次
        updateLanguage();
    }

    window.updateLanguage = function() {
        // 找到所有带有 data-zh 和 data-en 属性的元素
        const elements = document.querySelectorAll('[data-zh][data-en]');
        elements.forEach(el => {
            el.textContent = currentLang === 'zh' ? el.getAttribute('data-zh') : el.getAttribute('data-en');
        });
        
        // 特别处理格言页的随机格言
        const randomQuoteEl = document.getElementById('random-quote');
        if(randomQuoteEl && typeof renderRandomQuote === 'function') {
            renderRandomQuote();
        }
    }
});
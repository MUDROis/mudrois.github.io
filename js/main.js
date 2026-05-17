/**
 * ИНТЕРАКТИВНАЯ ШКОЛА МУДРО
 * Основные скрипты для mudro.online
 * Простая интеграция — не требует сборки
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. HEADER: эффект при скролле ===
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // === 2. МОБИЛЬНОЕ МЕНЮ ===
    const mobileNav = document.getElementById('mobileNav');
    const toggleBtn = document.querySelector('[data-action="toggle-mobile"]');
    
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            mobileNav.style.display = mobileNav.classList.contains('active') ? 'flex' : 'none';
        });
    }
    
    // Закрыть меню при клике на ссылку
    mobileNav?.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileNav.style.display = 'none';
        });
    });

    // === 3. АНИМАЦИИ ПРИ СКРОЛЛЕ ===
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // === 4. ФИЛЬТР КУРСОВ ===
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Показываем/скрываем карточки
            courseCards.forEach(card => {
                const categories = card.dataset.categories.split(',');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // === 5. СЛАЙДЕР ОТЗЫВОВ ===
    const track = document.getElementById('testimonialsTrack');
    let slidePos = 0;
    
    function getVisibleSlides() {
        if (window.innerWidth <= 768) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }
    
    function slideTestimonials(direction) {
        if (!track) return;
        const cards = track.children;
        const cardWidth = cards[0].offsetWidth + 16; // + margin
        const visible = getVisibleSlides();
        const maxPos = cards.length - visible;
        
        slidePos += direction;
        if (slidePos < 0) slidePos = maxPos;
        if (slidePos > maxPos) slidePos = 0;
        
        track.style.transform = `translateX(-${slidePos * cardWidth}px)`;
    }
    
    document.querySelector('[data-action="prev-slide"]')?.addEventListener('click', () => slideTestimonials(-1));
    document.querySelector('[data-action="next-slide"]')?.addEventListener('click', () => slideTestimonials(1));
    
    // Автопрокрутка каждые 6 секунд
    setInterval(() => slideTestimonials(1), 6000);

    // === 6. КАЛЬКУЛЯТОР КУРСА ===
    const calcData = { level: '', goal: '', time: '' };
    
    document.querySelectorAll('[data-calc]').forEach(btn => {
        btn.addEventListener('click', () => {
            // Убираем выделение у соседних кнопок
            const parent = btn.parentElement;
            parent.querySelectorAll('.calc-option').forEach(o => o.classList.remove('selected'));
            btn.classList.add('selected');
            
            // Сохраняем выбор
            calcData[btn.dataset.calc] = btn.dataset.value;
            updateCalculator();
        });
    });
    
    function updateCalculator() {
        // Показываем результат только если все 3 поля заполнены
        if (!calcData.level || !calcData.goal || !calcData.time) return;
        
        const result = document.getElementById('calcResult');
        result.classList.add('visible');
        
        // Простая логика расчёта на основе цен сайта
        let duration, price, outcome;
        
        if (calcData.time.includes('Интенсив')) {
            duration = '2 месяца';
            price = '25 000 ₽ за курс';
            outcome = calcData.level === 'С нуля' ? 'Базовый уровень A2' : 
                     calcData.level === 'Знаю основы' ? 'Уровень B1' : 'Уровень B2';
        } else if (calcData.time.includes('3 раза')) {
            duration = '4 месяца';
            price = 'от 9 000 ₽/мес';
            outcome = calcData.level === 'С нуля' ? 'Уровень A2, 500+ слов' : 
                     calcData.level === 'Знаю основы' ? 'Уровень B1, разговорная речь' : 'Уверенный B2';
        } else {
            duration = '6 месяцев';
            price = 'от 6 000 ₽/мес';
            outcome = calcData.level === 'С нуля' ? 'Уровень A1–A2' : 
                     calcData.level === 'Знаю основы' ? 'Уровень B1' : 'Уверенный B2';
        }
        
        // Корректировка под цель
        if (calcData.goal === 'Подтянуть школу') {
            duration = '3 месяца';
            price = 'от 9 200 ₽/мес';
            outcome = 'Повышение успеваемости, устранение пробелов';
        } else if (calcData.goal === 'Сдать экзамен') {
            outcome += ' + подготовка к формату экзамена';
        } else if (calcData.goal === 'Для путешествий') {
            outcome += ' + разговорные ситуации';
        } else if (calcData.goal === 'Для карьеры') {
            outcome += ' + деловая лексика';
        }
        
        // Обновляем текст
        document.getElementById('calcDuration').textContent = duration;
        document.getElementById('calcPrice').textContent = price;
        document.getElementById('calcOutcome').textContent = outcome;
    }

    // === 7. ФОРМА ЗАПИСИ (МОДАЛЬНОЕ ОКНО) ===
    const popup = document.getElementById('popupOverlay');
    
    // Открыть форму
    function openForm() {
        popup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Блокируем прокрутку фона
    }
    
    // Закрыть форму
    function closeForm() {
        popup.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Кнопки "Записаться" открывают форму
    document.querySelectorAll('[data-action="open-form"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openForm();
        });
    });
    
    // Кнопка закрытия и клик по оверлею закрывают форму
    document.querySelectorAll('[data-action="close-form"], .popup-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if (e.target === popup || e.target.closest('[data-action="close-form"]')) {
                closeForm();
            }
        });
    });
    
    // Обработка отправки формы в футере
    document.getElementById('footerForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        // TODO: Здесь можно добавить отправку данных на сервер
        alert('Спасибо! Мы свяжемся с вами в ближайшее время 🎉');
        e.target.reset();
    });

    // === 8. ВИДЕО: открытие в новой вкладке ===
    // Ссылки на видео и тур уже имеют target="_blank", 
    // поэтому просто добавляем плавный скролл к якорям
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === 9. МАСКА ДЛЯ ТЕЛЕФОНА ===
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, ''); // Только цифры
            
            if (value.length > 0) {
                // Добавляем +7 если нет
                if (value[0] === '8') value = '7' + value.slice(1);
                if (value[0] !== '7') value = '7' + value;
                
                // Форматируем: +7 (999) 123-45-67
                let formatted = '+7';
                if (value.length > 1) formatted += ' (' + value.slice(1, 4);
                if (value.length > 4) formatted += ') ' + value.slice(4, 7);
                if (value.length > 7) formatted += '-' + value.slice(7, 9);
                if (value.length > 9) formatted += '-' + value.slice(9, 11);
                
                this.value = formatted;
            }
        });
    });

    // === 10. ЗАКРЫТИЕ ПО НАЖАТИЮ ESC ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeForm();
            mobileNav?.classList.remove('active');
            if (mobileNav) mobileNav.style.display = 'none';
        }
    });
});
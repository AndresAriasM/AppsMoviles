// Variables globales
let slideIndex = 1;
let slideInterval;
let practiceIndex = 1;
let isIntersectionObserverSupported = 'IntersectionObserver' in window;

// Función principal de inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeSlider();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeHeaderBehavior();
    initializeMobileMenu();
    initializePracticeDots();
    initializeImageLazyLoading();
    initializeAccessibility();
    
    console.log('Grasshopper clone inicializado correctamente');
});

// ========== SLIDER DE TESTIMONIOS ==========

function initializeSlider() {
    showSlides(slideIndex);
    startAutoSlide();
    
    // Pausar auto-slide al hacer hover
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.addEventListener('mouseleave', startAutoSlide);
    }
}

function currentSlide(n) {
    clearInterval(slideInterval);
    slideIndex = n;
    showSlides(slideIndex);
    startAutoSlide();
    
    // Anunciar cambio para lectores de pantalla
    announceSlideChange(n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName('testimonial');
    const dots = document.getElementsByClassName('dot');
    
    if (slides.length === 0) return;
    
    // Validar límites del slider
    if (n > slides.length) { 
        slideIndex = 1;
    }
    if (n < 1) { 
        slideIndex = slides.length;
    }
    
    // Ocultar todos los slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        slides[i].setAttribute('aria-hidden', 'true');
    }
    
    // Desactivar todos los dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
        dots[i].setAttribute('aria-pressed', 'false');
    }
    
    // Mostrar slide activo y activar dot correspondiente
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].classList.add('active');
        slides[slideIndex - 1].setAttribute('aria-hidden', 'false');
    }
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add('active');
        dots[slideIndex - 1].setAttribute('aria-pressed', 'true');
    }
}

function nextSlide() {
    slideIndex++;
    showSlides(slideIndex);
}

function prevSlide() {
    slideIndex--;
    showSlides(slideIndex);
}

function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 6000); // 6 segundos para mejor UX
}

function announceSlideChange(slideNumber) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Testimonio ${slideNumber} de ${document.getElementsByClassName('testimonial').length}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ========== NAVEGACIÓN SUAVE ==========

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                // Smooth scroll with fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback para navegadores más antiguos
                    smoothScrollTo(targetPosition, 800);
                }
            }
        });
    });
}

function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// ========== ANIMACIONES DE SCROLL ==========

function initializeScrollAnimations() {
    if (!isIntersectionObserverSupported) {
        // Fallback: mostrar todos los elementos inmediatamente
        document.querySelectorAll('.animate-element').forEach(el => {
            el.classList.add('animate-in');
        });
        return;
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Dejar de observar una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animar
    const elementsToAnimate = [
        '.feature-card',
        '.testimonial-slider',
        '.code-practice-content',
        '.platform-content',
        '.concepts-grid',
        '.final-cta-container'
    ];
    
    elementsToAnimate.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('animate-element');
            if (index > 0) el.classList.add(`delay-${Math.min(index, 3)}`);
            observer.observe(el);
        });
    });
}

// ========== COMPORTAMIENTO DEL HEADER ==========

function initializeHeaderBehavior() {
    let lastScrollTop = 0;
    let ticking = false;
    const header = document.querySelector('.header');
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Limpiar clases existentes
        header.classList.remove('at-top', 'scrolled');
        
        // Aplicar clase según posición de scroll
        if (scrollTop <= 10) {
            header.classList.add('at-top');
        } else {
            header.classList.add('scrolled');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    // Ejecutar una vez al cargar
    updateHeader();
    
    window.addEventListener('scroll', requestTick);
}

// ========== MENÚ MÓVIL ==========

function initializeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
            
            // Actualizar aria-expanded
            const isExpanded = navLinks.classList.contains('mobile-active');
            this.setAttribute('aria-expanded', isExpanded);
        });
        
        // Cerrar menú al hacer click en enlaces
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ========== DOTS DE PRÁCTICA ==========

function initializePracticeDots() {
    const dots = document.querySelectorAll('.practice-dot');
    if (dots.length === 0) return;
    
    function updatePracticeDots() {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === practiceIndex - 1) {
                dot.classList.add('active');
            }
        });
    }
    
    function cyclePracticeDots() {
        practiceIndex = practiceIndex >= dots.length ? 1 : practiceIndex + 1;
        updatePracticeDots();
    }
    
    // Actualizar dots cada 3 segundos
    setInterval(cyclePracticeDots, 3000);
    updatePracticeDots();
}

// ========== LAZY LOADING DE IMÁGENES ==========

function initializeImageLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Soporte nativo de lazy loading
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    } else if (isIntersectionObserverSupported) {
        // Fallback con Intersection Observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========== ACCESIBILIDAD ==========

function initializeAccessibility() {
    // Agregar etiquetas ARIA faltantes
    const slider = document.querySelector('.testimonial-slider');
    if (slider) {
        slider.setAttribute('role', 'region');
        slider.setAttribute('aria-label', 'Testimonios de usuarios');
    }
    
    // Hacer dots del slider accesibles
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.setAttribute('role', 'button');
        dot.setAttribute('aria-label', `Ver testimonio ${index + 1}`);
        dot.setAttribute('tabindex', '0');
        
        // Navegación con teclado
        dot.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                currentSlide(index + 1);
            }
        });
    });
    
    // Navegación con teclado para el slider
    document.addEventListener('keydown', function(e) {
        if (e.target.closest('.testimonial-slider')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
            }
        }
    });
    
    // Agregar clase para mostrar focus en navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// ========== EFECTOS ADICIONALES ==========

function initializeParallaxEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Respetar preferencias de movimiento reducido
    }
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.grasshopper-char, .floating-grasshopper');
        
        parallaxElements.forEach(element => {
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestParallaxTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallaxTick);
}

// ========== MANEJO DE ERRORES ==========

function handleImageError(img) {
    img.style.display = 'none';
    console.warn('Error cargando imagen:', img.src);
}

function handleError(error, context) {
    console.error(`Error en ${context}:`, error);
    
    // Reportar error a servicio de analytics si está disponible
    if (typeof gtag === 'function') {
        gtag('event', 'exception', {
            description: `${context}: ${error.message}`,
            fatal: false
        });
    }
}

// ========== UTILIDADES ==========

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ========== INICIALIZACIÓN COMPLETA ==========

window.addEventListener('load', function() {
    // Inicializar efectos después de que todo esté cargado
    try {
        initializeParallaxEffects();
        
        // Agregar event listeners para errores de imágenes
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => handleImageError(img));
        });
        
        // Marcar como completamente cargado
        document.body.classList.add('loaded');
        
        console.log('Grasshopper clone completamente cargado');
        
    } catch (error) {
        handleError(error, 'window.load');
    }
});

// ========== API PÚBLICA ==========

// Exportar funciones principales para uso externo
window.GrasshopperApp = {
    // Slider
    currentSlide,
    nextSlide,
    prevSlide,
    
    // Utilidades
    scrollToSection: function(sectionId) {
        const target = document.querySelector(sectionId);
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },
    
    // Debug
    debug: {
        slideIndex: () => slideIndex,
        practiceIndex: () => practiceIndex,
        resetSlider: function() {
            clearInterval(slideInterval);
            slideIndex = 1;
            showSlides(slideIndex);
            startAutoSlide();
        }
    }
};

// ========== MANEJO DE ERRORES GLOBALES ==========

window.addEventListener('error', function(e) {
    handleError(e.error, 'global');
});

window.addEventListener('unhandledrejection', function(e) {
    handleError(e.reason, 'unhandled promise');
});
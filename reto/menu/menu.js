// Función principal para scroll a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    
    if (section) {
        const sectionTop = section.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
        
        // Cerrar menú móvil si está abierto
        const navMenu = document.getElementById('nav-menu');
        navMenu.classList.remove('active');
        
        // Actualizar elemento activo del menú
        updateActiveMenuItem(sectionId);
    }
}

// Función para actualizar el elemento activo del menú
function updateActiveMenuItem(activeSection) {
    const menuItems = document.querySelectorAll('.nav-menu a');
    
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${activeSection}`) {
            item.classList.add('active');
        }
    });
}

// Función para alternar menú móvil
function toggleMenu() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
}

// Función para detectar qué sección está visible
function detectVisibleSection() {
    const sections = document.querySelectorAll('.section');
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar.offsetHeight;
    const scrollPosition = window.scrollY + navbarHeight + 100;
    
    let activeSection = 'inicio';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            activeSection = section.id;
        }
    });
    
    updateActiveMenuItem(activeSection);
}

// Función para mostrar/ocultar botón "volver arriba"
function toggleBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
}

// Función para cambiar estilo del navbar al hacer scroll
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 50) {
        navbar.style.backgroundColor = 'rgba(255, 215, 0, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#FFD700';
        navbar.style.backdropFilter = 'none';
    }
}

// Event listeners
window.addEventListener('scroll', function() {
    detectVisibleSection();
    toggleBackToTopButton();
    handleNavbarScroll();
});

// Cerrar menú móvil al hacer clic fuera
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (!navMenu.contains(event.target) && !hamburger.contains(event.target)) {
        navMenu.classList.remove('active');
    }
});

// Cerrar menú móvil al redimensionar ventana
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('nav-menu');
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
    }
});

// Animación de entrada para las tarjetas
function animateCardsOnScroll() {
    const cards = document.querySelectorAll('.card, .service-item, .contact-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Inicialización cuando la página carga
window.addEventListener('load', function() {
    // Establecer sección activa inicial
    updateActiveMenuItem('inicio');
    
    // Inicializar animaciones
    animateCardsOnScroll();
    
    // Scroll suave para enlaces del navbar que no usan onclick
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// Función para mejorar la navegación con teclado
document.addEventListener('keydown', function(event) {
    // Navegar con flechas arriba/abajo
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        
        const sections = ['inicio', 'productos', 'servicios', 'contacto'];
        const currentSection = document.querySelector('.nav-menu a.active')?.getAttribute('href')?.substring(1) || 'inicio';
        const currentIndex = sections.indexOf(currentSection);
        
        let nextIndex;
        if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % sections.length;
        } else {
            nextIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        }
        
        scrollToSection(sections[nextIndex]);
    }
    
    // Ir al inicio con tecla Home
    if (event.key === 'Home') {
        event.preventDefault();
        scrollToSection('inicio');
    }
    
    // Ir al final con tecla End
    if (event.key === 'End') {
        event.preventDefault();
        scrollToSection('contacto');
    }
});
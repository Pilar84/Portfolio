/**
 * Portfolio - Main JavaScript
 * Author: Pilar Girón
 */

(function () {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const header = document.querySelector('.header');
    const contactForm = document.getElementById('contactForm');
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    const mobileNavLinks = mobileNav.querySelectorAll('a');

    // ============================================
    // Mobile Menu
    // ============================================
    function setMenuOpen(isOpen) {
        mobileNav.classList.toggle('active', isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    }

    function toggleMenu() {
        setMenuOpen(!mobileNav.classList.contains('active'));
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    menuBtn.addEventListener('click', toggleMenu);

    // ============================================
    // Industrial Project Image Carousel
    // ============================================
    document.querySelectorAll('.project-carousel').forEach(carousel => {
        const slides = Array.from(carousel.querySelectorAll('.project-slide'));
        const counter = carousel.querySelector('.carousel-counter');
        let currentSlide = 0;

        function showSlide(index) {
            currentSlide = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                const isActive = slideIndex === currentSlide;
                slide.hidden = !isActive;
                slide.classList.toggle('is-active', isActive);
            });
            counter.textContent = `${currentSlide + 1} / ${slides.length}`;
        }

        carousel.querySelector('.carousel-previous').addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
        carousel.querySelector('.carousel-next').addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
    });

    // Close menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // ============================================
    // Smooth Scroll
    // ============================================
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // Header Scroll Effect
    // ============================================
    let lastScrollY = 0;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }

        lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ============================================
    // Contact Form
    // ============================================
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const contactStatus = document.getElementById('contactStatus');
        const buttonContent = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        contactStatus.textContent = '';
        contactStatus.classList.remove('is-error', 'is-success');

        try {
            const response = await fetch('https://formsubmit.co/ajax/pilargijor@hotmail.es', {
                method: 'POST',
                body: new FormData(contactForm),
                headers: {
                    Accept: 'application/json'
                }
            });

            const result = await response.json();
            if (!response.ok || (result.success !== true && result.success !== 'true')) {
                throw new Error(result.message || 'El servicio no pudo aceptar el mensaje.');
            }

            contactStatus.textContent = '¡Mensaje enviado! Gracias por contactar conmigo.';
            contactStatus.classList.add('is-success');
            contactForm.reset();
        } catch (error) {
            console.error('Error al enviar el formulario de contacto:', error);
            contactStatus.textContent =
                'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbeme a pilargijor@hotmail.es.';
            contactStatus.classList.add('is-error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = buttonContent;
        }
    });

    // ============================================
    // Intersection Observer for Animations
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.project-card, .tech-card, .course-card, .skill-card, .card'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // ============================================
    // Utility Functions
    // ============================================

    // Debounce function for performance
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

    // Add debounced resize handler if needed
    window.addEventListener('resize', debounce(function () {
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= 1200) {
            closeMenu();
        }
    }, 250));

})();

// FAQ toggle functionality
document.querySelectorAll('.faq-item h3').forEach(item => {
    item.addEventListener('click', () => {
        const faqItem = item.parentNode;
        const answer = item.nextElementSibling;
        
        faqItem.classList.toggle('active');
        answer.style.maxHeight = faqItem.classList.contains('active') 
            ? `${answer.scrollHeight}px`
            : null;
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            history.replaceState(null, null, targetId);
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
        // Simulate form submission
        fetch('/submit-form', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            alert('Thank you for your message! We will respond shortly.');
            this.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was a problem submitting your message. Please try again.');
        });
    });
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

function toggleMenu() {
    navLinks?.classList.toggle('active');
    hamburger?.classList.toggle('active');
    hamburger?.setAttribute('aria-expanded', 
        navLinks?.classList.contains('active') ? 'true' : 'false'
    );
}

hamburger?.addEventListener('click', toggleMenu);

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
        navLinks?.classList.remove('active');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
    }
});

// Enhanced slider functionality
let currentSlide = 0;
let autoSlideInterval;
const slides = document.querySelectorAll('.slide-container');
const dotsContainer = document.querySelector('.pagination-dots');

function createDots() {
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.ariaLabel = `Go to slide ${index + 1}`;
        dot.addEventListener('click', () => showSlide(index));
        dotsContainer.appendChild(dot);
    });
}

function updateDots() {
    document.querySelectorAll('.dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function showSlide(n) {
    currentSlide = (n + slides.length) % slides.length;
    
    slides.forEach((slide, index) => {
        slide.style.display = index === currentSlide ? 'block' : 'none';
    });
    
    updateDots();
    resetAutoSlide();
}

function goNext() { showSlide(currentSlide + 1); }
function goPrev() { showSlide(currentSlide - 1); }

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(goNext, 8000); // Increased interval
}

// Initialize slider
if (slides.length > 0) {
    createDots();
    showSlide(0);
    
    // Accessibility features
    slides.forEach(slide => {
        slide.setAttribute('role', 'region');
        slide.setAttribute('aria-live', 'polite');
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goPrev();
        if (e.key === 'ArrowRight') goNext();
    });

    // Touch/swipe support
    let touchStartX = 0;
    const slider = document.querySelector('main');
    
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    slider.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            diff > 0 ? goNext() : goPrev();
        }
    });

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', resetAutoSlide);
}

// Responsive adjustments
function handleResize() {
    if (window.innerWidth > 768) {
        navLinks?.classList.remove('active');
        hamburger?.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
    }
    
    // Update slide heights if needed
    slides.forEach(slide => {
        slide.style.height = 'auto';
    });
}

window.addEventListener('resize', handleResize);
document.addEventListener('DOMContentLoaded', handleResize);
class GlitchText {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            speed: options.speed || 1,
            enableShadows: options.enableShadows !== undefined ? options.enableShadows : true,
            enableOnHover: options.enableOnHover !== undefined ? options.enableOnHover : true
        };
        
        this.init();
    }

    init() {
        // Set inline styles
        this.element.style.setProperty('--after-duration', `${this.options.speed * 3}s`);
        this.element.style.setProperty('--before-duration', `${this.options.speed * 2}s`);
        this.element.style.setProperty('--after-shadow', this.options.enableShadows ? '-5px 0 red' : 'none');
        this.element.style.setProperty('--before-shadow', this.options.enableShadows ? '5px 0 cyan' : 'none');

        // Add hover class if needed
        if (this.options.enableOnHover) {
            this.element.classList.add('enable-on-hover');
        }

        // Set data-text attribute if not already set
        if (!this.element.getAttribute('data-text')) {
            this.element.setAttribute('data-text', this.element.textContent);
        }
    }
}

// Initialize glitch effect on all elements with class 'glitch'
document.addEventListener('DOMContentLoaded', () => {
    // Find all spans within the navigation links for HerbVerse and Herbal Garden
    const spans = document.querySelectorAll('.nav-links a[href*="herbalgarden.html"] span, .nav-links a[href*="VR.html"] span');
    
    spans.forEach(span => {
        // Set the data-text attribute to match the text content
        if (!span.getAttribute('data-text')) {
            span.setAttribute('data-text', span.textContent);
        }
    });
}); 
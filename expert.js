// Expert Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Menu
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Change hamburger icon
            if (navMenu.classList.contains('active')) {
                hamburger.innerHTML = '✕';
            } else {
                hamburger.innerHTML = '☰';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.innerHTML = '☰';
            }
        });
    }
    
    // Initialize FAQ Toggle
    initFaqToggle();
    
    // Initialize Testimonial Slider
    initTestimonialSlider();
    
    // Initialize Season Tabs
    initSeasonTabs();
    
    // Form Validation
    initFormValidation();

    // Initialize button handlers
    initButtonHandlers();
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Handle links to other pages with hash
            if (targetId.includes('.html')) {
                window.location.href = targetId;
                return;
            }
            
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerOffset = 70; // Adjust this value according to your header height
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.innerHTML = '☰';
                }
            }
        });
    });
});

// Add click handlers for buttons
function initButtonHandlers() {
    // Add booking button handlers
    const bookingButtons = document.querySelectorAll('.remedy-btn, .expert-btn');
    bookingButtons.forEach(button => {
        if (!button.getAttribute('onclick')) {
            button.addEventListener('click', function() {
                if (button.classList.contains('expert-btn') && button.textContent.trim() === 'Submit Photos') {
                    openPhotoUpload();
                } else if (button.classList.contains('remedy-btn') && button.textContent.trim() === 'Submit Remedy') {
                    openRemedyReview();
                } else if (button.textContent.trim() === 'Book Consultation' || 
                          button.textContent.trim() === 'Book Session') {
                    scrollToBookingForm();
                }
            });
        }
    });
}

// Function to scroll to booking form
function scrollToBookingForm() {
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        const headerOffset = 70;
        const elementPosition = bookingForm.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Initialize Seasonal Tabs functionality
function initSeasonTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Hide all season panels
            const seasonPanels = document.querySelectorAll('.season-panel');
            seasonPanels.forEach(panel => panel.classList.remove('active'));
            
            // Show the selected season panel
            const season = button.getAttribute('data-season');
            const activePanel = document.getElementById(`${season}-panel`);
            
            if (activePanel) {
                activePanel.classList.add('active');
            }
        });
    });
    
    // Add missing content for other seasons
    fillSeasonContent();
}

// Fill content for the remaining seasons
function fillSeasonContent() {
    // Monsoon content
    const monsoonPanel = document.getElementById('monsoon-panel');
    if (monsoonPanel) {
        monsoonPanel.innerHTML = `
            <div class="season-info">
                <h3>Monsoon (Varsha Ritu)</h3>
                <p>The rainy season increases Vata and can disrupt Pitta. The damp, cool environment can lead to water and air element imbalances.</p>
                
                <h4>Recommended Herbs:</h4>
                <ul class="herb-list">
                    <li><strong>Ginger (Adrak)</strong> - Helps maintain digestive fire in damp weather</li>
                    <li><strong>Tulsi (Holy Basil)</strong> - Supports immunity during weather changes</li>
                    <li><strong>Turmeric (Haldi)</strong> - Antimicrobial properties help prevent infections</li>
                </ul>
                
                <h4>Lifestyle Tips:</h4>
                <ul class="tips-list">
                    <li>Favor warm, freshly cooked meals with mild spices</li>
                    <li>Avoid raw foods, leftovers, and excessive dairy</li>
                    <li>Keep living spaces dry and well-ventilated</li>
                    <li>Practice gentle yoga and breathing exercises indoors</li>
                </ul>
            </div>
        `;
    }
    
    // Autumn content
    const autumnPanel = document.getElementById('autumn-panel');
    if (autumnPanel) {
        autumnPanel.innerHTML = `
            <div class="season-info">
                <h3>Autumn (Sharad Ritu)</h3>
                <p>Autumn brings increased Vata with dry, cool, and windy qualities. This is a time when the body transitions from summer heat to winter cold.</p>
                
                <h4>Recommended Herbs:</h4>
                <ul class="herb-list">
                    <li><strong>Ashwagandha</strong> - Grounding adaptogen that helps manage seasonal transition</li>
                    <li><strong>Licorice (Mulethi)</strong> - Moistening herb that counteracts autumn dryness</li>
                    <li><strong>Cardamom (Elaichi)</strong> - Warming spice that supports digestion</li>
                </ul>
                
                <h4>Lifestyle Tips:</h4>
                <ul class="tips-list">
                    <li>Establish regular routines for meals, sleep, and exercise</li>
                    <li>Favor warm, moist, slightly oily foods with mild sweetness</li>
                    <li>Use warm oils for daily self-massage (abhyanga)</li>
                    <li>Stay hydrated with warm liquids throughout the day</li>
                </ul>
            </div>
        `;
    }
    
    // Winter content
    const winterPanel = document.getElementById('winter-panel');
    if (winterPanel) {
        winterPanel.innerHTML = `
            <div class="season-info">
                <h3>Winter (Hemanta Ritu)</h3>
                <p>Winter is characterized by cold, heavy, and static qualities that increase Kapha. The body's digestive fire is naturally stronger during this season.</p>
                
                <h4>Recommended Herbs:</h4>
                <ul class="herb-list">
                    <li><strong>Cinnamon (Dalchini)</strong> - Warming spice that supports circulation</li>
                    <li><strong>Ginger (Adrak)</strong> - Activates digestive fire and improves circulation</li>
                    <li><strong>Black Pepper (Kali Mirch)</strong> - Stimulates metabolism and creates internal warmth</li>
                </ul>
                
                <h4>Lifestyle Tips:</h4>
                <ul class="tips-list">
                    <li>Take advantage of stronger digestion by eating nourishing, hearty meals</li>
                    <li>Include warming spices in cooking: ginger, cinnamon, cloves</li>
                    <li>Stay active with regular exercise to counteract Kapha heaviness</li>
                    <li>Practice early rising to maximize daylight hours</li>
                </ul>
            </div>
        `;
    }
}

// FAQ toggle functionality
function initFaqToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('h3');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQs
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const icon = faq.querySelector('h3 i');
                if (icon) {
                    icon.className = 'fas fa-plus';
                }
            });
            
            // If the clicked item wasn't active before, open it
            if (!isActive) {
                item.classList.add('active');
                const icon = item.querySelector('h3 i');
                if (icon) {
                    icon.className = 'fas fa-minus';
                }
            }
        });
    });
}

// Testimonial slider functionality
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const prevButton = document.getElementById('prev-testimonial');
    const nextButton = document.getElementById('next-testimonial');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!testimonials.length || !dotsContainer) return;
    
    let currentIndex = 0;
    
    // Create dots for each testimonial
    testimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
        
        dotsContainer.appendChild(dot);
    });
    
    // Previous button click
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? testimonials.length - 1 : currentIndex - 1;
            showTestimonial(currentIndex);
        });
    }
    
    // Next button click
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex === testimonials.length - 1) ? 0 : currentIndex + 1;
            showTestimonial(currentIndex);
        });
    }
    
    // Function to show the selected testimonial
    function showTestimonial(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Show the selected testimonial
        testimonials[index].style.display = 'block';
        
        // Update dots
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Initialize the first testimonial
    if (testimonials.length > 0) {
        showTestimonial(0);
    }
    
    // Auto-rotate testimonials every 8 seconds
    let testimonialInterval = setInterval(() => {
        currentIndex = (currentIndex === testimonials.length - 1) ? 0 : currentIndex + 1;
        showTestimonial(currentIndex);
    }, 8000);
    
    // Pause rotation on hover
    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });
        
        testimonialSlider.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(() => {
                currentIndex = (currentIndex === testimonials.length - 1) ? 0 : currentIndex + 1;
                showTestimonial(currentIndex);
            }, 8000);
        });
    }
}

// Form validation
function initFormValidation() {
    const form = document.getElementById('consultation-form');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const date = document.getElementById('date');
        const concerns = document.getElementById('concerns');
        const terms = document.getElementById('terms');
        
        // Simple validation
        let isValid = true;
        
        if (!name.value.trim()) {
            highlightError(name);
            isValid = false;
        }
        
        if (!email.value.trim() || !isValidEmail(email.value)) {
            highlightError(email);
            isValid = false;
        }
        
        if (!phone.value.trim()) {
            highlightError(phone);
            isValid = false;
        }
        
        if (!date.value || !isValidDate(date.value)) {
            highlightError(date);
            isValid = false;
        }
        
        if (!concerns.value.trim()) {
            highlightError(concerns);
            isValid = false;
        }
        
        if (!terms.checked) {
            highlightError(terms.parentNode);
            isValid = false;
        }
        
        // If valid, show success message
        if (isValid) {
            showBookingSuccess();
        }
    });
    
    // Helper functions for validation
    function highlightError(element) {
        element.classList.add('error');
        element.addEventListener('input', function() {
            element.classList.remove('error');
        });
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function isValidDate(dateString) {
        const selectedDate = new Date(dateString);
        const today = new Date();
        
        // Clear time part for comparison
        today.setHours(0, 0, 0, 0);
        
        return selectedDate >= today;
    }
    
    function showBookingSuccess() {
        // Create success message container
        const successContainer = document.createElement('div');
        successContainer.className = 'booking-success';
        
        successContainer.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Appointment Request Received!</h3>
                <p>Thank you for requesting a consultation. We'll review your information and contact you within 24 hours to confirm your appointment.</p>
                <button class="remedy-btn">Close</button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(successContainer);
        
        // Add close functionality
        successContainer.querySelector('button').addEventListener('click', function() {
            successContainer.remove();
            form.reset();
        });
    }
}

// Modal functions for photo upload and remedy review
function openPhotoUpload() {
    createModal('Plant Identification', `
        <div class="upload-info">
            <p>Submit clear photos of the medicinal plants you want to identify. Our experts will analyze them and provide detailed information about their properties and uses.</p>
        </div>
        
        <div class="upload-area" id="upload-drop-area">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Drag & drop photos here</p>
            <p>or</p>
            <label for="plant-photos" class="file-label">Browse Files</label>
            <input type="file" id="plant-photos" accept="image/*" multiple style="display: none;">
        </div>
        
        <div class="uploaded-photos" id="uploaded-photos"></div>
        
        <div class="form-group">
            <label for="photo-notes">Additional Information</label>
            <textarea id="photo-notes" placeholder="Include any details about the plant's location, size, smell, or other characteristics..."></textarea>
        </div>
        
        <button class="remedy-btn" id="submit-photos">Submit for Identification</button>
    `);
    
    // Setup photo upload functionality
    setupPhotoUpload();
}

function openRemedyReview() {
    createModal('Remedy Review', `
        <div class="upload-info">
            <p>Share details about your herbal remedy for expert evaluation. Our specialists will review the ingredients, preparation method, and provide feedback on safety and effectiveness.</p>
        </div>
        
        <div class="form-group">
            <label for="remedy-name">Remedy Name</label>
            <input type="text" id="remedy-name" placeholder="E.g., Tulsi-Ginger Tea, Triphala Mixture, etc.">
        </div>
        
        <div class="form-group">
            <label for="remedy-ingredients">Ingredients</label>
            <textarea id="remedy-ingredients" placeholder="List all herbs and ingredients with approximate quantities..."></textarea>
        </div>
        
        <div class="form-group">
            <label for="remedy-preparation">Preparation Method</label>
            <textarea id="remedy-preparation" placeholder="Describe how you prepare the remedy..."></textarea>
        </div>
        
        <div class="form-group">
            <label for="remedy-usage">How You're Using It</label>
            <textarea id="remedy-usage" placeholder="Explain how often you take it, dosage, timing, etc..."></textarea>
        </div>
        
        <div class="upload-area small">
            <i class="fas fa-image"></i>
            <p>Optionally add photos of your remedy</p>
            <label for="remedy-photos" class="file-label">Add Photos</label>
            <input type="file" id="remedy-photos" accept="image/*" multiple style="display: none;">
        </div>
        
        <button class="remedy-btn" id="submit-remedy">Submit for Review</button>
    `);
    
    // Setup remedy form submission
    document.getElementById('submit-remedy').addEventListener('click', function() {
        showSubmissionSuccess('Remedy Review');
    });
}

// Helper function to create modals
function createModal(title, content) {
    // Check if modal already exists
    if (document.querySelector('.modal-container')) {
        document.querySelector('.modal-container').remove();
    }
    
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    
    modalContainer.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-leaf"></i> ${title}</h2>
                <button class="close-btn" aria-label="Close modal"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modalContainer);
    
    // Close modal functionality
    modalContainer.querySelector('.close-btn').addEventListener('click', closeModal);
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
    
    // Animate modal entry - ensure it's visible
    modalContainer.style.opacity = '0';
    setTimeout(() => {
        modalContainer.style.opacity = '1';
    }, 10);
}

function closeModal() {
    const modalContainer = document.querySelector('.modal-container');
    
    if (modalContainer) {
        modalContainer.classList.add('closing');
        
        setTimeout(() => {
            modalContainer.remove();
        }, 300);
    }
}

// Photo upload functionality
function setupPhotoUpload() {
    const dropArea = document.getElementById('upload-drop-area');
    const fileInput = document.getElementById('plant-photos');
    const previewContainer = document.getElementById('uploaded-photos');
    const submitButton = document.getElementById('submit-photos');
    
    if (!dropArea || !fileInput || !previewContainer || !submitButton) return;
    
    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop area when dragging over it
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.add('highlight');
        });
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => {
            dropArea.classList.remove('highlight');
        });
    });
    
    // Handle dropped files
    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });
    
    // Handle file selection through input
    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });
    
    // Make the entire drop area clickable to open file browser
    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    function handleFiles(files) {
        if (!files.length) return;
        
        // Display previews
        for (let i = 0; i < files.length; i++) {
            if (!files[i].type.match('image.*')) continue;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'uploaded-img-container';
                
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" class="uploaded-img" alt="Uploaded plant">
                    <button class="remove-img"><i class="fas fa-times"></i></button>
                `;
                
                previewContainer.appendChild(imgContainer);
                
                // Remove image functionality
                imgContainer.querySelector('.remove-img').addEventListener('click', function() {
                    imgContainer.remove();
                });
            };
            
            reader.readAsDataURL(files[i]);
        }
    }
    
    // Submit button action
    submitButton.addEventListener('click', function() {
        // Check if any images were uploaded
        if (previewContainer.children.length === 0) {
            alert('Please upload at least one image of your plant.');
            return;
        }
        // In a real app, you would upload the files to a server here
        showSubmissionSuccess('Plant Identification');
    });
}

// Success message after submission
function showSubmissionSuccess(type) {
    // Close the current modal
    closeModal();
    
    // Create success modal
    setTimeout(() => {
        createModal('Submission Successful', `
            <div class="modal-body success-body">
                <i class="fas fa-check-circle"></i>
                <h3>Your ${type} Request Was Submitted!</h3>
                <p>Our Ayurvedic experts will review your submission and respond within 48-72 hours. You'll receive an email notification when your results are ready.</p>
                <button class="remedy-btn" onclick="closeModal()">Close</button>
            </div>
        `);
    }, 400);
}

// Expose these functions to global scope for onclick handlers
window.openPhotoUpload = openPhotoUpload;
window.openRemedyReview = openRemedyReview;
window.closeModal = closeModal;

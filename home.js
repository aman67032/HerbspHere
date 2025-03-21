// Mobile Navigation Menu
document.addEventListener('DOMContentLoaded', function() {
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
});

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

// Function to verify images are loaded and fix any loading issues
function verifySliderImages() {
    if (!slides || slides.length === 0) return;
    
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img.slide');
        if (img) {
            // Force image to be visible
            img.style.opacity = '1';
            img.style.display = 'block';
            
            // Log image loading status
            console.log(`Slide ${index + 1} image: ${img.src} - ${img.complete ? 'loaded' : 'loading'}`);
            
            // Force load check
            if (!img.complete) {
                img.onload = function() {
                    console.log(`Slide ${index + 1} image loaded successfully`);
                    img.style.opacity = '1';
                    img.style.display = 'block';
                };
                
                img.onerror = function() {
                    console.error(`Failed to load image in slide ${index + 1}: ${img.src}`);
                    // Set background color as fallback
                    slide.style.backgroundColor = 'rgba(46, 125, 50, 0.3)';
                };
            }
            
            // Make sure image is fully loaded
            if (img.complete) {
                img.style.opacity = '1';
                img.style.display = 'block';
            }
        } else {
            console.error(`No image found in slide ${index + 1}`);
        }
    });
}

function createDots() {
    if (!dotsContainer) return;
    
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
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
    if (!slides || slides.length === 0) return;
    
    currentSlide = (n + slides.length) % slides.length;
    
    // Hide all slides
    slides.forEach(slide => {
        slide.style.display = 'none';
        const slideImg = slide.querySelector('.slide');
        if (slideImg) {
            slideImg.classList.remove('active');
        }
    });
    
    // Show the current slide
    slides[currentSlide].style.display = 'block';
    const currentImg = slides[currentSlide].querySelector('.slide');
    if (currentImg) {
        currentImg.classList.add('active');
        currentImg.style.opacity = '1';
        currentImg.style.display = 'block';
        
        // Make sure image is loaded
        if (!currentImg.complete) {
            currentImg.onload = function() {
                currentImg.style.opacity = '1';
                currentImg.style.display = 'block';
            };
        }
    }
    
    // Debug log for current slide
    console.log(`Displaying slide ${currentSlide + 1}`);
    
    updateDots();
    resetAutoSlide();
}

function goNext() { showSlide(currentSlide + 1); }
function goPrev() { showSlide(currentSlide - 1); }

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(goNext, 8000); // Increased interval
}

// Initialize slider when DOM is loaded 
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing slider');
    
    // Check if slides exist before initializing
    if (slides && slides.length > 0) {
        console.log(`Found ${slides.length} slides`);
        createDots();
        verifySliderImages();
        
        // Set up event listeners for navigation buttons
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');
        
        if (prevButton) prevButton.addEventListener('click', goPrev);
        if (nextButton) nextButton.addEventListener('click', goNext);
        
        // Initialize the first slide
        showSlide(0);
    } else {
        console.error('No slides found in the document');
    }
});

// Make sure the slider is initialized only after all images are loaded
window.addEventListener('load', function() {
    console.log('Window fully loaded - Reinitializing slider');
    
    // Initialize slider
    if (slides && slides.length > 0) {
        // Pre-force all images to be visible first
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img.slide');
            if (img) {
                img.style.opacity = '1';
                img.style.display = 'block';
            }
        });
        
        // Verify all images again after window load
        verifySliderImages();
        
        // Reset to first slide to ensure proper display after full page load
        showSlide(0);
        
        // Set up all accessibility and interactive features
        slides.forEach((slide) => {
            // Set attributes for accessibility
            slide.setAttribute('role', 'region');
            slide.setAttribute('aria-live', 'polite');
        });

        // Prevent slide change when clicking caption links
        document.querySelectorAll('.caption-text a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering parent click events
            });
        });
        
        // Make entire slide areas clickable
        makeSliderAreasClickable();

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        });

        // Touch/swipe support
        let touchStartX = 0;
        const slider = document.querySelector('main');
        
        if (slider) {
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
        
        // Start automatic slideshow
        resetAutoSlide();
    }
});

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

// Remedy Formulation Feature
function openRemedyFormulation() {
    // Check if modal already exists to prevent duplicates
    if (document.querySelector('.remedy-modal-container')) {
        document.querySelector('.remedy-modal-container').classList.add('active');
        return;
    }
    
    // Create modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'remedy-modal-container';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'remedy-modal-content';
    
    // Modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'remedy-modal-header';
    modalHeader.innerHTML = `
        <h2><i class="fas fa-mortar-pestle"></i> Personalized Herbal Remedy</h2>
        <button class="remedy-close-btn" aria-label="Close modal"><i class="fas fa-times"></i></button>
    `;
    
    // Modal body
    const modalBody = document.createElement('div');
    modalBody.className = 'remedy-modal-body';
    modalBody.innerHTML = `
        <form id="remedy-form">
            <div class="form-group">
                <label for="health-concern">What health concern would you like to address?</label>
                <select id="health-concern" required>
                    <option value="">Select your health concern</option>
                    <option value="digestion">Digestive Issues</option>
                    <option value="stress">Stress & Anxiety</option>
                    <option value="immunity">Immunity Support</option>
                    <option value="sleep">Sleep Problems</option>
                    <option value="skin">Skin Conditions</option>
                    <option value="pain">Pain & Inflammation</option>
                    <option value="respiratory">Respiratory Issues</option>
                    <option value="other">Other</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="symptoms">Describe your symptoms</label>
                <textarea id="symptoms" rows="3" placeholder="List your symptoms here..."></textarea>
            </div>
            
            <div class="form-group">
                <label for="duration">How long have you experienced these symptoms?</label>
                <select id="duration">
                    <option value="recent">Recently (days)</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="chronic">Chronic (years)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Do you have any allergies or sensitivities?</label>
                <div class="checkbox-group">
                    <div class="checkbox-item">
                        <input type="checkbox" id="allergy-nuts" name="allergies" value="nuts">
                        <label for="allergy-nuts">Nuts</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="allergy-pollen" name="allergies" value="pollen">
                        <label for="allergy-pollen">Pollen</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="allergy-gluten" name="allergies" value="gluten">
                        <label for="allergy-gluten">Gluten</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" id="allergy-none" name="allergies" value="none">
                        <label for="allergy-none">None</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label for="preparation">Preferred preparation method</label>
                <select id="preparation">
                    <option value="tea">Herbal Tea</option>
                    <option value="tincture">Tincture</option>
                    <option value="powder">Powder/Capsules</option>
                    <option value="oil">Oils/Salves</option>
                    <option value="any">Any recommendation</option>
                </select>
            </div>
            
            <button type="submit" class="remedy-submit-btn">Generate Recommendation</button>
        </form>
        
        <div id="remedy-result" style="display: none;">
            <!-- Results will be generated by JavaScript -->
        </div>
    `;
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    document.querySelector('.remedy-close-btn').addEventListener('click', function() {
        modalContainer.classList.remove('active');
    });
    
    document.querySelector('#remedy-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const healthConcern = document.querySelector('#health-concern').value;
        const symptoms = document.querySelector('#symptoms').value;
        const duration = document.querySelector('#duration').value;
        const allergyCheckboxes = document.querySelectorAll('input[name="allergies"]:checked');
        const allergies = Array.from(allergyCheckboxes).map(cb => cb.value);
        const preparationPreference = document.querySelector('#preparation').value;
        
        // Generate recommendation based on inputs
        generateRemedyRecommendation(healthConcern, symptoms, duration, allergies, preparationPreference);
    });
    
    // Show modal with animation
    setTimeout(() => {
        modalContainer.classList.add('active');
    }, 10);
    
    // Close on click outside
    modalContainer.addEventListener('click', function(e) {
        if (e.target === modalContainer) {
            modalContainer.classList.remove('active');
        }
    });
}

// Generate remedy recommendations based on user inputs
function generateRemedyRecommendation(healthConcern, symptoms, duration, allergies, preparationPreference) {
    // Get result container
    const resultContainer = document.getElementById('remedy-result');
    
    // Check if all required fields are filled
    if (!healthConcern) {
        alert('Please select a health concern');
        return;
    }
    
    // Hide form and show results
    document.getElementById('remedy-form').style.display = 'none';
    resultContainer.style.display = 'block';
    
    // Create results structure if it doesn't exist
    if (!resultContainer.querySelector('.result-header')) {
        resultContainer.innerHTML = `
            <div class="result-header">
                <h3>Your Personalized Herbal Remedy</h3>
                <p><small>Based on your selected health concern and symptoms</small></p>
            </div>
            <div class="herbs-recommended">
                <h4>Recommended Herbs:</h4>
                <ul id="herbs-list"></ul>
            </div>
            <div class="preparation-method">
                <h4>Preparation Method:</h4>
                <div id="preparation-instructions"></div>
            </div>
            <div class="usage-instructions">
                <h4>Usage Instructions:</h4>
                <div id="usage-details"></div>
            </div>
            <div class="disclaimer">
                <p><strong>Disclaimer:</strong> This is a general recommendation based on traditional herbal medicine. Always consult with a healthcare professional before starting any new herbal remedy, especially if you have pre-existing health conditions or are taking medications.</p>
            </div>
            <div class="button-group">
                <button id="new-remedy-btn" class="remedy-btn secondary">Create Another Remedy</button>
                <button id="save-remedy-btn" class="remedy-btn">Save This Remedy</button>
            </div>
        `;
        
        // Add event listeners for new buttons
        document.getElementById('new-remedy-btn').addEventListener('click', function() {
            document.getElementById('remedy-form').style.display = 'flex';
            resultContainer.style.display = 'none';
        });
        
        document.getElementById('save-remedy-btn').addEventListener('click', function() {
            alert('Remedy saved to your account!');
        });
    }
    
    // Get elements to update
    const herbsList = document.getElementById('herbs-list');
    const preparationInstructions = document.getElementById('preparation-instructions');
    const usageDetails = document.getElementById('usage-details');
    
    // Clear previous results
    herbsList.innerHTML = '';
    preparationInstructions.innerHTML = '';
    usageDetails.innerHTML = '';
    
    // Herb recommendations based on health concern (simplified for demo)
    const herbRecommendations = {
        'digestion': [
            { name: 'Ginger (Zingiber officinale)', benefits: 'Soothes digestive discomfort, reduces bloating, and improves overall digestive function.' },
            { name: 'Peppermint (Mentha piperita)', benefits: 'Relieves indigestion, gas, and intestinal spasms.' },
            { name: 'Fennel (Foeniculum vulgare)', benefits: 'Reduces bloating and acts as a gentle digestive aid.' }
        ],
        'stress': [
            { name: 'Ashwagandha (Withania somnifera)', benefits: 'Adaptogenic herb that helps the body resist physical and mental stress.' },
            { name: 'Holy Basil/Tulsi (Ocimum sanctum)', benefits: 'Calms the mind and supports healthy stress response.' },
            { name: 'Lavender (Lavandula angustifolia)', benefits: 'Promotes relaxation and eases nervous tension.' }
        ],
        'immunity': [
            { name: 'Echinacea (Echinacea purpurea)', benefits: 'Stimulates the immune system and reduces severity of infections.' },
            { name: 'Elderberry (Sambucus nigra)', benefits: 'Supports immune function and has antiviral properties.' },
            { name: 'Astragalus (Astragalus membranaceus)', benefits: 'Strengthens the immune system and increases resistance to illness.' }
        ],
        'sleep': [
            { name: 'Valerian (Valeriana officinalis)', benefits: 'Natural sedative that improves sleep quality.' },
            { name: 'Chamomile (Matricaria chamomilla)', benefits: 'Gentle herb that promotes relaxation and better sleep.' },
            { name: 'Passionflower (Passiflora incarnata)', benefits: 'Reduces anxiety and improves sleep quality.' }
        ],
        'pain': [
            { name: 'Turmeric (Curcuma longa)', benefits: 'Powerful anti-inflammatory herb with numerous health benefits.' },
            { name: 'Ginger (Zingiber officinale)', benefits: 'Reduces inflammation and alleviates pain.' },
            { name: 'Boswellia (Boswellia serrata)', benefits: 'Natural anti-inflammatory that helps manage chronic inflammation.' }
        ],
        'respiratory': [
            { name: 'Thyme (Thymus vulgaris)', benefits: 'Expectorant properties that help clear congestion.' },
            { name: 'Mullein (Verbascum thapsus)', benefits: 'Soothes irritated respiratory tissues and alleviates coughing.' },
            { name: 'Eucalyptus (Eucalyptus globulus)', benefits: 'Opens up the airways and helps clear congestion.' }
        ],
        'skin': [
            { name: 'Calendula (Calendula officinalis)', benefits: 'Soothes and heals skin irritations, wounds, and inflammation.' },
            { name: 'Aloe Vera (Aloe barbadensis)', benefits: 'Moisturizes and soothes skin conditions like burns and eczema.' },
            { name: 'Chamomile (Matricaria chamomilla)', benefits: 'Anti-inflammatory and antimicrobial properties for skin conditions.' }
        ],
        'other': [
            { name: 'Milk Thistle (Silybum marianum)', benefits: 'Supports liver health and detoxification.' },
            { name: 'Dandelion (Taraxacum officinale)', benefits: 'Gentle diuretic and liver support.' },
            { name: 'Lemon Balm (Melissa officinalis)', benefits: 'Calming herb with antiviral properties.' }
        ]
    };
    
    // Preparation methods
    const preparationMethods = {
        'tea': {
            method: 'Herbal Tea Infusion',
            instructions: `
                <ol>
                    <li>Bring 8 oz of filtered water to a boil.</li>
                    <li>Add 1-2 teaspoons of dried herbs to a tea infuser or teapot.</li>
                    <li>Pour hot water over herbs and cover.</li>
                    <li>Let steep for 5-10 minutes (depending on desired strength).</li>
                    <li>Strain and enjoy. May add honey or lemon if desired.</li>
                </ol>
            `,
            usage: 'Drink 1-3 cups daily, ideally between meals. Best consumed warm.'
        },
        'tincture': {
            method: 'Herbal Tincture',
            instructions: `
                <p>For best results, use a pre-made tincture from a reputable source.</p>
                <p>If making at home (requires time):</p>
                <ol>
                    <li>Fill a clean glass jar 1/3 to 1/2 with dried herbs.</li>
                    <li>Cover completely with 80-100 proof alcohol (vodka works well).</li>
                    <li>Seal tightly and store in a cool, dark place.</li>
                    <li>Shake daily for 4-6 weeks.</li>
                    <li>Strain through cheesecloth and store in dark glass bottles.</li>
                </ol>
            `,
            usage: 'Take 20-30 drops (approximately 1/4 teaspoon) in a small amount of water, 2-3 times daily.'
        },
        'powder': {
            method: 'Powdered Herb',
            instructions: `
                <p>Purchase high-quality ground herb powder or grind dried herbs in a dedicated spice/coffee grinder until fine.</p>
            `,
            usage: 'Mix 1/2 to 1 teaspoon of powder in water, juice, or food (like smoothies, oatmeal, or yogurt). Take once or twice daily.'
        },
        'compress': {
            method: 'Herbal Compress/Poultice',
            instructions: `
                <ol>
                    <li>Prepare a strong herbal infusion by steeping 2 tablespoons of herbs in 1 cup of hot water for 10-15 minutes.</li>
                    <li>Strain the liquid, saving both the liquid and the herbs.</li>
                    <li>Soak a clean cloth in the warm liquid.</li>
                    <li>Apply the cloth to the affected area.</li>
                    <li>Optionally, you can also apply the strained herbs directly to the skin and cover with the cloth for a poultice.</li>
                </ol>
            `,
            usage: 'Apply to affected area for 20-30 minutes, 1-3 times daily. Can be used warm or cool depending on the condition.'
        },
        'oil': {
            method: 'Herbal Oil Infusion',
            instructions: `
                <ol>
                    <li>Fill a clean, dry glass jar 1/3 to 1/2 full with dried herbs.</li>
                    <li>Cover completely with a carrier oil (such as olive, coconut, or jojoba oil).</li>
                    <li>Seal the jar and place in a sunny windowsill.</li>
                    <li>Shake daily for 2-4 weeks.</li>
                    <li>Strain through cheesecloth and store in dark glass bottles.</li>
                </ol>
                <p>Alternatively, use a quicker method:</p>
                <ol>
                    <li>Place herbs and oil in a double boiler.</li>
                    <li>Heat on low for 2-3 hours, ensuring oil doesn't overheat.</li>
                    <li>Strain and bottle while still warm.</li>
                </ol>
            `,
            usage: 'Apply a small amount to the affected area 1-3 times daily. For massage oils, use as needed.'
        }
    };
    
    // Get recommendations based on health concern
    const recommendedHerbs = herbRecommendations[healthConcern] || [];
    
    // Display herbs
    recommendedHerbs.forEach(herb => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${herb.name}</strong>: ${herb.benefits}`;
        herbsList.appendChild(li);
    });
    
    // Display preparation method
    const preparation = preparationMethods[preparationPreference] || preparationMethods.tea;
    preparationInstructions.innerHTML = `
        <h5>${preparation.method}</h5>
        ${preparation.instructions}
    `;
    
    // Display usage details
    usageDetails.innerHTML = `<p>${preparation.usage}</p>`;
    
    // Add any modifiers based on symptoms
    if (symptoms.includes('pain') || symptoms.includes('inflammation')) {
        const tip = document.createElement('div');
        tip.className = 'usage-tip';
        tip.innerHTML = `<p><strong>For pain/inflammation:</strong> Consider adding turmeric and ginger to enhance anti-inflammatory benefits.</p>`;
        usageDetails.appendChild(tip);
    }
    
    if (symptoms.includes('fatigue')) {
        const tip = document.createElement('div');
        tip.className = 'usage-tip';
        tip.innerHTML = `<p><strong>For fatigue:</strong> Best taken in the morning to support energy levels throughout the day.</p>`;
        usageDetails.appendChild(tip);
    }
    
    if (symptoms.includes('insomnia')) {
        const tip = document.createElement('div');
        tip.className = 'usage-tip';
        tip.innerHTML = `<p><strong>For insomnia:</strong> Take 30-60 minutes before bedtime for optimal sleep support.</p>`;
        usageDetails.appendChild(tip);
    }
    
    // Duration-based advice
    if (duration === 'long') {
        const tip = document.createElement('div');
        tip.className = 'usage-tip important';
        tip.innerHTML = `<p><strong>Important:</strong> For long-term issues (3+ months), we recommend consulting with an herbal practitioner for a more tailored approach.</p>`;
        usageDetails.appendChild(tip);
    }
    
    // Allergy warning if needed
    if (allergies && allergies.length > 0) {
        const warning = document.createElement('div');
        warning.className = 'allergy-warning';
        warning.innerHTML = `<p><strong>Note:</strong> You indicated potential allergies to "${allergies.join(', ')}". Please ensure none of the recommended herbs cross-react with your known allergies.</p>`;
        usageDetails.appendChild(warning);
    }
}

// Make entire slides clickable to navigate
function makeSliderAreasClickable() {
    slides.forEach(slide => {
        const captionLink = slide.querySelector('.caption-text a');
        if (captionLink) {
            const href = captionLink.getAttribute('href');
            
            // Make the entire slide container (except navigation elements) clickable
            slide.style.cursor = 'pointer';
            slide.addEventListener('click', (e) => {
                // Don't trigger if clicking on navigation elements
                if (!e.target.closest('.nav') && !e.target.closest('.pagination-dots')) {
                    if (href.startsWith('#')) {
                        // For anchor links, use smooth scrolling
                        e.preventDefault();
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    } else {
                        // For page links, navigate to the page
                        window.location.href = href;
                    }
                }
            });
        }
    });
}
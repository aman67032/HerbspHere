document.addEventListener('DOMContentLoaded', () => {
    // Modal functionality
    const modal = document.getElementById('filterModal');
    const filterBtn = document.getElementById('filterBtn');
    const closeBtn = document.querySelector('.close');
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    let activeFilters = 0;

    // Make 3D models visible by default and add interactive behavior
    document.querySelectorAll('model-viewer').forEach(modelViewer => {
        modelViewer.style.display = 'block';
        
        // Add click event to model viewers for better interaction
        modelViewer.addEventListener('click', function() {
            setTimeout(() => {
                this.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        });
    });

    // Mobile Navigation Toggle
    if (hamburgerMenu && navMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerMenu.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburgerMenu.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburgerMenu.innerHTML = '☰';
            }
        });
    }

    // Simple notification function
    function showNotification(message) {
        // Check if notification already exists and remove it
        const existingNotification = document.querySelector('.search-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'search-notification';
        notification.textContent = message;
        
        // Add notification to the document
        document.body.appendChild(notification);
        
        // Animate notification
        setTimeout(() => notification.classList.add('active'), 10);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Modal controls
    if (filterBtn && modal) {
        filterBtn.addEventListener('click', () => {
            modal.style.display = "block";
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburgerMenu.innerHTML = '☰';
            }
        });
        
    closeBtn.addEventListener('click', () => modal.style.display = "none");
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    // Decision-specific input
    const decisionSelect = document.getElementById('decision-name');
    if (decisionSelect) {
        decisionSelect.addEventListener('change', function() {
        document.getElementById('decision-specific').style.display = this.value ? 'block' : 'none';
    });
    }

    // Filter application
    if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetFilters);
    }

    function applyFilters() {
        modal.style.display = "none";
        const filters = {
            name: document.getElementById('filter-name').value.toLowerCase(),
            medicinal: Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(cb => cb.value),
            decision: document.getElementById('decision-name').value,
            region: document.getElementById('region').value,
            growth: Array.from(document.querySelectorAll('[data-filter="growth"] input:checked')).map(cb => cb.value)
        };
        
        let visibleCount = 0;
        document.querySelectorAll('.model-container').forEach(plant => {
            const plantData = {
                name: plant.querySelector('h3').textContent.toLowerCase(),
                medicinal: plant.dataset.medicinal?.split(',') || [],
                decision: plant.dataset.decision?.split(',') || [],
                region: plant.dataset.region || '',
                growth: plant.dataset.growth || ''
            };
            
            const visible = Object.entries(filters).every(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return true;
                if (key === 'medicinal') return value.some(v => plantData.medicinal.includes(v));
                if (key === 'decision') return plantData.decision.includes(value);
                if (key === 'growth') return value.includes(plantData.growth);
                return plantData[key].includes(value);
            });
            
            plant.style.display = visible ? 'flex' : 'none';
            if (visible) visibleCount++;
        });
        
        updateFilterBadge(filters);
        
        // Show notification with filter results
        const activeFilterCount = Object.values(filters).filter(v => 
            Array.isArray(v) ? v.length > 0 : Boolean(v)
        ).length;
        
        if (activeFilterCount > 0) {
            showNotification(`Found ${visibleCount} plant${visibleCount !== 1 ? 's' : ''} with selected filters`);
        }
        
        // Smooth scroll to plants section
        document.getElementById('plants').scrollIntoView({ behavior: 'smooth' });
    }

    function resetFilters() {
        document.querySelectorAll('.modal input, .modal select').forEach(el => {
            if (el.type === 'checkbox') el.checked = false;
            else if (el.tagName === 'SELECT') el.selectedIndex = 0;
            else el.value = '';
        });
        
        // Hide decision specific input
        document.getElementById('decision-specific').style.display = 'none';
        
        applyFilters();
    }

    function updateFilterBadge(filters) {
        activeFilters = Object.values(filters).filter(v => 
            Array.isArray(v) ? v.length > 0 : Boolean(v)
        ).length;
        
        const badge = document.querySelector('.filter-badge');
        if (badge) {
            badge.textContent = activeFilters;
            badge.style.display = activeFilters > 0 ? 'flex' : 'none';
        }
    }

    // Search functionality in the search section
    window.searchPlants = function() {
        const input = document.getElementById('search-input').value.toLowerCase();
        if (!input.trim()) return;
        
        const results = Array.from(document.querySelectorAll('.model-container'))
            .filter(plant => {
                const plantName = plant.querySelector('h3').textContent.toLowerCase();
                const plantTexts = Array.from(plant.querySelectorAll('p')).map(p => p.textContent.toLowerCase());
                return plantName.includes(input) || plantTexts.some(text => text.includes(input));
            });
        
        const resultsContainer = document.getElementById('search-results');
        
        if (results.length) {
            resultsContainer.innerHTML = results.map(plant => {
                const plantName = plant.querySelector('h3').textContent;
                return `<div class="result-item">
                    <a href="#${plant.id}" onclick="scrollToPlant('${plant.id}')">${plantName}</a>
                </div>`;
            }).join('');
        } else {
            resultsContainer.innerHTML = '<div class="no-results">🌿 No plants found matching your search</div>';
        }
        
        // Show all plants after search
        document.querySelectorAll('.model-container').forEach(plant => {
            plant.style.display = 'flex';
        });
    }

    window.scrollToPlant = function(id) {
        const plant = document.getElementById(id);
        if (plant) {
            // Hide other plants
            document.querySelectorAll('.model-container').forEach(p => {
                p.style.display = p.id === id ? 'flex' : 'none';
            });
            
            // Scroll to the plant
            plant.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Highlight the plant
            plant.style.boxShadow = '0 0 0 3px var(--primary-green), 0 10px 30px rgba(0, 0, 0, 0.15)';
            setTimeout(() => {
                plant.style.boxShadow = '';
            }, 2000);
            
            // Show notification
            showNotification(`Viewing "${plant.querySelector('h3').textContent}"`);
        }
    }
    
    // Add CSS for the notification
    const style = document.createElement('style');
    style.textContent = `
        .search-notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-green);
            color: white;
            padding: 12px 24px;
            border-radius: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transition: bottom 0.3s ease;
            font-weight: 500;
        }
        
        .search-notification.active {
            bottom: 30px;
        }
    `;
    document.head.appendChild(style);
    
    // Plant details database for popups
    const plantDetailsData = {
        'tulsi': {
            title: 'Tulsi (Ocimum sanctum)',
            description: 'Tulsi, also known as Holy Basil, is one of the most sacred plants in India. It is widely used in Ayurvedic medicine for its exceptional healing properties.',
            medicinalProperties: [
                'Adaptogenic - helps body cope with stress',
                'Antibacterial - fights against infections',
                'Antiviral - helps combat viral infections',
                'Anti-inflammatory - reduces inflammation',
                'Antioxidant - protects cells from damage',
                'Immunomodulatory - enhances immune system function'
            ],
            preparationMethods: [
                '<strong>Tulsi Tea:</strong> Infuse 1-2 teaspoons of dried tulsi leaves in hot water for 5-10 minutes. Can be consumed 2-3 times daily.',
                '<strong>Tulsi Tincture:</strong> Made by steeping tulsi leaves in alcohol. Used for respiratory conditions.',
                '<strong>Fresh Leaves:</strong> Can be chewed daily for general wellness and immunity.'
            ],
            medicalApplications: 'Commonly used for treating respiratory conditions like bronchitis, asthma, and cold. Also beneficial for reducing stress, anxiety, and normalizing blood glucose and blood pressure levels.',
            researchLink: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4296439/'
        },
        'ashwagandha': {
            title: 'Ashwagandha (Withania somnifera)',
            description: 'Ashwagandha is one of the most important herbs in Ayurveda, used for thousands of years to relieve stress, increase energy, and improve concentration.',
            medicinalProperties: [
                'Adaptogenic - reduces stress and anxiety',
                'Anti-inflammatory - helps reduce inflammation',
                'Immune-boosting - enhances immune system function',
                'Neuroprotective - supports brain health',
                'Anti-insomnia - promotes better sleep quality'
            ],
            preparationMethods: [
                '<strong>Ashwagandha Powder:</strong> 1-2 teaspoons (3-6 grams) mixed with warm milk and honey, taken before bedtime.',
                '<strong>Root Decoction:</strong> Boil 1 teaspoon of ashwagandha root in 1 cup of water for 10 minutes, strain and drink.',
                '<strong>Ashwagandha Ghee:</strong> Prepared by cooking the herb in clarified butter for rejuvenation.'
            ],
            medicalApplications: 'Primarily used for stress reduction, improving memory and cognition, reducing inflammation, boosting male fertility, and supporting immune function. Also shows promise in treating neurodegenerative diseases.',
            researchLink: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3573577/'
        },
        'turmeric': {
            title: 'Turmeric (Curcuma longa)',
            description: 'Turmeric has been used in India for thousands of years as both a spice and medicinal herb. Its primary active component, curcumin, has powerful anti-inflammatory and antioxidant properties.',
            medicinalProperties: [
                'Anti-inflammatory - powerful natural inflammation blocker',
                'Antioxidant - neutralizes free radicals',
                'Antibacterial - natural antimicrobial agent',
                'Digestive Aid - improves digestion',
                'Hepatoprotective - supports liver function',
                'Anti-arthritic - helps manage arthritis symptoms'
            ],
            preparationMethods: [
                '<strong>Golden Milk:</strong> Mix 1 teaspoon of turmeric powder with warm milk and honey, add a pinch of black pepper to increase absorption.',
                '<strong>Turmeric Paste:</strong> Mix turmeric powder with water to form a paste for external application on skin conditions.',
                '<strong>Turmeric Tea:</strong> Simmer 1 teaspoon of turmeric in 4 cups of water for 10 minutes, strain and add lemon.',
                '<strong>Turmeric Capsules:</strong> Standardized extracts available for therapeutic use.'
            ],
            medicalApplications: 'Used to treat inflammatory conditions like arthritis, digestive disorders, skin conditions, and liver problems. Research shows potential benefits for heart disease, Alzheimer\'s, and cancer prevention. Enhanced absorption when consumed with black pepper.',
            researchLink: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5664031/'
        },
        'cinnamon': {
            title: 'Cinnamon (Cinnamomum verum)',
            description: 'True Cinnamon or Ceylon Cinnamon is a highly prized spice with a delicate flavor and numerous health benefits. It has been used in traditional medicine for centuries.',
            medicinalProperties: [
                'Antidiabetic - helps regulate blood sugar levels',
                'Anti-inflammatory - reduces inflammation',
                'Antimicrobial - effective against bacteria and fungi',
                'Antioxidant - high in protective compounds',
                'Cardiovascular benefits - may reduce blood pressure and cholesterol',
                'Digestive aid - relieves digestive discomfort'
            ],
            preparationMethods: [
                '<strong>Cinnamon Tea:</strong> Steep 1-2 cinnamon sticks in hot water for 10-15 minutes.',
                '<strong>Cinnamon Powder:</strong> 1/2 to 1 teaspoon daily mixed with food or beverages.',
                '<strong>Infused Oil:</strong> Cinnamon essential oil diluted in carrier oil for external application.',
                '<strong>Cinnamon Honey:</strong> Mix ground cinnamon with honey for colds and sore throats.'
            ],
            medicalApplications: 'Primarily used for blood sugar management in diabetes, reducing cholesterol, alleviating digestive problems, and fighting bacterial and fungal infections. May also help with neurodegenerative diseases and has been studied for insulin resistance and metabolic syndrome.',
            researchLink: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4003790/'
        },
        'cardamom': {
            title: 'Cardamom (Elettaria cardamomum)',
            description: 'Known as the "Queen of Spices," cardamom is one of the world\'s most expensive spices and has been used in traditional medicine for digestive ailments and oral health.',
            medicinalProperties: [
                'Digestive aid - relieves indigestion and bloating',
                'Antimicrobial - fights oral bacteria',
                'Antioxidant - rich in protective compounds',
                'Anti-inflammatory - reduces inflammation',
                'Detoxifying - supports liver function',
                'Respiratory support - helps with breathing disorders'
            ],
            preparationMethods: [
                '<strong>Cardamom Tea:</strong> Add 2-3 crushed cardamom pods to water while boiling tea.',
                '<strong>Cardamom Powder:</strong> 1/4 to 1/2 teaspoon added to food or beverages.',
                '<strong>Chew Pods:</strong> Chewing whole cardamom pods for bad breath and oral health.',
                '<strong>Cardamom Milk:</strong> Boil milk with crushed cardamom for respiratory conditions.'
            ],
            medicalApplications: 'Traditionally used for digestive problems, bad breath, and cavities. Research shows potential benefits for metabolic syndrome, liver protection, and antioxidant activity. In Ayurveda, it\'s used for depression and as a detoxifying agent.',
            researchLink: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10346154/'
        },
        'clove': {
            title: 'Clove (Syzygium aromaticum)',
            description: 'Cloves are the aromatic flower buds of a tree native to Indonesia. They have been used for centuries in cooking and traditional medicine, especially for dental pain.',
            medicinalProperties: [
                'Analgesic - powerful natural pain reliever',
                'Antibacterial - effective against many bacteria',
                'Antiviral - inhibits viral activity',
                'Anti-inflammatory - reduces inflammation',
                'Antioxidant - one of the highest ORAC values',
                'Antiseptic - disinfects wounds and infections'
            ],
            preparationMethods: [
                '<strong>Clove Oil:</strong> Used topically (diluted) for toothache and pain relief.',
                '<strong>Clove Tea:</strong> Steep 1 teaspoon of ground cloves in hot water for 10 minutes.',
                '<strong>Ground Cloves:</strong> 1/8 to 1/4 teaspoon added to food or drinks.',
                '<strong>Clove Compress:</strong> Cloth soaked in clove tea applied to affected areas for pain.'
            ],
            medicalApplications: 'Most famous for dental pain relief and oral infections. Also used for digestive problems, respiratory infections, and inflammatory conditions. Research shows potential for diabetes management, bone preservation, and cancer prevention. The active compound eugenol is used in modern dentistry.',
            researchLink: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3074903/'
        }
    };

    // Function to show plant details in popup modal
    window.showPlantDetails = function(plantId) {
        const modal = document.getElementById('plantDetailsModal');
        const contentDiv = document.getElementById('plantDetailsContent');
        const plantData = plantDetailsData[plantId];
        
        if (!plantData) {
            contentDiv.innerHTML = '<p>Information for this plant is not available at the moment.</p>';
            modal.style.display = 'block';
            return;
        }
        
        // Construct the HTML for the plant details
        let html = `
            <h2>${plantData.title}</h2>
            <div class="plant-detail-section">
                <h3>Overview</h3>
                <p>${plantData.description}</p>
            </div>
            
            <div class="plant-detail-section">
                <h3>Medicinal Properties</h3>
                <ul>
                    ${plantData.medicinalProperties.map(prop => `<li>${prop}</li>`).join('')}
                </ul>
            </div>
            
            <div class="plant-detail-section">
                <h3>How to Prepare</h3>
                <div class="preparation-methods">
                    ${plantData.preparationMethods.map(method => `<p>${method}</p>`).join('')}
                </div>
            </div>
            
            <div class="plant-detail-section">
                <h3>Medical Applications</h3>
                <p>${plantData.medicalApplications}</p>
            </div>
            
            <div class="plant-detail-section">
                <h3>Scientific Research</h3>
                <p>For more detailed information on clinical studies and scientific research:</p>
                <a href="${plantData.researchLink}" target="_blank" class="research-link">View Published Research <span class="external-link-icon">↗</span></a>
            </div>
        `;
        
        contentDiv.innerHTML = html;
        modal.style.display = 'block';
        
        // Show notification
        showNotification(`Viewing detailed information for ${plantData.title.split('(')[0].trim()}`);
    }
    
    // Function to close any modal
    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
});
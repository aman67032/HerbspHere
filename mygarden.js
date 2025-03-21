// Plant data with growth stages, care requirements, and 3D model information
const plants = {
    tulsi: {
        name: "Tulsi (Holy Basil)",
        scientificName: "Ocimum sanctum",
        modelUrl: "tulsi.glb", // Path to your 3D model
        growthTime: {
            seed: 3, // days
            sprout: 7,
            young: 14,
            mature: 30
        },
        careSteps: [
            { id: 1, name: "Prepare soil", description: "Mix garden soil with compost in a 3:1 ratio", tool: "soil" },
            { id: 2, name: "Plant seeds", description: "Plant seeds 1/4 inch deep and 6 inches apart", tool: "seeds" },
            { id: 3, name: "Water", description: "Water gently until soil is moist but not soggy", tool: "water" },
            { id: 4, name: "Sunlight", description: "Place in a location with 6-8 hours of sunlight", tool: "sun" },
            { id: 5, name: "Regular watering", description: "Water when top inch of soil feels dry", tool: "water" },
            { id: 6, name: "Fertilize", description: "Apply organic fertilizer after 2 weeks", tool: "fertilizer" },
            { id: 7, name: "Prune", description: "Pinch off flower buds to encourage leaf growth", tool: "scissors" }
        ],
        commonMistakes: [
            { step: 1, mistake: "Using heavy clay soil", consequence: "Poor drainage leads to root rot" },
            { step: 3, mistake: "Overwatering", consequence: "Root rot and fungal diseases" },
            { step: 4, mistake: "Insufficient sunlight", consequence: "Weak, leggy growth" },
            { step: 6, mistake: "Using chemical fertilizers", consequence: "May affect medicinal properties" }
        ],
        harvestInfo: "Harvest leaves regularly once the plant reaches 12 inches in height. Morning is the best time to harvest."
    },
    ashwagandha: {
        name: "Ashwagandha",
        scientificName: "Withania somnifera",
        modelUrl: "Ahwagandha.glb",
        growthTime: {
            seed: 7,
            sprout: 14,
            young: 30,
            mature: 120
        },
        careSteps: [
            { id: 1, name: "Prepare soil", description: "Use well-draining sandy loam soil", tool: "soil" },
            { id: 2, name: "Plant seeds", description: "Sow seeds 1/2 inch deep and 2 feet apart", tool: "seeds" },
            { id: 3, name: "Water", description: "Water thoroughly after planting", tool: "water" },
            { id: 4, name: "Sunlight", description: "Place in full sun location", tool: "sun" },
            { id: 5, name: "Minimal watering", description: "Water only when soil is completely dry", tool: "water" },
            { id: 6, name: "Weed control", description: "Remove weeds regularly", tool: "hoe" }
        ],
        commonMistakes: [
            { step: 1, mistake: "Using clay-heavy soil", consequence: "Poor root development" },
            { step: 3, mistake: "Overwatering", consequence: "Root rot and plant death" },
            { step: 5, mistake: "Frequent watering", consequence: "Weak medicinal properties" }
        ],
        harvestInfo: "Harvest roots after 8-10 months when the plant has fully matured and berries have ripened."
    },
    turmeric: {
        name: "Turmeric",
        scientificName: "Curcuma longa",
        modelUrl: "Turmeric.glb",
        growthTime: {
            seed: 14,
            sprout: 30,
            young: 60,
            mature: 240
        },
        careSteps: [
            { id: 1, name: "Prepare soil", description: "Rich, moist, well-draining soil with compost", tool: "soil" },
            { id: 2, name: "Plant rhizomes", description: "Plant rhizomes 2 inches deep, 12 inches apart", tool: "rhizome" },
            { id: 3, name: "Water", description: "Water thoroughly after planting", tool: "water" },
            { id: 4, name: "Mulch", description: "Apply 2-3 inches of mulch to retain moisture", tool: "mulch" },
            { id: 5, name: "Regular watering", description: "Keep soil consistently moist", tool: "water" },
            { id: 6, name: "Fertilize", description: "Apply organic fertilizer monthly", tool: "fertilizer" }
        ],
        commonMistakes: [
            { step: 2, mistake: "Planting too deep", consequence: "Delayed or no sprouting" },
            { step: 5, mistake: "Letting soil dry out", consequence: "Stunted growth" },
            { step: 5, mistake: "Waterlogging", consequence: "Rhizome rot" }
        ],
        harvestInfo: "Harvest rhizomes 8-10 months after planting when leaves turn yellow and begin to dry."
    },
    cinnamon: {
        name: "Cinnamon",
        scientificName: "Cinnamomum verum",
        modelUrl: "Cinnamon.glb",
        growthTime: {
            seed: 21,
            sprout: 60,
            young: 365,
            mature: 730
        },
        careSteps: [
            { id: 1, name: "Prepare soil", description: "Rich, acidic soil with good drainage", tool: "soil" },
            { id: 2, name: "Plant seeds/cutting", description: "Plant fresh seeds or cuttings", tool: "seeds" },
            { id: 3, name: "Water", description: "Water thoroughly after planting", tool: "water" },
            { id: 4, name: "Sunlight", description: "Partial shade for young plants", tool: "shade" },
            { id: 5, name: "Regular watering", description: "Keep soil moist but not waterlogged", tool: "water" },
            { id: 6, name: "Fertilize", description: "Apply balanced fertilizer every 3 months", tool: "fertilizer" }
        ],
        commonMistakes: [
            { step: 2, mistake: "Using old seeds", consequence: "Poor germination" },
            { step: 4, mistake: "Full sun exposure for seedlings", consequence: "Leaf burn" },
            { step: 5, mistake: "Overwatering", consequence: "Root rot" }
        ],
        harvestInfo: "Harvest bark from branches that are at least 2 years old. Cinnamon trees can be coppiced to encourage new growth."
    },
    cardamom: {
        name: "Cardamom",
        scientificName: "Elettaria cardamomum",
        modelUrl: "Cardamom.glb",
        growthTime: {
            seed: 30,
            sprout: 60,
            young: 365,
            mature: 1095
        },
        careSteps: [
            { id: 1, name: "Prepare soil", description: "Rich, loamy soil with high organic content", tool: "soil" },
            { id: 2, name: "Plant seeds/rhizomes", description: "Plant seeds or rhizome divisions", tool: "seeds" },
            { id: 3, name: "Water", description: "Water thoroughly after planting", tool: "water" },
            { id: 4, name: "Shade", description: "Provide 50-60% shade", tool: "shade" },
            { id: 5, name: "Regular watering", description: "Keep soil consistently moist", tool: "water" },
            { id: 6, name: "Mulch", description: "Apply thick layer of organic mulch", tool: "mulch" },
            { id: 7, name: "Fertilize", description: "Apply organic fertilizer every 2 months", tool: "fertilizer" }
        ],
        commonMistakes: [
            { step: 2, mistake: "Planting too deep", consequence: "Rotting of rhizomes" },
            { step: 4, mistake: "Full sun exposure", consequence: "Leaf burn and plant stress" },
            { step: 5, mistake: "Inconsistent watering", consequence: "Poor capsule development" }
        ],
        harvestInfo: "Harvest seed pods when they're fully grown but still green, typically 30-40 days after flowering."
    },
    clove: {
        name: "Clove",
        scientificName: "Syzygium aromaticum",
        modelUrl: "clove.glb",
        growthTime: {
            seed: 14,
            sprout: 30,
            young: 730,
            mature: 1825
        },
        careSteps: [
            { id: 1, name: "Prepare soil", description: "Well-draining, fertile soil", tool: "soil" },
            { id: 2, name: "Plant seeds", description: "Plant fresh seeds immediately after harvesting", tool: "seeds" },
            { id: 3, name: "Water", description: "Water thoroughly after planting", tool: "water" },
            { id: 4, name: "Partial shade", description: "Provide partial shade for young plants", tool: "shade" },
            { id: 5, name: "Regular watering", description: "Keep soil moist but not waterlogged", tool: "water" },
            { id: 6, name: "Fertilize", description: "Apply balanced fertilizer every 3 months", tool: "fertilizer" }
        ],
        commonMistakes: [
            { step: 2, mistake: "Using dried seeds", consequence: "Poor or no germination" },
            { step: 4, mistake: "Full sun exposure for young plants", consequence: "Leaf burn" },
            { step: 5, mistake: "Overwatering", consequence: "Root rot" }
        ],
        harvestInfo: "Harvest flower buds when they turn from green to pink but before they open. Clove trees begin producing after 5-7 years."
    }
};

// Game state
let currentPlant = null;
let currentStep = 0;
let plantHealth = 100;
let growthStage = 'none'; // none, seed, sprout, young, mature
let growthProgress = 0;
let mistakesMade = [];
let gameStarted = false;
let gameTimer = null;
let dayCounter = 0;
let currentTheme = 'ayurvedic'; // Default theme

// Add gamification elements - point system and achievements
let userPoints = localStorage.getItem('herbspointSystem') ? JSON.parse(localStorage.getItem('herbspointSystem')) : {
    total: 0,
    plants: {},
    achievements: []
};

// Achievement definitions
const achievements = [
    { id: 'first_plant', name: 'Beginner Gardener', description: 'Grow your first herb to maturity', points: 50, icon: '🌱' },
    { id: 'three_plants', name: 'Herbal Enthusiast', description: 'Grow three different herbs to maturity', points: 100, icon: '🌿' },
    { id: 'all_plants', name: 'Master Herbalist', description: 'Grow all herbs in the garden', points: 500, icon: '🌳' },
    { id: 'perfect_tulsi', name: 'Tulsi Expert', description: 'Grow Tulsi with perfect health', points: 150, icon: '☘️' },
    { id: 'speed_grower', name: 'Speed Grower', description: 'Grow any herb to maturity within 10 days', points: 200, icon: '⚡' }
];

// Garden themes definitions
const gardenThemes = {
    ayurvedic: {
        name: "Ayurvedic Garden",
        backgroundColor: '#f0f5e9',
        soilColor: '#654321',
        fieldBorder: '3px solid #8a5a44',
        plantModifiers: {
            seedScale: 1,
            sproutScale: 1,
            youngScale: 1,
            matureScale: 1
        }
    },
    zen: {
        name: "Zen Garden",
        backgroundColor: '#e8e8e0',
        soilColor: '#a89078',
        fieldBorder: '3px solid #888880',
        plantModifiers: {
            seedScale: 0.9,
            sproutScale: 0.95,
            youngScale: 1,
            matureScale: 1.05
        }
    },
    fairy: {
        name: "Fairy Garden",
        backgroundColor: '#e8f4ff',
        soilColor: '#7d623c',
        fieldBorder: '3px dotted #c592d8',
        plantModifiers: {
            seedScale: 0.8,
            sproutScale: 0.9,
            youngScale: 1.1,
            matureScale: 1.2
        }
    },
    desert: {
        name: "Desert Oasis",
        backgroundColor: '#f9e4b7',
        soilColor: '#d2b48c',
        fieldBorder: '3px solid #b38867',
        plantModifiers: {
            seedScale: 1.1,
            sproutScale: 1,
            youngScale: 0.9,
            matureScale: 1
        }
    }
};

// DOM elements
const fieldElement = document.getElementById('field');
const instructionsElement = document.getElementById('instructions');
const feedbackElement = document.getElementById('feedback');
const herbSelectElement = document.getElementById('herb-select');

// Initialize the garden
function initGarden() {
    // Load selected theme from localStorage
    loadTheme();
    
    // Add tools section to the page
    const toolsDiv = document.createElement('div');
    toolsDiv.className = 'tools';
    toolsDiv.innerHTML = `
        <div class="tool" data-tool="soil" title="Soil"></div>
        <div class="tool" data-tool="seeds" title="Seeds"></div>
        <div class="tool" data-tool="water" title="Water"></div>
        <div class="tool" data-tool="sun" title="Sunlight"></div>
        <div class="tool" data-tool="shade" title="Shade"></div>
        <div class="tool" data-tool="fertilizer" title="Fertilizer"></div>
        <div class="tool" data-tool="scissors" title="Scissors"></div>
        <div class="tool" data-tool="hoe" title="Hoe"></div>
        <div class="tool" data-tool="mulch" title="Mulch"></div>
        <div class="tool" data-tool="rhizome" title="Rhizome"></div>
    `;
    
    document.querySelector('.garden-container').insertBefore(toolsDiv, fieldElement);
    
    // Add progress bar
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = '<div class="progress-bar"></div>';
    document.querySelector('.garden-container').insertBefore(progressContainer, instructionsElement);
    
    // Add event listeners to tools
    document.querySelectorAll('.tool').forEach(tool => {
        tool.addEventListener('click', () => {
            if (!gameStarted) return;
            
            const selectedTool = tool.dataset.tool;
            applyTool(selectedTool);
        });
    });
    
    // Add theme indicator
    const themeIndicator = document.createElement('div');
    themeIndicator.className = 'theme-indicator';
    themeIndicator.innerHTML = `
        <span>Theme: ${gardenThemes[currentTheme].name}</span>
        <a href="theme-garden.html" class="change-theme-btn">Change Theme</a>
    `;
    document.querySelector('.garden-container').insertBefore(themeIndicator, fieldElement);
    
    // Check URL parameters to see if achievements should be shown
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showAchievements') === 'true') {
        showAchievements();
    }
    
    // Initialize gamification elements
    initGameElements();
    
    // Reset the field
    resetField();
}

// Load the selected theme from localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && gardenThemes[savedTheme]) {
        currentTheme = savedTheme;
    }
    
    // Apply theme to document
    applyTheme();
}

// Apply the current theme to the garden
function applyTheme() {
    const theme = gardenThemes[currentTheme];
    
    // Apply theme to field
    const field = document.getElementById('field');
    if (field) {
        field.style.backgroundColor = theme.soilColor;
        field.style.border = theme.fieldBorder;
    }
    
    // Apply theme to container
    const container = document.querySelector('.garden-container');
    if (container) {
        container.style.backgroundColor = theme.backgroundColor;
    }
    
    // Apply theme-specific CSS variable
    document.documentElement.style.setProperty('--theme-background', theme.backgroundColor);
    document.documentElement.style.setProperty('--theme-soil', theme.soilColor);
    
    // Add theme class to body for additional styling
    document.body.className = `theme-${currentTheme}`;
}

// Start growing the selected herb
function startGrowing() {
    const selectedHerb = herbSelectElement.value;
    
    if (!selectedHerb) {
        showFeedback("Please select an herb to grow", "error");
        return;
    }
    
    // Reset game state
    currentPlant = plants[selectedHerb];
    currentStep = 0;
    plantHealth = 100;
    growthStage = 'none';
    growthProgress = 0;
    mistakesMade = [];
    gameStarted = true;
    dayCounter = 0;
    
    // Clear previous timers
    if (gameTimer) clearInterval(gameTimer);
    
    // Reset UI
    resetField();
    updateInstructions();
    
    // Start the game timer (1 day = 10 seconds in this simulation)
    gameTimer = setInterval(simulateDay, 10000);
    
    showFeedback(`You've selected ${currentPlant.name}. Follow the instructions to grow your herb!`, "success");
}

// Reset the field
function resetField() {
    fieldElement.innerHTML = '';
    
    // Apply theme to field
    fieldElement.style.backgroundColor = gardenThemes[currentTheme].soilColor;
    fieldElement.style.border = gardenThemes[currentTheme].fieldBorder;
    
    // Create a placeholder for the plant
    const plantDiv = document.createElement('div');
    plantDiv.id = 'plant-model';
    plantDiv.className = 'plant';
    
    // Add a message to guide the user
    const placeholderMsg = document.createElement('div');
    placeholderMsg.textContent = 'Select an herb and click "Plant Herb" to begin';
    placeholderMsg.style.textAlign = 'center';
    placeholderMsg.style.color = '#666';
    placeholderMsg.style.padding = '20px';
    
    fieldElement.appendChild(plantDiv);
    fieldElement.appendChild(placeholderMsg);
    
    // Reset the progress bar if it exists
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    
    // Reset tool selections
    document.querySelectorAll('.tool').forEach(tool => {
        tool.classList.remove('active');
    });
}

// Update instructions based on current step
function updateInstructions() {
    if (!gameStarted || !currentPlant) {
        instructionsElement.innerHTML = '<h3>Select an herb and click "Plant Herb" to begin</h3>';
        return;
    }
    
    let instructionsHTML = `
        <h3>Growing ${currentPlant.name}</h3>
        <p><strong>Scientific Name:</strong> ${currentPlant.scientificName}</p>
        <p><strong>Current Stage:</strong> ${growthStage.charAt(0).toUpperCase() + growthStage.slice(1)}</p>
        <p><strong>Plant Health:</strong> ${plantHealth}%</p>
        <p><strong>Day:</strong> ${dayCounter}</p>
        <div class="steps">
    `;
    
    currentPlant.careSteps.forEach((step, index) => {
        const stepClass = index === currentStep ? 'step active' : 
                         index < currentStep ? 'step completed' : 'step';
        
        instructionsHTML += `
            <div class="${stepClass}">
                <strong>${step.id}. ${step.name}</strong>: ${step.description}
            </div>
        `;
    });
    
    instructionsHTML += '</div>';
    instructionsElement.innerHTML = instructionsHTML;
}

// Apply selected tool to the current step
function applyTool(toolName) {
    if (!gameStarted || currentStep >= currentPlant.careSteps.length) return;
    
    const requiredTool = currentPlant.careSteps[currentStep].tool;
    
    if (toolName === requiredTool) {
        // Correct tool used
        currentStep++;
        updateGrowthStage();
        showFeedback(`Good job! You've completed step ${currentStep} correctly.`, "success");
    } else {
        // Wrong tool used
        const mistake = currentPlant.commonMistakes.find(m => m.step === currentStep + 1);
        
        if (mistake) {
            plantHealth -= 20; // Reduce plant health
            mistakesMade.push(mistake);
            showFeedback(`Oops! ${mistake.mistake}. ${mistake.consequence}. Plant health reduced to ${plantHealth}%.`, "error");
            
            if (plantHealth <= 0) {
                plantDied();
            }
        } else {
            plantHealth -= 10; // Smaller penalty for general mistakes
            showFeedback(`That's not the right tool for this step. Try again! Plant health reduced to ${plantHealth}%.`, "error");
            
            if (plantHealth <= 0) {
                plantDied();
            }
        }
    }
    
    updateInstructions();
}

// Update growth stage based on days passed and steps completed
function updateGrowthStage() {
    if (!gameStarted) return;
    
    // Determine growth stage based on days passed and care steps completed
    const totalSteps = currentPlant.careSteps.length;
    const completedStepsRatio = currentStep / totalSteps;
    
    if (completedStepsRatio >= 0.25 && dayCounter >= currentPlant.growthTime.seed) {
        if (growthStage === 'none') {
            growthStage = 'seed';
            updatePlantVisual();
        }
    }
    
    if (completedStepsRatio >= 0.5 && dayCounter >= currentPlant.growthTime.sprout) {
        if (growthStage === 'seed') {
            growthStage = 'sprout';
            updatePlantVisual();
        }
    }
    
    if (completedStepsRatio >= 0.75 && dayCounter >= currentPlant.growthTime.young) {
        if (growthStage === 'sprout') {
            growthStage = 'young';
            updatePlantVisual();
        }
    }
    
    if (completedStepsRatio >= 1 && dayCounter >= currentPlant.growthTime.mature) {
        if (growthStage === 'young') {
            growthStage = 'mature';
            updatePlantVisual();
            plantMature();
        }
    }
    
    // Update progress bar
    const progressPercent = (dayCounter / currentPlant.growthTime.mature) * 100;
    document.querySelector('.progress-bar').style.width = `${Math.min(progressPercent, 100)}%`;
}

// Update the plant visual based on growth stage
function updatePlantVisual() {
    fieldElement.innerHTML = '';
    
    if (growthStage === 'none') {
        // Empty field
        return;
    }
    
    const plantDiv = document.createElement('div');
    plantDiv.className = `plant ${growthStage}`;
    
    // Apply theme-specific scale modifiers
    const scaleModifier = gardenThemes[currentTheme].plantModifiers[`${growthStage}Scale`] || 1;
    plantDiv.style.transform = `scale(${scaleModifier})`;
    
    if (growthStage === 'seed') {
        // Simple seed visualization
        const seedDiv = document.createElement('div');
        seedDiv.className = 'seed';
        plantDiv.appendChild(seedDiv);
    } 
    else if (growthStage === 'sprout') {
        // Simple sprout visualization
        const sproutDiv = document.createElement('div');
        sproutDiv.className = 'sprout';
        plantDiv.appendChild(sproutDiv);
    } 
    else if (growthStage === 'young' || growthStage === 'mature') {
        // Use the appropriate image for the plant
        let imgClass = growthStage === 'young' ? 'young-plant' : 'mature-plant';
        
        // If we have a model URL, use the 3D model viewer
        if (currentPlant.modelUrl && growthStage === 'mature') {
            try {
                // Create a model-viewer element for 3D models
                const modelViewer = document.createElement('model-viewer');
                modelViewer.src = currentPlant.modelUrl;
                modelViewer.alt = `3D model of ${currentPlant.name}`;
                modelViewer.setAttribute('camera-controls', '');
                modelViewer.setAttribute('auto-rotate', '');
                modelViewer.setAttribute('ar', '');
                modelViewer.style.width = '100%';
                modelViewer.style.height = '300px';
                
                plantDiv.appendChild(modelViewer);
            } catch (e) {
                console.error("Error loading 3D model:", e);
                // Fallback to image if 3D model fails
                useImageFallback();
            }
        } else {
            // Use image as fallback
            useImageFallback();
        }
        
        function useImageFallback() {
            const imgDiv = document.createElement('div');
            imgDiv.className = imgClass;
            
            // Set background image based on plant type
            const plantType = herbSelectElement.value;
            const imgUrl = document.getElementById(`preload-${plantType}`)?.src;
            
            if (imgUrl) {
                imgDiv.style.backgroundImage = `url('${imgUrl}')`;
            } else {
                // Fallback styles if image isn't available
                imgDiv.style.backgroundColor = 'green';
                imgDiv.style.borderRadius = '50% 50% 0 0';
                
                // Add some leaf-like shapes
                const leaves = document.createElement('div');
                leaves.style.position = 'absolute';
                leaves.style.top = '20px';
                leaves.style.left = '0';
                leaves.style.right = '0';
                leaves.style.display = 'flex';
                leaves.style.justifyContent = 'center';
                
                for (let i = 0; i < 5; i++) {
                    const leaf = document.createElement('div');
                    leaf.style.width = '20px';
                    leaf.style.height = '40px';
                    leaf.style.backgroundColor = 'green';
                    leaf.style.borderRadius = '50%';
                    leaf.style.margin = '0 -5px';
                    leaf.style.transform = `rotate(${(i-2)*20}deg)`;
                    leaves.appendChild(leaf);
                }
                
                imgDiv.appendChild(leaves);
            }
            
            plantDiv.appendChild(imgDiv);
        }
    }
    
    // Add health indicator
    const healthIndicator = document.createElement('div');
    healthIndicator.className = 'health-indicator';
    healthIndicator.style.position = 'absolute';
    healthIndicator.style.bottom = '10px';
    healthIndicator.style.left = '10px';
    healthIndicator.style.right = '10px';
    healthIndicator.style.height = '5px';
    healthIndicator.style.backgroundColor = '#ccc';
    healthIndicator.style.borderRadius = '3px';
    
    const healthLevel = document.createElement('div');
    healthLevel.style.width = `${plantHealth}%`;
    healthLevel.style.height = '100%';
    healthLevel.style.backgroundColor = getHealthColor();
    healthLevel.style.borderRadius = '3px';
    healthLevel.style.transition = 'width 0.5s ease-in-out';
    
    healthIndicator.appendChild(healthLevel);
    plantDiv.appendChild(healthIndicator);
    
    // Update the progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        let progressMaxDays;
        
        if (growthStage === 'seed') {
            progressMaxDays = currentPlant.growthTime.seed;
        } else if (growthStage === 'sprout') {
            progressMaxDays = currentPlant.growthTime.sprout;
        } else if (growthStage === 'young') {
            progressMaxDays = currentPlant.growthTime.young;
        } else if (growthStage === 'mature') {
            progressMaxDays = currentPlant.growthTime.mature;
        }
        
        const percentage = (growthProgress / progressMaxDays) * 100;
        progressBar.style.width = `${percentage}%`;
    }
    
    fieldElement.appendChild(plantDiv);
    
    // Helper function to get color based on health
    function getHealthColor() {
        if (plantHealth > 70) return '#4CAF50'; // Green
        if (plantHealth > 40) return '#FFC107'; // Yellow
        return '#F44336'; // Red
    }
}

// Simulate one day in the garden
function simulateDay() {
    if (!gameStarted) return;
    
    // Increment day counter
    dayCounter++;
    
    // If plant is already mature, nothing changes
    if (growthStage === 'mature') {
        return;
    }
    
    // Increase growth progress
    growthProgress++;
    
    // Determine current growth stage target days
    let daysTarget = 0;
    
    if (growthStage === 'none') {
        growthStage = 'seed';
        daysTarget = currentPlant.growthTime.seed;
    } else if (growthStage === 'seed') {
        daysTarget = currentPlant.growthTime.seed;
        if (growthProgress >= daysTarget) {
            growthStage = 'sprout';
            growthProgress = 0;
            showFeedback(`Your ${currentPlant.name} has sprouted!`, "success");
            
            // Award points for reaching sprout stage
            awardPoints(5, "Plant sprouted!");
        }
    } else if (growthStage === 'sprout') {
        daysTarget = currentPlant.growthTime.sprout;
        if (growthProgress >= daysTarget) {
            growthStage = 'young';
            growthProgress = 0;
            showFeedback(`Your ${currentPlant.name} is now a young plant!`, "success");
            
            // Award points for reaching young plant stage
            awardPoints(10, "Young plant growing well!");
        }
    } else if (growthStage === 'young') {
        daysTarget = currentPlant.growthTime.young;
        if (growthProgress >= daysTarget) {
            growthStage = 'mature';
            growthProgress = 0;
            showFeedback(`Congratulations! Your ${currentPlant.name} is now mature!`, "success");
            
            // Record growth stats when plant reaches maturity
            if (!userPoints.plants[herbSelectElement.value] || !userPoints.plants[herbSelectElement.value].completed) {
                recordPlantGrowth(herbSelectElement.value, dayCounter, plantHealth);
                
                // Award points for growing a plant
                const pointsBase = 20;
                let healthBonus = Math.floor((plantHealth - 50) / 10) * 5; // 5 points for every 10% health above 50%
                if (healthBonus < 0) healthBonus = 0;
                
                // Bonus points for growing different plants
                const varietyBonus = Object.keys(userPoints.plants).length * 5;
                
                const totalPoints = pointsBase + healthBonus + varietyBonus;
                awardPoints(totalPoints, `Grew ${currentPlant.name} to maturity!`);
            }
        }
    }
    
    // Random events that can affect plant health
    const randomEvent = Math.random();
    
    if (randomEvent < 0.1) {
        // 10% chance of a negative event
        const healthLoss = Math.floor(Math.random() * 10) + 1;
        plantHealth = Math.max(0, plantHealth - healthLoss);
        showFeedback(`Your plant is suffering from lack of attention. Health decreased by ${healthLoss}%.`, "error");
    } else if (randomEvent > 0.9) {
        // 10% chance of a positive event
        const healthGain = Math.floor(Math.random() * 5) + 1;
        plantHealth = Math.min(100, plantHealth + healthGain);
        showFeedback(`Perfect growing conditions today! Plant health increased by ${healthGain}%.`, "success");
        
        // Small chance for bonus points on good days
        if (Math.random() > 0.7) {
            awardPoints(2, "Perfect growing conditions!");
        }
    }
    
    // Update plant visual
    updatePlantVisual();
    
    // Update instructions
    updateInstructions();
}

// Plant has reached maturity
function plantMature() {
    clearInterval(gameTimer);
    
    showFeedback(`Congratulations! Your ${currentPlant.name} has reached maturity. ${currentPlant.harvestInfo}`, "success");
    
    // Add harvest button
    const harvestBtn = document.createElement('button');
    harvestBtn.textContent = 'Harvest Plant';
    harvestBtn.addEventListener('click', harvestPlant);
    document.querySelector('.garden-container').appendChild(harvestBtn);
}

// Plant has died
function plantDied() {
    clearInterval(gameTimer);
    gameStarted = false;
    
    showFeedback(`Oh no! Your ${currentPlant.name} has died. Mistakes made: ${mistakesMade.map(m => m.mistake).join(', ')}`, "error");
    
    // Add try again button
    const tryAgainBtn = document.createElement('button');
    tryAgainBtn.textContent = 'Try Again';
    tryAgainBtn.addEventListener('click', () => {
        document.querySelector('.garden-container').removeChild(tryAgainBtn);
        startGrowing();
    });
    document.querySelector('.garden-container').appendChild(tryAgainBtn);
}

// Harvest the plant
function harvestPlant() {
    showFeedback(`You've successfully harvested your ${currentPlant.name}!`, "success");
    
    // Reset for a new plant
    gameStarted = false;
    resetField();
    updateInstructions();
    
    // Remove harvest button
    const harvestBtn = document.querySelector('.garden-container button:last-child');
    if (harvestBtn) {
        document.querySelector('.garden-container').removeChild(harvestBtn);
    }
}

// Show feedback message
function showFeedback(message, type) {
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback ${type}`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
        feedbackElement.textContent = '';
        feedbackElement.className = 'feedback';
    }, 5000);
}

// Initialize game elements
function initGameElements() {
    // Check if points display already exists
    if (!document.querySelector('.points-display')) {
        // Create points display
        const pointsDisplay = document.createElement('div');
        pointsDisplay.className = 'points-display';
        pointsDisplay.innerHTML = `
            <div class="points-icon">🏆</div>
            <div class="points-value" id="user-points">${userPoints.total} points</div>
            <button class="achievements-btn" onclick="showAchievements()">Achievements</button>
        `;
        document.querySelector('.container').insertBefore(pointsDisplay, document.querySelector('.container').firstChild);
    }
    
    // Check if achievements panel already exists
    if (!document.querySelector('.achievements-panel')) {
        // Create achievements panel (hidden by default)
        const achievementsPanel = document.createElement('div');
        achievementsPanel.className = 'achievements-panel';
        achievementsPanel.style.display = 'none';
        achievementsPanel.innerHTML = `
            <div class="achievements-header">
                <h3>Your Achievements</h3>
                <button class="close-btn" onclick="hideAchievements()">×</button>
            </div>
            <div class="achievements-list" id="achievements-list"></div>
        `;
        document.body.appendChild(achievementsPanel);
        
        // Update achievements list
        updateAchievementsList();
    }
}

// Show the achievements panel
function showAchievements() {
    const panel = document.querySelector('.achievements-panel');
    if (panel) {
        updateAchievementsList();
        panel.style.display = 'block';
    }
}

// Hide the achievements panel
function hideAchievements() {
    const panel = document.querySelector('.achievements-panel');
    if (panel) {
        panel.style.display = 'none';
    }
}

// Update the achievements list
function updateAchievementsList() {
    const listElement = document.getElementById('achievements-list');
    if (!listElement) return;
    
    listElement.innerHTML = '';
    
    achievements.forEach(achievement => {
        const isUnlocked = userPoints.achievements.includes(achievement.id);
        
        const achievementItem = document.createElement('div');
        achievementItem.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        
        achievementItem.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
                <div class="achievement-points">+${achievement.points} points</div>
            </div>
            <div class="achievement-status">${isUnlocked ? '✓' : '🔒'}</div>
        `;
        
        listElement.appendChild(achievementItem);
    });
}

// Award points to the user
function awardPoints(points, reason) {
    userPoints.total += points;
    
    // Update localStorage
    localStorage.setItem('herbspointSystem', JSON.stringify(userPoints));
    
    // Update points display
    const pointsElement = document.getElementById('user-points');
    if (pointsElement) {
        pointsElement.textContent = `${userPoints.total} points`;
    }
    
    // Show notification
    showPointsNotification(points, reason);
    
    // Check for newly unlockable themes
    checkUnlockableThemes();
}

// Show notification for points gained
function showPointsNotification(points, reason) {
    const notification = document.createElement('div');
    notification.className = 'points-notification';
    notification.innerHTML = `
        <div class="points-gained">+${points}</div>
        <div class="points-reason">${reason}</div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

// Show notification for achievement unlocked
function showAchievementNotification(achievementName, icon) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${icon}</div>
        <div class="achievement-info">
            <div class="achievement-unlocked">Achievement Unlocked!</div>
            <div class="achievement-name">${achievementName}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after animation
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Check for achievement unlocks
function checkAchievements() {
    const completedPlants = Object.values(userPoints.plants).filter(plant => plant.completed).length;
    
    // First plant achievement
    if (completedPlants >= 1 && !userPoints.achievements.includes('first_plant')) {
        unlockAchievement('first_plant');
    }
    
    // Three plants achievement
    if (completedPlants >= 3 && !userPoints.achievements.includes('three_plants')) {
        unlockAchievement('three_plants');
    }
    
    // All plants achievement
    if (completedPlants >= Object.keys(plants).length && !userPoints.achievements.includes('all_plants')) {
        unlockAchievement('all_plants');
    }
    
    // Perfect Tulsi achievement
    if (userPoints.plants.tulsi && userPoints.plants.tulsi.health >= 95 && !userPoints.achievements.includes('perfect_tulsi')) {
        unlockAchievement('perfect_tulsi');
    }
    
    // Speed grower achievement
    const speedPlant = Object.values(userPoints.plants).find(plant => plant.days <= 10);
    if (speedPlant && !userPoints.achievements.includes('speed_grower')) {
        unlockAchievement('speed_grower');
    }
}

// Unlock an achievement
function unlockAchievement(achievementId) {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement) return;
    
    // Add to unlocked achievements
    userPoints.achievements.push(achievementId);
    
    // Save to localStorage
    localStorage.setItem('herbspointSystem', JSON.stringify(userPoints));
    
    // Award points
    awardPoints(achievement.points, `Achievement: ${achievement.name}`);
    
    // Show notification
    showAchievementNotification(achievement.name, achievement.icon);
    
    // Update achievements list
    updateAchievementsList();
}

// Record plant growth data
function recordPlantGrowth(plantType, days, health) {
    if (!userPoints.plants[plantType]) {
        userPoints.plants[plantType] = {};
    }
    
    userPoints.plants[plantType] = {
        completed: true,
        days: days,
        health: health,
        completedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('herbspointSystem', JSON.stringify(userPoints));
    
    // Check for achievements
    checkAchievements();
}

// Check which themes should be unlockable based on points
function checkUnlockableThemes() {
    // This function is implemented in the theme-garden.html page
    // But we'll add a notification when users earn enough points for a new theme
    
    const totalPoints = userPoints.total;
    let unlockedThemes = JSON.parse(localStorage.getItem('unlockedThemes') || '[]');
    
    // Check for zen garden (100 points)
    if (totalPoints >= 100 && !unlockedThemes.includes('zen')) {
        showFeedback("You've earned enough points to unlock the Zen Garden theme! Visit the Themes page.", "success");
    }
    
    // Check for desert garden (150 points)
    if (totalPoints >= 150 && !unlockedThemes.includes('desert')) {
        showFeedback("You've earned enough points to unlock the Desert Oasis theme! Visit the Themes page.", "success");
    }
    
    // Check for fairy garden (250 points)
    if (totalPoints >= 250 && !unlockedThemes.includes('fairy')) {
        showFeedback("You've earned enough points to unlock the Fairy Garden theme! Visit the Themes page.", "success");
    }
}

// Initialize the garden when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initGarden();
    
    // Check if we should preload 3D model viewer
    const modelScript = document.querySelector('script[src*="model-viewer"]');
    if (!modelScript) {
        console.warn("3D model viewer script not detected - 3D models may not display correctly");
    }
    
    // Show intro message
    showFeedback("Welcome to your virtual herb garden! Select an herb and start growing.", "success");
});

// Expose functions to the global scope for the onclick handlers
window.startGrowing = startGrowing;
window.showAchievements = showAchievements;
window.hideAchievements = hideAchievements;

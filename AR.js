<a-entity arjs-plane="planeType: floor"></a-entity>

// AR.js and A-Frame initialization
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const scene = document.querySelector('a-scene');
    const plantsContainer = document.getElementById('plants-container');
    const environmentContainer = document.getElementById('environment-container');

    // Initialize AR mode
    let isARMode = true;
    let isVRMode = false;
    let isGuidedTour = false;

    // Mode switching buttons
    const arModeBtn = document.getElementById('ar-mode-btn');
    const vrModeBtn = document.getElementById('vr-mode-btn');
    const guidedTourBtn = document.getElementById('guided-tour-btn');

    // Plant models configuration
    const plantModels = {
        tulsi: {
            model: '#tulsi-model',
            scale: '0.5 0.5 0.5',
            position: '0 0 -2'
        },
        ashwagandha: {
            model: '#ashwagandha-model',
            scale: '0.5 0.5 0.5',
            position: '2 0 -2'
        },
        turmeric: {
            model: '#turmeric-model',
            scale: '0.5 0.5 0.5',
            position: '-2 0 -2'
        },
        cinnamon: {
            model: '#cinnamon-model',
            scale: '0.5 0.5 0.5',
            position: '0 0 -4'
        },
        cardamom: {
            model: '#cardamom-model',
            scale: '0.5 0.5 0.5',
            position: '2 0 -4'
        },
        clove: {
            model: '#clove-model',
            scale: '0.5 0.5 0.5',
            position: '-2 0 -4'
        }
    };

    // Initialize scene
    function initializeScene() {
        loadingScreen.style.display = 'block';
        loadingScreen.textContent = 'Initializing HerbVerse...';

        // Wait for all models to load
        Promise.all([
            checkModelLoaded('tulsi-model'),
            checkModelLoaded('ashwagandha-model'),
            checkModelLoaded('turmeric-model'),
            checkModelLoaded('cinnamon-model'),
            checkModelLoaded('cardamom-model'),
            checkModelLoaded('clove-model')
        ]).then(() => {
            loadingScreen.style.display = 'none';
            setupEnvironment();
            setupPlants();
            setupEventListeners();
        }).catch(error => {
            console.error('Error loading models:', error);
            loadingScreen.textContent = 'Error loading models. Please refresh the page.';
        });
    }

    // Check if a model is loaded
    function checkModelLoaded(modelId) {
        return new Promise((resolve, reject) => {
            const model = document.getElementById(modelId);
            if (!model) {
                reject(new Error(`Model ${modelId} not found`));
                return;
            }

            if (model.hasLoaded) {
                resolve();
            } else {
                model.addEventListener('loaded', () => resolve());
                model.addEventListener('error', () => reject(new Error(`Failed to load ${modelId}`)));
            }
        });
    }

    // Setup environment
    function setupEnvironment() {
        // Add ambient light
        const ambientLight = document.createElement('a-light');
        ambientLight.setAttribute('type', 'ambient');
        ambientLight.setAttribute('color', '#ffffff');
        ambientLight.setAttribute('intensity', '0.5');
        environmentContainer.appendChild(ambientLight);

        // Add directional light
        const directionalLight = document.createElement('a-light');
        directionalLight.setAttribute('type', 'directional');
        directionalLight.setAttribute('color', '#ffffff');
        directionalLight.setAttribute('intensity', '0.8');
        directionalLight.setAttribute('position', '-1 1 2');
        environmentContainer.appendChild(directionalLight);

        // Add sky
        const sky = document.createElement('a-sky');
        sky.setAttribute('color', '#ECECEC');
        environmentContainer.appendChild(sky);

        // Add ground
        const ground = document.createElement('a-plane');
        ground.setAttribute('rotation', '-90 0 0');
        ground.setAttribute('width', '100');
        ground.setAttribute('height', '100');
        ground.setAttribute('color', '#7BC8A4');
        environmentContainer.appendChild(ground);
    }

    // Setup plants
    function setupPlants() {
        Object.entries(plantModels).forEach(([plantName, config]) => {
            const plant = document.createElement('a-entity');
            plant.setAttribute('gltf-model', config.model);
            plant.setAttribute('scale', config.scale);
            plant.setAttribute('position', config.position);
            plant.setAttribute('class', 'clickable');
            plant.setAttribute('data-plant', plantName);
            
            // Add click event
            plant.addEventListener('click', () => showPlantInfo(plantName));
            
            plantsContainer.appendChild(plant);
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Mode switching
        arModeBtn.addEventListener('click', () => switchMode('ar'));
        vrModeBtn.addEventListener('click', () => switchMode('vr'));
        guidedTourBtn.addEventListener('click', startGuidedTour);

        // Navigation controls
        document.getElementById('move-left').addEventListener('click', () => moveCamera('left'));
        document.getElementById('move-right').addEventListener('click', () => moveCamera('right'));
        document.getElementById('move-forward').addEventListener('click', () => moveCamera('forward'));
    }

    // Switch between AR and VR modes
    function switchMode(mode) {
        isARMode = mode === 'ar';
        isVRMode = mode === 'vr';
        
        // Update UI
        arModeBtn.classList.toggle('active', isARMode);
        vrModeBtn.classList.toggle('active', isVRMode);
        
        // Update scene
        scene.setAttribute('vr-mode-ui', `enabled: ${isVRMode}`);
        scene.setAttribute('arjs', `sourceType: ${isARMode ? 'webcam' : 'none'}`);
    }

    // Start guided tour
    function startGuidedTour() {
        isGuidedTour = true;
        guidedTourBtn.classList.add('active');
        // Implement tour logic here
    }

    // Show plant information
    function showPlantInfo(plantName) {
        const infoPanel = document.getElementById('plant-info-panel');
        const plantTitle = document.getElementById('info-plant-name');
        const plantDesc = document.getElementById('info-description');
        const plantProps = document.getElementById('info-properties');
        
        // Update info panel with plant data
        plantTitle.textContent = plantName.charAt(0).toUpperCase() + plantName.slice(1);
        // Add more plant information here
        
        infoPanel.style.display = 'block';
    }

    // Camera movement
    function moveCamera(direction) {
        const camera = document.querySelector('a-camera');
        const position = camera.getAttribute('position');
        const rotation = camera.getAttribute('rotation');
        
        switch(direction) {
            case 'left':
                position.x -= Math.sin((rotation.y + 90) * Math.PI / 180);
                position.z -= Math.cos((rotation.y + 90) * Math.PI / 180);
                break;
            case 'right':
                position.x += Math.sin((rotation.y + 90) * Math.PI / 180);
                position.z += Math.cos((rotation.y + 90) * Math.PI / 180);
                break;
            case 'forward':
                position.x += Math.sin(rotation.y * Math.PI / 180);
                position.z -= Math.cos(rotation.y * Math.PI / 180);
                break;
        }
        
        camera.setAttribute('position', position);
    }

    // Start initialization
    initializeScene();
});

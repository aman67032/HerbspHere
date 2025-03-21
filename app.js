// Configuration
const plantModels = {
    basil: 'https://cdn.glitch.global/your-path/basil.glb',
    mint: 'https://cdn.glitch.global/your-path/mint.glb'
};

// State Management
let currentPlant = plantModels.basil;
let isSurfaceDetected = false;
let environmentData = {
    light: 4,
    space: 2.3
};

// Initialize AR
async function initializeAR() {
    try {
        await setupCamera();
        setupEventListeners();
        updateUI();
        document.getElementById('loading-screen').style.display = 'none';
    } catch (error) {
        showError('AR initialization failed: ' + error.message);
    }
}

// Camera Setup
async function setupCamera() {
    await navigator.mediaDevices.getUserMedia({ video: true });
}

// Event Listeners
function setupEventListeners() {
    // Surface detection
    document.querySelector('#ar-scene').addEventListener('arjs-plane-detected', () => {
        isSurfaceDetected = true;
        analyzeEnvironment();
    });

    // Click handling
    document.body.addEventListener('click', handleTap);
}

// Environmental Analysis
async function analyzeEnvironment() {
    // Simulated analysis
    environmentData = {
        light: Math.floor(Math.random() * 8) + 1,
        space: Math.random() * 5 + 1
    };
    
    updateUI();
    updatePlantSuggestions();
}

// Plant Placement
function placePlant(plantType) {
    currentPlant = plantModels[plantType];
    document.querySelectorAll('.plant-card').forEach(card => 
        card.classList.remove('selected'));
    document.querySelector(`[data-plant="${plantType}"]`).classList.add('selected');
}

function handleTap(event) {
    if (!isSurfaceDetected) return;

    const intersection = getARIntersection(event.clientX, event.clientY);
    if (intersection) {
        createPlantAt(intersection.point);
    }
}

function createPlantAt(position) {
    const plant = document.createElement('a-entity');
    plant.setAttribute('gltf-model', currentPlant);
    plant.setAttribute('scale', '0.5 0.5 0.5');
    plant.setAttribute('position', position);
    
    plant.addEventListener('error', () => {
        plant.setAttribute('geometry', 'primitive: box');
        plant.setAttribute('material', 'color: green');
    });

    document.querySelector('#plants-container').appendChild(plant);
}

// AR Utilities
function getARIntersection(x, y) {
    const camera = document.querySelector('[camera]').object3D;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(getSceneMeshes());
    
    return intersects[0];
}

function getSceneMeshes() {
    return Array.from(document.querySelectorAll('[arjs-plane]'))
        .map(el => el.object3D);
}

// UI Updates
function updateUI() {
    document.getElementById('light-value').textContent = `${environmentData.light}h/day`;
    document.getElementById('space-value').textContent = `${environmentData.space.toFixed(1)}m²`;
}

function updatePlantSuggestions() {
    document.querySelectorAll('.match-percent').forEach(element => {
        const plantType = element.closest('.plant-card').dataset.plant;
        const score = calculateSuitability(plantType);
        element.textContent = `${Math.round(score * 100)}% Match`;
    });
}

function calculateSuitability(plantType) {
    // Simple suitability calculation
    if (plantType === 'basil') {
        return Math.min(environmentData.light / 8, 1);
    }
    if (plantType === 'mint') {
        return Math.min(environmentData.space / 5, 1);
    }
    return 0;
}

// Error Handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.background = 'red';
    errorDiv.style.color = 'white';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
}

// Initialize
initializeAR();
// HerbVerse main functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check WebGL support
    if (!AFRAME.utils.device.checkHeadsetConnected() && !AFRAME.utils.device.isMobile()) {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.textContent = 'Please use a VR headset or mobile device for the best experience.';
        loadingScreen.style.color = '#ff4444';
        return;
    }

    // Initialize components
    const scene = document.querySelector('a-scene');
    const loadingScreen = document.getElementById('loading-screen');
    
    // Track loading progress
    let modelsLoaded = 0;
    const totalModels = 6; // Total number of plant models
    
    // Update loading progress
    function updateLoadingProgress() {
        modelsLoaded++;
        const progress = Math.floor((modelsLoaded / totalModels) * 100);
        loadingScreen.textContent = `Loading HerbVerse... ${progress}%`;
        
        if (modelsLoaded === totalModels) {
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.querySelector('.ar-interface').style.display = 'block';
            }, 1000);
        }
    }

    // Handle model loading
    const models = [
        'tulsi-model',
        'ashwagandha-model',
        'turmeric-model',
        'cinnamon-model',
        'cardamom-model',
        'clove-model'
    ];

    models.forEach(modelId => {
        const model = document.getElementById(modelId);
        if (model) {
            model.addEventListener('model-loaded', updateLoadingProgress);
            model.addEventListener('model-error', () => {
                console.error(`Failed to load model: ${modelId}`);
                loadingScreen.textContent = 'Error loading models. Please refresh the page.';
            });
        }
    });

    // Handle mode switching
    const arModeBtn = document.getElementById('ar-mode-btn');
    const vrModeBtn = document.getElementById('vr-mode-btn');
    const guidedTourBtn = document.getElementById('guided-tour-btn');

    arModeBtn.addEventListener('click', () => {
        scene.setAttribute('arjs', 'sourceType: webcam;');
        arModeBtn.classList.add('active');
        vrModeBtn.classList.remove('active');
    });

    vrModeBtn.addEventListener('click', () => {
        scene.setAttribute('arjs', 'sourceType: none;');
        vrModeBtn.classList.add('active');
        arModeBtn.classList.remove('active');
    });

    // Handle plant placement
    function placePlant(plantName) {
        const camera = document.querySelector('a-camera');
        const position = camera.getAttribute('position');
        const rotation = camera.getAttribute('rotation');
        
        // Calculate position in front of camera
        const distance = 2;
        const radians = rotation.y * Math.PI / 180;
        const x = position.x - Math.sin(radians) * distance;
        const z = position.z - Math.cos(radians) * distance;
        
        const plant = document.createElement('a-entity');
        plant.setAttribute('gltf-model', `#${plantName}-model`);
        plant.setAttribute('position', `${x} 0 ${z}`);
        plant.setAttribute('scale', '0.5 0.5 0.5');
        plant.setAttribute('class', 'clickable');
        plant.setAttribute('data-plant', plantName);
        
        document.querySelector('#plants-container').appendChild(plant);
    }

    // Add click handlers for plant placement
    document.querySelectorAll('.plant-card button').forEach(button => {
        const plantName = button.parentElement.getAttribute('data-plant');
        button.addEventListener('click', () => placePlant(plantName));
    });

    // Handle environment stats
    function updateEnvironmentStats() {
        const locationValue = document.getElementById('location-value');
        const seasonValue = document.getElementById('season-value');
        
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=YOUR_API_KEY`)
                    .then(response => response.json())
                    .then(data => {
                        locationValue.textContent = data[0].name;
                    })
                    .catch(() => {
                        locationValue.textContent = 'Location unavailable';
                    });
            });
        }
        
        // Set season based on current month
        const month = new Date().getMonth();
        const seasons = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Fall', 'Fall', 'Fall', 'Winter'];
        seasonValue.textContent = seasons[month];
    }

    // Initialize environment stats
    updateEnvironmentStats();

    // Handle navigation controls
    const moveLeft = document.getElementById('move-left');
    const moveRight = document.getElementById('move-right');
    const moveForward = document.getElementById('move-forward');

    function moveCamera(direction) {
        const camera = document.querySelector('a-camera');
        const position = camera.getAttribute('position');
        const rotation = camera.getAttribute('rotation');
        const step = 0.5;

        switch(direction) {
            case 'left':
                position.x -= Math.sin((rotation.y + 90) * Math.PI / 180) * step;
                position.z -= Math.cos((rotation.y + 90) * Math.PI / 180) * step;
                break;
            case 'right':
                position.x += Math.sin((rotation.y + 90) * Math.PI / 180) * step;
                position.z += Math.cos((rotation.y + 90) * Math.PI / 180) * step;
                break;
            case 'forward':
                position.x += Math.sin(rotation.y * Math.PI / 180) * step;
                position.z -= Math.cos(rotation.y * Math.PI / 180) * step;
                break;
        }

        camera.setAttribute('position', position);
    }

    moveLeft.addEventListener('click', () => moveCamera('left'));
    moveRight.addEventListener('click', () => moveCamera('right'));
    moveForward.addEventListener('click', () => moveCamera('forward'));

    // Start scene
    scene.addEventListener('loaded', () => {
        console.log('Scene loaded successfully');
    });

    scene.addEventListener('error', () => {
        loadingScreen.textContent = 'Error loading scene. Please refresh the page.';
    });
}); 
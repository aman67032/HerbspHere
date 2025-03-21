// Ayurvedic Garden 3D Experience Script

// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set up renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.getElementById('scene-container').appendChild(renderer.domElement);

// Add fog for atmosphere
scene.fog = new THREE.FogExp2(0x87CEEB, 0.01);

// Player movement variables
const playerHeight = 1.8;
const moveSpeed = 0.1;
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

// Player physics
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Player control setup
const controls = new THREE.PointerLockControls(camera, document.body);
scene.add(controls.getObject());

// Initialize player position
camera.position.set(0, playerHeight, 5);

// Active plant highlight reference
let activeHighlight = null;

// Meditation mode variables
let meditationTime = 0;
let isInMeditation = false;
let lastPosition = new THREE.Vector3();
const moveThreshold = 0.1;
const meditationThreshold = 30; // Changed from 5 to 30 seconds

// Handle key presses for movement
const onKeyDown = function(event) {
    switch(event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
            
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
            
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
            
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
            
        case 'KeyE':
            checkPlantInteraction();
            break;
            
        case 'Escape':
            if (document.getElementById('plant-info').style.display === 'block') {
                document.getElementById('plant-info').style.display = 'none';
                if (activeHighlight) {
                    clearPlantInteraction();
                }
            }
            break;
    }
};

const onKeyUp = function(event) {
    switch(event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
            
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
            
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
            
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// Handle clicks for pointer lock and plant interaction
renderer.domElement.addEventListener('click', function() {
    if (!controls.isLocked) {
        controls.lock();
    } else {
        checkPlantInteraction();
    }
});

// Lighting setup
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Add skybox
scene.background = new THREE.Color(0x87CEEB);

// Create procedural ground texture
function createGroundTexture() {
    const groundCanvasSize = 1024; // Increased resolution
    const canvas = document.createElement('canvas');
    canvas.width = groundCanvasSize;
    canvas.height = groundCanvasSize;
    const context = canvas.getContext('2d');

    // Create gradient background for base soil
    const gradient = context.createLinearGradient(0, 0, groundCanvasSize, groundCanvasSize);
    gradient.addColorStop(0, '#3d2b1f');
    gradient.addColorStop(0.3, '#4a3424');
    gradient.addColorStop(0.6, '#523a28');
    gradient.addColorStop(1, '#5c422d');
    context.fillStyle = gradient;
    context.fillRect(0, 0, groundCanvasSize, groundCanvasSize);

    // Add soil texture layers
    for (let layer = 0; layer < 3; layer++) {
        // Large soil particles
        for (let i = 0; i < 20000; i++) {
            const x = Math.random() * groundCanvasSize;
            const y = Math.random() * groundCanvasSize;
            const size = Math.random() * 4 + 1;
            
            context.fillStyle = `rgba(${60 + Math.random() * 30}, ${40 + Math.random() * 20}, ${20 + Math.random() * 15}, ${0.1 + Math.random() * 0.4})`;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
        }
        
        // Small soil particles and organic matter
        for (let i = 0; i < 30000; i++) {
            const x = Math.random() * groundCanvasSize;
            const y = Math.random() * groundCanvasSize;
            const size = Math.random() * 2 + 0.5;
            
            context.fillStyle = `rgba(${50 + Math.random() * 20}, ${30 + Math.random() * 15}, ${10 + Math.random() * 10}, ${0.1 + Math.random() * 0.3})`;
            context.beginPath();
            context.arc(x, y, size, 0, Math.PI * 2);
            context.fill();
        }
    }

    // Add grass patches
    for (let i = 0; i < 1000; i++) {
        const x = Math.random() * groundCanvasSize;
        const y = Math.random() * groundCanvasSize;
        const size = Math.random() * 15 + 5;
        
        // Create grass cluster
        const grassGradient = context.createRadialGradient(x, y, 0, x, y, size);
        grassGradient.addColorStop(0, 'rgba(76, 175, 80, 0.2)');
        grassGradient.addColorStop(0.5, 'rgba(67, 160, 71, 0.15)');
        grassGradient.addColorStop(1, 'rgba(56, 142, 60, 0)');
        
        context.fillStyle = grassGradient;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
        
        // Add individual grass blades
        for (let j = 0; j < 5; j++) {
            const bladeX = x + (Math.random() - 0.5) * size;
            const bladeY = y + (Math.random() - 0.5) * size;
            const bladeLength = Math.random() * 8 + 4;
            const angle = Math.random() * Math.PI * 2;
            
            context.strokeStyle = `rgba(${67 + Math.random() * 20}, ${160 + Math.random() * 30}, ${71 + Math.random() * 20}, 0.3)`;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(bladeX, bladeY);
            context.lineTo(
                bladeX + Math.cos(angle) * bladeLength,
                bladeY + Math.sin(angle) * bladeLength
            );
            context.stroke();
        }
    }

    // Create normal map canvas
    const normalCanvas = document.createElement('canvas');
    normalCanvas.width = groundCanvasSize;
    normalCanvas.height = groundCanvasSize;
    const normalContext = normalCanvas.getContext('2d');
    
    // Get the image data from the main texture
    const imageData = context.getImageData(0, 0, groundCanvasSize, groundCanvasSize);
    const pixels = imageData.data;
    
    // Create normal map
    const normalImageData = normalContext.createImageData(groundCanvasSize, groundCanvasSize);
    const normalPixels = normalImageData.data;
    
    for (let y = 1; y < groundCanvasSize - 1; y++) {
        for (let x = 1; x < groundCanvasSize - 1; x++) {
            const idx = (y * groundCanvasSize + x) * 4;
            
            // Calculate height differences
            const left = pixels[idx - 4];
            const right = pixels[idx + 4];
            const up = pixels[idx - groundCanvasSize * 4];
            const down = pixels[idx + groundCanvasSize * 4];
            
            // Calculate normal
            normalPixels[idx] = ((right - left) + 255) / 2;     // R: X normal
            normalPixels[idx + 1] = ((down - up) + 255) / 2;    // G: Y normal
            normalPixels[idx + 2] = 255;                        // B: Z normal
            normalPixels[idx + 3] = 255;                        // Alpha
        }
    }
    
    normalContext.putImageData(normalImageData, 0, 0);

    // Create and configure textures
    const albedoTexture = new THREE.CanvasTexture(canvas);
    const normalTexture = new THREE.CanvasTexture(normalCanvas);
    
    // Configure texture settings
    albedoTexture.wrapS = THREE.RepeatWrapping;
    albedoTexture.wrapT = THREE.RepeatWrapping;
    albedoTexture.repeat.set(4, 4);
    
    normalTexture.wrapS = THREE.RepeatWrapping;
    normalTexture.wrapT = THREE.RepeatWrapping;
    normalTexture.repeat.set(4, 4);

    return { albedoTexture, normalTexture };
}

// Create ground
const groundGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);
const textures = createGroundTexture();
const groundMaterial = new THREE.MeshStandardMaterial({
    map: textures.albedoTexture,
    normalMap: textures.normalTexture,
    normalScale: new THREE.Vector2(1, 1),
    roughness: 0.8,
    metalness: 0.2,
    displacementScale: 0.3
});

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Ayurvedic plants data
const ayurvedicPlants = [
    {
        id: "tulsi",
        name: "Tulsi (Holy Basil)",
        scientificName: "Ocimum sanctum",
        description: "A sacred plant in Ayurvedic tradition, known for its healing properties and spiritual significance.",
        properties: ["Adaptogenic", "Anti-inflammatory", "Antioxidant", "Respiratory Support", "Stress Relief"],
        uses: [
            "Respiratory health",
            "Stress reduction",
            "Immune support",
            "Sacred ceremonies"
        ],
        position: { x: 5, y: 0, z: -5 },
        color: 0x4CAF50,
        shape: "herb",
        scale: 1.2,
        doshas: ["vata", "kapha"]
    },
    {
        id: "ashwagandha",
        name: "Ashwagandha",
        scientificName: "Withania somnifera",
        description: "Known as Indian Ginseng, this powerful adaptogenic herb helps the body manage stress.",
        properties: ["Adaptogenic", "Rejuvenating", "Strength-Promoting", "Sleep-Supporting"],
        uses: [
            "Stress management",
            "Energy enhancement",
            "Sleep improvement",
            "Immune support"
        ],
        position: { x: -5, y: 0, z: -7 },
        color: 0xA0522D,
        shape: "bush",
        scale: 1.5,
        doshas: ["vata", "kapha"]
    },
    {
        id: "turmeric",
        name: "Turmeric",
        scientificName: "Curcuma longa",
        description: "The golden spice of life, known for its powerful anti-inflammatory properties.",
        properties: ["Anti-inflammatory", "Antioxidant", "Joint Health", "Digestive Aid"],
        uses: [
            "Pain relief",
            "Inflammation reduction",
            "Digestive health",
            "Skin care"
        ],
        position: { x: 8, y: 0, z: 2 },
        color: 0xFFD700,
        shape: "herb",
        scale: 1.0,
        doshas: ["pitta", "kapha"]
    },
    {
        id: "cardamom",
        name: "Cardamom",
        scientificName: "Elettaria cardamomum",
        description: "The Queen of Spices, valued for its unique flavor and digestive properties.",
        properties: ["Digestive Aid", "Breath Freshener", "Heart Health", "Mental Clarity"],
        uses: [
            "Digestive support",
            "Oral health",
            "Respiratory care",
            "Culinary spice"
        ],
        position: { x: -8, y: 0, z: 4 },
        color: 0x90EE90,
        shape: "herb",
        scale: 0.8,
        doshas: ["vata", "kapha"]
    },
    {
        id: "cinnamon",
        name: "Cinnamon",
        scientificName: "Cinnamomum verum",
        description: "A warming spice that supports metabolism and blood sugar balance.",
        properties: ["Blood Sugar Support", "Anti-microbial", "Warming", "Circulatory Aid"],
        uses: [
            "Blood sugar management",
            "Digestive health",
            "Circulation support",
            "Immune boosting"
        ],
        position: { x: 7, y: 0, z: -8 },
        color: 0x8B4513,
        shape: "tree",
        scale: 1.3,
        doshas: ["kapha", "vata"]
    },
    {
        id: "clove",
        name: "Clove",
        scientificName: "Syzygium aromaticum",
        description: "A powerful antiseptic herb with strong pain-relieving properties.",
        properties: ["Pain Relief", "Antiseptic", "Digestive Aid", "Oral Health"],
        uses: [
            "Dental care",
            "Pain management",
            "Digestive support",
            "Immune strengthening"
        ],
        position: { x: -6, y: 0, z: 8 },
        color: 0x654321,
        shape: "herb",
        scale: 0.9,
        doshas: ["kapha", "vata"]
    },
    {
        id: "brahmi",
        name: "Brahmi",
        scientificName: "Bacopa monnieri",
        description: "A powerful brain tonic that enhances memory and cognitive function.",
        properties: ["Brain Tonic", "Memory Enhancer", "Anti-anxiety", "Rejuvenative"],
        uses: [
            "Memory enhancement",
            "Mental clarity",
            "Stress reduction",
            "Cognitive support"
        ],
        position: { x: 3, y: 0, z: 7 },
        color: 0x228B22,
        shape: "herb",
        scale: 0.7,
        doshas: ["pitta", "vata"]
    },
    {
        id: "neem",
        name: "Neem",
        scientificName: "Azadirachta indica",
        description: "Known as the village pharmacy, neem is a powerful detoxifier and immune booster.",
        properties: ["Blood Purifier", "Immune Booster", "Skin Health", "Anti-microbial"],
        uses: [
            "Skin care",
            "Blood purification",
            "Dental health",
            "Natural pesticide"
        ],
        position: { x: -3, y: 0, z: -9 },
        color: 0x355E3B,
        shape: "tree",
        scale: 1.4,
        doshas: ["pitta", "kapha"]
    },
    {
        id: "shatavari",
        name: "Shatavari",
        scientificName: "Asparagus racemosus",
        description: "A rejuvenating herb particularly beneficial for feminine health and vitality.",
        properties: ["Women's Health", "Rejuvenative", "Digestive Aid", "Immune Support"],
        uses: [
            "Hormonal balance",
            "Reproductive health",
            "Digestive support",
            "Energy enhancement"
        ],
        position: { x: 10, y: 0, z: 5 },
        color: 0x9ACD32,
        shape: "herb",
        scale: 1.1,
        doshas: ["pitta", "vata"]
    },
    {
        id: "amla",
        name: "Amla (Indian Gooseberry)",
        scientificName: "Phyllanthus emblica",
        description: "One of the richest natural sources of Vitamin C, known for its rejuvenating properties.",
        properties: ["Antioxidant", "Rejuvenative", "Digestive Aid", "Hair Health"],
        uses: [
            "Immune strengthening",
            "Hair care",
            "Digestive health",
            "Anti-aging"
        ],
        position: { x: -10, y: 0, z: -3 },
        color: 0x32CD32,
        shape: "tree",
        scale: 1.2,
        doshas: ["pitta", "vata", "kapha"]
    }
];

// Plant meshes array
const plantMeshes = [];

// Load GLB models using GLTFLoader
const loader = new THREE.GLTFLoader();
const modelPaths = {
    "tulsi": "tulsi.glb",
    "ashwagandha": "Ahwagandha.glb",
    "turmeric": "Turmeric.glb",
    "cinnamon": "Cinnamon.glb",
    "cardamom": "Cardamom.glb",
    "clove": "clove.glb"
};

// Load plants
let loadedItems = 0;
let totalItemsToLoad = ayurvedicPlants.length;

function updateLoadingProgress() {
    loadedItems++;
    const progress = (loadedItems / totalItemsToLoad) * 100;
    document.getElementById('loading-bar').style.width = `${progress}%`;
    
    if (loadedItems >= totalItemsToLoad) {
        setTimeout(() => {
            document.getElementById('loading-screen').style.display = 'none';
        }, 1000);
    }
}

// Create plants with 3D models
ayurvedicPlants.forEach((plant, index) => {
    if (modelPaths[plant.id]) {
        loader.load(modelPaths[plant.id], 
            // Success callback
            (gltf) => {
                const model = gltf.scene;
                
                // Scale and position the model
                model.scale.set(plant.scale, plant.scale, plant.scale);
                model.position.set(plant.position.x, plant.position.y + 1, plant.position.z);
                model.rotation.y = Math.random() * Math.PI * 2;
                
                // Enable shadows and store reference for interaction
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        node.userData = { isPlant: true, plantIndex: index };
                    }
                });
                
                scene.add(model);
                plantMeshes.push(model);
                
                createPlantDecoration(plant, model);
                updateLoadingProgress();
            },
            // Progress callback
            (xhr) => {
                console.log(`${plant.id}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            // Error callback
            (error) => {
                console.error(`Error loading ${plant.id}:`, error);
                createGeometricPlant(plant, index);
            }
        );
    } else {
        // If no model path exists, create geometric plant immediately
        createGeometricPlant(plant, index);
    }
});

// Create plant geometry based on shape
function createPlantGeometry(shape, scale) {
    let geometry;
    
    switch(shape) {
        case 'herb':
            geometry = new THREE.CylinderGeometry(0.2 * scale, 0.3 * scale, 1.5 * scale, 8);
            break;
        case 'bush':
            geometry = new THREE.SphereGeometry(0.8 * scale, 12, 12);
            break;
        case 'tree':
            geometry = new THREE.ConeGeometry(1 * scale, 3 * scale, 8);
            break;
        default:
            geometry = new THREE.CylinderGeometry(0.3 * scale, 0.3 * scale, 2 * scale, 8);
    }
    
    return geometry;
}

// Fallback function to create geometric plants if model loading fails
function createGeometricPlant(plant, index) {
    const plantGeometry = createPlantGeometry(plant.shape, plant.scale);
    const plantMaterial = new THREE.MeshStandardMaterial({ 
        color: plant.color,
        roughness: 0.8,
        metalness: 0.2
    });
    
    const plantMesh = new THREE.Mesh(plantGeometry, plantMaterial);
    plantMesh.position.set(plant.position.x, plant.position.y + 1, plant.position.z);
    plantMesh.scale.set(plant.scale, plant.scale, plant.scale);
    plantMesh.rotation.y = Math.random() * Math.PI * 2;
    plantMesh.castShadow = true;
    plantMesh.receiveShadow = true;
    plantMesh.userData = { isPlant: true, plantIndex: index };
    
    scene.add(plantMesh);
    plantMeshes.push(plantMesh);
    
    createLeaves(plant, plantMesh);
    createPlantDecoration(plant, plantMesh);
    
    updateLoadingProgress();
}

// Create leaves for plants
function createLeaves(plant, plantMesh) {
    const leafGeometry = new THREE.PlaneGeometry(0.5, 0.5);
    const leafMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4CAF50,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.2
    });
    
    const leafCount = plant.shape === 'bush' ? 12 : 8;
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        const angle = (i / leafCount) * Math.PI * 2;
        const radius = 0.7;
        const height = plant.shape === 'bush' ? 0.8 : 1.2;
        
        leaf.position.set(
            Math.cos(angle) * radius,
            height * Math.random(),
            Math.sin(angle) * radius
        );
        
        leaf.rotation.x = Math.PI / 2;
        leaf.rotation.y = Math.random() * Math.PI;
        leaf.rotation.z = Math.random() * Math.PI / 4;
        
        plantMesh.add(leaf);
    }
}

// Create decorative elements around plants
function createPlantDecoration(plant, plantMesh) {
    // Add rocks
    if (Math.random() > 0.5) {
        const rockCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < rockCount; i++) {
            const rockGeometry = new THREE.DodecahedronGeometry(0.2 + Math.random() * 0.3, 0);
            const rockMaterial = new THREE.MeshStandardMaterial({
                color: 0x808080,
                roughness: 0.9,
                metalness: 0.1
            });
            
            const rock = new THREE.Mesh(rockGeometry, rockMaterial);
            const angle = Math.random() * Math.PI * 2;
            const distance = 1 + Math.random() * 0.5;
            
            rock.position.set(
                plantMesh.position.x + Math.cos(angle) * distance,
                0.1,
                plantMesh.position.z + Math.sin(angle) * distance
            );
            
            rock.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            
            rock.scale.set(
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5
            );
            
            rock.castShadow = true;
            rock.receiveShadow = true;
            
            scene.add(rock);
        }
    }
}

// Plant interaction
const raycaster = new THREE.Raycaster();

function checkPlantInteraction() {
    if (!controls.isLocked) return;
    
    if (activeHighlight) {
        clearPlantInteraction();
    }
    
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
    // Get all meshes from the plant models for intersection testing
    const meshesToTest = [];
    plantMeshes.forEach(model => {
        model.traverse((node) => {
            if (node.isMesh) {
                meshesToTest.push(node);
            }
        });
    });
    
    const intersects = raycaster.intersectObjects(meshesToTest);
    
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        
        if (intersectedObject.userData && intersectedObject.userData.isPlant) {
            const plant = ayurvedicPlants[intersectedObject.userData.plantIndex];
            showPlantInfo(plant);
            // Use the parent model for highlighting
            const modelRoot = intersectedObject.parent;
            while (modelRoot.parent && modelRoot.parent !== scene) {
                modelRoot = modelRoot.parent;
            }
            createHighlight(modelRoot);
        }
    }
}

function showPlantInfo(plant) {
    const infoPanel = document.getElementById('plant-info');
    document.getElementById('plant-name').textContent = plant.name;
    document.getElementById('scientific-name').textContent = plant.scientificName;
    document.getElementById('plant-description').textContent = plant.description;
    
    const propertiesContainer = document.getElementById('plant-properties');
    propertiesContainer.innerHTML = '';
    plant.properties.forEach(property => {
        const span = document.createElement('span');
        span.className = 'property';
        span.textContent = property;
        propertiesContainer.appendChild(span);
    });
    
    const doshasContainer = document.getElementById('plant-doshas');
    doshasContainer.innerHTML = '';
    plant.doshas.forEach(dosha => {
        const span = document.createElement('span');
        span.className = `dosha dosha-${dosha}`;
        span.textContent = dosha.charAt(0).toUpperCase() + dosha.slice(1);
        doshasContainer.appendChild(span);
    });
    
    const usesContainer = document.getElementById('plant-uses');
    usesContainer.innerHTML = '<h4>Common Uses:</h4><ul>';
    plant.uses.forEach(use => {
        usesContainer.innerHTML += `<li>${use}</li>`;
    });
    usesContainer.innerHTML += '</ul>';
    
    infoPanel.style.display = 'block';
}

function createHighlight(plantObject) {
    const boundingBox = new THREE.Box3().setFromObject(plantObject);
    const size = boundingBox.getSize(new THREE.Vector3());
    const center = boundingBox.getCenter(new THREE.Vector3());
    
    const highlightGeometry = new THREE.SphereGeometry(Math.max(size.x, size.y, size.z) / 1.5, 16, 16);
    const highlightMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    
    const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    highlight.position.copy(center);
    scene.add(highlight);
    
    activeHighlight = highlight;
    
    // Animate highlight
    gsap.to(highlight.scale, {
        x: 1.8,
        y: 1.8,
        z: 1.8,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
}

function clearPlantInteraction() {
    if (activeHighlight) {
        scene.remove(activeHighlight);
        activeHighlight = null;
    }
    document.getElementById('plant-info').style.display = 'none';
}

// Collision detection
const playerRadius = 0.5;

function checkCollisions() {
    const playerPosition = controls.getObject().position;
    
    for (const plant of plantMeshes) {
        const dx = plant.position.x - playerPosition.x;
        const dz = plant.position.z - playerPosition.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < playerRadius + 0.7) {
            const pushVector = new THREE.Vector3(dx, 0, dz).normalize().multiplyScalar(0.1);
            controls.getObject().position.x += pushVector.x;
            controls.getObject().position.z += pushVector.z;
        }
    }
}

// Meditation mode
function checkMeditationMode(delta) {
    if (!lastPosition) {
        lastPosition.copy(controls.getObject().position);
        return;
    }
    
    const movement = controls.getObject().position.distanceTo(lastPosition);
    lastPosition.copy(controls.getObject().position);
    
    if (movement < moveThreshold) {
        meditationTime += delta;
        
        if (meditationTime > meditationThreshold && !isInMeditation) {
            enterMeditationMode();
        }
    } else {
        if (meditationTime > 0) {
            meditationTime = 0;
            if (isInMeditation) {
                exitMeditationMode();
            }
        }
    }
}

function enterMeditationMode() {
    isInMeditation = true;
    document.getElementById('meditation-message').style.display = 'block';
    
    // Add meditation particles
    createMeditationParticles();
    
    // Change scene atmosphere
    gsap.to(scene.fog.color, {
        r: 0.4,
        g: 0.5,
        b: 0.6,
        duration: 2
    });
}

function exitMeditationMode() {
    isInMeditation = false;
    document.getElementById('meditation-message').style.display = 'none';
    
    // Remove meditation particles
    if (meditationParticles) {
        scene.remove(meditationParticles);
        meditationParticles = null;
    }
    
    // Restore scene atmosphere
    gsap.to(scene.fog.color, {
        r: scene.background.r,
        g: scene.background.g,
        b: scene.background.b,
        duration: 1
    });
}

let meditationParticles = null;

function createMeditationParticles() {
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const playerPos = controls.getObject().position;
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const radius = 3 + Math.random() * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i3] = playerPos.x + radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = playerPos.y + radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = playerPos.z + radius * Math.cos(phi);
        
        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.5, 0.5);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    meditationParticles = new THREE.Points(geometry, material);
    scene.add(meditationParticles);
    
    animateMeditationParticles();
}

function animateMeditationParticles() {
    if (!meditationParticles || !isInMeditation) return;
    
    const positions = meditationParticles.geometry.attributes.position.array;
    const playerPos = controls.getObject().position;
    
    for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i] - playerPos.x;
        const y = positions[i + 1] - playerPos.y;
        const z = positions[i + 2] - playerPos.z;
        
        const distance = Math.sqrt(x * x + y * y + z * z);
        const theta = Math.atan2(z, x) + 0.003;
        const phi = Math.acos(y / distance);
        
        positions[i] = playerPos.x + distance * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = playerPos.y + distance * Math.cos(phi);
        positions[i + 2] = playerPos.z + distance * Math.sin(phi) * Math.sin(theta);
    }
    
    meditationParticles.geometry.attributes.position.needsUpdate = true;
    requestAnimationFrame(animateMeditationParticles);
}

// Handle window resize
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const delta = 0.1;
    
    if (controls.isLocked) {
        velocity.y -= 9.8 * delta;
        
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        
        if (moveForward || moveBackward) velocity.z = direction.z * moveSpeed;
        else velocity.z = 0;
        
        if (moveLeft || moveRight) velocity.x = direction.x * moveSpeed;
        else velocity.x = 0;
        
        controls.moveRight(velocity.x);
        controls.moveForward(velocity.z);
        
        controls.getObject().position.y += velocity.y;
        
        if (controls.getObject().position.y < playerHeight) {
            velocity.y = 0;
            controls.getObject().position.y = playerHeight;
        }
        
        checkCollisions();
        checkMeditationMode(delta);
    }
    
    renderer.render(scene, camera);
}

// Start animation loop
animate(); 
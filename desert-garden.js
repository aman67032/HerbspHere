// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Set up renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.getElementById('scene-container').appendChild(renderer.domElement);

// Add desert atmosphere
scene.fog = new THREE.FogExp2(0xF2D16B, 0.008);
scene.background = new THREE.Color(0xF2D16B);

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
const meditationThreshold = 30;

// Desert oasis plants data
const desertPlants = [
    {
        id: "aloe_vera",
        name: "Aloe Vera",
        scientificName: "Aloe barbadensis miller",
        description: "A succulent plant species known for its medicinal properties and ability to thrive in arid conditions.",
        properties: ["Healing", "Drought-resistant", "Medicinal", "Succulent"],
        uses: [
            "Skin healing",
            "Burn treatment",
            "Digestive health",
            "Natural moisturizer"
        ],
        position: { x: 4, y: 0, z: -4 },
        color: 0x90EE90,
        shape: "succulent",
        scale: 1.5
    },
    {
        id: "desert_sage",
        name: "Desert Sage",
        scientificName: "Salvia dorrii",
        description: "An aromatic shrub adapted to desert conditions, known for its spiritual and medicinal properties.",
        properties: ["Aromatic", "Heat-tolerant", "Medicinal", "Sacred"],
        uses: [
            "Spiritual cleansing",
            "Respiratory health",
            "Natural antiseptic",
            "Aromatherapy"
        ],
        position: { x: -6, y: 0, z: -2 },
        color: 0xA8B4A5,
        shape: "bush",
        scale: 1.2
    },
    {
        id: "desert_lavender",
        name: "Desert Lavender",
        scientificName: "Hyptis emoryi",
        description: "A drought-tolerant aromatic plant with calming properties.",
        properties: ["Calming", "Heat-resistant", "Fragrant", "Medicinal"],
        uses: [
            "Stress relief",
            "Sleep aid",
            "Natural perfume",
            "Insect repellent"
        ],
        position: { x: 2, y: 0, z: 3 },
        color: 0x9B7CB9,
        shape: "bush",
        scale: 1.3
    },
    {
        id: "prickly_pear",
        name: "Prickly Pear Cactus",
        scientificName: "Opuntia",
        description: "An edible cactus with medicinal properties and nutritious fruits.",
        properties: ["Edible", "Drought-resistant", "Nutritious", "Medicinal"],
        uses: [
            "Blood sugar control",
            "Anti-inflammatory",
            "Natural food source",
            "Wound healing"
        ],
        position: { x: -4, y: 0, z: 5 },
        color: 0x7CAC7A,
        shape: "cactus",
        scale: 1.8
    }
];

// Plant meshes array
const plantMeshes = [];

// Load GLB models using GLTFLoader
const loader = new THREE.GLTFLoader();
const modelPaths = {
    "aloe_vera": "aloe.glb",
    "desert_sage": "sage.glb",
    "desert_lavender": "lavender.glb",
    "prickly_pear": "cactus.glb"
};

// Load plants
let loadedItems = 0;
let totalItemsToLoad = desertPlants.length;

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

// Create desert oasis elements
function createDesertElements() {
    // Create sand ground
    const sandGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const sandMaterial = new THREE.MeshStandardMaterial({
        color: 0xE6C588,
        roughness: 1,
        metalness: 0
    });
    
    // Add sand dune effect
    const vertices = sandGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        const x = vertices[i];
        const z = vertices[i + 2];
        vertices[i + 1] = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
    }
    sandGeometry.computeVertexNormals();
    
    const sand = new THREE.Mesh(sandGeometry, sandMaterial);
    sand.rotation.x = -Math.PI / 2;
    sand.receiveShadow = true;
    scene.add(sand);

    // Create oasis water
    const waterGeometry = new THREE.CircleGeometry(3, 32);
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x4FA4C8,
        transparent: true,
        opacity: 0.8
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 0.05, 0);
    scene.add(water);

    // Add palm trees around oasis
    const palmPositions = [
        { x: -4, z: -4 },
        { x: 4, z: 4 },
        { x: -4, z: 4 },
        { x: 4, z: -4 }
    ];

    palmPositions.forEach(pos => {
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B4513,
            roughness: 0.8
        });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(pos.x, 2, pos.z);
        trunk.castShadow = true;
        scene.add(trunk);

        // Add palm leaves
        const leavesGeometry = new THREE.ConeGeometry(2, 3, 8);
        const leavesMaterial = new THREE.MeshStandardMaterial({
            color: 0x355E3B,
            roughness: 0.7
        });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(pos.x, 4, pos.z);
        leaves.castShadow = true;
        scene.add(leaves);
    });
}

// Create plants with 3D models or geometric shapes
desertPlants.forEach((plant, index) => {
    if (modelPaths[plant.id]) {
        loader.load(modelPaths[plant.id],
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(plant.scale, plant.scale, plant.scale);
                model.position.set(plant.position.x, plant.position.y, plant.position.z);
                model.rotation.y = Math.random() * Math.PI * 2;
                
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
            (xhr) => {
                console.log(`${plant.id}: ${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            (error) => {
                console.error(`Error loading ${plant.id}:`, error);
                createGeometricPlant(plant, index);
            }
        );
    } else {
        createGeometricPlant(plant, index);
    }
});

// Create geometric plants
function createGeometricPlant(plant, index) {
    let geometry;
    
    switch(plant.shape) {
        case 'succulent':
            geometry = new THREE.DodecahedronGeometry(0.5, 1);
            break;
        case 'bush':
            geometry = new THREE.SphereGeometry(0.7, 8, 6);
            break;
        case 'cactus':
            geometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
            break;
        default:
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
    }
    
    const material = new THREE.MeshStandardMaterial({
        color: plant.color,
        roughness: 0.8,
        metalness: 0.2
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(plant.position.x, plant.position.y + 1, plant.position.z);
    mesh.scale.set(plant.scale, plant.scale, plant.scale);
    mesh.rotation.y = Math.random() * Math.PI * 2;
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { isPlant: true, plantIndex: index };
    
    scene.add(mesh);
    plantMeshes.push(mesh);
    createPlantDecoration(plant, mesh);
    updateLoadingProgress();
}

// Create decorative elements around plants
function createPlantDecoration(plant, plantMesh) {
    // Add rocks or desert decorations near plants
    const decorCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < decorCount; i++) {
        const isRock = Math.random() > 0.3;
        let decorGeometry, decorMaterial;
        
        if (isRock) {
            decorGeometry = new THREE.DodecahedronGeometry(0.2 + Math.random() * 0.2, 0);
            decorMaterial = new THREE.MeshStandardMaterial({
                color: 0xA0522D,
                roughness: 0.9,
                metalness: 0.1
            });
        } else {
            decorGeometry = new THREE.ConeGeometry(0.2, 0.4, 6);
            decorMaterial = new THREE.MeshStandardMaterial({
                color: 0xDEB887,
                roughness: 0.9,
                metalness: 0.1
            });
        }
        
        const decor = new THREE.Mesh(decorGeometry, decorMaterial);
        const angle = Math.random() * Math.PI * 2;
        const distance = 0.8 + Math.random() * 0.5;
        
        decor.position.set(
            plantMesh.position.x + Math.cos(angle) * distance,
            0.1,
            plantMesh.position.z + Math.sin(angle) * distance
        );
        
        decor.rotation.set(
            Math.random() * Math.PI * 0.1,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 0.1
        );
        
        decor.castShadow = true;
        decor.receiveShadow = true;
        
        scene.add(decor);
    }
}

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
sunLight.position.set(50, 100, 50);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

// Create desert elements
createDesertElements();

// Handle window resize
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Movement controls
document.addEventListener('keydown', function(event) {
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
    }
});

document.addEventListener('keyup', function(event) {
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
});

// Plant interaction
const raycaster = new THREE.Raycaster();

function checkPlantInteraction() {
    if (!controls.isLocked) return;
    
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    
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
            const plant = desertPlants[intersectedObject.userData.plantIndex];
            showPlantInfo(plant);
            const modelRoot = intersectedObject.parent;
            createHighlight(modelRoot || intersectedObject);
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
    
    const usesContainer = document.getElementById('plant-uses');
    usesContainer.innerHTML = '<h4>Common Uses:</h4><ul>';
    plant.uses.forEach(use => {
        usesContainer.innerHTML += `<li>${use}</li>`;
    });
    usesContainer.innerHTML += '</ul>';
    
    infoPanel.style.display = 'block';
}

function createHighlight(plantObject) {
    if (activeHighlight) {
        scene.remove(activeHighlight);
    }
    
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
    
    activeHighlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    activeHighlight.position.copy(center);
    scene.add(activeHighlight);
    
    gsap.to(activeHighlight.scale, {
        x: 1.2,
        y: 1.2,
        z: 1.2,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });
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
    
    // Change scene atmosphere
    gsap.to(scene.fog.color, {
        r: 0.95,
        g: 0.85,
        b: 0.6,
        duration: 2
    });
    
    // Add meditation particles
    createMeditationParticles();
}

function exitMeditationMode() {
    isInMeditation = false;
    document.getElementById('meditation-message').style.display = 'none';
    
    if (meditationParticles) {
        scene.remove(meditationParticles);
        meditationParticles = null;
    }
    
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
        color.setHSL(0.1, 0.8, 0.6);
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
        const theta = Math.atan2(z, x) + 0.002;
        const phi = Math.acos(y / distance);
        
        positions[i] = playerPos.x + distance * Math.sin(phi) * Math.cos(theta);
        positions[i + 1] = playerPos.y + distance * Math.cos(phi);
        positions[i + 2] = playerPos.z + distance * Math.sin(phi) * Math.sin(theta);
    }
    
    meditationParticles.geometry.attributes.position.needsUpdate = true;
    requestAnimationFrame(animateMeditationParticles);
}

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
        
        checkMeditationMode(delta);
    }
    
    renderer.render(scene, camera);
}

// Handle pointer lock
renderer.domElement.addEventListener('click', function() {
    if (!controls.isLocked) {
        controls.lock();
    } else {
        checkPlantInteraction();
    }
});

// Start animation loop
animate(); 
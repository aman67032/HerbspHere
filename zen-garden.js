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
scene.fog = new THREE.FogExp2(0xE8E8E0, 0.015);
scene.background = new THREE.Color(0xE8E8E0);

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

// Zen garden plants data
const zenPlants = [
    {
        id: "bamboo",
        name: "Bamboo",
        scientificName: "Bambusa vulgaris",
        description: "A symbol of flexibility and strength in Zen gardens, bamboo represents resilience and peace.",
        properties: ["Fast-growing", "Air-purifying", "Stress-reducing", "Sustainable"],
        uses: [
            "Natural privacy screen",
            "Meditation focal point",
            "Air purification",
            "Sustainable material"
        ],
        position: { x: 5, y: 0, z: -5 },
        color: 0x90EE90,
        shape: "bamboo",
        scale: 2.0
    },
    {
        id: "japanese_maple",
        name: "Japanese Maple",
        scientificName: "Acer palmatum",
        description: "A graceful tree with delicate leaves that change colors with seasons, representing the impermanence of life.",
        properties: ["Ornamental", "Shade-providing", "Color-changing", "Meditative"],
        uses: [
            "Focal point",
            "Shade garden",
            "Seasonal interest",
            "Meditation aid"
        ],
        position: { x: -8, y: 0, z: -3 },
        color: 0xFF6B6B,
        shape: "tree",
        scale: 1.5
    },
    {
        id: "moss",
        name: "Japanese Moss",
        scientificName: "Polytrichum commune",
        description: "Soft, green moss that creates a sense of age and tranquility in the garden.",
        properties: ["Ground-covering", "Moisture-loving", "Low-maintenance", "Peaceful"],
        uses: [
            "Ground cover",
            "Moisture retention",
            "Visual softening",
            "Natural carpet"
        ],
        position: { x: 3, y: 0, z: 4 },
        color: 0x355E3B,
        shape: "ground",
        scale: 1.0
    },
    {
        id: "cherry_blossom",
        name: "Cherry Blossom",
        scientificName: "Prunus serrulata",
        description: "Symbol of the ephemeral nature of life in Japanese culture, known for its beautiful spring blooms.",
        properties: ["Seasonal beauty", "Symbolic", "Ornamental", "Inspiring"],
        uses: [
            "Spring celebration",
            "Meditation focus",
            "Visual beauty",
            "Cultural significance"
        ],
        position: { x: -5, y: 0, z: 6 },
        color: 0xFFB7C5,
        shape: "tree",
        scale: 1.8
    }
];

// Plant meshes array
const plantMeshes = [];

// Load GLB models using GLTFLoader
const loader = new THREE.GLTFLoader();
const modelPaths = {
    "bamboo": "bamboo.glb",
    "japanese_maple": "maple.glb",
    "cherry_blossom": "cherry.glb"
};

// Load plants
let loadedItems = 0;
let totalItemsToLoad = zenPlants.length;

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

// Create zen garden elements
function createZenGardenElements() {
    // Create stone garden (karesansui)
    const stoneGardenGeometry = new THREE.PlaneGeometry(20, 20);
    const stoneGardenMaterial = new THREE.MeshStandardMaterial({
        color: 0xE5E5E5,
        roughness: 1,
        metalness: 0
    });
    const stoneGarden = new THREE.Mesh(stoneGardenGeometry, stoneGardenMaterial);
    stoneGarden.rotation.x = -Math.PI / 2;
    stoneGarden.receiveShadow = true;
    scene.add(stoneGarden);

    // Add rock formations
    const rockPositions = [
        { x: 2, y: 0, z: -2, scale: 1.5 },
        { x: -1, y: 0, z: -3, scale: 1.2 },
        { x: 0, y: 0, z: -4, scale: 1.0 }
    ];

    rockPositions.forEach(pos => {
        const rockGeometry = new THREE.DodecahedronGeometry(pos.scale, 1);
        const rockMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.8,
            metalness: 0.2
        });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(pos.x, pos.y + pos.scale / 2, pos.z);
        rock.castShadow = true;
        rock.receiveShadow = true;
        scene.add(rock);
    });

    // Add raked sand patterns
    const sandPatterns = [];
    for (let i = -9; i <= 9; i += 0.5) {
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-10, 0.01, i),
            new THREE.Vector3(0, 0.01, i + 1),
            new THREE.Vector3(10, 0.01, i)
        );

        const points = curve.getPoints(50);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xD3D3D3 });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        sandPatterns.push(line);
        scene.add(line);
    }
}

// Create plants with 3D models or geometric shapes
zenPlants.forEach((plant, index) => {
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
        case 'bamboo':
            geometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
            break;
        case 'tree':
            geometry = new THREE.ConeGeometry(1, 3, 8);
            break;
        case 'ground':
            geometry = new THREE.PlaneGeometry(2, 2);
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
    mesh.position.set(plant.position.x, plant.position.y + (plant.shape === 'ground' ? 0.01 : 1), plant.position.z);
    mesh.scale.set(plant.scale, plant.scale, plant.scale);
    
    if (plant.shape === 'ground') {
        mesh.rotation.x = -Math.PI / 2;
    } else {
        mesh.rotation.y = Math.random() * Math.PI * 2;
    }
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { isPlant: true, plantIndex: index };
    
    scene.add(mesh);
    plantMeshes.push(mesh);
    
    if (plant.shape !== 'ground') {
        createPlantDecoration(plant, mesh);
    }
    
    updateLoadingProgress();
}

// Create decorative elements around plants
function createPlantDecoration(plant, plantMesh) {
    // Add small rocks or lanterns near plants
    if (Math.random() > 0.5) {
        const decorCount = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < decorCount; i++) {
            const isLantern = Math.random() > 0.7;
            let decorGeometry, decorMaterial;
            
            if (isLantern) {
                decorGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 6);
                decorMaterial = new THREE.MeshStandardMaterial({
                    color: 0xA0522D,
                    roughness: 0.9,
                    metalness: 0.1
                });
            } else {
                decorGeometry = new THREE.DodecahedronGeometry(0.2 + Math.random() * 0.2, 0);
                decorMaterial = new THREE.MeshStandardMaterial({
                    color: 0x808080,
                    roughness: 0.9,
                    metalness: 0.1
                });
            }
            
            const decor = new THREE.Mesh(decorGeometry, decorMaterial);
            const angle = Math.random() * Math.PI * 2;
            const distance = 1 + Math.random() * 0.5;
            
            decor.position.set(
                plantMesh.position.x + Math.cos(angle) * distance,
                isLantern ? 0.4 : 0.1,
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
}

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 15, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// Create zen garden elements
createZenGardenElements();

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
            const plant = zenPlants[intersectedObject.userData.plantIndex];
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
        r: 0.9,
        g: 0.9,
        b: 0.9,
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
        color.setHSL(0.55, 0.2, 0.7);
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
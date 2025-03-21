// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Set up renderer
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;

    // Get container and append renderer
    const container = document.getElementById('scene-container');
    if (!container) {
        console.error('Could not find scene container');
        return;
    }
    container.appendChild(renderer.domElement);

    // Add enchanted atmosphere
    scene.fog = new THREE.FogExp2(0xE6E6FA, 0.015);
    scene.background = new THREE.Color(0xE6E6FA);

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

    // Initialize camera position
    camera.position.set(0, playerHeight, 5);

    // Player control setup
    let controls;
    try {
        // Initialize controls with the renderer's DOM element
        controls = new THREE.PointerLockControls(camera, renderer.domElement);
        console.log('PointerLockControls initialized');

        // Add click handler to start the experience
        renderer.domElement.addEventListener('click', function() {
            if (!controls.isLocked) {
                console.log('Requesting pointer lock');
                controls.lock();
            }
        });

        // Add pointer lock change handler
        document.addEventListener('pointerlockchange', function() {
            console.log('Pointer lock state changed:', document.pointerLockElement ? 'locked' : 'unlocked');
            const controlsInfo = document.querySelector('.controls-info');
            const loadingScreen = document.getElementById('loading-screen');
            
            if (document.pointerLockElement === renderer.domElement) {
                console.log('Controls locked');
                if (controlsInfo) controlsInfo.style.display = 'block';
                if (loadingScreen) loadingScreen.style.display = 'none';
            } else {
                console.log('Controls unlocked');
                if (controlsInfo) controlsInfo.style.display = 'none';
            }
        });

        // Add error handler
        document.addEventListener('pointerlockerror', function(event) {
            console.error('Pointer lock error:', event);
            alert('Click the garden view to start exploring!');
        });

        scene.add(controls.getObject());
    } catch (error) {
        console.error('Error initializing controls:', error);
        alert('There was an error initializing the 3D view. Please try refreshing the page.');
    }

    // Active plant highlight reference
    let activeHighlight = null;

    // Meditation mode variables
    let meditationTime = 0;
    let isInMeditation = false;
    let lastPosition = new THREE.Vector3();
    const moveThreshold = 0.1;
    const meditationThreshold = 30;

    // Fairy garden plants data
    const fairyPlants = [
        {
            id: "moonflower",
            name: "Moonflower",
            scientificName: "Ipomoea alba",
            description: "A mystical night-blooming flower that glows under moonlight, known for its dream-enhancing properties.",
            properties: ["Night-blooming", "Luminescent", "Magical", "Calming"],
            uses: [
                "Dream enhancement",
                "Sleep aid",
                "Spiritual connection",
                "Night garden feature"
            ],
            position: { x: 3, y: 0, z: -4 },
            color: 0xF0F8FF,
            shape: "flower",
            scale: 1.2
        },
        {
            id: "fairy_bells",
            name: "Fairy Bells",
            scientificName: "Digitalis purpurea",
            description: "Delicate bell-shaped flowers that chime in the magical breeze, attracting beneficial fairy energy.",
            properties: ["Musical", "Enchanting", "Protective", "Healing"],
            uses: [
                "Fairy attraction",
                "Garden protection",
                "Sound healing",
                "Heart medicine"
            ],
            position: { x: -5, y: 0, z: -2 },
            color: 0xFFB6C1,
            shape: "bells",
            scale: 1.0
        },
        {
            id: "starlight_sage",
            name: "Starlight Sage",
            scientificName: "Salvia celestialis",
            description: "A magical variant of sage that sparkles with starlight, used in fairy rituals and healing.",
            properties: ["Sparkling", "Aromatic", "Magical", "Healing"],
            uses: [
                "Fairy rituals",
                "Energy cleansing",
                "Wish granting",
                "Dream guidance"
            ],
            position: { x: 4, y: 0, z: 3 },
            color: 0xE6E6FA,
            shape: "bush",
            scale: 1.3
        },
        {
            id: "rainbow_mushroom",
            name: "Rainbow Mushroom",
            scientificName: "Fungi iridescens",
            description: "Iridescent mushrooms that serve as fairy gathering spots and possess powerful healing properties.",
            properties: ["Iridescent", "Magical", "Healing", "Fairy-attracting"],
            uses: [
                "Fairy circles",
                "Color therapy",
                "Immune boosting",
                "Joy enhancement"
            ],
            position: { x: -3, y: 0, z: 5 },
            color: 0xFFA500,
            shape: "mushroom",
            scale: 0.8
        }
    ];

    // Plant meshes array
    const plantMeshes = [];

    // Load plants
    let loadedItems = 0;
    let totalItemsToLoad = fairyPlants.length;

    function updateLoadingProgress() {
        loadedItems++;
        const progress = (loadedItems / totalItemsToLoad) * 100;
        const loadingBar = document.getElementById('loading-bar');
        if (loadingBar) {
            loadingBar.style.width = `${progress}%`;
        }
        
        if (loadedItems >= totalItemsToLoad) {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
            }, 1000);
        }
    }

    // Create plants with geometric shapes (skipping GLB loading for now)
    fairyPlants.forEach((plant, index) => {
        createGeometricPlant(plant, index);
    });

    // Create geometric plants
    function createGeometricPlant(plant, index) {
        let geometry;
        
        switch(plant.shape) {
            case 'flower':
                // Create flower shape with petals
                const petalCount = 6;
                geometry = new THREE.Group();
                
                // Create center
                const centerGeometry = new THREE.SphereGeometry(0.2, 8, 8);
                const centerMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFF00,
                    emissive: 0xFFFF00,
                    emissiveIntensity: 0.2
                });
                const center = new THREE.Mesh(centerGeometry, centerMaterial);
                geometry.add(center);
                
                // Create petals
                for (let i = 0; i < petalCount; i++) {
                    const petalGeometry = new THREE.ConeGeometry(0.2, 0.6, 4, 1, true);
                    const petalMaterial = new THREE.MeshStandardMaterial({
                        color: plant.color,
                        emissive: plant.color,
                        emissiveIntensity: 0.2
                    });
                    const petal = new THREE.Mesh(petalGeometry, petalMaterial);
                    petal.position.y = -0.3;
                    petal.rotation.x = Math.PI;
                    petal.rotation.y = (i / petalCount) * Math.PI * 2;
                    petal.position.x = Math.cos((i / petalCount) * Math.PI * 2) * 0.3;
                    petal.position.z = Math.sin((i / petalCount) * Math.PI * 2) * 0.3;
                    geometry.add(petal);
                }
                break;
                
            case 'bells':
                geometry = new THREE.Group();
                const bellCount = 3;
                for (let i = 0; i < bellCount; i++) {
                    const bellGeometry = new THREE.CapsuleGeometry(0.15, 0.3, 4, 8);
                    const bellMaterial = new THREE.MeshStandardMaterial({
                        color: plant.color,
                        emissive: plant.color,
                        emissiveIntensity: 0.2
                    });
                    const bell = new THREE.Mesh(bellGeometry, bellMaterial);
                    bell.position.x = (i - 1) * 0.3;
                    bell.position.y = Math.sin(i * Math.PI/3) * 0.2;
                    geometry.add(bell);
                }
                break;
                
            case 'bush':
                geometry = new THREE.Group();
                const segments = 3;
                for (let i = 0; i < segments; i++) {
                    const bushPartGeometry = new THREE.SphereGeometry(0.4 - i * 0.1, 8, 6);
                    const bushMaterial = new THREE.MeshStandardMaterial({
                        color: plant.color,
                        emissive: plant.color,
                        emissiveIntensity: 0.2
                    });
                    const bushPart = new THREE.Mesh(bushPartGeometry, bushMaterial);
                    bushPart.position.y = i * 0.3;
                    geometry.add(bushPart);
                }
                break;
                
            case 'mushroom':
                geometry = new THREE.Group();
                
                // Create stem
                const stemGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.8, 8);
                const stemMaterial = new THREE.MeshStandardMaterial({
                    color: 0xFFFFFF,
                    roughness: 0.7
                });
                const stem = new THREE.Mesh(stemGeometry, stemMaterial);
                stem.position.y = 0.4;
                geometry.add(stem);
                
                // Create cap
                const capGeometry = new THREE.SphereGeometry(0.5, 8, 8, 0, Math.PI);
                const capMaterial = new THREE.MeshStandardMaterial({
                    color: plant.color,
                    emissive: plant.color,
                    emissiveIntensity: 0.3
                });
                const cap = new THREE.Mesh(capGeometry, capMaterial);
                cap.position.y = 0.8;
                cap.rotation.x = Math.PI;
                geometry.add(cap);
                break;
                
            default:
                geometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
        }
        
        let mesh;
        if (geometry instanceof THREE.Group) {
            mesh = geometry;
        } else {
            const material = new THREE.MeshStandardMaterial({
                color: plant.color,
                roughness: 0.6,
                metalness: 0.3,
                emissive: plant.color,
                emissiveIntensity: 0.2
            });
            mesh = new THREE.Mesh(geometry, material);
        }
        
        mesh.position.set(plant.position.x, plant.position.y + 0.4, plant.position.z);
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

    // Create fairy garden elements
    function createFairyElements() {
        // Create enchanted ground
        const groundGeometry = new THREE.PlaneGeometry(50, 50, 32, 32);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x90EE90,
            roughness: 0.8,
            metalness: 0.2
        });
        
        // Add gentle hills
        const vertices = groundGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            vertices[i + 1] = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 0.5;
        }
        groundGeometry.computeVertexNormals();
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Add fairy circles (rings of glowing particles)
        const fairyCircles = [
            { x: 5, z: 5 },
            { x: -4, z: -3 },
            { x: 2, z: -6 }
        ];

        fairyCircles.forEach(pos => {
            const circleGeometry = new THREE.TorusGeometry(1, 0.1, 8, 24);
            const circleMaterial = new THREE.MeshStandardMaterial({
                color: 0xFFFFFF,
                emissive: 0xFFFFFF,
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.7
            });
            const circle = new THREE.Mesh(circleGeometry, circleMaterial);
            circle.position.set(pos.x, 0.1, pos.z);
            circle.rotation.x = -Math.PI / 2;
            scene.add(circle);

            // Add glowing particles around the circle
            const particleCount = 20;
            const particleGeometry = new THREE.BufferGeometry();
            const particlePositions = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount; i++) {
                const angle = (i / particleCount) * Math.PI * 2;
                const radius = 1 + Math.sin(i * 0.5) * 0.1;
                particlePositions[i * 3] = pos.x + Math.cos(angle) * radius;
                particlePositions[i * 3 + 1] = 0.2 + Math.sin(i * 0.8) * 0.1;
                particlePositions[i * 3 + 2] = pos.z + Math.sin(angle) * radius;
            }
            
            particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
            
            const particleMaterial = new THREE.PointsMaterial({
                color: 0xFFFFFF,
                size: 0.1,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const particles = new THREE.Points(particleGeometry, particleMaterial);
            scene.add(particles);
        });
    }

    // Create decorative elements around plants
    function createPlantDecoration(plant, plantMesh) {
        // Add fairy lights and magical effects around plants
        const lightCount = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < lightCount; i++) {
            const lightGeometry = new THREE.SphereGeometry(0.05, 8, 8);
            const lightMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.8
            });
            
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            const angle = (i / lightCount) * Math.PI * 2;
            const radius = 0.5 + Math.random() * 0.3;
            const height = 0.2 + Math.random() * 0.8;
            
            light.position.set(
                plantMesh.position.x + Math.cos(angle) * radius,
                height,
                plantMesh.position.z + Math.sin(angle) * radius
            );
            
            // Add point light
            const pointLight = new THREE.PointLight(0xFFFFFF, 0.5, 1);
            pointLight.position.copy(light.position);
            scene.add(pointLight);
            
            // Animate the fairy light
            const startY = light.position.y;
            gsap.to(light.position, {
                y: startY + 0.2,
                duration: 1 + Math.random(),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            
            scene.add(light);
        }
    }

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xE6E6FA, 0.6);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xE6E6FA, 0.8);
    moonLight.position.set(10, 15, 10);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 2048;
    moonLight.shadow.mapSize.height = 2048;
    scene.add(moonLight);

    // Create fairy garden elements
    createFairyElements();

    // Initialize fairy particle system
    const fairyParticlesCanvas = document.getElementById('fairy-particles');
    let ctx = null;
    let particles = [];
    const particleCount = 50;

    // Only initialize if canvas is found
    if (fairyParticlesCanvas) {
        ctx = fairyParticlesCanvas.getContext('2d');
        fairyParticlesCanvas.width = window.innerWidth;
        fairyParticlesCanvas.height = window.innerHeight;

        class FairyParticle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * fairyParticlesCanvas.width;
                this.y = Math.random() * fairyParticlesCanvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.life = 1;
                this.color = `hsl(${Math.random() * 60 + 280}, 100%, 75%)`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= 0.005;
                
                if (this.life <= 0 || this.x < 0 || this.x > fairyParticlesCanvas.width || 
                    this.y < 0 || this.y > fairyParticlesCanvas.height) {
                    this.reset();
                }
            }
            
            draw() {
                if (ctx) {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.globalAlpha = this.life;
                    ctx.fill();
                }
            }
        }

        // Create initial particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new FairyParticle());
        }

        // Animate fairy particles
        function animateFairyParticles() {
            if (!ctx) return;
            
            ctx.clearRect(0, 0, fairyParticlesCanvas.width, fairyParticlesCanvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            requestAnimationFrame(animateFairyParticles);
        }

        // Start fairy particles animation
        animateFairyParticles();

        // Update canvas size on window resize
        window.addEventListener('resize', function() {
            if (fairyParticlesCanvas) {
                fairyParticlesCanvas.width = window.innerWidth;
                fairyParticlesCanvas.height = window.innerHeight;
            }
        });
    }

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
                const plant = fairyPlants[intersectedObject.userData.plantIndex];
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
            color: 0xE6E6FA,
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
            b: 1.0,
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
            color.setHSL(0.7, 0.8, 0.7);
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
        
        if (controls && controls.isLocked) {
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

    // Start animation loop and fairy particles
    animate();
    animateFairyParticles();

    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        if (fairyParticlesCanvas) {
            fairyParticlesCanvas.width = window.innerWidth;
            fairyParticlesCanvas.height = window.innerHeight;
        }
    });

    // Add instructions overlay
    const instructionsOverlay = document.createElement('div');
    instructionsOverlay.style.position = 'fixed';
    instructionsOverlay.style.top = '50%';
    instructionsOverlay.style.left = '50%';
    instructionsOverlay.style.transform = 'translate(-50%, -50%)';
    instructionsOverlay.style.color = 'white';
    instructionsOverlay.style.textAlign = 'center';
    instructionsOverlay.style.fontSize = '24px';
    instructionsOverlay.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    instructionsOverlay.innerHTML = 'Click to start exploring<br>WASD or Arrow Keys to move<br>Mouse to look around<br>E or Click to interact with plants';
    document.body.appendChild(instructionsOverlay);

    // Hide instructions when controls are locked
    document.addEventListener('pointerlockchange', function() {
        instructionsOverlay.style.display = document.pointerLockElement ? 'none' : 'block';
    });
}); 
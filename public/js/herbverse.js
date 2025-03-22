// Initialize Three.js and AR.js
import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

class HerbVerse {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.plants = [];
        this.challengeActive = false;
        this.plantsFound = 0;
        this.challengeTime = 600; // 10 minutes in seconds
        this.timeRemaining = this.challengeTime;

        this.init();
    }

    init() {
        // Setup renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.xr.enabled = true;
        document.body.appendChild(this.renderer.domElement);

        // Add AR button
        document.body.appendChild(ARButton.createButton(this.renderer));

        // Setup basic lighting
        const light = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(light);

        // Initialize recommended plants panel
        this.initRecommendedPlantsPanel();

        // Initialize challenge panel
        this.initChallengePanel();

        // Setup controls
        this.initControls();

        // Start animation loop
        this.animate();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    initRecommendedPlantsPanel() {
        // Get recommended plants from server
        fetch('/api/plants/recommended')
            .then(response => response.json())
            .then(plants => {
                this.updateRecommendedPlantsUI(plants);
            });
    }

    updateRecommendedPlantsUI(plants) {
        const plantsContainer = document.querySelector('.recommended-plants');
        plants.forEach(plant => {
            const plantCard = document.createElement('div');
            plantCard.className = 'plant-card';
            plantCard.innerHTML = `
                <h3>${plant.name}</h3>
                <p>${plant.matchPercentage}% Match</p>
                <button onclick="herbVerse.addPlantToGarden('${plant.id}')">Add</button>
            `;
            plantsContainer.appendChild(plantCard);
        });
    }

    initChallengePanel() {
        const challengePanel = document.querySelector('.herb-discovery-challenge');
        if (challengePanel) {
            const startButton = challengePanel.querySelector('.start-challenge');
            startButton.addEventListener('click', () => this.startChallenge());
        }
    }

    startChallenge() {
        this.challengeActive = true;
        this.plantsFound = 0;
        this.timeRemaining = this.challengeTime;
        this.updateChallengeUI();
        
        // Start countdown
        this.challengeTimer = setInterval(() => {
            this.timeRemaining--;
            this.updateChallengeUI();
            
            if (this.timeRemaining <= 0 || this.plantsFound >= 5) {
                this.endChallenge();
            }
        }, 1000);
    }

    updateChallengeUI() {
        const foundCounter = document.querySelector('.found-counter');
        const timeCounter = document.querySelector('.time-counter');
        
        if (foundCounter) {
            foundCounter.textContent = `Found: ${this.plantsFound}/5`;
        }
        
        if (timeCounter) {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            timeCounter.textContent = `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    endChallenge() {
        clearInterval(this.challengeTimer);
        this.challengeActive = false;
        
        // Show results
        alert(`Challenge ended! You found ${this.plantsFound} plants in ${this.challengeTime - this.timeRemaining} seconds!`);
    }

    initControls() {
        // Add navigation controls
        const leftBtn = document.querySelector('.nav-left');
        const rightBtn = document.querySelector('.nav-right');
        const upBtn = document.querySelector('.nav-up');
        
        if (leftBtn) leftBtn.addEventListener('click', () => this.moveCamera('left'));
        if (rightBtn) rightBtn.addEventListener('click', () => this.moveCamera('right'));
        if (upBtn) rightBtn.addEventListener('click', () => this.moveCamera('up'));
    }

    moveCamera(direction) {
        const speed = 0.1;
        switch(direction) {
            case 'left':
                this.camera.position.x -= speed;
                break;
            case 'right':
                this.camera.position.x += speed;
                break;
            case 'up':
                this.camera.position.y += speed;
                break;
        }
    }

    addPlantToGarden(plantId) {
        fetch('/api/my-garden/plants', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plantId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.loadPlantModel(plantId);
            }
        });
    }

    loadPlantModel(plantId) {
        fetch(`/api/3d-models/${plantId}`)
            .then(response => response.json())
            .then(modelData => {
                // Add 3D model to scene
                // Implementation depends on your 3D model format
            });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        this.renderer.setAnimationLoop(() => {
            this.renderer.render(this.scene, this.camera);
        });
    }
}

// Initialize HerbVerse when the page loads
window.addEventListener('load', () => {
    window.herbVerse = new HerbVerse();
}); 
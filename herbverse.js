// Initialize HerbVerse functionalities

document.addEventListener('DOMContentLoaded', () => {
    setupModeSwitching();
    setupPlantPlacement();
    setupDiscoveryChallenge();
});

function setupModeSwitching() {
    const arModeBtn = document.getElementById('ar-mode-btn');
    const vrModeBtn = document.getElementById('vr-mode-btn');
    const guidedTourBtn = document.getElementById('guided-tour-btn');

    arModeBtn.addEventListener('click', () => switchMode('ar'));
    vrModeBtn.addEventListener('click', () => switchMode('vr'));
    guidedTourBtn.addEventListener('click', () => switchMode('guided'));
}

function switchMode(mode) {
    console.log(`Switching to ${mode} mode`);
    // Logic to switch modes
    // Update UI and scene based on the selected mode
}

function setupPlantPlacement() {
    const plantCards = document.querySelectorAll('.plant-card');
    plantCards.forEach(card => {
        const plantName = card.getAttribute('data-plant');
        card.querySelector('button').addEventListener('click', () => placePlant(plantName));
    });
}

function placePlant(plantName) {
    console.log(`Placing ${plantName} in the AR scene`);
    // Logic to add plant model to the AR scene
}

function setupDiscoveryChallenge() {
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    startChallengeBtn.addEventListener('click', startDiscoveryChallenge);
}

function startDiscoveryChallenge() {
    console.log('Starting Herb Discovery Challenge');
    // Logic to start the challenge, initialize timer, and track progress
} 
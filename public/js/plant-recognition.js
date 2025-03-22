// Initialize TensorFlow and MobileNet model
let model = null;
let isModelLoading = false;
let videoStream = null;
let isScanning = false;

// DOM Elements
const videoPreview = document.getElementById('video-preview');
const startCameraBtn = document.getElementById('start-camera');
const capturePhotoBtn = document.getElementById('capture-photo');
const uploadPhotoBtn = document.getElementById('upload-photo');
const photoUploadInput = document.getElementById('photo-upload');
const aiResults = document.getElementById('ai-results');
const resultPlaceholder = aiResults.querySelector('.result-placeholder');
const plantResult = aiResults.querySelector('.plant-result');
const loadingScreen = document.getElementById('loading-screen');

// Initialize TensorFlow model
async function initModel() {
    if (isModelLoading || model) return;
    
    try {
        isModelLoading = true;
        loadingScreen.textContent = 'Loading AI model...';
        updateStatus('Loading AI model...');
        
        // Ensure WebGL backend is initialized
        await tf.setBackend('webgl');
        await tf.ready();
        
        // Load MobileNet model
        model = await mobilenet.load({
            version: 2,
            alpha: 1.0
        });
        
        loadingScreen.style.display = 'none';
        updateStatus('AI model loaded - Click "Start Camera" to begin scanning');
        startCameraBtn.disabled = false;
    } catch (error) {
        console.error('Error loading model:', error);
        loadingScreen.textContent = 'Error loading AI model. Please refresh the page.';
        updateStatus('Error loading AI model. Please refresh the page.');
    } finally {
        isModelLoading = false;
    }
}

// Camera Functions
async function startCamera() {
    try {
        updateStatus('Requesting camera access...');
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        
        videoPreview.srcObject = videoStream;
        videoPreview.style.display = 'block';
        document.querySelector('.camera-placeholder').style.display = 'none';
        startCameraBtn.style.display = 'none';
        capturePhotoBtn.style.display = 'block';
        
        // Wait for video to be ready
        await new Promise((resolve) => {
            videoPreview.onloadedmetadata = () => {
                resolve();
            };
        });
        
        updateStatus('Camera ready - Starting plant scanning...');
        // Start real-time scanning
        startScanning();
    } catch (error) {
        console.error('Error accessing camera:', error);
        if (error.name === 'NotAllowedError') {
            updateStatus('Camera access denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError') {
            updateStatus('No camera found. Please ensure your device has a camera.');
        } else {
            updateStatus('Error accessing camera. Please try again.');
        }
        startCameraBtn.style.display = 'block';
    }
}

// Real-time scanning
async function startScanning() {
    if (!model || !videoStream || isScanning) return;
    
    isScanning = true;
    updateStatus('Scanning for plants...');

    const scan = async () => {
        if (!isScanning) return;

        try {
            // Create a tensor from the video element
            const videoTensor = tf.browser.fromPixels(videoPreview);
            const resizedTensor = tf.image.resizeBilinear(videoTensor, [224, 224]);
            const normalizedTensor = resizedTensor.toFloat().div(tf.scalar(255));
            const batchedTensor = normalizedTensor.expandDims(0);
            
            // Get predictions
            const predictions = await model.classify(videoPreview);
            const plantPredictions = predictions.filter(p => isPlantRelated(p.className));
            
            if (plantPredictions.length > 0) {
                displayResults(plantPredictions[0]);
            }

            // Clean up tensors
            videoTensor.dispose();
            resizedTensor.dispose();
            normalizedTensor.dispose();
            batchedTensor.dispose();

            // Continue scanning
            if (isScanning) {
                requestAnimationFrame(scan);
            }
        } catch (error) {
            console.error('Error during scanning:', error);
            updateStatus('Error during scanning. Please try again.');
            isScanning = false;
        }
    };

    scan();
}

function stopScanning() {
    isScanning = false;
    if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
    }
    videoPreview.style.display = 'none';
    document.querySelector('.camera-placeholder').style.display = 'block';
    startCameraBtn.style.display = 'block';
    capturePhotoBtn.style.display = 'none';
}

// Photo Upload
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const img = new Image();
        img.onload = async () => {
            const predictions = await model.classify(img);
            const plantPredictions = predictions.filter(p => isPlantRelated(p.className));
            if (plantPredictions.length > 0) {
                displayResults(plantPredictions[0]);
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Helper Functions
function isPlantRelated(className) {
    const plantKeywords = [
        'plant', 'herb', 'flower', 'leaf', 'tree', 'bush', 'garden',
        'tulsi', 'basil', 'mint', 'ashwagandha', 'turmeric', 'ginger',
        'aloe', 'neem', 'sage', 'rosemary', 'thyme', 'lavender'
    ];
    return plantKeywords.some(keyword => 
        className.toLowerCase().includes(keyword)
    );
}

function updateStatus(message) {
    resultPlaceholder.innerHTML = `<p>${message}</p>`;
}

function displayResults(prediction) {
    plantResult.style.display = 'block';
    resultPlaceholder.style.display = 'none';

    const identifiedPlant = document.getElementById('identified-plant');
    const confidence = document.getElementById('confidence');
    const description = document.getElementById('plant-description');
    const medicinalList = document.getElementById('medicinal-list');
    const viewLink = document.getElementById('view-in-library');

    identifiedPlant.textContent = formatPlantName(prediction.className);
    confidence.textContent = `Confidence: ${(prediction.probability * 100).toFixed(1)}%`;

    // Fetch additional plant information
    fetchPlantInfo(prediction.className)
        .then(info => {
            description.textContent = info.description;
            medicinalList.innerHTML = info.medicinalProperties
                .map(prop => `<li>${prop}</li>`)
                .join('');
            viewLink.href = `plant library.html?plant=${encodeURIComponent(prediction.className)}`;
        });
}

function formatPlantName(name) {
    return name
        .split(',')[0]
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

async function fetchPlantInfo(plantName) {
    try {
        const response = await fetch(`/api/plants/info?name=${encodeURIComponent(plantName)}`);
        return await response.json();
    } catch (error) {
        return {
            description: 'Loading plant information...',
            medicinalProperties: ['Fetching properties...']
        };
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Disable start camera button until model is loaded
    if (startCameraBtn) {
        startCameraBtn.disabled = true;
    }
    
    initModel();
    
    startCameraBtn?.addEventListener('click', startCamera);
    uploadPhotoBtn?.addEventListener('click', () => photoUploadInput.click());
    photoUploadInput?.addEventListener('change', handlePhotoUpload);
    
    // Add swipe gestures for mobile
    let touchStartX = 0;
    const container = document.querySelector('.ai-recognition-container');
    
    container?.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    container?.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - show next result
                showNextResult();
            } else {
                // Swipe right - show previous result
                showPreviousResult();
            }
        }
    });
}); 
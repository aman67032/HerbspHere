// Plant Recognition using TensorFlow.js
let model;
let cameraActive = false;
let videoElement;

// Load plant data from JSON file
async function loadPlantData() {
    try {
        const response = await fetch('plant-database.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load plant data:', error);
        return null;
    }
}

// Initialize plant data
let plantDatabase;

// Load TensorFlow model
async function loadModel() {
    try {
        // For demo purposes, we're using a mobilenet model
        // In production, you would use a custom trained model for herb identification
        model = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
        console.log('Model loaded successfully');
    } catch (error) {
        console.error('Failed to load model:', error);
    }
}

// Initialize components
document.addEventListener('DOMContentLoaded', async () => {
    // Load ML model
    await initialize();
    
    // Set up UI event listeners
    setupEventListeners();
    
    // Initialize location-based customization
    initLocationBasedFeatures();
    
    // Start real-time scanning
    await startRealTimeScanning();
});

function setupEventListeners() {
    const startCameraBtn = document.getElementById('start-camera');
    const capturePhotoBtn = document.getElementById('capture-photo');
    const uploadPhotoBtn = document.getElementById('upload-photo');
    const photoUploadInput = document.getElementById('photo-upload');
    
    startCameraBtn.addEventListener('click', toggleCamera);
    capturePhotoBtn.addEventListener('click', captureAndIdentify);
    uploadPhotoBtn.addEventListener('click', () => photoUploadInput.click());
    photoUploadInput.addEventListener('change', handleImageUpload);
}

async function toggleCamera() {
    const videoPreview = document.getElementById('video-preview');
    const cameraPlaceholder = document.querySelector('.camera-placeholder');
    const startCameraBtn = document.getElementById('start-camera');
    const capturePhotoBtn = document.getElementById('capture-photo');
    
    if (!cameraActive) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            videoPreview.srcObject = stream;
            videoElement = videoPreview;
            
            videoPreview.style.display = 'block';
            cameraPlaceholder.style.display = 'none';
            startCameraBtn.textContent = 'Stop Camera';
            capturePhotoBtn.style.display = 'inline-block';
            
            cameraActive = true;
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access the camera. Please check your permissions.');
        }
    } else {
        // Stop camera
        const stream = videoPreview.srcObject;
        const tracks = stream.getTracks();
        
        tracks.forEach(track => track.stop());
        videoPreview.srcObject = null;
        
        videoPreview.style.display = 'none';
        cameraPlaceholder.style.display = 'flex';
        startCameraBtn.textContent = 'Start Camera';
        capturePhotoBtn.style.display = 'none';
        
        cameraActive = false;
    }
}

async function captureAndIdentify() {
    if (!model || !cameraActive) return;
    
    try {
        // Create a canvas to capture the current video frame
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Process the image with TensorFlow
        await processImage(canvas);
        
    } catch (error) {
        console.error('Error capturing image:', error);
    }
}

async function handleImageUpload(event) {
    if (!model) return;
    
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const img = new Image();
        img.onload = async () => {
            // Create a canvas to draw the uploaded image
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // Process the image with TensorFlow
            await processImage(canvas);
        };
        
        img.src = URL.createObjectURL(file);
    } catch (error) {
        console.error('Error processing uploaded image:', error);
    }
}

async function processImage(canvas) {
    try {
        // Preprocess the image for the model
        const tensor = tf.browser.fromPixels(canvas)
            .resizeBilinear([224, 224]) // Resize to match model input
            .toFloat()
            .expandDims();
            
        // Normalize pixel values to [0, 1]
        const normalized = tensor.div(tf.scalar(255));
        
        // Get prediction
        const prediction = await model.predict(normalized).data();
        
        // For demo purposes, map Mobilenet classes to our herb database
        // This would be replaced with your actual plant detection logic
        const classIndex = Array.from(prediction)
            .map((prob, index) => ({ prob, index }))
            .sort((a, b) => b.prob - a.prob)[0].index;
            
        // Map model class to our herb list (this is a simulation)
        const demoMapping = {
            0: 'tulsi',
            1: 'ashwagandha',
            2: 'turmeric',
            3: 'cinnamon',
            4: 'cardamom',
            5: 'clove'
        };
        
        // Get a herb based on the classIndex mod 6 (for demo purposes only)
        const herbKey = demoMapping[classIndex % 6];
        const confidence = prediction[classIndex] * 100;
        
        // Display result
        displayResult(herbKey, confidence.toFixed(1));
        
        // Clean up tensor
        tensor.dispose();
        normalized.dispose();
        
    } catch (error) {
        console.error('Error processing image:', error);
    }
}

function displayResult(herbKey, confidence) {
    const resultPlaceholder = document.querySelector('.result-placeholder');
    const plantResult = document.querySelector('.plant-result');
    const identifiedPlant = document.getElementById('identified-plant');
    const confidenceElement = document.getElementById('confidence');
    const plantDescription = document.getElementById('plant-description');
    const medicinalList = document.getElementById('medicinal-list');
    const viewInLibrary = document.getElementById('view-in-library');
    
    const herb = plantDatabase[herbKey];
    
    // Update UI
    resultPlaceholder.style.display = 'none';
    plantResult.style.display = 'block';
    
    // Fill in the herb details
    identifiedPlant.textContent = `${herbKey.charAt(0).toUpperCase() + herbKey.slice(1)} (${herb.scientificName})`;
    confidenceElement.textContent = `Confidence: ${confidence}%`;
    plantDescription.textContent = herb.description;
    
    // Clear and add medicinal properties
    medicinalList.innerHTML = '';
    herb.medicinalProperties.forEach(property => {
        const li = document.createElement('li');
        li.textContent = property;
        medicinalList.appendChild(li);
    });
    
    // Update view link
    viewInLibrary.href = herb.url;
}

// Get user location for customized recommendations
function initLocationBasedFeatures() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;
                console.log(`User location: Lat ${latitude}, Long ${longitude}`);
                
                // Get the user's region based on coordinates
                fetchRegionInfo(latitude, longitude);
                
                // Set a cookie for future use
                document.cookie = `userLat=${latitude}; path=/; max-age=86400`;
                document.cookie = `userLng=${longitude}; path=/; max-age=86400`;
            },
            error => {
                console.warn(`Geolocation error: ${error.message}`);
                // Fall back to IP-based location or use a default
            }
        );
    }
}

async function fetchRegionInfo(lat, lng) {
    try {
        // Using OpenStreetMap Nominatim for geocoding (free and open source)
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const data = await response.json();
        
        // Extract region/country
        const country = data.address.country;
        const region = data.address.state || data.address.region;
        
        console.log(`User region identified: ${region}, ${country}`);
        
        // Store this info for plant recommendations
        localStorage.setItem('userRegion', region);
        localStorage.setItem('userCountry', country);
        
    } catch (error) {
        console.error('Error fetching region info:', error);
    }
}

// Load TensorFlow model and plant data
async function initialize() {
    try {
        plantDatabase = await loadPlantData();
        if (!plantDatabase) {
            throw new Error('Plant data could not be loaded.');
        }
        model = await loadModel();
        console.log('Model and plant data loaded successfully');
    } catch (error) {
        console.error('Initialization failed:', error);
    }
}

// Set up camera and video stream
async function setupCamera() {
    videoElement = document.createElement('video');
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('playsinline', '');
    videoElement.style.display = 'none';
    document.body.appendChild(videoElement);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => {
                resolve(videoElement);
            };
        });
        videoElement.play();
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

// Process video frames
async function processVideoFrames() {
    if (!model || !plantDatabase) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Preprocess the image and make predictions
    const predictions = await model.classify(imageData);
    if (predictions.length > 0) {
        const topPrediction = predictions[0];
        const plantKey = topPrediction.className.toLowerCase();
        const confidence = (topPrediction.probability * 100).toFixed(2);

        if (plantDatabase[plantKey]) {
            displayResult(plantKey, confidence);
        }
    }

    requestAnimationFrame(processVideoFrames);
}

// Initialize camera and start processing
async function startRealTimeScanning() {
    await setupCamera();
    processVideoFrames();
} 
// DOM Elements
const hamburgerMenu = document.getElementById('hamburger-menu');
const navMenu = document.getElementById('nav-menu');
const newThreadBtns = document.querySelectorAll('.new-thread-btn');
const modal = document.getElementById('new-thread-modal');
const closeModal = document.querySelector('.close-modal');
const newThreadForm = document.getElementById('new-thread-form');
const threadCategories = {
    'growing-tips': document.getElementById('growing-tips-threads'),
    'plant-id': document.getElementById('plant-id-threads'),
    'remedies': document.getElementById('remedies-threads')
};

// Sample data (replace with backend data in production)
let currentUser = {
    name: 'Guest User',
    avatar: 'placeholder-profile.jpg',
    posts: 0,
    replies: 0
};

const sampleThreads = {
    'growing-tips': [
        {
            id: 1,
            title: 'Best soil mix for medicinal herbs',
            author: 'HerbGrower',
            date: '2024-03-21',
            preview: 'I've been experimenting with different soil mixes...',
            replies: 5,
            views: 120
        }
    ],
    'plant-id': [
        {
            id: 2,
            title: 'Help identifying this herb in my garden',
            author: 'PlantNewbie',
            date: '2024-03-20',
            preview: 'Found this interesting plant with purple flowers...',
            replies: 3,
            views: 85
        }
    ],
    'remedies': [
        {
            id: 3,
            title: 'Traditional cold remedies using common herbs',
            author: 'HerbalHealer',
            date: '2024-03-19',
            preview: 'Here are some effective herbal remedies for common cold...',
            replies: 8,
            views: 200
        }
    ]
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
    loadThreads();
    loadTrendingTopics();
    loadOnlineMembers();
});

hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

newThreadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.style.display = 'block';
        modal.dataset.category = btn.dataset.category;
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

newThreadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const category = modal.dataset.category;
    const title = document.getElementById('thread-title').value;
    const content = document.getElementById('thread-content').value;
    
    createNewThread(category, title, content);
    modal.style.display = 'none';
    newThreadForm.reset();
});

// Functions
function loadUserProfile() {
    if (localStorage.getItem('user')) {
        currentUser = JSON.parse(localStorage.getItem('user'));
    }
    
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('profile-image').src = currentUser.avatar;
    document.getElementById('posts-count').textContent = currentUser.posts;
    document.getElementById('replies-count').textContent = currentUser.replies;
}

function loadThreads() {
    for (const [category, threads] of Object.entries(sampleThreads)) {
        const container = threadCategories[category];
        container.innerHTML = '';
        
        threads.forEach(thread => {
            container.appendChild(createThreadElement(thread));
        });
    }
}

function createThreadElement(thread) {
    const threadEl = document.createElement('div');
    threadEl.className = 'thread';
    threadEl.innerHTML = `
        <div class="thread-header">
            <h4 class="thread-title">${thread.title}</h4>
            <span class="thread-meta">by ${thread.author} • ${formatDate(thread.date)}</span>
        </div>
        <p class="thread-preview">${thread.preview}</p>
        <div class="thread-footer">
            <div class="thread-stats">
                <span>${thread.replies} replies</span>
                <span>${thread.views} views</span>
            </div>
            <button class="reply-btn">Reply</button>
        </div>
    `;
    return threadEl;
}

function createNewThread(category, title, content) {
    const newThread = {
        id: Date.now(),
        title: title,
        author: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        preview: content.substring(0, 150) + '...',
        replies: 0,
        views: 0
    };
    
    sampleThreads[category].unshift(newThread);
    loadThreads();
    currentUser.posts++;
    updateUserStats();
}

function loadTrendingTopics() {
    const trendingList = document.getElementById('trending-topics-list');
    const topics = [
        'Sustainable Gardening',
        'Natural Remedies',
        'Seasonal Planting',
        'Herb Identification',
        'Traditional Medicine'
    ];
    
    trendingList.innerHTML = topics.map(topic => 
        `<li><i class="fas fa-fire"></i> ${topic}</li>`
    ).join('');
}

function loadOnlineMembers() {
    const membersList = document.getElementById('online-members-list');
    const onlineMembers = [
        'HerbGrower',
        'PlantNewbie',
        'HerbalHealer',
        'GardenGuru',
        'NatureLover'
    ];
    
    membersList.innerHTML = onlineMembers.map(member => 
        `<li><i class="fas fa-circle"></i> ${member}</li>`
    ).join('');
}

function updateUserStats() {
    document.getElementById('posts-count').textContent = currentUser.posts;
    document.getElementById('replies-count').textContent = currentUser.replies;
    localStorage.setItem('user', JSON.stringify(currentUser));
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle mobile menu
document.addEventListener('click', (e) => {
    if (!e.target.matches('#hamburger-menu') && !e.target.matches('.nav-links')) {
        navMenu.classList.remove('active');
    }
}); 
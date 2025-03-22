// DOM Elements
const adminMenu = document.querySelectorAll('.admin-menu li');
const tabContents = document.querySelectorAll('.tab-content');
const logoutBtn = document.getElementById('logout-btn');
const addUserBtn = document.querySelector('.add-user-btn');
const addUserModal = document.getElementById('add-user-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const addUserForm = document.getElementById('add-user-form');
const searchInput = document.querySelector('.search-bar input');

// Sample Data (replace with backend data in production)
let sampleUsers = [
    { id: 1, username: 'admin', email: 'admin@herbsphere.com', role: 'admin', status: 'active' },
    { id: 2, username: 'moderator', email: 'mod@herbsphere.com', role: 'moderator', status: 'active' },
    { id: 3, username: 'user1', email: 'user1@example.com', role: 'user', status: 'active' },
];

let sampleStats = {
    totalUsers: 156,
    plantsAdded: 324,
    forumPosts: 892,
    dailyVisits: 1243
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();
    loadUsers();
    initializeCharts();
    setupEventListeners();
});

function setupEventListeners() {
    // Tab switching
    adminMenu.forEach(menuItem => {
        menuItem.addEventListener('click', () => switchTab(menuItem.dataset.tab));
    });

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Add User Modal
    addUserBtn?.addEventListener('click', () => {
        addUserModal.style.display = 'block';
    });

    // Close Modals
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addUserModal.style.display = 'none';
        });
    });

    // Add User Form
    addUserForm?.addEventListener('submit', handleAddUser);

    // Search Functionality
    searchInput?.addEventListener('input', handleSearch);
}

// Tab Switching
function switchTab(tabId) {
    adminMenu.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabId) {
            item.classList.add('active');
        }
    });

    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
}

// Dashboard Functions
function initializeDashboard() {
    document.getElementById('total-users').textContent = sampleStats.totalUsers;
    document.getElementById('total-plants').textContent = sampleStats.plantsAdded;
    document.getElementById('total-posts').textContent = sampleStats.forumPosts;
    document.getElementById('daily-visits').textContent = sampleStats.dailyVisits;
}

// Charts Initialization
function initializeCharts() {
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart')?.getContext('2d');
    if (userGrowthCtx) {
        new Chart(userGrowthCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'User Growth',
                    data: [65, 78, 90, 115, 138, 156],
                    borderColor: '#2e7d32',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'User Growth Over Time'
                    }
                }
            }
        });
    }

    // Activity Chart
    const activityCtx = document.getElementById('activityChart')?.getContext('2d');
    if (activityCtx) {
        new Chart(activityCtx, {
            type: 'bar',
            data: {
                labels: ['Posts', 'Comments', 'Plant Uploads', 'Garden Updates'],
                datasets: [{
                    label: 'Daily Activity',
                    data: [45, 67, 23, 34],
                    backgroundColor: '#4caf50'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Platform Activity'
                    }
                }
            }
        });
    }

    // User Analytics Chart
    const userAnalyticsCtx = document.getElementById('userAnalyticsChart')?.getContext('2d');
    if (userAnalyticsCtx) {
        new Chart(userAnalyticsCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Active Users',
                    data: [120, 135, 142, 156],
                    borderColor: '#2196f3',
                    tension: 0.1
                }]
            }
        });
    }

    // Engagement Chart
    const engagementCtx = document.getElementById('engagementChart')?.getContext('2d');
    if (engagementCtx) {
        new Chart(engagementCtx, {
            type: 'doughnut',
            data: {
                labels: ['Posts', 'Comments', 'Likes', 'Shares'],
                datasets: [{
                    data: [300, 450, 900, 200],
                    backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336']
                }]
            }
        });
    }

    // Popular Plants Chart
    const popularPlantsCtx = document.getElementById('popularPlantsChart')?.getContext('2d');
    if (popularPlantsCtx) {
        new Chart(popularPlantsCtx, {
            type: 'bar',
            data: {
                labels: ['Tulsi', 'Aloe Vera', 'Mint', 'Lavender', 'Rosemary'],
                datasets: [{
                    label: 'Views',
                    data: [1200, 900, 850, 700, 650],
                    backgroundColor: '#4caf50'
                }]
            }
        });
    }
}

// User Management Functions
function loadUsers() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = '';
    sampleUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td><span class="status-badge ${user.status}">${user.status}</span></td>
            <td>
                <button class="btn-edit" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function handleAddUser(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = {
        id: sampleUsers.length + 1,
        username: formData.get('username'),
        email: formData.get('email'),
        role: formData.get('role'),
        status: 'active'
    };
    
    sampleUsers.push(newUser);
    loadUsers();
    addUserModal.style.display = 'none';
    e.target.reset();
}

function editUser(userId) {
    // Implement edit user functionality
    console.log('Editing user:', userId);
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user?')) {
        sampleUsers = sampleUsers.filter(user => user.id !== userId);
        loadUsers();
    }
}

// Search Functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = sampleUsers.filter(user => 
        user.username.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
    );
    
    const tableBody = document.getElementById('users-table-body');
    if (tableBody) {
        tableBody.innerHTML = '';
        filteredUsers.forEach(user => {
            // Reuse existing row creation logic
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td><span class="status-badge ${user.status}">${user.status}</span></td>
                <td>
                    <button class="btn-edit" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Settings Functions
const saveSettingsBtn = document.querySelector('.save-settings-btn');
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        // Implement settings save functionality
        alert('Settings saved successfully!');
    });
}

const resetSettingsBtn = document.querySelector('.reset-settings-btn');
if (resetSettingsBtn) {
    resetSettingsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to default?')) {
            // Implement settings reset functionality
            alert('Settings reset to default!');
        }
    });
}

// Logout Function
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        window.location.href = 'login.html';
    }
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === addUserModal) {
        addUserModal.style.display = 'none';
    }
}); 
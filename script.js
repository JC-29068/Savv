// Sample data for demonstration
const sampleDonations = [
    {
        id: 1,
        donor: "Green Bites Cafe",
        foodType: "Sandwiches & Salads",
        quantity: "15 portions",
        pickupTime: "Before 9 PM today",
        location: "123 Main Street",
        status: "available",
        addedByCurrentUser: false
    },
    {
        id: 2,
        donor: "Pizza Palace",
        foodType: "Pizza slices",
        quantity: "20 slices",
        pickupTime: "Tomorrow morning",
        location: "456 Oak Avenue",
        status: "available",
        addedByCurrentUser: false
    },
    {
        id: 3,
        donor: "Daily Bread Bakery",
        foodType: "Assorted pastries",
        quantity: "30 pieces",
        pickupTime: "Before 8 AM tomorrow",
        location: "789 Baker Street",
        status: "collected",
        addedByCurrentUser: true
    }
];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const donateBtn = document.getElementById('donateBtn');
const collectBtn = document.getElementById('collectBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const dashboardSection = document.getElementById('dashboard');
const closeButtons = document.querySelectorAll('.close');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');
const donationForm = document.getElementById('donationForm');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const availableDonationsList = document.getElementById('availableDonations');
const myDonationsList = document.getElementById('myDonations');
const regUserType = document.getElementById('regUserType');
const orgDetails = document.getElementById('orgDetails');

// Current user state
let currentUser = null;

// Event Listeners
loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
registerBtn.addEventListener('click', () => registerModal.style.display = 'block');
donateBtn.addEventListener('click', () => {
    if (!currentUser) {
        loginModal.style.display = 'block';
    } else {
        dashboardSection.style.display = 'block';
        switchTab('add-donation');
        window.scrollTo(0, dashboardSection.offsetTop);
    }
});
collectBtn.addEventListener('click', () => {
    if (!currentUser) {
        loginModal.style.display = 'block';
    } else {
        dashboardSection.style.display = 'block';
        switchTab('available');
        window.scrollTo(0, dashboardSection.offsetTop);
    }
});

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
    });
});

showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
});

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        switchTab(tabId);
    });
});

regUserType.addEventListener('change', () => {
    if (regUserType.value) {
        orgDetails.style.display = 'block';
    } else {
        orgDetails.style.display = 'none';
    }
});

// Form submissions
donationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newDonation = {
        id: sampleDonations.length + 1,
        donor: document.getElementById('donorName').value,
        foodType: document.getElementById('foodType').value,
        quantity: document.getElementById('quantity').value,
        pickupTime: document.getElementById('pickupTime').value,
        location: document.getElementById('location').value,
        status: 'available',
        addedByCurrentUser: true
    };
    
    sampleDonations.push(newDonation);
    renderDonations();
    donationForm.reset();
    alert('Donation added successfully!');
    switchTab('my-donations');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const userType = document.getElementById('userType').value;
    
    // Simple login simulation
    currentUser = {
        email: email,
        type: userType,
        name: email.split('@')[0]
    };
    
    loginModal.style.display = 'none';
    dashboardSection.style.display = 'block';
    renderDonations();
    
    // Update navbar
    document.querySelector('.user-actions').innerHTML = `
        <span>Welcome, ${currentUser.name}</span>
        <button class="btn btn-outline" id="logoutBtn">Logout</button>
    `;
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const userType = document.getElementById('regUserType').value;
    
    // Simple registration simulation
    currentUser = {
        email: email,
        type: userType,
        name: name
    };
    
    registerModal.style.display = 'none';
    dashboardSection.style.display = 'block';
    renderDonations();
    
    // Update navbar
    document.querySelector('.user-actions').innerHTML = `
        <span>Welcome, ${currentUser.name}</span>
        <button class="btn btn-outline" id="logoutBtn">Logout</button>
    `;
    
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    alert('Registration successful! You are now logged in.');
});

// Functions
function switchTab(tabId) {
    // Update tabs
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update tab contents
    tabContents.forEach(content => {
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function renderDonations() {
    // Clear existing lists
    availableDonationsList.innerHTML = '';
    myDonationsList.innerHTML = '';
    
    // Filter donations based on current user
    const availableDonations = sampleDonations.filter(d => d.status === 'available');
    const myDonations = sampleDonations.filter(d => d.addedByCurrentUser);
    
    // Render available donations
    if (availableDonations.length === 0) {
        availableDonationsList.innerHTML = '<p>No available donations at the moment.</p>';
    } else {
        availableDonations.forEach(donation => {
            const donationCard = createDonationCard(donation, true);
            availableDonationsList.appendChild(donationCard);
        });
    }
    
    // Render my donations
    if (myDonations.length === 0) {
        myDonationsList.innerHTML = '<p>You haven\'t added any donations yet.</p>';
    } else {
        myDonations.forEach(donation => {
            const donationCard = createDonationCard(donation, false);
            myDonationsList.appendChild(donationCard);
        });
    }
}

function createDonationCard(donation, showCollectBtn) {
    const card = document.createElement('div');
    card.className = 'donation-card';
    
    card.innerHTML = `
        <div class="donation-info">
            <h3>${donation.foodType}</h3>
            <p>From: ${donation.donor}</p>
            <div class="donation-meta">
                <span><i class="fas fa-weight-hanging"></i> ${donation.quantity}</span>
                <span><i class="fas fa-clock"></i> ${donation.pickupTime}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${donation.location}</span>
            </div>
        </div>
        <div class="donation-actions">
            <span class="donation-status status-${donation.status}">${donation.status === 'available' ? 'Available' : 'Collected'}</span>
            ${showCollectBtn && donation.status === 'available' ? '<button class="btn btn-primary collect-btn" data-id="' + donation.id + '">Collect</button>' : ''}
        </div>
    `;
    
    // Add event listener for collect button if shown
    if (showCollectBtn && donation.status === 'available') {
        const collectBtn = card.querySelector('.collect-btn');
        collectBtn.addEventListener('click', () => {
            const donationId = parseInt(collectBtn.getAttribute('data-id'));
            const donationIndex = sampleDonations.findIndex(d => d.id === donationId);
            
            if (donationIndex !== -1) {
                sampleDonations[donationIndex].status = 'collected';
                renderDonations();
                alert('Thank you for collecting this donation!');
            }
        });
    }
    
    return card;
}

function logout() {
    currentUser = null;
    dashboardSection.style.display = 'none';
    
    // Reset navbar
    document.querySelector('.user-actions').innerHTML = `
        <button class="btn btn-outline" id="loginBtn">Login</button>
        <button class="btn btn-primary" id="registerBtn">Register</button>
    `;
    
    // Reattach event listeners
    document.getElementById('loginBtn').addEventListener('click', () => loginModal.style.display = 'block');
    document.getElementById('registerBtn').addEventListener('click', () => registerModal.style.display = 'block');
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === registerModal) {
        registerModal.style.display = 'none';
    }
});

// Initialize the page
renderDonations();
// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navToggle && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
        }
    });

    // Auth Modal
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.querySelector('.close-modal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (authModal) {
                authModal.style.display = 'block';
                document.querySelector('[data-tab="login"]').classList.add('active');
                document.querySelector('[data-tab="register"]').classList.remove('active');
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            }
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (authModal) {
                authModal.style.display = 'block';
                document.querySelector('[data-tab="register"]').classList.add('active');
                document.querySelector('[data-tab="login"]').classList.remove('active');
                registerForm.style.display = 'block';
                loginForm.style.display = 'none';
            }
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (authModal) authModal.style.display = 'none';
        });
    }

    if (tabBtns) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (tab === 'login') {
                    loginForm.style.display = 'block';
                    registerForm.style.display = 'none';
                } else {
                    loginForm.style.display = 'none';
                    registerForm.style.display = 'block';
                }
            });
        });
    }

    // Close modal on outside click
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
        });
    }

    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch('/api/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userName', data.user.name);
                    if (authModal) authModal.style.display = 'none';
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Login failed: ' + (data.error || 'Invalid credentials'));
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('An error occurred during login');
            }
        });
    }

    // Register Form Handler
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = registerForm.querySelector('input[type="text"]').value;
            const email = registerForm.querySelector('input[type="email"]').value;
            const password = registerForm.querySelector('input[type="password"]').value;

            try {
                const response = await fetch('/api/user/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                if (data.success) {
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userName', data.user.name);
                    if (authModal) authModal.style.display = 'none';
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Registration failed: ' + (data.error || 'User already exists'));
                }
            } catch (error) {
                console.error('Registration error:', error);
                alert('An error occurred during registration');
            }
        });
    }

    // Logout Handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            window.location.href = 'index.html';
        });
    }

    // Display user email if logged in
    const userEmail = localStorage.getItem('userEmail');
    const userEmailElement = document.getElementById('userEmail');
    if (userEmail && userEmailElement) {
        userEmailElement.textContent = userEmail;
    }

    // Check authentication for protected pages
    const protectedPages = ['dashboard.html', 'inputs.html', 'insights.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !userEmail) {
        window.location.href = 'index.html';
    }
});

// Utility Functions
const API_BASE = '';

async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Animate number counter
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = formatNumber(Math.round(current));
    }, 16);
}


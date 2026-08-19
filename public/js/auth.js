const authMessage = document.getElementById('auth-message');
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const welcomeMessage = document.getElementById('welcome-message');

async function sendAuthRequest(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    window.location.href = '/choose-profile';
}

if (registerForm) {
    registerForm.addEventListener('submit', async event => {
        event.preventDefault();

        try {
            await sendAuthRequest('/api/auth/register', {
                username: document.getElementById('username').value.trim(),
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value
            });
        } catch (error) {
            authMessage.textContent = error.message;
        }
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async event => {
        event.preventDefault();

        try {
            await sendAuthRequest('/api/auth/login', {
                email: document.getElementById('email').value.trim(),
                password: document.getElementById('password').value
            });
        } catch (error) {
            authMessage.textContent = error.message;
        }
    });
}

if (welcomeMessage) {
    fetch('/api/auth/me')
        .then(response => response.json())
        .then(user => {
            welcomeMessage.textContent = `שלום ${user.username}`;
        });
}

const userManagementLink = document.getElementById('user-management-link');

if (userManagementLink) {
    fetch('/api/auth/me')
        .then(response => response.json())
        .then(user => {
            userManagementLink.hidden = user.role !== 'admin';
        });
}

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('selectedProfileId');
        window.location.href = '/login';
    });
}

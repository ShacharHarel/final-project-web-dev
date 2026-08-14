const userList = document.getElementById('user-list');
const userMessage = document.getElementById('user-message');
const userSearchForm = document.getElementById('user-search-form');
const userSearch = document.getElementById('user-search');
const clearUserSearch = document.getElementById('clear-user-search');
let currentUserId = null;

async function loadCurrentUser() {
    const response = await fetch('/api/auth/me');

    if (response.ok) {
        const user = await response.json();
        currentUserId = user._id;
    }
}

async function loadUsers(url = '/api/users') {
    try {
        const response = await fetch(url);
        const users = await response.json();

        if (!response.ok) {
            throw new Error(users.message);
        }

        userList.innerHTML = '';
        userMessage.textContent = users.length === 0 ? 'לא נמצאו משתמשים.' : '';

        users.forEach(user => {
            const card = document.createElement('article');
            card.className = 'user-card';

            const username = document.createElement('h3');
            username.textContent = user.username;

            const email = document.createElement('p');
            email.textContent = user.email;

            const role = document.createElement('p');
            role.textContent = `תפקיד: ${user.role}`;

            card.append(username, email, role);

            if (user._id === currentUserId) {
                const currentUserText = document.createElement('p');
                currentUserText.textContent = 'המשתמש המחובר';
                card.append(currentUserText);
            } else {
                addManagementButtons(card, user);
            }

            userList.appendChild(card);
        });
    } catch (error) {
        userMessage.textContent = error.message || 'לא ניתן לטעון את המשתמשים.';
    }
}

function addManagementButtons(card, user) {
    const roleSelect = document.createElement('select');
    roleSelect.innerHTML = `
        <option value="user">משתמש רגיל</option>
        <option value="admin">מנהל</option>
    `;
    roleSelect.value = user.role;

    const updateButton = document.createElement('button');
    updateButton.className = 'edit-button';
    updateButton.textContent = 'עדכון תפקיד';
    updateButton.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/users/${user._id}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: roleSelect.value })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            userMessage.textContent = 'תפקיד המשתמש עודכן.';
            await loadUsers();
        } catch (error) {
            userMessage.textContent = error.message;
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'מחיקה';
    deleteButton.addEventListener('click', async () => {
        if (!confirm('האם למחוק את המשתמש?')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${user._id}`, { method: 'DELETE' });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message);
            }

            userMessage.textContent = 'המשתמש נמחק.';
            await loadUsers();
        } catch (error) {
            userMessage.textContent = error.message;
        }
    });

    card.append(roleSelect, updateButton, deleteButton);
}

userSearchForm.addEventListener('submit', event => {
    event.preventDefault();
    const query = userSearch.value.trim();

    if (query) {
        loadUsers(`/api/users/search?query=${encodeURIComponent(query)}`);
    }
});

clearUserSearch.addEventListener('click', () => {
    userSearchForm.reset();
    loadUsers();
});

loadCurrentUser().then(loadUsers);

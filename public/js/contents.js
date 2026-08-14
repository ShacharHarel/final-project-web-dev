async function loadContents(url = '/api/contents') {
    const message = document.getElementById('message');
    const contentList = document.getElementById('content-list');

    try {
        contentList.innerHTML = '';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }

        const contents = await response.json();

        if (contents.length === 0) {
            message.textContent = url.includes('/search')
                ? 'לא נמצאו תכנים מתאימים.'
                : 'עדיין אין תכנים בקטלוג.';
            return;
        }

        message.textContent = '';

        contents.forEach(content => {
            const card = document.createElement('article');
            card.className = 'content-card';

            const image = document.createElement('img');
            image.src = content.imageUrl;
            image.alt = content.title;

            const title = document.createElement('h2');
            title.textContent = content.title;

            const details = document.createElement('p');
            details.textContent = `${content.category} | ${content.releaseYear} | ${content.rating}/10`;

            const description = document.createElement('p');
            description.className = 'content-description';
            description.textContent = content.description;

            const trailerLink = document.createElement('a');
            trailerLink.className = 'trailer-link';
            trailerLink.href = content.videoUrl;
            trailerLink.target = '_blank';
            trailerLink.rel = 'noopener noreferrer';
            trailerLink.textContent = 'צפייה בטריילר';

            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = 'עריכה';

            editButton.addEventListener('click', () => {
                startEditing(content);
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'מחיקה';

            deleteButton.addEventListener('click', async () => {
                if (!confirm('האם למחוק את התוכן?')) {
                    return;
                }

                try {
                    const response = await fetch(`/api/contents/${content._id}`, {
                        method: 'DELETE'
                    });

                    if (!response.ok) {
                        throw new Error();
                    }

                    await loadContents();
                    message.textContent = 'התוכן נמחק בהצלחה.';
                } catch (error) {
                    message.textContent = 'לא ניתן למחוק את התוכן.';
                }
            });

            card.append(image, title, details, description, trailerLink);

            if (currentUserRole === 'admin') {
                card.append(editButton, deleteButton);
            }

            contentList.appendChild(card);
        });
    } catch (error) {
        message.textContent = 'לא ניתן לטעון את התכנים.';
    }
}

const contentForm = document.getElementById('content-form');
const contentManagement = document.getElementById('content-management');
const searchForm = document.getElementById('search-form');
const searchTitle = document.getElementById('search-title');
const clearSearchButton = document.getElementById('clear-search-button');
const formTitle = document.getElementById('form-title');
const submitButton = document.getElementById('submit-button');
const cancelEditButton = document.getElementById('cancel-edit-button');
let editingContentId = null;
let currentUserRole = null;

async function loadCurrentUser() {
    const response = await fetch('/api/auth/me');

    if (response.ok) {
        const user = await response.json();
        currentUserRole = user.role;
        contentManagement.hidden = user.role !== 'admin';
    }
}

function startEditing(content) {
    editingContentId = content._id;
    document.getElementById('title').value = content.title;
    document.getElementById('description').value = content.description;
    document.getElementById('category').value = content.category;
    document.getElementById('type').value = content.type;
    document.getElementById('releaseYear').value = content.releaseYear;
    document.getElementById('rating').value = content.rating;
    document.getElementById('videoUrl').value = content.videoUrl;
    document.getElementById('imageUrl').value = content.imageUrl;
    document.getElementById('address').value = content.address || '';

    formTitle.textContent = 'עריכת תוכן';
    submitButton.textContent = 'שמירת שינויים';
    cancelEditButton.hidden = false;
    contentForm.scrollIntoView({ behavior: 'smooth' });
}

function stopEditing() {
    editingContentId = null;
    contentForm.reset();
    formTitle.textContent = 'הוספת תוכן';
    submitButton.textContent = 'הוספה';
    cancelEditButton.hidden = true;
}

cancelEditButton.addEventListener('click', stopEditing);

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = searchTitle.value.trim();

    if (title) {
        loadContents(`/api/contents/search?title=${encodeURIComponent(title)}`);
    }
});

clearSearchButton.addEventListener('click', () => {
    searchForm.reset();
    loadContents();
});

contentForm.addEventListener('submit', async event => {
    event.preventDefault();

    const formMessage = document.getElementById('form-message');
    const content = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        type: document.getElementById('type').value,
        releaseYear: Number(document.getElementById('releaseYear').value),
        rating: Number(document.getElementById('rating').value) || 0,
        videoUrl: document.getElementById('videoUrl').value,
        imageUrl: document.getElementById('imageUrl').value,
        address: document.getElementById('address').value
    };

    try {
        const url = editingContentId ? `/api/contents/${editingContentId}` : '/api/contents';
        const method = editingContentId ? 'PUT' : 'POST';
        const successMessage = editingContentId ? 'התוכן עודכן בהצלחה.' : 'התוכן נוסף בהצלחה.';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content)
        });

        if (!response.ok) {
            throw new Error();
        }

        stopEditing();
        formMessage.textContent = successMessage;
        await loadContents();
    } catch (error) {
        formMessage.textContent = editingContentId
            ? 'לא ניתן לעדכן את התוכן.'
            : 'לא ניתן להוסיף את התוכן.';
    }
});

loadCurrentUser().finally(loadContents);

const historyList = document.getElementById('history-list');
const historyMessage = document.getElementById('history-message');
const historyForm = document.getElementById('history-form');
const historyFormTitle = document.getElementById('history-form-title');
const historySubmitButton = document.getElementById('history-submit-button');
const cancelHistoryEdit = document.getElementById('cancel-history-edit');
const historySearchForm = document.getElementById('history-search-form');
let editingHistoryId = null;

async function loadOptions() {
    const [profilesResponse, contentsResponse] = await Promise.all([
        fetch('/api/profiles'),
        fetch('/api/contents')
    ]);

    if (!profilesResponse.ok || !contentsResponse.ok) {
        throw new Error();
    }

    const profiles = await profilesResponse.json();
    const contents = await contentsResponse.json();
    const profileSelect = document.getElementById('history-profile');
    const searchProfileSelect = document.getElementById('history-search-profile');
    const contentSelect = document.getElementById('history-content');

    profiles.forEach(profile => {
        profileSelect.add(new Option(profile.name, profile._id));
        searchProfileSelect.add(new Option(profile.name, profile._id));
    });

    contents.forEach(content => {
        contentSelect.add(new Option(content.title, content._id));
    });
}

async function loadHistory(url = '/api/watch-history') {
    try {
        historyList.innerHTML = '';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }

        const history = await response.json();

        if (history.length === 0) {
            historyMessage.textContent = url.includes('/search')
                ? 'לא נמצאו רשומות צפייה מתאימות.'
                : 'עדיין אין היסטוריית צפייה.';
            return;
        }

        historyMessage.textContent = '';

        history.forEach(item => {
            const card = document.createElement('article');
            card.className = 'history-card';

            const title = document.createElement('h3');
            title.textContent = item.content.title;

            const profile = document.createElement('p');
            profile.textContent = `פרופיל: ${item.profile.name}`;

            const progress = document.createElement('p');
            progress.textContent = `דקות צפייה: ${item.watchedMinutes}`;

            const status = document.createElement('p');
            status.textContent = item.completed ? 'הצפייה הושלמה' : 'הצפייה לא הושלמה';

            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = 'עריכה';
            editButton.addEventListener('click', () => startHistoryEdit(item));

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'מחיקה';
            deleteButton.addEventListener('click', () => deleteHistory(item._id));

            card.append(title, profile, progress, status, editButton, deleteButton);
            historyList.appendChild(card);
        });
    } catch (error) {
        historyMessage.textContent = 'לא ניתן לטעון את היסטוריית הצפייה.';
    }
}

function getHistoryData() {
    return {
        profileId: document.getElementById('history-profile').value,
        contentId: document.getElementById('history-content').value,
        watchedMinutes: Number(document.getElementById('watched-minutes').value),
        completed: document.getElementById('completed').checked
    };
}

function startHistoryEdit(item) {
    editingHistoryId = item._id;
    document.getElementById('history-profile').value = item.profile._id;
    document.getElementById('history-content').value = item.content._id;
    document.getElementById('watched-minutes').value = item.watchedMinutes;
    document.getElementById('completed').checked = item.completed;
    historyFormTitle.textContent = 'עריכת צפייה';
    historySubmitButton.textContent = 'שמירת שינויים';
    cancelHistoryEdit.hidden = false;
    historyForm.scrollIntoView({ behavior: 'smooth' });
}

function stopHistoryEdit() {
    editingHistoryId = null;
    historyForm.reset();
    historyFormTitle.textContent = 'הוספת צפייה';
    historySubmitButton.textContent = 'הוספה';
    cancelHistoryEdit.hidden = true;
}

async function deleteHistory(historyId) {
    if (!confirm('האם למחוק את רשומת הצפייה?')) {
        return;
    }

    try {
        const response = await fetch(`/api/watch-history/${historyId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error();
        }

        await loadHistory();
        historyMessage.textContent = 'רשומת הצפייה נמחקה בהצלחה.';
    } catch (error) {
        historyMessage.textContent = 'לא ניתן למחוק את רשומת הצפייה.';
    }
}

historyForm.addEventListener('submit', async event => {
    event.preventDefault();

    const formMessage = document.getElementById('history-form-message');
    const url = editingHistoryId
        ? `/api/watch-history/${editingHistoryId}`
        : '/api/watch-history';
    const method = editingHistoryId ? 'PUT' : 'POST';
    const successMessage = editingHistoryId
        ? 'רשומת הצפייה עודכנה בהצלחה.'
        : 'רשומת הצפייה נוספה בהצלחה.';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getHistoryData())
        });

        if (!response.ok) {
            throw new Error();
        }

        stopHistoryEdit();
        formMessage.textContent = successMessage;
        await loadHistory();
    } catch (error) {
        formMessage.textContent = 'לא ניתן לשמור את רשומת הצפייה.';
    }
});

cancelHistoryEdit.addEventListener('click', stopHistoryEdit);

historySearchForm.addEventListener('submit', event => {
    event.preventDefault();
    const profileId = document.getElementById('history-search-profile').value;

    if (profileId) {
        loadHistory(`/api/watch-history/search?profileId=${encodeURIComponent(profileId)}`);
    }
});

document.getElementById('clear-history-search').addEventListener('click', () => {
    historySearchForm.reset();
    loadHistory();
});

loadOptions()
    .then(loadHistory)
    .catch(() => {
        historyMessage.textContent = 'לא ניתן לטעון את נתוני העמוד.';
    });

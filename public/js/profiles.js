// קוד מסך הפרופילים: מציג, מחפש ומבצע CRUD בפרופילי הצפייה של המשתמש.
const profileList = document.getElementById('profile-list');
const profileMessage = document.getElementById('profile-message');
const profileForm = document.getElementById('profile-form');
const profileFormTitle = document.getElementById('profile-form-title');
const profileSubmitButton = document.getElementById('profile-submit-button');
const cancelProfileEdit = document.getElementById('cancel-profile-edit');
const profileSearchForm = document.getElementById('profile-search-form');
let editingProfileId = null;

/** טוענת פרופילים מהשרת ובונה כרטיס עם פעולות עריכה ומחיקה לכל פרופיל. */
async function loadProfiles(url = '/api/profiles') {
    try {
        profileList.innerHTML = '';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }

        const profiles = await response.json();

        if (profiles.length === 0) {
            profileMessage.textContent = url.includes('/search')
                ? 'לא נמצאו פרופילים מתאימים.'
                : 'עדיין אין פרופילים.';
            return;
        }

        profileMessage.textContent = '';

        profiles.forEach(profile => {
            const card = document.createElement('article');
            card.className = 'profile-card';

            const name = document.createElement('h3');
            name.textContent = profile.name;

            const age = document.createElement('p');
            age.textContent = `גיל: ${profile.age}`;

            const categories = document.createElement('p');
            categories.textContent = profile.favoriteCategories.length > 0
                ? `קטגוריות: ${profile.favoriteCategories.join(', ')}`
                : 'לא נבחרו קטגוריות';

            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = 'עריכה';
            // לחיצה על עריכה ממלאת את הטופס בנתוני הפרופיל שנבחר.
            editButton.addEventListener('click', () => startProfileEdit(profile));

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'מחיקה';
            // לחיצה על מחיקה שולחת את מזהה הפרופיל לפונקציית המחיקה.
            deleteButton.addEventListener('click', () => deleteProfile(profile._id));

            card.append(name, age, categories, editButton, deleteButton);
            profileList.appendChild(card);
        });
    } catch (error) {
        profileMessage.textContent = 'לא ניתן לטעון את הפרופילים.';
    }
}

/** קוראת את שדות הטופס ומחזירה אובייקט מוכן לשליחה ל-API. */
function getProfileData() {
    const categories = document.getElementById('favorite-categories').value
        .split(',')
        .map(category => category.trim())
        .filter(category => category);

    return {
        name: document.getElementById('profile-name').value.trim(),
        age: Number(document.getElementById('profile-age').value),
        favoriteCategories: categories
    };
}

/** ממלאת את הטופס בפרופיל קיים ומעבירה את המסך למצב עריכה. */
function startProfileEdit(profile) {
    editingProfileId = profile._id;
    document.getElementById('profile-name').value = profile.name;
    document.getElementById('profile-age').value = profile.age;
    document.getElementById('favorite-categories').value = profile.favoriteCategories.join(', ');
    profileFormTitle.textContent = 'עריכת פרופיל';
    profileSubmitButton.textContent = 'שמירת שינויים';
    cancelProfileEdit.hidden = false;
    profileForm.scrollIntoView({ behavior: 'smooth' });
}

/** מאפסת את מצב העריכה ואת הטופס ומחזירה את כפתור ההוספה. */
function stopProfileEdit() {
    editingProfileId = null;
    profileForm.reset();
    profileFormTitle.textContent = 'הוספת פרופיל';
    profileSubmitButton.textContent = 'הוספה';
    cancelProfileEdit.hidden = true;
}

/** מבקשת אישור, מוחקת פרופיל דרך ה-API וטוענת מחדש את הרשימה. */
async function deleteProfile(profileId) {
    if (!confirm('האם למחוק את הפרופיל?')) {
        return;
    }

    try {
        const response = await fetch(`/api/profiles/${profileId}`, { method: 'DELETE' });

        if (!response.ok) {
            throw new Error();
        }

        await loadProfiles();
        profileMessage.textContent = 'הפרופיל נמחק בהצלחה.';
    } catch (error) {
        profileMessage.textContent = 'לא ניתן למחוק את הפרופיל.';
    }
}

// שליחת הטופס מבצעת הוספה או עדכון לפי מצב editingProfileId.
profileForm.addEventListener('submit', async event => {
    event.preventDefault();

    const formMessage = document.getElementById('profile-form-message');
    const url = editingProfileId ? `/api/profiles/${editingProfileId}` : '/api/profiles';
    const method = editingProfileId ? 'PUT' : 'POST';
    const successMessage = editingProfileId
        ? 'הפרופיל עודכן בהצלחה.'
        : 'הפרופיל נוסף בהצלחה.';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getProfileData())
        });

        if (!response.ok) {
            throw new Error();
        }

        stopProfileEdit();
        formMessage.textContent = successMessage;
        await loadProfiles();
    } catch (error) {
        formMessage.textContent = 'לא ניתן לשמור את הפרופיל.';
    }
});

// ביטול עריכה מחזיר את הטופס למצב הוספה.
cancelProfileEdit.addEventListener('click', stopProfileEdit);

// חיפוש פרופילים נשלח לפי השם שהוקלד.
profileSearchForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('profile-search-name').value.trim();

    if (name) {
        loadProfiles(`/api/profiles/search?name=${encodeURIComponent(name)}`);
    }
});

// ניקוי החיפוש טוען מחדש את כל הפרופילים.
document.getElementById('clear-profile-search').addEventListener('click', () => {
    profileSearchForm.reset();
    loadProfiles();
});

// אתחול המסך טוען את רשימת הפרופילים.
loadProfiles();

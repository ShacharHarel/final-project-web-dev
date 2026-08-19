// קוד מסך הביקורות: טוען משתמש ותכנים ומאפשר חיפוש ו-CRUD בביקורות.
const reviewList = document.getElementById('review-list');
const reviewMessage = document.getElementById('review-message');
const reviewForm = document.getElementById('review-form');
const reviewFormTitle = document.getElementById('review-form-title');
const reviewSubmitButton = document.getElementById('review-submit-button');
const cancelReviewEdit = document.getElementById('cancel-review-edit');
const reviewSearchForm = document.getElementById('review-search-form');
let editingReviewId = null;
let currentUserId = null;

/** טוענת במקביל את המשתמש והתכנים כדי להכין את טפסי הביקורות. */
async function loadPageData() {
    const [userResponse, contentsResponse] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/contents')
    ]);

    if (!userResponse.ok || !contentsResponse.ok) {
        throw new Error();
    }

    const user = await userResponse.json();
    const contents = await contentsResponse.json();
    const contentSelect = document.getElementById('review-content');
    const searchContentSelect = document.getElementById('review-search-content');
    currentUserId = user._id;

    contents.forEach(content => {
        contentSelect.add(new Option(content.title, content._id));
        searchContentSelect.add(new Option(content.title, content._id));
    });
}

/** טוענת ביקורות ובונה כרטיסים; פעולות שינוי מוצגות רק לבעל הביקורת. */
async function loadReviews(url = '/api/reviews') {
    try {
        reviewList.innerHTML = '';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error();
        }

        const reviews = await response.json();

        if (reviews.length === 0) {
            reviewMessage.textContent = url.includes('/search')
                ? 'לא נמצאו תגובות לתוכן שנבחר.'
                : 'עדיין אין תגובות.';
            return;
        }

        reviewMessage.textContent = '';

        reviews.forEach(review => {
            const card = document.createElement('article');
            card.className = 'review-card';

            const title = document.createElement('h3');
            title.textContent = review.content.title;

            const username = document.createElement('p');
            username.textContent = `נכתב על ידי: ${review.user.username}`;

            const rating = document.createElement('p');
            rating.textContent = `דירוג: ${review.rating}/10`;

            const text = document.createElement('p');
            text.textContent = review.text;

            card.append(title, username, rating, text);

            if (review.user._id === currentUserId) {
                const editButton = document.createElement('button');
                editButton.className = 'edit-button';
                editButton.textContent = 'עריכה';
                // לחיצה על עריכה ממלאת את הטופס בפרטי הביקורת.
                editButton.addEventListener('click', () => startReviewEdit(review));

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'מחיקה';
                // לחיצה על מחיקה מעבירה את מזהה הביקורת לפונקציית המחיקה.
                deleteButton.addEventListener('click', () => deleteReview(review._id));

                card.append(editButton, deleteButton);
            }

            reviewList.appendChild(card);
        });
    } catch (error) {
        reviewMessage.textContent = 'לא ניתן לטעון את התגובות.';
    }
}

/** קוראת את שדות הטופס ומחזירה נתוני ביקורת מוכנים ל-API. */
function getReviewData() {
    return {
        contentId: document.getElementById('review-content').value,
        rating: Number(document.getElementById('review-rating').value),
        text: document.getElementById('review-text').value.trim()
    };
}

/** ממלאת את הטופס בביקורת קיימת ומעבירה אותו למצב עריכה. */
function startReviewEdit(review) {
    editingReviewId = review._id;
    document.getElementById('review-content').value = review.content._id;
    document.getElementById('review-rating').value = review.rating;
    document.getElementById('review-text').value = review.text;
    reviewFormTitle.textContent = 'עריכת תגובה';
    reviewSubmitButton.textContent = 'שמירת שינויים';
    cancelReviewEdit.hidden = false;
    reviewForm.scrollIntoView({ behavior: 'smooth' });
}

/** מסיימת עריכה, מאפסת את הטופס ומחזירה אותו למצב הוספה. */
function stopReviewEdit() {
    editingReviewId = null;
    reviewForm.reset();
    reviewFormTitle.textContent = 'הוספת תגובה';
    reviewSubmitButton.textContent = 'הוספה';
    cancelReviewEdit.hidden = true;
}

/** מבקשת אישור ומוחקת ביקורת של המשתמש דרך ה-API. */
async function deleteReview(reviewId) {
    if (!confirm('האם למחוק את התגובה?')) {
        return;
    }

    try {
        const response = await fetch(`/api/reviews/${reviewId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error();
        }

        await loadReviews();
        reviewMessage.textContent = 'התגובה נמחקה בהצלחה.';
    } catch (error) {
        reviewMessage.textContent = 'לא ניתן למחוק את התגובה.';
    }
}

// שליחת הטופס יוצרת ביקורת או מעדכנת ביקורת קיימת.
reviewForm.addEventListener('submit', async event => {
    event.preventDefault();

    const formMessage = document.getElementById('review-form-message');
    const url = editingReviewId ? `/api/reviews/${editingReviewId}` : '/api/reviews';
    const method = editingReviewId ? 'PUT' : 'POST';
    const successMessage = editingReviewId
        ? 'התגובה עודכנה בהצלחה.'
        : 'התגובה נוספה בהצלחה.';

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(getReviewData())
        });

        if (!response.ok) {
            throw new Error();
        }

        stopReviewEdit();
        formMessage.textContent = successMessage;
        await loadReviews();
    } catch (error) {
        formMessage.textContent = 'לא ניתן לשמור את התגובה.';
    }
});

// ביטול עריכה מחזיר את הטופס למצב הוספה.
cancelReviewEdit.addEventListener('click', stopReviewEdit);

// חיפוש הביקורות מסנן לפי התוכן שנבחר.
reviewSearchForm.addEventListener('submit', event => {
    event.preventDefault();
    const contentId = document.getElementById('review-search-content').value;

    if (contentId) {
        loadReviews(`/api/reviews/search?contentId=${encodeURIComponent(contentId)}`);
    }
});

// ניקוי החיפוש מחזיר את כל הביקורות.
document.getElementById('clear-review-search').addEventListener('click', () => {
    reviewSearchForm.reset();
    loadReviews();
});

// האתחול טוען משתמש ותכנים לפני טעינת הביקורות.
loadPageData()
    .then(loadReviews)
    .catch(() => {
        reviewMessage.textContent = 'לא ניתן לטעון את נתוני העמוד.';
    });

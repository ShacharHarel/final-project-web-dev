// קוד הפיד האישי: טוען נתוני פיד לפי פרופיל ובונה כרטיסי תוכן וביקורות.
const profileSelect = document.getElementById('feed-profile');
const feedMessage = document.getElementById('feed-message');

/** יוצרת כרטיס תוכן לחיץ עם תמונה, כותרת, דירוג וטקסט נוסף אופציונלי. */
function createContentCard(content, extraText = '') {
    const card = document.createElement('article');
    card.className = 'content-card clickable-card';
    card.tabIndex = 0;
    card.setAttribute('role', 'link');
    card.title = `צפייה בטריילר של ${content.title}`;

    const image = document.createElement('img');
    image.src = content.imageUrl;
    image.alt = content.title;

    const title = document.createElement('h3');
    title.textContent = content.title;

    const details = document.createElement('p');
    details.textContent = `${content.category} | ${content.rating}/10`;

    card.append(image, title, details);

    if (extraText) {
        const extra = document.createElement('p');
        extra.textContent = extraText;
        card.append(extra);
    }

    /** מעבירה את הדפדפן לכתובת הטריילר של התוכן הנוכחי. */
    function openTrailer() {
        window.location.href = content.videoUrl;
    }

    // הכרטיס מגיב ללחיצת עכבר וגם למקש Enter לצורך נגישות.
    card.addEventListener('click', openTrailer);
    card.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            openTrailer();
        }
    });

    return card;
}

/** מציגה מערך תכנים בתוך אזור מסוים או הודעה כאשר המערך ריק. */
function showContents(elementId, contents, emptyMessage) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    if (contents.length === 0) {
        container.textContent = emptyMessage;
        return;
    }

    contents.forEach(content => container.appendChild(createContentCard(content)));
}

/** מציגה רשומות שלא הושלמו בשורת המשך הצפייה, כולל מספר הדקות שנצפו. */
function showContinueWatching(history) {
    const container = document.getElementById('continue-watching');
    container.innerHTML = '';

    if (history.length === 0) {
        container.textContent = 'אין תכנים להמשך צפייה.';
        return;
    }

    history.forEach(item => {
        container.appendChild(createContentCard(
            item.content,
            `${item.watchedMinutes} דקות נצפו`
        ));
    });
}

/** מקבצת את כל התכנים לפי קטגוריה ויוצרת שורה נפרדת לכל קבוצה. */
function showCategories(contents) {
    const container = document.getElementById('feed-categories');
    container.innerHTML = '';
    const categories = {};

    contents.forEach(content => {
        if (!categories[content.category]) {
            categories[content.category] = [];
        }

        categories[content.category].push(content);
    });

    Object.keys(categories).forEach(category => {
        const section = document.createElement('section');
        const title = document.createElement('h3');
        const grid = document.createElement('div');
        title.textContent = category;
        grid.className = 'content-grid';
        categories[category].forEach(content => grid.appendChild(createContentCard(content)));
        section.append(title, grid);
        container.appendChild(section);
    });
}

/** מציגה את הביקורות האחרונות או הודעה מתאימה כאשר אין ביקורות. */
function showReviews(reviews) {
    const container = document.getElementById('latest-reviews');
    container.innerHTML = '';

    if (reviews.length === 0) {
        container.textContent = 'עדיין אין ביקורות.';
        return;
    }

    reviews.forEach(review => {
        const card = document.createElement('article');
        card.className = 'review-card';

        const title = document.createElement('h3');
        title.textContent = review.content.title;

        const details = document.createElement('p');
        details.textContent = `${review.user.username} | ${review.rating}/10`;

        const text = document.createElement('p');
        text.textContent = review.text;

        card.append(title, details, text);
        container.appendChild(card);
    });
}

/** מביאה מהשרת את הפיד של הפרופיל שנבחר ומעדכנת את כל אזורי המסך. */
async function loadFeed() {
    if (!profileSelect.value) {
        return;
    }

    try {
        const response = await fetch(`/api/feed/${profileSelect.value}`);
        const feed = await response.json();

        if (!response.ok) {
            throw new Error(feed.message);
        }

        feedMessage.textContent = `המלצות עבור ${feed.profile.name}`;
        showContinueWatching(feed.continueWatching);
        showContents('recommendations', feed.recommendations, 'אין המלצות לפרופיל זה.');
        showContents('top-10', feed.top10, 'אין תכנים להצגה.');
        showCategories(feed.allContents);
        showReviews(feed.latestReviews);
    } catch (error) {
        feedMessage.textContent = error.message;
    }
}

/** טוענת פרופילים ל-select ומשחזרת את הפרופיל האחרון שנבחר ב-localStorage. */
async function loadProfiles() {
    const response = await fetch('/api/profiles');
    const profiles = await response.json();

    if (profiles.length === 0) {
        feedMessage.textContent = 'יש ליצור פרופיל כדי לקבל פיד אישי.';
        return;
    }

    profiles.forEach(profile => {
        profileSelect.add(new Option(profile.name, profile._id));
    });

    const selectedProfileId = localStorage.getItem('selectedProfileId');

    if (profiles.some(profile => profile._id === selectedProfileId)) {
        profileSelect.value = selectedProfileId;
    }

    await loadFeed();
}

// החלפת פרופיל שומרת את הבחירה וטוענת פיד חדש.
profileSelect.addEventListener('change', () => {
    localStorage.setItem('selectedProfileId', profileSelect.value);
    loadFeed();
});
// אתחול המסך מתחיל בטעינת פרופילי המשתמש.
loadProfiles();

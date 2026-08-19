// קוד מסך החיפוש המתקדם: שולח חיפושים מרובי פרמטרים ומציג נתונים מסכמים.
const exploreResults = document.getElementById('explore-results');
const exploreMessage = document.getElementById('explore-message');

/** מנקה תוצאות קודמות ובונה כרטיס תוכן עבור כל תוצאת חיפוש. */
function showSearchResults(contents) {
    exploreResults.innerHTML = '';
    exploreMessage.textContent = contents.length === 0 ? 'לא נמצאו תכנים.' : '';

    contents.forEach(content => {
        const card = document.createElement('article');
        card.className = 'content-card';

        const image = document.createElement('img');
        image.src = content.imageUrl;
        image.alt = content.title;

        const title = document.createElement('h3');
        title.textContent = content.title;

        const details = document.createElement('p');
        details.textContent = `${content.category} | ${content.type} | ${content.releaseYear} | ${content.rating}/10`;

        card.append(image, title, details);
        exploreResults.appendChild(card);
    });
}

/** שולחת חיפוש לכתובת שנבנתה מהטופס ומעבירה את התוצאות לתצוגה. */
async function search(url) {
    try {
        const response = await fetch(url);
        const contents = await response.json();

        if (!response.ok) {
            throw new Error(contents.message);
        }

        showSearchResults(contents);
    } catch (error) {
        exploreMessage.textContent = error.message;
    }
}

// הטופס הראשון בונה חיפוש לפי קטגוריה, סוג ודירוג מינימלי.
document.getElementById('advanced-search-form').addEventListener('submit', event => {
    event.preventDefault();
    const category = document.getElementById('advanced-category').value.trim();
    const type = document.getElementById('advanced-type').value;
    const rating = document.getElementById('advanced-rating').value;
    search(`/api/contents/advanced-search?category=${encodeURIComponent(category)}&type=${type}&minRating=${rating}`);
});

// הטופס השני בונה חיפוש לפי כותרת וטווח שנים.
document.getElementById('year-search-form').addEventListener('submit', event => {
    event.preventDefault();
    const title = document.getElementById('year-title').value.trim();
    const fromYear = document.getElementById('from-year').value;
    const toYear = document.getElementById('to-year').value;
    search(`/api/contents/year-search?title=${encodeURIComponent(title)}&fromYear=${fromYear}&toYear=${toYear}`);
});

/** טוענת נתוני Aggregation ומציגה כרטיס מסכם לכל קבוצה. */
async function loadStats(url, elementId) {
    const response = await fetch(url);
    const stats = await response.json();
    const container = document.getElementById(elementId);

    stats.forEach(item => {
        const card = document.createElement('article');
        card.className = 'stats-card';
        card.textContent = `${item._id}: ${item.count} תכנים | דירוג ממוצע ${item.averageRating.toFixed(1)}`;
        container.appendChild(card);
    });
}

loadStats('/api/contents/stats/by-category', 'category-stats');
loadStats('/api/contents/stats/by-type', 'type-stats');

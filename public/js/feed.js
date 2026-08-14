const profileSelect = document.getElementById('feed-profile');
const feedMessage = document.getElementById('feed-message');

function createContentCard(content, extraText = '') {
    const card = document.createElement('article');
    card.className = 'content-card';

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

    return card;
}

function showContents(elementId, contents, emptyMessage) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    if (contents.length === 0) {
        container.textContent = emptyMessage;
        return;
    }

    contents.forEach(content => container.appendChild(createContentCard(content)));
}

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

    await loadFeed();
}

profileSelect.addEventListener('change', loadFeed);
loadProfiles();

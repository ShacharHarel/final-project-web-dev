const mapContent = document.getElementById('map-content');
const mapAddress = document.getElementById('map-address');
const mapFrame = document.getElementById('map-frame');
const externalForm = document.getElementById('external-search-form');
const externalMessage = document.getElementById('external-message');
const externalResult = document.getElementById('external-result');
let contents = [];

function showSelectedAddress() {
    const content = contents.find(item => item._id === mapContent.value);

    if (!content) {
        return;
    }

    mapAddress.textContent = `${content.title}: ${content.address}`;
    mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(content.address)}&output=embed`;
}

async function loadMapContents() {
    const response = await fetch('/api/contents');
    contents = await response.json();

    contents.filter(content => content.address).forEach(content => {
        mapContent.add(new Option(content.title, content._id));
    });

    showSelectedAddress();
}

externalForm.addEventListener('submit', async event => {
    event.preventDefault();
    externalResult.innerHTML = '';

    try {
        const title = document.getElementById('external-title').value.trim();
        const response = await fetch(`/api/external/show?title=${encodeURIComponent(title)}`);
        const show = await response.json();

        if (!response.ok) {
            throw new Error(show.message);
        }

        const name = document.createElement('h3');
        name.textContent = show.name;

        const details = document.createElement('p');
        details.textContent = `${show.language || 'לא ידוע'} | ${show.status || 'לא ידוע'} | ${show.premiered || 'לא ידוע'}`;

        const genres = document.createElement('p');
        genres.textContent = `ז'אנרים: ${show.genres.join(', ') || 'לא ידוע'}`;

        const rating = document.createElement('p');
        rating.textContent = `דירוג TVmaze: ${show.rating || 'לא זמין'}`;

        const summary = document.createElement('p');
        summary.textContent = show.summary;

        externalResult.append(name, details, genres, rating, summary);
        externalMessage.textContent = '';
    } catch (error) {
        externalMessage.textContent = error.message;
    }
});

mapContent.addEventListener('change', showSelectedAddress);
loadMapContents();

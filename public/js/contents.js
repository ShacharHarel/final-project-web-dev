async function loadContents() {
    const message = document.getElementById('message');
    const contentList = document.getElementById('content-list');

    try {
        const response = await fetch('/api/contents');
        const contents = await response.json();

        if (contents.length === 0) {
            message.textContent = 'עדיין אין תכנים בקטלוג.';
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
            details.textContent = `${content.category} | ${content.releaseYear}`;

            card.append(image, title, details);
            contentList.appendChild(card);
        });
    } catch (error) {
        message.textContent = 'לא ניתן לטעון את התכנים.';
    }
}

loadContents();

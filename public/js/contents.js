async function loadContents() {
    const message = document.getElementById('message');
    const contentList = document.getElementById('content-list');

    try {
        contentList.innerHTML = '';
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

const contentForm = document.getElementById('content-form');

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
        const response = await fetch('/api/contents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(content)
        });

        if (!response.ok) {
            throw new Error();
        }

        contentForm.reset();
        formMessage.textContent = 'התוכן נוסף בהצלחה.';
        await loadContents();
    } catch (error) {
        formMessage.textContent = 'לא ניתן להוסיף את התוכן.';
    }
});

loadContents();

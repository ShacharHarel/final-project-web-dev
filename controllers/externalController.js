async function getShowInfo(req, res) {
    try {
        if (!req.query.title) {
            return res.status(400).json({ message: 'יש להזין שם סדרה.' });
        }

        const url = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(req.query.title)}`;
        const response = await fetch(url);

        if (response.status === 404) {
            return res.status(404).json({ message: 'לא נמצא מידע על הסדרה.' });
        }

        if (!response.ok) {
            throw new Error();
        }

        const show = await response.json();
        const summary = show.summary
            ? show.summary.replace(/<[^>]*>/g, '')
            : 'אין תיאור זמין.';

        res.json({
            name: show.name,
            language: show.language,
            genres: show.genres,
            status: show.status,
            premiered: show.premiered,
            rating: show.rating.average,
            summary
        });
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לקבל מידע מהשירות החיצוני.' });
    }
}

module.exports = { getShowInfo };

// Controller של ביקורות: CRUD וחיפוש ביקורות לפי תוכן, עם שמירה על בעלות המשתמש.
const Review = require('../models/Review');
const Content = require('../models/Content');

/** מחזירה את כל הביקורות עם שם המשתמש וכותרת התוכן באמצעות populate. */
async function getAllReviews(req, res) {
    try {
        const reviews = await Review.find()
            .populate('user', 'username')
            .populate('content', 'title')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לטעון את התגובות.' });
    }
}

/** מחזירה ביקורות ששייכות לתוכן שנבחר לפי contentId. */
async function searchReviews(req, res) {
    try {
        if (!req.query.contentId) {
            return res.status(400).json({ message: 'יש לבחור תוכן.' });
        }

        const reviews = await Review.find({ content: req.query.contentId })
            .populate('user', 'username')
            .populate('content', 'title')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'החיפוש נכשל.' });
    }
}

/** בודקת שהתוכן קיים ויוצרת ביקורת המקושרת למשתמש המחובר. */
async function createReview(req, res) {
    try {
        const { contentId, rating, text } = req.body;

        if (!contentId || !rating || !text) {
            return res.status(400).json({ message: 'יש למלא את כל השדות.' });
        }

        const content = await Content.findById(contentId);

        if (!content) {
            return res.status(400).json({ message: 'התוכן לא נמצא.' });
        }

        const review = await Review.create({
            user: req.session.userId,
            content: contentId,
            rating,
            text
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/** מעדכנת ביקורת רק כאשר היא שייכת למשתמש המחובר והתוכן החדש תקין. */
async function updateReview(req, res) {
    try {
        const { contentId, rating, text } = req.body;

        if (!contentId || !rating || !text) {
            return res.status(400).json({ message: 'יש למלא את כל השדות.' });
        }

        const content = await Content.findById(contentId);

        if (!content) {
            return res.status(400).json({ message: 'התוכן לא נמצא.' });
        }

        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, user: req.session.userId },
            { content: contentId, rating, text },
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({ message: 'התגובה לא נמצאה.' });
        }

        res.json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/** מוחקת ביקורת לפי id רק אם המשתמש המחובר הוא בעל הביקורת. */
async function deleteReview(req, res) {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.session.userId
        });

        if (!review) {
            return res.status(404).json({ message: 'התגובה לא נמצאה.' });
        }

        res.json({ message: 'התגובה נמחקה.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllReviews,
    searchReviews,
    createReview,
    updateReview,
    deleteReview
};

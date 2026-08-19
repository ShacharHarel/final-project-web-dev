// Controller של היסטוריית צפייה: CRUD וחיפוש רשומות השייכות למשתמש המחובר.
const WatchHistory = require('../models/WatchHistory');
const Profile = require('../models/Profile');
const Content = require('../models/Content');

/** מחזירה את כל היסטוריית הצפייה של המשתמש עם שמות הפרופיל והתוכן. */
async function getAllHistory(req, res) {
    try {
        const history = await WatchHistory.find({ user: req.session.userId })
            .populate('profile', 'name')
            .populate('content', 'title')
            .sort({ watchedAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לטעון את היסטוריית הצפייה.' });
    }
}

/** מסננת את היסטוריית המשתמש לפי פרופיל צפייה שנבחר. */
async function searchHistory(req, res) {
    try {
        if (!req.query.profileId) {
            return res.status(400).json({ message: 'יש לבחור פרופיל.' });
        }

        const history = await WatchHistory.find({
            user: req.session.userId,
            profile: req.query.profileId
        })
            .populate('profile', 'name')
            .populate('content', 'title')
            .sort({ watchedAt: -1 });

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'החיפוש נכשל.' });
    }
}

/** מאמתת שהפרופיל שייך למשתמש ושהתוכן קיים, ואז יוצרת רשומת צפייה. */
async function createHistory(req, res) {
    try {
        const { profileId, contentId, watchedMinutes, completed } = req.body;

        if (!profileId || !contentId) {
            return res.status(400).json({ message: 'יש לבחור פרופיל ותוכן.' });
        }

        const profile = await Profile.findOne({
            _id: profileId,
            user: req.session.userId
        });
        const content = await Content.findById(contentId);

        if (!profile || !content) {
            return res.status(400).json({ message: 'הפרופיל או התוכן אינם תקינים.' });
        }

        const history = await WatchHistory.create({
            user: req.session.userId,
            profile: profileId,
            content: contentId,
            watchedMinutes,
            completed
        });

        res.status(201).json(history);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/** מעדכנת רשומת צפייה קיימת לאחר בדיקת בעלות ותקינות הפרופיל והתוכן. */
async function updateHistory(req, res) {
    try {
        const { profileId, contentId, watchedMinutes, completed } = req.body;

        if (!profileId || !contentId) {
            return res.status(400).json({ message: 'יש לבחור פרופיל ותוכן.' });
        }

        const profile = await Profile.findOne({
            _id: profileId,
            user: req.session.userId
        });
        const content = await Content.findById(contentId);

        if (!profile || !content) {
            return res.status(400).json({ message: 'הפרופיל או התוכן אינם תקינים.' });
        }

        const history = await WatchHistory.findOneAndUpdate(
            { _id: req.params.id, user: req.session.userId },
            { profile: profileId, content: contentId, watchedMinutes, completed },
            { new: true, runValidators: true }
        );

        if (!history) {
            return res.status(404).json({ message: 'רשומת הצפייה לא נמצאה.' });
        }

        res.json(history);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/** מוחקת רשומת צפייה רק כאשר היא שייכת למשתמש המחובר. */
async function deleteHistory(req, res) {
    try {
        const history = await WatchHistory.findOneAndDelete({
            _id: req.params.id,
            user: req.session.userId
        });

        if (!history) {
            return res.status(404).json({ message: 'רשומת הצפייה לא נמצאה.' });
        }

        res.json({ message: 'רשומת הצפייה נמחקה.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllHistory,
    searchHistory,
    createHistory,
    updateHistory,
    deleteHistory
};

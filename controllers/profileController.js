// Controller של פרופילים: CRUD וחיפוש בפרופילי הצפייה של המשתמש המחובר בלבד.
const Profile = require('../models/Profile');
const WatchHistory = require('../models/WatchHistory');

/** מחזירה רק את פרופילי הצפייה ששייכים למשתמש המחובר. */
async function getAllProfiles(req, res) {
    try {
        const profiles = await Profile.find({ user: req.session.userId });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לטעון את הפרופילים.' });
    }
}

/** מחפשת בשם פרופיל בתוך הפרופילים של המשתמש המחובר בלבד. */
async function searchProfiles(req, res) {
    try {
        if (!req.query.name) {
            return res.status(400).json({ message: 'יש להזין שם לחיפוש.' });
        }

        const profiles = await Profile.find({
            user: req.session.userId,
            name: { $regex: req.query.name, $options: 'i' }
        });

        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'החיפוש נכשל.' });
    }
}

/** מאמתת שם וגיל ויוצרת פרופיל חדש המקושר למשתמש שב-Session. */
async function createProfile(req, res) {
    try {
        const { name, age, favoriteCategories } = req.body;

        if (!name || !age) {
            return res.status(400).json({ message: 'יש למלא שם וגיל.' });
        }

        const profile = await Profile.create({
            user: req.session.userId,
            name,
            age,
            favoriteCategories
        });

        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/** מעדכנת פרופיל רק אם גם ה-id וגם המשתמש המחובר תואמים. */
async function updateProfile(req, res) {
    try {
        const { name, age, favoriteCategories } = req.body;
        const profile = await Profile.findOneAndUpdate(
            { _id: req.params.id, user: req.session.userId },
            { name, age, favoriteCategories },
            { new: true, runValidators: true }
        );

        if (!profile) {
            return res.status(404).json({ message: 'הפרופיל לא נמצא.' });
        }

        res.json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

/** מוחקת פרופיל בבעלות המשתמש ומנקה את היסטוריית הצפייה שלו. */
async function deleteProfile(req, res) {
    try {
        const profile = await Profile.findOneAndDelete({
            _id: req.params.id,
            user: req.session.userId
        });

        if (!profile) {
            return res.status(404).json({ message: 'הפרופיל לא נמצא.' });
        }

        await WatchHistory.deleteMany({ profile: profile._id });
        res.json({ message: 'הפרופיל נמחק.' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllProfiles,
    searchProfiles,
    createProfile,
    updateProfile,
    deleteProfile
};

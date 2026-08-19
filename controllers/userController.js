// Controller של ניהול משתמשים: פעולות מנהל לחיפוש, שינוי תפקיד ומחיקת משתמש.
const User = require('../models/User');
const Profile = require('../models/Profile');
const WatchHistory = require('../models/WatchHistory');
const Review = require('../models/Review');

/** מחזירה למנהל רשימת משתמשים ללא שדות הסיסמה. */
async function getAllUsers(req, res) {
    try {
        const users = await User.find().select('username email role createdAt').sort({ username: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לטעון את המשתמשים.' });
    }
}

/** מחפשת משתמשים לפי שם משתמש או אימייל ומחזירה רק שדות בטוחים. */
async function searchUsers(req, res) {
    try {
        if (!req.query.query) {
            return res.status(400).json({ message: 'יש להזין ערך לחיפוש.' });
        }

        const users = await User.find({
            $or: [
                { username: { $regex: req.query.query, $options: 'i' } },
                { email: { $regex: req.query.query, $options: 'i' } }
            ]
        }).select('username email role createdAt').sort({ username: 1 });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'חיפוש המשתמשים נכשל.' });
    }
}

/** משנה תפקיד בין user ל-admin ומונעת מהמנהל לשנות את תפקידו שלו. */
async function updateUserRole(req, res) {
    try {
        if (!['user', 'admin'].includes(req.body.role)) {
            return res.status(400).json({ message: 'תפקיד המשתמש אינו תקין.' });
        }

        if (req.params.id === String(req.session.userId)) {
            return res.status(400).json({ message: 'לא ניתן לשנות את התפקיד של המשתמש המחובר.' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: req.body.role },
            { new: true, runValidators: true }
        ).select('username email role createdAt');

        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא.' });
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: 'לא ניתן לעדכן את המשתמש.' });
    }
}

/** מוחקת משתמש אחר ומנקה את הפרופילים, ההיסטוריה והביקורות השייכים לו. */
async function deleteUser(req, res) {
    try {
        if (req.params.id === String(req.session.userId)) {
            return res.status(400).json({ message: 'לא ניתן למחוק את המשתמש המחובר.' });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא.' });
        }

        await Profile.deleteMany({ user: user._id });
        await WatchHistory.deleteMany({ user: user._id });
        await Review.deleteMany({ user: user._id });

        res.json({ message: 'המשתמש נמחק.' });
    } catch (error) {
        res.status(400).json({ message: 'לא ניתן למחוק את המשתמש.' });
    }
}

module.exports = {
    getAllUsers,
    searchUsers,
    updateUserRole,
    deleteUser
};

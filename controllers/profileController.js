const Profile = require('../models/Profile');

async function getAllProfiles(req, res) {
    try {
        const profiles = await Profile.find({ user: req.session.userId });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לטעון את הפרופילים.' });
    }
}

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

async function deleteProfile(req, res) {
    try {
        const profile = await Profile.findOneAndDelete({
            _id: req.params.id,
            user: req.session.userId
        });

        if (!profile) {
            return res.status(404).json({ message: 'הפרופיל לא נמצא.' });
        }

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

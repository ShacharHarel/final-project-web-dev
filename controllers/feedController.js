// Controller של הפיד: מרכיב עבור פרופיל אחד המשך צפייה, המלצות, Top 10 וביקורות.
const Profile = require('../models/Profile');
const Content = require('../models/Content');
const WatchHistory = require('../models/WatchHistory');
const Review = require('../models/Review');

/** בונה פיד אישי לפרופיל ששייך למשתמש: המלצות, המשך צפייה, Top 10 וביקורות. */
async function getPersonalFeed(req, res) {
    try {
        const profile = await Profile.findOne({
            _id: req.params.profileId,
            user: req.session.userId
        });

        if (!profile) {
            return res.status(404).json({ message: 'הפרופיל לא נמצא.' });
        }

        const recommendationFilter = profile.favoriteCategories.length > 0
            ? { category: { $in: profile.favoriteCategories } }
            : {};

        const continueWatching = await WatchHistory.find({
            user: req.session.userId,
            profile: profile._id,
            completed: false
        })
            .populate('content')
            .sort({ watchedAt: -1 })
            .limit(10);

        const recommendations = await Content.find(recommendationFilter)
            .sort({ rating: -1 })
            .limit(10);
        const top10 = await Content.find().sort({ rating: -1 }).limit(10);
        const allContents = await Content.find().sort({ category: 1, title: 1 });
        const latestReviews = await Review.find()
            .populate('user', 'username')
            .populate('content', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            profile,
            continueWatching,
            recommendations,
            top10,
            allContents,
            latestReviews
        });
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לטעון את הפיד.' });
    }
}

module.exports = { getPersonalFeed };

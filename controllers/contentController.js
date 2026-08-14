const Content = require('../models/Content');
const WatchHistory = require('../models/WatchHistory');
const Review = require('../models/Review');

async function getAllContents(req, res) {
    try {
        const contents = await Content.find();
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get contents' });
    }
}

async function searchContents(req, res) {
    try {
        if (!req.query.title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const contents = await Content.find({
            title: { $regex: req.query.title, $options: 'i' }
        });

        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to search contents' });
    }
}

async function advancedSearch(req, res) {
    try {
        const { category, type, minRating } = req.query;

        if (!category || !type || minRating === undefined) {
            return res.status(400).json({ message: 'Category, type and minimum rating are required' });
        }

        const contents = await Content.find({
            category: { $regex: category, $options: 'i' },
            type,
            rating: { $gte: Number(minRating) }
        });

        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Advanced search failed' });
    }
}

async function searchByYear(req, res) {
    try {
        const { title, fromYear, toYear } = req.query;

        if (!title || !fromYear || !toYear) {
            return res.status(400).json({ message: 'Title and year range are required' });
        }

        const contents = await Content.find({
            title: { $regex: title, $options: 'i' },
            releaseYear: {
                $gte: Number(fromYear),
                $lte: Number(toYear)
            }
        });

        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Year search failed' });
    }
}

async function getCategoryStats(req, res) {
    try {
        const stats = await Content.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load category statistics' });
    }
}

async function getTypeStats(req, res) {
    try {
        const stats = await Content.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to load type statistics' });
    }
}

async function createContent(req, res) {
    try {
        const content = new Content(req.body);
        await content.save();
        res.status(201).json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function updateContent(req, res) {
    try {
        const content = await Content.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        res.json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function deleteContent(req, res) {
    try {
        const content = await Content.findByIdAndDelete(req.params.id);

        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }

        await WatchHistory.deleteMany({ content: content._id });
        await Review.deleteMany({ content: content._id });
        res.json({ message: 'Content deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllContents,
    searchContents,
    advancedSearch,
    searchByYear,
    getCategoryStats,
    getTypeStats,
    createContent,
    updateContent,
    deleteContent
};

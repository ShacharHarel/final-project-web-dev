const Content = require('../models/Content');

async function getAllContents(req, res) {
    try {
        const contents = await Content.find();
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get contents' });
    }
}

module.exports = {
    getAllContents
};

const Content = require('../models/Content');

async function getAllContents(req, res) {
    try {
        const contents = await Content.find();
        res.json(contents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get contents' });
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

module.exports = {
    getAllContents,
    createContent
};

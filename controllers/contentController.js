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

        res.json({ message: 'Content deleted' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllContents,
    createContent,
    updateContent,
    deleteContent
};

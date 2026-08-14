function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'יש להתחבר למערכת.' });
    }

    next();
}

function requirePageAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    next();
}

function requirePageAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    if (req.session.role !== 'admin') {
        return res.redirect('/feed');
    }

    next();
}

function requireAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'יש להתחבר למערכת.' });
    }

    if (req.session.role !== 'admin') {
        return res.status(403).json({ message: 'אין הרשאה לבצע פעולה זו.' });
    }

    next();
}

module.exports = {
    requireAuth,
    requirePageAuth,
    requirePageAdmin,
    requireAdmin
};

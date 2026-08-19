// Middleware של הרשאות: בודק Session לפני גישה ל-API או למסכים מוגנים.

/** בודקת שמשתמש מחובר לפני גישה לנתיב API, אחרת מחזירה שגיאת 401. */
function requireAuth(req, res, next) {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'יש להתחבר למערכת.' });
    }

    next();
}

/** בודקת התחברות לפני מסך HTML; משתמש לא מחובר מועבר למסך ההתחברות. */
function requirePageAuth(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    next();
}

/** מגינה על מסך מנהל; אורח מועבר להתחברות ומשתמש רגיל מוחזר לפיד. */
function requirePageAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    if (req.session.role !== 'admin') {
        return res.redirect('/feed');
    }

    next();
}

/** מגינה על API של מנהל ומחזירה 401 לאורח או 403 למשתמש ללא הרשאה. */
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

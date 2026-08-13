const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'יש למלא את כל השדות.' });
        }

        if (username.trim().length < 3) {
            return res.status(400).json({ message: 'שם המשתמש חייב להכיל לפחות 3 תווים.' });
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: 'כתובת האימייל אינה תקינה.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'הסיסמה חייבת להכיל לפחות 6 תווים.' });
        }

        const existingUser = await User.findOne({
            $or: [{ username }, { email: email.toLowerCase() }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'שם המשתמש או האימייל כבר קיימים.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userCount = await User.countDocuments();
        const user = await User.create({
            username: username.trim(),
            email: email.toLowerCase(),
            password: hashedPassword,
            role: userCount === 0 ? 'admin' : 'user'
        });

        req.session.userId = user._id;
        req.session.role = user.role;

        res.status(201).json({
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'ההרשמה נכשלה.' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'יש למלא אימייל וסיסמה.' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'האימייל או הסיסמה שגויים.' });
        }

        req.session.userId = user._id;
        req.session.role = user.role;

        res.json({
            username: user.username,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'ההתחברות נכשלה.' });
    }
}

function logout(req, res) {
    req.session.destroy(error => {
        if (error) {
            return res.status(500).json({ message: 'ההתנתקות נכשלה.' });
        }

        res.json({ message: 'ההתנתקות בוצעה בהצלחה.' });
    });
}

async function getCurrentUser(req, res) {
    try {
        const user = await User.findById(req.session.userId).select('username email role');

        if (!user) {
            return res.status(404).json({ message: 'המשתמש לא נמצא.' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'לא ניתן לטעון את המשתמש.' });
    }
}

module.exports = {
    register,
    login,
    logout,
    getCurrentUser
};

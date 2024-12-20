const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ message: 'Пользователь не авторизован' });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userId = decoded.userId;

        if (!userId) {
            return res.status(403).json({ message: 'Пользователь не авторизован' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(403).json({ message: 'Пользователь не найден' });
        }

        req.user = user;

        const allowedRoles = ["admin", "user"];
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'У Вас нет доступа' });
        }

        next();
    } catch (e) {
        console.error("Ошибка проверки роли:", e);
        return res.status(403).json({ message: 'Пользователь не авторизован' });
    }
};
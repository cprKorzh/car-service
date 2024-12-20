require('dotenv').config();
const { validationResult } = require('express-validator');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAccessToken = (userId, userRole) => {
    const payload = {
        userId,
        userRole
    };
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "3h" });
};

class AuthController {
    registration = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('registration', {
                errors: errors.mapped(),
                data: req.body,
            });
        }

        const { name, middlename, surname, tel, email, password } = req.body;
        try {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).render('registration', {
                    errors: { email: { msg: 'Пользователь с таким email уже существует' } },
                    data: req.body,
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const role = 'user';

            const telWithoutSymbols = tel.replace(/\D/g, '');

            console.log(telWithoutSymbols)

            if (!/^7\d{10}$/.test(telWithoutSymbols)) {
                return res.status(400).render('registration', {
                    errors: { tel: { msg: 'Некорректный номер телефона. Укажите в формате +7XXXXXXXXXX' } },
                    data: req.body,
                });
            }

            await User.create({ name, middlename, surname, tel: telWithoutSymbols, email, password: hashedPassword, role });

            res.redirect(`/login`);
        } catch (error) {
            console.log(error);
            res.status(500).render('registration', {
                errors: { general: { msg: 'Ошибка сервера, попробуйте позже' } },
                data: req.body,
            });
        }
    };

    login = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('login', {
                errors: errors.mapped(),
                data: req.body,
            });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(400).render('login', {
                    errors: { email: { msg: 'Пользователь с таким email не существует' } },
                    data: req.body,
                });
            }

            const isPassEquals = await bcrypt.compare(password, user.password); // don't await!
            if (!isPassEquals) {
                return res.status(400).render('login', {
                    errors: { password: { msg: 'Неверный пароль' } },
                    data: req.body,
                });
            }
            
            const token = generateAccessToken(user.id, user.role);

            res.cookie('token', token, { httpOnly: true });

            if (user.role === "admin") {
                return res.redirect(`/admin-panel?name=${encodeURIComponent(user.name, user.role)}`);
            } else {
                return res.redirect(`/user-panel?name=${encodeURIComponent(user.name, user.role)}`);
            }
        } catch (error) {
            console.log(error)
            res.status(500).render('login', {
                errors: { general: { msg: 'Ошибка сервера, попробуйте позже' } },
                data: req.body,
            });
        }
    };

    logout = async (req, res) => {
        try {
            res.clearCookie('token');
            res.redirect('/login');
        } catch (error) {
            res.status(500).render('error', { message: 'Ошибка при выходе', error });
        }
    };

    getRegistrationPage = async (req, res) => {
        res.render('registration', { errors: {}, data: {} });
    }

    getLoginPage = async (req, res) => {
        res.render('login', { errors: {}, data: {} });
    }
}

module.exports = new AuthController();
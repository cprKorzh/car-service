const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const authController = require("../controllers/authController");
const userController = require("../controllers/UserController");
const checkRole = require('../middlewares/roleMiddleware');
const res = require("express/lib/response");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Главная страница' });
});

router.post(
    '/registration',
    body('email').isEmail().withMessage('Некорректный email'),
    body('password').isLength({ min: 3, max: 32 }).withMessage('Пароль должен быть от 3 до 32 символов'),
    body('name').notEmpty().withMessage('Имя пользователя обязательно'),
    authController.registration
);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/registration', authController.getRegistrationPage);
router.get('/login', authController.getLoginPage);

router.get('/admin-panel', checkRole, userController.getAdminPanel);
router.get('/user-panel', checkRole, userController.getUserPanel);

module.exports = router;

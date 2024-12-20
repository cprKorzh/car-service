class UserController {

    getUserPanel = async (req, res) => {
        try {
            res.render('user-panel', {
                title: 'Панель пользователя',
                user: req.user,
            });
        } catch (e) {
            res.status(500).render('error', {
                message: 'Ошибка сервера',
                error: { status: 500, stack: e.stack },
            });
        }
    };

    getAdminPanel = async (req, res) => {
        try {
            res.render('admin-panel', {
                title: 'Панель администратора',
                user: req.user,
            });
        } catch (e) {
            res.status(500).render('error', {
                message: 'Ошибка сервера',
                error: { status: 500, stack: e.stack },
            });
        }
    };
}

module.exports = new UserController();
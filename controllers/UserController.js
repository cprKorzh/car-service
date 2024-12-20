class UserController {

    getUserPage = async (req, res) => {
        try {
            const { name } = req.query;

            if (!name) {
                return res.status(400).render('error', {
                    message: 'Пользователь не указан',
                    error: { status: 400, stack: '' },
                });
            }

            res.render('user', { name });
        } catch (e) {
            res.status(500).render('login', {
                errors: { general: { msg: 'Ошибка сервера, попробуйте позже' } },
                data: req.body,
            });
        }
    };

}

module.exports = new UserController();
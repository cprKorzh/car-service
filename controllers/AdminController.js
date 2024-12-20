const { Request, Car, User } = require("../models");

class AdminController {
    getAdminRequests = async (req, res) => {
        try {
            const { name } = req.query;
            const user = req.user;

            
            const requests = await Request.findAll({
                include: [
                    { model: Car, as: 'car' },
                    { model: User, as: 'user' },
                ],
            });

            res.render("admin-panel", {
                title: "Панель администратора",
                name,
                user,
                requests,
            });
        } catch (e) {
            console.error("Ошибка получения заявок:", e);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    };
}

module.exports = new AdminController();
const { Car } = require("../models");

class CarController {

    createCar = async (req, res) => {
        try {
            const { number, make, model } = req.body;
            const userId = req.user.id;

            const car = await Car.create({
                name,
                make,
                model,
                user_id: userId,
            });

            res.redirect("/user-panel");
        } catch (e) {
            console.error("Ошибка создания авто:", e);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    };
}

module.exports = new CarController();
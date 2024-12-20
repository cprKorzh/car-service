module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define('Request', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        problem: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        repair_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        car_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'requests',
        timestamps: false,
    });

    Request.associate = (models) => {
        Request.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
        Request.belongsTo(models.Car, { foreignKey: 'car_id', as: 'car' });
    };

    return Request;
};

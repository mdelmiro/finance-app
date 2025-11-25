const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming database config is here, will verify

module.exports = (sequelize, DataTypes) => {
    const InviteCode = sequelize.define('InviteCode', {
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        isUsed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    InviteCode.associate = (models) => {
        InviteCode.belongsTo(models.User, { foreignKey: 'usedBy' });
    };

    return InviteCode;
};

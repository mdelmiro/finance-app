const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: [],
    },
    responsible: {
        type: DataTypes.STRING,
        defaultValue: 'me',
    },
    installments: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    persona: {
        type: DataTypes.ENUM('personal', 'solyze'),
        defaultValue: 'personal',
    }
}, {
    timestamps: true,
});

module.exports = Transaction;

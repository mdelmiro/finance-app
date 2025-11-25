const User = require('./User');
const Transaction = require('./Transaction');
const Category = require('./Category');

// Associations
User.hasMany(Transaction);
Transaction.belongsTo(User);

User.hasMany(Category);
Category.belongsTo(User);

module.exports = {
    User,
    Transaction,
    Category,
};

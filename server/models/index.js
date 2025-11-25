const User = require('./User');
const Transaction = require('./Transaction');
const Category = require('./Category');
const ApiKey = require('./ApiKey');

// Associations
User.hasMany(Transaction);
Transaction.belongsTo(User);

User.hasMany(Category);
Category.belongsTo(User);

User.hasMany(ApiKey);
ApiKey.belongsTo(User);

module.exports = {
    User,
    Transaction,
    Category,
    ApiKey,
};

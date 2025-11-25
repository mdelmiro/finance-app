const User = require('./User');
const Transaction = require('./Transaction');
const Category = require('./Category');
const ApiKey = require('./ApiKey');
const InviteCode = require('./InviteCode');

// Associations
User.hasMany(Transaction);
Transaction.belongsTo(User);

User.hasMany(Category);
Category.belongsTo(User);

User.hasMany(ApiKey);
ApiKey.belongsTo(User);

// InviteCode Associations (Optional: if we want to track who used which code)
// InviteCode.belongsTo(User, { foreignKey: 'usedBy' });

module.exports = {
    User,
    Transaction,
    Category,
    ApiKey,
    InviteCode,
};

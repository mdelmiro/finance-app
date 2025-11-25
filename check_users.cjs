const { connectDB, sequelize } = require('./server/config/database');
const { User } = require('./server/models');

const checkUsers = async () => {
    try {
        await connectDB();
        const users = await User.findAll();
        console.log('--- USERS IN DATABASE ---');
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            users.forEach(u => {
                console.log(`ID: ${u.id} | Name: ${u.name} | Email: ${u.email}`);
            });
        }
        console.log('-------------------------');
    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await sequelize.close();
    }
};

checkUsers();

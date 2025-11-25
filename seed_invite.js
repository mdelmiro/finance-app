const { InviteCode, sequelize } = require('./server/models');

const seedCode = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        // Sync models to ensure table exists
        await sequelize.sync();

        const code = 'SOLYZE2026';
        await InviteCode.create({
            code: code,
            isUsed: false
        });

        console.log(`Invite code ${code} created successfully.`);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
};

seedCode();

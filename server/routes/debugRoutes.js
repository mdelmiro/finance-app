const express = require('express');
const router = express.Router();
const { User } = require('../models');

router.get('/users', async (req, res) => {
    try {
        const { secret } = req.query;
        if (secret !== 'debug123') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'createdAt']
        });

        res.json({
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Debug Error:', error);
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
});

module.exports = router;

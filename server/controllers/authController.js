const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, InviteCode } = require('../models');

const register = async (req, res) => {
    try {
        const { name, email, password, inviteCode } = req.body;

        // Validate Invite Code
        if (!inviteCode) {
            return res.status(400).json({ message: 'Código de convite é obrigatório.' });
        }

        const validCode = await InviteCode.findOne({ where: { code: inviteCode, isUsed: false } });
        if (!validCode) {
            return res.status(400).json({ message: 'Código de convite inválido ou já utilizado.' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já cadastrado.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Mark code as used
        validCode.isUsed = true;
        validCode.usedBy = user.id;
        await validCode.save();

        // Generate Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_secret', {
            expiresIn: '7d',
        });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciais inválidas.' });
        }

        // Generate Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'dev_secret', {
            expiresIn: '7d',
        });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor.' });
    }
};

module.exports = { register, login };

const { v4: uuidv4 } = require('uuid');
const ApiKey = require('../models/ApiKey');

const createKey = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Nome da chave é obrigatório.' });
        }

        // Generate a random key (using UUID for simplicity and uniqueness)
        // Prefix with 'sk_' to make it recognizable
        const key = `sk_${uuidv4().replace(/-/g, '')}`;

        const newKey = await ApiKey.create({
            key,
            name,
            UserId: req.user.id
        });

        res.status(201).json(newKey);
    } catch (error) {
        console.error('Error creating API key:', error);
        res.status(500).json({ message: 'Erro ao criar chave de API.' });
    }
};

const listKeys = async (req, res) => {
    try {
        const keys = await ApiKey.findAll({
            where: { UserId: req.user.id },
            attributes: ['id', 'name', 'lastUsedAt', 'createdAt'] // Don't return the full key for security (though we store it raw for now)
        });
        res.json(keys);
    } catch (error) {
        console.error('Error listing API keys:', error);
        res.status(500).json({ message: 'Erro ao listar chaves.' });
    }
};

const deleteKey = async (req, res) => {
    try {
        const { id } = req.params;
        const key = await ApiKey.findOne({ where: { id, UserId: req.user.id } });

        if (!key) {
            return res.status(404).json({ message: 'Chave não encontrada.' });
        }

        await key.destroy();
        res.json({ message: 'Chave removida com sucesso.' });
    } catch (error) {
        console.error('Error deleting API key:', error);
        res.status(500).json({ message: 'Erro ao remover chave.' });
    }
};

module.exports = { createKey, listKeys, deleteKey };

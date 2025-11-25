const { Transaction } = require('../models');

const createTransaction = async (req, res) => {
    try {
        const { description, value, type, category, date, tags, responsible, installments, persona, notes } = req.body;

        // Basic validation
        if (!description || !value || !type || !category || !date) {
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
        }

        const transaction = await Transaction.create({
            description,
            value,
            type,
            category,
            date,
            tags: tags || [],
            responsible: responsible || 'me',
            installments: installments || null,
            persona: persona || 'personal',
            notes: notes || '',
            UserId: req.user.id, // Link to authenticated user
        });

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar transação.' });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { UserId: req.user.id },
            order: [['date', 'DESC']],
        });
        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar transações.' });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { description, value, type, category, date, tags, responsible, persona, notes } = req.body;

        const transaction = await Transaction.findOne({
            where: { id, UserId: req.user.id },
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transação não encontrada.' });
        }

        await transaction.update({
            description,
            value,
            type,
            category,
            date,
            tags,
            responsible,
            persona,
            notes,
        });

        res.json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar transação.' });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findOne({
            where: { id, UserId: req.user.id },
        });

        if (!transaction) {
            return res.status(404).json({ message: 'Transação não encontrada.' });
        }

        await transaction.destroy();
        res.json({ message: 'Transação removida com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao remover transação.' });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    updateTransaction,
    deleteTransaction,
};

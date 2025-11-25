const express = require('express');
const router = express.Router();
const { createTransaction, getTransactions, updateTransaction, deleteTransaction } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const apiAuthMiddleware = require('../middleware/apiAuthMiddleware');

// Combined Auth Middleware: Checks for API Key first, then falls back to JWT
const combinedAuth = (req, res, next) => {
    if (req.headers['x-api-key']) {
        return apiAuthMiddleware(req, res, next);
    }
    return authMiddleware(req, res, next);
};

// Apply auth middleware to all routes
router.use(combinedAuth);

router.post('/', createTransaction);
router.get('/', getTransactions);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;

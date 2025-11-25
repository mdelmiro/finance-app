const express = require('express');
const router = express.Router();
const { createKey, listKeys, deleteKey } = require('../controllers/apiKeyController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes here require standard user authentication (JWT)
router.use(authMiddleware);

router.post('/', createKey);
router.get('/', listKeys);
router.delete('/:id', deleteKey);

module.exports = router;

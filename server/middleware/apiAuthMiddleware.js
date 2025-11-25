const ApiKey = require('../models/ApiKey');
const User = require('../models/User');

const apiAuthMiddleware = async (req, res, next) => {
    try {
        const apiKey = req.headers['x-api-key'];

        if (!apiKey) {
            // If no API key, pass to next middleware (which might be JWT auth)
            // Or if this is strictly for API routes, return 401.
            // For flexibility, we'll assume this is used in a chain or standalone.
            // If used standalone, we should return 401.
            return res.status(401).json({ message: 'API Key não fornecida.' });
        }

        const keyRecord = await ApiKey.findOne({
            where: { key: apiKey },
            include: [{ model: User }]
        });

        if (!keyRecord) {
            return res.status(401).json({ message: 'API Key inválida.' });
        }

        // Update usage stats
        await keyRecord.update({ lastUsedAt: new Date() });

        // Attach user to request
        req.user = keyRecord.User;
        req.isApiRequest = true; // Flag to indicate API usage

        next();
    } catch (error) {
        console.error('API Auth Error:', error);
        res.status(500).json({ message: 'Erro de autenticação da API.' });
    }
};

module.exports = apiAuthMiddleware;

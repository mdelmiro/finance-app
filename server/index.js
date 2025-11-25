const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for dev/mobile testing
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const apiKeyRoutes = require('./routes/apiKeyRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/keys', apiKeyRoutes);

console.log('Auth routes registered at /api/auth');
console.log('Transaction routes registered at /api/transactions');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', message: 'API is operational' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'Not Found' });
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', async () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to Database
    const { connectDB, sequelize } = require('./config/database');
    const models = require('./models'); // Import models to ensure they are registered

    await connectDB();

    // Sync models (create tables)
    // Sync models (create tables)
    // Removed alter: true to avoid ER_TOO_MANY_KEYS on Users table
    await sequelize.sync();
    console.log('Database synced successfully.');
});

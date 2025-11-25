const axios = require('axios');

const API_URL = 'http://localhost:3002/api';

async function testApiKey() {
    try {
        const uniqueEmail = `api_test_${Date.now()}@teste.com`;

        // 0. Register
        console.log('0. Registering new user...');
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'API Tester',
                email: uniqueEmail,
                password: '123456'
            });
            console.log('User registered:', uniqueEmail);
        } catch (e) {
            console.log('User might already exist, proceeding to login...');
        }

        // 1. Login
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: uniqueEmail,
            password: '123456'
        });
        const token = loginRes.data.token;
        console.log('Login successful. Token:', token.substring(0, 20) + '...');

        // 2. Create API Key
        console.log('\n2. Creating API Key...');
        const keyRes = await axios.post(`${API_URL}/keys`, {
            name: 'Test Script Key'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const apiKey = keyRes.data.key;
        const keyId = keyRes.data.id;
        console.log('API Key created:', apiKey);

        // 3. Use API Key to create Transaction
        console.log('\n3. Creating Transaction with API Key...');
        const transactionRes = await axios.post(`${API_URL}/transactions`, {
            description: 'Transaction via API Key',
            value: 150.00,
            type: 'income',
            category: 'API Test',
            date: new Date().toISOString()
        }, {
            headers: { 'x-api-key': apiKey }
        });
        console.log('Transaction created:', transactionRes.data.description, transactionRes.data.value);

        // 4. Cleanup (Delete Key)
        console.log('\n4. Deleting API Key...');
        await axios.delete(`${API_URL}/keys/${keyId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('API Key deleted.');

        console.log('\n✅ VERIFICATION SUCCESSFUL');
    } catch (error) {
        console.error('❌ VERIFICATION FAILED:', error.response ? error.response.data : error.message);
    }
}

testApiKey();

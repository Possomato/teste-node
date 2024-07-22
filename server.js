require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const HUBSPOT_API_URL = 'https://api.hubspot.com/conversations/v3/visitor-identification/tokens/create';

app.post('/generate-token', async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;
        const response = await axios.post('https://api.hubspot.com/conversations/v3/visitor-identification/tokens/create', {
            email,
            firstName,
            lastName
        }, {
            headers: { Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}` }
        });
        res.json({ token: response.data.token });
    } catch (error) {
        console.error('Error generating token:', error);
        if (error.response) {
            // Se o erro vem da API da HubSpot
            res.status(500).json({ message: error.response.data });
        } else {
            // Se o erro é no servidor ou na requisição
            res.status(500).json({ message: error.message });
        }
    }
});


const PORT = process.env.PORT || 3033;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

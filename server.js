const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*' 
}));
app.use(express.json());

// 1. LEAD RECEIVER ROUTE (Prints form inputs to your logs)
app.post('/api/leads/hub', (req, res) => {
    const { name, email, destination } = req.body;
    console.log(`✈️ NEW TRAFFIC LEAD RECEIVED: Name: ${name} | Email: ${email} | Target: ${destination}`);
    return res.status(201).json({ 
        success: true, 
        message: "Lead received successfully by Global Voyage cloud server." 
    });
});

// 2. SECURE LINK CLOAKING ROUTE: Generates affiliate revenue
app.get('/go/:destinationSlug', (req, res) => {
    const slug = req.params.destinationSlug.toLowerCase();
    
    const affiliateMap = {
        'phuket': 'https://aviasales.tpk.lu/sktha0hU',
        'tokyo': 'https://airhelp.tpk.lu/RzxasdVz',
        'kyoto': 'https://aviasales.tpk.lu/sktha0hU'
    };

    const targetDestinationUrl = affiliateMap[slug];

    if (targetDestinationUrl) {
        return res.redirect(302, targetDestinationUrl);
    } else {
        return res.redirect(302, 'https://blogspot.com');
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Global Voyage Server active on port: ${PORT}`);
});

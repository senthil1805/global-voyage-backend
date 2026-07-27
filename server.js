const express = require('express');
const cors = require('cors');

const app = express();

// This allows your free blogspot site to send data directly to your server
app.use(cors({
    origin: '*' 
}));
app.use(express.json());

// 1. SIMPLE LEAD RECEIVER ROUTE (Accepts form inputs and prints them to your logs)
app.post('/api/leads/hub', (req, res) => {
    const { name, email, destination } = req.body;
    
    console.log(`✈️ NEW TRAFFIC LEAD RECEIVED LIVE: Name: ${name} | Email: ${email} | Target: ${destination}`);
    
    return res.status(201).json({ 
        success: true, 
        message: "Lead received successfully by Global Voyage cloud server." 
    });
});

// 2. SECURE TRAFFIC LINK CLOAKING ROUTE: Generates revenue via affiliate masking
app.get('/go/:destinationSlug', (req, res) => {
    const slug = req.params.destinationSlug.toLowerCase();
    
    // Map your custom links to your real affiliate landing pages
    const affiliateMap = {
        'phuket': 'https://tp.st',
        'tokyo': 'https://tp.st',
        'kyoto': 'https://tp.st'
    };

    const targetDestinationUrl = affiliateMap[slug];

    if (targetDestinationUrl) {
        return res.redirect(302, targetDestinationUrl);
    } else {
        // Fallback default routing directly to your free live blog homepage
        return res.redirect(302, 'https://blogspot.com');
    }
});

// Start the server infrastructure
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`Global Voyage Server active on port: ${PORT}`);
    console.log(`====================================================`);
});
app.get('/', (req, res) => {
    res.send('Global Voyage Portal Backend is running!');
});


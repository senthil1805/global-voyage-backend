const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// This allows your free blogspot site to send data directly to your database
app.use(cors({
    origin: '*' 
}));
app.use(express.json());

// Initialize Cloud Database Connection
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Initialize Automated Email Transporter Engine
const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 1. TRAFFIC INGESTION ROUTE (Saves form data from your Blogger page)
app.post('/api/leads/hub', async (req, res) => {
    const { name, email, phone, destination, duration, budget, travelStyle, notes } = req.body;
    if (!name || !email || !destination) {
        return res.status(400).json({ success: false, message: "Missing required parameters." });
    }
    try {
        const { data, error } = await supabase
            .from('leads')
            .insert([{ 
                name, email, phone, destination, 
                duration: parseInt(duration) || 10, budget, 
                travel_style: travelStyle, notes 
            }]);
        if (error) throw error;

        res.status(201).json({ success: true, message: "Lead saved safely." });
    } catch (dbError) {
        res.status(500).json({ success: false, message: "Backend data sync failed." });
    }
});

// 2. SECURE TRAFFIC LINK CLOAKING ROUTE: Generates revenue via affiliate masking
app.get('/go/:destinationSlug', (req, res) => {
    const slug = req.params.destinationSlug.toLowerCase();
    
    // Map your link tags to real affiliate link addresses
    const affiliateMap = {
        'phuket': 'https://tp.st',
        'tokyo': 'https://tp.st',
        'kyoto': 'https://tp.st'
    };

    const targetDestinationUrl = affiliateMap[slug];

    if (targetDestinationUrl) {
        return res.redirect(302, targetDestinationUrl);
    } else {
        // Fallback default routing to your free live blog homepage
        return res.redirect(302, 'https://blogspot.com');
    }
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Global Voyage Server active on port: ${PORT}`);
});

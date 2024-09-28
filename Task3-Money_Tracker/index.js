const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Add this to handle CORS properly

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse application/json
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Money_Tracker');
const db = mongoose.connection;
db.on('error', () => console.log("Error in connecting to the Database"));
db.once('open', () => console.log("Connected to Database"));

// Define a schema and model for transactions
const transactionSchema = new mongoose.Schema({
    category: String,
    amount: Number,
    info: String,
    date: String,
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// Route to handle adding a transaction
app.post('/add', (req, res) => {
    const { category, amount, info, date } = req.body;

    const newTransaction = new Transaction({
        category,
        amount,
        info,
        date
    });

    newTransaction.save((err, savedTransaction) => {
        if (err) {
            console.log("Error in saving transaction:", err);
            return res.status(500).send('Error saving transaction');
        }
        console.log("Record Inserted Successfully:", savedTransaction);
        res.json(savedTransaction);
    });
});

// Serve the frontend HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(3000, () => {
    console.log("Listening on port 3000");
});

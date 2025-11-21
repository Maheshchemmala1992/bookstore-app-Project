const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // CORS for cross-origin requests

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// --- MongoDB Connection ---
const connectionOptions = {
    user: process.env.MONGO_USERNAME,   // Ensure MONGO_USERNAME is correct
    pass: process.env.MONGO_PASSWORD,   // Ensure MONGO_PASSWORD is correct
};

mongoose.connect(process.env.MONGO_URL, connectionOptions)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- Schema & Model ---
const BookSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Book name is required'],  // Added validation message
    }
});

const Book = mongoose.model("Book", BookSchema);

// --- Routes ---
app.get('/', (req, res) => {
    res.send("Welcome to BookStore with MongoDB!");
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        console.error("Error fetching books:", err);
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

app.post('/books', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Book name is required" });
        }
        
        const newBook = new Book({ name });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        console.error("Error adding book:", err);
        res.status(400).json({ message: "Failed to add book", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`📚 Bookstore running on port ${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

app.use(express.json());

// --- MongoDB Connection ---
const connectionOptions = {
    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD
};

mongoose.connect(process.env.MONGO_URL, connectionOptions)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- Schema & Model ---
const BookSchema = new mongoose.Schema({
    name: { type: String, required: true }
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
        res.status(500).json({ message: "Failed to fetch books" });
    }
});

app.post('/books', async (req, res) => {
    try {
        const newBook = new Book({ name: req.body.name });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: "Failed to add book", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`📚 Bookstore running on port ${PORT}`);
});

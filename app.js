const express = require('express');
const mongoose = require('mongoose');

// Initialize Express application
const app = express();
const PORT = 3000;

// --- 1. MongoDB Connection Setup ---

// Access environment variables directly for better security and readability.
// MONGO_URL should contain the host/port/db (e.g., "mongodb://mongo-service:27017/bookstoredb").
// MONGO_USERNAME and MONGO_PASSWORD are passed in the options object.
const connectionOptions = {
    user: process.env.MONGO_USERNAME, // Pass username directly
    pass: process.env.MONGO_PASSWORD, // Pass password directly
    // Use the updated connection options recommended by Mongoose
    useNewUrlParser: true, 
    useUnifiedTopology: true
};

mongoose.connect(process.env.MONGO_URL, connectionOptions)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ MongoDB Error:", err));

// --- 2. Mongoose Schema and Model ---

const BookSchema = new mongoose.Schema({
    // Adding type and required validation for better schema design
    name: {
        type: String,
        required: true
    }
});

const Book = mongoose.model("Book", BookSchema);

// --- 3. Express Routes ---

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to BookStore with MongoDB!');
});

// GET all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        // Respond with the books data
        res.json(books);
    } catch (error) {
        // Handle errors during database retrieval
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Failed to retrieve books." });
    }
});

// Simple POST route to add a book (for testing)
app.post('/books/:name', async (req, res) => {
    try {
        // Simple way to get the book name from the URL path for quick testing
        const newBook = new Book({ name: req.params.name });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(400).json({ message: "Failed to add book.", error: error.message });
    }
});

// --- 4. Start Server ---

app.listen(PORT, () => {
    console.log(`Bookstore app running on port ${PORT}`);
});

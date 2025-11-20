const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Welcome to BookStore!');
});

app.get('/books', (req, res) => {
  res.json([
    { id: 1, name: "Harry Potter" },
    { id: 2, name: "Rich Dad Poor Dad" }
  ]);
});

app.listen(PORT, () => {
  console.log(`Bookstore app running on port ${PORT}`);
});

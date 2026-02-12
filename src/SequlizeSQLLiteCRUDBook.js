const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// database connection
const sequelize = new Sequelize({
  dialect: 'sqlite', 
  storage: './Database/SQBooks.sqlite'
});

// model
const Book = sequelize.define('book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// sync db
sequelize.sync();

// test route
app.get("/", (req, res) => {
  res.send("API running");
});

// get all
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get by id
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.json(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

// create
app.post('/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

// update
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    await book.update(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

// delete
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    await book.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// start server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

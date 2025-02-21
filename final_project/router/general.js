const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get all books using Promises
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
      resolve(books); // Simulate async operation
    })
    .then(bookData => {
      return JSON.stringify(bookData, null, 4);
    })
    .then(formattedBooks => {
      res.status(200).send(formattedBooks);
    })
    .catch(err => {
      res.status(500).json({message: "Error retrieving books"});
    });
  });

// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
      const book = books[isbn];
      book ? resolve(book) : reject("Book not found");
    })
    .then(book => res.status(200).json(book))
    .catch(err => res.status(404).json({message: err}));
  });

// Get books by author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const matches = await new Promise((resolve) => {
        resolve(Object.values(books).filter(b => b.author === author));
      });
      matches.length > 0 
        ? res.status(200).json(matches)
        : res.status(404).json({message: "Author not found"});
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

// Get books by title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const response = await axios.get('http://localhost:5000/');
      const matches = Object.values(response.data).filter(b => b.title === title);
      matches.length > 0 
        ? res.status(200).json(matches)
        : res.status(404).json({message: "Title not found"});
    } catch (err) {
      res.status(500).json({message: err.message});
    }
  });

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  return book 
    ? res.status(200).json(book.reviews)
    : res.status(404).json({ message: "Book not found" });
});
  
  // Alternative: Using async/await with Axios (for external API)
  public_users.get('/async', async function (req, res) {
    try {
      // Simulate external API call
      const response = await axios.get('https://sharjeelahm2-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
      res.status(200).send(response.data);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  });

module.exports.general = public_users;

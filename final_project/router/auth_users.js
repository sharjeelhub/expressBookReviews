const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(u => u.username === username);
  return user && user.password === password;
};

// Login route
regd_users.post("/login", (req, res) => {
    console.log("Registered users:", users); // Add this line

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username & password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username }, 
    'fingerprint_customer', // Secret key (match session secret)
    { expiresIn: '1h' }
  );

  return res.status(200).json({ 
    message: "Login successful", 
    token 
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review;
  const username = req.user.username; // From JWT

  if (!reviewText) {
    return res.status(400).json({ message: "Review text required" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add/modify review
  book.reviews[username] = reviewText;
  
  return res.status(200).json({ 
    message: "Review added/updated successfully",
    reviews: book.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // From JWT
  
    // Check book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check user has a review
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found to delete" });
    }
  
    // Delete review
    delete books[isbn].reviews[username];
    return res.status(200).json({ 
      message: "Review deleted successfully",
      remainingReviews: books[isbn].reviews
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

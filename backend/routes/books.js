const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

// Get all books (public)
router.get('/', async (req, res) => {
  try {
    const { genre, search, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (genre && genre !== 'All') query.genre = genre;
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } }
    ];
    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    res.json({ books, total, pages: Math.ceil(total / limit), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create book (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update book (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete book (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Book.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Book removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

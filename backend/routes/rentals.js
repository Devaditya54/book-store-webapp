const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

// Rent a book
router.post('/', protect, async (req, res) => {
  try {
    const { bookId, days = 14 } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.availableCopies < 1) return res.status(400).json({ message: 'No copies available' });

    // Check if user already rented this book
    const existing = await Rental.findOne({ user: req.user._id, book: bookId, status: 'active' });
    if (existing) return res.status(400).json({ message: 'You already have this book rented' });

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    const rental = await Rental.create({
      user: req.user._id,
      book: bookId,
      dueDate,
      rentPrice: book.rentPrice
    });

    book.availableCopies -= 1;
    await book.save();

    const populated = await Rental.findById(rental._id).populate('book', 'title author coverImage genre');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's rentals
router.get('/my', protect, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user._id })
      .populate('book', 'title author coverImage genre rentPrice')
      .sort({ rentedAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Return a book
router.put('/:id/return', protect, async (req, res) => {
  try {
    const rental = await Rental.findOne({ _id: req.params.id, user: req.user._id });
    if (!rental) return res.status(404).json({ message: 'Rental not found' });
    if (rental.status === 'returned') return res.status(400).json({ message: 'Already returned' });

    rental.status = 'returned';
    rental.returnedAt = new Date();
    await rental.save();

    await Book.findByIdAndUpdate(rental.book, { $inc: { availableCopies: 1 } });
    res.json({ message: 'Book returned successfully', rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

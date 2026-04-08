const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const Rental = require('../models/Rental');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalBooks = await Book.countDocuments({ isActive: true });
    const activeRentals = await Rental.countDocuments({ status: 'active' });
    const totalRentals = await Rental.countDocuments();
    const overdueRentals = await Rental.countDocuments({ status: 'overdue' });
    const genreStats = await Book.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$genre', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ totalUsers, totalBooks, activeRentals, totalRentals, overdueRentals, genreStats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all rentals (admin view)
router.get('/rentals', protect, adminOnly, async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('user', 'name email')
      .populate('book', 'title author genre coverImage')
      .sort({ rentedAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get rentals by user
router.get('/rentals/user/:userId', protect, adminOnly, async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.params.userId })
      .populate('book', 'title author genre coverImage')
      .sort({ rentedAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

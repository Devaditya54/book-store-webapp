const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre: {
    type: String,
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Technology', 'Fantasy', 'Mystery', 'Romance', 'Self-Help', 'Children', 'Other']
  },
  coverImage: { type: String, default: '' },
  rentPrice: { type: Number, required: true },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  isbn: { type: String, trim: true },
  publishedYear: { type: Number },
  language: { type: String, default: 'English' },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Book', bookSchema);

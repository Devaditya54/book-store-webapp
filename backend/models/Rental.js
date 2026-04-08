const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  rentedAt: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnedAt: { type: Date },
  status: { type: String, enum: ['active', 'returned', 'overdue'], default: 'active' },
  rentPrice: { type: Number, required: true }
});

module.exports = mongoose.model('Rental', rentalSchema);

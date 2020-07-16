const mongoose = require('mongoose');

const TransactionSchema = mongoose.Schema({
  credit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  debit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  cleared: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('transaction', TransactionSchema);

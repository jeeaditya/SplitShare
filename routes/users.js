const express = require('express');
const router = express.Router();

// @route   GET api/transactions
// @desc    GET All Transactions where user is C/R or D/R
// @access  Private
router.get('/', (req, res) => {
  res.send('Get Transactions');
});

// @route   POST api/transactions
// @desc    Add new transactions
// @access  Private
router.post('/', (req, res) => {
  res.send('Add new Transactions');
});

// @route   PUT api/transactions/:id
// @desc    Mark Complete
// @access  Private
router.post('/:id', (req, res) => {
  res.send('Marked Complete');
});

module.exports = router;

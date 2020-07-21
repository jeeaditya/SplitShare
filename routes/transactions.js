const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @route   GET api/transactions/credits
// @desc    GET All Transactions where user is C/R
// @access  Private
router.get('/credits', auth, (req, res) => {
  res.send('Get Transactions');
});

// @route   GET api/transactions/debits
// @desc    GET All Transactions where user is D/R
// @access  Private
router.get('/debits', auth, (req, res) => {
  res.send('Get Transactions');
});

// @route   POST api/transactions
// @desc    Add new transactions
// @access  Private
router.post(
  '/',
  auth,
  [
    check('amount', `Invalid Amount`).isNumeric(),
    check('phoneDebt', 'Debit User Not Found').isNumeric().isLength({ min: 10, max: 10 }),
  ],
  async (req, res) => {
    // Check for Invalid arguments
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body);
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, phoneDebt } = req.body;

    try {
      // Try to find the user in the Db
      let user = await User.findOne({ phone: phoneDebt });
      if (!user) {
        return res.status(400).json({ msg: 'Debit User Not Found' });
      }
      // If User exists add the transaction

      let transact = new Transaction({
        credit: req.user.id,
        debit: user.id,
        amount: amount,
      });

      console.log(transact);
      await transact.save();

      res.status(201).json({ msg: 'Transaction Created' });
    } catch (error) {
      console.log(error);
      res.json({ errors: errors });
    }
  }
);

// @route   PUT api/transactions/:id
// @desc    Mark Complete
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) return res.status(404).json({ msg: 'Transaction not found' });

    if (transaction.credit.toString() !== req.user.id && transaction.debit.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(req.params.id, { cleared: true }, { new: true });

    res.json(transaction);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

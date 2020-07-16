const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');


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


// @route     POST api/users
// @desc      Regiter a user
// @access    Public
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('phone','Please add a valid phone number.')
    .isNumeric()
    .isLength({ min: 10, max: 10 }),
    check(
      'password',
      'Please enter a password '
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, password } = req.body;

    try {
      let user = await User.findOne({ phone });

      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      user = new User({
        name,
        phone,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);





module.exports = router;

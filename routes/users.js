const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const User = require('../models/User');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post(
  '/',
  [
    check('name', 'Please add name').not().isEmpty(),
    check('phone', 'Please add a valid phone number.').isNumeric().isLength({ min: 10, max: 10 }),
    check('password', 'Please enter a password ').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(req.body.name);
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
        process.env.JWTSECRET,
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

// @route     GET api/users
// @desc      Get matching Users
// @access    Public
router.get('/', auth, async (req, res) => {
  try {
    const { searchInput } = req.body;
    console.log(typeof searchInput);
    console.log(/^\d+$/.test(searchInput));
    let foundUsers = {};
    if (/^\d+$/.test(searchInput)) {
      foundUsers = await User.find({ phone: { $regex: searchInput, $options: 'i' } }, 'name phone');
    } else {
      foundUsers = await User.find({ name: { $regex: searchInput, $options: 'i' } }, 'name phone');
    }
    console.log(foundUsers);
    res.json(foundUsers);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;

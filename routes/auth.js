const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    GET Logged In User
// @access  Private
router.get('/', (req, res) => {
  res.send('Get Logged In User');
});

// @route   POST api/auth
// @desc    Auth User & get Token
// @access  Public
router.post('/', (req, res) => {
  res.send('Authorize & return Token');
});

module.exports = router;

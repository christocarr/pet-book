const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

//@route POST api/users
//@desc register user
//@access Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with a minimum of 8 characters').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, profileImage } = req.body;

    try {
      //Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      //Create instance of user
      user = new User({
        name,
        email,
        password,
        profileImage,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      //save user to db
      await user.save();

      //Return jsonwebtoken
      res.send('User registered');

    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

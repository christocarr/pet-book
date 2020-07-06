const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const PetProfile = require('../../models/PetProfile');
const User = require('../../models/User');

//@route GET api/profile/me
//@desc get current users profile
//@access Private
router.get('/me', auth, async (req, res) => {
  try {
    const petProfiles = await PetProfile.find({ user: req.user.id });

    if (petProfiles.length === 0) {
      return res.status(400).json({ msg: 'There are no pets for this user' });
    }

    res.json(petProfiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route POST api/profile
//@desc create or update pet profiles for user
//@access Private
router.post('/', [auth, [check('petname', 'Name of pet is required').not().isEmpty(), check('animal', 'Animal is required').not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { petname, animal, family, breed, age, bio } = req.body;
  //create profile object
  const petProfileFields = {};
  petProfileFields.user = req.user.id;
  if (petname) petProfileFields.petname = petname;
  if (animal) petProfileFields.animal = animal;
  if (family) petProfileFields.family = family;
  if (breed) petProfileFields.breed = breed;
  if (age) petProfileFields.age = age;
  if (bio) petProfileFields.bio = bio;

  try {
    //find and update
    let petProfile = await PetProfile.findOne({ user: req.user.id });

    if (petProfile) {
      petProfile = await PetProfile.findOneAndUpdate({ user: req.user.id }, { $set: petProfileFields }, { new: true });

      return res.json(petProfile);
    }

    //create if not found
    petProfile = new PetProfile(petProfileFields);
    await petProfile.save();
    res.json(petProfile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//@route GET api/profile
//@desc get all pet profiles
//@access Public
router.get('/', async (req, res) => {
  try {
    const petProfiles = await PetProfile.find().populate('users', ['name']);
    res.json(petProfiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

//@route GET api/profile/user/:user_id
//@desc get user profile by user id
//@access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const petProfile = await PetProfile.findOne({ user: req.params.user_id }).populate('users', ['name']);

    if (!petProfile) {
      return res.status(400).json({ msg: 'There are pet profiles for this user' });
    }
    res.json(petProfile);
  } catch (err) {
    console.log(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router;

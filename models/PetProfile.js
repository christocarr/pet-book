const mongoose = require('mongoose');

const PetProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  petname: {
    type: String,
    required: true,
  },
  animal: {
    type: String,
    required: true,
  },
  family: {
    type: String,
  },
  breed: {
    type: String,
  },
  age: {
    type: Number,
  },
  bio: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = PetProfile = mongoose.model('PetProfile', PetProfileSchema);

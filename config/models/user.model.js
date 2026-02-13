const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 55,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png"
    },
    bio: {
      type: String,
      maxlength: 1024
    },
    followers: {
      type: [String],
      default: []
    },
    following: {
      type: [String],
      default: []
    },
    like: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    next(err);
  }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
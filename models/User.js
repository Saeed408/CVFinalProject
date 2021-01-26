const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  name: { type: String, require: true},
  photoUrl: { type: String},
  location: { type: String},
  phone: { type: String},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  linkedin: { type: String},
  github: { type: String},
  education: [{ year: String, course: String, institution: String, university: String, percentage: String }],
  languages: [{ language: String, level: String }],
  experience: [{ year: String, company: String, position: String, description: String }],
  skills: {type: String},
});

UserSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('password')) {
    const document = this;
    bcrypt.hash(this.password, saltRounds, function(err, hashedPassword) {
      if (err) {
        next(err);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
});

UserSchema.methods.isCorrectPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
}

module.exports = mongoose.model('User', UserSchema);
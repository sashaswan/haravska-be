const mongoose = require('mongoose');
const User = mongoose.model('Users');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const messages = require('../../config/messages');
const bcrypt = require('bcryptjs');

// Convert comparePassword to promise-based function
const comparePassword = (password, userPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, userPassword, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

exports.getOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        message: messages.user.api.userNotFound
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const token = req.headers['x-access-token'];

    if (token) {
      try {
        const decoded = jwt.verify(token, config.secret);
        return res.status(200).json({
          id: decoded._id || decoded._doc._id,
          role: decoded.role || decoded._doc.role,
          token,
        });
      } catch (err) {
        return res.status(401).json({
          success: false,
          message: messages.user.api.tokenExpired,
        });
      }
    }

    if (!req.body.email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: messages.user.api.userNotFound,
      });
    }

    if (!req.body.password) {
      return res.status(400).json({
        success: false,
        message: messages.user.api.wrongPassword,
      });
    }

    const isPasswordMatch = await comparePassword(req.body.password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: messages.user.api.wrongPassword,
      });
    }

    // Create token with better payload structure
    const payload = {
      _id: user._id,
      role: user.role,
      email: user.email
    };

    const newToken = jwt.sign(payload, config.secret, {
      expiresIn: '24h' // Longer expiration time
    });

    return res.status(200).json({
      id: user._id,
      role: user.role,
      token: newToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
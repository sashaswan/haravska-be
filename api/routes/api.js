const router = require('express').Router();
const {
  publicRouter: photoSessionPublic,
  privateRouter: photoSessionPrivate,
} = require('./photoSession');
const {
  publicRouter: categoryPublic,
  privateRouter: categoryPrivate,
} = require('./category');
const jwt = require('jsonwebtoken');
const config = require('../../config');

// Authentication middleware
const authenticate = (req, res, next) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).header('Allow', 'GET,PUT,POST,DELETE,HEAD').send();
  }

  const token = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Failed to authenticate token.'
    });
  }
};

// Public routes
router.use('/', require('./base'));
router.use('/photo-sessions', photoSessionPublic);
router.use('/categories', categoryPublic);

// Protected routes
router.use('/users', authenticate, require('./user'));
router.use('/categories', authenticate, categoryPrivate);
router.use('/photo-sessions', authenticate, photoSessionPrivate);

module.exports = router;
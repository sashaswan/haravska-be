const router = require('express').Router();
const { getOne } = require('../controllers/user');

router.get('/:id', getOne);

module.exports = router;
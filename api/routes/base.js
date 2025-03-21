const router = require('express').Router();
const multer = require('multer');
const multerUpload = multer({ dest: 'public/uploads/' })
const { login } = require('../controllers/user');
const { upload } = require('../controllers/media');

router.post('/login', login);
router.post('/media', multerUpload.array('files'), upload);

module.exports = router;
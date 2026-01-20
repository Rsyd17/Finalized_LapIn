const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../config/multer'); // Import multer config

router.get('/:id', userController.getUserProfile);
router.put('/:id', upload.single('profilePic'), userController.updateUserProfile);

module.exports = router;
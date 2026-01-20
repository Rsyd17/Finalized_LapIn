const express = require('express');
const router = express.Router(); // Ensure capital R
const bookingController = require('../controllers/bookingController');
const upload = require('../config/multer');

// Define routes relative to the mount point
router.post('/bookings', upload.single('krsFile'), bookingController.createBooking);
router.get('/schedule', bookingController.getSchedule);
router.get('/my-bookings/:userId', bookingController.getMyBookings);
router.get('/courts', bookingController.getCourts); 

module.exports = router;
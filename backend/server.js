require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db'); // Database connection

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Static Folder for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', bookingRoutes); // This handles /api/bookings and /api/bookings/schedule etc.
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Special route for courts if you prefer /api/courts instead of /api/bookings/courts
// But in my bookingRoutes I mapped it to /courts, so it would be accessed via /api/bookings/courts
// If you want strictly /api/courts, do this:
const bookingController = require('./controllers/bookingController');
app.get('/api/courts', bookingController.getCourts);
// And remove the /courts line from bookingRoutes.js or keep both.

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
const router = require('express').Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const turfRoutes = require('./turfRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');
const adminRoutes = require('./adminRoutes');
const ownerRoutes = require('./ownerRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/turfs', turfRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/admin', adminRoutes);
router.use('/owner', ownerRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'TurfBook API is running', timestamp: new Date().toISOString() });
});

module.exports = router;

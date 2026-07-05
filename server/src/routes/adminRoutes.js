const router = require('express').Router();
const adminController = require('../controllers/adminController');
const turfController = require('../controllers/turfController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/analytics', adminController.getAnalytics);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/bookings', adminController.getAllBookings);
router.get('/payments', adminController.getAllPayments);
router.post('/notifications', adminController.sendNotification);
router.get('/turfs', turfController.getTurfs);
router.post('/turfs', turfController.createTurf);

module.exports = router;

const router = require('express').Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, userController.getProfile);
router.get('/wallet', protect, userController.getWallet);
router.post('/favorites/:turfId', protect, userController.toggleFavorite);
router.get('/notifications', protect, userController.getNotifications);
router.patch('/notifications/read', protect, userController.markNotificationRead);
router.patch('/notifications/:id/read', protect, userController.markNotificationRead);

module.exports = router;

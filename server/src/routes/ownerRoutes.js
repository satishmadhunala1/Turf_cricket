const router = require('express').Router();
const ownerController = require('../controllers/ownerController');
const turfController = require('../controllers/turfController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createTurfValidator } = require('../validators/turfValidator');
const validate = require('../middleware/validate');

router.use(protect, authorize('owner', 'admin'));

router.get('/dashboard', ownerController.getDashboard);
router.get('/turfs', ownerController.getMyTurfs);
router.post('/turfs', upload.array('images', 10), createTurfValidator, validate, turfController.createTurf);
router.put('/turfs/:id', upload.array('images', 10), turfController.updateTurf);
router.patch('/turfs/:id/slots', ownerController.updateSlots);
router.get('/bookings', ownerController.getBookings);
router.patch('/bookings/:id', ownerController.updateBookingStatus);
router.get('/revenue', ownerController.getRevenue);
router.get('/reviews', ownerController.getReviews);

module.exports = router;

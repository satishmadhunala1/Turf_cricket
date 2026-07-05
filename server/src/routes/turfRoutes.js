const router = require('express').Router();
const turfController = require('../controllers/turfController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');
const { createTurfValidator, searchTurfValidator } = require('../validators/turfValidator');

router.get('/', searchTurfValidator, validate, turfController.getTurfs);
router.get('/featured', turfController.getFeaturedTurfs);
router.get('/locations/popular', turfController.getPopularLocations);
router.get('/slug/:slug', turfController.getTurfBySlug);
router.get('/:id/availability', turfController.getAvailability);
router.get('/:id/nearby', turfController.getNearbyTurfs);
router.get('/:id/reviews', turfController.getTurfReviews);
router.get('/:id', turfController.getTurfById);

router.post('/', protect, authorize('owner', 'admin'), upload.array('images', 10), createTurfValidator, validate, turfController.createTurf);
router.put('/:id', protect, authorize('owner', 'admin'), upload.array('images', 10), turfController.updateTurf);
router.delete('/:id', protect, authorize('owner', 'admin'), turfController.deleteTurf);

module.exports = router;

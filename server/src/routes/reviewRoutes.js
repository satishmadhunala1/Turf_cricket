const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { reviewValidator } = require('../validators/bookingValidator');

router.post('/:turfId', protect, reviewValidator, validate, reviewController.createReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;

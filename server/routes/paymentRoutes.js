const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { turfId, userId, bookingDate, startTime, endTime } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Turf Booking',
              description: `Date: ${bookingDate}`,
            },
            unit_amount: 30000, // ₹300
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `https://turf-cricket-frontend.onrender.com/payment-success?turfId=${turfId}&userId=${userId}&date=${bookingDate}&start=${startTime}&end=${endTime}`,
      cancel_url: `https://turf-cricket-frontend.onrender.com/payment-cancel`,
    });

    // ✅ Always send back JSON
    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('❌ Stripe session creation failed:', error);
    return res.status(500).json({ error: 'Stripe session creation failed' });
  }
});

module.exports = router;

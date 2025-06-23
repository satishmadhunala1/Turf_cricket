const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Store in .env

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
              name: 'Turf Advance Booking',
              description: `Turf ID: ${turfId}, Date: ${bookingDate}`,
            },
            unit_amount: 30000, // ₹300 in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/payment-success?turfId=${turfId}&userId=${userId}&date=${bookingDate}&start=${startTime}&end=${endTime}`,
      cancel_url: 'http://localhost:5173/payment-cancel',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: 'Stripe session creation failed' });
  }
});

module.exports = router;

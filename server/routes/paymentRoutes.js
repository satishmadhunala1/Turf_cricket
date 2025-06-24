const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Keep secret key in .env

router.post('/create-checkout-session', async (req, res) => {
  const { turfId, userId, bookingDate, startTime, endTime } = req.body;

  console.log('📥 Incoming Stripe payment request:');
  console.log('➡️ turfId:', turfId);
  console.log('➡️ userId:', userId);
  console.log('➡️ bookingDate:', bookingDate);
  console.log('➡️ startTime:', startTime);
  console.log('➡️ endTime:', endTime);

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
      success_url: `https://turf-cricket-frontend.onrender.com/payment-success?turfId=${turfId}&userId=${userId}&date=${bookingDate}&start=${startTime}&end=${endTime}`,
      cancel_url: `https://turf-cricket-frontend.onrender.com/payment-cancel`,
    });

    console.log('✅ Stripe session created successfully:');
    console.log('🔗 Checkout URL:', session.url);

    // Always return a proper JSON response
    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('❌ Stripe error:', err.message || err);

    return res.status(500).json({
      error: err.message || 'Stripe session creation failed',
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware to set CORS headers
const setCorsHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://turf-cricket-frontend.onrender.com');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};

// Checkout Session Route
router.post('/create-checkout-session', setCorsHeaders, async (req, res) => {
  const { turfId, userId, bookingDate, startTime, endTime } = req.body;

  // Input validation
  if (!turfId || !userId || !bookingDate || !startTime || !endTime) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: 'Turf Booking Advance',
            description: `Booking on ${new Date(bookingDate).toLocaleDateString()} (${startTime}-${endTime})`
          },
          unit_amount: 30000, // ₹300 in paise
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: { turfId, userId, bookingDate, startTime, endTime },
      success_url: `${process.env.FRONTEND_URL.trim()}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL.trim()}/payment-cancel`,

    });

    return res.status(200).json({ url: session.url });

  } catch (error) {
    console.error('Stripe error:', error);
    return res.status(500).json({ 
      error: 'Payment processing failed',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
});

// Stripe Webhook Route
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed:`, err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      // ✅ Update your database here (example using Mongoose)
      // const booking = await Booking.findOneAndUpdate(
      //   { stripeSessionId: session.id },
      //   { status: 'paid', paymentDetails: session },
      //   { new: true }
      // );
      console.log(`💰 Payment successful for booking:`, session.metadata);
    } catch (dbError) {
      console.error('Database update failed:', dbError);
      // Implement retry logic here if needed
    }
  }

  res.status(200).json({ received: true });
});

// CORS Preflight Route
router.options('*', setCorsHeaders, (req, res) => res.status(200).end());

module.exports = router;
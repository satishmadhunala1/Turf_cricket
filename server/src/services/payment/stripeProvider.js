const Stripe = require('stripe');
const PaymentProvider = require('./PaymentProvider');
const { payment: config } = require('../../config/env');

class StripeProvider extends PaymentProvider {
  constructor() {
    super();
    this.stripe = config.stripeSecretKey ? new Stripe(config.stripeSecretKey) : null;
  }

  async createPaymentIntent({ amount, currency = 'inr', metadata, successUrl, cancelUrl }) {
    if (!this.stripe) throw new Error('Stripe is not configured');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: metadata?.description || 'Turf Booking' },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    });

    return { sessionId: session.id, url: session.url, provider: 'stripe' };
  }

  async verifyPayment(sessionId) {
    if (!this.stripe) throw new Error('Stripe is not configured');
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      paid: session.payment_status === 'paid',
      transactionId: session.payment_intent,
      amount: session.amount_total / 100,
    };
  }
}

module.exports = StripeProvider;

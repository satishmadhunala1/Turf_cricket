const PaymentProvider = require('./PaymentProvider');

class RazorpayProvider extends PaymentProvider {
  constructor() {
    super();
    // Ready for integration — install razorpay SDK when keys are provided
    this.configured = !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  }

  async createPaymentIntent({ amount, currency = 'INR', metadata }) {
    if (!this.configured) throw new Error('Razorpay is not configured');
    // Placeholder — implement with razorpay SDK
    return {
      provider: 'razorpay',
      orderId: `order_${Date.now()}`,
      amount,
      currency,
      metadata,
      message: 'Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable',
    };
  }
}

module.exports = RazorpayProvider;

const PaymentProvider = require('./PaymentProvider');

class CashProvider extends PaymentProvider {
  async createPaymentIntent({ amount, metadata }) {
    return {
      provider: 'cash',
      status: 'pending',
      amount,
      metadata,
      message: 'Pay at venue — booking pending confirmation',
    };
  }

  async verifyPayment() {
    return { paid: true, transactionId: `cash_${Date.now()}` };
  }
}

module.exports = CashProvider;

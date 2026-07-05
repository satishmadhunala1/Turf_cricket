class PaymentProvider {
  async createPaymentIntent({ amount, currency, metadata }) {
    throw new Error('createPaymentIntent not implemented');
  }

  async verifyPayment(payload) {
    throw new Error('verifyPayment not implemented');
  }

  async refund(transactionId, amount) {
    throw new Error('refund not implemented');
  }
}

module.exports = PaymentProvider;

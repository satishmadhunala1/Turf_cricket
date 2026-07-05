const StripeProvider = require('./stripeProvider');
const RazorpayProvider = require('./razorpayProvider');
const CashProvider = require('./cashProvider');
const { payment: config } = require('../../config/env');

const providers = {
  stripe: new StripeProvider(),
  razorpay: new RazorpayProvider(),
  cash: new CashProvider(),
};

const getProvider = (method) => {
  const provider = providers[method || config.provider];
  if (!provider) throw new Error(`Payment provider "${method}" not supported`);
  return provider;
};

module.exports = { getProvider, providers };

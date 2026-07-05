require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production', override: true });
}

const required = ['MONGODB_URI', 'JWT_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  Missing env: ${key}`);
  }
});

const parseAllowedOrigins = () => {
  const origins = new Set([
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'https://turf-cricket-frontend.vercel.app',
  ]);

  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach((o) => {
      const trimmed = o.trim();
      if (trimmed) origins.add(trimmed);
    });
  }

  return [...origins].filter(Boolean);
};

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  allowedOrigins: parseAllowedOrigins(),
  mongoUri: process.env.MONGODB_URI,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM || 'TurfBook <noreply@turfbook.com>',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  payment: {
    provider: process.env.PAYMENT_PROVIDER || 'stripe',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  mapApiKey: process.env.MAP_API_KEY,
};

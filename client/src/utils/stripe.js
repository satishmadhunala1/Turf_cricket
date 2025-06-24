// src/utils/stripe.js
import { BASE_URL } from '.././constants'; // Make sure this path is correct

export const handleStripePayment = async (bookingDetails) => {
  try {
    const response = await fetch(`${BASE_URL}/api/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingDetails),
    });

    // ✅ Safe JSON handling
    let data;
    try {
      data = await response.json();
    } catch (e) {
      const text = await response.text();
      throw new Error(`Invalid JSON: ${text}`);
    }

    if (!response.ok) {
      throw new Error(data?.error || 'Stripe session creation failed');
    }

    if (data?.url) {
      window.location.href = data.url;
    } else {
      throw new Error('Stripe session URL not received.');
    }

  } catch (err) {
    console.error('❌ Stripe checkout error:', err.message);
    alert('Payment failed: ' + err.message);
  }
};

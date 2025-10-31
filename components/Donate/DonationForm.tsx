'use client';

import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const DonationForm = () => {
  const [amount, setAmount] = useState(25);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.log('[error]', error);
      } else {
        const response = await fetch('/api/donate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount, paymentMethodId: paymentMethod.id }),
        });

        const { clientSecret, error: backendError } = await response.json();

        if (backendError) {
          console.log('[backend error]', backendError);
          return;
        }

        const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

        if (confirmError) {
          console.log('[confirm error]', confirmError);
        } else {
          console.log('Payment successful!');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 p-8 border rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-6">Make a Donation</h3>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[25, 50, 100, 250, 500, 1000].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setAmount(value)}
            className={`p-4 border rounded-lg text-center font-semibold ${
              amount === value ? 'bg-primary text-white' : 'bg-gray-100'
            }`}
          >
            ${value}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Custom Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 border rounded-lg"
        />
      </div>
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">Payment Details</label>
        <CardElement className="p-4 border rounded-lg" />
      </div>
      <button
        type="submit"
        disabled={!stripe}
        className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition-colors"
      >
        Donate ${amount}
      </button>
    </form>
  );
};

export default DonationForm;

'use client';

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder');

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#424770',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#9e2146',
      iconColor: '#9e2146'
    }
  }
};

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          // Store payment intent ID for later use
          (window as any).paymentIntentId = data.paymentIntentId;
        } else {
          onError(data.error || 'Failed to initialize payment');
        }
      })
      .catch((err) => onError('Network error occurred'));
  }, [amount, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError('Card element not found');
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    });

    if (error) {
      onError(error.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Save donation to Firebase
      try {
        await fetch('/api/process-donation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            amount: amount,
            donorInfo: {
              email: 'donor@example.com', // This should come from a form
              firstName: 'Anonymous',
              lastName: 'Donor'
            }
          }),
        });
      } catch (err) {
        console.error('Error saving donation:', err);
      }
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-300 rounded-lg bg-white">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>
      
      <button
        type="submit"
        disabled={!stripe || isLoading || !clientSecret}
        className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
      >
        {isLoading ? 'Processing...' : `Donate $${amount}`}
      </button>
    </form>
  );
};

const DonationForm: React.FC = () => {
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const predefinedAmounts = [25, 50, 100, 250, 500];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
    }
    setError('');
  };

  const handleSuccess = () => {
    setShowSuccess(true);
    setError('');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setShowSuccess(false);
  };

  const resetForm = () => {
    setShowSuccess(false);
    setError('');
    setSelectedAmount(25);
    setCustomAmount('');
  };

  if (showSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
          <p className="text-gray-600">
            Your donation of ${selectedAmount} has been successfully processed. 
            Your support helps Leadership C.O.N.N.E.C.T.I.O.N.S. continue empowering youth to become tomorrow's leaders.
          </p>
        </div>
        <button
          onClick={resetForm}
          className="bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition duration-300"
        >
          Make Another Donation
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Support Our Mission</h3>
        <p className="text-gray-600">
          Your donation helps us continue empowering youth through leadership development, 
          mentorship programs, and educational opportunities.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Select Donation Amount
        </label>
        
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          {predefinedAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => handleAmountSelect(amount)}
              className={`py-3 px-4 rounded-lg border-2 font-semibold transition duration-300 ${
                selectedAmount === amount && !customAmount
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={handleCustomAmountChange}
            min="1"
            step="0.01"
            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {selectedAmount > 0 && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            amount={selectedAmount}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </Elements>
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p className="mt-1">Leadership C.O.N.N.E.C.T.I.O.N.S. is a 501(c)(3) nonprofit organization</p>
      </div>
    </div>
  );
};

export default DonationForm;

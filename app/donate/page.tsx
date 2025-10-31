'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import DonationForm from '@/components/Donate/DonationForm';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const DonatePage = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <h1 className="text-3xl font-bold text-center">Support Our Mission</h1>
        <p className="text-center mt-4">Your contribution helps us empower the next generation of leaders.</p>
        <Elements stripe={stripePromise}>
          <DonationForm />
        </Elements>
      </div>
    </section>
  );
};

export default DonatePage;

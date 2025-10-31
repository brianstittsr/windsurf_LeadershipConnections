'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import ContactInfo from './ContactInfo';
import ProgramInterests from './ProgramInterests';
import ProgressBar from './ProgressBar';

const Wizard = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleChange = (input: any) => (e: any) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [input]: value });
  };

  const handleSubmit = async () => {
    try {
      const { email, password, ...rest } = formData as any;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        ...rest,
        email,
      });

      await fetch('/api/auth/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      nextStep();
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const totalSteps = 2;

  return (
    <div className="w-full">
      <ProgressBar step={step} totalSteps={totalSteps} />
      {
        {
          1: <ContactInfo handleChange={handleChange} values={formData} />,
          2: <ProgramInterests handleChange={handleChange} values={formData} />,
        }[step]
      }
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button onClick={prevStep} className="rounded-md bg-gray-300 px-8 py-3 text-base font-semibold text-gray-700 duration-300 ease-in-out hover:bg-gray-400">
            Back
          </button>
        )}
        {step < totalSteps && (
          <button onClick={nextStep} className="rounded-md bg-primary px-8 py-3 text-base font-semibold text-white duration-300 ease-in-out hover:bg-opacity-90 ml-auto">
            Next
          </button>
        )}
        {step === totalSteps && (
          <button onClick={handleSubmit} className="rounded-md bg-primary px-8 py-3 text-base font-semibold text-white duration-300 ease-in-out hover:bg-opacity-90 ml-auto">
            Sign Up
          </button>
        )}
      </div>
      {step > totalSteps && (
        <div className="text-center bg-white dark:bg-dark p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Thank you for signing up!</h2>
          <p className="text-body-color dark:text-white">A welcome email has been sent to your address.</p>
        </div>
      )}
    </div>
  );
};

export default Wizard;

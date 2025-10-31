'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import ContactInfo from './ContactInfo';
import ProgramInterests from './ProgramInterests';

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

  switch (step) {
    case 1:
      return <ContactInfo nextStep={nextStep} handleChange={handleChange} values={formData} />;
    case 2:
      return <ProgramInterests nextStep={handleSubmit} prevStep={prevStep} handleChange={handleChange} values={formData} />;
    default:
      return <div>Thank you for signing up!</div>;
  }
};

export default Wizard;

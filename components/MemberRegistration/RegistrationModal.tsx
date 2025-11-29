'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { MemberProfile } from '@/types/member-profile.types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Account Info
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Personal Info
    firstName: '',
    lastName: '',
    phone: '',
    
    // Program Info
    graduatingClass: '',
    programYear: '',
    
    // Location
    city: '',
    state: '',
    zipCode: '',
    
    // Professional
    currentEmployer: '',
    jobTitle: '',
    
    // Preferences
    includeInDirectory: false,
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const usernamesRef = collection(db, 'usernames');
      const q = query(usernamesRef, where('username', '==', username.toLowerCase()));
      const snapshot = await getDocs(q);
      return snapshot.empty;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const validateStep = async (step: number): Promise<boolean> => {
    setError('');
    
    switch (step) {
      case 1:
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all account fields');
          return false;
        }
        if (formData.username.length < 3) {
          setError('Username must be at least 3 characters');
          return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
          setError('Username can only contain letters, numbers, and underscores');
          return false;
        }
        const isAvailable = await checkUsernameAvailability(formData.username);
        if (!isAvailable) {
          setError('Username is already taken. Please choose another.');
          return false;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        return true;
        
      case 2:
        if (!formData.firstName || !formData.lastName || !formData.phone) {
          setError('Please fill in all personal information');
          return false;
        }
        return true;
        
      case 3:
        if (!formData.graduatingClass) {
          setError('Please select your graduating class');
          return false;
        }
        return true;
        
      case 4:
        if (!formData.agreeToTerms) {
          setError('You must agree to the terms to continue');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const nextStep = async () => {
    if (await validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const sendWelcomeEmail = async (email: string, firstName: string) => {
    try {
      const response = await fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          subject: 'Welcome Back to Leadership C.O.N.N.E.C.T.I.O.N.S.!',
        }),
      });

      if (!response.ok) {
        console.error('Failed to send welcome email');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!(await validateStep(4))) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Update user display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Save username mapping
      await setDoc(doc(db, 'usernames', formData.username.toLowerCase()), {
        userId: user.uid,
        username: formData.username,
        createdAt: Timestamp.now(),
      });

      // Save user role
      await setDoc(doc(db, 'userRoles', user.uid), {
        role: 'User',
        email: formData.email,
        createdAt: Timestamp.now(),
      });

      // Create member profile in Firestore
      const memberProfile: any = {
        userId: user.uid,
        username: formData.username,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        currentEmployer: formData.currentEmployer,
        jobTitle: formData.jobTitle,
        programs: [formData.graduatingClass],
        includeInDirectory: formData.includeInDirectory,
        membershipStatus: 'alumni',
        profileComplete: false,
        createdAt: Timestamp.now().toDate(),
        updatedAt: Timestamp.now().toDate(),
        lastActive: Timestamp.now().toDate(),
      };

      // Save to Firestore
      await setDoc(doc(db, 'memberProfiles', user.uid), memberProfile);

      // Send welcome email
      await sendWelcomeEmail(formData.email, formData.firstName);

      setSuccess(true);
      
      // Redirect to profile completion after 3 seconds
      setTimeout(() => {
        window.location.href = '/admin/lc-profile';
      }, 3000);

    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h3>
            <p className="text-gray-600">
              Your account has been created successfully. We've sent a welcome email to <strong>{formData.email}</strong>.
            </p>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Redirecting you to complete your profile...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-2">Join Our Alumni Network</h2>
          <p className="text-white/90">Step {currentStep} of 4</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div
            className="bg-primary h-2 transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Account Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Account</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  placeholder="Choose a unique username"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Letters, numbers, and underscores only. Min 3 characters.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  placeholder="At least 8 characters"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/signin" className="text-primary hover:underline font-semibold">
                    Sign in here
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  placeholder="(555) 123-4567"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                    placeholder="NC"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Program Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Program Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Graduating Class <span className="text-red-500">*</span>
                </label>
                <select
                  name="graduatingClass"
                  value={formData.graduatingClass}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Select your class</option>
                  <option value="Leadership Connections 2024">Leadership Connections 2024</option>
                  <option value="Leadership Connections 2023">Leadership Connections 2023</option>
                  <option value="Leadership Connections 2022">Leadership Connections 2022</option>
                  <option value="Leadership Connections 2021">Leadership Connections 2021</option>
                  <option value="Leadership Connections 2020">Leadership Connections 2020</option>
                  <option value="Leadership Connections 2019">Leadership Connections 2019</option>
                  <option value="Leadership Connections 2018">Leadership Connections 2018</option>
                  <option value="Leadership Connections 2017">Leadership Connections 2017</option>
                  <option value="Leadership Connections 2016">Leadership Connections 2016</option>
                  <option value="Leadership Connections 2015">Leadership Connections 2015</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Employer
                </label>
                <input
                  type="text"
                  name="currentEmployer"
                  value={formData.currentEmployer}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  placeholder="Company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:border-primary focus:outline-none"
                  placeholder="Your current position"
                />
              </div>
            </div>
          )}

          {/* Step 4: Preferences & Confirmation */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Final Steps</h3>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Review Your Information</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Class:</strong> {formData.graduatingClass}</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="includeInDirectory"
                    checked={formData.includeInDirectory}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    Include my profile in the member directory so other alumni can connect with me
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary mt-0.5"
                    required
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    I agree to the terms and conditions and privacy policy <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <strong>📧 Welcome Email:</strong> After registration, you'll receive a welcome email with instructions to complete your profile.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { MemberProfileFormData } from '@/types/member-profile.types';
import { uploadProfilePhoto, calculateProfileCompleteness } from '@/lib/memberProfileUtils';
import PersonalInfoSection from '@/components/MemberProfile/PersonalInfoSection';
import ProgramInfoSection from '@/components/MemberProfile/ProgramInfoSection';
import ProfessionalInfoSection from '@/components/MemberProfile/ProfessionalInfoSection';
import NetworkingSection from '@/components/MemberProfile/NetworkingSection';
import CommunitySection from '@/components/MemberProfile/CommunitySection';
import PrivacySection from '@/components/MemberProfile/PrivacySection';
import { FaTimes, FaCheck } from 'react-icons/fa';

interface MemberProfileWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WIZARD_STEPS = [
  { id: 1, title: 'Personal Info', description: 'Basic information about you' },
  { id: 2, title: 'Program Info', description: 'Your LC program participation' },
  { id: 3, title: 'Professional', description: 'Career and expertise' },
  { id: 4, title: 'Networking', description: 'Connection preferences' },
  { id: 5, title: 'Community', description: 'Volunteer and causes' },
  { id: 6, title: 'Privacy', description: 'Profile visibility settings' },
];

export default function MemberProfileWizardModal({ isOpen, onClose }: MemberProfileWizardModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);

  // Account credentials
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [formData, setFormData] = useState<Partial<MemberProfileFormData>>({
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    state: 'NC',
    zipCode: '',
    programs: [],
    membershipStatus: 'active',
    participationType: 'graduate',
    expertise: [],
    skills: [],
    languages: ['English'],
    willingToMentor: false,
    seekingMentorship: false,
    openToNetworking: true,
    availableForSpeaking: false,
    volunteerInterests: [],
    causes: [],
    geographicInterests: [],
    preferredContactMethods: [],
    profileVisibility: 'members-only',
    showEmail: false,
    showPhone: false,
    showEmployer: true,
    allowDirectMessages: true,
    includeInDirectory: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email') {
      setEmail(value);
    }
  };

  const handleArrayAdd = (field: string, value: any) => {
    const currentArray = (formData[field as keyof MemberProfileFormData] as any[]) || [];
    if (!currentArray.some((item: any) => 
      typeof item === 'object' ? JSON.stringify(item) === JSON.stringify(value) : item === value
    )) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, value]
      }));
    }
  };

  const handleArrayRemove = (field: string, index: number) => {
    const currentArray = (formData[field as keyof MemberProfileFormData] as any[]) || [];
    setFormData(prev => ({
      ...prev,
      [field]: currentArray.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
    }
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
        // Validate account credentials
        if (!username || !email || !password || !confirmPassword) {
          setError('Please fill in all account fields');
          return false;
        }
        if (username.length < 3) {
          setError('Username must be at least 3 characters');
          return false;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
          setError('Username can only contain letters, numbers, and underscores');
          return false;
        }
        const isAvailable = await checkUsernameAvailability(username);
        if (!isAvailable) {
          setError('Username is already taken. Please choose another.');
          return false;
        }
        if (password.length < 8) {
          setError('Password must be at least 8 characters');
          return false;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        // Validate personal info
        if (!formData.firstName || !formData.lastName || !formData.city || !formData.state || !formData.zipCode) {
          setError('Please fill in all required personal information fields');
          return false;
        }
        return true;

      case 2:
        if (!formData.programs || formData.programs.length === 0) {
          setError('Please add at least one program');
          return false;
        }
        return true;

      case 3:
      case 4:
      case 5:
        return true;

      case 6:
        // No specific validation needed for privacy settings
        return true;

      default:
        return true;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError('');

    try {
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update display name
      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      });

      // Upload profile photo if provided
      let profilePhotoUrl = '';
      if (profilePhotoFile) {
        profilePhotoUrl = await uploadProfilePhoto(user.uid, profilePhotoFile);
      }

      // Save username mapping
      await setDoc(doc(db, 'usernames', username.toLowerCase()), {
        userId: user.uid,
        username: username,
        createdAt: Timestamp.now(),
      });

      // Save user role
      await setDoc(doc(db, 'userRoles', user.uid), {
        role: 'User',
        email: email,
        createdAt: Timestamp.now(),
      });

      // Calculate profile completeness
      const completeness = calculateProfileCompleteness({
        ...formData,
        profilePhotoUrl,
      } as any);

      // Create member profile
      const memberProfile = {
        userId: user.uid,
        username: username,
        ...formData,
        email: email,
        profilePhotoUrl: profilePhotoUrl || undefined,
        profileCompleteness: completeness,
        verified: false,
        lastActive: Timestamp.now(),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Save to Firestore
      await setDoc(doc(db, 'memberProfiles', user.uid), memberProfile);

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/member-directory';
      }, 2000);

    } catch (error: any) {
      console.error('Error creating profile:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password is too weak. Please use a stronger password.');
      } else {
        setError(error.message || 'Failed to create profile. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <FaCheck className="text-green-600 text-2xl" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to the Network!</h3>
          <p className="text-gray-600 mb-4">
            Your profile has been created successfully. Redirecting you to the member directory...
          </p>
        </div>
      </div>
    );
  }

  const progressPercentage = (currentStep / 6) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Profile Setup</h1>
              <p className="text-gray-600">
                Complete your profile step by step to maximize your networking opportunities
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">Step {currentStep} of 6</span>
              <span className="font-medium text-primary">{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between">
            {WIZARD_STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    currentStep >= step.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id}
                </div>
                <div className="text-center mt-2">
                  <div className="text-xs font-semibold text-gray-700 hidden sm:block">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 hidden md:block">
                    {step.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Personal Info + Account */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Account Creation Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Create Your Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Choose a unique username"
                    />
                    <p className="text-xs text-gray-500 mt-1">Letters, numbers, and underscores only. Min 3 characters.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        handleInputChange('email', e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Min. 8 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Info Section */}
              <PersonalInfoSection
                formData={formData}
                editMode={true}
                onInputChange={handleInputChange}
                onPhotoUpload={handlePhotoUpload}
                uploadingPhoto={uploadingPhoto}
              />
            </div>
          )}

          {currentStep === 2 && (
            <ProgramInfoSection
              formData={formData}
              editMode={true}
              onInputChange={handleInputChange}
              onArrayAdd={handleArrayAdd}
              onArrayRemove={handleArrayRemove}
            />
          )}

          {currentStep === 3 && (
            <ProfessionalInfoSection
              formData={formData}
              editMode={true}
              onInputChange={handleInputChange}
              onArrayAdd={handleArrayAdd}
              onArrayRemove={handleArrayRemove}
            />
          )}

          {currentStep === 4 && (
            <NetworkingSection
              formData={formData}
              editMode={true}
              onInputChange={handleInputChange}
              onArrayAdd={handleArrayAdd}
              onArrayRemove={handleArrayRemove}
            />
          )}

          {currentStep === 5 && (
            <CommunitySection
              formData={formData}
              editMode={true}
              onInputChange={handleInputChange}
              onArrayAdd={handleArrayAdd}
              onArrayRemove={handleArrayRemove}
            />
          )}

          {currentStep === 6 && (
            <PrivacySection
              formData={formData}
              editMode={true}
              onInputChange={handleInputChange}
            />
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Profile...
                  </>
                ) : (
                  'Complete Registration'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

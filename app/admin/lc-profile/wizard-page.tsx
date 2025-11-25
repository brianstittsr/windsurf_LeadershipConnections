'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  MemberProfile,
  MemberProfileFormData,
} from '@/types/member-profile.types';
import {
  getMemberProfile,
  saveMemberProfile,
  uploadProfilePhoto,
  calculateProfileCompleteness
} from '@/lib/memberProfileUtils';
import PersonalInfoSection from '@/components/MemberProfile/PersonalInfoSection';
import ProgramInfoSection from '@/components/MemberProfile/ProgramInfoSection';
import ProfessionalInfoSection from '@/components/MemberProfile/ProfessionalInfoSection';
import NetworkingSection from '@/components/MemberProfile/NetworkingSection';
import CommunitySection from '@/components/MemberProfile/CommunitySection';
import PrivacySection from '@/components/MemberProfile/PrivacySection';
import { FaCheck, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

const WIZARD_STEPS = [
  { id: 1, title: 'Personal Info', description: 'Basic information about you' },
  { id: 2, title: 'Program Info', description: 'Your LC program participation' },
  { id: 3, title: 'Professional', description: 'Career and expertise' },
  { id: 4, title: 'Networking', description: 'Connection preferences' },
  { id: 5, title: 'Community', description: 'Volunteer and causes' },
  { id: 6, title: 'Privacy', description: 'Profile visibility settings' },
];

export default function MemberProfileWizard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  
  const [profile, setProfile] = useState<MemberProfile | null>(null);
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
    preferredContactMethods: ['Email'],
    profileVisibility: 'members-only',
    showEmail: true,
    showPhone: false,
    showEmployer: true,
    allowDirectMessages: true,
    includeInDirectory: true,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    } else if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const existingProfile = await getMemberProfile(user.uid);
      
      if (existingProfile) {
        setProfile(existingProfile);
        setFormData(existingProfile);
      } else {
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayAdd = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[] || []), value]
    }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingPhoto(true);
    try {
      const photoUrl = await uploadProfilePhoto(user.uid, file);
      handleInputChange('profilePhotoUrl', photoUrl);
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email);
      case 2:
        return !!(formData.programs && formData.programs.length > 0);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      alert('Please fill in all required fields before continuing.');
      return;
    }
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert('Please fill in all required fields (First Name, Last Name, Email)');
      return;
    }

    if (!formData.programs || formData.programs.length === 0) {
      alert('Please add at least one leadership program');
      return;
    }

    setSaving(true);
    try {
      await saveMemberProfile(user.uid, formData as MemberProfileFormData);
      await loadProfile();
      alert('Profile saved successfully!');
      router.push('/admin/lc-profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const completeness = calculateProfileCompleteness(formData);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Member Profile Setup</h1>
        <p className="text-gray-600">
          Complete your profile step by step to maximize your networking opportunities
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-semibold text-gray-700">
            Step {currentStep} of {WIZARD_STEPS.length}
          </span>
          <span className="text-sm font-bold text-primary">{completeness}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
          <div
            className="bg-primary h-3 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / WIZARD_STEPS.length) * 100}%` }}
          ></div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between">
          {WIZARD_STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? <FaCheck /> : step.id}
              </div>
              <div className="text-center hidden md:block">
                <p className={`text-xs font-semibold ${
                  currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
              </div>
              {index < WIZARD_STEPS.length - 1 && (
                <div className={`hidden md:block absolute h-0.5 w-full top-5 left-1/2 -z-10 ${
                  currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                }`} style={{ width: `calc(100% / ${WIZARD_STEPS.length})` }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {WIZARD_STEPS[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">
            {WIZARD_STEPS[currentStep - 1].description}
          </p>
        </div>

        {currentStep === 1 && (
          <PersonalInfoSection
            formData={formData}
            editMode={true}
            onInputChange={handleInputChange}
            onPhotoUpload={handlePhotoUpload}
            uploadingPhoto={uploadingPhoto}
          />
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

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaChevronLeft />
          Previous
        </button>

        <div className="text-sm text-gray-500">
          Step {currentStep} of {WIZARD_STEPS.length}
        </div>

        {currentStep < WIZARD_STEPS.length ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Next
            <FaChevronRight />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Complete Profile'}
            <FaCheck />
          </button>
        )}
      </div>

      {/* Skip to End Option */}
      <div className="mt-6 text-center">
        <button
          onClick={() => router.push('/admin/lc-profile')}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Save and finish later
        </button>
      </div>
    </div>
  );
}

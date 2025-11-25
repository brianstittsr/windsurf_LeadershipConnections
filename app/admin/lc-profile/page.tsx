'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  MemberProfile,
  MemberProfileFormData,
  LEADERSHIP_PROGRAMS,
  INDUSTRIES,
  EXPERTISE_AREAS,
  NC_REGIONS,
  CONTACT_METHODS,
  CAUSES,
  LeadershipProgram,
  BoardMembership
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

export default function MemberProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
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
        // Initialize with user email
        setFormData(prev => ({
          ...prev,
          email: user.email || '',
        }));
        setEditMode(true); // Start in edit mode for new profiles
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      alert('Error loading profile. Please try again.');
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

  const handleSave = async () => {
    if (!user) return;

    // Validation
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
      setEditMode(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
      setEditMode(false);
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
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Member Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage your Leadership Connections profile and networking preferences
            </p>
          </div>
          <div className="flex gap-2">
            {!editMode ? (
              <>
                <button
                  onClick={() => router.push('/admin/lc-profile/wizard-page')}
                  className="bg-white border border-primary text-primary px-6 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                >
                  Setup Wizard
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">
              Profile Completeness
            </span>
            <span className="text-sm font-bold text-primary">{completeness}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Complete your profile to increase visibility and networking opportunities
          </p>
          {completeness < 50 && !editMode && (
            <button
              onClick={() => router.push('/admin/lc-profile/wizard-page')}
              className="mt-3 text-xs font-semibold text-primary hover:text-primary/80 underline"
            >
              Use the Setup Wizard to complete your profile step-by-step →
            </button>
          )}
        </div>
      </div>

      {/* Profile Form - All Sections */}
      <div className="space-y-6">
        <PersonalInfoSection
          formData={formData}
          editMode={editMode}
          onInputChange={handleInputChange}
          onPhotoUpload={handlePhotoUpload}
          uploadingPhoto={uploadingPhoto}
        />

        <ProgramInfoSection
          formData={formData}
          editMode={editMode}
          onInputChange={handleInputChange}
          onArrayAdd={handleArrayAdd}
          onArrayRemove={handleArrayRemove}
        />

        <ProfessionalInfoSection
          formData={formData}
          editMode={editMode}
          onInputChange={handleInputChange}
          onArrayAdd={handleArrayAdd}
          onArrayRemove={handleArrayRemove}
        />

        <NetworkingSection
          formData={formData}
          editMode={editMode}
          onInputChange={handleInputChange}
          onArrayAdd={handleArrayAdd}
          onArrayRemove={handleArrayRemove}
        />

        <CommunitySection
          formData={formData}
          editMode={editMode}
          onInputChange={handleInputChange}
          onArrayAdd={handleArrayAdd}
          onArrayRemove={handleArrayRemove}
        />

        <PrivacySection
          formData={formData}
          editMode={editMode}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
}

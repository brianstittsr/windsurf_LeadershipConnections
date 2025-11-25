'use client';

import { MemberProfileFormData } from '@/types/member-profile.types';

interface PersonalInfoSectionProps {
  formData: Partial<MemberProfileFormData>;
  editMode: boolean;
  onInputChange: (field: string, value: any) => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingPhoto: boolean;
}

export default function PersonalInfoSection({
  formData,
  editMode,
  onInputChange,
  onPhotoUpload,
  uploadingPhoto
}: PersonalInfoSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h2>
      
      {/* Profile Photo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo
        </label>
        <div className="flex items-center gap-4">
          {formData.profilePhotoUrl ? (
            <img
              src={formData.profilePhotoUrl}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {formData.firstName?.[0]}{formData.lastName?.[0]}
              </span>
            </div>
          )}
          {editMode && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoUpload}
                disabled={uploadingPhoto}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 inline-block disabled:opacity-50"
              >
                {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => onInputChange('firstName', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Middle Name
          </label>
          <input
            type="text"
            value={formData.middleName || ''}
            onChange={(e) => onInputChange('middleName', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => onInputChange('lastName', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Name
          </label>
          <input
            type="text"
            value={formData.preferredName || ''}
            onChange={(e) => onInputChange('preferredName', e.target.value)}
            disabled={!editMode}
            placeholder="How you'd like to be called"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => onInputChange('email', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => onInputChange('phone', e.target.value)}
            disabled={!editMode}
            placeholder="(555) 123-4567"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => onInputChange('city', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.state || 'NC'}
            onChange={(e) => onInputChange('state', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.zipCode || ''}
            onChange={(e) => onInputChange('zipCode', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            value={formData.linkedInUrl || ''}
            onChange={(e) => onInputChange('linkedInUrl', e.target.value)}
            disabled={!editMode}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personal Website
          </label>
          <input
            type="url"
            value={formData.websiteUrl || ''}
            onChange={(e) => onInputChange('websiteUrl', e.target.value)}
            disabled={!editMode}
            placeholder="https://yourwebsite.com"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio / About Me
        </label>
        <textarea
          value={formData.bio || ''}
          onChange={(e) => onInputChange('bio', e.target.value)}
          disabled={!editMode}
          maxLength={500}
          rows={4}
          placeholder="Tell us about yourself, your leadership journey, and what you're passionate about..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.bio?.length || 0} / 500 characters
        </p>
      </div>
    </div>
  );
}

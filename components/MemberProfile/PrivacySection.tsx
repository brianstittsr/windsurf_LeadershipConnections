'use client';

import { MemberProfileFormData } from '@/types/member-profile.types';

interface PrivacySectionProps {
  formData: Partial<MemberProfileFormData>;
  editMode: boolean;
  onInputChange: (field: string, value: any) => void;
}

export default function PrivacySection({
  formData,
  editMode,
  onInputChange
}: PrivacySectionProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Settings</h2>
      <p className="text-sm text-gray-600 mb-6">
        Control who can see your information and how you can be contacted
      </p>
      
      {/* Profile Visibility */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Visibility
        </label>
        <select
          value={formData.profileVisibility || 'members-only'}
          onChange={(e) => onInputChange('profileVisibility', e.target.value)}
          disabled={!editMode}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
        >
          <option value="public">Public - Anyone can view my profile</option>
          <option value="members-only">Members Only - Only Leadership Connections members can view</option>
          <option value="private">Private - Only visible to me</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {formData.profileVisibility === 'public' && 'Your profile will be visible to anyone, including search engines'}
          {formData.profileVisibility === 'members-only' && 'Only verified Leadership Connections members can view your profile'}
          {formData.profileVisibility === 'private' && 'Your profile is hidden from all other users'}
        </p>
      </div>

      {/* Contact Information Privacy */}
      <div className="space-y-4">
        <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.showEmail || false}
            onChange={(e) => onInputChange('showEmail', e.target.checked)}
            disabled={!editMode}
            className="rounded mt-1"
          />
          <div>
            <p className="font-medium text-gray-900">Show Email Address</p>
            <p className="text-xs text-gray-600">Allow other members to see your email address</p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.showPhone || false}
            onChange={(e) => onInputChange('showPhone', e.target.checked)}
            disabled={!editMode}
            className="rounded mt-1"
          />
          <div>
            <p className="font-medium text-gray-900">Show Phone Number</p>
            <p className="text-xs text-gray-600">Allow other members to see your phone number</p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.showEmployer || false}
            onChange={(e) => onInputChange('showEmployer', e.target.checked)}
            disabled={!editMode}
            className="rounded mt-1"
          />
          <div>
            <p className="font-medium text-gray-900">Show Current Employer</p>
            <p className="text-xs text-gray-600">Display your current organization and job title</p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.allowDirectMessages || false}
            onChange={(e) => onInputChange('allowDirectMessages', e.target.checked)}
            disabled={!editMode}
            className="rounded mt-1"
          />
          <div>
            <p className="font-medium text-gray-900">Allow Direct Messages</p>
            <p className="text-xs text-gray-600">Let other members send you direct messages through the platform</p>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
          <input
            type="checkbox"
            checked={formData.includeInDirectory || false}
            onChange={(e) => onInputChange('includeInDirectory', e.target.checked)}
            disabled={!editMode}
            className="rounded mt-1"
          />
          <div>
            <p className="font-medium text-gray-900">Include in Member Directory</p>
            <p className="text-xs text-gray-600">Make your profile searchable in the member directory</p>
          </div>
        </label>
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900 font-medium mb-2">🔒 Your Privacy Matters</p>
        <p className="text-xs text-blue-800">
          We respect your privacy and will never share your information with third parties without your consent. 
          You can update these settings at any time. For more information, please review our Privacy Policy.
        </p>
      </div>
    </div>
  );
}

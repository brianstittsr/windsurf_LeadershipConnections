'use client';

import { useState } from 'react';
import { MemberProfileFormData, EXPERTISE_AREAS } from '@/types/member-profile.types';

interface NetworkingSectionProps {
  formData: Partial<MemberProfileFormData>;
  editMode: boolean;
  onInputChange: (field: string, value: any) => void;
  onArrayAdd: (field: string, value: any) => void;
  onArrayRemove: (field: string, index: number) => void;
}

export default function NetworkingSection({
  formData,
  editMode,
  onInputChange,
  onArrayAdd,
  onArrayRemove
}: NetworkingSectionProps) {
  const [newLanguage, setNewLanguage] = useState('');
  const [newVolunteerInterest, setNewVolunteerInterest] = useState('');

  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
    if (currentArray.includes(item)) {
      const index = currentArray.indexOf(item);
      onArrayRemove(field, index);
    } else {
      onArrayAdd(field, item);
    }
  };

  const handleAddLanguage = () => {
    if (newLanguage.trim()) {
      onArrayAdd('languages', newLanguage.trim());
      setNewLanguage('');
    }
  };

  const handleAddVolunteerInterest = () => {
    if (newVolunteerInterest.trim()) {
      onArrayAdd('volunteerInterests', newVolunteerInterest.trim());
      setNewVolunteerInterest('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Networking & Expertise</h2>
      
      {/* Areas of Expertise */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Areas of Expertise
        </label>
        <p className="text-xs text-gray-500 mb-3">Select all that apply to showcase your knowledge and skills</p>
        
        {editMode ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {EXPERTISE_AREAS.map(area => (
              <label
                key={area}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  formData.expertise?.includes(area)
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.expertise?.includes(area) || false}
                  onChange={() => toggleArrayItem('expertise', area)}
                  className="rounded"
                />
                <span className="text-sm">{area}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.expertise && formData.expertise.length > 0 ? (
              formData.expertise.map((area, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
                >
                  {area}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No expertise areas selected</p>
            )}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages Spoken
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.languages && formData.languages.length > 0 ? (
            formData.languages.map((language, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {language}
                {editMode && (
                  <button
                    onClick={() => onArrayRemove('languages', index)}
                    className="text-green-600 hover:text-green-800 font-bold"
                  >
                    ×
                  </button>
                )}
              </span>
            ))
          ) : (
            !editMode && <p className="text-gray-500 text-sm italic">No languages added</p>
          )}
        </div>
        {editMode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Add a language (e.g., Spanish, French)..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddLanguage();
                }
              }}
            />
            <button
              onClick={handleAddLanguage}
              disabled={!newLanguage.trim()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Networking Preferences */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Networking Preferences
        </label>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.willingToMentor || false}
              onChange={(e) => onInputChange('willingToMentor', e.target.checked)}
              disabled={!editMode}
              className="rounded"
            />
            <div>
              <p className="font-medium text-gray-900">Willing to Mentor</p>
              <p className="text-xs text-gray-600">Share your expertise and guide others in their leadership journey</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.seekingMentorship || false}
              onChange={(e) => onInputChange('seekingMentorship', e.target.checked)}
              disabled={!editMode}
              className="rounded"
            />
            <div>
              <p className="font-medium text-gray-900">Seeking Mentorship</p>
              <p className="text-xs text-gray-600">Looking for guidance and advice from experienced leaders</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.openToNetworking || false}
              onChange={(e) => onInputChange('openToNetworking', e.target.checked)}
              disabled={!editMode}
              className="rounded"
            />
            <div>
              <p className="font-medium text-gray-900">Open to Networking</p>
              <p className="text-xs text-gray-600">Connect with other alumni for professional opportunities</p>
            </div>
          </label>

          <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={formData.availableForSpeaking || false}
              onChange={(e) => onInputChange('availableForSpeaking', e.target.checked)}
              disabled={!editMode}
              className="rounded"
            />
            <div>
              <p className="font-medium text-gray-900">Available for Speaking Engagements</p>
              <p className="text-xs text-gray-600">Interested in speaking at events, panels, or workshops</p>
            </div>
          </label>
        </div>
      </div>

      {/* Volunteer Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Volunteer Interests
        </label>
        <p className="text-xs text-gray-500 mb-3">Areas where you'd like to volunteer or contribute</p>
        {formData.volunteerInterests && formData.volunteerInterests.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 mb-2">
            {formData.volunteerInterests.map((interest, index) => (
              <li key={index} className="text-gray-700 flex items-center justify-between">
                <span>{interest}</span>
                {editMode && (
                  <button
                    onClick={() => onArrayRemove('volunteerInterests', index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !editMode && <p className="text-gray-500 text-sm italic mb-2">No volunteer interests added</p>
        )}
        {editMode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newVolunteerInterest}
              onChange={(e) => setNewVolunteerInterest(e.target.value)}
              placeholder="Add volunteer interest (e.g., Event Planning, Fundraising)..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddVolunteerInterest();
                }
              }}
            />
            <button
              onClick={handleAddVolunteerInterest}
              disabled={!newVolunteerInterest.trim()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

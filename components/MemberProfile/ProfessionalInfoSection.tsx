'use client';

import { useState } from 'react';
import { MemberProfileFormData, INDUSTRIES, BoardMembership } from '@/types/member-profile.types';

interface ProfessionalInfoSectionProps {
  formData: Partial<MemberProfileFormData>;
  editMode: boolean;
  onInputChange: (field: string, value: any) => void;
  onArrayAdd: (field: string, value: any) => void;
  onArrayRemove: (field: string, index: number) => void;
}

export default function ProfessionalInfoSection({
  formData,
  editMode,
  onInputChange,
  onArrayAdd,
  onArrayRemove
}: ProfessionalInfoSectionProps) {
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newAward, setNewAward] = useState('');
  const [newBoardMembership, setNewBoardMembership] = useState<Partial<BoardMembership>>({
    organization: '',
    role: '',
    current: true,
    startYear: new Date().getFullYear(),
  });

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onArrayAdd('skills', newSkill.trim());
      setNewSkill('');
    }
  };

  const handleAddCertification = () => {
    if (newCertification.trim()) {
      onArrayAdd('certifications', newCertification.trim());
      setNewCertification('');
    }
  };

  const handleAddAward = () => {
    if (newAward.trim()) {
      onArrayAdd('awards', newAward.trim());
      setNewAward('');
    }
  };

  const handleAddBoardMembership = () => {
    if (newBoardMembership.organization && newBoardMembership.role && newBoardMembership.startYear) {
      onArrayAdd('boardMemberships', newBoardMembership);
      setNewBoardMembership({
        organization: '',
        role: '',
        current: true,
        startYear: new Date().getFullYear(),
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Job Title
          </label>
          <input
            type="text"
            value={formData.currentTitle || ''}
            onChange={(e) => onInputChange('currentTitle', e.target.value)}
            disabled={!editMode}
            placeholder="e.g., Executive Director"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Organization/Company
          </label>
          <input
            type="text"
            value={formData.currentOrganization || ''}
            onChange={(e) => onInputChange('currentOrganization', e.target.value)}
            disabled={!editMode}
            placeholder="e.g., ABC Nonprofit"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry/Sector
          </label>
          <select
            value={formData.industry || ''}
            onChange={(e) => onInputChange('industry', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          >
            <option value="">Select industry...</option>
            {INDUSTRIES.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            value={formData.yearsExperience || ''}
            onChange={(e) => onInputChange('yearsExperience', parseInt(e.target.value) || undefined)}
            disabled={!editMode}
            min="0"
            max="60"
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.skills && formData.skills.length > 0 ? (
            formData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                {editMode && (
                  <button
                    onClick={() => onArrayRemove('skills', index)}
                    className="text-blue-600 hover:text-blue-800 font-bold"
                  >
                    ×
                  </button>
                )}
              </span>
            ))
          ) : (
            !editMode && <p className="text-gray-500 text-sm italic">No skills added yet</p>
          )}
        </div>
        {editMode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill (e.g., Project Management)..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
            <button
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Certifications
        </label>
        {formData.certifications && formData.certifications.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 mb-2">
            {formData.certifications.map((cert, index) => (
              <li key={index} className="text-gray-700 flex items-center justify-between">
                <span>{cert}</span>
                {editMode && (
                  <button
                    onClick={() => onArrayRemove('certifications', index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !editMode && <p className="text-gray-500 text-sm italic mb-2">No certifications added yet</p>
        )}
        {editMode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Add certification (e.g., PMP, CPA)..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCertification();
                }
              }}
            />
            <button
              onClick={handleAddCertification}
              disabled={!newCertification.trim()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}
      </div>

      {/* Board Memberships */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Board Memberships
        </label>
        {formData.boardMemberships && formData.boardMemberships.length > 0 ? (
          <div className="space-y-2 mb-4">
            {formData.boardMemberships.map((board, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{board.organization}</p>
                    <p className="text-sm text-gray-600">
                      {board.role} • {board.startYear}
                      {board.endYear ? ` - ${board.endYear}` : ' - Present'}
                      {board.current && <span className="ml-2 text-green-600 font-medium">(Current)</span>}
                    </p>
                  </div>
                  {editMode && (
                    <button
                      onClick={() => onArrayRemove('boardMemberships', index)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !editMode && <p className="text-gray-500 text-sm italic mb-4">No board memberships added yet</p>
        )}
        {editMode && (
          <div className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-700">Add Board Membership</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Organization</label>
                <input
                  type="text"
                  value={newBoardMembership.organization || ''}
                  onChange={(e) => setNewBoardMembership({...newBoardMembership, organization: e.target.value})}
                  placeholder="Organization name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={newBoardMembership.role || ''}
                  onChange={(e) => setNewBoardMembership({...newBoardMembership, role: e.target.value})}
                  placeholder="e.g., Board Chair, Member"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Start Year</label>
                <input
                  type="number"
                  value={newBoardMembership.startYear || ''}
                  onChange={(e) => setNewBoardMembership({...newBoardMembership, startYear: parseInt(e.target.value)})}
                  min="1980"
                  max={new Date().getFullYear()}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">End Year (optional)</label>
                <input
                  type="number"
                  value={newBoardMembership.endYear || ''}
                  onChange={(e) => setNewBoardMembership({...newBoardMembership, endYear: parseInt(e.target.value) || undefined})}
                  min="1980"
                  max={new Date().getFullYear() + 10}
                  placeholder="Leave blank if current"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newBoardMembership.current || false}
                    onChange={(e) => setNewBoardMembership({...newBoardMembership, current: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Current</span>
                </label>
              </div>
            </div>
            <button
              onClick={handleAddBoardMembership}
              disabled={!newBoardMembership.organization || !newBoardMembership.role || !newBoardMembership.startYear}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Board Membership
            </button>
          </div>
        )}
      </div>

      {/* Awards */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Awards and Recognition
        </label>
        {formData.awards && formData.awards.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 mb-2">
            {formData.awards.map((award, index) => (
              <li key={index} className="text-gray-700 flex items-center justify-between">
                <span>{award}</span>
                {editMode && (
                  <button
                    onClick={() => onArrayRemove('awards', index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !editMode && <p className="text-gray-500 text-sm italic mb-2">No awards added yet</p>
        )}
        {editMode && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newAward}
              onChange={(e) => setNewAward(e.target.value)}
              placeholder="Add award or recognition..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAward();
                }
              }}
            />
            <button
              onClick={handleAddAward}
              disabled={!newAward.trim()}
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

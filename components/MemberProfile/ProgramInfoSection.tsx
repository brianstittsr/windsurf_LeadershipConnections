'use client';

import { useState } from 'react';
import { MemberProfileFormData, LEADERSHIP_PROGRAMS, LeadershipProgram } from '@/types/member-profile.types';

interface ProgramInfoSectionProps {
  formData: Partial<MemberProfileFormData>;
  editMode: boolean;
  onInputChange: (field: string, value: any) => void;
  onArrayAdd: (field: string, value: any) => void;
  onArrayRemove: (field: string, index: number) => void;
}

export default function ProgramInfoSection({
  formData,
  editMode,
  onInputChange,
  onArrayAdd,
  onArrayRemove
}: ProgramInfoSectionProps) {
  const [newProgram, setNewProgram] = useState<Partial<LeadershipProgram>>({
    name: '',
    graduationYear: new Date().getFullYear(),
  });

  const handleAddProgram = () => {
    if (newProgram.name && newProgram.graduationYear) {
      onArrayAdd('programs', newProgram);
      setNewProgram({ name: '', graduationYear: new Date().getFullYear() });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Leadership Program Information</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Programs Attended <span className="text-red-500">*</span>
        </label>
        
        {formData.programs && formData.programs.length > 0 && (
          <div className="space-y-2 mb-4">
            {formData.programs.map((program, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">{program.name}</p>
                  <p className="text-sm text-gray-600">
                    Class of {program.graduationYear}
                    {program.cohort && ` • Cohort ${program.cohort}`}
                    {program.location && ` • ${program.location}`}
                  </p>
                </div>
                {editMode && (
                  <button
                    onClick={() => onArrayRemove('programs', index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {editMode && (
          <div className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
            <p className="text-sm font-medium text-gray-700">Add New Program</p>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Program Name</label>
              <select
                value={newProgram.name || ''}
                onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select a program...</option>
                {LEADERSHIP_PROGRAMS.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={newProgram.graduationYear || ''}
                  onChange={(e) => setNewProgram({...newProgram, graduationYear: parseInt(e.target.value)})}
                  min="1980"
                  max={new Date().getFullYear() + 5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Cohort (optional)</label>
                <input
                  type="text"
                  value={newProgram.cohort || ''}
                  onChange={(e) => setNewProgram({...newProgram, cohort: e.target.value})}
                  placeholder="e.g., A, B, 1, 2"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Location (optional)</label>
              <input
                type="text"
                value={newProgram.location || ''}
                onChange={(e) => setNewProgram({...newProgram, location: e.target.value})}
                placeholder="e.g., Raleigh, Charlotte"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <button
              onClick={handleAddProgram}
              disabled={!newProgram.name || !newProgram.graduationYear}
              className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Program
            </button>
          </div>
        )}

        {(!formData.programs || formData.programs.length === 0) && !editMode && (
          <p className="text-gray-500 text-sm italic">No programs added yet</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Membership Status <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.membershipStatus || 'active'}
            onChange={(e) => onInputChange('membershipStatus', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          >
            <option value="active">Active</option>
            <option value="alumni">Alumni</option>
            <option value="lifetime">Lifetime</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Your current membership status</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Participation Type <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.participationType || 'graduate'}
            onChange={(e) => onInputChange('participationType', e.target.value)}
            disabled={!editMode}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
          >
            <option value="graduate">Graduate</option>
            <option value="participant">Participant</option>
            <option value="mentor">Mentor</option>
            <option value="faculty">Faculty</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Your role in the program</p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { MemberProfileFormData, NC_REGIONS, CONTACT_METHODS, CAUSES } from '@/types/member-profile.types';

interface CommunitySectionProps {
  formData: Partial<MemberProfileFormData>;
  editMode: boolean;
  onInputChange: (field: string, value: any) => void;
  onArrayAdd: (field: string, value: any) => void;
  onArrayRemove: (field: string, index: number) => void;
}

export default function CommunitySection({
  formData,
  editMode,
  onInputChange,
  onArrayAdd,
  onArrayRemove
}: CommunitySectionProps) {
  const toggleArrayItem = (field: string, item: string) => {
    const currentArray = (formData[field as keyof typeof formData] as string[]) || [];
    if (currentArray.includes(item)) {
      const index = currentArray.indexOf(item);
      onArrayRemove(field, index);
    } else {
      onArrayAdd(field, item);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Community Engagement</h2>
      
      {/* Community Involvement */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Current Community Involvement
        </label>
        <textarea
          value={formData.communityInvolvement || ''}
          onChange={(e) => onInputChange('communityInvolvement', e.target.value)}
          disabled={!editMode}
          rows={3}
          placeholder="Describe your current community involvement, volunteer work, or civic engagement..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 disabled:bg-gray-100"
        />
      </div>

      {/* Causes Passionate About */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Causes Passionate About
        </label>
        <p className="text-xs text-gray-500 mb-3">Select the causes you care about most</p>
        
        {editMode ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CAUSES.map(cause => (
              <label
                key={cause}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  formData.causes?.includes(cause)
                    ? 'bg-purple-50 border-purple-500 text-purple-700'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.causes?.includes(cause) || false}
                  onChange={() => toggleArrayItem('causes', cause)}
                  className="rounded"
                />
                <span className="text-sm">{cause}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.causes && formData.causes.length > 0 ? (
              formData.causes.map((cause, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {cause}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No causes selected</p>
            )}
          </div>
        )}
      </div>

      {/* Geographic Interests */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Geographic Areas of Interest (NC Regions)
        </label>
        <p className="text-xs text-gray-500 mb-3">Select regions where you're interested in making an impact</p>
        
        {editMode ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {NC_REGIONS.map(region => (
              <label
                key={region}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  formData.geographicInterests?.includes(region)
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.geographicInterests?.includes(region) || false}
                  onChange={() => toggleArrayItem('geographicInterests', region)}
                  className="rounded"
                />
                <span className="text-sm">{region}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.geographicInterests && formData.geographicInterests.length > 0 ? (
              formData.geographicInterests.map((region, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {region}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No regions selected</p>
            )}
          </div>
        )}
      </div>

      {/* Preferred Contact Methods */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Contact Methods
        </label>
        <p className="text-xs text-gray-500 mb-3">How would you like others to reach you?</p>
        
        {editMode ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CONTACT_METHODS.map(method => (
              <label
                key={method}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  formData.preferredContactMethods?.includes(method)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.preferredContactMethods?.includes(method) || false}
                  onChange={() => toggleArrayItem('preferredContactMethods', method)}
                  className="rounded"
                />
                <span className="text-sm">{method}</span>
              </label>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {formData.preferredContactMethods && formData.preferredContactMethods.length > 0 ? (
              formData.preferredContactMethods.map((method, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {method}
                </span>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">No contact methods selected</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

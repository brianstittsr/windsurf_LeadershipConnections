'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/adminUsers';

type SectionType = 'hero' | 'benefits' | 'mission' | 'connections' | 'registration' | 'cta' | 'custom';

interface Section {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  title?: string;
  content?: string;
  data?: any;
}

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    videoUrl: string;
  };
  sections: Section[];
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

const defaultSections: Section[] = [
  { id: 'benefits', type: 'benefits', enabled: true, order: 1 },
  { id: 'mission', type: 'mission', enabled: true, order: 2 },
  { id: 'connections', type: 'connections', enabled: true, order: 3 },
  { id: 'registration', type: 'registration', enabled: true, order: 4 },
];

const HomeContentPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState<HomeContent>({
    hero: {
      title: 'Empowering Youth Through Leadership',
      subtitle: 'Leadership C.O.N.N.E.C.T.I.O.N.S.',
      description: 'Building tomorrow\'s leaders today through education, mentorship, and community engagement.',
      primaryButtonText: 'Get Involved',
      primaryButtonLink: '/get-involved',
      secondaryButtonText: 'Learn More',
      secondaryButtonLink: '/about',
      videoUrl: '/videos/LeadershipConnectionsv3NoAud.mp4',
    },
    sections: defaultSections,
    cta: {
      title: 'Ready to Make a Difference?',
      description: 'Join us in empowering the next generation of leaders. Your support can change lives.',
      buttonText: 'Get Involved Today',
      buttonLink: '/get-involved',
    },
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'sections' | 'cta'>('hero');

  useEffect(() => {
    if (!loading && (!user || !isAdminUser(user.email))) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'homePage');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data() as HomeContent;
          // Ensure sections exist
          if (!data.sections) {
            data.sections = defaultSections;
          }
          setContent(data);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    if (user && isAdminUser(user.email)) {
      fetchContent();
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      const docRef = doc(db, 'siteContent', 'homePage');
      await setDoc(docRef, content);
      setMessage('Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateHeroField = (field: keyof HomeContent['hero'], value: string) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));
  };

  const updateCtaField = (field: keyof HomeContent['cta'], value: string) => {
    setContent(prev => ({
      ...prev,
      cta: {
        ...prev.cta,
        [field]: value,
      },
    }));
  };

  const addSection = (type: SectionType) => {
    const newSection: Section = {
      id: `${type}-${Date.now()}`,
      type,
      enabled: true,
      order: content.sections.length + 1,
      title: type === 'custom' ? 'New Custom Section' : '',
      content: type === 'custom' ? '' : undefined,
    };
    setContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));
  };

  const deleteSection = (id: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setContent(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== id),
      }));
    }
  };

  const moveSection = (id: string, direction: 'up' | 'down') => {
    const index = content.sections.findIndex(s => s.id === id);
    if (index === -1) return;
    
    const newSections = [...content.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newSections.length) return;
    
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    // Update order numbers
    newSections.forEach((section, idx) => {
      section.order = idx + 1;
    });
    
    setContent(prev => ({ ...prev, sections: newSections }));
  };

  const getSectionTypeName = (type: SectionType): string => {
    const names: Record<SectionType, string> = {
      hero: 'Hero',
      benefits: 'Interactive Benefits',
      mission: 'Mission & Vision',
      connections: 'C.O.N.N.E.C.T.I.O.N.S. Meaning',
      registration: 'Member Registration',
      cta: 'Call to Action',
      custom: 'Custom Section',
    };
    return names[type];
  };

  if (loading) {
    return <div className="p-8 bg-white">Loading...</div>;
  }

  if (!user || !isAdminUser(user.email)) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Home Page Content
        </h1>
        <p className="text-gray-600">
          Edit the content and layout of the home page
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hero'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Hero Section
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sections'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Page Sections
          </button>
          <button
            onClick={() => setActiveTab('cta')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cta'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            CTA Section
          </button>
        </nav>
      </div>

      {/* Hero Section Tab */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hero Section
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL
              </label>
              <input
                type="text"
                value={content.hero.videoUrl}
                onChange={(e) => updateHeroField('videoUrl', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                placeholder="/videos/your-video.mp4"
              />
              <p className="text-xs text-gray-500 mt-1">
                Path to the background video file (e.g., /videos/LeadershipConnectionsv3NoAud.mp4)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={content.hero.subtitle}
                onChange={(e) => updateHeroField('subtitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={content.hero.title}
                onChange={(e) => updateHeroField('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={content.hero.description}
                onChange={(e) => updateHeroField('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={content.hero.primaryButtonText}
                  onChange={(e) => updateHeroField('primaryButtonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Button Link
                </label>
                <input
                  type="text"
                  value={content.hero.primaryButtonLink}
                  onChange={(e) => updateHeroField('primaryButtonLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Button Text
                </label>
                <input
                  type="text"
                  value={content.hero.secondaryButtonText}
                  onChange={(e) => updateHeroField('secondaryButtonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Button Link
                </label>
                <input
                  type="text"
                  value={content.hero.secondaryButtonLink}
                  onChange={(e) => updateHeroField('secondaryButtonLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Page Sections
              </h2>
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addSection(e.target.value as SectionType);
                      e.target.value = '';
                    }
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                  defaultValue=""
                >
                  <option value="">Add Section...</option>
                  <option value="benefits">Interactive Benefits</option>
                  <option value="mission">Mission & Vision</option>
                  <option value="connections">C.O.N.N.E.C.T.I.O.N.S. Meaning</option>
                  <option value="registration">Member Registration</option>
                  <option value="custom">Custom Section</option>
                </select>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Drag sections to reorder, toggle visibility, or delete sections you don't need.
            </p>

            <div className="space-y-4">
              {content.sections.map((section, index) => (
                <div
                  key={section.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={index === content.sections.length - 1}
                          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {section.order}. {getSectionTypeName(section.type)}
                        </h3>
                        <p className="text-sm text-gray-500">Type: {section.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={section.enabled}
                          onChange={(e) => updateSection(section.id, { enabled: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">Enabled</span>
                      </label>
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {section.type === 'custom' && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={section.title || ''}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Section Content (HTML)
                        </label>
                        <textarea
                          value={section.content || ''}
                          onChange={(e) => updateSection(section.id, { content: e.target.value })}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm text-gray-900"
                          placeholder="Enter HTML content..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {content.sections.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No sections added yet. Use the "Add Section" dropdown above to add sections.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section Tab */}
      {activeTab === 'cta' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Call-to-Action Section
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={content.cta.title}
                onChange={(e) => updateCtaField('title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={content.cta.description}
                onChange={(e) => updateCtaField('description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={content.cta.buttonText}
                  onChange={(e) => updateCtaField('buttonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={content.cta.buttonLink}
                  onChange={(e) => updateCtaField('buttonLink', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-4 sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default HomeContentPage;

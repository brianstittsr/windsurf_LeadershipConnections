'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/adminUsers';

interface HomeContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

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
    },
    cta: {
      title: 'Ready to Make a Difference?',
      description: 'Join us in empowering the next generation of leaders. Your support can change lives.',
      buttonText: 'Get Involved Today',
      buttonLink: '/get-involved',
    },
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
          setContent(docSnap.data() as HomeContent);
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

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || !isAdminUser(user.email)) {
    return null;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Home Page Content
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Edit the content that appears on the home page
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Hero Section
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subtitle
            </label>
            <input
              type="text"
              value={content.hero.subtitle}
              onChange={(e) => updateHeroField('subtitle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => updateHeroField('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={content.hero.description}
              onChange={(e) => updateHeroField('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Button Text
              </label>
              <input
                type="text"
                value={content.hero.primaryButtonText}
                onChange={(e) => updateHeroField('primaryButtonText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Primary Button Link
              </label>
              <input
                type="text"
                value={content.hero.primaryButtonLink}
                onChange={(e) => updateHeroField('primaryButtonLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={content.hero.secondaryButtonText}
                onChange={(e) => updateHeroField('secondaryButtonText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secondary Button Link
              </label>
              <input
                type="text"
                value={content.hero.secondaryButtonLink}
                onChange={(e) => updateHeroField('secondaryButtonLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Call-to-Action Section
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={content.cta.title}
              onChange={(e) => updateCtaField('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={content.cta.description}
              onChange={(e) => updateCtaField('description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={content.cta.buttonText}
                onChange={(e) => updateCtaField('buttonText', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Button Link
              </label>
              <input
                type="text"
                value={content.cta.buttonLink}
                onChange={(e) => updateCtaField('buttonLink', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default HomeContentPage;

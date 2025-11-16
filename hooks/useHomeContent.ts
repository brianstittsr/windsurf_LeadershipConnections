import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HomeContent {
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

const defaultContent: HomeContent = {
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
};

export const useHomeContent = () => {
  const [content, setContent] = useState<HomeContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'homePage');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setContent(docSnap.data() as HomeContent);
        }
      } catch (error) {
        console.error('Error fetching home content:', error);
        // Use default content on error
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { content, loading };
};

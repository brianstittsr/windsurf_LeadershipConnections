'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/Hero";
import InteractiveBenefits from "@/components/InteractiveBenefits";
import MissionVision from "@/components/MissionVision";
import ConnectionsMeaning from "@/components/ConnectionsMeaning";
import MemberRegistration from "@/components/MemberRegistration";
import CTA from "@/components/CTA";

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

const HomeClient = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const docRef = doc(db, 'siteContent', 'homePage');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.sections) {
            setSections(data.sections.filter((s: Section) => s.enabled).sort((a: Section, b: Section) => a.order - b.order));
          }
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'benefits':
        return <InteractiveBenefits key={section.id} />;
      case 'mission':
        return <MissionVision key={section.id} />;
      case 'connections':
        return <ConnectionsMeaning key={section.id} />;
      case 'registration':
        return <MemberRegistration key={section.id} />;
      case 'custom':
        return (
          <section key={section.id} className="py-16 md:py-20 lg:py-28">
            <div className="container">
              {section.title && (
                <h2 className="mb-8 text-center text-3xl font-bold text-black sm:text-4xl">
                  {section.title}
                </h2>
              )}
              {section.content && (
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              )}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <ScrollUp />
        <Hero />
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-gray-600">Loading content...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <ScrollUp />
      <Hero />
      {sections.length > 0 ? (
        sections.map(section => renderSection(section))
      ) : (
        // Fallback to default sections if none configured
        <>
          <InteractiveBenefits />
          <MissionVision />
          <ConnectionsMeaning />
          <MemberRegistration />
        </>
      )}
      <CTA />
    </>
  );
};

export default HomeClient;

'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import SingleClass from "@/components/Classes/SingleClass";
import classesData from "@/components/Classes/classesData";
import { Class } from "@/types/class";

const LCPastClassesPage = () => {
  const [firestoreClasses, setFirestoreClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      // Skip Firestore fetch if db is not available (e.g., during build)
      if (!db) {
        console.log('Firestore not available, skipping classes fetch');
        setLoading(false);
        return;
      }

      try {
        const classesRef = collection(db, 'lcPastClasses');
        const classesQuery = query(
          classesRef,
          where('published', '==', true)
        );
        
        const classesSnapshot = await getDocs(classesQuery);
        const classesData: Class[] = [];
        
        classesSnapshot.forEach((doc) => {
          const data = doc.data();
          classesData.push({
            id: data.id || 0,
            slug: data.slug || doc.id,
            year: data.year || '',
            title: data.title || '',
            paragraph: data.paragraph || '',
            image: data.image || '/images/classes/default.jpg',
            graduationDate: data.graduationDate || '',
            tags: data.tags || [],
            content: data.content
          });
        });
        
        setFirestoreClasses(classesData);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Only use Firebase classes
  const allClasses = firestoreClasses;

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Section - Force light mode */}
      <section className="relative z-10 bg-secondary pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="container">
          <div className="text-center">
            <h1 className="mb-5 font-serif text-4xl font-bold text-black sm:text-5xl">
              LC Past Classes
            </h1>
            <p className="mx-auto max-w-3xl text-base font-medium leading-relaxed text-gray-700">
              Celebrating the achievements and legacy of Leadership C.O.N.N.E.C.T.I.O.N.S. graduating classes.
            </p>
            <div className="mt-6">
              <ul className="flex items-center justify-center gap-2">
                <li className="flex items-center">
                  <a
                    href="/"
                    className="text-base font-medium text-gray-700 hover:text-primary"
                  >
                    Home
                  </a>
                </li>
                <li className="text-base font-medium text-primary">/ LC Past Classes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Classes Grid Section */}
      <section className="pb-[120px] pt-[120px] bg-white">
        <div className="container">
          {loading ? (
            <div className="text-center">
              <p className="text-gray-700">Loading classes...</p>
            </div>
          ) : (
            <div className="-mx-4 flex flex-wrap justify-center">
              {allClasses.map((classItem) => (
                <div
                  key={classItem.id}
                  className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
                >
                  <SingleClass classItem={classItem} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LCPastClassesPage;

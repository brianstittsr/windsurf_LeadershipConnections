'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BrainstormingMethod } from '@/lib/firestore-schema';
import { 
  FaLightbulb, 
  FaBrain, 
  FaProjectDiagram, 
  FaUsers, 
  FaChartLine, 
  FaRocket,
  FaBullseye,
  FaCogs,
  FaCompass
} from 'react-icons/fa';

// Icon mapping
const iconMap: Record<string, React.ReactNode> = {
  FaLightbulb: <FaLightbulb className="text-4xl text-primary" />,
  FaBrain: <FaBrain className="text-4xl text-primary" />,
  FaProjectDiagram: <FaProjectDiagram className="text-4xl text-primary" />,
  FaUsers: <FaUsers className="text-4xl text-primary" />,
  FaChartLine: <FaChartLine className="text-4xl text-primary" />,
  FaRocket: <FaRocket className="text-4xl text-primary" />,
  FaBullseye: <FaBullseye className="text-4xl text-primary" />,
  FaCogs: <FaCogs className="text-4xl text-primary" />,
  FaCompass: <FaCompass className="text-4xl text-primary" />,
};

const StrategicPlanningDynamic = () => {
  const [activeMethod, setActiveMethod] = useState(0);
  const [methods, setMethods] = useState<BrainstormingMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const q = query(
        collection(db, 'strategicPlanningMethods'),
        where('published', '==', true),
        orderBy('order', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const methodsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BrainstormingMethod[];
      
      setMethods(methodsData);
    } catch (error) {
      console.error('Error fetching methods:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading brainstorming methods...</p>
          </div>
        </div>
      </section>
    );
  }

  if (methods.length === 0) {
    return (
      <section className="py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
              Strategic Planning & Brainstorming Methods
            </h2>
            <p className="text-body-color dark:text-gray-300">
              No brainstorming methods available at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 lg:py-28 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4 font-serif text-3xl font-bold text-black dark:text-white sm:text-4xl md:text-[45px]">
            Strategic Planning & Brainstorming Methods
          </h2>
          <p className="text-base text-body-color dark:text-gray-300 max-w-3xl mx-auto">
            Explore proven brainstorming techniques to unlock creativity, solve complex problems, and develop innovative strategies. 
            Select a method below to learn how it works and when to use it.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Method Selection Menu on the left */}
          <div className="w-full lg:w-2/5 flex flex-col gap-3">
            {methods.map((method, index) => (
              <button
                key={method.id}
                onClick={() => setActiveMethod(index)}
                className={`flex items-center gap-4 p-5 rounded-xl transition-all duration-300 ease-in-out w-full text-left border-2 ${
                  activeMethod === index 
                    ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md'
                }`}
              >
                <div className={activeMethod === index ? 'text-white' : 'text-primary'}>
                  {iconMap[method.icon] || iconMap.FaLightbulb}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${
                    activeMethod === index 
                      ? 'text-white' 
                      : 'text-black dark:text-white'
                  }`}>
                    {method.title}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    activeMethod === index 
                      ? 'text-white/90' 
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Click to explore
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Content Display on the right */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              {/* Icon Display */}
              <div className="relative w-full h-72 rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-primary text-8xl opacity-20">
                    {iconMap[methods[activeMethod].icon] || iconMap.FaLightbulb}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-serif text-3xl font-bold text-black dark:text-white mb-4">
                {methods[activeMethod].title}
              </h3>

              {/* Description */}
              <p className="text-body-color dark:text-gray-300 text-lg mb-6 leading-relaxed">
                {methods[activeMethod].description}
              </p>

              {/* Key Points */}
              <div className="mb-6">
                <h4 className="font-bold text-xl text-black dark:text-white mb-3">
                  Key Components:
                </h4>
                <ul className="space-y-2">
                  {methods[activeMethod].keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-primary text-xl mt-1">✓</span>
                      <span className="text-body-color dark:text-gray-300 flex-1">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Best For Badge */}
              <div className="bg-primary/10 dark:bg-primary/20 border-l-4 border-primary p-4 rounded-r-lg">
                <p className="text-sm font-semibold text-primary mb-1">
                  BEST FOR:
                </p>
                <p className="text-body-color dark:text-gray-300">
                  {methods[activeMethod].bestFor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicPlanningDynamic;

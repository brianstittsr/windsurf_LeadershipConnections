'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaLightbulb, FaBrain, FaProjectDiagram, FaUsers, FaChartLine, FaRocket } from 'react-icons/fa';

const brainstormingMethods = [
  {
    icon: <FaLightbulb className="text-4xl text-primary" />,
    title: 'Mind Mapping',
    description: 'A visual thinking tool that helps structure information, analyze, comprehend, synthesize, recall and generate new ideas. Start with a central concept and branch out into related ideas and subtopics.',
    imageUrl: '/images/strategic-planning/mind-mapping.jpg',
    keyPoints: [
      'Visual representation of ideas',
      'Hierarchical structure',
      'Encourages free-flowing thoughts',
      'Easy to identify connections'
    ],
    bestFor: 'Complex problems requiring visual organization'
  },
  {
    icon: <FaBrain className="text-4xl text-primary" />,
    title: 'SWOT Analysis',
    description: 'Identify Strengths, Weaknesses, Opportunities, and Threats to develop comprehensive strategic plans. This method provides a structured framework for analyzing internal and external factors.',
    imageUrl: '/images/strategic-planning/swot-analysis.jpg',
    keyPoints: [
      'Strengths: Internal positive attributes',
      'Weaknesses: Internal areas for improvement',
      'Opportunities: External favorable conditions',
      'Threats: External challenges to address'
    ],
    bestFor: 'Business planning and competitive analysis'
  },
  {
    icon: <FaProjectDiagram className="text-4xl text-primary" />,
    title: 'Six Thinking Hats',
    description: 'Edward de Bono\'s method uses six different perspectives (hats) to explore ideas thoroughly. Each hat represents a different mode of thinking, ensuring comprehensive analysis.',
    imageUrl: '/images/strategic-planning/six-hats.jpg',
    keyPoints: [
      'White Hat: Facts and information',
      'Red Hat: Emotions and feelings',
      'Black Hat: Critical judgment',
      'Yellow Hat: Positive benefits',
      'Green Hat: Creativity and alternatives',
      'Blue Hat: Process control'
    ],
    bestFor: 'Team decision-making and reducing conflict'
  },
  {
    icon: <FaUsers className="text-4xl text-primary" />,
    title: 'Brainwriting (6-3-5)',
    description: 'A silent brainstorming technique where 6 participants write 3 ideas in 5 minutes, then pass their sheet to the next person. This reduces groupthink and allows introverts to contribute equally.',
    imageUrl: '/images/strategic-planning/brainwriting.jpg',
    keyPoints: [
      'Silent idea generation',
      'Equal participation opportunity',
      'Builds on others\' ideas',
      'Generates 108 ideas in 30 minutes'
    ],
    bestFor: 'Groups with dominant personalities or remote teams'
  },
  {
    icon: <FaChartLine className="text-4xl text-primary" />,
    title: 'SCAMPER Technique',
    description: 'A creative thinking technique using prompts: Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, and Reverse. Perfect for product innovation and process improvement.',
    imageUrl: '/images/strategic-planning/scamper.jpg',
    keyPoints: [
      'Substitute: Replace components',
      'Combine: Merge ideas or features',
      'Adapt: Adjust for new contexts',
      'Modify: Change attributes',
      'Put to another use: Repurpose',
      'Eliminate: Remove elements',
      'Reverse: Flip the process'
    ],
    bestFor: 'Product development and innovation'
  },
  {
    icon: <FaRocket className="text-4xl text-primary" />,
    title: 'Rapid Ideation',
    description: 'Generate as many ideas as possible in a short time frame without judgment or analysis. Quantity over quality initially, then refine the best concepts later.',
    imageUrl: '/images/strategic-planning/rapid-ideation.jpg',
    keyPoints: [
      'Set strict time limits (5-10 minutes)',
      'No criticism during generation',
      'Encourage wild ideas',
      'Build momentum through speed'
    ],
    bestFor: 'Breaking through creative blocks and generating volume'
  },
];

const StrategicPlanning = () => {
  const [activeMethod, setActiveMethod] = useState(0);

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
            {brainstormingMethods.map((method, index) => (
              <button
                key={index}
                onClick={() => setActiveMethod(index)}
                className={`flex items-center gap-4 p-5 rounded-xl transition-all duration-300 ease-in-out w-full text-left border-2 ${
                  activeMethod === index 
                    ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md'
                }`}
              >
                <div className={activeMethod === index ? 'text-white' : 'text-primary'}>
                  {method.icon}
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
              {/* Image */}
              <div className="relative w-full h-72 rounded-xl overflow-hidden mb-6 bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-primary text-8xl opacity-20">
                    {brainstormingMethods[activeMethod].icon}
                  </div>
                </div>
              </div>

              {/* Title */}
              <h3 className="font-serif text-3xl font-bold text-black dark:text-white mb-4">
                {brainstormingMethods[activeMethod].title}
              </h3>

              {/* Description */}
              <p className="text-body-color dark:text-gray-300 text-lg mb-6 leading-relaxed">
                {brainstormingMethods[activeMethod].description}
              </p>

              {/* Key Points */}
              <div className="mb-6">
                <h4 className="font-bold text-xl text-black dark:text-white mb-3">
                  Key Components:
                </h4>
                <ul className="space-y-2">
                  {brainstormingMethods[activeMethod].keyPoints.map((point, idx) => (
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
                  {brainstormingMethods[activeMethod].bestFor}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategicPlanning;
export { default as StrategicPlanningDynamic } from './StrategicPlanningDynamic';

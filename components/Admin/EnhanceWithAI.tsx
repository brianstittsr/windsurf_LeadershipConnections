'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

interface EnhanceWithAIProps {
  currentText: string;
  onEnhanced: (enhancedText: string) => void;
  fieldName?: string;
}

const EnhanceWithAI = ({ currentText, onEnhanced, fieldName = 'text' }: EnhanceWithAIProps) => {
  const { userRole } = useAuth();
  const { hasFeature } = useSubscription();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState('');
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  
  // Check if user has AI text enhancement feature
  const hasAISubscription = hasFeature('ai-text-enhancement');

  const enhanceText = async () => {
    // Check subscription for SuperUser
    if (!hasAISubscription && userRole === 'SuperUser') {
      setShowSubscriptionModal(true);
      return;
    }
    
    if (!currentText.trim()) {
      setError('Please enter some text first');
      return;
    }

    setIsEnhancing(true);
    setError('');

    try {
      const response = await fetch('/api/enhance-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: currentText,
          fieldName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to enhance text');
      }

      const data = await response.json();
      onEnhanced(data.enhancedText);
    } catch (err) {
      console.error('Error enhancing text:', err);
      setError('Failed to enhance text. Please try again.');
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={enhanceText}
          disabled={isEnhancing || !currentText.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg relative"
        >
        {isEnhancing ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Enhancing...</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Enhance with AI</span>
            {!hasAISubscription && userRole === 'SuperUser' && (
              <svg className="h-3 w-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            )}
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>

    {/* Subscription Modal */}
    {showSubscriptionModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Enhancement Subscription
          </h3>
          <p className="text-gray-600 mb-6">
            AI text enhancement uses advanced language models to improve and refine your content, making it more engaging, professional, and impactful.
          </p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-purple-900 font-semibold mb-2">Subscription Required</p>
            <p className="text-sm text-purple-800">
              This feature is available as a subscription service for SuperUsers. Contact your administrator to enable AI features.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSubscriptionModal(false)}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowSubscriptionModal(false);
                alert('Contact administrator to enable AI subscription features.');
              }}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Request Access
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default EnhanceWithAI;

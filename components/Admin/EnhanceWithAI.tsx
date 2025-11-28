'use client';

import { useState } from 'react';

interface EnhanceWithAIProps {
  currentText: string;
  onEnhanced: (enhancedText: string) => void;
  fieldName?: string;
}

const EnhanceWithAI = ({ currentText, onEnhanced, fieldName = 'text' }: EnhanceWithAIProps) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState('');

  const enhanceText = async () => {
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
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={enhanceText}
        disabled={isEnhancing || !currentText.trim()}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
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
          </>
        )}
      </button>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default EnhanceWithAI;

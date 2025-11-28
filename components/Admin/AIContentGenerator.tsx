'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AIContentGeneratorProps {
  summary: string;
  onContentGenerated: (content: string) => void;
  contentType: 'blog' | 'event' | 'class';
}

export default function AIContentGenerator({ 
  summary, 
  onContentGenerated,
  contentType 
}: AIContentGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateContent = async () => {
    if (!summary || summary.trim().length < 20) {
      setError('Please provide a summary of at least 20 characters');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, contentType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      onContentGenerated(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={generateContent}
        disabled={generating || !summary}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors ${
          generating || !summary
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
        }`}
      >
        <Sparkles className={`h-5 w-5 ${generating ? 'animate-spin' : ''}`} />
        {generating ? 'Generating Content...' : 'Generate Content with AI'}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <p className="mt-2 text-xs text-gray-500">
        AI will generate detailed content based on your summary. You can edit the generated content before saving.
      </p>
    </div>
  );
}

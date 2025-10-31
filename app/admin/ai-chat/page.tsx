'use client';

import { useState } from 'react';

const AiChatPage = () => {
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState('');
  const [article, setArticle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setArticle('');
    // API call to generate article will be added here
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Blog Generator</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label htmlFor="topic" className="block text-lg font-medium mb-2">Blog Topic</label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., The Importance of Mentorship"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="tags" className="block text-lg font-medium mb-2">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="e.g., mentorship, leadership, career"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Article'}
          </button>
        </div>
        {article && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold mb-4">Generated Article</h3>
            <textarea
              readOnly
              value={article}
              className="w-full h-96 p-3 border rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChatPage;

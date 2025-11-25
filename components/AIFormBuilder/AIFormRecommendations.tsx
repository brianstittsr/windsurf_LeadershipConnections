'use client';

import { useState } from 'react';
import { FaLightbulb, FaTimes, FaSpinner, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';

interface AIFormRecommendationsProps {
  onClose: () => void;
  onApplyRecommendations?: (recommendations: FormRecommendation) => void;
}

interface FormRecommendation {
  suggestedQuestions: string[];
  fieldTypes: Array<{
    question: string;
    fieldType: string;
    reasoning: string;
  }>;
  bestPractices: string[];
  dataCollectionTips: string[];
}

export default function AIFormRecommendations({ onClose, onApplyRecommendations }: AIFormRecommendationsProps) {
  const [formPurpose, setFormPurpose] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [dataGoals, setDataGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<FormRecommendation | null>(null);

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/form-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: formPurpose,
          audience: targetAudience,
          goals: dataGoals,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      alert('Error getting recommendations. Please check your AI API configuration and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (recommendations && onApplyRecommendations) {
      onApplyRecommendations(recommendations);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaLightbulb className="text-3xl" />
                <h2 className="text-2xl font-bold">AI Form Recommendations</h2>
              </div>
              <p className="text-white/90">Get expert guidance on creating effective forms</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!recommendations ? (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <FaQuestionCircle />
                  How It Works
                </h3>
                <p className="text-sm text-blue-700">
                  Answer a few questions about your form's purpose, and our AI will recommend the best questions to ask, 
                  optimal field types, and data collection strategies to maximize the value of your responses.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What is the purpose of this form? *
                </label>
                <textarea
                  value={formPurpose}
                  onChange={(e) => setFormPurpose(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Example: To collect feedback from participants after our leadership workshop to improve future programs"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Who is your target audience? *
                </label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Example: Women leaders who completed our 6-month leadership development program"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What specific data or insights are you hoping to gain? *
                </label>
                <textarea
                  value={dataGoals}
                  onChange={(e) => setDataGoals(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Example: Measure satisfaction levels, identify most valuable program components, gather testimonials, understand career impact, and collect suggestions for improvement"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGetRecommendations}
                  disabled={!formPurpose.trim() || !targetAudience.trim() || !dataGoals.trim() || loading}
                  className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Getting Recommendations...
                    </>
                  ) : (
                    <>
                      <FaLightbulb />
                      Get AI Recommendations
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <FaCheckCircle className="text-green-600 mt-1 text-xl" />
                <div>
                  <p className="font-semibold text-green-900">Recommendations Generated!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Review the AI-generated recommendations below to optimize your form.
                  </p>
                </div>
              </div>

              {/* Suggested Questions */}
              <div className="bg-white border-2 border-yellow-200 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-yellow-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Suggested Questions
                </h3>
                <ul className="space-y-2">
                  {recommendations.suggestedQuestions.map((question, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-1">•</span>
                      <span className="text-gray-700">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Field Type Recommendations */}
              <div className="bg-white border-2 border-orange-200 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Recommended Field Types
                </h3>
                <div className="space-y-4">
                  {recommendations.fieldTypes.map((field, index) => (
                    <div key={index} className="bg-orange-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-900">{field.question}</p>
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                          {field.fieldType}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 italic">{field.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Best Practices */}
              <div className="bg-white border-2 border-blue-200 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                  Best Practices
                </h3>
                <ul className="space-y-2">
                  {recommendations.bestPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FaCheckCircle className="text-blue-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{practice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Collection Tips */}
              <div className="bg-white border-2 border-purple-200 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="bg-purple-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
                  Data Collection Optimization Tips
                </h3>
                <ul className="space-y-2">
                  {recommendations.dataCollectionTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FaLightbulb className="text-purple-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setRecommendations(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Start Over
                </button>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Close
                  </button>
                  {onApplyRecommendations && (
                    <button
                      onClick={handleApply}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600"
                    >
                      Use These Recommendations
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function SetupAdminPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAdmins = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/admin/create-admin-users', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Setup Admin Users
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Click the button below to create the admin user accounts in Firebase.
          </p>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Admin Users to Create:
            </h2>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>• brianstittsr@gmail.com</li>
              <li>• kathy@ncleadconnect.org</li>
              <li>• gloria@ncleadconnect.org</li>
            </ul>
          </div>

          <button
            onClick={handleCreateAdmins}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Admin Users...' : 'Create Admin Users'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 font-medium">Error:</p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
            </div>
          )}

          {results && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 font-medium mb-3">
                Results:
              </p>
              <ul className="space-y-2">
                {results.map((result: any, index: number) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-start"
                  >
                    <span className="font-medium mr-2">{result.email}:</span>
                    <span
                      className={
                        result.status === 'created'
                          ? 'text-green-600 dark:text-green-400'
                          : result.status === 'already_exists'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-red-600 dark:text-red-400'
                      }
                    >
                      {result.status === 'created' && '✓ Created successfully'}
                      {result.status === 'already_exists' && '✓ Already exists'}
                      {result.status === 'error' && `✗ Error: ${result.error}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              <strong>Note:</strong> After creating the admin users, you can sign in with:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li>• brianstittsr@gmail.com / Yfhk9r76q@@12345</li>
              <li>• kathy@ncleadconnect.org / 2026ncleadconnect</li>
              <li>• gloria@ncleadconnect.org / 2026ncleadconnect</li>
            </ul>
            <p className="mt-3 text-sm text-blue-700 dark:text-blue-400">
              Admin users will be automatically redirected to the dashboard at{' '}
              <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">
                /admin/dashboard
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

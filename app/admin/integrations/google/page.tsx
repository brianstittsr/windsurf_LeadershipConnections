'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FaGoogle, FaArrowLeft, FaEnvelope, FaFolder, FaTable, FaCheck, FaTimes, FaSync, FaKey } from 'react-icons/fa';

interface GoogleCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: Date;
  connectedAt?: Date;
  connectedBy?: string;
  scopes: string[];
}

interface GoogleIntegrationStatus {
  gmail: { enabled: boolean; lastSync?: Date };
  drive: { enabled: boolean; backupFolderId?: string; lastSync?: Date };
  sheets: { enabled: boolean; lastSync?: Date };
}

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

export default function GoogleIntegrationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [credentials, setCredentials] = useState<GoogleCredentials | null>(null);
  const [status, setStatus] = useState<GoogleIntegrationStatus>({
    gmail: { enabled: false },
    drive: { enabled: false },
    sheets: { enabled: false }
  });
  
  // Form state
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    fetchIntegrationSettings();
  }, []);

  const fetchIntegrationSettings = async () => {
    try {
      const docRef = doc(db, 'integrations', 'google');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCredentials(data.credentials || null);
        setStatus(data.status || {
          gmail: { enabled: false },
          drive: { enabled: false },
          sheets: { enabled: false }
        });
        if (data.credentials) {
          setClientId(data.credentials.clientId || '');
          // Don't show secret in form for security
        }
      }
    } catch (error) {
      console.error('Error fetching Google integration settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCredentials = async () => {
    if (!clientId.trim()) {
      alert('Please enter a Client ID');
      return;
    }

    setSaving(true);
    try {
      const docRef = doc(db, 'integrations', 'google');
      
      const newCredentials: GoogleCredentials = {
        clientId: clientId.trim(),
        clientSecret: clientSecret.trim() || credentials?.clientSecret || '',
        scopes: GOOGLE_SCOPES,
        connectedAt: new Date(),
        connectedBy: user?.email || 'unknown'
      };

      await setDoc(docRef, {
        credentials: newCredentials,
        status,
        updatedAt: Timestamp.fromDate(new Date()),
        updatedBy: user?.email
      }, { merge: true });

      setCredentials(newCredentials);
      setClientSecret(''); // Clear secret from form
      alert('Google credentials saved successfully!');
    } catch (error) {
      console.error('Error saving credentials:', error);
      alert('Error saving credentials. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initiateOAuth = () => {
    if (!credentials?.clientId) {
      alert('Please save your Client ID first');
      return;
    }

    const redirectUri = `${window.location.origin}/api/integrations/google/callback`;
    const scope = GOOGLE_SCOPES.join(' ');
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(credentials.clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&access_type=offline` +
      `&prompt=consent`;

    window.location.href = authUrl;
  };

  const toggleService = async (service: 'gmail' | 'drive' | 'sheets') => {
    const newStatus = {
      ...status,
      [service]: { ...status[service], enabled: !status[service].enabled }
    };
    setStatus(newStatus);

    try {
      const docRef = doc(db, 'integrations', 'google');
      await setDoc(docRef, {
        status: newStatus,
        updatedAt: Timestamp.fromDate(new Date())
      }, { merge: true });
    } catch (error) {
      console.error('Error updating service status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isConnected = credentials?.refreshToken || credentials?.accessToken;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/integrations"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Integrations
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-3 rounded-lg">
            <FaGoogle className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Google Services Integration</h1>
            <p className="text-gray-600">Connect Gmail, Google Drive, and Google Sheets</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className={`mb-6 p-4 rounded-lg border ${isConnected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center gap-3">
          {isConnected ? (
            <>
              <FaCheck className="text-green-600 text-xl" />
              <div>
                <p className="font-medium text-green-800">Connected to Google</p>
                <p className="text-sm text-green-600">
                  Connected by {credentials?.connectedBy} on {credentials?.connectedAt?.toLocaleDateString()}
                </p>
              </div>
            </>
          ) : (
            <>
              <FaTimes className="text-yellow-600 text-xl" />
              <div>
                <p className="font-medium text-yellow-800">Not Connected</p>
                <p className="text-sm text-yellow-600">Configure your credentials and authorize access</p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaKey className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">API Credentials</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="your-client-id.apps.googleusercontent.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Secret
              </label>
              <div className="relative">
                <input
                  type={showCredentials ? 'text' : 'password'}
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  placeholder={credentials?.clientSecret ? '••••••••••••' : 'Enter client secret'}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCredentials ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              onClick={saveCredentials}
              disabled={saving || !clientId.trim()}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Credentials'}
            </button>

            {credentials?.clientId && (
              <button
                onClick={initiateOAuth}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 flex items-center justify-center gap-2"
              >
                <FaGoogle />
                {isConnected ? 'Re-authorize with Google' : 'Authorize with Google'}
              </button>
            )}

            <div className="bg-gray-50 rounded-lg p-4 text-sm">
              <p className="font-medium text-gray-700 mb-2">Setup Instructions:</p>
              <ol className="list-decimal list-inside text-gray-600 space-y-1">
                <li>Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
                <li>Create a new project or select existing</li>
                <li>Enable Gmail, Drive, and Sheets APIs</li>
                <li>Create OAuth 2.0 credentials</li>
                <li>Add redirect URI: <code className="bg-gray-200 px-1 rounded text-xs">{typeof window !== 'undefined' ? `${window.location.origin}/api/integrations/google/callback` : '/api/integrations/google/callback'}</code></li>
                <li>Copy Client ID and Secret here</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-4">
          {/* Gmail */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <FaEnvelope className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gmail</h3>
                  <p className="text-sm text-gray-500">Send emails and notifications</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={status.gmail.enabled}
                  onChange={() => toggleService('gmail')}
                  disabled={!isConnected}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50"></div>
              </label>
            </div>
            {status.gmail.lastSync && (
              <p className="text-xs text-gray-500">Last sync: {status.gmail.lastSync.toLocaleString()}</p>
            )}
          </div>

          {/* Google Drive */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FaFolder className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Drive</h3>
                  <p className="text-sm text-gray-500">Backup data and store files</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={status.drive.enabled}
                  onChange={() => toggleService('drive')}
                  disabled={!isConnected}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50"></div>
              </label>
            </div>
            {status.drive.backupFolderId && (
              <p className="text-xs text-gray-500">Backup folder configured</p>
            )}
          </div>

          {/* Google Sheets */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FaTable className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Google Sheets</h3>
                  <p className="text-sm text-gray-500">Sync datasets to spreadsheets</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={status.sheets.enabled}
                  onChange={() => toggleService('sheets')}
                  disabled={!isConnected}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50"></div>
              </label>
            </div>
            {status.sheets.enabled && (
              <p className="text-xs text-green-600">✓ Ready to publish datasets to Google Sheets</p>
            )}
          </div>

          {/* Scopes Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm font-medium text-blue-800 mb-2">Required Permissions:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Send and read emails (Gmail)</li>
              <li>• Create and manage files (Drive)</li>
              <li>• Create and edit spreadsheets (Sheets)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

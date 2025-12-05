'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp, collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaArrowLeft, FaDatabase, FaCalendar, FaTag, FaTable, FaDownload, FaArchive, FaRobot, FaMagic, FaChartLine, FaLock, FaGoogle, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';

interface DatasetSchema {
  fields: Array<{
    name: string;
    type: string;
    required?: boolean;
    description?: string;
  }>;
}

interface DatasetMetadata {
  category?: string;
  tags?: string[];
  recordCount?: number;
  lastSync?: Date;
  isPublic?: boolean;
  archived?: boolean;
  archivedAt?: Date;
  archivedBy?: string;
}

interface Dataset {
  id: string;
  name: string;
  description?: string;
  sourceApplication: string;
  schema: DatasetSchema;
  metadata?: DatasetMetadata;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export default function DatasetViewPage() {
  const params = useParams();
  const router = useRouter();
  const datasetId = params.id as string;
  const { user, userRole } = useAuth();
  
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiFeature, setAIFeature] = useState<'merge' | 'reporting' | 'analysis' | null>(null);
  const [publishingToSheets, setPublishingToSheets] = useState(false);
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [recordCount, setRecordCount] = useState(0);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const { hasFeature, hasAnyFeature } = useSubscription();
  
  // Check if user has AI data features
  const hasDataMerge = hasFeature('ai-data-merge');
  const hasReporting = hasFeature('ai-reporting');
  const hasDataAnalysis = hasFeature('ai-data-analysis');
  const hasAnyAIFeature = hasAnyFeature(['ai-data-merge', 'ai-reporting', 'ai-data-analysis']);

  useEffect(() => {
    if (datasetId) {
      fetchDataset();
      fetchRecords();
    }
  }, [datasetId]);

  const fetchDataset = async () => {
    try {
      // Try lcDatasets first (main collection), then fall back to datasets
      let datasetRef = doc(db, 'lcDatasets', datasetId);
      let datasetSnap = await getDoc(datasetRef);
      
      if (!datasetSnap.exists()) {
        // Fall back to datasets collection
        datasetRef = doc(db, 'datasets', datasetId);
      datasetSnap = await getDoc(datasetRef);
      }

      if (datasetSnap.exists()) {
        const data = datasetSnap.data();
        setDataset({
          id: datasetSnap.id,
          name: data.name,
          description: data.description,
          sourceApplication: data.sourceApplication,
          schema: data.schema,
          metadata: data.metadata,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdBy: data.createdBy,
        });
        // Check if published to Google Sheets
        if (data.googleSheetUrl) {
          setGoogleSheetUrl(data.googleSheetUrl);
        }
      } else {
        setError('Dataset not found');
      }
    } catch (err) {
      console.error('Error fetching dataset:', err);
      setError('Failed to load dataset');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async () => {
    setLoadingRecords(true);
    try {
      // Fetch records from lcDatasetRecords collection where datasetId matches
      const { collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore');
      
      const recordsQuery = query(
        collection(db, 'lcDatasetRecords'),
        where('datasetId', '==', datasetId),
        orderBy('createdAt', 'desc'),
        limit(100) // Limit to 100 records for performance
      );
      
      const snapshot = await getDocs(recordsQuery);
      const recordsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      
      setRecords(recordsData);
      setRecordCount(snapshot.size);
      
      // Also try to get total count if there are more than 100
      if (snapshot.size === 100) {
        const countQuery = query(
          collection(db, 'lcDatasetRecords'),
          where('datasetId', '==', datasetId)
        );
        const countSnapshot = await getDocs(countQuery);
        setRecordCount(countSnapshot.size);
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleArchive = async () => {
    if (!user || !dataset) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to archive "${dataset.name}"? This will hide it from the active datasets list.`
    );
    
    if (!confirmed) return;
    
    setArchiving(true);
    try {
      const datasetRef = doc(db, 'datasets', datasetId);
      await updateDoc(datasetRef, {
        'metadata.archived': true,
        'metadata.archivedAt': Timestamp.now(),
        'metadata.archivedBy': user.uid,
        updatedAt: Timestamp.now(),
      });
      
      alert('Dataset archived successfully!');
      router.push('/admin/datasets');
    } catch (err) {
      console.error('Error archiving dataset:', err);
      alert('Failed to archive dataset. Please try again.');
    } finally {
      setArchiving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Placeholder for export functionality
      // In a real implementation, this would:
      // 1. Fetch all records from the dataset
      // 2. Convert to CSV/JSON format
      // 3. Trigger download
      
      const exportData = {
        dataset: {
          name: dataset?.name,
          description: dataset?.description,
          schema: dataset?.schema,
          metadata: dataset?.metadata,
        },
        exportedAt: new Date().toISOString(),
        exportedBy: user?.email,
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset?.name.replace(/\\s+/g, '_')}_export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('Dataset exported successfully!');
    } catch (err) {
      console.error('Error exporting dataset:', err);
      alert('Failed to export dataset. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleAIFeature = (feature: 'merge' | 'reporting' | 'analysis') => {
    const featureMap = {
      merge: hasDataMerge,
      reporting: hasReporting,
      analysis: hasDataAnalysis,
    };
    
    if (!featureMap[feature] && userRole === 'SuperUser') {
      // Show subscription modal for SuperUser
      setAIFeature(feature);
      setShowAIModal(true);
    } else if (featureMap[feature]) {
      // Execute AI feature for SuperAdmin or subscribed SuperUser
      executeAIFeature(feature);
    }
  };

  const executeAIFeature = async (feature: 'merge' | 'reporting' | 'analysis') => {
    // Placeholder for AI feature execution
    alert(`AI ${feature} feature coming soon! This will use advanced AI to ${
      feature === 'merge' ? 'intelligently merge datasets' :
      feature === 'reporting' ? 'generate comprehensive reports' :
      'analyze data patterns and insights'
    }.`);
  };

  const handlePublishToGoogleSheets = async () => {
    if (googleSheetUrl) {
      // Already published, open the sheet
      window.open(googleSheetUrl, '_blank');
      return;
    }

    const confirmed = window.confirm(
      'This will create a Google Sheet for this dataset and sync all records. ' +
      'A backup copy will also be created in your Google Drive that cannot be deleted. ' +
      'Continue?'
    );

    if (!confirmed) return;

    setPublishingToSheets(true);
    try {
      const response = await fetch(`/api/datasets/${datasetId}/publish-to-sheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish to Google Sheets');
      }

      setGoogleSheetUrl(data.spreadsheetUrl);
      alert(
        `Successfully published to Google Sheets!\n\n` +
        `Main Sheet: ${data.spreadsheetUrl}\n` +
        `Backup Sheet: ${data.backupSpreadsheetUrl}\n\n` +
        `${data.recordsSynced} records synced.`
      );
    } catch (err: any) {
      console.error('Error publishing to Google Sheets:', err);
      alert(err.message || 'Failed to publish to Google Sheets. Please check your Google integration settings.');
    } finally {
      setPublishingToSheets(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dataset...</p>
        </div>
      </div>
    );
  }

  if (error || !dataset) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error || 'Dataset not found'}</p>
          <Link
            href="/admin/datasets"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <FaArrowLeft />
            Back to Datasets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/datasets"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft />
          Back to Datasets
        </Link>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{dataset.name}</h1>
            {dataset.description && (
              <p className="text-gray-600 text-lg">{dataset.description}</p>
            )}
          </div>
          <span className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
            {dataset.metadata?.category || 'general'}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaTable className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {loadingRecords ? '...' : recordCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaDatabase className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Fields</p>
              <p className="text-2xl font-bold text-gray-900">
                {dataset.schema?.fields?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaCalendar className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-sm font-semibold text-gray-900">
                {dataset.createdAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FaTag className="text-orange-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Tags</p>
              <p className="text-2xl font-bold text-gray-900">
                {dataset.metadata?.tags?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Schema Section */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaTable />
                Schema Fields
              </h2>
            </div>
            <div className="p-6">
              {dataset.schema?.fields && dataset.schema.fields.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Field Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Required</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.schema.fields.map((field, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{field.name}</td>
                          <td className="py-3 px-4">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {field.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {field.required ? (
                              <span className="text-green-600 font-medium">Yes</span>
                            ) : (
                              <span className="text-gray-400">No</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {field.description || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No schema fields defined</p>
              )}
            </div>
          </div>

          {/* Records Table Section */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FaDatabase />
                Records ({recordCount})
              </h2>
              {loadingRecords && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              )}
            </div>
            <div className="p-6">
              {loadingRecords ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading records...</p>
                </div>
              ) : records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                        {dataset.schema?.fields?.slice(0, 5).map((field, idx) => (
                          <th key={idx} className="text-left py-3 px-4 font-semibold text-gray-700">
                            {field.name}
                          </th>
                        ))}
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((record, index) => (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-500">{index + 1}</td>
                          {dataset.schema?.fields?.slice(0, 5).map((field, idx) => (
                            <td key={idx} className="py-3 px-4 text-gray-900 max-w-[200px] truncate">
                              {record.data?.[field.name] || record[field.name] || '-'}
                            </td>
                          ))}
                          <td className="py-3 px-4 text-gray-500 text-xs">
                            {record.createdAt?.toLocaleDateString?.() || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {recordCount > 100 && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Showing 100 of {recordCount} records
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaTable className="text-4xl text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No records yet</p>
                  <p className="text-sm text-gray-400 mt-1">Records will appear here when form submissions are received</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Metadata */}
        <div className="space-y-6">
          {/* Dataset Info */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Dataset Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Source Application</p>
                <p className="font-medium text-gray-900">{dataset.sourceApplication}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="font-medium text-gray-900">
                  {dataset.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">
                  {dataset.updatedAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {dataset.metadata?.lastSync && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Sync</p>
                  <p className="font-medium text-gray-900">
                    {new Date(dataset.metadata.lastSync).toLocaleDateString()}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Visibility</p>
                <p className="font-medium text-gray-900">
                  {dataset.metadata?.isPublic ? (
                    <span className="text-green-600">Public</span>
                  ) : (
                    <span className="text-gray-600">Private</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {dataset.metadata?.tags && dataset.metadata.tags.length > 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {dataset.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-2">
              {/* Export - SuperAdmin & SuperUser */}
              {(userRole === 'SuperAdmin' || userRole === 'SuperUser') && (
                <button
                  onClick={handleExport}
                  disabled={exporting}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaDownload />
                  {exporting ? 'Exporting...' : 'Export Data'}
                </button>
              )}

              {/* Archive - SuperAdmin & SuperUser */}
              {(userRole === 'SuperAdmin' || userRole === 'SuperUser') && (
                <button
                  onClick={handleArchive}
                  disabled={archiving}
                  className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArchive />
                  {archiving ? 'Archiving...' : 'Archive Dataset'}
                </button>
              )}

              {/* Google Sheets - SuperAdmin & SuperUser */}
              {(userRole === 'SuperAdmin' || userRole === 'SuperUser') && (
                <button
                  onClick={handlePublishToGoogleSheets}
                  disabled={publishingToSheets}
                  className={`w-full ${googleSheetUrl ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'} text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <FaGoogle />
                  {publishingToSheets 
                    ? 'Publishing...' 
                    : googleSheetUrl 
                      ? <>Open Google Sheet <FaExternalLinkAlt className="text-xs" /></>
                      : 'Publish to Google Sheets'
                  }
                </button>
              )}
            </div>
          </div>

          {/* AI Features */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <FaRobot className="text-purple-600" />
              AI Data Features
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {userRole === 'SuperAdmin' 
                ? 'Advanced AI-powered data operations' 
                : 'Available as subscription service'}
            </p>
            <div className="space-y-2">
              {/* AI Data Merge */}
              <button
                onClick={() => handleAIFeature('merge')}
                disabled={!hasDataMerge}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                <FaMagic />
                AI Data Merge
                {!hasDataMerge && (
                  <FaLock className="absolute right-3 text-xs" />
                )}
              </button>

              {/* AI Reporting */}
              <button
                onClick={() => handleAIFeature('reporting')}
                disabled={!hasReporting}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                <FaChartLine />
                AI Reporting
                {!hasReporting && (
                  <FaLock className="absolute right-3 text-xs" />
                )}
              </button>

              {/* AI Data Analysis */}
              <button
                onClick={() => handleAIFeature('analysis')}
                disabled={!hasDataAnalysis}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                <FaDatabase />
                AI Data Analysis
                {!hasDataAnalysis && (
                  <FaLock className="absolute right-3 text-xs" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Subscription Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaRobot className="text-purple-600" />
              AI Feature Subscription
            </h3>
            <p className="text-gray-600 mb-6">
              {aiFeature === 'merge' && 'AI Data Merge intelligently combines multiple datasets using advanced algorithms to identify relationships and merge data seamlessly.'}
              {aiFeature === 'reporting' && 'AI Reporting generates comprehensive, insightful reports with data visualizations and automated analysis.'}
              {aiFeature === 'analysis' && 'AI Data Analysis uses machine learning to discover patterns, anomalies, and actionable insights in your data.'}
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-purple-900 font-semibold mb-2">Subscription Required</p>
              <p className="text-sm text-purple-800">
                This feature is available as a subscription service for SuperUsers. Contact your administrator to enable AI features.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAIModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowAIModal(false);
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
    </div>
  );
}

import { useState, useEffect } from 'react';
import { getDatasetForForm, getDatasetStats } from '@/lib/datahub-service';
import Link from 'next/link';

interface DatasetStatusBadgeProps {
  formId: string;
}

export default function DatasetStatusBadge({ formId }: DatasetStatusBadgeProps) {
  const [datasetId, setDatasetId] = useState<string | null>(null);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDatasetStatus();
  }, [formId]);

  const loadDatasetStatus = async () => {
    try {
      const id = await getDatasetForForm(formId);
      if (id) {
        setDatasetId(id);
        const stats = await getDatasetStats(id);
        if (stats) {
          setRecordCount(stats.recordCount);
        }
      }
    } catch (error) {
      console.error('Error loading dataset status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Checking...
      </span>
    );
  }

  if (!datasetId) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        No Dataset
      </span>
    );
  }

  return (
    <Link href={`/admin/datasets/${datasetId}`}>
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer transition-colors">
        <svg className="-ml-0.5 mr-1.5 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
        Dataset: {recordCount} records
      </span>
    </Link>
  );
}

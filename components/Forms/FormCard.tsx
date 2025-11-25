'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CustomForm } from '@/lib/firestore-schema';
import { FormTemplate, formTemplates } from '@/types/form';
import { 
  FaEdit, 
  FaTrash, 
  FaCopy, 
  FaQrcode, 
  FaEye, 
  FaChartBar,
  FaDatabase,
  FaFolder,
  FaTags,
  FaExternalLinkAlt
} from 'react-icons/fa';

interface FormCardProps {
  form: CustomForm & { 
    projectName?: string;
    projectColor?: string;
    datasetEnabled?: boolean;
    datasetId?: string;
  };
  onEdit: (form: CustomForm) => void;
  onDuplicate: (form: CustomForm) => void;
  onDelete: (formId: string) => void;
  onGenerateQR: (formId: string) => void;
  onAssignProject: (formId: string) => void;
  generatingQR?: boolean;
}

export default function FormCard({
  form,
  onEdit,
  onDuplicate,
  onDelete,
  onGenerateQR,
  onAssignProject,
  generatingQR = false
}: FormCardProps) {
  const [showQR, setShowQR] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 overflow-hidden">
      {/* Header with Status and Project */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{form.title}</h3>
              {form.published ? (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Published
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Draft
                </span>
              )}
            </div>

            {/* Project Badge */}
            {form.projectName ? (
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => onAssignProject(form.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium hover:opacity-80 transition-opacity"
                  style={{ 
                    backgroundColor: `${form.projectColor}20`,
                    color: form.projectColor || '#6B7280'
                  }}
                >
                  <FaFolder className="text-xs" />
                  {form.projectName}
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAssignProject(form.id)}
                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary transition-colors mb-2"
              >
                <FaFolder />
                Assign to Project
              </button>
            )}

            <p className="text-gray-600 text-sm line-clamp-2">{form.description}</p>
          </div>

          {/* Template Badge */}
          {form.template && form.template !== 'custom' && (
            <span className="inline-flex items-center bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full ml-4">
              {formTemplates[form.template as FormTemplate]?.name}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{form.fields.length}</div>
            <div className="text-xs text-gray-600 mt-1">Fields</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{form.submissionCount || 0}</div>
            <div className="text-xs text-gray-600 mt-1">Submissions</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {form.qrCode ? '✓' : '—'}
            </div>
            <div className="text-xs text-gray-600 mt-1">QR Code</div>
          </div>
        </div>

        {/* Integration Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {form.datasetEnabled && form.datasetId && (
            <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
              <FaDatabase className="text-xs" />
              DataHub Enabled
            </span>
          )}
          {form.allowMultipleSubmissions && (
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-full">
              Multiple Submissions
            </span>
          )}
          {form.requiresAuth && (
            <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-medium px-2.5 py-1 rounded-full">
              Auth Required
            </span>
          )}
        </div>

        {/* Public URL */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 mb-1">Public URL</p>
              <p className="text-sm text-gray-700 font-mono truncate">{form.publicUrl}</p>
            </div>
            <Link
              href={`/forms/public/${form.id}`}
              target="_blank"
              className="ml-3 text-primary hover:text-primary/80 flex-shrink-0"
            >
              <FaExternalLinkAlt />
            </Link>
          </div>
        </div>

        {/* QR Code Display */}
        {form.qrCode && showQR && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center">
            <img 
              src={form.qrCode} 
              alt="Form QR Code" 
              className="w-48 h-48 mx-auto border-2 border-gray-300 rounded-lg shadow-sm" 
            />
            <a
              href={form.qrCode}
              download={`${form.slug}-qr-code.png`}
              className="inline-block mt-3 text-sm text-primary hover:underline font-medium"
            >
              Download QR Code
            </a>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/forms/public/${form.id}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
          >
            <FaEye />
            View Form
          </Link>

          <Link
            href={`/admin/forms/submissions/${form.id}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition-colors"
          >
            <FaChartBar />
            Submissions ({form.submissionCount || 0})
          </Link>

          <button
            onClick={() => onEdit(form)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            <FaEdit />
            Edit
          </button>

          <button
            onClick={() => onDuplicate(form)}
            className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
          >
            <FaCopy />
            Duplicate
          </button>

          {form.qrCode ? (
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
            >
              <FaQrcode />
              {showQR ? 'Hide QR' : 'Show QR'}
            </button>
          ) : (
            <button
              onClick={() => onGenerateQR(form.id)}
              disabled={generatingQR}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaQrcode />
              {generatingQR ? 'Generating...' : 'Generate QR'}
            </button>
          )}

          <button
            onClick={() => onDelete(form.id)}
            className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors ml-auto"
          >
            <FaTrash />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

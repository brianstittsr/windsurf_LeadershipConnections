'use client';

import { useState } from 'react';
import { FaRobot, FaTimes, FaSpinner, FaCheck, FaQrcode, FaFilePdf } from 'react-icons/fa';
import { FormField } from '@/types/form';
import QRCode from 'qrcode';

interface AIFormBuilderWizardProps {
  onClose: () => void;
  onFormGenerated: (formData: {
    title: string;
    description: string;
    fields: FormField[];
    published: boolean;
    purpose: string;
    outcomes: string;
  }) => void;
}

const WIZARD_STEPS = [
  { id: 1, title: 'Describe Form', description: 'Tell us what form you need' },
  { id: 2, title: 'Purpose & Outcomes', description: 'Define data collection goals' },
  { id: 3, title: 'Review & Settings', description: 'Finalize form details' },
  { id: 4, title: 'QR Code & PDF', description: 'Generate promotional materials' },
];

export default function AIFormBuilderWizard({ onClose, onFormGenerated }: AIFormBuilderWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [formDescription, setFormDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [generatedForm, setGeneratedForm] = useState<{
    title: string;
    description: string;
    fields: FormField[];
  } | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [programName, setProgramName] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [generatingQR, setGeneratingQR] = useState(false);

  const handleGenerateForm = async () => {
    setGenerating(true);
    try {
      // Call AI API to generate form
      const response = await fetch('/api/ai/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formDescription,
          purpose,
          outcomes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate form');
      }

      const data = await response.json();
      setGeneratedForm(data);
      setCurrentStep(3);
    } catch (error) {
      console.error('Error generating form:', error);
      alert('Error generating form. Please try again or check your AI API configuration.');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateQRCode = async () => {
    if (!generatedForm) return;
    
    setGeneratingQR(true);
    try {
      // Generate QR code for the form URL
      const formUrl = `${window.location.origin}/forms/public/temp-form-id`;
      const qrDataUrl = await QRCode.toDataURL(formUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code.');
    } finally {
      setGeneratingQR(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedForm || !qrCodeUrl) return;

    // Create a printable page
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${programName || 'Form'} - ${generatedForm.title}</title>
          <style>
            @page {
              size: letter;
              margin: 1in;
            }
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
              margin: 0;
            }
            .header {
              margin-bottom: 40px;
            }
            .program-name {
              font-size: 28px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .form-name {
              font-size: 24px;
              color: #666;
              margin-bottom: 40px;
            }
            .qr-container {
              margin: 60px auto;
            }
            .qr-code {
              width: 400px;
              height: 400px;
              margin: 0 auto;
            }
            .instructions {
              font-size: 18px;
              color: #444;
              margin-top: 40px;
              line-height: 1.6;
            }
            .url {
              font-size: 14px;
              color: #888;
              margin-top: 20px;
              word-break: break-all;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="program-name">${programName || 'Leadership Connections'}</div>
            <div class="form-name">${generatedForm.title}</div>
          </div>
          
          <div class="qr-container">
            <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
          </div>
          
          <div class="instructions">
            <p><strong>Scan this QR code with your smartphone camera to access the form</strong></p>
            <p>${generatedForm.description}</p>
          </div>
          
          <div class="url">
            ${window.location.origin}/forms/public/[form-id]
          </div>
          
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleComplete = () => {
    if (!generatedForm) return;

    onFormGenerated({
      ...generatedForm,
      published: isPublic,
      purpose,
      outcomes,
    });
    onClose();
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Describe the form you want to create
        </label>
        <textarea
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Example: I need a volunteer registration form that collects name, email, phone, availability, skills, and areas of interest. Include emergency contact information and any dietary restrictions."
        />
        <p className="text-xs text-gray-500 mt-2">
          Be as specific as possible. Include field types, required information, and any special requirements.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => setCurrentStep(2)}
          disabled={!formDescription.trim()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Purpose & Outcomes
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What is the purpose of this data collection?
        </label>
        <textarea
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Example: To recruit and organize volunteers for our annual community service day. We need to match volunteers with appropriate tasks based on their skills and availability."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          What outcomes should this data collection measure?
        </label>
        <textarea
          value={outcomes}
          onChange={(e) => setOutcomes(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Example: Track volunteer participation rates, skill distribution, preferred time slots, geographic coverage, and volunteer satisfaction. Measure year-over-year growth in volunteer engagement."
        />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateForm}
            disabled={!purpose.trim() || !outcomes.trim() || generating}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {generating ? (
              <>
                <FaSpinner className="animate-spin" />
                Generating Form...
              </>
            ) : (
              <>
                <FaRobot />
                Generate Form with AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      {generatedForm && (
        <>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <FaCheck className="text-green-600 mt-1" />
            <div>
              <p className="font-semibold text-green-900">Form Generated Successfully!</p>
              <p className="text-sm text-green-700 mt-1">Review the form details below and adjust settings as needed.</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Form Title</label>
            <input
              type="text"
              value={generatedForm.title}
              onChange={(e) => setGeneratedForm({ ...generatedForm, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={generatedForm.description}
              onChange={(e) => setGeneratedForm({ ...generatedForm, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Generated Fields ({generatedForm.fields.length})
            </label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-60 overflow-y-auto">
              {generatedForm.fields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <div>
                    <span className="font-medium text-gray-900">{field.label}</span>
                    <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                    {field.required && (
                      <span className="text-xs text-red-600 ml-2">*Required</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Form Settings</label>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              <span className="text-sm">Make form publicly accessible</span>
            </label>
            <p className="text-xs text-gray-600 ml-6">
              {isPublic 
                ? 'Anyone with the link can access and submit this form'
                : 'Only authenticated users can access this form'}
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Form Now
              </button>
              <button
                onClick={() => {
                  setCurrentStep(4);
                  handleGenerateQRCode();
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
              >
                <FaQrcode />
                Generate QR & PDF
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="font-semibold text-purple-900 mb-2">Promotional Materials</h3>
        <p className="text-sm text-purple-700">
          Generate a QR code and printable PDF poster to promote your form at events and locations.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Program/Event Name (Optional)
        </label>
        <input
          type="text"
          value={programName}
          onChange={(e) => setProgramName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900"
          placeholder="e.g., Leadership Connections Annual Gala"
        />
        <p className="text-xs text-gray-500 mt-1">
          This will appear at the top of your printable poster
        </p>
      </div>

      {qrCodeUrl ? (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
          <h4 className="font-semibold text-gray-900 mb-4">Your QR Code</h4>
          <img src={qrCodeUrl} alt="Form QR Code" className="w-64 h-64 mx-auto border border-gray-300 rounded" />
          <div className="mt-4 space-y-2">
            <a
              href={qrCodeUrl}
              download={`${generatedForm?.title || 'form'}-qr-code.png`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
            >
              Download QR Code
            </a>
            <button
              onClick={handleDownloadPDF}
              className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 mx-auto"
            >
              <FaFilePdf />
              Generate Printable PDF Poster
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <FaSpinner className="animate-spin text-4xl text-primary mx-auto mb-4" />
          <p className="text-gray-600">Generating QR Code...</p>
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-900 mb-2">📊 Automatic Tracking Enabled</h4>
        <p className="text-sm text-yellow-700 mb-2">
          This form will automatically track the following metrics for research and analysis:
        </p>
        <ul className="text-sm text-yellow-700 space-y-1 ml-4">
          <li>• Device type (mobile, tablet, desktop)</li>
          <li>• Browser information</li>
          <li>• Approximate location (city/region)</li>
          <li>• Time zone</li>
          <li>• Submission timestamp</li>
          <li>• Referral source</li>
        </ul>
        <p className="text-xs text-yellow-600 mt-2">
          Note: This data is collected for analytics only and is not displayed to form users.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(3)}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleComplete}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FaCheck />
          Complete & Create Form
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FaRobot className="text-3xl" />
                <h2 className="text-2xl font-bold">AI Form Builder Wizard</h2>
              </div>
              <p className="text-white/90">Let AI create your perfect form in minutes</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            {WIZARD_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                      currentStep > step.id
                        ? 'bg-green-500 text-white'
                        : currentStep === step.id
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? <FaCheck /> : step.id}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-semibold ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < WIZARD_STEPS.length - 1 && (
                  <div className={`h-1 flex-1 mx-2 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {WIZARD_STEPS[currentStep - 1].title}
            </h3>
            <p className="text-gray-600">
              {WIZARD_STEPS[currentStep - 1].description}
            </p>
          </div>

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
}

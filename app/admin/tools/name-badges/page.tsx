'use client';

import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { FaIdBadge, FaDownload, FaArrowLeft, FaEye, FaDatabase, FaPlus, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

interface Dataset {
  id: string;
  name: string;
  schema: {
    fields: Array<{
      name: string;
      label: string;
      type: string;
    }>;
  };
  metadata: {
    recordCount: number;
  };
}

interface DatasetRecord {
  id: string;
  data: Record<string, any>;
}

interface BadgeName {
  id: string;
  name: string;
  title?: string;
  organization?: string;
}

// Avery 5395 Template Specifications
const AVERY_5395 = {
  pageWidth: 215.9, // 8.5" in mm
  pageHeight: 279.4, // 11" in mm
  badgeWidth: 85.725, // 3-3/8" in mm
  badgeHeight: 59.267, // 2-1/3" in mm
  marginTop: 12.7, // Top margin
  marginLeft: 15.875, // Left margin
  columns: 2,
  rows: 4,
  horizontalGap: 12.7, // Gap between columns
  verticalGap: 0, // No vertical gap for this template
};

export default function NameBadgeCreator() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [records, setRecords] = useState<DatasetRecord[]>([]);
  const [nameField, setNameField] = useState<string>('');
  const [titleField, setTitleField] = useState<string>('');
  const [organizationField, setOrganizationField] = useState<string>('');
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [manualNames, setManualNames] = useState<BadgeName[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [includeTitle, setIncludeTitle] = useState(true);
  const [includeOrganization, setIncludeOrganization] = useState(true);

  // Load datasets and logo
  useEffect(() => {
    fetchDatasets();
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const response = await fetch('/images/logo/LeadershipConnectionsLogo.png');
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const fetchDatasets = async () => {
    try {
      const response = await fetch('/api/datasets');
      const data = await response.json();
      setDatasets(data.datasets || []);
    } catch (error) {
      console.error('Error fetching datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecords = async (datasetId: string) => {
    setLoadingRecords(true);
    try {
      const response = await fetch(`/api/datasets/${datasetId}/records?pageSize=500`);
      const data = await response.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleDatasetChange = (datasetId: string) => {
    setSelectedDataset(datasetId);
    setSelectedRecords(new Set());
    setNameField('');
    setTitleField('');
    setOrganizationField('');
    
    if (datasetId) {
      fetchRecords(datasetId);
    } else {
      setRecords([]);
    }
  };

  const getSelectedDatasetFields = () => {
    const dataset = datasets.find(d => d.id === selectedDataset);
    return dataset?.schema?.fields || [];
  };

  const toggleRecordSelection = (recordId: string) => {
    const newSelection = new Set(selectedRecords);
    if (newSelection.has(recordId)) {
      newSelection.delete(recordId);
    } else {
      newSelection.add(recordId);
    }
    setSelectedRecords(newSelection);
  };

  const selectAllRecords = () => {
    if (selectedRecords.size === records.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(records.map(r => r.id)));
    }
  };

  const addManualName = () => {
    setManualNames([
      ...manualNames,
      { id: `manual-${Date.now()}`, name: '', title: '', organization: '' }
    ]);
  };

  const updateManualName = (id: string, field: keyof BadgeName, value: string) => {
    setManualNames(manualNames.map(n => 
      n.id === id ? { ...n, [field]: value } : n
    ));
  };

  const removeManualName = (id: string) => {
    setManualNames(manualNames.filter(n => n.id !== id));
  };

  const getBadgeNames = (): BadgeName[] => {
    const names: BadgeName[] = [];

    // Add names from selected dataset records
    if (selectedDataset && nameField) {
      records
        .filter(r => selectedRecords.has(r.id))
        .forEach(record => {
          names.push({
            id: record.id,
            name: record.data[nameField] || '',
            title: titleField ? record.data[titleField] : undefined,
            organization: organizationField ? record.data[organizationField] : undefined,
          });
        });
    }

    // Add manual names
    manualNames
      .filter(n => n.name.trim())
      .forEach(n => names.push(n));

    return names;
  };

  const generatePDF = async () => {
    const names = getBadgeNames();
    if (names.length === 0) {
      alert('Please select names from a dataset or add manual names.');
      return;
    }

    setGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const badgesPerPage = AVERY_5395.columns * AVERY_5395.rows;
      let badgeIndex = 0;

      for (let i = 0; i < names.length; i++) {
        // Add new page if needed
        if (badgeIndex > 0 && badgeIndex % badgesPerPage === 0) {
          doc.addPage();
        }

        const pageIndex = badgeIndex % badgesPerPage;
        const col = pageIndex % AVERY_5395.columns;
        const row = Math.floor(pageIndex / AVERY_5395.columns);

        const x = AVERY_5395.marginLeft + col * (AVERY_5395.badgeWidth + AVERY_5395.horizontalGap);
        const y = AVERY_5395.marginTop + row * (AVERY_5395.badgeHeight + AVERY_5395.verticalGap);

        drawBadge(doc, names[i], x, y);
        badgeIndex++;
      }

      // Save the PDF
      const filename = `name_badges_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const drawBadge = (doc: jsPDF, badge: BadgeName, x: number, y: number) => {
    const { badgeWidth, badgeHeight } = AVERY_5395;
    const centerX = x + badgeWidth / 2;
    const padding = 5;

    // Draw badge border (light, for cutting guide)
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.rect(x, y, badgeWidth, badgeHeight);

    // Add logo at top center
    const logoWidth = 25;
    const logoHeight = 17;
    const logoY = y + 5;
    
    if (logoBase64) {
      doc.addImage(logoBase64, 'PNG', centerX - logoWidth / 2, logoY, logoWidth, logoHeight);
    }

    // Name - large and bold
    const nameY = logoY + logoHeight + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    
    const nameLines = doc.splitTextToSize(badge.name, badgeWidth - padding * 2);
    doc.text(nameLines, centerX, nameY, { align: 'center' });

    // Title (if included and available)
    let currentY = nameY + (nameLines.length * 6);
    
    if (includeTitle && badge.title) {
      currentY += 3;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const titleLines = doc.splitTextToSize(badge.title, badgeWidth - padding * 2);
      doc.text(titleLines, centerX, currentY, { align: 'center' });
      currentY += titleLines.length * 4;
    }

    // Organization (if included and available)
    if (includeOrganization && badge.organization) {
      currentY += 2;
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      const orgLines = doc.splitTextToSize(badge.organization, badgeWidth - padding * 2);
      doc.text(orgLines, centerX, currentY, { align: 'center' });
    }
  };

  const badgeNames = getBadgeNames();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/tools"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back to Tools
        </Link>
        <div className="flex items-center gap-3">
          <FaIdBadge className="text-3xl text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Name Badge Creator</h1>
            <p className="text-gray-600">Create name badges using Avery 5395 template (8 per sheet)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          {/* Dataset Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaDatabase className="text-primary" />
              Select from Dataset
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dataset
                </label>
                <select
                  value={selectedDataset}
                  onChange={(e) => handleDatasetChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary"
                  disabled={loading}
                >
                  <option value="">Select a dataset...</option>
                  {datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name} ({dataset.metadata?.recordCount || 0} records)
                    </option>
                  ))}
                </select>
              </div>

              {selectedDataset && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name Field <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={nameField}
                        onChange={(e) => setNameField(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm"
                      >
                        <option value="">Select field...</option>
                        {getSelectedDatasetFields().map((field) => (
                          <option key={field.name} value={field.name}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title Field
                      </label>
                      <select
                        value={titleField}
                        onChange={(e) => setTitleField(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm"
                      >
                        <option value="">None</option>
                        {getSelectedDatasetFields().map((field) => (
                          <option key={field.name} value={field.name}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Field
                      </label>
                      <select
                        value={organizationField}
                        onChange={(e) => setOrganizationField(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 text-sm"
                      >
                        <option value="">None</option>
                        {getSelectedDatasetFields().map((field) => (
                          <option key={field.name} value={field.name}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Record Selection */}
                  {nameField && (
                    <div className="border border-gray-200 rounded-lg">
                      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          Select Names ({selectedRecords.size} of {records.length} selected)
                        </span>
                        <button
                          onClick={selectAllRecords}
                          className="text-sm text-primary hover:underline"
                        >
                          {selectedRecords.size === records.length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="max-h-48 overflow-y-auto p-2">
                        {loadingRecords ? (
                          <p className="text-center text-gray-500 py-4">Loading records...</p>
                        ) : records.length === 0 ? (
                          <p className="text-center text-gray-500 py-4">No records found</p>
                        ) : (
                          <div className="space-y-1">
                            {records.map((record) => (
                              <label
                                key={record.id}
                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRecords.has(record.id)}
                                  onChange={() => toggleRecordSelection(record.id)}
                                  className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="text-sm text-gray-900">
                                  {record.data[nameField] || '(No name)'}
                                </span>
                                {titleField && record.data[titleField] && (
                                  <span className="text-xs text-gray-500">
                                    - {record.data[titleField]}
                                  </span>
                                )}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Manual Names */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Manual Entry</h2>
              <button
                onClick={addManualName}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 flex items-center gap-1"
              >
                <FaPlus className="text-xs" />
                Add Name
              </button>
            </div>

            {manualNames.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No manual names added. Click "Add Name" to enter names manually.
              </p>
            ) : (
              <div className="space-y-3">
                {manualNames.map((entry) => (
                  <div key={entry.id} className="flex gap-2 items-start">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={entry.name}
                        onChange={(e) => updateManualName(entry.id, 'name', e.target.value)}
                        placeholder="Name *"
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                      />
                      <input
                        type="text"
                        value={entry.title || ''}
                        onChange={(e) => updateManualName(entry.id, 'title', e.target.value)}
                        placeholder="Title"
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                      />
                      <input
                        type="text"
                        value={entry.organization || ''}
                        onChange={(e) => updateManualName(entry.id, 'organization', e.target.value)}
                        placeholder="Organization"
                        className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeManualName(entry.id)}
                      className="text-red-500 hover:text-red-700 p-1.5"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options & Generate */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Options</h2>
            
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeTitle}
                  onChange={(e) => setIncludeTitle(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Include title on badges</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={includeOrganization}
                  onChange={(e) => setIncludeOrganization(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Include organization on badges</span>
              </label>
            </div>

            <button
              onClick={generatePDF}
              disabled={badgeNames.length === 0 || generating}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaDownload />
              {generating ? 'Generating PDF...' : `Generate ${badgeNames.length} Badge${badgeNames.length !== 1 ? 's' : ''}`}
            </button>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Template Info:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Avery 5395 Adhesive Name Badges</li>
                <li>• 2-1/3" x 3-3/8" badges</li>
                <li>• 8 badges per sheet (2 columns × 4 rows)</li>
                <li>• Letter size (8.5" x 11")</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaEye className="text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
          </div>
          
          {/* Single Badge Preview */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 mb-4">
            <p className="text-xs text-gray-500 mb-2 text-center">Badge Preview (actual size: 2-1/3" × 3-3/8")</p>
            <div 
              className="mx-auto bg-white border border-gray-200 rounded shadow-sm flex flex-col items-center justify-center p-4"
              style={{ width: '200px', height: '140px' }}
            >
              {/* Logo */}
              <div className="mb-2">
                <Image
                  src="/images/logo/LeadershipConnectionsLogo.png"
                  alt="Logo"
                  width={60}
                  height={40}
                  className="object-contain"
                />
              </div>
              
              {/* Name */}
              <p className="text-lg font-bold text-gray-900 text-center">
                {badgeNames[0]?.name || 'John Doe'}
              </p>
              
              {/* Title */}
              {includeTitle && (
                <p className="text-sm text-gray-600 text-center">
                  {badgeNames[0]?.title || 'Job Title'}
                </p>
              )}
              
              {/* Organization */}
              {includeOrganization && (
                <p className="text-xs text-gray-500 italic text-center">
                  {badgeNames[0]?.organization || 'Organization'}
                </p>
              )}
            </div>
          </div>

          {/* Names List */}
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Names to Print ({badgeNames.length})
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {badgeNames.length === 0 ? (
                <p className="text-center text-gray-500 py-4 text-sm">
                  No names selected. Select from a dataset or add manually.
                </p>
              ) : (
                <div className="space-y-1">
                  {badgeNames.map((badge, index) => (
                    <div key={badge.id} className="text-sm p-2 bg-gray-50 rounded">
                      <span className="text-gray-400 mr-2">{index + 1}.</span>
                      <span className="font-medium text-gray-900">{badge.name}</span>
                      {badge.title && <span className="text-gray-500"> - {badge.title}</span>}
                      {badge.organization && <span className="text-gray-400 italic"> ({badge.organization})</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">
            {badgeNames.length > 0 && (
              <>Will generate {Math.ceil(badgeNames.length / 8)} page{Math.ceil(badgeNames.length / 8) !== 1 ? 's' : ''}</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

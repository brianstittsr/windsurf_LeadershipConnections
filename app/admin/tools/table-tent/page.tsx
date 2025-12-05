'use client';

import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { FaPrint, FaDownload, FaArrowLeft, FaEye } from 'react-icons/fa';
import Link from 'next/link';

export default function TableTentCreator() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    setGenerating(true);
    try {
      // Create PDF in landscape for table tent (folds in half)
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'letter' // 279.4 x 215.9 mm
      });

      const pageWidth = 279.4;
      const pageHeight = 215.9;
      const halfHeight = pageHeight / 2;

      // Colors
      const primaryColor = [74, 108, 247]; // #4A6CF7
      const darkColor = [30, 41, 59]; // Slate-800

      // Draw fold line (dashed)
      doc.setDrawColor(200, 200, 200);
      doc.setLineDashPattern([3, 3], 0);
      doc.line(0, halfHeight, pageWidth, halfHeight);
      doc.setLineDashPattern([], 0);

      // ===== TOP HALF (will be back when folded) =====
      // This shows when tent is standing, facing away

      // Draw LC Logo placeholder area (left side of top half)
      const logoX = 20;
      const logoY = 20;
      const logoWidth = 60;
      const logoHeight = 40;

      // Logo background
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(logoX, logoY, logoWidth, logoHeight, 5, 5, 'F');

      // Logo text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('LEADERSHIP', logoX + logoWidth / 2, logoY + 15, { align: 'center' });
      doc.setFontSize(10);
      doc.text('C.O.N.N.E.C.T.I.O.N.S.', logoX + logoWidth / 2, logoY + 25, { align: 'center' });

      // Title and subtitle on right side (top half)
      const textX = logoX + logoWidth + 30;
      const textMaxWidth = pageWidth - textX - 20;

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      
      // Word wrap title
      const titleLines = doc.splitTextToSize(title || 'Your Title Here', textMaxWidth);
      doc.text(titleLines, textX, logoY + 15);

      // Subtitle
      if (subtitle) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        const subtitleLines = doc.splitTextToSize(subtitle, textMaxWidth);
        const titleHeight = titleLines.length * 10;
        doc.text(subtitleLines, textX, logoY + 15 + titleHeight + 5);
      }

      // ===== BOTTOM HALF (will be front when folded) =====
      // This is upside down so it reads correctly when tent is standing

      // Save state and rotate for upside-down text
      const bottomY = halfHeight + 10;

      // Draw LC Logo (left side of bottom half, upside down)
      const bottomLogoX = pageWidth - logoX - logoWidth;
      const bottomLogoY = pageHeight - logoY - logoHeight;

      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(bottomLogoX, bottomLogoY, logoWidth, logoHeight, 5, 5, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      
      // For upside down text, we need to position from bottom-right
      doc.text('LEADERSHIP', bottomLogoX + logoWidth / 2, bottomLogoY + logoHeight - 15, { align: 'center', angle: 180 });
      doc.setFontSize(10);
      doc.text('C.O.N.N.E.C.T.I.O.N.S.', bottomLogoX + logoWidth / 2, bottomLogoY + logoHeight - 25, { align: 'center', angle: 180 });

      // Title and subtitle (bottom half, upside down)
      const bottomTextX = bottomLogoX - 30;

      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      
      // For upside down, position from right side
      const bottomTitleLines = doc.splitTextToSize(title || 'Your Title Here', textMaxWidth);
      doc.text(bottomTitleLines, bottomTextX, bottomLogoY + logoHeight - 15, { align: 'right', angle: 180 });

      if (subtitle) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        doc.setTextColor(100, 100, 100);
        const bottomSubtitleLines = doc.splitTextToSize(subtitle, textMaxWidth);
        const titleHeight = bottomTitleLines.length * 10;
        doc.text(bottomSubtitleLines, bottomTextX, bottomLogoY + logoHeight - 15 - titleHeight - 5, { align: 'right', angle: 180 });
      }

      // Add fold instructions at the bottom
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Fold along dashed line. Both sides will display when tent is standing.', pageWidth / 2, halfHeight - 3, { align: 'center' });
      doc.text('Print on cardstock for best results.', pageWidth / 2, halfHeight + 5, { align: 'center', angle: 180 });

      // Save the PDF
      const filename = `table_tent_${(title || 'untitled').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
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
          <FaPrint className="text-3xl text-purple-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Table Tent Creator</h1>
            <p className="text-gray-600">Create Leadership Connections branded table tents</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customize Your Table Tent</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Welcome to Leadership Day"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle (optional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g., Building Tomorrow's Leaders Today"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-primary focus:border-primary"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 mt-1">{subtitle.length}/150 characters</p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={generatePDF}
                disabled={!title.trim() || generating}
                className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaDownload />
                {generating ? 'Generating PDF...' : 'Download Table Tent PDF'}
              </button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Printing Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Print on cardstock (65-110 lb) for durability</li>
                <li>• Use landscape orientation</li>
                <li>• Fold along the dashed line in the center</li>
                <li>• Both sides display the same content</li>
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
          
          <div 
            ref={previewRef}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 aspect-[11/8.5]"
          >
            {/* Preview of one side of the tent */}
            <div className="h-full flex items-center">
              {/* Logo */}
              <div className="bg-primary rounded-lg p-4 text-white text-center mr-6 flex-shrink-0">
                <div className="font-bold text-sm">LEADERSHIP</div>
                <div className="text-xs">C.O.N.N.E.C.T.I.O.N.S.</div>
              </div>
              
              {/* Text content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {title || 'Your Title Here'}
                </h3>
                {subtitle && (
                  <p className="text-gray-600">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            This preview shows one side of the table tent. The PDF will include both sides for folding.
          </p>
        </div>
      </div>
    </div>
  );
}

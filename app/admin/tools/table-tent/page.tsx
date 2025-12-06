'use client';

import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { FaPrint, FaDownload, FaArrowLeft, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function TableTentCreator() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [generating, setGenerating] = useState(false);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Load logo as base64 for PDF embedding
  useEffect(() => {
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
    loadLogo();
  }, []);

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
      const centerX = pageWidth / 2;

      // Colors
      const darkColor = [30, 41, 59]; // Slate-800
      const subtitleColor = [100, 100, 100];

      // Draw fold line (dashed)
      doc.setDrawColor(200, 200, 200);
      doc.setLineDashPattern([3, 3], 0);
      doc.line(0, halfHeight, pageWidth, halfHeight);
      doc.setLineDashPattern([], 0);

      // Logo dimensions (reduced by 80% - now 20% of original size)
      const logoWidth = 20;
      const logoHeight = 14;

      // ===== TOP HALF (will be back when folded) =====
      const topLogoY = 10;
      const topTitleY = topLogoY + logoHeight + 8;
      const textMaxWidth = pageWidth - 40;

      // Add logo centered at top
      if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', centerX - logoWidth / 2, topLogoY, logoWidth, logoHeight);
      }

      // Title - large and centered
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      
      const titleLines = doc.splitTextToSize(title || 'Your Title Here', textMaxWidth);
      doc.text(titleLines, centerX, topTitleY, { align: 'center' });

      // Subtitle - smaller, centered below title
      if (subtitle) {
        const titleHeight = titleLines.length * 12;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(20);
        doc.setTextColor(subtitleColor[0], subtitleColor[1], subtitleColor[2]);
        const subtitleLines = doc.splitTextToSize(subtitle, textMaxWidth);
        doc.text(subtitleLines, centerX, topTitleY + titleHeight + 5, { align: 'center' });
      }

      // ===== BOTTOM HALF (will be front when folded) =====
      // This is upside down so it reads correctly when tent is standing
      const bottomLogoY = pageHeight - topLogoY - logoHeight;
      const bottomTitleY = bottomLogoY - 12;

      // Add logo centered (upside down position)
      if (logoBase64) {
        // For upside down, we position from the rotated perspective
        doc.addImage(logoBase64, 'PNG', centerX - logoWidth / 2, bottomLogoY, logoWidth, logoHeight);
      }

      // Title - upside down
      doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(36);
      
      const bottomTitleLines = doc.splitTextToSize(title || 'Your Title Here', textMaxWidth);
      doc.text(bottomTitleLines, centerX, bottomTitleY, { align: 'center', angle: 180 });

      // Subtitle - upside down
      if (subtitle) {
        const titleHeight = bottomTitleLines.length * 12;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(20);
        doc.setTextColor(subtitleColor[0], subtitleColor[1], subtitleColor[2]);
        const bottomSubtitleLines = doc.splitTextToSize(subtitle, textMaxWidth);
        doc.text(bottomSubtitleLines, centerX, bottomTitleY - titleHeight - 5, { align: 'center', angle: 180 });
      }

      // Add fold instructions
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('Fold along dashed line. Both sides will display when tent is standing.', centerX, halfHeight - 3, { align: 'center' });
      doc.text('Print on cardstock for best results.', centerX, halfHeight + 5, { align: 'center', angle: 180 });

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
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 aspect-[11/8.5] flex flex-col items-center justify-center"
          >
            {/* Logo centered at top (small - 20% of original) */}
            <div className="mb-2">
              <Image
                src="/images/logo/LeadershipConnectionsLogo.png"
                alt="Leadership Connections Logo"
                width={40}
                height={28}
                className="object-contain"
              />
            </div>
            
            {/* Title - large and centered */}
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-2 leading-tight">
              {title || 'Your Title Here'}
            </h3>
            
            {/* Subtitle - optional */}
            {subtitle && (
              <p className="text-xl text-gray-600 text-center leading-tight">{subtitle}</p>
            )}
          </div>
          
          <p className="text-xs text-gray-500 mt-3 text-center">
            This preview shows one side of the table tent. The PDF will include both sides for folding.
          </p>
        </div>
      </div>
    </div>
  );
}

import { jsPDF } from 'jspdf';
import { generateFormQRCode, generateFormPublicUrl } from './qrcode-utils';

/**
 * Survey Poster Generator
 * 
 * Creates a printable poster with:
 * - Form name centered at top
 * - Large QR code centered on page
 * - Scan instructions at bottom
 * 
 * Designed for posting so people can easily scan from a distance
 */

interface SurveyPosterConfig {
  formId: string;
  formTitle: string;
  qrCode?: string;
  includeUrl?: boolean;
  includeInstructions?: boolean;
}

/**
 * Generate a survey poster PDF
 */
export async function generateSurveyPosterPDF(config: SurveyPosterConfig): Promise<void> {
  const { formId, formTitle, includeUrl = true, includeInstructions = true } = config;
  
  // Generate QR code if not provided
  let qrCode = config.qrCode;
  if (!qrCode) {
    qrCode = await generateFormQRCode(formId);
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter' // 215.9 x 279.4 mm
  });

  const pageWidth = 215.9;
  const pageHeight = 279.4;
  const centerX = pageWidth / 2;

  // Colors
  const primaryColor = [74, 108, 247]; // #4A6CF7
  const darkColor = [30, 41, 59]; // Slate-800
  const grayColor = [100, 100, 100];

  // ===== HEADER - Form Title =====
  const titleY = 40;
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
  
  // Wrap title if needed
  const titleMaxWidth = pageWidth - 40;
  const titleLines = doc.splitTextToSize(formTitle, titleMaxWidth);
  doc.text(titleLines, centerX, titleY, { align: 'center' });

  // ===== QR CODE - Large and Centered =====
  const qrSize = 140; // Large QR code (about 5.5 inches)
  const qrY = 75;
  const qrX = centerX - qrSize / 2;

  // Add QR code
  if (qrCode) {
    doc.addImage(qrCode, 'PNG', qrX, qrY, qrSize, qrSize);
  }

  // ===== SCAN INSTRUCTIONS =====
  if (includeInstructions) {
    const instructionY = qrY + qrSize + 15;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Scan to Fill Out Form', centerX, instructionY, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text('Point your smartphone camera at the QR code', centerX, instructionY + 12, { align: 'center' });
  }

  // ===== URL (optional) =====
  if (includeUrl) {
    const urlY = pageHeight - 25;
    const formUrl = generateFormPublicUrl(formId);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(formUrl, centerX, urlY, { align: 'center' });
  }

  // ===== FOOTER - Branding =====
  const footerY = pageHeight - 12;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Powered by Leadership Connections', centerX, footerY, { align: 'center' });

  // Save the PDF
  const filename = `survey_poster_${formTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
  doc.save(filename);
}

/**
 * Generate survey poster with custom options
 */
export async function downloadSurveyPoster(
  formId: string, 
  formTitle: string, 
  existingQRCode?: string
): Promise<void> {
  await generateSurveyPosterPDF({
    formId,
    formTitle,
    qrCode: existingQRCode,
    includeUrl: true,
    includeInstructions: true
  });
}

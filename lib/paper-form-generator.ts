import { jsPDF } from 'jspdf';
import { FormField } from '@/types/form';

/**
 * Paper Form Generator
 * 
 * Generates OCR-optimized PDF forms designed for:
 * - AI handwriting recognition
 * - Easy scanning with document scanners or smartphone cameras
 * - Single-page layout for efficient processing
 * 
 * Best Practices for Handwriting Recognition:
 * 1. Use high-contrast black borders on white background
 * 2. Provide adequate spacing between fields (minimum 8mm)
 * 3. Use clear, sans-serif fonts for labels
 * 4. Include character boxes for critical fields (names, emails)
 * 5. Add corner markers for alignment during scanning
 * 6. Use thick borders (1-2pt) for field boundaries
 * 7. Avoid light gray backgrounds that reduce contrast
 * 8. Include a QR code linking to digital form for verification
 */

interface PaperFormConfig {
  formId: string;
  title: string;
  description?: string;
  fields: FormField[];
  publicUrl?: string;
  qrCode?: string;
}

interface FieldLayout {
  field: FormField;
  y: number;
  height: number;
}

// Constants for OCR-optimized layout
const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN_LEFT = 15;
const MARGIN_RIGHT = 15;
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

// Field sizing
const LABEL_HEIGHT = 5;
const FIELD_MIN_HEIGHT = 10;
const FIELD_SPACING = 4;
const CHECKBOX_SIZE = 5;
const CHARACTER_BOX_WIDTH = 6;
const CHARACTER_BOX_HEIGHT = 8;

// Styling for OCR optimization
const BORDER_WIDTH = 0.5;
const THICK_BORDER_WIDTH = 1;
const CORNER_MARKER_SIZE = 8;

/**
 * Calculate optimal field heights to fit on one page
 */
function calculateFieldLayouts(fields: FormField[], availableHeight: number): FieldLayout[] {
  const layouts: FieldLayout[] = [];
  
  // Calculate minimum heights for each field type
  const fieldHeights = fields.map(field => {
    switch (field.type) {
      case 'textarea':
        return { field, minHeight: 25, preferredHeight: 35 };
      case 'checkbox':
      case 'radio':
        const optionCount = field.options?.length || 2;
        return { field, minHeight: 8 + (optionCount * 6), preferredHeight: 10 + (optionCount * 7) };
      case 'select':
        return { field, minHeight: 12, preferredHeight: 15 };
      default:
        return { field, minHeight: FIELD_MIN_HEIGHT, preferredHeight: 14 };
    }
  });

  // Calculate total minimum height needed
  const totalMinHeight = fieldHeights.reduce((sum, f) => sum + f.minHeight + LABEL_HEIGHT + FIELD_SPACING, 0);
  
  // Scale factor to fit on one page
  const scaleFactor = totalMinHeight > availableHeight 
    ? availableHeight / totalMinHeight 
    : 1;

  let currentY = MARGIN_TOP + 25; // Leave room for header

  for (const fh of fieldHeights) {
    const height = Math.max(
      fh.minHeight * scaleFactor,
      fh.minHeight * 0.7 // Don't go below 70% of minimum
    );
    
    layouts.push({
      field: fh.field,
      y: currentY,
      height: height
    });
    
    currentY += height + LABEL_HEIGHT + FIELD_SPACING;
  }

  return layouts;
}

/**
 * Draw corner alignment markers for scanning
 */
function drawCornerMarkers(doc: jsPDF): void {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(THICK_BORDER_WIDTH);

  // Top-left corner
  doc.line(5, 5, 5 + CORNER_MARKER_SIZE, 5);
  doc.line(5, 5, 5, 5 + CORNER_MARKER_SIZE);

  // Top-right corner
  doc.line(PAGE_WIDTH - 5, 5, PAGE_WIDTH - 5 - CORNER_MARKER_SIZE, 5);
  doc.line(PAGE_WIDTH - 5, 5, PAGE_WIDTH - 5, 5 + CORNER_MARKER_SIZE);

  // Bottom-left corner
  doc.line(5, PAGE_HEIGHT - 5, 5 + CORNER_MARKER_SIZE, PAGE_HEIGHT - 5);
  doc.line(5, PAGE_HEIGHT - 5, 5, PAGE_HEIGHT - 5 - CORNER_MARKER_SIZE);

  // Bottom-right corner
  doc.line(PAGE_WIDTH - 5, PAGE_HEIGHT - 5, PAGE_WIDTH - 5 - CORNER_MARKER_SIZE, PAGE_HEIGHT - 5);
  doc.line(PAGE_WIDTH - 5, PAGE_HEIGHT - 5, PAGE_WIDTH - 5, PAGE_HEIGHT - 5 - CORNER_MARKER_SIZE);
}

/**
 * Draw form header with title and instructions
 */
function drawHeader(doc: jsPDF, config: PaperFormConfig): number {
  let y = MARGIN_TOP;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(config.title, MARGIN_LEFT, y);
  y += 6;

  // Instructions for handwriting
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 80);
  doc.text('PRINT CLEARLY IN BLACK OR BLUE INK • STAY WITHIN BOXES • USE BLOCK LETTERS', MARGIN_LEFT, y);
  y += 5;
  
  // Separator line
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  y += 5;

  doc.setTextColor(0, 0, 0);
  return y;
}

/**
 * Draw a text input field with character boxes for OCR
 */
function drawTextField(
  doc: jsPDF, 
  field: FormField, 
  x: number, 
  y: number, 
  width: number, 
  height: number,
  useCharacterBoxes: boolean = false
): void {
  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const labelText = field.required ? `${field.label} *` : field.label;
  doc.text(labelText, x, y);
  y += LABEL_HEIGHT;

  doc.setLineWidth(BORDER_WIDTH);
  doc.setDrawColor(0, 0, 0);

  if (useCharacterBoxes && (field.type === 'email' || field.type === 'phone')) {
    // Draw character boxes for structured input
    const boxCount = field.type === 'email' ? 30 : 15;
    const boxWidth = Math.min(CHARACTER_BOX_WIDTH, (width - 2) / boxCount);
    
    for (let i = 0; i < boxCount; i++) {
      doc.rect(x + (i * boxWidth), y, boxWidth, CHARACTER_BOX_HEIGHT);
    }
  } else {
    // Standard input box with writing lines
    doc.rect(x, y, width, height);
    
    // Add subtle writing guide line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    const lineY = y + height - 3;
    doc.line(x + 2, lineY, x + width - 2, lineY);
    doc.setDrawColor(0, 0, 0);
  }
}

/**
 * Draw a textarea field with multiple lines
 */
function drawTextareaField(
  doc: jsPDF,
  field: FormField,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const labelText = field.required ? `${field.label} *` : field.label;
  doc.text(labelText, x, y);
  y += LABEL_HEIGHT;

  // Draw box
  doc.setLineWidth(BORDER_WIDTH);
  doc.setDrawColor(0, 0, 0);
  doc.rect(x, y, width, height);

  // Draw writing guide lines
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  const lineSpacing = 6;
  for (let lineY = y + lineSpacing; lineY < y + height - 2; lineY += lineSpacing) {
    doc.line(x + 2, lineY, x + width - 2, lineY);
  }
  doc.setDrawColor(0, 0, 0);
}

/**
 * Draw checkbox or radio button options
 */
function drawOptionsField(
  doc: jsPDF,
  field: FormField,
  x: number,
  y: number,
  width: number,
  height: number,
  isRadio: boolean = false
): void {
  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const labelText = field.required ? `${field.label} *` : field.label;
  doc.text(labelText, x, y);
  y += LABEL_HEIGHT + 2;

  const options = field.options || ['Option 1', 'Option 2'];
  const optionHeight = Math.min(6, (height - 2) / options.length);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setLineWidth(BORDER_WIDTH);

  // Calculate if we need multiple columns
  const useColumns = options.length > 4;
  const columnWidth = useColumns ? width / 2 : width;
  const optionsPerColumn = useColumns ? Math.ceil(options.length / 2) : options.length;

  options.forEach((option, index) => {
    const column = useColumns ? Math.floor(index / optionsPerColumn) : 0;
    const rowIndex = useColumns ? index % optionsPerColumn : index;
    const optionX = x + (column * columnWidth);
    const optionY = y + (rowIndex * optionHeight);

    if (isRadio) {
      // Draw circle for radio
      doc.circle(optionX + CHECKBOX_SIZE / 2, optionY + CHECKBOX_SIZE / 2 - 1, CHECKBOX_SIZE / 2);
    } else {
      // Draw square for checkbox
      doc.rect(optionX, optionY - 1, CHECKBOX_SIZE, CHECKBOX_SIZE);
    }
    
    // Option label
    doc.text(option, optionX + CHECKBOX_SIZE + 2, optionY + 3);
  });
}

/**
 * Draw a select/dropdown field as a list of options
 */
function drawSelectField(
  doc: jsPDF,
  field: FormField,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // For paper forms, select becomes radio buttons
  drawOptionsField(doc, field, x, y, width, height, true);
}

/**
 * Draw a date field with separate boxes for day/month/year
 */
function drawDateField(
  doc: jsPDF,
  field: FormField,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const labelText = field.required ? `${field.label} *` : field.label;
  doc.text(labelText, x, y);
  y += LABEL_HEIGHT;

  doc.setLineWidth(BORDER_WIDTH);
  doc.setDrawColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);

  // Month boxes (2 digits)
  doc.text('MM', x, y - 1);
  doc.rect(x, y, CHARACTER_BOX_WIDTH, CHARACTER_BOX_HEIGHT);
  doc.rect(x + CHARACTER_BOX_WIDTH, y, CHARACTER_BOX_WIDTH, CHARACTER_BOX_HEIGHT);

  // Separator
  doc.text('/', x + CHARACTER_BOX_WIDTH * 2 + 1, y + 5);

  // Day boxes (2 digits)
  const dayX = x + CHARACTER_BOX_WIDTH * 2 + 4;
  doc.text('DD', dayX, y - 1);
  doc.rect(dayX, y, CHARACTER_BOX_WIDTH, CHARACTER_BOX_HEIGHT);
  doc.rect(dayX + CHARACTER_BOX_WIDTH, y, CHARACTER_BOX_WIDTH, CHARACTER_BOX_HEIGHT);

  // Separator
  doc.text('/', dayX + CHARACTER_BOX_WIDTH * 2 + 1, y + 5);

  // Year boxes (4 digits)
  const yearX = dayX + CHARACTER_BOX_WIDTH * 2 + 4;
  doc.text('YYYY', yearX, y - 1);
  for (let i = 0; i < 4; i++) {
    doc.rect(yearX + (i * CHARACTER_BOX_WIDTH), y, CHARACTER_BOX_WIDTH, CHARACTER_BOX_HEIGHT);
  }
}

/**
 * Draw a number field
 */
function drawNumberField(
  doc: jsPDF,
  field: FormField,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  const labelText = field.required ? `${field.label} *` : field.label;
  doc.text(labelText, x, y);
  y += LABEL_HEIGHT;

  // Draw number boxes
  doc.setLineWidth(BORDER_WIDTH);
  doc.setDrawColor(0, 0, 0);
  
  const boxCount = 10;
  for (let i = 0; i < boxCount; i++) {
    doc.rect(x + (i * CHARACTER_BOX_WIDTH), y, CHARACTER_BOX_WIDTH, CHARACTER_BOX_HEIGHT);
  }
}

/**
 * Draw footer with form ID and scanning instructions
 */
function drawFooter(doc: jsPDF, config: PaperFormConfig): void {
  const y = PAGE_HEIGHT - MARGIN_BOTTOM + 5;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  
  // Form ID for tracking
  doc.text(`Form ID: ${config.formId}`, MARGIN_LEFT, y);
  
  // Scanning tips
  doc.text('Scan at 300 DPI minimum • Ensure good lighting • Keep form flat', PAGE_WIDTH / 2, y, { align: 'center' });
  
  // Date generated
  const dateStr = new Date().toLocaleDateString();
  doc.text(`Generated: ${dateStr}`, PAGE_WIDTH - MARGIN_RIGHT, y, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
}

/**
 * Generate a paper form PDF optimized for OCR and scanning
 */
export function generatePaperFormPDF(config: PaperFormConfig): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Draw corner markers for alignment
  drawCornerMarkers(doc);

  // Draw header
  const headerEndY = drawHeader(doc, config);

  // Calculate available height for fields
  const availableHeight = CONTENT_HEIGHT - (headerEndY - MARGIN_TOP) - 15; // Leave room for footer

  // Calculate field layouts
  const layouts = calculateFieldLayouts(config.fields, availableHeight);

  // Draw each field
  for (const layout of layouts) {
    const { field, y, height } = layout;
    const x = MARGIN_LEFT;
    const width = CONTENT_WIDTH;

    switch (field.type) {
      case 'textarea':
        drawTextareaField(doc, field, x, y, width, height);
        break;
      case 'checkbox':
        drawOptionsField(doc, field, x, y, width, height, false);
        break;
      case 'radio':
        drawOptionsField(doc, field, x, y, width, height, true);
        break;
      case 'select':
        drawSelectField(doc, field, x, y, width, height);
        break;
      case 'date':
        drawDateField(doc, field, x, y, width, height);
        break;
      case 'number':
        drawNumberField(doc, field, x, y, width, height);
        break;
      case 'email':
      case 'phone':
        drawTextField(doc, field, x, y, width, height, true);
        break;
      default:
        drawTextField(doc, field, x, y, width, height, false);
    }
  }

  // Draw footer
  drawFooter(doc, config);

  return doc;
}

/**
 * Generate and download paper form PDF
 */
export function downloadPaperFormPDF(config: PaperFormConfig): void {
  const doc = generatePaperFormPDF(config);
  const filename = `${config.title.replace(/[^a-z0-9]/gi, '_')}_paper_form.pdf`;
  doc.save(filename);
}

/**
 * Generate paper form PDF as base64 string for storage
 */
export function generatePaperFormBase64(config: PaperFormConfig): string {
  const doc = generatePaperFormPDF(config);
  return doc.output('datauristring');
}

/**
 * Generate paper form PDF as Blob for upload
 */
export function generatePaperFormBlob(config: PaperFormConfig): Blob {
  const doc = generatePaperFormPDF(config);
  return doc.output('blob');
}

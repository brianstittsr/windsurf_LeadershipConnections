import { jsPDF } from 'jspdf';
import { FormField } from '@/types/form';

/**
 * Paper Form Generator - 2-Column Layout
 * 
 * Generates OCR-optimized PDF forms designed for:
 * - AI handwriting recognition
 * - Easy scanning with document scanners or smartphone cameras
 * - Single-page layout for efficient processing
 * - 2-column layout to maximize space
 * - Horizontal option layouts for checkboxes/radios
 * 
 * Best Practices for Handwriting Recognition:
 * 1. Use high-contrast black borders on white background
 * 2. Use clear, sans-serif fonts for labels (10pt)
 * 3. Include character boxes for critical fields
 * 4. Add corner markers for alignment during scanning
 * 5. Horizontal option layout for better space utilization
 */

interface PaperFormConfig {
  formId: string;
  title: string;
  description?: string;
  fields: FormField[];
  publicUrl?: string;
  qrCode?: string;
}

interface FieldPosition {
  field: FormField;
  column: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Constants for OCR-optimized 2-column layout
const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN_LEFT = 12;
const MARGIN_RIGHT = 12;
const MARGIN_TOP = 18;
const MARGIN_BOTTOM = 12;
const COLUMN_GAP = 6;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const COLUMN_WIDTH = (CONTENT_WIDTH - COLUMN_GAP) / 2;

// Field sizing - properly spaced for readability
const LABEL_HEIGHT = 5;
const FIELD_HEIGHT = 8;
const FIELD_SPACING = 4;
const CHECKBOX_SIZE = 4;
const CHARACTER_BOX_WIDTH = 5;
const CHARACTER_BOX_HEIGHT = 7;

// Font sizes (10pt base)
const FONT_SIZE_TITLE = 12;
const FONT_SIZE_LABEL = 10;
const FONT_SIZE_OPTION = 8;
const FONT_SIZE_SMALL = 7;

// Styling
const BORDER_WIDTH = 0.4;
const THICK_BORDER_WIDTH = 0.8;
const CORNER_MARKER_SIZE = 6;

/**
 * Get field height based on type
 * Uses conservative estimates for label wrapping (25 chars per line for column width ~90mm)
 */
function getFieldHeight(field: FormField): number {
  const options = field.options || [];
  // Conservative estimate: ~25 chars per line in column width (accounts for bold font)
  const labelLines = Math.ceil(field.label.length / 25);
  const labelHeight = labelLines * 4 + 2; // 4mm per line + gap
  
  switch (field.type) {
    case 'textarea':
      return labelHeight + 18; // Label + textarea box
    case 'checkbox':
    case 'radio':
    case 'select':
      // Calculate based on number of options
      const totalOptionChars = options.reduce((sum, opt) => sum + opt.length + 10, 0);
      // ~35 chars per row in column for options (smaller font)
      const estimatedRows = Math.max(1, Math.ceil(totalOptionChars / 35));
      const optionHeight = estimatedRows * 7;
      return labelHeight + optionHeight + 2;
    default:
      return labelHeight + FIELD_HEIGHT + 2;
  }
}

/**
 * Calculate 2-column field positions
 */
function calculateFieldPositions(fields: FormField[], startY: number, maxY: number): FieldPosition[] {
  const positions: FieldPosition[] = [];
  
  let leftY = startY;
  let rightY = startY;
  
  for (const field of fields) {
    const height = getFieldHeight(field);
    
    // Determine which column to use (pick the one with more space)
    let column: number;
    let y: number;
    
    // Textarea spans full width
    if (field.type === 'textarea') {
      // Use the lower of the two columns
      y = Math.max(leftY, rightY);
      column = -1; // Full width indicator
      leftY = y + height + FIELD_SPACING;
      rightY = leftY;
    } else {
      // Pick column with more space
      if (leftY <= rightY) {
        column = 0;
        y = leftY;
        leftY = y + height + FIELD_SPACING;
      } else {
        column = 1;
        y = rightY;
        rightY = y + height + FIELD_SPACING;
      }
    }
    
    // Check if we exceed page
    if (y + height > maxY) {
      console.warn('Form may exceed page height');
    }
    
    const x = column === -1 
      ? MARGIN_LEFT 
      : column === 0 
        ? MARGIN_LEFT 
        : MARGIN_LEFT + COLUMN_WIDTH + COLUMN_GAP;
    
    const width = column === -1 ? CONTENT_WIDTH : COLUMN_WIDTH;
    
    positions.push({ field, column, x, y, width, height });
  }
  
  return positions;
}

/**
 * Draw corner alignment markers
 */
function drawCornerMarkers(doc: jsPDF): void {
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(THICK_BORDER_WIDTH);

  // Top-left
  doc.line(5, 5, 5 + CORNER_MARKER_SIZE, 5);
  doc.line(5, 5, 5, 5 + CORNER_MARKER_SIZE);

  // Top-right
  doc.line(PAGE_WIDTH - 5, 5, PAGE_WIDTH - 5 - CORNER_MARKER_SIZE, 5);
  doc.line(PAGE_WIDTH - 5, 5, PAGE_WIDTH - 5, 5 + CORNER_MARKER_SIZE);

  // Bottom-left
  doc.line(5, PAGE_HEIGHT - 5, 5 + CORNER_MARKER_SIZE, PAGE_HEIGHT - 5);
  doc.line(5, PAGE_HEIGHT - 5, 5, PAGE_HEIGHT - 5 - CORNER_MARKER_SIZE);

  // Bottom-right
  doc.line(PAGE_WIDTH - 5, PAGE_HEIGHT - 5, PAGE_WIDTH - 5 - CORNER_MARKER_SIZE, PAGE_HEIGHT - 5);
  doc.line(PAGE_WIDTH - 5, PAGE_HEIGHT - 5, PAGE_WIDTH - 5, PAGE_HEIGHT - 5 - CORNER_MARKER_SIZE);
}

/**
 * Draw form header
 */
function drawHeader(doc: jsPDF, config: PaperFormConfig): number {
  let y = MARGIN_TOP;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SIZE_TITLE);
  doc.text(config.title, MARGIN_LEFT, y);
  y += 5;

  // Instructions
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.setTextColor(80, 80, 80);
  doc.text('PRINT CLEARLY • BLACK/BLUE INK • STAY WITHIN BOXES', MARGIN_LEFT, y);
  y += 4;
  
  // Separator
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_LEFT, y, PAGE_WIDTH - MARGIN_RIGHT, y);
  y += 4;

  doc.setTextColor(0, 0, 0);
  return y;
}

/**
 * Wrap text to fit within a given width using jsPDF's splitTextToSize
 */
function wrapText(doc: jsPDF, text: string, maxWidth: number): string[] {
  return doc.splitTextToSize(text, maxWidth);
}

/**
 * Draw text input field with label wrapping
 */
function drawTextField(
  doc: jsPDF, 
  field: FormField, 
  x: number, 
  y: number, 
  width: number,
  useCharacterBoxes: boolean = false
): void {
  // Label with wrapping support using jsPDF's built-in method
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SIZE_LABEL);
  const labelText = field.required ? `${field.label} *` : field.label;
  
  // Use jsPDF's splitTextToSize for reliable wrapping
  const wrappedLines = wrapText(doc, labelText, width - 2);
  
  for (let i = 0; i < wrappedLines.length; i++) {
    doc.text(wrappedLines[i], x, y);
    y += 4;
  }
  y += 1; // Small gap after label

  doc.setLineWidth(BORDER_WIDTH);
  doc.setDrawColor(0, 0, 0);

  if (useCharacterBoxes && (field.type === 'email' || field.type === 'phone')) {
    // Limit character boxes to fit within width
    const maxBoxes = Math.floor(width / CHARACTER_BOX_WIDTH);
    const boxCount = field.type === 'email' ? Math.min(maxBoxes, 30) : Math.min(maxBoxes, 12);
    const actualBoxWidth = Math.min(CHARACTER_BOX_WIDTH, width / boxCount);
    
    for (let i = 0; i < boxCount; i++) {
      doc.rect(x + (i * actualBoxWidth), y, actualBoxWidth, CHARACTER_BOX_HEIGHT);
    }
  } else {
    doc.rect(x, y, width, FIELD_HEIGHT);
    // Writing guide line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(x + 1, y + FIELD_HEIGHT - 2, x + width - 1, y + FIELD_HEIGHT - 2);
    doc.setDrawColor(0, 0, 0);
  }
}

/**
 * Draw textarea field
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
  doc.setFontSize(FONT_SIZE_LABEL);
  const labelText = field.required ? `${field.label} *` : field.label;
  doc.text(labelText, x, y);
  y += LABEL_HEIGHT;

  const boxHeight = height - LABEL_HEIGHT - 2;
  
  doc.setLineWidth(BORDER_WIDTH);
  doc.setDrawColor(0, 0, 0);
  doc.rect(x, y, width, boxHeight);

  // Writing guide lines
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.15);
  const lineSpacing = 5;
  for (let lineY = y + lineSpacing; lineY < y + boxHeight - 1; lineY += lineSpacing) {
    doc.line(x + 1, lineY, x + width - 1, lineY);
  }
  doc.setDrawColor(0, 0, 0);
}

/**
 * Truncate text to fit within a given width
 */
function truncateText(doc: jsPDF, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) return text;
  
  let truncated = text;
  while (doc.getTextWidth(truncated + '...') > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }
  return truncated + '...';
}

/**
 * Draw checkbox/radio options HORIZONTALLY with proper wrapping
 */
function drawOptionsFieldHorizontal(
  doc: jsPDF,
  field: FormField,
  x: number,
  y: number,
  width: number,
  isRadio: boolean = false
): void {
  // Ensure we don't exceed the column boundary
  const maxX = x + width;
  
  // Label - use jsPDF's splitTextToSize for reliable wrapping
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SIZE_LABEL);
  const labelText = field.required ? `${field.label} *` : field.label;
  
  // Use jsPDF's splitTextToSize for reliable wrapping
  const wrappedLines = wrapText(doc, labelText, width - 2);
  
  for (let i = 0; i < wrappedLines.length; i++) {
    doc.text(wrappedLines[i], x, y);
    y += 4;
  }
  y += 1; // Small gap after label

  const options = field.options || ['Option 1', 'Option 2'];
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZE_OPTION);
  doc.setLineWidth(BORDER_WIDTH);

  const optionSpacing = 3;
  const rowHeight = 6;
  const checkboxPadding = CHECKBOX_SIZE + 2; // Space for checkbox + gap
  
  // Calculate how many options can fit per row
  let currentX = x;
  let currentRow = 0;
  const optionPositions: { x: number; y: number; text: string }[] = [];
  
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const optionTextWidth = doc.getTextWidth(option);
    const totalOptionWidth = checkboxPadding + optionTextWidth + optionSpacing;
    
    // Check if this option fits on current row
    if (currentX + totalOptionWidth > maxX && currentX > x) {
      // Move to next row
      currentRow++;
      currentX = x;
    }
    
    // Calculate max text width available for this option
    const availableWidth = maxX - currentX - checkboxPadding - 2;
    const displayText = truncateText(doc, option, availableWidth);
    
    optionPositions.push({
      x: currentX,
      y: y + (currentRow * rowHeight),
      text: displayText
    });
    
    currentX += checkboxPadding + doc.getTextWidth(displayText) + optionSpacing;
  }
  
  // Draw all options
  optionPositions.forEach((pos) => {
    if (isRadio) {
      doc.circle(pos.x + CHECKBOX_SIZE / 2, pos.y + CHECKBOX_SIZE / 2, CHECKBOX_SIZE / 2);
    } else {
      doc.rect(pos.x, pos.y, CHECKBOX_SIZE, CHECKBOX_SIZE);
    }
    
    doc.text(pos.text, pos.x + checkboxPadding, pos.y + CHECKBOX_SIZE - 0.5);
  });
}

/**
 * Draw date field with MM/DD/YYYY boxes
 */
function drawDateField(
  doc: jsPDF,
  field: FormField,
  x: number,
  y: number,
  width: number
): void {
  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SIZE_LABEL);
  const labelText = field.required ? `${field.label} *` : field.label;
  doc.text(labelText, x, y);
  y += LABEL_HEIGHT;

  doc.setLineWidth(BORDER_WIDTH);
  doc.setDrawColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZE_SMALL);

  const boxW = CHARACTER_BOX_WIDTH;
  const boxH = CHARACTER_BOX_HEIGHT;

  // MM
  doc.text('MM', x, y - 0.5);
  doc.rect(x, y, boxW, boxH);
  doc.rect(x + boxW, y, boxW, boxH);
  doc.text('/', x + boxW * 2 + 1, y + 4);

  // DD
  const dayX = x + boxW * 2 + 3;
  doc.text('DD', dayX, y - 0.5);
  doc.rect(dayX, y, boxW, boxH);
  doc.rect(dayX + boxW, y, boxW, boxH);
  doc.text('/', dayX + boxW * 2 + 1, y + 4);

  // YYYY
  const yearX = dayX + boxW * 2 + 3;
  doc.text('YYYY', yearX, y - 0.5);
  for (let i = 0; i < 4; i++) {
    doc.rect(yearX + (i * boxW), y, boxW, boxH);
  }
}

/**
 * Draw number field
 */
function drawNumberField(
  doc: jsPDF,
  field: FormField,
  x: number,
  y: number,
  width: number
): void {
  // Label
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(FONT_SIZE_LABEL);
  const labelText = field.required ? `${field.label} *` : field.label;
  doc.text(labelText, x, y);
  y += LABEL_HEIGHT;

  doc.setLineWidth(BORDER_WIDTH);
  doc.setDrawColor(0, 0, 0);
  
  const boxCount = Math.min(10, Math.floor(width / CHARACTER_BOX_WIDTH));
  for (let i = 0; i < boxCount; i++) {
    doc.rect(x + (i * CHARACTER_BOX_WIDTH), y, CHARACTER_BOX_WIDTH, CHARACTER_BOX_HEIGHT);
  }
}

/**
 * Draw footer
 */
function drawFooter(doc: jsPDF, config: PaperFormConfig): void {
  const y = PAGE_HEIGHT - MARGIN_BOTTOM + 3;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(FONT_SIZE_SMALL);
  doc.setTextColor(100, 100, 100);
  
  doc.text(`Form ID: ${config.formId}`, MARGIN_LEFT, y);
  doc.text('Scan at 300 DPI • Good lighting • Keep flat', PAGE_WIDTH / 2, y, { align: 'center' });
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, PAGE_WIDTH - MARGIN_RIGHT, y, { align: 'right' });
  
  doc.setTextColor(0, 0, 0);
}

/**
 * Generate a paper form PDF with 2-column layout
 */
export function generatePaperFormPDF(config: PaperFormConfig): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Draw corner markers
  drawCornerMarkers(doc);

  // Draw header
  const headerEndY = drawHeader(doc, config);

  // Calculate available height
  const maxY = PAGE_HEIGHT - MARGIN_BOTTOM - 8;

  // Calculate field positions in 2-column layout
  const positions = calculateFieldPositions(config.fields, headerEndY, maxY);

  // Draw each field
  for (const pos of positions) {
    const { field, x, y, width, height } = pos;

    switch (field.type) {
      case 'textarea':
        drawTextareaField(doc, field, x, y, width, height);
        break;
      case 'checkbox':
        drawOptionsFieldHorizontal(doc, field, x, y, width, false);
        break;
      case 'radio':
        drawOptionsFieldHorizontal(doc, field, x, y, width, true);
        break;
      case 'select':
        drawOptionsFieldHorizontal(doc, field, x, y, width, true);
        break;
      case 'date':
        drawDateField(doc, field, x, y, width);
        break;
      case 'number':
        drawNumberField(doc, field, x, y, width);
        break;
      case 'email':
      case 'phone':
        drawTextField(doc, field, x, y, width, true);
        break;
      default:
        drawTextField(doc, field, x, y, width, false);
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
 * Generate paper form PDF as base64 string
 */
export function generatePaperFormBase64(config: PaperFormConfig): string {
  const doc = generatePaperFormPDF(config);
  return doc.output('datauristring');
}

/**
 * Generate paper form PDF as Blob
 */
export function generatePaperFormBlob(config: PaperFormConfig): Blob {
  const doc = generatePaperFormPDF(config);
  return doc.output('blob');
}

import QRCode from 'qrcode';

/**
 * Generate a QR code as a base64 data URL
 * @param url - The URL to encode in the QR code
 * @param options - Optional QR code generation options
 * @returns Promise<string> - Base64 encoded QR code image
 */
export async function generateQRCode(
  url: string,
  options?: {
    width?: number;
    margin?: number;
    color?: {
      dark?: string;
      light?: string;
    };
  }
): Promise<string> {
  try {
    const qrOptions = {
      width: options?.width || 300,
      margin: options?.margin || 2,
      color: {
        dark: options?.color?.dark || '#000000',
        light: options?.color?.light || '#FFFFFF',
      },
    };

    const qrCodeDataUrl = await QRCode.toDataURL(url, qrOptions);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate a QR code as a buffer (for server-side use)
 * @param url - The URL to encode in the QR code
 * @returns Promise<Buffer> - QR code as a buffer
 */
export async function generateQRCodeBuffer(url: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(url, {
      width: 300,
      margin: 2,
    });
    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

/**
 * Generate a public URL for a form
 * @param formId - The form ID
 * @param baseUrl - The base URL of the application (optional, defaults to window.location.origin)
 * @returns string - The public URL for the form
 */
export function generateFormPublicUrl(formId: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/forms/public/${formId}`;
}

/**
 * Generate a QR code for a form
 * @param formId - The form ID
 * @param baseUrl - The base URL of the application (optional)
 * @returns Promise<string> - Base64 encoded QR code image
 */
export async function generateFormQRCode(formId: string, baseUrl?: string): Promise<string> {
  const publicUrl = generateFormPublicUrl(formId, baseUrl);
  return generateQRCode(publicUrl);
}

import QRCode from 'qrcode'

/**
 * Generates a QR code as a base64 Data URL.
 * @param url - The URL to encode in the QR code
 * @returns base64 PNG data URL string
 */
export async function generateQRCode(url: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  })
  return dataUrl
}

/**
 * Generates the canonical store URL for a given restaurant slug and table.
 */
export function buildStoreUrl(baseUrl: string, slug: string, tableId: string): string {
  return `${baseUrl}/store/${slug}/${tableId}`
}

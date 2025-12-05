import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, Timestamp, collection, query, where, getDocs } from 'firebase/firestore';

const BACKUP_FOLDER_NAME = 'BACKUP-LCConnections';

interface GoogleCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken?: string;
  accessToken?: string;
  tokenExpiry?: Date;
}

interface SheetSyncConfig {
  datasetId: string;
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetName: string;
  backupSpreadsheetId?: string;
  backupSpreadsheetUrl?: string;
  createdAt: Date;
  lastSyncAt?: Date;
  autoSync: boolean;
}

/**
 * Get Google API credentials from Firestore
 */
export async function getGoogleCredentials(): Promise<GoogleCredentials | null> {
  try {
    const docRef = doc(db, 'integrations', 'google');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists() && docSnap.data().credentials) {
      return docSnap.data().credentials as GoogleCredentials;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Google credentials:', error);
    return null;
  }
}

/**
 * Check if Google Sheets integration is enabled
 */
export async function isGoogleSheetsEnabled(): Promise<boolean> {
  try {
    const docRef = doc(db, 'integrations', 'google');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.status?.sheets?.enabled === true && !!data.credentials?.refreshToken;
    }
    return false;
  } catch (error) {
    console.error('Error checking Google Sheets status:', error);
    return false;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(credentials: GoogleCredentials): Promise<string | null> {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        refresh_token: credentials.refreshToken || '',
        grant_type: 'refresh_token'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    // Update stored access token
    const docRef = doc(db, 'integrations', 'google');
    await updateDoc(docRef, {
      'credentials.accessToken': data.access_token,
      'credentials.tokenExpiry': Timestamp.fromDate(new Date(Date.now() + data.expires_in * 1000))
    });

    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(): Promise<string | null> {
  const credentials = await getGoogleCredentials();
  if (!credentials) return null;

  // Check if current token is still valid
  if (credentials.accessToken && credentials.tokenExpiry) {
    const expiry = credentials.tokenExpiry instanceof Date 
      ? credentials.tokenExpiry 
      : new Date((credentials.tokenExpiry as any).seconds * 1000);
    
    if (expiry > new Date()) {
      return credentials.accessToken;
    }
  }

  // Refresh the token
  return refreshAccessToken(credentials);
}

/**
 * Create a new Google Sheet for a dataset
 */
export async function createSpreadsheetForDataset(
  datasetId: string,
  datasetName: string,
  headers: string[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string } | null> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('Google Sheets not connected. Please configure Google integration first.');
  }

  try {
    // Create the spreadsheet
    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          title: `LC Dataset - ${datasetName}`
        },
        sheets: [{
          properties: {
            title: 'Data',
            gridProperties: {
              frozenRowCount: 1
            }
          }
        }]
      })
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(error.error?.message || 'Failed to create spreadsheet');
    }

    const spreadsheet = await createResponse.json();
    const spreadsheetId = spreadsheet.spreadsheetId;
    const spreadsheetUrl = spreadsheet.spreadsheetUrl;

    // Add headers to the first row
    await updateSpreadsheetData(spreadsheetId, 'Data!A1', [headers], accessToken);

    // Format header row
    await formatHeaderRow(spreadsheetId, spreadsheet.sheets[0].properties.sheetId, headers.length, accessToken);

    return { spreadsheetId, spreadsheetUrl };
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    throw error;
  }
}

/**
 * Format the header row with bold text and background color
 */
async function formatHeaderRow(
  spreadsheetId: string,
  sheetId: number,
  columnCount: number,
  accessToken: string
): Promise<void> {
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: columnCount
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.29, green: 0.42, blue: 0.97 },
                  textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat)'
            }
          }
        ]
      })
    });
  } catch (error) {
    console.error('Error formatting header row:', error);
  }
}

/**
 * Update spreadsheet data
 */
export async function updateSpreadsheetData(
  spreadsheetId: string,
  range: string,
  values: any[][],
  accessToken?: string
): Promise<void> {
  const token = accessToken || await getValidAccessToken();
  if (!token) {
    throw new Error('No valid access token');
  }

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to update spreadsheet');
  }
}

/**
 * Append data to spreadsheet
 */
export async function appendToSpreadsheet(
  spreadsheetId: string,
  sheetName: string,
  values: any[][]
): Promise<void> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token');
  }

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A:Z:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to append to spreadsheet');
  }
}

/**
 * Create or get the backup folder in Google Drive
 */
export async function getOrCreateBackupFolder(): Promise<string> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token');
  }

  // Search for existing folder
  const searchResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );

  const searchData = await searchResponse.json();
  
  if (searchData.files && searchData.files.length > 0) {
    return searchData.files[0].id;
  }

  // Create new folder
  const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: BACKUP_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });

  const folder = await createResponse.json();
  return folder.id;
}

/**
 * Create a backup spreadsheet in the backup folder
 */
export async function createBackupSpreadsheet(
  datasetName: string,
  folderId: string
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token');
  }

  // Create spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: `BACKUP - ${datasetName} - ${new Date().toISOString().split('T')[0]}`
      }
    })
  });

  const spreadsheet = await createResponse.json();

  // Move to backup folder
  await fetch(
    `https://www.googleapis.com/drive/v3/files/${spreadsheet.spreadsheetId}?addParents=${folderId}`,
    {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    }
  );

  return {
    spreadsheetId: spreadsheet.spreadsheetId,
    spreadsheetUrl: spreadsheet.spreadsheetUrl
  };
}

/**
 * Delete a Google Sheet (but not backup)
 */
export async function deleteSpreadsheet(spreadsheetId: string): Promise<void> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token');
  }

  await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
}

/**
 * Get sheet sync configuration for a dataset
 */
export async function getSheetSyncConfig(datasetId: string): Promise<SheetSyncConfig | null> {
  try {
    const docRef = doc(db, 'datasetSheetSync', datasetId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as SheetSyncConfig;
    }
    return null;
  } catch (error) {
    console.error('Error fetching sheet sync config:', error);
    return null;
  }
}

/**
 * Save sheet sync configuration
 */
export async function saveSheetSyncConfig(config: SheetSyncConfig): Promise<void> {
  const docRef = doc(db, 'datasetSheetSync', config.datasetId);
  await updateDoc(docRef, {
    ...config,
    lastSyncAt: Timestamp.fromDate(new Date())
  });
}

/**
 * Sync all dataset records to Google Sheet
 */
export async function syncDatasetToSheet(
  datasetId: string,
  records: any[],
  headers: string[]
): Promise<void> {
  const config = await getSheetSyncConfig(datasetId);
  if (!config) {
    throw new Error('No sheet sync configuration found for this dataset');
  }

  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    throw new Error('No valid access token');
  }

  // Clear existing data (except header)
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/Data!A2:Z?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values: [] })
    }
  );

  // Add all records
  if (records.length > 0) {
    const values = records.map(record => 
      headers.map(header => record.data?.[header] || record[header] || '')
    );
    
    await appendToSpreadsheet(config.spreadsheetId, 'Data', values);
  }

  // Also sync to backup
  if (config.backupSpreadsheetId) {
    const backupValues = records.map(record => 
      headers.map(header => record.data?.[header] || record[header] || '')
    );
    await appendToSpreadsheet(config.backupSpreadsheetId, 'Sheet1', backupValues);
  }

  // Update last sync time
  await saveSheetSyncConfig({
    ...config,
    lastSyncAt: new Date()
  });
}

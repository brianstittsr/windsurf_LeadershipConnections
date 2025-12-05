import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  isGoogleSheetsEnabled,
  createSpreadsheetForDataset,
  getOrCreateBackupFolder,
  createBackupSpreadsheet,
  appendToSpreadsheet,
  updateSpreadsheetData
} from '@/lib/google-sheets-service';

// POST /api/datasets/[datasetId]/publish-to-sheets - Create and sync to Google Sheet
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ datasetId: string }> }
) {
  try {
    const { datasetId } = await params;

    // Check if Google Sheets is enabled
    const sheetsEnabled = await isGoogleSheetsEnabled();
    if (!sheetsEnabled) {
      return NextResponse.json(
        { error: 'Google Sheets integration is not configured. Please set up Google integration first.' },
        { status: 400 }
      );
    }

    // Get dataset info
    const datasetRef = doc(db, 'datasets', datasetId);
    const datasetSnap = await getDoc(datasetRef);

    if (!datasetSnap.exists()) {
      return NextResponse.json({ error: 'Dataset not found' }, { status: 404 });
    }

    const dataset = datasetSnap.data();
    const datasetName = dataset.name || 'Untitled Dataset';

    // Check if already published
    const syncRef = doc(db, 'datasetSheetSync', datasetId);
    const syncSnap = await getDoc(syncRef);

    if (syncSnap.exists()) {
      return NextResponse.json(
        { error: 'Dataset is already published to Google Sheets', existingConfig: syncSnap.data() },
        { status: 400 }
      );
    }

    // Get schema fields for headers
    const schemaFields = dataset.schema?.fields || [];
    const headers = ['Submission ID', 'Submitted At', ...schemaFields.map((f: any) => f.label || f.name)];

    // Create main spreadsheet
    const mainSheet = await createSpreadsheetForDataset(datasetId, datasetName, headers);
    if (!mainSheet) {
      return NextResponse.json({ error: 'Failed to create Google Sheet' }, { status: 500 });
    }

    // Create backup folder and spreadsheet
    const backupFolderId = await getOrCreateBackupFolder();
    const backupSheet = await createBackupSpreadsheet(datasetName, backupFolderId);

    // Add headers to backup sheet
    await updateSpreadsheetData(backupSheet.spreadsheetId, 'Sheet1!A1', [headers]);

    // Get existing records and sync them
    const recordsQuery = query(
      collection(db, 'datasetRecords'),
      where('datasetId', '==', datasetId),
      where('status', '==', 'active')
    );
    const recordsSnap = await getDocs(recordsQuery);

    const records: any[][] = [];
    recordsSnap.docs.forEach(doc => {
      const data = doc.data();
      const row = [
        doc.id,
        data.metadata?.submittedAt?.toDate()?.toISOString() || '',
        ...schemaFields.map((f: any) => data.data?.[f.name] || '')
      ];
      records.push(row);
    });

    // Add existing records to both sheets
    if (records.length > 0) {
      await appendToSpreadsheet(mainSheet.spreadsheetId, 'Data', records);
      await appendToSpreadsheet(backupSheet.spreadsheetId, 'Sheet1', records);
    }

    // Save sync configuration
    const syncConfig = {
      datasetId,
      datasetName,
      spreadsheetId: mainSheet.spreadsheetId,
      spreadsheetUrl: mainSheet.spreadsheetUrl,
      sheetName: 'Data',
      backupSpreadsheetId: backupSheet.spreadsheetId,
      backupSpreadsheetUrl: backupSheet.spreadsheetUrl,
      backupFolderId,
      headers,
      autoSync: true,
      createdAt: Timestamp.fromDate(new Date()),
      lastSyncAt: Timestamp.fromDate(new Date()),
      recordCount: records.length
    };

    await setDoc(syncRef, syncConfig);

    // Update dataset with sheet info
    await updateDoc(datasetRef, {
      googleSheetId: mainSheet.spreadsheetId,
      googleSheetUrl: mainSheet.spreadsheetUrl,
      googleSheetSyncEnabled: true,
      updatedAt: Timestamp.fromDate(new Date())
    });

    return NextResponse.json({
      success: true,
      message: 'Dataset published to Google Sheets successfully',
      spreadsheetUrl: mainSheet.spreadsheetUrl,
      backupSpreadsheetUrl: backupSheet.spreadsheetUrl,
      recordsSynced: records.length
    });
  } catch (error: any) {
    console.error('Error publishing to Google Sheets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish to Google Sheets' },
      { status: 500 }
    );
  }
}

// DELETE /api/datasets/[datasetId]/publish-to-sheets - Disconnect from Google Sheet
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ datasetId: string }> }
) {
  try {
    const { datasetId } = await params;
    const { deleteSheet } = await request.json().catch(() => ({ deleteSheet: false }));

    const syncRef = doc(db, 'datasetSheetSync', datasetId);
    const syncSnap = await getDoc(syncRef);

    if (!syncSnap.exists()) {
      return NextResponse.json({ error: 'No Google Sheet sync found for this dataset' }, { status: 404 });
    }

    const syncConfig = syncSnap.data();

    // Optionally delete the main spreadsheet (backup is preserved)
    if (deleteSheet && syncConfig.spreadsheetId) {
      try {
        const { deleteSpreadsheet } = await import('@/lib/google-sheets-service');
        await deleteSpreadsheet(syncConfig.spreadsheetId);
      } catch (error) {
        console.error('Error deleting spreadsheet:', error);
        // Continue even if delete fails
      }
    }

    // Remove sync configuration
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(syncRef);

    // Update dataset
    const datasetRef = doc(db, 'datasets', datasetId);
    await updateDoc(datasetRef, {
      googleSheetId: null,
      googleSheetUrl: null,
      googleSheetSyncEnabled: false,
      updatedAt: Timestamp.fromDate(new Date())
    });

    return NextResponse.json({
      success: true,
      message: 'Google Sheet sync disconnected. Backup spreadsheet preserved in BACKUP-LCConnections folder.'
    });
  } catch (error: any) {
    console.error('Error disconnecting Google Sheet:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to disconnect Google Sheet' },
      { status: 500 }
    );
  }
}

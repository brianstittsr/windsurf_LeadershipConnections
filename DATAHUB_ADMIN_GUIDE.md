# DataHub Admin Platform - Complete Guide

## Overview

DataHub Admin is a comprehensive dataset management and analytics platform integrated into Leadership Connections. It serves as a centralized data storage location for all form submissions and structured data from external applications.

## Features

### 🎯 Core Capabilities

1. **Dataset Management**
   - Create custom datasets with flexible schemas
   - Define field types, validation rules, and constraints
   - Version control for schema changes
   - Soft delete with archive functionality

2. **Data Ingestion**
   - RESTful API for external applications
   - Automatic validation against schema
   - Batch import (CSV, Excel, JSON)
   - Real-time webhook support

3. **Data Viewing & Exploration**
   - Spreadsheet-like table interface
   - Advanced filtering and search
   - Sorting and pagination
   - Detail view for individual records

4. **Analytics & Visualization**
   - Summary statistics
   - Charts and graphs
   - Custom dashboards
   - Real-time data updates

5. **Data Export**
   - CSV, Excel, JSON, PDF formats
   - Filtered exports
   - Scheduled exports
   - API access for programmatic retrieval

6. **Access Control**
   - Role-based permissions (Owner, Editor, Viewer)
   - API key management
   - Audit logging
   - Field-level security

## Architecture

### Database Schema

**Collections:**
- `lcDatasets` - Dataset definitions and schemas
- `lcDatasetRecords` - Actual data records
- `lcDatasetAPIKeys` - API keys for external access
- `lcDatasetAuditLogs` - Audit trail of all operations

### TypeScript Interfaces

```typescript
interface Dataset {
  id: string;
  name: string;
  description: string;
  sourceApplication: string;
  organizationId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  schema: DatasetSchema;
  metadata: DatasetMetadata;
  permissions: DatasetPermissions;
  integration: DatasetIntegration;
}

interface DatasetRecord {
  id: string;
  datasetId: string;
  data: Record<string, any>;
  metadata: DatasetRecordMetadata;
  status: 'active' | 'archived' | 'deleted';
  version: number;
}
```

## Getting Started

### 1. Access DataHub Admin

Navigate to **Admin → DataHub Admin** in the admin panel.

### 2. Create Your First Dataset

1. Click **"Create Dataset"**
2. Fill in basic information:
   - **Name**: Descriptive name for your dataset
   - **Description**: What data this dataset contains
   - **Source Application**: Where the data comes from
   - **Category**: Organize datasets by category
   - **Tags**: Add searchable tags
3. Define schema fields:
   - Click **"Add Field"** to create fields
   - Set field name, label, and type
   - Configure validation rules
   - Mark required fields
4. Click **"Create Dataset"**

### 3. Add Data to Your Dataset

**Option A: Manual Entry**
- Open the dataset
- Click "Add Record"
- Fill in the form
- Submit

**Option B: API Integration**
```javascript
// POST /api/datasets/{datasetId}/records
const response = await fetch(`/api/datasets/${datasetId}/records`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    data: {
      field1: 'value1',
      field2: 'value2'
    },
    metadata: {
      sourceFormSubmissionId: 'form_123',
      submittedBy: 'user_456'
    }
  })
});
```

**Option C: Batch Import**
- Click "Import Data"
- Upload CSV/Excel file
- Map columns to fields
- Import records

## Field Types

### Supported Types

| Type | Description | Use Case |
|------|-------------|----------|
| `text` | Short text input | Names, titles, short answers |
| `textarea` | Long text input | Descriptions, comments, essays |
| `number` | Numeric values | Ages, quantities, scores |
| `email` | Email addresses | Contact information |
| `phone` | Phone numbers | Contact information |
| `url` | Web URLs | Website links, resources |
| `date` | Date values | Birthdays, deadlines, events |
| `boolean` | Yes/No values | Checkboxes, flags |
| `select` | Dropdown selection | Single choice from options |
| `radio` | Radio buttons | Single choice from options |
| `checkbox` | Multiple checkboxes | Multiple selections |
| `array` | List of values | Multiple items |
| `json` | JSON objects | Complex structured data |

### Field Validation

Configure validation rules for each field:

- **Required**: Field must have a value
- **Unique**: Value must be unique across all records
- **Min/Max**: Numeric range validation
- **Pattern**: Regular expression validation
- **Enum**: Restrict to specific values
- **Min/Max Length**: String length validation

## API Reference

### Authentication

All API requests require authentication:

```
Authorization: Bearer {apiKey}
```

Generate API keys in the dataset settings.

### Endpoints

#### List Datasets
```
GET /api/datasets
Query Parameters:
  - organizationId: Filter by organization
  - sourceApplication: Filter by source
  - category: Filter by category
```

#### Get Dataset
```
GET /api/datasets/{datasetId}
```

#### Create Dataset
```
POST /api/datasets
Body: {
  name, description, sourceApplication,
  organizationId, createdBy, schema,
  metadata, permissions
}
```

#### Update Dataset
```
PUT /api/datasets/{datasetId}
Body: { name, description, schema, ... }
```

#### Delete Dataset
```
DELETE /api/datasets/{datasetId}
```

#### List Records
```
GET /api/datasets/{datasetId}/records
Query Parameters:
  - page: Page number (default: 1)
  - pageSize: Records per page (default: 50)
  - sortBy: Field to sort by
  - sortOrder: 'asc' or 'desc'
  - search: Search term
  - status: 'active', 'archived', or 'deleted'
```

#### Create Record
```
POST /api/datasets/{datasetId}/records
Body: {
  data: { field1: value1, ... },
  metadata: { submittedBy, sourceFormSubmissionId, ... }
}
```

#### Get Record
```
GET /api/datasets/{datasetId}/records/{recordId}
```

#### Update Record
```
PUT /api/datasets/{datasetId}/records/{recordId}
Body: { data: { field1: newValue, ... } }
```

#### Delete Record
```
DELETE /api/datasets/{datasetId}/records/{recordId}
```

## Integration with Forms

### Automatic Data Collection

When creating a form, you can link it to a dataset for automatic data collection:

1. Create a dataset with matching fields
2. In form settings, enable "Send to Dataset"
3. Select the target dataset
4. Map form fields to dataset fields
5. All form submissions automatically create dataset records

### Example Integration

```typescript
// In your form submission handler
const handleFormSubmit = async (formData) => {
  // Save to form submissions
  await saveFormSubmission(formData);
  
  // Also send to dataset
  if (form.datasetId) {
    await fetch(`/api/datasets/${form.datasetId}/records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: formData,
        metadata: {
          sourceFormSubmissionId: submissionId,
          sourceApplication: 'LeadershipConnections',
          submittedBy: user?.uid,
          submittedAt: new Date()
        }
      })
    });
  }
};
```

## Data Export

### Export Formats

**CSV Export**
- Comma-separated values
- Compatible with Excel, Google Sheets
- Best for simple data analysis

**Excel Export**
- Multi-sheet workbooks
- Formatted cells
- Best for complex reports

**JSON Export**
- Structured data format
- Best for API consumption
- Includes metadata

**PDF Reports**
- Formatted documents
- Charts and visualizations
- Best for presentations

### Export Options

- **All Records**: Export entire dataset
- **Filtered Records**: Export based on current filters
- **Selected Fields**: Choose which fields to include
- **Include Metadata**: Add submission info, timestamps
- **Scheduled Exports**: Automatic exports on schedule

## Analytics

### Summary Statistics

For each field, view:
- **Total Values**: Count of non-null values
- **Unique Values**: Count of distinct values
- **Null Values**: Count of missing values
- **Top Values**: Most common values with counts

For numeric fields:
- **Min/Max**: Range of values
- **Average**: Mean value
- **Sum**: Total of all values

For text fields:
- **Average Length**: Mean character count

### Time Series Analysis

View record creation trends:
- Records per day/week/month
- Growth rate
- Peak submission times

### Charts

- **Line Charts**: Trends over time
- **Bar Charts**: Comparisons between categories
- **Pie Charts**: Distribution of values
- **Scatter Plots**: Correlations between fields

## Security & Permissions

### Role-Based Access Control

**Owner**
- Full control over dataset
- Can delete dataset
- Manage permissions
- Generate API keys

**Editor**
- Add/edit/delete records
- Modify schema
- Export data
- View analytics

**Viewer**
- View records
- View analytics
- Export data (if allowed)
- Cannot modify data

### API Key Management

1. Navigate to dataset settings
2. Click "API Keys"
3. Click "Generate New Key"
4. Set permissions (read, write, delete)
5. Set rate limit (optional)
6. Set expiration date (optional)
7. Copy and securely store the key

**Security Best Practices:**
- Never commit API keys to version control
- Use environment variables for keys
- Rotate keys regularly
- Set appropriate rate limits
- Use HTTPS for all API calls

### Audit Logging

All operations are logged:
- Record creation, updates, deletions
- Schema changes
- Permission changes
- Data exports
- API key usage

View audit logs in dataset settings.

## Best Practices

### Schema Design

1. **Plan Your Fields**: Think about what data you need before creating the dataset
2. **Use Appropriate Types**: Choose field types that match your data
3. **Add Validation**: Prevent bad data with validation rules
4. **Index Important Fields**: Mark searchable fields as indexed
5. **Document Fields**: Add descriptions to help users understand fields

### Data Quality

1. **Require Key Fields**: Mark essential fields as required
2. **Use Unique Constraints**: Prevent duplicates with unique fields
3. **Validate Input**: Use patterns and enums to enforce data quality
4. **Regular Cleanup**: Archive or delete obsolete records
5. **Monitor Quality**: Check analytics for missing or invalid data

### Performance

1. **Pagination**: Use pagination for large datasets
2. **Indexing**: Index fields used in filters and sorts
3. **Batch Operations**: Use batch import for large data loads
4. **Caching**: Cache frequently accessed data
5. **Archiving**: Archive old records to improve performance

### Organization

1. **Naming Conventions**: Use clear, consistent names
2. **Categories**: Organize datasets by category
3. **Tags**: Add searchable tags for easy discovery
4. **Documentation**: Add descriptions to datasets and fields
5. **Versioning**: Track schema versions for changes

## Troubleshooting

### Common Issues

**Problem**: "Validation failed" error when creating record
**Solution**: Check that all required fields have values and match the expected format

**Problem**: Dataset not appearing in list
**Solution**: Check filters and search terms; verify you have permission to view it

**Problem**: API key not working
**Solution**: Verify key is active, not expired, and has appropriate permissions

**Problem**: Slow performance with large datasets
**Solution**: Use pagination, add indexes to frequently filtered fields

**Problem**: Cannot delete dataset
**Solution**: Verify you are the owner; check for dependent integrations

## Future Enhancements

Planned features for future releases:

- [ ] Real-time collaboration (multiple users editing simultaneously)
- [ ] Advanced analytics with AI insights
- [ ] Natural language querying
- [ ] Automated data quality monitoring
- [ ] Machine learning model training
- [ ] Data lineage tracking
- [ ] Version control for data (git-like branching)
- [ ] Scheduled data processing jobs
- [ ] Custom webhooks for data events
- [ ] Integration with BI tools (Tableau, Power BI)

## Support

For questions or issues:

1. Check this documentation
2. Review API documentation
3. Check audit logs for errors
4. Contact system administrator

---

**Version**: 1.0.0  
**Last Updated**: November 25, 2024  
**Status**: ✅ Production Ready

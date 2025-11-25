import { Timestamp } from 'firebase/firestore';

/**
 * Dataset Schema Definitions
 * Core types for the DataHub Admin platform
 */

export type DatasetFieldType = 
  | 'text' 
  | 'number' 
  | 'date' 
  | 'boolean' 
  | 'email' 
  | 'phone' 
  | 'url' 
  | 'json' 
  | 'array'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox';

export interface DatasetField {
  name: string;
  label: string;
  type: DatasetFieldType;
  required: boolean;
  unique?: boolean;
  indexed?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: any[];
    minLength?: number;
    maxLength?: number;
  };
  metadata?: {
    description?: string;
    unit?: string;
    format?: string;
    placeholder?: string;
    helpText?: string;
  };
  options?: string[]; // For select, radio, checkbox types
}

export interface DatasetSchema {
  fields: DatasetField[];
  version: string;
  primaryKey?: string;
}

export interface DatasetPermissions {
  owners: string[];
  editors: string[];
  viewers: string[];
  publicRead: boolean;
}

export interface DatasetIntegration {
  sourceFormId?: string;
  apiKey?: string;
  webhookUrl?: string;
  autoSync?: boolean;
}

export interface DatasetMetadata {
  recordCount: number;
  lastRecordAt?: Date;
  tags: string[];
  category: string;
  isPublic: boolean;
}

export interface Dataset {
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
  
  // Display settings
  displaySettings?: {
    primaryField?: string;
    secondaryField?: string;
    iconField?: string;
    colorField?: string;
  };
}

export type DatasetRecordStatus = 'active' | 'archived' | 'deleted';

export interface DatasetRecordMetadata {
  submittedAt: Date;
  submittedBy?: string;
  sourceFormSubmissionId?: string;
  sourceApplication: string;
  ipAddress?: string;
  userAgent?: string;
  deviceType?: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
  };
}

export interface DatasetRecordVersion {
  version: number;
  data: Record<string, any>;
  updatedAt: Date;
  updatedBy: string;
  changeNote?: string;
}

export interface DatasetRecord {
  id: string;
  datasetId: string;
  data: Record<string, any>;
  metadata: DatasetRecordMetadata;
  status: DatasetRecordStatus;
  version: number;
  history?: DatasetRecordVersion[];
}

export interface DatasetAPIKey {
  id: string;
  datasetId: string;
  name: string;
  key: string;
  createdBy: string;
  createdAt: Date;
  lastUsedAt?: Date;
  expiresAt?: Date;
  permissions: {
    read: boolean;
    write: boolean;
    delete: boolean;
  };
  rateLimit?: number;
  isActive: boolean;
}

export interface DatasetAuditLog {
  id: string;
  datasetId: string;
  recordId?: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'export' | 'import' | 'schema_change';
  performedBy: string;
  performedAt: Date;
  details: {
    changes?: Record<string, any>;
    recordsAffected?: number;
    exportFormat?: string;
    ipAddress?: string;
  };
}

export interface DatasetAnalytics {
  datasetId: string;
  totalRecords: number;
  recordsToday: number;
  recordsThisWeek: number;
  recordsThisMonth: number;
  averageRecordsPerDay: number;
  fieldStatistics: Record<string, {
    type: DatasetFieldType;
    totalValues: number;
    uniqueValues: number;
    nullValues: number;
    // For numeric fields
    min?: number;
    max?: number;
    average?: number;
    sum?: number;
    // For text fields
    averageLength?: number;
    // For all fields
    topValues?: Array<{ value: any; count: number }>;
  }>;
  timeSeriesData?: Array<{
    date: string;
    count: number;
  }>;
}

export interface DatasetExportConfig {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  includeMetadata: boolean;
  includeHeaders: boolean;
  fields?: string[]; // Specific fields to export, or all if undefined
  filters?: DatasetFilter[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DatasetFilter {
  field: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'startsWith' | 'endsWith' | 
            'greaterThan' | 'lessThan' | 'greaterThanOrEqual' | 'lessThanOrEqual' | 
            'between' | 'in' | 'notIn' | 'isNull' | 'isNotNull';
  value: any;
  value2?: any; // For 'between' operator
}

export interface DatasetQuery {
  filters?: DatasetFilter[];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
}

export interface DatasetImportConfig {
  format: 'csv' | 'excel' | 'json';
  file: File;
  mapping: Record<string, string>; // Map file columns to dataset fields
  skipFirstRow: boolean;
  updateExisting: boolean; // Update records if they exist
  uniqueField?: string; // Field to use for matching existing records
}

// Firestore collection references
export const DATASET_COLLECTIONS = {
  datasets: 'lcDatasets',
  records: 'lcDatasetRecords',
  apiKeys: 'lcDatasetAPIKeys',
  auditLogs: 'lcDatasetAuditLogs',
} as const;

// Helper function to validate data against schema
export function validateDataAgainstSchema(
  data: Record<string, any>,
  schema: DatasetSchema
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const field of schema.fields) {
    const value = data[field.name];

    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`Field '${field.label}' is required`);
      continue;
    }

    // Skip validation if field is not required and value is empty
    if (!value && !field.required) continue;

    // Type validation
    switch (field.type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`Field '${field.label}' must be a valid email address`);
        }
        break;

      case 'phone':
        if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
          errors.push(`Field '${field.label}' must be a valid phone number`);
        }
        break;

      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push(`Field '${field.label}' must be a valid URL`);
        }
        break;

      case 'number':
        if (isNaN(Number(value))) {
          errors.push(`Field '${field.label}' must be a number`);
        } else {
          const num = Number(value);
          if (field.validation?.min !== undefined && num < field.validation.min) {
            errors.push(`Field '${field.label}' must be at least ${field.validation.min}`);
          }
          if (field.validation?.max !== undefined && num > field.validation.max) {
            errors.push(`Field '${field.label}' must be at most ${field.validation.max}`);
          }
        }
        break;

      case 'date':
        if (isNaN(Date.parse(value))) {
          errors.push(`Field '${field.label}' must be a valid date`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          errors.push(`Field '${field.label}' must be true or false`);
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`Field '${field.label}' must be an array`);
        }
        break;

      case 'json':
        if (typeof value === 'string') {
          try {
            JSON.parse(value);
          } catch {
            errors.push(`Field '${field.label}' must be valid JSON`);
          }
        } else if (typeof value !== 'object') {
          errors.push(`Field '${field.label}' must be a JSON object`);
        }
        break;
    }

    // String length validation
    if (typeof value === 'string') {
      if (field.validation?.minLength && value.length < field.validation.minLength) {
        errors.push(`Field '${field.label}' must be at least ${field.validation.minLength} characters`);
      }
      if (field.validation?.maxLength && value.length > field.validation.maxLength) {
        errors.push(`Field '${field.label}' must be at most ${field.validation.maxLength} characters`);
      }
    }

    // Pattern validation
    if (field.validation?.pattern && typeof value === 'string') {
      const regex = new RegExp(field.validation.pattern);
      if (!regex.test(value)) {
        errors.push(`Field '${field.label}' does not match the required pattern`);
      }
    }

    // Enum validation
    if (field.validation?.enum && !field.validation.enum.includes(value)) {
      errors.push(`Field '${field.label}' must be one of: ${field.validation.enum.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Helper function to generate API key
export function generateAPIKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let key = 'lc_';
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

// Helper function to format field value for display
export function formatFieldValue(value: any, field: DatasetField): string {
  if (value === null || value === undefined) return '-';

  switch (field.type) {
    case 'date':
      return new Date(value).toLocaleDateString();
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'array':
      return Array.isArray(value) ? value.join(', ') : String(value);
    case 'json':
      return typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
    case 'number':
      if (field.metadata?.unit) {
        return `${value} ${field.metadata.unit}`;
      }
      return String(value);
    default:
      return String(value);
  }
}

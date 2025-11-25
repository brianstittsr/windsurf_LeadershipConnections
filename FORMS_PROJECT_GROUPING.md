# Forms Management with Project Grouping

## Overview

The Forms Management page has been enhanced with a modern card-based display and powerful project grouping functionality. Forms, datasets, and events can now be organized into projects for better management and organization.

## New Features

### 1. Enhanced Form Cards

**Visual Design:**
- ✅ Modern card layout with gradient headers
- ✅ Status badges (Published/Draft)
- ✅ Project association badges with custom colors
- ✅ Stats grid showing fields, submissions, and QR code status
- ✅ Integration badges (DataHub, Multiple Submissions, Auth Required)
- ✅ Expandable QR code display
- ✅ Action buttons with icons

**Information Displayed:**
- Form title and description
- Publication status
- Template type (if applicable)
- Project assignment
- Field count
- Submission count
- QR code availability
- Public URL
- Integration status

### 2. Project Grouping System

**What are Projects?**
Projects are containers that group related forms, datasets, and events together. This allows you to organize resources by:
- Campaign (e.g., "Annual Gala 2024")
- Program (e.g., "Leadership Development Program")
- Event (e.g., "Spring Conference")
- Initiative (e.g., "Volunteer Recruitment Drive")

**Project Features:**
- Custom name and description
- Color coding (8 colors available)
- Optional icon
- Track associated forms, datasets, and events
- Status tracking (active, archived, completed)
- Metadata (total forms, datasets, submissions)
- Tags for additional organization

### 3. Project Assignment

**How to Assign Forms to Projects:**

1. **From Form Card:**
   - Click "Assign to Project" button on any form card
   - Modal opens with project options

2. **Create New Project:**
   - Click "Create New Project" in modal
   - Enter project name (required)
   - Add description (optional)
   - Choose color from 8 options
   - Click "Create & Assign"

3. **Assign to Existing Project:**
   - Select from list of existing projects
   - See project details (forms count, datasets count)
   - Click to assign

4. **Remove from Project:**
   - Click "Remove from Current Project" button
   - Form becomes unassigned

## Database Schema

### Projects Collection

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  color: string; // Hex color code
  icon?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  status: 'active' | 'archived' | 'completed';
  
  // Associated resources
  formIds: string[];
  datasetIds: string[];
  eventIds: string[];
  
  // Metadata
  metadata: {
    totalForms: number;
    totalDatasets: number;
    totalSubmissions: number;
    lastActivity?: Date;
  };
}
```

### Updated Form Schema

Forms now include:
```typescript
interface CustomForm {
  // ... existing fields ...
  projectId?: string; // NEW - Link to project
  datasetEnabled?: boolean; // NEW - DataHub integration flag
  datasetId?: string; // NEW - Linked dataset ID
}
```

## Components Created

### 1. FormCard Component
**Location:** `/components/Forms/FormCard.tsx`

**Features:**
- Modern card design
- Project badge display
- Stats visualization
- Integration badges
- Action buttons
- QR code toggle

**Props:**
```typescript
{
  form: CustomForm & { 
    projectName?: string;
    projectColor?: string;
    datasetEnabled?: boolean;
    datasetId?: string;
  };
  onEdit: (form) => void;
  onDuplicate: (form) => void;
  onDelete: (formId) => void;
  onGenerateQR: (formId) => void;
  onAssignProject: (formId) => void;
  generatingQR?: boolean;
}
```

### 2. ProjectAssignmentModal Component
**Location:** `/components/Forms/ProjectAssignmentModal.tsx`

**Features:**
- Create new projects
- Assign to existing projects
- Remove from projects
- Color picker
- Project list with details

**Props:**
```typescript
{
  formId: string;
  formTitle: string;
  currentProjectId?: string;
  onClose: () => void;
  onAssigned: () => void;
}
```

## Usage Examples

### Creating a Project

```typescript
// Example: Annual Gala 2024 Project
{
  name: "Annual Gala 2024",
  description: "All forms and datasets for the 2024 annual fundraising gala",
  color: "#3B82F6", // Blue
  status: "active",
  formIds: ["form1", "form2"],
  datasetIds: ["dataset1"],
  eventIds: ["event1"]
}
```

### Assigning Form to Project

```typescript
// Update form with project ID
await updateDoc(doc(db, 'customForms', formId), {
  projectId: projectId,
  updatedAt: Timestamp.fromDate(new Date())
});

// Add form to project's formIds array
await updateDoc(doc(db, 'projects', projectId), {
  formIds: arrayUnion(formId),
  updatedAt: Timestamp.fromDate(new Date())
});
```

### Querying Forms by Project

```typescript
// Get all forms for a project
const project = await getDoc(doc(db, 'projects', projectId));
const formIds = project.data().formIds;

// Fetch forms
const forms = await Promise.all(
  formIds.map(id => getDoc(doc(db, 'customForms', id)))
);
```

## Benefits

### Organization
- **Group Related Resources**: Keep forms, datasets, and events together
- **Visual Identification**: Color-coded projects for quick recognition
- **Easy Navigation**: Find all resources for a specific initiative

### Management
- **Bulk Operations**: Perform actions on all resources in a project
- **Status Tracking**: Mark projects as active, archived, or completed
- **Metadata**: Track total forms, datasets, and submissions per project

### Collaboration
- **Shared Context**: Team members understand resource relationships
- **Project Ownership**: Track who created and manages each project
- **Activity Tracking**: See when projects were last updated

### Reporting
- **Project Analytics**: View metrics across all project resources
- **Resource Allocation**: See which projects have most forms/datasets
- **Activity Monitoring**: Track submission trends by project

## Color Options

Projects can be assigned one of 8 colors:

1. **Blue** (#3B82F6) - Default, general purpose
2. **Green** (#10B981) - Success, growth initiatives
3. **Amber** (#F59E0B) - Warning, attention needed
4. **Red** (#EF4444) - Urgent, high priority
5. **Purple** (#8B5CF6) - Creative, special events
6. **Pink** (#EC4899) - Community, engagement
7. **Cyan** (#06B6D4) - Technology, innovation
8. **Orange** (#F97316) - Energy, campaigns

## Best Practices

### Naming Projects
- Use clear, descriptive names
- Include year if applicable
- Be consistent with naming conventions
- Examples:
  - "Annual Gala 2024"
  - "Leadership Development Q1"
  - "Volunteer Recruitment Spring"

### Organizing Resources
- Group forms that serve the same purpose
- Link related datasets to forms
- Include event registrations in event projects
- Keep projects focused and manageable

### Project Lifecycle
1. **Active**: Currently in use
2. **Completed**: Finished, but keep for reference
3. **Archived**: No longer needed, hide from main view

### Maintenance
- Review projects quarterly
- Archive completed projects
- Update project descriptions
- Remove obsolete resources

## Integration with DataHub

Projects work seamlessly with DataHub:

**Scenario:** Annual Gala Event

1. **Create Project**: "Annual Gala 2024" (Blue)
2. **Create Dataset**: "Gala Attendees"
3. **Create Form**: "Gala Registration"
4. **Link Form to Dataset**: Enable DataHub integration
5. **Assign Both to Project**: Group together
6. **Result**: All registrations flow to dataset, both organized under project

**Benefits:**
- See all gala resources in one place
- Track total submissions across all forms
- Analyze data from all gala datasets
- Generate reports for the entire project

## Firestore Security Rules

```javascript
// Projects collection
match /projects/{projectId} {
  allow read: if isAdmin();
  allow write: if isAdmin();
}

// Forms with project reference
match /customForms/{formId} {
  allow read: if isAdmin() || resource.data.published == true;
  allow write: if isAdmin();
}
```

## Future Enhancements

Planned features:
- [ ] Project dashboard with analytics
- [ ] Bulk assign multiple forms to project
- [ ] Project templates for common use cases
- [ ] Project sharing and collaboration
- [ ] Project-level permissions
- [ ] Export all project data
- [ ] Project timeline view
- [ ] Resource dependencies visualization
- [ ] Project cloning
- [ ] Archive/restore functionality

## API Reference

### Create Project
```typescript
POST /api/projects
{
  name: string;
  description: string;
  color: string;
  createdBy: string;
}
```

### Assign Form to Project
```typescript
PUT /api/forms/{formId}/project
{
  projectId: string;
}
```

### Get Project Resources
```typescript
GET /api/projects/{projectId}/resources
Response: {
  forms: CustomForm[];
  datasets: Dataset[];
  events: CalendarEvent[];
}
```

## Troubleshooting

### Project Not Showing on Form
**Check:**
1. Project exists in database
2. Form has correct projectId
3. Project is in projects state
4. Page has been refreshed

### Can't Assign to Project
**Check:**
1. User is admin
2. Firestore rules are deployed
3. Project collection exists
4. No network errors in console

### Colors Not Displaying
**Check:**
1. Project has valid hex color
2. Color is one of the 8 supported colors
3. CSS is loading correctly

## Support

For questions or issues:
1. Check this documentation
2. Review Firestore rules
3. Check browser console for errors
4. Verify project data in Firestore
5. Contact system administrator

---

**Version**: 1.0.0  
**Last Updated**: November 25, 2024  
**Status**: ✅ Production Ready

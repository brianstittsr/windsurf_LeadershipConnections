# AI Form Builder Wizard 🤖

## Overview

The AI Form Builder Wizard is an intelligent form creation tool that uses AI to automatically generate custom forms based on natural language descriptions. It streamlines the form creation process and includes advanced features like QR code generation, PDF posters, and automatic tracking.

## Features

### ✨ Core Features

1. **AI-Powered Form Generation**
   - Describe your form in plain English
   - AI automatically creates appropriate fields with correct types
   - Intelligent field validation and requirements

2. **Purpose & Outcomes Tracking**
   - Define the purpose of data collection
   - Specify measurable outcomes
   - Track effectiveness of forms over time

3. **QR Code Generation**
   - Automatic QR code creation for each form
   - Easy smartphone access
   - Downloadable QR codes

4. **Printable PDF Posters**
   - Professional poster generation
   - Large, centered QR code
   - Program and form name display
   - Print-ready format

5. **Automatic Device & Location Tracking**
   - Device type (mobile, tablet, desktop)
   - Browser and version
   - Operating system
   - Screen resolution
   - Timezone
   - Approximate location (city/region/country)
   - Referral source
   - Submission timestamp

## How to Use

### Step 1: Access the AI Form Builder

1. Navigate to **Admin → Forms**
2. Click the **"AI Form Builder"** button (purple gradient button with robot icon)

### Step 2: Describe Your Form

Provide a detailed description of the form you need. Be specific about:
- What information you want to collect
- Field types needed
- Required vs optional fields
- Any special requirements

**Example:**
```
I need a volunteer registration form that collects:
- Full name (required)
- Email address (required)
- Phone number (required)
- Availability (checkboxes for days of the week)
- Skills and interests (text area)
- Emergency contact name and phone
- Dietary restrictions
- T-shirt size (dropdown)
```

### Step 3: Define Purpose & Outcomes

**Purpose:** Explain why you're collecting this data
```
Example: To recruit and organize volunteers for our annual 
community service day. We need to match volunteers with 
appropriate tasks based on their skills and availability.
```

**Outcomes:** Specify what you want to measure
```
Example: Track volunteer participation rates, skill distribution, 
preferred time slots, geographic coverage, and volunteer satisfaction. 
Measure year-over-year growth in volunteer engagement.
```

### Step 4: Review & Adjust

- Review the AI-generated form
- Edit title and description if needed
- Check all generated fields
- Set form visibility (public or private)

### Step 5: Generate QR Code & PDF (Optional)

- Enter program/event name
- Generate QR code
- Download QR code image
- Create printable PDF poster

### Step 6: Complete

Click **"Complete & Create Form"** to save your form with all tracking enabled.

## AI API Configuration

The system automatically detects and uses available AI providers:

### Supported AI Providers

1. **OpenAI (GPT-4)**
   - Environment variable: `OPENAI_API_KEY`
   - Model: `gpt-4-turbo-preview`
   - Best for: Complex forms with many fields

2. **Anthropic (Claude)**
   - Environment variable: `ANTHROPIC_API_KEY`
   - Model: `claude-3-sonnet-20240229`
   - Best for: Detailed descriptions and nuanced requirements

3. **Google (Gemini)**
   - Environment variable: `GOOGLE_AI_API_KEY`
   - Model: `gemini-pro`
   - Best for: Fast generation and cost-effectiveness

### Setup Instructions

Add one or more API keys to your `.env.local` file:

```env
# Choose one or more:
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...
```

The system will automatically use the first available provider in this order:
1. OpenAI
2. Anthropic
3. Google

## Automatic Tracking

### What Gets Tracked

Every form submission automatically captures:

#### Device Information
- **Device Type**: Mobile, Tablet, Desktop, or Unknown
- **Browser**: Name and version (Chrome, Firefox, Safari, Edge, Opera)
- **Operating System**: Windows, macOS, Linux, Android, iOS
- **Screen Resolution**: Width x Height in pixels

#### Session Information
- **Timezone**: User's local timezone
- **Language**: Browser language setting
- **Timestamp**: Exact date and time of submission
- **User Agent**: Full browser user agent string
- **Referrer**: Where the user came from (if available)

#### Location Information (Approximate)
- **City**: User's approximate city
- **Region/State**: User's state or region
- **Country**: User's country
- **Coordinates**: Latitude and longitude (if permission granted)

### Privacy & Compliance

- **Not Displayed to Users**: Tracking data is never shown on the form itself
- **Analytics Only**: Data is used for research and analysis purposes
- **Approximate Location**: Uses IP-based geolocation (not GPS unless permitted)
- **No PII**: Tracking data doesn't include personally identifiable information
- **Transparent**: Users can be informed via privacy policy

### Viewing Tracking Data

1. Go to **Admin → Forms**
2. Click **"View Submissions"** for any form
3. Each submission shows tracking data in the details panel

### Analytics Dashboard

View aggregated analytics:
- Device breakdown (mobile vs desktop usage)
- Browser distribution
- Operating system statistics
- Geographic distribution
- Peak submission times
- Referral sources

## QR Code & PDF Features

### QR Code Generation

**Automatic Generation:**
- QR codes are automatically generated for AI-created forms
- Can be manually generated for any form
- High-resolution (400x400px)
- Optimized for smartphone scanning

**Download Options:**
- PNG format
- Transparent background option
- Multiple sizes available

### PDF Poster Generation

**Poster Contents:**
- Program/Event name (customizable)
- Form title
- Large, centered QR code (400x400px)
- Form description
- Instructions for scanning
- Form URL (for manual entry)

**Use Cases:**
- Event registration tables
- Community bulletin boards
- Conference materials
- Volunteer recruitment
- Class sign-ups
- Feedback collection

**Printing Tips:**
- Use letter-size (8.5" x 11") paper
- Print in color for best results
- Use high-quality printer settings
- Laminate for outdoor use

## Best Practices

### Writing Form Descriptions

**Be Specific:**
```
❌ "I need a registration form"
✅ "I need an event registration form with name, email, phone, 
   number of guests (dropdown 1-5), meal preference (vegetarian/
   non-vegetarian), and special accommodations text area"
```

**Include Field Types:**
```
✅ "Include a dropdown for t-shirt size (S, M, L, XL, XXL)"
✅ "Add checkboxes for days available (Mon-Sun)"
✅ "Use a date picker for preferred start date"
```

**Specify Requirements:**
```
✅ "Name, email, and phone are required fields"
✅ "All other fields are optional"
```

### Defining Purpose & Outcomes

**Purpose - Answer "Why?":**
- Why are you collecting this data?
- What problem does it solve?
- Who will use this information?

**Outcomes - Answer "What?":**
- What metrics will you track?
- What decisions will this data inform?
- What success looks like?

### Form Design Tips

1. **Keep It Simple**: Only ask for essential information
2. **Logical Order**: Group related fields together
3. **Clear Labels**: Use descriptive field names
4. **Help Text**: Add placeholders for guidance
5. **Mobile-First**: Remember most users are on mobile devices

## Troubleshooting

### AI Generation Issues

**Problem**: "No AI API key configured"
**Solution**: Add at least one AI provider API key to `.env.local`

**Problem**: "Failed to generate form"
**Solution**: 
- Check your API key is valid
- Ensure you have API credits available
- Try a simpler description
- Check your internet connection

**Problem**: Generated form has wrong field types
**Solution**: Be more specific in your description about field types

### QR Code Issues

**Problem**: QR code won't scan
**Solution**:
- Ensure good lighting
- Print at high resolution
- Check QR code isn't damaged or distorted
- Try different QR code scanner apps

**Problem**: QR code generates but doesn't download
**Solution**:
- Check browser download permissions
- Try right-click → "Save image as"
- Check popup blocker settings

### Tracking Issues

**Problem**: Location data not captured
**Solution**:
- User may have denied location permissions
- IP-based fallback should still work
- Some VPNs may affect location accuracy

**Problem**: Device type shows as "unknown"
**Solution**:
- Rare edge case with unusual browsers
- Basic tracking data should still be captured
- User agent string is always available

## API Endpoints

### Generate Form

**Endpoint**: `POST /api/ai/generate-form`

**Request Body:**
```json
{
  "description": "Form description",
  "purpose": "Purpose of data collection",
  "outcomes": "Desired measurable outcomes"
}
```

**Response:**
```json
{
  "title": "Generated Form Title",
  "description": "Generated form description",
  "fields": [
    {
      "id": "field-1",
      "label": "Field Label",
      "type": "text",
      "required": true,
      "placeholder": "Enter value..."
    }
  ]
}
```

## Database Schema

### Custom Forms Collection

```typescript
{
  id: string;
  title: string;
  description: string;
  slug: string;
  fields: FormField[];
  published: boolean;
  aiGenerated?: boolean;  // NEW
  purpose?: string;        // NEW
  outcomes?: string;       // NEW
  qrCode?: string;
  publicUrl: string;
  submissionCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Form Submissions Collection

```typescript
{
  id: string;
  formId: string;
  data: Record<string, any>;
  trackingData: {           // NEW
    deviceType: string;
    browser: string;
    browserVersion: string;
    os: string;
    screenResolution: string;
    timezone: string;
    timestamp: Date;
    userAgent: string;
    referrer: string;
    language: string;
    approximateLocation?: {
      city?: string;
      region?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    };
  };
  submittedAt: Date;
  userId?: string;
}
```

## Future Enhancements

- [ ] Multi-language form generation
- [ ] Form templates based on previous AI generations
- [ ] A/B testing for form variations
- [ ] Advanced analytics dashboard
- [ ] Email notifications with tracking data
- [ ] Export tracking data to CSV/Excel
- [ ] Integration with CRM systems
- [ ] Conditional logic based on tracking data
- [ ] Heat maps for form field interactions
- [ ] Conversion funnel analysis

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Verify API key configuration
4. Check Firestore security rules
5. Contact system administrator

---

**Version**: 1.0  
**Last Updated**: November 25, 2025  
**Status**: ✅ Production Ready

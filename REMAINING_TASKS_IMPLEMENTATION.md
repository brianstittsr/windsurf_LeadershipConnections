# Remaining Tasks Implementation Guide

## ✅ **Task 1: Fix LC Past Events Page** - COMPLETED

### Changes Made:
- ✅ Removed dark mode background classes (`dark:bg-gray-900`)
- ✅ Ensured white background always shows
- ✅ Removed dark mode text classes for consistent visibility
- ✅ Updated category badges to use primary color theme
- ✅ Both "Past Calendar Events" and "Event Gallery" titles now visible

**Result:** Page now has clean white background with all titles visible.

---

## 📋 **Task 2: Migrate Past Events to Firebase**

### Current Status:
- Past events are stored in `components/Events/eventsData.tsx` (static data)
- Need to migrate 5 events to Firestore `lcPastEvents` collection

### Events to Migrate:
1. Introduction to Construction Concepts 2023 Saturday Program
2. High Point University Pharmacy Visit
3. Technology Visit to Cisco Systems in RTP, NC
4. Women In Pink: Thanksgiving Dinners for Breast Cancer Survivors
5. Democracy Without Walls

### Implementation Steps:

#### Step 1: Create Firestore Collection Schema

```typescript
// lib/firestore-schema.ts - Add this interface
export interface PastEventEntry {
  id: number;
  slug: string;
  title: string;
  paragraph: string;
  image: string;
  date: string;
  location: string;
  tags: string[];
  content?: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  firestoreId?: string;
}
```

#### Step 2: Update Firestore Rules

Add to `firestore.rules`:

```javascript
// Past Events - public read, admin write
match /lcPastEvents/{eventId} {
  allow read: if true;
  allow write: if isAdmin();
}
```

#### Step 3: Create Admin Page for Past Events

Create `app/admin/past-events/page.tsx` (similar to blog-entries admin page) with:
- List of past events with thumbnails
- Add/Edit/Delete functionality
- Form fields: ID, Title, Slug, Summary, Image, Date, Location, Tags, Content, Published

#### Step 4: Create Migration Script

Create `migrate-past-events.js`:

```javascript
// Script to migrate past events to Firebase
require('dotenv').config({ path: '.env.local' });
const { initializeApp, getApps } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase config...
const firebaseConfig = { /* your config */ };

const pastEvents = [
  {
    id: 1,
    slug: "construction-concepts-2023-saturday-program",
    title: "Introduction to Construction Concepts 2023 Saturday Program",
    paragraph: "Students learned hands-on construction skills...",
    image: "/images/programs/2023_SaturdayProgram/Copy of FullSizeRender.jpg",
    date: "Fall 2023",
    location: "Leadership C.O.N.N.E.C.T.I.O.N.S. Center",
    tags: ["Construction", "Trades"],
    published: true,
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date()
  },
  // ... other events
];

async function migratePastEvents() {
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  const db = getFirestore(app);
  
  for (const event of pastEvents) {
    await addDoc(collection(db, 'lcPastEvents'), event);
    console.log(`✅ Migrated: ${event.title}`);
  }
}

migratePastEvents();
```

#### Step 5: Update Past Events Page

Modify `app/lc-past-events/page.tsx` to fetch from Firestore:

```typescript
// Add state for Firestore past events
const [firestorePastEvents, setFirestorePastEvents] = useState([]);

// Fetch from Firestore
useEffect(() => {
  const fetchPastEvents = async () => {
    const eventsRef = collection(db, 'lcPastEvents');
    const q = query(eventsRef, where('published', '==', true), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    // ... map to state
  };
  fetchPastEvents();
}, []);

// Combine Firestore + static events (with deduplication)
const firestoreSlugs = new Set(firestorePastEvents.map(e => e.slug));
const uniqueStaticEvents = eventsData.filter(e => !firestoreSlugs.has(e.slug));
const allEvents = [...firestorePastEvents, ...uniqueStaticEvents];
```

---

## 👥 **Task 3: Update SuperUser Role Permissions**

### Current Location:
- User Management page: `app/admin/users/page.tsx` (or similar)

### Required Changes:

Update SuperUser role to have these permissions:

```typescript
const SUPER_USER_PERMISSIONS = {
  accessAdmin: true,
  addEditEvents: true,
  addEditForms: true,
  addEditContent: true,
  viewAnalytics: true,
  exportData: true,
  archiveContent: true,  // NEW: Can archive but NOT delete
  deleteContent: false,  // REMOVED: Cannot delete
};
```

### Implementation:

1. **Find User Management Component**
   - Locate the file that handles user roles
   - Usually in `app/admin/users/` or `components/Admin/UserManagement/`

2. **Update Role Definition**
   ```typescript
   const roles = {
     superuser: {
       label: 'SuperUser',
       permissions: [
         { key: 'accessAdmin', label: 'Access Admin', enabled: true },
         { key: 'addEditEvents', label: 'Add/Edit Events', enabled: true },
         { key: 'addEditForms', label: 'Add/Edit Forms', enabled: true },
         { key: 'addEditContent', label: 'Add/Edit Content', enabled: true },
         { key: 'viewAnalytics', label: 'View Analytics', enabled: true },
         { key: 'exportData', label: 'Export Data', enabled: true },
         { key: 'archiveContent', label: 'Archive Content (cannot delete)', enabled: true },
       ]
     }
   };
   ```

3. **Update Permission Checks**
   - Replace `canDelete` checks with `canArchive` checks
   - Add archive functionality instead of delete for SuperUsers
   - Only allow full delete for Admin role

---

## 🤖 **Task 4: Add AI Content Generator Button**

### Overview:
Add an "AI Content Generator" button to admin forms that generates content based on the summary field using OpenAI API.

### Affected Forms:
1. Blog Entries (`app/admin/blog-entries/page.tsx`)
2. Past Events (to be created)
3. Past Classes (to be created)
4. Event Calendar (`app/admin/events/page.tsx`)

### Implementation Steps:

#### Step 1: Create AI Content Generator Component

Create `components/Admin/AIContentGenerator.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AIContentGeneratorProps {
  summary: string;
  onContentGenerated: (content: string) => void;
  contentType: 'blog' | 'event' | 'class';
}

export default function AIContentGenerator({ 
  summary, 
  onContentGenerated,
  contentType 
}: AIContentGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const generateContent = async () => {
    if (!summary || summary.trim().length < 20) {
      setError('Please provide a summary of at least 20 characters');
      return;
    }

    setGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary, contentType }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      onContentGenerated(data.content);
    } catch (err) {
      setError('Failed to generate content. Please try again.');
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={generateContent}
        disabled={generating || !summary}
        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors ${
          generating || !summary
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
        }`}
      >
        <Sparkles className={`h-5 w-5 ${generating ? 'animate-spin' : ''}`} />
        {generating ? 'Generating Content...' : 'Generate Content with AI'}
      </button>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <p className="mt-2 text-xs text-gray-500">
        AI will generate detailed content based on your summary. You can edit the generated content before saving.
      </p>
    </div>
  );
}
```

#### Step 2: Create API Route for Content Generation

Create `app/api/generate-content/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CONTENT_PROMPTS = {
  blog: `You are a professional content writer for Leadership C.O.N.N.E.C.T.I.O.N.S., a youth development organization. 
  
  Create engaging, well-structured HTML blog content based on the following summary. The content should:
  - Be 500-800 words
  - Use proper HTML tags with Tailwind CSS classes
  - Include 3-5 sections with h3 headings
  - Be inspiring and educational
  - Focus on youth empowerment and community impact
  
  Summary: {summary}
  
  Return ONLY the HTML content, no explanations.`,
  
  event: `You are writing about a past event for Leadership C.O.N.N.E.C.T.I.O.N.S.
  
  Create detailed HTML content about this event. Include:
  - Event overview and objectives
  - Key activities and highlights
  - Student experiences and learning outcomes
  - Community impact
  - Use h3 headings and proper HTML structure
  
  Summary: {summary}
  
  Return ONLY the HTML content.`,
  
  class: `You are describing a class or workshop for Leadership C.O.N.N.E.C.T.I.O.N.S.
  
  Create comprehensive HTML content including:
  - Class description and goals
  - Skills learned
  - Teaching methods
  - Student outcomes
  - Use proper HTML structure with h3 headings
  
  Summary: {summary}
  
  Return ONLY the HTML content.`
};

export async function POST(request: NextRequest) {
  try {
    const { summary, contentType } = await request.json();

    if (!summary || !contentType) {
      return NextResponse.json(
        { error: 'Summary and content type are required' },
        { status: 400 }
      );
    }

    const prompt = CONTENT_PROMPTS[contentType as keyof typeof CONTENT_PROMPTS];
    if (!prompt) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional content writer specializing in youth development and education content.'
        },
        {
          role: 'user',
          content: prompt.replace('{summary}', summary)
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '';

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
```

#### Step 3: Add to Blog Entries Form

Update `app/admin/blog-entries/page.tsx`:

```typescript
import AIContentGenerator from '@/components/Admin/AIContentGenerator';

// In the form, add before the Content textarea:
<AIContentGenerator
  summary={formData.paragraph}
  contentType="blog"
  onContentGenerated={(content) => {
    setFormData(prev => ({ ...prev, content }));
  }}
/>
```

#### Step 4: Add Environment Variable

Add to `.env.local`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

#### Step 5: Install Dependencies

```bash
npm install openai lucide-react
```

---

## 📝 **Summary of All Tasks**

### Completed:
- ✅ Fixed LC Past Events page background and title visibility

### To Implement:
1. **Past Events Migration:**
   - Create Firestore schema
   - Update Firestore rules
   - Create admin page
   - Create migration script
   - Update past events page to fetch from Firestore

2. **SuperUser Permissions:**
   - Update role definition
   - Change delete to archive
   - Update permission checks

3. **AI Content Generator:**
   - Create AIContentGenerator component
   - Create API route with OpenAI integration
   - Add to all admin forms
   - Install dependencies
   - Add API key to environment

---

## 🚀 **Next Steps**

1. Deploy Firestore rules (add lcPastEvents rule)
2. Run migration script for past events
3. Locate and update User Management page
4. Implement AI Content Generator
5. Test all functionality

**Estimated Time:**
- Past Events Migration: 2-3 hours
- SuperUser Permissions: 30 minutes
- AI Content Generator: 2-3 hours

**Total: ~5-7 hours of development work**

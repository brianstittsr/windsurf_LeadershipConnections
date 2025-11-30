# LC Past Events Migration Guide

## 🎯 Overview

The LC Past Events system has been migrated from static data to a fully dynamic Firebase-powered system with AI-generated article content.

---

## ✅ What's Changed

### **Before:**
- ❌ Events stored in static `eventsData.tsx` file
- ❌ Manual HTML content creation
- ❌ Mixed static and Firebase data
- ❌ No AI article generation

### **After:**
- ✅ All events stored in Firebase Firestore
- ✅ AI-generated article content
- ✅ Fully dynamic loading from Firebase
- ✅ Admin interface for managing events
- ✅ Image paths stored in Firebase
- ✅ Published/unpublished control

---

## 📊 System Architecture

### **Collections:**

#### **`lcPastEvents`**
```javascript
{
  id: "auto-generated",
  slug: "event-url-slug",
  title: "Event Title",
  paragraph: "Short description",
  image: "/images/path/to/image.jpg",
  date: "Fall 2023",
  location: "Event Location",
  tags: ["Tag1", "Tag2"],
  content: "<div>Full HTML article content</div>",
  published: true,
  registrationLink: "https://...",  // optional
  coordinates: {                     // optional
    lat: 35.7796,
    lng: -78.6382
  }
}
```

---

## 🚀 Migration Steps

### **Step 1: Install Dependencies**

```bash
npm install dotenv firebase-admin
# or
yarn add dotenv firebase-admin
```

### **Step 2: Set Up Firebase Admin Credentials**

Add to your `.env.local`:

```env
# Firebase Admin SDK (for migration script)
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Get these from:
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Copy the values from the downloaded JSON file

### **Step 3: Run Migration Script**

The migration script will:
- Read static events from `eventsData.tsx`
- Generate full article content using AI for events without content
- Upload all events to Firebase Firestore

```bash
npx ts-node scripts/migrate-past-events.ts
```

**What it does:**
- ✅ Checks if events already exist (no duplicates)
- ✅ Generates AI articles for events without content
- ✅ Preserves existing article content
- ✅ Sets all events to published
- ✅ Adds migration timestamp

**Expected Output:**
```
Starting migration of past events to Firebase...

Processing: Introduction to Construction Concepts 2023 Saturday Program
Generating article for: Introduction to Construction Concepts 2023 Saturday Program
  ✅ Successfully migrated: construction-concepts-2023-saturday-program

Processing: High Point University Pharmacy Visit
Generating article for: High Point University Pharmacy Visit
  ✅ Successfully migrated: high-point-university-pharmacy-visit

...

✨ Migration complete!
```

### **Step 4: Deploy Firestore Rules**

Deploy the updated Firestore rules:

```bash
firebase deploy --only firestore:rules
```

Or manually update in Firebase Console → Firestore Database → Rules

---

## 🎨 Admin Interface

### **Access:**
- URL: `/admin/lc-past-events`
- Permission: SuperAdmin or SuperUser

### **Features:**

#### **View Events**
- List all past events
- See title, description, date, location, tags
- Edit or delete any event

#### **Add New Event**
- Click "Add New Event" button
- Fill in all fields
- Use "🤖 Generate with AI" button for article content
- Save to Firebase

#### **Edit Event**
- Click "Edit" on any event
- Modify any field
- Regenerate article with AI if needed
- Save changes

#### **AI Article Generation**
- Fill in title, description, date, location, tags
- Click "🤖 Generate with AI" button
- AI creates comprehensive HTML article
- Review and edit as needed
- Save to Firebase

---

## 🌐 Public Page

### **URL:** `/lc-past-events`

### **Features:**
- ✅ Displays past calendar events (from `calendarEvents` collection)
- ✅ Displays past event gallery (from `lcPastEvents` collection)
- ✅ Only shows published events
- ✅ Fully dynamic - no static data
- ✅ Loading states
- ✅ Empty states

### **Data Flow:**
```
User visits /lc-past-events
  ↓
Fetch from Firebase:
  - calendarEvents (where endDate < now, published = true)
  - lcPastEvents (where published = true)
  ↓
Display both sections
  ↓
Click event → View detail page
```

---

## 🤖 AI Article Generation

### **How It Works:**

1. **User fills in basic info:**
   - Title
   - Description
   - Date
   - Location
   - Tags

2. **Click "Generate with AI" button**

3. **API sends to OpenAI:**
   - Model: GPT-4
   - Prompt includes all event details
   - Requests HTML with Tailwind classes

4. **AI generates:**
   - Main heading
   - 5-7 detailed sections
   - Rich paragraphs (3-5 sentences each)
   - Highlighted callout box
   - Professional, inspirational tone

5. **Content returned:**
   - Clean HTML
   - Tailwind CSS classes
   - Ready to save

### **API Endpoint:**
- **Route:** `/api/generate-article`
- **Method:** POST
- **Body:**
  ```json
  {
    "title": "Event Title",
    "paragraph": "Description",
    "date": "Fall 2023",
    "location": "Location",
    "tags": ["Tag1", "Tag2"]
  }
  ```
- **Response:**
  ```json
  {
    "content": "<div class=\"event-content\">...</div>"
  }
  ```

---

## 📸 Image Management

### **Current System:**
- Images stored in `/public/images/` directory
- Paths stored in Firebase as strings
- Example: `/images/programs/2023_SaturdayProgram/image.jpg`

### **Future Enhancement:**
Upload images to Firebase Storage:
1. Create upload component
2. Upload to Firebase Storage
3. Get download URL
4. Store URL in Firestore
5. Display from Firebase Storage

---

## 🔒 Security Rules

### **lcPastEvents Collection:**

```javascript
match /lcPastEvents/{eventId} {
  // Anyone can read published events
  allow read: if resource.data.published == true || isAdmin();
  
  // Only admins can create, update, delete
  allow create, update, delete: if isAdmin();
  
  // Anyone can list (for queries)
  allow list: if true;
}
```

**What this means:**
- ✅ Public can view published events
- ✅ Admins can view all events (including unpublished)
- ✅ Only admins can create/edit/delete
- ✅ Queries work for everyone

---

## 📝 Content Guidelines

### **When Creating Events:**

1. **Title:**
   - Clear and descriptive
   - Include key information
   - Example: "High Point University Pharmacy Visit"

2. **Description (Paragraph):**
   - 2-3 sentences
   - Summarize the event
   - Highlight key activities
   - Example: "LC students visited High Point University to explore pharmaceutical sciences..."

3. **Date:**
   - Can be specific or general
   - Examples: "Fall 2023", "2022", "November 15, 2023"

4. **Location:**
   - Be specific
   - Include city/state if relevant
   - Example: "Research Triangle Park, NC"

5. **Tags:**
   - 2-4 relevant tags
   - Categories: Technology, STEM, Community Service, Civic Engagement, etc.

6. **Image:**
   - High quality
   - Relevant to event
   - Proper path: `/images/folder/image.jpg`

7. **Article Content:**
   - Use AI generation for first draft
   - Review and edit as needed
   - Add specific details AI might miss
   - Include quotes if available
   - Add more images if available

---

## 🎯 Best Practices

### **For Admins:**

1. **Always preview before publishing**
   - Check article content
   - Verify image displays correctly
   - Test on mobile

2. **Use AI generation wisely**
   - Great for initial draft
   - Always review and enhance
   - Add specific details and quotes

3. **Keep descriptions concise**
   - Save details for full article
   - Make it enticing

4. **Tag consistently**
   - Use existing tags when possible
   - Create new tags sparingly

5. **Publish strategically**
   - Unpublish to hide temporarily
   - Use for drafts

---

## 🔧 Troubleshooting

### **Events not showing on public page:**
- ✅ Check `published` is set to `true`
- ✅ Verify Firestore rules are deployed
- ✅ Check browser console for errors
- ✅ Confirm event exists in Firebase Console

### **AI generation fails:**
- ✅ Check OpenAI API key in `.env.local`
- ✅ Verify API key has credits
- ✅ Check server logs for errors
- ✅ Try again (temporary API issues)

### **Images not displaying:**
- ✅ Verify image path is correct
- ✅ Check image exists in `/public/images/`
- ✅ Use forward slashes: `/images/folder/image.jpg`
- ✅ Check file permissions

### **Migration script errors:**
- ✅ Verify Firebase Admin credentials
- ✅ Check `.env.local` has all required vars
- ✅ Ensure OpenAI API key is valid
- ✅ Check network connection

---

## 📊 Data Migration Checklist

Before going live:

- [ ] Run migration script
- [ ] Verify all events in Firebase Console
- [ ] Check article content quality
- [ ] Test public page display
- [ ] Test admin edit functionality
- [ ] Deploy Firestore rules
- [ ] Test AI generation
- [ ] Verify images display correctly
- [ ] Test on mobile devices
- [ ] Remove static data file (optional)

---

## 🚀 Future Enhancements

### **Planned Features:**

1. **Firebase Storage Integration**
   - Upload images directly in admin
   - Store in Firebase Storage
   - Automatic optimization

2. **Rich Text Editor**
   - WYSIWYG editor for articles
   - No HTML knowledge needed
   - Preview mode

3. **Event Categories**
   - Organize by category
   - Filter on public page
   - Category pages

4. **Search Functionality**
   - Search by title, description, tags
   - Filter by date range
   - Sort options

5. **Analytics**
   - Track event views
   - Popular events
   - User engagement

6. **Social Sharing**
   - Share buttons
   - Open Graph meta tags
   - Twitter cards

---

## 📞 Support

### **For Technical Issues:**
- Check Firebase Console logs
- Review browser console errors
- Check server logs
- Contact system administrator

### **For Content Questions:**
- Review content guidelines above
- Use AI generation for inspiration
- Ask for peer review
- Test on staging first

---

## ✅ Success Criteria

Migration is successful when:

- ✅ All 5 static events migrated to Firebase
- ✅ Each event has AI-generated article content
- ✅ Public page loads only from Firebase
- ✅ No static data dependencies
- ✅ Admin can create/edit/delete events
- ✅ AI generation works in admin
- ✅ Images display correctly
- ✅ Published/unpublished control works
- ✅ Firestore rules deployed
- ✅ Mobile responsive

---

**Last Updated**: November 30, 2025
**Version**: 1.0
**System**: Leadership Connections Past Events

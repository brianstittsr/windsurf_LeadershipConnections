# Home Page Admin Content Management - Complete Setup

## Overview

The home page is now fully editable through the admin panel with template-based section management, video control, and dark mode disabled on the admin page.

## ✅ Features Implemented

### 1. **Dark Mode Disabled on Admin Page**
- Admin page (`/admin/home-content`) now uses `bg-white` and explicit color classes
- All text uses `text-gray-900`, `text-gray-700`, `text-gray-600` for visibility
- No dark mode classes that could make content invisible

### 2. **Video URL Management**
- Hero section video is now editable
- Change video path directly in admin panel
- Supports any video file in `/public/videos/` directory
- Default: `/videos/LeadershipConnectionsv3NoAud.mp4`

### 3. **Template-Based Section System**
- **Add sections** from dropdown menu
- **Reorder sections** with up/down arrows
- **Enable/disable** sections with checkbox
- **Delete sections** individually
- **Custom HTML sections** for flexible content

### 4. **Section Types Available**
- **Interactive Benefits** - Pre-built benefits component
- **Mission & Vision** - Pre-built mission component
- **C.O.N.N.E.C.T.I.O.N.S. Meaning** - Pre-built connections component
- **Member Registration** - Pre-built registration component
- **Custom Section** - Add your own HTML content with title

## Admin Panel Structure

### Three Main Tabs:

#### 1. **Hero Section Tab**
Edit the main hero/banner section:
- **Video URL** - Path to background video
- **Subtitle** - Small text above title
- **Title** - Main heading
- **Description** - Paragraph text
- **Primary Button** - Text and link
- **Secondary Button** - Text and link

#### 2. **Page Sections Tab**
Manage all content sections:
- **Add Section** dropdown - Choose section type
- **Section List** - View all sections with:
  - Up/Down arrows to reorder
  - Order number display
  - Section type name
  - Enable/Disable checkbox
  - Delete button
- **Custom Sections** - Edit title and HTML content

#### 3. **CTA Section Tab**
Edit the call-to-action section:
- **Title** - CTA heading
- **Description** - CTA text
- **Button Text** - Button label
- **Button Link** - Button URL

## How to Use

### Accessing the Admin Panel

1. Navigate to: `https://www.ncleadconnect.org/admin/home-content`
2. Sign in with admin credentials
3. You'll see three tabs: Hero Section, Page Sections, CTA Section

### Changing the Hero Video

1. Click "Hero Section" tab
2. Find "Video URL" field at the top
3. Enter new video path (e.g., `/videos/new-video.mp4`)
4. Click "Save Changes" at bottom
5. Video will update on home page immediately

**Video Requirements:**
- Place video file in `/public/videos/` directory
- Supported formats: MP4, WebM
- Recommended: MP4 with H.264 codec
- Keep file size reasonable for web (under 50MB)

### Adding a New Section

1. Click "Page Sections" tab
2. Use "Add Section..." dropdown
3. Select section type:
   - **Interactive Benefits** - Shows benefits cards
   - **Mission & Vision** - Shows mission statement
   - **C.O.N.N.E.C.T.I.O.N.S. Meaning** - Shows acronym breakdown
   - **Member Registration** - Shows registration form
   - **Custom Section** - Create your own content
4. Section appears at bottom of list
5. Click "Save Changes"

### Reordering Sections

1. Find section you want to move
2. Click ▲ (up arrow) to move up
3. Click ▼ (down arrow) to move down
4. Order numbers update automatically
5. Click "Save Changes"

### Disabling a Section

1. Find section to disable
2. Uncheck "Enabled" checkbox
3. Section will be hidden on home page
4. Click "Save Changes"
5. Re-enable anytime by checking box again

### Deleting a Section

1. Find section to delete
2. Click "Delete" button
3. Confirm deletion in popup
4. Section removed from list
5. Click "Save Changes"

### Creating Custom HTML Section

1. Add "Custom Section" from dropdown
2. Section appears with edit fields:
   - **Section Title** - Heading for section
   - **Section Content (HTML)** - HTML code
3. Enter HTML with Tailwind classes
4. Click "Save Changes"

**Example Custom Section HTML:**
```html
<div class="max-w-4xl mx-auto">
  <p class="text-lg text-gray-700 mb-6">
    Your custom content here with <strong>formatting</strong>.
  </p>
  <div class="grid grid-cols-2 gap-6">
    <div class="bg-gray-100 p-6 rounded-lg">
      <h3 class="text-xl font-bold mb-2">Feature 1</h3>
      <p>Description here</p>
    </div>
    <div class="bg-gray-100 p-6 rounded-lg">
      <h3 class="text-xl font-bold mb-2">Feature 2</h3>
      <p>Description here</p>
    </div>
  </div>
</div>
```

## Firebase Structure

### Collection: `siteContent`
### Document: `homePage`

```javascript
{
  hero: {
    title: string,
    subtitle: string,
    description: string,
    primaryButtonText: string,
    primaryButtonLink: string,
    secondaryButtonText: string,
    secondaryButtonLink: string,
    videoUrl: string  // NEW: Video file path
  },
  sections: [  // NEW: Dynamic sections array
    {
      id: string,           // Unique identifier
      type: string,         // 'benefits' | 'mission' | 'connections' | 'registration' | 'custom'
      enabled: boolean,     // Show/hide section
      order: number,        // Display order (1, 2, 3...)
      title: string,        // For custom sections
      content: string,      // HTML content for custom sections
      data: any            // Additional data if needed
    }
  ],
  cta: {
    title: string,
    description: string,
    buttonText: string,
    buttonLink: string
  }
}
```

## Files Modified

### 1. `/app/admin/home-content/page.tsx`
- **Complete rewrite** with template-based section management
- Dark mode disabled with explicit light colors
- Video URL editor added
- Section add/delete/reorder functionality
- Custom HTML section support

### 2. `/hooks/useHomeContent.ts`
- Added `videoUrl` field to hero interface
- Updated default content with video URL

### 3. `/components/Hero/index.tsx`
- Fetches video URL from Firebase
- Uses dynamic video source
- Fallback to default video if not set

### 4. `/components/HomeClient/index.tsx`
- **Complete rewrite** with dynamic section rendering
- Fetches sections from Firebase
- Renders sections based on type and order
- Supports custom HTML sections
- Fallback to default sections if none configured

## Tailwind Classes for Custom Sections

### Common Classes:
```css
/* Containers */
.container              /* Max-width container with padding */
.max-w-4xl mx-auto     /* Centered content, max 896px wide */

/* Text */
.text-3xl font-bold    /* Large heading */
.text-xl font-semibold /* Medium heading */
.text-lg               /* Large paragraph */
.text-gray-700         /* Dark gray text */
.text-gray-600         /* Medium gray text */

/* Spacing */
.mb-6                  /* Margin bottom 1.5rem */
.py-16                 /* Padding top/bottom 4rem */
.px-6                  /* Padding left/right 1.5rem */

/* Layout */
.grid grid-cols-2 gap-6  /* 2-column grid with gap */
.flex items-center       /* Flexbox centered */

/* Backgrounds */
.bg-gray-100           /* Light gray background */
.bg-primary            /* Brand color background */
.rounded-lg            /* Rounded corners */

/* Effects */
.shadow-lg             /* Large shadow */
.hover:shadow-xl       /* Shadow on hover */
```

## Default Section Order

When first set up, sections appear in this order:
1. Hero (always first, not in sections array)
2. Interactive Benefits
3. Mission & Vision
4. C.O.N.N.E.C.T.I.O.N.S. Meaning
5. Member Registration
6. CTA (always last, not in sections array)

## Troubleshooting

### Video Not Playing
- Check video file exists in `/public/videos/`
- Verify file path starts with `/videos/`
- Check file format (MP4 recommended)
- Clear browser cache

### Section Not Showing
- Check "Enabled" checkbox is checked
- Verify section order number
- Check browser console for errors
- Click "Save Changes" after editing

### Admin Page Dark/Invisible Text
- Page should use `bg-white` background
- All text should be `text-gray-900` or similar
- No dark mode classes should be present
- Clear browser cache if issues persist

### Changes Not Saving
- Check Firebase connection
- Verify admin permissions
- Check browser console for errors
- Ensure all required fields filled

### Custom HTML Not Rendering
- Check HTML syntax is valid
- Use Tailwind classes for styling
- Avoid inline styles when possible
- Test HTML in browser console first

## Best Practices

### Video Management
- Keep video files under 50MB
- Use MP4 format with H.264 codec
- Optimize for web before uploading
- Test on mobile devices
- Provide fallback image if needed

### Section Organization
- Keep sections in logical order
- Don't have too many sections (5-7 ideal)
- Use custom sections sparingly
- Test on mobile after reordering
- Disable unused sections instead of deleting

### Custom HTML
- Use Tailwind classes for consistency
- Keep HTML semantic and accessible
- Test responsiveness (mobile/tablet/desktop)
- Avoid complex JavaScript
- Keep content concise

### Content Updates
- Save frequently while editing
- Test changes on live site
- Keep backup of working configuration
- Document custom sections
- Review mobile appearance

## Testing Checklist

- [ ] Admin page loads with light background
- [ ] All text is visible (not dark on dark)
- [ ] Video URL field works
- [ ] Can add new sections
- [ ] Can reorder sections
- [ ] Can enable/disable sections
- [ ] Can delete sections
- [ ] Custom sections render HTML
- [ ] Changes save to Firebase
- [ ] Home page reflects changes
- [ ] Video plays on home page
- [ ] Sections appear in correct order
- [ ] Mobile responsive
- [ ] All buttons work

## Next Steps

1. ✅ Access admin panel at `/admin/home-content`
2. ✅ Verify dark mode is off (light background)
3. ✅ Test changing video URL
4. ✅ Add/remove/reorder sections
5. ✅ Create custom HTML section
6. ✅ Save and verify on home page
7. ✅ Test on mobile devices

All home page content is now fully manageable through the admin panel with template-based sections!

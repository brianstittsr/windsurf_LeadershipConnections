# Member Profile Setup Wizard ✨

## Overview

A step-by-step wizard interface for completing the LC Member Profile, making it easier for users to fill out their information without feeling overwhelmed.

## Features

### 🎯 6-Step Process

1. **Personal Info** - Basic information (name, email, location, photo)
2. **Program Info** - LC program participation details
3. **Professional** - Career, expertise, and skills
4. **Networking** - Connection and mentorship preferences
5. **Community** - Volunteer interests and causes
6. **Privacy** - Profile visibility settings

### ✨ Key Features

- **Visual Progress Tracking** - Progress bar and step indicators
- **Step Validation** - Required fields checked before advancing
- **Save Progress** - Can exit and return later
- **Completion Percentage** - Real-time profile completeness tracking
- **Navigation Controls** - Previous/Next buttons with keyboard support
- **Responsive Design** - Works on all devices

## Access Points

### Option 1: Direct Link
Navigate to: `/admin/lc-profile/wizard-page`

### Option 2: From Profile Page
Click the **"Setup Wizard"** button on the main profile page

### Option 3: Auto-Prompt
Users with <50% profile completion see a helpful link to the wizard

## Wizard Flow

```
┌─────────────────────────────────────────────┐
│  Step 1: Personal Info (Required)           │
│  ✓ First Name, Last Name, Email             │
│  ○ Photo, Phone, LinkedIn                   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Step 2: Program Info (Required)            │
│  ✓ At least one LC program                  │
│  ○ Graduation year, participation type      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Step 3: Professional (Optional)            │
│  ○ Current employer, title, industry        │
│  ○ Expertise areas, skills, languages       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Step 4: Networking (Optional)              │
│  ○ Mentorship preferences                   │
│  ○ Speaking availability                    │
│  ○ Contact methods                          │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Step 5: Community (Optional)               │
│  ○ Volunteer interests                      │
│  ○ Causes you support                       │
│  ○ Geographic interests                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  Step 6: Privacy (Optional)                 │
│  ○ Profile visibility settings              │
│  ○ What information to show                 │
│  ○ Directory inclusion                      │
└─────────────────────────────────────────────┘
                    ↓
              [Complete Profile]
```

## Validation Rules

### Step 1 - Personal Info
- ✅ First Name (required)
- ✅ Last Name (required)
- ✅ Email (required)
- ○ All other fields optional

### Step 2 - Program Info
- ✅ At least one LC program (required)
- ○ Program details optional but recommended

### Steps 3-6
- ○ All fields optional
- Encouraged for better networking

## User Experience

### Progress Indicators

**Visual Progress Bar**
- Shows current step out of 6
- Displays overall completion percentage
- Smooth animations on step changes

**Step Circles**
- Gray: Not started
- Primary color with ring: Current step
- Green with checkmark: Completed

**Mobile Responsive**
- Step titles hidden on mobile
- Touch-friendly buttons
- Optimized layout

### Navigation

**Next Button**
- Validates current step
- Advances to next step
- Smooth scroll to top

**Previous Button**
- Returns to previous step
- No validation required
- Disabled on first step

**Complete Profile Button**
- Only shown on final step
- Saves all data to Firestore
- Redirects to profile view

**Save and Finish Later**
- Available on all steps
- Saves current progress
- Returns to main profile page

## Technical Implementation

### File Structure
```
app/admin/lc-profile/
├── page.tsx              # Main profile view
└── wizard-page.tsx       # Step-by-step wizard
```

### State Management
- Uses React hooks for local state
- Shares same form data structure as main profile
- Real-time validation
- Auto-save on completion

### Components Reused
- `PersonalInfoSection`
- `ProgramInfoSection`
- `ProfessionalInfoSection`
- `NetworkingSection`
- `CommunitySection`
- `PrivacySection`

All sections work in both wizard and standard modes.

## Benefits

### For Users
- ✅ Less overwhelming than one long form
- ✅ Clear progress tracking
- ✅ Can complete at their own pace
- ✅ Guided experience with descriptions
- ✅ Validation prevents errors

### For Admins
- ✅ Higher profile completion rates
- ✅ Better data quality
- ✅ Reduced support requests
- ✅ Improved user onboarding

## Customization

### Adding New Steps

1. Add to `WIZARD_STEPS` array:
```typescript
{ id: 7, title: 'New Step', description: 'Step description' }
```

2. Add validation in `validateStep()`:
```typescript
case 7:
  return !!(formData.yourField);
```

3. Add step content:
```tsx
{currentStep === 7 && (
  <YourNewSection
    formData={formData}
    editMode={true}
    onInputChange={handleInputChange}
  />
)}
```

### Styling

Colors and styles use Tailwind CSS classes:
- Primary color: `bg-primary`, `text-primary`
- Success: `bg-green-500`, `text-green-600`
- Gray scale: `bg-gray-50` through `bg-gray-900`

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA labels on progress indicators
- ✅ Focus management on step changes
- ✅ Screen reader friendly
- ✅ High contrast colors

## Testing Checklist

- [ ] Complete wizard from start to finish
- [ ] Test validation on required fields
- [ ] Navigate backward and forward
- [ ] Save and return later
- [ ] Test on mobile device
- [ ] Verify data saves correctly
- [ ] Check progress percentage updates
- [ ] Test with incomplete profile
- [ ] Test with existing profile

## Future Enhancements

- [ ] Auto-save on each step
- [ ] Email reminders for incomplete profiles
- [ ] Gamification (badges, achievements)
- [ ] Social sharing of completed profile
- [ ] Profile preview before completion
- [ ] Import from LinkedIn
- [ ] Bulk upload for admins

---

**Status**: ✅ Complete and Ready to Use
**Version**: 1.0
**Created**: November 25, 2025

# Strategic Planning Component

An interactive brainstorming methods showcase component with dynamic menu selection, similar to the BMAD Method pattern.

## Features

- **Interactive Menu System**: Click different brainstorming methods to view their details
- **Smooth Transitions**: Animated content updates when switching between methods
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark Mode Support**: Fully compatible with light/dark themes
- **Two Versions Available**:
  - **Static**: Pre-defined methods (default)
  - **Dynamic**: Pulls data from Firestore database

## Usage

### Static Version (Default)

```tsx
import StrategicPlanning from '@/components/StrategicPlanning';

export default function Page() {
  return <StrategicPlanning />;
}
```

### Dynamic Version (Database-Driven)

```tsx
import { StrategicPlanningDynamic } from '@/components/StrategicPlanning';

export default function Page() {
  return <StrategicPlanningDynamic />;
}
```

## Admin Management

Manage brainstorming methods through the admin panel:

1. Navigate to `/admin/strategic-planning`
2. Add, edit, or delete brainstorming methods
3. Set the order of methods
4. Toggle published status
5. Customize icons, descriptions, and key points

## Default Methods Included

1. **Mind Mapping** - Visual thinking tool for organizing ideas
2. **SWOT Analysis** - Strengths, Weaknesses, Opportunities, Threats framework
3. **Six Thinking Hats** - Multiple perspective analysis method
4. **Brainwriting (6-3-5)** - Silent brainstorming technique
5. **SCAMPER Technique** - Creative thinking prompts
6. **Rapid Ideation** - Fast-paced idea generation

## Customization

### Adding New Methods (Static)

Edit `components/StrategicPlanning/index.tsx` and add to the `brainstormingMethods` array:

```tsx
{
  icon: <FaYourIcon className="text-4xl text-primary" />,
  title: 'Your Method Name',
  description: 'Detailed description...',
  imageUrl: '/images/strategic-planning/your-image.jpg',
  keyPoints: [
    'Point 1',
    'Point 2',
    'Point 3'
  ],
  bestFor: 'When to use this method'
}
```

### Available Icons

- FaLightbulb
- FaBrain
- FaProjectDiagram
- FaUsers
- FaChartLine
- FaRocket
- FaBullseye
- FaCogs
- FaCompass

## Firestore Schema

Collection: `strategicPlanningMethods`

```typescript
interface BrainstormingMethod {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon name from available icons
  imageUrl: string;
  keyPoints: string[];
  bestFor: string;
  order: number;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

## Styling

The component uses:
- **Tailwind CSS** for styling
- **Custom animations** for smooth transitions
- **Primary color scheme** from your theme
- **Dark mode classes** for theme switching

## Integration Pattern

This component follows the same interactive pattern as:
- `InteractiveBenefits` component
- Tab-based content switching
- Left sidebar menu with right content display
- Hover and active states for better UX

## Pages Using This Component

- `/strategic-planning` - Public-facing page
- `/admin/strategic-planning` - Admin management page

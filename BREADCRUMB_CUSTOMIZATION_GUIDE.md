# BreadcrumbNav Component Guide

## Overview
The `BreadcrumbNav` component is a reusable, dynamic breadcrumb navigation component that automatically generates breadcrumb items based on the current route. It appears below the main navigation bar on all pages.

## File Location
```
src/components/BreadcrumbNav.jsx
```

## Component Structure

### Default Implementation
```jsx
import BreadcrumbNav from '@/components/BreadcrumbNav';

// In your page component
<Navigation />  // Main navbar
<BreadcrumbNav />  // Breadcrumb appears here automatically
```

## How It Works

1. **Automatic Route Detection**: Uses React Router's `useLocation()` hook
2. **Dynamic Breadcrumb Generation**: `useBreadcrumbs()` hook creates breadcrumb items based on current path
3. **Navigation Ready**: Clicking parent breadcrumbs navigates to those routes
4. **Current Page Highlighting**: Last breadcrumb (current page) is bold and non-clickable

## Styling Customization

### Quick Styling Options

#### Option 1: Custom Wrapper Styles
Edit the outer div in `BreadcrumbNav.jsx`:

```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-background/80 backdrop-blur-sm border-b border-border/40 pt-3 pb-3 px-6">
```

**Available Tailwind Classes to Modify:**
- `bg-background/80` → Change background color/opacity
- `backdrop-blur-sm` → Change blur intensity (blur-none, blur-md, blur-lg)
- `border-b border-border/40` → Change border style
- `pt-3 pb-3` → Change vertical padding
- `px-6` → Change horizontal padding

#### Option 2: Page-Specific Customization
Create a custom wrapper for specific pages:

```jsx
// In your page component
const CustomBreadcrumb = () => (
  <div className="fixed top-[70px] left-0 w-full z-40 bg-blue-500/10 backdrop-blur-lg border-b border-blue-500/30 pt-4 pb-4 px-8">
    <BreadcrumbNav />
  </div>
);
```

#### Option 3: Extended BreadcrumbNav Variants
Create styled variants in a new file:

```jsx
// src/components/BreadcrumbNav/BreadcrumbLight.jsx
export function BreadcrumbLight() {
  return (
    <div className="fixed top-[70px] left-0 w-full z-40 bg-white/50 backdrop-blur-sm border-b border-gray-200 pt-3 pb-3 px-6">
      <BreadcrumbNav />
    </div>
  );
}

// src/components/BreadcrumbNav/BreadcrumbDark.jsx
export function BreadcrumbDark() {
  return (
    <div className="fixed top-[70px] left-0 w-full z-40 bg-black/80 backdrop-blur-lg border-b border-white/20 pt-4 pb-4 px-6">
      <BreadcrumbNav />
    </div>
  );
}
```

## Styling Examples

### Minimal (Light Background)
```jsx
// In BreadcrumbNav.jsx, replace the div with:
<div className="fixed top-[70px] left-0 w-full z-40 bg-white/40 backdrop-blur-none border-b border-gray-200 pt-2 pb-2 px-4">
```

### Bold (Dark Background)
```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700 pt-4 pb-4 px-8">
```

### Colorful (Blue Accent)
```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-blue-50 dark:bg-blue-950/20 backdrop-blur-sm border-b border-blue-200 dark:border-blue-900/30 pt-3 pb-3 px-6">
```

### Transparent (Glass Effect)
```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-transparent backdrop-blur-xl border-b border-white/20 pt-3 pb-3 px-6">
```

## Breadcrumb Item Styling

Edit the Breadcrumb components in `src/components/ui/breadcrumb.jsx`:

```jsx
// Current page style (BreadcrumbPage)
className="font-medium text-foreground dark:text-gray-100"

// Parent link style (BreadcrumbLink)
className="transition-colors hover:text-foreground dark:hover:text-gray-200 cursor-pointer"

// Separator style (BreadcrumbSeparator)
className="[&>svg]:size-3.5"
```

## Responsive Design

The current implementation is fully responsive:
- Works on mobile, tablet, and desktop
- Fixed positioning ensures visibility on all screen sizes
- Flex layout adapts to content

To customize responsiveness, modify the className in `BreadcrumbNav.jsx`:

```jsx
// Add responsive padding
<div className="fixed top-[70px] left-0 w-full z-40 bg-background/80 backdrop-blur-sm border-b border-border/40 pt-2 pb-2 md:pt-3 md:pb-3 px-3 md:px-6">

// Add responsive text size
// Modify in BreadcrumbList className
className="flex flex-wrap items-center gap-1 md:gap-1.5 break-words text-xs md:text-sm"
```

## Integration with Pages

All main pages already use BreadcrumbNav:
- ✅ `src/pages/Home.jsx`
- ✅ `src/pages/Profile.jsx`
- ✅ `src/pages/Leaderboard.jsx`
- ✅ `src/pages/Result.jsx`

The Navigation component imports BreadcrumbNav automatically, so no additional setup needed!

## Advanced: Creating Page-Specific Breadcrumb Variants

Create themed breadcrumbs for different page types:

```jsx
// src/components/BreadcrumbNav/BreadcrumbVariants.jsx
import BreadcrumbNav from '../BreadcrumbNav';

export const BreadcrumbHome = () => (
  <div className="fixed top-[70px] left-0 w-full z-40 bg-gradient-to-r from-blue-500/5 to-green-500/5 backdrop-blur-sm border-b border-border/40 pt-3 pb-3 px-6">
    <BreadcrumbNav />
  </div>
);

export const BreadcrumbProfile = () => (
  <div className="fixed top-[70px] left-0 w-full z-40 bg-purple-500/5 backdrop-blur-sm border-b border-purple-500/20 pt-3 pb-3 px-6">
    <BreadcrumbNav />
  </div>
);

export const BreadcrumbLeaderboard = () => (
  <div className="fixed top-[70px] left-0 w-full z-40 bg-yellow-500/5 backdrop-blur-sm border-b border-yellow-500/20 pt-3 pb-3 px-6">
    <BreadcrumbNav />
  </div>
);
```

Then use in your pages:
```jsx
import { BreadcrumbProfile } from '@/components/BreadcrumbNav/BreadcrumbVariants';

function Profile() {
  return (
    <>
      <Navigation />
      <BreadcrumbProfile />
      {/* Page content */}
    </>
  );
}
```

## Files Related to BreadcrumbNav

1. **Component File**: `src/components/BreadcrumbNav.jsx` - Main breadcrumb component
2. **UI Components**: `src/components/ui/breadcrumb.jsx` - Shadcn breadcrumb primitives
3. **Hook**: `src/hooks/useBreadcrumbs.js` - Route-to-breadcrumb logic
4. **Navigation**: `src/components/ui/Navagation.jsx` - Imports BreadcrumbNav

## Tips & Tricks

1. **Fast Theme Toggle**: Change `bg-background/80` to switch between light/dark
2. **Disable Breadcrumb**: Comment out `<BreadcrumbNav />` in Navigation.jsx
3. **Custom Routes**: Edit `useBreadcrumbs.js` to add more route mappings
4. **Smooth Animations**: Add transition classes:
   ```jsx
   <div className="... transition-all duration-300">
   ```

---

Now you can easily style the breadcrumb for any design! 🎨

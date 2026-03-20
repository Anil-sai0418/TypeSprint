# BreadcrumbNav - Quick Start Guide

## 📦 What You Got

A **reusable, standalone Breadcrumb component** that you can style however you want!

**Location**: `src/components/BreadcrumbNav.jsx`

## 🚀 How It Works

1. **Automatic**: Generates breadcrumbs based on current route
2. **Clickable**: Click parent breadcrumbs to navigate
3. **Themeable**: Easy to customize styling
4. **Everywhere**: Automatically appears on all pages

## 🎨 How to Style It

### Easiest Way (Change Once, Apply Everywhere)

Open `src/components/BreadcrumbNav.jsx` and modify this line:

```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-background/80 backdrop-blur-sm border-b border-border/40 pt-3 pb-3 px-6">
```

### Example Styles

**Minimal Light**:
```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-gray-50 dark:bg-gray-900 backdrop-blur-none border-b border-gray-200 dark:border-gray-800 pt-2 pb-2 px-4">
```

**Bold Dark**:
```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-gray-900 backdrop-blur-lg border-b border-gray-700 pt-4 pb-4 px-8">
```

**Blue Accent**:
```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-blue-50 dark:bg-blue-950/20 backdrop-blur-sm border-b border-blue-200 dark:border-blue-900/30 pt-3 pb-3 px-6">
```

**Glass Effect**:
```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-transparent backdrop-blur-xl border-b border-white/20 dark:border-white/10 pt-3 pb-3 px-6">
```

**Green Accent** (for TypeSprint theme):
```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-green-50 dark:bg-green-950/20 backdrop-blur-sm border-b border-green-200 dark:border-green-900/30 pt-3 pb-3 px-6">
```

## 📱 Responsive Customization

Add responsive breakpoints:

```jsx
<div className="fixed top-[70px] left-0 w-full z-40 bg-background/80 backdrop-blur-sm border-b border-border/40 pt-2 md:pt-3 pb-2 md:pb-3 px-3 md:px-6">
```

## 🎯 Page-Specific Styles

To style breadcrumbs differently on specific pages, create variants:

**File**: `src/components/BreadcrumbNav/BreadcrumbProfile.jsx`

```jsx
import { useNavigate } from 'react-router-dom';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '../ui/breadcrumb';

export default function BreadcrumbProfile() {
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();

  return (
    <div className="fixed top-[70px] left-0 w-full z-40 bg-purple-50 dark:bg-purple-950/20 backdrop-blur-sm border-b border-purple-200 dark:border-purple-900/30 pt-3 pb-3 px-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <div key={item.href} className="flex items-center gap-1.5">
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {index === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink onClick={() => navigate(item.href)}>
                    {item.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
```

Then use in `Profile.jsx`:

```jsx
import BreadcrumbProfile from '@/components/BreadcrumbNav/BreadcrumbProfile';

function Profile() {
  return (
    <>
      <Navigation />
      <BreadcrumbProfile />  {/* Custom styled breadcrumb */}
      {/* Page content */}
    </>
  );
}
```

## 🎪 Tailwind Classes Breakdown

### Background & Transparency
- `bg-background/80` - Default theme color, 80% opacity
- `bg-white/40` - White, 40% opacity
- `bg-gray-900/90` - Dark gray, 90% opacity
- `bg-blue-50` - Light blue background
- `bg-blue-950/20` - Dark blue, 20% opacity

### Blur Effects
- `backdrop-blur-none` - No blur
- `backdrop-blur-sm` - Small blur (default)
- `backdrop-blur-md` - Medium blur
- `backdrop-blur-lg` - Large blur
- `backdrop-blur-xl` - Extra large blur (glass effect)

### Borders
- `border-b` - Bottom border
- `border-border/40` - Default color, 40% opacity
- `border-gray-200` - Light gray border
- `border-gray-700` - Dark gray border
- `border-blue-200` - Light blue border
- `border-white/20` - White, 20% opacity

### Padding
- `pt-2 pb-2` - Small vertical padding
- `pt-3 pb-3` - Default vertical padding
- `pt-4 pb-4` - Large vertical padding
- `px-4` - Small horizontal padding
- `px-6` - Default horizontal padding
- `px-8` - Large horizontal padding

## ✨ Features

✅ Automatic route detection  
✅ Clickable parent navigation  
✅ Current page highlighting  
✅ Dark mode support  
✅ Fully responsive  
✅ Easy to customize  
✅ Reusable across pages  

## 🔧 Customization Files

| File | Purpose | Edit For |
|------|---------|----------|
| `BreadcrumbNav.jsx` | Main component | Default styling |
| `useBreadcrumbs.js` | Route logic | Add/change routes |
| `breadcrumb.jsx` | UI primitives | Text colors, sizes |

## 💡 Pro Tips

1. **Theme Integration**: Match breadcrumb colors to your accent color
   ```jsx
   bg-green-50 dark:bg-green-950/20  // for green theme (like TypeSprint!)
   ```

2. **Animations**: Add smooth transitions
   ```jsx
   <div className="... transition-all duration-300">
   ```

3. **Shadows**: Add depth
   ```jsx
   <div className="... shadow-sm dark:shadow-lg">
   ```

4. **Gradient Backgrounds**: Creative styling
   ```jsx
   bg-gradient-to-r from-blue-500/5 to-purple-500/5
   ```

---

**That's it! Now you have a fully customizable breadcrumb component!** 🎉

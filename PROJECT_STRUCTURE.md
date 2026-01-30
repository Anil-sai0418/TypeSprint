# TypeSprint - Project Structure Documentation

## 📁 Project Organization

The project is organized with a clean, scalable folder structure for easy maintenance and development.

```
TypeSprint/
├── public/                          # Static files
│   ├── Type-logo.png
│   └── vite.svg
│
├── src/                             # Main source code
│   ├── App.jsx                      # Main app component (clean, routes managed elsewhere)
│   ├── App.css                      # App styles
│   ├── main.jsx                     # Entry point
│   ├── index.css                    # Global styles
│   │
│   ├── router/                      # 🆕 Routing configuration
│   │   ├── routes.jsx               # All route definitions
│   │   └── ProtectedRoute.jsx       # Route protection logic
│   │
│   ├── config/                      # 🆕 Configuration files
│   │   └── (future configs)
│   │
│   ├── pages/                       # Page components
│   │   ├── Home.jsx
│   │   ├── Profile.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Result.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── First.jsx
│   │   ├── Footer.jsx
│   │   └── 404.jsx
│   │
│   ├── components/                  # Reusable components
│   │   ├── BreadcrumbNav.jsx        # Breadcrumb navigation
│   │   ├── ThemeToggle.jsx          # Theme switcher
│   │   ├── DisplayChart.jsx         # Chart display
│   │   ├── BreadcrumbNav/           # Breadcrumb variants
│   │   │   └── (optional variants)
│   │   │
│   │   └── ui/                      # UI component library
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── select.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── breadcrumb.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── chart.jsx
│   │       ├── nav.jsx
│   │       ├── Navagation.jsx       # Main navbar
│   │       └── menubar.jsx
│   │
│   ├── context/                     # React Context
│   │   ├── ThemeContext.jsx
│   │   └── useTheme.js
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useBreadcrumbs.js
│   │   └── (other hooks)
│   │
│   ├── services/                    # API services
│   │   └── api.js                   # All API calls
│   │
│   ├── lib/                         # Utility functions
│   │   ├── utils.js
│   │   └── wpm-utils.js
│   │
│   ├── assets/                      # Images, icons
│   │   └── react.svg
│   │
│   ├── routes/                      # Route-specific pages
│   │   └── type/
│   │       └── page.jsx
│   │
│   └── Loding/                      # Loading component
│       └── Loading.jsx
│
├── Monkey type -B/                  # 🔧 Backend folder
│   ├── server.js
│   ├── package.json
│   ├── middleware/
│   │   └── verifyToken.js
│   ├── models/
│   │   ├── User.js
│   │   └── UserProfile.js
│   └── routes/
│       ├── auth.js
│       ├── profile.js
│       ├── typingTest.js
│       └── utils.js
│
├── Documentation files/
│   ├── BREADCRUMB_README.md
│   ├── BREADCRUMB_QUICK_START.md
│   ├── BREADCRUMB_COMPLETE_GUIDE.md
│   ├── BREADCRUMB_ARCHITECTURE.md
│   └── ... (other guides)
│
├── Configuration files/
│   ├── package.json                 # Frontend dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── jsconfig.json                # JavaScript config
│   ├── eslint.config.js             # ESLint rules
│   ├── components.json              # Component library config
│   ├── index.html                   # HTML entry point
│   └── .gitignore
│
└── Root documentation/
    ├── README.md
    ├── SETUP_GUIDE.md
    └── FIXES_APPLIED.md
```

---

## 🎯 Key Features of This Structure

### ✅ **Separation of Concerns**
- **Pages**: Full page components (Home, Profile, etc.)
- **Components**: Reusable UI components
- **Services**: API communication
- **Hooks**: Shared logic
- **Context**: Global state management

### ✅ **Router Management**
- Routes moved from `App.jsx` to dedicated `router/` folder
- `routes.jsx` - Centralized route definitions
- `ProtectedRoute.jsx` - Authentication logic
- Easy to add/modify routes

### ✅ **Clean App.jsx**
```jsx
// BEFORE: 70+ lines with all route definitions
// AFTER: 18 lines, clean and maintainable
```

### ✅ **Scalable**
- `config/` folder ready for future configurations
- Easy to add new pages, components, hooks
- Each folder has single responsibility

---

## 📂 Folder Purpose Guide

### `pages/`
Full-page components that use Router
- Each file = One complete page
- Handles page-level logic
- Imports from components, services, hooks

### `components/`
Reusable components
- `ui/` - shadcn/ui library components
- Other - Feature components (Breadcrumb, ThemeToggle, etc.)

### `router/`
Application routing configuration
- All routes defined here
- Protected and public route logic
- Easy to maintain and modify

### `services/`
Backend API communication
- `api.js` contains all API calls
- Centralized data fetching
- Error handling

### `hooks/`
Custom React hooks
- Reusable component logic
- `useBreadcrumbs` - Route-based breadcrumb generation
- Custom state management

### `context/`
Global state management
- Theme context
- Authentication (future)
- User data (future)

### `lib/`
Utility functions
- Helper functions
- Constants
- Shared logic

### `Loding/`
Loading-related components
- Loading spinner
- Fallback UI

### `Monkey type -B/` (Backend)
Node.js + Express backend
- API routes
- Database models
- Middleware
- Authentication

---

## 🔄 Data Flow

```
User Action
    ↓
Component (pages/ or components/)
    ↓
Service (services/api.js)
    ↓
Backend (Monkey type -B/)
    ↓
Database (MongoDB)
    ↓
Response → Service
    ↓
Update State (Context or Component)
    ↓
Re-render UI
```

---

## 🚀 How to Use

### Adding a New Page
1. Create file in `src/pages/NewPage.jsx`
2. Add route in `src/router/routes.jsx`
3. Import and use

### Adding a New Component
1. Create file in `src/components/NewComponent.jsx`
2. Export as component
3. Import and use in pages

### Adding an API Call
1. Add function to `src/services/api.js`
2. Call from component
3. Handle response

### Adding a Hook
1. Create file in `src/hooks/useNewHook.js`
2. Export hook
3. Use in components

---

## 📊 File Count by Category

- **Pages**: 8 files
- **Components**: 15+ files
- **Services**: 1 file (api.js)
- **Hooks**: 2 files
- **Context**: 2 files
- **Utils**: 3 files
- **Routes**: 2 files
- **Backend**: 8+ files

---

## ✨ Benefits

✅ **Maintainability** - Clear file organization  
✅ **Scalability** - Easy to add features  
✅ **Reusability** - Shared components and hooks  
✅ **Performance** - Code splitting ready  
✅ **Testing** - Isolated, testable modules  
✅ **Collaboration** - Clear structure for teams  

---

## 🔧 Migration Notes

### What Changed
- Moved route definitions from `App.jsx` to `router/routes.jsx`
- Created `ProtectedRoute.jsx` for auth logic
- App.jsx now focuses on component composition

### What Stayed the Same
- All functionality works the same
- All API calls unchanged
- All components unchanged
- All styles unchanged

### No Breaking Changes
- All imports still work
- All routes still function
- All features work as before

---

## 📝 Naming Conventions

- **Pages**: PascalCase (Home.jsx, Profile.jsx)
- **Components**: PascalCase (Button.jsx, Card.jsx)
- **Hooks**: camelCase with 'use' prefix (useBreadcrumbs.js)
- **Folders**: lowercase (components, pages, services)
- **CSS Classes**: kebab-case (button-primary, card-header)

---

## 🎯 Next Steps

1. **Use the new structure** - All routes are now organized
2. **Add features easily** - Follows the established patterns
3. **Maintain the structure** - Keep each folder's purpose
4. **Scale confidently** - Structure supports growth

---

**Project Structure Organized Successfully!** ✅

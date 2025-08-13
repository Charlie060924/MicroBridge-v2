# Header Visibility Control System

## Overview

This system provides centralized control over header visibility across different pages in the application. It uses a custom hook `useHeaderVisibility` to determine whether the header should be displayed based on the current route.

## How It Works

### 1. Layout Hierarchy

The application has multiple layout layers that can show headers:

- **Root Layout** (`/app/layout.tsx`) - Main application header
- **Site Layout** (`/app/(site)/layout.tsx`) - Site-specific header
- **Employer Portal Layout** (`/app/employer_portal/workspace/layout.tsx`) - Employer app header

### 2. Header Control Logic

The `useHeaderVisibility` hook manages header display based on:

- **No Header Paths**: Routes where headers should be hidden
- **Force Show Paths**: Routes where headers should always be shown
- **Default Behavior**: Show header for all other routes

## Usage

### Using the Hook

```typescript
import { useHeaderVisibility } from "@/hooks/useHeaderVisibility";

function MyLayout({ children }) {
  const shouldShowHeader = useHeaderVisibility();
  
  return (
    <>
      {shouldShowHeader && <Header />}
      {children}
    </>
  );
}
```

### Checking Specific Paths

```typescript
import { shouldShowHeaderForPath } from "@/hooks/useHeaderVisibility";

const shouldShow = shouldShowHeaderForPath("/jobs/edit/123");
// Returns false - header will be hidden
```

## Configuration

### No Header Paths

These routes will hide the header:

```typescript
const noHeaderPaths = [
  "/auth",                    // Authentication pages
  "/onboarding",              // Onboarding flow
  "/students_info",           // Student information pages
  "/student_portal",          // Student portal
  "/jobs/edit",               // Job edit pages
  "/jobs/analytics",          // Job analytics pages
  "/employer_portal"          // Employer portal
];
```

### Force Show Paths

These routes will always show the header:

```typescript
const forceShowHeaderPaths = [
  "/jobs"                     // Main jobs listing page
];
```

## Adding New Routes

To add header control for new routes:

1. **Add to `noHeaderPaths`** if the route should hide the header
2. **Add to `forceShowHeaderPaths`** if the route should always show the header
3. **Update the hook** in `useHeaderVisibility.ts`

### Example: Adding a new admin page

```typescript
// In useHeaderVisibility.ts
const noHeaderPaths = [
  // ... existing paths
  "/admin"                    // Hide header for admin pages
];

const forceShowHeaderPaths = [
  // ... existing paths
  "/admin/dashboard"          // Show header for admin dashboard
];
```

## Best Practices

1. **Be Specific**: Use exact path matches when possible
2. **Use Prefixes**: Use `startsWith()` for route groups (e.g., `/jobs/edit`)
3. **Test Thoroughly**: Verify header behavior on all affected routes
4. **Document Changes**: Update this README when adding new routes

## Troubleshooting

### Header Still Showing

1. Check if the route is in `noHeaderPaths`
2. Verify the layout is using `useHeaderVisibility`
3. Check for conflicting layout logic

### Header Not Showing

1. Check if the route is in `forceShowHeaderPaths`
2. Verify the layout is properly importing the hook
3. Check browser console for errors

## Files

- `useHeaderVisibility.ts` - Main hook and utility functions
- `layout.tsx` - Root layout implementation
- `(site)/layout.tsx` - Site layout implementation
- `jobs/layout.tsx` - Jobs-specific layout

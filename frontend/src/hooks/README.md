# Layout Structure and Header Management

## Overview

This document describes the current layout structure and how headers are managed across different pages in the application.

## Layout Hierarchy

The application has multiple layout layers:

- **Root Layout** (`/app/layout.tsx`) - Base layout with no header (provides theme, context, etc.)
- **Landing Layout** (`/app/(site)/landing-layout.tsx`) - Header for landing page only
- **Site Layout** (`/app/(site)/layout.tsx`) - No header for other marketing pages
- **Student Portal Layout** (`/app/student_portal/workspace/layout.tsx`) - AppHeader for student portal
- **Employer Portal Layout** (`/app/employer_portal/workspace/layout.tsx`) - EmployerAppHeader for employer portal
- **Jobs Layout** (`/app/jobs/layout.tsx`) - No header for job pages

## Header Strategy

### Current Approach

- **Landing Page**: Uses `LandingLayout` with Header component
- **Marketing Pages**: No header (clean, focused experience)
- **Student Portal**: Uses `AppHeader` (portal-specific header)
- **Employer Portal**: Uses `EmployerAppHeader` (portal-specific header)
- **Job Pages**: No header (clean job viewing experience)

## Usage

### Landing Page Layout

```typescript
// In /app/(site)/page.tsx
import LandingLayout from "./landing-layout";

export default function Home() {
  return (
    <LandingLayout>
      <main>
        {/* Landing page content */}
      </main>
    </LandingLayout>
  );
}
```

### Portal Layouts

The student and employer portals use their own specific headers:

```typescript
// Student portal uses AppHeader
// Employer portal uses EmployerAppHeader
// Both are automatically applied via their respective layouts
```

## Adding New Pages

### For Marketing Pages (No Header)

Simply create the page in the `(site)` directory - it will automatically use the no-header layout.

### For Pages That Need Headers

1. **Create a specific layout** for the page/route group
2. **Import and use the appropriate header component**
3. **Wrap the page content** with the layout

### Example: Adding a new section with header

```typescript
// Create /app/new-section/layout.tsx
import Header from "@/components/common/Header";

export default function NewSectionLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
```

## Best Practices

1. **Use Specific Layouts**: Create dedicated layouts for different sections
2. **Keep Headers Minimal**: Only use headers where navigation is essential
3. **Consistent Experience**: Maintain consistent header behavior within sections
4. **Test Responsiveness**: Ensure headers work well on all devices

## Files

- `layout.tsx` - Root layout (no header)
- `(site)/landing-layout.tsx` - Landing page layout with header
- `(site)/layout.tsx` - Marketing pages layout (no header)
- `student_portal/workspace/layout.tsx` - Student portal layout with AppHeader
- `employer_portal/workspace/layout.tsx` - Employer portal layout with EmployerAppHeader
- `jobs/layout.tsx` - Jobs layout (no header)

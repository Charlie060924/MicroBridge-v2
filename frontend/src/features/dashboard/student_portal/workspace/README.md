# Student Homepage Components

This directory contains the components for the student homepage that mimics Coursera's layout and serves as the main hub for exploring micro-internship jobs.

## Components Overview

### 1. StudentHomepage (`StudentHomepage.tsx`)
The main component that brings together all other components. It includes:
- Welcome header with user greeting
- Search functionality
- Featured jobs section
- Ongoing projects tracking
- Personalized recommendations
- Quick stats dashboard

**Props:**
```typescript
interface StudentHomepageProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}
```

### 2. SearchBar (`SearchBar.tsx`)
A comprehensive search component with:
- Job title/company/skills search
- Location filter
- Category dropdown
- Responsive design with dark mode support

**Props:**
```typescript
interface SearchBarProps {
  onSearch: (query: string, location: string, category: string) => void;
}
```

### 3. JobCategoryCard (`JobCategoryCard.tsx`)
Reusable job card component displaying:
- Job title and company
- Location and salary
- Required skills
- Experience level
- Rating and bookmark functionality
- Remote work indicator

**Props:**
```typescript
interface JobCategoryCardProps {
  job: Job;
  onBookmark: (jobId: string) => void;
  onClick: (job: Job) => void;
}
```

### 4. FeaturedJobs (`FeaturedJobs.tsx`)
Horizontally scrollable section for featured jobs with:
- Navigation arrows
- Smooth scrolling
- Scroll indicators
- Responsive design

**Props:**
```typescript
interface FeaturedJobsProps {
  jobs: Job[];
  onBookmark: (jobId: string) => void;
  onJobClick: (job: Job) => void;
}
```

### 5. OngoingProjects (`OngoingProjects.tsx`)
Displays current projects with:
- Progress tracking
- Status indicators
- Due date calculations
- Payment information
- Empty state handling

**Props:**
```typescript
interface OngoingProjectsProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}
```

### 6. Recommendations (`Recommendations.tsx`)
Personalized job recommendations featuring:
- Skill matching percentage
- User skills display
- Gradient design
- Match indicators

**Props:**
```typescript
interface RecommendationsProps {
  jobs: Job[];
  onBookmark: (jobId: string) => void;
  onJobClick: (job: Job) => void;
  userSkills: string[];
}
```

### 7. EmptyState (`EmptyState.tsx`)
Handles empty states with:
- Contextual messaging
- Action suggestions
- Popular search terms
- Clear filters option

**Props:**
```typescript
interface EmptyStateProps {
  searchQuery?: string;
  onClearFilters?: () => void;
  onRefresh?: () => void;
}
```

## Data Types

### Job Interface
```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  duration: string;
  category: string;
  description: string;
  skills: string[];
  rating: number;
  isBookmarked: boolean;
  postedDate: string;
  deadline: string;
  isRemote: boolean;
  experienceLevel: "Entry" | "Intermediate" | "Advanced";
}
```

### Project Interface
```typescript
interface Project {
  id: string;
  title: string;
  company: string;
  status: "In Progress" | "Review" | "Completed" | "Overdue";
  progress: number;
  dueDate: string;
  startDate: string;
  description: string;
  payment: string;
  category: string;
}
```

## Features

### 🎨 Design Features
- **Coursera-inspired layout** with clean, modern design
- **Responsive design** that works on all screen sizes
- **Dark mode support** with seamless theme switching
- **Smooth animations** and hover effects
- **Accessible design** with proper ARIA labels

### 🔍 Search & Filtering
- **Real-time search** with debounced input
- **Multi-criteria filtering** (location, category, skills)
- **Smart search** across job titles, companies, and skills
- **Clear filters** functionality

### 📱 User Experience
- **Personalized recommendations** based on user skills
- **Bookmark functionality** for saving interesting jobs
- **Progress tracking** for ongoing projects
- **Empty states** with helpful suggestions
- **Loading states** for better UX

### 🎯 Key Functionality
- **Horizontal scrolling** for featured jobs
- **Skill matching** with percentage indicators
- **Project status tracking** with visual progress bars
- **Due date calculations** with smart formatting
- **Quick stats dashboard** for overview

## Usage

### Basic Implementation
```tsx
import { StudentHomepage } from '@/components/dashboard/home';

function DashboardPage() {
  const user = {
    name: "John Doe",
    email: "john@example.com"
  };

  return <StudentHomepage user={user} />;
}
```

### Individual Components
```tsx
import { SearchBar, FeaturedJobs, JobCategoryCard } from '@/components/dashboard/home';

function CustomPage() {
  const handleSearch = (query, location, category) => {
    // Handle search logic
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <FeaturedJobs jobs={jobs} onBookmark={handleBookmark} onJobClick={handleJobClick} />
    </div>
  );
}
```

## Styling

All components use Tailwind CSS with:
- **Custom color scheme** matching the design system
- **Responsive breakpoints** for mobile-first design
- **Dark mode variants** for all components
- **Custom utilities** for scrollbar hiding and text truncation

### Custom CSS Classes Added
- `.scrollbar-hide` - Hides scrollbars while maintaining functionality
- `.line-clamp-2` - Truncates text to 2 lines
- `.line-clamp-3` - Truncates text to 3 lines

## Integration Notes

1. **Replace mock data** with actual API calls
2. **Implement navigation** for job/project detail pages
3. **Add authentication** for user data
4. **Connect to backend** for real-time data
5. **Add error handling** for failed API calls
6. **Implement caching** for better performance

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid and Flexbox support required
- Webkit browsers for line-clamp functionality 
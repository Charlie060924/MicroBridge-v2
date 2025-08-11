# UI Components & Features Documentation

This document outlines the enhanced UI components, animations, and features implemented to improve the user experience across the MicroBridge application.

## 🎨 Design System

### Animation Guidelines
- **Duration**: Keep animations under 200ms for responsiveness
- **Easing**: Use `easeOut` for most interactions
- **Stagger**: 0.08s delay between staggered elements
- **Scale**: Subtle hover effects (1.01-1.02 scale)

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Gray scale with dark mode support
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Headings**: Inter font family
- **Body**: Inter font family
- **Consistent spacing**: 4px multiples

## 🧩 Core Components

### Button Component
```tsx
import Button from '@/components/common/ui/Button';

<Button
  variant="primary" // primary | secondary | ghost | danger | outline
  size="md" // sm | md | lg
  icon={Save}
  iconPosition="left" // left | right
  loading={false}
  disabled={false}
  onClick={handleClick}
>
  Save Changes
</Button>
```

**Features:**
- Micro-animations on hover/tap
- Loading states with spinner
- Icon support (left/right positioning)
- Multiple variants and sizes
- Accessibility compliant

### Input Component
```tsx
import Input from '@/components/common/ui/Input';

<Input
  label="Email Address"
  type="email"
  icon={Mail}
  iconPosition="left"
  error="Invalid email format"
  success="Email is valid"
  helperText="We'll never share your email"
  disabled={false}
/>
```

**Features:**
- Built-in label and validation states
- Icon support
- Error/success states with animations
- Helper text
- Focus animations

### Modal Component
```tsx
import Modal from '@/components/common/ui/Modal';

<Modal
  isOpen={isVisible}
  onClose={handleClose}
  title="Edit Profile"
  size="lg" // sm | md | lg | xl
  closeOnOverlayClick={true}
  showCloseButton={true}
  footer={
    <div className="flex space-x-3">
      <Button onClick={handleSave}>Save</Button>
      <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
    </div>
  }
>
  <p>Modal content goes here</p>
</Modal>
```

**Features:**
- Smooth enter/exit animations
- Backdrop blur effect
- Keyboard support (Escape to close)
- Multiple sizes
- Customizable footer

## 🎭 Animation System

### Centralized Animations
```tsx
import { animations } from '@/components/common/ui/Animations';

// Page transitions
<motion.div variants={animations.page}>

// Card animations
<motion.div variants={animations.card}>

// Staggered lists
<motion.div variants={animations.stagger.container}>
  {items.map(item => (
    <motion.div key={item.id} variants={animations.stagger.item}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Available Animation Presets
- `animations.page` - Page transitions
- `animations.card` - Card entrance animations
- `animations.stagger` - Staggered children animations
- `animations.button` - Button interactions
- `animations.input` - Input focus effects
- `animations.modal` - Modal animations
- `animations.fade` - Fade in/out
- `animations.slide` - Slide animations (up, down, left, right)
- `animations.scale` - Scale animations
- `animations.notification` - Notification entrance
- `animations.listItem` - List item animations

## 📱 Loading States

### Skeleton Loaders
```tsx
import Skeleton, { 
  JobCardSkeleton, 
  ProfileSkeleton, 
  DashboardCardSkeleton,
  TableSkeleton 
} from '@/components/common/SkeletonLoader';

// Basic skeleton
<Skeleton variant="text" width="70%" />

// Predefined skeletons
<JobCardSkeleton />
<ProfileSkeleton />
<DashboardCardSkeleton />
<TableSkeleton rows={5} columns={4} />
```

**Features:**
- Animated gradient effect
- Multiple variants (text, circular, rectangular, card, avatar, button)
- Predefined layouts for common components
- Responsive design

## 🎯 Empty States

### Empty State Component
```tsx
import EmptyState, {
  NoJobsEmptyState,
  NoApplicationsEmptyState,
  NoNotificationsEmptyState,
  NoResultsEmptyState
} from '@/components/common/EmptyState';

// Custom empty state
<EmptyState
  icon={Search}
  title="No results found"
  description="Try adjusting your search criteria"
  action={{
    label: "Clear Filters",
    onClick: handleClearFilters,
    variant: "secondary"
  }}
  illustration={<CustomIllustration />}
/>

// Predefined empty states
<NoJobsEmptyState onBrowseJobs={handleBrowseJobs} />
<NoApplicationsEmptyState onBrowseJobs={handleBrowseJobs} />
<NoNotificationsEmptyState />
<NoResultsEmptyState onClearFilters={handleClearFilters} />
```

**Features:**
- Friendly illustrations
- Action buttons
- Consistent messaging
- Predefined states for common scenarios

## 🎹 Keyboard Shortcuts

### Keyboard Shortcuts Hook
```tsx
import { 
  useKeyboardShortcuts,
  useJobShortcuts,
  useProfileShortcuts,
  useSettingsShortcuts 
} from '@/hooks/useKeyboardShortcuts';

// Custom shortcuts
const shortcuts = [
  {
    key: '/',
    action: () => focusSearch(),
    description: 'Focus search'
  },
  {
    key: 's',
    ctrl: true,
    action: () => saveChanges(),
    description: 'Save changes'
  }
];

useKeyboardShortcuts({ shortcuts });

// Predefined shortcuts
useJobShortcuts({
  onSearch: focusSearch,
  onApply: applyToJob,
  onSave: saveJob,
  onClose: closeModal
});

useProfileShortcuts({
  onSave: saveProfile,
  onCancel: cancelEditing,
  onPreview: showPreview
});

useSettingsShortcuts({
  onSave: saveSettings,
  onReset: resetSettings,
  onClose: closeSettings
});
```

### Common Shortcuts
- `/` - Focus search
- `Ctrl+E` - Edit profile
- `?` - Open help
- `Ctrl+S` - Save changes
- `Escape` - Close/cancel
- `Ctrl+R` - Refresh page
- `Ctrl+T` - Open new tab

## 🎬 Sticky Action Bar

### Sticky Action Bar Component
```tsx
import StickyActionBar, {
  EditProfileActionBar,
  JobApplicationActionBar,
  SettingsActionBar
} from '@/components/common/StickyActionBar';

// Custom action bar
<StickyActionBar
  isVisible={hasChanges}
  title="Unsaved Changes"
  actions={[
    {
      label: "Save",
      onClick: handleSave,
      variant: "primary",
      icon: Save,
      loading: isSaving
    },
    {
      label: "Cancel",
      onClick: handleCancel,
      variant: "secondary",
      icon: X
    }
  ]}
/>

// Predefined action bars
<EditProfileActionBar
  isVisible={isEditing}
  onSave={handleSave}
  onCancel={handleCancel}
  onPreview={handlePreview}
  isSaving={isSaving}
/>

<JobApplicationActionBar
  isVisible={isApplying}
  onSubmit={handleSubmit}
  onSaveDraft={handleSaveDraft}
  onCancel={handleCancel}
  isSubmitting={isSubmitting}
/>

<SettingsActionBar
  isVisible={hasChanges}
  onSave={handleSave}
  onReset={handleReset}
  isSaving={isSaving}
  hasChanges={hasChanges}
/>
```

**Features:**
- Smooth slide-up animation
- Context-aware actions
- Loading states
- Responsive design
- Predefined configurations

## 👤 Profile Preview

### Profile Preview Component
```tsx
import ProfilePreview from '@/components/common/ProfilePreview';

<ProfilePreview
  profileData={{
    name: "John Doe",
    email: "john@example.com",
    bio: "Passionate developer...",
    location: "San Francisco, CA",
    experience: "5 years",
    education: "BS Computer Science",
    skills: ["React", "Node.js", "TypeScript"],
    profilePicture: "/avatar.jpg",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev"
  }}
  isVisible={showPreview}
  onClose={() => setShowPreview(false)}
  onEdit={() => {
    setShowPreview(false);
    setIsEditing(true);
  }}
/>
```

**Features:**
- Professional profile layout
- Full-screen modal option
- Social links
- Skills display
- Responsive design
- Smooth animations

## 🎨 Theme Integration

### Dark Mode Support
All components automatically support dark mode through Tailwind CSS classes:
- `dark:bg-gray-900` - Dark backgrounds
- `dark:text-white` - Dark text
- `dark:border-gray-700` - Dark borders
- `dark:hover:bg-gray-800` - Dark hover states

### Theme Context
```tsx
import { useTheme } from '@/context/ThemeContext';

const { theme, toggleTheme, isInitialized } = useTheme();
```

**Features:**
- localStorage persistence
- System preference detection
- Smooth theme transitions
- CSS custom properties

## 📱 Responsive Design

### Breakpoint Strategy
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Responsive Patterns
- Stack elements vertically on mobile
- Use grid layouts for larger screens
- Adjust spacing and typography
- Optimize touch targets (44px minimum)

## ♿ Accessibility

### WCAG AA Compliance
- **Color Contrast**: Minimum 4.5:1 ratio
- **Focus Indicators**: Visible focus rings
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Motion**: Respect `prefers-reduced-motion`

### Accessibility Features
- Semantic HTML structure
- ARIA labels and descriptions
- Focus management
- Keyboard shortcuts
- Screen reader announcements

## 🚀 Performance

### Optimization Strategies
- **Lazy Loading**: Non-critical components
- **Code Splitting**: Route-based splitting
- **Memoization**: React.memo for expensive components
- **Debouncing**: Input handlers
- **Virtualization**: Large lists

### Performance Monitoring
```tsx
import PerformanceMonitor from '@/components/common/PerformanceMonitor';

<PerformanceMonitor />
```

## 📋 Usage Guidelines

### Component Best Practices
1. **Consistency**: Use predefined variants and sizes
2. **Accessibility**: Always include proper labels and ARIA attributes
3. **Performance**: Lazy load when possible
4. **Testing**: Test on multiple devices and screen sizes
5. **Documentation**: Update this guide when adding new components

### Animation Best Practices
1. **Subtle**: Keep animations under 200ms
2. **Purposeful**: Every animation should serve a purpose
3. **Consistent**: Use centralized animation presets
4. **Accessible**: Respect `prefers-reduced-motion`
5. **Performance**: Use transform and opacity for animations

### State Management
1. **Local State**: Use React hooks for component state
2. **Global State**: Use context for theme and user preferences
3. **Persistence**: Use localStorage for user preferences
4. **Validation**: Client-side validation with error states

## 🔧 Development

### Adding New Components
1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Include accessibility features
4. Add dark mode support
5. Create documentation
6. Add to this guide

### Testing Components
1. Unit tests for logic
2. Integration tests for interactions
3. Visual regression tests
4. Accessibility tests
5. Performance tests

### Contributing
1. Follow existing patterns
2. Maintain consistency
3. Add proper documentation
4. Test thoroughly
5. Update this guide

---

For questions or contributions, please refer to the project's contributing guidelines.

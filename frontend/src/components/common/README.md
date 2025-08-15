# Help Center Components

This directory contains reusable components for the help center and FAQ functionality.

## Components

### FAQAccordion
A reusable accordion component for displaying FAQ items with expand/collapse functionality.

**Props:**
- `items: FAQItem[]` - Array of FAQ items to display
- `className?: string` - Additional CSS classes
- `defaultExpanded?: string[]` - Array of FAQ IDs to expand by default

**Usage:**
```tsx
import FAQAccordion, { FAQItem } from '@/components/common/FAQAccordion';

const faqItems: FAQItem[] = [
  {
    id: 'example',
    question: 'How do I create an account?',
    answer: 'Click the Sign Up button and follow the instructions.',
    category: 'account',
    tags: ['signup', 'registration']
  }
];

<FAQAccordion items={faqItems} />
```

### HelpSearch
A search component with debounced input for help center articles.

**Props:**
- `placeholder?: string` - Placeholder text for the search input
- `onSearch: (query: string) => void` - Callback function when search query changes
- `className?: string` - Additional CSS classes
- `initialValue?: string` - Initial search query value

**Usage:**
```tsx
import HelpSearch from '@/components/common/HelpSearch';

<HelpSearch
  placeholder="Search help articles..."
  onSearch={(query) => console.log('Searching for:', query)}
/>
```

### ContactSupportForm
A form component for users to contact support.

**Props:**
- `userRole?: 'student' | 'employer'` - User role for role-specific form fields
- `onClose?: () => void` - Callback function when form should be closed
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import ContactSupportForm from '@/components/common/ContactSupportForm';

<ContactSupportForm
  userRole="student"
  onClose={() => setShowForm(false)}
/>
```

### ContactSupportModal
A modal wrapper for the contact support form.

**Props:**
- `isOpen: boolean` - Whether the modal is open
- `onClose: () => void` - Callback function to close the modal
- `userRole?: 'student' | 'employer'` - User role for the form

**Usage:**
```tsx
import ContactSupportModal from '@/components/common/ContactSupportModal';

<ContactSupportModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  userRole="student"
/>
```

## Types

### FAQItem
```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
}
```

## Features

- **Accessibility**: All components include proper ARIA attributes and keyboard navigation
- **Dark Mode**: Full support for dark mode with appropriate color schemes
- **Responsive**: Mobile-friendly design with responsive layouts
- **Debounced Search**: Search input includes debouncing to prevent excessive API calls
- **Modal Management**: Contact modal includes proper focus management and escape key handling
- **Loading States**: Form submission includes loading states and success/error feedback

## Integration

These components are designed to work together in the help center page (`/help`) but can also be used independently throughout the application for FAQ sections, search functionality, or contact forms.

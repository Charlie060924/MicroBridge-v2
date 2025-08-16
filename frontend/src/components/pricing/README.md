# Pricing System Documentation

## Overview

The MicroBridge pricing system implements a student-first approach with role-based pricing tailored for the Hong Kong market. Students get free access while employers have flexible subscription options.

## Components

### 1. PricingSection (`PricingSection.tsx`)
Main component that handles role-based pricing display.

**Props:**
- `variant`: 'student' | 'employer' | 'general'
- `showHeader`: boolean (default: true)
- `className`: string

**Features:**
- Adapts content based on user type
- Student-specific free messaging
- Employer plan comparison
- Hong Kong localized design

### 2. PricingCard (`PricingCard.tsx`)
Reusable card component for individual pricing plans.

**Props:**
- `plan`: PricingPlan object
- `className`: string
- `showBadge`: boolean (default: true)

**Features:**
- Responsive design
- Icon integration
- CTA button handling
- Security notes for employers

### 3. EmployerPricingPage (`EmployerPricingPage.tsx`)
Complete pricing page for employers with detailed comparisons.

**Features:**
- Back navigation
- Feature comparison table
- FAQ section
- Integration with subscription management

### 4. PricingIcons (`PricingIcons.tsx`)
Shared icon system and Hong Kong localized styling utilities.

## User Experience Flow

### Student Experience
1. **Landing Page**: Clear "Free for Students" message
2. **Emphasis**: No subscription required, focus on accessibility
3. **Features**: Unlimited access to opportunities and career tools
4. **CTA**: Direct signup without payment considerations

### Employer Experience
1. **Plan Selection**: Three tiers (Starter, Growth, Professional)
2. **Feature Highlights**: Job posting, candidate access, secure payments
3. **Comparison Tools**: Detailed feature table
4. **Security Notes**: Hong Kong banking standards, escrow protection

## Design System

### Color Scheme
- **Students**: Green palette (accessibility, growth, free)
- **Employers**: Blue palette (professional, trust, business)
- **Neutral**: Gray palette for general content

### Typography
- Clear hierarchy with bold headings
- Readable body text with proper contrast
- Badge styling for important callouts

### Layout
- Responsive grid system
- Card-based design for consistency
- Rounded corners (Hong Kong preference)
- Appropriate spacing and shadows

## Integration Points

### 1. Landing Pages
- `/student` - Uses `variant="student"`
- `/employer` - Uses `variant="employer"`
- `/` - Uses `variant="general"`

### 2. Employer Portal
- `/employer_portal/workspace/pricing` - Dedicated pricing page
- Navigation link in sidebar

### 3. Subscription Management
- Integration with existing subscription system
- Consistent pricing across all touchpoints

## Localization Features

### Hong Kong Specific
- Currency display in HKD context
- Local banking standards messaging
- Business-friendly design patterns
- Student-first messaging approach

### Accessibility
- High contrast ratios
- Clear font sizes
- Logical tab order
- Screen reader friendly

## Usage Examples

### Basic Implementation
```tsx
import PricingSection from '@/components/pricing/PricingSection';

// Student landing page
<PricingSection variant="student" />

// Employer portal
<PricingSection variant="employer" showHeader={false} />
```

### Custom Integration
```tsx
import PricingCard from '@/components/pricing/PricingCard';
import { FeatureIcons, HKLocalizedStyles } from '@/components/pricing/PricingIcons';

const customPlan = {
  id: 'custom',
  name: 'Custom Plan',
  price: 0,
  billingPeriod: 'month',
  description: 'Tailored for your needs',
  features: ['Feature 1', 'Feature 2'],
  isFree: true,
  ctaText: 'Get Started',
  audience: 'student'
};

<PricingCard plan={customPlan} />
```

## Maintenance

### Adding New Plans
1. Update plan arrays in `PricingSection.tsx`
2. Ensure feature parity across components
3. Update comparison tables
4. Test responsive behavior

### Updating Prices
1. Modify plan definitions
2. Update subscription management component
3. Verify billing integration
4. Update FAQ if needed

### Design Updates
1. Modify `HKLocalizedStyles` in `PricingIcons.tsx`
2. Update component styling consistently
3. Test dark mode compatibility
4. Verify accessibility standards

## Testing Checklist

- [ ] Student variant shows free messaging
- [ ] Employer variant shows all plans
- [ ] Responsive design works on mobile
- [ ] Dark mode compatibility
- [ ] CTA buttons function correctly
- [ ] Icons display properly
- [ ] Accessibility standards met
- [ ] Hong Kong localization appropriate

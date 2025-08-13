# Billing & Subscription System

This directory contains the billing and subscription management components for MicroBridge.

## Overview

The billing system provides role-based functionality:
- **Employers**: Manage project payments, view billing history, and manage subscriptions
- **Students**: Track earnings, view upcoming payments, and payment history

## Components

### Core Billing Components

#### `PaymentSetupModal.tsx`
- Modal for setting up payments with salary and deposit amounts
- Supports credit card and bank transfer payment methods
- Two-step process: amount setup → payment method selection

#### `PaymentStatusBadge.tsx`
- Reusable component for displaying payment status
- Supports multiple statuses: pending, completed, failed, processing, secured, released
- Configurable sizes and icon display

#### `TransactionSummary.tsx`
- Card component for displaying transaction details
- Shows project info, amounts, dates, and status
- Optional detail view toggle

#### `EmployerBillingDashboard.tsx`
- Complete employer billing interface
- Three main sections:
  - **Pending Payments**: Payments that need to be completed
  - **Active Payments**: Secured deposits linked to active projects
  - **Billing History**: Complete transaction history
- Search and filter functionality
- Navigation memory support

#### `StudentBillingDashboard.tsx`
- Complete student billing interface
- Three main sections:
  - **Upcoming Payments**: Scheduled payments to be received
  - **Active Services**: Projects currently in progress with progress bars
  - **Payment History**: Complete history of received payments
- Earnings statistics cards
- Search and filter functionality
- Navigation memory support

### Subscription Components

#### `SubscriptionManagement.tsx`
- Employer-only subscription management
- Current plan display with upgrade/downgrade options
- Available plans comparison (Starter, Growth, Pro)
- Billing history table
- Confirmation modals for plan changes

## Pages

### `/billing`
- Role-based rendering (employer vs student)
- Navigation memory restoration
- Authentication required

### `/subscription`
- Employer-only access
- Students are blocked with friendly message
- Authentication required

### `/billing/checkout`
- Payment completion page
- Receives context from billing page via URL params
- Secure payment form with order summary

## Navigation Memory

The system implements page-to-page navigation memory:

### How it works:
1. Before navigating away from billing, save current state:
   - Active tab
   - Scroll position
   - Search term
   - Any filters

2. When returning to billing:
   - Restore scroll position
   - Optionally restore active tab and search term

### Usage:
```typescript
import { NavigationMemory } from '@/utils/navigationMemory';

// Save state before navigation
NavigationMemory.saveBillingState(activeTab, window.scrollY, searchTerm);

// Restore state on return
const state = NavigationMemory.getState();
if (state && state.origin === '/billing') {
  NavigationMemory.restoreScrollPosition(state.scrollPosition);
}
```

## Role-Based Access

### Employers
- Full access to billing dashboard
- Subscription management
- Payment setup and completion
- Project payment management

### Students
- Access to earnings dashboard
- No subscription access (blocked with friendly message)
- View upcoming and received payments
- Track active services

## API Integration

Currently uses mock data. Replace with actual API calls:

### Billing Data
- Pending payments
- Active payments
- Billing history
- Transaction details

### Subscription Data
- Current plan
- Available plans
- Billing history
- Plan change operations

## Styling

All components use Tailwind CSS classes and follow the existing design system:
- Dark mode support
- Responsive design
- Consistent spacing and colors
- Hover states and transitions

## Future Enhancements

1. **Real API Integration**: Replace mock data with actual backend calls
2. **Stripe Integration**: Real payment processing
3. **Email Notifications**: Payment confirmations and reminders
4. **Advanced Filtering**: Date ranges, status filters, amount ranges
5. **Export Functionality**: PDF invoices and reports
6. **Multi-currency Support**: International payment support
7. **Payment Scheduling**: Recurring payments and installments

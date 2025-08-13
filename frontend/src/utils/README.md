# Origin Tracking Utility

This utility provides origin tracking functionality for navigation between job-related pages in the employer portal.

## Overview

The origin tracking system allows the application to remember where a user came from when they navigate to job view or edit pages, and provides appropriate return navigation.

## Features

- **Origin Context Storage**: Stores the origin page context in sessionStorage
- **Automatic Expiration**: Origin context expires after 1 hour
- **Seamless Navigation**: Provides appropriate return URLs and button text based on origin
- **Fallback Handling**: Defaults to manage-jobs page if no origin is found

## Usage

### Basic Usage

```typescript
import { originTracking } from '@/utils/originTracking';

// Set origin when navigating to job pages
originTracking.setOrigin('homepage'); // or 'manage-jobs'
router.push('/jobs/123');

// Get return information
const returnUrl = originTracking.getReturnUrl(origin);
const returnText = originTracking.getReturnText(origin);
```

### Using the Hook

```typescript
import { useOriginTracking } from '@/utils/originTracking';

const MyComponent = () => {
  const { setOrigin, getReturnUrl, getReturnText } = useOriginTracking();
  
  const handleViewJob = (jobId: string) => {
    setOrigin('homepage');
    router.push(`/jobs/${jobId}`);
  };
  
  const handleBack = () => {
    router.push(getReturnUrl());
  };
  
  return (
    <button onClick={handleBack}>
      {getReturnText()}
    </button>
  );
};
```

## Origin Types

- `'homepage'`: User came from the employer dashboard homepage
- `'manage-jobs'`: User came from the manage jobs page

## Return URLs

- `'homepage'` → `/employer_portal/workspace`
- `'manage-jobs'` → `/employer_portal/workspace/manage-jobs`
- Default fallback → `/employer_portal/workspace/manage-jobs`

## Return Button Text

- `'homepage'` → "Back to Dashboard"
- `'manage-jobs'` → "Back to Manage Jobs"
- Default fallback → "Back to Manage Jobs"

## Implementation Details

The origin tracking uses sessionStorage to persist the origin context across page navigations. The context includes:

- `page`: The origin page type
- `timestamp`: When the origin was set (for expiration)

The context automatically expires after 1 hour to prevent stale navigation state.

## Debugging

The utility includes console logging for debugging:

- Origin setting: `console.log('Origin tracking set:', originContext)`
- Origin retrieval: `console.log('Origin tracking found:', originContext)`
- Return URL generation: `console.log('Return URL:', url, 'for origin:', origin?.page)`
- Return text generation: `console.log('Return text:', text, 'for origin:', origin?.page)`

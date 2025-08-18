# Review System

A comprehensive review system for MicroBridge that allows both students and employers to leave reviews after job completion.

## Features

- **Double-blind reviews**: Reviews are only visible after both parties submit or after 14 days
- **Category-based ratings**: Detailed feedback for different aspects of the working relationship
- **Review badges**: Recognition for consistent high ratings
- **Integration with job completion**: Automatic review prompts after job completion
- **Profile integration**: Reviews displayed on user profiles

## Components

### ReviewModal
A modal component for submitting reviews with:
- Star rating (1-5)
- Category ratings (different for students vs employers)
- Optional comment field
- Success confirmation

### ReviewDisplay
Displays reviews on profile pages with:
- Average rating and total review count
- Rating breakdown (1-5 stars)
- Individual review cards with detailed information
- Badge display

### ReviewsSection
A complete section component that can be added to profile pages:
- Fetches and displays user reviews
- Shows rating statistics
- Handles loading and error states

### ReviewSystem
A wrapper component that provides review functionality:
- Manages review modal state
- Handles review submission
- Provides context for review components

### LeaveReviewButton
A button component that:
- Checks review eligibility
- Opens review modal when clicked
- Only shows for eligible users

### CompleteJobButton
A button component for marking jobs as completed:
- Updates job status
- Triggers review flow
- Shows completion state

## Usage

### Adding Reviews to Profile Pages

```tsx
import { ReviewsSection, ReviewSystem } from '@/components/reviews';

// Wrap your profile page with ReviewSystem
const ProfilePage = () => {
  return (
    <ReviewSystem>
      <div>
        {/* Your profile content */}
        
        {/* Add reviews section */}
        <ReviewsSection
          userId={user.id}
          userType="student" // or "employer"
          showHeader={true}
        />
      </div>
    </ReviewSystem>
  );
};
```

### Adding Review Buttons to Job Cards

```tsx
import { LeaveReviewButton, CompleteJobButton } from '@/components/reviews';

const JobCard = ({ job }) => {
  return (
    <div>
      {/* Job content */}
      
      {/* Complete job button */}
      <CompleteJobButton
        jobId={job.id}
        onComplete={() => console.log('Job completed')}
      />
      
      {/* Leave review button */}
      <LeaveReviewButton
        jobId={job.id}
        revieweeId={job.employerId}
        revieweeName={job.employerName}
        jobTitle={job.title}
      />
    </div>
  );
};
```

## API Integration

The review system integrates with the following API endpoints:

- `POST /reviews` - Create a new review
- `GET /reviews/:userId` - Get reviews for a user
- `POST /jobs/:id/complete` - Mark job as completed
- `GET /reviews/eligibility/:jobId` - Check review eligibility

## Review Categories

### For Students (reviewing employers)
- Clear Requirements
- Professionalism
- Payment Reliability

### For Employers (reviewing students)
- Quality of Work
- Communication
- Timeliness

## Badges

Users can earn badges based on their review performance:
- **Top Rated**: 10+ reviews with 4.5+ average rating
- **Excellent**: 5+ reviews with 4.8+ average rating
- **Consistently Great**: 3+ five-star reviews
- **Experienced**: 20+ total reviews

## Double-Blind System

Reviews follow a double-blind system:
1. Reviews are initially hidden
2. Become visible when both parties submit reviews
3. Automatically become visible after 14 days
4. Cannot be edited once visible

## Styling

All components use Tailwind CSS and follow the MicroBridge design system:
- Consistent with existing UI components
- Dark mode support
- Responsive design
- Accessible focus states

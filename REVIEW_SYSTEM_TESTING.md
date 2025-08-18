# Review System Testing Guide

This guide explains how to test the review system using the mock data that has been created.

## Overview

The review system has been implemented with comprehensive mock data that simulates real-world scenarios. This includes:

- **3 Students** with different skill sets and experience levels
- **3 Employers** from different companies and industries
- **3 Completed Jobs** with different requirements and outcomes
- **6 Reviews** with varying ratings and feedback

## Mock Data Structure

### Users

#### Students
1. **Sarah Chen** (`student-001`)
   - Frontend developer with React/TypeScript expertise
   - 5-star average rating (2 reviews)
   - Badges: "Top Rated", "Excellent", "Consistently Great"

2. **Mike Rodriguez** (`student-002`)
   - Full-stack Python developer
   - 3.5-star average rating (1 review)
   - No badges yet

3. **Emma Wilson** (`student-003`)
   - UI/UX designer with advanced skills
   - 4.5-star average rating (1 review)
   - Badges: "Consistently Great"

#### Employers
1. **John Smith** (`employer-001`) - TechCorp CTO
   - 5-star average rating (1 review)
   - Badges: "Top Rated", "Excellent"

2. **Lisa Johnson** (`employer-002`) - DesignStudio Creative Director
   - 4.5-star average rating (1 review)
   - Badges: "Consistently Great"

3. **David Chen** (`employer-003`) - DataTech VP of Engineering
   - 3-star average rating (1 review)
   - No badges yet

### Completed Jobs
1. **Senior Frontend Developer** at TechCorp
   - Duration: 12 weeks
   - Salary: $8,000-$12,000/month
   - Both parties gave 5-star reviews

2. **UI/UX Designer** at DesignStudio
   - Duration: 16 weeks
   - Salary: $6,000-$9,000/month
   - Mixed reviews (4-5 stars)

3. **Full-Stack Python Developer** at DataTech
   - Duration: 20 weeks
   - Salary: $7,000-$11,000/month
   - Lower ratings (3-4 stars)

## Testing the Review System

### 1. Backend Testing

#### Database Seeding
To populate your database with mock data:

```bash
# Navigate to backend directory
cd backend

# Run the seeder (this will create all mock data)
go run cmd/seed/main.go

# To clear existing data and reseed
go run cmd/seed/main.go --clear
```

The seeder will output:
- Number of users, jobs, applications, and reviews created
- List of test users with their IDs and emails
- Summary of completed jobs
- Review statistics for each user

#### API Testing
Test the review endpoints:

```bash
# Get reviews for a specific user
curl -X GET "http://localhost:8080/api/v1/reviews/student-001"

# Get reviews for an employer
curl -X GET "http://localhost:8080/api/v1/reviews/employer-001"

# Check review eligibility for a job
curl -X GET "http://localhost:8080/api/v1/reviews/eligibility/completed-job-001"

# Complete a job (requires authentication)
curl -X POST "http://localhost:8080/api/v1/jobs/completed-job-001/complete"
```

### 2. Frontend Testing

#### Test Page
Navigate to the test page to see the review system in action:

```
http://localhost:3000/test-reviews
```

This page allows you to:
- Select different users to view their reviews
- See how reviews are displayed for students vs employers
- View rating breakdowns and badges
- Test the review components

#### Mock Service
The frontend includes a mock service that simulates API calls:

```typescript
import { mockReviewService } from '@/services/mockReviewService';

// Get user reviews
const response = await mockReviewService.getUserReviews('student-001');

// Create a review
const newReview = await mockReviewService.createReview({
  jobId: 'completed-job-001',
  revieweeId: 'employer-001',
  rating: 5,
  comment: 'Great experience!',
  categoryRatings: {
    clearRequirements: 5,
    professionalism: 5,
    paymentReliability: 5,
  },
});
```

### 3. Review System Features to Test

#### Double-Blind Reviews
- Reviews are initially hidden (`isVisible: false`)
- Become visible when both parties submit reviews
- Automatically become visible after 14 days
- Cannot be edited once visible

#### Category Ratings
**For Students (reviewing employers):**
- Clear Requirements
- Professionalism
- Payment Reliability

**For Employers (reviewing students):**
- Quality of Work
- Communication
- Timeliness

#### Badge System
Badges are automatically calculated based on:
- **Top Rated**: 10+ reviews with 4.5+ average rating
- **Excellent**: 5+ reviews with 4.8+ average rating
- **Consistently Great**: 3+ five-star reviews
- **Experienced**: 20+ total reviews

#### Review Display
- Average rating with star visualization
- Rating breakdown (1-5 stars)
- Individual review cards with detailed information
- Category-specific ratings
- Reviewer information and job context

## Integration Testing

### Profile Pages
The review system is integrated into profile pages:

1. **Student Profile**: `/student_portal/workspace/profile`
2. **Employer Profile**: `/employer_portal/workspace/profile`

Both pages include:
- `ReviewSystem` wrapper for modal functionality
- `ReviewsSection` component displaying user reviews
- Average rating display in the header

### Job Cards
To test review buttons on job cards:

```tsx
import { LeaveReviewButton, CompleteJobButton } from '@/components/reviews';

// Complete job button
<CompleteJobButton 
  jobId="completed-job-001"
  onComplete={() => console.log('Job completed')}
/>

// Leave review button
<LeaveReviewButton
  jobId="completed-job-001"
  revieweeId="employer-001"
  revieweeName="John Smith"
  jobTitle="Senior Frontend Developer"
/>
```

## Testing Scenarios

### Scenario 1: High-Performing Student
- **User**: Sarah Chen (`student-001`)
- **Expected**: 5-star average, multiple badges
- **Test**: View profile, check review display, verify badges

### Scenario 2: Mixed Reviews
- **User**: Emma Wilson (`student-003`)
- **Expected**: 4.5-star average, some badges
- **Test**: View reviews, check category ratings

### Scenario 3: Lower-Rated User
- **User**: Mike Rodriguez (`student-002`)
- **Expected**: 3.5-star average, no badges
- **Test**: Verify no badges shown, check review content

### Scenario 4: Employer Reviews
- **User**: John Smith (`employer-001`)
- **Expected**: 5-star average, badges
- **Test**: View employer profile, check review display

## Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check if database is running
   docker ps | grep postgres
   
   # Check database connection
   go run cmd/seed/main.go
   ```

2. **Migration Issues**
   ```bash
   # Run migrations manually
   go run cmd/migrate/main.go
   ```

3. **Frontend Mock Data**
   - Ensure `mockReviewData.ts` is properly imported
   - Check that user IDs match between frontend and backend
   - Verify component props are correctly passed

4. **Review Display Issues**
   - Check that `isVisible` is true for reviews
   - Verify user IDs match between reviewer/reviewee
   - Ensure category ratings are properly formatted

### Reset Data
To start fresh:

```bash
# Backend
go run cmd/seed/main.go --clear

# Frontend
# Clear browser cache and localStorage
```

## Next Steps

1. **Real API Integration**: Replace mock services with real API calls
2. **Authentication**: Add proper user authentication and authorization
3. **Real-time Updates**: Implement WebSocket updates for review visibility
4. **Email Notifications**: Add email reminders for review submission
5. **Analytics**: Track review submission rates and user engagement

## Support

If you encounter issues:
1. Check the console for error messages
2. Verify database connectivity
3. Ensure all dependencies are installed
4. Check that the review system components are properly imported

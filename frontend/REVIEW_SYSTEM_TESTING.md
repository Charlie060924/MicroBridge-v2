# Review System Testing Guide

This document explains how to test the review system using the mock data implementation.

## Overview

The review system has been implemented with comprehensive mock data for frontend testing. This allows you to test all review functionality without needing a backend server.

## Mock Data Structure

### Users
- **Students**: 3 mock students with different skill sets and experience levels
- **Employers**: 3 mock employers representing different companies
- Each user has a unique ID, profile information, skills, and interests

### Jobs
- **3 completed jobs** with different scenarios:
  1. TechCorp Frontend Developer (excellent reviews)
  2. DesignStudio UI/UX Designer (good reviews)
  3. DataTech Python Developer (mixed reviews)

### Reviews
- **6 total reviews** (2 per job - one from each party)
- Different rating scenarios: 5-star, 4-star, and 3-star reviews
- Category-based ratings for both students and employers
- Double-blind review system (reviews initially hidden)

## How to Test

### 1. Test Page
Navigate to `/test-reviews` to see the interactive test page:
- Select different users to view their reviews
- See how ratings and badges are calculated
- View completed jobs and their associated reviews

### 2. Profile Pages
The review system is integrated into both profile pages:

#### Student Profile (`/student_portal/workspace/profile`)
- Uses mock user ID: `student-001`, `student-002`, or `student-003`
- Shows reviews received from employers
- Displays badges and rating statistics

#### Employer Profile (`/employer_portal/workspace/EmployerProfile`)
- Uses mock user ID: `employer-001`, `employer-002`, or `employer-003`
- Shows reviews received from students
- Displays badges and rating statistics

### 3. Review Components
All review components are functional with mock data:

- **ReviewModal**: Submit new reviews (simulated)
- **ReviewDisplay**: Show existing reviews with ratings
- **ReviewsSection**: Complete review section with stats
- **LeaveReviewButton**: Trigger review submission
- **CompleteJobButton**: Mark jobs as completed

## Mock Data Details

### Test Users

#### Students
1. **Sarah Chen** (`student-001`)
   - Frontend developer with React/TypeScript skills
   - 5-star average rating
   - Badges: "Top Rated", "Excellence Award"

2. **Mike Rodriguez** (`student-002`)
   - Full-stack Python developer
   - 4-star average rating
   - Badges: "Highly Recommended"

3. **Emma Wilson** (`student-003`)
   - UI/UX designer
   - 4.5-star average rating
   - Badges: "Top Rated", "Excellence Award"

#### Employers
1. **John Smith** (`employer-001`) - TechCorp CTO
2. **Lisa Johnson** (`employer-002`) - DesignStudio Creative Director
3. **David Chen** (`employer-003`) - DataTech VP of Engineering

### Review Scenarios

#### Excellent Reviews (5 stars)
- Sarah Chen ↔ John Smith (TechCorp Frontend Developer)
- Both parties gave 5-star ratings
- Perfect category ratings across all metrics

#### Good Reviews (4-5 stars)
- Emma Wilson ↔ Lisa Johnson (DesignStudio UI/UX Designer)
- Mixed 4-5 star ratings
- Minor issues noted in some categories

#### Mixed Reviews (3-4 stars)
- Mike Rodriguez ↔ David Chen (DataTech Python Developer)
- 3-4 star ratings
- Communication and requirements clarity issues

## Testing Features

### 1. Double-Blind Reviews
- Reviews are initially hidden (`isVisible: false`)
- Become visible after both parties submit or after 14 days
- Mock data shows some reviews as visible for testing

### 2. Category-Based Ratings
- **Students reviewing employers**: Clear Requirements, Professionalism, Payment Reliability
- **Employers reviewing students**: Quality of Work, Communication, Timeliness

### 3. Badge System
- **Top Rated**: Average rating ≥ 4.5 with ≥ 2 reviews
- **Highly Recommended**: Average rating ≥ 4.0 with ≥ 3 reviews
- **Excellence Award**: ≥ 2 five-star reviews

### 4. Rating Statistics
- Average rating calculation
- Rating breakdown (1-5 stars)
- Total review count
- Badge assignment

## File Structure

```
frontend/src/
├── data/
│   └── mockReviewData.ts          # Mock data definitions
├── services/
│   ├── reviewService.ts           # Main review service (uses mock)
│   └── mockReviewService.ts       # Mock service implementation
├── components/reviews/
│   ├── ReviewModal.tsx            # Review submission modal
│   ├── ReviewDisplay.tsx          # Review display component
│   ├── ReviewsSection.tsx         # Complete review section
│   ├── LeaveReviewButton.tsx      # Review trigger button
│   ├── CompleteJobButton.tsx      # Job completion button
│   └── ReviewSystem.tsx           # System wrapper
└── app/
    └── test-reviews/
        └── page.tsx               # Test page
```

## Switching to Real Backend

To switch from mock data to real backend:

1. Update `frontend/src/services/reviewService.ts`
2. Replace mock service calls with actual API calls
3. Update user IDs to use real user authentication
4. Remove mock data imports

## Troubleshooting

### No Reviews Showing
- Check that the user ID matches a mock user
- Verify the user has completed jobs and reviews
- Check browser console for errors

### Review Modal Not Opening
- Ensure ReviewSystem wrapper is present
- Check that job completion was successful
- Verify eligibility check is passing

### Badges Not Appearing
- Check rating calculations in mock data
- Verify badge criteria are met
- Ensure reviews are marked as visible

## Future Enhancements

1. **More Mock Scenarios**: Add edge cases and error scenarios
2. **Review Editing**: Implement review update functionality
3. **Review Filtering**: Add filters by rating, date, category
4. **Review Analytics**: Add more detailed statistics
5. **Review Responses**: Allow users to respond to reviews

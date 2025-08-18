# Improved Review + Project Workflow System

This document outlines the comprehensive implementation of the improved review and project workflow system for MicroBridge, featuring double-blind reviews, lifecycle management, and seamless navigation between Manage Jobs and Working Projects.

## 🎯 **System Overview**

The review system implements a complete workflow that ensures:
- **Reliable, fair reviews** tied to completed work
- **Seamless navigation** between Manage Jobs and Working Projects
- **Quality-focused reviews** that reduce retaliation through double-blind policies
- **Fast UX** with optimistic updates, caching, and persistent navigation

## 🏗️ **Architecture**

### **Frontend Components**
- `ReviewModal.tsx` - Complete review interface with rating, categories, and comments
- `WorkingProjects.tsx` - Active projects with review functionality
- `CompletedProjects.tsx` - Completed projects with review management
- `useReviewSystem.ts` - React Query hooks with optimistic updates
- `mockReviewService.ts` - Frontend testing service

### **Backend Services**
- `ReviewService` - Core business logic with double-blind implementation
- `ReviewHandler` - HTTP endpoints with comprehensive validation
- Enhanced `Job` model with lifecycle states
- Database migrations for review system

## 📊 **Job Lifecycle States**

```typescript
type JobStatus = 
  | 'draft'           // Created, not posted
  | 'posted'          // Visible to students
  | 'hired'           // Student hired, contract created
  | 'in_progress'     // Work started
  | 'submitted'       // Student submitted deliverable(s)
  | 'review_pending'  // Employer marks complete, review window opens
  | 'completed'       // Both sides finished reviews or window closed
  | 'disputed'        // Either side raised a dispute
  | 'archived'        // Archived for historical purposes
```

### **Key Transitions**
- `submitted` → **Mark as Completed** → `review_pending` (triggers review modal)
- `review_pending` → `completed` when review rules fulfilled
- Unreviewed after 14 days → automatically reveal single-sided reviews

## 🔄 **Review Rules & Timing**

### **Who Can Review**
- **Employer** reviews student (work quality, timeliness, communication)
- **Student** reviews employer (clarity, payment reliability, communication)

### **Review Window**
- **14 days** to submit reviews after job completion
- **Double-blind by default**: reviews hidden until both parties submit or window expires
- **Single reviews** become visible after window closes (optionally anonymized)

### **Edit/Withdraw Policy**
- **24-hour edit window** after submission
- **Cannot edit** once other party posts a review
- **Support for flagging** reviews for moderation

## 🗄️ **Data Model**

### **Review Model**
```typescript
interface Review {
  id: string;
  jobId: string;
  reviewerId: string;
  revieweeId: string;
  role: "student" | "employer";
  rating: number;                    // 1-5
  comment: string;                   // 10-1000 chars
  categoryRatings: CategoryRatings;  // Specific category scores
  anonymous: boolean;                // Anonymous review option
  isVisible: boolean;                // Double-blind visibility
  createdAt: string;
  updatedAt: string;
}

interface CategoryRatings {
  // Student reviewing employer
  clearRequirements?: number;
  professionalism?: number;
  paymentReliability?: number;
  
  // Employer reviewing student
  qualityOfWork?: number;
  communication?: number;
  timeliness?: number;
}
```

### **Enhanced Job Model**
```typescript
interface Job {
  // ... existing fields
  status: JobStatus;
  hiredStudentId?: string;
  completedAt?: string;
  reviewDueDate?: string;
  reviewWindowExpired: boolean;
}
```

## 🚀 **Setup Instructions**

### **1. Frontend Setup**

```bash
# Install dependencies
npm install @tanstack/react-query

# Copy components to your project
cp -r frontend/src/components/reviews/ your-project/src/components/
cp -r frontend/src/hooks/useReviewSystem.ts your-project/src/hooks/
cp -r frontend/src/services/mockReviewService.ts your-project/src/services/
```

### **2. Backend Setup**

```bash
# Copy backend files
cp -r backend/internal/service/review_service.go your-project/internal/service/
cp -r backend/internal/handlers/review_handler.go your-project/internal/handlers/

# Update your main.go to include review routes
```

### **3. Database Migrations**

```sql
-- Add review table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id),
    reviewer_id UUID NOT NULL REFERENCES users(id),
    reviewee_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL CHECK (length(comment) >= 10 AND length(comment) <= 1000),
    category_ratings JSONB NOT NULL,
    anonymous BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, reviewer_id)
);

-- Add indexes
CREATE INDEX idx_reviews_job_id ON reviews(job_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_is_visible ON reviews(is_visible);

-- Update jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hired_student_id UUID REFERENCES users(id);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS review_due_date TIMESTAMP WITH TIME ZONE;
```

## 📡 **API Endpoints**

### **Review Management**
```http
POST /api/reviews
GET /api/reviews/pending
PUT /api/reviews/:review_id
DELETE /api/reviews/:review_id
POST /api/reviews/:review_id/flag
```

### **User Reviews**
```http
GET /api/users/:user_id/reviews?limit=10&offset=0
GET /api/users/:user_id/reviews/stats
```

### **Job Reviews**
```http
GET /api/jobs/:job_id/reviews
POST /api/jobs/:job_id/complete
```

### **Admin/System**
```http
POST /api/reviews/process-expired
```

## 🎨 **Frontend Usage**

### **1. Using the Review Modal**

```tsx
import ReviewModal from '@/components/reviews/ReviewModal';

const MyComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleReviewSubmit = async (reviewData) => {
    // Handle review submission
    console.log('Review submitted:', reviewData);
    setIsModalOpen(false);
  };

  return (
    <ReviewModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleReviewSubmit}
      jobTitle="Frontend Developer for E-commerce Platform"
      revieweeName="Alex Chen"
      reviewerRole="employer"
    />
  );
};
```

### **2. Using React Query Hooks**

```tsx
import { useCreateReview, useUserReviews } from '@/hooks/useReviewSystem';

const ReviewComponent = () => {
  const createReview = useCreateReview();
  const { data: userReviews, isLoading } = useUserReviews('user-123');

  const handleSubmit = async (reviewData) => {
    try {
      await createReview.mutateAsync(reviewData);
      // Success handling
    } catch (error) {
      // Error handling
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {userReviews?.reviews.map(review => (
        <div key={review.id}>
          <h3>{review.job.title}</h3>
          <p>Rating: {review.rating}/5</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};
```

### **3. Working Projects Component**

```tsx
import WorkingProjects from '@/components/dashboard/employer_portal/workspace/WorkingProjects';

const EmployerDashboard = () => {
  return (
    <div>
      <h1>Employer Dashboard</h1>
      <WorkingProjects />
    </div>
  );
};
```

## 🔧 **Configuration**

### **Environment Variables**
```env
# Review system configuration
REVIEW_WINDOW_DAYS=14
REVIEW_EDIT_WINDOW_HOURS=24
ENABLE_DOUBLE_BLIND=true
ENABLE_ANONYMOUS_REVIEWS=true
```

### **Feature Flags**
```typescript
const REVIEW_CONFIG = {
  windowDays: 14,
  editWindowHours: 24,
  enableDoubleBlind: true,
  enableAnonymous: true,
  maxCommentLength: 1000,
  minCommentLength: 10,
};
```

## 🧪 **Testing**

### **Frontend Testing**
```bash
# Run component tests
npm test -- --testPathPattern=ReviewModal
npm test -- --testPathPattern=WorkingProjects

# Run hook tests
npm test -- --testPathPattern=useReviewSystem
```

### **Backend Testing**
```bash
# Run service tests
go test ./internal/service -v

# Run handler tests
go test ./internal/handlers -v

# Run integration tests
go test ./tests/integration -v
```

### **Mock Data**
The system includes comprehensive mock data for testing:
- 3 sample users (1 employer, 2 students)
- 3 sample jobs in different states
- 2 sample reviews with full data

## 📈 **Monitoring & Analytics**

### **Key Metrics**
- Review submission rate
- Average review ratings
- Review window completion rate
- Dispute rate
- User satisfaction scores

### **Logging**
```typescript
// Review events are logged for analytics
const reviewEvents = {
  REVIEW_SUBMITTED: 'review.submitted',
  REVIEW_UPDATED: 'review.updated',
  REVIEW_DELETED: 'review.deleted',
  JOB_COMPLETED: 'job.completed',
  REVIEW_WINDOW_EXPIRED: 'review.window.expired',
};
```

## 🔒 **Security & Privacy**

### **Data Protection**
- Reviews are encrypted at rest
- Anonymous reviews hide reviewer identity
- Double-blind system prevents retaliation
- Review data is GDPR compliant

### **Access Control**
- Users can only review jobs they're involved in
- Reviews cannot be edited once visible
- Admin-only access to moderation features

## 🚀 **Deployment**

### **Frontend Deployment**
```bash
# Build the application
npm run build

# Deploy to your hosting platform
npm run deploy
```

### **Backend Deployment**
```bash
# Build the Go application
go build -o main ./cmd/api

# Run database migrations
./main migrate

# Start the server
./main
```

### **Scheduled Jobs**
Set up a cron job to process expired reviews:
```bash
# Daily at 2 AM
0 2 * * * curl -X POST https://your-api.com/api/reviews/process-expired
```

## 🔄 **Migration Guide**

### **From Existing System**
1. **Backup existing data**
2. **Run database migrations**
3. **Update frontend components**
4. **Test thoroughly**
5. **Deploy incrementally**

### **Rollback Plan**
- Database rollback scripts included
- Feature flags for gradual rollout
- Monitoring for issues during deployment

## 📚 **Additional Resources**

- [React Query Documentation](https://tanstack.com/query/latest)
- [Gin Framework Documentation](https://gin-gonic.com/docs/)
- [GORM Documentation](https://gorm.io/docs/)

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This implementation provides a solid foundation for a review system. You can extend it with additional features like:
- Advanced moderation tools
- Review analytics dashboard
- Automated review reminders
- Integration with external review platforms
- Multi-language support

# Modern Profile Page Design

## Overview

This is a redesigned user profile page with a clean, modern Airbnb-inspired UI that focuses on simplicity, whitespace, and clear hierarchy. The design features a two-column layout with personal information and skills on the left, and a level progress section on the right.

## Features

### 🎨 Design Features
- **Clean, Modern UI**: Inspired by Airbnb's design principles
- **Two-Column Layout**: Personal info & skills on left, level progress on right
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Dark Mode Support**: Full dark mode compatibility
- **Smooth Animations**: Hover effects and transitions for interactive elements

### 📱 Components

#### PersonalInfoCard
- Displays user's main personal information
- Clean card design with rounded corners and subtle shadows
- Icon-based information display with color-coded sections
- Responsive grid layout for different screen sizes

#### SkillsAndGoals
- Interactive skills display with proficiency levels
- Visual progress bars for skill proficiency
- Career goals as interactive tags
- Industry preference display
- Empty states for when no data is available

#### PortfolioSection
- **Portfolio URL Display**: Shows user's portfolio or personal website URL
- **Inline Editing**: Click edit button to update portfolio URL with validation
- **URL Validation**: Ensures proper URL format before saving
- **External Link**: Clickable link that opens in new tab
- **Empty State**: Helpful message when no portfolio is added

#### ResumeSection
- **Resume Display**: Shows uploaded resume filename, size, and type
- **File Upload**: Drag & drop or click to upload new resume (PDF/DOCX)
- **File Validation**: Size limit (5MB) and type validation
- **Download/View**: Options to download or view resume in new tab
- **Replace/Remove**: Easy file management with replace and remove options
- **Upload Feedback**: Success/error messages and loading states

#### LevelSection
- Modern level display with gradient backgrounds
- Animated progress bar with smooth transitions
- Stats grid showing XP, achievements, and tier information
- Recent achievements list
- Next level rewards preview

### 🔧 Technical Features
- **TypeScript**: Fully typed components and interfaces
- **Tailwind CSS**: Utility-first styling approach
- **Lucide React Icons**: Consistent iconography
- **Responsive Grid**: CSS Grid for flexible layouts
- **Hover Effects**: Smooth transitions and interactions
- **File Handling**: Secure file upload with validation
- **URL Validation**: Client-side URL format validation

## Integration

### Connecting with Student Info Form

To integrate the profile with the student info form data:

1. **Update the `getExtendedUserData` function** in `page.tsx` to fetch real data from your API or context
2. **Connect with StudentInfoForm data** by mapping the form fields to the profile structure
3. **Add real-time updates** by connecting to your user context or state management

### Example Integration

```typescript
// In page.tsx, replace getExtendedUserData with:
const getExtendedUserData = (): ExtendedUserData => {
  // Fetch from your actual data source
  const studentInfo = getStudentInfoFromContext(); // Your data source
  
  return {
    firstName: studentInfo.firstName,
    lastName: studentInfo.lastName,
    email: studentInfo.email,
    phone: studentInfo.phone,
    bio: studentInfo.bio,
    location: studentInfo.location,
    university: studentInfo.university,
    degree: studentInfo.degree,
    major: studentInfo.major,
    graduationDate: studentInfo.graduationDate,
    skills: studentInfo.skills.map(skill => ({
      skill: skill.name,
      proficiency: skill.proficiency
    })),
    careerGoals: studentInfo.careerGoals,
    industry: studentInfo.industry,
    portfolioUrl: studentInfo.portfolioUrl || "",
    resume: studentInfo.resume || null
  };
};
```

### Skills Integration

The skills section expects data in this format:
```typescript
interface Skill {
  skill: string;
  proficiency: number; // 1-5 scale
}
```

### Career Goals Integration

Career goals should be provided as an array of strings:
```typescript
careerGoals: ["Software Engineer", "Full-Stack Developer"]
```

### Portfolio Integration

Portfolio URL should be a string:
```typescript
portfolioUrl: "https://your-portfolio.com"
```

### Resume Integration

Resume should be an object or null:
```typescript
resume: {
  name: string;
  url: string;
  size: number;
  type: string;
} | null
```

## File Upload Configuration

### Resume Upload Settings
- **Max File Size**: 5MB
- **Allowed Types**: PDF, DOCX
- **Validation**: Client-side file type and size validation
- **Error Handling**: Clear error messages for invalid files

### Portfolio URL Validation
- **Format**: Must be a valid URL (https://example.com)
- **Required**: Portfolio URL is required when saving
- **Error Handling**: Clear error messages for invalid URLs

## Customization

### Colors and Themes
- All colors use Tailwind's color palette
- Easy to customize by modifying the color classes
- Dark mode colors are automatically applied

### Layout Adjustments
- Grid columns can be adjusted in the main container
- Card spacing can be modified via the `space-y-8` classes
- Responsive breakpoints can be customized

### Adding New Sections
1. Create a new component in the same directory
2. Add it to the main layout in `page.tsx`
3. Follow the existing design patterns for consistency

## File Structure

```
profile/
├── page.tsx              # Main profile page
├── LevelSection.tsx      # Level progress component
├── SkillsAndGoals.tsx    # Skills and career goals component
├── PortfolioSection.tsx  # Portfolio URL management
├── ResumeSection.tsx     # Resume upload and management
└── README.md            # This documentation
```

## Dependencies

- `lucide-react`: For icons
- `@/hooks/useLevel`: For level data
- `@/hooks/useUser`: For user data
- `tailwindcss`: For styling

## API Integration Points

### Portfolio Updates
```typescript
const handlePortfolioUpdate = async (newUrl: string) => {
  try {
    await api.updateUserPortfolio(userId, newUrl);
    // Update local state
  } catch (error) {
    // Handle error
  }
};
```

### Resume Upload
```typescript
const handleResumeUpload = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.uploadResume(userId, formData);
    // Update local state with response data
  } catch (error) {
    // Handle error
  }
};
```

## Future Enhancements

- [ ] Add edit functionality for profile information
- [ ] Integrate with real API endpoints
- [ ] Add skill assessment tools
- [ ] Implement achievement system
- [ ] Add profile picture upload
- [ ] Create profile sharing features
- [ ] Add resume parsing and auto-fill
- [ ] Implement portfolio preview functionality
- [ ] Add multiple resume support
- [ ] Create resume template selection

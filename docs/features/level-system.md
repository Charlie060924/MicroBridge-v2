# MicroBridge Level System Documentation

## Overview

This document consolidates documentation for the comprehensive MicroBridge Level System, including both Student and Employer implementations. The level system provides gamification elements to encourage user engagement and platform usage through XP (Experience Points), Career Coins (CC), feature unlocks, and achievements.

---

# Employer Level System Implementation

## Overview

The Employer Level System is an adaptation of the existing Student Level System, customized for employer activities and achievements. It provides gamification elements to encourage employer engagement and platform usage.

## Key Features

### 1. Employer-Specific Level Progression
- **25 levels** with employer-focused titles and progression
- **Green/Blue color scheme** to match employer portal branding
- **Employer-specific achievements** and XP values

### 2. Employer Activities & XP Rewards
- **Complete Company Profile**: 75 XP
- **Post Job**: 40 XP
- **Hire Student**: 100 XP
- **Review Application**: 15 XP
- **Interview Candidate**: 30 XP
- **Daily Login**: 10 XP
- **Maintain Hiring Streak**: 5 XP

### 3. Employer Achievements
- **Company Creator**: Set up company profile
- **Job Poster**: Post first job
- **First Hire**: Hire first student
- **Hiring Streak**: 7-day hiring streak
- **Multiple Hires**: Hire 5+ students
- **Company Growth**: Post 10+ jobs

## Implementation Details

### Files Created/Modified

#### 1. **Employer Sidebar Integration**
- **File**: `frontend/src/layout/EmployerAppSidebar.tsx`
- **Change**: Added "Level" navigation item above Profile
- **Icon**: Star icon
- **Path**: `/employer_portal/workspace/levels`

#### 2. **Employer Level Page**
- **File**: `frontend/src/app/employer_portal/workspace/levels/page.tsx`
- **Features**: 
  - Level overview with employer-specific styling
  - Level progression with employer titles
  - Feature unlocks section
  - Rewards store integration

#### 3. **Employer Level Data**
- **File**: `frontend/src/types/employerLevel.ts`
- **Contents**:
  - `EMPLOYER_LEVEL_PROGRESSION`: 25 levels with employer titles
  - `EMPLOYER_FEATURE_UNLOCKS`: Employer-specific features
  - `EMPLOYER_ACHIEVEMENTS`: Employer achievements
  - `EMPLOYER_XP_VALUES`: XP rewards for employer activities

#### 4. **Employer Level Hook**
- **File**: `frontend/src/hooks/useEmployerLevel.ts`
- **Features**:
  - Wraps existing `useLevel` hook
  - Provides employer-specific data and functions
  - Employer level titles and color schemes
  - Employer feature unlock checks

#### 5. **Employer Progress Bar**
- **File**: `frontend/src/components/common/Level/EmployerLevelProgressBar.tsx`
- **Features**:
  - Green/blue gradient styling
  - Configurable labels and percentages
  - Responsive design

#### 6. **User Dropdown Integration**
- **File**: `frontend/src/components/dashboard/student_portal/workspace/Dashboard_header/EmployerUserDropdown.tsx`
- **Changes**:
  - Uses `useEmployerLevel` hook
  - Shows employer-specific level data
  - Links to employer level page

## Level Progression Examples

### Early Levels (1-5)
- **Level 1**: New Employer (0 XP)
- **Level 2**: Getting Started (100 XP)
- **Level 3**: Company Builder (225 XP)
- **Level 4**: Job Poster (375 XP)
- **Level 5**: Active Recruiter (550 XP)

### Mid Levels (10-15)
- **Level 10**: Platform Veteran (2300 XP)
- **Level 12**: Hiring Strategist (3500 XP)
- **Level 15**: Recruitment Specialist (5500 XP)

### High Levels (20-25)
- **Level 20**: Hiring Pro (11000 XP)
- **Level 25**: Platform Ambassador (17500 XP)

## Feature Unlocks

### Core Features
- **Daily Dashes & Streaks** (Level 1)
- **Career Coins & Rewards Store** (Level 2)

### Social Features
- **Advanced Candidate Search** (Level 5)

### Premium Features
- **Veteran Tier Challenges** (Level 8)
- **Streak Bonds Insurance** (Level 10)
- **Reward Optimizer AI** (Level 12)

### Cosmetic Features
- **Badge Prestige System** (Level 20)

## Usage Examples

### In Components
```typescript
import { useEmployerLevel } from '@/hooks/useEmployerLevel';

function MyComponent() {
  const { 
    levelData, 
    getEmployerLevelTitle, 
    isEmployerFeatureUnlocked 
  } = useEmployerLevel();
  
  return (
    <div>
      <h2>{getEmployerLevelTitle(levelData.level)}</h2>
      {isEmployerFeatureUnlocked('candidate_search') && (
        <AdvancedSearch />
      )}
    </div>
  );
}
```

### Level Progress Bar
```typescript
import EmployerLevelProgressBar from '@/components/common/Level/EmployerLevelProgressBar';

<EmployerLevelProgressBar 
  showLabel={true} 
  showPercentage={true} 
/>
```

## Styling & Theming

### Color Scheme
- **Primary**: Green to Blue gradient (`from-green-500 to-blue-600`)
- **Background**: White/Dark gray
- **Text**: Gray-900/Dark white
- **Accents**: Green and blue variants

### Responsive Design
- **Desktop**: Full sidebar with text labels
- **Mobile**: Collapsed sidebar with icons only
- **Tablet**: Adaptive layout

## Performance Considerations

### Optimizations
- **Lazy loading**: Level page components loaded on demand
- **Memoization**: Level data cached to prevent re-renders
- **Efficient updates**: Only relevant data updated on XP gain

### Bundle Size
- **Shared components**: Reuses existing level system components
- **Minimal additions**: Only employer-specific data and styling
- **Tree shaking**: Unused features excluded from build

## Testing

### Manual Testing Checklist
- [ ] Level link appears in employer sidebar
- [ ] Level page loads correctly
- [ ] Progress bar shows correct styling
- [ ] Level progression displays employer titles
- [ ] Feature unlocks show employer-specific features
- [ ] User dropdown shows employer level data
- [ ] Responsive design works on mobile/tablet

### Integration Testing
- [ ] Level system integrates with existing auth
- [ ] XP gains work for employer activities
- [ ] Achievements unlock correctly
- [ ] Rewards store accessible at appropriate levels

## Future Enhancements

### Potential Additions
1. **Employer-specific badges** and achievements
2. **Hiring streak tracking** and rewards
3. **Company growth milestones**
4. **Team collaboration features**
5. **Advanced analytics** for hiring success

### Scalability
- **Modular design** allows easy feature additions
- **Configurable XP values** for different activities
- **Extensible achievement system**
- **Customizable level progression**

## Maintenance

### Regular Tasks
- **Monitor XP balance** for different activities
- **Update achievement criteria** based on usage data
- **Adjust level progression** if needed
- **Add new employer features** as platform evolves

### Data Management
- **Backup level data** regularly
- **Monitor performance** of level calculations
- **Track user engagement** with level system
- **Analyze achievement completion rates**


---

# Enhanced Level System Implementation


The Enhanced Level System is a comprehensive gamification system that rewards user engagement and progression through XP (Experience Points), Career Coins (CC), feature unlocks, and achievements. This system is designed to increase user retention and engagement while providing clear progression paths.

## Core Components

### 1. XP (Experience Points)
- **Purpose**: Primary currency for leveling up
- **Earning**: Various user actions award XP (see XP_VALUES in constants.ts)
- **Progression**: Early levels require less XP; difficulty increases significantly at higher levels

### 2. Career Coins (CC)
- **Purpose**: Secondary currency for purchasing rewards and items
- **Earning**: Awarded at specific levels and through achievements
- **Spending**: Used in the Rewards Store for boosts, cosmetics, and utilities

### 3. Feature Unlocks
- **Purpose**: Unlock platform features based on user level
- **Schedule**: Progressive unlocking from Level 1 to Level 25+
- **Categories**: Core, Social, Premium, Cosmetic

### 4. Achievements
- **Purpose**: Recognize user milestones and accomplishments
- **Categories**: Profile, Applications, Networking, Learning
- **Rewards**: XP bonuses and special recognition

## Level Progression Table (Levels 1–25)

| Level | Total XP Needed | XP for this Level | Title | Rewards & Unlocks |
|-------|----------------|-------------------|-------|-------------------|
| 1 | 0 | 0 | Newcomer | Unlock Daily Dashes & Streaks; onboarding tour |
| 2 | 100 | 100 | Getting Started | +100 CC; unlock Rewards Store |
| 3 | 225 | 125 | Profile Builder | +125 CC; prompt for 50% profile completion |
| 4 | 375 | 150 | Applicant | +150 CC; unlock "First Step" Badge |
| 5 | 550 | 175 | Collaborator | +200 CC; 1 Streak Freeze; unlock Job Search Guilds |
| 6 | 775 | 225 | Rising Talent | +225 CC |
| 7 | 1050 | 275 | Consistent Contender | +250 CC; unlock "Streaker" Badge (7-day streak) |
| 8 | 1400 | 350 | Dedicated Job Seeker | +275 CC; unlock Veteran Tier for Weekly Epics |
| 9 | 1800 | 400 | Networker | +300 CC; 1 Application Boost Token |
| 10 | 2300 | 500 | Platform Veteran | +500 CC; exclusive profile flair; unlock Streak Bonds |
| 12 | 3500 | 1200 | Strategist | +400 CC; unlock Reward Optimizer (AI) |
| 15 | 5500 | 2000 | Career Specialist | +600 CC; 1 AI Resume Review Token |
| 18 | 8000 | 2500 | Guild Leader | +750 CC; exclusive guild banner cosmetics |
| 20 | 11000 | 3000 | Career Pro | +1000 CC; 1 Skill Certification Voucher; unlock Badge Prestige |
| 25 | 17500 | 6500 | Platform Ambassador | +1500 CC; 1 Resume Spotlight Token; unlock first Meta-Achievement Trophy |

## Feature Unlock Schedule

| Feature | Level | Description |
|---------|-------|-------------|
| Daily Dashes & Streaks | 1 | Immediate access to daily missions and streak tracking |
| Career Coins & Rewards Store | 2 | Enables economic loop and in-game store |
| Job Search Guilds | 5 | Unlocks core social features |
| Tiered Weekly Epics (Veteran Tier) | 8 | Adds advanced challenge missions |
| Streak Bonds (Insurance) | 10 | Allows users to protect their streak |
| Reward Optimizer (AI) | 12 | Provides strategic gameplay/economic advice |
| Badge Prestige System | 20 | Enables infinite replayability for advanced users |

## Key Systems

### 1. Streak System
- **Daily XP Bonus**: 10 XP per day, capped at 50 XP
- **Milestones**: 7, 30, 100, 365 days
- **Protection**: Streak Bonds available at Level 10
- **Achievements**: "Streaker" badge at 7-day streak

### 2. Rewards Store
- **Unlock**: Level 2
- **Categories**: Boosts, Utility, Cosmetic, Premium
- **Items**: XP boosts, application boosts, streak freezes, AI reviews, etc.

### 3. Prestige System
- **Requirement**: Level 20+
- **Effect**: Reset achievements for enhanced rewards & visuals
- **Infinite Progression**: Flat 7,500 XP per level beyond 25

### 4. Meta-Achievements
- **365-day streak**: Year of Dedication
- **5,000 CC spent**: Big Spender
- **10 referrals to Level 10**: Network Builder

## Implementation Files

### Frontend Components
- `frontend/src/types/level.ts` - Type definitions and constants
- `frontend/src/services/levelService.ts` - Core level system logic
- `frontend/src/app/context/LevelContext.tsx` - React context provider
- `frontend/src/hooks/useLevel.ts` - React hook for level system
- `frontend/src/components/common/Level/` - UI components
  - `LevelUpModal.tsx` - Level up reward display
  - `CareerCoinsDisplay.tsx` - CC balance display
  - `FeatureUnlocks.tsx` - Feature availability display
  - `RewardsStore.tsx` - Store interface

### Backend Models
- `backend/internal/models/user.go` - User model with level fields

### Configuration
- `frontend/src/utils/constants.ts` - XP values and system config

## Usage Examples

### Basic Level System Usage
```typescript
import { useLevel } from '@/hooks/useLevel';

function MyComponent() {
  const { 
    levelData, 
    gainXP, 
    addCC, 
    spendCC, 
    unlockAchievement,
    canAccessRewardsStore 
  } = useLevel();

  // Award XP for user action
  const handleCompleteProfile = () => {
    gainXP(50);
    unlockAchievement({
      id: "profile_complete",
      title: "Profile Pioneer",
      description: "Completed your profile",
      icon: "🎓"
    });
  };

  // Check feature access
  const canUseGuilds = canAccessGuilds();
}
```

### Rewards Store Integration
```typescript
import RewardsStore from '@/components/common/Level/RewardsStore';

function ProfilePage() {
  const [showStore, setShowStore] = useState(false);
  const { canAccessRewardsStore } = useLevel();

  return (
    <div>
      {canAccessRewardsStore() && (
        <button onClick={() => setShowStore(true)}>
          Open Rewards Store
        </button>
      )}
      
      <RewardsStore 
        isOpen={showStore} 
        onClose={() => setShowStore(false)} 
      />
    </div>
  );
}
```

## Configuration

### XP Values
All XP values are configurable in `frontend/src/utils/constants.ts`:

```typescript
export const XP_VALUES = {
  COMPLETE_PROFILE: 50,
  APPLY_FOR_PROJECT: 30,
  COMPLETE_PROJECT: 150,
  // ... more values
};
```

### Level Progression
Level progression is defined in `frontend/src/types/level.ts`:

```typescript
export const LEVEL_PROGRESSION: LevelReward[] = [
  { level: 1, totalXPNeeded: 0, xpForThisLevel: 0, title: "Newcomer", careerCoins: 0, unlocks: ["daily_dashes", "streaks"] },
  // ... more levels
];
```

## Database Schema

The User model includes these level system fields:

```go
type User struct {
    // ... existing fields
    
    // Enhanced Level System fields
    Level           int             `json:"level" gorm:"default:1"`
    XP              int             `json:"xp" gorm:"default:0"`
    TotalXP         int             `json:"total_xp" gorm:"default:0"`
    CareerCoins     int             `json:"career_coins" gorm:"default:0"`
    UnlockedFeatures StringArray    `json:"unlocked_features" gorm:"type:jsonb"`
    Achievements    AchievementArray `json:"achievements" gorm:"type:jsonb"`
    StreakDays      int             `json:"streak_days" gorm:"default:0"`
    TotalStreakDays int             `json:"total_streak_days" gorm:"default:0"`
    PrestigeLevel   int             `json:"prestige_level" gorm:"default:0"`
    MetaAchievements StringArray    `json:"meta_achievements" gorm:"type:jsonb"`
    LastActivityAt  *time.Time      `json:"last_activity_at"`
}
```

## Testing

### Manual Testing Checklist
- [ ] New user starts at Level 1 with 0 XP
- [ ] XP awards correctly and levels up user
- [ ] Career Coins are awarded at correct levels
- [ ] Features unlock at appropriate levels
- [ ] Rewards Store is accessible at Level 2+
- [ ] Streak system tracks daily activity
- [ ] Prestige system works at Level 20+
- [ ] Level up modal displays correctly
- [ ] All UI components render properly

### Integration Points
- User registration should initialize level data
- Profile completion should award XP
- Job applications should award XP
- Daily login should update streak
- Achievement unlocks should trigger notifications

## Future Enhancements

1. **Seasonal Events**: Limited-time challenges and rewards
2. **Leaderboards**: Competitive rankings based on level/XP
3. **Guild System**: Group-based achievements and rewards
4. **Advanced Analytics**: Detailed progression tracking
5. **Mobile Notifications**: Push notifications for achievements
6. **Social Features**: Share achievements and level progress
7. **Customization**: User-selectable level themes and badges

## Troubleshooting

### Common Issues
1. **Level not updating**: Check if `gainXP()` is being called correctly
2. **Features not unlocking**: Verify level requirements in `FEATURE_UNLOCKS`
3. **Career Coins not showing**: Ensure `canAccessRewardsStore()` returns true
4. **Streak not updating**: Check `updateStreak()` call timing

### Debug Mode
Enable debug logging in the level service to track XP and level changes:

```typescript
// In levelService.ts
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) {
  console.log(`XP gained: ${amount}, New level: ${newLevel}`);
}
```

## Performance Considerations

- Level data is cached in localStorage for offline access
- Database queries should include level fields in user fetches
- UI components use React.memo for performance optimization
- Large achievement lists are paginated in the UI

## Security

- Career Coins can only be spent through the Rewards Store
- Level progression is validated server-side
- Achievement unlocks are verified against user actions
- Prestige system requires minimum level validation

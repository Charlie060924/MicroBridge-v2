# Performance Monitoring Guide

## 🚀 Quick Start

### Run Performance Audit
```bash
# Install dependencies
npm install

# Run baseline performance audit
npm run perf:baseline

# Run only Lighthouse tests
npm run perf:lighthouse

# Check bundle size
npm run size-limit
```

## 📊 Performance Targets

### Bundle Size Limits
- **Initial JS**: < 500KB (enforced by CI)
- **Vendor chunks**: < 150KB each
- **FullCalendar replacement**: Target 200KB reduction

### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 1.5s
- **INP (Interaction to Next Paint)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Page-Specific Targets
- **Candidates Page**: Smooth scroll with 1k+ candidates
- **Student Dashboard**: < 5 re-renders per interaction
- **Settings Page**: Tab switching without full re-render
- **Calendar**: < 100ms to interactive

## 🔍 Manual Lighthouse Testing

### Prerequisites
1. Start dev server: `npm run dev`
2. Ensure Lighthouse CLI is installed: `npm install -g lighthouse`

### Test Specific Pages
```bash
# Candidates page
lighthouse http://localhost:3000/employer_portal/workspace/candidates --output=json --output-path=./candidates-report.json

# Student dashboard
lighthouse http://localhost:3000/student_portal/workspace --output=json --output-path=./dashboard-report.json

# Settings page
lighthouse http://localhost:3000/student_portal/workspace/settings --output=json --output-path=./settings-report.json
```

### Mobile Testing
```bash
# Add --preset=perf for mobile simulation
lighthouse http://localhost:3000/employer_portal/workspace/candidates --preset=perf --output=json
```

## 📈 Performance Monitoring

### Bundle Analysis
```bash
# Generate bundle analyzer report
ANALYZE=true npm run build

# View reports in .next/analyze/
open .next/analyze/client.html
```

### Real User Monitoring
- **Vercel Speed Insights**: Automatically enabled on Vercel
- **Web Vitals**: Monitor in production via browser dev tools
- **Bundle Size**: Check on every PR via size-limit

## 🚨 Performance Regressions

### CI Checks
- Bundle size > 500KB will fail CI
- Lighthouse scores below targets will warn
- Duplicate API calls will be flagged

### Manual Checks
1. Run `npm run perf:baseline` before major changes
2. Compare bundle analyzer reports
3. Test on slow devices (throttle to 3G)
4. Check React Profiler for excessive re-renders

## 🛠️ Optimization Checklist

### Before Each Milestone
- [ ] Run baseline performance audit
- [ ] Check bundle analyzer for regressions
- [ ] Test on mobile device simulation
- [ ] Verify no duplicate API calls

### After Each Milestone
- [ ] Compare Lighthouse scores
- [ ] Validate bundle size reduction
- [ ] Test user interactions (scroll, filter, etc.)
- [ ] Check for hydration errors

## 📁 File Structure
```
perf/
├── README.md                 # This file
├── reports/
│   └── baseline/            # Lighthouse reports
│       ├── candidates-mobile.json
│       ├── candidates-desktop.json
│       ├── student-dashboard-mobile.json
│       ├── student-dashboard-desktop.json
│       ├── settings-mobile.json
│       ├── settings-desktop.json
│       └── summary.json
└── scripts/
    └── perf-lighthouse.mjs  # Automated testing
```

## 🎯 Key Performance Indicators

### Development Metrics
- **Build Time**: < 30s for production build
- **Dev Server Start**: < 10s
- **Hot Reload**: < 500ms

### Runtime Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Scroll Performance**: 60fps with 1k+ items
- **Memory Usage**: < 50MB for typical session

### User Experience
- **No layout shift** during page load
- **Instant feedback** for user actions
- **Smooth animations** at 60fps
- **Fast navigation** between pages


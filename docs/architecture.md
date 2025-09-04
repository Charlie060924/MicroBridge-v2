# MicroBridge Brownfield Enhancement Architecture

## Introduction

This document outlines the architectural approach for enhancing MicroBridge with AI-powered matching capabilities, performance optimization for 10x scaling, and UI/UX standardization including dark mode removal. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development of new features while ensuring seamless integration with the existing system.

**Relationship to Existing Architecture:**
This document supplements existing project architecture by defining how new components will integrate with current systems. Where conflicts arise between new and existing patterns, this document provides guidance on maintaining consistency while implementing enhancements.

## Existing Project Analysis

### Current Project State
- **Primary Purpose:** Bilingual micro-internship platform connecting Hong Kong university students with startups through paid project-based work
- **Current Tech Stack:** Go 1.21 backend with Gin framework, Next.js 15.1.6 frontend with React 19, PostgreSQL 15, Redis 7, full Docker containerization
- **Architecture Style:** Microservices-ready monolith with sophisticated matching algorithms, layered architecture with clear separation of concerns
- **Deployment Method:** Production-ready Docker Compose with comprehensive monitoring (Prometheus, Grafana, ELK stack), nginx reverse proxy, automated backups

### Available Documentation
- Advanced matching algorithm with bidirectional scoring (`MatchScore`, `SkillGap` analysis)
- Comprehensive Redis caching layer with matching optimization
- Production-ready infrastructure with monitoring, logging, and backup systems
- Sophisticated middleware stack (auth, rate limiting, CORS, enhanced security)
- Component library with virtualization for performance (`VirtualizedCandidateList`)
- Dark mode theming system currently implemented (targeted for removal)

### Identified Constraints
- Existing sophisticated matching algorithm must be preserved and enhanced, not replaced
- Production Redis infrastructure with specific caching patterns must be maintained
- Current Go 1.21/PostgreSQL/GORM patterns and conventions must be followed
- Existing JWT authentication, rate limiting, and security middleware must remain intact
- Current Docker containerization approach with 3-tier architecture must be preserved
- Performance requirements: <3 second page loads, 99.5% uptime, existing monitoring must continue functioning

| **Change Log** |
|----------------|
| Change | Date | Version | Description | Author |
| Architecture Creation | 2024-08-29 | v1.0 | Initial brownfield architecture for AI enhancements | Winston (Architect) |

## Enhancement Scope and Integration Strategy

### Enhancement Overview
- **Enhancement Type:** Multi-component brownfield enhancement (AI matching + Performance + UI/UX)
- **Scope:** Add AI-powered matching system, optimize for 10x performance scaling, standardize UI/UX with dark mode removal
- **Integration Impact:** Significant - requires new AI infrastructure while preserving all existing functionality

### Integration Approach
- **Code Integration Strategy:** Layer AI services alongside existing matching algorithms, preserve existing Go patterns and HTTP handlers
- **Database Integration:** Add AI-related tables (ml_models, prediction_cache, user_behavior_tracking) via GORM migrations without altering existing schema
- **API Integration:** Extend existing REST endpoints with optional AI parameters, add new AI-specific endpoints following current Gin middleware patterns  
- **UI Integration:** Enhance existing React components with AI features, remove dark mode complexity, standardize design system using current Tailwind approach

### Compatibility Requirements
- **Existing API Compatibility:** All current REST endpoints must remain functional with identical request/response formats while adding optional AI enhancement parameters
- **Database Schema Compatibility:** New AI features integrate through additional tables and relationships without altering existing data structures or breaking current queries
- **UI/UX Consistency:** Enhanced design system preserves existing user workflows and navigation patterns while improving visual design and removing theme switching complexity
- **Performance Impact:** AI enhancements must not exceed current 3-second page load requirements and must work within existing resource constraints

## Proposed Folder Structure Optimization

### Current Structure Issues Identified:
- **Documentation Scattered:** 20+ documentation files in project root with inconsistent naming patterns
- **Component Duplication:** Multiple similar components across different directories (e.g., ReviewSystem, ReviewModal variations)
- **Inconsistent File Organization:** Mix of feature-based and type-based organization creating confusion
- **Deep Nesting Complexity:** Some component paths exceed 6 levels deep, hindering maintainability
- **Test File Distribution:** Test files scattered throughout codebase rather than organized systematically
- **Legacy Code Accumulation:** Multiple versions of similar functionality indicating incomplete cleanup

### Recommended Folder Structure (Supporting AI Enhancement):

```
MicroBridge-v2/
├── 📁 docs/                          # Centralized documentation
│   ├── 📁 architecture/              # Technical architecture docs
│   │   ├── architecture.md           # Main architecture document
│   │   ├── ai-integration.md         # AI enhancement architecture
│   │   ├── database-schema.md        # Database design and migrations
│   │   └── deployment.md             # Infrastructure and deployment
│   ├── 📁 features/                  # Feature-specific documentation
│   │   ├── level-system.md           # Consolidated from multiple level docs
│   │   ├── review-system.md          # Consolidated review documentation
│   │   ├── matching-system.md        # Current + AI matching docs
│   │   └── payment-system.md         # Billing and payment docs
│   ├── 📁 guides/                    # User and developer guides
│   │   ├── developer-setup.md        # Development environment setup
│   │   ├── api-reference.md          # API documentation
│   │   ├── testing-guide.md          # Testing procedures and standards
│   │   └── deployment-guide.md       # Production deployment procedures
│   ├── 📁 business/                  # Business and project docs
│   │   ├── brief.md                  # Project brief (existing)
│   │   ├── prd.md                    # Product requirements (existing)  
│   │   └── mock-accounts.md          # Account setup and testing
│   └── README.md                     # Main project documentation
│
├── 📁 backend/                       # Go backend (structure optimization)
│   ├── 📁 cmd/                       # Application entry points
│   │   ├── api/main.go               # Main API server
│   │   ├── migrate/main.go           # Database migrations
│   │   └── worker/main.go            # Background job processor (for AI)
│   ├── 📁 internal/
│   │   ├── 📁 core/                  # Core business logic
│   │   │   ├── 📁 matching/          # Enhanced matching system
│   │   │   │   ├── algorithm.go      # Current matching algorithm
│   │   │   │   ├── ai_service.go     # NEW: AI-enhanced matching
│   │   │   │   ├── cache.go          # Caching layer
│   │   │   │   └── service.go        # Main matching service
│   │   │   ├── 📁 auth/              # Authentication & authorization
│   │   │   ├── 📁 jobs/              # Job posting and management
│   │   │   ├── 📁 users/             # User management
│   │   │   ├── 📁 applications/      # Application processing
│   │   │   └── 📁 reviews/           # Review system
│   │   ├── 📁 ai/                    # NEW: AI infrastructure
│   │   │   ├── 📁 models/            # ML model management
│   │   │   ├── 📁 training/          # Model training services
│   │   │   ├── 📁 inference/         # Real-time prediction
│   │   │   └── 📁 pipeline/          # Data processing pipeline
│   │   ├── 📁 transport/             # HTTP handlers and routes
│   │   │   ├── 📁 http/              # HTTP transport layer
│   │   │   │   ├── handlers/         # Request handlers
│   │   │   │   ├── middleware/       # HTTP middleware
│   │   │   │   └── routes/           # Route definitions
│   │   ├── 📁 repository/            # Data access layer
│   │   │   ├── interfaces.go         # Repository interfaces
│   │   │   ├── postgres/             # PostgreSQL implementations
│   │   │   └── redis/                # Redis implementations  
│   │   ├── 📁 shared/                # Shared utilities and types
│   │   │   ├── errors/               # Error handling
│   │   │   ├── validation/           # Input validation
│   │   │   ├── monitoring/           # Metrics and logging
│   │   │   └── config/               # Configuration management
│   │   └── 📁 tests/                 # Integration and unit tests
│   │       ├── fixtures/             # Test data and fixtures
│   │       ├── integration/          # Integration tests
│   │       └── unit/                 # Unit tests by module
│   ├── 📁 pkg/                       # Reusable packages
│   │   ├── jwt/                      # JWT utilities
│   │   ├── logger/                   # Logging utilities  
│   │   └── cache/                    # Cache utilities
│   └── 📁 scripts/                   # Build and deployment scripts
│
├── 📁 frontend/                      # Next.js frontend (major restructure)
│   ├── 📁 src/
│   │   ├── 📁 app/                   # Next.js 13+ app router
│   │   │   ├── 📁 (auth)/            # Authentication routes
│   │   │   ├── 📁 (dashboard)/       # Protected dashboard routes
│   │   │   │   ├── 📁 employer/      # Employer portal
│   │   │   │   └── 📁 student/       # Student portal
│   │   │   ├── 📁 (public)/          # Public marketing pages
│   │   │   └── layout.tsx            # Root layout (simplified - no dark mode)
│   │   ├── 📁 components/            # Reusable UI components
│   │   │   ├── 📁 ui/                # Base UI components (design system)
│   │   │   │   ├── button.tsx        # Standardized button component
│   │   │   │   ├── input.tsx         # Form input components
│   │   │   │   ├── modal.tsx         # Modal component
│   │   │   │   └── index.ts          # Component exports
│   │   │   ├── 📁 forms/             # Form components
│   │   │   ├── 📁 layout/            # Layout components
│   │   │   ├── 📁 data-display/      # Tables, lists, cards
│   │   │   └── 📁 ai/                # NEW: AI-specific components
│   │   │       ├── match-explanation.tsx
│   │   │       ├── ai-recommendations.tsx
│   │   │       └── performance-metrics.tsx
│   │   ├── 📁 features/              # Feature-based organization
│   │   │   ├── 📁 matching/          # Enhanced matching components
│   │   │   ├── 📁 jobs/              # Job-related components
│   │   │   ├── 📁 applications/      # Application components
│   │   │   ├── 📁 reviews/           # Consolidated review system
│   │   │   └── 📁 dashboard/         # Dashboard components
│   │   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── 📁 services/              # API and external services
│   │   ├── 📁 utils/                 # Utility functions
│   │   ├── 📁 types/                 # TypeScript type definitions
│   │   └── 📁 tests/                 # Frontend tests
│   │       ├── 📁 __mocks__/         # Mock implementations
│   │       ├── 📁 components/        # Component tests
│   │       └── 📁 integration/       # Integration tests
│   ├── 📁 public/                    # Static assets (cleaned up)
│   │   ├── 📁 images/                # Organized image assets
│   │   │   ├── 📁 brand/             # Brand assets (light theme only)
│   │   │   ├── 📁 icons/             # Icon assets (theme-neutral)  
│   │   │   └── 📁 features/          # Feature-specific images
│   │   └── manifest.json             # PWA manifest
│   └── 📁 docs/                      # Frontend-specific documentation
│
├── 📁 infrastructure/                # Infrastructure and deployment
│   ├── 📁 docker/                    # Docker configurations
│   │   ├── docker-compose.yml        # Main compose file
│   │   ├── docker-compose.prod.yml   # Production overrides
│   │   ├── Dockerfile.api            # API container
│   │   └── Dockerfile.frontend       # Frontend container
│   ├── 📁 monitoring/                # Monitoring configuration
│   │   ├── prometheus.yml            # Prometheus config
│   │   ├── grafana/                  # Grafana dashboards
│   │   └── alerts/                   # Alert configurations
│   ├── 📁 scripts/                   # Deployment and maintenance scripts
│   └── 📁 k8s/                       # Kubernetes manifests (future)
│
├── 📁 shared/                        # Shared types and constants
│   ├── 📁 types/                     # Shared TypeScript types
│   └── 📁 constants/                 # Shared constants
│
└── 📁 tests/                         # System-wide tests
    ├── 📁 e2e/                       # End-to-end tests
    ├── 📁 load/                      # Load testing
    └── 📁 security/                  # Security testing
```

### Key Structure Improvements:

**1. Documentation Consolidation:**
- Centralized `/docs/` with logical sub-folders
- Feature documentation grouped by domain
- Clear separation of technical vs. business docs

**2. Component Organization:**
- Feature-based grouping for complex functionality
- Standardized UI component library  
- AI components clearly separated and organized

**3. Backend Modularity:**
- Clean separation of concerns (core/transport/repository)
- New AI infrastructure clearly defined
- Shared utilities properly organized

**4. Test Organization:**
- Tests grouped by type and scope
- Clear fixtures and mock organization
- Integration tests properly separated

**5. Asset Cleanup:**
- Remove dark theme assets (per requirement)
- Organize remaining assets logically
- Eliminate redundant image variations

### Implementation Plan for Folder Restructuring

#### Phase 1: Documentation Consolidation (Low Risk)
**Goal:** Organize scattered documentation without affecting code functionality

**Steps:**
1. Create new `/docs/` structure with subdirectories
2. **Move and consolidate documentation:**
   ```bash
   # Root level docs to organize:
   mv EMPLOYER_LEVEL_SYSTEM.md docs/features/level-system.md
   mv ENHANCED_LEVEL_SYSTEM.md >> docs/features/level-system.md  # Append content
   mv REVIEW_SYSTEM_IMPLEMENTATION.md docs/features/review-system.md  
   mv LANDING_PAGES_IMPLEMENTATION.md docs/features/marketing.md
   mv PREVIEW_MODE_IMPLEMENTATION.md docs/features/preview-mode.md
   mv MOCK_ACCOUNTS_GUIDE.md docs/business/mock-accounts.md
   mv Summary.txt docs/business/project-summary.md
   
   # Frontend scattered docs:
   mv frontend/PERFORMANCE_*.md docs/guides/performance-optimization.md
   mv frontend/BUTTON_*.md docs/guides/ui-testing.md
   ```
3. **Create consolidated documentation:**
   - Merge multiple performance docs into single guide
   - Combine button testing docs into unified testing guide
   - Consolidate level system documentation

**Risk Level:** ✅ **LOW** - Only affects documentation, no code impact

#### Phase 2: Backend Structure Optimization (Medium Risk)
**Goal:** Reorganize Go backend for better modularity and AI integration

**Current → New Structure Mapping:**
```
backend/internal/handlers/ → backend/internal/transport/http/handlers/
backend/internal/services/ → backend/internal/core/ (business logic)
backend/internal/middleware/ → backend/internal/transport/http/middleware/
backend/internal/cache/ → backend/internal/shared/cache/
backend/internal/monitoring/ → backend/internal/shared/monitoring/
```

**Implementation Steps:**
1. **Create new directory structure** (don't move files yet)
2. **Gradual file migration with import updates:**
   ```bash
   # Example: Move matching services to new core structure
   mkdir -p backend/internal/core/matching
   cp backend/internal/services/matching/* backend/internal/core/matching/
   # Update imports in files that reference these services
   # Test thoroughly before removing old files
   ```
3. **Update all import paths** across the codebase
4. **Add new AI infrastructure directories:**
   ```
   backend/internal/ai/
   ├── models/        # ML model management
   ├── training/      # Model training
   ├── inference/     # Real-time predictions  
   └── pipeline/      # Data processing
   ```

**Risk Level:** ⚠️ **MEDIUM** - Requires careful import path updates and testing

#### Phase 3: Frontend Restructuring (High Risk)
**Goal:** Reorganize React components and remove dark mode complexity

**Component Consolidation Strategy:**
1. **Identify and eliminate duplicates:**
   ```typescript
   // Duplicate review components to consolidate:
   src/components/reviews/ReviewSystem.tsx (keep)
   your-project/src/components/ReviewSystem.tsx (remove)
   src/components/reviews/ReviewModal.tsx (keep)
   src/components/reviews/ReviewDisplay.tsx (update)
   ```

2. **Create standardized UI component library:**
   ```
   src/components/ui/
   ├── button.tsx         # Consolidate all button variants
   ├── input.tsx          # Standardize input components
   ├── modal.tsx          # Single modal implementation
   └── card.tsx           # Unified card component
   ```

3. **Feature-based component organization:**
   ```
   src/features/
   ├── matching/          # All matching-related components
   ├── jobs/              # Job posting and browsing
   ├── applications/      # Application management
   ├── reviews/           # Consolidated review system
   └── dashboard/         # Dashboard components
   ```

4. **Dark mode removal process:**
   ```typescript
   // Remove theme-related code:
   - src/context/ThemeContext.tsx (delete)
   - src/components/common/Header/ThemeToggler.tsx (delete)
   - Dark theme CSS classes and variables
   - Theme switching logic in components
   ```

**Risk Level:** 🚨 **HIGH** - Major component restructuring affects entire frontend

#### Phase 4: Asset and Infrastructure Cleanup (Medium Risk)
**Goal:** Remove unnecessary assets and organize infrastructure

**Asset Cleanup:**
1. **Remove dark theme images:**
   ```bash
   rm -rf public/images/brand/brand-dark-*
   rm -rf public/images/features/features-dark-*
   rm -rf public/images/hero/hero-dark.svg
   rm -rf public/images/icon/icon-moon.svg  # Dark mode toggle
   ```

2. **Infrastructure reorganization:**
   ```bash
   mkdir infrastructure/
   mv docker-compose*.yml infrastructure/docker/
   mv monitoring/ infrastructure/monitoring/
   ```

**Risk Level:** ⚠️ **MEDIUM** - Asset removal requires testing image references

### Recommended Implementation Sequence:

**Week 1: Documentation** (Phase 1)
- ✅ Low risk, immediate maintainability improvement
- Create new docs structure and consolidate scattered documentation
- No code changes required

**Week 2-3: Backend Structure** (Phase 2)  
- ⚠️ Create new backend organization
- Gradual migration with thorough testing at each step
- Update import paths incrementally

**Week 4-6: Frontend Restructuring** (Phase 3)
- 🚨 Most complex phase - plan carefully
- Start with component consolidation
- Remove dark mode step-by-step
- Extensive testing required

**Week 7: Infrastructure & Assets** (Phase 4)
- ⚠️ Final cleanup and organization
- Remove unused assets and infrastructure reorganization
- Production deployment testing

### Risk Mitigation Strategies:

1. **Git Branch Strategy:**
   ```bash
   git checkout -b restructure/phase1-docs
   git checkout -b restructure/phase2-backend  
   git checkout -b restructure/phase3-frontend
   git checkout -b restructure/phase4-cleanup
   ```

2. **Testing at Each Phase:**
   - Run full test suite after each major move
   - Manual testing of affected functionality
   - Performance regression testing

3. **Rollback Plan:**
   - Keep old structure alongside new during transition
   - Feature flags for new components
   - Database migrations reversible

4. **Team Communication:**
   - Document all import path changes
   - Update development setup guides
   - Coordinate with team on merge conflicts

### File Rename and Move Script Examples:

**Safe Documentation Move Script:**
```bash
#!/bin/bash
# Phase 1: Documentation consolidation
mkdir -p docs/{architecture,features,guides,business}
mv EMPLOYER_LEVEL_SYSTEM.md docs/features/employer-level-system.md
mv ENHANCED_LEVEL_SYSTEM.md docs/features/enhanced-level-system.md
# Add more moves...
echo "Documentation restructure complete"
```

**Component Consolidation Script:**
```bash
#!/bin/bash
# Phase 3: Frontend component consolidation
mkdir -p src/components/{ui,forms,layout,data-display,ai}
mkdir -p src/features/{matching,jobs,applications,reviews,dashboard}
# Careful component moves with import updates...
echo "Component restructure complete - REQUIRES IMPORT UPDATES"
```
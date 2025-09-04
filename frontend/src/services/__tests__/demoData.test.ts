// Unit tests for PreviewDemoData service

import { previewDemoDataService, PreviewDemoDataService } from '../demoData';

describe('PreviewDemoDataService', () => {
  let service: PreviewDemoDataService;

  beforeEach(() => {
    service = new PreviewDemoDataService();
  });

  describe('getDemoData', () => {
    test('should return student demo data', () => {
      const studentData = service.getDemoData('student');
      
      expect(studentData).toBeDefined();
      expect(studentData.stats).toBeDefined();
      expect(studentData.projects).toBeDefined();
      expect(studentData.testimonials).toBeDefined();
      expect(studentData.cta).toBeDefined();
      expect(studentData.socialProof).toBeDefined();
      
      // Check student-specific stats
      expect(studentData.stats.totalEarnings).toBeGreaterThan(0);
      expect(studentData.stats.projectsCompleted).toBeGreaterThan(0);
      expect(studentData.stats.skillsVerified).toBeGreaterThan(0);
      
      // Check CTA is student-specific
      expect(studentData.cta.primary).toBe('Sign Up to Unlock Your Dashboard');
      expect(studentData.cta.features).toContain('Apply to 500+ active projects');
    });

    test('should return employer demo data', () => {
      const employerData = service.getDemoData('employer');
      
      expect(employerData).toBeDefined();
      expect(employerData.stats).toBeDefined();
      expect(employerData.projects).toBeDefined();
      expect(employerData.testimonials).toBeDefined();
      expect(employerData.cta).toBeDefined();
      expect(employerData.socialProof).toBeDefined();
      
      // Check employer-specific stats
      expect(employerData.stats.jobsPosted).toBeGreaterThan(0);
      expect(employerData.stats.applicationsReceived).toBeGreaterThan(0);
      expect(employerData.stats.successfulHires).toBeGreaterThan(0);
      
      // Check CTA is employer-specific
      expect(employerData.cta.primary).toBe('Sign Up to Post Your First Job');
      expect(employerData.cta.features).toContain('Access 10,000+ verified candidates');
    });
  });

  describe('getDemoJobs', () => {
    test('should return demo jobs with required properties', () => {
      const demoJobs = service.getDemoJobs();
      
      expect(Array.isArray(demoJobs)).toBe(true);
      expect(demoJobs.length).toBeGreaterThan(0);
      
      const job = demoJobs[0];
      expect(job).toHaveProperty('id');
      expect(job).toHaveProperty('title');
      expect(job).toHaveProperty('company');
      expect(job).toHaveProperty('location');
      expect(job).toHaveProperty('salary');
      expect(job).toHaveProperty('skills');
      expect(job).toHaveProperty('isRemote');
      expect(job).toHaveProperty('experienceLevel');
    });
  });

  describe('getDemoApplications', () => {
    test('should return demo applications with required properties', () => {
      const demoApplications = service.getDemoApplications();
      
      expect(Array.isArray(demoApplications)).toBe(true);
      expect(demoApplications.length).toBeGreaterThan(0);
      
      const application = demoApplications[0];
      expect(application).toHaveProperty('id');
      expect(application).toHaveProperty('jobId');
      expect(application).toHaveProperty('jobTitle');
      expect(application).toHaveProperty('company');
      expect(application).toHaveProperty('status');
      expect(['pending', 'reviewed', 'accepted', 'rejected']).toContain(application.status);
    });
  });

  describe('A/B Testing', () => {
    test('should return valid A/B test variations', () => {
      const heroVariation = service.getABTestVariation('heroMessage');
      const ctaVariation = service.getABTestVariation('ctaButton');
      const socialProofVariation = service.getABTestVariation('socialProof');
      
      expect(typeof heroVariation).toBe('string');
      expect(typeof ctaVariation).toBe('string');
      expect(typeof socialProofVariation).toBe('string');
      
      expect(heroVariation.length).toBeGreaterThan(0);
      expect(ctaVariation.length).toBeGreaterThan(0);
      expect(socialProofVariation.length).toBeGreaterThan(0);
    });

    test('should cycle through variations when set', () => {
      service.setABTestVariation(0);
      const variation1 = service.getABTestVariation('heroMessage');
      
      service.setABTestVariation(1);
      const variation2 = service.getABTestVariation('heroMessage');
      
      service.setABTestVariation(2);
      const variation3 = service.getABTestVariation('heroMessage');
      
      // Variations should be different strings
      expect(variation1).toBeDefined();
      expect(variation2).toBeDefined();
      expect(variation3).toBeDefined();
    });
  });

  describe('Social Proof Data', () => {
    test('should have realistic social proof numbers', () => {
      const studentData = service.getDemoData('student');
      const socialProof = studentData.socialProof;
      
      expect(socialProof.totalStudentsHired).toBeGreaterThan(1000);
      expect(socialProof.totalJobsPosted).toBeGreaterThan(1000);
      expect(socialProof.totalEarningsDistributed).toBeGreaterThan(1000000);
      expect(socialProof.averageRating).toBeGreaterThanOrEqual(4.0);
      expect(socialProof.averageRating).toBeLessThanOrEqual(5.0);
      expect(socialProof.companiesServed).toBeGreaterThan(100);
      expect(socialProof.successStories).toBeGreaterThan(100);
    });
  });

  describe('Demo Projects', () => {
    test('should have projects with milestones', () => {
      const studentData = service.getDemoData('student');
      const projects = studentData.projects;
      
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
      
      const project = projects[0];
      expect(project).toHaveProperty('milestones');
      expect(Array.isArray(project.milestones)).toBe(true);
      
      if (project.milestones.length > 0) {
        const milestone = project.milestones[0];
        expect(milestone).toHaveProperty('name');
        expect(milestone).toHaveProperty('completed');
        expect(milestone).toHaveProperty('dueDate');
        expect(typeof milestone.completed).toBe('boolean');
      }
    });

    test('should have projects with realistic budgets', () => {
      const studentData = service.getDemoData('student');
      const projects = studentData.projects;
      
      projects.forEach(project => {
        expect(project.budget).toBeGreaterThan(0);
        expect(project.budget).toBeLessThan(50000); // Reasonable upper bound
        expect(typeof project.progress).toBe('number');
        expect(project.progress).toBeGreaterThanOrEqual(0);
        expect(project.progress).toBeLessThanOrEqual(100);
      });
    });
  });

  describe('Testimonials', () => {
    test('should have testimonials with ratings', () => {
      const studentData = service.getDemoData('student');
      const testimonials = studentData.testimonials;
      
      expect(Array.isArray(testimonials)).toBe(true);
      expect(testimonials.length).toBeGreaterThan(0);
      
      testimonials.forEach(testimonial => {
        expect(testimonial).toHaveProperty('name');
        expect(testimonial).toHaveProperty('role');
        expect(testimonial).toHaveProperty('content');
        expect(testimonial).toHaveProperty('rating');
        expect(testimonial).toHaveProperty('projectType');
        
        expect(testimonial.rating).toBeGreaterThanOrEqual(1);
        expect(testimonial.rating).toBeLessThanOrEqual(5);
        expect(testimonial.content.length).toBeGreaterThan(10);
      });
    });
  });
});

describe('Singleton Instance', () => {
  test('previewDemoDataService should be defined', () => {
    expect(previewDemoDataService).toBeDefined();
    expect(previewDemoDataService).toBeInstanceOf(PreviewDemoDataService);
  });

  test('should maintain state across calls', () => {
    previewDemoDataService.setABTestVariation(1);
    const variation1 = previewDemoDataService.getABTestVariation('heroMessage');
    const variation2 = previewDemoDataService.getABTestVariation('heroMessage');
    
    // Should return same variation when called multiple times
    expect(variation1).toBe(variation2);
  });
});
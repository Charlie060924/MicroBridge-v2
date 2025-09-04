"use client";

import React from 'react';
import { ButtonTestResult } from './buttonTestUtils';

export interface TestReport {
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    successRate: number;
    studentPortalTests: number;
    employerPortalTests: number;
    pageLevelTests: number;
    modalTests: number;
  };
  breakdown: {
    studentPortal: {
      passed: ButtonTestResult[];
      failed: ButtonTestResult[];
      successRate: number;
    };
    employerPortal: {
      passed: ButtonTestResult[];
      failed: ButtonTestResult[];
      successRate: number;
    };
    pageLevel: {
      passed: ButtonTestResult[];
      failed: ButtonTestResult[];
      successRate: number;
    };
    modalLevel: {
      passed: ButtonTestResult[];
      failed: ButtonTestResult[];
      successRate: number;
    };
  };
  issues: {
    critical: ButtonTestResult[];
    high: ButtonTestResult[];
    medium: ButtonTestResult[];
    low: ButtonTestResult[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  testCoverage: {
    studentPortal: {
      dashboard: number;
      jobActions: number;
      modals: number;
      total: number;
    };
    employerPortal: {
      dashboard: number;
      candidateActions: number;
      modals: number;
      total: number;
    };
  };
}

export const generateTestReport = (testResults: ButtonTestResult[]): TestReport => {
  const passedTests = testResults.filter(t => t.status === 'pass');
  const failedTests = testResults.filter(t => t.status === 'fail');
  
  const studentPortalTests = testResults.filter(t => 
    t.location.includes('Student') || t.location.includes('student')
  );
  const employerPortalTests = testResults.filter(t => 
    t.location.includes('Employer') || t.location.includes('employer')
  );
  
  const pageLevelTests = testResults.filter(t => t.type === 'page');
  const modalTests = testResults.filter(t => t.type === 'modal');

  // Calculate success rates
  const overallSuccessRate = testResults.length > 0 ? (passedTests.length / testResults.length) * 100 : 0;
  const studentSuccessRate = studentPortalTests.length > 0 ? 
    (studentPortalTests.filter(t => t.status === 'pass').length / studentPortalTests.length) * 100 : 0;
  const employerSuccessRate = employerPortalTests.length > 0 ? 
    (employerPortalTests.filter(t => t.status === 'pass').length / employerPortalTests.length) * 100 : 0;
  const pageSuccessRate = pageLevelTests.length > 0 ? 
    (pageLevelTests.filter(t => t.status === 'pass').length / pageLevelTests.length) * 100 : 0;
  const modalSuccessRate = modalTests.length > 0 ? 
    (modalTests.filter(t => t.status === 'pass').length / modalTests.length) * 100 : 0;

  // Categorize issues by severity
  const criticalIssues = failedTests.filter(t => 
    t.name.includes('Apply') || t.name.includes('Submit') || t.name.includes('Save')
  );
  const highIssues = failedTests.filter(t => 
    t.name.includes('View') || t.name.includes('Navigate') || t.name.includes('Post')
  );
  const mediumIssues = failedTests.filter(t => 
    t.name.includes('Filter') || t.name.includes('Search') || t.name.includes('Bookmark')
  );
  const lowIssues = failedTests.filter(t => 
    t.name.includes('Cancel') || t.name.includes('Close') || t.name.includes('Clear')
  );

  // Generate recommendations
  const immediateRecommendations = generateImmediateRecommendations(failedTests);
  const shortTermRecommendations = generateShortTermRecommendations(testResults);
  const longTermRecommendations = generateLongTermRecommendations(testResults);

  // Calculate test coverage
  const testCoverage = calculateTestCoverage(testResults);

  return {
    summary: {
      totalTests: testResults.length,
      passedTests: passedTests.length,
      failedTests: failedTests.length,
      successRate: overallSuccessRate,
      studentPortalTests: studentPortalTests.length,
      employerPortalTests: employerPortalTests.length,
      pageLevelTests: pageLevelTests.length,
      modalTests: modalTests.length,
    },
    breakdown: {
      studentPortal: {
        passed: studentPortalTests.filter(t => t.status === 'pass'),
        failed: studentPortalTests.filter(t => t.status === 'fail'),
        successRate: studentSuccessRate,
      },
      employerPortal: {
        passed: employerPortalTests.filter(t => t.status === 'pass'),
        failed: employerPortalTests.filter(t => t.status === 'fail'),
        successRate: employerSuccessRate,
      },
      pageLevel: {
        passed: pageLevelTests.filter(t => t.status === 'pass'),
        failed: pageLevelTests.filter(t => t.status === 'fail'),
        successRate: pageSuccessRate,
      },
      modalLevel: {
        passed: modalTests.filter(t => t.status === 'pass'),
        failed: modalTests.filter(t => t.status === 'fail'),
        successRate: modalSuccessRate,
      },
    },
    issues: {
      critical: criticalIssues,
      high: highIssues,
      medium: mediumIssues,
      low: lowIssues,
    },
    recommendations: {
      immediate: immediateRecommendations,
      shortTerm: shortTermRecommendations,
      longTerm: longTermRecommendations,
    },
    testCoverage: testCoverage,
  };
};

const generateImmediateRecommendations = (failedTests: ButtonTestResult[]): string[] => {
  const recommendations: string[] = [];

  // Check for critical functionality failures
  const applySubmitFailures = failedTests.filter(t => 
    t.name.includes('Apply') || t.name.includes('Submit')
  );
  if (applySubmitFailures.length > 0) {
    recommendations.push(
      `🚨 CRITICAL: ${applySubmitFailures.length} Apply/Submit buttons are failing. These are core user actions that must be fixed immediately.`
    );
  }

  const navigationFailures = failedTests.filter(t => 
    t.name.includes('View') || t.name.includes('Navigate')
  );
  if (navigationFailures.length > 0) {
    recommendations.push(
      `⚠️ HIGH: ${navigationFailures.length} navigation buttons are failing. Users cannot access key pages and features.`
    );
  }

  const modalFailures = failedTests.filter(t => t.type === 'modal');
  if (modalFailures.length > 0) {
    recommendations.push(
      `🔧 MEDIUM: ${modalFailures.length} modal buttons are failing. Check modal state management and event handling.`
    );
  }

  return recommendations;
};

const generateShortTermRecommendations = (testResults: ButtonTestResult[]): string[] => {
  const recommendations: string[] = [];

  // Analyze patterns in failures
  const studentFailures = testResults.filter(t => 
    t.status === 'fail' && (t.location.includes('Student') || t.location.includes('student'))
  );
  const employerFailures = testResults.filter(t => 
    t.status === 'fail' && (t.location.includes('Employer') || t.location.includes('employer'))
  );

  if (studentFailures.length > employerFailures.length) {
    recommendations.push(
      `📊 Student portal has ${studentFailures.length} button failures vs ${employerFailures.length} in employer portal. Focus testing efforts on student portal.`
    );
  }

  // Check for specific button type patterns
  const bookmarkFailures = testResults.filter(t => 
    t.status === 'fail' && t.name.includes('Bookmark')
  );
  if (bookmarkFailures.length > 0) {
    recommendations.push(
      `🔖 Bookmark functionality has ${bookmarkFailures.length} failures. Review bookmark state management and API integration.`
    );
  }

  const filterFailures = testResults.filter(t => 
    t.status === 'fail' && (t.name.includes('Filter') || t.name.includes('Search'))
  );
  if (filterFailures.length > 0) {
    recommendations.push(
      `🔍 Search/Filter functionality has ${filterFailures.length} failures. Review search logic and filter state management.`
    );
  }

  return recommendations;
};

const generateLongTermRecommendations = (testResults: ButtonTestResult[]): string[] => {
  const recommendations: string[] = [];

  // Overall system health
  const successRate = testResults.length > 0 ? 
    (testResults.filter(t => t.status === 'pass').length / testResults.length) * 100 : 0;

  if (successRate < 90) {
    recommendations.push(
      `📈 Overall button success rate is ${successRate.toFixed(1)}%. Target 95%+ for production readiness.`
    );
  }

  // Test coverage recommendations
  const totalExpectedButtons = 50; // Estimated total buttons in the system
  const testCoverage = (testResults.length / totalExpectedButtons) * 100;

  if (testCoverage < 80) {
    recommendations.push(
      `📋 Test coverage is ${testCoverage.toFixed(1)}%. Aim for 90%+ coverage of all interactive elements.`
    );
  }

  // Performance recommendations
  recommendations.push(
    `⚡ Implement button click analytics to track user interaction patterns and identify optimization opportunities.`
  );

  recommendations.push(
    `🔄 Establish automated button testing pipeline to catch regressions before deployment.`
  );

  recommendations.push(
    `🎯 Create button accessibility audit to ensure all buttons meet WCAG guidelines.`
  );

  return recommendations;
};

const calculateTestCoverage = (testResults: ButtonTestResult[]) => {
  const studentPortalTests = testResults.filter(t => 
    t.location.includes('Student') || t.location.includes('student')
  );
  const employerPortalTests = testResults.filter(t => 
    t.location.includes('Employer') || t.location.includes('employer')
  );

  return {
    studentPortal: {
      dashboard: studentPortalTests.filter(t => t.location.includes('Dashboard')).length,
      jobActions: studentPortalTests.filter(t => t.location.includes('Job')).length,
      modals: studentPortalTests.filter(t => t.type === 'modal').length,
      total: studentPortalTests.length,
    },
    employerPortal: {
      dashboard: employerPortalTests.filter(t => t.location.includes('Dashboard')).length,
      candidateActions: employerPortalTests.filter(t => t.location.includes('Candidate')).length,
      modals: employerPortalTests.filter(t => t.type === 'modal').length,
      total: employerPortalTests.length,
    },
  };
};

// Test Report Display Component
interface TestReportDisplayProps {
  report: TestReport;
}

export const TestReportDisplay: React.FC<TestReportDisplayProps> = ({ report }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Button Functionality Test Report
      </h2>

      {/* Executive Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Executive Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-800">
              {report.summary.totalTests}
            </div>
            <div className="text-sm text-blue-600">Total Tests</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-800">
              {report.summary.passedTests}
            </div>
            <div className="text-sm text-green-600">Passed</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-800">
              {report.summary.failedTests}
            </div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-800">
              {report.summary.successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-purple-600">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Portal Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Portal Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Student Portal
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tests:</span>
                <span>{report.summary.studentPortalTests}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span>{report.breakdown.studentPortal.successRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className="text-red-600">{report.breakdown.studentPortal.failed.length}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">
              Employer Portal
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tests:</span>
                <span>{report.summary.employerPortalTests}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span>{report.breakdown.employerPortal.successRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className="text-red-600">{report.breakdown.employerPortal.failed.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issues by Severity */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Issues by Severity
        </h3>
        <div className="space-y-4">
          {report.issues.critical.length > 0 && (
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
              <h4 className="font-semibold text-red-900 mb-2">
                🚨 Critical Issues ({report.issues.critical.length})
              </h4>
              <div className="space-y-1">
                {report.issues.critical.map((issue, index) => (
                  <div key={index} className="text-sm text-red-800">
                    • {issue.name} - {issue.location}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {report.issues.high.length > 0 && (
            <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">
                ⚠️ High Priority Issues ({report.issues.high.length})
              </h4>
              <div className="space-y-1">
                {report.issues.high.map((issue, index) => (
                  <div key={index} className="text-sm text-orange-800">
                    • {issue.name} - {issue.location}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {report.issues.medium.length > 0 && (
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900 mb-2">
                🔧 Medium Priority Issues ({report.issues.medium.length})
              </h4>
              <div className="space-y-1">
                {report.issues.medium.map((issue, index) => (
                  <div key={index} className="text-sm text-yellow-800">
                    • {issue.name} - {issue.location}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {report.issues.low.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">
                ℹ️ Low Priority Issues ({report.issues.low.length})
              </h4>
              <div className="space-y-1">
                {report.issues.low.map((issue, index) => (
                  <div key={index} className="text-sm text-blue-800">
                    • {issue.name} - {issue.location}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recommendations
        </h3>
        
        {report.recommendations.immediate.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-red-900 mb-2">
              🚨 Immediate Actions Required
            </h4>
            <ul className="space-y-2">
              {report.recommendations.immediate.map((rec, index) => (
                <li key={index} className="text-sm text-red-800">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {report.recommendations.shortTerm.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-orange-900 mb-2">
              📅 Short Term (1-2 weeks)
            </h4>
            <ul className="space-y-2">
              {report.recommendations.shortTerm.map((rec, index) => (
                <li key={index} className="text-sm text-orange-800">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {report.recommendations.longTerm.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">
              🎯 Long Term (1-3 months)
            </h4>
            <ul className="space-y-2">
              {report.recommendations.longTerm.map((rec, index) => (
                <li key={index} className="text-sm text-blue-800">
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Test Coverage */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Test Coverage Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Student Portal Coverage
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Dashboard:</span>
                <span>{report.testCoverage.studentPortal.dashboard}</span>
              </div>
              <div className="flex justify-between">
                <span>Job Actions:</span>
                <span>{report.testCoverage.studentPortal.jobActions}</span>
              </div>
              <div className="flex justify-between">
                <span>Modals:</span>
                <span>{report.testCoverage.studentPortal.modals}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{report.testCoverage.studentPortal.total}</span>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">
              Employer Portal Coverage
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Dashboard:</span>
                <span>{report.testCoverage.employerPortal.dashboard}</span>
              </div>
              <div className="flex justify-between">
                <span>Candidate Actions:</span>
                <span>{report.testCoverage.employerPortal.candidateActions}</span>
              </div>
              <div className="flex justify-between">
                <span>Modals:</span>
                <span>{report.testCoverage.employerPortal.modals}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{report.testCoverage.employerPortal.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

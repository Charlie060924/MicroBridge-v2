"use client";

import React, { useState } from 'react';

// Button Test Results Interface
export interface ButtonTestResult {
  id: string;
  name: string;
  location: string;
  type: 'page' | 'modal';
  status: 'pass' | 'fail' | 'untested';
  description: string;
  expectedAction: string;
  actualResult?: string;
  error?: string;
  timestamp: string;
}

// Test Suite Interface
export interface TestSuite {
  name: string;
  description: string;
  tests: ButtonTestResult[];
}

// Button Test Context (unused for now)
// interface ButtonTestContextType {
//   testResults: ButtonTestResult[];
//   addTestResult: (result: ButtonTestResult) => void;
//   updateTestResult: (id: string, updates: Partial<ButtonTestResult>) => void;
//   clearResults: () => void;
//   exportResults: () => void;
// }

// Button Test Hook
export const useButtonTesting = () => {
  const [testResults, setTestResults] = useState<ButtonTestResult[]>([]);

  const addTestResult = (result: ButtonTestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const updateTestResult = (id: string, updates: Partial<ButtonTestResult>) => {
    setTestResults(prev => 
      prev.map(result => 
        result.id === id ? { ...result, ...updates } : result
      )
    );
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(testResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `button-test-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    testResults,
    addTestResult,
    updateTestResult,
    clearResults,
    exportResults
  };
};

// Button Test Component
interface ButtonTestProps {
  id: string;
  name: string;
  location: string;
  type: 'page' | 'modal';
  expectedAction: string;
  onTest: () => Promise<boolean>;
  children: React.ReactNode;
}

export const ButtonTest: React.FC<ButtonTestProps> = ({
  id,
  name,
  location,
  type,
  expectedAction,
  onTest,
  children
}) => {
  const { addTestResult, updateTestResult } = useButtonTesting();
  const [isTesting, setIsTesting] = useState(false);

  const handleTest = async () => {
    setIsTesting(true);
    const timestamp = new Date().toISOString();
    
    // Add initial test result
    const testResult: ButtonTestResult = {
      id,
      name,
      location,
      type,
      status: 'untested',
      description: `Testing ${name} button`,
      expectedAction,
      timestamp
    };
    
    addTestResult(testResult);

    try {
      const success = await onTest();
      
      updateTestResult(id, {
        status: success ? 'pass' : 'fail',
        actualResult: success ? 'Button functioned correctly' : 'Button failed to function',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      updateTestResult(id, {
        status: 'fail',
        actualResult: 'Button test threw an error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <button
          onClick={handleTest}
          disabled={isTesting}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isTesting ? 'Testing...' : 'Test Button'}
        </button>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Expected Action:</strong> {expectedAction}</p>
      </div>
      <div className="border-t pt-2">
        {children}
      </div>
    </div>
  );
};

// Test Results Display Component
export const TestResultsDisplay: React.FC = () => {
  const { testResults, clearResults, exportResults } = useButtonTesting();

  const passedTests = testResults.filter(t => t.status === 'pass');
  const failedTests = testResults.filter(t => t.status === 'fail');
  const untestedTests = testResults.filter(t => t.status === 'untested');

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Button Test Results</h2>
        <div className="flex space-x-2">
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Clear Results
          </button>
          <button
            onClick={exportResults}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Export Results
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-800">{passedTests.length}</div>
          <div className="text-sm text-green-600">Passed</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-800">{failedTests.length}</div>
          <div className="text-sm text-red-600">Failed</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-800">{untestedTests.length}</div>
          <div className="text-sm text-yellow-600">Untested</div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-800">{testResults.length}</div>
          <div className="text-sm text-blue-600">Total</div>
        </div>
      </div>

      {/* Test Results List */}
      <div className="space-y-4">
        {testResults.map((result) => (
          <div
            key={result.id}
            className={`border rounded-lg p-4 ${
              result.status === 'pass' ? 'border-green-200 bg-green-50' :
              result.status === 'fail' ? 'border-red-200 bg-red-50' :
              'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{result.name}</h3>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  result.status === 'pass' ? 'bg-green-200 text-green-800' :
                  result.status === 'fail' ? 'bg-red-200 text-red-800' :
                  'bg-yellow-200 text-yellow-800'
                }`}
              >
                {result.status.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Location:</strong> {result.location}</p>
              <p><strong>Type:</strong> {result.type}</p>
              <p><strong>Expected Action:</strong> {result.expectedAction}</p>
              {result.actualResult && (
                <p><strong>Actual Result:</strong> {result.actualResult}</p>
              )}
              {result.error && (
                <p><strong>Error:</strong> <span className="text-red-600">{result.error}</span></p>
              )}
              <p><strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Predefined Test Suites
export const STUDENT_PORTAL_TESTS: ButtonTestResult[] = [
  // Dashboard Tests
  {
    id: 'student-dashboard-search',
    name: 'Search Bar',
    location: 'Student Dashboard',
    type: 'page',
    status: 'untested',
    description: 'Test search functionality on student dashboard',
    expectedAction: 'Search for jobs based on query',
    timestamp: ''
  },
  {
    id: 'student-dashboard-filter',
    name: 'Filter Button',
    location: 'Student Dashboard',
    type: 'page',
    status: 'untested',
    description: 'Test filter functionality',
    expectedAction: 'Filter jobs based on criteria',
    timestamp: ''
  },
  {
    id: 'student-dashboard-clear-filters',
    name: 'Clear Filters',
    location: 'Student Dashboard',
    type: 'page',
    status: 'untested',
    description: 'Test clear filters functionality',
    expectedAction: 'Clear all applied filters',
    timestamp: ''
  },
  {
    id: 'student-job-bookmark',
    name: 'Bookmark Job',
    location: 'Job Cards',
    type: 'page',
    status: 'untested',
    description: 'Test bookmarking a job',
    expectedAction: 'Add/remove job from bookmarks',
    timestamp: ''
  },
  {
    id: 'student-job-apply',
    name: 'Apply Now',
    location: 'Job Cards',
    type: 'page',
    status: 'untested',
    description: 'Test job application',
    expectedAction: 'Open job application modal',
    timestamp: ''
  },
  {
    id: 'student-job-view-details',
    name: 'View Details',
    location: 'Job Cards',
    type: 'page',
    status: 'untested',
    description: 'Test viewing job details',
    expectedAction: 'Navigate to job details page',
    timestamp: ''
  },
  // Modal Tests
  {
    id: 'student-apply-modal-confirm',
    name: 'Apply Confirmation',
    location: 'Apply Job Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test apply confirmation in modal',
    expectedAction: 'Submit job application',
    timestamp: ''
  },
  {
    id: 'student-apply-modal-cancel',
    name: 'Apply Cancel',
    location: 'Apply Job Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test canceling application',
    expectedAction: 'Close modal without applying',
    timestamp: ''
  },
  {
    id: 'student-apply-modal-close',
    name: 'Apply Close',
    location: 'Apply Job Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test closing modal with X button',
    expectedAction: 'Close modal',
    timestamp: ''
  }
];

export const EMPLOYER_PORTAL_TESTS: ButtonTestResult[] = [
  // Dashboard Tests
  {
    id: 'employer-dashboard-post-job',
    name: 'Post a Job',
    location: 'Employer Dashboard',
    type: 'page',
    status: 'untested',
    description: 'Test posting a new job',
    expectedAction: 'Navigate to job posting form',
    timestamp: ''
  },
  {
    id: 'employer-dashboard-manage-jobs',
    name: 'Manage Jobs',
    location: 'Employer Dashboard',
    type: 'page',
    status: 'untested',
    description: 'Test managing existing jobs',
    expectedAction: 'Navigate to job management page',
    timestamp: ''
  },
  {
    id: 'employer-dashboard-view-applications',
    name: 'View Applications',
    location: 'Employer Dashboard',
    type: 'page',
    status: 'untested',
    description: 'Test viewing job applications',
    expectedAction: 'Navigate to applications page',
    timestamp: ''
  },
  {
    id: 'employer-dashboard-view-candidates',
    name: 'View Candidates',
    location: 'Employer Dashboard',
    type: 'page',
    status: 'untested',
    description: 'Test viewing candidates',
    expectedAction: 'Navigate to candidates page',
    timestamp: ''
  },
  // Candidate Tests
  {
    id: 'employer-candidate-star',
    name: 'Star Candidate',
    location: 'Candidate Cards',
    type: 'page',
    status: 'untested',
    description: 'Test starring a candidate',
    expectedAction: 'Add/remove candidate from starred list',
    timestamp: ''
  },
  {
    id: 'employer-candidate-view',
    name: 'View Candidate',
    location: 'Candidate Cards',
    type: 'page',
    status: 'untested',
    description: 'Test viewing candidate details',
    expectedAction: 'Navigate to candidate profile',
    timestamp: ''
  },
  {
    id: 'employer-candidate-save',
    name: 'Save Candidate',
    location: 'Candidate Cards',
    type: 'page',
    status: 'untested',
    description: 'Test saving a candidate',
    expectedAction: 'Add candidate to saved list',
    timestamp: ''
  },
  {
    id: 'employer-candidate-shortlist',
    name: 'Shortlist Candidate',
    location: 'Candidate Cards',
    type: 'page',
    status: 'untested',
    description: 'Test shortlisting a candidate',
    expectedAction: 'Add candidate to shortlist',
    timestamp: ''
  },
  // Modal Tests
  {
    id: 'employer-interview-schedule',
    name: 'Schedule Interview',
    location: 'Interview Scheduler Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test scheduling an interview',
    expectedAction: 'Schedule interview with candidate',
    timestamp: ''
  },
  {
    id: 'employer-interview-cancel',
    name: 'Cancel Interview',
    location: 'Interview Scheduler Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test canceling interview scheduling',
    expectedAction: 'Close modal without scheduling',
    timestamp: ''
  },
  {
    id: 'employer-job-edit-save',
    name: 'Save Job Edit',
    location: 'Edit Job Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test saving job edits',
    expectedAction: 'Save job changes',
    timestamp: ''
  },
  {
    id: 'employer-job-edit-cancel',
    name: 'Cancel Job Edit',
    location: 'Edit Job Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test canceling job edits',
    expectedAction: 'Close modal without saving',
    timestamp: ''
  },
  {
    id: 'employer-job-close-confirm',
    name: 'Confirm Close Job',
    location: 'Close Job Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test confirming job closure',
    expectedAction: 'Close job posting',
    timestamp: ''
  },
  {
    id: 'employer-job-close-cancel',
    name: 'Cancel Close Job',
    location: 'Close Job Modal',
    type: 'modal',
    status: 'untested',
    description: 'Test canceling job closure',
    expectedAction: 'Keep job open',
    timestamp: ''
  }
];

// Utility function to run all tests
export const runAllButtonTests = async (): Promise<ButtonTestResult[]> => {
  const allTests = [...STUDENT_PORTAL_TESTS, ...EMPLOYER_PORTAL_TESTS];
  const results: ButtonTestResult[] = [];

  for (const test of allTests) {
    try {
      // Simulate test execution
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      results.push({
        ...test,
        status: success ? 'pass' : 'fail',
        actualResult: success ? 'Button functioned correctly' : 'Button failed to function',
        error: success ? undefined : 'Simulated test failure',
        timestamp: new Date().toISOString()
      });

      // Add delay to simulate real testing
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      results.push({
        ...test,
        status: 'fail',
        actualResult: 'Test threw an error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
};

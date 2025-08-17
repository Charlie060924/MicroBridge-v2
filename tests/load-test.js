import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 50 }, // Ramp up to 50 users
    { duration: '5m', target: 50 }, // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.05'], // Error rate must be below 5%
    errors: ['rate<0.1'], // Custom error rate must be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

// Test data
const testUsers = [
  { email: 'student1@test.com', password: 'password123', type: 'student' },
  { email: 'employer1@test.com', password: 'password123', type: 'employer' },
  { email: 'student2@test.com', password: 'password123', type: 'student' },
];

let authTokens = {};

export function setup() {
  console.log('Setting up test data...');
  
  // Register test users and get auth tokens
  testUsers.forEach((user, index) => {
    const registerRes = http.post(`${BASE_URL}/api/v1/auth/register`, {
      email: user.email,
      password: user.password,
      first_name: `Test${index}`,
      last_name: 'User',
      user_type: user.type,
    });
    
    if (registerRes.status === 201 || registerRes.status === 409) {
      // Login to get token
      const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, {
        email: user.email,
        password: user.password,
      });
      
      if (loginRes.status === 200) {
        const token = JSON.parse(loginRes.body).access_token;
        authTokens[user.email] = token;
      }
    }
  });
  
  return { authTokens };
}

export default function(data) {
  const userEmail = testUsers[Math.floor(Math.random() * testUsers.length)].email;
  const token = data.authTokens[userEmail];
  
  if (!token) {
    errorRate.add(1);
    return;
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  
  // Test scenarios with weighted distribution
  const scenario = Math.random();
  
  if (scenario < 0.3) {
    testJobSearch(headers);
  } else if (scenario < 0.5) {
    testMatchingEndpoint(headers);
  } else if (scenario < 0.7) {
    testUserProfile(headers);
  } else if (scenario < 0.9) {
    testJobOperations(headers);
  } else {
    testApplicationFlow(headers);
  }
  
  sleep(Math.random() * 2 + 1); // Random sleep between 1-3 seconds
}

function testJobSearch(headers) {
  const searchParams = [
    '?page=1&limit=10',
    '?page=1&limit=20&location=Toronto',
    '?page=1&limit=10&skills=["JavaScript","React"]',
    '?page=2&limit=10',
  ];
  
  const params = searchParams[Math.floor(Math.random() * searchParams.length)];
  const res = http.get(`${BASE_URL}/api/v1/jobs${params}`, { headers });
  
  const success = check(res, {
    'job search status is 200': (r) => r.status === 200,
    'job search response time < 1000ms': (r) => r.timings.duration < 1000,
    'job search has results': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && Array.isArray(body.data);
      } catch (e) {
        return false;
      }
    },
  });
  
  if (!success) {
    errorRate.add(1);
  }
}

function testMatchingEndpoint(headers) {
  const res = http.get(`${BASE_URL}/api/v1/matching/jobs`, { headers });
  
  const success = check(res, {
    'matching status is 200': (r) => r.status === 200,
    'matching response time < 2000ms': (r) => r.timings.duration < 2000,
    'matching has results': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data && Array.isArray(body.data);
      } catch (e) {
        return false;
      }
    },
  });
  
  if (!success) {
    errorRate.add(1);
  }
}

function testUserProfile(headers) {
  // Get profile
  const getRes = http.get(`${BASE_URL}/api/v1/users/profile`, { headers });
  
  let success = check(getRes, {
    'get profile status is 200': (r) => r.status === 200,
    'get profile response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  // Update profile
  if (success && Math.random() < 0.3) { // 30% chance to update
    const updateData = {
      bio: `Updated bio at ${Date.now()}`,
      skills: ['JavaScript', 'Go', 'Docker'],
      location: 'Toronto, ON',
    };
    
    const updateRes = http.put(`${BASE_URL}/api/v1/users/profile`, JSON.stringify(updateData), { headers });
    
    success = check(updateRes, {
      'update profile status is 200': (r) => r.status === 200,
      'update profile response time < 800ms': (r) => r.timings.duration < 800,
    });
  }
  
  if (!success) {
    errorRate.add(1);
  }
}

function testJobOperations(headers) {
  // Create a job (employers only)
  if (Math.random() < 0.2) { // 20% chance to create job
    const jobData = {
      title: `Test Job ${Date.now()}`,
      description: 'This is a test job for load testing',
      skills_required: ['JavaScript', 'React', 'Node.js'],
      experience_level: 'mid',
      location: 'Toronto, ON',
      is_remote: Math.random() < 0.5,
      salary_min: 50000,
      salary_max: 80000,
    };
    
    const createRes = http.post(`${BASE_URL}/api/v1/jobs`, JSON.stringify(jobData), { headers });
    
    const success = check(createRes, {
      'create job status is 201 or 403': (r) => r.status === 201 || r.status === 403,
      'create job response time < 1000ms': (r) => r.timings.duration < 1000,
    });
    
    if (!success) {
      errorRate.add(1);
    }
  }
}

function testApplicationFlow(headers) {
  // Get available jobs first
  const jobsRes = http.get(`${BASE_URL}/api/v1/jobs?limit=5`, { headers });
  
  if (jobsRes.status === 200) {
    try {
      const jobs = JSON.parse(jobsRes.body).data;
      if (jobs && jobs.length > 0) {
        const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
        
        // Apply to job
        const applicationData = {
          cover_letter: 'This is a test application for load testing purposes.',
        };
        
        const applyRes = http.post(
          `${BASE_URL}/api/v1/jobs/${randomJob.id}/apply`,
          JSON.stringify(applicationData),
          { headers }
        );
        
        const success = check(applyRes, {
          'job application status is 201 or 409': (r) => r.status === 201 || r.status === 409,
          'job application response time < 1500ms': (r) => r.timings.duration < 1500,
        });
        
        if (!success) {
          errorRate.add(1);
        }
      }
    } catch (e) {
      errorRate.add(1);
    }
  }
}

export function teardown(data) {
  console.log('Cleaning up test data...');
  // Cleanup logic if needed
}

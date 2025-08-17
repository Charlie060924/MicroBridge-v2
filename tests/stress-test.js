import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '3m', target: 300 }, // Ramp up to 300 users
    { duration: '2m', target: 500 }, // Spike to 500 users
    { duration: '1m', target: 300 }, // Drop back down
    { duration: '3m', target: 300 }, // Stay at 300
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'], // 99% of requests must complete below 2s
    http_req_failed: ['rate<0.1'], // Error rate must be below 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080';

export default function() {
  // Focus on the most CPU-intensive endpoint (matching)
  const res = http.get(`${BASE_URL}/api/v1/matching/jobs?limit=50`);
  
  check(res, {
    'matching service survives stress': (r) => r.status < 500,
    'matching response time under stress < 3000ms': (r) => r.timings.duration < 3000,
  });
  
  sleep(0.5); // Shorter sleep for stress testing
}

import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 50 }, // ramp up to 50 users
    { duration: '20s', target: 100 }, // stay at 100 users
    { duration: '10s', target: 0 },  // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(99)<500'], // 99% of requests must complete below 500ms
  },
};

const BASE_URL = 'http://localhost:5000/api/v1';

export default function () {
  let res = http.get(`${BASE_URL}/products`);
  check(res, {
    'status is 200': (r) => r.status === 200,
    'has products': (r) => r.json().items.length > 0,
  });
  
  sleep(1);
}

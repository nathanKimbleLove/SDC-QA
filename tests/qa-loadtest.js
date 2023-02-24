import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 500,
      maxVUs: 1000,
    },
  },
};

/*
export const options = {
  vus: 1000,
  duration: '30s'
}
*/

export default function () {
  let rand = Math.ceil(Math.random() * 3517500);
  http.get(`http://localhost:3000/qa/questions/?product_id=${rand}`);
  sleep(1);
}
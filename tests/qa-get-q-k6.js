import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '10s'
}

export default function () {
  let rand = Math.ceil(Math.random() * 3517500);
  http.get(`http://localhost:3000/qa/questions/?product_id=${rand}`);
  sleep(1);
}
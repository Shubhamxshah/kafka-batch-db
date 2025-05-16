import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10000,
  duration: '60s',
  cloud: {
    projectID: 3768757,
    name: 'Test (15/05/2025-23:41:07)'
  }
};

export default function() {
  const url = 'http://localhost:3000/create-post';

  const payload = JSON.stringify({
    title: "hello shubham",
    content: "testing with k6"
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  http.post(url, payload, params);
  sleep(1);
}


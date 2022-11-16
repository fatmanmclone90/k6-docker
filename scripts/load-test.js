import http from 'k6/http';
import { sleep, check } from 'k6';
import { logContext } from './log-context.js'
import exec from 'k6/execution';
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

// init code here runs once per VU

export function setup() {
  console.log(`example of env varaible ${__ENV.HOSTNAME}`)
}

export const options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    'http_req_duration{tag_name:Orchestrator}': ['p(95)<200', 'p(99.9) < 500'], // 95% of requests should be below 200ms
    'http_req_duration{tag_name:Example}': ['p(95)<5000', 'p(99.9) < 5000'], // 95% of requests should be below 200ms
  },
  scenarios: {
    perVu: {
      executor: 'per-vu-iterations',
      startTime: '0s',
      gracefulStop: '10s',
      vus: 10,
      iterations: 10
    }
  }
};

export default function () {
  // logContext(exec)
  const url = 'http://host.docker.internal:5000/Wms/D6_BatchState/v1';
  const payload = JSON.stringify({
    hrd: {
      messageType: "D6_BatchState",
      messageVersion: "v1",
      Id: uuidv4()
    }
  });

  const orchestratorParams = {
    headers: {
      'Content-Type': 'application/json',
      'X-Authorization': '123'
    },
    tags: {
      name: 'Orchestrator'
    }
  };

  const exampleParams = {
    headers: {
      name: 'Example'
    }
  };

  const response = http.post(url, payload, orchestratorParams);
  http.get('https://test.k6.io', exampleParams);

  check(response, {
    'is status 200': (r) => r.status === 200,
  });
}
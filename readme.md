# K6 and Docker

## Executing

### Powershell

Simple:

```
cat load-test.js | docker run --rm -i grafana/k6 run --vus 10 --duration 10s -
```

With Output:
```
docker run -it --rm -v C:\Pluralsight\k6-docker\scripts:/scripts -v C:\Pluralsight\k6-docker\output:/jsonoutput grafana/k6 run -e HOSTNAME=foobar" --out json=/jsonoutput/my_test_result.json --vus 10 --duration 10s /scripts/load-test.js
```
## Docker Compose

1. Start Grafana and InfluxDb
```
docker-compose up -d influxdb grafana
```

1. Go to `http://localhost:3000`

1. Add a datasource for `http://influxdb:8086` and databse `k6`

1. Import a dashboard from Grafana 
```
https://grafana.com/grafana/dashboards/?search=k6
```

1. Execute a test
```
docker-compose run k6 run --vus 10 --duration 10s /scripts/load-test.js
```

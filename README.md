# aws-lambda-lighthouse-docker
Running Google Lighthouse on AWS Lambda using Docker

#### Build and run Docker
```
docker build -t lighthouse .
docker run --rm -p 9000:8080 lighthouse
```

### Test
```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{"payload":"hello world!"}'
```

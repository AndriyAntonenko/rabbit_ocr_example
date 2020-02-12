# OCR_worker_example

## Config example
``` config/default.json ```:
```
{
  "port": 8080,
  "rabitMQ": {
    "url": "amqp://localhost",
    "OCRqueue": "ocr"
  }
}
```

## Instruction for use

This project can be running from containers with docker-compose:
```
$> docker-compose build
$> docker-compose up
```
Or lacaly(need version of node > 11 and typescript):
```
$> npm install
$> npm run build
$> npm start
```
## Running test
For it we need install jest globaly
```
$> npm i -g jest
$> npm run test
```
For getting coverage table:
```
$> npm run test:coverage
```

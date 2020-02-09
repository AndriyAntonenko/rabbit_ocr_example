import path from 'path';
import { Worker } from 'worker_threads';

const worker = new Worker(path.resolve(__dirname, './worker.import.js'), {
  workerData: {
    value: 15,
    path: './workers/ocr_worker.ts'
  }
});

worker.on('message', (result) => {
  console.log(result);
});

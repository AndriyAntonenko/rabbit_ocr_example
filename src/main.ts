import path from 'path';
import { Worker } from 'worker_threads';
import { WSServer } from './ws.server';


const worker = new Worker(path.resolve(__dirname, './worker.import.js'), {
  workerData: {
    path: './workers/ocr.worker.ts'
  }
});

worker.on('message', (result) => {
  console.log(result);
});

new WSServer().connection();

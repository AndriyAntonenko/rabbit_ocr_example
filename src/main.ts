import 'reflect-metadata';
import path from 'path';
import { Worker } from 'worker_threads';
import { Container } from 'inversify';
import { bindings } from './inversify.config';
import { WSServer } from './ws.server';
import { TYPES} from './constants/types';

function runOCRWorker() {
  const worker = new Worker(path.resolve(__dirname, './worker.import.js'), {
    workerData: {
      path: './workers/ocr.worker.ts'
    }
  });

  worker.on('message', (result) => {
    console.log(result);
  });

  worker.on('error', (err) => {
    console.log('Worker error:', err);
    runOCRWorker();
  });
}

(async() => {
  const container: Container = new Container();
  await container.loadAsync(bindings);

  runOCRWorker();

  container.get<WSServer>(TYPES.WSServer).connection();
})();

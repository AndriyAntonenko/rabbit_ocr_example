import 'reflect-metadata';
import path from 'path';
import { Worker } from 'worker_threads';
import { Container } from 'inversify';
import { bindings } from './inversify.config';
import { WSServer } from './ws.server';
import { TYPES} from './constants/types';

(async() => {
  const container: Container = new Container();
  await container.loadAsync(bindings);

  const worker = new Worker(path.resolve(__dirname, './worker.import.js'), {
    workerData: {
      path: './workers/ocr.worker.ts'
    }
  });

  worker.on('message', (result) => {
    console.log(result);
  });

  container.get<WSServer>(TYPES.WSServer).connection();
})();

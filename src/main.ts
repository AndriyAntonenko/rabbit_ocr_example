import path from 'path';
import { Worker } from 'worker_threads';
import { OCRChannel } from './libs/channels/ocr.channel';

const ocrChannel: OCRChannel = new OCRChannel();

const worker = new Worker(path.resolve(__dirname, './worker.import.js'), {
  workerData: {
    path: './workers/ocr_worker.ts'
  }
});

worker.on('message', (result) => {
  console.log(result);
});

(async() => {
  await ocrChannel.push('https://previews.123rf.com/images/happyroman/happyroman1611/happyroman161100004/67968361-atm-transaction-printed-paper-receipt-bill-vector.jpg');
})();

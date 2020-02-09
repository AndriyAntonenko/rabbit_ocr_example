import { parentPort } from 'worker_threads';
import { createWorker } from 'tesseract.js';

const worker = createWorker();

(async() => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('https://previews.123rf.com/images/happyroman/happyroman1611/happyroman161100004/67968361-atm-transaction-printed-paper-receipt-bill-vector.jpg');
  parentPort.postMessage(text);
  await worker.terminate();
})();

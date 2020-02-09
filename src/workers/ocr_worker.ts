import { parentPort } from 'worker_threads';
import { createWorker } from 'tesseract.js';
import { OCRChannel } from '../libs/channels/ocr.channel';

const worker = createWorker();
const ocrChannel: OCRChannel = new OCRChannel();

async function ocrProducing(url: string): Promise<string | Error> {
  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(url);
    await worker.terminate();
    return text;
  } catch (error) {
    return error;
  }
}

(async() => {
  const message: string = await ocrChannel.getFromQueue();
  const text: any = await ocrProducing(message);
  parentPort.postMessage(text);
})();

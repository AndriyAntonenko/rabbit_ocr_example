import { parentPort } from 'worker_threads';
import { createWorker } from 'tesseract.js';
import { OCRChannel } from '../libs/channels/ocr.channel';
import { ConsumeMessage } from 'amqplib';

const ocrChannel: OCRChannel = new OCRChannel();

async function ocrProducing(url: string): Promise<string | Error> {
  try {
    const worker = createWorker({
      logger: m => console.log(m),
    });

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

function handler(msg: ConsumeMessage) {
  ocrProducing(msg.content.toString())
  .then(text => {
    parentPort.postMessage(text);
  });
}

async function receive() {
  await ocrChannel.getFromQueue(handler);
}

receive();

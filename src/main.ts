import path from 'path';
import { Worker } from 'worker_threads';
import { OCRChannel } from './libs/channels/ocr.channel';
import { Server } from 'ws';
import { FileUrl } from './interfaces/file_url.interface';

const ocrChannel: OCRChannel = new OCRChannel();

const worker = new Worker(path.resolve(__dirname, './worker.import.js'), {
  workerData: {
    path: './workers/ocr_worker.ts'
  }
});

worker.on('message', (result) => {
  console.log(result);
});

const wss: Server = new Server({
  port: 8080,
});

wss.on('connection', ws => {
  console.log('Connected...');
  ws.on('message', (message) => {
    try {
      const file: FileUrl = JSON.parse(message.toString());
      console.log('Got new message:', file);
      ocrChannel.push(file.fileUrl);
    } catch (error) {
      console.warn(error);
    }
  });
});

import { OCRChannel } from '../libs/channels/ocr.channel';
import { FileUrl } from '../interfaces/file_url.interface';
import { createWorker } from 'tesseract.js';
import { ConsumeMessage, Channel } from 'amqplib';

export class OCRService {
  private readonly ocrChannel: OCRChannel;

  constructor() {
    this.ocrChannel = new OCRChannel();
  }

  public pushFile(message: string) {
    try {
      const file: FileUrl = JSON.parse(message);
      console.log('Got new message:', file);
      this.ocrChannel.push(file.fileUrl);
    } catch (error) {
      console.warn(error);
    }
  }

  public async ocrProducing(url: string): Promise<string | Error> {
    try {
      const worker = createWorker();
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

  public async receive(handler: (msg: ConsumeMessage, ch: Channel) => void) {
    await this.ocrChannel.getFromQueue((msg, ch) => handler(msg, ch));
  }
}

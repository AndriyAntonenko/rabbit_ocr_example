import { OCRChannel } from '../libs/channels/ocr.channel';
import { FileUrl } from '../interfaces/file_url.interface';
import { createWorker } from 'tesseract.js';

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
      const worker = createWorker({
        logger: m => console.log(m)
      });
      await worker.load();
      console.log('1');
      await worker.loadLanguage('eng');
      console.log('2');
      await worker.initialize('eng');
      console.log('3');
      const { data: { text } } = await worker.recognize(url);
      await worker.terminate();
      return text;
    } catch (error) {
      return error;
    }
  }
}

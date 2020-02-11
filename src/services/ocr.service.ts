import { inject, injectable } from 'inversify';
import { OCRChannel } from '../libs/channels/ocr.channel';
import { FileUrl } from '../interfaces/file_url.interface';
import { Worker } from 'tesseract.js';
import { ConsumeMessage, Channel } from 'amqplib';
import { TYPES } from '../constants/types';

@injectable()
export class OCRService {
  private readonly ocrChannel: OCRChannel;
  private readonly newWorker: () => Worker;

  constructor(
    @inject(TYPES.OCRChannel) _ocrChannel: OCRChannel,
    @inject(TYPES.TesseractWorker) _tesseractWorker: () => Worker,
  ) {
    this.ocrChannel = _ocrChannel;
    this.newWorker = _tesseractWorker;
  }

  public pushFile(message: string) {
    try {
      const file: FileUrl = JSON.parse(message);

      console.log('Got new message:', file);
      if (!file.fileUrl) { throw new Error('Wrong request format...'); }
      this.ocrChannel.push(file.fileUrl);
    } catch (error) {
      console.warn(error);
    }
  }

  public async ocrProducing(url: string): Promise<string | Error> {
    try {
      const tesseractWorker: Worker = this.newWorker();
      await tesseractWorker.load();
      await tesseractWorker.loadLanguage('eng');
      await tesseractWorker.initialize('eng');
      const { data: { text } } = await tesseractWorker.recognize(url);
      await tesseractWorker.terminate();
      return text;
    } catch (error) {
      return error;
    }
  }

  public async receive(handler: (msg: ConsumeMessage, ch: Channel) => void) {
    await this.ocrChannel.getFromQueue((msg, ch) => handler(msg, ch));
  }
}

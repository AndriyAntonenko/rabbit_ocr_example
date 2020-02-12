import { inject, injectable } from 'inversify';
import { OCRChannel } from '../libs/channels/ocr.channel';
import { FileUrl } from '../interfaces/file_url.interface';
import { Worker } from 'tesseract.js';
import { ConsumeMessage, Channel } from 'amqplib';
import { TYPES } from '../constants/types';
import { ImageUrlValidator } from '../validators/image_url.validator';

@injectable()
export class OCRService {
  private readonly ocrChannel: OCRChannel;
  private readonly newWorker: () => Worker;
  private readonly urlValidator: ImageUrlValidator;

  constructor(
    @inject(TYPES.OCRChannel) _ocrChannel: OCRChannel,
    @inject(TYPES.TesseractWorker) _tesseractWorker: () => Worker,
    @inject(TYPES.ImageUrlValidator) _urlValidator: ImageUrlValidator,
  ) {
    this.ocrChannel = _ocrChannel;
    this.newWorker = _tesseractWorker;
    this.urlValidator = _urlValidator;
  }

  public pushFile(message: string) {
    try {
      const file: FileUrl = JSON.parse(message);

      console.log('Got new message:', file);
      if (!file.fileUrl) { return new Error('Wrong request format...'); }
      this.ocrChannel.push(file.fileUrl);
    } catch (error) {
      return error;
    }
  }

  public async ocrProducing(url: string): Promise<string | Error> {
    try {
      await this.urlValidator.validate(url);
      const tesseractWorker: Worker = this.newWorker();
      await tesseractWorker.load();
      await tesseractWorker.loadLanguage('eng');
      await tesseractWorker.initialize('eng');
      const { data: { text } } = await tesseractWorker.recognize(url);
      await tesseractWorker.terminate();
      return text;
    } catch (error) {
      console.log(error);
      return new Error('Something wrong...');
    }
  }

  public async receive(handler: (msg: ConsumeMessage, ch: Channel) => void) {
    await this.ocrChannel.getFromQueue((msg, ch) => handler(msg, ch));
  }
}

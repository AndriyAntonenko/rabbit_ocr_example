import { parentPort } from 'worker_threads';
import { ConsumeMessage, Channel } from 'amqplib';
import { OCRService } from '../services/ocr.service';

class OCRWorker {
  private readonly ocrService: OCRService = new OCRService();

  public handler(msg: ConsumeMessage, ch: Channel) {
    console.log('====> NEW IMAGE!!!');

    this.ocrService.ocrProducing(msg.content.toString())
      .then(text => {
        parentPort.postMessage(text);
        ch.ack(msg);
      });
  }

  public async receive() {
    await this.ocrService.receive((msg, ch) => this.handler(msg, ch));
  }
}

new OCRWorker().receive();

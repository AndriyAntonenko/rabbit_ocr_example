import { parentPort } from 'worker_threads';
import { OCRChannel } from '../libs/channels/ocr.channel';
import { ConsumeMessage, Channel } from 'amqplib';
import { OCRService } from '../services/ocr.service';

class OCRWorker {
  private readonly ocrChannel: OCRChannel = new OCRChannel();
  private readonly ocrService: OCRService = new OCRService();

  public handler(msg: ConsumeMessage, ch: Channel) {
    console.log('====> NEW IMAGE!!!');
    console.log(this.ocrService);

    this.ocrService.ocrProducing(msg.content.toString())
      .then(text => {
        parentPort.postMessage(text);
        ch.ack(msg);
      });
  }

  public async receive() {
    await this.ocrChannel.getFromQueue((msg, ch) => this.handler(msg, ch));
  }
}

new OCRWorker().receive();

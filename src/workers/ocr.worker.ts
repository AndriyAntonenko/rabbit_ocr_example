import 'reflect-metadata';
import { bindings } from '../inversify.config';
import { Container } from 'inversify';
import { parentPort } from 'worker_threads';
import { ConsumeMessage, Channel } from 'amqplib';
import { OCRService } from '../services/ocr.service';
import { TYPES } from '../constants/types';

class OCRWorker {
  private readonly ocrService: OCRService;

  constructor(_container: Container) {
    this.ocrService = _container.get<OCRService>(TYPES.OCRService);
  }

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

(async() => {
  const container: Container = new Container();
  await container.loadAsync(bindings);
  new OCRWorker(container).receive();
})();

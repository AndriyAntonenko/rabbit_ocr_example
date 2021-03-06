import config from 'config';
import { Connection } from 'amqplib';
import { createWorker, Worker } from 'tesseract.js';
import { AsyncContainerModule, interfaces } from 'inversify';
import axios, { AxiosStatic } from 'axios';
import { TYPES } from './constants/types';

import { Validator } from './interfaces/validator.interface';
import { ImageUrlValidator } from './validators/image_url.validator';
import { OCRChannel } from './libs/channels/ocr.channel';
import { OCRService } from './services/ocr.service';
import { WSServer } from './ws.server';
import { Server } from 'ws';
import { connection } from './libs/rabbitmq';

export const bindings = new AsyncContainerModule(async(bind: interfaces.Bind) => {
  const conn: Connection = await connection();
  bind<Connection>(TYPES.RabbitMQ).toDynamicValue(() => {
    return conn;
  });

  bind<OCRChannel>(TYPES.OCRChannel).to(OCRChannel);
  bind<OCRService>(TYPES.OCRService).to(OCRService);
  bind<WSServer>(TYPES.WSServer).to(WSServer);
  bind<Server>(TYPES.WebSocketServer).toDynamicValue(() => {
    return new Server({ port: config.get('port') || +process.env.PORT });
  });

  bind<interfaces.Factory<Worker>>(TYPES.TesseractWorker).toFactory<Worker>((context: interfaces.Context) => {
    return () => createWorker();
  });
  bind<Validator>(TYPES.ImageUrlValidator).to(ImageUrlValidator);
  bind<AxiosStatic>(TYPES.Axios).toDynamicValue(() => axios);
  /**
   * Constants
   */
  bind<string>(TYPES.OCRQueue).toConstantValue(config.get('rabitMQ.OCRqueue'));
});

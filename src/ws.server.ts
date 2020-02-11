import { inject, injectable } from 'inversify';
import { Server } from 'ws';
import { OCRService } from './services/ocr.service';
import { TYPES } from './constants/types';

@injectable()
export class WSServer {
  private readonly wss: Server;
  private readonly ocrService: OCRService;

  constructor(
    @inject(TYPES.WebSocketServer) _wss: Server,
    @inject(TYPES.OCRService) _ocrService: OCRService,
  ) {
    this.wss = _wss;
    this.ocrService = _ocrService;
  }

  public connection() {
    this.wss.on('connection', ws => {
      console.log('***** Connected *****');
      ws.on('message', (msg) => { this.onMessage(msg.toString()); } );
    });
    this.wss.on('error', this.onError);
  }

  private onMessage(message: string) {
    this.ocrService.pushFile(message);
  }

  private onError(error: Error) {
    console.error(`WebSocket error: ${error}`);
    process.exit(1);
  }
}

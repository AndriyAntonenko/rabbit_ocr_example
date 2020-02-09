import { Server, MessageEvent } from 'ws';
import { OCRService } from './services/ocr.service';

export class WSServer {
  private readonly wss: Server;
  private readonly ocrService: OCRService;

  constructor() {
    this.wss = new Server({ port: 8080 });
    this.ocrService = new OCRService();
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
  }
}

import { inject, injectable } from 'inversify';
import { Channel, Connection, ConsumeMessage } from 'amqplib';
import { TYPES } from '../../constants/types';

@injectable()
export class OCRChannel {
  private readonly queueName: string;
  private readonly connection: Connection;

  constructor(
    @inject(TYPES.RabbitMQ) _connection: Connection,
    @inject(TYPES.OCRQueue) _queueName: string,
  ) {
    this.connection = _connection;
    this.queueName = _queueName;
  }

  public async push(msg: string): Promise<boolean> {
    const ch: Channel = await this.getChannel();
    return ch.assertQueue(this.queueName, { durable: true }).then((ok) =>
      ch.sendToQueue(this.queueName, Buffer.from(msg), { persistent: true })
    );
  }

  public async getFromQueue(callback: (msg: ConsumeMessage, ch: Channel) => void): Promise<any> {
    const ch: Channel = await this.getChannel();
    ch.prefetch(1);
    await ch.assertQueue(this.queueName, { durable: true });

    return await ch.consume(this.queueName, (msg) => {
      callback(msg, ch);
    }, { noAck: false });
  }

  private async getChannel(): Promise<Channel> {
    const ch: Channel = await this.connection.createChannel();
    return ch;
  }
}

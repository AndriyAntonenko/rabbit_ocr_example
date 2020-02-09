import config from 'config';
import { connection } from '../rebitmq';
import { Channel, Connection, ConsumeMessage } from 'amqplib';

export class OCRChannel {
  private readonly queueName: string;
  private readonly connection: () => Promise<Connection>;

  constructor() {
    this.connection = connection;
    this.queueName = config.get('rabitMQ.OCRqueue');
  }

  public async push(msg: string): Promise<boolean> {
    const ch: Channel = await this.getChannel();
    return ch.assertQueue(this.queueName).then((ok) =>
      ch.sendToQueue(this.queueName, Buffer.from(msg))
    );
  }

  public async getFromQueue(callback: (msg: ConsumeMessage) => void): Promise<any> {
    const ch: Channel = await this.getChannel();
    await ch.assertQueue(this.queueName);

    return await ch.consume(this.queueName, callback, { noAck: true });
  }

  private async getChannel(): Promise<Channel> {
    const conn: Connection = await this.connection();
    return await conn.createChannel();
  }
}

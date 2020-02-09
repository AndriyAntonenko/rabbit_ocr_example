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
    const conn: Connection = await this.connection();
    const ch: Channel = await conn.createChannel();
    return ch;
  }
}

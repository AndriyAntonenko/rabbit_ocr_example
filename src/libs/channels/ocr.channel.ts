import config from 'config';
import { connection } from '../rebitmq';
import { Channel, Connection } from 'amqplib';

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

  public async getFromQueue(): Promise<string> {
    const ch: Channel = await this.getChannel();
    await ch.assertQueue(this.queueName);

    return new Promise((resolve, reject) => {
      ch.consume(this.queueName, (msg) => {
        if (msg !== null) { return resolve(msg.content.toString()); }
      });
    });
  }

  private async getChannel(): Promise<Channel> {
    const conn: Connection = await this.connection();
    return await conn.createChannel();
  }
}

// // Consumer
// open.then(function(conn) {
//   return conn.createChannel();
// }).then(function(ch) {
//   return ch.assertQueue(q).then(function(ok) {
//     return ch.consume(q, function(msg) {
//       if (msg !== null) {
//         console.log(msg.content.toString());
//         ch.ack(msg);
//       }
//     });
//   });
// }).catch(console.warn);
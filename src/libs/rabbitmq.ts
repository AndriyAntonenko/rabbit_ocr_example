import amqplib from 'amqplib';
import config from 'config';

export const connection = async() => {
  const conn: amqplib.Connection = await amqplib.connect(process.env.RABBIT_URL || config.get('rabitMQ.url'));
  conn.on('error', (err) => {
    console.log('RabbitMQ error:', err);
  });
  return conn;
};

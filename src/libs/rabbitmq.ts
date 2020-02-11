import amqplib from 'amqplib';
import config from 'config';

export const connection = async() => await amqplib.connect(process.env.RABBIT_URL || config.get('rabitMQ.url'));

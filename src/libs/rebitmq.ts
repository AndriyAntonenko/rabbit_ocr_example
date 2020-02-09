import amqplib from 'amqplib';
import config from 'config';

export const connection = async() => await amqplib.connect(config.get('rabitMQ.url'));

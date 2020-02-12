/// <reference types="jest" />
import 'reflect-metadata';
import { Container } from 'inversify';
import { bindings } from '../inversify.config';
import { TYPES } from '../constants/types';
import { OCRChannel } from '../libs/channels/ocr.channel';

import { Replies, Channel, ConsumeMessage } from 'amqplib';
import { fixtures } from './fixtures';

const container: Container = new Container();
beforeAll(async() => {
  await container.loadAsync(bindings);
});

beforeEach(() => { jest.setTimeout(100000); });

describe('OCR CHANNEL', () => {
  test('getting from queue', async() => {
    const channel: OCRChannel = container.get<OCRChannel>(TYPES.OCRChannel);
    channel.push(fixtures.ocrProcesing.url);
    const consume: Replies.Consume = await channel.getFromQueue((msg: ConsumeMessage, ch: Channel) => {
      console.log(msg.content.toString());
    });

    expect(consume).toEqual({
      consumerTag: expect.any(String)
    });
  });
});

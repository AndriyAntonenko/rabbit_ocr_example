/// <reference types="jest" />
import 'reflect-metadata';
import { Container } from 'inversify';

import { bindings } from '../inversify.config';
import { TYPES } from '../constants/types';
import { ImageUrlValidator } from '../validators/image_url.validator';

import { fixtures } from './fixtures/index';

const container: Container = new Container();
beforeAll(async() => {
  await container.loadAsync(bindings);
});

beforeEach(() => { jest.setTimeout(100000); });

describe('WS Server', () => {
  test('Test correct data', async() => {
    const validator: ImageUrlValidator = container.get<ImageUrlValidator>(TYPES.ImageUrlValidator);
    const url: string = await validator.validate(fixtures.ocrProcesing.url);

    expect(url).toBe(fixtures.ocrProcesing.url);
  });
});

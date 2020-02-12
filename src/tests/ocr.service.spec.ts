/// <reference types="jest" />
import 'reflect-metadata';
import { Container } from 'inversify';
import { bindings } from '../inversify.config';
import { TYPES } from '../constants/types';
import { OCRService } from '../services/ocr.service';

import { fixtures } from './fixtures';

const container: Container = new Container();
beforeAll(async() => {
  await container.loadAsync(bindings);
});

beforeEach(() => { jest.setTimeout(100000); });

describe('OCR SERVICE', () => {

  test('Send correct data', async() => {
    const ocrService: OCRService = container.get<OCRService>(TYPES.OCRService);
    const analizedText: string | Error = await ocrService.ocrProducing(fixtures.ocrProcesing.url);

    expect(analizedText).toEqual(expect.any(String));
  });

  test('Send bad url', async() => {
    const ocrService: OCRService = container.get<OCRService>(TYPES.OCRService);
    const error: string | Error = await ocrService.ocrProducing(fixtures.ocrProcesing.badUrl);

    expect(error).toBeInstanceOf(Error);
  });

  test('File pushing', () => {
    const ocrService: OCRService = container.get<OCRService>(TYPES.OCRService);
    const res = ocrService.pushFile(fixtures.correctMessage);

    expect(res).toBeUndefined();
  });

  test('Push not a json', () => {
    const ocrService: OCRService = container.get<OCRService>(TYPES.OCRService);
    const res = ocrService.pushFile(fixtures.badMessage);

    expect(res).toBeInstanceOf(Error);
  });

  test('Push not a json', () => {
    const ocrService: OCRService = container.get<OCRService>(TYPES.OCRService);
    const res = ocrService.pushFile(fixtures.badJSONMessage);

    expect(res).toBeInstanceOf(Error);
    expect(res.message).toBe('Wrong request format...');
  });
});

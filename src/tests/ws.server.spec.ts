/// <reference types="jest" />
import 'reflect-metadata';
import { Container } from 'inversify';
import { Server } from 'ws';

import { bindings } from '../inversify.config';
import { TYPES } from '../constants/types';
import { WSServer } from '../ws.server';

import { fixtures } from './fixtures';

const container: Container = new Container();
beforeAll(async() => {
  await container.loadAsync(bindings);
});

beforeEach(() => { jest.setTimeout(100000); });

describe('WS Server', () => {
  test('Connection handler', () => {
    const wsServer: WSServer = container.get<WSServer>(TYPES.WSServer);
    const wss: Server = wsServer.connection();

    expect(wss).toBeInstanceOf(Server);
  });
});

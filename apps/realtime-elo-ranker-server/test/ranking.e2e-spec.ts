/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RankingController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/ranking (GET)', () => {
    return request(app.getHttpServer()).get('/api/ranking').expect(200);
  });

  it('/api/ranking/events (SSE)', async () => {
    // On teste juste que la connexion s'ouvre bien sans attendre indéfiniment
    const response = await request(app.getHttpServer())
      .get('/api/ranking/events')
      .set('Accept', 'text/event-stream')
      .timeout(500);
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/event-stream');
  });

  afterAll(async () => {
    await app.close();
    // Petit délai pour laisser les observables se fermer
    await new Promise((resolve) => setTimeout(resolve, 500));
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from '../app.module';

describe('Matches (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api'); // Important pour correspondre à ton main.ts
    await app.init();
  });

  it('/api/match (POST) -> doit retourner 400 si les joueurs n’existent pas', () => {
    return request(app.getHttpServer())
      .post('/api/match')
      .send({ winner: 'Inconnu1', loser: 'Inconnu2', draw: false })
      .expect(400);
  });

  afterAll(async () => {
    await app.close();
  });
});
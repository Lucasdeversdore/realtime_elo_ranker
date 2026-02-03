/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PlayersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/player (POST) - doit créer un joueur', () => {
    return request(app.getHttpServer())
      .post('/api/player')
      .send({ name: 'Zidane' })
      .expect(201)
      .expect((res) => {
        expect(res.body.name).toEqual('Zidane');
      });
  });

  it('/api/player (GET) - doit lister les joueurs', () => {
    return request(app.getHttpServer()).get('/api/player').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

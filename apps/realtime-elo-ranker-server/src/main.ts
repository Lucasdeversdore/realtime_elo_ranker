import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // Importe Swagger
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Realtime Elo Ranker')
    .setDescription('Documentation de l’API de classement Elo')
    .setVersion('1.0')
    .addTag('Ranking')
    .addTag('Matches')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3001);
  console.log('Serveur lancé sur : http://localhost:3001');
  console.log('Documentation Swagger : http://localhost:3001/api/docs');
}
bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Activer le CORS pour le client (localhost:3000)
  app.enableCors();
  app.setGlobalPrefix('api');

  //Utiliser le port 3001 pour ne pas entrer en conflit avec le client ou le mock
  await app.listen(3001);
}
bootstrap();

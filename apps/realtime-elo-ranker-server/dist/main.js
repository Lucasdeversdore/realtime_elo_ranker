"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Realtime Elo Ranker')
        .setDescription('Documentation de l’API de classement Elo')
        .setVersion('1.0')
        .addTag('Ranking')
        .addTag('Matches')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    await app.listen(3001);
    console.log('Serveur lancé sur : http://localhost:3001');
    console.log('Documentation Swagger : http://localhost:3001/api/docs');
}
bootstrap();
//# sourceMappingURL=main.js.map
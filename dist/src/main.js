"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const mqtt_service_1 = require("./mqtt/mqtt.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const port = config.get('APP_PORT') ?? 8000;
    const corsEnv = config.get('CORS_ALLOWED_ORIGINS') ??
        config.get('FRONTEND_URL') ??
        '*';
    const corsOrigins = corsEnv
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    const frontendUrl = corsOrigins.length === 1 ? corsOrigins[0] : corsOrigins;
    app.enableCors({
        origin: frontendUrl,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: '*',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidUnknownValues: false,
    }));
    const swaggerCfg = new swagger_1.DocumentBuilder()
        .setTitle('API Documentation')
        .setDescription('REST API for your system')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerCfg);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const mqttService = app.get(mqtt_service_1.MqttService);
    await app.listen(port);
    console.log(`🚀 Server running on port ${port}`);
    console.log(`🌐 CORS allowed origin(s): ${corsOrigins.join(', ') || '*'}`);
    console.log(`📘 Swagger: http://localhost:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map
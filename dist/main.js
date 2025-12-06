"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const mqtt_service_1 = require("./mqtt/mqtt.service");
async function bootstrap() {
    var _a, _b;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    const port = (_a = config.get('APP_PORT')) !== null && _a !== void 0 ? _a : 8000;
    const frontendUrl = (_b = config.get('FRONTEND_URL')) !== null && _b !== void 0 ? _b : '*';
    console.log('🟦 FRONTEND_URL loaded:', frontendUrl);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin || origin === frontendUrl) {
                return callback(null, true);
            }
            console.warn('❌ Blocked by CORS:', origin);
            return callback(new Error('Not allowed by CORS'), false);
        },
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
    // MQTT AUTO CONNECT from constructor → NO NEED to call here
    const mqttService = app.get(mqtt_service_1.MqttService);
    // mqttService.connect();  // DON'T CALL THIS
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Backend running on port ${port}`);
    console.log(`🌐 CORS Allowed Origin: ${frontendUrl}`);
    console.log(`📘 Swagger: http://localhost:${port}/docs`);
}
bootstrap();

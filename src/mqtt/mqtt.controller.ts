import { Controller, Post, Body, Logger } from '@nestjs/common';
import { MqttService } from './mqtt.service';

@Controller('mqtt')
export class MqttController {
  private readonly logger = new Logger(MqttController.name);

  constructor(private readonly mqttService: MqttService) {}

  @Post('publish')
  publishCommand(@Body() body: { serialNumber: string; command: any }) {
    const { serialNumber, command } = body;

    this.logger.log(
      `➡️ Publishing command to device ${serialNumber}: ${command}`,
    );

    this.mqttService.publishCommand(serialNumber, command);

    return {
      success: true,
      serialNumber,
      command,
      message: 'Command published to MQTT broker',
    };
  }
}
